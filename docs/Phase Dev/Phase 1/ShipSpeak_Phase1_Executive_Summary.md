# ShipSpeak
## Phase 1 Executive Summary
## Frontend-First Development: 4 Weeks to User Validation
Version 1.0
November 4, 2025
# Executive Summary
ShipSpeak is an AI-powered Product Manager leadership development platform that addresses a critical gap in PM career advancement. Phase 1 delivers a complete, production-ready user experience in 4 weeks (44-54 hours) using mock data, enabling user validation before backend infrastructure investment.
## The Problem
Product Managers struggle to advance their careers because:
Traditional coaching is expensive and carries stigma
Generic courses don't address their specific communication gaps
They receive no feedback on actual meeting performance
No clear framework exists for PM career progression
## The Solution
ShipSpeak provides a private AI coach that analyzes real work meetings, identifies specific communication patterns, recommends personalized learning modules, and tracks progress toward career goals—all without the stigma of visible coaching tools.
## Core Differentiator: Bot Discretion
**The Insight: **Having a bot named "ShipSpeak Coach" join your board meeting creates stigma—others think you need help.
**ShipSpeak's Solution: **Complete user control over bot identity:
Custom bot names ("Executive Assistant," "My Notetaker," or personal names)
Stealth mode (silent, no video, minimal presence)
Smart exit rules (leave when CEO joins, when specific keywords mentioned)
Meeting-type specific configurations (different identity for board vs team meetings)
**Result: **PMs get coaching privately without appearing to need coaching publicly.
# Phase 1 Overview
## Objectives
Duration: 4 weeks (44-54 development hours)
Outcome: Complete UX with mock data ready for 10 beta PMs
Infrastructure: Zero backend dependencies
## Why Frontend-First?
This proven methodology (successfully used with Bravax) prioritizes user experience validation before infrastructure investment. By building the complete interface with realistic mock data, we:
Validate product-market fit with real users by week 4
Iterate on UX without backend complexity slowing us down
Avoid infrastructure costs until value proposition is validated
De-risk Phase 2 development by building on validated user needs
## What Gets Built
Phase 1 delivers a fully clickable product experience:
| Feature Area | What Users Experience |
| --- | --- |
| Two-Path Onboarding | Choose to analyze real meetings OR start practicing immediately. Includes bot configuration wizard and baseline assessment exercises. |
| Meeting Intelligence | Browse 10 mock meetings, view full transcripts with speaker identification, see AI feedback with dimension scores, patterns, and actionable Next Steps. |
| Learning Modules | Access 15-20 personalized modules across 5 skill categories. Each module includes framework teaching, examples, and 5-8 practice exercises. |
| Practice System | Record practice responses to realistic PM scenarios, receive immediate transcription and AI feedback, compare performance to meeting patterns. |
| Progress Dashboard | Track career level progress, view skill radar charts, see performance trends over time, get weekly insights and highlights. |

# Development Timeline
Phase 1 is organized into 15 granular slices across 4 weeks:
| Week | Phase | Key Deliverables |
| --- | --- | --- |
| Week 1 | Phase 1A: Foundation | Design system, two-path onboarding, authentication, dashboard structure |
| Week 2 | Phase 1B: Meeting Intelligence | Meeting list, transcript view, AI feedback panel with Next Steps |
| Week 3 | Phase 1C: Learning & Practice | Module library, practice recording interface, immediate AI feedback |
| Week 4 | Phase 1D: Progress & Polish | Progress dashboard, settings, mobile optimization, testing |

