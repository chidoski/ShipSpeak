/**
 * Meeting Capture Integration Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Unified interface for Zoom/Google Meet/Teams capture methods
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { ZoomBotDeploy } from './ZoomBotDeploy'
import { GoogleMeetExtension } from './GoogleMeetExtension'
import { TeamsIntegration } from './TeamsIntegration'
import { CaptureStatus } from './CaptureStatus'
import { CaptureMethod } from '@/types/meeting'

interface CaptureIntegrationProps {
  userId: string
  onMeetingCaptured?: () => void
}

export function CaptureIntegration({ userId, onMeetingCaptured }: CaptureIntegrationProps) {
  const [activeMethod, setActiveMethod] = useState<CaptureMethod | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const captureMethods = [
    {
      method: 'ZOOM_BOT' as const,
      name: 'Zoom Bot',
      icon: '📹',
      description: 'Automatic recording with AI bot deployment',
      features: ['Calendar integration', 'High quality audio', 'Auto transcription'],
      compatibility: 95,
      recommended: true
    },
    {
      method: 'GOOGLE_MEET_EXTENSION' as const,
      name: 'Google Meet Extension',
      icon: '🌐',
      description: 'Browser extension for seamless capture',
      features: ['One-click recording', 'Real-time quality monitoring', 'No app required'],
      compatibility: 90,
      recommended: false
    },
    {
      method: 'TEAMS_APP' as const,
      name: 'Teams App',
      icon: '💼',
      description: 'Microsoft Teams native integration',
      features: ['Enterprise compliance', 'Admin permissions', 'Security controls'],
      compatibility: 85,
      recommended: false
    },
    {
      method: 'MANUAL_UPLOAD' as const,
      name: 'Manual Upload',
      icon: '📁',
      description: 'Upload pre-recorded meeting files',
      features: ['Any format support', 'Offline processing', 'Privacy control'],
      compatibility: 100,
      recommended: false
    }
  ]

  const handleMethodSelect = (method: CaptureMethod) => {
    setActiveMethod(method)
  }

  const handleStartCapture = () => {
    setIsCapturing(true)
    // Simulate capture process
    setTimeout(() => {
      setIsCapturing(false)
      onMeetingCaptured?.()
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Meeting Capture</h2>
        <p className="text-gray-600">
          Choose your preferred method to capture and analyze your next meeting
        </p>
      </div>

      {/* Capture Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {captureMethods.map((methodConfig) => (
          <Card 
            key={methodConfig.method}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              activeMethod === methodConfig.method
                ? 'border-2 border-blue-500 bg-blue-50'
                : 'border border-gray-200'
            } ${methodConfig.recommended ? 'ring-2 ring-green-200' : ''}`}
            onClick={() => handleMethodSelect(methodConfig.method)}
          >
            {methodConfig.recommended && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium mb-2 inline-block">
                Recommended
              </div>
            )}
            
            <div className="text-center">
              <div className="text-3xl mb-2">{methodConfig.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{methodConfig.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{methodConfig.description}</p>
              
              <div className="space-y-1 mb-3">
                {methodConfig.features.map((feature, index) => (
                  <div key={index} className="text-xs text-gray-500 flex items-center justify-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  methodConfig.compatibility >= 95 ? 'bg-green-500' :
                  methodConfig.compatibility >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-600">{methodConfig.compatibility}% Compatible</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Active Method Configuration */}
      {activeMethod && (
        <div className="space-y-4">
          {activeMethod === 'ZOOM_BOT' && (
            <ZoomBotDeploy 
              onStartCapture={handleStartCapture}
              isCapturing={isCapturing}
            />
          )}
          
          {activeMethod === 'GOOGLE_MEET_EXTENSION' && (
            <GoogleMeetExtension 
              onStartCapture={handleStartCapture}
              isCapturing={isCapturing}
            />
          )}
          
          {activeMethod === 'TEAMS_APP' && (
            <TeamsIntegration 
              onStartCapture={handleStartCapture}
              isCapturing={isCapturing}
            />
          )}
          
          {activeMethod === 'MANUAL_UPLOAD' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Meeting Recording</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-4xl text-gray-400 mb-4">📁</div>
                <p className="text-gray-600 mb-4">
                  Drop your meeting recording here or click to browse
                </p>
                <Button variant="secondary">
                  Choose File
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Supports MP4, MP3, WAV, M4A files up to 500MB
                </p>
              </div>
            </Card>
          )}

          {/* Capture Status Monitor */}
          {isCapturing && (
            <CaptureStatus 
              method={activeMethod}
              isActive={isCapturing}
            />
          )}
        </div>
      )}

      {/* Quick Start Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• For best results, ensure stable internet connection during capture</li>
          <li>• Test your audio setup before important meetings</li>
          <li>• Executive meetings automatically receive priority AI analysis</li>
          <li>• All recordings are encrypted and stored securely</li>
        </ul>
      </Card>
    </div>
  )
}