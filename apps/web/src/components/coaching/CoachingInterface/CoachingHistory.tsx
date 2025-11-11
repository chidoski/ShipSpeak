'use client'

import React, { useState, useMemo } from 'react'
import { 
  CoachingSession, 
  UserProfile,
  DevelopmentArea,
  PMTransitionType,
  Industry,
  CoachingSessionType
} from '@/types/coaching'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface CoachingHistoryProps {
  userProfile: UserProfile
  developmentFocus: DevelopmentArea[]
  careerContext: PMTransitionType
  industryContext: Industry
  sessionHistory: CoachingSession[]
  onSessionReview: (session: CoachingSession) => void
  onSessionStart: (sessionType: CoachingSessionType) => void
  onSessionEnd: () => void
  onProgressUpdate: (update: any) => void
}

type FilterType = 'ALL' | 'STRATEGIC_THINKING' | 'EXECUTIVE_PRESENCE' | 'INDUSTRY_FLUENCY' | 'FRAMEWORK_PRACTICE'
type SortType = 'RECENT' | 'OLDEST' | 'DURATION' | 'TYPE'

export function CoachingHistory({
  userProfile,
  developmentFocus,
  careerContext,
  industryContext,
  sessionHistory,
  onSessionReview,
  onSessionStart
}: CoachingHistoryProps) {
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [sort, setSort] = useState<SortType>('RECENT')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSession, setSelectedSession] = useState<CoachingSession | null>(null)

  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessionHistory

    // Apply filter
    if (filter !== 'ALL') {
      filtered = filtered.filter(session => session.sessionType === filter)
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.aiCoachPersona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.sessionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.aiCoachPersona.expertiseArea.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'RECENT':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'OLDEST':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'DURATION':
          return b.duration - a.duration
        case 'TYPE':
          return a.sessionType.localeCompare(b.sessionType)
        default:
          return 0
      }
    })

    return sorted
  }, [sessionHistory, filter, sort, searchTerm])

  const sessionStats = useMemo(() => ({
    totalSessions: sessionHistory.length,
    totalHours: Math.round(sessionHistory.reduce((acc, session) => acc + session.duration, 0) / 60 * 10) / 10,
    completedSessions: sessionHistory.filter(s => s.status === 'COMPLETED').length,
    averageDuration: sessionHistory.length > 0 
      ? Math.round(sessionHistory.reduce((acc, session) => acc + session.duration, 0) / sessionHistory.length)
      : 0,
    mostUsedType: getMostUsedSessionType(sessionHistory),
    favoriteCoach: getMostUsedCoach(sessionHistory)
  }), [sessionHistory])

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Sessions"
          value={sessionStats.totalSessions}
          subtitle="coaching sessions"
        />
        <StatCard
          title="Practice Hours"
          value={`${sessionStats.totalHours}h`}
          subtitle="total practice time"
        />
        <StatCard
          title="Completion Rate"
          value={`${sessionHistory.length > 0 ? Math.round((sessionStats.completedSessions / sessionHistory.length) * 100) : 0}%`}
          subtitle="sessions completed"
        />
        <StatCard
          title="Avg Session"
          value={`${sessionStats.averageDuration}min`}
          subtitle="average duration"
        />
      </div>

      {/* Insights and Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coaching Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Your Preferences</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Favorite Session Type:</span>
                <span className="font-medium capitalize">{sessionStats.mostUsedType?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Preferred Coach:</span>
                <span className="font-medium">{sessionStats.favoriteCoach?.split(' ')[0] || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span>Best Practice Time:</span>
                <span className="font-medium">{getBestPracticeTime(sessionHistory)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Recent Trends</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Sessions This Week:</span>
                <span className="font-medium">{getSessionsThisWeek(sessionHistory)}</span>
              </div>
              <div className="flex justify-between">
                <span>Focus Shift:</span>
                <span className="font-medium">{getRecentFocusShift(sessionHistory)}</span>
              </div>
              <div className="flex justify-between">
                <span>Progress Momentum:</span>
                <span className="font-medium text-green-600">Building</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap items-center space-x-4">
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Sessions</option>
              <option value="STRATEGIC_THINKING">Strategic Thinking</option>
              <option value="EXECUTIVE_PRESENCE">Executive Presence</option>
              <option value="INDUSTRY_FLUENCY">Industry Fluency</option>
              <option value="FRAMEWORK_PRACTICE">Framework Practice</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="RECENT">Most Recent</option>
              <option value="OLDEST">Oldest First</option>
              <option value="DURATION">Duration</option>
              <option value="TYPE">Session Type</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            onClick={() => onSessionStart('STRATEGIC_THINKING')}
            className="whitespace-nowrap"
          >
            New Session
          </Button>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-4">
        {filteredAndSortedSessions.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== 'ALL' 
                ? 'Try adjusting your search or filters'
                : 'Start your first coaching session to see your history here'
              }
            </p>
            <Button onClick={() => onSessionStart('STRATEGIC_THINKING')}>
              Start Coaching Session
            </Button>
          </Card>
        ) : (
          filteredAndSortedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onReview={() => onSessionReview(session)}
              onViewDetails={() => setSelectedSession(session)}
            />
          ))
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onReview={() => {
            onSessionReview(selectedSession)
            setSelectedSession(null)
          }}
        />
      )}
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  subtitle 
}: { 
  title: string
  value: string | number
  subtitle: string 
}) {
  return (
    <Card className="p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 my-2">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </Card>
  )
}

function SessionCard({ 
  session, 
  onReview, 
  onViewDetails 
}: { 
  session: CoachingSession
  onReview: () => void
  onViewDetails: () => void 
}) {
  const statusColors = {
    'COMPLETED': 'bg-green-100 text-green-800',
    'ACTIVE': 'bg-blue-100 text-blue-800',
    'PAUSED': 'bg-yellow-100 text-yellow-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {session.aiCoachPersona.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900">
                {session.sessionType.replace('_', ' ')} Session
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                {session.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              with {session.aiCoachPersona.name} • {session.aiCoachPersona.title}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{new Date(session.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{session.duration} minutes</span>
              <span>•</span>
              <span className="capitalize">{session.careerContext.replace('_', ' → ')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
          <Button size="sm" onClick={onReview}>
            Review Session
          </Button>
        </div>
      </div>
      
      {session.focusAreas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-2">Focus Areas:</p>
          <div className="flex flex-wrap gap-2">
            {session.focusAreas.slice(0, 3).map((area) => (
              <span key={area.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {area.name}
              </span>
            ))}
            {session.focusAreas.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                +{session.focusAreas.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

function SessionDetailModal({ 
  session, 
  onClose, 
  onReview 
}: { 
  session: CoachingSession
  onClose: () => void
  onReview: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Session Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Session Overview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Session Overview</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session Type:</span>
                  <span className="font-medium">{session.sessionType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coach:</span>
                  <span className="font-medium">{session.aiCoachPersona.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{session.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(session.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{session.status.toLowerCase()}</span>
                </div>
              </div>
            </div>

            {/* Progress Metrics */}
            {Object.keys(session.userProgress.skillProgression).length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Progress Made</h3>
                <div className="space-y-3">
                  {Object.entries(session.userProgress.skillProgression).map(([skill, progress]) => (
                    <div key={skill}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 capitalize">{skill.replace('_', ' ')}</span>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Focus Areas */}
            {session.focusAreas.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Focus Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {session.focusAreas.map((area) => (
                    <div key={area.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-1">{area.name}</h4>
                      <div className="text-sm text-gray-600 mb-2">
                        Level: {area.currentLevel}/{area.targetLevel}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(area.currentLevel / area.targetLevel) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onReview}>
              Review Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getMostUsedSessionType(sessions: CoachingSession[]): string | null {
  const typeCounts = sessions.reduce((acc, session) => {
    acc[session.sessionType] = (acc[session.sessionType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostUsed = Object.entries(typeCounts).sort(([,a], [,b]) => b - a)[0]
  return mostUsed ? mostUsed[0] : null
}

function getMostUsedCoach(sessions: CoachingSession[]): string | null {
  const coachCounts = sessions.reduce((acc, session) => {
    acc[session.aiCoachPersona.name] = (acc[session.aiCoachPersona.name] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostUsed = Object.entries(coachCounts).sort(([,a], [,b]) => b - a)[0]
  return mostUsed ? mostUsed[0] : null
}

function getBestPracticeTime(sessions: CoachingSession[]): string {
  const hourCounts = sessions.reduce((acc, session) => {
    const hour = new Date(session.createdAt).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  const bestHour = Object.entries(hourCounts).sort(([,a], [,b]) => b - a)[0]
  if (!bestHour) return 'No preference'
  
  const hour = parseInt(bestHour[0])
  return hour < 12 ? `${hour}:00 AM` : `${hour - 12 || 12}:00 PM`
}

function getSessionsThisWeek(sessions: CoachingSession[]): number {
  const now = new Date()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  
  return sessions.filter(session => 
    new Date(session.createdAt) >= weekStart
  ).length
}

function getRecentFocusShift(sessions: CoachingSession[]): string {
  const recent = sessions.slice(0, 3)
  const older = sessions.slice(3, 6)
  
  const recentTypes = recent.map(s => s.sessionType)
  const olderTypes = older.map(s => s.sessionType)
  
  const recentFocus = getMostUsedType(recentTypes)
  const olderFocus = getMostUsedType(olderTypes)
  
  if (recentFocus && olderFocus && recentFocus !== olderFocus) {
    return `${olderFocus} → ${recentFocus}`.replace(/_/g, ' ')
  }
  
  return 'Consistent focus'
}

function getMostUsedType(types: string[]): string | null {
  const counts = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostUsed = Object.entries(counts).sort(([,a], [,b]) => b - a)[0]
  return mostUsed ? mostUsed[0] : null
}