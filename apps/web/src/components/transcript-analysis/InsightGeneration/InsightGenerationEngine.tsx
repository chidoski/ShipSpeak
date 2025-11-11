/**
 * Insight Generation Engine - Transforms pattern analysis into actionable PM insights
 * ShipSpeak Slice 5: AI-powered insight synthesis and recommendation generation
 */

import React from 'react'
import { 
  PatternHighlight,
  ImprovementArea,
  StrengthArea,
  ProgressionInsight,
  ActionableRecommendation,
  ModuleRecommendation,
  PMTransitionDetection,
  IndustryPatternAnalysis,
  MeetingTypeAnalysis
} from '../../../types/transcript-analysis'
import { CompetencyCategory, PMCareerLevel } from '../../../types/competency'
import { generatePatternHighlights } from './insights/PatternHighlightGenerator'
import { identifyImprovementAreas } from './insights/ImprovementAreaIdentifier'
import { identifyStrengthAreas } from './insights/StrengthAreaAnalyzer'
import { generateProgressionInsights } from './insights/ProgressionInsightEngine'
import { generateImmediateActions } from './insights/ActionRecommendationEngine'
import { generatePracticeModuleRecommendations } from './insights/ModuleRecommendationEngine'
import { getStageDescription } from '../../../utils/patternAnalysisUtils'

interface InsightResults {
  highlights: PatternHighlight[]
  improvements: ImprovementArea[]
  strengths: StrengthArea[]
  progressionInsights: ProgressionInsight[]
  immediateActions: ActionableRecommendation[]
  practiceModules: ModuleRecommendation[]
}

interface InsightGenerationEngineProps {
  transitionAnalysis: PMTransitionDetection
  industryAnalysis: IndustryPatternAnalysis
  meetingTypeAnalysis: MeetingTypeAnalysis
  executivePresence: any
  currentCareerLevel: PMCareerLevel
  targetCareerLevel: PMCareerLevel
  onInsightGeneration: (insights: InsightResults) => void
}

export const InsightGenerationEngine: React.FC<InsightGenerationEngineProps> = ({
  transitionAnalysis,
  industryAnalysis,
  meetingTypeAnalysis,
  executivePresence,
  currentCareerLevel,
  targetCareerLevel,
  onInsightGeneration
}) => {
  const [generationStage, setGenerationStage] = React.useState<string>('INITIALIZING')
  const [progress, setProgress] = React.useState(0)

  const generateInsights = React.useCallback(async () => {
    try {
      setGenerationStage('PATTERN_HIGHLIGHTS')
      setProgress(15)

      // Generate pattern highlights from analysis
      const highlights = await generatePatternHighlights(
        transitionAnalysis, 
        industryAnalysis, 
        meetingTypeAnalysis, 
        executivePresence
      )

      setGenerationStage('IMPROVEMENT_AREAS')
      setProgress(30)

      // Identify improvement areas with specific focus
      const improvements = await identifyImprovementAreas(
        transitionAnalysis,
        industryAnalysis,
        executivePresence,
        currentCareerLevel,
        targetCareerLevel
      )

      setGenerationStage('STRENGTH_AREAS')
      setProgress(45)

      // Identify strength areas for leveraging
      const strengths = await identifyStrengthAreas(
        transitionAnalysis,
        industryAnalysis,
        meetingTypeAnalysis,
        executivePresence
      )

      setGenerationStage('PROGRESSION_INSIGHTS')
      setProgress(60)

      // Generate career progression insights
      const progressionInsights = await generateProgressionInsights(
        transitionAnalysis,
        currentCareerLevel,
        targetCareerLevel
      )

      setGenerationStage('IMMEDIATE_ACTIONS')
      setProgress(75)

      // Generate immediate actionable recommendations
      const immediateActions = await generateImmediateActions(
        improvements,
        strengths,
        progressionInsights
      )

      setGenerationStage('PRACTICE_MODULES')
      setProgress(90)

      // Generate practice module recommendations
      const practiceModules = await generatePracticeModuleRecommendations(
        improvements,
        progressionInsights,
        currentCareerLevel
      )

      setProgress(100)
      setGenerationStage('COMPLETED')

      const insights: InsightResults = {
        highlights,
        improvements,
        strengths,
        progressionInsights,
        immediateActions,
        practiceModules
      }

      onInsightGeneration(insights)

    } catch (error) {
      console.error('Insight generation failed:', error)
      setGenerationStage('ERROR')
    }
  }, [
    transitionAnalysis,
    industryAnalysis, 
    meetingTypeAnalysis,
    executivePresence,
    currentCareerLevel,
    targetCareerLevel,
    onInsightGeneration
  ])

  React.useEffect(() => {
    generateInsights()
  }, [generateInsights])

  if (generationStage === 'ERROR') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Insight Generation Failed</h3>
        <p className="text-red-600 text-sm">Unable to generate actionable insights.</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-amber-800 font-medium">Generating Actionable Insights</h3>
        <span className="text-amber-600 text-sm">{progress}%</span>
      </div>
      <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
        <div 
          className="bg-amber-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-amber-600 text-sm mt-2">{getStageDescription(generationStage)}</p>
    </div>
  )
}

export default InsightGenerationEngine