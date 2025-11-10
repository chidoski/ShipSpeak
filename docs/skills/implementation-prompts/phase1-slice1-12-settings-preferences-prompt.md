# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-12: Settings & Preferences

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent settings and preferences system with PM-specific customization and career-intelligent preference optimization.

---

## Implementation Target: Settings & Preferences
**Development Time**: 3 hours  
**Slice ID**: 1-12 "Settings & Preferences"

### Core Purpose
Build comprehensive settings and preferences system that allows PM-specific customization while maintaining career-intelligent defaults and industry-contextualized optimization suggestions.

---

## Critical Framework Integration

### PM Career Transition Settings Optimization (MANDATORY)
Settings must provide transition-specific customization options:

#### PO → PM Transition Settings
- **Learning Path Preferences**: Strategic thinking development vs vocabulary building focus
- **Feedback Intensity**: Gentle guidance vs intensive coaching for confidence building
- **Practice Session Types**: Framework-heavy vs stakeholder communication emphasis
- **Industry Context Priority**: Technical depth vs business impact focus customization

#### PM → Senior PM Transition Settings  
- **Executive Communication Focus**: Answer-first methodology emphasis vs comprehensive structure training
- **Confidence Building Approach**: Gentle encouragement vs challenging scenario preference
- **Framework Integration**: Basic application vs sophisticated multi-framework usage
- **Stakeholder Simulation**: Single audience vs complex multi-stakeholder scenarios

#### Senior PM → Group PM Transition Settings
- **Leadership Development**: Individual contributor vs team leadership communication focus
- **Portfolio Strategy**: Single product vs multi-product strategic thinking emphasis
- **Coaching Simulation**: Peer interaction vs direct report development scenarios
- **Organizational Impact**: Team-level vs department-level stakeholder management focus

#### Group PM → Director Transition Settings
- **Executive Presence**: Board presentation vs C-suite one-on-one communication focus
- **Business Model Development**: Product strategy vs financial reasoning emphasis
- **Market Strategy**: Competitive analysis vs industry trend integration focus
- **Vision Communication**: Team alignment vs organizational culture development

### Industry-Specific Settings Collections
Settings must provide industry-contextualized customization:

#### Healthcare & Life Sciences PM Settings
- **Regulatory Focus**: FDA emphasis vs HIPAA vs clinical trial communication priority
- **Stakeholder Balance**: Provider vs payer vs patient advocacy communication emphasis
- **Evidence Integration**: Clinical research vs regulatory compliance vs safety prioritization
- **Compliance Depth**: Basic awareness vs sophisticated regulatory integration

#### Cybersecurity & Enterprise Security PM Settings  
- **Risk Communication**: Threat assessment vs vulnerability management vs compliance focus
- **Technical Translation**: Security architecture vs business impact vs stakeholder clarity
- **Compliance Framework**: SOC2 vs ISO27001 vs GDPR emphasis customization
- **Security Thinking**: Zero-trust vs defense-in-depth vs risk management priority

#### Financial Services & Fintech PM Settings
- **Regulatory Emphasis**: SEC vs banking regulation vs audit readiness focus
- **Risk Management**: Financial risk vs operational risk vs compliance risk priority
- **Customer Communication**: Trust building vs fraud prevention vs transparency focus
- **Financial Metrics**: P&L vs revenue models vs regulatory compliance emphasis

#### Enterprise Software & B2B PM Settings
- **Customer Focus**: ROI communication vs implementation strategy vs customer success emphasis
- **Stakeholder Priority**: Customer vs internal vs procurement vs technical focus
- **Sales Support**: Enterprise deals vs customer advocacy vs reference creation priority
- **Value Communication**: Business case vs technical differentiation vs competitive positioning

#### Consumer Technology & Apps PM Settings
- **User Experience**: Behavioral psychology vs engagement optimization vs growth metrics focus
- **Growth Strategy**: User acquisition vs retention vs viral mechanics emphasis
- **Experimentation**: A/B testing vs rapid iteration vs data analysis priority
- **Platform Development**: Network effects vs ecosystem vs marketplace dynamics focus

### Meeting Type Preferences Customization
Settings must provide meeting-specific optimization:

