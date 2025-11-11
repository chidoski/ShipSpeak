/**
 * Progression Insight Engine - Generates career progression insights and timelines
 * ShipSpeak Slice 5 Refactoring
 */

import {
  ProgressionInsight,
  PMTransitionDetection
} from '../../../../types/transcript-analysis'
import { PMCareerLevel } from '../../../../types/competency'
import { calculateTimeToTarget, generateKeyMilestones } from '../../../../utils/patternAnalysisUtils'

export const generateProgressionInsights = async (
  analysis: PMTransitionDetection,
  currentLevel: PMCareerLevel,
  targetLevel: PMCareerLevel
): Promise<ProgressionInsight[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))

  const insights: ProgressionInsight[] = []

  // Primary transition insight
  const readinessScore = analysis.progressScore
  const timeToTarget = calculateTimeToTarget(readinessScore, currentLevel, targetLevel)
  
  insights.push({
    transitionType: `${currentLevel} to ${targetLevel}`,
    readinessScore,
    timeToTarget,
    keyMilestones: generateKeyMilestones(currentLevel, targetLevel, readinessScore),
    criticalActions: generateCriticalActions(analysis, currentLevel, targetLevel)
  })

  // Accelerator insight
  if (analysis.accelerators.length > 0) {
    insights.push({
      transitionType: 'Acceleration Opportunities',
      readinessScore: 85,
      timeToTarget: Math.max(timeToTarget - 3, 3),
      keyMilestones: [`Leverage ${analysis.accelerators[0].type}`, 'Expand influence scope', 'Seek stretch assignments'],
      criticalActions: analysis.accelerators[0].leverageOpportunities || []
    })
  }

  return insights
}

export const generateCriticalActions = (analysis: PMTransitionDetection, current: PMCareerLevel, target: PMCareerLevel): string[] => {
  const actions = [
    'Strengthen strategic communication patterns',
    'Develop executive presence markers',
    'Build industry expertise credibility',
    'Practice framework-driven decision making'
  ]
  
  if (analysis.blockers.length > 0) {
    actions.unshift(`Address ${analysis.blockers[0].type.toLowerCase()} pattern`)
  }
  
  return actions.slice(0, 4)
}