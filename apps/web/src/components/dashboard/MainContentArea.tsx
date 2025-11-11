/**
 * Main Content Area Component for ShipSpeak
 * Adaptive content area with sophisticated empty states and career guidance
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { User } from '@/types/auth'
import { LearningData } from '@/types/dashboard'
import { EmptyStateDisplay } from './EmptyStateDisplay'
import { ProgressTracker } from './ProgressTracker'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface MainContentAreaProps {
  user: User | null
  hasContent: boolean
  learningData: LearningData | null
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MainContentArea: React.FC<MainContentAreaProps> = ({
  user,
  hasContent,
  learningData
}) => {
  // =============================================================================
  // CONTENT DETERMINATION
  // =============================================================================

  const getEmptyStateType = (): 'no_meetings' | 'new_user' | 'practice_first' | 'meeting_analysis' => {
    if (!user) return 'new_user'
    
    // New user who just completed onboarding
    if (user.onboardingCompleted && (!learningData || learningData.modulesCompleted === 0)) {
      return 'new_user'
    }
    
    // User with practice-first learning path but no content
    if (user.learningPath === 'practice-first' && !hasContent) {
      return 'practice_first'
    }
    
    // User with meeting-analysis path but no meetings
    if (user.learningPath === 'meeting-analysis' && !hasContent) {
      return 'meeting_analysis'
    }
    
    // Default: no meetings yet
    return 'no_meetings'
  }

  const shouldShowProgress = (): boolean => {
    return !!(user && learningData && (
      learningData.modulesCompleted > 0 || 
      learningData.practiceSessionsCompleted > 0 ||
      learningData.weeklyStreak > 0
    ))
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderContentArea = () => {
    if (!hasContent) {
      return (
        <EmptyStateDisplay 
          type={getEmptyStateType()}
          user={user}
        />
      )
    }

    return (
      <div 
        data-testid="main-content-with-data"
        className="content-with-data"
      >
        {shouldShowProgress() && (
          <ProgressTracker 
            user={user}
            learningData={learningData}
          />
        )}
        
        <div className="upcoming-features">
          <h2>Recent Activity</h2>
          <p>Your meeting analysis and practice sessions will appear here.</p>
          
          <div className="feature-preview">
            <div className="preview-item">
              <span className="preview-icon">📊</span>
              <div className="preview-content">
                <h3>Meeting Analysis Dashboard</h3>
                <p>View detailed insights from your recorded meetings</p>
              </div>
            </div>
            
            <div className="preview-item">
              <span className="preview-icon">🎯</span>
              <div className="preview-content">
                <h3>Practice Module Library</h3>
                <p>Access personalized communication exercises</p>
              </div>
            </div>
            
            <div className="preview-item">
              <span className="preview-icon">📈</span>
              <div className="preview-content">
                <h3>Progress Analytics</h3>
                <p>Track your PM communication skill development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      data-testid="main-content-area"
      className="main-content-area"
    >
      {renderContentArea()}
      
      <style jsx>{`
        .main-content-area {
          min-height: 400px;
        }
        
        .content-with-data {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .upcoming-features {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
        }
        
        .upcoming-features h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #1F2937;
        }
        
        .upcoming-features > p {
          margin: 0 0 1.5rem 0;
          color: #6B7280;
          font-size: 1rem;
        }
        
        .feature-preview {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .preview-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #F9FAFB;
          border-radius: 0.5rem;
          border: 1px solid #E5E7EB;
          transition: all 0.2s ease;
        }
        
        .preview-item:hover {
          background: #F3F4F6;
          transform: translateX(4px);
        }
        
        .preview-icon {
          font-size: 1.5rem;
          background: white;
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }
        
        .preview-content {
          flex: 1;
        }
        
        .preview-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1F2937;
        }
        
        .preview-content p {
          margin: 0;
          font-size: 0.875rem;
          color: #6B7280;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .upcoming-features {
            padding: 1.5rem;
          }
          
          .upcoming-features h2 {
            font-size: 1.25rem;
          }
          
          .preview-item {
            gap: 0.75rem;
            padding: 0.75rem;
          }
          
          .preview-icon {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.25rem;
          }
        }
        
        @media (max-width: 480px) {
          .upcoming-features {
            padding: 1rem;
          }
          
          .preview-item {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .preview-icon {
            align-self: center;
          }
        }
      `}</style>
    </div>
  )
}