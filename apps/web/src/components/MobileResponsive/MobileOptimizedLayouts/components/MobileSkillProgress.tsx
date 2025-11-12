/**
 * Mobile Skill Progress Component
 * ShipSpeak - PM skill tracking with mobile-optimized interface
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback } from 'react'
import { TouchButton } from '../../TouchOptimizedComponents/TouchFriendlyControls'
import { SkillProgress, CareerProgressData } from '../types/MobileProgressTypes'

interface MobileSkillProgressProps {
  progressData: CareerProgressData
  onSkillClick?: (skill: SkillProgress) => void
  onStartPractice?: (skillId: string) => void
}

export const MobileSkillProgress: React.FC<MobileSkillProgressProps> = ({
  progressData,
  onSkillClick,
  onStartPractice
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  const handleSkillInteraction = useCallback((skill: SkillProgress) => {
    setSelectedSkill(selectedSkill === skill.id ? null : skill.id)
    onSkillClick?.(skill)
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25)
    }
  }, [selectedSkill, onSkillClick])

  const handleKeyDown = useCallback((event: React.KeyboardEvent, skill: SkillProgress) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSkillInteraction(skill)
    }
  }, [handleSkillInteraction])

  const renderProgressBar = (current: number, target: number) => {
    const percentage = target > 0 ? (current / target) * 100 : 0
    const color = percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'
    
    return (
      <div className="progress-bar-container">
        <div className="progress-bar" role="progressbar" aria-valuenow={current} aria-valuemax={target} aria-valuetext={`Level ${current} of ${target}`}>
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING': return { icon: '📈', label: 'Improving trend' }
      case 'STABLE': return { icon: '➡️', label: 'Stable trend' }
      case 'DECLINING': return { icon: '📉', label: 'Declining trend' }
      default: return { icon: '➡️', label: 'Unknown trend' }
    }
  }

  return (
    <div className="skills-section" role="main" aria-label="PM Skill Progress Tracking">
      <div className="skills-header">
        <h3>PM Skills Development</h3>
        <div className="skills-summary" aria-label={`Tracking ${progressData.skillProgress.length} PM skills`}>
          {progressData.skillProgress.length} Skills
        </div>
      </div>

      <div className="skills-grid" role="list">
        {progressData.skillProgress.map(skill => {
          const trendInfo = getTrendIcon(skill.trend)
          const isSelected = selectedSkill === skill.id
          
          return (
            <div 
              key={skill.id}
              className={`skill-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSkillInteraction(skill)}
              onKeyDown={(e) => handleKeyDown(e, skill)}
              role="listitem button"
              tabIndex={0}
              aria-expanded={isSelected}
              aria-label={`${skill.skill} skill: Level ${skill.currentLevel} of ${skill.maxLevel}, ${trendInfo.label}`}
            >
              <div className="skill-header">
                <h4>{skill.skill}</h4>
                <span 
                  className={`trend-indicator ${skill.trend.toLowerCase()}`}
                  aria-label={trendInfo.label}
                  title={trendInfo.label}
                >
                  {trendInfo.icon}
                </span>
              </div>
              
              <div className="skill-progress">
                {renderProgressBar(skill.currentLevel, skill.maxLevel)}
                <span className="level-text" aria-label={`Current level ${skill.currentLevel} out of maximum ${skill.maxLevel}`}>
                  Level {skill.currentLevel} / {skill.maxLevel}
                </span>
              </div>

              {skill.recentChange !== 0 && (
                <div className={`recent-change ${skill.recentChange > 0 ? 'positive' : 'negative'}`}>
                  {skill.recentChange > 0 ? '+' : ''}{skill.recentChange} recent
                </div>
              )}

              {isSelected && (
                <div className="skill-details" role="region" aria-label="Skill details">
                  <div className="skill-targets">
                    <p>
                      <strong>Current:</strong> Level {skill.currentLevel}<br/>
                      <strong>Target:</strong> Level {skill.targetLevel}<br/>
                      <strong>Gap:</strong> {skill.targetLevel - skill.currentLevel} levels
                    </p>
                  </div>
                  
                  {skill.milestones.length > 0 && (
                    <div className="skill-milestones">
                      <h5>Related Milestones:</h5>
                      <ul>
                        {skill.milestones.slice(0, 2).map((milestone, index) => (
                          <li key={index} className={milestone.isAchieved ? 'achieved' : 'pending'}>
                            {milestone.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="skill-actions">
                    <TouchButton
                      size="MEDIUM"
                      variant="PRIMARY"
                      onClick={(e) => {
                        e.stopPropagation()
                        onStartPractice?.(skill.id)
                      }}
                      minimumSize={44}
                      feedbackType={{ type: 'HAPTIC', intensity: 'LIGHT' }}
                      aria-label={`Start practicing ${skill.skill}`}
                    >
                      Practice Now
                    </TouchButton>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .skills-section {
          padding: 1rem;
          background: #f8fafc;
        }

        .skills-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .skills-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .skills-summary {
          background: #e2e8f0;
          color: #475569;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .skill-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          min-height: 44px; /* Touch target minimum */
        }

        .skill-card:hover,
        .skill-card:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .skill-card:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .skill-card.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .skill-header h4 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .trend-indicator {
          font-size: 1.25rem;
        }

        .trend-indicator.improving { filter: hue-rotate(90deg); }
        .trend-indicator.declining { filter: hue-rotate(0deg); }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
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

        .level-text {
          font-size: 0.875rem;
          color: #64748b;
          display: block;
        }

        .recent-change {
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          display: inline-block;
        }

        .recent-change.positive {
          background: #dcfce7;
          color: #166534;
        }

        .recent-change.negative {
          background: #fef2f2;
          color: #dc2626;
        }

        .skill-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .skill-targets p {
          margin: 0;
          color: #475569;
          line-height: 1.5;
        }

        .skill-milestones {
          margin: 1rem 0;
        }

        .skill-milestones h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .skill-milestones ul {
          margin: 0;
          padding-left: 1rem;
        }

        .skill-milestones li {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          color: #64748b;
        }

        .skill-milestones li.achieved {
          color: #10b981;
          font-weight: 500;
        }

        .skill-actions {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }

          .skill-card {
            min-height: 48px; /* Larger touch target on mobile */
          }
        }
      `}</style>
    </div>
  )
}

export default MobileSkillProgress