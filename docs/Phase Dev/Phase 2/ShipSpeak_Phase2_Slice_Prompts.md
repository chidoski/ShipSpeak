# ShipSpeak Phase 2
# Integration Slice Prompts
## Backend Integration & Production Infrastructure
## Version 1.0 | November 4, 2025
# Executive Summary
This document provides complete specifications for building ShipSpeak Phase 2—transforming the validated frontend experience from Phase 1 into a production-ready platform with real backend integrations. Phase 2 maintains the identical user interface while replacing all mock data with live services, enabling the platform to analyze actual meetings, generate real AI feedback, and provide genuine value to Product Managers.
### Development Approach
Systematic integration that preserves validated UX while methodically replacing each mock data source with corresponding production integration
### Key Statistics
| Duration | Total Hours | Total Slices |
| --- | --- | --- |
| 4 weeks | 36-44 hours | 13 slices |

### What Gets Built
**Production authentication (Supabase Auth)**
**Database persistence (PostgreSQL via Supabase)**
**Real meeting bots (Recall.ai integration)**
**Audio transcription (Deepgram)**
**AI analysis & feedback (OpenAI GPT-4)**
**Practice recording pipeline (browser → storage → transcription → AI)**
**Real-time updates (Supabase real-time subscriptions)**
**Error handling & recovery**
### Critical Success Factors
Preserve validated UI/UX completely—users should not notice visual changes
Test each integration point independently before connecting dependent systems
Implement comprehensive error handling for production reliability
Maintain user privacy through bot discretion features
Enable immediate feedback loops for practice exercises (<10 seconds)
# Table of Contents
Phase 2A: Authentication & Data Foundation
Slice 16: Supabase Authentication Integration (3-4 hours)
Slice 17: Database Schema Implementation (3 hours)
Slice 18: User Profile & Settings Persistence (2-3 hours)
Phase 2B: Meeting Intelligence Integration
Slice 19: Calendar Integration & Bot Scheduling (4 hours)
Slice 20: Meeting Bot Lifecycle (Recall.ai) (4-5 hours)
Slice 21: Transcript Generation Pipeline (Deepgram) (2-3 hours)
Slice 22: AI Analysis & Feedback (OpenAI) (4-5 hours)
Phase 2C: Practice & Learning Integration
Slice 23: Practice Recording Upload Pipeline (3 hours)
Slice 24: Practice Transcription (Deepgram) (2-3 hours)
Slice 25: Practice Feedback Generation (OpenAI) (3-4 hours)
Phase 2D: Real-Time Updates & Polish
Slice 26: Real-Time Status Updates (Supabase) (3 hours)
Slice 27: Error Handling & Recovery (3 hours)
Slice 28: Performance Optimization (2-4 hours)
# Phase 2A: Authentication & Data Foundation
*Week 1 | 8-10 hours | 3 slices*
Phase 2A establishes the foundational infrastructure that all subsequent integrations depend upon. The authentication system transitions from mock localStorage to production-grade Supabase auth, enabling secure user management and session handling. The database schema implementation creates the structure for persisting all user data, meeting records, and learning progress.
## Slice 16: Supabase Authentication Integration
*Duration: 3-4 hours | Dependencies: Phase 1 complete*
### What to Deliver
Replace mock localStorage authentication with production Supabase auth while preserving exact user flows from Phase 1. Users experience identical signup and login interfaces, but credentials now validate against Supabase auth rather than localStorage.
### Integration Points
Supabase Auth SDK configured in Next.js application
Environment variables for Supabase URL and anon key
Auth state provider wrapping application
Session persistence in HTTP-only cookies
Middleware for protected route authentication
### User Registration Flow
The signup form from Phase 1 (email, password, name) now invokes Supabase's signup method instead of localStorage. When users submit the form:
Form submission calls supabase.auth.signUp() with email and password
Supabase creates user account and sends verification email
System receives session object with user ID and access tokens
Session stored in HTTP-only cookie for security
User redirects to onboarding with session active
Onboarding data (current role, target role, timeline, path choice) persists to database after account creation
### Session Management Implementation
Session persistence operates transparently, maintaining logged-in state across browser sessions:
**Automatic token refresh:** Expired tokens refresh using stored refresh token
**Session validation on load:** Application checks for valid session on every page load
**Protected route handling:** Middleware validates session before rendering content
**Post-login redirect:** Original URL preserved in query parameter for return after authentication
### Password Reset Workflow
Users access password reset through a dedicated form accepting their email address:
User submits email address through reset request form
Supabase sends time-limited reset link via email with secure token
Clicking link directs to password reset page (new page to build)
User enters new password (with confirmation field and validation)
System validates token and updates password in Supabase
User automatically logged in with fresh session
### Technical Implementation Details
// Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
// Environment configuration (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
The authentication provider wraps the application, making auth state available throughout:
// lib/supabase/client.ts - Supabase client configuration
// components/providers/AuthProvider.tsx - React context for auth state
// middleware.ts - Route protection and session validation
### Files to Modify
app/login/page.tsx - Replace mock auth with Supabase signIn()
app/signup/page.tsx - Replace mock auth with Supabase signUp()
app/layout.tsx - Wrap with AuthProvider
components/auth/LoginForm.tsx - Update submit handler
components/auth/SignupForm.tsx - Update submit handler
### New Files to Create
lib/supabase/client.ts - Supabase client singleton
lib/supabase/server.ts - Server-side Supabase client
components/providers/AuthProvider.tsx - Auth context provider
hooks/useAuth.ts - Auth hook for accessing user state
middleware.ts - Protected route middleware
app/reset-password/page.tsx - Password reset page
### Acceptance Criteria
Users can sign up with email and password
Verification email sends successfully
Users can log in with valid credentials
Invalid credentials show appropriate error message
Session persists across browser close and reopen
Protected routes redirect to login when unauthenticated
Post-login redirect works correctly to intended destination
Password reset email sends and link works
New password saves and allows immediate login
Token refresh happens automatically before expiration
Logout clears session completely
No console errors related to authentication
UI remains identical to Phase 1 (no visual changes)
## Slice 17: Database Schema Implementation
*Duration: 3 hours | Dependencies: Slice 16*
### What to Deliver
Complete PostgreSQL database schema in Supabase that translates the application's data model into a normalized structure optimized for query patterns observed during Phase 1. The schema balances normalization for data integrity with strategic denormalization for query performance.
### Database Tables Overview
The schema organizes into four functional areas:
| User Management | Meeting Intelligence | Learning & Practice | Progress Analytics |
| --- | --- | --- | --- |
| profiles bot_configs | meetings transcript_segments meeting_feedback | modules exercises practice_sessions module_progress | progress_snapshots |

