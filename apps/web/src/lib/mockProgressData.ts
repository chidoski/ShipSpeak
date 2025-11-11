import { 
  SkillProgressData, 
  CareerTrajectory, 
  BenchmarkData,
  UserProfile,
  SkillDimensionProgress,
  OverallProgressMetrics,
  MilestoneAchievement,
  ProgressTimelineEntry,
  FrameworkMastery,
  MeetingTypeProgress,
  StreakData,
  AchievementData
} from '@/types/progress-dashboard'

export const mockUserProfile: UserProfile = {
  id: 'user-123',
  name: 'Sarah Chen',
  currentRole: 'PM',
  targetRole: 'SENIOR_PM',
  industry: 'FINTECH',
  experienceMonths: 18,
  joinedDate: new Date('2023-09-15')
}

export const mockOverallProgress: OverallProgressMetrics = {
  overallScore: 7.4,
  monthlyImprovement: 0.3,
  yearlyImprovement: 2.1,
  strongestAreas: ['Framework Application', 'Communication Structure'],
  developmentPriorities: ['Executive Presence', 'Industry Fluency'],
  practiceSessionsCompleted: 47,
  totalPracticeHours: 23.5,
  careerReadinessPercentage: 78,
  timeToTarget: '4-6 months',
  monthlyProgressRate: 8.2,
  confidenceLevel: 'HIGH'
}

export const mockSkillDimensionsProgress: SkillDimensionProgress[] = [
  {
    dimension: 'EXECUTIVE_COMMUNICATION',
    currentScore: 7.8,
    targetScore: 8.5,
    recentTrend: 'IMPROVING',
    improvementRate: 0.2,
    nextMilestone: 'Board presentation confidence',
    practiceRecommendations: [
      'Practice answer-first methodology',
      'Focus on executive summary structure',
      'Work on trade-off articulation'
    ],
    specificEvidence: [
      'Consistent answer-first structure usage',
      'Improved confidence in trade-off articulation',
      'Better time management in executive summaries'
    ],
    monthlyGrowthRate: 0.2,
    practiceSessionImpact: 0.15,
    timeToMilestone: '3-4 weeks'
  },
  {
    dimension: 'INDUSTRY_FLUENCY',
    currentScore: 6.9,
    targetScore: 8.2,
    recentTrend: 'IMPROVING',
    improvementRate: 0.18,
    nextMilestone: 'Regulatory compliance communication',
    practiceRecommendations: [
      'Study fintech regulatory frameworks',
      'Practice risk management vocabulary',
      'Focus on compliance communication'
    ],
    specificEvidence: [
      'Strong ROI communication but weak regulatory context',
      'Excellent customer focus development',
      'Improving risk management vocabulary'
    ],
    monthlyGrowthRate: 0.18,
    practiceSessionImpact: 0.12,
    timeToMilestone: '4-6 weeks'
  },
  {
    dimension: 'FRAMEWORK_APPLICATION',
    currentScore: 8.7,
    targetScore: 9.0,
    recentTrend: 'STABLE',
    improvementRate: 0.05,
    nextMilestone: 'Advanced framework integration',
    practiceRecommendations: [
      'Practice complex trade-off scenarios',
      'Work on framework teaching ability',
      'Focus on multi-framework integration'
    ],
    specificEvidence: [
      'Excellent RICE framework mastery',
      'Sophisticated trade-off reasoning',
      'Strong framework teaching ability'
    ],
    monthlyGrowthRate: 0.05,
    practiceSessionImpact: 0.03,
    timeToMilestone: '6-8 weeks'
  },
  {
    dimension: 'STRATEGIC_THINKING',
    currentScore: 7.2,
    targetScore: 8.0,
    recentTrend: 'IMPROVING',
    improvementRate: 0.15,
    nextMilestone: 'Market positioning fluency',
    practiceRecommendations: [
      'Practice competitive analysis communication',
      'Focus on long-term strategic narrative',
      'Work on market trend integration'
    ],
    specificEvidence: [
      'Good tactical execution communication',
      'Improving strategic altitude awareness',
      'Better long-term thinking articulation'
    ],
    monthlyGrowthRate: 0.15,
    practiceSessionImpact: 0.10,
    timeToMilestone: '5-7 weeks'
  },
  {
    dimension: 'STAKEHOLDER_MANAGEMENT',
    currentScore: 7.5,
    targetScore: 8.3,
    recentTrend: 'IMPROVING',
    improvementRate: 0.12,
    nextMilestone: 'Cross-functional leadership',
    practiceRecommendations: [
      'Practice difficult conversation navigation',
      'Focus on influence without authority',
      'Work on stakeholder alignment techniques'
    ],
    specificEvidence: [
      'Strong individual relationship building',
      'Improving group dynamic management',
      'Better conflict resolution approach'
    ],
    monthlyGrowthRate: 0.12,
    practiceSessionImpact: 0.08,
    timeToMilestone: '4-6 weeks'
  },
  {
    dimension: 'TECHNICAL_TRANSLATION',
    currentScore: 7.0,
    targetScore: 7.8,
    recentTrend: 'STABLE',
    improvementRate: 0.08,
    nextMilestone: 'Non-technical stakeholder clarity',
    practiceRecommendations: [
      'Practice technical concept simplification',
      'Focus on business impact translation',
      'Work on analogy and metaphor usage'
    ],
    specificEvidence: [
      'Good technical understanding',
      'Needs improvement in simplification',
      'Better business context integration'
    ],
    monthlyGrowthRate: 0.08,
    practiceSessionImpact: 0.06,
    timeToMilestone: '6-8 weeks'
  }
]

