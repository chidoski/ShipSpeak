/**
 * StakeholderRolePlay - Interactive stakeholder communication practice
 * Dynamic role-playing scenarios with AI-powered stakeholder responses
 */

import React, { useState, useEffect } from 'react'
import { ExerciseScenario, UserProfile, Stakeholder } from '@/types/module-content'

interface ConversationTurn {
  speaker: 'user' | 'stakeholder'
  stakeholder?: Stakeholder
  message: string
  timestamp: Date
  effectiveness?: number
}

interface StakeholderRolePlayProps {
  scenario: ExerciseScenario
  userProfile: UserProfile
  onResponseSubmit: (response: string) => void
  isLoading: boolean
}

export function StakeholderRolePlay({
  scenario,
  userProfile,
  onResponseSubmit,
  isLoading
}: StakeholderRolePlayProps) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [conversation, setConversation] = useState<ConversationTurn[]>([])
  const [activeStakeholder, setActiveStakeholder] = useState<Stakeholder | null>(null)
  const [conversationPhase, setConversationPhase] = useState<'setup' | 'active' | 'complete'>('setup')
  const [realTimeFeedback, setRealTimeFeedback] = useState<string[]>([])

  useEffect(() => {
    // Initialize with first stakeholder
    if (scenario.stakeholders.length > 0 && !activeStakeholder) {
      setActiveStakeholder(scenario.stakeholders[0])
      initializeConversation()
    }
  }, [scenario, activeStakeholder])

  const initializeConversation = () => {
    const initialMessage = generateStakeholderResponse(scenario.context.situation)
    setConversation([{
      speaker: 'stakeholder',
      stakeholder: scenario.stakeholders[0],
      message: initialMessage,
      timestamp: new Date()
    }])
    setConversationPhase('active')
  }

  const generateStakeholderResponse = (context: string, userMessage?: string): string => {
    if (!activeStakeholder) return ''

    // Simulate stakeholder responses based on their profile
    const responses = {
      initial: [
        `Thanks for setting up this meeting. I understand we need to discuss ${context.toLowerCase()}. I have some concerns about the timeline.`,
        `I've reviewed the situation and I'm not entirely convinced this is the right approach. Can you walk me through your reasoning?`,
        `This is definitely urgent. What options are you considering and what's your recommendation?`
      ],
      challenging: [
        `I see your point, but I'm worried about the impact on my team's current commitments. How do we balance this?`,
        `That's an interesting perspective. Have you considered the regulatory implications?`,
        `I need to understand the business case better. What data supports this approach?`
      ],
      supportive: [
        `That makes sense. What do you need from my team to make this successful?`,
        `I appreciate the thorough analysis. How can we accelerate the timeline?`,
        `Good point. What are the next steps and how can I help remove obstacles?`
      ]
    }

    if (!userMessage) {
      return responses.initial[Math.floor(Math.random() * responses.initial.length)]
    }

    // Analyze user message tone and respond accordingly
    const isConfident = /\b(recommend|should|will|certain)\b/i.test(userMessage)
    const hasData = /\b(data|metrics|analysis|research|studies)\b/i.test(userMessage)
    const isCollaborative = /\b(together|partnership|collaborate|align)\b/i.test(userMessage)

    if (activeStakeholder.alignment === 'OPPOSED' || (!isConfident && !hasData)) {
      return responses.challenging[Math.floor(Math.random() * responses.challenging.length)]
    }

    return responses.supportive[Math.floor(Math.random() * responses.supportive.length)]
  }

  const analyzeMessage = (message: string): string[] => {
    const feedback: string[] = []

    // Structure analysis
    if (!message.toLowerCase().startsWith('i recommend') && !message.toLowerCase().startsWith('my recommendation')) {
      feedback.push('Consider starting with your recommendation (answer-first approach)')
    }

    // Framework usage
    if (!/\b(RICE|ICE|OKR|prioritiz|impact|effort)\b/i.test(message)) {
      feedback.push('Try incorporating PM frameworks like RICE to support your reasoning')
    }

    // Stakeholder adaptation
    if (activeStakeholder) {
      if (activeStakeholder.communicationStyle.preference === 'DATA_DRIVEN' && !/\b(data|metrics|research)\b/i.test(message)) {
        feedback.push(`${activeStakeholder.name} prefers data-driven discussions - include specific metrics`)
      }
      
      if (activeStakeholder.level === 'C_SUITE' && message.length > 300) {
        feedback.push('Keep responses concise for executive audiences')
      }
    }

    // Confidence language
    const hedgingWords = ['maybe', 'perhaps', 'possibly', 'might']
    if (hedgingWords.some(word => message.toLowerCase().includes(word))) {
      feedback.push('Use more confident language to increase executive presence')
    }

    return feedback
  }

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    // Add user message to conversation
    const userTurn: ConversationTurn = {
      speaker: 'user',
      message: currentMessage.trim(),
      timestamp: new Date(),
      effectiveness: calculateMessageEffectiveness(currentMessage.trim())
    }

    setConversation(prev => [...prev, userTurn])

    // Generate real-time feedback
    const feedback = analyzeMessage(currentMessage.trim())
    setRealTimeFeedback(feedback)

    // Generate stakeholder response
    setTimeout(() => {
      const stakeholderResponse = generateStakeholderResponse(scenario.context.situation, currentMessage.trim())
      const stakeholderTurn: ConversationTurn = {
        speaker: 'stakeholder',
        stakeholder: activeStakeholder!,
        message: stakeholderResponse,
        timestamp: new Date()
      }

      setConversation(prev => [...prev, stakeholderTurn])
    }, 1000)

    setCurrentMessage('')
  }

  const calculateMessageEffectiveness = (message: string): number => {
    let score = 5

    // Answer-first bonus
    if (/^(i recommend|my recommendation|i suggest)/i.test(message)) score += 1.5

    // Framework usage bonus
    if (/\b(RICE|ICE|OKR|impact|effort|priorit)/i.test(message)) score += 1

    // Data inclusion bonus
    if (/\b(data|metrics|research|analysis)\b/i.test(message)) score += 1

    // Confidence language
    const confidenceWords = ['will', 'should', 'recommend', 'confident']
    const hedgingWords = ['maybe', 'perhaps', 'possibly', 'might']
    const confidence = confidenceWords.filter(word => message.toLowerCase().includes(word)).length
    const hedging = hedgingWords.filter(word => message.toLowerCase().includes(word)).length
    score += (confidence - hedging) * 0.5

    return Math.min(10, Math.max(1, score))
  }

  const switchStakeholder = (stakeholder: Stakeholder) => {
    setActiveStakeholder(stakeholder)
    
    // Add transition message
    const transitionMessage = `Now speaking with ${stakeholder.name} (${stakeholder.role})`
    setConversation(prev => [...prev, {
      speaker: 'stakeholder',
      stakeholder,
      message: `Hi, I'm ${stakeholder.name}. I understand you wanted to discuss the situation. What's your take on this?`,
      timestamp: new Date()
    }])
  }

  const completeRolePlay = () => {
    setConversationPhase('complete')
    
    // Generate summary response for submission
    const conversationSummary = conversation
      .filter(turn => turn.speaker === 'user')
      .map(turn => turn.message)
      .join('\n\n')
    
    onResponseSubmit(conversationSummary)
  }

  const getEffectivenessColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStakeholderAvatar = (stakeholder: Stakeholder) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500']
    const index = stakeholder.name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h2>
        <p className="text-gray-600">Engage in real-time conversation with key stakeholders</p>
      </div>

      {/* Stakeholder Selection */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3">Active Stakeholders</h3>
        <div className="flex flex-wrap gap-3">
          {scenario.stakeholders.map((stakeholder, index) => (
            <button
              key={index}
              onClick={() => switchStakeholder(stakeholder)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg border-2 transition-colors ${
                activeStakeholder?.name === stakeholder.name
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getStakeholderAvatar(stakeholder)}`}>
                {stakeholder.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{stakeholder.name}</div>
                <div className="text-xs text-gray-500">{stakeholder.role}</div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                stakeholder.alignment === 'ALIGNED' ? 'bg-green-100 text-green-800' :
                stakeholder.alignment === 'OPPOSED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {stakeholder.alignment}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {conversation.map((turn, index) => (
            <div
              key={index}
              className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                turn.speaker === 'user'
                  ? 'bg-executive-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {turn.speaker === 'stakeholder' && (
                  <div className="font-semibold text-sm mb-1">
                    {turn.stakeholder?.name}
                  </div>
                )}
                <p className="text-sm">{turn.message}</p>
                {turn.speaker === 'user' && turn.effectiveness && (
                  <div className={`text-xs mt-1 ${getEffectivenessColor(turn.effectiveness)}`}>
                    Effectiveness: {turn.effectiveness.toFixed(1)}/10
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Feedback */}
        {realTimeFeedback.length > 0 && (
          <div className="border-t border-gray-200 bg-yellow-50 p-3">
            <div className="text-sm font-medium text-yellow-800 mb-2">Communication Tips:</div>
            <ul className="text-xs text-yellow-700 space-y-1">
              {realTimeFeedback.map((tip, index) => (
                <li key={index} className="flex items-start space-x-1">
                  <span>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Message Input */}
        {conversationPhase === 'active' && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={`Respond to ${activeStakeholder?.name}...`}
                className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-executive-primary focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className="px-4 py-2 bg-executive-primary text-white rounded-lg font-medium hover:bg-executive-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {conversationPhase === 'active' && conversation.length >= 4 && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={completeRolePlay}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Complete Role Play
          </button>
        </div>
      )}

      {/* Current Stakeholder Info */}
      {activeStakeholder && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Current Stakeholder: {activeStakeholder.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Communication Style:</span> {activeStakeholder.communicationStyle.preference}
            </div>
            <div>
              <span className="font-medium text-gray-700">Decision Style:</span> {activeStakeholder.communicationStyle.decisionStyle}
            </div>
            <div>
              <span className="font-medium text-gray-700">Influence Level:</span> {activeStakeholder.influence}
            </div>
            <div>
              <span className="font-medium text-gray-700">Attention Span:</span> {activeStakeholder.communicationStyle.attention}
            </div>
          </div>
          <div className="mt-3">
            <span className="font-medium text-gray-700">Key Concerns:</span>
            <ul className="text-gray-600 list-disc list-inside mt-1">
              {activeStakeholder.concerns?.map((concern, index) => (
                <li key={index}>{concern}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}