**Total Time Estimate: **44-54 hours across 15 slices
**Average Slice: **3-4 hours with clear acceptance criteria
# Key Features
## 1. Two-Path Onboarding
Unlike traditional onboarding that forces a single path, ShipSpeak offers two equally prominent entry points:
**Path A: Analyze My Real Meetings**
For users ready to connect their calendar immediately
Bot configuration wizard with identity customization
First insights within 24 hours of next meeting
**Path B: Start Practicing Now**
For users who want to learn immediately
Three baseline exercises (5 minutes total)
Immediate skill assessment and personalized learning path
**Key Insight: **Users can always add the alternative path later, removing friction from getting started.
## 2. Meeting Intelligence with Next Steps
The AI feedback panel transforms meeting transcripts into actionable learning:
**Analysis Includes:**
Overall score (0-10) with trend indicator
Four dimension scores: Product Sense, Communication, Stakeholder Management, Technical Translation
Pattern identification: Strengths, areas to improve, missed opportunities
8+ key moments linked to transcript with specific feedback
Career level assessment (% of responses at target level)
**Critical Addition: Next Steps Section**
Each meeting feedback includes 2-4 prioritized action items:
Practice exercises targeting specific gaps
Framework templates to apply before next meeting
Strong examples to bookmark for reference
Progress tracking with clear metrics
## 3. Personalized Learning System
15-20 modules organized across 5 skill categories:
Product Sense & Strategy
Executive Communication
Stakeholder Management
Technical Translation
Trade-off Articulation
**Each module includes:**
Framework explanation with visual diagrams
Examples of strong vs weak communication
5-8 practice exercises (timed responses, scenarios, compare-and-improve)
Templates and checklists for real-world application
**Personalization Engine: **Modules are prioritized based on gap severity from meetings, career level requirements, pattern frequency, and user-selected focus areas.
## 4. Practice Recording & Feedback
Professional recording interface for practicing PM scenarios:
Browser-based audio recording (no downloads required)
Real-time visual feedback (waveform confirms mic is working)
Immediate transcription (mock in Phase 1, Deepgram in Phase 2)
Detailed AI feedback with annotated transcript
Comparison to meeting performance patterns
Unlimited re-recordings to practice improvement
## 5. Progress & Career Tracking
Comprehensive dashboard showing skill development:
Career progress bar (Current → Target level with % completion)
Skill radar chart comparing current, 30-days-ago, and target levels
Performance trend charts for meetings and practice
Module completion tracking with scores
Weekly highlights (achievements and concerns)
AI-generated insights synthesizing patterns across all activities
# Career Progression Framework
All learning is organized around a structured PM career ladder with specific skills for each transition:
| Career Transition | Key Skills |
| --- | --- |
| PO → PM | Basic product sense, influence without authority, stakeholder communication, data-backed decisions |
| PM → Senior PM | Executive communication (answer-first, concise), trade-off articulation, cross-functional leadership, strategic thinking |
| Senior PM → Group PM | Multi-product strategy, organizational influence, coaching other PMs, vision setting |
| Group PM → Director | Department strategy, C-suite presence, team building & culture, business model thinking |