export const mockRecentMilestones: MilestoneAchievement[] = [
  {
    milestone: 'Executive Communication Breakthrough',
    achievedDate: new Date('2024-03-15'),
    impactDescription: 'Consistently uses answer-first methodology in practice sessions',
    careerSignificance: 'Critical advancement toward Senior PM readiness',
    celebrationLevel: 'MAJOR'
  },
  {
    milestone: 'RICE Framework Mastery',
    achievedDate: new Date('2024-03-08'),
    impactDescription: 'Sophisticated trade-off articulation with multiple factor integration',
    careerSignificance: 'Enhanced strategic decision communication',
    celebrationLevel: 'MAJOR'
  },
  {
    milestone: 'Stakeholder Adaptation Excellence',
    achievedDate: new Date('2024-02-28'),
    impactDescription: 'Successfully adapts communication style for different audiences',
    careerSignificance: 'Improved cross-functional leadership readiness',
    celebrationLevel: 'MINOR'
  }
]

export const mockCareerTrajectory: CareerTrajectory = {
  currentLevel: 'PM',
  targetLevel: 'SENIOR_PM',
  progressPercentage: 78,
  estimatedTimeToTarget: '4-6 months',
  keyMilestones: [
    {
      milestoneId: 'milestone-1',
      title: 'Executive Presence Mastery',
      description: 'Consistent confidence in C-suite interactions',
      targetDate: new Date('2024-05-15'),
      progressPercentage: 85,
      requiredSkills: ['EXECUTIVE_COMMUNICATION'],
      careerImpact: 'SIGNIFICANT'
    },
    {
      milestoneId: 'milestone-2',
      title: 'Fintech Industry Expertise',
      description: 'Deep regulatory and market knowledge demonstration',
      targetDate: new Date('2024-06-01'),
      progressPercentage: 65,
      requiredSkills: ['INDUSTRY_FLUENCY'],
      careerImpact: 'SIGNIFICANT'
    },
    {
      milestoneId: 'milestone-3',
      title: 'Strategic Leadership Communication',
      description: 'Portfolio-level thinking and communication excellence',
      targetDate: new Date('2024-07-01'),
      progressPercentage: 45,
      requiredSkills: ['STRATEGIC_THINKING', 'STAKEHOLDER_MANAGEMENT'],
      careerImpact: 'TRANSFORMATIVE'
    }
  ],
  readinessIndicators: [
    {
      indicator: 'Board Presentation Readiness',
      currentStatus: 'IN_PROGRESS',
      importance: 'CRITICAL',
      timeToAchieve: '6-8 weeks',
      requiredActions: ['Practice executive summaries', 'Work on confidence building', 'Master answer-first methodology']
    },
    {
      indicator: 'Cross-functional Leadership',
      currentStatus: 'NEARLY_COMPLETE',
      importance: 'HIGH',
      timeToAchieve: '2-3 weeks',
      requiredActions: ['Practice difficult conversations', 'Focus on influence techniques']
    },
    {
      indicator: 'Industry Thought Leadership',
      currentStatus: 'IN_PROGRESS',
      importance: 'MEDIUM',
      timeToAchieve: '8-12 weeks',
      requiredActions: ['Develop fintech expertise', 'Practice regulatory communication', 'Build market knowledge']
    }
  ]
}

