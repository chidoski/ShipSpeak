/**
 * Mobile Progress Cards for ShipSpeak
 * Card-based mobile progress display with PM-specific career milestones
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState } from 'react'
import { TouchGestureManager } from '../TouchOptimizedComponents/TouchGestureManager'
import { TouchButton } from '../TouchOptimizedComponents/TouchFriendlyControls'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ProgressCard {
  id: string
  title: string
  type: 'SKILL' | 'MILESTONE' | 'ACHIEVEMENT' | 'GOAL'
  progress: number
  target: number
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' | 'OVERDUE'
  dueDate?: string
  description: string
  careerRelevance: {
    impact: 'HIGH' | 'MEDIUM' | 'LOW'
    category: 'EXECUTIVE_PRESENCE' | 'STRATEGIC_THINKING' | 'INFLUENCE' | 'COMMUNICATION'
  }
  actionButton?: {
    label: string
    action: string
  }
}

interface MobileProgressCardsProps {
  cards: ProgressCard[]
  onCardAction?: (cardId: string, action: string) => void
  onCardSwipe?: (cardId: string, direction: 'LEFT' | 'RIGHT') => void
  careerContext?: {
    currentRole: string
    targetRole: string
    industry: string
  }
  groupBy?: 'TYPE' | 'STATUS' | 'IMPACT' | 'NONE'
}

// =============================================================================
// MOBILE PROGRESS CARDS COMPONENT
// =============================================================================

export const MobileProgressCards: React.FC<MobileProgressCardsProps> = ({
  cards,
  onCardAction,
  onCardSwipe,
  careerContext = { currentRole: 'PM', targetRole: 'Senior PM', industry: 'Fintech' },
  groupBy = 'NONE'
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('ALL')

  // =============================================================================
  // CARD ORGANIZATION
  // =============================================================================

  const getCardsByGroup = () => {
    let filtered = cards
    
    if (filter !== 'ALL') {
      filtered = cards.filter(card => card.status === filter)
    }

    if (groupBy === 'NONE') return { 'All Cards': filtered }

    return filtered.reduce((groups, card) => {
      let key: string
      switch (groupBy) {
        case 'TYPE':
          key = card.type
          break
        case 'STATUS':
          key = card.status
          break
        case 'IMPACT':
          key = card.careerRelevance.impact
          break
        default:
          key = 'All Cards'
      }
      
      if (!groups[key]) groups[key] = []
      groups[key].push(card)
      return groups
    }, {} as Record<string, ProgressCard[]>)
  }

  const handleCardSwipe = (cardId: string, direction: 'LEFT' | 'RIGHT') => {
    onCardSwipe?.(cardId, direction)
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const getCardColor = (card: ProgressCard) => {
    switch (card.status) {
      case 'COMPLETED': return '#10b981'
      case 'IN_PROGRESS': return '#3b82f6'
      case 'OVERDUE': return '#ef4444'
      default: return '#64748b'
    }
  }

  const getCardIcon = (card: ProgressCard) => {
    switch (card.type) {
      case 'SKILL': return '🎯'
      case 'MILESTONE': return '🏆'
      case 'ACHIEVEMENT': return '⭐'
      case 'GOAL': return '📋'
      default: return '📊'
    }
  }

  const getProgressPercentage = (card: ProgressCard) => {
    return card.target > 0 ? (card.progress / card.target) * 100 : 0
  }

  const renderProgressBar = (card: ProgressCard) => {
    const percentage = getProgressPercentage(card)
    const color = getCardColor(card)
    
    return (
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
        <span className="progress-text">{Math.round(percentage)}%</span>
      </div>
    )
  }

  const renderCard = (card: ProgressCard) => {
    const isExpanded = expandedCard === card.id
    const color = getCardColor(card)
    
    return (
      <TouchGestureManager
        key={card.id}
        onSwipeLeft={() => handleCardSwipe(card.id, 'LEFT')}
        onSwipeRight={() => handleCardSwipe(card.id, 'RIGHT')}
      >
        <div 
          className={`progress-card ${card.status.toLowerCase()} ${isExpanded ? 'expanded' : ''}`}
          style={{ borderLeftColor: color }}
          onClick={() => setExpandedCard(isExpanded ? null : card.id)}
        >
          {/* Card Header */}
          <div className="card-header">
            <div className="card-title-section">
              <span className="card-icon">{getCardIcon(card)}</span>
              <h4 className="card-title">{card.title}</h4>
            </div>
            <div className="card-meta">
              <span className="card-type">{card.type}</span>
              <span 
                className="impact-badge"
                style={{ backgroundColor: card.careerRelevance.impact === 'HIGH' ? '#ef4444' : 
                                         card.careerRelevance.impact === 'MEDIUM' ? '#f59e0b' : '#10b981' }}
              >
                {card.careerRelevance.impact}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="card-progress">
            {renderProgressBar(card)}
            <div className="progress-details">
              <span>{card.progress} / {card.target}</span>
              {card.dueDate && (
                <span className="due-date">Due: {card.dueDate}</span>
              )}
            </div>
          </div>

          {/* Expandable Content */}
          {isExpanded && (
            <div className="card-expanded-content">
              <p className="card-description">{card.description}</p>
              
              <div className="career-relevance">
                <span className="relevance-label">Career Impact:</span>
                <span className="relevance-category">{card.careerRelevance.category.replace('_', ' ')}</span>
              </div>

              {card.actionButton && (
                <div className="card-actions">
                  <TouchButton
                    size="MEDIUM"
                    variant="PRIMARY"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCardAction?.(card.id, card.actionButton!.action)
                    }}
                    minimumSize={44}
                    feedbackType={{ type: 'HAPTIC', intensity: 'MEDIUM' }}
                    fullWidth
                  >
                    {card.actionButton.label}
                  </TouchButton>
                </div>
              )}
            </div>
          )}
        </div>
      </TouchGestureManager>
    )
  }

  const renderFilterTabs = () => {
    const filters = ['ALL', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']
    
    return (
      <div className="filter-tabs">
        {filters.map(filterType => (
          <button
            key={filterType}
            className={`filter-tab ${filter === filterType ? 'active' : ''}`}
            onClick={() => setFilter(filterType)}
          >
            {filterType.replace('_', ' ')}
          </button>
        ))}
      </div>
    )
  }

  const cardGroups = getCardsByGroup()

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="mobile-progress-cards" data-testid="mobile-progress-cards">
      {/* Header */}
      <div className="cards-header">
        <h3>Progress Cards</h3>
        <span className="career-context">{careerContext.currentRole} → {careerContext.targetRole}</span>
      </div>

      {/* Filters */}
      {renderFilterTabs()}

      {/* Card Groups */}
      <div className="cards-container">
        {Object.entries(cardGroups).map(([groupName, groupCards]) => (
          <div key={groupName} className="card-group">
            {groupBy !== 'NONE' && (
              <h4 className="group-title">{groupName.replace('_', ' ')}</h4>
            )}
            
            <div className="cards-list">
              {groupCards.map(renderCard)}
            </div>
            
            {groupCards.length === 0 && (
              <div className="empty-group">
                <span>No cards in this category</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Swipe Instructions */}
      <div className="swipe-instructions">
        ← Swipe left to archive • Swipe right to prioritize →
      </div>

      <style jsx>{`
        .mobile-progress-cards {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f8fafc;
        }

        .cards-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .cards-header h3 {
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

        .filter-tabs {
          display: flex;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
        }

        .filter-tab {
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
          min-width: 100px;
        }

        .filter-tab.active {
          background: #f1f5f9;
          border-bottom: 2px solid #3b82f6;
          color: #3b82f6;
        }

        .cards-container {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        .card-group {
          margin-bottom: 2rem;
        }

        .group-title {
          margin: 0 0 1rem 0;
          font-weight: 600;
          color: #374151;
          text-transform: capitalize;
        }

        .cards-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .progress-card {
          background: white;
          border-radius: 12px;
          border-left: 4px solid;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .progress-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        .progress-card.expanded {
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .card-title-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .card-icon {
          font-size: 1.25rem;
        }

        .card-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .card-type {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          text-transform: capitalize;
        }

        .impact-badge {
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 8px;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .card-progress {
          margin-bottom: 1rem;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
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
          color: #374151;
          min-width: 40px;
        }

        .progress-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #64748b;
        }

        .due-date {
          font-weight: 500;
        }

        .card-expanded-content {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
          animation: expandContent 0.2s ease;
        }

        @keyframes expandContent {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 300px;
          }
        }

        .card-description {
          margin: 0 0 1rem 0;
          color: #374151;
          line-height: 1.5;
        }

        .career-relevance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .relevance-label {
          font-weight: 500;
          color: #64748b;
        }

        .relevance-category {
          font-weight: 600;
          color: #3b82f6;
          text-transform: capitalize;
        }

        .card-actions {
          margin-top: 1rem;
        }

        .empty-group {
          text-align: center;
          padding: 2rem;
          color: #9ca3af;
          font-style: italic;
        }

        .swipe-instructions {
          text-align: center;
          padding: 1rem;
          color: #9ca3af;
          font-size: 0.75rem;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        /* Status-specific styles */
        .progress-card.completed {
          opacity: 0.8;
        }

        .progress-card.overdue {
          border-left-color: #ef4444 !important;
          background: #fef2f2;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .cards-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .filter-tabs {
            overflow-x: scroll;
          }
          
          .card-title {
            font-size: 0.875rem;
          }
          
          .card-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .card-meta {
            flex-direction: row;
            align-items: center;
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  )
}