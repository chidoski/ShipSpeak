# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-3: Dashboard Layout & Career-Intelligent Empty States

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent dashboard hub with career-aware empty states and continuous learning integration.

---

## Implementation Target: Dashboard Layout & Career-Intelligent Empty States
**Development Time**: 3-4 hours  
**Slice ID**: 1-3 "Dashboard Layout & Career-Intelligent Empty States"

### Core Purpose
Build an intelligent dashboard hub that immediately reinforces career progression context and learning continuity, with sophisticated empty states that guide users toward PM communication mastery regardless of meeting availability.

---

## Critical Framework Integration

### PM Career Transition Patterns (MANDATORY)
Every dashboard element must serve specific PM career transitions:

#### PO → PM Dashboard Focus
- **Strategic Vocabulary Development**: Metrics showing transition from "delivery" to "outcomes" language
- **Stakeholder Expansion Tracking**: Progress from engineering-focused to cross-functional influence
- **Business Impact Reasoning**: Development of strategic thinking vs task completion mindset

#### PM → Senior PM Dashboard Focus  
- **Trade-off Articulation Scores**: Framework-based decision reasoning (RICE, value vs effort)
- **Executive Communication Readiness**: Answer-first structure mastery, confidence indicators
- **Cross-functional Influence Indicators**: Leadership without authority progress tracking

#### Senior PM → Group PM Dashboard Focus
- **Portfolio Thinking Development**: Multi-product strategy communication patterns
- **Team Mentorship Communication**: Coaching language and development conversation skills
- **Organizational Impact Metrics**: Department-level stakeholder management effectiveness

#### Group PM → Director Dashboard Focus
- **Board Presentation Readiness**: C-suite communication confidence and structure mastery
- **Business Model Fluency**: P&L impact reasoning and financial communication competency
- **Market Strategy Communication**: Competitive positioning and industry trend articulation

### Industry-Specific Dashboard Context
Dashboard must adapt to user's industry context:

#### Healthcare & Life Sciences PM
- **Regulatory Language Proficiency**: FDA, HIPAA, clinical trial communication tracking
- **Safety-First Framing Assessment**: Patient outcome prioritization in decision communication
- **Evidence-Based Reasoning Competency**: Clinical evidence integration in product decisions

#### Cybersecurity & Enterprise Security PM  
- **Risk Communication Effectiveness**: Threat assessment and vulnerability articulation skills
- **Technical Translation Competency**: Security concepts for business stakeholder clarity
- **Compliance Framework Fluency**: SOC2, ISO27001, GDPR communication requirements

#### Financial Services & Fintech PM
- **Regulatory Compliance Readiness**: SEC, banking regulations, audit communication preparation
- **Risk Management Communication**: Financial risk assessment and officer alignment skills
- **Trust-Building Language Proficiency**: Consumer confidence and fraud prevention messaging

#### Enterprise Software & B2B PM
- **ROI Communication Competency**: Business case development and value proposition articulation
- **Implementation Planning Articulation**: Customer success and change management communication
- **Customer Advocacy Development**: Reference creation and renewal strategy conversation skills

#### Consumer Technology & Apps PM
- **User Experience Communication**: Behavioral psychology and engagement optimization language
- **Growth Metrics Fluency**: DAU, MAU, retention, viral coefficient communication mastery
- **Rapid Iteration Framework**: A/B testing and experimentation communication patterns

### Meeting Type Standards Integration
Dashboard elements must reflect different meeting communication requirements:

#### Board Presentation Elements
- **Executive Summary Readiness**: 2-3 minute presentation structure competency
- **Metrics Focus Preparation**: Business impact and competitive position communication
- **Confidence Indicators**: Definitive language and risk acknowledgment skills

#### Planning Session Elements
- **Strategic Altitude Communication**: Market trends and competitive analysis articulation
- **Resource Reasoning Tracking**: Headcount and budget allocation rationale development
- **Timeline Communication Effectiveness**: Realistic estimation with dependency awareness

