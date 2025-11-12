/**
 * Migration utilities for transitioning from localStorage to database
 * Handles user preferences, onboarding data, and session state preservation
 */

import { authService } from '@/services/auth.service';
import { createClient } from '@/lib/supabase/client';
import { OnboardingData, User } from '@/types/auth';

interface MigrationResult {
  success: boolean;
  migratedItems: string[];
  errors: string[];
}

/**
 * Migrate user data from localStorage to Supabase database
 */
export async function migrateUserData(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migratedItems: [],
    errors: []
  };

  try {
    const supabase = createClient();
    const currentUser = await authService.getCurrentUser();
    
    if (!currentUser) {
      result.success = false;
      result.errors.push('No authenticated user found for migration');
      return result;
    }

    // Migrate onboarding data if exists in localStorage
    const onboardingData = authService.getOnboardingData();
    if (onboardingData) {
      try {
        await migrateOnboardingData(currentUser, onboardingData);
        result.migratedItems.push('onboarding_data');
        localStorage.removeItem('shipspeak_onboarding');
      } catch (error) {
        result.errors.push(`Failed to migrate onboarding data: ${error}`);
      }
    }

    // Migrate user preferences
    const preferences = getStoredPreferences();
    if (preferences) {
      try {
        await migrateUserPreferences(currentUser.id, preferences);
        result.migratedItems.push('user_preferences');
        localStorage.removeItem('shipspeak_preferences');
      } catch (error) {
        result.errors.push(`Failed to migrate preferences: ${error}`);
      }
    }

    // Migrate meeting analysis cache
    const meetingCache = getStoredMeetingAnalysis();
    if (meetingCache.length > 0) {
      try {
        await migrateMeetingAnalysis(currentUser.id, meetingCache);
        result.migratedItems.push('meeting_analysis_cache');
        localStorage.removeItem('shipspeak_meeting_analysis');
      } catch (error) {
        result.errors.push(`Failed to migrate meeting analysis: ${error}`);
      }
    }

    // Migrate progress data
    const progressData = getStoredProgressData();
    if (progressData) {
      try {
        await migrateProgressData(currentUser.id, progressData);
        result.migratedItems.push('progress_data');
        localStorage.removeItem('shipspeak_progress');
      } catch (error) {
        result.errors.push(`Failed to migrate progress data: ${error}`);
      }
    }

    // Set migration completed flag
    localStorage.setItem('shipspeak_migration_completed', 'true');
    result.migratedItems.push('migration_flag');

  } catch (error) {
    result.success = false;
    result.errors.push(`Migration failed: ${error}`);
  }

  return result;
}

/**
 * Check if migration has already been completed
 */
export function isMigrationCompleted(): boolean {
  return localStorage.getItem('shipspeak_migration_completed') === 'true';
}

/**
 * Clean up any remaining localStorage data after successful migration
 */
export function cleanupLegacyData(): void {
  const legacyKeys = [
    'shipspeak_onboarding',
    'shipspeak_preferences', 
    'shipspeak_meeting_analysis',
    'shipspeak_progress',
    'shipspeak_user',
    'shipspeak_auth_token'
  ];

  legacyKeys.forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Migrate onboarding data to user profile
 */
async function migrateOnboardingData(user: User, data: OnboardingData): Promise<void> {
  const supabase = createClient();

  // Update user profile with onboarding information
  const { error } = await supabase
    .from('profiles')
    .update({
      industry: data.industryContext?.sector || 'enterprise',
      experience_years: data.roleAssessment?.experience || 0,
      focus_areas: data.competencyBaseline ? Object.keys(data.competencyBaseline) : [],
      preferred_difficulty: 'foundation' // Default to foundation level
    })
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  // Create initial user progress entries
  if (data.competencyBaseline) {
    for (const [skillArea, baseline] of Object.entries(data.competencyBaseline)) {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          skill_area: skillArea,
          current_level: 'foundation',
          skill_score: baseline.score / 10, // Convert from 100 scale to 10 scale
          initial_score: baseline.score / 10,
          best_score: baseline.score / 10
        });
    }
  }
}

/**
 * Get user preferences from localStorage
 */
function getStoredPreferences(): any {
  const prefsStr = localStorage.getItem('shipspeak_preferences');
  if (!prefsStr) return null;
  
  try {
    return JSON.parse(prefsStr);
  } catch {
    return null;
  }
}

