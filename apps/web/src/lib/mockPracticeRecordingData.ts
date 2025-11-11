// Mock data for practice recording system
// Comprehensive mock scenarios and configurations

import { 
  ExerciseContext, 
  UserProfile, 
  RecordingSession,
  ContextualHint,
  FrameworkUsage,
  CommunicationPattern,
  QualityThresholds,
  OptimizationSuggestion,
  PMRole,
  IndustryType,
  ExerciseType,
  DifficultyLevel
} from '../types/practice-recording'

export const mockExerciseContexts: ExerciseContext[] = [
  {
    id: 'board-pres-fintech-1',
    type: 'BOARD_PRESENTATION',
    title: 'Q4 Product Strategy Board Presentation',
    description: 'Present quarterly product strategy and resource allocation to board of directors',
    timeLimit: 180, // 3 minutes
    difficulty: 'MASTERY',
    industryContext: 'fintech',
    meetingType: 'board_presentation',
    successCriteria: [
      'Complete executive summary within first 30 seconds',
      'Clear business impact metrics and ROI',
      'Confident delivery without hesitation',
      'Risk acknowledgment with mitigation strategies'
    ],
    frameworkPrompts: [
      'Answer-first structure',
      'Business impact focus', 
      'Risk acknowledgment',
      'Competitive positioning'
    ],
    stakeholderSimulation: true
  },
  {
    id: 'stakeholder-update-healthcare-1',
    type: 'STAKEHOLDER_UPDATE',
    title: 'Clinical Product Development Status Update',
    description: 'Update stakeholders on FDA submission timeline and clinical trial integration progress',
    timeLimit: 300, // 5 minutes
    difficulty: 'PRACTICE',
    industryContext: 'healthcare',
    meetingType: 'stakeholder_update',
    successCriteria: [
      'Clear progress communication against milestones',
      'Specific blocker identification and escalation',
      'Action-oriented next steps with ownership',
      'Regulatory compliance context integration'
    ],
    frameworkPrompts: [
      'Progress clarity',
      'Blocker communication',
      'Next steps definition',
      'Regulatory context'
    ],
    stakeholderSimulation: false
  },
  {
    id: 'planning-session-enterprise-1', 
    type: 'PLANNING_SESSION',
    title: 'Enterprise Security Platform Sprint Planning',
    description: 'Lead cross-functional planning session for security platform feature development',
    timeLimit: 600, // 10 minutes
    difficulty: 'FOUNDATION',
    industryContext: 'cybersecurity',
    meetingType: 'planning_session',
    successCriteria: [
      'Strategic altitude with market trend integration',
      'Resource allocation reasoning with headcount planning',
      'Realistic timeline estimation with dependency awareness',
      'Cross-functional alignment demonstration'
    ],
    frameworkPrompts: [
      'RICE prioritization',
      'Resource allocation',
      'Dependency mapping',
      'Security-first thinking'
    ],
    stakeholderSimulation: true
  },
  {
    id: 'framework-practice-consumer-1',
    type: 'FRAMEWORK_PRACTICE',
    title: 'Consumer App Growth Feature Prioritization',
    description: 'Practice applying PM frameworks for user retention and growth feature decisions',
    timeLimit: 240, // 4 minutes
    difficulty: 'PRACTICE',
    industryContext: 'consumer',
    meetingType: 'team_meeting',
    successCriteria: [
      'Clear framework application (RICE/ICE)',
      'User experience impact reasoning',
      'Growth metrics integration',
      'Experimentation strategy communication'
    ],
    frameworkPrompts: [
      'RICE analysis',
      'Growth impact',
      'A/B testing strategy',
      'User retention focus'
    ],
    stakeholderSimulation: false
  }
]

