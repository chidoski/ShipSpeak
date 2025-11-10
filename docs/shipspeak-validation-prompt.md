# ShipSpeak Validation Checklist Generator (for Claude Web Browser)

Use this prompt in Claude web browser AFTER implementing a slice to generate a validation checklist.

**Important:** The generated checklist will be pasted into Claude Code for automated validation.

---

## PROJECT CONTEXT

**ShipSpeak** is an AI-powered product leadership development platform that integrates Meeting Intelligence with personalized practice modules. The platform captures real meetings, analyzes communication patterns using Smart Sampling, and generates adaptive learning modules via the Scenario Generation Engine.

### Core Business Model: Meeting Intelligence → Practice Module Generation

1. **Meeting Intelligence:** Captures real meetings through Chrome extension, desktop app, or file upload
2. **Smart Sampling:** AI-powered analysis with 75% cost reduction ($0.10 per 30-min meeting)
3. **Scenario Generation:** Auto-generated practice modules from real meeting content (1,125+ context variable combinations)
4. **Adaptive Learning:** Progressive difficulty system (Foundation → Practice → Mastery)

### Core Value Propositions

- **Real Work Integration:** Practice with actual meeting content, not hypothetical scenarios
- **Meeting-Driven Personalization:** AI identifies specific communication gaps from real meetings
- **Executive Communication:** Product sense development combined with influence training
- **Career Advancement:** PM → Senior PM → Director progression tracking

### User Personas

1. **Sarah Chen** - Senior PM → Director/VP (Executive presence, C-suite meetings)
2. **Marcus Rodriguez** - IC → Staff/Principal PM (Strategic narrative, influence skills)  
3. **Alex Martinez** - PO → PM Transition (Strategic thinking, business vocabulary)
4. **Jennifer Kim** - New PM Leader (Altitude control, board presentations)
5. **David Thompson** - Engineer → PM (PM vocabulary, customer focus)

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode, no `any` types)
- **Database:** Supabase PostgreSQL with RLS security
- **AI/ML:** OpenAI GPT-4 + Whisper, Smart Sampling Engine, Scenario Generation Engine
- **Analytics:** Custom analytics with IDs only, no PII
- **Auth:** Supabase Auth
- **Integrations:** Chrome Extension, Desktop App (Electron), File Upload System

### Critical Requirements

**Security (Non-Negotiable):**
- Server-side enforcement ALWAYS (never trust client)
- No PII in logs or analytics (IDs only)
- All secrets in environment variables
- Meeting data privacy protections (temporary storage only)
- Usage-based enforcement server-side (no tier gating)
- WCAG AA accessibility compliance
- Audio data security and encryption

**TDD Approach:**
- Tests written BEFORE implementation
- Red → Green → Refactor cycle
- Unit tests for business logic
- Integration tests for APIs/database
- AI service integration tests
- E2E tests for critical user journeys

**Meeting Intelligence Rules:**
- Smart Sampling cost optimization enforced
- Real-time progress updates via WebSocket
- Meeting analysis accurate and actionable
- Practice module generation tied to actual meeting content
- Privacy-first approach to meeting data
- Usage tracking for optimization

**Performance Targets:**
- API endpoints: <500ms response time
- Database queries: <500ms
- Dashboard page loads: <2 seconds
- No N+1 queries
- OpenAI API calls optimized per Smart Sampling patterns
- Real-time updates <100ms latency

---

## SLICE SPECIFICATION

**Phase:** [PHASE_NUMBER]
**Slice ID:** [SLICE_ID]
**Slice Name:** [SLICE_NAME] ([DURATION])

### [SLICE_DETAILS]

[Insert the specific slice specification here when generating validation checklist]

---

## REQUEST

Generate a **comprehensive, executable validation checklist** for this slice that Claude Code can run, taking into account the ShipSpeak context above.

### Requirements

