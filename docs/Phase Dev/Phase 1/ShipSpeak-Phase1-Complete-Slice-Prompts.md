# ShipSpeak Integration Slice Prompts - Phase 1
## Complete Frontend-First Implementation Guide

**Version:** 1.0 | **Date:** November 4, 2025 | **Phase:** Phase 1 (Frontend with Mock Data)

---

## Executive Summary

This document provides complete specifications for building ShipSpeak Phase 1—a fully functional product experience with mock data that can be validated with beta users before infrastructure investment.

**Development Approach:** Frontend-first methodology building complete UX before backend integration
**Duration:** 4 weeks (44-54 hours across 15 slices)
**Outcome:** Beta-ready product for 10-user validation

---

## Table of Contents

1. [Phase 1 Overview](#phase-1-overview)
2. [Week 1 - Foundation](#week-1---foundation-phase-1a)
   - Slice 1: Project Setup & Design System (4h)
   - Slice 2: Authentication & Onboarding (3h)
   - Slice 3: Dashboard & Empty States (3-4h)
3. [Week 2 - Meeting Intelligence](#week-2---meeting-intelligence-phase-1b)
   - Slice 4: Meeting List with Filtering (4h)
   - Slice 5: Meeting Detail & Transcript (5-6h)
   - Slice 6: AI Feedback Panel with Next Steps (5-6h)
4. [Week 3 - Learning & Practice](#week-3---learning--practice-phase-1c)
   - Slice 7: Module Library (4h)
   - Slice 8: Module Content & Exercises (5-6h)
   - Slice 9: Practice Recording Interface (3-4h)
   - Slice 10: Practice Feedback (4-5h)
5. [Week 4 - Progress & Polish](#week-4---progress--polish-phase-1d)
   - Slice 11: Progress Dashboard (5-6h)
   - Slice 12: Settings & Preferences (3h)
   - Slice 13: Help & Tours (2h)
   - Slice 14: Mobile Polish (3h)
   - Slice 15: Testing & Fixes (2-3h)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Phase Completion Checklist](#phase-completion-checklist)

---

## Phase 1 Overview

### Goals
Build the complete ShipSpeak learning experience with mock data to validate product concept with 10 beta users before backend infrastructure investment.

### Core Philosophy
Frontend-first development means the entire user journey exists and feels real, even though powered by mock data. Users should not detect they're interacting with mock data.

### What Gets Built
- ✅ Complete onboarding with two-path fork
- ✅ Meeting analysis with transcripts and AI feedback
- ✅ Learning modules with frameworks and practice
- ✅ Recording interface with immediate feedback  
- ✅ Progress tracking with career advancement
- ✅ All features responsive on mobile

### What's Not Built (Phase 2)
- ❌ Real authentication (Supabase/NextAuth)
- ❌ Calendar/meeting platform integrations
- ❌ Real transcription (Deepgram)
- ❌ AI analysis (OpenAI)
- ❌ Database persistence
- ❌ Payment processing

---

## Week 1 - Foundation (Phase 1A)

### Slice 1: Project Setup & Design System
**Duration:** 4 hours | **Dependencies:** None

#### What to Deliver
Working Next.js 14 application with complete design system and navigation architecture.

#### Key Components
- Project structure with App Router
- Design system (colors, typography, spacing, components)
- Base layout (sidebar, header, main content)
- Navigation between main sections
- Reusable UI components (Button, Input, Card, Badge, Avatar)

#### Design System Specifications
**Colors:** Primary (blues for trust), success/warning/error states, neutral scale
**Typography:** Clear hierarchy supporting long-form reading (transcripts)
**Spacing:** Consistent 4px base unit system
**Components:** Professional, accessible, consistent behavior

#### Acceptance Criteria
- [x] Application builds without errors
- [x] Navigation works between all sections
- [x] Design system centrally defined
- [x] Components reusable and consistent
- [x] Responsive layout (sidebar → mobile nav)
- [x] ESLint/Prettier configured

---

### Slice 2: Authentication & Onboarding Flow  
**Duration:** 3 hours | **Dependencies:** Slice 1

#### What to Deliver
Complete signup/login flow with three-step onboarding including **critical two-path fork**.

#### The Two-Path Fork (KEY DIFFERENTIATOR)
Users choose their starting experience:

**Path A: Analyze My Real Meetings**
- Configure meeting bot (name, meeting types, calendar)
- Sets up for passive analysis approach
- Lands on dashboard waiting for first meeting

**Path B: Start Practicing Now**
- Complete 3 baseline exercises (60-90 seconds each)
- Gets immediate preliminary scores  
- Lands on personalized learning path

#### Onboarding Steps
1. **User Context:** Current role, company (optional)
2. **Career Goals:** Target role, timeline
3. **Path Choice:** Analyze meetings OR practice now

#### Mock Authentication
Uses localStorage for Phase 1. Any valid email/password works.

#### Acceptance Criteria
- [x] Signup with validation
- [x] Login with session persistence
- [x] Three-step onboarding with progress indicators
- [x] Two-path fork presents options equally
- [x] Path A: Bot configuration wizard works
- [x] Path B: Baseline exercises complete with recording
- [x] Protected routes redirect to login
- [x] Mobile responsive

---

### Slice 3: Dashboard Layout & Empty States
**Duration:** 3-4 hours | **Dependencies:** Slice 2

#### What to Deliver
Main dashboard with personalized welcome, career tracking, and motivating empty states.

#### Dashboard Sections
- **Welcome:** Personalized greeting with career progression ("PM → Senior PM: 65%")
- **Quick Stats:** 4 metric cards (meetings analyzed, practice sessions, skills improving, streak)
- **Main Content:** Two columns for recent meetings and recommended modules
- **CTAs:** Different based on Path A vs Path B choice

#### Empty State Philosophy
Not failures—teaching moments that:
- Communicate what will appear here
- Provide clear next action
- Use encouraging tone

#### Acceptance Criteria
- [x] Personalized welcome with user name
- [x] Career badge displays current → target
- [x] Empty states for all sections
- [x] Navigation highlights active page
- [x] Career framework modal accessible
- [x] Different CTAs for Path A/B users
- [x] Responsive two-column → single column

---

## Week 2 - Meeting Intelligence (Phase 1B)

### Slice 4: Meeting List with Filtering
**Duration:** 4 hours | **Dependencies:** Slice 3

#### What to Deliver
Scannable meeting archive with 10 diverse mock meetings, filtering, search, and sorting.

#### Mock Data Requirements
**10 meetings with variety:**
- Types: 2-3 board, 3-4 team planning, 2-3 1:1s, 1-2 customer calls
- Scores: Mix of high (8-9), medium (6.5-7.5), challenging (5-6)
- Participants: 2-person to 15+ person meetings
- Timeframe: Last 30 days, heavier on recent

#### Features
- **Filters:** Meeting type, date range, participants (multi-select, real-time)
- **Search:** Titles and participant names, debounced
- **Sort:** Newest, oldest, highest/lowest score, duration, participants
- **Views:** List (detailed) vs Grid (visual)
- **Cards:** Title, date, score with trend, type badge, participant avatars, duration

#### Acceptance Criteria
- [x] 10 varied mock meetings
- [x] All filters work independently and combined
- [x] Search finds by title and participant
- [x] List/grid toggle changes layout
- [x] Sort options reorder correctly
- [x] Score badges color-coded
- [x] Avatar stack shows 5 max with "+X more"
- [x] Click navigates to detail
- [x] Empty state when no matches
- [x] Responsive (filters collapse on mobile)

---

### Slice 5: Meeting Detail & Transcript View
**Duration:** 5-6 hours | **Dependencies:** Slice 4

#### What to Deliver
Full transcript with speaker identification, key moment markers, and bidirectional navigation with feedback panel.

#### Transcript Features
- **Speaker segments:** Avatar, name, role, timestamp, text
- **User highlight:** Subtle visual distinction for PM's segments
- **Key moments:** Green (strength), yellow (improvement), red (missed opportunity)
- **Controls:** Search, speaker filter, jump to timestamp
- **Interactions:** Copy segment, link to moment, expand annotations

#### Mock Transcript Requirements
**40-50 segments representing realistic board meeting:**
- Natural conversation flow (not perfectly grammatical)
- Back-and-forth exchanges
- User speaks 8-10 times with varied lengths
- 6-8 key moments marked (3-4 strong, 2-3 improve, 1-2 missed)
- Realistic PM communication patterns (some strong, some improvable)

#### Layout
**Two-panel:** Transcript (60%) | Feedback (40%)
**Mobile:** Stacked or tabs

#### Acceptance Criteria
- [x] Header with full metadata
- [x] All segments display chronologically
- [x] User segments visually distinct
- [x] Key moments annotated correctly
- [x] Search highlights matches
- [x] Speaker filter works
- [x] Jump to timestamp scrolls correctly
- [x] Copy and link functions work
- [x] Bidirectional navigation with feedback
- [x] Smooth scrolling for long transcripts
- [x] Mobile: panels stack or tab
- [x] Loading and 404 states

---

### Slice 6: AI Feedback Panel with Next Steps
**Duration:** 5-6 hours | **Dependencies:** Slice 5

#### What to Deliver
Comprehensive coaching sidebar with 7 sections including **critical Next Steps** addition.

#### Feedback Panel Sections

**1. Overall Assessment**
- Large score (7.5/10) with gauge visualization
- Trend: "+0.8 from last meeting"
- 2-3 sentence summary
- Career badge: "Speaking at Senior PM level in 65% of responses"

**2. Dimension Scores**
Four dimensions with mini-gauges:
- Product Sense, Communication, Stakeholder Management, Technical Translation
- Expandable subcomponents showing granular breakdown

**3. Patterns Identified**
- **Strengths** (green): Positive patterns with examples
- **Areas to Improve** (yellow): Specific opportunities with recommended modules
- **Missed Opportunities** (red): Critical gaps with impact

**4. Key Moments Interactive List**
Each moment card includes:
- Timestamp and context
- What was said
- What went well / What to improve
- Better approach (for improvements)
- Link to relevant module
- "View in transcript" button

**5. Recommended Modules**
2-3 modules with:
- Why recommended (tied to specific moments)
- What you'll learn
- Time and difficulty
- Relevance score (92% match)

**6. Career Level Assessment**
- Current speaking level consistency (65%)
- Breakdown by skill dimension
- Next milestone with specific action

**7. Next Steps (THE CRITICAL ADDITION)**
2-4 prioritized, actionable steps:

**Example Steps:**
1. **Practice [Skill]** (15 min) ⭐ High Impact
   - Why: Tied to specific moments
   - Your gap: Clear explanation
   - [CTA: Start Practice Exercise]

2. **Apply Framework in Next Meeting**
   - Template provided
   - [CTA: Save Template] [CTA: Set Reminder]

3. **Review Your Strong Example** (2 min)
   - What made it strong
   - [CTA: Bookmark Moment]

4. **Track Progress** (Ongoing)
   - Current: 40% of responses
   - Target: 80% (Senior PM level)
   - [CTA: View Dashboard]

**Next Steps Logic:**
- High impact first (blocking progression)
- Quick win included (2-5 min action)
- Application step (real work, not just practice)
- Progress tracking (clear metrics)

#### Acceptance Criteria
- [x] All 7 sections display correctly
- [x] Score and trend accurate
- [x] Dimensions expand to show subcomponents
- [x] Patterns link to transcript timestamps
- [x] Key moments link to transcript
- [x] Module recommendations with relevance
- [x] Career assessment accurate
- [x] **Next Steps: 2-4 prioritized actions**
- [x] **Each step: impact, why, CTAs**
- [x] **Steps can be marked complete**
- [x] **CTAs navigate correctly**
- [x] **Completion persists across sessions**
- [x] Panel scrolls independently
- [x] Responsive (drawer/stack on mobile)
- [x] Export/share works

---

## Week 3 - Learning & Practice (Phase 1C)

### Slice 7: Module Library & Personalized Recommendations
**Duration:** 4 hours | **Dependencies:** Slice 6

#### What to Deliver
15-20 learning modules organized by category with personalized recommendations.

#### Module Categories
- Product Sense & Strategy
- Executive Communication
- Stakeholder Management
- Technical Translation
- Trade-off Articulation

#### Module Card Elements
- Impact badge (⭐⭐⭐ High, ⭐⭐ Medium, ⭐ Low)
- Difficulty and duration
- **Why recommended:** Personalized, links to meeting moments
- What you'll learn (3-4 bullets)
- Relevance score (% match to gaps)
- Career level tag
- Progress indicator
- Primary CTA (Start/Continue/Review)

#### Personalization Logic
Priority determined by:
1. Gap severity from meetings (highest weight)
2. Career level relevance
3. Frequency of issue (multiple meetings)
4. User's stated focus areas

#### Acceptance Criteria
- [x] 15-20 modules across categories
- [x] "Recommended for You" shows high-relevance first
- [x] Each card shows all elements
- [x] Personalized recommendations with meeting links
- [x] Category filters work
- [x] Sort by priority/duration/difficulty
- [x] Search finds by keyword
- [x] Progress indicators accurate
- [x] Mobile responsive

---

### Slice 8: Module Content & Exercise Structure
**Duration:** 5-6 hours | **Dependencies:** Slice 7

#### What to Deliver
Complete module with Learn and Practice tabs, frameworks, examples, and 5-8 exercises.

#### Learn Tab (4 Sections)
**1. The Problem:** Why this matters, common mistakes, stakes
**2. The Framework:** Visual diagram, concrete PM example
**3. Best Practices:** Do's/don'ts, weak vs strong examples with annotations
**4. Apply to Your Work:** Downloadable template/checklist

#### Practice Tab
5-8 exercises with varied formats:
- **Timed Response:** 60-90 seconds, record answer
- **Scenario-Based:** Multi-turn, branching
- **Compare & Improve:** Evaluate two versions, then record own
- **Framework Application:** Structure response using framework

#### Exercise Card Shows
- Number and title
- Format type badge
- Time estimate
- Difficulty
- Scenario preview
- Completion status
- "Start Exercise" button

#### Acceptance Criteria
- [x] Module detail with header and progress
- [x] Personalization callout with meeting refs
- [x] Learn tab: all 4 sections
- [x] Framework with visual diagram
- [x] Contrasting examples annotated
- [x] Template downloadable
- [x] Practice tab: 5-8 exercises
- [x] Format types visually distinct
- [x] Progress bar accurate
- [x] Tabs switch smoothly
- [x] Mobile responsive

---

### Slice 9: Practice Recording Interface
**Duration:** 3-4 hours | **Dependencies:** Slice 8

#### What to Deliver
Professional recording interface with 3 states: Pre-recording, Recording, Review.

#### State 1: Pre-Recording
- Exercise prompt (scenario, task, success criteria, tips)
- Microphone test
- "View example response" (optional)
- Large "Start Recording" button

#### State 2: Recording
- Prominent recording indicator (pulsing red dot)
- Large timer (changes color at warnings)
- Audio visualizer (waveform or level meter)
- Stop/Pause/Cancel controls
- Auto-stop at time limit (if applicable)

#### State 3: Review
- Audio playback with controls
- Generated transcript (instant in Phase 1)
- Preliminary evaluation:
  - "You hit 3 of 4 key points"
  - Quick assessment of what's included/missing
  - Estimated score
- Actions: Get Full Feedback, Record Again, Save for Later

#### Technical (Phase 1)
- Browser MediaRecorder API
- Mock instant transcription
- Audio stored as Blob temporarily

#### Acceptance Criteria
- [x] Exercise prompt displays fully
- [x] Mic test works
- [x] Example response available
- [x] Recording starts immediately
- [x] Recording indicator clear
- [x] Timer accurate with color changes
- [x] Audio visualizer shows levels
- [x] Stop button works
- [x] Playback functions
- [x] Transcript appears (instant Phase 1)
- [x] Preliminary evaluation shows
- [x] All CTAs navigate correctly
- [x] Works across browsers
- [x] Mobile: device mic works
- [x] Confirmation before navigation

---

### Slice 10: Practice Feedback Display
**Duration:** 4-5 hours | **Dependencies:** Slice 9

#### What to Deliver
Detailed coaching on practice with annotated transcript, criteria breakdown, expert example, and next steps.

#### Feedback Sections

**1. Overall Assessment**
- Score with improvement tracking
- Comparison to baseline
- Summary narrative

**2. Annotated Transcript**
- Green (strengths), Yellow (improvements), Red (missing)
- Each annotation: what happened, why it matters, better approach

**3. Criteria Breakdown**
Specific to exercise (e.g., for Trade-off Communication):
- Answer-First Structure: 9.0/10 ✓
- Data-Backed Reasoning: 8.5/10 ✓
- Trade-off Articulation: 7.0/10 ⚠️ *focus area*
- Stakeholder Acknowledgment: 6.5/10 ⚠️
- Conciseness: 8.0/10 ✓

**4. Comparison to Real Meetings**
Shows practice vs meeting patterns (if data available)

**5. Expert Example**
Model response with annotations, toggle for side-by-side comparison

**6. Next Steps**
2-4 recommendations:
- Practice another exercise
- Review strong example
- Try again with specific focus
- Apply in real work

#### Acceptance Criteria
- [x] Score with improvement indicator
- [x] Annotated transcript with all types
- [x] Criteria breakdown accurate
- [x] Comparison section (if applicable)
- [x] Expert example with toggle
- [x] Next steps actionable
- [x] All CTAs work
- [x] Can save/bookmark
- [x] Mobile responsive

---

## Week 4 - Progress & Polish (Phase 1D)

### Slice 11: Progress Dashboard
**Duration:** 5-6 hours | **Dependencies:** Slices 4-10

#### What to Deliver
Comprehensive progress visualization with 6 sections.

#### Dashboard Sections

**1. Career Level Progress**
```
Product Manager ──────●──────── Senior PM
                      65%

Progress breakdown:
✓ Product Sense         100% At level
✓ Technical Translation  95% Nearly there
⚠️ Communication         70% Improving
⚠️ Stakeholder Mgmt      60% Focus area

Next milestone: Reach 75% via Trade-off module + 2 meetings
```

**2. Skill Development Radar**
Multi-dimensional chart with 3 overlays:
- Current (solid)
- 30 days ago (dotted)
- Target level (dashed)

**3. Performance Trends**
Two charts:
- Meeting performance (last 10-15)
- Practice performance (all sessions)
- Trend lines

**4. Module & Practice Completion**
Lists: Completed, In Progress, Recommended

**5. Recent Highlights (This Week)**
Auto-generated achievements, improvements, concerns

**6. Weekly Insights**
AI analysis: strengths, improvement area, recommendations, patterns, next focus

#### Acceptance Criteria
- [x] Career progress accurate
- [x] Radar chart with overlays
- [x] Trend charts interactive
- [x] Module lists correct status
- [x] Highlights data-driven
- [x] Insights specific and actionable
- [x] Date range selector works
- [x] Export PDF
- [x] All links navigate correctly
- [x] Mobile responsive

---

### Slice 12: Settings & Preferences
**Duration:** 3 hours

#### What to Deliver
Complete settings across 6 categories.

**Categories:**
- Profile (name, email, role, target, company, photo)
- Notifications (toggles, frequency, channels)
- Privacy & Data (collection info, controls, sharing)
- Integrations (calendar, meeting platforms, bot config)
- Account Management (subscription, security, danger zone)
- Preferences (display, learning style, communication tone)

#### Acceptance Criteria
- [x] All editable fields save
- [x] Notifications control what appears
- [x] Privacy controls work
- [x] Integration status displays
- [x] Bot config saves
- [x] Preferences apply app-wide
- [x] Settings persist
- [x] Mobile responsive

---

### Slice 13: Help & Onboarding Tours
**Duration:** 2 hours

#### What to Deliver
Help system with tours, documentation, and FAQ.

**Components:**
- Global help button
- Contextual help icons
- Help panel (search, categories, FAQ)
- Product tours (4 walkthroughs)
- Video tutorials

#### Acceptance Criteria
- [x] Help accessible everywhere
- [x] Tours highlight correct elements
- [x] Tours dismissible
- [x] FAQ organized and searchable
- [x] Videos play
- [x] All content accurate
- [x] No broken links

---

### Slice 14: Mobile Responsive Polish
**Duration:** 3 hours

#### What to Deliver
Mobile optimization across all features.

**Key Adaptations:**
- Navigation: Bottom bar or hamburger
- Layouts: Single column stacking
- Touch targets: Min 44x44px
- Performance: Fast, smooth
- No horizontal scroll

#### Acceptance Criteria
- [x] Works on 375px+ screens
- [x] All text readable without zoom
- [x] All interactions tappable
- [x] Navigation works
- [x] Recording uses device mic
- [x] Charts adapt
- [x] Forms usable
- [x] Tested iOS + Android
- [x] No performance issues

---

### Slice 15: Testing & Bug Fixes
**Duration:** 2-3 hours

#### What to Deliver
Thoroughly tested app, bugs fixed.

**Testing Coverage:**
- Cross-browser (Chrome, Safari, Firefox, Edge)
- Cross-device (desktop, tablet, phone)
- All workflows (auth, meetings, learning, practice, progress)
- Edge cases (empty, errors, boundaries, behaviors)
- Accessibility (keyboard, focus, contrast, screen reader)
- Performance (load time, smoothness, memory)

**Bug Priorities:**
- Critical: Blocks core functionality → Must fix
- High: Major features broken → Must fix
- Medium: Minor issues → Document
- Low: Edge cases → Document

#### Acceptance Criteria
- [x] All features tested across browsers/devices
- [x] All workflows complete without errors
- [x] Edge cases handled
- [x] No console errors
- [x] No layout breaks
- [x] Keyboard navigation works
- [x] Basic accessibility met
- [x] Performance acceptable
- [x] Critical/high bugs fixed
- [x] Known issues documented

---

## Implementation Guidelines

### Development Sequence
1. **Never skip slices** - Each builds on previous
2. **Validate before moving on** - Check acceptance criteria
3. **Use mock data liberally** - Make it feel real
4. **Test as you build** - Don't wait for Slice 15
5. **Keep UX consistent** - Maintain design system

### Mock Data Best Practices
- **Realistic variety** - Different types, scores, patterns
- **Appropriate volume** - Enough to test interactions
- **Edge cases included** - Empty, long, many
- **Consistency matters** - Same user across features

### Quality Standards
- **No console errors** - Clean development experience
- **Responsive always** - Mobile not an afterthought
- **Accessible basics** - Keyboard, focus, contrast
- **Performance conscious** - Smooth, not janky
- **User-tested thinking** - How will beta users react?

---

## Phase Completion Checklist

### Week 1 Complete
- [ ] Design system established and documented
- [ ] Authentication flow with two paths works
- [ ] Dashboard with empty states looks polished

### Week 2 Complete
- [ ] 10 mock meetings with varied, realistic data
- [ ] Transcript view feels like learning document
- [ ] Feedback panel includes Next Steps (critical)

### Week 3 Complete  
- [ ] 15-20 modules personalized by meeting patterns
- [ ] Recording interface professional and confidence-building
- [ ] Practice feedback detailed and actionable

### Week 4 Complete
- [ ] Progress dashboard shows clear development arc
- [ ] All settings functional and persistent
- [ ] Mobile experience polished, not just working
- [ ] Beta users can complete full flow without blockers

### Ready for Beta
- [ ] 10 users can signup and complete onboarding (both paths)
- [ ] Can view meeting analysis with actionable feedback
- [ ] Can complete learning modules and practice exercises
- [ ] Can track progress toward career goals
- [ ] No critical bugs, known issues documented
- [ ] User can provide feedback on value and usability

---

## Success Metrics

### User Validation Goals
- **Value prop clarity:** Do users understand what ShipSpeak does?
- **Two-path effectiveness:** Does fork make sense? Which path preferred?
- **Feedback quality:** Is feedback specific enough to be actionable?
- **Learning effectiveness:** Do modules and practice feel valuable?
- **Progress motivation:** Does dashboard inspire continued use?
- **Next Steps impact:** Do users act on recommended steps?

### Technical Quality Goals
- **Performance:** <2s load times, 60fps interactions
- **Reliability:** No critical bugs in core flows
- **Usability:** Mobile and desktop both feel intentional
- **Accessibility:** Basic WCAG standards met

---

## Transitioning to Phase 2

### What Changes
**Data Sources:**
- Mock JSON → Real API calls
- localStorage → Supabase database
- Instant responses → Real API latency
- Pre-written feedback → OpenAI analysis
- Mock transcripts → Deepgram transcription

### What Stays the Same
- All UI components and layouts
- User flows and interactions
- Visual design and styling  
- Navigation structure
- Progress calculations

### Phase 2 Prep Checklist
- [ ] Document all mock data structures (becomes API contracts)
- [ ] List all state that needs database persistence
- [ ] Identify loading states that need real implementations
- [ ] Note error scenarios to handle
- [ ] Capture user feedback on UX (what stays, what changes)

---

**Document Status:** Complete Phase 1 Specification
**Next Action:** Begin implementation with Slice 1, or generate Phase 2 documentation

---

*For detailed implementation guidance on specific slices, refer to master prompt or request expanded slice documentation.*
