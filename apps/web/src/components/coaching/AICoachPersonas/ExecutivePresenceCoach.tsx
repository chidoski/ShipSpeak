'use client'

import React from 'react'
import { 
  CoachingInteraction, 
  ExecutivePresenceCoaching,
  PMTransitionType,
  Industry 
} from '@/types/coaching'

interface ExecutivePresenceCoachProps {
  userMessage: string
  careerContext: PMTransitionType
  industryContext: Industry
  onResponse: (response: CoachingInteraction) => void
}

export function ExecutivePresenceCoach({
  userMessage,
  careerContext,
  industryContext,
  onResponse
}: ExecutivePresenceCoachProps) {

  const generateExecutivePresenceResponse = (message: string): CoachingInteraction => {
    const presenceAnalysis = analyzeExecutivePresence(message, careerContext)
    const response = generatePresenceCoachingResponse(message, careerContext, industryContext, presenceAnalysis)
    
    return {
      id: `interaction_${Date.now()}`,
      sessionId: 'current_session',
      timestamp: new Date(),
      userInput: message,
      coachResponse: response,
      developmentGoals: derivePresenceGoals(careerContext),
      realTimeCoaching: generatePresenceCoaching(message, presenceAnalysis),
      progressTracking: {
        skillArea: 'Executive Presence',
        improvementScore: calculatePresenceImprovement(message, presenceAnalysis),
        newLevel: undefined,
        achievement: undefined,
        nextFocus: 'Communication Authority'
      },
      type: 'COACH_RESPONSE'
    }
  }

  return null // Logic component
}

function analyzeExecutivePresence(message: string, careerContext: PMTransitionType): ExecutivePresenceCoaching {
  const authorityMarkers = detectAuthorityMarkers(message)
  const clarityScore = calculateClarityScore(message)
  const convictionLevel = assessConvictionLevel(message)
  const composureIndicators = identifyComposureIndicators(message)
  
  return {
    authorityMarkers,
    clarityScore,
    convictionLevel,
    composureIndicators,
    improvementAreas: identifyPresenceImprovements(message, careerContext),
    nextLevelGoals: getPresenceGoals(careerContext)
  }
}

function detectAuthorityMarkers(message: string): string[] {
  const markers: string[] = []
  const lowerMessage = message.toLowerCase()
  
  // Definitive language markers
  if (lowerMessage.includes('i recommend') || lowerMessage.includes('we should')) {
    markers.push('Definitive recommendation language')
  }
  
  if (lowerMessage.includes('based on') || lowerMessage.includes('the data shows')) {
    markers.push('Evidence-based reasoning')
  }
  
  if (lowerMessage.includes('three options') || lowerMessage.includes('two approaches')) {
    markers.push('Structured thinking presentation')
  }
  
  if (lowerMessage.includes('i believe') || lowerMessage.includes('i think')) {
    markers.push('Opinion markers (reduce for authority)')
  }
  
  if (lowerMessage.includes('maybe') || lowerMessage.includes('possibly')) {
    markers.push('Hedge language (reduces authority)')
  }
  
  return markers
}

function calculateClarityScore(message: string): number {
  let score = 50 // Base score
  
  // Positive clarity indicators
  if (message.includes('first') || message.includes('second') || message.includes('third')) score += 15
  if (message.includes('specifically') || message.includes('exactly')) score += 10
  if (message.includes('because') || message.includes('therefore')) score += 10
  if (message.split(' ').length < 50) score += 10 // Concise
  
  // Negative clarity indicators
  if (message.includes('um') || message.includes('uh')) score -= 10
  if (message.includes('sort of') || message.includes('kind of')) score -= 10
  if (message.split(' ').length > 100) score -= 15 // Too verbose
  
  return Math.max(0, Math.min(100, score))
}

