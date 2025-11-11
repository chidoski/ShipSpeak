/**
 * Mock Data for Settings & Preferences System
 * Realistic PM preferences with career-intelligent defaults and recommendations
 */

import { 
  UserPreferences, 
  IntelligentDefaults, 
  CareerBasedDefaults,
  IndustryBasedDefaults,
  AdaptiveRecommendation,
  FrameworkPreference
} from '@/types/settings-preferences'

export const mockUserPreferences: UserPreferences = {
  learningPathPreferences: {
    primaryFocus: 'PRACTICE_FIRST',
    difficultyProgression: 'ADAPTIVE',
    feedbackIntensity: 'MODERATE',
    industryContextEmphasis: 75,
    frameworkFocus: [
      {
        framework: 'RICE Prioritization',
        proficiencyLevel: 7,
        practiceFrequency: 'HIGH',
        applicationContext: ['Feature Planning', 'Sprint Planning']
      },
      {
        framework: 'Jobs-to-be-Done',
        proficiencyLevel: 6,
        practiceFrequency: 'MEDIUM',
        applicationContext: ['Product Strategy', 'Customer Research']
      },
      {
        framework: 'OKR Planning',
        proficiencyLevel: 5,
        practiceFrequency: 'MEDIUM',
        applicationContext: ['Goal Setting', 'Progress Tracking']
      }
    ]
  },
  practiceSessionSettings: {
    preferredSessionLength: 18,
    realTimeCoaching: true,
    transcriptionDisplay: true,
    backgroundNoise: 'WARN',
    qualityThreshold: 'STANDARD',
    retakePolicy: 'LIMITED'
  },
  feedbackCustomization: {
    feedbackStyle: 'ENCOURAGING',
    strengthEmphasis: 65,
    careerContextIntegration: true,
    benchmarkDisplay: true,
    improvementTimelinePreference: 'REALISTIC'
  },
  industryContextSettings: {
    primaryIndustry: 'FINTECH',
    regulatoryFocus: 'HIGH',
    complianceEmphasis: ['SEC', 'Banking Regulations', 'PCI DSS'],
    stakeholderPriority: ['Regulators', 'Risk Management', 'Customers', 'Engineering'],
    technicalDepth: 'BALANCED'
  },
  careerTransitionFocus: {
    currentLevel: 'PM',
    targetLevel: 'SENIOR_PM',
    transitionTimeline: 'SIX_MONTHS',
    focusAreas: [
      {
        area: 'Executive Communication',
        priority: 'HIGH',
        currentLevel: 6,
        targetLevel: 8,
        timeframe: '4 months'
      },
      {
        area: 'Strategic Thinking',
        priority: 'HIGH',
        currentLevel: 7,
        targetLevel: 9,
        timeframe: '6 months'
      },
      {
        area: 'Framework Application',
        priority: 'MEDIUM',
        currentLevel: 7,
        targetLevel: 8,
        timeframe: '3 months'
      }
    ],
    confidenceLevel: 7
  },
  meetingTypePreferences: {
    boardPresentation: {
      presentationStyle: 'HYBRID',
      timeManagement: 'FLEXIBLE',
      contentFocus: 'BALANCED',
      confidenceBuilding: 'INTENSIVE'
    },
    planningSession: {
      strategicDepth: 'DETAILED',
      collaborationStyle: 'FACILITATION',
      timelineCommunication: 'REALISTIC',
      stakeholderManagement: 'CONSENSUS_BUILDING'
    },
    stakeholderUpdate: {
      communicationStyle: 'CONVERSATIONAL',
      detailLevel: 'AUDIENCE_ADAPTIVE',
      problemCommunication: 'SOLUTION_FOCUSED',
      accountability: 'CLEAR_OWNERSHIP'
    },
    coachingSession: {
      coachingIntensity: 'MODERATE',
      feedbackFrequency: 'REAL_TIME',
      encouragementStyle: 'BALANCED',
      practiceComplexity: 'INTERMEDIATE'
    }
  },
  systemPreferences: {
    notifications: {
      progressUpdates: true,
      achievementAlerts: true,
      reminderFrequency: 'WEEKLY',
      emailDigest: true,
      mobilePush: true
    },
    privacy: {
      dataRetention: 'STANDARD',
      meetingRecordingConsent: true,
      analyticsSharing: true,
      benchmarkParticipation: true,
      profileVisibility: 'ANONYMOUS'
    },
    integrations: {
      calendarSync: true,
      slackIntegration: false,
      zoomIntegration: true,
      teamsIntegration: false,
      exportFormat: 'PDF'
    },
    accessibility: {
      fontSize: 'MEDIUM',
      contrast: 'NORMAL',
      reduceMotion: false,
      screenReaderOptimization: false,
      keyboardNavigation: true
    }
  }
}