#### Board Presentation Preferences
- **Presentation Style**: Formal structure vs conversational approach vs hybrid methodology
- **Time Management**: Strict timeline vs flexible pacing vs question-driven adaptation
- **Content Focus**: Metrics-heavy vs narrative-driven vs balanced presentation approach
- **Confidence Building**: Gradual development vs intensive preparation vs pressure simulation

#### Planning Session Preferences
- **Strategic Depth**: High-level strategy vs detailed planning vs tactical implementation focus
- **Collaboration Style**: Facilitation vs presentation vs discussion leadership emphasis
- **Timeline Communication**: Conservative vs aggressive vs realistic estimation approach
- **Stakeholder Management**: Consensus building vs decision driving vs compromise facilitation

#### Stakeholder Update Preferences
- **Communication Style**: Formal reporting vs conversational updates vs interactive discussion
- **Detail Level**: Executive summary vs comprehensive analysis vs audience-adaptive depth
- **Problem Communication**: Solution-focused vs comprehensive analysis vs collaborative problem-solving
- **Accountability**: Clear ownership vs shared responsibility vs escalation-focused approach

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core settings and preferences system structure
interface SettingsPreferencesProps {
  userProfile: UserProfile
  currentPreferences: UserPreferences
  intelligentDefaults: IntelligentDefaults
  customizationOptions: CustomizationOptions
}

interface UserPreferences {
  learningPathPreferences: LearningPathPreferences
  practiceSessionSettings: PracticeSessionSettings
  feedbackCustomization: FeedbackCustomization
  industryContextSettings: IndustryContextSettings
  careerTransitionFocus: CareerTransitionFocus
  meetingTypePreferences: MeetingTypePreferences
}

interface LearningPathPreferences {
  primaryFocus: 'MEETING_ANALYSIS' | 'PRACTICE_FIRST' | 'BALANCED'
  difficultyProgression: 'GRADUAL' | 'ACCELERATED' | 'ADAPTIVE'
  feedbackIntensity: 'GENTLE' | 'MODERATE' | 'INTENSIVE'
  industryContextEmphasis: number // 0-100
  frameworkFocus: FrameworkPreference[]
}

interface PracticeSessionSettings {
  preferredSessionLength: number // minutes
  realTimeCoaching: boolean
  transcriptionDisplay: boolean
  backgroundNoise: 'ALLOW' | 'WARN' | 'BLOCK'
  qualityThreshold: 'FLEXIBLE' | 'STANDARD' | 'STRICT'
  retakePolicy: 'UNLIMITED' | 'LIMITED' | 'SINGLE_ATTEMPT'
}

interface FeedbackCustomization {
  feedbackStyle: 'ENCOURAGING' | 'DIRECT' | 'ANALYTICAL'
  strengthEmphasis: number // 0-100, balance of strengths vs improvements
  careerContextIntegration: boolean
  benchmarkDisplay: boolean
  improvementTimelinePreference: 'OPTIMISTIC' | 'REALISTIC' | 'CONSERVATIVE'
}

interface IntelligentDefaults {
  careerBasedDefaults: CareerBasedDefaults
  industryBasedDefaults: IndustryBasedDefaults
  learningStyleDefaults: LearningStyleDefaults
  adaptiveRecommendations: AdaptiveRecommendation[]
}
```

### Settings Component Structure
```
SettingsPreferences/
├── SettingsOrchestrator.tsx     # Core settings management and persistence
├── CareerTransitionSettings/
│   ├── TransitionFocusCustomizer.tsx # Career transition priority customization
│   ├── SkillDevelopmentPreferences.tsx # Skill development emphasis settings
│   ├── ReadinessTimelineSettings.tsx   # Career advancement timeline preferences
│   └── MilestoneNotificationSettings.tsx # Achievement and progress notification customization
├── LearningPathCustomization/
│   ├── LearningStyleSelector.tsx    # Learning approach and methodology preferences
│   ├── DifficultyProgressionSettings.tsx # Skill advancement pace customization
│   ├── FeedbackIntensityCustomizer.tsx  # Coaching intensity and frequency settings
│   └── PracticeSessionPreferences.tsx   # Session length and format customization
├── IndustryContextSettings/
│   ├── IndustrySpecializationCustomizer.tsx # Industry-specific emphasis settings
│   ├── RegulatoryFocusSettings.tsx         # Regulatory and compliance priority customization
│   ├── StakeholderPrioritySettings.tsx     # Stakeholder type emphasis preferences
│   └── TechnicalDepthSettings.tsx          # Technical vs business communication balance
├── MeetingTypeCustomization/
│   ├── BoardPresentationSettings.tsx  # Board presentation style and approach preferences
│   ├── PlanningSessionSettings.tsx    # Planning session facilitation style customization
│   ├── StakeholderUpdateSettings.tsx  # Update meeting format and detail level preferences
│   └── CoachingSessionSettings.tsx    # AI coaching style and interaction preferences
└── SystemPreferences/
    ├── NotificationSettings.tsx       # Progress, achievement, and reminder notification preferences
    ├── DataPrivacySettings.tsx        # Data retention and privacy control settings
    ├── IntegrationSettings.tsx        # Third-party integration and export preferences
    └── AccessibilitySettings.tsx      # Interface accessibility and usability customization
