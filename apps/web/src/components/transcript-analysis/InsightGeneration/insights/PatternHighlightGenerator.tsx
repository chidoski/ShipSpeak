/**
 * Pattern Highlight Generator - Extracts key communication patterns as highlights
 * ShipSpeak Slice 5 Refactoring
 */

import {
  PatternHighlight,
  PMTransitionDetection,
  IndustryPatternAnalysis,
  MeetingTypeAnalysis
} from '../../../../types/transcript-analysis'
import { getSignificanceWeight } from '../../../../utils/patternAnalysisUtils'

export const generatePatternHighlights = async (
  transitionAnalysis: PMTransitionDetection,
  industryAnalysis: IndustryPatternAnalysis,
  meetingTypeAnalysis: MeetingTypeAnalysis,
  executivePresence: any
): Promise<PatternHighlight[]> => {
  await new Promise(resolve => setTimeout(resolve, 600))

  const highlights: PatternHighlight[] = []

  // Transition-based highlights
  const transitionHighlights = extractTransitionHighlights(transitionAnalysis)
  highlights.push(...transitionHighlights)

  // Industry-specific highlights
  const industryHighlights = extractIndustryHighlights(industryAnalysis)
  highlights.push(...industryHighlights)

  // Meeting type effectiveness highlights
  const meetingHighlights = extractMeetingHighlights(meetingTypeAnalysis)
  highlights.push(...meetingHighlights)

  // Executive presence highlights
  const presenceHighlights = extractPresenceHighlights(executivePresence)
  highlights.push(...presenceHighlights)

  // Sort by significance and return top highlights
  return highlights
    .sort((a, b) => (b.score * getSignificanceWeight(b.significance)) - (a.score * getSignificanceWeight(a.significance)))
    .slice(0, 6)
}

export const extractTransitionHighlights = (analysis: PMTransitionDetection): PatternHighlight[] => {
  const highlights: PatternHighlight[] = []
  
  // Check transition readiness markers
  const transitionKey = `${analysis.currentLevel}_${analysis.targetLevel}`
  
  if (analysis.progressScore >= 80) {
    highlights.push({
      pattern: 'Career Transition Readiness',
      score: analysis.progressScore,
      evidence: [`${analysis.progressScore}% transition readiness score`, 'Strong framework usage', 'Executive communication emerging'],
      significance: 'HIGH',
      careerImpact: `Ready for ${analysis.targetLevel} role - demonstrate consistent execution`
    })
  } else if (analysis.progressScore >= 60) {
    highlights.push({
      pattern: 'Developing Transition Skills',
      score: analysis.progressScore,
      evidence: [`${analysis.progressScore}% transition readiness`, 'Some patterns emerging', 'Clear development path'],
      significance: 'MEDIUM',
      careerImpact: `On track for ${analysis.targetLevel} - focus on key skill gaps`
    })
  }

  return highlights
}

export const extractIndustryHighlights = (analysis: IndustryPatternAnalysis): PatternHighlight[] => {
  const highlights: PatternHighlight[] = []
  
  if (analysis.vocabularyFluency.professionalCredibility >= 80) {
    highlights.push({
      pattern: 'Industry Expertise Communication',
      score: analysis.vocabularyFluency.professionalCredibility,
      evidence: [
        `${analysis.vocabularyFluency.industryTermsUsage}% industry term usage`,
        `${analysis.vocabularyFluency.contextualAppropriateness}% contextual appropriateness`,
        'Strong professional credibility markers'
      ],
      significance: 'HIGH',
      careerImpact: 'Industry fluency supports senior role credibility'
    })
  }

  if (analysis.benchmarkComparison.competitivePosition === 'LEADING') {
    highlights.push({
      pattern: 'Industry Leadership Communication',
      score: analysis.benchmarkComparison.userPercentile,
      evidence: [`${analysis.benchmarkComparison.userPercentile}th percentile performance`, 'Above industry average', 'Leading competitive position'],
      significance: 'HIGH',
      careerImpact: 'Communication style positions for industry leadership roles'
    })
  }

  return highlights
}

export const extractMeetingHighlights = (analysis: MeetingTypeAnalysis): PatternHighlight[] => {
  const highlights: PatternHighlight[] = []
  
  if (analysis.effectivenessScore >= 80) {
    highlights.push({
      pattern: `${analysis.meetingType.replace('_', ' ')} Mastery`,
      score: analysis.effectivenessScore,
      evidence: [`${analysis.effectivenessScore}% effectiveness score`, 'Strong contextual adaptation', 'Appropriate communication patterns'],
      significance: 'HIGH',
      careerImpact: `Excellent ${analysis.meetingType.toLowerCase()} communication supports leadership credibility`
    })
  }

  // Check audience adaptation scores
  const adaptationScores = Object.entries(analysis.audienceAdaptation)
  const highAdaptation = adaptationScores.filter(([_, score]) => score >= 80)
  
  if (highAdaptation.length >= 3) {
    highlights.push({
      pattern: 'Multi-Audience Communication',
      score: Math.max(...Object.values(analysis.audienceAdaptation)),
      evidence: highAdaptation.map(([audience, score]) => `${audience}: ${score}%`),
      significance: 'MEDIUM',
      careerImpact: 'Strong stakeholder adaptation indicates senior PM readiness'
    })
  }

  return highlights
}

export const extractPresenceHighlights = (analysis: any): PatternHighlight[] => {
  const highlights: PatternHighlight[] = []
  
  if (analysis.overallScore >= 80) {
    highlights.push({
      pattern: 'Executive Presence',
      score: analysis.overallScore,
      evidence: ['Strong authority markers', 'Clear communication structure', 'Confident decision making'],
      significance: 'HIGH',
      careerImpact: 'Executive presence supports leadership role progression'
    })
  }

  // Check for specific strong presence markers
  const strongMarkers = analysis.presenceMarkers?.filter((marker: any) => marker.strength >= 85) || []
  if (strongMarkers.length > 0) {
    highlights.push({
      pattern: `Strong ${strongMarkers[0].type}`,
      score: strongMarkers[0].strength,
      evidence: strongMarkers[0].evidence || [],
      significance: 'MEDIUM',
      careerImpact: `Strong ${strongMarkers[0].type.toLowerCase()} demonstrates leadership potential`
    })
  }

  return highlights
}