function assessConvictionLevel(message: string): number {
  let conviction = 50
  const lowerMessage = message.toLowerCase()
  
  // High conviction indicators
  if (lowerMessage.includes('will') || lowerMessage.includes('must')) conviction += 20
  if (lowerMessage.includes('confident') || lowerMessage.includes('certain')) conviction += 15
  if (lowerMessage.includes('proven') || lowerMessage.includes('demonstrated')) conviction += 10
  
  // Low conviction indicators
  if (lowerMessage.includes('might') || lowerMessage.includes('could')) conviction -= 15
  if (lowerMessage.includes('hopefully') || lowerMessage.includes('probably')) conviction -= 10
  if (lowerMessage.includes('i guess') || lowerMessage.includes('i suppose')) conviction -= 20
  
  return Math.max(0, Math.min(100, conviction))
}

function identifyComposureIndicators(message: string): string[] {
  const indicators: string[] = []
  const lowerMessage = message.toLowerCase()
  
  if (message.split('.').length > 2) {
    indicators.push('Structured communication')
  }
  
  if (!lowerMessage.includes('um') && !lowerMessage.includes('uh')) {
    indicators.push('Fluent delivery')
  }
  
  if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult')) {
    indicators.push('Acknowledgment of complexity')
  }
  
  if (lowerMessage.includes('however') || lowerMessage.includes('nevertheless')) {
    indicators.push('Balanced perspective')
  }
  
  return indicators
}

function generatePresenceCoachingResponse(
  message: string,
  careerContext: PMTransitionType,
  industryContext: Industry,
  presenceAnalysis: ExecutivePresenceCoaching
) {
  const careerSpecificCoaching = getCareerPresenceCoaching(careerContext)
  const industrySpecificCoaching = getIndustryPresenceCoaching(industryContext)
  
  return {
    response: `${careerSpecificCoaching} ${industrySpecificCoaching} Let's work on strengthening your executive presence.`,
    coachingMethod: 'REAL_TIME_COACHING' as const,
    developmentFocus: ['Executive Presence', 'Communication Authority', 'Leadership Voice'],
    nextQuestions: generatePresenceQuestions(careerContext, presenceAnalysis),
    improvementSuggestions: getPresenceImprovements(presenceAnalysis, careerContext),
    confidenceLevel: 'HIGH' as const,
    tone: 'CHALLENGING' as const
  }
}

function getCareerPresenceCoaching(careerContext: PMTransitionType): string {
  const coaching = {
    'PO_TO_PM': "As you transition to PM, develop definitive language. Replace 'I think' with 'I recommend based on...'",
    'PM_TO_SENIOR_PM': "Senior PM presence requires answer-first structure. Lead with your conclusion, then provide evidence.",
    'SENIOR_PM_TO_GROUP_PM': "Group PM presence means balancing authority with collaboration. Show confidence while building consensus.",
    'GROUP_PM_TO_DIRECTOR': "Director-level presence requires strategic narrative. Connect every decision to business outcomes."
  }
  
  return coaching[careerContext]
}

function getIndustryPresenceCoaching(industry: Industry): string {
  const coaching = {
    'healthcare': "Healthcare executives emphasize patient outcome language and regulatory awareness.",
    'fintech': "Fintech executives balance innovation with risk management and compliance first.",
    'cybersecurity': "Security executives use threat-based reasoning and risk quantification.",
    'enterprise_software': "Enterprise executives focus on customer ROI and business case strength.",
    'consumer_technology': "Consumer tech executives emphasize growth metrics and user behavior insights."
  }
  
  return coaching[industry]
}