export const mockBenchmarkData: BenchmarkData = {
  industryBenchmarks: [
    {
      industry: 'FINTECH',
      averageScore: 7.1,
      topPerformerScore: 8.8,
      userPercentile: 82,
      keyCompetencies: [
        'Regulatory compliance communication',
        'Risk management articulation',
        'Financial metrics fluency'
      ],
      competitiveAdvantages: [
        'Strong framework application',
        'Excellent stakeholder management',
        'Good technical translation'
      ]
    }
  ],
  roleLevelBenchmarks: [
    {
      role: 'SENIOR_PM',
      requiredScore: 8.0,
      averageTimeToAchieve: '6-9 months',
      criticalCompetencies: [
        'Executive communication excellence',
        'Trade-off articulation sophistication',
        'Strategic altitude control'
      ],
      userReadinessAssessment: 'On track for 4-6 month timeline'
    }
  ],
  peerComparisons: [
    {
      anonymizedPeerId: 'peer-001',
      similarityScore: 0.85,
      relativePeer: 'SIMILAR',
      comparisonAreas: ['Framework usage', 'Practice consistency'],
      learningOpportunities: ['Executive presence development', 'Industry expertise building']
    }
  ],
  faangStandards: [
    {
      company: 'AMAZON',
      leadershipPrinciples: 'Strong bias for action, customer obsession evident',
      communicationStyle: 'Answer-first methodology consistently applied',
      readinessLevel: 'Senior PM ready with continued practice',
      specificCriteria: {
        'customer_obsession': 'Strong evidence in practice sessions',
        'bias_for_action': 'Excellent decision communication',
        'dive_deep': 'Good analytical communication'
      }
    },
    {
      company: 'GOOGLE',
      leadershipPrinciples: 'Excellent OKR and metrics communication',
      communicationStyle: 'Strong framework application and reasoning',
      readinessLevel: 'Senior PM ready',
      specificCriteria: {
        'data_driven': 'Excellent metrics fluency',
        'structured_thinking': 'Strong framework usage',
        'user_focus': 'Good product intuition'
      }
    }
  ]
}

export const mockProgressTimeline: ProgressTimelineEntry[] = [
  {
    period: '2024-03',
    overallScore: 7.4,
    keyImprovements: ['Executive presence breakthrough', 'RICE mastery achievement'],
    practiceHours: 8.5,
    milestonesAchieved: 2,
    significantEvents: ['Completed executive communication module', 'Achieved framework mastery certification']
  },
  {
    period: '2024-02', 
    overallScore: 7.1,
    keyImprovements: ['Answer-first consistency', 'Framework application improvement'],
    practiceHours: 6.2,
    milestonesAchieved: 1,
    significantEvents: ['Started board presentation practice', 'Improved stakeholder adaptation']
  },
  {
    period: '2024-01',
    overallScore: 6.8,
    keyImprovements: ['Stakeholder adaptation', 'Communication structure development'],
    practiceHours: 5.8,
    milestonesAchieved: 1,
    significantEvents: ['Joined ShipSpeak platform', 'Completed initial assessment']
  },
  {
    period: '2023-12',
    overallScore: 6.5,
    keyImprovements: ['Initial skill baseline established'],
    practiceHours: 3.2,
    milestonesAchieved: 0,
    significantEvents: ['Completed onboarding assessment']
  }
]

export const mockFrameworkMastery: FrameworkMastery[] = [
  {
    framework: 'RICE',
    masteryLevel: 'MASTERY',
    usageFrequency: 0.85,
    effectivenessScore: 8.7,
    recentApplications: [
      'Feature prioritization in Q1 planning session',
      'Resource allocation discussion with engineering',
      'Executive update on product roadmap decisions'
    ],
    nextLevelRequirements: [
      'Teach framework to other team members',
      'Apply in complex multi-product scenarios',
      'Integrate with other prioritization methods'
    ]
  },
  {
    framework: 'JOBS_TO_BE_DONE',
    masteryLevel: 'PRACTICE',
    usageFrequency: 0.65,
    effectivenessScore: 7.2,
    recentApplications: [
      'User research synthesis presentation',
      'Product strategy communication with stakeholders'
    ],
    nextLevelRequirements: [
      'Apply in board presentation contexts',
      'Use for competitive analysis communication',
      'Integrate with quantitative decision frameworks'
    ]
  },
  {
    framework: 'OKR',
    masteryLevel: 'PRACTICE',
    usageFrequency: 0.70,
    effectivenessScore: 7.5,
    recentApplications: [
      'Quarterly planning facilitation',
      'Team goal-setting communication'
    ],
    nextLevelRequirements: [
      'Master cascading OKR communication',
      'Improve cross-functional alignment',
      'Enhance measurement and tracking communication'
    ]
  }
]