# Phase 1 Validation Strategy
## Beta User Profile
**Target: **10 Product Managers (PM or Senior PM level)
**Criteria: **Currently employed at tech companies, regularly attend board or executive meetings, motivated to advance their careers
**Duration: **1 week of product usage followed by structured feedback session
## Key Validation Questions
**Product-Market Fit**
Does this solve a real problem in their career development?
Would they connect their real calendar if this were live?
What's the strongest value proposition for them?
**Bot Discretion Differentiator**
Do they understand and value the privacy/anonymity features?
Does bot customization address their concerns about stigma?
Would this differentiation influence their purchase decision?
**User Experience**
Is the onboarding clear and motivating?
Does the feedback feel accurate and actionable?
Is the learning system intuitive?
Are there confusing or unnecessary features?
**Learning Effectiveness**
Are module recommendations well-targeted?
Does practice feel valuable?
Do they feel motivated to complete exercises?
## Success Criteria
Phase 1 is considered successful when:
8+ of 10 beta users confirm this solves a real problem
7+ would connect their real calendar if available
Bot discretion is cited as a key differentiator by 6+ users
Users can navigate all features without major confusion
Clear product priorities for Phase 2 emerge from feedback
No critical UX issues that would require major redesign
# Phase 2 Preview
Following successful Phase 1 validation, Phase 2 replaces mock data with real integrations while preserving the validated user experience.
## Integration Strategy
**Duration: **4 weeks (36-44 hours)
**Approach: **Same UI, replace mock data sources with real backends
**Outcome: **Production-ready MVP with paying customers
## Key Integrations
**Backend Infrastructure**
Supabase for database (users, meetings, transcripts, exercises, progress)
Real authentication replacing mock localStorage
API routes for data operations
**Meeting Intelligence**
Calendar OAuth (Zoom, Google Meet, Microsoft Teams)
Bot deployment and meeting joining logic
Deepgram for real-time transcription
OpenAI API for meeting analysis
**Practice System**
Audio storage for practice recordings
Deepgram transcription for practice responses
OpenAI analysis for practice feedback
## Risk Mitigation
The frontend-first approach significantly reduces Phase 2 risk:
UI/UX is already validated—no redesign required
User flows are proven—focus purely on infrastructure
Feature scope is locked—no scope creep during integration
Data structures are defined—database schema maps directly to Phase 1 interfaces
User expectations are set—beta users have already experienced the complete product
# Resource Requirements
## Development Resources
**Technical Stack (Phase 1):**
Next.js 14 with App Router
TypeScript for type safety
Tailwind CSS for styling
Browser MediaRecorder API for audio capture
localStorage for mock authentication
**Infrastructure (Phase 1):**
Vercel for deployment (free tier sufficient)
No database or backend services required
**Estimated Costs (Phase 1):**
Development: 44-54 hours at standard rates
Infrastructure: $0 (using free tiers)
Total: Development time only
## Beta Testing Resources
Recruit 10 Product Managers (can leverage networks, LinkedIn, PM communities)
1 week testing period per user
1-hour structured feedback sessions (10 hours total)
Consider compensation or early-access incentives for beta users
# Summary & Next Steps
## Why This Approach Works
**1. Proven Methodology**
Frontend-first development successfully validated with Bravax project. This approach consistently delivers better products faster by focusing on user value before infrastructure complexity.
**2. Capital Efficient**
Zero infrastructure costs in Phase 1. Validate product-market fit before spending on APIs, databases, or bot infrastructure. If users don't want the product, we learn this after 4 weeks, not 4 months.
**3. Fast Iteration**
Mock data enables rapid UI changes without backend coordination. Feedback loops are measured in minutes, not days. This speed is critical for finding product-market fit.
**4. De-Risked Phase 2**
By validating UX first, Phase 2 becomes pure infrastructure work. No scope creep, no redesigns, no debates about features—just connect validated experiences to real backends.
## Immediate Next Steps
**Week 0 (Preparation):**
Review and approve this summary and full Integration Contract
Set up development environment (Next.js, TypeScript, Tailwind)
Begin beta user recruitment
**Weeks 1-4 (Phase 1 Development):**
Execute slices 1-15 following detailed Implementation Contract
Weekly demos showing incremental progress
Final QA and polish in week 4
**Week 5 (Beta Validation):**
10 beta users test product for 1 week
Structured feedback sessions
Compile learnings and Phase 2 priorities
**Week 6+ (Phase 2 Planning):**
Incorporate validated feedback
Begin Phase 2 Integration Contract development
Set up backend infrastructure (Supabase, APIs)
## Questions & Clarifications
For questions about this summary or the detailed Integration Contract, please refer to the complete Phase 1 Integration Contract document (75+ pages) which provides comprehensive specifications for every feature, component, data structure, and user flow.
The slice-based implementation methodology provides granular acceptance criteria for each 3-4 hour development increment, ensuring clear progress tracking and quality validation throughout the 4-week development period.
*— End of Executive Summary —*
