"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Progress } from '../../ui/progress'
import { Badge } from '../../ui/badge'
import { Alert, AlertDescription } from '../../ui/alert'
import { AudioQuality, QualityRating, ExerciseContext } from '../../../types/practice-recording'
import { Volume2, Mic, MicOff, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

interface QualityMonitoringProps {
  currentQuality: AudioQuality
  isRecording: boolean
  exerciseContext: ExerciseContext
}

export function QualityMonitoring({ currentQuality, isRecording, exerciseContext }: QualityMonitoringProps) {
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
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'GOOD':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />
      case 'ACCEPTABLE':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'POOR':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Mic className="h-5 w-5 text-gray-600" />
    }
  }

  const getQualityScore = (rating: QualityRating) => {
    switch (rating) {
      case 'EXCELLENT': return 95
      case 'GOOD': return 80
      case 'ACCEPTABLE': return 60
      case 'POOR': return 30
      default: return 50
    }
  }

  const getOptimizationSuggestions = (quality: AudioQuality) => {
    const suggestions = []

    if (quality.clarity < 80) {
      suggestions.push({
        icon: <Mic className="h-4 w-4" />,
        message: 'Move closer to microphone for better clarity',
        priority: 'high' as const
      })
    }

    if (quality.noiseLevel > 20) {
      suggestions.push({
        icon: <MicOff className="h-4 w-4" />,
        message: 'Reduce background noise for cleaner recording',
        priority: 'medium' as const
      })
    }

    if (quality.volume < 60) {
      suggestions.push({
        icon: <Volume2 className="h-4 w-4" />,
        message: 'Speak with more projection and confidence',
        priority: 'high' as const
      })
    }

    if (quality.volume > 90) {
      suggestions.push({
        icon: <Volume2 className="h-4 w-4" />,
        message: 'Reduce volume to prevent audio distortion',
        priority: 'medium' as const
      })
    }

    return suggestions
  }

  const suggestions = getOptimizationSuggestions(currentQuality)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Quality Monitoring
          </div>
          <div className="flex items-center gap-2">
            {getQualityIcon(currentQuality.overall)}
            <Badge className={`${getQualityColor(currentQuality.overall)} bg-transparent border-current`}>
              {currentQuality.overall}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Quality Score */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold">
            <span className={getQualityColor(currentQuality.overall)}>
              {getQualityScore(currentQuality.overall)}%
            </span>
          </div>
          <p className="text-sm text-gray-600">Overall Quality Score</p>
          <Progress value={getQualityScore(currentQuality.overall)} className="w-full" />
        </div>

        {/* Quality Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {/* Clarity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Clarity</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(currentQuality.clarity)}%
            </div>
            <Progress value={currentQuality.clarity} className="w-full" />
            <div className="text-xs text-gray-500">
              {currentQuality.clarity >= 85 ? 'Excellent' :
               currentQuality.clarity >= 70 ? 'Good' :
               currentQuality.clarity >= 60 ? 'Fair' : 'Needs Improvement'}
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Volume</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(currentQuality.volume)}%
            </div>
            <Progress value={currentQuality.volume} className="w-full" />
            <div className="text-xs text-gray-500">
              {currentQuality.volume >= 80 ? 'Strong' :
               currentQuality.volume >= 60 ? 'Good' :
               currentQuality.volume >= 40 ? 'Adequate' : 'Too Quiet'}
            </div>
          </div>

          {/* Noise Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MicOff className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Noise</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(currentQuality.noiseLevel)}%
            </div>
            <Progress value={100 - currentQuality.noiseLevel} className="w-full" />
            <div className="text-xs text-gray-500">
              {currentQuality.noiseLevel <= 10 ? 'Excellent' :
               currentQuality.noiseLevel <= 20 ? 'Good' :
               currentQuality.noiseLevel <= 30 ? 'Acceptable' : 'Too Noisy'}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">
            {isRecording ? 'Live Monitoring Active' : 'Monitoring Paused'}
          </span>
        </div>

        {/* Optimization Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Quality Improvements</h4>
            {suggestions.map((suggestion, index) => (
              <Alert key={index} className={`${
                suggestion.priority === 'high' 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-start gap-2">
                  {suggestion.icon}
                  <AlertDescription className="text-sm">
                    {suggestion.message}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Exercise-Specific Quality Goals */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            Quality Goals for {exerciseContext.type.replace('_', ' ')}
          </h4>
          <div className="space-y-1 text-sm text-blue-700">
            {exerciseContext.type === 'BOARD_PRESENTATION' && (
              <>
                <div>• Clarity ≥85% for executive communication</div>
                <div>• Volume ≥75% for confident projection</div>
                <div>• Noise ≤10% for professional recording</div>
              </>
            )}
            {exerciseContext.type === 'STAKEHOLDER_UPDATE' && (
              <>
                <div>• Clarity ≥80% for clear communication</div>
                <div>• Volume ≥70% for stakeholder engagement</div>
                <div>• Noise ≤15% for meeting quality</div>
              </>
            )}
            {exerciseContext.type === 'PLANNING_SESSION' && (
              <>
                <div>• Clarity ≥75% for collaborative discussion</div>
                <div>• Volume ≥65% for group participation</div>
                <div>• Noise ≤20% for team environment</div>
              </>
            )}
          </div>
        </div>

        {/* Recording Quality History Indicator */}
        {isRecording && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Quality monitoring started {new Date(currentQuality.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}