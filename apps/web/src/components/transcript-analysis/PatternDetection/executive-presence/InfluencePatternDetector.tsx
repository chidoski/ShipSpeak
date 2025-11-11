/**
 * Influence Pattern Detector - Detects influence techniques and persuasion effectiveness
 * ShipSpeak Slice 5 Refactoring
 */

import { InfluencePattern } from '../../../../types/transcript-analysis'

export const detectInfluencePatterns = async (
  transcriptContent: string,
  speakers: any[]
): Promise<InfluencePattern[]> => {
  await new Promise(resolve => setTimeout(resolve, 700))
  
  const patterns: InfluencePattern[] = []

  // Detect various influence techniques
  const socialProof = detectSocialProofPatterns(transcriptContent)
  if (socialProof.strength > 0) patterns.push(socialProof)

  const authority = detectAuthorityPatterns(transcriptContent)
  if (authority.strength > 0) patterns.push(authority)

  const consensus = detectConsensusBuilding(transcriptContent)
  if (consensus.strength > 0) patterns.push(consensus)

  const storytelling = detectStorytelling(transcriptContent)
  if (storytelling.strength > 0) patterns.push(storytelling)

  const dataReasoning = detectDataDrivenReasoning(transcriptContent)
  if (dataReasoning.strength > 0) patterns.push(dataReasoning)

  return patterns.sort((a, b) => b.strength - a.strength)
}

export const detectSocialProofPatterns = (content: string): InfluencePattern => {
  const patterns = [
    /\b(other\s+companies|industry\s+standard|best\s+practice|benchmark)\b/gi,
    /\b(proven\s+approach|successful|track\s+record|established)\b/gi,
    /\b(widely\s+adopted|commonly\s+used|standard\s+practice)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    technique: 'Social Proof',
    strength: Math.min(totalMatches * 12, 90),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    effectiveness: calculateEffectiveness(totalMatches, 'social_proof')
  }
}

export const detectAuthorityPatterns = (content: string): InfluencePattern => {
  const patterns = [
    /\b(experience|expertise|background|credentials|qualified)\b/gi,
    /\b(research\s+shows|studies\s+indicate|data\s+suggests)\b/gi,
    /\b(expert|specialist|authority|leader\s+in)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    technique: 'Authority',
    strength: Math.min(totalMatches * 15, 95),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    effectiveness: calculateEffectiveness(totalMatches, 'authority')
  }
}

export const detectConsensusBuilding = (content: string): InfluencePattern => {
  const patterns = [
    /\b(agree|consensus|alignment|common\s+ground|shared)\b/gi,
    /\b(together|collaborative|joint|unified|collective)\b/gi,
    /\b(everyone|all\s+of\s+us|team|group|we\s+all)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    technique: 'Consensus Building',
    strength: Math.min(totalMatches * 10, 85),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    effectiveness: calculateEffectiveness(totalMatches, 'consensus')
  }
}

export const detectStorytelling = (content: string): InfluencePattern => {
  const patterns = [
    /\b(story|example|case|situation|experience|instance)\b/gi,
    /\b(imagine|picture\s+this|for\s+example|think\s+about)\b/gi,
    /\b(scenario|use\s+case|real\s+world|actual|concrete)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    technique: 'Storytelling',
    strength: Math.min(totalMatches * 8, 80),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    effectiveness: calculateEffectiveness(totalMatches, 'storytelling')
  }
}

export const detectDataDrivenReasoning = (content: string): InfluencePattern => {
  const patterns = [
    /\b(data|metrics|numbers|statistics|analysis|research)\b/gi,
    /\b(evidence|proof|facts|findings|results|insights)\b/gi,
    /\b(\d+%|\d+\.\d+%|increase|decrease|improved|growth)\b/gi
  ]

  let totalMatches = 0
  const examples: string[] = []

  patterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
    examples.push(...matches.slice(0, 2))
  })

  return {
    technique: 'Data-Driven Reasoning',
    strength: Math.min(totalMatches * 11, 90),
    frequency: totalMatches,
    examples: examples.slice(0, 3),
    effectiveness: calculateEffectiveness(totalMatches, 'data_driven')
  }
}

export const calculateEffectiveness = (frequency: number, technique: string): 'LOW' | 'MEDIUM' | 'HIGH' => {
  const thresholds = {
    social_proof: { low: 2, high: 6 },
    authority: { low: 3, high: 8 },
    consensus: { low: 4, high: 10 },
    storytelling: { low: 3, high: 7 },
    data_driven: { low: 5, high: 12 }
  }

  const threshold = thresholds[technique as keyof typeof thresholds] || { low: 3, high: 8 }

  if (frequency >= threshold.high) return 'HIGH'
  if (frequency >= threshold.low) return 'MEDIUM'
  return 'LOW'
}