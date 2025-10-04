# ShipSpeak Development Guide
## Claude Code Assistant Instructions

**Project:** ShipSpeak - Product Leadership Development Platform  
**Version:** 1.4  
**Last Updated:** October 4, 2025 - Epic 1 System Integration Complete  

---

## 🔒 CRITICAL PREVENTION RULES - READ FIRST

**⚠️ USER INSTRUCTION TO CLAUDE: "STOP - Only work within the ShipSpeak project directory. NEVER touch anything outside of /01-web-applications/shipspeak/. All my other projects (bravax, dream-planner, insidertrade, ai-projects) are off-limits." ⚠️**

### Critical Rules:
1. **NEVER** run `git add .` from portfolio root - Only add specific files
2. **ALWAYS** work inside `/01-web-applications/shipspeak/shipspeak/` directory only
3. **NEVER** delete or move entire project directories
4. **ASK** before any git operations that could affect multiple projects

---

## Project Overview

ShipSpeak is an AI-powered platform that integrates product sense development with executive communication training. The platform creates a complete learning loop where meeting analysis identifies weakness areas and automatically generates personalized practice modules for product managers and leaders.

### Core Value Proposition
- **Meeting Intelligence**: Real-time analysis of communication patterns in actual meetings
- **Personalized Practice**: Auto-generated modules targeting specific weak areas
- **Product Sense Development**: Real company case studies and decision-making practice
- **Integrated Learning Loop**: Meeting analysis → Practice modules → Skill improvement → Better meetings

---

## Development Status

### ✅ Completed Features
**Feature 1: TDD Framework & Testing Infrastructure** - ✅ COMPLETE
- Complete Jest configuration with security test patterns
- Performance testing framework with memory leak detection
- Mock services for OpenAI and Supabase integration tests
- 100% test coverage framework established

**Feature 2: Secure File Upload System** - ✅ COMPLETE & STANDALONE
- Production-ready secure audio file validation and processing
- Chunked uploads with progress tracking and security scanning
- 100% test coverage (18/18 tests passing)
- Can be used independently or integrated with future features

**Feature 3: OpenAI Service Integration** - ✅ COMPLETE & PRODUCTION-READY
- GPT-4 service for meeting analysis & practice module generation
- Whisper service for audio transcription with quality analysis
- Service factory with configuration management and singleton pattern
- Comprehensive test coverage with mock integration
- Full TypeScript interfaces and error handling
- Environment-based configuration with validation

**Feature 4: Smart Sampling Engine** - ✅ COMPLETE & PRODUCTION-READY
- Cost-optimized meeting analysis with 75% cost reduction (from $0.42 to $0.10 per 30-min meeting)
- PM-specific pattern detection for executive presence, influence skills, communication structure
- Comprehensive configuration system with 5 presets (COST_OPTIMIZED, BALANCED, QUALITY_FOCUSED, ENTERPRISE, CUSTOM)
- 100% test coverage (31/31 tests passing) with complete TDD implementation
- Production-ready refactoring with error handling, caching, and performance optimization
- Smart chunk optimization algorithm that adapts sampling based on meeting type and detected patterns

**Feature 5: Scenario Generation Engine** - ✅ COMPLETE & PRODUCTION-READY
- 17 base scenarios across 10 PM-focused categories (Executive Presence, Influence Skills, Strategic Communication, etc.)
- 3-phase generation pipeline (batch → personalization → real-time adaptation)
- 1,125+ context variable combinations per scenario for infinite variety
- Smart Sampling integration for meeting-based scenario generation
- 100% test coverage (31/31 tests passing) with complete TDD methodology

**Epic 1: System Integration & Data Persistence** - ✅ COMPLETE & PRODUCTION-READY
- Complete PostgreSQL database schema with RLS security, indexes, and triggers
- Supabase integration for frontend and backend with full type safety
- Scenario Generation ↔ Database Integration with meeting-based personalization
- Smart Sampling ↔ Database Integration with real-time progress updates
- File Upload ↔ Smart Sampling Workflow orchestration (end-to-end pipeline)
- Comprehensive test coverage with TDD methodology (RED-GREEN-REFACTOR)
- Production-ready error handling, retry logic, and data consistency checks

### 🚀 Current Priority
**Epic 2: API Layer & Service Orchestration** - NEXT PHASE
- Authentication & Authorization (JWT, role-based access control)
- RESTful API endpoints for all integrated services
- Real-time WebSocket connections for live progress updates
- Rate limiting, input validation, and comprehensive error handling
- API documentation with OpenAPI/Swagger specifications

---

## Essential Commands

### Development
```bash
npm run dev              # Start all services
npm run dev:web          # Web app only
npm test                 # All tests
npm run test:watch       # TDD mode
npm run test:coverage    # Coverage report
```

### Database
```bash
npm run db:migrate       # Run migrations
npm run db:seed          # Seed data
npm run db:reset         # Reset database
```

### Production
```bash
npm run build            # Build all
npm run lint             # Lint code
npm run type-check       # Type checking
```

---

## Technology Stack

**Backend**: Node.js 18+ with TypeScript, Express.js, GraphQL (Apollo Server), PostgreSQL 15, Redis  
**Frontend**: Next.js 14 + React 18 + TypeScript, Tailwind CSS + shadcn/ui  
**AI/ML**: OpenAI GPT-4, Whisper (self-hosted), AssemblyAI  
**Infrastructure**: AWS/Azure with Kubernetes orchestration  

---

## Project Structure
```
shipspeak/
├── apps/
│   ├── web/                 # Next.js web application
│   ├── desktop/             # Electron desktop app
│   ├── extension/           # Chrome/Edge browser extension
│   └── api/                 # Backend API services
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # TypeScript type definitions
│   └── ai/                  # AI/ML processing modules
├── docs/
│   ├── product/             # PRD and user stories
│   ├── technical/           # Architecture and API docs
│   └── development/         # Detailed development guides
└── tests/                   # Test suites
```

---

## Documentation

For detailed information, see:
- **Development Guide**: `docs/development/` (architecture, TDD, conventions)
- **Product Requirements**: `docs/product/PRD.md`
- **Meeting Analysis & Module Generation PRD**: `docs/product/meeting-analysis-prd.md`
- **User Experience Design**: `docs/product/user-experience-design.md`
- **Scenario System Design**: `docs/product/scenario-system-design.md`
- **Cost & Technical Architecture**: `docs/product/cost-technical-architecture.md`
- **User Stories**: `docs/product/user-stories.md`
- **Technical Architecture**: `docs/technical/architecture.md`
- **AI Assistant Guide**: `docs/CLAUDE.md`

---

## CRITICAL: Development Scope Prevention Rules

**⚠️ MANDATORY BOUNDARIES FOR CLAUDE CODE ASSISTANT ⚠️**

### Working Directory Rules
1. **ALWAYS work within the ShipSpeak directory only**: `/01-web-applications/shipspeak/`
2. **NEVER run git commands from parent directories** - Only from within the ShipSpeak project directory
3. **Always use `cd` to navigate to ShipSpeak directory before ANY git operations**

### Required Commands Before Git Operations
```bash
# ALWAYS run this sequence before any git operations:
cd /Volumes/Extreme\ Pro/Programming/Python/Portfolio-Projects/01-web-applications/shipspeak/
pwd  # Verify correct directory
git status  # Verify only ShipSpeak files are affected
```

**These rules are mandatory and non-negotiable to protect the user's portfolio integrity.**