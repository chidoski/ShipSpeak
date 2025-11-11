/**
 * Confidence Indicator Analyzer - Analyzes confidence markers and conviction in communication
 * ShipSpeak Slice 5 Refactoring
 */

import { ConfidenceIndicator } from '../../../../types/transcript-analysis'

export const analyzeConfidenceIndicators = async (
  transcriptContent: string
): Promise<ConfidenceIndicator[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const indicators: ConfidenceIndicator[] = []

  // Analyze different types of confidence indicators
  const vocalConfidence = analyzeVocalConfidence(transcriptContent)
  if (vocalConfidence.strength > 0) indicators.push(vocalConfidence)

  const decisiveness = analyzeDecisiveness(transcriptContent)
  if (decisiveness.strength > 0) indicators.push(decisiveness)

  const assertiveness = analyzeAssertiveness(transcriptContent)
  if (assertiveness.strength > 0) indicators.push(assertiveness)

  const certaintyLanguage = analyzeCertaintyLanguage(transcriptContent)
  if (certaintyLanguage.strength > 0) indicators.push(certaintyLanguage)

  return indicators.sort((a, b) => b.strength - a.strength)
}

export const analyzeVocalConfidence = (content: string): ConfidenceIndicator => {
  const patterns = [
    /\b(clearly|obviously|definitely|absolutely|certainly)\b/gi,
    /\b(confident|sure|positive|convinced|certain)\b/gi,
    /\b(without\s+doubt|no\s+question|undoubtedly)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    type: 'Vocal Confidence',
    strength: Math.min(totalMatches * 12, 90),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    impact: calculateConfidenceImpact(totalMatches)
  }
}

export const analyzeDecisiveness = (content: string): ConfidenceIndicator => {
  const patterns = [
    /\b(decide|decision|choose|select|commit)\b/gi,
    /\b(will\s+proceed|moving\s+forward|next\s+step)\b/gi,
    /\b(final|conclude|determine|resolve)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    type: 'Decisiveness',
    strength: Math.min(totalMatches * 15, 95),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    impact: calculateConfidenceImpact(totalMatches)
  }
}

export const analyzeAssertiveness = (content: string): ConfidenceIndicator => {
  const patterns = [
    /\b(recommend|suggest|propose|advise|insist)\b/gi,
    /\b(should|must|need\s+to|have\s+to|require)\b/gi,
    /\b(important|critical|essential|necessary)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    type: 'Assertiveness',
    strength: Math.min(totalMatches * 10, 85),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    impact: calculateConfidenceImpact(totalMatches)
  }
}

export const analyzeCertaintyLanguage = (content: string): ConfidenceIndicator => {
  const patterns = [
    /\b(proven|established|verified|confirmed|validated)\b/gi,
    /\b(fact|evidence|truth|reality|actual)\b/gi,
    /\b(guarantee|ensure|promise|deliver|achieve)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    type: 'Certainty Language',
    strength: Math.min(totalMatches * 13, 92),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    impact: calculateConfidenceImpact(totalMatches)
  }
}

export const calculateConfidenceImpact = (frequency: number): 'LOW' | 'MEDIUM' | 'HIGH' => {
  if (frequency >= 8) return 'HIGH'
  if (frequency >= 4) return 'MEDIUM'
  return 'LOW'
}