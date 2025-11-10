# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-8: Module Content & Exercise Structure

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent module content system with PM-specific exercise structure and career-intelligent practice scenarios.

---

## Implementation Target: Module Content & Exercise Structure
**Development Time**: 5-6 hours  
**Slice ID**: 1-8 "Module Content & Exercise Structure"

### Core Purpose
Build sophisticated module content delivery system with PM-specific exercise structures, progressive difficulty adaptation, and career-intelligent practice scenarios that mirror real-world PM communication challenges.

---

## Critical Framework Integration

### PM Career Transition Exercise Design (MANDATORY)
Exercise structure must provide transition-specific skill development:

#### PO → PM Transition Exercise Structure
- **Strategic Thinking Exercises**: Customer outcome focus development with business impact reasoning
- **PM Vocabulary Building**: Interactive terminology mastery with context-appropriate usage
- **Stakeholder Communication Expansion**: Cross-functional engagement practice beyond engineering
- **Decision Framework Application**: Hands-on RICE, ICE, value-based prioritization scenarios

#### PM → Senior PM Transition Exercise Structure  
- **Executive Communication Mastery**: Answer-first methodology with conclusion-driven response training
- **Trade-off Articulation Excellence**: Complex decision scenarios with multi-factor framework integration
- **Influence Without Authority Development**: Leadership language practice with challenging stakeholder scenarios
- **Strategic Altitude Control**: Audience-appropriate depth adjustment exercises with real-time feedback

#### Senior PM → Group PM Transition Exercise Structure
- **Portfolio Strategy Communication**: Multi-product thinking scenarios with resource allocation challenges
- **Team Development & Coaching**: Mentorship conversation practice with difficult feedback scenarios
- **Organizational Impact Integration**: Department-level stakeholder management and cross-team coordination
- **Resource Strategy Communication**: Sophisticated headcount reasoning and priority negotiation exercises

#### Group PM → Director Transition Exercise Structure
- **Board Presentation Excellence**: C-suite communication with high-stakes scenario practice
- **Business Model Fluency**: P&L reasoning scenarios with financial impact articulation
- **Market Strategy Integration**: Competitive positioning with industry trend analysis integration
- **Organizational Leadership**: Vision communication with culture development scenarios

### Industry-Specific Exercise Collections
Exercise content must reflect industry-specific PM communication challenges:

#### Healthcare & Life Sciences PM Exercises
- **Regulatory Communication Scenarios**: FDA approval communication with timeline pressure
- **Patient Outcome Prioritization**: Safety vs feature trade-offs with clinical evidence integration
- **Clinical Evidence Integration**: Research communication with non-clinical stakeholders
- **Healthcare Stakeholder Management**: Provider, payer, patient advocacy communication challenges

#### Cybersecurity & Enterprise Security PM Exercises  
- **Risk Communication Under Pressure**: Breach response communication with executive escalation
- **Technical Translation Challenges**: Security architecture communication for business stakeholders
- **Compliance Framework Integration**: Audit preparation with regulatory requirement communication
- **Zero-Trust Architecture**: Security-first product decisions with business impact articulation

#### Financial Services & Fintech PM Exercises
- **Regulatory Compliance Under Scrutiny**: SEC inquiry response with audit readiness demonstration
- **Risk Management Communication**: Financial risk assessment with mitigation strategy articulation
- **Trust-Building During Crisis**: Customer confidence messaging during security incidents
- **Financial Metrics Communication**: P&L impact reasoning with complex regulatory constraints

#### Enterprise Software & B2B PM Exercises
- **ROI Communication to CFOs**: Business case defense with procurement committee pressure
- **Implementation Crisis Management**: Customer success communication during deployment challenges
- **Customer Advocacy Under Pressure**: Reference creation during competitive threat scenarios
- **Enterprise Sales Support**: Complex deal support with technical and procurement stakeholder management

#### Consumer Technology & Apps PM Exercises
- **Growth Optimization Communication**: Metrics communication during user acquisition challenges
- **User Experience Trade-off Articulation**: Privacy vs personalization decision communication
- **Rapid Iteration Under Pressure**: A/B testing communication with conflicting data interpretation
- **Platform Strategy Communication**: Network effects reasoning with marketplace dynamics

### Exercise Difficulty Progression
Sophisticated progression system adapting to user skill development:

#### Foundation Level Exercises
- **Framework Introduction**: Guided practice with RICE, ICE, Jobs-to-be-Done with extensive scaffolding
- **Basic Stakeholder Communication**: Simple scenarios with clear stakeholder types and objectives
- **Vocabulary Development**: PM terminology usage with business context and appropriate scenarios
- **Structure Practice**: Answer-first methodology with straightforward business scenarios

#### Practice Level Exercises
- **Complex Trade-off Scenarios**: Multi-factor decisions with competing stakeholder priorities
- **Cross-functional Coordination**: Challenging alignment scenarios with conflicting team objectives
- **Executive Communication**: Board presentation practice with realistic time constraints and pressure
- **Crisis Communication**: Difficult stakeholder management during product failures or setbacks

