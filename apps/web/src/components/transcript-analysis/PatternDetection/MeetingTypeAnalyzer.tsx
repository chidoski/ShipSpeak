/**
 * Meeting Type Analyzer - Analyzes communication effectiveness by meeting context
 * ShipSpeak Slice 5: Context-aware communication pattern analysis
 */

import React from 'react'
import { 
  MeetingTypeAnalysis,
  MeetingCommunicationPatterns,
  AudienceAdaptation,
  PatternDetection
} from '../../../types/transcript-analysis'
import { MeetingType } from '../../../types/meeting'

interface MeetingTypeAnalyzerProps {
  meetingType: MeetingType
  transcriptContent: string
  speakers: any[]
  onAnalysisComplete: (results: MeetingTypeAnalysis) => void
}

export const MeetingTypeAnalyzer: React.FC<MeetingTypeAnalyzerProps> = ({
  meetingType,
  transcriptContent,
  speakers,
  onAnalysisComplete
}) => {
  const [analysisStage, setAnalysisStage] = React.useState<string>('INITIALIZING')
  const [progress, setProgress] = React.useState(0)

  const analyzeMeetingTypePatterns = React.useCallback(async () => {
    try {
      setAnalysisStage('CONTEXT_ANALYSIS')
      setProgress(20)

      // Analyze meeting context and structure
      const communicationPatterns = await analyzeCommunicationPatterns(meetingType, transcriptContent)

      setAnalysisStage('AUDIENCE_ADAPTATION')
      setProgress(60)

      // Analyze audience adaptation patterns
      const audienceAdaptation = await analyzeAudienceAdaptation(transcriptContent, speakers)

      setAnalysisStage('EFFECTIVENESS_SCORING')
      setProgress(85)

      // Calculate overall effectiveness score
      const effectivenessScore = await calculateMeetingEffectiveness(communicationPatterns, audienceAdaptation, meetingType)

      setProgress(100)
      setAnalysisStage('COMPLETED')

      const results: MeetingTypeAnalysis = {
        meetingType,
        effectivenessScore,
        communicationPatterns,
        audienceAdaptation,
        contextualAppropriate: effectivenessScore > 70
      }

      onAnalysisComplete(results)

    } catch (error) {
      console.error('Meeting type analysis failed:', error)
      setAnalysisStage('ERROR')
    }
  }, [meetingType, transcriptContent, speakers, onAnalysisComplete])

  React.useEffect(() => {
    analyzeMeetingTypePatterns()
  }, [analyzeMeetingTypePatterns])

  if (analysisStage === 'ERROR') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Meeting Type Analysis Failed</h3>
        <p className="text-red-600 text-sm">Unable to analyze meeting-specific patterns.</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-purple-800 font-medium">
          {getMeetingTypeLabel(meetingType)} Analysis
        </h3>
        <span className="text-purple-600 text-sm">{progress}%</span>
      </div>
      <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-purple-600 text-sm mt-2">{getStageDescription(analysisStage)}</p>
    </div>
  )
}

// Meeting-specific communication pattern analysis
const analyzeCommunicationPatterns = async (
  meetingType: MeetingType, 
  content: string
): Promise<MeetingCommunicationPatterns> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const patterns: MeetingCommunicationPatterns = {}

  switch (meetingType) {
    case 'BOARD_PRESENTATION':
      patterns.boardPresentation = await analyzeBoardPresentationPatterns(content)
      break
    case 'STAKEHOLDER_REVIEW':
      patterns.stakeholderUpdate = await analyzeStakeholderUpdatePatterns(content)
      break
    case 'ONE_ON_ONE':
      patterns.oneOnOne = await analyzeOneOnOnePatterns(content)
      break
    case 'TEAM_STANDUP':
      patterns.teamStandup = await analyzeTeamStandupPatterns(content)
      break
    case 'CRISIS_COMMUNICATION':
      patterns.crisisCommunication = await analyzeCrisisCommunicationPatterns(content)
      break
    default:
      // Default to stakeholder patterns for general meetings
      patterns.stakeholderUpdate = await analyzeStakeholderUpdatePatterns(content)
  }

  return patterns
}

