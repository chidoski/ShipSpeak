/**
 * Mobile Progress Overview Component
 * ShipSpeak - Career progress overview and quick stats
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { CareerProgressData } from '../types/MobileProgressTypes'

interface MobileProgressOverviewProps {
  progressData: CareerProgressData
  compact?: boolean
}

export const MobileProgressOverview: React.FC<MobileProgressOverviewProps> = ({
  progressData,
  compact = false
}) => {
  const renderProgressBar = (current: number, target: number, className = '') => {
    const percentage = target > 0 ? (current / target) * 100 : 0
    const color = percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'
    
    return (
      <div className={`progress-bar-container ${className}`}>
        <div className="progress-bar">
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

  return (
    <div className="overview-section" role="main" aria-label="Career Progress Overview">
      {/* Career Progress Card */}
      <div className="career-card" role="region" aria-labelledby="career-progress-title">
        <div className="career-header">
          <h3 id="career-progress-title">Career Progression</h3>
          <span className="career-timeline" aria-label={`Time to promotion: ${progressData.timeToPromotion}`}>
            {progressData.timeToPromotion}
          </span>
        </div>
        <div className="career-path" aria-label={`Career path from ${progressData.currentRole} to ${progressData.targetRole}`}>
          <span className="current-role">{progressData.currentRole}</span>
          <span className="arrow" aria-hidden="true">→</span>
          <span className="target-role">{progressData.targetRole}</span>
        </div>
        {renderProgressBar(progressData.overallProgress, 100, 'career-progress')}
        <div className="progress-label">
          Overall Progress: {progressData.overallProgress}%
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats" role="region" aria-labelledby="quick-stats-title">
        <h4 id="quick-stats-title" className="visually-hidden">Quick Statistics</h4>
        <div className="stat-card strength" tabIndex={0} role="button" aria-label={`${progressData.strengthAreas.length} strength areas identified`}>
          <span className="stat-value" aria-hidden="true">{progressData.strengthAreas.length}</span>
          <span className="stat-label">Strengths</span>
        </div>
        <div className="stat-card growth" tabIndex={0} role="button" aria-label={`${progressData.growthAreas.length} growth areas identified`}>
          <span className="stat-value" aria-hidden="true">{progressData.growthAreas.length}</span>
          <span className="stat-label">Growth Areas</span>
        </div>
        <div className="stat-card milestones" tabIndex={0} role="button" aria-label={`${progressData.milestones.filter(m => m.isAchieved).length} milestones achieved out of ${progressData.milestones.length}`}>
          <span className="stat-value" aria-hidden="true">
            {progressData.milestones.filter(m => m.isAchieved).length}
          </span>
          <span className="stat-label">Milestones</span>
        </div>
      </div>

      {/* Weekly Goals Preview */}
      <div className="weekly-goals-preview" role="region" aria-labelledby="weekly-goals-title">
        <h4 id="weekly-goals-title">This Week's Goals</h4>
        {progressData.weeklyGoals.slice(0, 3).map(goal => (
          <div key={goal.id} className="goal-preview" role="listitem" aria-label={`Goal: ${goal.title}, ${goal.progress}% complete`}>
            <span className="goal-title">{goal.title}</span>
            {renderProgressBar(goal.progress, 100)}
          </div>
        ))}
        {progressData.weeklyGoals.length > 3 && (
          <div className="goals-more" aria-label={`${progressData.weeklyGoals.length - 3} more goals available`}>
            +{progressData.weeklyGoals.length - 3} more goals
          </div>
        )}
      </div>

      <style jsx>{`
        .overview-section {
          padding: 1rem;
          background: #f8fafc;
        }

        .career-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .career-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .career-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .career-timeline {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .career-path {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .current-role, .target-role {
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.15);
        }

        .arrow {
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .progress-label {
          text-align: center;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-bar {
          flex: 1;
          background: rgba(255, 255, 255, 0.2);
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

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-height: 44px; /* Touch target minimum */
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .stat-card:hover,
        .stat-card:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .stat-card:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
          opacity: 0.7;
          letter-spacing: 0.5px;
        }

        .stat-card.strength .stat-value { color: #10b981; }
        .stat-card.growth .stat-value { color: #f59e0b; }
        .stat-card.milestones .stat-value { color: #8b5cf6; }

        .weekly-goals-preview {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .weekly-goals-preview h4 {
          margin: 0 0 1rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .goal-preview {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .goal-preview:last-child {
          margin-bottom: 0;
        }

        .goal-title {
          display: block;
          font-weight: 500;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .goals-more {
          text-align: center;
          padding: 0.75rem;
          color: #64748b;
          font-size: 0.875rem;
          background: #f1f5f9;
          border-radius: 8px;
          margin-top: 0.5rem;
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .quick-stats {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .career-path {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .stat-card {
            min-height: 48px; /* Larger touch target on mobile */
          }
        }
      `}</style>
    </div>
  )
}

export default MobileProgressOverview