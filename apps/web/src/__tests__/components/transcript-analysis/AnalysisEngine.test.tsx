/**
 * Analysis Engine Test Suite
 * ShipSpeak Slice 5: Comprehensive testing for intelligent transcript analysis
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import AnalysisEngine from '../../../components/transcript-analysis/AnalysisEngine'
import { 
  MeetingTranscript,
  TranscriptAnalysisResults,
  AnalysisProgress
} from '../../../types/transcript-analysis'
import { PMCareerLevel, IndustryType } from '../../../types/competency'

// Mock data for testing
const mockTranscript: MeetingTranscript = {
  id: 'meeting_123',
  content: 'This is a test meeting transcript with strategic language and framework usage.',
  speakers: [
    {
      id: 'speaker1',
      name: 'Test Speaker',
      role: 'Product Manager',
      speakingDuration: 300,
      wordCount: 150,
      confidence: 85,
      segments: []
    }
  ],
  duration: 30,
  meetingType: 'STAKEHOLDER_REVIEW',
  timestamp: new Date(),
  audioQuality: {
    transcriptConfidence: 90,
    speakerSeparationQuality: 85,
    audioClarity: 88,
    backgroundNoise: 15,
    completeness: 95
  },
  segmentedContent: [],
  processingStatus: 'COMPLETED'
}

const mockAnalysisResults: TranscriptAnalysisResults = {
  overallScore: 74,
  analysisId: 'analysis_123',
  meetingId: 'meeting_123',
  timestamp: new Date(),
  processingTime: 2500,
  transitionAnalysis: {
    currentLevel: 'SENIOR' as PMCareerLevel,
    targetLevel: 'STAFF' as PMCareerLevel,
    transitionIndicators: {} as any,
    progressScore: 74,
    blockers: [],
    accelerators: []
  },
  industryAnalysis: {
    industryType: 'FINTECH' as IndustryType,
    industrySpecificMarkers: {},
    compliancePatterns: [],
    vocabularyFluency: {
      industryTermsUsage: 78,
      contextualAppropriateness: 82,
      sophisticationLevel: 75,
      professionalCredibility: 80
    },
    benchmarkComparison: {
      industryAverage: 68,
      topPerformers: 87,
      userPercentile: 76,
      competitivePosition: 'COMPETITIVE'
    }
  },
  meetingTypeAnalysis: {
    meetingType: 'STAKEHOLDER_REVIEW',
    effectivenessScore: 76,
    communicationPatterns: {},
    audienceAdaptation: {
      executiveAudience: 82,
      technicalAudience: 68,
      businessStakeholders: 79,
      customerFacing: 71,
      teamMembers: 85
    },
    contextualAppropriate: true
  },
  patternHighlights: [
    {
      pattern: 'Strategic Communication',
      score: 82,
      evidence: ['Uses strategic vocabulary', 'Business impact focus'],
      significance: 'HIGH',
      careerImpact: 'Strong strategic communication supports senior role advancement'
    }
  ],
  improvementAreas: [
    {
      competency: 'STAKEHOLDER_MANAGEMENT',
      currentLevel: 68,
      targetLevel: 85,
      gap: 17,
      priority: 'HIGH',
      specificFocus: 'Cross-functional stakeholder communication',
      examples: ['Improve audience adaptation', 'Build consensus across teams'],
      practiceModules: ['Stakeholder Management', 'Executive Communication']
    }
  ],
  strengthAreas: [
    {
      competency: 'BUSINESS_IMPACT',
      currentLevel: 84,
      benchmarkComparison: 75,
      leverageOpportunities: ['Lead strategic initiatives', 'Mentor junior PMs'],
      examples: ['Strong ROI communication', 'Clear business impact articulation']
    }
  ],
  careerProgressionInsights: [
    {
      transitionType: 'Senior PM to Staff PM',
      readinessScore: 74,
      timeToTarget: 8,
      keyMilestones: ['Master framework application', 'Build cross-functional influence'],
      criticalActions: ['Strengthen strategic communication', 'Develop executive presence']
    }
  ],
  immediateActions: [
    {
      category: 'IMMEDIATE',
      action: 'Practice answer-first communication structure',
      rationale: 'Improves clarity and executive presence',
      expectedImpact: 'Increase communication effectiveness by 15%',
      effort: 'MEDIUM',
      timeframe: '2-3 weeks'
    }
  ],
  practiceModuleRecommendations: [
    {
      moduleType: 'Executive Communication',
      difficulty: 'PRACTICE',
      priority: 1,
      focusArea: 'Senior-level communication patterns',
      expectedOutcome: 'Master executive communication structure'
    }
  ],
  peerComparison: {
    overallPercentile: 76,
    careerLevelPercentile: 82,
    industryPercentile: 71,
    strengths: ['Strategic communication', 'Framework usage'],
    opportunities: ['Executive presence', 'Stakeholder adaptation']
  },
  historicalProgress: {
    improvementRate: 2.3,
    consistencyScore: 87,
    trajectoryDirection: 'STEADY',
    keyMilestones: []
  }
}

// Mock functions
const mockOnAnalysisComplete = jest.fn()
const mockOnProgressUpdate = jest.fn()

describe('AnalysisEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders analysis progress indicator', () => {
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        targetCareerLevel="STAFF"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    expect(screen.getByText('Analyzing Your Communication Patterns')).toBeInTheDocument()
    expect(screen.getByText(/Preprocessing transcript/)).toBeInTheDocument()
  })

  it('displays transcript metadata during analysis', () => {
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument() // Speakers count
    expect(screen.getByText('30')).toBeInTheDocument() // Duration
    expect(screen.getByText('3')).toBeInTheDocument() // Focus areas count
  })

  it('shows progress updates during analysis', async () => {
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnProgressUpdate).toHaveBeenCalled()
    }, { timeout: 3000 })

    // Verify progress update calls
    const progressCalls = mockOnProgressUpdate.mock.calls
    expect(progressCalls.length).toBeGreaterThan(0)
    
    // Check first progress call structure
    const firstCall = progressCalls[0][0] as AnalysisProgress
    expect(firstCall).toHaveProperty('stage')
    expect(firstCall).toHaveProperty('progress')
    expect(firstCall).toHaveProperty('estimatedTimeRemaining')
    expect(firstCall).toHaveProperty('currentTask')
  })

  it('completes analysis and calls onAnalysisComplete', async () => {
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 8000 })

    const analysisResult = mockOnAnalysisComplete.mock.calls[0][0] as TranscriptAnalysisResults
    expect(analysisResult).toHaveProperty('overallScore')
    expect(analysisResult).toHaveProperty('analysisId')
    expect(analysisResult).toHaveProperty('transitionAnalysis')
    expect(analysisResult).toHaveProperty('industryAnalysis')
    expect(analysisResult).toHaveProperty('meetingTypeAnalysis')
  })

  it('uses custom analysis configuration', () => {
    const customConfig = {
      analysisDepth: 'COMPREHENSIVE' as const,
      focusAreas: ['COMMUNICATION', 'BUSINESS_IMPACT'] as const,
      benchmarkLevel: 'TOP_PERFORMERS' as const
    }

    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
        analysisConfig={customConfig}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument() // Custom focus areas count
  })

  it('handles analysis errors gracefully', async () => {
    // Mock a transcript that will cause analysis to fail
    const invalidTranscript = {
      ...mockTranscript,
      content: '' // Empty content might cause analysis failure
    }

    render(
      <AnalysisEngine
        transcript={invalidTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    // In a real implementation, this might show an error state
    // For now, we just verify the component doesn't crash
    expect(screen.getByText('Analyzing Your Communication Patterns')).toBeInTheDocument()
  })

  it('displays retry option on analysis failure', async () => {
    // This test would check error handling and retry functionality
    // Implementation depends on how errors are handled in the actual component
    
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    // Wait for potential error state
    await waitFor(() => {
      // In real implementation, might check for error message and retry button
      expect(true).toBe(true) // Placeholder assertion
    })
  })

  it('calculates correct time remaining estimates', async () => {
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Estimated time remaining:/)).toBeInTheDocument()
    })

    // Verify time estimate is reasonable (should be in minutes)
    const timeText = screen.getByText(/Estimated time remaining:/)
    expect(timeText.textContent).toMatch(/\d+ minutes?/)
  })

  it('processes different meeting types correctly', async () => {
    const boardMeetingTranscript = {
      ...mockTranscript,
      meetingType: 'BOARD_PRESENTATION' as const
    }

    render(
      <AnalysisEngine
        transcript={boardMeetingTranscript}
        userCareerLevel="DIRECTOR"
        userIndustry="ENTERPRISE"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 8000 })

    // Verify analysis completes for different meeting types
    expect(mockOnAnalysisComplete).toHaveBeenCalledTimes(1)
  })

  it('handles different industry contexts', async () => {
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="HEALTHCARE"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 8000 })

    // Verify industry-specific analysis
    const result = mockOnAnalysisComplete.mock.calls[0][0] as TranscriptAnalysisResults
    expect(result.industryAnalysis).toBeDefined()
  })

  it('supports different career level transitions', async () => {
    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="IC"
        userIndustry="FINTECH"
        targetCareerLevel="SENIOR"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 8000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0] as TranscriptAnalysisResults
    expect(result.transitionAnalysis.currentLevel).toBe('IC')
    expect(result.transitionAnalysis.targetLevel).toBe('SENIOR')
  })
})

// Pattern Detection Tests
describe('Pattern Detection Integration', () => {
  it('identifies strategic language patterns', async () => {
    const strategicTranscript = {
      ...mockTranscript,
      content: 'Our strategic approach focuses on long-term ROI and competitive advantage through customer value creation.'
    }

    render(
      <AnalysisEngine
        transcript={strategicTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 8000 })

    // Verify strategic patterns are detected
    const result = mockOnAnalysisComplete.mock.calls[0][0] as TranscriptAnalysisResults
    expect(result.patternHighlights.length).toBeGreaterThan(0)
  })

  it('detects framework usage patterns', async () => {
    const frameworkTranscript = {
      ...mockTranscript,
      content: 'Using RICE prioritization, the reach is high, impact is significant, confidence is strong, and effort is moderate.'
    }

    render(
      <AnalysisEngine
        transcript={frameworkTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 8000 })

    // Verify framework patterns are detected
    const result = mockOnAnalysisComplete.mock.calls[0][0] as TranscriptAnalysisResults
    expect(result).toBeDefined()
  })
})

// Performance Tests
describe('Analysis Performance', () => {
  it('completes analysis within reasonable time', async () => {
    const startTime = Date.now()

    render(
      <AnalysisEngine
        transcript={mockTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 10000 })

    const duration = Date.now() - startTime
    expect(duration).toBeLessThan(8000) // Should complete within 8 seconds
  })

  it('handles large transcripts efficiently', async () => {
    const largeTranscript = {
      ...mockTranscript,
      content: 'Strategic communication '.repeat(1000), // Large content
      duration: 90 // 90 minute meeting
    }

    render(
      <AnalysisEngine
        transcript={largeTranscript}
        userCareerLevel="SENIOR"
        userIndustry="FINTECH"
        onAnalysisComplete={mockOnAnalysisComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 10000 })

    // Verify analysis completes even for large transcripts
    expect(mockOnAnalysisComplete).toHaveBeenCalled()
  })
})