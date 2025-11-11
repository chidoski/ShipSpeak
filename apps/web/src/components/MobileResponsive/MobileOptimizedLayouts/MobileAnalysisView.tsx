/**
 * Mobile Analysis View for ShipSpeak
 * Mobile-optimized analysis result display with touch navigation and progressive disclosure
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useRef } from 'react'
import { TouchGestureManager } from '../TouchOptimizedComponents/TouchGestureManager'
import { TouchButton } from '../TouchOptimizedComponents/TouchFriendlyControls'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface AnalysisData {
  overallScore: number
  dimensions: {
    label: string
    score: number
    maxScore: number
    insights: string[]
  }[]
  strengths: string[]
  improvements: string[]
  careerImpact: {
    readiness: number
    nextSteps: string[]
  }
}

interface MobileAnalysisViewProps {
  analysisData: AnalysisData
  careerContext?: {
    currentRole: string
    targetRole: string
    industry: string
  }
  onNavigateToInsight?: (insightId: string) => void
  onStartPractice?: () => void
  compact?: boolean
}

// =============================================================================
// MOBILE ANALYSIS VIEW COMPONENT
// =============================================================================

export const MobileAnalysisView: React.FC<MobileAnalysisViewProps> = ({
  analysisData,
  careerContext = {
    currentRole: 'PM',
    targetRole: 'Senior PM', 
    industry: 'Fintech'
  },
  onNavigateToInsight,
  onStartPractice,
  compact = false
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'strengths' | 'improvements' | 'insights'>('overview')
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(!compact)

  // =============================================================================
  // GESTURE HANDLERS
  // =============================================================================

  const handleSwipeGesture = (event: any) => {
    const sections = ['overview', 'strengths', 'improvements', 'insights'] as const
    const currentIndex = sections.indexOf(activeSection)
    
    if (event.direction === 'LEFT' && currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1])
    } else if (event.direction === 'RIGHT' && currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1])
    }
  }

  const handleDimensionTap = (index: number) => {
    setSelectedDimension(selectedDimension === index ? null : index)
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25)
    }
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderProgressBar = (value: number, maxValue: number = 100) => {
    const percentage = (value / maxValue) * 100
    const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#f59e0b' : '#ef4444'
    
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
        <span className="progress-text" style={{ color }}>
          {value}/{maxValue}
        </span>
      </div>
    )
  }

  const renderOverviewSection = () => (
    <div className="analysis-section">
      <div className="overall-score-card">
        <div className="score-display">
          <span className="score-value">{analysisData.overallScore}</span>
          <span className="score-label">Overall Score</span>
        </div>
        <div className="career-readiness">
          <span className="readiness-label">{careerContext.targetRole} Readiness</span>
          {renderProgressBar(analysisData.careerImpact.readiness)}
        </div>
      </div>

      <div className="dimensions-grid">
        {analysisData.dimensions.map((dimension, index) => (
          <div 
            key={index}
            className={`dimension-card ${selectedDimension === index ? 'selected' : ''}`}
            onClick={() => handleDimensionTap(index)}
          >
            <div className="dimension-header">
              <span className="dimension-label">{dimension.label}</span>
              <span className="dimension-score">{dimension.score}</span>
            </div>
            {renderProgressBar(dimension.score, dimension.maxScore)}
            
            {selectedDimension === index && (
              <div className="dimension-insights">
                {dimension.insights.map((insight, insightIndex) => (
                  <div key={insightIndex} className="insight-item">
                    • {insight}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStrengthsSection = () => (
    <div className="analysis-section">
      <div className="section-header">
        <h3>Your Strengths</h3>
        <span className="strength-count">{analysisData.strengths.length} identified</span>
      </div>
      <div className="items-list">
        {analysisData.strengths.map((strength, index) => (
          <div key={index} className="list-item strength-item">
            <span className="item-icon">✅</span>
            <span className="item-text">{strength}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderImprovementsSection = () => (
    <div className="analysis-section">
      <div className="section-header">
        <h3>Growth Opportunities</h3>
        <span className="improvement-count">{analysisData.improvements.length} areas</span>
      </div>
      <div className="items-list">
        {analysisData.improvements.map((improvement, index) => (
          <div key={index} className="list-item improvement-item">
            <span className="item-icon">🎯</span>
            <span className="item-text">{improvement}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderInsightsSection = () => (
    <div className="analysis-section">
      <div className="section-header">
        <h3>Career Insights</h3>
        <span className="context-badge">{careerContext.currentRole} → {careerContext.targetRole}</span>
      </div>
      <div className="insights-content">
        <div className="next-steps">
          <h4>Recommended Next Steps</h4>
          {analysisData.careerImpact.nextSteps.map((step, index) => (
            <div key={index} className="next-step-item">
              <span className="step-number">{index + 1}</span>
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>
        
        <TouchButton
          size="LARGE"
          variant="PRIMARY"
          onClick={onStartPractice}
          minimumSize={48}
          feedbackType={{ type: 'HAPTIC', intensity: 'MEDIUM' }}
          fullWidth
        >
          🎪 Start Targeted Practice
        </TouchButton>
      </div>
    </div>
  )

  const renderSectionTabs = () => (
    <div className="section-tabs">
      {[
        { key: 'overview', label: 'Overview', icon: '📊' },
        { key: 'strengths', label: 'Strengths', icon: '✨' },
        { key: 'improvements', label: 'Growth', icon: '🎯' },
        { key: 'insights', label: 'Insights', icon: '🧠' }
      ].map(tab => (
        <button
          key={tab.key}
          className={`section-tab ${activeSection === tab.key ? 'active' : ''}`}
          onClick={() => setActiveSection(tab.key as any)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverviewSection()
      case 'strengths': return renderStrengthsSection()
      case 'improvements': return renderImprovementsSection()
      case 'insights': return renderInsightsSection()
      default: return renderOverviewSection()
    }
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      className={`mobile-analysis-view ${compact ? 'compact' : ''}`}
      data-testid="mobile-analysis-view"
    >
      {/* Header */}
      <div className="analysis-header">
        <div className="header-info">
          <h2>Analysis Results</h2>
          <span className="industry-context">{careerContext.industry} PM Analysis</span>
        </div>
        
        {compact && (
          <TouchButton
            size="SMALL"
            variant="SECONDARY"
            onClick={() => setIsExpanded(!isExpanded)}
            minimumSize={36}
            feedbackType={{ type: 'HAPTIC', intensity: 'LIGHT' }}
          >
            {isExpanded ? '📖' : '📝'}
          </TouchButton>
        )}
      </div>

      {/* Content */}
      {(!compact || isExpanded) && (
        <TouchGestureManager
          onSwipeLeft={handleSwipeGesture}
          onSwipeRight={handleSwipeGesture}
        >
          <div className="analysis-content">
            {renderSectionTabs()}
            <div className="section-content">
              {renderCurrentSection()}
            </div>
            
            {/* Swipe Indicator */}
            <div className="swipe-indicator">
              <span>← Swipe to navigate sections →</span>
            </div>
          </div>
        </TouchGestureManager>
      )}

      <style jsx>{`
        .mobile-analysis-view {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f8fafc;
          overflow-y: auto;
        }

        .mobile-analysis-view.compact {
          max-height: 300px;
        }

        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .header-info h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .industry-context {
          font-size: 0.875rem;
          color: #64748b;
        }

        .analysis-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .section-tabs {
          display: flex;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
        }

        .section-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 70px;
        }

        .section-tab.active {
          background: #f1f5f9;
          border-bottom: 2px solid #3b82f6;
          color: #3b82f6;
        }

        .tab-icon {
          font-size: 1.25rem;
        }

        .tab-label {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .section-content {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        .analysis-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .overall-score-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .score-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }

        .score-value {
          font-size: 3rem;
          font-weight: bold;
          color: #3b82f6;
          line-height: 1;
        }

        .score-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .career-readiness {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .readiness-label {
          font-weight: 600;
          color: #1e293b;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          min-width: 50px;
        }

        .dimensions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .dimension-card {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dimension-card.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .dimension-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .dimension-label {
          font-weight: 500;
          color: #1e293b;
        }

        .dimension-score {
          font-weight: 600;
          color: #3b82f6;
        }

        .dimension-insights {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .insight-item {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .strength-count, .improvement-count {
          font-size: 0.875rem;
          color: #10b981;
          font-weight: 500;
        }

        .improvement-count {
          color: #f59e0b;
        }

        .context-badge {
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .list-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #e5e7eb;
        }

        .strength-item {
          border-left-color: #10b981;
        }

        .improvement-item {
          border-left-color: #f59e0b;
        }

        .item-icon {
          font-size: 1.25rem;
          margin-top: 0.125rem;
        }

        .item-text {
          flex: 1;
          color: #374151;
          line-height: 1.5;
        }

        .insights-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .next-steps h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-weight: 600;
        }

        .next-step-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .step-number {
          background: #3b82f6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-text {
          flex: 1;
          color: #374151;
        }

        .swipe-indicator {
          text-align: center;
          padding: 0.5rem;
          color: #9ca3af;
          font-size: 0.75rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .overall-score-card {
            padding: 1rem;
          }
          
          .score-value {
            font-size: 2.5rem;
          }
          
          .section-content {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}