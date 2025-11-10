# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-7: Module Library & Personalized Recommendations

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent module library with PM-specific personalized recommendations and career-intelligent learning path curation.

---

## Implementation Target: Module Library & Personalized Recommendations
**Development Time**: 4 hours  
**Slice ID**: 1-7 "Module Library & Personalized Recommendations"

### Core Purpose
Build an intelligent module library that curates PM-specific practice modules with sophisticated recommendation algorithms, career-intelligent learning paths, and industry-contextualized content discovery.

---

## Critical Framework Integration

### PM Career Transition Module Curation (MANDATORY)
Module library must provide transition-specific learning paths for each PM career progression:

#### PO → PM Transition Module Library
- **Strategic Thinking Foundation**: Modules that develop customer outcome thinking and business impact reasoning
- **PM Vocabulary Development**: Interactive vocabulary building with business context and stakeholder communication
- **Decision Framework Mastery**: Structured practice with RICE, ICE, value-based prioritization frameworks
- **Cross-functional Communication**: Stakeholder engagement practice beyond engineering teams

#### PM → Senior PM Transition Module Library  
- **Executive Communication Excellence**: Answer-first methodology and conclusion-driven response training
- **Trade-off Articulation Mastery**: Complex decision reasoning with multi-factor framework integration
- **Influence Without Authority**: Leadership language development and confidence-building exercises
- **Strategic Altitude Control**: Audience-appropriate communication depth and stakeholder adaptation

#### Senior PM → Group PM Transition Module Library
- **Portfolio Strategy Communication**: Multi-product thinking and strategic communication development
- **Team Development & Coaching**: Mentorship conversation skills and leadership language training
- **Organizational Impact Integration**: Department-level stakeholder management and resource reasoning
- **Cross-team Leadership**: Coordination and alignment communication across multiple product teams

#### Group PM → Director Transition Module Library
- **Board Presentation Mastery**: C-suite communication structure, confidence, and executive presence
- **Business Model Fluency**: P&L reasoning, financial communication, and business impact articulation
- **Market Strategy Integration**: Competitive positioning, industry trend analysis, and strategic narrative
- **Organizational Leadership**: Vision communication, team alignment, and culture development

### Industry-Specific Module Collections
Library must provide industry-contextualized module collections:

#### Healthcare & Life Sciences PM Modules
- **Regulatory Communication Excellence**: FDA, HIPAA, clinical trial communication and compliance integration
- **Patient Outcome Prioritization**: Safety-first decision framing and evidence-based reasoning development
- **Clinical Evidence Integration**: Research communication and product decision support with clinical data
- **Healthcare Stakeholder Management**: Provider, payer, patient advocacy communication strategies

#### Cybersecurity & Enterprise Security PM Modules  
- **Risk Communication Mastery**: Threat assessment articulation and vulnerability communication excellence
- **Technical Translation Excellence**: Security concept communication for business and executive stakeholders
- **Compliance Framework Integration**: SOC2, ISO27001, GDPR communication and requirement integration
- **Zero-Trust Architecture**: Security-first product thinking and architecture communication

#### Financial Services & Fintech PM Modules
- **Regulatory Compliance Communication**: SEC, banking regulation integration and audit readiness
- **Risk Management Integration**: Financial risk assessment communication and mitigation strategies
- **Trust-Building Language Development**: Consumer confidence messaging and fraud prevention communication
- **Financial Metrics Fluency**: P&L impact, revenue models, and financial stakeholder communication

#### Enterprise Software & B2B PM Modules
- **ROI Communication Excellence**: Business case development, value proposition articulation, and customer success
- **Implementation Planning Communication**: Change management, customer success, and enterprise deployment
- **Customer Advocacy Development**: Reference creation, renewal strategies, and customer relationship management
- **Enterprise Sales Support**: Complex deal support, technical stakeholder management, and procurement communication

#### Consumer Technology & Apps PM Modules
- **User Experience Communication**: Behavioral psychology integration and engagement optimization strategies
- **Growth Metrics Mastery**: DAU, MAU, retention, viral coefficient communication and optimization
- **Rapid Iteration Framework**: A/B testing communication, experimentation methodologies, and data-driven decisions
- **Platform Thinking Development**: Network effects, ecosystem development, and marketplace dynamics

### Meeting Type Practice Module Collections
Library must provide meeting-specific communication training modules:

#### Board Presentation Practice Modules
- **Executive Summary Structure**: 2-3 minute presentation organization and stakeholder impact communication
- **Metrics Communication Excellence**: Business impact articulation and competitive position presentation
- **Confidence Building Training**: Definitive language usage and appropriate risk acknowledgment
- **Strategic Narrative Development**: Market context integration and business model communication

