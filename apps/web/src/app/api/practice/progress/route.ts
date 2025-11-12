import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput, formatSuccessResponse, formatValidationError } from '@/lib/middleware/validation';

// Progress query schema
const progressQuerySchema = z.object({
  skill_area: z.enum([
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
  time_range: z.enum(['week', 'month', 'quarter', 'year', 'all']).default('month')
});

// Progress analytics schema
const analyticsQuerySchema = z.object({
  metric: z.enum(['scores', 'sessions', 'time', 'improvement']).default('scores'),
  granularity: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  skill_areas: z.array(z.string()).optional()
});

// GET /api/practice/progress - Get user's progress across all skill areas
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
    
    const validationResult = validateInput(progressQuerySchema, queryData);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const { skill_area, time_range } = validationResult.data;
    const supabase = createClient();

    // Build base query
    let query = supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', authResult.user!.id);

    // Filter by skill area if specified
    if (skill_area) {
      query = query.eq('skill_area', skill_area);
    }

    const { data: progressRecords, error } = await query;

    if (error) {
      console.error('Progress fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress data' },
        { status: 500 }
      );
    }

    // Get additional analytics
    const analytics = await getProgressAnalytics(supabase, authResult.user!.id, time_range);

    return NextResponse.json(formatSuccessResponse({
      progress: progressRecords || [],
      analytics,
      summary: generateProgressSummary(progressRecords || [])
    }), { status: 200 });

  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/practice/progress/analytics - Get detailed analytics
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
    const validationResult = validateInput(analyticsQuerySchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        formatValidationError(validationResult.errors!),
        { status: 400 }
      );
    }

    const { metric, granularity, skill_areas } = validationResult.data;
    const supabase = createClient();

    const analytics = await getDetailedAnalytics(
      supabase, 
      authResult.user!.id, 
      metric, 
      granularity, 
      skill_areas
    );

    return NextResponse.json(
      formatSuccessResponse(analytics),
      { status: 200 }
    );

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get progress analytics
async function getProgressAnalytics(supabase: any, userId: string, timeRange: string) {
  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      startDate = new Date('2020-01-01'); // Set to very early date
      break;
  }

  // Get practice sessions in time range
  const { data: sessions, error: sessionsError } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .eq('completion_status', 'completed');

  if (sessionsError) {
    console.error('Sessions analytics error:', sessionsError);
    return null;
  }

  // Calculate analytics
  const totalSessions = sessions?.length || 0;
  const totalPracticeTime = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
  const averageScore = sessions?.length > 0 
    ? sessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / sessions.length 
    : 0;

  // Get skill area breakdown
  const { data: scenarios } = await supabase
    .from('generated_scenarios')
    .select('category, id')
    .in('id', sessions?.map(s => s.scenario_id) || []);

  const skillBreakdown: { [key: string]: number } = {};
  sessions?.forEach(session => {
    const scenario = scenarios?.find(s => s.id === session.scenario_id);
    if (scenario?.category) {
      skillBreakdown[scenario.category] = (skillBreakdown[scenario.category] || 0) + 1;
    }
  });

  return {
    totalSessions,
    totalPracticeTimeMinutes: Math.round(totalPracticeTime / 60),
    averageScore: Number(averageScore.toFixed(2)),
    skillBreakdown,
    timeRange
  };
}

