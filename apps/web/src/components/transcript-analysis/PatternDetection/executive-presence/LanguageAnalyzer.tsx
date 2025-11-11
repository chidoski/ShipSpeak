/**
 * Language Analyzer - Analyzes leadership language sophistication and strategic communication
 * ShipSpeak Slice 5 Refactoring
 */

import { LanguageAnalysis } from '../../../../types/transcript-analysis'
import { PMCareerLevel } from '../../../../types/competency'

export const analyzeLeadershipLanguage = async (
  transcriptContent: string,
  careerLevel: PMCareerLevel
): Promise<LanguageAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const strategicLanguage = analyzeStrategicLanguage(transcriptContent)
  const technicalDepth = analyzeTechnicalDepth(transcriptContent, careerLevel)
  const stakeholderAwareness = analyzeStakeholderAwareness(transcriptContent)
  const businessImpact = analyzeBusinessImpact(transcriptContent)

  return {
    strategicLanguage,
    technicalDepth,
    stakeholderAwareness,
    businessImpact,
    overallSophistication: calculateLanguageSophistication({
      strategicLanguage,
      technicalDepth,
      stakeholderAwareness,
      businessImpact
    })
  }
}

export const analyzeStrategicLanguage = (content: string): number => {
  const strategicPatterns = [
    /\b(strategic|roadmap|vision|long-term|competitive|market|positioning)\b/gi,
    /\b(initiative|portfolio|platform|ecosystem|transformation)\b/gi,
    /\b(differentiation|value\s+prop|competitive\s+advantage|moat)\b/gi,
    /\b(scale|growth|expand|optimize|efficiency|leverage)\b/gi
  ]

  let totalMatches = 0
  strategicPatterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
  })

  return Math.min(totalMatches * 8, 95)
}

export const analyzeTechnicalDepth = (content: string, careerLevel: PMCareerLevel): number => {
  const technicalPatterns = [
    /\b(architecture|infrastructure|scalability|performance|integration)\b/gi,
    /\b(API|database|cloud|security|analytics|metrics)\b/gi,
    /\b(algorithm|data\s+structure|optimization|latency|throughput)\b/gi,
    /\b(microservices|containers|deployment|CI\/CD|automation)\b/gi
  ]

  let totalMatches = 0
  technicalPatterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
  })

  // Adjust expectations based on career level
  const levelMultiplier = {
    IC: 1.0,
    SENIOR: 0.8,
    STAFF: 0.6,
    PRINCIPAL: 0.4,
    DIRECTOR: 0.3,
    VP: 0.2
  }[careerLevel] || 0.8

  return Math.min(totalMatches * 6 * levelMultiplier, 90)
}

export const analyzeStakeholderAwareness = (content: string): number => {
  const stakeholderPatterns = [
    /\b(stakeholder|customer|user|executive|leadership|team)\b/gi,
    /\b(alignment|consensus|buy-in|support|engagement)\b/gi,
    /\b(communication|feedback|concerns|expectations|requirements)\b/gi,
    /\b(cross-functional|collaboration|partnership|coordination)\b/gi
  ]

  let totalMatches = 0
  stakeholderPatterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
  })

  return Math.min(totalMatches * 7, 95)
}

export const analyzeBusinessImpact = (content: string): number => {
  const businessPatterns = [
    /\b(revenue|profit|cost|ROI|conversion|retention|growth)\b/gi,
    /\b(market\s+share|customer\s+satisfaction|NPS|churn|acquisition)\b/gi,
    /\b(KPI|metrics|OKR|target|goal|outcome|results)\b/gi,
    /\b(business\s+case|value|impact|opportunity|risk|investment)\b/gi
  ]

  let totalMatches = 0
  businessPatterns.forEach(pattern => {
    const matches = content.match(pattern) || []
    totalMatches += matches.length
  })

  return Math.min(totalMatches * 10, 95)
}

export const calculateLanguageSophistication = (analysis: {
  strategicLanguage: number
  technicalDepth: number
  stakeholderAwareness: number
  businessImpact: number
}): number => {
  const weights = {
    strategic: 0.3,
    technical: 0.2,
    stakeholder: 0.25,
    business: 0.25
  }

  return Math.round(
    analysis.strategicLanguage * weights.strategic +
    analysis.technicalDepth * weights.technical +
    analysis.stakeholderAwareness * weights.stakeholder +
    analysis.businessImpact * weights.business
  )
}