#### Mastery Level Exercises
- **High-stakes Negotiation**: Resource allocation with organizational politics and budget constraints
- **Organizational Change Leadership**: Vision communication during significant strategic pivots
- **Market Strategy Communication**: Competitive positioning during industry disruption scenarios
- **Enterprise Crisis Management**: Multi-stakeholder coordination during major product or security incidents

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core module content system structure
interface ModuleContentProps {
  module: PracticeModule
  userProfile: UserProfile
  exerciseEngine: ExerciseEngine
  progressTracking: ProgressTracker
}

interface ExerciseEngine {
  exerciseType: ExerciseType
  difficultyLevel: DifficultyLevel
  scenarioGenerator: ScenarioGenerator
  responseEvaluator: ResponseEvaluator
  adaptiveFeedback: AdaptiveFeedback
}

interface ExerciseScenario {
  id: string
  title: string
  context: ScenarioContext
  stakeholders: Stakeholder[]
  objectives: LearningObjective[]
  constraints: ScenarioConstraint[]
  successCriteria: SuccessCriteria[]
}

interface ScenarioContext {
  industryContext: Industry
  companySize: 'STARTUP' | 'SCALE_UP' | 'ENTERPRISE'
  productContext: ProductContext
  marketConditions: MarketConditions
  organizationalPolitics: PoliticalComplexity
}

interface ExerciseResponse {
  userResponse: string
  responseStructure: ResponseStructure
  frameworkUsage: FrameworkUsage[]
  communicationEffectiveness: EffectivenessMetrics
  improvementSuggestions: ImprovementSuggestion[]
}

interface ResponseEvaluation {
  overallScore: number
  structureScore: number
  contentScore: number
  stakeholderAdaptation: number
  frameworkApplication: number
  executivePresence: number
}
```

### Module Content Component Structure
```
ModuleContent/
├── ContentOrchestrator.tsx      # Core content delivery and progression
├── ExerciseTypes/
│   ├── ScenarioBasedExercise.tsx   # Real-world PM scenario practice
│   ├── StakeholderRolePlay.tsx     # Interactive stakeholder communication
│   ├── FrameworkApplication.tsx    # PM framework usage and mastery
│   └── CommunicationStructure.tsx  # Answer-first and executive presence training
├── ScenarioGeneration/
│   ├── IndustryScenarioBank.tsx    # Industry-specific scenario collections
│   ├── CareerTransitionScenarios.tsx # Transition-specific challenge scenarios
│   ├── MeetingTypeScenarios.tsx    # Meeting-specific communication practice
│   └── AdaptiveScenarioBuilder.tsx # Dynamic scenario generation based on progress
├── ResponseEvaluation/
│   ├── StructureAnalyzer.tsx       # Communication structure assessment
│   ├── FrameworkEvaluator.tsx      # PM framework usage evaluation
│   ├── StakeholderAdaptation.tsx   # Audience-appropriate communication assessment
│   └── ExecutivePresenceScorer.tsx # Leadership and confidence evaluation
└── ProgressAdaptation/
    ├── DifficultyProgression.tsx   # Adaptive difficulty adjustment
    ├── SkillGapTargeting.tsx       # Exercise targeting specific development areas
    ├── MasteryTracking.tsx         # Skill mastery recognition and progression
    └── PersonalizedFeedback.tsx    # Individual improvement recommendation generation
