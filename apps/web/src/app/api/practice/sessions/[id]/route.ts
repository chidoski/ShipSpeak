import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { validateResourceOwnership } from '@/lib/middleware/auth';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput, commonSchemas, formatSuccessResponse, formatValidationError } from '@/lib/middleware/validation';

// Practice session update schema
const updatePracticeSessionSchema = z.object({
  duration_seconds: z.number().int().positive().optional(),
  overall_score: z.number().min(0).max(10).optional(),
  executive_presence_score: z.number().min(0).max(10).optional(),
  influence_effectiveness_score: z.number().min(0).max(10).optional(),
  communication_clarity_score: z.number().min(0).max(10).optional(),
  strategic_thinking_score: z.number().min(0).max(10).optional(),
  completion_status: z.enum(['completed', 'abandoned', 'in_progress']).optional(),
  ai_feedback: z.object({}).passthrough().optional(),
  improvement_suggestions: z.array(z.string()).optional(),
  strengths_identified: z.array(z.string()).optional(),
  recording_storage_path: z.string().optional(),
  has_recording: z.boolean().optional()
});

// GET /api/practice/sessions/[id] - Get specific practice session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Validate session ID format
    const idValidation = validateInput(z.string().uuid(), params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        formatValidationError(['Invalid practice session ID format']),
        { status: 400 }
      );
    }

    // Validate ownership
    const authResult = await validateResourceOwnership(request, 'practice_session', params.id);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Access denied' ? 403 : 401 }
      );
    }

    const supabase = createClient();

    // Fetch practice session with scenario details
    const { data: session, error } = await supabase
      .from('practice_sessions')
      .select(`
        *,
        generated_scenarios (
          id,
          title,
          category,
          difficulty_level,
          personalized_prompt,
          context_data,
          stakeholder_data
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Practice session fetch error:', error);
      return NextResponse.json(
        { error: 'Practice session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(session),
      { status: 200 }
    );

  } catch (error) {
    console.error('Practice session GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/practice/sessions/[id] - Update practice session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Validate session ID format
    const idValidation = validateInput(z.string().uuid(), params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        formatValidationError(['Invalid practice session ID format']),
        { status: 400 }
      );
    }

    // Validate ownership
    const authResult = await validateResourceOwnership(request, 'practice_session', params.id);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Access denied' ? 403 : 401 }
      );
    }

    // Validate input
    const body = await request.json();
    const validationResult = validateInput(updatePracticeSessionSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const updateData = {
      ...validationResult.data,
      completed_at: validationResult.data.completion_status === 'completed' 
        ? new Date().toISOString() 
        : undefined
    };

    const supabase = createClient();

    // Update practice session
    const { data: session, error } = await supabase
      .from('practice_sessions')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Practice session update error:', error);
      return NextResponse.json(
        { error: 'Failed to update practice session' },
        { status: 500 }
      );
    }

    // If session was completed, update user progress
    if (validationResult.data.completion_status === 'completed') {
      await updateUserProgress(supabase, authResult.user!.id, session);
    }

    return NextResponse.json(
      formatSuccessResponse(session, 'Practice session updated successfully'),
      { status: 200 }
    );

  } catch (error) {
    console.error('Practice session PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/practice/sessions/[id] - Delete practice session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Validate session ID format
    const idValidation = validateInput(z.string().uuid(), params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        formatValidationError(['Invalid practice session ID format']),
        { status: 400 }
      );
    }

    // Validate ownership
    const authResult = await validateResourceOwnership(request, 'practice_session', params.id);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Access denied' ? 403 : 401 }
      );
    }

    const supabase = createClient();

    // Delete practice session
    const { error } = await supabase
      .from('practice_sessions')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Practice session deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete practice session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(null, 'Practice session deleted successfully'),
      { status: 200 }
    );

  } catch (error) {
    console.error('Practice session DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user progress
async function updateUserProgress(supabase: any, userId: string, session: any) {
  try {
    // Get scenario to determine skill area
    const { data: scenario } = await supabase
      .from('generated_scenarios')
      .select('category')
      .eq('id', session.scenario_id)
      .single();

    if (!scenario) return;

    const skillArea = scenario.category;

    // Get or create user progress record
    const { data: progress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_area', skillArea)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Progress fetch error:', fetchError);
      return;
    }

    if (progress) {
      // Update existing progress
      const newScore = session.overall_score || progress.skill_score;
      const bestScore = Math.max(newScore, progress.best_score || 0);
      
      await supabase
        .from('user_progress')
        .update({
          skill_score: newScore,
          best_score: bestScore,
          sessions_completed: progress.sessions_completed + 1,
          total_practice_time_minutes: progress.total_practice_time_minutes + 
            Math.round((session.duration_seconds || 0) / 60),
          last_practiced_at: new Date().toISOString()
        })
        .eq('id', progress.id);
    } else {
      // Create new progress record
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          skill_area: skillArea,
          current_level: session.difficulty_attempted || 'foundation',
          skill_score: session.overall_score || 0,
          sessions_completed: 1,
          total_practice_time_minutes: Math.round((session.duration_seconds || 0) / 60),
          initial_score: session.overall_score || 0,
          best_score: session.overall_score || 0,
          last_practiced_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Progress update error:', error);
    // Don't fail the main request if progress update fails
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}