// Mock data for ShipSpeak AI Coaching System
// Comprehensive coaching scenarios, personas, and conversations

import { 
  CoachPersona, 
  CoachingSession, 
  CoachingInteraction,
  DevelopmentArea,
  Milestone,
  MockCoachingData,
  PMTransitionType,
  Industry,
  UserProfile,
  ProgressMetrics
} from '@/types/coaching'

// AI Coach Personas with PM Career-Specific Expertise
export const mockCoachPersonas: CoachPersona[] = [
  {
    id: 'coach_sarah_chen',
    name: 'Sarah Chen',
    title: 'Executive Communication Coach',
    expertiseArea: 'Executive Communication',
    industry: 'fintech',
    background: 'Former VP Product at Stripe, 12 years PM experience, Stanford MBA',
    communicationStyle: 'DIRECT',
    pmLevel: 'DIRECTOR',
    coachingApproach: ['REAL_TIME_COACHING', 'FRAMEWORK_APPLICATION'],
    specialties: [
      'Board presentations',
      'C-suite stakeholder management', 
      'Financial services regulation',
      'Answer-first methodology',
      'Executive presence development'
    ],
    yearsExperience: 12
  },
  {
    id: 'coach_marcus_rodriguez',
    name: 'Marcus Rodriguez',
    title: 'Strategic Thinking Coach', 
    expertiseArea: 'Strategic Thinking',
    industry: 'enterprise_software',
    background: 'Former Group PM at Salesforce, McKinsey consulting background, Wharton MBA',
    communicationStyle: 'SOCRATIC',
    pmLevel: 'GROUP_PM',
    coachingApproach: ['SOCRATIC_QUESTIONING', 'FRAMEWORK_APPLICATION'],
    specialties: [
      'Portfolio strategy',
      'Business case development',
      'Cross-functional leadership',
      'RICE prioritization',
      'Strategic altitude control'
    ],
    yearsExperience: 15
  },
  {
    id: 'coach_jennifer_kim',
    name: 'Dr. Jennifer Kim',
    title: 'Industry-Specific Development Coach',
    expertiseArea: 'Industry-Specific Development',
    industry: 'healthcare',
    background: 'Former Director of Product at Epic Systems, MD background, Harvard Medical/Business',
    communicationStyle: 'SUPPORTIVE',
    pmLevel: 'DIRECTOR',
    coachingApproach: ['REAL_TIME_COACHING', 'SCENARIO_PRACTICE'],
    specialties: [
      'Regulatory compliance',
      'Clinical evidence integration',
      'Healthcare stakeholder management',
      'Patient outcome prioritization',
      'FDA communication'
    ],
    yearsExperience: 10
  },
  {
    id: 'coach_alex_thompson',
    name: 'Alex Thompson',
    title: 'Framework Mastery Coach',
    expertiseArea: 'Framework Application',
    industry: 'consumer_technology',
    background: 'Former Senior PM at Meta, Google Product experience, MIT background',
    communicationStyle: 'CHALLENGING',
    pmLevel: 'SENIOR_PM',
    coachingApproach: ['FRAMEWORK_APPLICATION', 'ROLE_PLAYING'],
    specialties: [
      'Growth framework mastery',
      'A/B testing communication',
      'User behavior analysis',
      'Platform thinking',
      'Rapid iteration frameworks'
    ],
    yearsExperience: 8
  },
  {
    id: 'coach_priya_patel',
    name: 'Priya Patel',
    title: 'Cybersecurity & Enterprise Security Coach',
    expertiseArea: 'Security Strategy',
    industry: 'cybersecurity',
    background: 'Former Group PM at CrowdStrike, CISSP certified, Stanford CS/MBA',
    communicationStyle: 'DIRECT',
    pmLevel: 'GROUP_PM',
    coachingApproach: ['REAL_TIME_COACHING', 'SCENARIO_PRACTICE'],
    specialties: [
      'Risk communication',
      'Threat assessment articulation',
      'Zero-trust architecture',
      'SOC2 compliance communication',
      'Technical translation for business'
    ],
    yearsExperience: 11
  }
]