The checklist must be **executable by Claude Code**, not just a manual checklist.

**Structure:**
- Clear overview Claude Code can read
- Sections Claude Code works through sequentially
- Actual executable commands (not descriptions)
- Specific file paths Claude Code can check
- Code snippets Claude Code can run/verify
- Pass/fail criteria Claude Code can evaluate

**Include These Sections:**

1. **Slice Overview**
   - Purpose and outcomes
   - What was built (infrastructure, APIs, database, UI)
   - Success criteria
   - How it fits into ShipSpeak's Meeting Intelligence system

2. **Definition of Done**
   - Acceptance criteria from slice specification
   - ShipSpeak-specific requirements (usage-based model, Meeting Intelligence, security)
   - Quality gates

3. **Database & Schema Validation** (if applicable)
   - Supabase schema changes verified
   - Migrations successful
   - Row Level Security (RLS) policies working
   - Data integrity constraints working
   - Test queries to run
   - Proper indexes for performance

4. **API Endpoints Validation** (if applicable)
   - Status codes correct
   - Request/response schemas match specs
   - Authentication working (Supabase Auth)
   - Error handling correct
   - Rate limiting (if needed)
   - Actual curl commands to test
   - Response time <500ms
   - OpenAI service integration (if applicable)

5. **Security & Privacy (CRITICAL for Meeting Intelligence Platform)**
   - Server-side enforcement verified (no client-side bypass)
   - No PII in logs/analytics
   - Secrets in environment variables (.env.local)
   - Usage-based enforcement server-side
   - Meeting data privacy protections
   - Audio file security (temporary storage only)
   - Supabase RLS policies enforced
   - SQL injection prevention
   - XSS prevention
   - CSRF protection

6. **Test Coverage (TDD Validation)**
   - Unit tests exist and pass
   - Integration tests exist and pass
   - AI service integration tests (if applicable)
   - Test coverage meets requirements (>80% for critical paths)
   - Commands to run tests:
     ```bash
     npm test -- [test-file-name]
     npm run test:coverage
     ```

7. **Usage-Based Model Validation** (if applicable)
   - Usage limits enforced server-side
   - Usage tracking accurate
   - Educational CTAs appearing correctly (not restrictive)
   - Usage dashboard working
   - Server-side enforcement (cannot bypass client-side)
   - Usage metrics stored correctly
   - Cost optimization working (Smart Sampling)

8. **Meeting Intelligence Integration** (if applicable)
   - Smart Sampling integration working
   - Meeting analysis pipeline functional
   - Audio processing working (upload, transcription, analysis)
   - Real-time progress updates via WebSocket
   - Scenario Generation integration (if applicable)
   - Meeting data privacy maintained
   - Cost optimization achieved (75% reduction target)
   - Progress tracking accurate

9. **Analytics & Telemetry**
   - Events firing correctly (custom analytics)
   - Properties IDs-only (no PII: user_id, meeting_id, session_id only)
   - Event names match Integration Contract specs
   - Can verify events in analytics dashboard
   - Meeting analysis events tracked
   - Practice module events tracked

10. **AI Service Integration Validation** (if applicable)
    - OpenAI GPT-4 integration working
    - OpenAI Whisper integration working (if audio processing)
    - Smart Sampling Engine integration
    - Scenario Generation Engine integration
    - Error handling for AI service failures
    - Cost optimization working
    - Rate limiting respected
    - Response quality validation

11. **Manual Testing Checklist**
    - Step-by-step tests
    - Happy path scenarios
    - Edge cases (network failures, API timeouts, invalid data)
    - Error scenarios (AI service failures, upload failures)
    - Cross-persona testing (PM, PO, Engineer backgrounds)
    - Meeting Intelligence workflow end-to-end

12. **Accessibility** (if UI component)
    - Keyboard navigation working
    - Screen reader compatibility
    - WCAG AA compliance
    - Focus management
    - Error announcements
    - Color contrast ratios
    - Mobile responsiveness

