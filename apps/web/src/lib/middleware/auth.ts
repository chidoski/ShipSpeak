import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Auth result types
export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role?: string;
    isExecutive: boolean;
  };
  error?: string;
}

// Extract token from Authorization header or cookies
function extractToken(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Try cookies as fallback
  const cookies = request.headers.get('cookie');
  if (cookies) {
    const match = cookies.match(/supabase-auth-token=([^;]+)/);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Main authentication middleware
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }

    if (!session?.user) {
      return {
        success: false,
        error: 'No valid session found'
      };
    }

    // Get user profile for role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_role, industry')
      .eq('id', session.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Profile fetch error:', profileError);
      return {
        success: false,
        error: 'Failed to fetch user profile'
      };
    }

    const isExecutive = profile?.current_role && 
      ['director', 'vp'].includes(profile.current_role.toLowerCase());

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email!,
        role: profile?.current_role,
        isExecutive: !!isExecutive
      }
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      error: 'Internal authentication error'
    };
  }
}

// Role-based authorization
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<AuthResult> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  const userRole = authResult.user!.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return {
      success: false,
      error: 'Insufficient permissions'
    };
  }

  return authResult;
}

// Executive-level authorization
export async function requireExecutive(request: NextRequest): Promise<AuthResult> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  if (!authResult.user!.isExecutive) {
    return {
      success: false,
      error: 'Executive access required'
    };
  }

  return authResult;
}

// Optional authentication (doesn't fail if not authenticated)
export async function optionalAuth(request: NextRequest): Promise<AuthResult> {
  try {
    return await requireAuth(request);
  } catch {
    return {
      success: false,
      error: 'No authentication provided'
    };
  }
}

// Validate user owns resource
export async function validateResourceOwnership(
  request: NextRequest,
  resourceType: 'meeting' | 'practice_session' | 'user_progress',
  resourceId: string
): Promise<AuthResult> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  try {
    const supabase = createClient();
    let query;

    switch (resourceType) {
      case 'meeting':
        query = supabase
          .from('meetings')
          .select('user_id')
          .eq('id', resourceId)
          .single();
        break;
      
      case 'practice_session':
        query = supabase
          .from('practice_sessions')
          .select('user_id')
          .eq('id', resourceId)
          .single();
        break;
      
      case 'user_progress':
        query = supabase
          .from('user_progress')
          .select('user_id')
          .eq('id', resourceId)
          .single();
        break;
      
      default:
        return {
          success: false,
          error: 'Invalid resource type'
        };
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        error: 'Resource not found'
      };
    }

    if (data.user_id !== authResult.user!.id) {
      return {
        success: false,
        error: 'Access denied'
      };
    }

    return authResult;

  } catch (error) {
    console.error('Resource ownership validation error:', error);
    return {
      success: false,
      error: 'Validation failed'
    };
  }
}

// Usage quota validation
export async function validateUsageQuota(
  request: NextRequest,
  quotaType: 'meetings' | 'practice_sessions' | 'ai_analysis'
): Promise<AuthResult & { quotaExceeded?: boolean; usage?: number; limit?: number }> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  try {
    const supabase = createClient();
    const userId = authResult.user!.id;
    const isExecutive = authResult.user!.isExecutive;

    // Get current month usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let usage = 0;
    let limit = 0;

    switch (quotaType) {
      case 'meetings': {
        const { count } = await supabase
          .from('meetings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', startOfMonth.toISOString());
        
        usage = count || 0;
        limit = isExecutive ? 100 : 20; // Executive users get higher limits
        break;
      }

      case 'practice_sessions': {
        const { count } = await supabase
          .from('practice_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', startOfMonth.toISOString());
        
        usage = count || 0;
        limit = isExecutive ? 200 : 50;
        break;
      }

      case 'ai_analysis': {
        // For AI analysis, we count meeting analyses + practice feedback
        const { count: meetingAnalyses } = await supabase
          .from('meeting_analyses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString())
          .in('meeting_id', 
            supabase
              .from('meetings')
              .select('id')
              .eq('user_id', userId)
          );

        usage = meetingAnalyses || 0;
        limit = isExecutive ? 1000 : 100;
        break;
      }
    }

    const quotaExceeded = usage >= limit;

    return {
      ...authResult,
      quotaExceeded,
      usage,
      limit
    };

  } catch (error) {
    console.error('Usage quota validation error:', error);
    return {
      ...authResult,
      quotaExceeded: false // Fail open on quota check errors
    };
  }
}

// API key validation (for future webhook endpoints)
export function validateApiKey(request: NextRequest, expectedKey: string): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === expectedKey;
}

// Helper to get user from request
export async function getUserFromRequest(request: NextRequest): Promise<{
  id: string;
  email: string;
  role?: string;
  isExecutive: boolean;
} | null> {
  const authResult = await requireAuth(request);
  return authResult.success ? authResult.user! : null;
}