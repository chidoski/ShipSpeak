/**
 * Mock Data for ShipSpeak Dashboard
 * Realistic PM-focused data for development and testing
 * Max 300 lines for efficiency and maintainability
 */

import { User } from '@/types/auth'
import { PMProgressData, LearningData, QuickStatCard, EmptyState } from '@/types/dashboard'
import { CapturedMeeting, CompetencyAnalysis, MeetingArchiveFilters, MeetingSearchResults, 
         PatternType, CaptureMethod, MeetingType, ProcessingStatus } from '@/types/meeting'

// =============================================================================
// MOCK USERS DATA
// =============================================================================

const mockUsers = {
  pmToSenior: {
    id: '1',
    email: 'sarah.chen@techcorp.com',
    name: 'Sarah Chen',
    role: 'PM' as const,
    industry: 'fintech' as const,
    isExecutive: false,
    learningPath: 'meeting-analysis' as const,
    onboardingCompleted: true,
    createdAt: '2024-09-15T00:00:00Z',
    lastLoginAt: '2024-11-10T09:30:00Z',
    competencyBaseline: {
      'product-sense': {
        userProblemIdentification: 7.2,
        frameworkFamiliarity: 6.8,
        marketContextAwareness: 7.5,
        score: 7.2
      },
      communication: {
        executivePresentation: 6.2,
        answerFirstStructure: 5.9,
        stakeholderAdaptation: 6.5,
        score: 6.2
      },
      'stakeholder-management': {
        multiAudienceExperience: 7.0,
        conflictResolution: 6.3,
        crossFunctionalLeadership: 6.8,
        score: 6.7
      },
      'technical-translation': {
        complexitySimplification: 7.8,
        dataPresentationConfidence: 7.2,
        businessStakeholderCommunication: 6.9,
        score: 7.3
      },
      'business-impact': {
        roiCommunication: 5.8,
        organizationalCommunication: 6.1,
        visionSetting: 5.5,
        score: 5.8
      }
    }
  }
}

// =============================================================================
// MOCK PROGRESS DATA
// =============================================================================

const mockProgressData: PMProgressData = {
  currentLevel: 'PM',
  targetLevel: 'Senior PM',
  progressPercentage: 67,
  weekStreak: 12,
  skillGaps: [
    {
      area: 'communication',
      current: 6.2,
      target: 8.0,
      industry: 'fintech',
      frameworks: ['Answer-First Structure', 'Executive Presence', 'Board Communication'],
      priority: 'critical'
    },
    {
      area: 'business-impact',
      current: 5.8,
      target: 8.5,
      industry: 'fintech',
      frameworks: ['ROI Communication', 'P&L Impact', 'Financial Risk Assessment'],
      priority: 'critical'
    },
    {
      area: 'stakeholder-management',
      current: 6.7,
      target: 8.2,
      industry: 'fintech',
      frameworks: ['Cross-functional Leadership', 'Regulatory Stakeholders'],
      priority: 'important'
    }
  ],
  industryBenchmarks: {
    sector: 'fintech',
    regulatoryCompliance: 7.8,
    riskCommunication: 6.5,
    trustBuilding: 7.2,
    roiCommunication: 7.9
  }
}

// =============================================================================
// MOCK LEARNING DATA
// =============================================================================

const mockLearningData: LearningData = {
  weeklyStreak: 12,
  modulesCompleted: 8,
  practiceSessionsCompleted: 15,
  totalHoursPracticed: 24.5,
  lastActivityDate: '2024-11-09T18:30:00Z',
  foundationSkillsMastery: {
    pmVocabulary: 85,
    executivePresence: 72,
    frameworkApplication: 68,
    stakeholderManagement: 78,
    businessImpact: 65
  },
  nextMilestones: [
    'Complete Strategic Communication module',
    'Practice board presentation structure',
    'Master trade-off articulation framework',
    'Develop regulatory communication skills'
  ]
}

// =============================================================================
// QUICK STATS CARDS
// =============================================================================

