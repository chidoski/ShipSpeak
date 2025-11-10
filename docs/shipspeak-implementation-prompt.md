# **SLICE IMPLEMENTATION**

Use the shipspeak-phase-execution skill and load resources/PHASE_[X]_[Phase_Name]_Slices.md &&

I'm ready to implement **SLICE [ID]**: [Slice Name] ([Duration])**

## Coding Standards

From [CLAUDE.md](http://CLAUDE.md) file that's in root take a look at the coding standards that have been created.

## **🔍 PHASE 1: DISCOVERY (Required First)**

### ***Understand the Codebase:***

1. Explore project structure: /apps/web, /packages, /docs
2. Review database schema in packages/types or database definitions
3. Note naming conventions and patterns in use
4. Check existing services: Smart Sampling, Scenario Generation, OpenAI Integration
5. Review component structure in packages/ui or apps/web/components

### ***Check for Existing Code (CRITICAL):***

Before creating anything new:
- Search for related components/files/functions
- Check if slice functionality is partially implemented
- Verify if database tables already exist
- Identify what needs to be built vs. modified
- Review existing implementations for patterns
- Check for related OpenAI service integrations
- Verify Smart Sampling or Scenario Generation dependencies

### ***Load Slice Specification:***

From the loaded skill resource file:
- Review the slice's Purpose & Strategic Context
- Understand What to Build
- Note Acceptance Criteria
- Check Dependencies on other slices
- Review Test Requirements
- Check for Meeting Intelligence integration points
- Verify AI/ML processing requirements

### ***Integration Contract Review:***

Check relevant Integration Contract sections for:
- API specifications (if applicable)
- Database schema requirements (if applicable)
- Component interfaces (if applicable)
- Analytics events (if applicable)
- OpenAI service integration requirements
- Smart Sampling integration points
- Scenario Generation integration
- Quality standards and performance targets

### ***Discovery Questions to Answer:***

1. Does this functionality already exist in the codebase?
2. What files need to be created vs. modified?
3. What database changes are required (tables, columns, indexes)?
4. What are the dependencies on other slices?
5. What external services are involved (OpenAI, Deepgram, Supabase, etc.)?
6. What environment variables are needed?
7. What patterns from /CLAUDE.md should I follow?
8. How does this integrate with Meeting Intelligence workflow?
9. Are there Smart Sampling or Scenario Generation dependencies?
10. What AI/ML processing is required?

### ***Show me your Discovery Summary before writing any code.***

--

## **✅ PHASE 2: IMPLEMENTATION CHECKLIST**

Once discovery is complete, follow this checklist:

### **Implementation**

- TypeScript strict mode (no `any` types)
- Implement core functionality per slice specification
- Proper TypeScript types and interfaces
- Database schema updates via Supabase/Prisma (if needed)
- API endpoints with proper contracts (if needed)
- Error handling with user-friendly messages
- Next.js 14 App Router conventions
- Server-side logic first (never trust client)
- Integration with existing services (Smart Sampling, Scenario Generation)
- OpenAI service integration following established patterns

### **Security & Privacy**

- Server-side enforcement (no client-side bypass possible)
- PII scrubbed from analytics (IDs only)
- Environment variables for secrets
- Authentication on protected routes
- Usage limits enforced server-side (no tier gating - usage-based model)
- Payment data secured (Stripe webhooks verified)
- No sensitive data in logs/errors
- Meeting data privacy protections
- Audio file security (temporary storage only)

### **Meeting Intelligence Integration (if applicable)**

- Smart Sampling configuration properly applied
- Scenario Generation integration following patterns
- OpenAI service calls with proper error handling
- Meeting analysis workflow integration
- Audio processing pipeline integration
- Progress tracking and real-time updates
- Cost optimization following Smart Sampling patterns

### **Analytics & Tracking (if applicable)**

- Events tracked per Integration Contract
- Event properties include only IDs (no PII)
- Events fire correctly in development
- Meeting analysis progress tracking
- Practice module completion tracking
- User journey analytics

### **Testing (TDD Approach)**

- ***Write tests FIRST*** (before implementation)
- Unit tests for core business logic
- Integration tests for APIs/database
- Integration tests for OpenAI services
- Edge cases covered
- Error scenarios tested
- No console errors or warnings
- Manual testing in development environment
- Meeting workflow end-to-end testing

### **Performance**

- Database queries optimized (indexes used)
- API response time meets targets (<500ms)
- No unnecessary re-renders (React)
- Code-split heavy components
- OpenAI API calls optimized (Smart Sampling patterns)
- Audio processing performance optimized
- Real-time update performance

--

## **🎯 EXPECTED OUTPUT**

Provide:

### ***1. Discovery Summary***
- What existing code was found
- What needs creating vs. modifying
- Dependencies or blockers identified
- Database schema changes required
- Integration points with Meeting Intelligence
- OpenAI service dependencies
- Smart Sampling or Scenario Generation integration

### ***2. Test Plan (TDD - Write First)***
- Unit tests to write
- Integration tests to write
- OpenAI service integration tests
- Test scenarios to cover
- Expected behavior for each test
- Meeting workflow test cases

### ***3. Implementation Plan***
- Files to create/modify (full paths)
- Database migrations needed
- API endpoints to create
- Key design decisions
- Integration points with existing code
- Environment variables needed
- OpenAI service configuration
- Smart Sampling integration approach

### ***4. Code Implementation***
- Tests written FIRST
- Production code following tests
- Proper TypeScript types
- Comments for complex logic
- Integration Contract compliance
- Security best practices
- Meeting Intelligence workflow integration
- Performance optimization

### ***5. Testing & Validation***
- How to run the tests
- How to test manually
- Key scenarios to verify
- How to verify database changes
- How to test OpenAI integrations
- Meeting workflow validation
- Performance testing approach

--

## **🚨 CRITICAL REMINDERS**

### ***ShipSpeak Specific:***
- TypeScript strict mode (no `any`)
- IDs-only telemetry via analytics
- Server-side usage enforcement (never trust client)
- Meeting data privacy and security
- OpenAI service integration patterns
- Smart Sampling cost optimization
- Real-time progress updates via WebSocket
- Environment variables for all secrets
- Meeting Intelligence workflow integration

### ***Usage-Based Philosophy:***
- All users have access to same technology, different usage limits
- Server-side enforcement always with usage tracking
- Usage CTAs are educational and helpful
- No feature punishment based on limits

### ***Security First:***
- Never surface AI model details or thresholds
- Meeting transcripts use secure processing only
- WCAG AA compliance
- Proper error handling
- API endpoints authenticated
- Audio data temporary storage only

### ***TDD Approach:***
- Tests written BEFORE implementation
- Red → Green → Refactor cycle
- Unit tests for business logic
- Integration tests for APIs/database
- Integration tests for AI services
- E2E tests for critical user journeys

--

## **📚 Phase Resource Reference**

### ***Which resource file to load:***

### ***Phase 1 (Frontend Foundation):***
```
load resources/phase1-frontend-foundation.md
```

### ***Phase 2 (Backend Infrastructure):***
```
load resources/phase2-backend-infrastructure.md
```

### ***Phase 3 (AI Integration):***
```
load resources/phase3-ai-integration.md
```

### ***Phase 4 (Production Features):***
```
load resources/phase4-production-features.md
```

### ***Phase 5 (Deployment):***
```
load resources/phase5-deployment.md
```

--

Let's start with DISCOVERY - analyze the codebase and show me what you find.