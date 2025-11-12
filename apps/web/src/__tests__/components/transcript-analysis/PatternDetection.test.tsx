/**
 * Pattern Detection Test Suite
 * ShipSpeak Slice 5: Comprehensive testing for PM-specific pattern detection
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import PMTransitionDetector from '../../../components/transcript-analysis/PatternDetection/PMTransitionDetector'
import IndustryContextAnalyzer from '../../../components/transcript-analysis/PatternDetection/IndustryContextAnalyzer'
import MeetingTypeAnalyzer from '../../../components/transcript-analysis/PatternDetection/MeetingTypeAnalyzer'
import ExecutivePresenceScorer from '../../../components/transcript-analysis/PatternDetection/ExecutivePresenceScorer'
import { PMCareerLevel, IndustryType } from '../../../types/competency'
import { MeetingType } from '../../../types/meeting'

// Mock data for testing
const mockSpeakerSegments = [
  {
    id: 'segment1',
    speaker: 'Test Speaker',
    content: 'I recommend we focus on strategic outcomes and customer value using the RICE framework.',
    startTime: 0,
    endTime: 10
  },
  {
    id: 'segment2', 
    speaker: 'Test Speaker',
    content: 'From a business impact perspective, this approach will drive significant ROI.',
    startTime: 11,
    endTime: 20
  }
]

const mockTranscriptContent = `
I recommend we focus on strategic outcomes and customer value using the RICE framework.
From a business impact perspective, this approach will drive significant ROI.
Based on my experience with similar initiatives, I'm confident this is the right path forward.
Let me break this down: first, the market opportunity is substantial, second, our competitive advantage is clear, and third, the implementation is feasible.
`

// Mock callback functions
const mockOnDetectionComplete = jest.fn()
const mockOnAnalysisComplete = jest.fn() 
const mockOnScoringComplete = jest.fn()

describe('PMTransitionDetector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders transition analysis progress', () => {
    render(
      <PMTransitionDetector
        currentLevel="IC"
        targetLevel="SENIOR"
        transcriptContent={mockTranscriptContent}
        speakerSegments={mockSpeakerSegments}
        onDetectionComplete={mockOnDetectionComplete}
      />
    )

    expect(screen.getByText('PM Transition Analysis')).toBeInTheDocument()
    expect(screen.getByText(/Analyzing IC → SENIOR transition patterns/)).toBeInTheDocument()
  })

  it('detects PO to PM transition patterns', async () => {
    render(
      <PMTransitionDetector
        currentLevel="IC"
        targetLevel="SENIOR"
        transcriptContent={mockTranscriptContent}
        speakerSegments={mockSpeakerSegments}
        onDetectionComplete={mockOnDetectionComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnDetectionComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnDetectionComplete.mock.calls[0][0]
    expect(result).toHaveProperty('transitionIndicators')
    expect(result).toHaveProperty('progressScore')
    expect(result.currentLevel).toBe('IC')
    expect(result.targetLevel).toBe('SENIOR')
  })

  it('identifies strategic language emergence', async () => {
    const strategicContent = `
    Our strategic approach focuses on long-term vision and competitive advantage.
    The business impact of this initiative will drive significant revenue growth.
    From a strategic perspective, this aligns with our roadmap and market positioning.
    `

    render(
      <PMTransitionDetector
        currentLevel="IC"
        targetLevel="SENIOR"
        transcriptContent={strategicContent}
        speakerSegments={mockSpeakerSegments}
        onDetectionComplete={mockOnDetectionComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnDetectionComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnDetectionComplete.mock.calls[0][0]
    // Verify strategic language patterns are detected
    expect(result.transitionIndicators).toBeDefined()
  })

  it('detects framework application patterns', async () => {
    const frameworkContent = `
    Using the RICE prioritization framework, the reach is substantial.
    Our ICE score indicates high impact and confidence with moderate effort.
    The Jobs-to-be-Done analysis shows clear customer value.
    OKRs are well-aligned with this strategic direction.
    `

    render(
      <PMTransitionDetector
        currentLevel="SENIOR"
        targetLevel="STAFF"
        transcriptContent={frameworkContent}
        speakerSegments={mockSpeakerSegments}
        onDetectionComplete={mockOnDetectionComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnDetectionComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnDetectionComplete.mock.calls[0][0]
    expect(result.progressScore).toBeGreaterThan(0)
  })

  it('handles different career level transitions', async () => {
    const transitions: Array<{ current: PMCareerLevel; target: PMCareerLevel }> = [
      { current: 'IC', target: 'SENIOR' },
      { current: 'SENIOR', target: 'STAFF' },
      { current: 'STAFF', target: 'PRINCIPAL' },
      { current: 'PRINCIPAL', target: 'DIRECTOR' }
    ]

    for (const transition of transitions) {
      jest.clearAllMocks()
      
      render(
        <PMTransitionDetector
          currentLevel={transition.current}
          targetLevel={transition.target}
          transcriptContent={mockTranscriptContent}
          speakerSegments={mockSpeakerSegments}
          onDetectionComplete={mockOnDetectionComplete}
        />
      )

      await waitFor(() => {
        expect(mockOnDetectionComplete).toHaveBeenCalled()
      }, { timeout: 3000 })

      const result = mockOnDetectionComplete.mock.calls[0][0]
      expect(result.currentLevel).toBe(transition.current)
      expect(result.targetLevel).toBe(transition.target)
    }
  })
})

describe('IndustryContextAnalyzer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders industry analysis progress', () => {
    render(
      <IndustryContextAnalyzer
        industry="FINTECH"
        transcriptContent={mockTranscriptContent}
        userCareerLevel="SENIOR"
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    expect(screen.getByText('Fintech Pattern Analysis')).toBeInTheDocument()
  })

  it('analyzes fintech industry patterns', async () => {
    const fintechContent = `
    Our regulatory compliance strategy addresses SEC requirements and banking regulations.
    Risk management protocols ensure KYC and AML compliance across all transactions.
    Financial controls and audit readiness are critical for regulatory approval.
    Trust and security are fundamental to building consumer confidence.
    `

    render(
      <IndustryContextAnalyzer
        industry="FINTECH"
        transcriptContent={fintechContent}
        userCareerLevel="SENIOR"
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    expect(result.industryType).toBe('FINTECH')
    expect(result.vocabularyFluency).toBeDefined()
    expect(result.benchmarkComparison).toBeDefined()
  })

  it('analyzes healthcare industry patterns', async () => {
    const healthcareContent = `
    Our FDA compliance strategy ensures patient safety and clinical efficacy.
    HIPAA requirements guide our data handling and privacy protocols.
    Evidence-based research supports clinical trial outcomes.
    Patient outcomes and safety metrics drive regulatory approval.
    `

    render(
      <IndustryContextAnalyzer
        industry="HEALTHCARE"
        transcriptContent={healthcareContent}
        userCareerLevel="SENIOR"
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    expect(result.industryType).toBe('HEALTHCARE')
    expect(result.vocabularyFluency.industryTermsUsage).toBeGreaterThan(0)
  })

  it('analyzes cybersecurity industry patterns', async () => {
    const cybersecurityContent = `
    Our zero trust architecture implements least privilege access controls.
    SOC 2 compliance ensures security posture meets enterprise requirements.
    Threat assessment and vulnerability management are prioritized.
    Risk communication addresses attack vectors and security controls.
    `

    render(
      <IndustryContextAnalyzer
        industry="CYBERSECURITY"
        transcriptContent={cybersecurityContent}
        userCareerLevel="SENIOR"
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    expect(result.industryType).toBe('CYBERSECURITY')
    expect(result.compliancePatterns).toBeDefined()
  })

  it('calculates vocabulary fluency scores', async () => {
    const industrySpecificContent = `
    Enterprise ROI and business value drive customer success initiatives.
    Implementation planning includes change management and deployment strategies.
    Customer advocacy programs generate references and case studies.
    Enterprise sales support facilitates complex stakeholder management.
    `

    render(
      <IndustryContextAnalyzer
        industry="ENTERPRISE"
        transcriptContent={industrySpecificContent}
        userCareerLevel="SENIOR"
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    expect(result.vocabularyFluency.industryTermsUsage).toBeGreaterThanOrEqual(0)
    expect(result.vocabularyFluency.contextualAppropriateness).toBeGreaterThanOrEqual(0)
    expect(result.vocabularyFluency.sophisticationLevel).toBeGreaterThanOrEqual(0)
    expect(result.vocabularyFluency.professionalCredibility).toBeGreaterThanOrEqual(0)
  })
})

describe('MeetingTypeAnalyzer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('analyzes board presentation patterns', async () => {
    const boardContent = `
    In summary, our strategic initiative delivers significant ROI.
    Key takeaways include market expansion and competitive advantages.
    Revenue growth metrics demonstrate strong business performance.
    I recommend we proceed with full market rollout.
    `

    render(
      <MeetingTypeAnalyzer
        meetingType="BOARD_PRESENTATION"
        transcriptContent={boardContent}
        speakers={mockSpeakerSegments}
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    expect(result.meetingType).toBe('BOARD_PRESENTATION')
    expect(result.effectivenessScore).toBeGreaterThan(0)
  })

  it('analyzes stakeholder update patterns', async () => {
    const stakeholderContent = `
    Progress update: We've completed milestone 3 ahead of schedule.
    Current blockers include dependency on external API integration.
    Success metrics show 95% completion rate for core features.
    Next steps include stakeholder review and final testing phase.
    `

    render(
      <MeetingTypeAnalyzer
        meetingType="STAKEHOLDER_REVIEW"
        transcriptContent={stakeholderContent}
        speakers={mockSpeakerSegments}
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    expect(result.meetingType).toBe('STAKEHOLDER_REVIEW')
    expect(result.audienceAdaptation).toBeDefined()
  })

  it('analyzes one-on-one patterns', async () => {
    const oneOnOneContent = `
    How are you feeling about your current projects and workload?
    Your career development goals align well with our team objectives.
    I'd like to provide feedback on your recent presentation performance.
    What support do you need to achieve your quarterly targets?
    `

    render(
      <MeetingTypeAnalyzer
        meetingType="ONE_ON_ONE"
        transcriptContent={oneOnOneContent}
        speakers={mockSpeakerSegments}
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    expect(result.meetingType).toBe('ONE_ON_ONE')
    expect(result.contextualAppropriate).toBeDefined()
  })

  it('calculates audience adaptation scores', async () => {
    const adaptiveContent = `
    From an executive perspective, this strategic initiative drives market positioning.
    For our technical team, the architecture supports scalable implementation.
    Our customers will benefit from improved user experience and reliability.
    The business stakeholders see clear ROI and competitive advantage.
    `

    render(
      <MeetingTypeAnalyzer
        meetingType="STAKEHOLDER_REVIEW"
        transcriptContent={adaptiveContent}
        speakers={mockSpeakerSegments}
        onAnalysisComplete={mockOnAnalysisComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnAnalysisComplete.mock.calls[0][0]
    const adaptation = result.audienceAdaptation
    expect(adaptation.executiveAudience).toBeGreaterThanOrEqual(0)
    expect(adaptation.technicalAudience).toBeGreaterThanOrEqual(0)
    expect(adaptation.businessStakeholders).toBeGreaterThanOrEqual(0)
    expect(adaptation.customerFacing).toBeGreaterThanOrEqual(0)
    expect(adaptation.teamMembers).toBeGreaterThanOrEqual(0)
  })
})

describe('ExecutivePresenceScorer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders executive presence analysis progress', () => {
    render(
      <ExecutivePresenceScorer
        transcriptContent={mockTranscriptContent}
        speakers={mockSpeakerSegments}
        userCareerLevel="SENIOR"
        meetingType="BOARD_PRESENTATION"
        onScoringComplete={mockOnScoringComplete}
      />
    )

    expect(screen.getByText('Executive Presence Analysis')).toBeInTheDocument()
  })

  it('analyzes authority patterns', async () => {
    const authorityContent = `
    I recommend we proceed with this strategic approach immediately.
    Based on my experience, this is the right path forward for our business.
    I'm confident this decision will drive significant value creation.
    The data clearly shows we should prioritize this initiative.
    `

    render(
      <ExecutivePresenceScorer
        transcriptContent={authorityContent}
        speakers={mockSpeakerSegments}
        userCareerLevel="DIRECTOR"
        meetingType="BOARD_PRESENTATION"
        onScoringComplete={mockOnScoringComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnScoringComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnScoringComplete.mock.calls[0][0]
    expect(result.overallScore).toBeGreaterThan(0)
    expect(result.presenceMarkers).toBeDefined()
  })

  it('analyzes clarity patterns', async () => {
    const clarityContent = `
    Let me explain this in three key points: first, market opportunity, second, competitive advantage, third, implementation timeline.
    To clarify the strategic approach, we're focusing on customer value creation.
    Specifically, our ROI calculation shows 300% return within 18 months.
    In other words, this initiative aligns perfectly with our business objectives.
    `

    render(
      <ExecutivePresenceScorer
        transcriptContent={clarityContent}
        speakers={mockSpeakerSegments}
        userCareerLevel="SENIOR"
        meetingType="STAKEHOLDER_REVIEW"
        onScoringComplete={mockOnScoringComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnScoringComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnScoringComplete.mock.calls[0][0]
    expect(result.leadershipLanguage).toBeDefined()
    expect(result.confidenceIndicators).toBeDefined()
  })

  it('detects influence patterns', async () => {
    const influenceContent = `
    The data shows compelling evidence for this strategic direction.
    I'm passionate about this opportunity because it aligns with our vision.
    In my experience leading similar initiatives, I've seen tremendous success.
    Industry best practice suggests this is the standard approach.
    `

    render(
      <ExecutivePresenceScorer
        transcriptContent={influenceContent}
        speakers={mockSpeakerSegments}
        userCareerLevel="STAFF"
        meetingType="STAKEHOLDER_REVIEW"
        onScoringComplete={mockOnScoringComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnScoringComplete).toHaveBeenCalled()
    }, { timeout: 3000 })

    const result = mockOnScoringComplete.mock.calls[0][0]
    expect(result.influencePatterns).toBeDefined()
    expect(result.influencePatterns.length).toBeGreaterThan(0)
  })

  it('calculates presence scores by career level', async () => {
    const careerLevels: PMCareerLevel[] = ['IC', 'SENIOR', 'STAFF', 'PRINCIPAL', 'DIRECTOR']

    for (const level of careerLevels) {
      jest.clearAllMocks()
      
      render(
        <ExecutivePresenceScorer
          transcriptContent={mockTranscriptContent}
          speakers={mockSpeakerSegments}
          userCareerLevel={level}
          meetingType="STAKEHOLDER_REVIEW"
          onScoringComplete={mockOnScoringComplete}
        />
      )

      await waitFor(() => {
        expect(mockOnScoringComplete).toHaveBeenCalled()
      }, { timeout: 3000 })

      const result = mockOnScoringComplete.mock.calls[0][0]
      expect(result.overallScore).toBeGreaterThanOrEqual(0)
      expect(result.overallScore).toBeLessThanOrEqual(100)
    }
  })
})

// Integration tests
describe('Pattern Detection Integration', () => {
  it('combines multiple pattern detection results', async () => {
    const comprehensiveContent = `
    I recommend our strategic approach focus on long-term customer value using the RICE framework.
    From a business impact perspective, regulatory compliance ensures sustainable growth.
    Based on my experience, I'm confident this decision drives competitive advantage.
    Let me break this down: first, market opportunity, second, implementation feasibility, third, ROI calculation.
    `

    // Test multiple pattern detectors with same content
    const detectors = [
      {
        component: PMTransitionDetector,
        props: {
          currentLevel: 'SENIOR' as PMCareerLevel,
          targetLevel: 'STAFF' as PMCareerLevel,
          transcriptContent: comprehensiveContent,
          speakerSegments: mockSpeakerSegments,
          onDetectionComplete: jest.fn()
        }
      },
      {
        component: IndustryContextAnalyzer,
        props: {
          industry: 'FINTECH' as IndustryType,
          transcriptContent: comprehensiveContent,
          userCareerLevel: 'SENIOR',
          onAnalysisComplete: jest.fn()
        }
      },
      {
        component: ExecutivePresenceScorer,
        props: {
          transcriptContent: comprehensiveContent,
          speakers: mockSpeakerSegments,
          userCareerLevel: 'SENIOR' as PMCareerLevel,
          meetingType: 'STAKEHOLDER_REVIEW' as MeetingType,
          onScoringComplete: jest.fn()
        }
      }
    ]

    for (const detector of detectors) {
      render(React.createElement(detector.component, detector.props))
    }

    // Wait for all analyses to complete
    await waitFor(() => {
      detectors.forEach(detector => {
        const callback = Object.values(detector.props).find(prop => typeof prop === 'function')
        expect(callback).toHaveBeenCalled()
      })
    }, { timeout: 5000 })
  })
})