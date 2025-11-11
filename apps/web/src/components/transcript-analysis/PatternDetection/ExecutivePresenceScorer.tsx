/**
 * Executive Presence Scorer - Analyzes executive communication patterns and leadership language
 * ShipSpeak Slice 5: Executive presence assessment and leadership communication analysis
 */

import React from 'react'
import { 
  ExecutivePresenceAnalysis,
  PresenceMarker,
  LanguageAnalysis,
  InfluencePattern,
  ConfidenceIndicator
} from '../../../types/transcript-analysis'
import { PMCareerLevel } from '../../../types/competency'
import { MeetingType } from '../../../types/meeting'
import { analyzePresenceMarkers } from './executive-presence/PresenceMarkerAnalyzer'
import { analyzeLeadershipLanguage } from './executive-presence/LanguageAnalyzer'
import { detectInfluencePatterns } from './executive-presence/InfluencePatternDetector'
import { analyzeConfidenceIndicators } from './executive-presence/ConfidenceIndicatorAnalyzer'

interface ExecutivePresenceScorerProps {
  transcriptContent: string
  speakers: any[]
  userCareerLevel: PMCareerLevel
  meetingType: MeetingType
  onScoringComplete: (results: ExecutivePresenceAnalysis) => void
}

export const ExecutivePresenceScorer: React.FC<ExecutivePresenceScorerProps> = ({
  transcriptContent,
  speakers,
  userCareerLevel,
  meetingType,
  onScoringComplete
}) => {
  const [scoringStage, setScoringStage] = React.useState<string>('INITIALIZING')
  const [progress, setProgress] = React.useState(0)

  const analyzeExecutivePresence = React.useCallback(async () => {
    try {
      setScoringStage('PRESENCE_MARKERS')
      setProgress(15)

      // Analyze presence markers (authority, clarity, conviction, composure)
      const presenceMarkers = await analyzePresenceMarkers(transcriptContent, meetingType)

      setScoringStage('LANGUAGE_ANALYSIS')
      setProgress(35)

      // Analyze leadership language sophistication
      const leadershipLanguage = await analyzeLeadershipLanguage(transcriptContent, userCareerLevel)

      setScoringStage('INFLUENCE_PATTERNS')
      setProgress(55)

      // Detect influence techniques and effectiveness
      const influencePatterns = await detectInfluencePatterns(transcriptContent, speakers)

      setScoringStage('CONFIDENCE_INDICATORS')
      setProgress(75)

      // Analyze confidence indicators and conviction markers
      const confidenceIndicators = await analyzeConfidenceIndicators(transcriptContent)

      setScoringStage('OVERALL_SCORING')
      setProgress(90)

      // Calculate overall executive presence score
      const overallScore = calculateExecutivePresenceScore({
        presenceMarkers,
        leadershipLanguage,
        influencePatterns,
        confidenceIndicators
      })

      setProgress(100)
      setScoringStage('COMPLETED')

      const results: ExecutivePresenceAnalysis = {
        overallScore,
        presenceMarkers,
        leadershipLanguage,
        influencePatterns,
        confidenceIndicators
      }

      onScoringComplete(results)

    } catch (error) {
      console.error('Executive presence scoring failed:', error)
      setScoringStage('ERROR')
    }
  }, [transcriptContent, speakers, userCareerLevel, meetingType, onScoringComplete])

  React.useEffect(() => {
    analyzeExecutivePresence()
  }, [analyzeExecutivePresence])

  if (scoringStage === 'ERROR') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Executive Presence Analysis Failed</h3>
        <p className="text-red-600 text-sm">Unable to analyze executive presence patterns.</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-indigo-800 font-medium">Executive Presence Analysis</h3>
        <span className="text-indigo-600 text-sm">{progress}%</span>
      </div>
      <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-indigo-600 text-sm mt-2">{getStageDescription(scoringStage)}</p>
    </div>
  )
}

const calculateExecutivePresenceScore = (components: {
  presenceMarkers: PresenceMarker[]
  leadershipLanguage: LanguageAnalysis
  influencePatterns: InfluencePattern[]
  confidenceIndicators: ConfidenceIndicator[]
}): number => {
  const weights = {
    presence: 0.3,
    language: 0.25,
    influence: 0.25,
    confidence: 0.2
  }

  const presenceScore = components.presenceMarkers.reduce((sum, marker) => sum + marker.strength, 0) / components.presenceMarkers.length
  const languageScore = components.leadershipLanguage.overallSophistication
  const influenceScore = components.influencePatterns.reduce((sum, pattern) => sum + pattern.strength, 0) / Math.max(components.influencePatterns.length, 1)
  const confidenceScore = components.confidenceIndicators.reduce((sum, indicator) => sum + indicator.strength, 0) / Math.max(components.confidenceIndicators.length, 1)

  return Math.round(
    presenceScore * weights.presence +
    languageScore * weights.language +
    influenceScore * weights.influence +
    confidenceScore * weights.confidence
  )
}

const getStageDescription = (stage: string): string => {
  const descriptions = {
    'INITIALIZING': 'Initializing presence analysis...',
    'PRESENCE_MARKERS': 'Analyzing authority and composure markers',
    'LANGUAGE_ANALYSIS': 'Evaluating leadership language sophistication',
    'INFLUENCE_PATTERNS': 'Detecting influence techniques and effectiveness',
    'CONFIDENCE_INDICATORS': 'Analyzing confidence and conviction markers',
    'OVERALL_SCORING': 'Calculating executive presence score',
    'COMPLETED': 'Executive presence analysis complete',
    'ERROR': 'Analysis failed'
  }
  return descriptions[stage] || stage
}

export default ExecutivePresenceScorer