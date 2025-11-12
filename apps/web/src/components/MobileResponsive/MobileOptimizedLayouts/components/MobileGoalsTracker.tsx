/**
 * Mobile Goals Tracker Component
 * ShipSpeak - Weekly PM goal tracking with mobile-optimized interface
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback } from 'react'
import { WeeklyGoal, CareerProgressData } from '../types/MobileProgressTypes'

interface MobileGoalsTrackerProps {
  progressData: CareerProgressData
  onGoalClick?: (goal: WeeklyGoal) => void
  onUpdateGoalProgress?: (goalId: string, progress: number) => void
}

export const MobileGoalsTracker: React.FC<MobileGoalsTrackerProps> = ({
  progressData,
  onGoalClick,
  onUpdateGoalProgress
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'practice' | 'skill' | 'feedback' | 'networking'>('all')

  const handleGoalClick = useCallback((goal: WeeklyGoal) => {
    setSelectedGoal(selectedGoal === goal.id ? null : goal.id)
    onGoalClick?.(goal)
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }, [selectedGoal, onGoalClick])

  const handleKeyDown = useCallback((event: React.KeyboardEvent, goal: WeeklyGoal) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleGoalClick(goal)
    }
  }, [handleGoalClick])

  const renderProgressBar = (current: number, target: number) => {
    const percentage = target > 0 ? (current / target) * 100 : 0
    const color = percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'
    
    return (
      <div className="progress-bar-container">
        <div className="progress-bar" role="progressbar" aria-valuenow={current} aria-valuemax={target} aria-valuetext={`${Math.round(percentage)}% complete`}>
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
          />
        </div>
        <span className="progress-text" style={{ color }}>
          {Math.round(percentage)}%
        </span>
      </div>
    )
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'PRACTICE': return { icon: '🎯', label: 'Practice session', color: '#0284c7' }
      case 'SKILL': return { icon: '📚', label: 'Skill development', color: '#16a34a' }
      case 'FEEDBACK': return { icon: '💬', label: 'Feedback collection', color: '#d97706' }
      case 'NETWORKING': return { icon: '🤝', label: 'Networking activity', color: '#9333ea' }
      default: return { icon: '✅', label: 'Goal', color: '#64748b' }
    }
  }

  const filteredGoals = progressData.weeklyGoals.filter(goal => 
    filter === 'all' || goal.category.toLowerCase() === filter
  )

  const completedGoals = progressData.weeklyGoals.filter(goal => goal.progress >= 100).length
  const totalGoals = progressData.weeklyGoals.length
  const avgProgress = totalGoals > 0 
    ? Math.round(progressData.weeklyGoals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals)
    : 0

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: 'Overdue', status: 'overdue' }
    if (diffDays === 0) return { text: 'Today', status: 'today' }
    if (diffDays === 1) return { text: 'Tomorrow', status: 'soon' }
    if (diffDays <= 7) return { text: `${diffDays} days`, status: 'normal' }
    return { text: dateStr, status: 'normal' }
  }

  return (
    <div className="goals-section" role="main" aria-label="Weekly PM Goals">
      <div className="goals-header">
        <h3>Weekly Goals</h3>
        <div className="goals-summary">
          <div className="completion-stats" aria-label={`${completedGoals} of ${totalGoals} goals completed, ${avgProgress}% average progress`}>
            <span className="completed-count">{completedGoals}/{totalGoals}</span>
            <span className="avg-progress">{avgProgress}% avg</span>
          </div>
        </div>
      </div>

      <div className="goal-filters" role="radiogroup" aria-label="Filter goals by category">
        {[
          { key: 'all', label: 'All' },
          { key: 'practice', label: 'Practice' },
          { key: 'skill', label: 'Skill' },
          { key: 'feedback', label: 'Feedback' },
          { key: 'networking', label: 'Network' }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            className={`filter-btn ${filter === filterOption.key ? 'active' : ''}`}
            onClick={() => setFilter(filterOption.key as any)}
            role="radio"
            aria-checked={filter === filterOption.key}
            aria-label={`Show ${filterOption.label.toLowerCase()} goals`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      <div className="goals-list" role="list">
        {filteredGoals.map(goal => {
          const categoryInfo = getCategoryInfo(goal.category)
          const dueDateInfo = formatDueDate(goal.dueDate)
          const isSelected = selectedGoal === goal.id
          
          return (
            <div 
              key={goal.id}
              className={`goal-card ${dueDateInfo.status}`}
              onClick={() => handleGoalClick(goal)}
              onKeyDown={(e) => handleKeyDown(e, goal)}
              role="listitem button"
              tabIndex={0}
              aria-expanded={isSelected}
              aria-label={`${goal.title}, ${categoryInfo.label}, ${goal.progress}% complete, due ${dueDateInfo.text}`}
            >
              <div className="goal-header">
                <span 
                  className={`category-tag ${goal.category.toLowerCase()}`}
                  aria-label={categoryInfo.label}
                  title={categoryInfo.label}
                >
                  <span className="category-icon" aria-hidden="true">{categoryInfo.icon}</span>
                  {goal.category}
                </span>
                <span className={`due-date ${dueDateInfo.status}`} aria-label={`Due ${dueDateInfo.text}`}>
                  {dueDateInfo.text}
                </span>
              </div>
              
              <h4>{goal.title}</h4>
              
              <div className="goal-progress">
                {renderProgressBar(goal.progress, 100)}
              </div>

              {isSelected && (
                <div className="goal-details" role="region" aria-label="Goal details and actions">
                  <div className="goal-meta">
                    <div className="category-detail">
                      <strong>Category:</strong> {categoryInfo.label}
                    </div>
                    <div className="progress-detail">
                      <strong>Progress:</strong> {goal.progress}% complete
                    </div>
                    <div className="due-detail">
                      <strong>Due:</strong> {goal.dueDate}
                    </div>
                  </div>
                  
                  <div className="goal-actions">
                    <button 
                      className="action-btn update-progress"
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateGoalProgress?.(goal.id, Math.min(goal.progress + 25, 100))
                      }}
                      aria-label={`Add 25% progress to ${goal.title}`}
                      style={{ minHeight: '44px' }}
                    >
                      +25% Progress
                    </button>
                    
                    {goal.progress < 100 && (
                      <button 
                        className="action-btn mark-complete"
                        onClick={(e) => {
                          e.stopPropagation()
                          onUpdateGoalProgress?.(goal.id, 100)
                        }}
                        aria-label={`Mark ${goal.title} as complete`}
                        style={{ minHeight: '44px' }}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="no-goals" role="status" aria-label="No goals found for current filter">
          <div className="no-goals-icon">✅</div>
          <h4>No {filter === 'all' ? '' : filter} goals</h4>
          <p>Set some weekly goals to track your PM development progress.</p>
        </div>
      )}

      <style jsx>{`
        .goals-section {
          padding: 1rem;
          background: #f8fafc;
        }

        .goals-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .goals-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .goals-summary {
          display: flex;
          align-items: center;
        }

        .completion-stats {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .completed-count {
          background: #10b981;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .avg-progress {
          background: #e2e8f0;
          color: #475569;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .goal-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .filter-btn {
          flex-shrink: 0;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          background: white;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 44px; /* Touch target minimum */
          font-size: 0.875rem;
        }

        .filter-btn:hover,
        .filter-btn:focus {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .filter-btn:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .filter-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .goals-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .goal-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          min-height: 44px; /* Touch target minimum */
        }

        .goal-card:hover,
        .goal-card:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .goal-card:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .goal-card.overdue {
          border-left: 4px solid #dc2626;
        }

        .goal-card.today {
          border-left: 4px solid #f59e0b;
        }

        .goal-card.soon {
          border-left: 4px solid #3b82f6;
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .category-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .category-tag.practice {
          background: #f0f9ff;
          color: #0284c7;
        }

        .category-tag.skill {
          background: #f0fdf4;
          color: #16a34a;
        }

        .category-tag.feedback {
          background: #fefbf0;
          color: #d97706;
        }

        .category-tag.networking {
          background: #faf5ff;
          color: #9333ea;
        }

        .category-icon {
          font-size: 0.875rem;
        }

        .due-date {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
        }

        .due-date.overdue {
          background: #fef2f2;
          color: #dc2626;
        }

        .due-date.today {
          background: #fefbf0;
          color: #d97706;
        }

        .due-date.soon {
          background: #f0f9ff;
          color: #0284c7;
        }

        .due-date.normal {
          background: #f1f5f9;
          color: #64748b;
        }

        .goal-card h4 {
          margin: 0 0 0.75rem 0;
          font-weight: 600;
          color: #1e293b;
          font-size: 1.125rem;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-bar {
          flex: 1;
          background: #e2e8f0;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.875rem;
          font-weight: 600;
          min-width: 40px;
        }

        .goal-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .goal-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .goal-meta > div {
          font-size: 0.875rem;
          color: #64748b;
        }

        .goal-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 44px; /* Touch target minimum */
        }

        .action-btn.update-progress {
          background: #3b82f6;
          color: white;
        }

        .action-btn.update-progress:hover {
          background: #2563eb;
        }

        .action-btn.mark-complete {
          background: #10b981;
          color: white;
        }

        .action-btn.mark-complete:hover {
          background: #059669;
        }

        .no-goals {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }

        .no-goals-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-goals h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .no-goals p {
          margin: 0;
          line-height: 1.5;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .goal-card {
            min-height: 48px; /* Larger touch target on mobile */
          }

          .goal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default MobileGoalsTracker