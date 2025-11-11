"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Alert, AlertDescription } from '../../ui/alert'
import { Progress } from '../../ui/progress'
import { ExerciseContext, UserProfile, AudioQuality, QualityRating, OptimizationSuggestion } from '../../../types/practice-recording'
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle2, Settings } from 'lucide-react'

interface DeviceSetupProps {
  onSetupComplete: (stream: MediaStream) => void
  exerciseContext: ExerciseContext
  userProfile: UserProfile
}

interface DeviceInfo {
  deviceId: string
  label: string
  kind: string
  isDefault: boolean
}

export function DeviceSetup({ onSetupComplete, exerciseContext, userProfile }: DeviceSetupProps) {
  const [devices, setDevices] = useState<DeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)
  const [isTestingAudio, setIsTestingAudio] = useState(false)
  const [audioQuality, setAudioQuality] = useState<AudioQuality | null>(null)
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([])
  const [setupPhase, setSetupPhase] = useState<'PERMISSIONS' | 'DEVICE_SELECTION' | 'QUALITY_TEST' | 'READY'>('PERMISSIONS')
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Request microphone permissions and enumerate devices
  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      setPermissionGranted(true)
      setCurrentStream(stream)
      setSetupPhase('DEVICE_SELECTION')
      
      // Enumerate available devices
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = deviceList
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
          kind: device.kind,
          isDefault: device.deviceId === 'default'
        }))
      
      setDevices(audioInputs)
      
      // Select default device
      const defaultDevice = audioInputs.find(d => d.isDefault) || audioInputs[0]
      if (defaultDevice) {
        setSelectedDevice(defaultDevice.deviceId)
      }
      
    } catch (error) {
      console.error('Error requesting microphone permissions:', error)
      setOptimizationSuggestions([{
        issue: 'DEVICE_ISSUE',
        suggestion: 'Please grant microphone access to continue with practice recording',
        impact: 'Required for audio capture and analysis',
        priority: 'HIGH'
      }])
    }
  }, [])

  // Test audio quality with selected device
  const testAudioQuality = useCallback(async () => {
    if (!selectedDevice) return

    setIsTestingAudio(true)
    setIsAnalyzing(true)
    setSetupPhase('QUALITY_TEST')

    try {
      // Stop current stream
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop())
      }

      // Create new stream with selected device
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: selectedDevice },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      })

      setCurrentStream(stream)

      // Simulate audio quality analysis
      setTimeout(() => {
        const mockQuality: AudioQuality = {
          clarity: 85 + Math.random() * 10,
          noiseLevel: 10 + Math.random() * 15,
          volume: 70 + Math.random() * 20,
          overall: 'GOOD' as QualityRating,
          timestamp: new Date()
        }

        setAudioQuality(mockQuality)
        generateOptimizationSuggestions(mockQuality)
        setIsAnalyzing(false)
        setIsTestingAudio(false)
        setSetupPhase('READY')
      }, 3000)

    } catch (error) {
      console.error('Error testing audio quality:', error)
      setIsTestingAudio(false)
      setIsAnalyzing(false)
      setOptimizationSuggestions([{
        issue: 'DEVICE_ISSUE',
        suggestion: 'Unable to access selected microphone. Please try a different device.',
        impact: 'Critical for recording quality',
        priority: 'HIGH'
      }])
    }
  }, [selectedDevice, currentStream])

  const generateOptimizationSuggestions = (quality: AudioQuality) => {
    const suggestions: OptimizationSuggestion[] = []

    if (quality.clarity < 80) {
      suggestions.push({
        issue: 'LOW_CLARITY',
        suggestion: 'Move closer to microphone and speak directly into it',
        impact: 'Improves transcription accuracy and feedback quality',
        priority: 'HIGH'
      })
    }

    if (quality.noiseLevel > 20) {
      suggestions.push({
        issue: 'BACKGROUND_NOISE',
        suggestion: 'Find a quieter environment or use headphones with microphone',
        impact: 'Reduces distractions and improves analysis accuracy',
        priority: 'MEDIUM'
      })
    }

    if (quality.volume < 60) {
      suggestions.push({
        issue: 'LOW_VOLUME',
        suggestion: 'Speak with more projection and confidence',
        impact: 'Essential for executive presence development',
        priority: 'HIGH'
      })
    }

    if (quality.volume > 90) {
      suggestions.push({
        issue: 'HIGH_VOLUME',
        suggestion: 'Reduce microphone gain or speak more softly',
        impact: 'Prevents audio distortion and clipping',
        priority: 'MEDIUM'
      })
    }

    setOptimizationSuggestions(suggestions)
  }

  const completeSetup = useCallback(() => {
    if (currentStream && audioQuality) {
      onSetupComplete(currentStream)
    }
  }, [currentStream, audioQuality, onSetupComplete])

  const retestQuality = useCallback(() => {
    setAudioQuality(null)
    setOptimizationSuggestions([])
    testAudioQuality()
  }, [testAudioQuality])

  useEffect(() => {
    return () => {
      if (currentStream && setupPhase !== 'READY') {
        currentStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [currentStream, setupPhase])

  const getQualityColor = (rating: QualityRating) => {
    switch (rating) {
      case 'EXCELLENT': return 'text-green-600'
      case 'GOOD': return 'text-blue-600'
      case 'ACCEPTABLE': return 'text-yellow-600'
      case 'POOR': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getQualityIcon = (rating: QualityRating) => {
    switch (rating) {
      case 'EXCELLENT':
      case 'GOOD':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'ACCEPTABLE':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'POOR':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Mic className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Audio Setup for {exerciseContext.type.replace('_', ' ')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permissions Phase */}
          {setupPhase === 'PERMISSIONS' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mic className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Microphone Access Required</h3>
                <p className="text-gray-600">
                  We need access to your microphone to provide real-time coaching and quality analysis during your practice session.
                </p>
              </div>
              <Button onClick={requestPermissions} size="lg">
                Grant Microphone Access
              </Button>
            </div>
          )}

          {/* Device Selection Phase */}
          {setupPhase === 'DEVICE_SELECTION' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Audio Device</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.map(device => (
                  <Card 
                    key={device.deviceId}
                    className={`cursor-pointer transition-all ${
                      selectedDevice === device.deviceId 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDevice(device.deviceId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Mic className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <p className="font-medium">{device.label}</p>
                          {device.isDefault && (
                            <p className="text-sm text-green-600">Default device</p>
                          )}
                        </div>
                        {selectedDevice === device.deviceId && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button 
                onClick={testAudioQuality} 
                disabled={!selectedDevice}
                className="w-full"
              >
                Test Audio Quality
              </Button>
            </div>
          )}

          {/* Quality Test Phase */}
          {setupPhase === 'QUALITY_TEST' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Testing Audio Quality</h3>
                <p className="text-gray-600 mb-4">
                  Please speak naturally for a few seconds while we analyze your audio quality...
                </p>
                {isAnalyzing && <Progress value={33} className="w-full" />}
              </div>

              {audioQuality && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Volume2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Clarity</p>
                        <p className="text-lg font-semibold">{Math.round(audioQuality.clarity)}%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Volume2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Volume</p>
                        <p className="text-lg font-semibold">{Math.round(audioQuality.volume)}%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <MicOff className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Noise Level</p>
                        <p className="text-lg font-semibold">{Math.round(audioQuality.noiseLevel)}%</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getQualityIcon(audioQuality.overall)}
                        <span className={`font-semibold ${getQualityColor(audioQuality.overall)}`}>
                          Overall Quality: {audioQuality.overall}
                        </span>
                      </div>
                      <Progress 
                        value={audioQuality.overall === 'EXCELLENT' ? 95 : 
                               audioQuality.overall === 'GOOD' ? 80 :
                               audioQuality.overall === 'ACCEPTABLE' ? 60 : 40} 
                        className="w-full" 
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Optimization Suggestions */}
          {optimizationSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Optimization Suggestions</h4>
              {optimizationSuggestions.map((suggestion, index) => (
                <Alert key={index}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{suggestion.suggestion}</strong> - {suggestion.impact}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Setup Complete */}
          {setupPhase === 'READY' && audioQuality && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Audio setup complete!</span>
              </div>
              <div className="flex gap-4">
                <Button onClick={completeSetup} className="flex-1">
                  Start Recording Session
                </Button>
                <Button onClick={retestQuality} variant="outline">
                  Retest Quality
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise Context Reminder */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Practice Session Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Career Focus</p>
              <p className="font-medium">{userProfile.currentRole} → {userProfile.targetRole}</p>
            </div>
            <div>
              <p className="text-gray-600">Industry Context</p>
              <p className="font-medium">{exerciseContext.industryContext}</p>
            </div>
            <div>
              <p className="text-gray-600">Session Type</p>
              <p className="font-medium">{exerciseContext.type.replace('_', ' ')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}