### Core Table Structures
### profiles Table
Stores user-specific data including current role, target role, career timeline, and progress metrics. Links to auth.users via user_id.
Columns:
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- email: TEXT
- name: TEXT
- current_role: TEXT (PM, Senior PM, etc.)
- target_role: TEXT
- timeline_months: INTEGER
- onboarding_path: TEXT ('meeting_analysis' or 'practice_first')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
### bot_configs Table
Stores meeting bot configuration including custom name, meeting type filters, and exit rules.
Columns:
- id: UUID (primary key)
- user_id: UUID (foreign key to profiles)
- bot_name: TEXT (custom name or preset)
- meeting_types: TEXT[] (array: board_meeting, team_meeting, etc.)
- exit_rules: JSONB (participant list, keywords, time limits)
- is_active: BOOLEAN
- created_at: TIMESTAMP
### meetings Table
Captures meeting metadata including title, scheduled time, duration, type, and processing status.
Columns:
- id: UUID (primary key)
- user_id: UUID (foreign key to profiles)
- title: TEXT
- scheduled_time: TIMESTAMP
- actual_start_time: TIMESTAMP
- duration_minutes: INTEGER
- meeting_type: TEXT
- platform: TEXT (zoom, google_meet, teams)
- participants: JSONB (array of participant objects)
- status: TEXT (scheduled, in_progress, processing, completed, failed)
- recall_bot_id: TEXT (ID from Recall.ai)
- audio_url: TEXT (location of recorded audio)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
### transcript_segments Table
Stores individual speaker turns from meeting transcripts with speaker attribution and timestamps.
Columns:
- id: UUID (primary key)
- meeting_id: UUID (foreign key to meetings)
- speaker_id: TEXT
- speaker_name: TEXT
- speaker_role: TEXT
- is_user: BOOLEAN (marks user's segments)
- text: TEXT (what was said)
- timestamp_seconds: INTEGER (offset from start)
- duration_seconds: INTEGER
- confidence_score: DECIMAL (transcription confidence)
- key_moment: JSONB (type, feedback, related_skill if applicable)
- created_at: TIMESTAMP
### meeting_feedback Table
Stores AI-generated analysis and feedback for meetings with scores, patterns, and recommendations.
Columns:
- id: UUID (primary key)
- meeting_id: UUID (foreign key to meetings, one-to-one)
- overall_score: DECIMAL
- product_sense_score: DECIMAL
- communication_score: DECIMAL
- stakeholder_mgmt_score: DECIMAL
- technical_translation_score: DECIMAL
- score_trend: DECIMAL (compared to previous meeting)
- summary: TEXT (2-3 sentence overview)
- patterns: JSONB (strengths, improvements, missed opportunities)
- key_moments: JSONB (array of annotated moments)
- recommended_modules: JSONB (array of module recommendations)
- next_steps: JSONB (array of actionable steps)
- career_assessment: JSONB (level consistency, skill breakdown)
- created_at: TIMESTAMP
### Implementation Approach
Create the schema through Supabase migration scripts that version control all schema changes:
Create migration file: supabase/migrations/20250104_initial_schema.sql
Define all tables with CREATE TABLE statements
Add foreign key constraints linking tables
Create indexes on commonly queried columns
Set up row-level security (RLS) policies
Create database triggers (e.g., profile creation on user signup)
Run migration: npx supabase db push
### Row-Level Security Policies
Each table requires RLS policies ensuring users can only access their own data:
profiles: Users can read and update their own profile only
meetings: Users can only see meetings where user_id matches their ID
transcript_segments: Accessible only through parent meeting RLS policy
practice_sessions: Users can only access their own practice attempts
### Critical Indexes
Optimize common query patterns with indexes:
meetings(user_id, scheduled_time DESC) - Meeting list queries
transcript_segments(meeting_id, timestamp_seconds) - Transcript display
practice_sessions(user_id, created_at DESC) - Practice history
module_progress(user_id, module_id) - Learning progress lookups
### Acceptance Criteria
All tables created successfully in Supabase
Foreign key relationships enforced correctly
RLS policies prevent unauthorized data access
Indexes created on critical columns
Profile creation trigger fires on user signup
Can insert test data into all tables
Can query joined data (e.g., meetings with feedback)
Migration script runs without errors
Schema documented with comments in SQL
## Slice 18: User Profile & Settings Persistence
*Duration: 2-3 hours | Dependencies: Slices 16-17*
### What to Deliver
Replace localStorage storage for user profile and settings with database persistence. All onboarding data, bot configurations, and user preferences now save to and load from the database.
### Integration Points
Onboarding completion saves profile data to database
Bot configuration wizard creates bot_configs record
Settings page reads from and writes to profiles table
Dashboard loads user data from database on page load
### Onboarding Data Flow
When users complete onboarding:
Step 1 (About You) data stores in component state temporarily
Step 2 (Career Goals) adds to component state
Step 3 (Path Choice) triggers database write with all collected data
If Path A selected: Additional API call creates bot_configs record
If Path B selected: Profile updates with onboarding_path = 'practice_first'
User redirects to dashboard with complete profile
### Bot Configuration Persistence
Bot configuration wizard (accessed during onboarding or from settings) saves:
Custom bot name or selected preset
Array of meeting types to join (board_meeting, team_meeting, etc.)
Exit rules as JSONB object containing:
Participant names triggering exit
Keywords triggering exit
Maximum attendance duration
### API Endpoints to Create
POST /api/profile - Create or update user profile
GET /api/profile - Retrieve current user's profile
POST /api/bot-config - Create or update bot configuration
GET /api/bot-config - Retrieve current bot configuration
### Acceptance Criteria
Onboarding data saves to profiles table on completion
Bot configuration saves to bot_configs table
Dashboard loads user profile from database
Settings page displays current values from database
Settings changes persist across sessions
Profile updates show immediately after save
No localStorage usage for profile data
Error handling for failed database writes
# Phase 2B: Meeting Intelligence Integration
*Week 2-3 | 12-15 hours | 4 slices*
Phase 2B implements the core value proposition: analyzing real work meetings to provide personalized coaching feedback. This phase connects calendar systems, deploys meeting bots, processes transcripts, and generates AI analysis.
## Remaining Slices Summary
### Slice 19: Calendar Integration & Bot Scheduling (4 hours)
Connect Google Calendar, Microsoft Outlook, and Zoom via OAuth. Poll calendars every 15 minutes for upcoming meetings matching bot configuration. Create bot scheduling records in database.
### Slice 20: Meeting Bot Lifecycle - Recall.ai (4-5 hours)
Integrate Recall.ai for bot deployment. Handle bot joining meetings, audio capture throughout duration, exit rule evaluation, and audio handoff. Implement webhook receiver for meeting completion notifications.
### Slice 21: Transcript Generation Pipeline - Deepgram (2-3 hours)
Process meeting audio through Deepgram for transcription. Generate structured transcript segments with speaker attribution, timestamps, and confidence scores. Store in database with full-text search indexes.
### Slice 22: AI Analysis & Feedback - OpenAI (4-5 hours)
Generate comprehensive meeting feedback using GPT-4. Analyze transcripts for communication patterns, score across dimensions, identify key moments, recommend modules, and create actionable next steps.
### Phase 2C: Practice & Learning Integration
### Slice 23: Practice Recording Upload Pipeline (3 hours)
Upload browser-captured audio to Supabase Storage. Organize by user and practice session. Implement automatic expiration policies (90 days unless bookmarked).
### Slice 24: Practice Transcription - Deepgram (2-3 hours)
Transcribe practice recordings optimized for single-speaker content. Target <3 second processing time for immediate feedback. Store transcripts linked to practice sessions.
### Slice 25: Practice Feedback Generation - OpenAI (3-4 hours)
Generate criteria-based feedback on practice attempts. Compare to expert examples, annotate transcript moments, and recommend next exercises based on performance.
### Phase 2D: Real-Time Updates & Polish
### Slice 26: Real-Time Status Updates - Supabase (3 hours)
Implement Supabase real-time subscriptions for live status updates. Meeting processing status, progress metrics, and practice completion results update instantly without page refresh.
### Slice 27: Error Handling & Recovery (3 hours)
Comprehensive error handling for API failures, bot join issues, transcription errors, and analysis timeouts. Implement retry logic, user notifications, and fallback mechanisms.
### Slice 28: Performance Optimization (2-4 hours)
Database query optimization, caching strategies, and background job distribution. Ensure responsive performance as data accumulates and concurrent users increase.
# Implementation Guidelines
### Core Principles
**UI Preservation:** Keep Phase 1 interface identical—only data sources change
**Incremental Testing:** Test each integration independently before connecting downstream systems
**Error First:** Implement error handling alongside each integration point
**Privacy Always:** Maintain bot discretion and user control throughout
### Testing Strategy
Unit test each API endpoint independently
Integration test data flows between services
End-to-end test complete user journeys
Load test with realistic concurrent users
Resilience test with deliberate failures
### Monitoring & Observability
Implement comprehensive monitoring from the start:
Bot join success rate (target >95%)
Transcription completion time (target <5 min per hour)
Analysis generation time (target <2 min)
Practice feedback latency (target <10 sec)
Error rates across all integrations
# Phase 2 Completion Checklist
### Authentication & Data (Phase 2A)
Supabase auth working for signup, login, password reset
Sessions persist across browser sessions
All database tables created with RLS policies
Profile and bot config data saving to database
### Meeting Intelligence (Phase 2B)
Calendar OAuth connections working
Bots joining meetings with configured identity
Audio transcribing with speaker attribution
AI feedback generating with all 7 sections
Exit rules triggering correctly
### Practice & Learning (Phase 2C)
Practice recordings uploading to storage
Practice transcription completing in <10 seconds
Practice feedback generating with annotations
Progress tracking across multiple attempts
### Polish & Production (Phase 2D)
Real-time updates working without page refresh
Error handling graceful with user notifications
Performance optimized (queries cached, jobs queued)
Monitoring dashboards showing key metrics
### Launch Readiness
Beta users migrated from Phase 1
End-to-end user journeys tested
Support documentation complete
Monitoring and alerting configured
Production environment ready
# Appendix: Technology Stack
| Component | Technology |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Authentication | Supabase Auth |
| Database | PostgreSQL (via Supabase) |
| Hosting | Vercel |
| Meeting Bots | Recall.ai |
| Transcription | Deepgram |
| AI Analysis | OpenAI GPT-4 |
| Storage | Supabase Storage |
| Real-time | Supabase Real-time Subscriptions |

*End of Document*
