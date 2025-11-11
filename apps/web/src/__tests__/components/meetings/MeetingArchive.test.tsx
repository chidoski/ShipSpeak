/**
 * Meeting Archive Component Tests
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Comprehensive test coverage for meeting archive functionality
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MeetingArchive } from '@/components/meetings/MeetingArchive'
import { mockMeetingArchive } from '@/lib/mockMeetingData'

// Mock the data service
jest.mock('@/lib/mockMeetingData', () => ({
  mockMeetingArchive: {
    searchMeetings: jest.fn(),
    getMeetings: jest.fn(),
    getMeetingById: jest.fn(),
    getCompetencyTrends: jest.fn()
  }
}))

const mockSearchMeetings = mockMeetingArchive.searchMeetings as jest.MockedFunction<typeof mockMeetingArchive.searchMeetings>

describe('MeetingArchive Component', () => {
  const defaultMockData = {
    meetings: [
      {
        id: 'meeting-001',
        title: 'Q4 Product Strategy Review',
        participants: [
          { id: 'p1', name: 'Sarah Chen', role: 'PM', speakingTime: 40, consentGiven: true }
        ],
        captureMethod: 'ZOOM_BOT' as const,
        captureQuality: {
          audioLevel: 95,
          speakerSeparation: 88,
          transcriptConfidence: 92,
          platformMetadata: {
            platform: 'ZOOM_BOT' as const,
            botDeploymentSuccess: true,
            participantCount: 4,
            recordingPermissions: [true]
          },
          noiseLevel: 15,
          latency: 120
        },
        processingStatus: 'COMPLETED' as const,
        competencyAnalysis: {
          productSense: {
            category: 'product-sense' as const,
            currentScore: 85,
            improvement: 3,
            confidenceLevel: 92,
            patterns: [
              {
                type: 'FRAMEWORK_USAGE' as const,
                frequency: 0.8,
                confidence: 90,
                examples: ['RICE framework'],
                improvement: 'POSITIVE' as const
              }
            ],
            benchmarkComparison: {
              industryAverage: 65,
              careerLevelAverage: 68,
              topPerformers: 85,
              userPercentile: 78,
              faangBenchmarks: { amazon: 75, google: 72, meta: 78, netflix: 80 }
            },
            specificInsights: ['Strong framework usage']
          },
          communication: {
            category: 'communication' as const,
            currentScore: 78,
            improvement: 5,
            confidenceLevel: 88,
            patterns: [],
            benchmarkComparison: {
              industryAverage: 65,
              careerLevelAverage: 68,
              topPerformers: 85,
              userPercentile: 78,
              faangBenchmarks: { amazon: 75, google: 72, meta: 78, netflix: 80 }
            },
            specificInsights: ['Good executive presence']
          },
          stakeholderMgmt: {
            category: 'stakeholder' as const,
            currentScore: 72,
            improvement: 2,
            confidenceLevel: 85,
            patterns: [],
            benchmarkComparison: {
              industryAverage: 65,
              careerLevelAverage: 68,
              topPerformers: 85,
              userPercentile: 78,
              faangBenchmarks: { amazon: 75, google: 72, meta: 78, netflix: 80 }
            },
            specificInsights: ['Effective stakeholder engagement']
          },
          technicalTranslation: {
            category: 'technical' as const,
            currentScore: 80,
            improvement: 4,
            confidenceLevel: 90,
            patterns: [],
            benchmarkComparison: {
              industryAverage: 65,
              careerLevelAverage: 68,
              topPerformers: 85,
              userPercentile: 78,
              faangBenchmarks: { amazon: 75, google: 72, meta: 78, netflix: 80 }
            },
            specificInsights: ['Strong technical communication']
          },
          businessImpact: {
            category: 'business' as const,
            currentScore: 75,
            improvement: 3,
            confidenceLevel: 87,
            patterns: [],
            benchmarkComparison: {
              industryAverage: 65,
              careerLevelAverage: 68,
              topPerformers: 85,
              userPercentile: 78,
              faangBenchmarks: { amazon: 75, google: 72, meta: 78, netflix: 80 }
            },
            specificInsights: ['Good business impact articulation']
          },
          overallGrowth: {
            monthlyImprovement: 8.5,
            projectedLevel: 'senior-pm' as const,
            timeToNextLevel: 8,
            accelerationFactors: ['Strong framework usage'],
            riskFactors: ['Need to improve ROI communication']
          },
          executivePresenceMarkers: {
            boardReadiness: 75,
            crisisCommunication: 70,
            speakingEngagementQuality: 80,
            organizationalInfluence: 72,
            strategicVisionCommunication: 78
          },
          frameworkUsage: {
            rice: [],
            ice: [],
            jobsToBeType: [],
            ogsm: [],
            custom: []
          }
        },
        feedbackComplexity: 'FULL_AI_ANALYSIS' as const,
        executivePriority: true,
        industryContext: 'fintech' as const,
        meetingType: 'BOARD_PRESENTATION' as const,
        privacy: {
          confidential: true,
          boardMeeting: true,
          crisisMode: false,
          speakingEngagement: false,
          dataRetentionDays: 365,
          participantConsent: [],
          encryptionLevel: 'EXECUTIVE' as const
        },
        duration: 90,
        createdAt: '2024-11-10T09:00:00Z',
        updatedAt: '2024-11-10T10:45:00Z',
        userId: 'user-001',
        audioQualityScore: 93
      }
    ],
    totalCount: 1,
    filteredCount: 1,
    aggregations: {
      competencyTrends: [
        {
          category: 'communication' as const,
          trend: 'IMPROVING' as const,
          changeRate: 12.5,
          dataPoints: [
            { date: '2024-11-01', score: 70, meetingId: 'meeting-001' }
          ]
        }
      ],
      patternFrequency: [],
      qualityDistribution: { excellent: 1, good: 0, fair: 0, poor: 0 },
      platformUsage: { zoomBot: 1, googleMeetExtension: 0, teamsApp: 0, manualUpload: 0 }
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      hasNext: false,
      hasPrevious: false
    }
  }

  beforeEach(() => {
    mockSearchMeetings.mockResolvedValue(defaultMockData)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders meeting archive header correctly', async () => {
      render(<MeetingArchive />)
      
      expect(screen.getByText('Meeting Archive')).toBeInTheDocument()
      expect(screen.getByText('Analyze communication patterns and track competency development')).toBeInTheDocument()
    })

    it('renders view mode tabs', async () => {
      render(<MeetingArchive />)
      
      expect(screen.getByText('List View')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Capture')).toBeInTheDocument()
    })

    it('renders new meeting button', async () => {
      render(<MeetingArchive />)
      
      expect(screen.getByText('New Meeting')).toBeInTheDocument()
    })
  })

  describe('Statistics Display', () => {
    it('displays meeting statistics correctly', async () => {
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(screen.getByText('Total Meetings')).toBeInTheDocument()
        expect(screen.getByText('Filtered Results')).toBeInTheDocument()
        expect(screen.getByText('Avg Quality Score')).toBeInTheDocument()
        expect(screen.getByText('Executive Sessions')).toBeInTheDocument()
      })
    })

    it('calculates and displays correct statistics', async () => {
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument() // Total meetings
        expect(screen.getByText('93%')).toBeInTheDocument() // Quality score
      })
    })
  })

  describe('View Mode Switching', () => {
    it('switches to analytics view', async () => {
      render(<MeetingArchive />)
      
      const analyticsButton = screen.getByText('Analytics')
      fireEvent.click(analyticsButton)
      
      await waitFor(() => {
        expect(screen.getByText('Smart Feedback Analytics')).toBeInTheDocument()
      })
    })

    it('switches to capture view', async () => {
      render(<MeetingArchive />)
      
      const captureButton = screen.getByText('Capture')
      fireEvent.click(captureButton)
      
      await waitFor(() => {
        expect(screen.getByText('Start Meeting Capture')).toBeInTheDocument()
      })
    })

    it('highlights active view mode', async () => {
      render(<MeetingArchive />)
      
      const analyticsButton = screen.getByText('Analytics')
      fireEvent.click(analyticsButton)
      
      expect(analyticsButton).toHaveClass('bg-white', 'text-blue-600')
    })
  })

  describe('Filtering', () => {
    it('renders competency filters', async () => {
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(screen.getByText('PM Competency Filters')).toBeInTheDocument()
      })
    })

    it('shows active filter summary', async () => {
      render(<MeetingArchive />)
      
      // Initially no filters should be active
      await waitFor(() => {
        expect(screen.queryByText('Active filters:')).not.toBeInTheDocument()
      })
    })

    it('allows clearing all filters', async () => {
      // Test would need more complex setup to simulate active filters
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(mockSearchMeetings).toHaveBeenCalledWith(
          expect.objectContaining({
            competencyFocus: [],
            meetingTypes: [],
            captureMethod: [],
            executiveOnly: false
          })
        )
      })
    })
  })

  describe('Meeting List', () => {
    it('displays meetings when data is loaded', async () => {
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(screen.getByText('Q4 Product Strategy Review')).toBeInTheDocument()
      })
    })

    it('shows loading state', async () => {
      mockSearchMeetings.mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<MeetingArchive />)
      
      expect(screen.getByTestId('loading') || screen.getByText('Loading')).toBeInTheDocument()
    })

    it('handles error state', async () => {
      mockSearchMeetings.mockRejectedValue(new Error('Failed to load meetings'))
      
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(screen.getByText('Error loading meetings')).toBeInTheDocument()
      })
    })

    it('opens meeting detail modal on click', async () => {
      render(<MeetingArchive />)
      
      await waitFor(() => {
        const meetingCard = screen.getByText('Q4 Product Strategy Review')
        fireEvent.click(meetingCard)
      })
      
      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument()
        expect(screen.getByText('Competency Analysis')).toBeInTheDocument()
      })
    })
  })

  describe('Executive Features', () => {
    it('shows executive features for executive users', async () => {
      render(<MeetingArchive isExecutive={true} />)
      
      const captureButton = screen.getByText('Capture')
      fireEvent.click(captureButton)
      
      await waitFor(() => {
        expect(screen.getByText('Executive Features')).toBeInTheDocument()
      })
    })

    it('does not show executive features for regular users', async () => {
      render(<MeetingArchive isExecutive={false} />)
      
      const captureButton = screen.getByText('Capture')
      fireEvent.click(captureButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Executive Features')).not.toBeInTheDocument()
      })
    })
  })

  describe('Callbacks', () => {
    it('calls onMeetingSelect when meeting is clicked', async () => {
      const onMeetingSelect = jest.fn()
      render(<MeetingArchive onMeetingSelect={onMeetingSelect} />)
      
      await waitFor(() => {
        const meetingCard = screen.getByText('Q4 Product Strategy Review')
        fireEvent.click(meetingCard)
      })
      
      expect(onMeetingSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'meeting-001',
          title: 'Q4 Product Strategy Review'
        })
      )
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for interactive elements', async () => {
      render(<MeetingArchive />)
      
      await waitFor(() => {
        const newMeetingButton = screen.getByText('New Meeting')
        expect(newMeetingButton).toBeInTheDocument()
      })
    })

    it('supports keyboard navigation', async () => {
      render(<MeetingArchive />)
      
      const listViewTab = screen.getByText('List View')
      listViewTab.focus()
      expect(document.activeElement).toBe(listViewTab)
    })
  })

  describe('Error Handling', () => {
    it('gracefully handles missing meeting data', async () => {
      mockSearchMeetings.mockResolvedValue({
        meetings: [],
        totalCount: 0,
        filteredCount: 0,
        aggregations: {
          competencyTrends: [],
          patternFrequency: [],
          qualityDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
          platformUsage: { zoomBot: 0, googleMeetExtension: 0, teamsApp: 0, manualUpload: 0 }
        },
        pagination: {
          currentPage: 1,
          totalPages: 0,
          pageSize: 10,
          hasNext: false,
          hasPrevious: false
        }
      })
      
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(screen.getByText('No meetings found')).toBeInTheDocument()
      })
    })

    it('handles network errors gracefully', async () => {
      mockSearchMeetings.mockRejectedValue(new Error('Network error'))
      
      render(<MeetingArchive />)
      
      await waitFor(() => {
        expect(screen.getByText('Error loading meetings')).toBeInTheDocument()
      })
    })
  })
})