// Board presentation pattern analysis
const analyzeBoardPresentationPatterns = async (content: string) => {
  const summaryTerms = ['in summary', 'key takeaway', 'bottom line', 'conclusion', 'executive summary']
  const metricsTerms = ['revenue', 'growth', 'KPI', 'metric', 'performance', 'ROI', 'market share']
  const confidenceTerms = ['recommend', 'confident', 'certain', 'believe', 'convinced']
  const narrativeTerms = ['strategy', 'vision', 'market', 'competitive', 'opportunity', 'positioning']

  return {
    executiveSummaryStructure: analyzeTermPattern(content, summaryTerms),
    metricsFocus: analyzeTermPattern(content, metricsTerms),
    confidenceIndicators: analyzeTermPattern(content, confidenceTerms),
    strategicNarrative: analyzeTermPattern(content, narrativeTerms),
    timeManagement: analyzeTimeManagement(content)
  }
}

// Stakeholder update pattern analysis
const analyzeStakeholderUpdatePatterns = async (content: string) => {
  const progressTerms = ['progress', 'completed', 'achieved', 'delivered', 'milestone', 'status']
  const blockerTerms = ['blocker', 'challenge', 'issue', 'risk', 'dependency', 'obstacle']
  const reportingTerms = ['report', 'update', 'summary', 'overview', 'dashboard', 'metrics']
  const actionTerms = ['action', 'next steps', 'plan', 'decision', 'commitment', 'deliverable']

  return {
    progressClarity: analyzeTermPattern(content, progressTerms),
    blockerCommunication: analyzeTermPattern(content, blockerTerms),
    executiveReporting: analyzeTermPattern(content, reportingTerms),
    successMetricIntegration: analyzeSuccessMetrics(content),
    actionOrientation: analyzeTermPattern(content, actionTerms)
  }
}

// One-on-one pattern analysis
const analyzeOneOnOnePatterns = async (content: string) => {
  const relationshipTerms = ['how are you', 'feedback', 'support', 'help', 'concern', 'question']
  const careerTerms = ['career', 'growth', 'development', 'goal', 'aspiration', 'skill']
  const feedbackTerms = ['feedback', 'improvement', 'strength', 'area to work on', 'suggestion']
  const goalTerms = ['goal', 'objective', 'target', 'milestone', 'achievement', 'success']

  return {
    relationshipBuilding: analyzeTermPattern(content, relationshipTerms),
    careerDevelopment: analyzeTermPattern(content, careerTerms),
    feedbackDelivery: analyzeTermPattern(content, feedbackTerms),
    goalAlignment: analyzeTermPattern(content, goalTerms),
    supportProvision: analyzeSupportProvision(content)
  }
}

// Team standup pattern analysis
const analyzeTeamStandupPatterns = async (content: string) => {
  const coordinationTerms = ['coordinate', 'sync', 'align', 'collaborate', 'dependency', 'handoff']
  const blockerTerms = ['blocker', 'blocked', 'stuck', 'need help', 'issue', 'impediment']
  const priorityTerms = ['priority', 'urgent', 'important', 'critical', 'focus', 'sprint']
  const motivationTerms = ['great work', 'excellent', 'progress', 'achievement', 'success']

  return {
    coordinationEffectiveness: analyzeTermPattern(content, coordinationTerms),
    blockerIdentification: analyzeTermPattern(content, blockerTerms),
    priorityAlignment: analyzeTermPattern(content, priorityTerms),
    teamMotivation: analyzeTermPattern(content, motivationTerms),
    efficiencyMaintenance: analyzeEfficiencyMaintenance(content)
  }
}

// Crisis communication pattern analysis
const analyzeCrisisCommunicationPatterns = async (content: string) => {
  const calmnessTerms = ['calm', 'stable', 'under control', 'managed', 'handling']
  const clarityTerms = ['clear', 'specific', 'exactly', 'precisely', 'understand']
  const reassuranceTerms = ['reassure', 'confident', 'handle', 'resolve', 'solution']
  const actionTerms = ['action plan', 'immediate steps', 'response', 'mitigation', 'recovery']

  return {
    calmnessProjection: analyzeTermPattern(content, calmnessTerms),
    clarityUnderPressure: analyzeTermPattern(content, clarityTerms),
    stakeholderReassurance: analyzeTermPattern(content, reassuranceTerms),
    actionablePlanning: analyzeTermPattern(content, actionTerms),
    transparencyBalance: analyzeTransparencyBalance(content)
  }
}

