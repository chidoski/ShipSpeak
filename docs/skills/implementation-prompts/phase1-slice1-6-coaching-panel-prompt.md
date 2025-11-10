# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-6: AI-Powered Executive Coaching & Strategic Development Panel

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's AI-powered executive coaching panel with PM-specific strategic development and career-intelligent coaching interactions.

---

## Implementation Target: AI-Powered Executive Coaching & Strategic Development Panel
**Development Time**: 5-6 hours  
**Slice ID**: 1-6 "AI-Powered Executive Coaching & Strategic Development Panel"

### Core Purpose
Build an intelligent coaching panel that provides PM-specific strategic development through AI-powered coaching conversations, executive presence training, and career-intelligent mentorship interactions.

---

## Critical Framework Integration

### PM Career Transition Coaching (MANDATORY)
Coaching panel must provide transition-specific development for each PM career path:

#### PO → PM Transition Coaching
- **Strategic Thinking Development**: Coaching conversations that build customer outcome focus
- **Business Vocabulary Acquisition**: Interactive vocabulary building with business context integration
- **Stakeholder Communication Expansion**: Practice scenarios for non-engineering stakeholder engagement
- **Decision Framework Training**: Guided practice with RICE, ICE, and value-based prioritization

#### PM → Senior PM Transition Coaching  
- **Executive Communication Mastery**: Answer-first methodology training with real-time feedback
- **Trade-off Articulation Excellence**: Complex decision reasoning practice with framework integration
- **Influence Without Authority Development**: Leadership language coaching and confidence building
- **Strategic Altitude Control**: Audience-appropriate communication depth training

#### Senior PM → Group PM Transition Coaching
- **Portfolio Strategy Communication**: Multi-product thinking and communication practice
- **Team Development Coaching**: Mentorship conversation skills and coaching language development
- **Organizational Impact Integration**: Department-level stakeholder management coaching
- **Resource Strategy Communication**: Sophisticated headcount and priority reasoning training

#### Group PM → Director Transition Coaching
- **Board Presentation Excellence**: C-suite communication structure and confidence training
- **Business Model Fluency Development**: P&L reasoning and financial communication coaching
- **Market Strategy Articulation**: Competitive positioning and industry trend integration practice
- **Organizational Leadership**: Vision communication and team alignment coaching

### Industry-Specific Coaching Contexts
Coaching panel must adapt to user's industry-specific communication requirements:

#### Healthcare & Life Sciences PM Coaching
- **Regulatory Communication Training**: FDA, HIPAA, clinical trial communication practice
- **Patient Outcome Prioritization**: Safety-first decision framing coaching scenarios
- **Evidence-Based Reasoning Development**: Clinical evidence integration coaching
- **Compliance Communication**: Regulatory requirement integration in product decisions

#### Cybersecurity & Enterprise Security PM Coaching  
- **Risk Communication Excellence**: Threat assessment articulation training
- **Technical Translation Mastery**: Security concept communication for business stakeholders
- **Compliance Framework Integration**: SOC2, ISO27001, GDPR communication training
- **Zero-Trust Architecture**: Security-first product thinking communication development

#### Financial Services & Fintech PM Coaching
- **Regulatory Compliance Communication**: SEC, banking regulation integration practice
- **Risk Management Integration**: Financial risk assessment communication training
- **Trust-Building Language Development**: Consumer confidence messaging practice
- **Audit Readiness Training**: Financial compliance and reporting communication

#### Enterprise Software & B2B PM Coaching
- **ROI Communication Excellence**: Business case development and articulation training
- **Implementation Planning Communication**: Customer success conversation practice
- **Customer Advocacy Development**: Reference creation and renewal strategy training
- **Enterprise Sales Support**: Complex deal and technical stakeholder management

#### Consumer Technology & Apps PM Coaching
- **User Experience Communication**: Behavioral psychology integration practice
- **Growth Metrics Fluency**: DAU, MAU, retention communication training
- **Rapid Iteration Framework**: A/B testing communication effectiveness coaching
- **Platform Thinking Development**: Network effects and ecosystem communication

### Meeting Type Coaching Scenarios
Panel must provide meeting-specific communication training:

