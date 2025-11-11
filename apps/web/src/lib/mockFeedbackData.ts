import { AnalysisResults, StrengthAnalysis, ImprovementAnalysis, CareerProgressionAnalysis, FrameworkUsageAnalysis, BenchmarkData, UserProfile, ImprovementEngine } from '@/types/feedback-analysis';

export const mockAnalysisResults: AnalysisResults = {
  overallScore: 7.8,
  scoreImprovement: 0.6,
  industryBenchmark: 7.2,
  roleBenchmark: 7.5,
  confidenceLevel: 'HIGH',
  
  dimensionalScores: {
    communicationStructure: 8.4,
    executivePresence: 7.1,
    frameworkApplication: 8.7,
    industryFluency: 6.9,
    stakeholderAdaptation: 7.5,
    confidenceLevel: 7.8
  },

  strengthAreas: [
    {
      area: 'Framework Application',
      score: 8.7,
      evidence: [
        'Excellent RICE framework usage with specific metrics',
        'Clear reach, impact, confidence, effort articulation',
        'Sophisticated trade-off reasoning with multiple factors'
      ],
      careerLeverage: 'This strength accelerates Senior PM readiness',
      reinforcementSuggestions: [
        'Apply this framework mastery to more complex scenarios',
        'Coach others on framework usage to build teaching skills',
        'Integrate with additional frameworks like ICE and Jobs-to-be-Done'
      ]
    },
    {
      area: 'Communication Structure',
      score: 8.4,
      evidence: [
        'Consistent answer-first methodology usage',
        'Clear conclusion → evidence → implications structure',
        'Excellent time management within presentation constraints'
      ],
      careerLeverage: 'Executive communication readiness is advanced',
      reinforcementSuggestions: [
        'Practice with increasingly complex scenarios',
        'Apply structure to crisis communication situations',
        'Mentor others on answer-first methodology'
      ]
    }
  ],

  improvementAreas: [
    {
      area: 'Executive Presence',
      currentScore: 7.1,
      targetScore: 8.5,
      priorityLevel: 'HIGH',
      careerImpact: 'Critical for Senior PM transition',
      specificEvidence: [
        'Strong content but used hesitation phrases: "I think", "maybe"',
        'Good structure but could strengthen conclusion confidence',
        'Excellent data integration but weak definitive language'
      ],
      improvementActions: [
        {
          action: 'Practice definitive language patterns',
          method: 'COACHING_SESSION',
          estimatedTimeToImprovement: '1-2 weeks with daily practice',
          successMetrics: ['Eliminate hesitation words', 'Use "will" vs "should"', 'Strengthen conclusion delivery']
        },
        {
          action: 'Board presentation confidence building',
          method: 'PRACTICE_MODULE',
          estimatedTimeToImprovement: '2-3 weeks',
          successMetrics: ['60-second confident summaries', 'Risk acknowledgment without defensiveness']
        }
      ]
    },
    {
      area: 'Industry Fluency - Fintech',
      currentScore: 6.9,
      targetScore: 8.2,
      priorityLevel: 'MEDIUM',
      careerImpact: 'Important for specialization and credibility',
      specificEvidence: [
        'Good business reasoning but missing regulatory context',
        'Strong ROI focus but weak compliance integration',
        'Excellent customer focus but limited risk management vocabulary'
      ],
      improvementActions: [
        {
          action: 'Master SEC and banking regulation communication',
          method: 'PRACTICE_MODULE',
          estimatedTimeToImprovement: '3-4 weeks',
          successMetrics: ['Regulatory requirement integration', 'Compliance-aware product decisions']
        }
      ]
    }
  ],

  frameworkUsage: {
    frameworksDetected: ['RICE', 'Jobs-to-be-Done'],
    usageQuality: 8.7,
    integrationEffectiveness: 8.2,
    recommendedFrameworks: ['ICE', 'OKR', 'Pyramid Principle']
  },

  careerProgressionInsights: {
    currentLevel: 'PM',
    targetLevel: 'SENIOR_PM',
    readinessPercentage: 78,
    keyGapsClosing: 2,
    estimatedTimeToReadiness: '4-6 months',
    criticalSkillGaps: ['Executive Presence', 'Industry Fluency']
  }
};

export const mockUserProfile: UserProfile = {
  currentRole: 'PM',
  targetRole: 'Senior PM',
  industry: 'fintech',
  experienceLevel: 'mid',
  strengths: ['Framework Application', 'Communication Structure'],
  goals: ['Executive Presence', 'Industry Expertise', 'Leadership Skills']
};