function generatePresenceQuestions(careerContext: PMTransitionType, analysis: ExecutivePresenceCoaching): string[] {
  const baseQuestions = [
    "How would you rephrase this with more authority?",
    "What evidence supports your position?",
    "How would a senior executive frame this?"
  ]
  
  const careerSpecificQuestions = {
    'PO_TO_PM': [
      "How does this create business value?",
      "What's your definitive recommendation?"
    ],
    'PM_TO_SENIOR_PM': [
      "What's your answer-first structure here?",
      "How would you present this to a CEO?"
    ],
    'SENIOR_PM_TO_GROUP_PM': [
      "How do you balance authority with collaboration?",
      "What's the portfolio impact?"
    ],
    'GROUP_PM_TO_DIRECTOR': [
      "What's the strategic narrative?",
      "How does this position the business?"
    ]
  }
  
  if (analysis.clarityScore < 70) {
    baseQuestions.push("How can you make this more concise and clear?")
  }
  
  if (analysis.convictionLevel < 70) {
    baseQuestions.push("What would make you more confident in this position?")
  }
  
  return [...baseQuestions, ...careerSpecificQuestions[careerContext]]
}

function getPresenceImprovements(analysis: ExecutivePresenceCoaching, careerContext: PMTransitionType): string[] {
  const improvements: string[] = []
  
  if (analysis.clarityScore < 70) {
    improvements.push("Use more structured communication (first, second, third)")
  }
  
  if (analysis.convictionLevel < 70) {
    improvements.push("Replace tentative language with definitive statements")
  }
  
  if (analysis.authorityMarkers.includes('Opinion markers')) {
    improvements.push("Use evidence-based language instead of opinion markers")
  }
  
  if (analysis.authorityMarkers.includes('Hedge language')) {
    improvements.push("Eliminate hedge words that reduce authority")
  }
  
  improvements.push("Practice answer-first communication structure")
  improvements.push("Strengthen connection between statements and business outcomes")
  
  return improvements
}

function identifyPresenceImprovements(message: string, careerContext: PMTransitionType): string[] {
  const improvements: string[] = []
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('i think') || lowerMessage.includes('i believe')) {
    improvements.push('Replace opinion language with definitive statements')
  }
  
  if (lowerMessage.includes('maybe') || lowerMessage.includes('possibly')) {
    improvements.push('Eliminate hedge language')
  }
  
  if (!lowerMessage.includes('because') && !lowerMessage.includes('therefore')) {
    improvements.push('Add causal reasoning to strengthen arguments')
  }
  
  if (message.split(' ').length > 100) {
    improvements.push('Practice more concise communication')
  }
  
  return improvements
}

function getPresenceGoals(careerContext: PMTransitionType): string[] {
  const goals = {
    'PO_TO_PM': ['Develop definitive language', 'Practice business outcome connection'],
    'PM_TO_SENIOR_PM': ['Master answer-first structure', 'Build executive communication'],
    'SENIOR_PM_TO_GROUP_PM': ['Balance authority with collaboration', 'Develop team influence'],
    'GROUP_PM_TO_DIRECTOR': ['Create strategic narrative', 'Master board presentation skills']
  }
  
  return goals[careerContext]
}

function derivePresenceGoals(careerContext: PMTransitionType) {
  return [{
    id: 'executive_presence_development',
    title: 'Build Executive Presence',
    description: 'Develop authority, clarity, and conviction in communication',
    category: 'LEADERSHIP',
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    priority: 'HIGH' as const,
    progress: 0,
    milestones: ['Authority Development', 'Clarity Mastery', 'Conviction Building'],
    relatedSkills: ['Executive Communication', 'Leadership Presence', 'Influence']
  }]
}

function generatePresenceCoaching(message: string, analysis: ExecutivePresenceCoaching) {
  return {
    communicationPattern: "Executive presence assessment",
    improvementTip: `Clarity: ${analysis.clarityScore}%, Conviction: ${analysis.convictionLevel}%`,
    confidenceIndicator: analysis.convictionLevel,
    executivePresenceScore: Math.round((analysis.clarityScore + analysis.convictionLevel) / 2),
    frameworkUsage: ['Executive Presence'],
    nextLevelSuggestion: analysis.improvementAreas[0] || "Continue developing authoritative communication"
  }
}

function calculatePresenceImprovement(message: string, analysis: ExecutivePresenceCoaching): number {
  return Math.round((analysis.clarityScore + analysis.convictionLevel) / 2)
}