export const mockUserProfiles: UserProfile[] = [
  {
    id: 'user-po-to-pm',
    currentRole: 'PO',
    targetRole: 'PM',
    industryExperience: ['enterprise', 'cybersecurity'],
    skillGaps: ['STRATEGIC_THINKING', 'FRAMEWORK_APPLICATION', 'EXECUTIVE_PRESENCE'],
    coachingPreferences: {
      realTimeHints: true,
      coachingIntensity: 'HIGH',
      frameworkReminders: true,
      confidenceBuilding: true,
      structureGuidance: true
    },
    recordingHistory: []
  },
  {
    id: 'user-pm-to-senior',
    currentRole: 'PM',
    targetRole: 'SENIOR_PM',
    industryExperience: ['fintech', 'healthcare'],
    skillGaps: ['EXECUTIVE_PRESENCE', 'STAKEHOLDER_MANAGEMENT'],
    coachingPreferences: {
      realTimeHints: true,
      coachingIntensity: 'MEDIUM',
      frameworkReminders: false,
      confidenceBuilding: true,
      structureGuidance: true
    },
    recordingHistory: []
  },
  {
    id: 'user-senior-to-group',
    currentRole: 'SENIOR_PM',
    targetRole: 'GROUP_PM',
    industryExperience: ['consumer', 'enterprise'],
    skillGaps: ['STRATEGIC_THINKING', 'STAKEHOLDER_MANAGEMENT'],
    coachingPreferences: {
      realTimeHints: false,
      coachingIntensity: 'LOW',
      frameworkReminders: true,
      confidenceBuilding: false,
      structureGuidance: true
    },
    recordingHistory: []
  }
]

export const mockRealTimeCoaching: ContextualHint[] = [
  {
    id: 'framework-rice-reminder',
    type: 'FRAMEWORK_REMINDER',
    message: 'Great start! Consider RICE framework: Reach × Impact × Confidence ÷ Effort',
    timing: 'AFTER_PAUSE',
    urgency: 'MEDIUM',
    careerRelevance: 'Essential for PM → Senior PM transition',
    triggerCondition: 'prioritize based on'
  },
  {
    id: 'answer-first-structure',
    type: 'STRUCTURE_GUIDANCE',
    message: 'Try answer-first: Start with your recommendation, then provide supporting evidence',
    timing: 'IMMEDIATE',
    urgency: 'HIGH',
    careerRelevance: 'Critical for executive communication',
    triggerCondition: 'LONG_EXPLANATION_DETECTED'
  },
  {
    id: 'confidence-building',
    type: 'CONFIDENCE_BUILDING',
    message: 'Strong insights! Use definitive language: "This will..." instead of "This should..."',
    timing: 'AFTER_COMPLETION',
    urgency: 'MEDIUM',
    careerRelevance: 'Executive presence development',
    triggerCondition: 'UNCERTAIN_LANGUAGE_DETECTED'
  },
  {
    id: 'stakeholder-adaptation',
    type: 'STAKEHOLDER_ADAPTATION',
    message: 'Excellent stakeholder awareness. Continue adapting your language for the audience.',
    timing: 'ON_TRIGGER',
    urgency: 'LOW',
    careerRelevance: 'Advanced stakeholder management skill',
    triggerCondition: 'AUDIENCE_ADAPTATION_DETECTED'
  },
  {
    id: 'time-management-board',
    type: 'TIME_MANAGEMENT',
    message: 'You\'re at 60 seconds - ensure your key recommendation is clear in the next 30 seconds',
    timing: 'IMMEDIATE',
    urgency: 'HIGH',
    careerRelevance: 'Board presentation requires immediate impact',
    triggerCondition: 'BOARD_PRESENTATION_60_SECONDS'
  }
]

export const mockFrameworkDetections: FrameworkUsage[] = [
  {
    framework: 'RICE',
    confidence: 0.92,
    context: 'Based on our RICE analysis, the reach would be approximately 100,000 users with high impact',
    completeness: 0.85
  },
  {
    framework: 'ICE',
    confidence: 0.78,
    context: 'Looking at the ICE score - impact is high, confidence is medium, ease is low',
    completeness: 0.70
  },
  {
    framework: 'JOBS_TO_BE_DONE',
    confidence: 0.88,
    context: 'The customer job here is to quickly assess financial risk during onboarding',
    completeness: 0.90
  },
  {
    framework: 'OKR',
    confidence: 0.85,
    context: 'This aligns with our Q4 objective of improving user retention by 15%',
    completeness: 0.75
  }
]

