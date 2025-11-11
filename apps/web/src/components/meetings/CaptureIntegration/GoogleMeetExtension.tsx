/**
 * Google Meet Extension Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Chrome extension interface for Google Meet capture
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

interface GoogleMeetExtensionProps {
  onStartCapture: () => void
  isCapturing: boolean
}

export function GoogleMeetExtension({ onStartCapture, isCapturing }: GoogleMeetExtensionProps) {
  const [extensionInstalled, setExtensionInstalled] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState('')
  
  const handleInstallExtension = () => {
    // Simulate extension installation
    setExtensionInstalled(true)
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Meet Extension</h3>
      
      <div className="space-y-4">
        {/* Extension Status */}
        <div className={`p-4 rounded-lg border-2 ${
          extensionInstalled ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                extensionInstalled ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="font-medium">Chrome Extension</span>
            </div>
            
            {!extensionInstalled ? (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleInstallExtension}
              >
                Install Extension
              </Button>
            ) : (
              <span className="text-green-600 text-sm">✓ Installed</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Install the ShipSpeak extension to capture Google Meet sessions
          </p>
        </div>

        {/* Meeting URL Input */}
        {extensionInstalled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Meet URL
              </label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the Google Meet URL to start capturing
              </p>
            </div>

            {/* Capture Settings */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-3">Capture Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="text-green-600" />
                  <span className="text-sm text-green-800">Real-time quality monitoring</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="text-green-600" />
                  <span className="text-sm text-green-800">Participant detection</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="text-green-600" />
                  <span className="text-sm text-green-800">Auto-start recording</span>
                </label>
              </div>
            </div>

            {/* Start Capture Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={onStartCapture}
                disabled={!meetingUrl || isCapturing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCapturing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Capturing...
                  </span>
                ) : (
                  'Start Capture'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}