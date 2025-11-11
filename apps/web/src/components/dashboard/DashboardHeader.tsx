/**
 * Dashboard Header Component for ShipSpeak
 * Career-aware welcome message with PM progression context
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { User } from '@/types/auth'
import { PMProgressData } from '@/types/dashboard'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface DashboardHeaderProps {
  user: User | null
  progressData: PMProgressData | null
  onRefresh?: () => void
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  progressData,
  onRefresh
}) => {
  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const getWelcomeMessage = (): string => {
    if (!user) return "Welcome to ShipSpeak"
    
    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    
    const name = user.name.split(' ')[0] // First name only
    
    return `${timeGreeting}, ${name}`
  }

  const getCareerProgressMessage = (): string => {
    if (!user || !progressData) return "Start building your PM communication skills"
    
    const { currentLevel, targetLevel, progressPercentage } = progressData
    
    if (currentLevel === targetLevel) {
      return `Mastering ${currentLevel} communication excellence`
    }
    
    return `${Math.round(progressPercentage)}% towards ${targetLevel} readiness`
  }

  const getMotivationalInsight = (): string => {
    if (!user || !progressData) return "Every meeting is a chance to practice executive presence"
    
    const { industry } = user
    const { weekStreak } = progressData
    
    if (weekStreak && weekStreak > 0) {
      return `${weekStreak} week streak! Your ${industry} PM communication is strengthening`
    }
    
    return `Ready to elevate your ${industry} leadership presence today`
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderProgressBadge = () => {
    if (!progressData) return null

    const { currentLevel, targetLevel, progressPercentage } = progressData
    
    if (currentLevel === targetLevel) {
      return (
        <span className="progress-badge mastery">
          <span className="badge-icon">👑</span>
          <span className="badge-text">Mastery Level</span>
        </span>
      )
    }

    return (
      <span className="progress-badge">
        <span className="badge-icon">🎯</span>
        <span className="badge-text">{Math.round(progressPercentage)}% Complete</span>
      </span>
    )
  }

  const renderRefreshButton = () => {
    if (!onRefresh) return null

    return (
      <button
        data-testid="refresh-dashboard"
        className="refresh-btn"
        onClick={onRefresh}
        aria-label="Refresh dashboard data"
      >
        <span className="refresh-icon">⟳</span>
      </button>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <header 
      data-testid="dashboard-header"
      className="dashboard-header"
    >
      <div className="header-content">
        <div className="welcome-section">
          <h1 className="welcome-message">
            {getWelcomeMessage()}
          </h1>
          <p className="career-progress">
            {getCareerProgressMessage()}
          </p>
          <p className="motivational-insight">
            {getMotivationalInsight()}
          </p>
        </div>
        
        <div className="header-actions">
          {renderProgressBadge()}
          {renderRefreshButton()}
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          padding: 2rem;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .dashboard-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(50%, -50%);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }
        
        .welcome-section {
          flex: 1;
        }
        
        .welcome-message {
          font-size: 2rem;
          font-weight: bold;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }
        
        .career-progress {
          font-size: 1.125rem;
          margin: 0 0 0.5rem 0;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .motivational-insight {
          font-size: 0.875rem;
          margin: 0;
          opacity: 0.8;
          font-style: italic;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }
        
        .progress-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .progress-badge.mastery {
          background: rgba(255, 215, 0, 0.3);
          border-color: rgba(255, 215, 0, 0.5);
        }
        
        .badge-icon {
          font-size: 1rem;
        }
        
        .refresh-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        
        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        
        .refresh-btn:active {
          transform: scale(0.95);
        }
        
        .refresh-icon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }
        
        .refresh-btn:hover .refresh-icon {
          transform: rotate(90deg);
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1.5rem;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .welcome-message {
            font-size: 1.5rem;
          }
          
          .career-progress {
            font-size: 1rem;
          }
          
          .header-actions {
            align-self: stretch;
            justify-content: space-between;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-header {
            padding: 1rem;
          }
          
          .welcome-message {
            font-size: 1.25rem;
          }
          
          .progress-badge .badge-text {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}