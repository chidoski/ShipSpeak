# ShipSpeak Phase Execution Skill

## Overview
This skill guides Claude Code through implementing ShipSpeak slices with production-ready quality, following TDD methodology and integrating with the Meeting Intelligence system.

## Core Principles

### ShipSpeak Context
- **Product Leadership Platform**: AI-powered development combining Meeting Intelligence with adaptive practice modules
- **Real Work Integration**: Practice with actual meeting content, not hypothetical scenarios
- **Meeting-Driven Personalization**: AI identifies specific gaps from real meetings
- **Progressive Learning**: Foundation → Practice → Mastery skill adaptation

### Development Philosophy
- **TDD First**: Red → Green → Refactor cycle mandatory
- **Production Quality**: Every slice must be production-ready
- **Security First**: Meeting data privacy and security paramount
- **Performance Optimized**: Smart Sampling patterns, <500ms API responses
- **Type Safe**: TypeScript strict mode, no `any` types

## Activation Triggers

This skill activates when:
- User mentions "slice implementation" or "implement slice"
- User references ShipSpeak phase work
- User requests Meeting Intelligence feature development
- User needs Smart Sampling or Scenario Generation integration
- User mentions practice module development

## Workflow Structure

### Phase 1: Discovery & Analysis
1. **Codebase Exploration**: Understand existing architecture
2. **Dependency Mapping**: Identify integration points
3. **Requirements Analysis**: Parse slice specification thoroughly
4. **Integration Planning**: Map to Meeting Intelligence workflow

### Phase 2: Test-Driven Development
1. **Test Design**: Write comprehensive test cases first
2. **Red Phase**: Write failing tests
3. **Green Phase**: Implement minimal passing code
4. **Refactor Phase**: Optimize and clean up

### Phase 3: Integration & Validation
1. **Service Integration**: Connect with OpenAI, Smart Sampling, Scenario Generation
2. **Performance Validation**: Ensure <500ms response times
3. **Security Review**: Verify privacy and security requirements
4. **Production Readiness**: Final quality checks

## Integration Points

### Core Services
- **Smart Sampling Engine**: Cost-optimized meeting analysis
- **Scenario Generation Engine**: Adaptive practice module creation
- **OpenAI Services**: GPT-4 and Whisper integration
- **Supabase**: Database and auth integration

### Key Patterns
- Usage-based enforcement (no tier gating)
- Real-time progress updates via WebSocket
- Meeting data privacy protection
- Cost optimization following Smart Sampling patterns

## Quality Standards

### Code Quality
- Maximum 300 lines per file
- Single responsibility principle
- Comprehensive error handling
- Performance optimization

### Testing Requirements
- >80% test coverage for critical paths
- Unit tests for business logic
- Integration tests for APIs and AI services
- E2E tests for user workflows

### Security Requirements
- Server-side enforcement always
- No PII in logs or analytics
- Meeting data temporary storage only
- Environment variables for all secrets

## Resource Files

Load specific phase resources as needed:
- `resources/phase1-frontend-foundation.md` - UI and frontend development
- `resources/phase2-backend-infrastructure.md` - API and database work
- `resources/phase3-ai-integration.md` - OpenAI and AI service integration
- `resources/phase4-production-features.md` - Advanced features and optimization
- `resources/phase5-deployment.md` - Production deployment and monitoring

## Usage Instructions

1. Load this skill when beginning slice implementation
2. Load appropriate phase resource file for specific requirements
3. Follow the 3-phase workflow structure
4. Maintain quality standards throughout
5. Validate against production readiness criteria

## Success Criteria

A slice is complete when:
- All acceptance criteria met
- TDD methodology followed completely
- Production quality code delivered
- Security and privacy requirements satisfied
- Performance targets achieved
- Integration with Meeting Intelligence verified