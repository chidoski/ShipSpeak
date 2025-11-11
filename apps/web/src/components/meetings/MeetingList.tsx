/**
 * Meeting List Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Displays captured meetings with competency insights and pattern recognition
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { 
  CapturedMeeting, 
  MeetingArchiveFilters,
  CaptureMethod,
  MeetingType
} from '@/types/meeting'

interface MeetingListProps {
  meetings: CapturedMeeting[]
  loading: boolean
  error: string | null
  onMeetingSelect: (meeting: CapturedMeeting) => void
  onMeetingTypeFilter: (types: MeetingType[]) => void
  onCaptureMethodFilter: (methods: CaptureMethod[]) => void
  onQualityFilter: (threshold: number) => void
  onExecutiveFilter: (executiveOnly: boolean) => void
  filters: MeetingArchiveFilters
}

const meetingTypeConfig = {
  'ONE_ON_ONE': { label: '1:1', icon: '👤', color: 'blue' },
  'TEAM_STANDUP': { label: 'Team Standup', icon: '👥', color: 'green' },
  'STAKEHOLDER_REVIEW': { label: 'Stakeholder Review', icon: '🎯', color: 'purple' },
  'BOARD_PRESENTATION': { label: 'Board Presentation', icon: '🏛️', color: 'red' },
  'CRISIS_COMMUNICATION': { label: 'Crisis Communication', icon: '🚨', color: 'orange' },
  'CUSTOMER_MEETING': { label: 'Customer Meeting', icon: '🤝', color: 'cyan' },
  'SPEAKING_ENGAGEMENT': { label: 'Speaking Engagement', icon: '🎤', color: 'pink' }
} as const

const captureMethodConfig = {
  'ZOOM_BOT': { label: 'Zoom Bot', icon: '📹', color: 'blue' },
  'GOOGLE_MEET_EXTENSION': { label: 'Google Meet', icon: '🌐', color: 'green' },
  'TEAMS_APP': { label: 'Teams App', icon: '💼', color: 'purple' },
  'MANUAL_UPLOAD': { label: 'Manual Upload', icon: '📁', color: 'gray' }
} as const

export function MeetingList({
  meetings,
  loading,
  error,
  onMeetingSelect,
  onMeetingTypeFilter,
  onCaptureMethodFilter,
  onQualityFilter,
  onExecutiveFilter,
  filters
}: MeetingListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'quality' | 'competency'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 75) return 'text-blue-600 bg-blue-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getCompetencyHighlight = (meeting: CapturedMeeting) => {
    const scores = [
      meeting.competencyAnalysis.productSense.currentScore,
      meeting.competencyAnalysis.communication.currentScore,
      meeting.competencyAnalysis.stakeholderMgmt.currentScore,
      meeting.competencyAnalysis.technicalTranslation.currentScore,
      meeting.competencyAnalysis.businessImpact.currentScore
    ]
    
    const maxScore = Math.max(...scores)
    const maxIndex = scores.indexOf(maxScore)
    
    const competencies = ['Product Sense', 'Communication', 'Stakeholder Mgmt', 'Technical', 'Business Impact']
    return { competency: competencies[maxIndex], score: maxScore }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const sortedMeetings = [...meetings].sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1
    
    switch (sortBy) {
      case 'date':
        return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'quality':
        return order * (a.audioQualityScore - b.audioQualityScore)
      case 'competency':
        const aMax = getCompetencyHighlight(a).score
        const bMax = getCompetencyHighlight(b).score
        return order * (aMax - bMax)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-red-600 mb-4">⚠️ Error loading meetings</div>
        <p className="text-gray-600">{error}</p>
        <Button 
          variant="secondary" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </Card>
    )
  }

  if (meetings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or capture a new meeting to get started.
        </p>
        <Button variant="primary" onClick={() => {}}>
          Capture New Meeting
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {meetings.length} meeting{meetings.length === 1 ? '' : 's'}
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'quality' | 'competency')}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="quality">Sort by Quality</option>
            <option value="competency">Sort by Competency</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
          >
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      {/* Meeting Cards */}
      <div className="space-y-3">
        {sortedMeetings.map((meeting) => {
          const highlight = getCompetencyHighlight(meeting)
          const typeConfig = meetingTypeConfig[meeting.meetingType]
          const captureConfig = captureMethodConfig[meeting.captureMethod]
          
          return (
            <Card 
              key={meeting.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onMeetingSelect(meeting)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{typeConfig.icon}</span>
                      <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                      {meeting.executivePriority && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                          Executive Priority
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>{formatDate(meeting.createdAt)}</span>
                    <span>•</span>
                    <span>{formatDuration(meeting.duration)}</span>
                    <span>•</span>
                    <span>{meeting.participants.length} participant{meeting.participants.length === 1 ? '' : 's'}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <span>{captureConfig.icon}</span>
                      <span>{captureConfig.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-3">
                    {/* Quality Score */}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(meeting.audioQualityScore)}`}>
                      {meeting.audioQualityScore}% Quality
                    </div>
                    
                    {/* Top Competency */}
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {highlight.competency}: {highlight.score}%
                    </div>
                    
                    {/* Processing Status */}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      meeting.processingStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      meeting.processingStatus === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      meeting.processingStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {meeting.processingStatus}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Patterns Detected */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {meeting.competencyAnalysis.productSense.patterns.length + 
                       meeting.competencyAnalysis.communication.patterns.length} Patterns
                    </div>
                    <div className="text-xs text-gray-500">Detected</div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}