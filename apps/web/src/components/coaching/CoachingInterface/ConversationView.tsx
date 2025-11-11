'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  CoachingSession, 
  CoachPersona, 
  CoachingInteraction,
  UserProfile,
  DevelopmentArea,
  PMTransitionType,
  Industry,
  CoachingSessionType
} from '@/types/coaching'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { mockCoachPersonas, mockCoachingConversations } from '@/lib/mockCoachingData'

interface ConversationViewProps {
  userProfile: UserProfile
  developmentFocus: DevelopmentArea[]
  careerContext: PMTransitionType
  industryContext: Industry
  activeSession?: CoachingSession | null
  selectedCoach?: CoachPersona | null
  isSessionActive: boolean
  onSessionStart: (sessionType: CoachingSessionType) => void
  onSessionEnd: () => void
  onProgressUpdate: (update: any) => void
  onCoachSelection: (coach: CoachPersona) => void
}

export function ConversationView({
  userProfile,
  developmentFocus,
  careerContext,
  industryContext,
  activeSession,
  selectedCoach,
  isSessionActive,
  onSessionStart,
  onSessionEnd,
  onProgressUpdate,
  onCoachSelection
}: ConversationViewProps) {
  const [messages, setMessages] = useState<CoachingInteraction[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isCoachTyping, setIsCoachTyping] = useState(false)
  const [showCoachSelection, setShowCoachSelection] = useState(!selectedCoach)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load coaching conversation history
  useEffect(() => {
    if (activeSession) {
      const sessionMessages = mockCoachingConversations.filter(
        msg => msg.sessionId === activeSession.id
      )
      setMessages(sessionMessages)
    }
  }, [activeSession])

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !selectedCoach || !activeSession) return

    // Add user message
    const userMessage: CoachingInteraction = {
      id: `user_msg_${Date.now()}`,
      sessionId: activeSession.id,
      timestamp: new Date(),
      userInput: currentMessage,
      coachResponse: {
        response: '',
        coachingMethod: 'REAL_TIME_COACHING',
        developmentFocus: [],
        nextQuestions: [],
        improvementSuggestions: [],
        confidenceLevel: 'MEDIUM',
        tone: 'ENCOURAGING'
      },
      developmentGoals: [],
      realTimeCoaching: {
        communicationPattern: '',
        improvementTip: '',
        confidenceIndicator: 0,
        executivePresenceScore: 0,
        frameworkUsage: [],
        nextLevelSuggestion: ''
      },
      progressTracking: {
        skillArea: '',
        improvementScore: 0
      },
      type: 'USER_MESSAGE'
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsCoachTyping(true)

    // Simulate coach response
    setTimeout(() => {
      const coachResponse = generateCoachResponse(currentMessage, selectedCoach, careerContext, industryContext)
      setMessages(prev => [...prev, coachResponse])
      setIsCoachTyping(false)
      onProgressUpdate(coachResponse.progressTracking)
    }, 2000)
  }, [currentMessage, selectedCoach, activeSession, careerContext, industryContext, onProgressUpdate])

  const handleStartSession = (sessionType: CoachingSessionType) => {
    setShowCoachSelection(false)
    onSessionStart(sessionType)
    
    // Add welcome message
    const welcomeMessage = generateWelcomeMessage(selectedCoach!, sessionType, careerContext)
    setMessages([welcomeMessage])
  }

  const handleCoachSelect = (coach: CoachPersona) => {
    onCoachSelection(coach)
    setShowCoachSelection(false)
  }

  if (showCoachSelection) {
    return (
      <CoachSelectionView
        coaches={mockCoachPersonas}
        userProfile={userProfile}
        careerContext={careerContext}
        industryContext={industryContext}
        onCoachSelect={handleCoachSelect}
      />
    )
  }

  if (!isSessionActive) {
    return (
      <SessionStartView
        selectedCoach={selectedCoach!}
        userProfile={userProfile}
        developmentFocus={developmentFocus}
        onStartSession={handleStartSession}
        onChangeCoach={() => setShowCoachSelection(true)}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Session Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {selectedCoach?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedCoach?.name}</h3>
              <p className="text-sm text-gray-500">{selectedCoach?.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{activeSession?.sessionType.replace('_', ' ')}</p>
              <p className="text-xs text-gray-500">Session Duration: {activeSession?.duration}min</p>
            </div>
            <Button
              variant="outline"
              onClick={onSessionEnd}
              className="text-gray-600 hover:text-gray-800"
            >
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.type === 'USER_MESSAGE'}
            coach={selectedCoach}
          />
        ))}
        
        {isCoachTyping && (
          <div className="flex space-x-2 items-center text-gray-500">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-semibold">
                {selectedCoach?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Share your PM challenge, practice scenario, or ask for coaching..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isCoachTyping}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

// Coach Selection View Component
function CoachSelectionView({
  coaches,
  userProfile,
  careerContext,
  industryContext,
  onCoachSelect
}: {
  coaches: CoachPersona[]
  userProfile: UserProfile
  careerContext: PMTransitionType
  industryContext: Industry
  onCoachSelect: (coach: CoachPersona) => void
}) {
  const recommendedCoaches = coaches.filter(coach => 
    coach.industry === industryContext || 
    coach.pmLevel === userProfile.targetRole
  )

  const otherCoaches = coaches.filter(coach => 
    !recommendedCoaches.includes(coach)
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select Your Executive Coach</h2>
        <p className="text-gray-600">
          Choose a coach aligned with your {careerContext.replace('_', ' → ')} transition in {industryContext}
        </p>
      </div>

      {recommendedCoaches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedCoaches.map(coach => (
              <CoachCard key={coach.id} coach={coach} onSelect={onCoachSelect} isRecommended />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Other Expert Coaches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherCoaches.map(coach => (
            <CoachCard key={coach.id} coach={coach} onSelect={onCoachSelect} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Session Start View Component  
function SessionStartView({
  selectedCoach,
  userProfile,
  developmentFocus,
  onStartSession,
  onChangeCoach
}: {
  selectedCoach: CoachPersona
  userProfile: UserProfile
  developmentFocus: DevelopmentArea[]
  onStartSession: (type: CoachingSessionType) => void
  onChangeCoach: () => void
}) {
  const sessionTypes: { type: CoachingSessionType; title: string; description: string }[] = [
    {
      type: 'STRATEGIC_THINKING',
      title: 'Strategic Thinking Development',
      description: 'Framework application, business reasoning, and strategic altitude practice'
    },
    {
      type: 'EXECUTIVE_PRESENCE',
      title: 'Executive Presence Coaching',
      description: 'Authority building, communication clarity, and leadership voice development'
    },
    {
      type: 'INDUSTRY_FLUENCY',
      title: 'Industry-Specific Development',
      description: 'Sector expertise, regulatory context, and industry vocabulary expansion'
    },
    {
      type: 'FRAMEWORK_PRACTICE',
      title: 'PM Framework Mastery',
      description: 'RICE, ICE, Jobs-to-be-Done, OKR application in real scenarios'
    }
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-blue-600 font-semibold text-lg">
            {selectedCoach.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedCoach.name}</h2>
        <p className="text-gray-600 mb-4">{selectedCoach.background}</p>
        <Button variant="outline" onClick={onChangeCoach} className="text-sm">
          Change Coach
        </Button>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Coaching Focus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessionTypes.map(session => (
            <Card 
              key={session.type} 
              className="p-6 cursor-pointer hover:bg-blue-50 border hover:border-blue-200 transition-colors"
              onClick={() => onStartSession(session.type)}
            >
              <h4 className="text-lg font-medium text-gray-900 mb-2">{session.title}</h4>
              <p className="text-gray-600 text-sm">{session.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Your Development Focus Areas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {developmentFocus.map(area => (
            <div key={area.id} className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {area.currentLevel}/{area.targetLevel}
              </div>
              <div className="text-sm font-medium text-gray-700">{area.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Individual Coach Card Component
function CoachCard({ 
  coach, 
  onSelect, 
  isRecommended = false 
}: { 
  coach: CoachPersona
  onSelect: (coach: CoachPersona) => void
  isRecommended?: boolean 
}) {
  return (
    <Card className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${isRecommended ? 'border-blue-200 bg-blue-50' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">
            {coach.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        {isRecommended && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            Recommended
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{coach.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{coach.title}</p>
      <p className="text-xs text-gray-500 mb-4">{coach.background}</p>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
        <div className="flex flex-wrap gap-2">
          {coach.specialties.slice(0, 3).map(specialty => (
            <span key={specialty} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {specialty}
            </span>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={() => onSelect(coach)} 
        className="w-full"
        variant={isRecommended ? "primary" : "outline"}
      >
        Select Coach
      </Button>
    </Card>
  )
}

// Message Bubble Component
function MessageBubble({ 
  message, 
  isUser, 
  coach 
}: { 
  message: CoachingInteraction
  isUser: boolean
  coach?: CoachPersona 
}) {
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md bg-blue-600 text-white rounded-lg px-4 py-2">
          <p className="text-sm">{message.userInput}</p>
          <p className="text-xs text-blue-100 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex space-x-3">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-blue-600 text-xs font-semibold">
          {coach?.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-800">{message.coachResponse.response}</p>
          
          {message.coachResponse.nextQuestions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">Coaching Questions:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {message.coachResponse.nextQuestions.map((question, index) => (
                  <li key={index}>• {question}</li>
                ))}
              </ul>
            </div>
          )}
          
          {message.realTimeCoaching.improvementTip && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-1">Real-time Coaching:</p>
              <p className="text-xs text-gray-600">{message.realTimeCoaching.improvementTip}</p>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-400 mt-1 ml-4">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

// Helper functions
function generateCoachResponse(
  userMessage: string, 
  coach: CoachPersona, 
  careerContext: PMTransitionType,
  industryContext: Industry
): CoachingInteraction {
  // Mock AI coach response generation
  const responses = [
    "That's an excellent strategic challenge. Let's break this down using the answer-first methodology.",
    "I can see you're developing great PM instincts. Let's polish your communication approach.",
    "This is exactly the kind of thinking that differentiates senior PMs. Let's explore the framework application."
  ]

  return {
    id: `coach_response_${Date.now()}`,
    sessionId: 'current_session',
    timestamp: new Date(),
    userInput: userMessage,
    coachResponse: {
      response: responses[Math.floor(Math.random() * responses.length)],
      coachingMethod: 'SOCRATIC_QUESTIONING',
      developmentFocus: ['Strategic Thinking'],
      nextQuestions: [
        "What's the core business problem you're solving?",
        "How would you measure success here?"
      ],
      improvementSuggestions: [
        "Use more definitive language",
        "Connect to business outcomes"
      ],
      confidenceLevel: 'MEDIUM',
      tone: 'ENCOURAGING'
    },
    developmentGoals: [],
    realTimeCoaching: {
      communicationPattern: "Strategic reasoning detected",
      improvementTip: "Great framework thinking - now add quantitative impact",
      confidenceIndicator: 75,
      executivePresenceScore: 80,
      frameworkUsage: ['Strategic Analysis'],
      nextLevelSuggestion: "Add business impact quantification"
    },
    progressTracking: {
      skillArea: 'Strategic Thinking',
      improvementScore: 78
    },
    type: 'COACH_RESPONSE'
  }
}

function generateWelcomeMessage(
  coach: CoachPersona, 
  sessionType: CoachingSessionType,
  careerContext: PMTransitionType
): CoachingInteraction {
  const welcomes = {
    'STRATEGIC_THINKING': `Hi! I'm ${coach.name}. Let's develop your strategic thinking for the ${careerContext.replace('_', ' → ')} transition. What strategic challenge would you like to explore today?`,
    'EXECUTIVE_PRESENCE': `Welcome! I'm ${coach.name}. I'm here to help you build executive presence and communication authority. What communication situation would you like to practice?`,
    'INDUSTRY_FLUENCY': `Hello! I'm ${coach.name}. Let's work on industry-specific communication and expertise. What industry context challenge can I help you with?`,
    'FRAMEWORK_PRACTICE': `Hi there! I'm ${coach.name}. Ready to master PM frameworks? Which framework or decision scenario would you like to practice?`
  }

  return {
    id: 'welcome_message',
    sessionId: 'current_session',
    timestamp: new Date(),
    userInput: '',
    coachResponse: {
      response: welcomes[sessionType],
      coachingMethod: 'REAL_TIME_COACHING',
      developmentFocus: [sessionType.replace('_', ' ')],
      nextQuestions: [],
      improvementSuggestions: [],
      confidenceLevel: 'HIGH',
      tone: 'ENCOURAGING'
    },
    developmentGoals: [],
    realTimeCoaching: {
      communicationPattern: '',
      improvementTip: '',
      confidenceIndicator: 0,
      executivePresenceScore: 0,
      frameworkUsage: [],
      nextLevelSuggestion: ''
    },
    progressTracking: {
      skillArea: sessionType,
      improvementScore: 0
    },
    type: 'COACH_RESPONSE'
  }
}