const mockQuickStats: QuickStatCard[] = [
  {
    id: 'executive-readiness',
    title: 'Executive Readiness',
    value: '67%',
    trend: 'up',
    trendValue: 12,
    description: 'Progress toward Senior PM communication standards',
    icon: '🎯',
    color: 'blue'
  },
  {
    id: 'practice-streak',
    title: 'Practice Streak',
    value: 12,
    trend: 'up',
    trendValue: 3,
    description: 'Weeks of consistent skill development',
    icon: '🔥',
    color: 'orange'
  },
  {
    id: 'modules-completed',
    title: 'Modules Completed',
    value: 8,
    trend: 'up',
    trendValue: 2,
    description: 'Fintech PM communication modules mastered',
    icon: '📚',
    color: 'green'
  },
  {
    id: 'hours-practiced',
    title: 'Hours Practiced',
    value: '24.5h',
    trend: 'up',
    trendValue: 4.5,
    description: 'Total executive communication practice time',
    icon: '⏱️',
    color: 'purple'
  }
]

// =============================================================================
// EMPTY STATES
// =============================================================================

const mockEmptyStates = {
  noMeetings: {
    type: 'no_meetings' as const,
    headline: 'Start Building PM Executive Presence',
    subtext: 'Master foundation skills that make every interaction more impactful',
    ctas: [
      {
        id: 'begin-vocabulary',
        text: 'Begin Strategic Vocabulary Development',
        href: '/dashboard/practice/vocabulary',
        type: 'primary' as const,
        icon: '🎯'
      },
      {
        id: 'practice-basics',
        text: 'Practice Executive Communication Basics',
        href: '/dashboard/practice/executive-basics',
        type: 'secondary' as const,
        icon: '💼'
      },
      {
        id: 'fintech-templates',
        text: 'Explore Fintech PM Communication Templates',
        href: '/dashboard/practice/industry/fintech',
        type: 'tertiary' as const,
        icon: '🏦'
      }
    ]
  },

  newUser: {
    type: 'new_user' as const,
    headline: 'Your Path to Senior PM Communication Mastery',
    subtext: 'Based on your current PM role in fintech, here\'s your personalized roadmap',
    progressIndicators: [
      { label: 'Executive Presence', current: 6.2, target: 8.0, unit: '/10' },
      { label: 'Business Impact Communication', current: 5.8, target: 8.5, unit: '/10' },
      { label: 'Regulatory Stakeholder Management', current: 6.7, target: 8.2, unit: '/10' }
    ],
    ctas: [
      {
        id: 'start-roadmap',
        text: 'Start Your PM Development Journey',
        href: '/dashboard/practice/roadmap',
        type: 'primary' as const,
        icon: '🚀'
      }
    ]
  }
}

// =============================================================================
// FAANG BENCHMARKS
// =============================================================================

const mockFAANGBenchmarks = {
  amazon: {
    answerFirst: 7.8,
    leadershipPrinciples: 7.2,
    customerObsession: 8.1
  },
  google: {
    dataDrivern: 7.5,
    hypothesisFormation: 6.9,
    analyticalReasoning: 8.0
  },
  meta: {
    userCentric: 7.7,
    movefast: 7.3,
    boldness: 6.8
  },
  netflix: {
    context: 7.9,
    freedom: 7.4,
    responsibility: 7.6
  }
}

// =============================================================================
// MOCK DATA SERVICE
// =============================================================================

export const mockDashboardData = {
  getDashboardData: () => ({
    user: mockUsers.pmToSenior,
    progressData: mockProgressData,
    learningData: mockLearningData
  }),

  getQuickStats: () => mockQuickStats,

  getEmptyState: (type: 'no_meetings' | 'new_user' | 'practice_first' | 'meeting_analysis') => {
    switch (type) {
      case 'no_meetings':
        return mockEmptyStates.noMeetings
      case 'new_user':
        return mockEmptyStates.newUser
      default:
        return mockEmptyStates.noMeetings
    }
  },

  getFAANGBenchmarks: () => mockFAANGBenchmarks
}