-- ShipSpeak Initial Schema Migration
-- Migration: 001_initial_schema.up.sql
-- Description: Create complete database schema with RLS policies
-- Version: 1.0
-- Created: 2025-11-11

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- User profiles with PM-specific data
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    
    -- PM-specific profile data
    current_role TEXT CHECK (current_role IN ('ic_pm', 'senior_pm', 'staff_pm', 'principal_pm', 'director', 'vp', 'po_transitioning')),
    experience_years INTEGER CHECK (experience_years >= 0),
    company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    industry TEXT,
    
    -- Learning preferences
    preferred_difficulty TEXT CHECK (preferred_difficulty IN ('foundation', 'practice', 'mastery')) DEFAULT 'foundation',
    focus_areas TEXT[] DEFAULT '{}', -- Array of focus areas like ['executive_presence', 'influence_skills']
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT true,
    practice_reminders BOOLEAN DEFAULT true,
    weekly_summary BOOLEAN DEFAULT true,
    
    -- Privacy settings
    data_retention_days INTEGER DEFAULT 90,
    allow_meeting_recording BOOLEAN DEFAULT false,
    
    -- AI preferences
    ai_feedback_style TEXT CHECK (ai_feedback_style IN ('direct', 'supportive', 'detailed')) DEFAULT 'supportive',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- ============================================================================
-- MEETING RECORDS & ANALYSIS
-- ============================================================================

-- Meeting uploads and metadata
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Meeting metadata
    title TEXT,
    meeting_type TEXT CHECK (meeting_type IN ('one_on_one', 'team_standup', 'executive_review', 'client_meeting', 'board_presentation', 'product_review', 'other')),
    duration_seconds INTEGER,
    participant_count INTEGER,
    
    -- File information
    original_filename TEXT,
    file_size_bytes BIGINT,
    file_format TEXT,
    storage_path TEXT, -- Path in Supabase storage
    
    -- Processing status
    status TEXT CHECK (status IN ('uploaded', 'processing', 'analyzed', 'failed')) DEFAULT 'uploaded',
    error_message TEXT,
    
    -- Privacy and consent
    has_consent BOOLEAN DEFAULT false,
    consent_participants TEXT[], -- Array of participant names who gave consent
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting analysis results from Smart Sampling Engine
CREATE TABLE IF NOT EXISTS meeting_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    
    -- Smart Sampling configuration used
    sampling_preset TEXT CHECK (sampling_preset IN ('COST_OPTIMIZED', 'BALANCED', 'QUALITY_FOCUSED', 'ENTERPRISE', 'CUSTOM')),
    sampling_percentage DECIMAL(5,2), -- e.g., 25.50 for 25.5%
    total_chunks INTEGER,
    analyzed_chunks INTEGER,
    
    -- Analysis results
    overall_score DECIMAL(3,2) CHECK (overall_score >= 0 AND overall_score <= 10),
    executive_presence_score DECIMAL(3,2),
    influence_skills_score DECIMAL(3,2),
    communication_structure_score DECIMAL(3,2),
    
    -- Detailed feedback (JSON)
    detailed_feedback JSONB,
    improvement_areas TEXT[],
    strengths TEXT[],
    
    -- Cost tracking
    processing_cost_usd DECIMAL(10,4),
    estimated_full_cost_usd DECIMAL(10,4),
    cost_savings_percentage DECIMAL(5,2),
    
    -- Processing metadata
    processing_time_seconds INTEGER,
    openai_model_used TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting transcripts (chunked for processing)
CREATE TABLE IF NOT EXISTS meeting_transcripts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    
    -- Chunk information
    chunk_index INTEGER,
    start_time_seconds DECIMAL(10,3),
    end_time_seconds DECIMAL(10,3),
    
    -- Content
    transcript_text TEXT,
    speaker_labels JSONB, -- Speaker diarization data
    confidence_score DECIMAL(3,2),
    
    -- Sampling metadata
    was_analyzed BOOLEAN DEFAULT false,
    sampling_reason TEXT, -- Why this chunk was/wasn't selected
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(meeting_id, chunk_index)
);

-- ============================================================================
-- SCENARIO SYSTEM
-- ============================================================================

-- Base scenario templates (from Scenario Generation Engine)
CREATE TABLE IF NOT EXISTS scenario_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Template metadata
    name TEXT NOT NULL,
    category TEXT CHECK (category IN (
        'executive_presence', 'influence_skills', 'strategic_communication',
        'difficult_conversations', 'board_presentations', 'team_leadership',
        'stakeholder_management', 'product_decisions', 'crisis_management', 'vision_setting'
    )),
    difficulty_level TEXT CHECK (difficulty_level IN ('foundation', 'practice', 'mastery')),
    
    -- Template content
    scenario_prompt TEXT NOT NULL,
    context_variables JSONB, -- Available personalization variables
    stakeholder_personas JSONB, -- Array of stakeholder types
    success_criteria JSONB,
    
    -- Metadata
    estimated_duration_minutes INTEGER,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-specific generated scenarios