export const mockMeetingTypeProgress: MeetingTypeProgress[] = [
  {
    meetingType: 'BOARD_PRESENTATION',
    effectivenessScore: 7.2,
    improvementRate: 0.25,
    keyStrengths: ['Clear executive summaries', 'Strong data presentation'],
    developmentAreas: ['Confidence building', 'Time management'],
    recentSessions: 3
  },
  {
    meetingType: 'STAKEHOLDER_UPDATE',
    effectivenessScore: 8.1,
    improvementRate: 0.15,
    keyStrengths: ['Excellent progress communication', 'Clear action items'],
    developmentAreas: ['Blocker escalation', 'Risk communication'],
    recentSessions: 8
  },
  {
    meetingType: 'PLANNING_SESSION',
    effectivenessScore: 7.8,
    improvementRate: 0.18,
    keyStrengths: ['Strong framework application', 'Good resource reasoning'],
    developmentAreas: ['Strategic altitude', 'Cross-functional coordination'],
    recentSessions: 5
  }
]

export const mockStreakData: StreakData = {
  currentStreak: 12,
  longestStreak: 18,
  streakType: 'PRACTICE_SESSIONS',
  lastActivityDate: new Date('2024-03-16'),
  milestoneStreaks: [7, 12, 18]
}

export const mockRecentAchievements: AchievementData[] = [
  {
    achievementId: 'achieve-001',
    title: 'Executive Communication Breakthrough',
    description: 'Achieved consistent answer-first methodology usage',
    earnedDate: new Date('2024-03-15'),
    rarity: 'RARE',
    careerImpact: 'Significant advancement toward Senior PM readiness',
    shareableDescription: 'Mastered executive communication structure'
  },
  {
    achievementId: 'achieve-002',
    title: 'Framework Master',
    description: 'Demonstrated mastery in RICE framework application',
    earnedDate: new Date('2024-03-08'),
    rarity: 'UNCOMMON',
    careerImpact: 'Enhanced strategic decision communication capability',
    shareableDescription: 'Achieved RICE framework mastery certification'
  },
  {
    achievementId: 'achieve-003',
    title: 'Consistency Champion',
    description: 'Maintained 12-day practice streak',
    earnedDate: new Date('2024-03-16'),
    rarity: 'COMMON',
    careerImpact: 'Demonstrated commitment to continuous improvement',
    shareableDescription: 'Achieved 12-day practice streak'
  }
]

export const mockSkillProgressData: SkillProgressData = {
  overallProgress: mockOverallProgress,
  skillDimensions: mockSkillDimensionsProgress,
  recentImprovements: [
    {
      area: 'Executive Communication',
      improvementType: 'SKILL_BREAKTHROUGH',
      date: new Date('2024-03-15'),
      description: 'Achieved consistent answer-first methodology usage',
      impact: 0.5,
      evidence: ['Improved practice session scores', 'Better structural organization', 'Enhanced confidence']
    },
    {
      area: 'Framework Application',
      improvementType: 'FRAMEWORK_MASTERY',
      date: new Date('2024-03-08'),
      description: 'Mastered RICE framework application',
      impact: 0.3,
      evidence: ['Complex trade-off scenarios', 'Teaching ability demonstration', 'Multi-factor integration']
    }
  ],
  milestoneAchievements: mockRecentMilestones,
  practiceSessionHistory: [
    {
      sessionId: 'session-001',
      date: new Date('2024-03-16'),
      duration: 45,
      type: 'SCENARIO_BASED',
      skillsImproved: ['EXECUTIVE_COMMUNICATION', 'STAKEHOLDER_MANAGEMENT'],
      scoreImprovement: 0.15,
      keyInsights: ['Better answer-first structure', 'Improved stakeholder adaptation']
    },
    {
      sessionId: 'session-002',
      date: new Date('2024-03-15'),
      duration: 30,
      type: 'FRAMEWORK_PRACTICE',
      skillsImproved: ['FRAMEWORK_APPLICATION'],
      scoreImprovement: 0.08,
      keyInsights: ['Advanced RICE application', 'Multi-criteria decision making']
    }
  ]
}