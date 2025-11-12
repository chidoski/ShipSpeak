/**
 * Shared types for Mobile Progress Tracking components
 * ShipSpeak - Mobile Progress Types
 */

export interface SkillProgress {
  id: string
  skill: string
  currentLevel: number
  targetLevel: number
  maxLevel: number
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  recentChange: number
  milestones: ProgressMilestone[]
}

export interface ProgressMilestone {
  id: string
  title: string
  description: string
  achievedDate?: string
  isAchieved: boolean
  type: 'SKILL' | 'CAREER' | 'INDUSTRY' | 'LEADERSHIP'
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface CareerProgressData {
  currentRole: string
  targetRole: string
  industry: string
  overallProgress: number
  timeToPromotion: string
  strengthAreas: string[]
  growthAreas: string[]
  skillProgress: SkillProgress[]
  milestones: ProgressMilestone[]
  weeklyGoals: WeeklyGoal[]
}

export interface WeeklyGoal {
  id: string
  title: string
  progress: number
  dueDate: string
  category: 'PRACTICE' | 'SKILL' | 'FEEDBACK' | 'NETWORKING'
}

export interface MobileProgressBaseProps {
  progressData: CareerProgressData
  onMilestoneClick?: (milestone: ProgressMilestone) => void
  onSkillClick?: (skill: SkillProgress) => void
  onStartPractice?: (skillId: string) => void
  compact?: boolean
}

export type ProgressView = 'overview' | 'skills' | 'milestones' | 'goals'