/**
 * Migrate user preferences to database
 */
async function migrateUserPreferences(userId: string, preferences: any): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      email_notifications: preferences.emailNotifications ?? true,
      practice_reminders: preferences.practiceReminders ?? true,
      weekly_summary: preferences.weeklySummary ?? true,
      data_retention_days: preferences.dataRetentionDays ?? 90,
      allow_meeting_recording: preferences.allowMeetingRecording ?? false,
      ai_feedback_style: preferences.aiFeedbackStyle ?? 'supportive'
    });

  if (error) {
    throw new Error(`Failed to migrate preferences: ${error.message}`);
  }
}

/**
 * Get stored meeting analysis from localStorage
 */
function getStoredMeetingAnalysis(): any[] {
  const analysisStr = localStorage.getItem('shipspeak_meeting_analysis');
  if (!analysisStr) return [];
  
  try {
    const data = JSON.parse(analysisStr);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Migrate meeting analysis cache to database
 */
async function migrateMeetingAnalysis(userId: string, analysisCache: any[]): Promise<void> {
  const supabase = createClient();

  for (const analysis of analysisCache) {
    // Create meeting record
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        user_id: userId,
        title: analysis.title || 'Migrated Meeting',
        meeting_type: analysis.type || 'other',
        duration_seconds: analysis.duration || 0,
        participant_count: analysis.participantCount || 1,
        status: 'analyzed',
        has_consent: true
      })
      .select()
      .single();

    if (meetingError || !meeting) {
      console.warn('Failed to migrate meeting:', analysis.title, meetingError);
      continue;
    }

    // Create analysis record if analysis data exists
    if (analysis.scores || analysis.feedback) {
      await supabase
        .from('meeting_analyses')
        .insert({
          meeting_id: meeting.id,
          sampling_preset: 'BALANCED',
          sampling_percentage: 50,
          total_chunks: 1,
          analyzed_chunks: 1,
          overall_score: analysis.scores?.overall || 0,
          executive_presence_score: analysis.scores?.executivePresence || 0,
          influence_skills_score: analysis.scores?.influenceSkills || 0,
          communication_structure_score: analysis.scores?.communicationStructure || 0,
          detailed_feedback: analysis.feedback || {},
          improvement_areas: analysis.improvementAreas || [],
          strengths: analysis.strengths || [],
          processing_cost_usd: 0,
          processing_time_seconds: 0,
          openai_model_used: 'gpt-4'
        });
    }
  }
}

/**
 * Get stored progress data from localStorage
 */
function getStoredProgressData(): any {
  const progressStr = localStorage.getItem('shipspeak_progress');
  if (!progressStr) return null;
  
  try {
    return JSON.parse(progressStr);
  } catch {
    return null;
  }
}

/**
 * Migrate progress data to database
 */
async function migrateProgressData(userId: string, progressData: any): Promise<void> {
  const supabase = createClient();

  // Migrate skill progress
  if (progressData.skills) {
    for (const [skillArea, progress] of Object.entries(progressData.skills as Record<string, any>)) {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          skill_area: skillArea,
          current_level: progress.level || 'foundation',
          skill_score: progress.score || 0,
          sessions_completed: progress.sessionsCompleted || 0,
          total_practice_time_minutes: progress.totalPracticeTime || 0,
          initial_score: progress.initialScore || 0,
          best_score: progress.bestScore || progress.score || 0,
          last_practiced_at: progress.lastPracticedAt || new Date().toISOString()
        });
    }
  }
}

/**
 * Automatic migration on app startup
 */
export async function attemptAutoMigration(): Promise<void> {
  // Only attempt migration if user is authenticated and migration hasn't been completed
  if (isMigrationCompleted()) {
    return;
  }

  const currentUser = await authService.getCurrentUser();
  if (!currentUser) {
    return;
  }

  try {
    const result = await migrateUserData();
    
    if (result.success) {
      console.log('✅ User data migration completed successfully');
      console.log('Migrated items:', result.migratedItems);
      
      // Clean up legacy data
      cleanupLegacyData();
    } else {
      console.warn('⚠️ User data migration completed with errors:', result.errors);
    }
  } catch (error) {
    console.error('❌ Auto migration failed:', error);
  }
}