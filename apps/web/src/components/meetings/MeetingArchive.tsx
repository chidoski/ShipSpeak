/**
 * Meeting Archive Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Main archive view with competency filters and meeting capture integration
 */

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { CompetencyFilters } from './CompetencyFilters/CompetencyFilters'
import { CaptureIntegration } from './CaptureIntegration/CaptureIntegration'
import { SmartFeedback } from './SmartFeedback/SmartFeedback'
import { ExecutiveFeatures } from './ExecutiveFeatures/ExecutiveFeatures'
import { MeetingList } from './MeetingList'
import { MeetingDetailModal } from './MeetingDetailModal'
import { mockMeetingArchive } from '@/lib/mockMeetingData'
import { 
  CapturedMeeting, 
  MeetingArchiveFilters, 
  MeetingSearchResults,
  CompetencyCategory,
  CaptureMethod,
  MeetingType
} from '@/types/meeting'

interface MeetingArchiveProps {
  userId?: string
  isExecutive?: boolean
  onMeetingSelect?: (meeting: CapturedMeeting) => void
}

export function MeetingArchive({ 
  userId = 'user-001', 
  isExecutive = false,
  onMeetingSelect 
}: MeetingArchiveProps) {
  const [meetings, setMeetings] = useState<CapturedMeeting[]>([])
  const [searchResults, setSearchResults] = useState<MeetingSearchResults | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<CapturedMeeting | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<MeetingArchiveFilters>({
    dateRange: {
      start: '2024-10-01',
      end: new Date().toISOString().split('T')[0]
    },
    competencyFocus: [],
    meetingTypes: [],
    captureMethod: [],
    qualityThreshold: 70,
    executiveOnly: false,
    industryContext: [],
    participantCount: { min: 1, max: 20 }
  })

  const [viewMode, setViewMode] = useState<'list' | 'analytics' | 'capture'>('list')

  // Load meetings data
  useEffect(() => {
    loadMeetings()
  }, [filters])

  const loadMeetings = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const results = mockMeetingArchive.searchMeetings(filters)
      setMeetings(results.meetings)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }

  // Filter handlers
  const handleCompetencyFilter = (competencies: CompetencyCategory[]) => {
    setFilters(prev => ({ ...prev, competencyFocus: competencies }))
  }

  const handleMeetingTypeFilter = (types: MeetingType[]) => {
    setFilters(prev => ({ ...prev, meetingTypes: types }))
  }

  const handleCaptureMethodFilter = (methods: CaptureMethod[]) => {
    setFilters(prev => ({ ...prev, captureMethod: methods }))
  }

  const handleQualityFilter = (threshold: number) => {
    setFilters(prev => ({ ...prev, qualityThreshold: threshold }))
  }

  const handleExecutiveFilter = (executiveOnly: boolean) => {
    setFilters(prev => ({ ...prev, executiveOnly }))
  }

  // Meeting selection
  const handleMeetingSelect = (meeting: CapturedMeeting) => {
    setSelectedMeeting(meeting)
    setShowDetailModal(true)
    onMeetingSelect?.(meeting)
  }

  // Derived state
  const totalMeetings = searchResults?.totalCount || 0
  const filteredMeetings = searchResults?.filteredCount || 0
  const qualityDistribution = searchResults?.aggregations.qualityDistribution
  const competencyTrends = searchResults?.aggregations.competencyTrends || []

  const filterSummary = useMemo(() => {
    const activeFilters = []
    if (filters.competencyFocus.length > 0) {
      activeFilters.push(`${filters.competencyFocus.length} competenc${filters.competencyFocus.length === 1 ? 'y' : 'ies'}`)
    }
    if (filters.meetingTypes.length > 0) {
      activeFilters.push(`${filters.meetingTypes.length} meeting type${filters.meetingTypes.length === 1 ? '' : 's'}`)
    }
    if (filters.executiveOnly) {
      activeFilters.push('executive only')
    }
    if (filters.qualityThreshold > 70) {
      activeFilters.push(`quality >${filters.qualityThreshold}%`)
    }
    return activeFilters.join(', ')
  }, [filters])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Archive</h1>
          <p className="text-gray-600 mt-1">
            Analyze communication patterns and track competency development
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setViewMode('capture')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'capture'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Capture
            </button>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setViewMode('capture')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <span className="mr-2">📹</span>
            New Meeting
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Meetings</div>
          <div className="text-2xl font-bold text-gray-900">{totalMeetings}</div>
          <div className="text-sm text-gray-500">All captured sessions</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-gray-600">Filtered Results</div>
          <div className="text-2xl font-bold text-blue-600">{filteredMeetings}</div>
          <div className="text-sm text-gray-500">Matching criteria</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-gray-600">Avg Quality Score</div>
          <div className="text-2xl font-bold text-green-600">
            {meetings.length > 0 
              ? Math.round(meetings.reduce((sum, m) => sum + m.audioQualityScore, 0) / meetings.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-500">Audio & transcript</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-gray-600">Executive Sessions</div>
          <div className="text-2xl font-bold text-purple-600">
            {meetings.filter(m => m.executivePriority).length}
          </div>
          <div className="text-sm text-gray-500">High-priority analysis</div>
        </Card>
      </div>

      {/* Active Filters Summary */}
      {filterSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Active filters:</span> {filterSummary}
            </div>
            <button
              onClick={() => setFilters({
                dateRange: { start: '2024-10-01', end: new Date().toISOString().split('T')[0] },
                competencyFocus: [],
                meetingTypes: [],
                captureMethod: [],
                qualityThreshold: 70,
                executiveOnly: false,
                industryContext: [],
                participantCount: { min: 1, max: 20 }
              })}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <CompetencyFilters
            selectedCompetencies={filters.competencyFocus}
            onCompetencyChange={handleCompetencyFilter}
            trends={competencyTrends}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {viewMode === 'list' && (
            <MeetingList
              meetings={meetings}
              loading={loading}
              error={error}
              onMeetingSelect={handleMeetingSelect}
              onMeetingTypeFilter={handleMeetingTypeFilter}
              onCaptureMethodFilter={handleCaptureMethodFilter}
              onQualityFilter={handleQualityFilter}
              onExecutiveFilter={handleExecutiveFilter}
              filters={filters}
            />
          )}

          {viewMode === 'analytics' && (
            <div className="space-y-6">
              <SmartFeedback
                meetings={meetings}
                trends={competencyTrends}
                isExecutive={isExecutive}
              />
            </div>
          )}

          {viewMode === 'capture' && (
            <div className="space-y-6">
              <CaptureIntegration
                userId={userId}
                onMeetingCaptured={loadMeetings}
              />
              {isExecutive && (
                <ExecutiveFeatures
                  userId={userId}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meeting Detail Modal */}
      {showDetailModal && selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedMeeting(null)
          }}
        />
      )}
    </div>
  )
}