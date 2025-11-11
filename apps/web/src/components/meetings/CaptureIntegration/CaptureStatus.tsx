/**
 * Capture Status Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Real-time monitoring of meeting capture status and quality
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '../../ui/Card'
import { CaptureMethod } from '@/types/meeting'

interface CaptureStatusProps {
  method: CaptureMethod
  isActive: boolean
}

export function CaptureStatus({ method, isActive }: CaptureStatusProps) {
  const [status, setStatus] = useState({
    audioLevel: 85,
    speakerSeparation: 78,
    transcriptConfidence: 82,
    participantCount: 4,
    duration: 0,
    warnings: [] as string[]
  })

  // Simulate real-time status updates
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        audioLevel: Math.max(70, Math.min(95, prev.audioLevel + (Math.random() - 0.5) * 10)),
        speakerSeparation: Math.max(60, Math.min(90, prev.speakerSeparation + (Math.random() - 0.5) * 8)),
        transcriptConfidence: Math.max(65, Math.min(95, prev.transcriptConfidence + (Math.random() - 0.5) * 12)),
        duration: prev.duration + 1,
        warnings: prev.audioLevel < 75 ? ['Low audio quality detected'] : []
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getQualityColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const methodLabels = {
    ZOOM_BOT: 'Zoom Bot',
    GOOGLE_MEET_EXTENSION: 'Google Meet Extension', 
    TEAMS_APP: 'Teams App',
    MANUAL_UPLOAD: 'Manual Upload'
  }

  return (
    <Card className="p-6 border-green-200 bg-green-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-900">
          📹 Live Capture: {methodLabels[method]}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-800 font-medium">Recording</span>
        </div>
      </div>

      {/* Quality Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getQualityColor(status.audioLevel)}`}>
            {status.audioLevel}%
          </div>
          <div className="text-sm text-gray-600">Audio Level</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${getQualityColor(status.speakerSeparation)}`}>
            {status.speakerSeparation}%
          </div>
          <div className="text-sm text-gray-600">Speaker Separation</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${getQualityColor(status.transcriptConfidence)}`}>
            {status.transcriptConfidence}%
          </div>
          <div className="text-sm text-gray-600">Transcript Quality</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatDuration(status.duration)}
          </div>
          <div className="text-sm text-gray-600">Duration</div>
        </div>
      </div>

      {/* Participant Status */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Participants Detected:</span>
          <div className="flex items-center space-x-2">
            {[...Array(status.participantCount)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-blue-600">👤</span>
              </div>
            ))}
          </div>
        </div>
        <span className="text-sm text-gray-600">{status.participantCount} active</span>
      </div>

      {/* Warnings */}
      {status.warnings.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-sm font-medium text-yellow-800">Warnings</span>
          </div>
          <ul className="mt-1 text-sm text-yellow-700">
            {status.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Real-time Indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-2 bg-white rounded">
          <div className="text-xs text-gray-500 mb-1">Bot Status</div>
          <div className="text-sm font-medium text-green-600">Connected</div>
        </div>
        
        <div className="text-center p-2 bg-white rounded">
          <div className="text-xs text-gray-500 mb-1">Latency</div>
          <div className="text-sm font-medium text-blue-600">120ms</div>
        </div>
        
        <div className="text-center p-2 bg-white rounded">
          <div className="text-xs text-gray-500 mb-1">Data Usage</div>
          <div className="text-sm font-medium text-purple-600">2.4MB</div>
        </div>
      </div>
    </Card>
  )
}