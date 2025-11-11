'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  CoachingInteraction,
  RealTimeCoaching as RealTimeCoachingType,
  PMTransitionType,
  Industry
} from '@/types/coaching'
import { Card } from '@/components/ui/Card'

interface RealTimeCoachingProps {
  userInput: string
  careerContext: PMTransitionType
  industryContext: Industry
  isActive: boolean
  onFeedback: (feedback: RealTimeCoachingType) => void
}

interface FeedbackItem {
  id: string
  type: 'STRENGTH' | 'IMPROVEMENT' | 'SUGGESTION' | 'FRAMEWORK'
  message: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  timestamp: Date
  dismissed: boolean
}

export function RealTimeCoaching({
  userInput,
  careerContext,
  industryContext,
  isActive,
  onFeedback
}: RealTimeCoachingProps) {
  const [activeFeedback, setActiveFeedback] = useState<FeedbackItem[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(true)
  const analysisTimeoutRef = useRef<NodeJS.Timeout>()

  // Real-time analysis of user input
  useEffect(() => {
    if (!isActive || !userInput.trim()) {
      return
    }

    setIsAnalyzing(true)
    
    // Clear existing timeout
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    // Debounce analysis for 500ms
    analysisTimeoutRef.current = setTimeout(() => {
      const feedback = analyzeUserInput(userInput, careerContext, industryContext)
      const newFeedbackItems = generateFeedbackItems(feedback, userInput)
      
      setActiveFeedback(prev => {
        const nonDismissed = prev.filter(item => !item.dismissed)
        const merged = [...nonDismissed, ...newFeedbackItems]
        return merged.slice(-5) // Keep only last 5 items
      })
      
      onFeedback(feedback)
      setIsAnalyzing(false)
    }, 500)

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }
    }
  }, [userInput, careerContext, industryContext, isActive, onFeedback])

  const dismissFeedback = (id: string) => {
    setActiveFeedback(prev =>
      prev.map(item =>
        item.id === id ? { ...item, dismissed: true } : item
      )
    )
  }

  const visibleFeedback = activeFeedback.filter(item => !item.dismissed)

  if (!isActive || (!isAnalyzing && visibleFeedback.length === 0)) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 max-h-96 overflow-hidden shadow-lg">
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Real-time Coaching</span>
          </div>
          <button
            onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
            className="text-white hover:text-blue-100 transition-colors"
          >
            {showFeedbackPanel ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>

        {showFeedbackPanel && (
          <div className="max-h-80 overflow-y-auto">
            {isAnalyzing && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm text-gray-600">Analyzing communication patterns...</span>
                </div>
              </div>
            )}

            {visibleFeedback.length === 0 && !isAnalyzing ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Start typing to receive real-time coaching feedback
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {visibleFeedback.map((feedback) => (
                  <FeedbackItem
                    key={feedback.id}
                    feedback={feedback}
                    onDismiss={() => dismissFeedback(feedback.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

function FeedbackItem({ 
  feedback, 
  onDismiss 
}: { 
  feedback: FeedbackItem
  onDismiss: () => void 
}) {
  const typeStyles = {
    STRENGTH: 'bg-green-50 border-l-4 border-l-green-400',
    IMPROVEMENT: 'bg-yellow-50 border-l-4 border-l-yellow-400',
    SUGGESTION: 'bg-blue-50 border-l-4 border-l-blue-400',
    FRAMEWORK: 'bg-purple-50 border-l-4 border-l-purple-400'
  }

  const typeIcons = {
    STRENGTH: '✓',
    IMPROVEMENT: '⚡',
    SUGGESTION: '💡',
    FRAMEWORK: '🎯'
  }

  const severityColors = {
    HIGH: 'text-red-600',
    MEDIUM: 'text-yellow-600',
    LOW: 'text-green-600'
  }

  return (
    <div className={`p-4 ${typeStyles[feedback.type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg">{typeIcons[feedback.type]}</span>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                {feedback.type}
              </span>
              <span className={`text-xs font-medium ${severityColors[feedback.severity]}`}>
                {feedback.severity}
              </span>
            </div>
            <p className="text-sm text-gray-800">{feedback.message}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Real-time analysis functions
function analyzeUserInput(
  input: string,
  careerContext: PMTransitionType,
  industryContext: Industry
): RealTimeCoachingType {
  const analysisResults = {
    communicationPattern: detectCommunicationPattern(input),
    improvementTip: generateImprovementTip(input, careerContext),
    confidenceIndicator: calculateConfidenceScore(input),
    executivePresenceScore: calculateExecutivePresenceScore(input),
    frameworkUsage: detectFrameworkUsage(input),
    nextLevelSuggestion: generateNextLevelSuggestion(input, careerContext)
  }

  return analysisResults
}

function detectCommunicationPattern(input: string): string {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes('i think') || lowerInput.includes('i believe')) {
    return 'Opinion-based language detected'
  }
  
  if (lowerInput.includes('first') && lowerInput.includes('second')) {
    return 'Structured thinking pattern'
  }
  
  if (lowerInput.includes('based on') || lowerInput.includes('the data shows')) {
    return 'Evidence-based reasoning'
  }
  
  if (lowerInput.includes('customer') || lowerInput.includes('user')) {
    return 'Customer-centric communication'
  }
  
  if (lowerInput.includes('strategy') || lowerInput.includes('strategic')) {
    return 'Strategic communication pattern'
  }
  
  return 'General PM communication'
}

function generateImprovementTip(input: string, careerContext: PMTransitionType): string {
  const lowerInput = input.toLowerCase()
  
  // Career-specific improvement tips
  const careerTips = {
    'PO_TO_PM': [
      'Connect this to business outcomes',
      'Consider the customer impact',
      'Frame in business value terms'
    ],
    'PM_TO_SENIOR_PM': [
      'Use answer-first structure',
      'Strengthen your conviction language',
      'Add strategic altitude'
    ],
    'SENIOR_PM_TO_GROUP_PM': [
      'Think portfolio impact',
      'Consider team development angle',
      'Add organizational context'
    ],
    'GROUP_PM_TO_DIRECTOR': [
      'Connect to business model',
      'Include market positioning',
      'Add competitive context'
    ]
  }
  
  // Pattern-specific tips
  if (lowerInput.includes('i think') || lowerInput.includes('maybe')) {
    return 'Replace tentative language with definitive statements'
  }
  
  if (!lowerInput.includes('because') && !lowerInput.includes('therefore')) {
    return 'Add causal reasoning to strengthen your argument'
  }
  
  if (input.split(' ').length > 100) {
    return 'Consider more concise communication for executive clarity'
  }
  
  const tips = careerTips[careerContext]
  return tips[Math.floor(Math.random() * tips.length)]
}

function calculateConfidenceScore(input: string): number {
  let score = 50 // Base score
  const lowerInput = input.toLowerCase()
  
  // Positive indicators
  if (lowerInput.includes('will') || lowerInput.includes('must')) score += 20
  if (lowerInput.includes('confident') || lowerInput.includes('certain')) score += 15
  if (lowerInput.includes('proven') || lowerInput.includes('demonstrated')) score += 10
  if (lowerInput.includes('based on') || lowerInput.includes('data shows')) score += 15
  
  // Negative indicators
  if (lowerInput.includes('might') || lowerInput.includes('could')) score -= 15
  if (lowerInput.includes('i think') || lowerInput.includes('i believe')) score -= 10
  if (lowerInput.includes('maybe') || lowerInput.includes('possibly')) score -= 20
  if (lowerInput.includes('hopefully') || lowerInput.includes('probably')) score -= 10
  
  return Math.max(0, Math.min(100, score))
}

function calculateExecutivePresenceScore(input: string): number {
  let score = 50
  const lowerInput = input.toLowerCase()
  
  // Authority markers
  if (lowerInput.includes('i recommend') || lowerInput.includes('we should')) score += 15
  if (lowerInput.includes('based on')) score += 10
  if (lowerInput.includes('first') && lowerInput.includes('second')) score += 15
  
  // Clarity indicators
  if (input.split('.').length > 2) score += 10 // Multiple sentences
  if (lowerInput.includes('specifically') || lowerInput.includes('exactly')) score += 10
  
  // Conviction markers
  if (lowerInput.includes('will deliver') || lowerInput.includes('will achieve')) score += 15
  if (lowerInput.includes('confident that') || lowerInput.includes('certain that')) score += 10
  
  // Detractors
  if (lowerInput.includes('um') || lowerInput.includes('uh')) score -= 15
  if (lowerInput.includes('sort of') || lowerInput.includes('kind of')) score -= 10
  if (input.split(' ').length > 100) score -= 10 // Too verbose
  
  return Math.max(0, Math.min(100, score))
}

function detectFrameworkUsage(input: string): string[] {
  const frameworks: string[] = []
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes('rice') || (lowerInput.includes('reach') && lowerInput.includes('impact'))) {
    frameworks.push('RICE Prioritization')
  }
  
  if (lowerInput.includes('ice') && (lowerInput.includes('impact') || lowerInput.includes('confidence') || lowerInput.includes('ease'))) {
    frameworks.push('ICE Framework')
  }
  
  if (lowerInput.includes('jobs to be done') || lowerInput.includes('jtbd')) {
    frameworks.push('Jobs-to-be-Done')
  }
  
  if (lowerInput.includes('okr') || (lowerInput.includes('objective') && lowerInput.includes('key result'))) {
    frameworks.push('OKR Framework')
  }
  
  if (lowerInput.includes('smart') && (lowerInput.includes('goal') || lowerInput.includes('objective'))) {
    frameworks.push('SMART Goals')
  }
  
  if (lowerInput.includes('swot') || (lowerInput.includes('strength') && lowerInput.includes('weakness'))) {
    frameworks.push('SWOT Analysis')
  }
  
  return frameworks
}

function generateNextLevelSuggestion(input: string, careerContext: PMTransitionType): string {
  const suggestions = {
    'PO_TO_PM': [
      'Add business impact quantification',
      'Include stakeholder perspective',
      'Connect to customer value creation'
    ],
    'PM_TO_SENIOR_PM': [
      'Practice answer-first structure',
      'Strengthen executive language',
      'Add strategic context'
    ],
    'SENIOR_PM_TO_GROUP_PM': [
      'Think cross-product impact',
      'Consider team development',
      'Add organizational perspective'
    ],
    'GROUP_PM_TO_DIRECTOR': [
      'Include business model implications',
      'Add competitive positioning',
      'Consider market dynamics'
    ]
  }
  
  return suggestions[careerContext][Math.floor(Math.random() * suggestions[careerContext].length)]
}

function generateFeedbackItems(
  feedback: RealTimeCoachingType,
  userInput: string
): FeedbackItem[] {
  const items: FeedbackItem[] = []
  
  // Confidence feedback
  if (feedback.confidenceIndicator < 60) {
    items.push({
      id: `confidence_${Date.now()}`,
      type: 'IMPROVEMENT',
      message: `Confidence level: ${feedback.confidenceIndicator}%. ${feedback.improvementTip}`,
      severity: feedback.confidenceIndicator < 40 ? 'HIGH' : 'MEDIUM',
      timestamp: new Date(),
      dismissed: false
    })
  } else if (feedback.confidenceIndicator > 80) {
    items.push({
      id: `confidence_strong_${Date.now()}`,
      type: 'STRENGTH',
      message: `Strong confidence detected! Your conviction comes through clearly.`,
      severity: 'LOW',
      timestamp: new Date(),
      dismissed: false
    })
  }
  
  // Executive presence feedback
  if (feedback.executivePresenceScore > 75) {
    items.push({
      id: `presence_${Date.now()}`,
      type: 'STRENGTH',
      message: `Executive presence score: ${feedback.executivePresenceScore}%. Great authority and clarity!`,
      severity: 'LOW',
      timestamp: new Date(),
      dismissed: false
    })
  }
  
  // Framework usage feedback
  if (feedback.frameworkUsage.length > 0) {
    items.push({
      id: `framework_${Date.now()}`,
      type: 'FRAMEWORK',
      message: `Framework detected: ${feedback.frameworkUsage.join(', ')}. Excellent structured thinking!`,
      severity: 'LOW',
      timestamp: new Date(),
      dismissed: false
    })
  }
  
  // Communication pattern feedback
  if (feedback.communicationPattern.includes('Opinion-based')) {
    items.push({
      id: `opinion_${Date.now()}`,
      type: 'SUGGESTION',
      message: 'Try evidence-based language: "Based on..." instead of "I think..."',
      severity: 'MEDIUM',
      timestamp: new Date(),
      dismissed: false
    })
  }
  
  // Next level suggestion
  if (Math.random() > 0.7) { // Show occasionally to avoid spam
    items.push({
      id: `next_level_${Date.now()}`,
      type: 'SUGGESTION',
      message: feedback.nextLevelSuggestion,
      severity: 'LOW',
      timestamp: new Date(),
      dismissed: false
    })
  }
  
  return items
}