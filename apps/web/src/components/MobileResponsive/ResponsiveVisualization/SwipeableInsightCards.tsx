/**
 * Swipeable Insight Cards for ShipSpeak Mobile
 * Swipeable analysis insight exploration with PM-specific career context
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback } from 'react'
import { TouchGestureManager } from '../TouchOptimizedComponents/TouchGestureManager'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface InsightCard {
  id: string
  type: 'STRENGTH' | 'IMPROVEMENT' | 'MILESTONE' | 'RECOMMENDATION'
  title: string
  description: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  timeframe: string
  careerRelevance: {
    currentRole: string
    targetRole: string
    industry: string
    skillArea: string
  }
  actionItems: string[]
  progressIndicator?: {
    current: number
    target: number
    unit: string
  }
  relatedModules?: string[]
}

interface SwipeableInsightCardsProps {
  insights: InsightCard[]
  onCardAction?: (cardId: string, action: string) => void
  onSwipeComplete?: (cardId: string, direction: 'LEFT' | 'RIGHT') => void
  careerContext?: {
    currentRole: string
    targetRole: string
    industry: string
  }
  compact?: boolean
}

// =============================================================================
// SWIPEABLE INSIGHT CARDS COMPONENT
// =============================================================================

export const SwipeableInsightCards: React.FC<SwipeableInsightCardsProps> = ({
  insights,
  onCardAction,
  onSwipeComplete,
  careerContext = {
    currentRole: 'PM',
    targetRole: 'Senior PM',
    industry: 'Fintech'
  },
  compact = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeState, setSwipeState] = useState({
    isActive: false,
    direction: null as 'LEFT' | 'RIGHT' | null,
    progress: 0
  })
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(new Set())

  const visibleInsights = insights.filter(insight => !dismissedCards.has(insight.id))
  const currentInsight = visibleInsights[currentIndex]

  // =============================================================================
  // CARD NAVIGATION
  // =============================================================================

  const navigateToCard = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(visibleInsights.length - 1, index))
    setCurrentIndex(clampedIndex)
  }, [visibleInsights.length])

  const nextCard = useCallback(() => {
    navigateToCard(currentIndex + 1)
  }, [currentIndex, navigateToCard])

  const previousCard = useCallback(() => {
    navigateToCard(currentIndex - 1)
  }, [currentIndex, navigateToCard])

  // =============================================================================
  // SWIPE HANDLING
  // =============================================================================

  const handleSwipeGesture = useCallback((event: any) => {
    if (event.direction === 'LEFT') {
      // Swipe left = dismiss or next card
      if (currentInsight) {
        setDismissedCards(prev => new Set([...prev, currentInsight.id]))
        onSwipeComplete?.(currentInsight.id, 'LEFT')
        
        // Move to next card or stay at same index
        if (currentIndex >= visibleInsights.length - 1) {
          navigateToCard(Math.max(0, currentIndex - 1))
        }
      }
    } else if (event.direction === 'RIGHT') {
      // Swipe right = save/favorite
      if (currentInsight) {
        onCardAction?.(currentInsight.id, 'FAVORITE')
        onSwipeComplete?.(currentInsight.id, 'RIGHT')
      }
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, [currentInsight, currentIndex, visibleInsights.length, onSwipeComplete, onCardAction, navigateToCard])

  const handlePanGesture = useCallback((event: any) => {
    const progress = Math.min(Math.abs(event.deltaX) / 200, 1)
    const direction = event.deltaX > 0 ? 'RIGHT' : 'LEFT'

    setSwipeState({
      isActive: true,
      direction,
      progress
    })
  }, [])

  const handleGestureEnd = useCallback(() => {
    setSwipeState({
      isActive: false,
      direction: null,
      progress: 0
    })
  }, [])

  // =============================================================================
  // CARD ACTIONS
  // =============================================================================

  const handleCardAction = useCallback((action: string) => {
    if (!currentInsight) return

    onCardAction?.(currentInsight.id, action)

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25)
    }
  }, [currentInsight, onCardAction])

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderProgressIndicator = (insight: InsightCard) => {
    if (!insight.progressIndicator) return null

    const { current, target, unit } = insight.progressIndicator
    const percentage = (current / target) * 100

    return (
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-values">
            {current}/{target} {unit}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  const renderActionItems = (insight: InsightCard) => {
    if (insight.actionItems.length === 0) return null

    return (
      <div className="action-items">
        <h4>Next Steps</h4>
        <ul>
          {insight.actionItems.slice(0, compact ? 2 : 3).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  const renderRelatedModules = (insight: InsightCard) => {
    if (!insight.relatedModules || insight.relatedModules.length === 0) return null

    return (
      <div className="related-modules">
        <h4>Recommended Practice</h4>
        <div className="module-tags">
          {insight.relatedModules.slice(0, 2).map((module, index) => (
            <span key={index} className="module-tag">
              {module}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const getCardColor = (type: InsightCard['type']) => {
    switch (type) {
      case 'STRENGTH': return '#10b981'
      case 'IMPROVEMENT': return '#f59e0b'
      case 'MILESTONE': return '#8b5cf6'
      case 'RECOMMENDATION': return '#3b82f6'
      default: return '#64748b'
    }
  }

  const getCardIcon = (type: InsightCard['type']) => {
    switch (type) {
      case 'STRENGTH': return '✨'
      case 'IMPROVEMENT': return '🎯'
      case 'MILESTONE': return '🏆'
      case 'RECOMMENDATION': return '💡'
      default: return '📋'
    }
  }

  const renderCardControls = () => (
    <div className="card-controls">
      <button 
        className="control-button dismiss"
        onClick={() => handleCardAction('DISMISS')}
        aria-label="Dismiss insight"
      >
        ✕
      </button>
      <button 
        className="control-button favorite"
        onClick={() => handleCardAction('FAVORITE')}
        aria-label="Save insight"
      >
        ⭐
      </button>
      <button 
        className="control-button practice"
        onClick={() => handleCardAction('START_PRACTICE')}
        aria-label="Start practice"
      >
        🎪
      </button>
    </div>
  )

  if (visibleInsights.length === 0) {
    return (
      <div className="empty-insights">
        <span className="empty-icon">🎯</span>
        <p>No insights available</p>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      className={`swipeable-insight-cards ${compact ? 'compact' : ''}`}
      data-testid="swipeable-insight-cards"
    >
      {/* Card Stack */}
      <TouchGestureManager
        onSwipeLeft={handleSwipeGesture}
        onSwipeRight={handleSwipeGesture}
        onPan={handlePanGesture}
        onTouchEnd={handleGestureEnd}
      >
        <div className="card-container">
          {/* Background cards */}
          {visibleInsights.slice(currentIndex + 1, currentIndex + 3).map((insight, index) => (
            <div
              key={insight.id}
              className="insight-card background-card"
              style={{
                transform: `translateY(${(index + 1) * 8}px) scale(${1 - (index + 1) * 0.03})`,
                zIndex: 10 - index
              }}
            />
          ))}

          {/* Current card */}
          {currentInsight && (
            <div
              className={`insight-card current-card ${swipeState.isActive ? 'swiping' : ''}`}
              style={{
                transform: swipeState.isActive ? 
                  `translateX(${swipeState.direction === 'RIGHT' ? swipeState.progress * 100 : -swipeState.progress * 100}px) rotate(${swipeState.progress * (swipeState.direction === 'RIGHT' ? 5 : -5)}deg)` : 
                  'none',
                zIndex: 20
              }}
            >
              {/* Card Header */}
              <div 
                className="card-header"
                style={{ backgroundColor: getCardColor(currentInsight.type) }}
              >
                <div className="header-content">
                  <span className="card-icon">{getCardIcon(currentInsight.type)}</span>
                  <div className="header-text">
                    <h3>{currentInsight.title}</h3>
                    <span className="card-type">{currentInsight.type}</span>
                  </div>
                  <div className="impact-badge">
                    {currentInsight.impact}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <p className="card-description">{currentInsight.description}</p>

                {/* Career Relevance */}
                <div className="career-context">
                  <div className="context-item">
                    <span className="context-label">Career Path:</span>
                    <span className="context-value">
                      {currentInsight.careerRelevance.currentRole} → {currentInsight.careerRelevance.targetRole}
                    </span>
                  </div>
                  <div className="context-item">
                    <span className="context-label">Focus Area:</span>
                    <span className="context-value">{currentInsight.careerRelevance.skillArea}</span>
                  </div>
                  <div className="context-item">
                    <span className="context-label">Timeframe:</span>
                    <span className="context-value">{currentInsight.timeframe}</span>
                  </div>
                </div>

                {/* Progress Indicator */}
                {renderProgressIndicator(currentInsight)}

                {/* Action Items */}
                {renderActionItems(currentInsight)}

                {/* Related Modules */}
                {renderRelatedModules(currentInsight)}
              </div>

              {/* Card Controls */}
              {renderCardControls()}
            </div>
          )}
        </div>
      </TouchGestureManager>

      {/* Navigation */}
      <div className="card-navigation">
        <div className="nav-dots">
          {visibleInsights.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => navigateToCard(index)}
              aria-label={`Go to insight ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="nav-info">
          <span>{currentIndex + 1} of {visibleInsights.length}</span>
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className="swipe-instructions">
        <span>← Swipe left to dismiss • Swipe right to save →</span>
      </div>

      {/* Styles */}
      <style jsx>{`
        .swipeable-insight-cards {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 1rem;
        }

        .swipeable-insight-cards.compact {
          max-height: 500px;
        }

        .card-container {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .insight-card {
          position: absolute;
          width: 100%;
          max-width: 350px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .background-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .current-card {
          cursor: grab;
        }

        .current-card:active {
          cursor: grabbing;
        }

        .current-card.swiping {
          transition: none;
        }

        .card-header {
          color: white;
          padding: 1.5rem;
          background: linear-gradient(135deg, var(--card-color) 0%, rgba(0,0,0,0.1) 100%);
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .card-icon {
          font-size: 1.5rem;
          margin-top: 0.25rem;
        }

        .header-text {
          flex: 1;
        }

        .header-text h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .card-type {
          font-size: 0.75rem;
          opacity: 0.9;
          text-transform: uppercase;
          font-weight: 500;
        }

        .impact-badge {
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-body {
          padding: 1.5rem;
        }

        .card-description {
          margin: 0 0 1.5rem 0;
          color: #374151;
          line-height: 1.6;
        }

        .career-context {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .context-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .context-item:last-child {
          margin-bottom: 0;
        }

        .context-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .context-value {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 600;
        }

        .progress-section {
          margin-bottom: 1.5rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .progress-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .progress-values {
          font-size: 0.875rem;
          font-weight: 600;
          color: #3b82f6;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .action-items h4,
        .related-modules h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .action-items ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .action-items li {
          margin-bottom: 0.5rem;
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .related-modules {
          margin-top: 1.5rem;
        }

        .module-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .module-tag {
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .card-controls {
          display: flex;
          justify-content: space-around;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .control-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-button:hover {
          background: rgba(0,0,0,0.05);
          transform: scale(1.1);
        }

        .control-button:active {
          transform: scale(0.95);
        }

        .card-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          margin-top: 1rem;
        }

        .nav-dots {
          display: flex;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-dot.active {
          background: #3b82f6;
          transform: scale(1.2);
        }

        .nav-info {
          font-size: 0.875rem;
          color: #64748b;
          min-width: 80px;
          text-align: right;
        }

        .swipe-instructions {
          text-align: center;
          padding: 0.5rem;
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .empty-insights {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #9ca3af;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .swipeable-insight-cards {
            padding: 0.5rem;
          }
          
          .card-header {
            padding: 1rem;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .card-controls {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  )
}