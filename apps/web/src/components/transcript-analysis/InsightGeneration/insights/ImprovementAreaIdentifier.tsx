/**
 * Improvement Area Identifier - Analyzes gaps and identifies development opportunities
 * ShipSpeak Slice 5 Refactoring
 */

import {
  ImprovementArea,
  PMTransitionDetection,
  IndustryPatternAnalysis
} from '../../../../types/transcript-analysis'
import { PMCareerLevel } from '../../../../types/competency'
import { getPriorityScore, getIndustryLabel } from '../../../../utils/patternAnalysisUtils'

export const identifyImprovementAreas = async (
  transitionAnalysis: PMTransitionDetection,
  industryAnalysis: IndustryPatternAnalysis,
  executivePresence: any,
  currentLevel: PMCareerLevel,
  targetLevel: PMCareerLevel
): Promise<ImprovementArea[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const improvements: ImprovementArea[] = []

  // Transition-based improvements
  const transitionImprovements = identifyTransitionImprovements(transitionAnalysis, currentLevel, targetLevel)
  improvements.push(...transitionImprovements)

  // Industry-specific improvements
  const industryImprovements = identifyIndustryImprovements(industryAnalysis)
  improvements.push(...industryImprovements)

  // Executive presence improvements
  const presenceImprovements = identifyPresenceImprovements(executivePresence)
  improvements.push(...presenceImprovements)

  // Sort by priority and return top improvements
  return improvements
    .sort((a, b) => getPriorityScore(b.priority) - getPriorityScore(a.priority))
    .slice(0, 5)
}

export const identifyTransitionImprovements = (
  analysis: PMTransitionDetection,
  currentLevel: PMCareerLevel,
  targetLevel: PMCareerLevel
): ImprovementArea[] => {
  const improvements: ImprovementArea[] = []

  // Identify weak transition markers based on current→target progression
  if (currentLevel === 'IC' && targetLevel === 'SENIOR') {
    const markers = analysis.transitionIndicators.poToPM
    
    if (markers?.strategicLanguageEmergence?.confidence < 60) {
      improvements.push({
        competency: 'COMMUNICATION',
        currentLevel: markers.strategicLanguageEmergence.confidence,
        targetLevel: 80,
        gap: 80 - markers.strategicLanguageEmergence.confidence,
        priority: 'HIGH',
        specificFocus: 'Strategic Language Development',
        examples: ['Use outcome-focused language', 'Frame decisions in business impact terms', 'Reference competitive positioning'],
        practiceModules: ['Strategic Communication Framework', 'Business Impact Articulation']
      })
    }

    if (markers?.stakeholderCommunicationEvolution?.confidence < 60) {
      improvements.push({
        competency: 'STAKEHOLDER_MANAGEMENT',
        currentLevel: markers.stakeholderCommunicationEvolution.confidence,
        targetLevel: 75,
        gap: 75 - markers.stakeholderCommunicationEvolution.confidence,
        priority: 'HIGH',
        specificFocus: 'Cross-functional Stakeholder Communication',
        examples: ['Adapt language to audience', 'Build consensus across teams', 'Manage up effectively'],
        practiceModules: ['Stakeholder Management', 'Executive Communication']
      })
    }
  }

  return improvements
}

export const identifyIndustryImprovements = (analysis: IndustryPatternAnalysis): ImprovementArea[] => {
  const improvements: ImprovementArea[] = []

  if (analysis.vocabularyFluency.industryTermsUsage < 70) {
    improvements.push({
      competency: 'BUSINESS_IMPACT',
      currentLevel: analysis.vocabularyFluency.industryTermsUsage,
      targetLevel: 85,
      gap: 85 - analysis.vocabularyFluency.industryTermsUsage,
      priority: 'MEDIUM',
      specificFocus: `${getIndustryLabel(analysis.industryType)} Vocabulary Fluency`,
      examples: ['Increase industry-specific terminology', 'Demonstrate sector expertise', 'Use compliance-aware language'],
      practiceModules: ['Industry Communication', 'Sector-Specific Frameworks']
    })
  }

  if (analysis.benchmarkComparison.competitivePosition === 'DEVELOPING' || analysis.benchmarkComparison.competitivePosition === 'CONCERNING') {
    improvements.push({
      competency: 'COMMUNICATION',
      currentLevel: analysis.benchmarkComparison.userPercentile,
      targetLevel: 75,
      gap: 75 - analysis.benchmarkComparison.userPercentile,
      priority: 'HIGH',
      specificFocus: 'Industry Communication Standards',
      examples: ['Meet industry communication benchmarks', 'Adopt sector best practices', 'Demonstrate professional credibility'],
      practiceModules: ['Industry Standards', 'Professional Communication']
    })
  }

  return improvements
}

export const identifyPresenceImprovements = (analysis: any): ImprovementArea[] => {
  const improvements: ImprovementArea[] = []

  if (analysis.overallScore < 70) {
    const weakMarkers = analysis.presenceMarkers?.filter((marker: any) => marker.strength < 65) || []
    
    if (weakMarkers.length > 0) {
      improvements.push({
        competency: 'COMMUNICATION',
        currentLevel: analysis.overallScore,
        targetLevel: 80,
        gap: 80 - analysis.overallScore,
        priority: 'HIGH',
        specificFocus: 'Executive Presence Development',
        examples: ['Strengthen authority markers', 'Improve communication clarity', 'Develop conviction in delivery'],
        practiceModules: ['Executive Presence', 'Leadership Communication']
      })
    }
  }

  return improvements
}