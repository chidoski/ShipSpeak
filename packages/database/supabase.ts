/**
 * Supabase Client Configuration
 * Handles both frontend (anon key) and backend (service role) connections
 * Integrates with existing ShipSpeak AI services
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// ============================================================================
// CLIENT CONFIGURATIONS
// ============================================================================

/**
 * Frontend client - uses anon key, respects RLS policies
 * Safe for browser use, all operations respect Row Level Security
 */
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'shipspeak-web@1.0.0'
      }
    }
  }
);

/**
 * Admin/Service client - uses service role key, bypasses RLS
 * Server-side only, used for system operations and migrations
 */
export const supabaseAdmin: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseServiceKey || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'shipspeak-admin@1.0.0'
      }
    }
  }
);

// ============================================================================
// TYPE-SAFE CLIENT FUNCTIONS
// ============================================================================

/**
 * Get authenticated user's profile with preferences
 */
export async function getUserProfile(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      *,
      user_preferences (*)
    `)
    .eq('id', userId)
    .single();

  if (profileError) {
    throw new Error(`Failed to fetch user profile: ${profileError.message}`);
  }

  return profile;
}

/**
 * Get user's progress across all skill areas
 */
export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('skill_area');

  if (error) {
    throw new Error(`Failed to fetch user progress: ${error.message}`);
  }

  return data;
}

/**
 * Get user's meeting history with analysis results
 */
export async function getUserMeetings(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      meeting_analyses (
        overall_score,
        executive_presence_score,
        influence_skills_score,
        communication_structure_score,
        improvement_areas,
        strengths,
        processing_cost_usd,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch user meetings: ${error.message}`);
  }

  return data;
}

/**
 * Get available scenario templates filtered by user level and preferences
 */