#### Board Presentation Coaching
- **Executive Summary Structure**: 2-3 minute presentation organization training
- **Metrics Communication**: Business impact and competitive position articulation
- **Confidence Building**: Definitive language and risk acknowledgment practice
- **Strategic Narrative Development**: Market context and business model integration

#### Planning Session Coaching
- **Strategic Communication**: Market trends and competitive analysis integration
- **Resource Reasoning**: Headcount and budget allocation rationale training
- **Timeline Communication**: Realistic estimation with dependency awareness
- **Cross-functional Coordination**: Engineering, design, marketing alignment practice

#### Stakeholder Update Coaching
- **Progress Communication**: Commitment tracking and success criteria articulation
- **Blocker Communication**: Escalation clarity and solution proposition training
- **Executive Reporting**: Appropriate detail levels and action-oriented communication
- **Success Metric Integration**: KPI and OKR communication with business context

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core coaching panel system structure
interface CoachingPanelProps {
  userProfile: UserProfile
  coachingSession: CoachingSession
  developmentFocus: DevelopmentArea[]
  careerContext: PMTransitionType
}

interface CoachingSession {
  id: string
  sessionType: 'STRATEGIC_THINKING' | 'EXECUTIVE_PRESENCE' | 'INDUSTRY_FLUENCY' | 'FRAMEWORK_PRACTICE'
  duration: number
  focusAreas: DevelopmentArea[]
  userProgress: ProgressMetrics
  aiCoachPersona: CoachPersona
}

interface CoachPersona {
  expertiseArea: string
  industry: Industry
  communicationStyle: 'DIRECT' | 'SOCRATIC' | 'SUPPORTIVE' | 'CHALLENGING'
  pmLevel: PMRole
  coachingApproach: CoachingMethodology[]
}

interface CoachingInteraction {
  userInput: string
  coachResponse: CoachResponse
  developmentGoals: DevelopmentGoal[]
  realTimeCoaching: RealTimeCoaching
  progressTracking: ProgressUpdate
}

interface CoachResponse {
  response: string
  coachingMethod: string
  developmentFocus: string[]
  nextQuestions: string[]
  improvementSuggestions: string[]
}
```

### Coaching Panel Component Structure
```
CoachingPanel/
├── CoachingOrchestrator.tsx     # Core coaching session management
├── AICoachPersonas/
│   ├── StrategicThinkingCoach.tsx # Business strategy and thinking development
│   ├── ExecutivePresenceCoach.tsx # Leadership communication and presence
│   ├── IndustryExpertCoach.tsx    # Sector-specific expertise coaching
│   └── FrameworkMasteryCoach.tsx  # PM framework application training
├── CoachingMethods/
│   ├── SocraticQuestioning.tsx    # Question-based development approach
│   ├── RolePlayingScenarios.tsx   # Situational practice and feedback
│   ├── FrameworkApplication.tsx   # Structured framework practice
│   └── RealTimeCoaching.tsx       # Live conversation coaching
├── DevelopmentTracking/
│   ├── SkillProgressMonitor.tsx   # Real-time skill development tracking
│   ├── CoachingGoalSetting.tsx    # Development objective management
│   ├── MilestoneAchievement.tsx   # Progress celebration and motivation
│   └── AdaptiveDifficulty.tsx     # Dynamic coaching challenge adjustment
└── CoachingInterface/
    ├── ConversationView.tsx       # Main coaching conversation interface
    ├── DevelopmentDashboard.tsx   # Progress visualization and insights
    ├── CoachingHistory.tsx        # Session history and pattern analysis
    └── PersonalizedPlan.tsx       # Custom development roadmap
