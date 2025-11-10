# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-13: Help & Onboarding Tours

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent help and onboarding system with PM-specific guidance tours and career-intelligent user education.

---

## Implementation Target: Help & Onboarding Tours
**Development Time**: 2 hours  
**Slice ID**: 1-13 "Help & Onboarding Tours"

### Core Purpose
Build comprehensive help and onboarding system that educates users on PM-specific features while providing career-intelligent guidance tours and contextual assistance.

---

## Critical Framework Integration

### PM Career Transition Onboarding (MANDATORY)
Onboarding must provide transition-specific guidance and education:

#### PO → PM Transition Onboarding
- **Strategic Thinking Introduction**: Guided tour of business outcome focus vs delivery mindset features
- **PM Vocabulary Education**: Interactive introduction to business terminology and stakeholder communication
- **Framework Discovery**: Hands-on introduction to RICE, ICE, value-based prioritization tools
- **Cross-functional Communication**: Guided practice with stakeholder engagement beyond engineering

#### PM → Senior PM Transition Onboarding  
- **Executive Communication Mastery**: Interactive tour of answer-first methodology and structure tools
- **Trade-off Articulation Introduction**: Guided exploration of complex decision reasoning features
- **Authority Development**: Introduction to influence without authority communication practice
- **Strategic Altitude Control**: Tour of stakeholder-appropriate detail level adaptation features

#### Senior PM → Group PM Transition Onboarding
- **Portfolio Strategy Introduction**: Guided tour of multi-product thinking and strategic communication features
- **Leadership Development**: Interactive introduction to mentorship and team development tools
- **Organizational Impact**: Tour of department-level stakeholder management practice features
- **Resource Strategy**: Introduction to sophisticated resource allocation communication tools

#### Group PM → Director Transition Onboarding
- **Board Presentation Mastery**: Interactive tour of C-suite communication and executive presence features
- **Business Model Education**: Guided exploration of P&L reasoning and financial communication tools
- **Market Strategy Introduction**: Tour of competitive positioning and industry trend analysis features
- **Vision Communication**: Introduction to organizational leadership and culture development practice

### Industry-Specific Onboarding Tours
Onboarding must provide industry-contextualized feature education:

#### Healthcare & Life Sciences PM Onboarding
- **Regulatory Communication Tour**: Interactive introduction to FDA, HIPAA, clinical trial features
- **Patient Outcome Prioritization**: Guided tour of safety-first decision communication tools
- **Evidence Integration Introduction**: Tour of clinical evidence communication practice features
- **Healthcare Stakeholder Education**: Introduction to provider, payer, patient advocacy communication

#### Cybersecurity & Enterprise Security PM Onboarding  
- **Risk Communication Tour**: Interactive introduction to threat assessment and vulnerability features
- **Technical Translation Education**: Guided tour of security concept communication tools
- **Compliance Framework Introduction**: Tour of SOC2, ISO27001, GDPR communication features
- **Security-First Thinking**: Introduction to zero-trust architecture communication practice

#### Financial Services & Fintech PM Onboarding
- **Regulatory Compliance Tour**: Interactive introduction to SEC, banking regulation features
- **Risk Management Education**: Guided tour of financial risk assessment communication tools
- **Trust-Building Introduction**: Tour of consumer confidence and fraud prevention features
- **Financial Metrics Education**: Introduction to P&L reasoning and revenue model communication

#### Enterprise Software & B2B PM Onboarding
- **ROI Communication Tour**: Interactive introduction to business case and value proposition features
- **Implementation Strategy Education**: Guided tour of customer success communication tools
- **Enterprise Stakeholder Introduction**: Tour of complex stakeholder management features
- **Customer Advocacy Education**: Introduction to reference creation and renewal strategy tools

#### Consumer Technology & Apps PM Onboarding
- **User Experience Tour**: Interactive introduction to behavioral psychology and engagement features
- **Growth Metrics Education**: Guided tour of DAU, MAU, retention communication tools
- **Experimentation Introduction**: Tour of A/B testing and data-driven decision features
- **Platform Strategy Education**: Introduction to network effects and ecosystem communication

