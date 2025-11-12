/**
 * Mobile Progress Tracking - Main Orchestrator
 * ShipSpeak - PM career progression and skill tracking with mobile-optimized interface
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback } from 'react'
import { TouchGestureManager } from '../TouchOptimizedComponents/TouchGestureManager'
import { MobileProgressBaseProps, ProgressView } from './types/MobileProgressTypes'
import MobileProgressOverview from './components/MobileProgressOverview'
import MobileSkillProgress from './components/MobileSkillProgress'
import MobileMilestones from './components/MobileMilestones'
import MobileGoalsTracker from './components/MobileGoalsTracker'
import { mobileProgressStyles } from './styles/MobileProgressStyles'

export const MobileProgressTracking: React.FC<MobileProgressBaseProps> = ({
  progressData,
  onMilestoneClick,
  onSkillClick,
  onStartPractice,
  compact = false
}) => {
  const [activeView, setActiveView] = useState<ProgressView>('overview')

  // Handle swipe navigation between views
  const handleSwipeNavigation = useCallback((event: any) => {
    const views: ProgressView[] = ['overview', 'skills', 'milestones', 'goals']
    const currentIndex = views.indexOf(activeView)
    
    if (event.direction === 'LEFT' && currentIndex < views.length - 1) {
      setActiveView(views[currentIndex + 1])
    } else if (event.direction === 'RIGHT' && currentIndex > 0) {
      setActiveView(views[currentIndex - 1])
    }
  }, [activeView])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, targetView: ProgressView) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActiveView(targetView)
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(30)
      }
    }
  }, [])

  const renderViewTabs = () => (
    <div className="view-tabs" role="tablist" aria-label="Progress tracking views">
      {[
        { key: 'overview', label: 'Overview', icon: '📊' },
        { key: 'skills', label: 'Skills', icon: '🎯' },
        { key: 'milestones', label: 'Milestones', icon: '🏆' },
        { key: 'goals', label: 'Goals', icon: '✅' }
      ].map(tab => (
        <button
          key={tab.key}
          className={`view-tab ${activeView === tab.key ? 'active' : ''}`}
          onClick={() => setActiveView(tab.key as ProgressView)}
          onKeyDown={(e) => handleKeyDown(e, tab.key as ProgressView)}
          role="tab"
          aria-selected={activeView === tab.key}
          aria-controls={`${tab.key}-panel`}
          aria-label={`Switch to ${tab.label} view`}
          tabIndex={activeView === tab.key ? 0 : -1}
        >
          <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">
            <MobileProgressOverview progressData={progressData} compact={compact} />
          </div>
        )
      case 'skills':
        return (
          <div id="skills-panel" role="tabpanel" aria-labelledby="skills-tab">
            <MobileSkillProgress 
              progressData={progressData}
              onSkillClick={onSkillClick}
              onStartPractice={onStartPractice}
            />
          </div>
        )
      case 'milestones':
        return (
          <div id="milestones-panel" role="tabpanel" aria-labelledby="milestones-tab">
            <MobileMilestones 
              progressData={progressData}
              onMilestoneClick={onMilestoneClick}
            />
          </div>
        )
      case 'goals':
        return (
          <div id="goals-panel" role="tabpanel" aria-labelledby="goals-tab">
            <MobileGoalsTracker 
              progressData={progressData}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="mobile-progress-tracking" role="main" aria-label="Mobile PM Progress Tracking">
      <TouchGestureManager
        onSwipeLeft={(e) => handleSwipeNavigation({ direction: 'LEFT' })}
        onSwipeRight={(e) => handleSwipeNavigation({ direction: 'RIGHT' })}
        sensitivity="medium"
      >
        <div className="progress-container">
          {/* Navigation Tabs */}
          {renderViewTabs()}

          {/* Active View Content */}
          <div className="view-content">
            {renderActiveView()}
          </div>

          {/* Swipe Indicator */}
          <div className="swipe-indicator" aria-hidden="true">
            <div className="swipe-dots">
              {['overview', 'skills', 'milestones', 'goals'].map((view, index) => (
                <div 
                  key={view}
                  className={`dot ${activeView === view ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="swipe-hint">Swipe to navigate</div>
          </div>

          {/* Progress Summary for Compact Mode */}
          {compact && (
            <div className="compact-summary" role="complementary" aria-label="Progress summary">
              <div className="summary-stats">
                <div className="stat">
                  <span className="value">{progressData.overallProgress}%</span>
                  <span className="label">Progress</span>
                </div>
                <div className="stat">
                  <span className="value">{progressData.milestones.filter(m => m.isAchieved).length}</span>
                  <span className="label">Milestones</span>
                </div>
                <div className="stat">
                  <span className="value">{progressData.weeklyGoals.filter(g => g.progress >= 100).length}</span>
                  <span className="label">Goals</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </TouchGestureManager>

      <style jsx>{mobileProgressStyles}</style>
    </div>
  )
}

export default MobileProgressTracking