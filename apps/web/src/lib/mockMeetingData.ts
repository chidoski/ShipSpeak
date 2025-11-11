/**
 * Mock Meeting Archive Data for ShipSpeak
 * Realistic PM meeting scenarios and competency analysis data
 * Slice 4: Meeting Archive & Intelligent Pattern Recognition
 */

import { 
  CapturedMeeting, 
  CompetencyAnalysis, 
  MeetingArchiveFilters, 
  MeetingSearchResults,
  DetectedPattern,
  ExecutivePresenceMarkers,
  FrameworkUsageDetection,
  CompetencyScore
} from '@/types/meeting'

// =============================================================================
// MOCK CAPTURED MEETINGS DATA
// =============================================================================

const mockCapturedMeetings: CapturedMeeting[] = [
  {
    id: 'meeting-001',
    title: 'Q4 Product Strategy Review with Board',
    participants: [
      {
        id: 'participant-001',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        role: 'Product Manager',
        speakingTime: 35,
        consentGiven: true
      },
      {
        id: 'participant-002',
        name: 'Michael Roberts',
        email: 'm.roberts@techcorp.com',
        role: 'CEO',
        speakingTime: 25,
        consentGiven: true
      },
      {
        id: 'participant-003',
        name: 'Jennifer Liu',
        email: 'j.liu@techcorp.com',
        role: 'Board Member',
        speakingTime: 20,
        consentGiven: true
      },
      {
        id: 'participant-004',
        name: 'David Kumar',
        email: 'd.kumar@techcorp.com',
        role: 'CFO',
        speakingTime: 20,
        consentGiven: true
      }
    ],
    captureMethod: 'ZOOM_BOT',
    captureQuality: {
      audioLevel: 95,
      speakerSeparation: 88,
      transcriptConfidence: 92,
      platformMetadata: {
        platform: 'ZOOM_BOT',
        meetingId: 'zoom-001-board-review',
        roomId: 'board-room-001',
        botDeploymentSuccess: true,
        participantCount: 4,
        recordingPermissions: [true, true, true, true],
        platformVersion: '5.13.0'
      },
      noiseLevel: 15,
      latency: 120
    },
    processingStatus: 'COMPLETED',
    competencyAnalysis: generateMockCompetencyAnalysis('BOARD_PRESENTATION'),
    feedbackComplexity: 'FULL_AI_ANALYSIS',
    executivePriority: true,
    industryContext: 'fintech',
    meetingType: 'BOARD_PRESENTATION',
    privacy: {
      confidential: true,
      boardMeeting: true,
      crisisMode: false,
      speakingEngagement: false,
      dataRetentionDays: 365,
      participantConsent: [
        {
          participantId: 'participant-001',
          consentGiven: true,
          timestamp: '2024-11-10T08:55:00Z',
          ipAddress: '192.168.1.100',
          consentMethod: 'PRE_MEETING'
        },
        {
          participantId: 'participant-002',
          consentGiven: true,
          timestamp: '2024-11-10T08:56:00Z',
          consentMethod: 'PRE_MEETING'
        }
      ],
      encryptionLevel: 'EXECUTIVE'
    },
    duration: 90,
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-10T10:45:00Z',
    userId: 'user-001',
    transcript: 'Executive summary transcript redacted for privacy...',
    audioQualityScore: 93
  },
  {
    id: 'meeting-002',
    title: 'Sprint Planning with Engineering Team',
    participants: [
      {
        id: 'participant-001',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        role: 'Product Manager',
        speakingTime: 40,
        consentGiven: true
      },
      {
        id: 'participant-005',
        name: 'Alex Thompson',
        email: 'a.thompson@techcorp.com',
        role: 'Tech Lead',
        speakingTime: 30,
        consentGiven: true
      },
      {
        id: 'participant-006',
        name: 'Maria Rodriguez',
        email: 'm.rodriguez@techcorp.com',
        role: 'Senior Engineer',
        speakingTime: 20,
        consentGiven: true
      },
      {
        id: 'participant-007',
        name: 'James Wilson',
        email: 'j.wilson@techcorp.com',
        role: 'UX Designer',
        speakingTime: 10,
        consentGiven: true
      }
    ],
    captureMethod: 'GOOGLE_MEET_EXTENSION',
    captureQuality: {
      audioLevel: 87,
      speakerSeparation: 82,
      transcriptConfidence: 85,
      platformMetadata: {
        platform: 'GOOGLE_MEET_EXTENSION',
        meetingId: 'meet-002-sprint-planning',
        botDeploymentSuccess: true,
        participantCount: 4,
        recordingPermissions: [true, true, true, true]
      },
      noiseLevel: 25,
      latency: 200
    },
    processingStatus: 'COMPLETED',
    competencyAnalysis: generateMockCompetencyAnalysis('TECHNICAL_TRANSLATION'),
    feedbackComplexity: 'AI_ENHANCED',
    executivePriority: false,
    industryContext: 'fintech',
    meetingType: 'TEAM_STANDUP',
    privacy: {
      confidential: false,
      boardMeeting: false,
      crisisMode: false,
      speakingEngagement: false,
      dataRetentionDays: 180,
      participantConsent: [],
      encryptionLevel: 'STANDARD'
    },
    duration: 60,
    createdAt: '2024-11-09T14:00:00Z',
    updatedAt: '2024-11-09T15:15:00Z',
    userId: 'user-001',
    audioQualityScore: 85
  },
  {
    id: 'meeting-003',
    title: 'Customer Advisory Board Session',
    participants: [
      {
        id: 'participant-001',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        role: 'Product Manager',
        speakingTime: 45,
        consentGiven: true
      },
      {
        id: 'participant-008',
        name: 'Robert Davis',
        email: 'r.davis@customer.com',
        role: 'Head of Operations',
        speakingTime: 30,
        consentGiven: true
      },
      {
        id: 'participant-009',
        name: 'Lisa Chang',
        email: 'l.chang@customer2.com',
        role: 'VP Technology',
        speakingTime: 25,
        consentGiven: true
      }
    ],
    captureMethod: 'TEAMS_APP',
    captureQuality: {
      audioLevel: 90,
      speakerSeparation: 85,
      transcriptConfidence: 88,
      platformMetadata: {
        platform: 'TEAMS_APP',
        meetingId: 'teams-003-customer-advisory',
        botDeploymentSuccess: true,
        participantCount: 3,
        recordingPermissions: [true, true, true]
      },
      noiseLevel: 20,
      latency: 150
    },
    processingStatus: 'COMPLETED',
    competencyAnalysis: generateMockCompetencyAnalysis('CUSTOMER_ADVOCACY'),
    feedbackComplexity: 'FULL_AI_ANALYSIS',
    executivePriority: false,
    industryContext: 'fintech',
    meetingType: 'CUSTOMER_MEETING',
    privacy: {
      confidential: false,
      boardMeeting: false,
      crisisMode: false,
      speakingEngagement: false,
      dataRetentionDays: 180,
      participantConsent: [],
      encryptionLevel: 'STANDARD'
    },
    duration: 75,
    createdAt: '2024-11-08T16:00:00Z',
    updatedAt: '2024-11-08T17:30:00Z',
    userId: 'user-001',
    audioQualityScore: 88
  }
]