### Feature-Specific Help Integration
Help system must provide contextual assistance for all key features:

#### Meeting Analysis Help
- **Upload Process**: Step-by-step guidance for audio file upload and processing
- **Analysis Interpretation**: Interactive help for understanding communication pattern results
- **Insight Application**: Contextual guidance for applying analysis insights to real meetings
- **Progress Integration**: Help for connecting analysis results to skill development tracking

#### Practice Module Help
- **Module Selection**: Guidance for choosing appropriate practice modules based on career goals
- **Exercise Completion**: Interactive help for recording practice sessions and receiving feedback
- **Improvement Implementation**: Contextual assistance for applying practice feedback
- **Progress Tracking**: Help for understanding skill development and milestone achievement

#### Dashboard Navigation Help
- **Progress Understanding**: Interactive guidance for interpreting skill development metrics
- **Career Context**: Help for understanding career transition progress and readiness
- **Benchmark Interpretation**: Contextual assistance for industry and role-level comparisons
- **Action Planning**: Guidance for translating insights into specific development actions

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core help and onboarding system structure
interface HelpOnboardingProps {
  userProfile: UserProfile
  onboardingStatus: OnboardingStatus
  tourEngine: TourEngine
  helpSystem: HelpSystem
}

interface OnboardingStatus {
  completionPercentage: number
  completedSections: OnboardingSection[]
  currentStep: OnboardingStep
  skipReasons: SkipReason[]
  adaptiveGuidance: AdaptiveGuidance[]
}

interface TourEngine {
  activeTour: Tour | null
  availableTours: Tour[]
  tourProgress: TourProgress
  contextualTriggers: ContextualTrigger[]
}

interface Tour {
  id: string
  title: string
  description: string
  careerRelevance: CareerRelevance
  industryContext: Industry[]
  steps: TourStep[]
  estimatedDuration: number
  prerequisites: string[]
  completionRewards: string[]
}

interface TourStep {
  id: string
  title: string
  description: string
  targetElement: string
  actionRequired: boolean
  interactionType: 'HIGHLIGHT' | 'CLICK' | 'INPUT' | 'WAIT'
  explanation: string
  careerContext: string
}

interface HelpSystem {
  contextualHelp: ContextualHelp[]
  searchableGuides: HelpGuide[]
  videoTutorials: VideoTutorial[]
  interactiveWalkthrough: InteractiveWalkthrough[]
}
```

### Help & Onboarding Component Structure
```
HelpOnboarding/
├── OnboardingOrchestrator.tsx   # Core onboarding flow management
├── CareerTransitionOnboarding/
│   ├── POToPMOnboarding.tsx     # PO → PM specific onboarding flow
│   ├── PMToSeniorPMOnboarding.tsx # PM → Senior PM onboarding flow
│   ├── SeniorPMToGroupPMOnboarding.tsx # Senior PM → Group PM flow
│   └── GroupPMToDirectorOnboarding.tsx # Group PM → Director flow
├── IndustrySpecificTours/
│   ├── HealthcarePMTour.tsx     # Healthcare industry feature tour
│   ├── CybersecurityPMTour.tsx  # Cybersecurity industry feature tour
│   ├── FintechPMTour.tsx        # Fintech industry feature tour
│   ├── EnterprisePMTour.tsx     # Enterprise software feature tour
│   └── ConsumerTechPMTour.tsx   # Consumer tech feature tour
├── FeatureSpecificHelp/
│   ├── MeetingAnalysisHelp.tsx  # Meeting analysis feature help system
│   ├── PracticeModuleHelp.tsx   # Practice module help and guidance
│   ├── DashboardNavigationHelp.tsx # Dashboard and progress help
│   └── SettingsConfigurationHelp.tsx # Settings and customization help
├── InteractiveGuidance/
│   ├── TourEngine.tsx           # Interactive tour management and progression
│   ├── ContextualHelpProvider.tsx # Context-aware help suggestion system
│   ├── VideoTutorialPlayer.tsx  # Video tutorial integration and tracking
│   └── InteractiveWalkthrough.tsx # Step-by-step interactive guidance
└── HelpInterface/
    ├── HelpSearchInterface.tsx  # Searchable help content discovery
    ├── OnboardingProgress.tsx   # Onboarding completion tracking and motivation
    ├── TourLauncher.tsx         # Tour selection and launch interface
    └── ContextualHelpOverlay.tsx # Non-intrusive contextual help display
