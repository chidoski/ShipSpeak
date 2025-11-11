'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { 
  CoachingSession, 
  CoachingSessionType, 
  CoachPersona, 
  CoachingInteraction,
  PMTransitionType,
  Industry,
  DevelopmentArea,
  ProgressUpdate,
  UserProfile,
  CoachingPanelProps
} from '@/types/coaching'
import { ConversationView } from './CoachingInterface/ConversationView'
import { DevelopmentDashboard } from './CoachingInterface/DevelopmentDashboard'
import { PersonalizedPlan } from './CoachingInterface/PersonalizedPlan'
import { CoachingHistory } from './CoachingInterface/CoachingHistory'
import { mockCoachPersonas, mockCoachingSessions } from '@/lib/mockCoachingData'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface CoachingOrchestratorProps {
  userProfile: UserProfile
  initialSessionType?: CoachingSessionType
  onClose?: () => void
}

type CoachingView = 'CONVERSATION' | 'DASHBOARD' | 'PLAN' | 'HISTORY'

export function CoachingOrchestrator({
  userProfile,
  initialSessionType = 'STRATEGIC_THINKING',
  onClose
}: CoachingOrchestratorProps) {
  const [currentView, setCurrentView] = useState<CoachingView>('CONVERSATION')
  const [activeSession, setActiveSession] = useState<CoachingSession | null>(null)
  const [selectedCoach, setSelectedCoach] = useState<CoachPersona | null>(null)
  const [developmentFocus, setDevelopmentFocus] = useState<DevelopmentArea[]>([])
  const [sessionHistory, setSessionHistory] = useState<CoachingSession[]>([])
  const [isSessionActive, setIsSessionActive] = useState(false)

  // Initialize coaching system
  useEffect(() => {
    // Load user's coaching history
    const userSessions = mockCoachingSessions.filter(
      session => session.careerContext === getCurrentTransitionType(userProfile.currentRole, userProfile.targetRole)
    )
    setSessionHistory(userSessions)

    // Set initial development focus based on user profile
    const initialFocus = deriveInitialDevelopmentFocus(userProfile)
    setDevelopmentFocus(initialFocus)

    // Select appropriate coach for user's context
    const appropriateCoach = selectOptimalCoach(userProfile, initialSessionType)
    setSelectedCoach(appropriateCoach)
  }, [userProfile, initialSessionType])

  const handleSessionStart = useCallback((sessionType: CoachingSessionType) => {
    if (!selectedCoach) return

    const newSession: CoachingSession = {
      id: `session_${Date.now()}`,
      sessionType,
      duration: 30, // Default 30 minutes
      focusAreas: developmentFocus,
      userProgress: {
        skillProgression: {},
        sessionsCompleted: sessionHistory.length,
        totalDuration: 0,
        milestones: [],
        confidenceGrowth: [],
        weeklyProgress: []
      },
      aiCoachPersona: selectedCoach,
      careerContext: getCurrentTransitionType(userProfile.currentRole, userProfile.targetRole),
      industryContext: userProfile.industry,
      createdAt: new Date(),
      status: 'ACTIVE'
    }

    setActiveSession(newSession)
    setIsSessionActive(true)
    setCurrentView('CONVERSATION')
  }, [selectedCoach, developmentFocus, sessionHistory.length, userProfile])

  const handleSessionEnd = useCallback(() => {
    if (activeSession) {
      const completedSession = {
        ...activeSession,
        completedAt: new Date(),
        status: 'COMPLETED' as const
      }
      
      setSessionHistory(prev => [...prev, completedSession])
      setActiveSession(null)
      setIsSessionActive(false)
    }
  }, [activeSession])

  const handleProgressUpdate = useCallback((update: ProgressUpdate) => {
    if (activeSession) {
      setActiveSession(prev => {
        if (!prev) return prev
        return {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            skillProgression: {
              ...prev.userProgress.skillProgression,
              [update.skillArea]: update.improvementScore
            }
          }
        }
      })
    }
  }, [activeSession])

  const handleCoachSelection = useCallback((coach: CoachPersona) => {
    setSelectedCoach(coach)
  }, [])

  const renderViewContent = () => {
    const commonProps = {
      userProfile,
      developmentFocus,
      careerContext: getCurrentTransitionType(userProfile.currentRole, userProfile.targetRole),
      industryContext: userProfile.industry,
      onSessionStart: handleSessionStart,
      onSessionEnd: handleSessionEnd,
      onProgressUpdate: handleProgressUpdate
    }

    switch (currentView) {
      case 'CONVERSATION':
        return (
          <ConversationView
            {...commonProps}
            activeSession={activeSession}
            selectedCoach={selectedCoach}
            isSessionActive={isSessionActive}
            onCoachSelection={handleCoachSelection}
          />
        )
      
      case 'DASHBOARD':
        return (
          <DevelopmentDashboard
            {...commonProps}
            sessionHistory={sessionHistory}
            progressMetrics={activeSession?.userProgress || getDefaultProgressMetrics()}
          />
        )
      
      case 'PLAN':
        return (
          <PersonalizedPlan
            {...commonProps}
            sessionHistory={sessionHistory}
            recommendedCoaches={getRecommendedCoaches(userProfile)}
          />
        )
      
      case 'HISTORY':
        return (
          <CoachingHistory
            {...commonProps}
            sessionHistory={sessionHistory}
            onSessionReview={(session) => setActiveSession(session)}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Executive Coaching
            </h1>
            
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('CONVERSATION')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'CONVERSATION'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Coaching Session
              </button>
              
              <button
                onClick={() => setCurrentView('DASHBOARD')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'DASHBOARD'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Progress Dashboard
              </button>
              
              <button
                onClick={() => setCurrentView('PLAN')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'PLAN'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Development Plan
              </button>
              
              <button
                onClick={() => setCurrentView('HISTORY')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'HISTORY'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Session History
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSessionActive && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">
                  Session Active
                </span>
              </div>
            )}
            
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderViewContent()}
      </div>
    </div>
  )
}

// Helper functions
function getCurrentTransitionType(currentRole: string, targetRole: string): PMTransitionType {
  const transition = `${currentRole}_TO_${targetRole}`
  switch (transition) {
    case 'PO_TO_PM': return 'PO_TO_PM'
    case 'PM_TO_SENIOR_PM': return 'PM_TO_SENIOR_PM'
    case 'SENIOR_PM_TO_GROUP_PM': return 'SENIOR_PM_TO_GROUP_PM'
    case 'GROUP_PM_TO_DIRECTOR': return 'GROUP_PM_TO_DIRECTOR'
    default: return 'PM_TO_SENIOR_PM'
  }
}

function deriveInitialDevelopmentFocus(userProfile: UserProfile): DevelopmentArea[] {
  // Mock implementation - derive from user profile
  return userProfile.developmentPriorities.slice(0, 3)
}

function selectOptimalCoach(userProfile: UserProfile, sessionType: CoachingSessionType): CoachPersona {
  // Select coach based on user's industry and session type
  const industryCoaches = mockCoachPersonas.filter(coach => 
    coach.industry === userProfile.industry
  )
  
  if (industryCoaches.length > 0) {
    return industryCoaches[0]
  }
  
  return mockCoachPersonas[0]
}

function getDefaultProgressMetrics() {
  return {
    skillProgression: {},
    sessionsCompleted: 0,
    totalDuration: 0,
    milestones: [],
    confidenceGrowth: [],
    weeklyProgress: []
  }
}

function getRecommendedCoaches(userProfile: UserProfile): CoachPersona[] {
  return mockCoachPersonas.filter(coach => 
    coach.industry === userProfile.industry || 
    coach.pmLevel === userProfile.targetRole
  ).slice(0, 3)
}