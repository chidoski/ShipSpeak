-- ShipSpeak Initial Schema Rollback Migration
-- Migration: 001_initial_schema.down.sql
-- Description: Rollback complete database schema
-- Version: 1.0
-- Created: 2025-11-11

-- ============================================================================
-- DROP TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Drop auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop update triggers
DROP TRIGGER IF EXISTS update_system_config_updated_at ON system_config;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
DROP TRIGGER IF EXISTS update_generated_scenarios_updated_at ON generated_scenarios;
DROP TRIGGER IF EXISTS update_scenario_templates_updated_at ON scenario_templates;
DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================================================
-- DROP ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Drop all RLS policies
DROP POLICY IF EXISTS "Authenticated users can view scenario templates" ON scenario_templates;
DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can manage own practice sessions" ON practice_sessions;
DROP POLICY IF EXISTS "Users can manage own scenarios" ON generated_scenarios;
DROP POLICY IF EXISTS "Users can view own meeting transcripts" ON meeting_transcripts;
DROP POLICY IF EXISTS "Users can view own meeting analyses" ON meeting_analyses;
DROP POLICY IF EXISTS "Users can manage own meetings" ON meetings;
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- ============================================================================
-- DROP INDEXES
-- ============================================================================

-- Progress tracking indexes
DROP INDEX IF EXISTS idx_user_progress_skill_area;
DROP INDEX IF EXISTS idx_user_progress_user_id;

-- Practice session indexes
DROP INDEX IF EXISTS idx_practice_sessions_created_at;
DROP INDEX IF EXISTS idx_practice_sessions_scenario_id;
DROP INDEX IF EXISTS idx_practice_sessions_user_id;

-- Scenario indexes
DROP INDEX IF EXISTS idx_generated_scenarios_meeting_id;
DROP INDEX IF EXISTS idx_generated_scenarios_user_id;
DROP INDEX IF EXISTS idx_scenario_templates_difficulty;
DROP INDEX IF EXISTS idx_scenario_templates_category;

-- Analysis indexes
DROP INDEX IF EXISTS idx_meeting_transcripts_was_analyzed;
DROP INDEX IF EXISTS idx_meeting_transcripts_meeting_id;
DROP INDEX IF EXISTS idx_meeting_analyses_meeting_id;

-- Meeting indexes
DROP INDEX IF EXISTS idx_meetings_created_at;
DROP INDEX IF EXISTS idx_meetings_status;
DROP INDEX IF EXISTS idx_meetings_user_id;

-- User and profile indexes
DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_profiles_email;

-- ============================================================================
-- DROP TABLES (in reverse dependency order)
-- ============================================================================

-- Drop system configuration
DROP TABLE IF EXISTS system_config CASCADE;

-- Drop practice and progress tables
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;

-- Drop scenario system tables
DROP TABLE IF EXISTS generated_scenarios CASCADE;
DROP TABLE IF EXISTS scenario_templates CASCADE;

-- Drop meeting analysis tables
DROP TABLE IF EXISTS meeting_transcripts CASCADE;
DROP TABLE IF EXISTS meeting_analyses CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;

-- Drop user tables
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- DROP EXTENSIONS (optional - only if they were created for this schema)
-- ============================================================================

-- Note: We don't drop extensions as they might be used by other schemas
-- DROP EXTENSION IF EXISTS "pgcrypto";
-- DROP EXTENSION IF EXISTS "uuid-ossp";