#### Planning Session Practice Modules
- **Strategic Communication**: Market trend analysis and competitive intelligence integration
- **Resource Reasoning Excellence**: Headcount allocation, budget prioritization, and timeline communication
- **Cross-functional Coordination**: Engineering, design, marketing, sales alignment and communication
- **Dependency Management**: Risk assessment, mitigation planning, and stakeholder expectation setting

#### Stakeholder Update Practice Modules
- **Progress Communication**: Commitment tracking, success criteria articulation, and accountability
- **Blocker Communication Excellence**: Escalation clarity, solution proposition, and resource requests
- **Executive Reporting**: Appropriate detail levels, action-oriented communication, and next steps
- **Success Metric Integration**: KPI communication, OKR alignment, and business context integration

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core module library system structure
interface ModuleLibraryProps {
  userProfile: UserProfile
  learningPath: LearningPath
  recommendationEngine: RecommendationEngine
  moduleCollection: ModuleCollection
}

interface ModuleCollection {
  id: string
  modules: PracticeModule[]
  categories: ModuleCategory[]
  difficultyProgression: DifficultyLevel[]
  industryContext: Industry
  careerTransition: PMTransitionType
}

interface PracticeModule {
  id: string
  title: string
  description: string
  category: ModuleCategory
  difficulty: DifficultyLevel
  estimatedDuration: number
  learningObjectives: LearningObjective[]
  prerequisites: string[]
  industryRelevance: IndustryRelevance[]
  careerImpact: CareerImpactArea[]
}

interface RecommendationEngine {
  userProgressAnalysis: ProgressAnalysis
  skillGapIdentification: SkillGap[]
  careerGoalAlignment: CareerGoalAlignment
  personalizedRecommendations: ModuleRecommendation[]
}

interface ModuleRecommendation {
  module: PracticeModule
  relevanceScore: number
  reasoning: string
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  careerImpact: string
  timeToCompletion: string
}
```

### Module Library Component Structure
```
ModuleLibrary/
├── LibraryOrchestrator.tsx      # Core module library management
├── ModuleDiscovery/
│   ├── CategoryBrowser.tsx      # Module category exploration and filtering
│   ├── SearchInterface.tsx      # Advanced module search with intelligent filtering
│   ├── RecommendationFeed.tsx   # Personalized module recommendations
│   └── LearningPathViewer.tsx   # Career-intelligent learning progression
├── ModuleCollection/
│   ├── CareerTransitionModules.tsx # PM transition-specific module collections
│   ├── IndustrySpecificModules.tsx # Sector-specific practice modules
│   ├── MeetingTypeModules.tsx      # Meeting-specific communication training
│   └── SkillDevelopmentModules.tsx # Core PM skill development modules
├── PersonalizationEngine/
│   ├── UserProfileAnalyzer.tsx    # User profile and progress analysis
│   ├── SkillGapIdentifier.tsx     # Skill gap identification and prioritization
│   ├── CareerGoalAligner.tsx      # Career goal alignment and module matching
│   └── RecommendationGenerator.tsx # Intelligent recommendation generation
└── ModuleInterface/
    ├── ModulePreview.tsx          # Module preview and learning objective display
    ├── ProgressTracking.tsx       # Module completion and skill development tracking
    ├── BookmarkingSystem.tsx      # Module bookmarking and personal collection
    └── LearningPathCustomizer.tsx # Custom learning path creation and modification
