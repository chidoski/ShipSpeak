/**
 * Shared Dashboard Types for ShipSpeak
 * Centralized type definitions to reduce duplication
 */

export interface User {
  id?: string
  name?: string
  email?: string
  isAuthenticated?: boolean
  role?: 'individual' | 'team_member' | 'admin' | 'enterprise_admin'
  subscription?: 'free' | 'premium' | 'enterprise'
}

export interface Notifications {
  newMeetings?: number
  newModules?: number
  newFeedback?: number
  systemAlerts?: number
}

export interface ProcessingStatus {
  meetingsInProgress?: number
  modulesGenerating?: number
  uploadsActive?: number
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon: string
  badge?: number
  disabled?: boolean
}

export interface DashboardLayoutProps {
  children: React.ReactNode
  user?: User
  notifications?: Notifications
  processing?: ProcessingStatus
  theme?: 'light' | 'dark'
}

export interface MeetingAnalysisData {
  fillerWordsPerMinute: number
  confidenceScore: number
  speakingPace: number
  structureScore: number
  executivePresenceScore?: number
  keyInsights: string[]
  improvementAreas: string[]
  recommendations: string[]
  strengthAreas?: string[]
  communicationPatterns?: {
    clarity: number
    conciseness: number
    persuasiveness: number
  }
}

export interface Meeting {
  id: string
  title: string
  duration: number
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  createdAt: string
  updatedAt?: string
  platform?: 'google_meet' | 'zoom' | 'teams' | 'manual_upload'
  participants?: number
  analysis?: MeetingAnalysisData
  error?: string
  userId?: string
}

export interface WebSocketMessage {
  type: 'progress' | 'completed' | 'failed' | 'error'
  data: {
    progress?: number
    stage?: string
    analysis?: MeetingAnalysisData
    error?: string
    meetingId?: string
  }
}

export interface ProgressUpdate {
  progress: number
  stage: string
  meetingId?: string
  timestamp?: string
}

// =============================================================================
// PM-SPECIFIC DASHBOARD TYPES
// =============================================================================

import { User as AuthUser, PMRole, Industry } from './auth'
import { CompetencyCategory } from './competency'

export interface PMProgressData {
  currentLevel: PMRole
  targetLevel: PMRole
  progressPercentage: number
  skillGaps: SkillGap[]
  industryBenchmarks: IndustryBenchmarks
  weekStreak?: number
}

export interface SkillGap {
  area: CompetencyCategory
  current: number
  target: number
  industry: Industry
  frameworks?: string[]
  priority: 'critical' | 'important' | 'developing'
}

export interface IndustryBenchmarks {
  sector: Industry
  regulatoryCompliance?: number
  riskCommunication?: number
  trustBuilding?: number
  roiCommunication?: number
  userEngagement?: number
}

export interface LearningData {
  weeklyStreak: number
  modulesCompleted: number
  practiceSessionsCompleted: number
  foundationSkillsMastery: FoundationSkills
  nextMilestones: string[]
  totalHoursPracticed: number
  lastActivityDate: string
}

export interface FoundationSkills {
  pmVocabulary: number
  executivePresence: number
  frameworkApplication: number
  stakeholderManagement: number
  businessImpact: number
}

export interface QuickStatCard {
  id: string
  title: string
  value: string | number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  description: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

export interface EmptyState {
  type: 'no_meetings' | 'new_user' | 'practice_first' | 'meeting_analysis'
  headline: string
  subtext: string
  visual?: string
  ctas: EmptyStateCTA[]
  progressIndicators?: ProgressIndicator[]
}

export interface EmptyStateCTA {
  id: string
  text: string
  href: string
  type: 'primary' | 'secondary' | 'tertiary'
  icon?: string
}

export interface ProgressIndicator {
  label: string
  current: number
  target: number
  unit: string
}

export type PMTransitionType = 'PO_TO_PM' | 'PM_TO_SENIOR' | 'SENIOR_TO_GROUP' | 'GROUP_TO_DIRECTOR'