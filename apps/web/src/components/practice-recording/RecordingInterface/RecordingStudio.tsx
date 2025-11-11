"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Progress } from '../../ui/progress'
import { ExerciseContext, UserProfile, RecordingControlInterface, AudioQuality, QualityRating } from '../../../types/practice-recording'
import { Mic, MicOff, Pause, Play, Square, RotateCcw, Volume2 } from 'lucide-react'
import { QualityMonitoring } from '../AudioCapture/QualityMonitoring'
import { CoachingOverlay } from './CoachingOverlay'

interface RecordingStudioProps {
  mediaStream: MediaStream
  exerciseContext: ExerciseContext
  userProfile: UserProfile
  recordingState: RecordingControlInterface
  onStartRecording: () => void
  onPauseRecording: () => void
  onResumeRecording: () => void
  onStopRecording: () => void
  onRecordingData: (data: Blob) => void
}

export function RecordingStudio({
  mediaStream,
  exerciseContext,
  userProfile,
  recordingState,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onRecordingData
}: RecordingStudioProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingChunks, setRecordingChunks] = useState<Blob[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [currentQuality, setCurrentQuality] = useState<AudioQuality | null>(null)
  const [showCoaching, setShowCoaching] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()
  const timerRef = useRef<NodeJS.Timeout>()

  // Initialize audio analysis
  useEffect(() => {
    if (!mediaStream || isInitialized) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(mediaStream)
      
      analyser.fftSize = 256
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      setIsInitialized(true)
      
      // Initialize MediaRecorder
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordingChunks(prev => [...prev, event.data])
          onRecordingData(event.data)
        }
      }
      
      setMediaRecorder(recorder)
      
    } catch (error) {
      console.error('Error initializing audio analysis:', error)
    }
  }, [mediaStream, isInitialized, onRecordingData])

  // Audio level monitoring
  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    analyser.getByteFrequencyData(dataArray)
    
    const sum = dataArray.reduce((a, b) => a + b, 0)
    const average = sum / bufferLength
    const normalizedLevel = Math.min(100, (average / 128) * 100)
    
    setAudioLevel(normalizedLevel)
    
    // Generate mock quality metrics
    const mockQuality: AudioQuality = {
      clarity: 80 + Math.random() * 15,
      noiseLevel: 5 + Math.random() * 10,
      volume: normalizedLevel,
      overall: normalizedLevel > 70 ? 'GOOD' : normalizedLevel > 50 ? 'ACCEPTABLE' : 'POOR' as QualityRating,
      timestamp: new Date()
    }
    
    setCurrentQuality(mockQuality)
    
    if (recordingState.isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
    }
  }, [recordingState.isRecording])

  // Start audio monitoring when recording
  useEffect(() => {
    if (recordingState.isRecording && analyserRef.current) {
      updateAudioLevel()
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [recordingState.isRecording, updateAudioLevel])

  // Timer for recording duration
  useEffect(() => {
    if (recordingState.isRecording) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1000)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [recordingState.isRecording])

  const handleStartRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      setRecordingChunks([])
      setCurrentTime(0)
      mediaRecorder.start(100) // Collect data every 100ms
    }
    onStartRecording()
  }, [mediaRecorder, onStartRecording])

  const handlePauseRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
    }
    onPauseRecording()
  }, [mediaRecorder, onPauseRecording])

  const handleResumeRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
    }
    onResumeRecording()
  }, [mediaRecorder, onResumeRecording])

  const handleStopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    onStopRecording()
  }, [mediaRecorder, onStopRecording])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (exerciseContext.timeLimit === 0) return 0
    return Math.min(100, (currentTime / (exerciseContext.timeLimit * 1000)) * 100)
  }

  const getRemainingTime = () => {
    const remaining = Math.max(0, (exerciseContext.timeLimit * 1000) - currentTime)
    return formatTime(remaining)
  }

  const getRecordingStatusColor = () => {
    if (recordingState.isRecording) return 'text-red-500'
    if (recordingState.isPaused) return 'text-yellow-500'
    return 'text-gray-500'
  }

  const getRecordingStatusText = () => {
    if (recordingState.isRecording) return 'RECORDING'
    if (recordingState.isPaused) return 'PAUSED'
    return 'READY'
  }

  return (
    <div className="w-full space-y-6">
      {/* Recording Studio Interface */}
      <Card className="relative">
        <CardContent className="p-8">
          {/* Coaching Overlay */}
          {showCoaching && (
            <CoachingOverlay
              isRecording={recordingState.isRecording}
              exerciseContext={exerciseContext}
              userProfile={userProfile}
              audioLevel={audioLevel}
              onToggleCoaching={() => setShowCoaching(!showCoaching)}
            />
          )}

          {/* Main Recording Interface */}
          <div className="text-center space-y-6">
            {/* Recording Status Indicator */}
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center space-x-2 ${getRecordingStatusColor()}`}>
                {recordingState.isRecording ? (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                ) : recordingState.isPaused ? (
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                ) : (
                  <div className="w-3 h-3 bg-gray-500 rounded-full" />
                )}
                <span className="text-sm font-medium">{getRecordingStatusText()}</span>
              </div>
            </div>

            {/* Time Display */}
            <div className="space-y-2">
              <div className="text-4xl font-mono font-bold">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-600">
                Time Remaining: {getRemainingTime()}
              </div>
              <Progress value={getProgressPercentage()} className="w-full max-w-md mx-auto" />
            </div>

            {/* Audio Level Visualizer */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Volume2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Audio Level</span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <Progress 
                  value={audioLevel} 
                  className="w-full h-2"
                />
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(audioLevel)}%
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!recordingState.isRecording && !recordingState.isPaused && (
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Start Recording
                </Button>
              )}

              {recordingState.isRecording && (
                <>
                  <Button
                    onClick={handlePauseRecording}
                    size="lg"
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                  <Button
                    onClick={handleStopRecording}
                    size="lg"
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                </>
              )}

              {recordingState.isPaused && (
                <>
                  <Button
                    onClick={handleResumeRecording}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Resume
                  </Button>
                  <Button
                    onClick={handleStopRecording}
                    size="lg"
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentTime(0)
                      setRecordingChunks([])
                      handleStartRecording()
                    }}
                    size="lg"
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Restart
                  </Button>
                </>
              )}
            </div>

            {/* Toggle Coaching Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => setShowCoaching(!showCoaching)}
                variant="ghost"
                size="sm"
                className="text-gray-600"
              >
                {showCoaching ? 'Hide' : 'Show'} Real-time Coaching
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Monitoring */}
      {currentQuality && (
        <QualityMonitoring
          currentQuality={currentQuality}
          isRecording={recordingState.isRecording}
          exerciseContext={exerciseContext}
        />
      )}

      {/* Exercise Framework Reminders */}
      {exerciseContext.frameworkPrompts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Framework Reminders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exerciseContext.frameworkPrompts.map((prompt, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span>{prompt}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}