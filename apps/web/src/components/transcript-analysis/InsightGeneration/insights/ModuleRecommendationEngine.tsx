/**
 * Module Recommendation Engine - Generates personalized practice module recommendations
 * ShipSpeak Slice 5 Refactoring
 */

import {
  ModuleRecommendation,
  ImprovementArea,
  ProgressionInsight
} from '../../../../types/transcript-analysis'
import { PMCareerLevel } from '../../../../types/competency'
import { getDifficultyForLevel, getPriorityNumber } from '../../../../utils/patternAnalysisUtils'

export const generatePracticeModuleRecommendations = async (
  improvements: ImprovementArea[],
  insights: ProgressionInsight[],
  currentLevel: PMCareerLevel
): Promise<ModuleRecommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const modules: ModuleRecommendation[] = []

  // Improvement-based modules
  for (const improvement of improvements.slice(0, 3)) {
    for (const module of improvement.practiceModules.slice(0, 1)) {
      modules.push({
        moduleType: module,
        difficulty: getDifficultyForLevel(currentLevel),
        priority: getPriorityNumber(improvement.priority),
        focusArea: improvement.specificFocus,
        expectedOutcome: `Improve ${improvement.competency} by ${improvement.gap} points`
      })
    }
  }

  // Career level specific modules
  const levelModules = getLevelSpecificModules(currentLevel)
  modules.push(...levelModules)

  return modules
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6)
}

export const getLevelSpecificModules = (level: PMCareerLevel): ModuleRecommendation[] => {
  const moduleMap = {
    IC: [
      {
        moduleType: 'Strategic Thinking Foundations',
        difficulty: 'FOUNDATION' as const,
        priority: 4,
        focusArea: 'Strategic mindset development',
        expectedOutcome: 'Develop strategic vocabulary and thinking patterns'
      }
    ],
    SENIOR: [
      {
        moduleType: 'Executive Communication',
        difficulty: 'PRACTICE' as const,
        priority: 3,
        focusArea: 'Senior-level communication',
        expectedOutcome: 'Master executive communication structure'
      }
    ],
    STAFF: [
      {
        moduleType: 'Influence Without Authority',
        difficulty: 'PRACTICE' as const,
        priority: 2,
        focusArea: 'Cross-functional leadership',
        expectedOutcome: 'Build influence across organization'
      }
    ]
  }
  
  return moduleMap[level] || []
}