export const mockImprovementEngine: ImprovementEngine = {
  priorityWeights: {
    careerImpact: 0.4,
    quickWins: 0.2,
    foundationalSkills: 0.3,
    industryRelevance: 0.1
  },
  recommendationTypes: [
    { type: 'COACHING', weight: 0.3, conditions: ['high_priority', 'soft_skills'] },
    { type: 'PRACTICE', weight: 0.4, conditions: ['framework_skills', 'communication'] },
    { type: 'FRAMEWORK', weight: 0.2, conditions: ['knowledge_gaps'] },
    { type: 'MEETING', weight: 0.1, conditions: ['real_world_application'] }
  ],
  learningPreferences: {
    preferredMethods: ['practice_modules', 'coaching_sessions'],
    timeAvailability: 3,
    difficultyPreference: 'gradual',
    feedbackStyle: 'detailed'
  }
};

export const mockBenchmarkData: BenchmarkData = {
  industry: 'fintech',
  role: 'PM',
  averageScores: {
    communicationStructure: 7.2,
    executivePresence: 6.8,
    frameworkApplication: 7.5,
    industryFluency: 7.8,
    stakeholderAdaptation: 7.1,
    confidenceLevel: 6.9
  },
  topPerformerScores: {
    communicationStructure: 8.9,
    executivePresence: 8.7,
    frameworkApplication: 9.1,
    industryFluency: 9.2,
    stakeholderAdaptation: 8.8,
    confidenceLevel: 8.6
  },
  improvementTimelines: {
    'communicationStructure': '2-4 weeks',
    'executivePresence': '4-8 weeks',
    'frameworkApplication': '1-3 weeks',
    'industryFluency': '6-12 weeks',
    'stakeholderAdaptation': '3-6 weeks',
    'confidenceLevel': '2-6 weeks'
  }
};

export const mockCareerTransitionAnalyses: Record<string, CareerProgressionAnalysis> = {
  'PO_TO_PM': {
    currentLevel: 'PO',
    targetLevel: 'PM',
    readinessPercentage: 65,
    keyGapsClosing: 1,
    estimatedTimeToReadiness: '6-9 months',
    criticalSkillGaps: ['Strategic Language', 'Business Impact Articulation', 'Stakeholder Management']
  },
  'PM_TO_SENIOR_PM': {
    currentLevel: 'PM',
    targetLevel: 'SENIOR_PM',
    readinessPercentage: 78,
    keyGapsClosing: 2,
    estimatedTimeToReadiness: '4-6 months',
    criticalSkillGaps: ['Executive Presence', 'Trade-off Communication', 'Authority Language']
  },
  'SENIOR_PM_TO_GROUP_PM': {
    currentLevel: 'SENIOR_PM',
    targetLevel: 'GROUP_PM',
    readinessPercentage: 82,
    keyGapsClosing: 3,
    estimatedTimeToReadiness: '3-5 months',
    criticalSkillGaps: ['Portfolio Strategy', 'Leadership Communication', 'Cross-team Coordination']
  }
};

export const industryBenchmarks: Record<string, BenchmarkData> = {
  'fintech': {
    industry: 'fintech',
    role: 'PM',
    averageScores: {
      communicationStructure: 7.2,
      executivePresence: 6.8,
      frameworkApplication: 7.5,
      industryFluency: 7.8,
      stakeholderAdaptation: 7.1,
      confidenceLevel: 6.9
    },
    topPerformerScores: {
      communicationStructure: 8.9,
      executivePresence: 8.7,
      frameworkApplication: 9.1,
      industryFluency: 9.2,
      stakeholderAdaptation: 8.8,
      confidenceLevel: 8.6
    },
    improvementTimelines: {
      'communicationStructure': '2-4 weeks',
      'executivePresence': '4-8 weeks',
      'frameworkApplication': '1-3 weeks',
      'industryFluency': '6-12 weeks',
      'stakeholderAdaptation': '3-6 weeks',
      'confidenceLevel': '2-6 weeks'
    }
  },
  'healthcare': {
    industry: 'healthcare',
    role: 'PM',
    averageScores: {
      communicationStructure: 7.8,
      executivePresence: 7.5,
      frameworkApplication: 7.2,
      industryFluency: 8.4,
      stakeholderAdaptation: 8.1,
      confidenceLevel: 7.3
    },
    topPerformerScores: {
      communicationStructure: 9.1,
      executivePresence: 8.9,
      frameworkApplication: 8.8,
      industryFluency: 9.5,
      stakeholderAdaptation: 9.2,
      confidenceLevel: 8.7
    },
    improvementTimelines: {
      'communicationStructure': '3-5 weeks',
      'executivePresence': '5-9 weeks',
      'frameworkApplication': '2-4 weeks',
      'industryFluency': '8-15 weeks',
      'stakeholderAdaptation': '4-7 weeks',
      'confidenceLevel': '3-7 weeks'
    }
  }
};