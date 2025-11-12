import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, validateUsageQuota } from '@/lib/middleware/auth';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput, commonSchemas, formatSuccessResponse, formatValidationError } from '@/lib/middleware/validation';

// Meeting creation schema
const createMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  meetingType: commonSchemas.meetingType,
  duration_seconds: z.number().int().positive().optional(),
  participant_count: z.number().int().positive().optional(),
  has_consent: z.boolean().default(false),
  consent_participants: z.array(z.string()).default([])
});

// Meeting query schema
const meetingQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => Math.min(parseInt(val) || 20, 100)),
  type: z.string().optional(),
  status: z.enum(['uploaded', 'processing', 'analyzed', 'failed']).optional(),
  search: z.string().optional()
});

// GET /api/meetings - List user's meetings with pagination and filtering
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
    
    const validationResult = validateInput(meetingQuerySchema, queryData);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const { page, limit, type, status, search } = validationResult.data;
    const offset = (page - 1) * limit;

    const supabase = createClient();
    let query = supabase
      .from('meetings')
      .select('*', { count: 'exact' })
      .eq('user_id', authResult.user!.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (type) {
      query = query.eq('meeting_type', type);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: meetings, error, count } = await query;

    if (error) {
      console.error('Meeting fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch meetings' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json(formatSuccessResponse({
      meetings: meetings || [],
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
    console.error('Meetings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/meetings - Create a new meeting
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
    const quotaResult = await validateUsageQuota(request, 'meetings');
    if (!quotaResult.success) {
      return NextResponse.json(
        { error: quotaResult.error },
        { status: 401 }
      );
    }

    if (quotaResult.quotaExceeded) {
      return NextResponse.json(
        { 
          error: 'Meeting quota exceeded',
          usage: quotaResult.usage,
          limit: quotaResult.limit
        },
        { status: 429 }
      );
    }

    // Validate input
    const body = await request.json();
    const validationResult = validateInput(createMeetingSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const meetingData = validationResult.data;
    const supabase = createClient();

    // Create meeting record
    const { data: meeting, error } = await supabase
      .from('meetings')
      .insert({
        ...meetingData,
        user_id: quotaResult.user!.id,
        status: 'uploaded'
      })
      .select()
      .single();

    if (error) {
      console.error('Meeting creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create meeting' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(meeting, 'Meeting created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Meeting creation API error:', error);
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