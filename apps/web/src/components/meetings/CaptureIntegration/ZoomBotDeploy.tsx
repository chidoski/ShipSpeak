/**
 * Zoom Bot Deployment Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Calendar integration and bot scheduling for Zoom meetings
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

interface ZoomBotDeployProps {
  onStartCapture: () => void
  isCapturing: boolean
}

export function ZoomBotDeploy({ onStartCapture, isCapturing }: ZoomBotDeployProps) {
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null)

  const upcomingMeetings = [
    {
      id: '1',
      title: 'Product Strategy Review',
      time: '2024-11-10T14:00:00Z',
      duration: 60,
      participants: 4,
      zoomLink: 'https://zoom.us/j/123456789'
    },
    {
      id: '2', 
      title: 'Engineering Sync',
      time: '2024-11-11T10:00:00Z',
      duration: 30,
      participants: 6,
      zoomLink: 'https://zoom.us/j/987654321'
    }
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Zoom Bot Deployment</h3>
      
      {/* Calendar Connection */}
      <div className="space-y-4">
        <div className={`p-4 rounded-lg border-2 ${
          calendarConnected ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                calendarConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="font-medium">Calendar Integration</span>
            </div>
            
            {!calendarConnected ? (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setCalendarConnected(true)}
              >
                Connect Calendar
              </Button>
            ) : (
              <span className="text-green-600 text-sm">✓ Connected</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Connect your calendar to automatically detect Zoom meetings
          </p>
        </div>

        {/* Upcoming Meetings */}
        {calendarConnected && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Upcoming Zoom Meetings</h4>
            <div className="space-y-2">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedMeeting === meeting.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMeeting(meeting.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{meeting.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(meeting.time).toLocaleString()} • {meeting.duration}m • {meeting.participants} participants
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="meeting"
                      checked={selectedMeeting === meeting.id}
                      onChange={() => setSelectedMeeting(meeting.id)}
                      className="text-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bot Configuration */}
        {selectedMeeting && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Bot Configuration</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="text-blue-600" />
                <span className="text-sm text-blue-800">Enable real-time quality monitoring</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="text-blue-600" />
                <span className="text-sm text-blue-800">Automatic participant consent collection</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="text-blue-600" />
                <span className="text-sm text-blue-800">Executive priority analysis</span>
              </label>
            </div>
          </div>
        )}

        {/* Deploy Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={onStartCapture}
            disabled={!selectedMeeting || isCapturing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCapturing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deploying Bot...
              </span>
            ) : (
              'Deploy Zoom Bot'
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}