```

### Mock Data Requirements
Create comprehensive module library with realistic PM development content:

#### Module Category Examples
```typescript
const mockModuleCategories = [
  {
    category: 'Executive Communication',
    description: 'Master C-suite and senior stakeholder communication',
    moduleCount: 23,
    averageDuration: '15 minutes',
    skillLevel: 'Intermediate to Advanced',
    careerImpact: 'High impact for PM → Senior PM and Senior PM → Group PM transitions'
  },
  {
    category: 'Strategic Thinking',
    description: 'Develop market strategy and competitive analysis skills',
    moduleCount: 18,
    averageDuration: '12 minutes',
    skillLevel: 'All levels',
    careerImpact: 'Essential for PO → PM and PM → Senior PM transitions'
  },
  {
    category: 'Industry Expertise',
    description: 'Build sector-specific communication and decision-making skills',
    moduleCount: 45,
    averageDuration: '10 minutes',
    skillLevel: 'Beginner to Advanced',
    careerImpact: 'Critical for industry transition and specialization'
  }
]
```

#### Personalized Recommendation Examples
```typescript
const mockPersonalizedRecommendations = [
  {
    module: {
      title: 'Board Presentation: Financial Impact Communication',
      category: 'Executive Communication',
      difficulty: 'Advanced',
      duration: '18 minutes'
    },
    relevanceScore: 94,
    reasoning: 'Based on your recent meeting analysis, you show strong technical communication but could strengthen financial impact articulation for executive audiences.',
    urgencyLevel: 'HIGH',
    careerImpact: 'Essential for Senior PM → Group PM transition readiness',
    timeToCompletion: 'Complete by end of week for maximum impact'
  },
  {
    module: {
      title: 'Fintech Risk Communication: Regulatory Compliance',
      category: 'Industry Expertise',
      difficulty: 'Intermediate',
      duration: '14 minutes'
    },
    relevanceScore: 87,
    reasoning: 'Your fintech background and recent communication patterns indicate need for stronger regulatory risk articulation.',
    urgencyLevel: 'MEDIUM',
    careerImpact: 'Strengthens industry expertise for specialization',
    timeToCompletion: 'Complete within 2 weeks'
  }
]
```

#### Learning Path Examples
```typescript
const mockLearningPaths = [
  {
    pathName: 'PM → Senior PM: Executive Readiness',
    description: 'Complete development path for PM to Senior PM transition',
    estimatedDuration: '6-8 weeks',
    moduleCount: 12,
    progressTracking: 'Module completion + skill assessment + meeting application',
    milestones: [
      'Master answer-first communication structure',
      'Develop trade-off articulation with frameworks',
      'Build influence without authority confidence',
      'Achieve strategic altitude control'
    ]
  },
  {
    pathName: 'Healthcare PM Specialization',
    description: 'Industry-specific expertise for healthcare and life sciences PMs',
    estimatedDuration: '4-6 weeks',
    moduleCount: 15,
    progressTracking: 'Industry knowledge + regulatory compliance + clinical communication',
    milestones: [
      'Master FDA and HIPAA communication',
      'Develop clinical evidence integration',
      'Build patient outcome prioritization',
      'Achieve healthcare stakeholder fluency'
    ]
  }
]
```

---

## User Experience Requirements

### Module Discovery Interface
Create intuitive, career-intelligent module discovery experience:

#### Main Library View
- **Personalized Dashboard**: Recommended modules based on user profile and recent progress
- **Category Navigation**: Clear module category organization with career progression context
- **Search & Filter**: Advanced filtering by industry, career stage, skill level, and duration
- **Learning Path Integration**: Visual learning path progression with module completion tracking

#### Module Browsing Experience
- **Module Preview**: Clear learning objectives, time commitment, and career relevance
- **Difficulty Indicators**: Visual skill level requirements and prerequisite information
- **Progress Integration**: Completion status, bookmarking, and personal notes
- **Social Proof**: Module effectiveness ratings and career impact testimonials

#### Recommendation Engine Interface
- **Smart Suggestions**: AI-powered recommendations with clear reasoning and career impact
- **Urgency Indicators**: Priority levels for maximum career progression impact
- **Skill Gap Integration**: Direct connection to identified development areas
- **Progress Motivation**: Celebration of completed modules and achieved milestones

### Personalization Features
- **Custom Learning Paths**: User-created learning sequences with goal tracking
- **Module Bookmarking**: Personal module collections and review systems
- **Progress Visualization**: Module completion tracking with skill development metrics
- **Adaptive Difficulty**: Module recommendations adjust based on demonstrated competency

---

## Success Validation Criteria

### Library Quality Validation
- **Module Relevance**: Users find modules directly applicable to their career goals
- **Recommendation Accuracy**: Suggested modules align with user's development needs
- **Discovery Efficiency**: Users quickly find relevant modules without excessive browsing
- **Learning Path Effectiveness**: Structured paths demonstrably improve PM skills

### Technical Performance Validation  
- **Search Performance**: Module search and filtering respond quickly with accurate results
- **Recommendation Engine**: Personalized suggestions update based on user progress and feedback
- **Progress Tracking**: Module completion and skill development accurately recorded
- **Mobile Optimization**: Full library experience accessible on mobile devices

### Framework Integration Validation
- **Career Transition Support**: Library effectively supports all PM transition patterns
- **Industry Context Integration**: Healthcare, cybersecurity, fintech, enterprise, consumer contexts represented
- **Meeting Type Preparation**: Modules effectively prepare users for specific meeting types
- **Continuous Learning**: Module completion contributes to overall skill development framework

---

*Implementation Time Estimate: 4 hours*
*Success Criteria: Intelligent module library with personalized recommendations and career-smart learning paths*