// Audience adaptation analysis
const analyzeAudienceAdaptation = async (content: string, speakers: any[]): Promise<AudienceAdaptation> => {
  await new Promise(resolve => setTimeout(resolve, 400))

  // Analyze language adaptation for different audience types
  const executiveScore = analyzeExecutiveLanguage(content)
  const technicalScore = analyzeTechnicalLanguage(content)
  const businessScore = analyzeBusinessLanguage(content)
  const customerScore = analyzeCustomerLanguage(content)
  const teamScore = analyzeTeamLanguage(content)

  return {
    executiveAudience: executiveScore,
    technicalAudience: technicalScore,
    businessStakeholders: businessScore,
    customerFacing: customerScore,
    teamMembers: teamScore
  }
}

// Language analysis functions
const analyzeExecutiveLanguage = (content: string): number => {
  const executiveTerms = ['strategic', 'business impact', 'ROI', 'market', 'competitive', 'revenue', 'growth']
  const occurrences = countTermOccurrences(content, executiveTerms)
  return Math.min(occurrences * 12, 100)
}

const analyzeTechnicalLanguage = (content: string): number => {
  const technicalTerms = ['architecture', 'implementation', 'API', 'infrastructure', 'performance', 'scalability']
  const businessTranslationTerms = ['which means', 'in business terms', 'impact is', 'translates to']
  
  const technicalOccurrences = countTermOccurrences(content, technicalTerms)
  const translationOccurrences = countTermOccurrences(content, businessTranslationTerms)
  
  // Higher score for good translation of technical concepts
  return Math.min((technicalOccurrences * 8) + (translationOccurrences * 20), 100)
}

const analyzeBusinessLanguage = (content: string): number => {
  const businessTerms = ['business value', 'customer', 'market', 'revenue', 'cost', 'efficiency', 'ROI']
  const occurrences = countTermOccurrences(content, businessTerms)
  return Math.min(occurrences * 10, 100)
}

const analyzeCustomerLanguage = (content: string): number => {
  const customerTerms = ['customer', 'user', 'experience', 'value', 'needs', 'feedback', 'satisfaction']
  const occurrences = countTermOccurrences(content, customerTerms)
  return Math.min(occurrences * 12, 100)
}

const analyzeTeamLanguage = (content: string): number => {
  const teamTerms = ['team', 'collaboration', 'support', 'help', 'together', 'we', 'us', 'our']
  const occurrences = countTermOccurrences(content, teamTerms)
  return Math.min(occurrences * 8, 100)
}

// Specialized pattern analysis functions
const analyzeTimeManagement = (content: string): PatternDetection => {
  const timeTerms = ['in conclusion', 'time check', 'to summarize', 'final point', 'wrap up']
  return analyzeTermPattern(content, timeTerms)
}

const analyzeSuccessMetrics = (content: string): PatternDetection => {
  const metricsTerms = ['KPI', 'metric', 'measurement', 'target', 'goal', 'success criteria', 'benchmark']
  return analyzeTermPattern(content, metricsTerms)
}

const analyzeSupportProvision = (content: string): PatternDetection => {
  const supportTerms = ['support', 'help', 'assist', 'enable', 'resource', 'available', 'here for you']
  return analyzeTermPattern(content, supportTerms)
}

const analyzeEfficiencyMaintenance = (content: string): PatternDetection => {
  const efficiencyTerms = ['efficient', 'quick', 'brief', 'focused', 'on track', 'time-boxed']
  return analyzeTermPattern(content, efficiencyTerms)
}

const analyzeTransparencyBalance = (content: string): PatternDetection => {
  const transparencyTerms = ['transparent', 'honest', 'clear', 'open', 'communicate', 'inform']
  return analyzeTermPattern(content, transparencyTerms)
}

// Effectiveness calculation
const calculateMeetingEffectiveness = async (
  patterns: MeetingCommunicationPatterns,
  audienceAdaptation: AudienceAdaptation,
  meetingType: MeetingType
): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  // Calculate weighted effectiveness based on meeting type
  const weights = getMeetingTypeWeights(meetingType)
  const patternScore = calculatePatternScore(patterns, meetingType)
  const adaptationScore = calculateAudienceScore(audienceAdaptation)

  return Math.round(patternScore * weights.patterns + adaptationScore * weights.adaptation)
}