CREATE TABLE IF NOT EXISTS generated_scenarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES scenario_templates(id),
    meeting_id UUID REFERENCES meetings(id), -- NULL if not meeting-based
    
    -- Personalized content
    title TEXT NOT NULL,
    personalized_prompt TEXT NOT NULL,
    context_data JSONB, -- User-specific context variables
    stakeholder_data JSONB, -- Personalized stakeholder information
    
    -- Generation metadata
    generation_method TEXT CHECK (generation_method IN ('meeting_based', 'user_profile', 'manual_request')),
    personalization_factors JSONB,
    
    -- Usage tracking
    times_practiced INTEGER DEFAULT 0,
    average_score DECIMAL(3,2),
    last_practiced_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRACTICE SESSIONS & PERFORMANCE
-- ============================================================================

-- Individual practice sessions
CREATE TABLE IF NOT EXISTS practice_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES generated_scenarios(id),
    
    -- Session metadata
    session_type TEXT CHECK (session_type IN ('practice', 'assessment', 'guided')) DEFAULT 'practice',
    duration_seconds INTEGER,
    
    -- Performance scores
    overall_score DECIMAL(3,2) CHECK (overall_score >= 0 AND overall_score <= 10),
    executive_presence_score DECIMAL(3,2),
    influence_effectiveness_score DECIMAL(3,2),
    communication_clarity_score DECIMAL(3,2),
    strategic_thinking_score DECIMAL(3,2),
    
    -- Detailed feedback
    ai_feedback JSONB,
    improvement_suggestions TEXT[],
    strengths_identified TEXT[],
    
    -- Progress tracking
    difficulty_attempted TEXT CHECK (difficulty_attempted IN ('foundation', 'practice', 'mastery')),
    completion_status TEXT CHECK (completion_status IN ('completed', 'abandoned', 'in_progress')) DEFAULT 'in_progress',
    
    -- Session recording (optional)
    recording_storage_path TEXT,
    has_recording BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- User progress and skill development tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Skill area tracking
    skill_area TEXT CHECK (skill_area IN (
        'executive_presence', 'influence_skills', 'strategic_communication',
        'difficult_conversations', 'board_presentations', 'team_leadership',
        'stakeholder_management', 'product_decisions', 'crisis_management', 'vision_setting'
    )),
    
    -- Progress metrics
    current_level TEXT CHECK (current_level IN ('foundation', 'practice', 'mastery')),
    skill_score DECIMAL(3,2) CHECK (skill_score >= 0 AND skill_score <= 10),
    sessions_completed INTEGER DEFAULT 0,
    total_practice_time_minutes INTEGER DEFAULT 0,
    
    -- Improvement tracking
    initial_score DECIMAL(3,2),
    best_score DECIMAL(3,2),
    last_practiced_at TIMESTAMPTZ,
    
    -- Personalized recommendations
    recommended_scenarios UUID[], -- Array of scenario IDs
    next_difficulty_level TEXT CHECK (next_difficulty_level IN ('foundation', 'practice', 'mastery')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, skill_area)
);

-- ============================================================================
-- SYSTEM CONFIGURATION & METADATA
-- ============================================================================

-- System-wide configuration for AI services
CREATE TABLE IF NOT EXISTS system_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User and profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(current_role);

-- Meeting indexes
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at);

-- Analysis indexes
CREATE INDEX IF NOT EXISTS idx_meeting_analyses_meeting_id ON meeting_analyses(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_transcripts_meeting_id ON meeting_transcripts(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_transcripts_was_analyzed ON meeting_transcripts(was_analyzed);

-- Scenario indexes
CREATE INDEX IF NOT EXISTS idx_scenario_templates_category ON scenario_templates(category);
CREATE INDEX IF NOT EXISTS idx_scenario_templates_difficulty ON scenario_templates(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_generated_scenarios_user_id ON generated_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_scenarios_meeting_id ON generated_scenarios(meeting_id);

-- Practice session indexes
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_scenario_id ON practice_sessions(scenario_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_created_at ON practice_sessions(created_at);

-- Progress tracking indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_skill_area ON user_progress(skill_area);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all user-specific tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can manage own meetings" ON meetings;
DROP POLICY IF EXISTS "Users can view own meeting analyses" ON meeting_analyses;
DROP POLICY IF EXISTS "Users can view own meeting transcripts" ON meeting_transcripts;
DROP POLICY IF EXISTS "Users can manage own scenarios" ON generated_scenarios;
DROP POLICY IF EXISTS "Users can manage own practice sessions" ON practice_sessions;
DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;
DROP POLICY IF EXISTS "Authenticated users can view scenario templates" ON scenario_templates;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meetings" ON meetings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own meeting analyses" ON meeting_analyses FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM meetings WHERE meetings.id = meeting_analyses.meeting_id)
);
CREATE POLICY "Users can view own meeting transcripts" ON meeting_transcripts FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM meetings WHERE meetings.id = meeting_transcripts.meeting_id)
);
CREATE POLICY "Users can manage own scenarios" ON generated_scenarios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own practice sessions" ON practice_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- Scenario templates are readable by all authenticated users
CREATE POLICY "Authenticated users can view scenario templates" ON scenario_templates FOR SELECT TO authenticated;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
DROP TRIGGER IF EXISTS update_scenario_templates_updated_at ON scenario_templates;
DROP TRIGGER IF EXISTS update_generated_scenarios_updated_at ON generated_scenarios;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
DROP TRIGGER IF EXISTS update_system_config_updated_at ON system_config;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenario_templates_updated_at BEFORE UPDATE ON scenario_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_scenarios_updated_at BEFORE UPDATE ON generated_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();