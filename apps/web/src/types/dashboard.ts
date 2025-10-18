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