const getMeetingTypeWeights = (meetingType: MeetingType) => {
  const weightMap = {
    'BOARD_PRESENTATION': { patterns: 0.7, adaptation: 0.3 },
    'STAKEHOLDER_REVIEW': { patterns: 0.6, adaptation: 0.4 },
    'ONE_ON_ONE': { patterns: 0.4, adaptation: 0.6 },
    'TEAM_STANDUP': { patterns: 0.8, adaptation: 0.2 },
    'CRISIS_COMMUNICATION': { patterns: 0.7, adaptation: 0.3 }
  }
  
  return weightMap[meetingType] || { patterns: 0.6, adaptation: 0.4 }
}

const calculatePatternScore = (patterns: MeetingCommunicationPatterns, meetingType: MeetingType): number => {
  // Extract relevant patterns based on meeting type and calculate average
  const relevantPatterns = Object.values(patterns)[0] // Get the first (relevant) pattern set
  if (!relevantPatterns) return 70 // Default score
  
  const patternScores = Object.values(relevantPatterns).map((pattern: any) => pattern.confidence || 70)
  return patternScores.reduce((acc, score) => acc + score, 0) / patternScores.length
}

const calculateAudienceScore = (adaptation: AudienceAdaptation): number => {
  const scores = Object.values(adaptation)
  return scores.reduce((acc, score) => acc + score, 0) / scores.length
}

// Helper functions
const analyzeTermPattern = (content: string, terms: string[]): PatternDetection => {
  const occurrences = countTermOccurrences(content, terms)
  const confidence = Math.min(occurrences * 15, 95)
  
  return {
    detected: occurrences > 0,
    confidence,
    frequency: occurrences,
    examples: extractTermExamples(content, terms),
    improvement: occurrences > 3 ? 'STRONG' : occurrences > 1 ? 'EMERGING' : 'WEAK',
    benchmarkComparison: Math.min(occurrences * 12, 90)
  }
}

const countTermOccurrences = (content: string, terms: string[]): number => {
  const lowerContent = content.toLowerCase()
  return terms.reduce((count, term) => {
    const regex = new RegExp(term.toLowerCase(), 'gi')
    const matches = lowerContent.match(regex)
    return count + (matches ? matches.length : 0)
  }, 0)
}

const extractTermExamples = (content: string, terms: string[]): any[] => {
  const examples: any[] = []
  const lowerContent = content.toLowerCase()
  
  for (const term of terms.slice(0, 2)) {
    const index = lowerContent.indexOf(term.toLowerCase())
    if (index !== -1) {
      const start = Math.max(0, index - 15)
      const end = Math.min(content.length, index + term.length + 15)
      examples.push({
        text: content.substring(start, end),
        timestamp: Math.floor(Math.random() * 1800),
        context: 'Meeting-specific usage',
        strength: Math.floor(Math.random() * 30) + 70
      })
    }
  }
  
  return examples
}

// Utility functions
const getMeetingTypeLabel = (meetingType: MeetingType): string => {
  const labels = {
    'BOARD_PRESENTATION': 'Board Presentation',
    'STAKEHOLDER_REVIEW': 'Stakeholder Review',
    'ONE_ON_ONE': 'One-on-One',
    'TEAM_STANDUP': 'Team Standup',
    'CRISIS_COMMUNICATION': 'Crisis Communication',
    'CUSTOMER_MEETING': 'Customer Meeting',
    'SPEAKING_ENGAGEMENT': 'Speaking Engagement'
  }
  return labels[meetingType] || meetingType
}

const getStageDescription = (stage: string): string => {
  const descriptions = {
    'INITIALIZING': 'Initializing meeting analysis...',
    'CONTEXT_ANALYSIS': 'Analyzing meeting context patterns',
    'AUDIENCE_ADAPTATION': 'Evaluating audience adaptation',
    'EFFECTIVENESS_SCORING': 'Calculating effectiveness score',
    'COMPLETED': 'Meeting analysis complete',
    'ERROR': 'Analysis failed'
  }
  return descriptions[stage] || stage
}

export default MeetingTypeAnalyzer