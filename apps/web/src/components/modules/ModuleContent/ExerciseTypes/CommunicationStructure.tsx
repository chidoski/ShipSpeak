/**
 * CommunicationStructure - Answer-first and executive presence training
 * Focused practice on communication structure and executive-level delivery
 */

import React, { useState, useEffect } from 'react'
import { ExerciseScenario, UserProfile } from '@/types/module-content'

interface StructureAnalysis {
  answerFirst: boolean
  logicalFlow: number
  clarity: number
  executiveLanguage: number
  stakeholderAdaptation: number
}

interface CommunicationStructureProps {
  scenario: ExerciseScenario
  userProfile: UserProfile
  onResponseSubmit: (response: string) => void
  isLoading: boolean
}

const STRUCTURE_PATTERNS = {
  ANSWER_FIRST: {
    name: 'Answer-First',
    description: 'Lead with your recommendation or conclusion',
    template: 'I recommend [action] because [key reason]. This will [outcome].',
    examples: [
      'I recommend we prioritize the security update over new features.',
      'My analysis suggests we should proceed with the beta launch.',
      'I believe we should pause this initiative until Q3.'
    ]
  },
  PYRAMID: {
    name: 'Pyramid Principle',
    description: 'Start with conclusion, then supporting arguments',
    template: '[Conclusion]. Here are three reasons: [Reason 1], [Reason 2], [Reason 3].',
    examples: [
      'We should invest in mobile-first design. Three reasons: user behavior data, competitive pressure, and revenue impact.'
    ]
  },
  SITUATION_COMPLICATION_RESOLUTION: {
    name: 'SCR (Situation-Complication-Resolution)',
    description: 'Context → Problem → Solution structure',
    template: '[Current situation]. However, [complication/challenge]. Therefore, [resolution].',
    examples: [
      'Our user engagement is strong. However, conversion rates are declining. Therefore, I recommend A/B testing the checkout flow.'
    ]
  }
}

const EXECUTIVE_LANGUAGE_PATTERNS = {
  CONFIDENT: ['I recommend', 'I believe', 'We should', 'The data shows', 'My analysis indicates'],
  HEDGING: ['Maybe', 'Perhaps', 'Possibly', 'I think', 'It seems like', 'We might want to consider'],
  IMPACT_FOCUSED: ['This will result in', 'The outcome will be', 'We can expect', 'This drives', 'Impact includes'],
  METRIC_DRIVEN: ['Based on the data', 'Metrics show', 'Analysis reveals', 'Performance indicates', 'Results demonstrate']
}

