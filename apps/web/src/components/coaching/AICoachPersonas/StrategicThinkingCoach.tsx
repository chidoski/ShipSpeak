'use client'

import React from 'react'
import { 
  CoachPersona, 
  CoachingInteraction, 
  FrameworkPractice,
  PMTransitionType,
  Industry 
} from '@/types/coaching'

interface StrategicThinkingCoachProps {
  coach: CoachPersona
  userMessage: string
  careerContext: PMTransitionType
  industryContext: Industry
  onResponse: (response: CoachingInteraction) => void
}

export function StrategicThinkingCoach({
  coach,
  userMessage,
  careerContext,
  industryContext,
  onResponse
}: StrategicThinkingCoachProps) {

  const generateStrategicThinkingResponse = (message: string): CoachingInteraction => {
    const framework = detectFrameworkOpportunity(message, careerContext)
    const response = generateCoachingResponse(message, careerContext, industryContext, framework)
    
    return {
      id: `interaction_${Date.now()}`,
      sessionId: 'current_session',
      timestamp: new Date(),
      userInput: message,
      coachResponse: response,
      developmentGoals: deriveStrategicGoals(careerContext),
      realTimeCoaching: generateRealTimeCoaching(message, careerContext),
      progressTracking: {
        skillArea: 'Strategic Thinking',
        improvementScore: calculateStrategicImprovement(message),
        newLevel: undefined,
        achievement: undefined,
        nextFocus: 'Framework Integration'
      },
      type: 'COACH_RESPONSE'
    }
  }

  return null // This is a logic component, no UI
}

// Strategic thinking coaching logic
function detectFrameworkOpportunity(message: string, careerContext: PMTransitionType): string {
  const lowerMessage = message.toLowerCase()
  
  // Detect framework usage opportunities
  if (lowerMessage.includes('priorit')) return 'RICE'
  if (lowerMessage.includes('feature') || lowerMessage.includes('roadmap')) return 'ICE'
  if (lowerMessage.includes('customer') || lowerMessage.includes('user')) return 'JOBS_TO_BE_DONE'
  if (lowerMessage.includes('goal') || lowerMessage.includes('metric')) return 'OKR'
  if (lowerMessage.includes('decision') || lowerMessage.includes('trade-off')) return 'DECISION_MATRIX'
  
  // Career-specific framework suggestions
  switch (careerContext) {
    case 'PO_TO_PM':
      return 'CUSTOMER_OUTCOME_FRAMEWORK'
    case 'PM_TO_SENIOR_PM':
      return 'STRATEGIC_ALTITUDE'
    case 'SENIOR_PM_TO_GROUP_PM':
      return 'PORTFOLIO_STRATEGY'
    case 'GROUP_PM_TO_DIRECTOR':
      return 'BUSINESS_MODEL_ANALYSIS'
    default:
      return 'STRATEGIC_THINKING'
  }
}

function generateCoachingResponse(
  message: string,
  careerContext: PMTransitionType,
  industryContext: Industry,
  framework: string
) {
  const responses = getCoachingResponses(careerContext, industryContext)
  const frameworkGuidance = getFrameworkGuidance(framework, careerContext)
  
  return {
    response: responses.mainResponse + ' ' + frameworkGuidance,
    coachingMethod: 'SOCRATIC_QUESTIONING' as const,
    developmentFocus: getStrategicFocus(careerContext),
    nextQuestions: generateSocraticQuestions(careerContext, framework),
    improvementSuggestions: getStrategicSuggestions(careerContext, industryContext),
    frameworkReference: framework,
    confidenceLevel: 'MEDIUM' as const,
    tone: 'ENCOURAGING' as const
  }
}