// =============================================================================
// COMPETENCY ANALYSIS GENERATORS
// =============================================================================

function generateMockCompetencyAnalysis(focusArea: 'BOARD_PRESENTATION' | 'TECHNICAL_TRANSLATION' | 'CUSTOMER_ADVOCACY'): CompetencyAnalysis {
  const baseAnalysis = {
    productSense: generateCompetencyScore('product-sense', focusArea === 'CUSTOMER_ADVOCACY' ? 85 : 75),
    communication: generateCompetencyScore('communication', focusArea === 'BOARD_PRESENTATION' ? 88 : 72),
    stakeholderMgmt: generateCompetencyScore('stakeholder', focusArea === 'BOARD_PRESENTATION' ? 82 : 78),
    technicalTranslation: generateCompetencyScore('technical', focusArea === 'TECHNICAL_TRANSLATION' ? 90 : 70),
    businessImpact: generateCompetencyScore('business', focusArea === 'BOARD_PRESENTATION' ? 85 : 68),
    overallGrowth: {
      monthlyImprovement: 8.5,
      projectedLevel: 'senior-pm',
      timeToNextLevel: 8,
      accelerationFactors: ['Consistent board presentation practice', 'Strong technical translation skills'],
      riskFactors: ['ROI articulation needs improvement']
    },
    executivePresenceMarkers: generateExecutivePresenceMarkers(focusArea),
    frameworkUsage: generateFrameworkUsage(focusArea)
  }

  return baseAnalysis
}

function generateCompetencyScore(category: any, baseScore: number): CompetencyScore {
  return {
    category,
    currentScore: baseScore,
    previousScore: baseScore - 3,
    improvement: 3,
    confidenceLevel: 92,
    patterns: generatePatterns(category),
    benchmarkComparison: {
      industryAverage: 65,
      careerLevelAverage: 68,
      topPerformers: 85,
      userPercentile: 78,
      faangBenchmarks: {
        amazon: 75,
        google: 72,
        meta: 78,
        netflix: 80
      }
    },
    specificInsights: [
      `Strong ${category} demonstration with room for executive-level refinement`,
      `Above-average performance compared to fintech PM peers`
    ]
  }
}

