/**
 * Mobile Milestones Component
 * ShipSpeak - PM career milestone tracking with mobile-optimized interface
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback } from 'react'
import { ProgressMilestone, CareerProgressData } from '../types/MobileProgressTypes'

interface MobileMilestonesProps {
  progressData: CareerProgressData
  onMilestoneClick?: (milestone: ProgressMilestone) => void
}

export const MobileMilestones: React.FC<MobileMilestonesProps> = ({
  progressData,
  onMilestoneClick
}) => {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'achieved' | 'pending'>('all')

  const handleMilestoneClick = useCallback((milestone: ProgressMilestone) => {
    setExpandedMilestone(expandedMilestone === milestone.id ? null : milestone.id)
    onMilestoneClick?.(milestone)
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(35)
    }
  }, [expandedMilestone, onMilestoneClick])

  const handleKeyDown = useCallback((event: React.KeyboardEvent, milestone: ProgressMilestone) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleMilestoneClick(milestone)
    }
  }, [handleMilestoneClick])

  const getMilestoneIcon = (milestone: ProgressMilestone) => {
    if (milestone.isAchieved) return { icon: '✅', label: 'Achieved milestone' }
    
    switch (milestone.type) {
      case 'CAREER': return { icon: '🎯', label: 'Career milestone' }
      case 'SKILL': return { icon: '📚', label: 'Skill milestone' }
      case 'INDUSTRY': return { icon: '🏢', label: 'Industry milestone' }
      case 'LEADERSHIP': return { icon: '👑', label: 'Leadership milestone' }
      default: return { icon: '🎯', label: 'Milestone' }
    }
  }

  const filteredMilestones = progressData.milestones.filter(milestone => {
    switch (filter) {
      case 'achieved': return milestone.isAchieved
      case 'pending': return !milestone.isAchieved
      default: return true
    }
  })

  const achievedCount = progressData.milestones.filter(m => m.isAchieved).length
  const totalCount = progressData.milestones.length
  const completionRate = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0

  return (
    <div className="milestones-section" role="main" aria-label="PM Career Milestones">
      <div className="milestones-header">
        <h3>Career Milestones</h3>
        <div className="milestone-stats">
          <div className="completion-badge" aria-label={`${achievedCount} of ${totalCount} milestones achieved`}>
            {achievedCount}/{totalCount}
          </div>
          <div className="completion-rate" aria-label={`${Math.round(completionRate)}% completion rate`}>
            {Math.round(completionRate)}%
          </div>
        </div>
      </div>

      <div className="milestone-filters" role="radiogroup" aria-label="Filter milestones">
        {[
          { key: 'all', label: 'All', count: totalCount },
          { key: 'achieved', label: 'Achieved', count: achievedCount },
          { key: 'pending', label: 'Pending', count: totalCount - achievedCount }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            className={`filter-btn ${filter === filterOption.key ? 'active' : ''}`}
            onClick={() => setFilter(filterOption.key as any)}
            role="radio"
            aria-checked={filter === filterOption.key}
            aria-label={`Show ${filterOption.label.toLowerCase()} milestones: ${filterOption.count} items`}
          >
            {filterOption.label} ({filterOption.count})
          </button>
        ))}
      </div>

      <div className="milestones-list" role="list">
        {filteredMilestones.map(milestone => {
          const iconInfo = getMilestoneIcon(milestone)
          const isExpanded = expandedMilestone === milestone.id
          
          return (
            <div 
              key={milestone.id}
              className={`milestone-card ${milestone.isAchieved ? 'achieved' : 'pending'}`}
              onClick={() => handleMilestoneClick(milestone)}
              onKeyDown={(e) => handleKeyDown(e, milestone)}
              role="listitem button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${milestone.title}, ${iconInfo.label}, ${milestone.impact.toLowerCase()} impact, ${milestone.isAchieved ? 'achieved on ' + milestone.achievedDate : 'pending'}`}
            >
              <div className="milestone-header">
                <div className="milestone-icon" aria-hidden="true" title={iconInfo.label}>
                  {iconInfo.icon}
                </div>
                <div className="milestone-info">
                  <h4>{milestone.title}</h4>
                  <span className={`impact-badge ${milestone.impact.toLowerCase()}`}>
                    {milestone.impact} Impact
                  </span>
                </div>
                <div className="milestone-date">
                  <span className="date-label">
                    {milestone.isAchieved ? 'Achieved' : 'Target'}
                  </span>
                  <span className="date-value">
                    {milestone.achievedDate || 'Pending'}
                  </span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="milestone-details" role="region" aria-label="Milestone details">
                  <p>{milestone.description}</p>
                  
                  <div className="milestone-meta">
                    <div className="milestone-type">
                      <strong>Type:</strong> {milestone.type.replace('_', ' ').toLowerCase()}
                    </div>
                    {milestone.isAchieved && milestone.achievedDate && (
                      <div className="achievement-celebration">
                        🎉 Achieved on {milestone.achievedDate}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredMilestones.length === 0 && (
        <div className="no-milestones" role="status" aria-label="No milestones found for current filter">
          <div className="no-milestones-icon">🎯</div>
          <h4>No {filter === 'all' ? '' : filter} milestones</h4>
          <p>
            {filter === 'achieved' && 'Complete some practice sessions to unlock your first milestone!'}
            {filter === 'pending' && 'Great work! All your milestones have been achieved.'}
            {filter === 'all' && 'Your milestones will appear here as you progress in your PM journey.'}
          </p>
        </div>
      )}

      <style jsx>{`
        .milestones-section {
          padding: 1rem;
          background: #f8fafc;
        }

        .milestones-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .milestones-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .milestone-stats {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .completion-badge {
          background: #3b82f6;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .completion-rate {
          background: #e2e8f0;
          color: #475569;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .milestone-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: white;
          padding: 0.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 44px; /* Touch target minimum */
          font-size: 0.875rem;
        }

        .filter-btn:hover,
        .filter-btn:focus {
          background: #f1f5f9;
          color: #334155;
        }

        .filter-btn:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .filter-btn.active {
          background: #3b82f6;
          color: white;
        }

        .milestones-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .milestone-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          min-height: 44px; /* Touch target minimum */
        }

        .milestone-card:hover,
        .milestone-card:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .milestone-card:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .milestone-card.achieved {
          border-left: 4px solid #10b981;
        }

        .milestone-card.pending {
          border-left: 4px solid #f59e0b;
        }

        .milestone-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .milestone-icon {
          font-size: 1.5rem;
          min-width: 2rem;
          text-align: center;
        }

        .milestone-info {
          flex: 1;
        }

        .milestone-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .impact-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .impact-badge.high {
          background: #fef2f2;
          color: #dc2626;
        }

        .impact-badge.medium {
          background: #fefbf0;
          color: #d97706;
        }

        .impact-badge.low {
          background: #f0fdf4;
          color: #16a34a;
        }

        .milestone-date {
          text-align: right;
          font-size: 0.875rem;
        }

        .date-label {
          display: block;
          color: #64748b;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 0.125rem;
        }

        .date-value {
          color: #334155;
          font-weight: 600;
        }

        .milestone-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .milestone-details p {
          margin: 0 0 1rem 0;
          color: #475569;
          line-height: 1.5;
        }

        .milestone-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .milestone-type {
          font-size: 0.875rem;
          color: #64748b;
        }

        .achievement-celebration {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
        }

        .no-milestones {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }

        .no-milestones-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-milestones h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .no-milestones p {
          margin: 0;
          line-height: 1.5;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .milestone-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .milestone-info {
            width: 100%;
          }

          .milestone-date {
            text-align: left;
            width: 100%;
          }

          .milestone-card {
            min-height: 48px; /* Larger touch target on mobile */
          }
        }
      `}</style>
    </div>
  )
}

export default MobileMilestones