export const mockCommunicationPatterns: CommunicationPattern[] = [
  {
    pattern: 'ANSWER_FIRST',
    confidence: 0.95,
    timestamp: new Date(),
    context: 'I recommend we prioritize the security feature because...',
    suggestion: 'Excellent answer-first structure! Continue with supporting evidence.'
  },
  {
    pattern: 'FRAMEWORK_USAGE',
    confidence: 0.88,
    timestamp: new Date(),
    context: 'Using RICE framework, the reach is 50K users...',
    suggestion: 'Great framework application. Consider quantifying the business impact.'
  },
  {
    pattern: 'UNCERTAIN_LANGUAGE',
    confidence: 0.72,
    timestamp: new Date(),
    context: 'This might be a good approach, possibly...',
    suggestion: 'Consider more definitive language for executive presence.'
  },
  {
    pattern: 'EXECUTIVE_STRUCTURE',
    confidence: 0.90,
    timestamp: new Date(),
    context: 'From a strategic perspective, the competitive advantage...',
    suggestion: 'Strong executive communication. Maintain this altitude.'
  },
  {
    pattern: 'STAKEHOLDER_ADAPTATION',
    confidence: 0.83,
    timestamp: new Date(),
    context: 'Given your focus on customer acquisition...',
    suggestion: 'Good stakeholder awareness. Keep personalizing your message.'
  }
]

export const mockQualityThresholds: QualityThresholds = {
  excellent: { clarity: 95, noiseLevel: 5, volume: 85 },
  good: { clarity: 85, noiseLevel: 15, volume: 75 },
  acceptable: { clarity: 75, noiseLevel: 25, volume: 65 },
  poor: { clarity: 65, noiseLevel: 35, volume: 55 }
}

export const mockOptimizationSuggestions: OptimizationSuggestion[] = [
  {
    issue: 'LOW_CLARITY',
    suggestion: 'Move closer to microphone for better clarity',
    impact: 'Critical for accurate feedback and analysis',
    priority: 'HIGH'
  },
  {
    issue: 'BACKGROUND_NOISE',
    suggestion: 'Find quieter environment or use noise cancellation',
    impact: 'Improves transcription accuracy and focus',
    priority: 'MEDIUM'
  },
  {
    issue: 'LOW_VOLUME',
    suggestion: 'Speak with more projection and confidence',
    impact: 'Essential for executive presence development',
    priority: 'HIGH'
  },
  {
    issue: 'HIGH_VOLUME',
    suggestion: 'Reduce microphone gain or speak more softly',
    impact: 'Prevents audio distortion and clipping',
    priority: 'MEDIUM'
  },
  {
    issue: 'DEVICE_ISSUE',
    suggestion: 'Check microphone connection and drivers',
    impact: 'Required for recording functionality',
    priority: 'HIGH'
  }
]

export const mockRecordingConfigurations = [
  {
    exerciseType: 'BOARD_PRESENTATION' as ExerciseType,
    timeLimit: 180, // 3 minutes
    coachingIntensity: 'HIGH',
    realTimeHints: true,
    industryContext: 'fintech' as IndustryType,
    stakeholderSimulation: true,
    frameworkPrompts: ['Answer-first structure', 'Business impact focus', 'Risk acknowledgment'],
    successCriteria: [
      'Complete presentation within time limit',
      'Clear conclusion in first 30 seconds',
      'Business metrics integration',
      'Confident delivery without hesitation'
    ]
  },
  {
    exerciseType: 'STAKEHOLDER_UPDATE' as ExerciseType,
    timeLimit: 300, // 5 minutes
    coachingIntensity: 'MEDIUM',
    realTimeHints: false,
    industryContext: 'healthcare' as IndustryType,
    stakeholderSimulation: false,
    frameworkPrompts: ['Progress clarity', 'Blocker communication', 'Next steps definition'],
    successCriteria: [
      'Clear progress communication',
      'Specific blocker identification',
      'Action-oriented next steps',
      'Appropriate stakeholder adaptation'
    ]
  },
  {
    exerciseType: 'PLANNING_SESSION' as ExerciseType,
    timeLimit: 600, // 10 minutes
    coachingIntensity: 'LOW',
    realTimeHints: true,
    industryContext: 'cybersecurity' as IndustryType,
    stakeholderSimulation: true,
    frameworkPrompts: ['RICE prioritization', 'Resource reasoning', 'Timeline estimation'],
    successCriteria: [
      'Strategic altitude maintenance',
      'Resource allocation clarity',
      'Realistic timeline communication',
      'Cross-functional coordination'
    ]
  },
  {
    exerciseType: 'FRAMEWORK_PRACTICE' as ExerciseType,
    timeLimit: 240, // 4 minutes
    coachingIntensity: 'HIGH',
    realTimeHints: true,
    industryContext: 'consumer' as IndustryType,
    stakeholderSimulation: false,
    frameworkPrompts: ['RICE analysis', 'Growth impact', 'User retention'],
    successCriteria: [
      'Clear framework application',
      'User experience reasoning',
      'Growth metrics integration',
      'Confident framework usage'
    ]
  }
]