export function CommunicationStructure({
  scenario,
  userProfile,
  onResponseSubmit,
  isLoading
}: CommunicationStructureProps) {
  const [selectedPattern, setSelectedPattern] = useState<keyof typeof STRUCTURE_PATTERNS>('ANSWER_FIRST')
  const [draftResponse, setDraftResponse] = useState('')
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<StructureAnalysis | null>(null)
  const [showTemplates, setShowTemplates] = useState(true)
  const [practiceMode, setPracticeMode] = useState<'guided' | 'free' | 'timed'>('guided')
  const [timeRemaining, setTimeRemaining] = useState(120) // 2 minutes for timed practice

  useEffect(() => {
    // Real-time analysis as user types
    if (draftResponse.length > 20) {
      const analysis = analyzeStructure(draftResponse)
      setRealTimeAnalysis(analysis)
    }
  }, [draftResponse])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (practiceMode === 'timed' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [practiceMode, timeRemaining])

  const analyzeStructure = (text: string): StructureAnalysis => {
    const lowerText = text.toLowerCase()
    
    // Answer-first detection
    const answerFirstPatterns = ['i recommend', 'my recommendation', 'we should', 'i believe', 'the answer is']
    const answerFirst = answerFirstPatterns.some(pattern => 
      lowerText.startsWith(pattern) || lowerText.includes(`${pattern}`)
    )

    // Logical flow analysis (simplified)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const hasTransitions = /\b(therefore|however|additionally|furthermore|consequently|as a result)\b/i.test(text)
    const logicalFlow = sentences.length > 1 && hasTransitions ? 8 : sentences.length > 1 ? 6 : 4

    // Clarity analysis
    const avgSentenceLength = text.length / Math.max(sentences.length, 1)
    const clarity = avgSentenceLength >= 15 && avgSentenceLength <= 25 ? 9 : 
                   avgSentenceLength >= 10 && avgSentenceLength <= 30 ? 7 : 5

    // Executive language analysis
    const confidentWords = EXECUTIVE_LANGUAGE_PATTERNS.CONFIDENT.filter(word => lowerText.includes(word.toLowerCase())).length
    const hedgingWords = EXECUTIVE_LANGUAGE_PATTERNS.HEDGING.filter(word => lowerText.includes(word.toLowerCase())).length
    const executiveLanguage = Math.max(1, Math.min(10, 6 + (confidentWords * 2) - hedgingWords))

    // Stakeholder adaptation (check for audience awareness)
    const stakeholderMentions = scenario.stakeholders.filter(stakeholder => 
      lowerText.includes(stakeholder.name.toLowerCase()) || 
      lowerText.includes(stakeholder.role.toLowerCase())
    ).length
    const stakeholderAdaptation = Math.min(10, 5 + (stakeholderMentions * 2))

    return {
      answerFirst,
      logicalFlow,
      clarity,
      executiveLanguage,
      stakeholderAdaptation
    }
  }

  const handlePatternSelect = (pattern: keyof typeof STRUCTURE_PATTERNS) => {
    setSelectedPattern(pattern)
    // Pre-fill with template if in guided mode
    if (practiceMode === 'guided') {
      setDraftResponse(STRUCTURE_PATTERNS[pattern].template)
    }
  }

  const handleSubmit = () => {
    const structuredResponse = generateStructuredResponse()
    onResponseSubmit(structuredResponse)
  }

  const generateStructuredResponse = (): string => {
    const analysis = realTimeAnalysis || analyzeStructure(draftResponse)
    
    let response = `## Communication Structure Analysis\n\n`
    response += `**Scenario:** ${scenario.title}\n\n`
    response += `**Selected Pattern:** ${STRUCTURE_PATTERNS[selectedPattern].name}\n\n`
    response += `**Response:**\n${draftResponse}\n\n`
    
    response += `**Structure Analysis:**\n`
    response += `- Answer-First Approach: ${analysis.answerFirst ? '✓ Yes' : '✗ No'}\n`
    response += `- Logical Flow: ${analysis.logicalFlow}/10\n`
    response += `- Clarity: ${analysis.clarity}/10\n`
    response += `- Executive Language: ${analysis.executiveLanguage}/10\n`
    response += `- Stakeholder Adaptation: ${analysis.stakeholderAdaptation}/10\n\n`
    
    response += `**Overall Score:** ${((analysis.logicalFlow + analysis.clarity + analysis.executiveLanguage + analysis.stakeholderAdaptation) / 4).toFixed(1)}/10\n\n`
    
    return response
  }

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderPatternSelector = () => (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-900 mb-3">Communication Structure Pattern</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(STRUCTURE_PATTERNS).map(([key, pattern]) => (
          <button
            key={key}
            onClick={() => handlePatternSelect(key as keyof typeof STRUCTURE_PATTERNS)}
            className={`text-left p-4 rounded-lg border-2 transition-colors ${
              selectedPattern === key
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="font-semibold text-gray-900">{pattern.name}</div>
            <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
          </button>
        ))}
      </div>
    </div>
  )

  const renderPracticeMode = () => (
    <div className="flex items-center space-x-4 mb-4">
      <span className="font-medium text-gray-700">Practice Mode:</span>
      <div className="flex space-x-2">
        {(['guided', 'free', 'timed'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setPracticeMode(mode)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              practiceMode === mode
                ? 'bg-executive-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
      {practiceMode === 'timed' && (
        <span className={`font-mono text-lg ${timeRemaining <= 30 ? 'text-red-600' : 'text-gray-700'}`}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </span>
      )}
    </div>
  )

  const renderTemplate = () => {
    if (!showTemplates || practiceMode === 'free') return null

    const pattern = STRUCTURE_PATTERNS[selectedPattern]
    
    return (
      <div className="bg-yellow-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-yellow-900">{pattern.name} Template</h4>
          <button
            onClick={() => setShowTemplates(false)}
            className="text-xs text-yellow-700 hover:text-yellow-900"
          >
            Hide
          </button>
        </div>
        <p className="text-sm text-yellow-800 mb-2">{pattern.description}</p>
        <div className="bg-white rounded p-3 text-sm font-mono text-gray-800">
          {pattern.template}
        </div>
        <div className="mt-2">
          <span className="text-xs font-medium text-yellow-800">Examples:</span>
          <ul className="text-xs text-yellow-700 mt-1 space-y-1">
            {pattern.examples.map((example, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span>•</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const renderRealTimeAnalysis = () => {
    if (!realTimeAnalysis || draftResponse.length < 20) return null

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Real-time Structure Analysis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className={`text-lg font-semibold ${realTimeAnalysis.answerFirst ? 'text-green-600' : 'text-red-600'}`}>
              {realTimeAnalysis.answerFirst ? '✓' : '✗'}
            </div>
            <div className="text-gray-600">Answer-First</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(realTimeAnalysis.logicalFlow)}`}>
              {realTimeAnalysis.logicalFlow}/10
            </div>
            <div className="text-gray-600">Logical Flow</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(realTimeAnalysis.clarity)}`}>
              {realTimeAnalysis.clarity}/10
            </div>
            <div className="text-gray-600">Clarity</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(realTimeAnalysis.executiveLanguage)}`}>
              {realTimeAnalysis.executiveLanguage}/10
            </div>
            <div className="text-gray-600">Executive Language</div>
          </div>
        </div>
        
        {/* Quick feedback */}
        <div className="mt-3 space-y-1 text-xs">
          {!realTimeAnalysis.answerFirst && (
            <div className="text-red-600">• Consider starting with your recommendation</div>
          )}
          {realTimeAnalysis.executiveLanguage < 6 && (
            <div className="text-yellow-600">• Use more confident language patterns</div>
          )}
          {realTimeAnalysis.clarity < 6 && (
            <div className="text-orange-600">• Simplify sentence structure for clarity</div>
          )}
          {realTimeAnalysis.stakeholderAdaptation < 6 && (
            <div className="text-blue-600">• Address specific stakeholder concerns</div>
          )}
        </div>
      </div>
    )
  }

  const renderLanguageHelper = () => (
    <div className="bg-green-50 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-green-900 mb-3">Executive Language Patterns</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-green-800">✓ Confident Language:</span>
          <ul className="text-green-700 list-disc list-inside mt-1">
            {EXECUTIVE_LANGUAGE_PATTERNS.CONFIDENT.slice(0, 3).map((phrase, index) => (
              <li key={index}>{phrase}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="font-medium text-red-800">✗ Hedging Language:</span>
          <ul className="text-red-700 list-disc list-inside mt-1">
            {EXECUTIVE_LANGUAGE_PATTERNS.HEDGING.slice(0, 3).map((phrase, index) => (
              <li key={index}>{phrase}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h2>
        <p className="text-gray-600">Practice executive communication structure and answer-first methodology</p>
      </div>

      {/* Practice Mode Selection */}
      {renderPracticeMode()}

      {/* Pattern Selector */}
      {renderPatternSelector()}

      {/* Template Display */}
      {renderTemplate()}

      {/* Language Helper */}
      {renderLanguageHelper()}

      {/* Response Input */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Your Response</h3>
        <textarea
          value={draftResponse}
          onChange={(e) => setDraftResponse(e.target.value)}
          placeholder={practiceMode === 'guided' ? 
            "Use the template above to structure your response..." :
            "Craft your response using executive communication principles..."
          }
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-executive-primary focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Real-time Analysis */}
      {renderRealTimeAnalysis()}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!draftResponse.trim() || isLoading}
          className="px-6 py-3 bg-executive-primary text-white rounded-lg font-semibold hover:bg-executive-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing Structure...' : 'Submit for Analysis'}
        </button>
      </div>

      {/* Scenario Context Reminder */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-gray-900 mb-2">Scenario Reminder</h4>
        <p className="text-gray-600 mb-2">{scenario.context.situation}</p>
        <div className="text-gray-500">
          <span className="font-medium">Key Stakeholders:</span> {scenario.stakeholders.map(s => s.name).join(', ')}
        </div>
      </div>
    </div>
  )
}