/**
 * Mobile Timeline View for ShipSpeak
 * Mobile-optimized career progression timeline with PM milestone tracking
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback } from 'react'
import { TouchGestureManager } from '../TouchOptimizedComponents/TouchGestureManager'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'MILESTONE' | 'SKILL_GAIN' | 'ROLE_CHANGE' | 'ACHIEVEMENT' | 'PRACTICE_SESSION'
  status: 'COMPLETED' | 'UPCOMING' | 'IN_PROGRESS'
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  careerStage: string
  relatedSkills: string[]
  metrics?: {
    before: number
    after?: number
    improvement?: number
  }
}

interface MobileTimelineViewProps {
  events: TimelineEvent[]
  onEventClick?: (event: TimelineEvent) => void
  careerContext?: {
    currentRole: string
    targetRole: string
    industry: string
  }
  showMetrics?: boolean
  timeRange?: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' | 'ALL'
}

// =============================================================================
// MOBILE TIMELINE VIEW COMPONENT
// =============================================================================

export const MobileTimelineView: React.FC<MobileTimelineViewProps> = ({
  events,
  onEventClick,
  careerContext = { currentRole: 'PM', targetRole: 'Senior PM', industry: 'Fintech' },
  showMetrics = true,
  timeRange = 'MONTH'
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [activeRange, setActiveRange] = useState(timeRange)

  // =============================================================================
  // EVENT FILTERING AND SORTING
  // =============================================================================

  const getFilteredEvents = useCallback(() => {
    const now = new Date()
    let filteredEvents = events

    switch (activeRange) {
      case 'WEEK':
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.date)
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return eventDate >= weekAgo
        })
        break
      case 'MONTH':
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.date)
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return eventDate >= monthAgo
        })
        break
      case 'QUARTER':
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.date)
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          return eventDate >= quarterAgo
        })
        break
      case 'YEAR':
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.date)
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          return eventDate >= yearAgo
        })
        break
      default:
        filteredEvents = events
    }

    return filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [events, activeRange])

  const handleEventClick = useCallback((event: TimelineEvent) => {
    setSelectedEvent(selectedEvent === event.id ? null : event.id)
    onEventClick?.(event)
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25)
    }
  }, [selectedEvent, onEventClick])

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'MILESTONE': return '🏆'
      case 'SKILL_GAIN': return '📈'
      case 'ROLE_CHANGE': return '🎯'
      case 'ACHIEVEMENT': return '⭐'
      case 'PRACTICE_SESSION': return '🎪'
      default: return '📋'
    }
  }

  const getEventColor = (status: TimelineEvent['status'], impact: TimelineEvent['impact']) => {
    if (status === 'COMPLETED') {
      return impact === 'HIGH' ? '#10b981' : impact === 'MEDIUM' ? '#3b82f6' : '#64748b'
    } else if (status === 'IN_PROGRESS') {
      return '#f59e0b'
    } else {
      return '#e5e7eb'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const renderTimelineEvent = (event: TimelineEvent, index: number) => {
    const isSelected = selectedEvent === event.id
    const isLast = index === getFilteredEvents().length - 1
    const eventColor = getEventColor(event.status, event.impact)

    return (
      <div key={event.id} className="timeline-event-container">
        {/* Timeline Line */}
        <div className="timeline-line">
          <div 
            className="timeline-dot"
            style={{ backgroundColor: eventColor }}
          >
            <span className="event-icon">{getEventIcon(event.type)}</span>
          </div>
          {!isLast && <div className="timeline-connector" />}
        </div>

        {/* Event Content */}
        <TouchGestureManager
          onTap={() => handleEventClick(event)}
        >
          <div 
            className={`timeline-event ${event.status.toLowerCase()} ${isSelected ? 'selected' : ''}`}
            style={{ borderLeftColor: eventColor }}
          >
            {/* Event Header */}
            <div className="event-header">
              <div className="event-main">
                <h4 className="event-title">{event.title}</h4>
                <span className="event-date">{formatDate(event.date)}</span>
              </div>
              <div className="event-meta">
                <span className={`event-type ${event.type.toLowerCase()}`}>
                  {event.type.replace('_', ' ')}
                </span>
                <span className={`impact-indicator ${event.impact.toLowerCase()}`}>
                  {event.impact}
                </span>
              </div>
            </div>

            {/* Event Description */}
            <p className="event-description">{event.description}</p>

            {/* Metrics */}
            {showMetrics && event.metrics && (
              <div className="event-metrics">
                <div className="metric">
                  <span className="metric-label">Before:</span>
                  <span className="metric-value">{event.metrics.before}</span>
                </div>
                {event.metrics.after !== undefined && (
                  <div className="metric">
                    <span className="metric-label">After:</span>
                    <span className="metric-value">{event.metrics.after}</span>
                  </div>
                )}
                {event.metrics.improvement !== undefined && (
                  <div className="metric improvement">
                    <span className="metric-label">Improvement:</span>
                    <span className="metric-value">+{event.metrics.improvement}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Expanded Content */}
            {isSelected && (
              <div className="event-expanded">
                <div className="career-stage">
                  <span className="stage-label">Career Stage:</span>
                  <span className="stage-value">{event.careerStage}</span>
                </div>
                
                {event.relatedSkills.length > 0 && (
                  <div className="related-skills">
                    <span className="skills-label">Related Skills:</span>
                    <div className="skills-tags">
                      {event.relatedSkills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TouchGestureManager>
      </div>
    )
  }

  const renderTimeRangeTabs = () => {
    const ranges = ['WEEK', 'MONTH', 'QUARTER', 'YEAR', 'ALL']
    
    return (
      <div className="time-range-tabs">
        {ranges.map(range => (
          <button
            key={range}
            className={`range-tab ${activeRange === range ? 'active' : ''}`}
            onClick={() => setActiveRange(range as any)}
          >
            {range === 'ALL' ? 'All Time' : range.toLowerCase()}
          </button>
        ))}
      </div>
    )
  }

  const renderProgressSummary = () => {
    const filteredEvents = getFilteredEvents()
    const completedEvents = filteredEvents.filter(e => e.status === 'COMPLETED').length
    const totalEvents = filteredEvents.length

    return (
      <div className="progress-summary">
        <div className="summary-stat">
          <span className="stat-value">{completedEvents}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">{totalEvents}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">
            {Math.round((completedEvents / totalEvents) * 100)}%
          </span>
          <span className="stat-label">Progress</span>
        </div>
      </div>
    )
  }

  const filteredEvents = getFilteredEvents()

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="mobile-timeline-view" data-testid="mobile-timeline-view">
      {/* Header */}
      <div className="timeline-header">
        <h3>Career Timeline</h3>
        <span className="career-context">
          {careerContext.currentRole} → {careerContext.targetRole}
        </span>
      </div>

      {/* Progress Summary */}
      {renderProgressSummary()}

      {/* Time Range Selector */}
      {renderTimeRangeTabs()}

      {/* Timeline Content */}
      <div className="timeline-content">
        {filteredEvents.length > 0 ? (
          <div className="timeline-events">
            {filteredEvents.map(renderTimelineEvent)}
          </div>
        ) : (
          <div className="empty-timeline">
            <span className="empty-icon">📅</span>
            <h4>No events in this time range</h4>
            <p>Try selecting a different time period or start practicing to build your timeline.</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="timeline-instructions">
        Tap events for details • Scroll to see more
      </div>

      <style jsx>{`
        .mobile-timeline-view {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f8fafc;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .timeline-header h3 {
          margin: 0;
          font-weight: 600;
          color: #1e293b;
        }

        .career-context {
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .progress-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding: 1rem;
          background: white;
        }

        .summary-stat {
          text-align: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .time-range-tabs {
          display: flex;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
        }

        .range-tab {
          flex: 1;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          color: #64748b;
          text-transform: capitalize;
          white-space: nowrap;
          min-width: 80px;
        }

        .range-tab.active {
          background: #f1f5f9;
          border-bottom: 2px solid #3b82f6;
          color: #3b82f6;
        }

        .timeline-content {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        .timeline-events {
          position: relative;
        }

        .timeline-event-container {
          display: flex;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .timeline-line {
          position: relative;
          width: 60px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 0.5rem;
        }

        .timeline-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .event-icon {
          font-size: 1rem;
        }

        .timeline-connector {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: calc(100% + 24px);
          background: #e5e7eb;
          z-index: 1;
        }

        .timeline-event {
          flex: 1;
          background: white;
          border-radius: 12px;
          border-left: 4px solid;
          padding: 1rem;
          margin-left: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .timeline-event:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        .timeline-event.selected {
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          transform: translateY(-4px);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .event-main {
          flex: 1;
        }

        .event-title {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
        }

        .event-date {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .event-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .event-type {
          font-size: 0.625rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
        }

        .impact-indicator {
          font-size: 0.625rem;
          padding: 0.125rem 0.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .impact-indicator.high {
          background: #fef2f2;
          color: #dc2626;
        }

        .impact-indicator.medium {
          background: #fefbeb;
          color: #d97706;
        }

        .impact-indicator.low {
          background: #f0fdf4;
          color: #16a34a;
        }

        .event-description {
          margin: 0 0 1rem 0;
          color: #374151;
          line-height: 1.5;
          font-size: 0.875rem;
        }

        .event-metrics {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.125rem;
        }

        .metric-value {
          font-weight: 600;
          color: #374151;
        }

        .metric.improvement .metric-value {
          color: #10b981;
        }

        .event-expanded {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
          animation: expandEvent 0.2s ease;
        }

        @keyframes expandEvent {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }

        .career-stage {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 6px;
        }

        .stage-label {
          font-weight: 500;
          color: #64748b;
        }

        .stage-value {
          font-weight: 600;
          color: #3b82f6;
        }

        .related-skills {
          margin-top: 0.75rem;
        }

        .skills-label {
          display: block;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .empty-timeline {
          text-align: center;
          padding: 3rem 1rem;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-timeline h4 {
          margin: 0 0 0.5rem 0;
          color: #6b7280;
        }

        .empty-timeline p {
          margin: 0;
          line-height: 1.5;
        }

        .timeline-instructions {
          text-align: center;
          padding: 1rem;
          color: #9ca3af;
          font-size: 0.75rem;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .timeline-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .progress-summary {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            padding: 0.75rem;
          }
          
          .timeline-line {
            width: 50px;
          }
          
          .timeline-dot {
            width: 32px;
            height: 32px;
          }
          
          .event-icon {
            font-size: 0.875rem;
          }
          
          .event-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .event-meta {
            flex-direction: row;
            align-items: center;
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  )
}