// Mock Coaching Sessions
export const mockCoachingSessions: CoachingSession[] = [
  {
    id: 'session_1',
    sessionType: 'STRATEGIC_THINKING',
    duration: 30,
    focusAreas: [
      {
        id: 'strategic_1',
        name: 'Business Case Development',
        category: 'STRATEGIC',
        currentLevel: 2,
        targetLevel: 4,
        priority: 'HIGH'
      }
    ],
    userProgress: {
      skillProgression: {
        'strategic_thinking': 75,
        'framework_application': 60
      },
      sessionsCompleted: 8,
      totalDuration: 240,
      milestones: [],
      confidenceGrowth: [60, 65, 70, 75],
      weeklyProgress: []
    },
    aiCoachPersona: mockCoachPersonas[1],
    careerContext: 'PM_TO_SENIOR_PM',
    industryContext: 'enterprise_software',
    createdAt: new Date('2024-11-08T10:00:00Z'),
    completedAt: new Date('2024-11-08T10:30:00Z'),
    status: 'COMPLETED'
  },
  {
    id: 'session_2', 
    sessionType: 'EXECUTIVE_PRESENCE',
    duration: 45,
    focusAreas: [
      {
        id: 'presence_1',
        name: 'Board Presentation Skills',
        category: 'COMMUNICATION',
        currentLevel: 3,
        targetLevel: 5,
        priority: 'HIGH'
      }
    ],
    userProgress: {
      skillProgression: {
        'executive_presence': 82,
        'communication_authority': 78
      },
      sessionsCompleted: 12,
      totalDuration: 360,
      milestones: [],
      confidenceGrowth: [70, 75, 78, 82],
      weeklyProgress: []
    },
    aiCoachPersona: mockCoachPersonas[0],
    careerContext: 'SENIOR_PM_TO_GROUP_PM',
    industryContext: 'fintech',
    createdAt: new Date('2024-11-09T14:00:00Z'),
    status: 'ACTIVE'
  }
]

// Mock Coaching Conversations
export const mockCoachingConversations: CoachingInteraction[] = [
  {
    id: 'interaction_1',
    sessionId: 'session_1',
    timestamp: new Date('2024-11-08T10:05:00Z'),
    userInput: "I'm struggling to communicate the ROI of our new feature to executive stakeholders. They keep asking for more data but I feel like I'm losing them in the details.",
    coachResponse: {
      response: "That's a classic PM challenge - the data-story balance. Let me coach you through the answer-first approach. Before we dive into your data, what's the single most important business outcome this feature drives?",
      coachingMethod: 'SOCRATIC_QUESTIONING',
      developmentFocus: ['Executive Communication', 'Business Case Development'],
      nextQuestions: [
        "What's your one-sentence conclusion about this feature's value?",
        "How would you quantify the business impact?",
        "What evidence do you have to support this conclusion?"
      ],
      improvementSuggestions: [
        "Use the Amazon answer-first structure: Conclusion → Evidence → Implications",
        "Lead with impact, support with evidence, close with next steps",
        "Practice your 30-second elevator pitch version first"
      ],
      frameworkReference: 'ANSWER_FIRST_METHODOLOGY',
      confidenceLevel: 'MEDIUM',
      tone: 'ENCOURAGING'
    },
    developmentGoals: [
      {
        id: 'goal_1',
        title: 'Master Executive Communication',
        description: 'Develop answer-first structure for executive presentations',
        category: 'Communication',
        targetDate: new Date('2024-12-08T10:00:00Z'),
        priority: 'HIGH',
        progress: 40,
        milestones: ['Framework Learning', 'Practice Implementation', 'Stakeholder Feedback'],
        relatedSkills: ['Executive Presence', 'Business Communication', 'Data Storytelling']
      }
    ],
    realTimeCoaching: {
      communicationPattern: "Data-heavy explanation detected",
      improvementTip: "Start with conclusion, then provide supporting evidence",
      confidenceIndicator: 65,
      executivePresenceScore: 70,
      frameworkUsage: ['Business Case Development'],
      nextLevelSuggestion: "Practice the 30-second executive summary first"
    },
    progressTracking: {
      skillArea: 'Executive Communication',
      improvementScore: 75,
      nextFocus: 'Answer-First Structure'
    },
    type: 'COACH_RESPONSE'
  },
  {
    id: 'interaction_2',
    sessionId: 'session_1',
    timestamp: new Date('2024-11-08T10:10:00Z'),
    userInput: "The feature will increase customer retention by reducing churn in our enterprise segment. We expect to see a 15% reduction in churn over the next quarter based on similar features we've implemented.",
    coachResponse: {
      response: "Excellent! You led with the business outcome - that's senior PM-level thinking. Now let's polish the delivery. Instead of 'we expect,' try 'this will deliver.' What specific evidence supports your 15% confidence level?",
      coachingMethod: 'REAL_TIME_COACHING',
      developmentFocus: ['Communication Authority', 'Evidence-Based Reasoning'],
      nextQuestions: [
        "What similar features provide this evidence?", 
        "How did you calculate the 15% reduction?",
        "What's the revenue impact of this churn reduction?"
      ],
      improvementSuggestions: [
        "Use more definitive language: 'will deliver' vs 'expect to see'",
        "Quantify the revenue impact alongside the metric",
        "Reference specific comparable implementations"
      ],
      confidenceLevel: 'HIGH',
      tone: 'CELEBRATORY'
    },
    developmentGoals: [],
    realTimeCoaching: {
      communicationPattern: "Strong business outcome focus detected",
      improvementTip: "Strengthen language authority with definitive statements",
      confidenceIndicator: 80,
      executivePresenceScore: 85,
      frameworkUsage: ['Business Outcome Focus', 'Evidence-Based Reasoning'],
      nextLevelSuggestion: "Add revenue quantification to strengthen business case"
    },
    progressTracking: {
      skillArea: 'Executive Communication', 
      improvementScore: 85,
      achievement: 'Business Outcome Leading',
      nextFocus: 'Communication Authority'
    },
    type: 'COACH_RESPONSE'
  }
]

