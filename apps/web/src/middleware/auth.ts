/**
 * API route authentication middleware for Next.js
 * Validates JWT tokens and provides user context for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
  userId?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Middleware to authenticate API routes using Supabase JWT
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  success: boolean;
  user?: User;
  error?: ApiError;
}> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Not needed for request-only operations
          },
          remove(name: string, options: CookieOptions) {
            // Not needed for request-only operations
          },
        },
      }
    );

    // Get the session from the request
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return {
        success: false,
        error: {
          error: 'unauthorized',
          message: 'Authentication required',
          statusCode: 401
        }
      };
    }

    // Validate that the session is still valid
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: {
          error: 'unauthorized', 
          message: 'Invalid or expired token',
          statusCode: 401
        }
      };
    }

    return {
      success: true,
      user
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: {
        error: 'internal_error',
        message: 'Authentication service error',
        statusCode: 500
      }
    };
  }
}

/**
 * Middleware to require authentication for API routes
 * Usage in API route: const authResult = await requireAuthentication(request);
 */
export async function requireAuthentication(request: NextRequest): Promise<{
  success: boolean;
  user?: User;
  response?: NextResponse;
}> {
  const authResult = await authenticateRequest(request);

  if (!authResult.success) {
    const errorResponse = NextResponse.json(
      { 
        error: authResult.error?.error,
        message: authResult.error?.message 
      },
      { status: authResult.error?.statusCode || 401 }
    );

    return {
      success: false,
      response: errorResponse
    };
  }

  return {
    success: true,
    user: authResult.user
  };
}

/**
 * Higher-order function to protect API routes
 */
export function withAuth(handler: (
  request: NextRequest,
  context: { params: any },
  user: User
) => Promise<NextResponse>) {
  return async (request: NextRequest, context: { params: any }) => {
    const authResult = await requireAuthentication(request);
    
    if (!authResult.success) {
      return authResult.response!;
    }

    return handler(request, context, authResult.user!);
  };
}

/**
 * Create Supabase client for server-side operations
 */
function createSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
      },
    }
  );
}

/**
 * Check if user has specific permissions
 */
export async function checkUserPermissions(userId: string, permissions: string[]): Promise<boolean> {
  try {
    const supabase = createSupabaseClient();

    // Get user profile to check role and permissions
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('current_role, experience_years')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return false;
    }

    // Define permission levels based on role
    const rolePermissions: Record<string, string[]> = {
      'po_transitioning': ['basic_features'],
      'ic_pm': ['basic_features', 'meeting_analysis'],
      'senior_pm': ['basic_features', 'meeting_analysis', 'advanced_practice'],
      'staff_pm': ['basic_features', 'meeting_analysis', 'advanced_practice', 'team_features'],
      'principal_pm': ['basic_features', 'meeting_analysis', 'advanced_practice', 'team_features', 'strategic_features'],
      'director': ['basic_features', 'meeting_analysis', 'advanced_practice', 'team_features', 'strategic_features', 'executive_features'],
      'vp': ['basic_features', 'meeting_analysis', 'advanced_practice', 'team_features', 'strategic_features', 'executive_features', 'admin_features']
    };

    const userPermissions = rolePermissions[profile.current_role] || ['basic_features'];
    
    // Check if user has all required permissions
    return permissions.every(permission => userPermissions.includes(permission));
    
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

/**
 * Middleware to require specific permissions
 */
export async function requirePermissions(
  request: NextRequest,
  requiredPermissions: string[]
): Promise<{
  success: boolean;
  user?: User;
  response?: NextResponse;
}> {
  const authResult = await requireAuthentication(request);

  if (!authResult.success) {
    return authResult;
  }

  const hasPermissions = await checkUserPermissions(authResult.user!.id, requiredPermissions);

  if (!hasPermissions) {
    const errorResponse = NextResponse.json(
      {
        error: 'forbidden',
        message: 'Insufficient permissions for this resource'
      },
      { status: 403 }
    );

    return {
      success: false,
      response: errorResponse
    };
  }

  return {
    success: true,
    user: authResult.user
  };
}

/**
 * Utility to get current authenticated user from request
 */
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const authResult = await authenticateRequest(request);
  return authResult.success ? authResult.user! : null;
}

/**
 * Rate limiting helper for authenticated requests
 */
export async function rateLimitUser(userId: string, endpoint: string, maxRequests: number = 100, windowMs: number = 3600000): Promise<boolean> {
  // This would integrate with Redis or a rate limiting service
  // For now, return true (no rate limiting)
  return true;
}

/**
 * API route wrapper that provides authentication context
 */
export function createAuthenticatedHandler(
  handler: (request: NextRequest, context: { params: any }, user: User) => Promise<NextResponse>
) {
  return withAuth(handler);
}

/**
 * Common error responses
 */
export const AUTH_ERRORS = {
  UNAUTHORIZED: {
    error: 'unauthorized',
    message: 'Authentication required',
    statusCode: 401
  },
  FORBIDDEN: {
    error: 'forbidden', 
    message: 'Insufficient permissions',
    statusCode: 403
  },
  INVALID_TOKEN: {
    error: 'invalid_token',
    message: 'Invalid or expired authentication token',
    statusCode: 401
  },
  USER_NOT_FOUND: {
    error: 'user_not_found',
    message: 'User profile not found',
    statusCode: 404
  }
} as const;