function getCoachingResponses(careerContext: PMTransitionType, industryContext: Industry) {
  const careerResponses = {
    'PO_TO_PM': {
      mainResponse: "I hear you're working through a strategic challenge. As you transition from PO to PM, let's focus on expanding your strategic thinking from feature delivery to customer outcome creation.",
      industrySpecific: getIndustryContext(industryContext, 'PO_TO_PM')
    },
    'PM_TO_SENIOR_PM': {
      mainResponse: "Great question! This is exactly the kind of strategic thinking that separates senior PMs. Let's work on your altitude control - knowing when to dive deep and when to stay strategic.",
      industrySpecific: getIndustryContext(industryContext, 'PM_TO_SENIOR_PM')
    },
    'SENIOR_PM_TO_GROUP_PM': {
      mainResponse: "Excellent strategic challenge. As you move toward Group PM, we need to develop your portfolio thinking - how does this decision impact the broader product ecosystem?",
      industrySpecific: getIndustryContext(industryContext, 'SENIOR_PM_TO_GROUP_PM')
    },
    'GROUP_PM_TO_DIRECTOR': {
      mainResponse: "This is director-level strategic thinking. Let's explore how this connects to business model implications and organizational strategy.",
      industrySpecific: getIndustryContext(industryContext, 'GROUP_PM_TO_DIRECTOR')
    }
  }
  
  return careerResponses[careerContext]
}

function getIndustryContext(industry: Industry, transition: PMTransitionType): string {
  const contexts = {
    'healthcare': {
      'PO_TO_PM': 'In healthcare, strategic thinking means balancing patient outcomes with regulatory requirements.',
      'PM_TO_SENIOR_PM': 'Healthcare PMs must master clinical evidence integration and regulatory pathway thinking.',
      'SENIOR_PM_TO_GROUP_PM': 'Portfolio strategy in healthcare requires understanding clinical trial timelines and market access.',
      'GROUP_PM_TO_DIRECTOR': 'Director-level healthcare thinking involves market access strategy and regulatory positioning.'
    },
    'fintech': {
      'PO_TO_PM': 'In fintech, shift from feature thinking to trust and compliance-first strategic reasoning.',
      'PM_TO_SENIOR_PM': 'Senior fintech PMs balance innovation with regulatory compliance and risk management.',
      'SENIOR_PM_TO_GROUP_PM': 'Fintech portfolio strategy requires understanding regulatory landscapes and partnership ecosystems.',
      'GROUP_PM_TO_DIRECTOR': 'Director-level fintech thinking involves business model innovation within regulatory constraints.'
    },
    'cybersecurity': {
      'PO_TO_PM': 'Cybersecurity strategic thinking means shifting from feature security to comprehensive threat modeling.',
      'PM_TO_SENIOR_PM': 'Senior cybersecurity PMs master risk-based prioritization and threat landscape integration.',
      'SENIOR_PM_TO_GROUP_PM': 'Portfolio strategy requires understanding enterprise security architecture and compliance frameworks.',
      'GROUP_PM_TO_DIRECTOR': 'Director-level thinking involves security market positioning and competitive differentiation.'
    },
    'enterprise_software': {
      'PO_TO_PM': 'Enterprise PM thinking focuses on customer ROI and implementation success rather than features.',
      'PM_TO_SENIOR_PM': 'Senior enterprise PMs master customer success integration and renewal strategy.',
      'SENIOR_PM_TO_GROUP_PM': 'Portfolio strategy requires understanding enterprise sales cycles and customer expansion.',
      'GROUP_PM_TO_DIRECTOR': 'Director-level thinking involves platform strategy and ecosystem development.'
    },
    'consumer_technology': {
      'PO_TO_PM': 'Consumer PM thinking shifts from engagement metrics to behavior psychology and network effects.',
      'PM_TO_SENIOR_PM': 'Senior consumer PMs master growth metrics and viral coefficient optimization.',
      'SENIOR_PM_TO_GROUP_PM': 'Portfolio strategy requires understanding platform dynamics and user ecosystem growth.',
      'GROUP_PM_TO_DIRECTOR': 'Director-level thinking involves market expansion and platform monetization strategy.'
    }
  }
  
  return contexts[industry]?.[transition] || 'Industry-specific strategic context not available.'
}

