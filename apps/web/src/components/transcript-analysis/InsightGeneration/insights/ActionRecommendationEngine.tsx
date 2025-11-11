/**
 * Action Recommendation Engine - Generates immediate actionable recommendations
 * ShipSpeak Slice 5 Refactoring
 */

import {
  ActionableRecommendation,
  ImprovementArea,
  StrengthArea,
  ProgressionInsight
} from '../../../../types/transcript-analysis'

export const generateImmediateActions = async (
  improvements: ImprovementArea[],
  strengths: StrengthArea[],
  insights: ProgressionInsight[]
): Promise<ActionableRecommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const actions: ActionableRecommendation[] = []

  // High-priority improvement actions
  const highPriorityImprovements = improvements.filter(imp => imp.priority === 'HIGH')
  for (const improvement of highPriorityImprovements.slice(0, 2)) {
    actions.push({
      category: 'IMMEDIATE',
      action: `Focus on ${improvement.specificFocus.toLowerCase()}`,
      rationale: `${improvement.gap}-point gap identified in critical transition skill`,
      expectedImpact: `Improve readiness by ${Math.round(improvement.gap * 0.6)}%`,
      effort: 'MEDIUM',
      timeframe: '2-4 weeks'
    })
  }

  // Strength leverage actions
  for (const strength of strengths.slice(0, 1)) {
    actions.push({
      category: 'SHORT_TERM',
      action: strength.leverageOpportunities[0],
      rationale: `Strong performance (${strength.currentLevel}%) creates opportunity`,
      expectedImpact: 'Increase visibility and demonstrate leadership capacity',
      effort: 'LOW',
      timeframe: '1-2 weeks'
    })
  }

  // Critical progression action
  if (insights.length > 0) {
    const primaryInsight = insights[0]
    actions.push({
      category: 'LONG_TERM',
      action: primaryInsight.criticalActions[0] || 'Develop missing transition skills',
      rationale: `${primaryInsight.timeToTarget}-month progression timeline requires consistent execution`,
      expectedImpact: `Achieve ${primaryInsight.transitionType} readiness`,
      effort: 'HIGH',
      timeframe: `${primaryInsight.timeToTarget} months`
    })
  }

  return actions.slice(0, 4)
}