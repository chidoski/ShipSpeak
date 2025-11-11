/**
 * Meeting Detail Modal Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Detailed view of captured meeting with competency analysis
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { CapturedMeeting } from '@/types/meeting'

interface MeetingDetailModalProps {
  meeting: CapturedMeeting
  isOpen: boolean
  onClose: () => void
}

export function MeetingDetailModal({ meeting, isOpen, onClose }: MeetingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'feedback'>('overview')

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const competencyScores = [
    { name: 'Product Sense', score: meeting.competencyAnalysis.productSense.currentScore, category: 'product-sense' },
    { name: 'Communication', score: meeting.competencyAnalysis.communication.currentScore, category: 'communication' },
    { name: 'Stakeholder Mgmt', score: meeting.competencyAnalysis.stakeholderMgmt.currentScore, category: 'stakeholder' },
    { name: 'Technical Translation', score: meeting.competencyAnalysis.technicalTranslation.currentScore, category: 'technical' },
    { name: 'Business Impact', score: meeting.competencyAnalysis.businessImpact.currentScore, category: 'business' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{meeting.title}</h2>
              <p className="text-gray-600">{formatDate(meeting.createdAt)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
            <span>{formatDuration(meeting.duration)}</span>
            <span>{meeting.participants.length} participants</span>
            <span className="capitalize">{meeting.captureMethod.toLowerCase().replace('_', ' ')}</span>
            <span className={`px-2 py-1 rounded text-xs ${getScoreColor(meeting.audioQualityScore)}`}>
              {meeting.audioQualityScore}% Quality
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'analysis', label: 'Competency Analysis' },
            { id: 'feedback', label: 'Feedback & Insights' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Participants */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Participants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meeting.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-600">{participant.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{participant.speakingTime}%</div>
                        <div className="text-xs text-gray-500">Speaking time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capture Quality */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Capture Quality</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-xl font-bold ${getScoreColor(meeting.captureQuality.audioLevel)}`}>
                      {meeting.captureQuality.audioLevel}%
                    </div>
                    <div className="text-sm text-gray-600">Audio Level</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-xl font-bold ${getScoreColor(meeting.captureQuality.speakerSeparation)}`}>
                      {meeting.captureQuality.speakerSeparation}%
                    </div>
                    <div className="text-sm text-gray-600">Speaker Separation</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-xl font-bold ${getScoreColor(meeting.captureQuality.transcriptConfidence)}`}>
                      {meeting.captureQuality.transcriptConfidence}%
                    </div>
                    <div className="text-sm text-gray-600">Transcript Quality</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{meeting.captureQuality.latency}ms</div>
                    <div className="text-sm text-gray-600">Latency</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Competency Scores */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Analysis</h3>
                <div className="space-y-4">
                  {competencyScores.map((competency, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{competency.name}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(competency.score)}`}>
                          {Math.round(competency.score)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${competency.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Presence Markers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Presence Markers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-700 mb-1">Board Readiness</div>
                    <div className="text-lg font-bold text-purple-900">
                      {meeting.competencyAnalysis.executivePresenceMarkers.boardReadiness}%
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 mb-1">Strategic Vision</div>
                    <div className="text-lg font-bold text-blue-900">
                      {meeting.competencyAnalysis.executivePresenceMarkers.strategicVisionCommunication}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {/* Feedback Type */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Feedback Analysis Type</h4>
                    <p className="text-sm text-blue-700 capitalize">
                      {meeting.feedbackComplexity.toLowerCase().replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-2xl">
                    {meeting.feedbackComplexity === 'PATTERN_BASED' ? '📊' :
                     meeting.feedbackComplexity === 'AI_ENHANCED' ? '🤖' : '🧠'}
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-3">
                  {meeting.competencyAnalysis.productSense.specificInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-0.5">💡</span>
                        <span className="text-gray-700">{insight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patterns Detected */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Patterns</h3>
                <div className="space-y-2">
                  {meeting.competencyAnalysis.communication.patterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <span className="font-medium text-green-900 capitalize">
                          {pattern.type.toLowerCase().replace('_', ' ')}
                        </span>
                        <div className="text-sm text-green-700">
                          Frequency: {Math.round(pattern.frequency * 100)}%
                        </div>
                      </div>
                      <span className="text-green-600">
                        {pattern.improvement === 'POSITIVE' ? '📈' : 
                         pattern.improvement === 'NEGATIVE' ? '📉' : '➡️'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">
            Generate Practice Module
          </Button>
        </div>
      </div>
    </div>
  )
}