```

### Mock Data Requirements
Create comprehensive coaching scenarios and responses:

#### AI Coach Persona Examples
```typescript
const mockCoachPersonas = [
  {
    name: 'Sarah Chen',
    expertise: 'Executive Communication',
    industry: 'fintech',
    background: 'Former VP Product at Stripe, 12 years PM experience',
    coachingStyle: 'Direct, results-focused with frameworks',
    specialties: ['Board presentations', 'C-suite stakeholder management', 'Financial services regulation']
  },
  {
    name: 'Marcus Rodriguez',
    expertise: 'Strategic Thinking',
    industry: 'enterprise_software',
    background: 'Former Group PM at Salesforce, McKinsey consulting background',
    coachingStyle: 'Socratic questioning, framework-driven',
    specialties: ['Portfolio strategy', 'Business case development', 'Cross-functional leadership']
  },
  {
    name: 'Dr. Jennifer Kim',
    expertise: 'Industry-Specific Development',
    industry: 'healthcare',
    background: 'Former Director of Product at Epic Systems, MD background',
    coachingStyle: 'Evidence-based, patient-outcome focused',
    specialties: ['Regulatory compliance', 'Clinical evidence integration', 'Healthcare stakeholder management']
  }
]
```

#### Coaching Conversation Examples
```typescript
const mockCoachingDialogue = {
  userMessage: "I'm struggling to communicate the ROI of our new feature to executive stakeholders. They keep asking for more data but I feel like I'm losing them in the details.",
  
  coachResponse: {
    acknowledgment: "That's a classic PM challenge - the data-story balance. Let me coach you through the answer-first approach.",
    
    socraticQuestion: "Before we dive into your data, what's the single most important business outcome this feature drives?",
    
    frameworkSuggestion: "Let's use the Amazon answer-first structure: Conclusion → Evidence → Implications. What's your one-sentence conclusion about this feature's value?",
    
    practiceScenario: "Let's roleplay. I'm your CEO, and you have 30 seconds to convince me. Start with your conclusion, then I'll ask for details. Ready?",
    
    developmentGoal: "Master executive communication rhythm: Lead with impact, support with evidence, close with next steps."
  },
  
  followUpCoaching: [
    "Great start! Now let's work on making that conclusion more definitive. Instead of 'should drive value,' try 'will increase revenue by X.'",
    "Perfect executive presence. Now, when they ask for data, anchor it to that business outcome. What specific metrics support your conclusion?",
    "Excellent! You're controlling the conversation while being responsive. That's senior PM-level communication."
  ]
}
```

---

## User Experience Requirements

### Coaching Session Interface Design
Create immersive, conversation-focused coaching experience:

#### Main Coaching View
- **Coach Avatar**: Professional coach persona with industry expertise indication
- **Conversation Flow**: Chat-like interface optimized for coaching dialogue
- **Real-time Feedback**: Live coaching hints and communication pattern recognition
- **Development Tracking**: Progress indicators for specific skills being practiced

#### Coaching Method Selection
- **Socratic Questioning**: Development through guided self-discovery
- **Role-Playing Scenarios**: Situational practice with realistic stakeholder interactions
- **Framework Application**: Structured practice with PM frameworks and methodologies
- **Real-time Coaching**: Live conversation feedback and improvement suggestions

#### Progress Integration
- **Session Goals**: Clear development objectives for each coaching session
- **Skill Progression**: Visual tracking of communication skill improvement
- **Milestone Achievements**: Recognition and celebration of development progress
- **Personalized Roadmap**: Custom coaching plan based on career transition goals

### Adaptive Coaching Experience
- **Difficulty Adjustment**: Coaching complexity adapts to user's skill progression
- **Industry Contextualization**: Coaching scenarios reflect user's PM sector
- **Career Stage Relevance**: Coaching content appropriate for current transition goals
- **Learning Style Adaptation**: Coaching methods adjust to user's preferred learning approach

---

## Success Validation Criteria

### Coaching Quality Validation
- **Development Effectiveness**: Users demonstrate measurable communication skill improvement
- **Career Relevance**: Coaching feels specifically applicable to user's transition goals
- **Industry Specificity**: Coaching scenarios incorporate sector-specific requirements
- **Engagement Quality**: Users complete coaching sessions and request additional development

### Technical Performance Validation  
- **Response Quality**: AI coaching responses feel natural and professionally relevant
- **Real-time Interaction**: Coaching conversation flows smoothly without delays
- **Progress Tracking**: Development metrics accurately reflect user improvement
- **Mobile Optimization**: Full coaching experience available on mobile devices

### Framework Integration Validation
- **Career Transition Support**: Coaching effectively supports all PM transition patterns
- **Industry Context Integration**: Healthcare, cybersecurity, fintech, enterprise, consumer contexts
- **Meeting Type Preparation**: Coaching prepares users for specific meeting types effectively
- **Continuous Development**: Coaching integrates with overall skill development framework

---

*Implementation Time Estimate: 5-6 hours*
*Success Criteria: AI-powered executive coaching with PM-specific strategic development*