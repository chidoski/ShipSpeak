/**
 * Database Types for ShipSpeak
 * Auto-generated types matching PostgreSQL schema
 * Provides full type safety for Supabase operations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// CORE DATABASE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          current_role: 'ic_pm' | 'senior_pm' | 'staff_pm' | 'principal_pm' | 'director' | 'vp' | 'po_transitioning' | null
          experience_years: number | null
          company_size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          industry: string | null
          preferred_difficulty: 'foundation' | 'practice' | 'mastery'
          focus_areas: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          current_role?: 'ic_pm' | 'senior_pm' | 'staff_pm' | 'principal_pm' | 'director' | 'vp' | 'po_transitioning' | null
          experience_years?: number | null
          company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          industry?: string | null
          preferred_difficulty?: 'foundation' | 'practice' | 'mastery'
          focus_areas?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          current_role?: 'ic_pm' | 'senior_pm' | 'staff_pm' | 'principal_pm' | 'director' | 'vp' | 'po_transitioning' | null
          experience_years?: number | null
          company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          industry?: string | null
          preferred_difficulty?: 'foundation' | 'practice' | 'mastery'
          focus_areas?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          practice_reminders: boolean
          weekly_summary: boolean
          data_retention_days: number
          allow_meeting_recording: boolean
          ai_feedback_style: 'direct' | 'supportive' | 'detailed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          practice_reminders?: boolean
          weekly_summary?: boolean
          data_retention_days?: number
          allow_meeting_recording?: boolean
          ai_feedback_style?: 'direct' | 'supportive' | 'detailed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          practice_reminders?: boolean
          weekly_summary?: boolean
          data_retention_days?: number
          allow_meeting_recording?: boolean
          ai_feedback_style?: 'direct' | 'supportive' | 'detailed'
          created_at?: string
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string | null
          meeting_type: 'one_on_one' | 'team_standup' | 'executive_review' | 'client_meeting' | 'board_presentation' | 'product_review' | 'other' | null
          duration_seconds: number | null
          participant_count: number | null
          original_filename: string | null
          file_size_bytes: number | null
          file_format: string | null
          storage_path: string | null
          status: 'uploaded' | 'processing' | 'analyzed' | 'failed'
          error_message: string | null
          has_consent: boolean
          consent_participants: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          meeting_type?: 'one_on_one' | 'team_standup' | 'executive_review' | 'client_meeting' | 'board_presentation' | 'product_review' | 'other' | null
          duration_seconds?: number | null
          participant_count?: number | null
          original_filename?: string | null
          file_size_bytes?: number | null
          file_format?: string | null
          storage_path?: string | null
          status?: 'uploaded' | 'processing' | 'analyzed' | 'failed'
          error_message?: string | null
          has_consent?: boolean
          consent_participants?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          meeting_type?: 'one_on_one' | 'team_standup' | 'executive_review' | 'client_meeting' | 'board_presentation' | 'product_review' | 'other' | null
          duration_seconds?: number | null
          participant_count?: number | null
          original_filename?: string | null
          file_size_bytes?: number | null
          file_format?: string | null
          storage_path?: string | null
          status?: 'uploaded' | 'processing' | 'analyzed' | 'failed'
          error_message?: string | null
          has_consent?: boolean
          consent_participants?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      meeting_analyses: {
        Row: {
          id: string
          meeting_id: string
          sampling_preset: 'COST_OPTIMIZED' | 'BALANCED' | 'QUALITY_FOCUSED' | 'ENTERPRISE' | 'CUSTOM' | null
          sampling_percentage: number | null
          total_chunks: number | null
          analyzed_chunks: number | null
          overall_score: number | null
          executive_presence_score: number | null
          influence_skills_score: number | null
          communication_structure_score: number | null
          detailed_feedback: Json | null
          improvement_areas: string[]
          strengths: string[]
          processing_cost_usd: number | null
          estimated_full_cost_usd: number | null
          cost_savings_percentage: number | null
          processing_time_seconds: number | null
          openai_model_used: string | null
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          sampling_preset?: 'COST_OPTIMIZED' | 'BALANCED' | 'QUALITY_FOCUSED' | 'ENTERPRISE' | 'CUSTOM' | null
          sampling_percentage?: number | null
          total_chunks?: number | null
          analyzed_chunks?: number | null
          overall_score?: number | null
          executive_presence_score?: number | null
          influence_skills_score?: number | null
          communication_structure_score?: number | null
          detailed_feedback?: Json | null
          improvement_areas?: string[]
          strengths?: string[]
          processing_cost_usd?: number | null
          estimated_full_cost_usd?: number | null
          cost_savings_percentage?: number | null
          processing_time_seconds?: number | null
          openai_model_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          sampling_preset?: 'COST_OPTIMIZED' | 'BALANCED' | 'QUALITY_FOCUSED' | 'ENTERPRISE' | 'CUSTOM' | null
          sampling_percentage?: number | null
          total_chunks?: number | null
          analyzed_chunks?: number | null
          overall_score?: number | null
          executive_presence_score?: number | null
          influence_skills_score?: number | null
          communication_structure_score?: number | null
          detailed_feedback?: Json | null
          improvement_areas?: string[]
          strengths?: string[]
          processing_cost_usd?: number | null
          estimated_full_cost_usd?: number | null
          cost_savings_percentage?: number | null
          processing_time_seconds?: number | null
          openai_model_used?: string | null
          created_at?: string
        }
      }
      meeting_transcripts: {
        Row: {
          id: string
          meeting_id: string
          chunk_index: number | null
          start_time_seconds: number | null
          end_time_seconds: number | null
          transcript_text: string | null
          speaker_labels: Json | null
          confidence_score: number | null
          was_analyzed: boolean
          sampling_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          chunk_index?: number | null
          start_time_seconds?: number | null
          end_time_seconds?: number | null
          transcript_text?: string | null
          speaker_labels?: Json | null
          confidence_score?: number | null
          was_analyzed?: boolean
          sampling_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          chunk_index?: number | null
          start_time_seconds?: number | null
          end_time_seconds?: number | null
          transcript_text?: string | null
          speaker_labels?: Json | null
          confidence_score?: number | null
          was_analyzed?: boolean
          sampling_reason?: string | null
          created_at?: string
        }
      }
      scenario_templates: {
        Row: {
          id: string
          name: string
          category: 'executive_presence' | 'influence_skills' | 'strategic_communication' | 'difficult_conversations' | 'board_presentations' | 'team_leadership' | 'stakeholder_management' | 'product_decisions' | 'crisis_management' | 'vision_setting' | null
          difficulty_level: 'foundation' | 'practice' | 'mastery' | null
          scenario_prompt: string
          context_variables: Json | null
          stakeholder_personas: Json | null
          success_criteria: Json | null
          estimated_duration_minutes: number | null
          tags: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: 'executive_presence' | 'influence_skills' | 'strategic_communication' | 'difficult_conversations' | 'board_presentations' | 'team_leadership' | 'stakeholder_management' | 'product_decisions' | 'crisis_management' | 'vision_setting' | null
          difficulty_level?: 'foundation' | 'practice' | 'mastery' | null
          scenario_prompt: string
          context_variables?: Json | null
          stakeholder_personas?: Json | null
          success_criteria?: Json | null
          estimated_duration_minutes?: number | null
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'executive_presence' | 'influence_skills' | 'strategic_communication' | 'difficult_conversations' | 'board_presentations' | 'team_leadership' | 'stakeholder_management' | 'product_decisions' | 'crisis_management' | 'vision_setting' | null
          difficulty_level?: 'foundation' | 'practice' | 'mastery' | null
          scenario_prompt?: string
          context_variables?: Json | null
          stakeholder_personas?: Json | null
          success_criteria?: Json | null
          estimated_duration_minutes?: number | null
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      generated_scenarios: {
        Row: {
          id: string
          user_id: string
          template_id: string | null
          meeting_id: string | null
          title: string
          personalized_prompt: string
          context_data: Json | null
          stakeholder_data: Json | null
          generation_method: 'meeting_based' | 'user_profile' | 'manual_request' | null
          personalization_factors: Json | null
          times_practiced: number
          average_score: number | null
          last_practiced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id?: string | null
          meeting_id?: string | null
          title: string
          personalized_prompt: string
          context_data?: Json | null
          stakeholder_data?: Json | null
          generation_method?: 'meeting_based' | 'user_profile' | 'manual_request' | null
          personalization_factors?: Json | null
          times_practiced?: number
          average_score?: number | null
          last_practiced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string | null
          meeting_id?: string | null
          title?: string
          personalized_prompt?: string
          context_data?: Json | null
          stakeholder_data?: Json | null
          generation_method?: 'meeting_based' | 'user_profile' | 'manual_request' | null
          personalization_factors?: Json | null
          times_practiced?: number
          average_score?: number | null
          last_practiced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      practice_sessions: {
        Row: {
          id: string
          user_id: string
          scenario_id: string | null
          session_type: 'practice' | 'assessment' | 'guided'
          duration_seconds: number | null
          overall_score: number | null
          executive_presence_score: number | null
          influence_effectiveness_score: number | null
          communication_clarity_score: number | null
          strategic_thinking_score: number | null
          ai_feedback: Json | null
          improvement_suggestions: string[]
          strengths_identified: string[]
          difficulty_attempted: 'foundation' | 'practice' | 'mastery' | null
          completion_status: 'completed' | 'abandoned' | 'in_progress'
          recording_storage_path: string | null
          has_recording: boolean
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          scenario_id?: string | null
          session_type?: 'practice' | 'assessment' | 'guided'
          duration_seconds?: number | null
          overall_score?: number | null
          executive_presence_score?: number | null
          influence_effectiveness_score?: number | null
          communication_clarity_score?: number | null
          strategic_thinking_score?: number | null
          ai_feedback?: Json | null
          improvement_suggestions?: string[]
          strengths_identified?: string[]
          difficulty_attempted?: 'foundation' | 'practice' | 'mastery' | null
          completion_status?: 'completed' | 'abandoned' | 'in_progress'
          recording_storage_path?: string | null
          has_recording?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          scenario_id?: string | null
          session_type?: 'practice' | 'assessment' | 'guided'
          duration_seconds?: number | null
          overall_score?: number | null
          executive_presence_score?: number | null
          influence_effectiveness_score?: number | null
          communication_clarity_score?: number | null
          strategic_thinking_score?: number | null
          ai_feedback?: Json | null
          improvement_suggestions?: string[]
          strengths_identified?: string[]
          difficulty_attempted?: 'foundation' | 'practice' | 'mastery' | null
          completion_status?: 'completed' | 'abandoned' | 'in_progress'
          recording_storage_path?: string | null
          has_recording?: boolean
          created_at?: string
          completed_at?: string | null
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          skill_area: 'executive_presence' | 'influence_skills' | 'strategic_communication' | 'difficult_conversations' | 'board_presentations' | 'team_leadership' | 'stakeholder_management' | 'product_decisions' | 'crisis_management' | 'vision_setting' | null
          current_level: 'foundation' | 'practice' | 'mastery' | null
          skill_score: number | null
          sessions_completed: number
          total_practice_time_minutes: number
          initial_score: number | null
          best_score: number | null
          last_practiced_at: string | null
          recommended_scenarios: string[]
          next_difficulty_level: 'foundation' | 'practice' | 'mastery' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_area?: 'executive_presence' | 'influence_skills' | 'strategic_communication' | 'difficult_conversations' | 'board_presentations' | 'team_leadership' | 'stakeholder_management' | 'product_decisions' | 'crisis_management' | 'vision_setting' | null
          current_level?: 'foundation' | 'practice' | 'mastery' | null
          skill_score?: number | null
          sessions_completed?: number
          total_practice_time_minutes?: number
          initial_score?: number | null
          best_score?: number | null
          last_practiced_at?: string | null
          recommended_scenarios?: string[]
          next_difficulty_level?: 'foundation' | 'practice' | 'mastery' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_area?: 'executive_presence' | 'influence_skills' | 'strategic_communication' | 'difficult_conversations' | 'board_presentations' | 'team_leadership' | 'stakeholder_management' | 'product_decisions' | 'crisis_management' | 'vision_setting' | null
          current_level?: 'foundation' | 'practice' | 'mastery' | null
          skill_score?: number | null
          sessions_completed?: number
          total_practice_time_minutes?: number
          initial_score?: number | null
          best_score?: number | null
          last_practiced_at?: string | null
          recommended_scenarios?: string[]
          next_difficulty_level?: 'foundation' | 'practice' | 'mastery' | null
          created_at?: string
          updated_at?: string
        }
      }
      system_config: {
        Row: {
          id: string
          config_key: string
          config_value: Json
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          config_key: string
          config_value: Json
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          config_key?: string
          config_value?: Json
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ============================================================================
// CONVENIENCE TYPE ALIASES
// ============================================================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

export type Meeting = Database['public']['Tables']['meetings']['Row']
export type MeetingInsert = Database['public']['Tables']['meetings']['Insert']
export type MeetingUpdate = Database['public']['Tables']['meetings']['Update']

export type MeetingAnalysis = Database['public']['Tables']['meeting_analyses']['Row']
export type MeetingAnalysisInsert = Database['public']['Tables']['meeting_analyses']['Insert']
export type MeetingAnalysisUpdate = Database['public']['Tables']['meeting_analyses']['Update']

export type MeetingTranscript = Database['public']['Tables']['meeting_transcripts']['Row']
export type MeetingTranscriptInsert = Database['public']['Tables']['meeting_transcripts']['Insert']
export type MeetingTranscriptUpdate = Database['public']['Tables']['meeting_transcripts']['Update']

export type ScenarioTemplate = Database['public']['Tables']['scenario_templates']['Row']
export type ScenarioTemplateInsert = Database['public']['Tables']['scenario_templates']['Insert']
export type ScenarioTemplateUpdate = Database['public']['Tables']['scenario_templates']['Update']

export type GeneratedScenario = Database['public']['Tables']['generated_scenarios']['Row']
export type GeneratedScenarioInsert = Database['public']['Tables']['generated_scenarios']['Insert']
export type GeneratedScenarioUpdate = Database['public']['Tables']['generated_scenarios']['Update']

export type PracticeSession = Database['public']['Tables']['practice_sessions']['Row']
export type PracticeSessionInsert = Database['public']['Tables']['practice_sessions']['Insert']
export type PracticeSessionUpdate = Database['public']['Tables']['practice_sessions']['Update']

export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert']
export type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update']

export type SystemConfig = Database['public']['Tables']['system_config']['Row']
export type SystemConfigInsert = Database['public']['Tables']['system_config']['Insert']
export type SystemConfigUpdate = Database['public']['Tables']['system_config']['Update']

// ============================================================================
// EXTENDED TYPES WITH RELATIONSHIPS
// ============================================================================

export interface ProfileWithPreferences extends Profile {
  user_preferences?: UserPreferences
}

export interface MeetingWithAnalysis extends Meeting {
  meeting_analyses?: MeetingAnalysis[]
}

export interface GeneratedScenarioWithTemplate extends GeneratedScenario {
  scenario_templates?: ScenarioTemplate
  meetings?: Meeting
}

export interface PracticeSessionWithScenario extends PracticeSession {
  generated_scenarios?: GeneratedScenarioWithTemplate
}

export interface UserProgressComplete extends UserProgress {
  recent_sessions?: PracticeSession[]
  recommended_scenario_details?: ScenarioTemplate[]
}

// ============================================================================
// SKILL AREA ENUMS
// ============================================================================

export const SKILL_AREAS = [
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
] as const

export type SkillArea = typeof SKILL_AREAS[number]

export const DIFFICULTY_LEVELS = ['foundation', 'practice', 'mastery'] as const
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number]

export const PM_ROLES = [
  'ic_pm',
  'senior_pm',
  'staff_pm',
  'principal_pm',
  'director',
  'vp',
  'po_transitioning'
] as const
export type PMRole = typeof PM_ROLES[number]

export const COMPANY_SIZES = ['startup', 'small', 'medium', 'large', 'enterprise'] as const
export type CompanySize = typeof COMPANY_SIZES[number]

export const MEETING_TYPES = [
  'one_on_one',
  'team_standup',
  'executive_review',
  'client_meeting',
  'board_presentation',
  'product_review',
  'other'
] as const
export type MeetingType = typeof MEETING_TYPES[number]

export const MEETING_STATUSES = ['uploaded', 'processing', 'analyzed', 'failed'] as const
export type MeetingStatus = typeof MEETING_STATUSES[number]

export const SAMPLING_PRESETS = [
  'COST_OPTIMIZED',
  'BALANCED',
  'QUALITY_FOCUSED',
  'ENTERPRISE',
  'CUSTOM'
] as const
export type SamplingPreset = typeof SAMPLING_PRESETS[number]

export const SESSION_TYPES = ['practice', 'assessment', 'guided'] as const
export type SessionType = typeof SESSION_TYPES[number]

export const COMPLETION_STATUSES = ['completed', 'abandoned', 'in_progress'] as const
export type CompletionStatus = typeof COMPLETION_STATUSES[number]

export const GENERATION_METHODS = ['meeting_based', 'user_profile', 'manual_request'] as const
export type GenerationMethod = typeof GENERATION_METHODS[number]

export const AI_FEEDBACK_STYLES = ['direct', 'supportive', 'detailed'] as const
export type AIFeedbackStyle = typeof AI_FEEDBACK_STYLES[number]

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface DashboardData {
  profile: ProfileWithPreferences
  recentMeetings: MeetingWithAnalysis[]
  recentSessions: PracticeSessionWithScenario[]
  skillProgress: UserProgress[]
  availableScenarios: ScenarioTemplate[]
}

export interface AnalysisResult {
  meetingId: string
  scores: {
    overall: number
    executivePresence: number
    influenceSkills: number
    communicationStructure: number
  }
  feedback: {
    strengths: string[]
    improvements: string[]
    detailedAnalysis: any
  }
  costMetrics: {
    processingCost: number
    estimatedFullCost: number
    savingsPercentage: number
  }
}

export interface ScenarioPersonalization {
  userId: string
  templateId: string
  contextVariables: Record<string, any>
  stakeholderData: Record<string, any>
  meetingContext?: {
    meetingId: string
    analysisInsights: any
  }
}