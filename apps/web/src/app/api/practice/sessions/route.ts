import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, validateUsageQuota } from '@/lib/middleware/auth';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput, commonSchemas, formatSuccessResponse, formatValidationError } from '@/lib/middleware/validation';

// Practice session creation schema
const createPracticeSessionSchema = z.object({
  scenario_id: z.string().uuid('Invalid scenario ID'),
  session_type: z.enum(['practice', 'assessment', 'guided']).default('practice'),
  difficulty_attempted: z.enum(['foundation', 'practice', 'mastery']).default('foundation')
});

// Practice session update schema
const updatePracticeSessionSchema = z.object({
  duration_seconds: z.number().int().positive().optional(),
  overall_score: z.number().min(0).max(10).optional(),
  executive_presence_score: z.number().min(0).max(10).optional(),
  influence_effectiveness_score: z.number().min(0).max(10).optional(),
  communication_clarity_score: z.number().min(0).max(10).optional(),
  strategic_thinking_score: z.number().min(0).max(10).optional(),
  completion_status: z.enum(['completed', 'abandoned', 'in_progress']).optional(),
  ai_feedback: z.object({}).passthrough().optional(), // Allow any JSON structure
  improvement_suggestions: z.array(z.string()).optional(),
  strengths_identified: z.array(z.string()).optional()
});

// Query schema for practice sessions
const practiceQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => Math.min(parseInt(val) || 20, 100)),
  status: z.enum(['completed', 'abandoned', 'in_progress']).optional(),
  scenario_id: z.string().uuid().optional(),
  session_type: z.enum(['practice', 'assessment', 'guided']).optional()
});

// GET /api/practice/sessions - List user's practice sessions
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Require authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());
    
    const validationResult = validateInput(practiceQuerySchema, queryData);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const { page, limit, status, scenario_id, session_type } = validationResult.data;
    const offset = (page - 1) * limit;

    const supabase = createClient();
    let query = supabase
      .from('practice_sessions')
      .select(`
        *,
        generated_scenarios (
          id,
          title,
          category,
          difficulty_level
        )
      `, { count: 'exact' })
      .eq('user_id', authResult.user!.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('completion_status', status);
    }
    if (scenario_id) {
      query = query.eq('scenario_id', scenario_id);
    }
    if (session_type) {
      query = query.eq('session_type', session_type);
    }

    const { data: sessions, error, count } = await query;

    if (error) {
      console.error('Practice sessions fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch practice sessions' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json(formatSuccessResponse({
      sessions: sessions || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }), { status: 200 });

  } catch (error) {
    console.error('Practice sessions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/practice/sessions - Create a new practice session
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Require authentication and check quota
    const quotaResult = await validateUsageQuota(request, 'practice_sessions');
    if (!quotaResult.success) {
      return NextResponse.json(
        { error: quotaResult.error },
        { status: 401 }
      );
    }

    if (quotaResult.quotaExceeded) {
      return NextResponse.json(
        { 
          error: 'Practice session quota exceeded',
          usage: quotaResult.usage,
          limit: quotaResult.limit
        },
        { status: 429 }
      );
    }

    // Validate input
    const body = await request.json();
    const validationResult = validateInput(createPracticeSessionSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const sessionData = validationResult.data;
    const supabase = createClient();

    // Verify scenario exists and belongs to user
    const { data: scenario, error: scenarioError } = await supabase
      .from('generated_scenarios')
      .select('id')
      .eq('id', sessionData.scenario_id)
      .eq('user_id', quotaResult.user!.id)
      .single();

    if (scenarioError || !scenario) {
      return NextResponse.json(
        { error: 'Scenario not found or access denied' },
        { status: 404 }
      );
    }

    // Create practice session
    const { data: session, error } = await supabase
      .from('practice_sessions')
      .insert({
        ...sessionData,
        user_id: quotaResult.user!.id,
        completion_status: 'in_progress'
      })
      .select()
      .single();

    if (error) {
      console.error('Practice session creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create practice session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(session, 'Practice session created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Practice session creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}