// Helper function to get appropriate exercise for user profile
export const getRecommendedExercise = (userProfile: UserProfile): ExerciseContext => {
  // PO → PM transition focuses on strategic thinking
  if (userProfile.currentRole === 'PO' && userProfile.targetRole === 'PM') {
    return mockExerciseContexts.find(ex => ex.type === 'FRAMEWORK_PRACTICE') || mockExerciseContexts[0]
  }
  
  // PM → Senior PM transition focuses on executive communication
  if (userProfile.currentRole === 'PM' && userProfile.targetRole === 'SENIOR_PM') {
    return mockExerciseContexts.find(ex => ex.type === 'STAKEHOLDER_UPDATE') || mockExerciseContexts[1]
  }
  
  // Senior PM → Group PM transition focuses on strategic leadership
  if (userProfile.currentRole === 'SENIOR_PM' && userProfile.targetRole === 'GROUP_PM') {
    return mockExerciseContexts.find(ex => ex.type === 'PLANNING_SESSION') || mockExerciseContexts[2]
  }
  
  // Group PM → Director focuses on board-level communication
  if (userProfile.currentRole === 'GROUP_PM' && userProfile.targetRole === 'DIRECTOR') {
    return mockExerciseContexts.find(ex => ex.type === 'BOARD_PRESENTATION') || mockExerciseContexts[0]
  }
  
  return mockExerciseContexts[0]
}

// Helper function to get coaching hints based on career transition
export const getCareerSpecificHints = (currentRole: PMRole, targetRole: PMRole): ContextualHint[] => {
  const transitionKey = `${currentRole}_TO_${targetRole}`
  
  const hints: Record<string, ContextualHint[]> = {
    'PO_TO_PM': [
      {
        id: 'po-pm-business-language',
        type: 'STAKEHOLDER_ADAPTATION',
        message: 'Focus on business outcomes and ROI rather than delivery milestones',
        timing: 'ON_TRIGGER',
        urgency: 'HIGH',
        careerRelevance: 'PO→PM transition requires business language fluency',
        triggerCondition: 'DELIVERY_LANGUAGE_DETECTED'
      }
    ],
    'PM_TO_SENIOR_PM': [
      {
        id: 'pm-senior-executive-structure',
        type: 'STRUCTURE_GUIDANCE',
        message: 'Lead with your recommendation, then provide supporting analysis',
        timing: 'IMMEDIATE',
        urgency: 'HIGH',
        careerRelevance: 'Executive communication essential for Senior PM advancement',
        triggerCondition: 'EXPLANATION_BEFORE_CONCLUSION'
      }
    ],
    'SENIOR_PM_TO_GROUP_PM': [
      {
        id: 'senior-group-portfolio-thinking',
        type: 'FRAMEWORK_REMINDER',
        message: 'Consider portfolio-level impacts and resource allocation across products',
        timing: 'AFTER_PAUSE',
        urgency: 'MEDIUM',
        careerRelevance: 'Group PM role requires multi-product strategic thinking',
        triggerCondition: 'SINGLE_PRODUCT_FOCUS'
      }
    ]
  }
  
  return hints[transitionKey] || []
}

export const mockAudioQualityOptimization = {
  qualityThresholds: mockQualityThresholds,
  optimizationSuggestions: mockOptimizationSuggestions,
  realTimeMonitoring: {
    samplingRate: 100, // ms
    qualityUpdateFrequency: 1000, // ms
    adaptiveFiltering: true,
    noiseReductionEnabled: true
  },
  deviceOptimization: {
    preferredSampleRate: 44100,
    preferredBitDepth: 16,
    preferredChannels: 1,
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true
  }
}