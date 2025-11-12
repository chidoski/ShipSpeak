import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { validateResourceOwnership } from '@/lib/middleware/auth';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput, commonSchemas, formatSuccessResponse, formatValidationError } from '@/lib/middleware/validation';

// Meeting update schema
const updateMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  meetingType: commonSchemas.meetingType.optional(),
  duration_seconds: z.number().int().positive().optional(),
  participant_count: z.number().int().positive().optional(),
  has_consent: z.boolean().optional(),
  consent_participants: z.array(z.string()).optional(),
  status: z.enum(['uploaded', 'processing', 'analyzed', 'failed']).optional()
});

// GET /api/meetings/[id] - Get specific meeting
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

    // Validate meeting ID format
    const idValidation = validateInput(commonSchemas.meetingId, params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        formatValidationError(idValidation.errors!),
        { status: 400 }
      );
    }

    // Validate ownership
    const authResult = await validateResourceOwnership(request, 'meeting', params.id);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Access denied' ? 403 : 401 }
      );
    }

    const supabase = createClient();

    // Fetch meeting with related analysis data
    const { data: meeting, error } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_analyses (
          id,
          overall_score,
          executive_presence_score,
          influence_skills_score,
          communication_structure_score,
          detailed_feedback,
          improvement_areas,
          strengths,
          processing_cost_usd,
          created_at
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Meeting fetch error:', error);
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(meeting),
      { status: 200 }
    );

  } catch (error) {
    console.error('Meeting GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/meetings/[id] - Update meeting
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

    // Validate meeting ID format
    const idValidation = validateInput(commonSchemas.meetingId, params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        formatValidationError(idValidation.errors!),
        { status: 400 }
      );
    }

    // Validate ownership
    const authResult = await validateResourceOwnership(request, 'meeting', params.id);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Access denied' ? 403 : 401 }
      );
    }

    // Validate input
    const body = await request.json();
    const validationResult = validateInput(updateMeetingSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const updateData = {
      ...validationResult.data,
      updated_at: new Date().toISOString()
    };

    const supabase = createClient();

    // Update meeting
    const { data: meeting, error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Meeting update error:', error);
      return NextResponse.json(
        { error: 'Failed to update meeting' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(meeting, 'Meeting updated successfully'),
      { status: 200 }
    );

  } catch (error) {
    console.error('Meeting PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/meetings/[id] - Delete meeting
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

    // Validate meeting ID format
    const idValidation = validateInput(commonSchemas.meetingId, params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        formatValidationError(idValidation.errors!),
        { status: 400 }
      );
    }

    // Validate ownership
    const authResult = await validateResourceOwnership(request, 'meeting', params.id);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Access denied' ? 403 : 401 }
      );
    }

    const supabase = createClient();

    // Delete meeting (cascade will handle related records)
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Meeting deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete meeting' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(null, 'Meeting deleted successfully'),
      { status: 200 }
    );

  } catch (error) {
    console.error('Meeting DELETE API error:', error);
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}