// Helper function to get detailed analytics
async function getDetailedAnalytics(
  supabase: any, 
  userId: string, 
  metric: string, 
  granularity: string, 
  skillAreas?: string[]
) {
  const now = new Date();
  const startDate = new Date();
  
  // Set time window based on granularity
  switch (granularity) {
    case 'daily':
      startDate.setDate(now.getDate() - 30); // Last 30 days
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 84); // Last 12 weeks
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 12); // Last 12 months
      break;
  }

  // Base query for practice sessions
  let query = supabase
    .from('practice_sessions')
    .select(`
      *,
      generated_scenarios (
        category
      )
    `)
    .eq('user_id', userId)
    .eq('completion_status', 'completed')
    .gte('created_at', startDate.toISOString())
    .order('created_at');

  const { data: sessions, error } = await query;

  if (error) {
    console.error('Detailed analytics error:', error);
    return null;
  }

  // Filter by skill areas if specified
  const filteredSessions = skillAreas 
    ? sessions?.filter(s => skillAreas.includes(s.generated_scenarios?.category))
    : sessions;

  // Group data by time period
  const groupedData = groupSessionsByPeriod(filteredSessions || [], granularity);

  // Calculate metrics based on type
  switch (metric) {
    case 'scores':
      return calculateScoreMetrics(groupedData);
    case 'sessions':
      return calculateSessionMetrics(groupedData);
    case 'time':
      return calculateTimeMetrics(groupedData);
    case 'improvement':
      return calculateImprovementMetrics(groupedData);
    default:
      return null;
  }
}

// Helper function to group sessions by time period
function groupSessionsByPeriod(sessions: any[], granularity: string) {
  const groups: { [key: string]: any[] } = {};

  sessions.forEach(session => {
    const date = new Date(session.created_at);
    let key: string;

    switch (granularity) {
      case 'daily':
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(session);
  });

  return groups;
}

// Helper functions for different metric types
function calculateScoreMetrics(groupedData: { [key: string]: any[] }) {
  return Object.entries(groupedData).map(([period, sessions]) => ({
    period,
    averageScore: sessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / sessions.length,
    maxScore: Math.max(...sessions.map(s => s.overall_score || 0)),
    minScore: Math.min(...sessions.map(s => s.overall_score || 0)),
    sessionCount: sessions.length
  }));
}

function calculateSessionMetrics(groupedData: { [key: string]: any[] }) {
  return Object.entries(groupedData).map(([period, sessions]) => ({
    period,
    sessionCount: sessions.length,
    completedSessions: sessions.filter(s => s.completion_status === 'completed').length,
    averageDuration: sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length / 60 // minutes
  }));
}

function calculateTimeMetrics(groupedData: { [key: string]: any[] }) {
  return Object.entries(groupedData).map(([period, sessions]) => ({
    period,
    totalMinutes: sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60,
    averageSessionMinutes: sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length / 60,
    sessionCount: sessions.length
  }));
}

function calculateImprovementMetrics(groupedData: { [key: string]: any[] }) {
  const periods = Object.keys(groupedData).sort();
  
  return periods.map((period, index) => {
    const sessions = groupedData[period];
    const avgScore = sessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / sessions.length;
    
    let improvement = 0;
    if (index > 0) {
      const prevPeriod = periods[index - 1];
      const prevSessions = groupedData[prevPeriod];
      const prevAvgScore = prevSessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / prevSessions.length;
      improvement = avgScore - prevAvgScore;
    }

    return {
      period,
      averageScore: avgScore,
      improvement,
      sessionCount: sessions.length
    };
  });
}

// Helper function to generate progress summary
function generateProgressSummary(progressRecords: any[]) {
  const totalSkillAreas = progressRecords.length;
  const averageScore = progressRecords.length > 0 
    ? progressRecords.reduce((sum, p) => sum + (p.skill_score || 0), 0) / progressRecords.length 
    : 0;
  const totalSessions = progressRecords.reduce((sum, p) => sum + (p.sessions_completed || 0), 0);
  const totalPracticeTime = progressRecords.reduce((sum, p) => sum + (p.total_practice_time_minutes || 0), 0);

  const strongestSkill = progressRecords.reduce((max, p) => 
    (p.skill_score || 0) > (max?.skill_score || 0) ? p : max, progressRecords[0]
  );

  const mostPracticedSkill = progressRecords.reduce((max, p) => 
    (p.sessions_completed || 0) > (max?.sessions_completed || 0) ? p : max, progressRecords[0]
  );

  return {
    totalSkillAreas,
    averageScore: Number(averageScore.toFixed(2)),
    totalSessions,
    totalPracticeTimeHours: Number((totalPracticeTime / 60).toFixed(1)),
    strongestSkill: strongestSkill?.skill_area || null,
    mostPracticedSkill: mostPracticedSkill?.skill_area || null
  };
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