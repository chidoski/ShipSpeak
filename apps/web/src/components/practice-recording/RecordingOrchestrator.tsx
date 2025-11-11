"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { ExerciseContext, UserProfile, RecordingSession, RecordingStatus } from '../../types/practice-recording'
import { DeviceSetup } from './AudioCapture/DeviceSetup'
import { RecordingStudio } from './RecordingInterface/RecordingStudio'
import { LiveTranscription } from './RealTimeCoaching/LiveTranscription'
import { CareerTransitionOptimizer } from './RecordingOptimization/CareerTransitionOptimizer'

interface RecordingOrchestratorProps {
  exerciseContext: ExerciseContext
  userProfile: UserProfile
  onSessionComplete: (session: RecordingSession) => void
  onSessionCancel: () => void
}

type RecordingPhase = 'SETUP' | 'RECORDING' | 'PAUSED' | 'COMPLETED' | 'ANALYSIS'

export function RecordingOrchestrator({
  exerciseContext,
  userProfile,
  onSessionComplete,
  onSessionCancel
}: RecordingOrchestratorProps) {
  const [currentPhase, setCurrentPhase] = useState<RecordingPhase>('SETUP')
  const [currentSession, setCurrentSession] = useState<RecordingSession | null>(null)
  const [isDeviceReady, setIsDeviceReady] = useState(false)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [recordingData, setRecordingData] = useState<Blob[]>([])

  // Initialize recording session
  const initializeSession = useCallback(() => {
    const session: RecordingSession = {
      id: `session-${Date.now()}`,
      exerciseId: exerciseContext.id,
      userId: userProfile.id,
      startTime: new Date(),
      duration: 0,
      status: 'SETUP',
      audioQualityMetrics: [],
      transcription: {
        fullText: '',
        wordTimestamps: [],
        confidence: 0,
        speakingRate: 0,
        pauseAnalysis: {
          totalPauses: 0,
          averagePauseLength: 0,
          strategicPauses: 0,
          fillerWords: 0
        }
      },
      coachingEvents: []
    }
    setCurrentSession(session)
  }, [exerciseContext.id, userProfile.id])

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  const handleDeviceSetupComplete = useCallback((stream: MediaStream) => {
    setMediaStream(stream)
    setIsDeviceReady(true)
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, status: 'RECORDING' } : null)
    }
  }, [currentSession])

  const startRecording = useCallback(() => {
    if (!mediaStream || !currentSession) return

    setCurrentPhase('RECORDING')
    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'RECORDING',
      startTime: new Date()
    } : null)
  }, [mediaStream, currentSession])

  const pauseRecording = useCallback(() => {
    setCurrentPhase('PAUSED')
    setCurrentSession(prev => prev ? { ...prev, status: 'PAUSED' } : null)
  }, [])

  const resumeRecording = useCallback(() => {
    setCurrentPhase('RECORDING')
    setCurrentSession(prev => prev ? { ...prev, status: 'RECORDING' } : null)
  }, [])

  const stopRecording = useCallback(() => {
    setCurrentPhase('COMPLETED')
    if (currentSession) {
      const completedSession: RecordingSession = {
        ...currentSession,
        endTime: new Date(),
        status: 'COMPLETED',
        duration: Date.now() - currentSession.startTime.getTime()
      }
      setCurrentSession(completedSession)
      onSessionComplete(completedSession)
    }
  }, [currentSession, onSessionComplete])

  const cancelRecording = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
    }
    setMediaStream(null)
    setIsDeviceReady(false)
    setCurrentPhase('SETUP')
    onSessionCancel()
  }, [mediaStream, onSessionCancel])

  const handleRecordingData = useCallback((data: Blob) => {
    setRecordingData(prev => [...prev, data])
  }, [])

  if (!currentSession) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg">Initializing recording session...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Exercise Context Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{exerciseContext.title}</h1>
              <p className="text-gray-600 mt-1">{exerciseContext.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>Time Limit: {Math.floor(exerciseContext.timeLimit / 60)}m {exerciseContext.timeLimit % 60}s</span>
                <span>Difficulty: {exerciseContext.difficulty}</span>
                <span>Industry: {exerciseContext.industryContext}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={cancelRecording}
              className="text-red-600 hover:text-red-700"
            >
              Cancel Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Career Transition Optimization */}
      <CareerTransitionOptimizer 
        userProfile={userProfile}
        exerciseContext={exerciseContext}
        currentPhase={currentPhase}
      />

      {currentPhase === 'SETUP' && (
        <DeviceSetup
          onSetupComplete={handleDeviceSetupComplete}
          exerciseContext={exerciseContext}
          userProfile={userProfile}
        />
      )}

      {(currentPhase === 'RECORDING' || currentPhase === 'PAUSED') && mediaStream && (
        <>
          <RecordingStudio
            mediaStream={mediaStream}
            exerciseContext={exerciseContext}
            userProfile={userProfile}
            recordingState={{
              isRecording: currentPhase === 'RECORDING',
              isPaused: currentPhase === 'PAUSED',
              duration: currentSession.duration,
              startTime: currentSession.startTime,
              pausedTime: 0,
              maxDuration: exerciseContext.timeLimit * 1000
            }}
            onStartRecording={startRecording}
            onPauseRecording={pauseRecording}
            onResumeRecording={resumeRecording}
            onStopRecording={stopRecording}
            onRecordingData={handleRecordingData}
          />

          <LiveTranscription
            mediaStream={mediaStream}
            isActive={currentPhase === 'RECORDING'}
            exerciseContext={exerciseContext}
            userProfile={userProfile}
          />
        </>
      )}

      {currentPhase === 'COMPLETED' && (
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Recording Completed</h2>
            <p className="text-gray-600 mb-6">
              Your practice session has been successfully recorded and is being analyzed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setCurrentPhase('SETUP')}>
                Record Again
              </Button>
              <Button variant="outline" onClick={cancelRecording}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Criteria Display */}
      {currentPhase !== 'SETUP' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Success Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exerciseContext.successCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>{criteria}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}