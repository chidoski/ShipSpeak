"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Alert, AlertDescription } from '../../ui/alert'
import { ExerciseContext, UserProfile, ContextualHint, PromptType, PromptUrgency } from '../../../types/practice-recording'
import { Lightbulb, X, Eye, EyeOff, Brain, Clock, Target, TrendingUp, MessageSquare } from 'lucide-react'

interface CoachingOverlayProps {
  isRecording: boolean
  exerciseContext: ExerciseContext
  userProfile: UserProfile
  audioLevel: number
  onToggleCoaching: () => void
}

interface ActiveCoachingHint {
  id: string
  type: PromptType
  message: string
  urgency: PromptUrgency
  careerRelevance: string
  timestamp: Date
  dismissedAt?: Date
}

export function CoachingOverlay({
  isRecording,
  exerciseContext,
  userProfile,
  audioLevel,
  onToggleCoaching
}: CoachingOverlayProps) {
  const [activeHints, setActiveHints] = useState<ActiveCoachingHint[]>([])
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set())
  const [isMinimized, setIsMinimized] = useState(false)
  const [coachingIntensity, setCoachingIntensity] = useState(userProfile.coachingPreferences.coachingIntensity)
  const [lastHintTime, setLastHintTime] = useState(Date.now())

  // Generate contextual coaching hints based on recording state
  const generateCoachingHints = useCallback(() => {
    if (!isRecording || !userProfile.coachingPreferences.realTimeHints) return

    const timeSinceLastHint = Date.now() - lastHintTime
    const intensityDelay = coachingIntensity === 'HIGH' ? 15000 : coachingIntensity === 'MEDIUM' ? 30000 : 60000
    
    if (timeSinceLastHint < intensityDelay) return

    const hints: Partial<ContextualHint>[] = []

    // Audio level-based hints
    if (audioLevel < 40) {
      hints.push({
        type: 'CONFIDENCE_BUILDING',
        message: 'Project your voice with more confidence - you have valuable insights to share!',
        urgency: 'MEDIUM',
        careerRelevance: 'Executive presence requires confident vocal projection',
        triggerCondition: 'LOW_AUDIO_LEVEL'
      })
    }

    // Time-based framework reminders
    const sessionDuration = Date.now() - (Date.now() - 60000) // Mock session start
    if (sessionDuration > 30000 && sessionDuration < 35000) {
      hints.push({
        type: 'FRAMEWORK_REMINDER',
        message: 'Consider applying RICE framework: Reach × Impact × Confidence ÷ Effort',
        urgency: 'MEDIUM',
        careerRelevance: 'Framework application demonstrates PM analytical thinking',
        triggerCondition: 'TIME_BASED_FRAMEWORK'
      })
    }

    // Career transition-specific hints
    if (userProfile.currentRole === 'PO' && userProfile.targetRole === 'PM') {
      hints.push({
        type: 'STAKEHOLDER_ADAPTATION',
        message: 'Focus on business outcomes rather than delivery details',
        urgency: 'HIGH',
        careerRelevance: 'PO→PM transition requires business language fluency',
        triggerCondition: 'CAREER_TRANSITION'
      })
    }

    if (userProfile.currentRole === 'PM' && userProfile.targetRole === 'SENIOR_PM') {
      hints.push({
        type: 'STRUCTURE_GUIDANCE',
        message: 'Start with your recommendation, then provide supporting evidence (answer-first)',
        urgency: 'HIGH',
        careerRelevance: 'Executive communication structure essential for Senior PM',
        triggerCondition: 'EXECUTIVE_STRUCTURE'
      })
    }

    // Exercise type-specific hints
    if (exerciseContext.type === 'BOARD_PRESENTATION') {
      hints.push({
        type: 'TIME_MANAGEMENT',
        message: 'Aim to complete your key message in the first 30 seconds',
        urgency: 'HIGH',
        careerRelevance: 'Board presentations require immediate impact',
        triggerCondition: 'BOARD_TIMING'
      })
    }

    // Industry-specific hints
    if (exerciseContext.industryContext === 'fintech') {
      hints.push({
        type: 'FRAMEWORK_REMINDER',
        message: 'Consider regulatory compliance and risk management in your reasoning',
        urgency: 'MEDIUM',
        careerRelevance: 'Fintech PM communication requires compliance awareness',
        triggerCondition: 'INDUSTRY_CONTEXT'
      })
    }

    // Convert to active hints and filter out dismissed ones
    const newActiveHints: ActiveCoachingHint[] = hints
      .filter(hint => hint.triggerCondition && !dismissedHints.has(hint.triggerCondition))
      .map(hint => ({
        id: `hint-${Date.now()}-${Math.random()}`,
        type: hint.type!,
        message: hint.message!,
        urgency: hint.urgency!,
        careerRelevance: hint.careerRelevance!,
        timestamp: new Date(),
        triggerCondition: hint.triggerCondition!
      })) as ActiveCoachingHint[]

    if (newActiveHints.length > 0) {
      setActiveHints(prev => [...prev, ...newActiveHints.slice(0, 1)]) // Limit to one new hint at a time
      setLastHintTime(Date.now())
    }
  }, [isRecording, audioLevel, coachingIntensity, userProfile, exerciseContext, lastHintTime, dismissedHints])

  // Generate hints periodically
  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(generateCoachingHints, 5000)
    return () => clearInterval(interval)
  }, [generateCoachingHints, isRecording])

  // Auto-dismiss hints after timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveHints(prev => 
        prev.filter(hint => Date.now() - hint.timestamp.getTime() < 20000)
      )
    }, 1000)

    return () => clearTimeout(timeout)
  }, [activeHints])

  const dismissHint = (hintId: string, triggerCondition: string) => {
    setActiveHints(prev => prev.filter(hint => hint.id !== hintId))
    setDismissedHints(prev => new Set([...prev, triggerCondition]))
  }

  const getUrgencyColor = (urgency: PromptUrgency) => {
    switch (urgency) {
      case 'CRITICAL': return 'border-red-500 bg-red-50'
      case 'HIGH': return 'border-orange-500 bg-orange-50'
      case 'MEDIUM': return 'border-blue-500 bg-blue-50'
      case 'LOW': return 'border-gray-500 bg-gray-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const getTypeIcon = (type: PromptType) => {
    switch (type) {
      case 'FRAMEWORK_REMINDER': return <Brain className="h-4 w-4" />
      case 'STRUCTURE_GUIDANCE': return <Target className="h-4 w-4" />
      case 'CONFIDENCE_BUILDING': return <TrendingUp className="h-4 w-4" />
      case 'TIME_MANAGEMENT': return <Clock className="h-4 w-4" />
      case 'STAKEHOLDER_ADAPTATION': return <MessageSquare className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: PromptType) => {
    switch (type) {
      case 'FRAMEWORK_REMINDER': return 'Framework'
      case 'STRUCTURE_GUIDANCE': return 'Structure'
      case 'CONFIDENCE_BUILDING': return 'Confidence'
      case 'TIME_MANAGEMENT': return 'Timing'
      case 'STAKEHOLDER_ADAPTATION': return 'Stakeholder'
      default: return 'Coaching'
    }
  }

  if (isMinimized) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => setIsMinimized(false)}
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
        >
          <Eye className="h-4 w-4 mr-1" />
          Show Coaching ({activeHints.length})
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute top-4 right-4 z-10 space-y-2 max-w-md">
      {/* Coaching Header */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg border p-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Real-time Coaching</span>
          {isRecording && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsMinimized(true)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
          <Button
            onClick={onToggleCoaching}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Active Coaching Hints */}
      {activeHints.length > 0 && (
        <div className="space-y-2">
          {activeHints.slice(0, 3).map((hint, index) => (
            <Alert
              key={hint.id}
              className={`${getUrgencyColor(hint.urgency)} border-l-4 bg-white/95 backdrop-blur-sm animate-fade-in-up`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {getTypeIcon(hint.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(hint.type)}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${hint.urgency === 'HIGH' || hint.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' : ''}`}
                      >
                        {hint.urgency}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm font-medium mb-1">
                      {hint.message}
                    </AlertDescription>
                    <p className="text-xs text-gray-600">
                      💡 {hint.careerRelevance}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => dismissHint(hint.id, (hint as any).triggerCondition)}
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 opacity-50 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Coaching Intensity Control */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Coaching Intensity</span>
          <div className="flex gap-1">
            {(['LOW', 'MEDIUM', 'HIGH'] as const).map(intensity => (
              <Button
                key={intensity}
                onClick={() => setCoachingIntensity(intensity)}
                size="sm"
                variant={coachingIntensity === intensity ? 'default' : 'ghost'}
                className="h-6 px-2 text-xs"
              >
                {intensity}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Career Context Reminder */}
      <div className="bg-blue-50/90 backdrop-blur-sm rounded-lg border border-blue-200 p-2">
        <div className="text-xs">
          <div className="flex items-center gap-1 mb-1">
            <Target className="h-3 w-3 text-blue-600" />
            <span className="font-medium text-blue-800">
              {userProfile.currentRole} → {userProfile.targetRole}
            </span>
          </div>
          <p className="text-blue-700">
            Practice focuses on {exerciseContext.industryContext} PM communication for {exerciseContext.type.replace('_', ' ').toLowerCase()}
          </p>
        </div>
      </div>

      {/* Encouragement Messages */}
      {isRecording && activeHints.length === 0 && (
        <div className="bg-green-50/90 backdrop-blur-sm rounded-lg border border-green-200 p-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div className="text-xs text-green-800">
              <p className="font-medium">Great communication flow!</p>
              <p>Continue applying your PM frameworks naturally</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}