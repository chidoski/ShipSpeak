# Claude Assistant Instructions for ShipSpeak

## Project Overview
ShipSpeak is an AI-powered platform for product leadership development that combines Meeting Intelligence, adaptive practice modules, and influence training. The platform captures real meetings, analyzes communication patterns, and generates personalized practice modules.

### What ShipSpeak Is
- **Platform**: AI-powered professional development for Product Managers and Product Owners
- **Core Innovation**: Meeting Intelligence that captures real meetings → generates adaptive practice modules
- **Target Users**: PMs seeking advancement, POs transitioning to PM, new PM leaders

### What ShipSpeak Is NOT
- Not a course platform (like Udemy)
- Not static learning content
- Not just communication coaching
- Not hypothetical case studies

## Key Terminology

### Core Components
- **Meeting Intelligence**: System that captures and analyzes real meetings
- **Adaptive Modules**: Auto-generated practice exercises from actual meeting content
- **Generic Modules**: Always-available baseline practice drills
- **Standards Modules**: Company framework exercises (Amazon LPs, Meta principles)
- **Art of the Sale**: Internal/external influence training with simulation agents
- **Voice Coach**: AI analysis of executive communication patterns
- **Sense Labs**: Real product decision practice with actual company cases

### Technical Terms
- **Hybrid Capture**: Chrome extension (40%), Desktop app (60%), Meeting bots (enterprise)
- **Smart Sampling**: Cost-optimized meeting analysis with 75% cost reduction
- **Diarization**: Speaker isolation in multi-person calls
- **Prosody Analysis**: Tone, pitch, pace evaluation
- **Stackable Cards**: UI pattern for module delivery
- **Progressive Difficulty**: Foundation → Practice → Mastery skill adaptation

## Documentation Structure

```
/docs/
├── product/                       # Product specifications
├── technical/                     # Technical documentation
├── development/                   # Development guides and conventions
├── CLAUDE.md                      # This file - AI assistant instructions
└── changelog/                     # Daily development logs
```

## Key User Personas

1. **Sarah Chen** - Senior PM → Director/VP (Executive presence, C-suite meetings)
2. **Marcus Rodriguez** - IC → Staff/Principal PM (Strategic narrative, influence skills)
3. **Alex Martinez** - PO → PM Transition (Strategic thinking, business vocabulary)
4. **Jennifer Kim** - New PM Leader (Altitude control, board presentations)
5. **David Thompson** - Engineer → PM (PM vocabulary, customer focus)

## Content Philosophy

### Content Powers the Engine
- Content is NOT courses or lessons - Content IS practice templates and evaluation rubrics
- Everything uses the user's ACTUAL work content
- Frameworks provide structure, not theory

### Example Flow
1. Meeting detects: "User buried recommendation"
2. System generates: Practice with THEIR recommendation  
3. User practices: 30-second answer-first with their data
4. Feedback: Specific to their content and context

## Technical Considerations

### Platform Coverage Strategy
- **Google Meet**: Chrome extension (100% coverage)
- **Zoom Desktop**: Desktop app required (Electron)
- **Teams**: Desktop app or bot framework
- **Fallback**: Manual upload always available

### Privacy First
- Consent required for all recording
- Zero-knowledge processing
- No raw audio storage
- User controls all data retention

## Common Pitfalls to Avoid

### When Writing Code
- Don't assume platform coverage (check capture method)
- Don't store sensitive meeting content
- Don't create generic content (everything should be adaptive)
- Don't forget PO→PM specific features

### When Updating Documentation
- Keep "Meeting Intelligence" naming (not Black Box)
- Maintain focus on real work integration
- Remember it's practice, not courses
- Include PO persona considerations

## Communication Guidelines

### When Discussing ShipSpeak
- Emphasize: "Practice with your actual work"
- Avoid: "Learn about frameworks"
- Say: "Adaptive to your meetings"
- Not: "Generic communication training"

### Value Proposition
"ShipSpeak helps PMs sound as smart as they actually are by turning their real meetings into personalized practice."

## Development References

For detailed development information, see:
- **Development Guides**: `docs/development/` (architecture, TDD, conventions, workflow)
- **Product Requirements**: `docs/product/PRD.md`
- **Meeting Analysis & Module Generation PRD**: `docs/product/meeting-analysis-prd.md`
- **User Experience Design**: `docs/product/user-experience-design.md`
- **Scenario System Design**: `docs/product/scenario-system-design.md`
- **Cost & Technical Architecture**: `docs/product/cost-technical-architecture.md`
- **User Stories**: `docs/product/user-stories.md`
- **Technical Architecture**: `docs/technical/architecture.md`

---

## Development Status Update

### ✅ Recently Completed
**Smart Sampling Engine (Feature 4)** - October 4, 2025
- 75% cost reduction achieved (from $0.42 to $0.10 per 30-min meeting)
- PM-specific pattern detection for executive presence, influence skills, communication structure
- 100% test coverage (31/31 tests passing) with complete TDD implementation
- Production-ready with comprehensive error handling and 5 configuration presets

### 🎯 Next Priorities
**Scenario Generation & Progressive System (Feature 5)**
- Scenario Generation Engine - 50 base scenarios + context variables
- Progressive Difficulty System - Foundation → Practice → Mastery adaptation
- Enhanced personalization based on actual meeting content

---

*Last Updated: October 4, 2025 - Smart Sampling Engine Complete*
*Document Version: 1.3*