// Development Areas by Career Transition
export const developmentAreasByTransition: Record<PMTransitionType, DevelopmentArea[]> = {
  'PO_TO_PM': [
    {
      id: 'po_to_pm_strategic',
      name: 'Strategic Thinking Development',
      category: 'STRATEGIC',
      currentLevel: 2,
      targetLevel: 4,
      priority: 'HIGH'
    },
    {
      id: 'po_to_pm_business',
      name: 'Business Vocabulary Acquisition',
      category: 'COMMUNICATION',
      currentLevel: 1,
      targetLevel: 3,
      priority: 'HIGH'
    },
    {
      id: 'po_to_pm_stakeholder',
      name: 'Stakeholder Communication Expansion',
      category: 'LEADERSHIP',
      currentLevel: 2,
      targetLevel: 4,
      priority: 'MEDIUM'
    }
  ],
  'PM_TO_SENIOR_PM': [
    {
      id: 'pm_to_senior_communication',
      name: 'Executive Communication Mastery',
      category: 'COMMUNICATION',
      currentLevel: 3,
      targetLevel: 5,
      priority: 'HIGH'
    },
    {
      id: 'pm_to_senior_influence',
      name: 'Influence Without Authority',
      category: 'LEADERSHIP',
      currentLevel: 2,
      targetLevel: 4,
      priority: 'HIGH'
    },
    {
      id: 'pm_to_senior_altitude',
      name: 'Strategic Altitude Control',
      category: 'STRATEGIC',
      currentLevel: 3,
      targetLevel: 5,
      priority: 'MEDIUM'
    }
  ],
  'SENIOR_PM_TO_GROUP_PM': [
    {
      id: 'senior_to_group_portfolio',
      name: 'Portfolio Strategy Communication',
      category: 'STRATEGIC',
      currentLevel: 3,
      targetLevel: 5,
      priority: 'HIGH'
    },
    {
      id: 'senior_to_group_team',
      name: 'Team Development Coaching',
      category: 'LEADERSHIP',
      currentLevel: 2,
      targetLevel: 4,
      priority: 'HIGH'
    },
    {
      id: 'senior_to_group_organizational',
      name: 'Organizational Impact Integration',
      category: 'LEADERSHIP',
      currentLevel: 3,
      targetLevel: 5,
      priority: 'MEDIUM'
    }
  ],
  'GROUP_PM_TO_DIRECTOR': [
    {
      id: 'group_to_director_board',
      name: 'Board Presentation Excellence',
      category: 'COMMUNICATION',
      currentLevel: 3,
      targetLevel: 5,
      priority: 'HIGH'
    },
    {
      id: 'group_to_director_business',
      name: 'Business Model Fluency',
      category: 'STRATEGIC',
      currentLevel: 3,
      targetLevel: 5,
      priority: 'HIGH'
    },
    {
      id: 'group_to_director_market',
      name: 'Market Strategy Articulation',
      category: 'STRATEGIC',
      currentLevel: 3,
      targetLevel: 5,
      priority: 'MEDIUM'
    }
  ]
}