export const mockCareerBasedDefaults: CareerBasedDefaults = {
  'PO_TO_PM': {
    learningPathFocus: 'STRATEGIC_THINKING',
    feedbackIntensity: 'MODERATE',
    frameworkEmphasis: ['RICE', 'Jobs-to-be-Done', 'Customer Journey'],
    industryContextWeight: 70,
    practiceSessionLength: 15,
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
  },
  'GROUP_PM_TO_DIRECTOR': {
    learningPathFocus: 'BUSINESS_STRATEGY',
    feedbackIntensity: 'EXPERT',
    frameworkEmphasis: ['Business Model Canvas', 'Market Strategy', 'Financial Modeling'],
    industryContextWeight: 90,
    practiceSessionLength: 30,
    difficultyProgression: 'ADAPTIVE',
    reasoning: 'Group PM → Director requires business strategy mastery and board-level communication'
  }
}

export const mockIndustryBasedDefaults: IndustryBasedDefaults = {
  'HEALTHCARE': {
    regulatoryFocus: 'HIGH',
    complianceEmphasis: ['FDA', 'HIPAA', 'Clinical Trials'],
    stakeholderPriority: ['Providers', 'Patients', 'Regulators', 'Payers'],
    reasoning: 'Healthcare PM requires high regulatory awareness and patient outcome prioritization'
  },
  'CYBERSECURITY': {
    regulatoryFocus: 'HIGH',
    complianceEmphasis: ['SOC2', 'ISO27001', 'GDPR'],
    stakeholderPriority: ['Security Teams', 'Compliance', 'Business Leaders', 'Customers'],
    reasoning: 'Cybersecurity PM requires expert-level risk communication and technical translation'
  },
  'FINTECH': {
    regulatoryFocus: 'HIGH',
    complianceEmphasis: ['SEC', 'Banking Regulations', 'PCI DSS'],
    stakeholderPriority: ['Regulators', 'Financial Partners', 'Customers', 'Risk Management'],
    reasoning: 'Fintech PM needs sophisticated regulatory and risk management communication'
  },
  'ENTERPRISE': {
    regulatoryFocus: 'MEDIUM',
    complianceEmphasis: ['SOX', 'Data Privacy', 'Security Standards'],
    stakeholderPriority: ['Enterprise Customers', 'Sales', 'Support', 'Engineering'],
    reasoning: 'Enterprise PM focuses on ROI communication and complex stakeholder management'
  },
  'CONSUMER': {
    regulatoryFocus: 'MEDIUM',
    complianceEmphasis: ['Privacy Laws', 'Platform Policies', 'Content Guidelines'],
    stakeholderPriority: ['Users', 'Growth Team', 'Data Science', 'Marketing'],
    reasoning: 'Consumer PM emphasizes user experience and rapid experimentation'
  }
}

export const mockAdaptiveRecommendations: AdaptiveRecommendation[] = [
  {
    setting: 'feedbackIntensity',
    currentValue: 'MODERATE',
    recommendedValue: 'INTENSIVE',
    reasoning: 'Your consistent practice and 8.2/10 confidence suggests readiness for more challenging feedback',
    impact: 'Could accelerate Senior PM readiness by 2-3 months',
    confidence: 'HIGH',
    category: 'CAREER_ADVANCEMENT'
  },
  {
    setting: 'practiceSessionLength',
    currentValue: 15,
    recommendedValue: 20,
    reasoning: 'Your framework mastery indicates readiness for longer, more complex scenarios',
    impact: 'Enhanced executive communication development',
    confidence: 'HIGH',
    category: 'SKILL_DEVELOPMENT'
  },
  {
    setting: 'industryContextEmphasis',
    currentValue: 75,
    recommendedValue: 85,
    reasoning: 'Fintech regulatory requirements suggest increased industry focus would be beneficial',
    impact: 'Better alignment with fintech PM communication standards',
    confidence: 'MEDIUM',
    category: 'SKILL_DEVELOPMENT'
  },
  {
    setting: 'frameworkFocus',
    currentValue: ['RICE', 'Jobs-to-be-Done'],
    recommendedValue: ['RICE', 'Jobs-to-be-Done', 'North Star Framework'],
    reasoning: 'Your Senior PM transition would benefit from strategic framework addition',
    impact: 'Enhanced strategic communication and vision articulation skills',
    confidence: 'MEDIUM',
    category: 'CAREER_ADVANCEMENT'
  },
  {
    setting: 'boardPresentationStyle',
    currentValue: 'HYBRID',
    recommendedValue: 'FORMAL',
    reasoning: 'Senior PM roles typically require more formal board presentation skills',
    impact: 'Increased executive presence and board readiness',
    confidence: 'HIGH',
    category: 'CAREER_ADVANCEMENT'
  },
  {
    setting: 'reminderFrequency',
    currentValue: 'WEEKLY',
    recommendedValue: 'DAILY',
    reasoning: 'Daily reminders could help maintain momentum during intensive development phase',
    impact: 'Improved practice consistency and faster skill development',
    confidence: 'LOW',
    category: 'ENGAGEMENT'
  }
]

