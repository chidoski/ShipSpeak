// Coaching System Type Definitions for ShipSpeak
// Supports PM career transition coaching with industry-specific contexts

export type PMRole = 'PO' | 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR' | 'VP_PRODUCT'
export type PMTransitionType = 'PO_TO_PM' | 'PM_TO_SENIOR_PM' | 'SENIOR_PM_TO_GROUP_PM' | 'GROUP_PM_TO_DIRECTOR'
export type Industry = 'healthcare' | 'cybersecurity' | 'fintech' | 'enterprise_software' | 'consumer_technology'

export type CoachingSessionType = 
  | 'STRATEGIC_THINKING' 
  | 'EXECUTIVE_PRESENCE' 
  | 'INDUSTRY_FLUENCY' 
  | 'FRAMEWORK_PRACTICE'
  | 'CAREER_TRANSITION'
  | 'STAKEHOLDER_MANAGEMENT'

export type CoachingMethod = 
  | 'SOCRATIC_QUESTIONING'
  | 'ROLE_PLAYING'
  | 'FRAMEWORK_APPLICATION'
  | 'REAL_TIME_COACHING'
  | 'SCENARIO_PRACTICE'

export type CommunicationStyle = 'DIRECT' | 'SOCRATIC' | 'SUPPORTIVE' | 'CHALLENGING'

export interface DevelopmentArea {
  id: string
  name: string
  category: 'STRATEGIC' | 'COMMUNICATION' | 'LEADERSHIP' | 'TECHNICAL' | 'INDUSTRY'
  currentLevel: number // 0-5 scale
  targetLevel: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  industrySpecific?: boolean
}

export interface CoachPersona {
  id: string
  name: string
  title: string
  avatarUrl?: string
  expertiseArea: string
  industry: Industry
  background: string
  communicationStyle: CommunicationStyle
  pmLevel: PMRole
  coachingApproach: CoachingMethod[]
  specialties: string[]
  yearsExperience: number
}

export interface CoachingSession {
  id: string
  sessionType: CoachingSessionType
  duration: number // minutes
  focusAreas: DevelopmentArea[]
  userProgress: ProgressMetrics
  aiCoachPersona: CoachPersona
  careerContext: PMTransitionType
  industryContext: Industry
  createdAt: Date
  completedAt?: Date
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
}

export interface ProgressMetrics {
  skillProgression: Record<string, number>
  sessionsCompleted: number
  totalDuration: number
  milestones: Milestone[]
  confidenceGrowth: number[]
  weeklyProgress: WeeklyProgress[]
}

export interface Milestone {
  id: string
  name: string
  description: string
  achievedAt?: Date
  category: 'COMMUNICATION' | 'LEADERSHIP' | 'STRATEGIC' | 'INDUSTRY'
  level: 'FOUNDATION' | 'PRACTICE' | 'MASTERY'
}

export interface WeeklyProgress {
  week: string
  sessionsCount: number
  skillImprovement: number
  focusAreas: string[]
  achievements: string[]
}

export interface CoachingInteraction {
  id: string
  sessionId: string
  timestamp: Date
  userInput: string
  coachResponse: CoachResponse
  developmentGoals: DevelopmentGoal[]
  realTimeCoaching: RealTimeCoaching
  progressTracking: ProgressUpdate
  type: 'USER_MESSAGE' | 'COACH_RESPONSE' | 'SYSTEM_UPDATE'
}

export interface CoachResponse {
  response: string
  coachingMethod: CoachingMethod
  developmentFocus: string[]
  nextQuestions: string[]
  improvementSuggestions: string[]
  frameworkReference?: string
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  tone: 'ENCOURAGING' | 'CHALLENGING' | 'CORRECTIVE' | 'CELEBRATORY'
}

export interface DevelopmentGoal {
  id: string
  title: string
  description: string
  category: string
  targetDate: Date
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  progress: number // 0-100%
  milestones: string[]
  relatedSkills: string[]
}

export interface RealTimeCoaching {
  communicationPattern: string
  improvementTip: string
  confidenceIndicator: number
  executivePresenceScore: number
  frameworkUsage: string[]
  nextLevelSuggestion: string
}

export interface ProgressUpdate {
  skillArea: string
  improvementScore: number
  newLevel?: number
  achievement?: string
  nextFocus?: string
}

// Coaching Panel Props
export interface CoachingPanelProps {
  userProfile: UserProfile
  coachingSession?: CoachingSession
  developmentFocus: DevelopmentArea[]
  careerContext: PMTransitionType
  industryContext: Industry
  onSessionStart: (sessionType: CoachingSessionType) => void
  onSessionEnd: () => void
  onProgressUpdate: (update: ProgressUpdate) => void
}

export interface UserProfile {
  id: string
  currentRole: PMRole
  targetRole: PMRole
  industry: Industry
  yearsExperience: number
  competencyLevels: Record<string, number>
  developmentPriorities: DevelopmentArea[]
  coachingPreferences: CoachingPreferences
}

export interface CoachingPreferences {
  preferredCoachingStyle: CommunicationStyle
  sessionDuration: number
  focusAreas: string[]
  challengeLevel: 'COMFORTABLE' | 'MODERATE' | 'AGGRESSIVE'
  feedbackFrequency: 'MINIMAL' | 'MODERATE' | 'FREQUENT'
}

// Framework-specific coaching interfaces
export interface FrameworkPractice {
  framework: 'RICE' | 'ICE' | 'JOBS_TO_BE_DONE' | 'OKR' | 'SMART'
  scenario: string
  userResponse: string
  coachingFeedback: string
  mastery: number
}

export interface ExecutivePresenceCoaching {
  authorityMarkers: string[]
  clarityScore: number
  convictionLevel: number
  composureIndicators: string[]
  improvementAreas: string[]
  nextLevelGoals: string[]
}

export interface IndustrySpecificCoaching {
  industry: Industry
  regulatoryContext: string[]
  vocabularyExpansion: string[]
  stakeholderMapping: string[]
  complianceAwareness: string[]
}

// Mock data and example structures
export interface MockCoachingData {
  coaches: CoachPersona[]
  sessions: CoachingSession[]
  conversations: CoachingInteraction[]
  developmentPlans: DevelopmentGoal[]
  progressHistory: ProgressMetrics[]
}