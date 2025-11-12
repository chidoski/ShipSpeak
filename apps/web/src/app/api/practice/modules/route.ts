import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput, formatSuccessResponse, formatValidationError } from '@/lib/middleware/validation';

// Module query schema
const moduleQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => Math.min(parseInt(val) || 20, 100)),
  category: z.enum([
    'executive_presence',
    'influence_skills', 
    'strategic_communication',
    'difficult_conversations',
    'board_presentations',
    'team_leadership',
    'stakeholder_management',
    'product_decisions',
    'crisis_management',
    'vision_setting'
  ]).optional(),
  difficulty: z.enum(['foundation', 'practice', 'mastery']).optional(),
  search: z.string().optional()
});

// Module generation request schema
const generateModuleSchema = z.object({
  template_id: z.string().uuid('Invalid template ID'),
  personalization_context: z.object({
    industry: z.string().optional(),
    role: z.string().optional(),
    experience_level: z.string().optional(),
    specific_challenges: z.array(z.string()).optional()
  }).optional(),
  meeting_based: z.boolean().default(false),
  meeting_id: z.string().uuid().optional()
});

// GET /api/practice/modules - Get available practice modules (scenarios)
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
    
    const validationResult = validateInput(moduleQuerySchema, queryData);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const { page, limit, category, difficulty, search } = validationResult.data;
    const offset = (page - 1) * limit;

    const supabase = createClient();

    // Get user's generated scenarios (personalized modules)
    let query = supabase
      .from('generated_scenarios')
      .select(`
        *,
        scenario_templates (
          id,
          name,
          category,
          difficulty_level,
          estimated_duration_minutes,
          tags
        )
      `, { count: 'exact' })
      .eq('user_id', authResult.user!.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters by joining with scenario_templates
    if (category) {
      const { data: templateIds } = await supabase
        .from('scenario_templates')
        .select('id')
        .eq('category', category);
      
      if (templateIds && templateIds.length > 0) {
        query = query.in('template_id', templateIds.map(t => t.id));
      } else {
        // No templates match category, return empty
        return NextResponse.json(formatSuccessResponse({
          modules: [],
          pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
        }), { status: 200 });
      }
    }

    if (difficulty) {
      const { data: templateIds } = await supabase
        .from('scenario_templates')
        .select('id')
        .eq('difficulty_level', difficulty);
      
      if (templateIds && templateIds.length > 0) {
        query = query.in('template_id', templateIds.map(t => t.id));
      } else {
        // No templates match difficulty, return empty
        return NextResponse.json(formatSuccessResponse({
          modules: [],
          pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
        }), { status: 200 });
      }
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: modules, error, count } = await query;

    if (error) {
      console.error('Modules fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch practice modules' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json(formatSuccessResponse({
      modules: modules || [],
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
    console.error('Practice modules API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/practice/modules - Generate a new personalized module
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting with AI processing limits
    const rateLimitResult = await rateLimit(request, 'ai');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for AI processing', retryAfter: rateLimitResult.retryAfter },
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

    // Validate input
    const body = await request.json();
    const validationResult = validateInput(generateModuleSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const { template_id, personalization_context, meeting_based, meeting_id } = validationResult.data;
    const supabase = createClient();

    // Verify template exists
    const { data: template, error: templateError } = await supabase
      .from('scenario_templates')
      .select('*')
      .eq('id', template_id)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found or inactive' },
        { status: 404 }
      );
    }

    // If meeting-based, verify meeting ownership
    if (meeting_based && meeting_id) {
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select('id')
        .eq('id', meeting_id)
        .eq('user_id', authResult.user!.id)
        .single();

      if (meetingError || !meeting) {
        return NextResponse.json(
          { error: 'Meeting not found or access denied' },
          { status: 404 }
        );
      }
    }

    // Generate personalized module title and prompt
    const personalizedTitle = generatePersonalizedTitle(template, personalization_context);
    const personalizedPrompt = generatePersonalizedPrompt(template, personalization_context);

    // Create generated scenario
    const { data: module, error } = await supabase
      .from('generated_scenarios')
      .insert({
        user_id: authResult.user!.id,
        template_id,
        meeting_id: meeting_based ? meeting_id : null,
        title: personalizedTitle,
        personalized_prompt: personalizedPrompt,
        context_data: personalization_context || {},
        generation_method: meeting_based ? 'meeting_based' : 'user_profile',
        personalization_factors: {
          industry: personalization_context?.industry,
          role: personalization_context?.role,
          experience_level: personalization_context?.experience_level,
          meeting_based
        }
      })
      .select(`
        *,
        scenario_templates (
          id,
          name,
          category,
          difficulty_level,
          estimated_duration_minutes
        )
      `)
      .single();

    if (error) {
      console.error('Module generation error:', error);
      return NextResponse.json(
        { error: 'Failed to generate practice module' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      formatSuccessResponse(module, 'Practice module generated successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Module generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate personalized title
function generatePersonalizedTitle(template: any, context: any): string {
  let title = template.name;
  
  if (context?.industry) {
    title += ` for ${context.industry}`;
  }
  
  if (context?.role) {
    title += ` (${context.role})`;
  }
  
  return title;
}

// Helper function to generate personalized prompt
function generatePersonalizedPrompt(template: any, context: any): string {
  let prompt = template.scenario_prompt;
  
  // Replace placeholders with context data
  if (context?.industry) {
    prompt = prompt.replace(/{{industry}}/g, context.industry);
  }
  
  if (context?.role) {
    prompt = prompt.replace(/{{role}}/g, context.role);
  }
  
  if (context?.experience_level) {
    prompt = prompt.replace(/{{experience_level}}/g, context.experience_level);
  }
  
  return prompt;
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