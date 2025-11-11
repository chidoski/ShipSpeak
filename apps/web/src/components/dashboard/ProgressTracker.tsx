/**
 * Progress Tracker Component for ShipSpeak (Refactored)
 * Visual progress indicators and milestone tracking using extracted components
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { User } from '@/types/auth'
import { LearningData } from '@/types/dashboard'
import { ProgressCircle } from './ProgressCircle'
import { MilestoneCard } from './MilestoneCard'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ProgressTrackerProps {
  user: User | null
  learningData: LearningData | null
}

interface MilestoneData {
  id: string
  title: string
  description: string
  completed: boolean
  progress: number
  category: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  user,
  learningData
}) => {
  // =============================================================================
  // DATA GENERATION
  // =============================================================================

  const getMilestones = (): MilestoneData[] => {
    if (!user || !learningData) return []

    return [
      {
        id: 'foundation-skills',
        title: 'Foundation Skills Mastery',
        description: 'Core PM communication competencies',
        completed: learningData.foundationSkillsMastery.pmVocabulary >= 80,
        progress: Math.round((
          learningData.foundationSkillsMastery.pmVocabulary +
          learningData.foundationSkillsMastery.executivePresence +
          learningData.foundationSkillsMastery.frameworkApplication
        ) / 3),
        category: 'communication'
      },
      {
        id: 'practice-consistency',
        title: 'Practice Consistency',
        description: 'Regular skill development engagement',
        completed: learningData.weeklyStreak >= 4,
        progress: Math.min(100, (learningData.weeklyStreak / 8) * 100),
        category: 'engagement'
      },
      {
        id: 'module-completion',
        title: 'Module Completion',
        description: `${user.industry} PM communication modules`,
        completed: learningData.modulesCompleted >= 10,
        progress: (learningData.modulesCompleted / 10) * 100,
        category: 'knowledge'
      },
      {
        id: 'executive-readiness',
        title: 'Executive Readiness',
        description: 'Preparation for senior leadership roles',
        completed: learningData.foundationSkillsMastery.executivePresence >= 85,
        progress: learningData.foundationSkillsMastery.executivePresence,
        category: 'leadership'
      }
    ]
  }

  const getOverallProgress = (): number => {
    if (!learningData) return 0
    
    const milestones = getMilestones()
    const totalProgress = milestones.reduce((sum, milestone) => sum + milestone.progress, 0)
    return Math.round(totalProgress / milestones.length)
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  const milestones = getMilestones()
  const overallProgress = getOverallProgress()

  if (!user || !learningData) return null

  return (
    <div 
      data-testid="progress-tracker"
      className="progress-tracker"
    >
      <div className="tracker-header">
        <div className="header-content">
          <h2 className="tracker-title">Your PM Development Progress</h2>
          <p className="tracker-subtitle">
            Track your journey to {user.role === 'PM' ? 'Senior PM' : 'Executive'} communication mastery
          </p>
        </div>
        <div className="overall-progress">
          <ProgressCircle progress={overallProgress} size={80} />
        </div>
      </div>
      
      <div className="milestones-grid">
        {milestones.map(milestone => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
      
      <style jsx>{`
        .progress-tracker {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
        }
        
        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 2rem;
        }
        
        .header-content {
          flex: 1;
        }
        
        .tracker-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1F2937;
          margin: 0 0 0.5rem 0;
        }
        
        .tracker-subtitle {
          font-size: 0.875rem;
          color: #6B7280;
          margin: 0;
        }
        
        .overall-progress {
          flex-shrink: 0;
        }
        
        .milestones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .progress-tracker {
            padding: 1.5rem;
          }
          
          .tracker-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .milestones-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .tracker-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}