```

### Mock Data Requirements
Create comprehensive settings with intelligent defaults and career-aware recommendations:

#### Career-Based Default Settings
```typescript
const mockCareerBasedDefaults = {
  'PO_TO_PM': {
    learningPathFocus: 'STRATEGIC_THINKING',
    feedbackIntensity: 'MODERATE',
    frameworkEmphasis: ['RICE', 'Jobs-to-be-Done', 'Customer Journey'],
    industryContextWeight: 70,
    practiceSessionLength: 15, // minutes
    difficultyProgression: 'GRADUAL',
    reasoning: 'PO → PM transition benefits from strategic thinking development with moderate coaching intensity'
  },
  
  'PM_TO_SENIOR_PM': {
    learningPathFocus: 'EXECUTIVE_COMMUNICATION',
    feedbackIntensity: 'INTENSIVE',
    frameworkEmphasis: ['Answer-First', 'RICE', 'Trade-off Analysis'],
    industryContextWeight: 80,
    practiceSessionLength: 20,
    difficultyProgression: 'ACCELERATED',
    reasoning: 'PM → Senior PM requires intensive executive communication training with sophisticated framework usage'
  },
  
  'SENIOR_PM_TO_GROUP_PM': {
    learningPathFocus: 'PORTFOLIO_STRATEGY',
    feedbackIntensity: 'INTENSIVE',
    frameworkEmphasis: ['Portfolio Management', 'Resource Allocation', 'Cross-team Coordination'],
    industryContextWeight: 85,
    practiceSessionLength: 25,
    difficultyProgression: 'ADAPTIVE',
    reasoning: 'Senior PM → Group PM needs portfolio thinking with sophisticated multi-product strategy'
  }
}
```

#### Industry-Specific Default Settings
```typescript
const mockIndustryDefaults = {
  'HEALTHCARE': {
    regulatoryFocus: 'HIGH',
    complianceEmphasis: ['FDA', 'HIPAA', 'Clinical Trials'],
    stakeholderPriority: ['Providers', 'Patients', 'Regulators', 'Payers'],
    evidenceIntegration: 'CLINICAL_FIRST',
    safetyPrioritization: 'MAXIMUM',
    reasoning: 'Healthcare PM requires high regulatory awareness and patient outcome prioritization'
  },
  
  'FINTECH': {
    regulatoryFocus: 'HIGH',
    complianceEmphasis: ['SEC', 'Banking Regulations', 'PCI DSS'],
    stakeholderPriority: ['Regulators', 'Financial Partners', 'Customers', 'Risk Management'],
    riskManagement: 'SOPHISTICATED',
    trustBuilding: 'MAXIMUM',
    reasoning: 'Fintech PM needs sophisticated regulatory and risk management communication'
  },
  
  'CYBERSECURITY': {
    riskCommunication: 'EXPERT_LEVEL',
    technicalTranslation: 'MAXIMUM',
    complianceEmphasis: ['SOC2', 'ISO27001', 'GDPR'],
    stakeholderPriority: ['Security Teams', 'Business Leaders', 'Compliance', 'Customers'],
    zeroTrustThinking: 'INTEGRATED',
    reasoning: 'Cybersecurity PM requires expert-level risk communication and technical translation'
  }
}
```

#### Personalized Preference Examples
```typescript
const mockPersonalizedSettings = {
  currentConfiguration: {
    learningPath: 'PRACTICE_FIRST',
    feedbackStyle: 'ENCOURAGING',
    sessionLength: 18, // minutes
    realTimeCoaching: true,
    industryEmphasis: 85, // percentage
    careerTransitionFocus: 'PM_TO_SENIOR_PM',
    strengthEmphasisBalance: 65, // 65% strengths, 35% improvements
    benchmarkDisplay: true,
    notificationFrequency: 'DAILY',
    privacyLevel: 'STANDARD'
  },
  
  intelligentRecommendations: [
    {
      setting: 'feedbackIntensity',
      currentValue: 'MODERATE',
      recommendedValue: 'INTENSIVE',
      reasoning: 'Your consistent practice and 8.2/10 confidence suggests readiness for more challenging feedback',
      impact: 'Could accelerate Senior PM readiness by 2-3 months',
      confidence: 'HIGH'
    },
    {
      setting: 'practiceSessionLength',
      currentValue: 15,
      recommendedValue: 20,
      reasoning: 'Your framework mastery indicates readiness for longer, more complex scenarios',
      impact: 'Enhanced executive communication development',
      confidence: 'MEDIUM'
    }
  ],
  
  adaptiveInsights: [
    'Your fintech industry emphasis could benefit from increased regulatory focus',
    'Strong framework application suggests readiness for multi-framework integration',
    'Executive communication progress indicates board presentation readiness'
  ]
}
```

---

## User Experience Requirements

### Settings Interface Design
Create intuitive, career-intelligent settings experience:

#### Main Settings Dashboard
- **Career Context Integration**: Settings organized by career transition priorities with intelligent defaults
- **Quick Configuration**: One-click optimization based on career goals and industry context
- **Personalization Preview**: Real-time preview of how setting changes affect learning experience
- **Intelligent Recommendations**: AI-powered suggestions for optimization with clear reasoning

#### Advanced Customization Options
- **Granular Control**: Detailed customization for power users while maintaining simple defaults
- **Industry Specialization**: Deep customization for sector-specific communication requirements
- **Learning Style Adaptation**: Settings that adapt to individual learning preferences and progress
- **Meeting Type Optimization**: Specific customization for different meeting communication contexts

#### Settings Validation and Guidance
- **Compatibility Checking**: Settings validation to ensure configuration supports career goals
- **Impact Preview**: Clear explanation of how setting changes affect learning outcomes
- **Reset and Optimization**: Easy return to intelligent defaults with career-aware optimization
- **Export and Import**: Settings backup and sharing for consistency across devices

### Accessibility and Privacy Integration
- **Privacy Controls**: Granular data retention and sharing preferences with clear impact explanation
- **Accessibility Options**: Interface customization for users with different accessibility needs
- **Notification Management**: Comprehensive control over progress notifications and reminders
- **Integration Preferences**: Third-party service integration settings with privacy consideration

---

## Success Validation Criteria

### Settings Quality Validation
- **Intelligent Defaults**: Default settings appropriately support user's career transition goals
- **Customization Effectiveness**: Setting changes demonstrably improve learning experience quality
- **Career Relevance**: All settings directly support specific PM career advancement objectives
- **Ease of Use**: Settings are accessible and understandable without extensive explanation

### User Experience Validation  
- **Configuration Speed**: Users can quickly optimize settings for their specific needs
- **Customization Satisfaction**: Users find adequate control over their learning experience
- **Recommendation Quality**: Intelligent setting suggestions feel helpful and relevant
- **Mobile Optimization**: Full settings experience accessible on mobile devices

### Framework Integration Validation
- **Career Transition Support**: Settings effectively customize experience for all PM transition patterns
- **Industry Context Integration**: Settings support healthcare, cybersecurity, fintech, enterprise, consumer customization
- **Meeting Type Customization**: Settings appropriately optimize for different meeting communication contexts
- **Continuous Learning**: Settings contribute to overall skill development framework optimization

---

*Implementation Time Estimate: 3 hours*
*Success Criteria: Intelligent settings system with career-aware defaults and comprehensive PM-specific customization*