export const mockIntelligentDefaults: IntelligentDefaults = {
  careerBasedDefaults: mockCareerBasedDefaults,
  industryBasedDefaults: mockIndustryBasedDefaults,
  learningStyleDefaults: {
    visual: {
      preferredExerciseTypes: ['Diagram Creation', 'Visual Storytelling', 'Chart Interpretation'],
      feedbackFormat: 'VISUAL_CHARTS',
      practiceStructure: 'STRUCTURED_MODULES',
      progressVisualization: 'DASHBOARD_HEAVY'
    },
    auditory: {
      preferredExerciseTypes: ['Verbal Presentation', 'Discussion Facilitation', 'Audio Analysis'],
      feedbackFormat: 'AUDIO_COMMENTARY',
      practiceStructure: 'CONVERSATION_BASED',
      progressVisualization: 'SUMMARY_REPORTS'
    },
    kinesthetic: {
      preferredExerciseTypes: ['Role Playing', 'Simulation', 'Interactive Scenarios'],
      feedbackFormat: 'HANDS_ON_GUIDANCE',
      practiceStructure: 'EXPERIENTIAL_LEARNING',
      progressVisualization: 'ACTIVITY_TRACKING'
    },
    readingWriting: {
      preferredExerciseTypes: ['Case Study Analysis', 'Written Communication', 'Framework Documentation'],
      feedbackFormat: 'DETAILED_WRITTEN',
      practiceStructure: 'STUDY_GUIDE_BASED',
      progressVisualization: 'TEXT_SUMMARIES'
    }
  },
  adaptiveRecommendations: mockAdaptiveRecommendations
}

// Individual framework preferences for different career levels
export const mockFrameworksByCareerLevel = {
  'PO_TO_PM': [
    {
      framework: 'RICE Prioritization',
      proficiencyLevel: 3,
      practiceFrequency: 'HIGH',
      applicationContext: ['Feature Planning', 'Backlog Management']
    },
    {
      framework: 'Jobs-to-be-Done',
      proficiencyLevel: 4,
      practiceFrequency: 'MEDIUM',
      applicationContext: ['User Research', 'Product Strategy']
    },
    {
      framework: 'Customer Journey Mapping',
      proficiencyLevel: 5,
      practiceFrequency: 'MEDIUM',
      applicationContext: ['UX Planning', 'Customer Research']
    }
  ],
  'PM_TO_SENIOR_PM': [
    {
      framework: 'RICE Prioritization',
      proficiencyLevel: 7,
      practiceFrequency: 'HIGH',
      applicationContext: ['Strategic Planning', 'Resource Allocation']
    },
    {
      framework: 'OKR Planning',
      proficiencyLevel: 6,
      practiceFrequency: 'HIGH',
      applicationContext: ['Goal Setting', 'Team Alignment']
    },
    {
      framework: 'North Star Framework',
      proficiencyLevel: 5,
      practiceFrequency: 'MEDIUM',
      applicationContext: ['Vision Setting', 'Metric Alignment']
    }
  ],
  'SENIOR_PM_TO_GROUP_PM': [
    {
      framework: 'Portfolio Management',
      proficiencyLevel: 6,
      practiceFrequency: 'HIGH',
      applicationContext: ['Multi-Product Strategy', 'Resource Allocation']
    },
    {
      framework: 'Cross-team Coordination',
      proficiencyLevel: 7,
      practiceFrequency: 'HIGH',
      applicationContext: ['Team Leadership', 'Stakeholder Management']
    }
  ]
}

// Industry-specific customization examples
export const mockIndustryCustomizations = {
  'FINTECH': {
    requiredCompliance: ['SEC Regulations', 'Banking Laws', 'PCI DSS', 'AML/KYC'],
    keyStakeholders: ['Regulators', 'Financial Partners', 'Compliance Teams', 'Risk Management'],
    communicationFocus: ['Risk Assessment', 'Regulatory Impact', 'Trust Building', 'Security']
  },
  'HEALTHCARE': {
    requiredCompliance: ['HIPAA', 'FDA Regulations', 'Clinical Trial Standards', 'Patient Safety'],
    keyStakeholders: ['Healthcare Providers', 'Patients', 'Regulators', 'Insurance Companies'],
    communicationFocus: ['Patient Outcomes', 'Safety Protocols', 'Regulatory Compliance', 'Evidence-Based Decisions']
  },
  'CYBERSECURITY': {
    requiredCompliance: ['SOC2', 'ISO27001', 'GDPR', 'NIST Framework'],
    keyStakeholders: ['Security Teams', 'Compliance Officers', 'IT Leadership', 'Business Units'],
    communicationFocus: ['Risk Communication', 'Threat Assessment', 'Security Architecture', 'Incident Response']
  }
}