13. **Performance**
    - Database query performance (<500ms)
    - API response times (<500ms average)
    - No N+1 queries (check with Supabase query logging)
    - Proper indexes on foreign keys and frequent queries
    - Page load time <2 seconds (if UI)
    - Bundle size reasonable (if frontend)
    - OpenAI API call optimization
    - WebSocket connection performance

14. **Integration Readiness**
    - Dependencies on other slices verified
    - Integration points working
    - Environment variables documented
    - Database migrations ready (Supabase)
    - No breaking changes to existing slices
    - Smart Sampling integration points working
    - Scenario Generation integration points working

15. **Production Readiness** (for deployment phases)
    - Monitoring configured (Vercel Analytics, custom analytics)
    - Alerts set up (if critical path)
    - Backup systems tested (Supabase backups configured)
    - Rollback procedures documented
    - Launch checklists complete
    - Error tracking configured

16. **Quick Validation Commands**
    - Database queries to verify data
    - API curl commands to test endpoints
    - How to test locally (npm run dev)
    - How to run tests (npm test)
    - How to check TypeScript (npx tsc --noEmit)
    - How to test OpenAI integrations
    - How to verify Smart Sampling

---

## FORMAT REQUIREMENTS

**Good Examples (Executable):**
```bash
# Check if file exists
ls -la apps/web/app/api/meetings/analyze/route.ts

# Check database schema
npx supabase db pull
cat supabase/schema.sql | grep -A 10 "CREATE TABLE meetings"

# Test API endpoint with authentication
curl -X POST http://localhost:3000/api/meetings/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(supabase auth get-session | jq -r '.access_token')" \
  -d '{"meeting_id": "test-meeting-123", "analysis_type": "smart_sampling"}'

# Run specific tests
npm test -- smart-sampling.test.ts

# Check TypeScript compilation
npx tsc --noEmit

# Verify environment variables exist
grep -E "OPENAI_API_KEY|SUPABASE_URL|SUPABASE_ANON_KEY" .env.local

# Check Supabase query performance
# Enable query logging in Supabase dashboard
# Then trigger the query and check logs for execution time
```

**Bad Examples (Not Executable):**
- [ ] Make sure the API works
- [ ] Verify database is set up correctly
- [ ] Check that everything compiles
- [ ] Test the Meeting Intelligence integration

**Output Format:**
- Markdown document Claude Code can execute
- Clear section headers with ShipSpeak context
- Numbered steps (for progress reporting)
- Code blocks with executable commands
- Expected outputs for each command
- Pass/fail criteria tied to ShipSpeak requirements
- Specific file paths in Next.js App Router structure
- No placeholders or TODOs

---

## SPECIAL CONSIDERATIONS BY PHASE

**Phase 1 (Frontend Foundation):**
- Validate UI components and design system
- Mock data integration working
- Navigation and routing functional
- Responsive design verified
- Accessibility compliance

**Phase 2 (Backend Infrastructure):**
- Database schema and RLS policies
- API endpoints with proper authentication
- File upload system with security
- Error handling and validation
- Performance optimization

**Phase 3 (AI Integration):**
- OpenAI service integration (GPT-4, Whisper)
- Smart Sampling Engine functionality
- Scenario Generation Engine integration
- Cost optimization achieved
- Real-time progress updates

**Phase 4 (Production Features):**
- End-to-end Meeting Intelligence workflow
- Practice module generation and delivery
- Progress tracking and analytics
- User experience polish
- Performance optimization

**Phase 5 (Deployment):**
- Production environment configuration
- CI/CD pipeline working
- Monitoring and alerting
- Backup and recovery procedures
- Launch readiness checklist

---

Generate the validation checklist now, ensuring it's specific to ShipSpeak's Meeting Intelligence mission, AI-powered learning modules, usage-based model, and security-first approach to meeting data.