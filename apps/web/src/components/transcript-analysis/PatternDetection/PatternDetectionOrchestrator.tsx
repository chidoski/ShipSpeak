/**
 * Pattern Detection Orchestrator - Coordinates PM-specific pattern analysis
 * ShipSpeak Slice 5: Multi-layered communication pattern detection system
 */

import React from 'react'
import { 
  SpeakerIdentification,
  PMTransitionDetection,
  IndustryPatternAnalysis,
  MeetingTypeAnalysis,
  AnalysisConfiguration,
  PatternDetection,
  TransitionMarkers
} from '../../../types/transcript-analysis'
import { PMCareerLevel, IndustryType } from '../../../types/competency'
import { MeetingType } from '../../../types/meeting'
import { PMTransitionDetector } from './PMTransitionDetector'
import { IndustryContextAnalyzer } from './IndustryContextAnalyzer'
import { MeetingTypeAnalyzer } from './MeetingTypeAnalyzer'
import { ExecutivePresenceScorer } from './ExecutivePresenceScorer'

interface PatternDetectionResult {
  transitionAnalysis: PMTransitionDetection
  industryAnalysis: IndustryPatternAnalysis
  meetingTypeAnalysis: MeetingTypeAnalysis
  executivePresence: ExecutivePresenceAnalysis
  communicationFrameworks: FrameworkDetectionResult[]
  overallPatternScore: number
}

interface ExecutivePresenceAnalysis {
  overallScore: number
  presenceMarkers: PresenceMarker[]
  leadershipLanguage: LanguageAnalysis
  influencePatterns: InfluencePattern[]
  confidenceIndicators: ConfidenceIndicator[]
}

interface PresenceMarker {
  type: 'AUTHORITY' | 'CLARITY' | 'CONVICTION' | 'COMPOSURE'
  strength: number // 0-100
  evidence: string[]
  frequency: number
}

interface LanguageAnalysis {
  vocabularySophistication: number // 0-100
  sentenceStructure: number // 0-100
  strategicFraming: number // 0-100
  stakeholderAdaptation: number // 0-100
}

interface InfluencePattern {
  technique: 'LOGIC' | 'EMOTION' | 'CREDIBILITY' | 'CONSENSUS'
  effectiveness: number // 0-100
  usage: number // frequency
  context: string[]
}

interface ConfidenceIndicator {
  type: 'DEFINITIVE_LANGUAGE' | 'ACKNOWLEDGMENT_OF_UNCERTAINTY' | 'SOLUTION_ORIENTATION'
  score: number // 0-100
  examples: string[]
}

interface FrameworkDetectionResult {
  framework: string
  usage: 'MENTIONED' | 'APPLIED' | 'MASTERED'
  quality: number // 0-100
  contextAppropriate: boolean
  examples: FrameworkExample[]
}

interface FrameworkExample {
  text: string
  timestamp: number
  quality: number
  completeness: number
}

interface PatternDetectionOrchestratorProps {
  speakers: SpeakerIdentification[]
  meetingType: MeetingType
  userCareerLevel: PMCareerLevel
  userIndustry: IndustryType
  config: AnalysisConfiguration
  onPatternDetected?: (pattern: string, confidence: number) => void
  onStageProgress?: (stage: string, progress: number) => void
}