function generatePatterns(category: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [
    {
      type: 'ANSWER_FIRST_STRUCTURE',
      frequency: 0.85,
      confidence: 88,
      examples: ['Started recommendation with clear outcome', 'Led with business impact'],
      improvement: 'POSITIVE'
    }
  ]

  if (category === 'communication') {
    patterns.push({
      type: 'STRATEGIC_LANGUAGE',
      frequency: 0.72,
      confidence: 85,
      examples: ['Used strategic vocabulary', 'Aligned with business objectives'],
      improvement: 'POSITIVE'
    })
  }

  return patterns
}

function generateExecutivePresenceMarkers(focusArea: string): ExecutivePresenceMarkers {
  return {
    boardReadiness: focusArea === 'BOARD_PRESENTATION' ? 85 : 68,
    crisisCommunication: 70,
    speakingEngagementQuality: 75,
    organizationalInfluence: 72,
    strategicVisionCommunication: 78
  }
}

function generateFrameworkUsage(focusArea: string): FrameworkUsageDetection {
  return {
    rice: [
      {
        framework: 'RICE',
        usage: 'APPLIED',
        contextAppropriate: true,
        executionQuality: 85,
        timestamp: '2024-11-10T09:15:00Z'
      }
    ],
    ice: [],
    jobsToBeType: focusArea === 'CUSTOMER_ADVOCACY' ? [
      {
        framework: 'Jobs-to-be-Done',
        usage: 'MENTIONED',
        contextAppropriate: true,
        executionQuality: 75,
        timestamp: '2024-11-08T16:30:00Z'
      }
    ] : [],
    ogsm: [],
    custom: []
  }
}

// =============================================================================
// MOCK MEETING ARCHIVE SERVICE
// =============================================================================

export const mockMeetingArchive = {
  getMeetings: (): CapturedMeeting[] => mockCapturedMeetings,

  searchMeetings: (filters?: MeetingArchiveFilters): MeetingSearchResults => {
    let filteredMeetings = mockCapturedMeetings

    // Apply basic filtering logic
    if (filters?.meetingTypes && filters.meetingTypes.length > 0) {
      filteredMeetings = filteredMeetings.filter(m => 
        filters.meetingTypes.includes(m.meetingType)
      )
    }

    if (filters?.executiveOnly) {
      filteredMeetings = filteredMeetings.filter(m => m.executivePriority)
    }

    return {
      meetings: filteredMeetings,
      totalCount: mockCapturedMeetings.length,
      filteredCount: filteredMeetings.length,
      aggregations: {
        competencyTrends: [
          {
            category: 'communication',
            trend: 'IMPROVING',
            changeRate: 12.5,
            dataPoints: [
              { date: '2024-11-01', score: 70, meetingId: 'meeting-001' },
              { date: '2024-11-10', score: 78, meetingId: 'meeting-002' }
            ]
          }
        ],
        patternFrequency: [
          {
            pattern: 'ANSWER_FIRST_STRUCTURE',
            frequency: 8,
            lastSeen: '2024-11-10T09:00:00Z',
            improvement: 'INCREASING'
          },
          {
            pattern: 'FRAMEWORK_USAGE',
            frequency: 6,
            lastSeen: '2024-11-09T14:00:00Z',
            improvement: 'STABLE'
          }
        ],
        qualityDistribution: {
          excellent: 2, // 90-100
          good: 1,     // 70-89
          fair: 0,     // 50-69
          poor: 0      // 0-49
        },
        platformUsage: {
          zoomBot: 1,
          googleMeetExtension: 1,
          teamsApp: 1,
          manualUpload: 0
        }
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        hasNext: false,
        hasPrevious: false
      }
    }
  },

  getMeetingById: (id: string): CapturedMeeting | undefined => {
    return mockCapturedMeetings.find(m => m.id === id)
  },

  getCompetencyTrends: () => [
    {
      category: 'communication' as const,
      trend: 'IMPROVING' as const,
      changeRate: 12.5,
      dataPoints: [
        { date: '2024-10-15', score: 65, meetingId: 'meeting-historical-1' },
        { date: '2024-11-01', score: 70, meetingId: 'meeting-historical-2' },
        { date: '2024-11-10', score: 78, meetingId: 'meeting-001' }
      ]
    },
    {
      category: 'business-impact' as const,
      trend: 'IMPROVING' as const,
      changeRate: 15.2,
      dataPoints: [
        { date: '2024-10-15', score: 58, meetingId: 'meeting-historical-1' },
        { date: '2024-11-01', score: 62, meetingId: 'meeting-historical-2' },
        { date: '2024-11-10', score: 68, meetingId: 'meeting-001' }
      ]
    }
  ]
}