#### Stakeholder Update Elements
- **Progress Clarity Metrics**: Commitment tracking and success criteria communication
- **Blocker Communication Skills**: Escalation clarity and solution proposition abilities
- **Cross-functional Coordination**: Engineering, design, marketing, sales alignment competency

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core dashboard component structure
interface DashboardProps {
  user: UserProfile
  careerTransition: PMTransitionType
  industry: IndustryContext
  learningPath: 'MEETING_ANALYSIS' | 'PRACTICE_FIRST'
}

interface UserProfile {
  currentRole: PMRole
  targetRole: PMRole
  industry: Industry
  careerTimeline: number // months to target role
  onboardingComplete: boolean
  preferences: UserPreferences
}

interface PMRole {
  level: 'PO' | 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR' | 'VP'
  title: string
  competencyRequirements: CompetencyArea[]
  industrySpecificSkills: string[]
}
```

### Dashboard Component Structure
```
Dashboard/
├── DashboardHeader.tsx          # Career-aware welcome & navigation
├── QuickStatsCards.tsx          # 4 PM-specific metric cards
├── MainContentArea.tsx          # Adaptive content by learning path
├── EmptyStates/
│   ├── NoMeetingsYet.tsx       # Foundation skill building CTA
│   ├── NewUserWelcome.tsx      # Career roadmap introduction
│   ├── PracticeFirstEmpty.tsx  # Skill building progression
│   └── MeetingAnalysisEmpty.tsx # Meeting preparation focus
├── IndustryContext/
│   ├── HealthcareDashboard.tsx
│   ├── CybersecurityDashboard.tsx
│   ├── FintechDashboard.tsx
│   ├── EnterpriseDashboard.tsx
│   └── ConsumerTechDashboard.tsx
└── CareerProgression/
    ├── ProgressIndicators.tsx   # Visual career milestone tracking
    ├── MilestoneCards.tsx       # Next level requirements
    └── BenchmarkComparison.tsx  # FAANG standard alignment