// Milestones by Industry and Career Level
export const mockMilestones: Milestone[] = [
  {
    id: 'milestone_1',
    name: 'Framework Mastery',
    description: 'Successfully applied PM frameworks in coaching scenarios',
    category: 'STRATEGIC',
    level: 'FOUNDATION',
    achievedAt: new Date('2024-11-01T00:00:00Z')
  },
  {
    id: 'milestone_2',
    name: 'Executive Communication',
    description: 'Demonstrated answer-first methodology in practice sessions',
    category: 'COMMUNICATION',
    level: 'PRACTICE'
  },
  {
    id: 'milestone_3',
    name: 'Industry Context Integration',
    description: 'Incorporated fintech-specific context in strategic discussions',
    category: 'INDUSTRY',
    level: 'PRACTICE'
  }
]

// Mock User Profiles for Testing
export const mockUserProfiles: UserProfile[] = [
  {
    id: 'user_alex_martinez',
    currentRole: 'PO',
    targetRole: 'PM',
    industry: 'fintech',
    yearsExperience: 3,
    competencyLevels: {
      'strategic_thinking': 60,
      'executive_communication': 45,
      'stakeholder_management': 70,
      'framework_application': 50,
      'industry_knowledge': 80
    },
    developmentPriorities: developmentAreasByTransition['PO_TO_PM'],
    coachingPreferences: {
      preferredCoachingStyle: 'SUPPORTIVE',
      sessionDuration: 30,
      focusAreas: ['Strategic Thinking', 'Business Communication'],
      challengeLevel: 'MODERATE',
      feedbackFrequency: 'MODERATE'
    }
  },
  {
    id: 'user_sarah_chen_test',
    currentRole: 'PM', 
    targetRole: 'SENIOR_PM',
    industry: 'enterprise_software',
    yearsExperience: 5,
    competencyLevels: {
      'strategic_thinking': 75,
      'executive_communication': 65,
      'stakeholder_management': 80,
      'framework_application': 70,
      'industry_knowledge': 85
    },
    developmentPriorities: developmentAreasByTransition['PM_TO_SENIOR_PM'],
    coachingPreferences: {
      preferredCoachingStyle: 'CHALLENGING',
      sessionDuration: 45,
      focusAreas: ['Executive Presence', 'Influence Skills'],
      challengeLevel: 'AGGRESSIVE',
      feedbackFrequency: 'FREQUENT'
    }
  }
]

// Complete mock data export
export const mockCoachingData: MockCoachingData = {
  coaches: mockCoachPersonas,
  sessions: mockCoachingSessions,
  conversations: mockCoachingConversations,
  developmentPlans: Object.values(developmentAreasByTransition).flat().map(area => ({
    id: `goal_${area.id}`,
    title: `Improve ${area.name}`,
    description: `Develop ${area.name} from level ${area.currentLevel} to ${area.targetLevel}`,
    category: area.category,
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    priority: area.priority,
    progress: Math.round((area.currentLevel / area.targetLevel) * 100),
    milestones: ['Foundation', 'Practice', 'Mastery'],
    relatedSkills: [area.name]
  })),
  progressHistory: [
    {
      skillProgression: {
        'strategic_thinking': 75,
        'executive_communication': 68,
        'framework_application': 82
      },
      sessionsCompleted: 15,
      totalDuration: 450,
      milestones: mockMilestones,
      confidenceGrowth: [60, 65, 68, 72, 75, 78, 82],
      weeklyProgress: [
        {
          week: '2024-W44',
          sessionsCount: 3,
          skillImprovement: 8,
          focusAreas: ['Strategic Thinking', 'Executive Communication'],
          achievements: ['Framework Mastery Milestone']
        },
        {
          week: '2024-W45',
          sessionsCount: 4,
          skillImprovement: 12,
          focusAreas: ['Executive Presence', 'Influence Skills'],
          achievements: ['Answer-First Methodology']
        }
      ]
    }
  ]
}

// Export individual components for easier imports
export {
  mockMilestones,
  mockUserProfiles,
  developmentAreasByTransition
}