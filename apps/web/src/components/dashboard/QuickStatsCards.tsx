/**
 * Quick Stats Cards Component for ShipSpeak (Refactored)
 * Four PM-specific metric cards using extracted StatCard component
 * Max 150 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { User } from '@/types/auth'
import { PMProgressData, LearningData, QuickStatCard } from '@/types/dashboard'
import { StatCard } from './StatCard'
import { mockDashboardData } from '@/lib/mockData'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface QuickStatsCardsProps {
  user: User | null
  progressData: PMProgressData | null
  learningData: LearningData | null
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({
  user,
  progressData,
  learningData
}) => {
  // =============================================================================
  // DATA GENERATION
  // =============================================================================

  const getStatsData = (): QuickStatCard[] => {
    if (!user || !progressData || !learningData) {
      return mockDashboardData.getQuickStats()
    }

    return [
      {
        id: 'executive-readiness',
        title: 'Executive Readiness',
        value: `${Math.round(progressData.progressPercentage)}%`,
        trend: 'up',
        trendValue: 12,
        description: `Progress toward ${progressData.targetLevel} communication standards`,
        icon: '🎯',
        color: 'blue'
      },
      {
        id: 'practice-streak',
        title: 'Practice Streak',
        value: learningData.weeklyStreak || 0,
        trend: learningData.weeklyStreak > 0 ? 'up' : 'stable',
        trendValue: 3,
        description: 'Weeks of consistent skill development',
        icon: '🔥',
        color: 'orange'
      },
      {
        id: 'modules-completed',
        title: 'Modules Completed',
        value: learningData.modulesCompleted,
        trend: 'up',
        trendValue: 2,
        description: `${user.industry} PM communication modules mastered`,
        icon: '📚',
        color: 'green'
      },
      {
        id: 'hours-practiced',
        title: 'Hours Practiced',
        value: `${learningData.totalHoursPracticed}h`,
        trend: 'up',
        trendValue: 4.5,
        description: 'Total executive communication practice time',
        icon: '⏱️',
        color: 'purple'
      }
    ]
  }

  const statsData = getStatsData()

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      data-testid="quick-stats-cards"
      className="quick-stats-grid"
    >
      {statsData.map(stat => (
        <StatCard key={stat.id} stat={stat} />
      ))}
      
      <style jsx>{`
        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .quick-stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}