```

### Mock Data Requirements
Create comprehensive mock data that demonstrates:

#### Career Progression Metrics
```typescript
const mockProgressData = {
  currentLevel: 'PM',
  targetLevel: 'SENIOR_PM',
  progressPercentage: 67,
  skillGaps: [
    {
      area: 'Executive Communication',
      current: 6.2,
      target: 8.0,
      industry: 'fintech'
    },
    {
      area: 'Trade-off Articulation', 
      current: 5.8,
      target: 8.5,
      frameworks: ['RICE', 'ICE', 'Value vs Effort']
    }
  ],
  industryBenchmarks: {
    sector: 'fintech',
    regulatoryCompliance: 7.8,
    riskCommunication: 6.5,
    trustBuilding: 7.2
  }
}
```

#### Learning Progress Data
```typescript
const mockLearningData = {
  weeklyStreak: 12,
  modulesCompleted: 8,
  practiceSessionsCompleted: 15,
  foundationSkillsMastery: {
    pmVocabulary: 85,
    executivePresence: 72,
    frameworkApplication: 68
  },
  nextMilestones: [
    'Complete Strategic Communication module',
    'Practice board presentation structure',
    'Master trade-off articulation framework'
  ]
}
```

---

## User Experience Requirements

### Empty States Strategy (Critical)
Each empty state must educate and motivate, not just inform:

#### No Meetings Yet Empty State
**Headline**: "Start Building PM Executive Presence"
**Subtext**: "Master foundation skills that make every interaction more impactful"
**CTAs**: 
- "Begin Strategic Vocabulary Development" (PO→PM specific)
- "Practice Executive Communication Basics"
- "Explore [Industry] PM Communication Templates"

#### New User First Visit Empty State  
**Headline**: "Your Path to [Target Role] Communication Mastery"
**Components**:
- Visual career progression roadmap
- FAANG-standard benchmark indicators
- Industry-specific milestone definitions
- Estimated timeline based on user's commitment level

#### Practice-First Path Empty State
**Headline**: "Your PM Communication Foundation"
**Features**:
- Structured skill-building progression tracker
- Micro-learning opportunities (3-5 minute sessions)
- Foundation → Practice → Mastery pathway visualization
- Industry-contextualized practice scenarios

#### Meeting Analysis Path Empty State
**Headline**: "Ready for Your Next Meeting"
**Tools**:
- Meeting preparation templates by meeting type
- Executive communication checklists
- Post-meeting reflection frameworks
- Pattern recognition training modules

### Responsive Design Requirements
- **Mobile-first approach**: Dashboard fully functional on mobile devices
- **Touch targets**: Minimum 44x44px for all interactive elements
- **Information hierarchy**: Key metrics visible without horizontal scrolling
- **Progressive disclosure**: Detailed insights available through interaction

---

## Industry Validation & Quality Standards

### FAANG Communication Standards Integration
- **Amazon Answer-First**: Dashboard metrics track conclusion-driven communication development
- **Google Data-Driven Reasoning**: Progress indicators for evidence-based decision communication
- **Meta User-Centric Thinking**: Metrics showing customer problem identification skills
- **Netflix Context Setting**: High-context communication competency tracking

### Performance Standards
- **Load Time**: Dashboard renders under 2 seconds on standard connection
- **Interaction Responsiveness**: Sub-100ms response to user interactions
- **Mobile Performance**: Smooth scrolling and interaction on mobile devices
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support

### Success Metrics
- **Career Context Clarity**: Users immediately understand their progression status
- **Action Orientation**: Empty states lead to specific, valuable next steps  
- **Learning Continuity**: Always-available progress indicators encourage consistent engagement
- **Industry Relevance**: Dashboard content feels specifically relevant to user's PM context

---

## Implementation Checklist

### Phase 1: Core Dashboard Structure ✅
- [ ] Dashboard layout with career-aware header
- [ ] Four PM-specific metric cards with realistic mock data
- [ ] Adaptive main content area supporting both learning paths
- [ ] Responsive design working across device sizes

### Phase 2: Empty States Implementation ✅
- [ ] Four distinct empty states with career-specific messaging
- [ ] Industry-contextualized CTAs and recommendations
- [ ] Visual progress indicators and milestone tracking
- [ ] FAANG-standard benchmark integration

### Phase 3: Career Transition Integration ✅
- [ ] Dashboard adapts to all four PM transition patterns
- [ ] Industry-specific dashboard contextualization
- [ ] Meeting type standards reflected in dashboard elements
- [ ] Continuous learning framework integration

### Phase 4: Polish & Testing ✅
- [ ] Mock data demonstrates realistic PM performance metrics
- [ ] Dashboard loading states feel polished and professional
- [ ] Mobile responsive design maintains full functionality
- [ ] Career progression messaging reinforces user's specific transition goals

---

## Success Validation Criteria

### User Experience Validation
- **Immediate Value Recognition**: Users understand their career progression status within 10 seconds
- **Clear Next Steps**: Every empty state provides specific, actionable next steps
- **Industry Relevance**: Dashboard content feels specifically tailored to user's PM context
- **Learning Motivation**: Users are encouraged to continue skill development

### Technical Validation  
- **Performance**: Dashboard loads quickly and responds smoothly across devices
- **Data Integration**: Mock data patterns ready for Phase 2 backend integration
- **Component Reusability**: Dashboard components support future feature expansion
- **Accessibility**: Full keyboard navigation and screen reader compatibility

### Framework Integration Validation
- **Career Patterns**: All PM transition paths clearly supported and reinforced
- **Industry Context**: Healthcare, cybersecurity, fintech, enterprise, consumer contexts integrated
- **Meeting Standards**: Board, planning, stakeholder, research, coaching meeting preparation supported
- **Continuous Learning**: Foundation → Practice → Mastery progression visible and encouraging

---

*Implementation Time Estimate: 3-4 hours*
*Success Criteria: Career-intelligent dashboard with sophisticated empty states that reinforce PM communication mastery journey*