function getFrameworkGuidance(framework: string, careerContext: PMTransitionType): string {
  const guidance = {
    'RICE': "Let's apply RICE prioritization. What's the Reach, Impact, Confidence, and Effort for this decision?",
    'ICE': "Consider the ICE framework: Impact, Confidence, Ease. How would you score each dimension?",
    'JOBS_TO_BE_DONE': "Think Jobs-to-be-Done: What job is the customer hiring your product to do?",
    'OKR': "Frame this with OKRs: What's the Objective, and what Key Results would indicate success?",
    'CUSTOMER_OUTCOME_FRAMEWORK': "Focus on customer outcomes: What value does this create for users?",
    'STRATEGIC_ALTITUDE': "Practice altitude control: Are you operating at the right strategic level?",
    'PORTFOLIO_STRATEGY': "Think portfolio-wide: How does this impact the broader product ecosystem?",
    'BUSINESS_MODEL_ANALYSIS': "Consider business model implications: How does this affect revenue and competitive positioning?"
  }
  
  return guidance[framework] || "Let's explore the strategic framework that applies here."
}

function getStrategicFocus(careerContext: PMTransitionType): string[] {
  const focus = {
    'PO_TO_PM': ['Customer Outcome Focus', 'Business Value Creation', 'Stakeholder Alignment'],
    'PM_TO_SENIOR_PM': ['Strategic Altitude', 'Framework Integration', 'Executive Communication'],
    'SENIOR_PM_TO_GROUP_PM': ['Portfolio Thinking', 'Resource Strategy', 'Team Development'],
    'GROUP_PM_TO_DIRECTOR': ['Business Model Strategy', 'Market Positioning', 'Organizational Leadership']
  }
  
  return focus[careerContext]
}

function generateSocraticQuestions(careerContext: PMTransitionType, framework: string): string[] {
  const baseQuestions = [
    "What's the core business problem you're solving?",
    "How would you measure success here?",
    "What trade-offs are you considering?",
    "How does this align with broader strategy?"
  ]
  
  const careerSpecificQuestions = {
    'PO_TO_PM': [
      "What customer outcome does this create?",
      "How does this connect to business metrics?",
      "What stakeholders need to be aligned?"
    ],
    'PM_TO_SENIOR_PM': [
      "What's the strategic altitude for this decision?",
      "How would you communicate this to executives?",
      "What framework best applies here?"
    ],
    'SENIOR_PM_TO_GROUP_PM': [
      "How does this impact the product portfolio?",
      "What resource implications should we consider?",
      "How would you coach a junior PM on this?"
    ],
    'GROUP_PM_TO_DIRECTOR': [
      "What are the business model implications?",
      "How does this position us competitively?",
      "What organizational changes are needed?"
    ]
  }
  
  return [...baseQuestions, ...careerSpecificQuestions[careerContext]]
}

function getStrategicSuggestions(careerContext: PMTransitionType, industryContext: Industry): string[] {
  return [
    "Practice the answer-first communication structure",
    "Integrate industry-specific context into your reasoning",
    "Use frameworks to structure your strategic thinking",
    "Connect decisions to business outcomes explicitly"
  ]
}

function deriveStrategicGoals(careerContext: PMTransitionType) {
  return [{
    id: 'strategic_thinking_improvement',
    title: 'Enhance Strategic Thinking',
    description: 'Develop PM-level strategic reasoning and framework application',
    category: 'STRATEGIC',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    priority: 'HIGH' as const,
    progress: 0,
    milestones: ['Framework Mastery', 'Strategic Communication', 'Business Context Integration'],
    relatedSkills: ['Strategic Thinking', 'Framework Application', 'Business Reasoning']
  }]
}

function generateRealTimeCoaching(message: string, careerContext: PMTransitionType) {
  return {
    communicationPattern: "Strategic reasoning detected",
    improvementTip: "Structure your thinking with a clear framework",
    confidenceIndicator: 75,
    executivePresenceScore: 80,
    frameworkUsage: ['Strategic Thinking'],
    nextLevelSuggestion: "Add quantitative business impact to strengthen your argument"
  }
}

function calculateStrategicImprovement(message: string): number {
  // Mock calculation based on message content
  let score = 50 // Base score
  
  if (message.includes('customer') || message.includes('user')) score += 10
  if (message.includes('business') || message.includes('revenue')) score += 10
  if (message.includes('strategy') || message.includes('strategic')) score += 10
  if (message.includes('framework') || message.includes('process')) score += 10
  if (message.includes('data') || message.includes('metric')) score += 10
  
  return Math.min(score, 100)
}