```

### Mock Data Requirements
Create comprehensive exercise scenarios with realistic PM challenges:

#### Exercise Scenario Examples
```typescript
const mockExerciseScenarios = [
  {
    title: 'Board Presentation: Product Strategy Under Competitive Pressure',
    context: {
      industry: 'fintech',
      companySize: 'SCALE_UP',
      situation: 'Major competitor launched similar feature, board questioning product strategy',
      timeline: 'Board meeting in 2 days, need strategic response',
      stakeholders: ['CEO', 'CFO', 'Board Members', 'Engineering VP']
    },
    challenge: 'Communicate product differentiation strategy and resource allocation without appearing reactive',
    learningObjectives: [
      'Master answer-first communication under pressure',
      'Articulate competitive strategy with confidence',
      'Balance defensive and offensive strategic positioning',
      'Demonstrate strategic thinking vs tactical reaction'
    ],
    successCriteria: [
      'Clear conclusion within first 30 seconds',
      'Evidence-based competitive analysis',
      'Resource allocation reasoning with ROI focus',
      'Confident delivery without defensive language'
    ]
  },
  {
    title: 'Cross-functional Stakeholder Alignment During Resource Constraints',
    context: {
      industry: 'healthcare',
      companySize: 'ENTERPRISE',
      situation: 'Budget cuts requiring 30% resource reduction, competing priorities from engineering, design, compliance',
      timeline: 'Decision needed by end of week',
      stakeholders: ['Engineering Director', 'Design Lead', 'Compliance Officer', 'Product VP']
    },
    challenge: 'Facilitate resource allocation decision while maintaining team alignment and regulatory compliance',
    learningObjectives: [
      'Navigate organizational politics effectively',
      'Balance competing stakeholder priorities',
      'Communicate trade-offs with regulatory constraints',
      'Maintain team morale during difficult decisions'
    ]
  }
]
```

#### Response Evaluation Examples
```typescript
const mockResponseEvaluations = [
  {
    userResponse: "I recommend we focus our limited resources on the core compliance features because they're regulatory requirements, while temporarily pausing the UX improvements that design wants.",
    
    evaluation: {
      overallScore: 6.8,
      strengths: [
        'Clear prioritization decision with reasoning',
        'Acknowledgment of regulatory constraints',
        'Specific resource allocation recommendation'
      ],
      improvementAreas: [
        'Missing stakeholder impact acknowledgment',
        'No timeline or success metrics provided',
        'Could strengthen business impact reasoning'
      ],
      frameworkApplication: 'Partial RICE usage but missing reach and confidence metrics',
      executivePresence: 'Good decisiveness but could strengthen confidence language',
      nextSteps: [
        'Practice stakeholder impact acknowledgment',
        'Develop timeline communication skills',
        'Strengthen business case articulation'
      ]
    }
  }
]
```

#### Progressive Difficulty Examples
```typescript
const mockProgressiveDifficulty = [
  {
    level: 'Foundation',
    description: 'Clear scenarios, single stakeholder focus, basic framework application',
    timeConstraint: 'Generous thinking time (5+ minutes)',
    stakeholderComplexity: 'Single stakeholder type with clear objectives',
    frameworkSupport: 'Guided framework application with prompts'
  },
  {
    level: 'Practice', 
    description: 'Multi-stakeholder scenarios, competing priorities, framework integration',
    timeConstraint: 'Realistic pressure (2-3 minutes)',
    stakeholderComplexity: 'Multiple stakeholder types with conflicting objectives',
    frameworkSupport: 'Framework selection and application without guidance'
  },
  {
    level: 'Mastery',
    description: 'High-stakes scenarios, organizational politics, crisis communication',
    timeConstraint: 'Executive timeline pressure (30-60 seconds)',
    stakeholderComplexity: 'Complex organizational dynamics with hidden agendas',
    frameworkSupport: 'Independent framework selection and sophisticated application'
  }
]
```

---

## User Experience Requirements

### Exercise Interaction Design
Create immersive, realistic PM communication practice:

#### Exercise Setup Interface
- **Scenario Context**: Rich background information with industry and organizational context
- **Stakeholder Profiles**: Detailed stakeholder information with motivations and constraints
- **Success Criteria**: Clear objectives and evaluation criteria for exercise completion
- **Time Management**: Realistic time constraints with optional pressure simulation

#### Response Interface
- **Natural Input**: Voice recording or text input with structure guidance
- **Real-time Coaching**: Live suggestions for framework application and structure improvement
- **Framework Integration**: Easy access to PM frameworks with context-appropriate suggestions
- **Stakeholder Simulation**: Interactive stakeholder responses based on communication effectiveness

#### Feedback & Iteration
- **Immediate Assessment**: Real-time evaluation of response structure and content effectiveness
- **Detailed Analysis**: Framework usage, stakeholder adaptation, executive presence scoring
- **Improvement Suggestions**: Specific, actionable recommendations for immediate practice
- **Progress Integration**: Exercise performance contributing to overall skill development tracking

### Adaptive Learning Experience
- **Difficulty Progression**: Automatic advancement based on demonstrated competency
- **Skill Gap Targeting**: Exercise selection prioritizing identified development areas
- **Industry Contextualization**: Scenarios reflecting user's specific PM sector context
- **Career Stage Relevance**: Exercise complexity appropriate for current transition goals

---

## Success Validation Criteria

### Exercise Quality Validation
- **Scenario Realism**: Exercises reflect authentic PM communication challenges
- **Learning Effectiveness**: Users demonstrate measurable skill improvement through practice
- **Framework Integration**: Exercises successfully reinforce PM framework usage
- **Career Relevance**: Practice scenarios align with user's specific transition objectives

### Technical Performance Validation  
- **Response Processing**: Exercise evaluation provides accurate, helpful feedback
- **Adaptive Progression**: Difficulty adjustment responds appropriately to user performance
- **Mobile Optimization**: Full exercise experience available on mobile devices
- **Progress Integration**: Exercise completion accurately contributes to skill tracking

### Framework Integration Validation
- **Career Transition Support**: Exercises effectively support all PM transition patterns
- **Industry Context Integration**: Healthcare, cybersecurity, fintech, enterprise, consumer scenarios
- **Meeting Type Preparation**: Exercises prepare users for specific meeting communication requirements
- **Continuous Learning**: Exercise completion drives overall PM communication skill development

---

*Implementation Time Estimate: 5-6 hours*
*Success Criteria: Sophisticated module content with PM-specific exercise structure and progressive difficulty*