export async function getScenarioTemplates(
  category?: string,
  difficultyLevel?: string,
  limit = 20
) {
  let query = supabase
    .from('scenario_templates')
    .select('*')
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

  if (difficultyLevel) {
    query = query.eq('difficulty_level', difficultyLevel);
  }

  const { data, error } = await query
    .order('category')
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch scenario templates: ${error.message}`);
  }

  return data;
}

/**
 * Get user's generated scenarios with practice history
 */
export async function getUserScenarios(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('generated_scenarios')
    .select(`
      *,
      scenario_templates (
        name,
        category,
        difficulty_level
      ),
      meetings (
        title,
        meeting_type
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch user scenarios: ${error.message}`);
  }

  return data;
}

/**
 * Get user's practice session history with detailed feedback
 */
export async function getPracticeSessions(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select(`
      *,
      generated_scenarios (
        title,
        scenario_templates (
          name,
          category
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch practice sessions: ${error.message}`);
  }

  return data;
}

// ============================================================================
// ADMIN FUNCTIONS (Server-side only)
// ============================================================================

/**
 * Admin function to create scenario template
 * Server-side only, requires service role key
 */
export async function createScenarioTemplate(templateData: any) {
  if (!supabaseServiceKey) {
    throw new Error('Service role key required for admin operations');
  }

  const { data, error } = await supabaseAdmin
    .from('scenario_templates')
    .insert(templateData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create scenario template: ${error.message}`);
  }

  return data;
}

/**
 * Admin function to update system configuration
 * Server-side only, requires service role key
 */
export async function updateSystemConfig(configKey: string, configValue: any) {
  if (!supabaseServiceKey) {
    throw new Error('Service role key required for admin operations');
  }

  const { data, error } = await supabaseAdmin
    .from('system_config')
    .upsert({
      config_key: configKey,
      config_value: configValue,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update system config: ${error.message}`);
  }

  return data;
}

/**
 * Admin function to run database migrations
 * Server-side only, requires service role key
 */
export async function runMigration(migrationSql: string) {
  if (!supabaseServiceKey) {
    throw new Error('Service role key required for admin operations');
  }

  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    sql: migrationSql
  });

  if (error) {
    throw new Error(`Migration failed: ${error.message}`);
  }

  return data;
}

// ============================================================================
// INTEGRATION WITH EXISTING AI SERVICES
// ============================================================================

/**
 * Save meeting upload and trigger Smart Sampling analysis
 * Integrates with existing file upload service
 */
export async function saveMeetingUpload(
  userId: string,
  fileMetadata: {
    title?: string;
    meeting_type: string;
    duration_seconds: number;
    participant_count: number;
    original_filename: string;
    file_size_bytes: number;
    file_format: string;
    storage_path: string;
    has_consent: boolean;
    consent_participants?: string[];
  }
) {
  const { data, error } = await supabase
    .from('meetings')
    .insert({
      user_id: userId,
      ...fileMetadata,
      status: 'uploaded'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save meeting upload: ${error.message}`);
  }

  return data;
}

/**
 * Save Smart Sampling analysis results
 * Integrates with existing Smart Sampling Engine
 */
export async function saveMeetingAnalysis(
  meetingId: string,
  analysisResults: {
    sampling_preset: string;
    sampling_percentage: number;
    total_chunks: number;
    analyzed_chunks: number;
    overall_score: number;
    executive_presence_score: number;
    influence_skills_score: number;
    communication_structure_score: number;
    detailed_feedback: any;
    improvement_areas: string[];
    strengths: string[];
    processing_cost_usd: number;
    estimated_full_cost_usd: number;
    cost_savings_percentage: number;
    processing_time_seconds: number;
    openai_model_used: string;
  }
) {
  const { data, error } = await supabase
    .from('meeting_analyses')
    .insert({
      meeting_id: meetingId,
      ...analysisResults
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save meeting analysis: ${error.message}`);
  }

  // Update meeting status
  await supabase
    .from('meetings')
    .update({ 
      status: 'analyzed',
      updated_at: new Date().toISOString()
    })
    .eq('id', meetingId);

  return data;
}

/**
 * Save generated scenario from Scenario Generation Engine
 * Integrates with existing scenario generation service
 */
export async function saveGeneratedScenario(
  userId: string,
  templateId: string,
  scenarioData: {
    title: string;
    personalized_prompt: string;
    context_data: any;
    stakeholder_data: any;
    generation_method: 'meeting_based' | 'user_profile' | 'manual_request';
    personalization_factors: any;
    meeting_id?: string;
  }
) {
  const { data, error } = await supabase
    .from('generated_scenarios')
    .insert({
      user_id: userId,
      template_id: templateId,
      ...scenarioData
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save generated scenario: ${error.message}`);
  }

  return data;
}

/**
 * Save practice session results
 * Integrates with future practice session interface
 */
export async function savePracticeSession(
  userId: string,
  scenarioId: string,
  sessionData: {
    session_type: 'practice' | 'assessment' | 'guided';
    duration_seconds: number;
    overall_score: number;
    executive_presence_score?: number;
    influence_effectiveness_score?: number;
    communication_clarity_score?: number;
    strategic_thinking_score?: number;
    ai_feedback: any;
    improvement_suggestions: string[];
    strengths_identified: string[];
    difficulty_attempted: 'foundation' | 'practice' | 'mastery';
    completion_status: 'completed' | 'abandoned' | 'in_progress';
    recording_storage_path?: string;
    has_recording?: boolean;
  }
) {
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({
      user_id: userId,
      scenario_id: scenarioId,
      ...sessionData,
      completed_at: sessionData.completion_status === 'completed' 
        ? new Date().toISOString() 
        : null
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save practice session: ${error.message}`);
  }

  // Update scenario practice count and average score
  const { data: currentScenario } = await supabase
    .from('generated_scenarios')
    .select('times_practiced, average_score')
    .eq('id', scenarioId)
    .single();

  if (currentScenario && sessionData.completion_status === 'completed') {
    const newTimesPracticed = currentScenario.times_practiced + 1;
    const newAverageScore = currentScenario.average_score
      ? (currentScenario.average_score * currentScenario.times_practiced + sessionData.overall_score) / newTimesPracticed
      : sessionData.overall_score;

    await supabase
      .from('generated_scenarios')
      .update({
        times_practiced: newTimesPracticed,
        average_score: newAverageScore,
        last_practiced_at: new Date().toISOString()
      })
      .eq('id', scenarioId);
  }

  return data;
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to meeting analysis updates
 * For real-time progress tracking during analysis
 */
export function subscribeMeetingAnalysis(meetingId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`meeting_analysis_${meetingId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'meeting_analyses',
        filter: `meeting_id=eq.${meetingId}`
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to practice session updates
 * For real-time feedback during practice
 */
export function subscribePracticeSession(sessionId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`practice_session_${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'practice_sessions',
        filter: `id=eq.${sessionId}`
      },
      callback
    )
    .subscribe();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('current_role, experience_years')
    .eq('id', userId)
    .single();

  return !!(data?.current_role && data?.experience_years !== null);
}

/**
 * Get system configuration value
 */
export async function getSystemConfig(configKey: string) {
  const { data, error } = await supabase
    .from('system_config')
    .select('config_value')
    .eq('config_key', configKey)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') { // Not found is okay
    throw new Error(`Failed to fetch system config: ${error.message}`);
  }

  return data?.config_value || null;
}

export default supabase;