export const PatternDetectionOrchestrator: React.FC<PatternDetectionOrchestratorProps> = ({
  speakers,
  meetingType,
  userCareerLevel,
  userIndustry,
  config,
  onPatternDetected,
  onStageProgress
}) => {
  const [analysisState, setAnalysisState] = React.useState<{
    stage: string
    progress: number
    results?: PatternDetectionResult
  }>({
    stage: 'INITIALIZING',
    progress: 0
  })

  const runPatternDetection = React.useCallback(async () => {
    try {
      // Stage 1: PM Transition Pattern Detection
      onStageProgress?.('PM_TRANSITION_DETECTION', 10)
      const transitionAnalysis = await detectPMTransitionPatterns(speakers, userCareerLevel, config.careerGoals)
      
      // Stage 2: Industry Context Analysis
      onStageProgress?.('INDUSTRY_ANALYSIS', 30)
      const industryAnalysis = await analyzeIndustryPatterns(speakers, userIndustry, config)
      
      // Stage 3: Meeting Type Effectiveness
      onStageProgress?.('MEETING_TYPE_ANALYSIS', 50)
      const meetingTypeAnalysis = await analyzeMeetingTypeEffectiveness(speakers, meetingType, config)
      
      // Stage 4: Executive Presence Scoring
      onStageProgress?.('EXECUTIVE_PRESENCE', 70)
      const executivePresence = await scoreExecutivePresence(speakers, userCareerLevel, meetingType)
      
      // Stage 5: Communication Framework Detection
      onStageProgress?.('FRAMEWORK_DETECTION', 85)
      const communicationFrameworks = await detectCommunicationFrameworks(speakers, config)
      
      // Stage 6: Overall Pattern Scoring
      onStageProgress?.('PATTERN_SCORING', 95)
      const overallPatternScore = calculateOverallPatternScore({
        transitionAnalysis,
        industryAnalysis,
        meetingTypeAnalysis,
        executivePresence,
        communicationFrameworks
      })

      const results: PatternDetectionResult = {
        transitionAnalysis,
        industryAnalysis,
        meetingTypeAnalysis,
        executivePresence,
        communicationFrameworks,
        overallPatternScore
      }

      setAnalysisState({
        stage: 'COMPLETED',
        progress: 100,
        results
      })

      onStageProgress?.('COMPLETED', 100)
      
    } catch (error) {
      console.error('Pattern detection failed:', error)
      setAnalysisState(prev => ({
        ...prev,
        stage: 'ERROR',
        progress: 0
      }))
    }
  }, [speakers, meetingType, userCareerLevel, userIndustry, config, onStageProgress])

  React.useEffect(() => {
    runPatternDetection()
  }, [runPatternDetection])

  if (analysisState.stage === 'ERROR') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Pattern Detection Failed</h3>
        <p className="text-red-600 text-sm mt-1">Unable to analyze communication patterns.</p>
      </div>
    )
  }

  if (analysisState.results) {
    return (
      <div className="space-y-6">
        {/* Pattern Detection Results Display */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Communication Pattern Analysis
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analysisState.results.overallPatternScore}
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analysisState.results.transitionAnalysis.progressScore}
              </div>
              <div className="text-sm text-gray-500">Transition Readiness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analysisState.results.executivePresence.overallScore}
              </div>
              <div className="text-sm text-gray-500">Executive Presence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analysisState.results.communicationFrameworks.length}
              </div>
              <div className="text-sm text-gray-500">Frameworks Used</div>
            </div>
          </div>

          {/* Industry-Specific Insights */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {getIndustryLabel(userIndustry)} Communication Patterns
            </h4>
            <div className="text-sm text-gray-600">
              Vocabulary fluency: {analysisState.results.industryAnalysis.vocabularyFluency.industryTermsUsage}% • 
              Professional credibility: {analysisState.results.industryAnalysis.vocabularyFluency.professionalCredibility}%
            </div>
          </div>

          {/* Framework Usage Summary */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Framework Usage Analysis</h4>
            <div className="flex flex-wrap gap-2">
              {analysisState.results.communicationFrameworks.map((framework, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${getFrameworkBadgeStyle(framework.usage)}`}
                >
                  {framework.framework} - {framework.usage}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
        <div>
          <h3 className="text-blue-800 font-medium">Detecting Communication Patterns</h3>
          <p className="text-blue-600 text-sm">{analysisState.stage} - {analysisState.progress}% complete</p>
        </div>
      </div>
    </div>
  )
}

// Helper functions for pattern detection
const detectPMTransitionPatterns = async (
  speakers: SpeakerIdentification[],
  currentLevel: PMCareerLevel,
  targetLevel: PMCareerLevel
): Promise<PMTransitionDetection> => {
  // Simulate pattern detection processing
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    currentLevel,
    targetLevel,
    transitionIndicators: generateMockTransitionMarkers(),
    progressScore: 74,
    blockers: [],
    accelerators: []
  }
}

const analyzeIndustryPatterns = async (
  speakers: SpeakerIdentification[],
  industry: IndustryType,
  config: AnalysisConfiguration
): Promise<IndustryPatternAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return {
    industryType: industry,
    industrySpecificMarkers: {},
    compliancePatterns: [],
    vocabularyFluency: {
      industryTermsUsage: 78,
      contextualAppropriateness: 82,
      sophisticationLevel: 75,
      professionalCredibility: 80
    },
    benchmarkComparison: {
      industryAverage: 65,
      topPerformers: 85,
      userPercentile: 72,
      competitivePosition: 'COMPETITIVE'
    }
  }
}

const analyzeMeetingTypeEffectiveness = async (
  speakers: SpeakerIdentification[],
  meetingType: MeetingType,
  config: AnalysisConfiguration
): Promise<MeetingTypeAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    meetingType,
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
  }
}

const scoreExecutivePresence = async (
  speakers: SpeakerIdentification[],
  careerLevel: PMCareerLevel,
  meetingType: MeetingType
): Promise<ExecutivePresenceAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 700))
  
  return {
    overallScore: 73,
    presenceMarkers: [
      {
        type: 'AUTHORITY',
        strength: 78,
        evidence: ['Used definitive language 12 times', 'Clear position taking'],
        frequency: 12
      },
      {
        type: 'CLARITY',
        strength: 82,
        evidence: ['Structured responses', 'Clear conclusions'],
        frequency: 8
      }
    ],
    leadershipLanguage: {
      vocabularySophistication: 76,
      sentenceStructure: 81,
      strategicFraming: 72,
      stakeholderAdaptation: 79
    },
    influencePatterns: [
      {
        technique: 'LOGIC',
        effectiveness: 83,
        usage: 15,
        context: ['Data-driven arguments', 'Framework-based reasoning']
      }
    ],
    confidenceIndicators: [
      {
        type: 'DEFINITIVE_LANGUAGE',
        score: 78,
        examples: ['I recommend...', 'The data clearly shows...']
      }
    ]
  }
}

const detectCommunicationFrameworks = async (
  speakers: SpeakerIdentification[],
  config: AnalysisConfiguration
): Promise<FrameworkDetectionResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  return [
    {
      framework: 'RICE',
      usage: 'APPLIED',
      quality: 82,
      contextAppropriate: true,
      examples: [
        {
          text: 'Looking at the reach and impact...',
          timestamp: 145,
          quality: 82,
          completeness: 75
        }
      ]
    },
    {
      framework: 'Jobs-to-be-Done',
      usage: 'MENTIONED',
      quality: 65,
      contextAppropriate: true,
      examples: [
        {
          text: 'When customers are trying to...',
          timestamp: 267,
          quality: 65,
          completeness: 60
        }
      ]
    }
  ]
}

const calculateOverallPatternScore = (results: Omit<PatternDetectionResult, 'overallPatternScore'>): number => {
  const weights = {
    transition: 0.25,
    industry: 0.20,
    meetingType: 0.20,
    executive: 0.25,
    frameworks: 0.10
  }
  
  return Math.round(
    results.transitionAnalysis.progressScore * weights.transition +
    results.industryAnalysis.vocabularyFluency.professionalCredibility * weights.industry +
    results.meetingTypeAnalysis.effectivenessScore * weights.meetingType +
    results.executivePresence.overallScore * weights.executive +
    (results.communicationFrameworks.reduce((acc, f) => acc + f.quality, 0) / results.communicationFrameworks.length) * weights.frameworks
  )
}

const generateMockTransitionMarkers = (): TransitionMarkers => ({
  poToPM: {
    strategicLanguageEmergence: {
      detected: true,
      confidence: 78,
      frequency: 12,
      examples: [],
      improvement: 'EMERGING',
      benchmarkComparison: 72
    },
    businessImpactReasoning: {
      detected: true,
      confidence: 82,
      frequency: 8,
      examples: [],
      improvement: 'STRONG',
      benchmarkComparison: 85
    },
    stakeholderCommunicationEvolution: {
      detected: false,
      confidence: 45,
      frequency: 3,
      examples: [],
      improvement: 'WEAK',
      benchmarkComparison: 38
    },
    decisionFrameworkApplication: {
      detected: true,
      confidence: 88,
      frequency: 6,
      examples: [],
      improvement: 'STRONG',
      benchmarkComparison: 92
    },
    deliveryToOutcomesShift: {
      detected: true,
      confidence: 71,
      frequency: 9,
      examples: [],
      improvement: 'EMERGING',
      benchmarkComparison: 68
    }
  },
  pmToSeniorPM: {
    executiveCommunicationStructure: {
      detected: true,
      confidence: 74,
      frequency: 15,
      examples: [],
      improvement: 'EMERGING',
      benchmarkComparison: 71
    },
    tradeoffArticulationSophistication: {
      detected: true,
      confidence: 85,
      frequency: 11,
      examples: [],
      improvement: 'STRONG',
      benchmarkComparison: 89
    },
    influenceWithoutAuthority: {
      detected: false,
      confidence: 52,
      frequency: 4,
      examples: [],
      improvement: 'WEAK',
      benchmarkComparison: 48
    },
    strategicAltitudeControl: {
      detected: true,
      confidence: 67,
      frequency: 7,
      examples: [],
      improvement: 'EMERGING',
      benchmarkComparison: 63
    },
    frameworkMastery: {
      detected: true,
      confidence: 81,
      frequency: 13,
      examples: [],
      improvement: 'STRONG',
      benchmarkComparison: 86
    }
  },
  seniorPMToGroupPM: {
    portfolioThinkingLanguage: {
      detected: false,
      confidence: 34,
      frequency: 2,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 28
    },
    coachingCommunicationEmergence: {
      detected: false,
      confidence: 41,
      frequency: 3,
      examples: [],
      improvement: 'WEAK',
      benchmarkComparison: 36
    },
    organizationalImpactAwareness: {
      detected: true,
      confidence: 59,
      frequency: 5,
      examples: [],
      improvement: 'WEAK',
      benchmarkComparison: 55
    },
    resourceAllocationReasoning: {
      detected: false,
      confidence: 38,
      frequency: 1,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 32
    },
    crossProductStrategy: {
      detected: false,
      confidence: 29,
      frequency: 1,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 25
    }
  },
  groupPMToDirector: {
    boardPresentationReadiness: {
      detected: false,
      confidence: 22,
      frequency: 0,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 18
    },
    businessModelFluency: {
      detected: false,
      confidence: 31,
      frequency: 1,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 26
    },
    marketStrategyCommunication: {
      detected: false,
      confidence: 27,
      frequency: 1,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 23
    },
    organizationalLeadership: {
      detected: false,
      confidence: 19,
      frequency: 0,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 15
    },
    visionCommunication: {
      detected: false,
      confidence: 24,
      frequency: 0,
      examples: [],
      improvement: 'ABSENT',
      benchmarkComparison: 20
    }
  }
})

const getIndustryLabel = (industry: IndustryType): string => {
  const labels = {
    HEALTHCARE: 'Healthcare',
    CYBERSECURITY: 'Cybersecurity',
    FINTECH: 'Fintech',
    ENTERPRISE: 'Enterprise',
    CONSUMER: 'Consumer Technology'
  }
  return labels[industry] || industry
}

const getFrameworkBadgeStyle = (usage: string): string => {
  const styles = {
    MASTERED: 'bg-green-100 text-green-800',
    APPLIED: 'bg-blue-100 text-blue-800',
    MENTIONED: 'bg-gray-100 text-gray-600'
  }
  return styles[usage as keyof typeof styles] || 'bg-gray-100 text-gray-600'
}

export default PatternDetectionOrchestrator