```

### Mock Data Requirements
Create comprehensive onboarding flows with career-intelligent guidance:

#### Career Transition Onboarding Flows
```typescript
const mockOnboardingFlows = {
  'PO_TO_PM': {
    totalSteps: 8,
    estimatedDuration: '12-15 minutes',
    sections: [
      {
        title: 'Strategic Thinking Introduction',
        steps: 3,
        description: 'Learn how ShipSpeak helps develop business outcome focus',
        careerImpact: 'Essential for PO → PM transition success'
      },
      {
        title: 'Framework Discovery',
        steps: 2,
        description: 'Interactive introduction to RICE and value-based prioritization',
        careerImpact: 'Critical for strategic decision communication'
      },
      {
        title: 'Cross-functional Communication',
        steps: 3,
        description: 'Practice stakeholder engagement beyond engineering teams',
        careerImpact: 'Required for expanded PM stakeholder management'
      }
    ]
  },
  
  'PM_TO_SENIOR_PM': {
    totalSteps: 10,
    estimatedDuration: '15-18 minutes',
    sections: [
      {
        title: 'Executive Communication Mastery',
        steps: 4,
        description: 'Master answer-first methodology for C-suite interaction',
        careerImpact: 'Critical for Senior PM executive presence'
      },
      {
        title: 'Trade-off Articulation',
        steps: 3,
        description: 'Advanced decision reasoning with framework integration',
        careerImpact: 'Essential for Senior PM strategic communication'
      },
      {
        title: 'Influence Without Authority',
        steps: 3,
        description: 'Leadership language and confidence development',
        careerImpact: 'Required for Senior PM cross-functional leadership'
      }
    ]
  }
}
```

#### Interactive Tour Steps
```typescript
const mockTourSteps = [
  {
    id: 'dashboard-career-progress',
    title: 'Your Career Progression Dashboard',
    description: 'See your PM → Senior PM transition progress',
    targetElement: '#career-progress-card',
    actionRequired: false,
    interactionType: 'HIGHLIGHT',
    explanation: 'This shows your current readiness for Senior PM roles with specific skill gaps and timeline.',
    careerContext: 'Understanding your progression helps prioritize practice focus for maximum career impact.'
  },
  {
    id: 'meeting-upload-intro',
    title: 'Upload Your First Meeting',
    description: 'Transform real meetings into personalized practice',
    targetElement: '#upload-meeting-button',
    actionRequired: true,
    interactionType: 'CLICK',
    explanation: 'ShipSpeak analyzes your actual communication patterns to create targeted improvement plans.',
    careerContext: 'Real meeting analysis is more effective than generic communication training.'
  },
  {
    id: 'framework-practice-intro',
    title: 'Practice PM Frameworks',
    description: 'Interactive RICE framework application',
    targetElement: '#framework-practice-module',
    actionRequired: true,
    interactionType: 'CLICK',
    explanation: 'Practice applying RICE prioritization in realistic PM scenarios.',
    careerContext: 'Framework mastery distinguishes senior PMs from junior PMs in stakeholder communication.'
  }
]
```

#### Contextual Help Examples
```typescript
const mockContextualHelp = [
  {
    trigger: 'MEETING_UPLOAD_PAGE',
    helpContent: {
      title: 'Meeting Upload Best Practices',
      quickTips: [
        'Upload 15-30 minute meeting segments for optimal analysis',
        'Include meetings where you presented or led discussion',
        'Board presentations and stakeholder updates work best',
        'Ensure clear audio quality for accurate analysis'
      ],
      detailedGuidance: 'For best results, choose meetings where you had significant speaking time and clear strategic communication opportunities.',
      careerContext: 'Quality meeting uploads directly improve personalized practice module generation.',
      videoTutorial: 'meeting-upload-best-practices.mp4'
    }
  },
  {
    trigger: 'PRACTICE_MODULE_SELECTION',
    helpContent: {
      title: 'Choosing Practice Modules',
      quickTips: [
        'Start with career transition-specific modules',
        'Focus on identified skill gaps from analysis',
        'Balance framework practice with industry context',
        'Complete foundation modules before advanced scenarios'
      ],
      detailedGuidance: 'Module selection based on analysis insights accelerates career progression more than random practice.',
      careerContext: 'Strategic module selection can accelerate PM advancement by 3-6 months.',
      interactiveGuide: true
    }
  }
]
```

#### Video Tutorial Integration
```typescript
const mockVideoTutorials = [
  {
    id: 'executive-communication-basics',
    title: 'Executive Communication Fundamentals',
    duration: 180, // 3 minutes
    careerRelevance: 'PM_TO_SENIOR_PM',
    industryContext: 'ALL',
    description: 'Learn answer-first methodology with real PM examples',
    keyTakeaways: [
      'Structure executive communication for maximum impact',
      'Balance confidence with appropriate risk acknowledgment',
      'Adapt detail levels for different stakeholder types'
    ]
  },
  {
    id: 'fintech-regulatory-communication',
    title: 'Fintech PM Regulatory Communication',
    duration: 240, // 4 minutes
    careerRelevance: 'ALL_LEVELS',
    industryContext: 'FINTECH',
    description: 'Navigate SEC and banking regulation communication',
    keyTakeaways: [
      'Integrate compliance requirements in product decisions',
      'Communicate financial risk with appropriate sophistication',
      'Build customer trust through transparent communication'
    ]
  }
]
```

---

## User Experience Requirements

### Onboarding Experience Design
Create engaging, career-intelligent onboarding that builds confidence:

#### Progressive Disclosure Onboarding
- **Career Context Setting**: Immediate personalization based on current and target PM roles
- **Industry Specialization**: Early customization for sector-specific features and communication
- **Interactive Discovery**: Hands-on exploration rather than passive information consumption
- **Value Demonstration**: Clear connection between features and career advancement

#### Adaptive Guidance System
- **Skip-Friendly Design**: Optional but encouraged onboarding with easy progression control
- **Progress Celebration**: Recognition of onboarding completion with career context
- **Contextual Reminders**: Gentle re-engagement for incomplete onboarding sections
- **Performance Integration**: Onboarding effectiveness measurement and optimization

### Help System Design
- **Search-First Interface**: Intelligent search with career and industry context awareness
- **Contextual Suggestions**: Automatic help recommendations based on user behavior and challenges
- **Video Integration**: Short, focused video tutorials for complex features
- **Interactive Walkthroughs**: Step-by-step guidance for multi-step processes

### Accessibility and Mobile Optimization
- **Screen Reader Compatibility**: Full onboarding and help accessibility
- **Mobile-Responsive Tours**: Complete onboarding experience on mobile devices
- **Keyboard Navigation**: Full tour and help system keyboard accessibility
- **Multiple Learning Styles**: Visual, auditory, and kinesthetic onboarding options

---

## Success Validation Criteria

### Onboarding Quality Validation
- **Completion Rates**: High onboarding completion with minimal dropout
- **Feature Adoption**: Onboarding users demonstrate higher feature engagement
- **Career Relevance**: Users understand how features support their specific transition goals
- **Time to Value**: Users achieve first positive outcome within onboarding flow

### Help System Effectiveness Validation  
- **Resolution Success**: Users successfully complete tasks after accessing help
- **Search Effectiveness**: Help search delivers relevant results quickly
- **Contextual Accuracy**: Contextual help appears at appropriate moments
- **User Satisfaction**: Positive feedback on help system utility and clarity

### Framework Integration Validation
- **Career Transition Support**: Onboarding effectively supports all PM transition patterns
- **Industry Context Integration**: Healthcare, cybersecurity, fintech, enterprise, consumer onboarding
- **Feature Education**: Users understand how to use PM-specific features effectively
- **Continuous Learning**: Onboarding integrates with overall skill development framework

---

*Implementation Time Estimate: 2 hours*
*Success Criteria: Comprehensive help and onboarding with career-intelligent guidance and PM-specific education*