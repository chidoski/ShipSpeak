/**
 * Settings & Preferences TypeScript Interfaces
 * Comprehensive type system for PM-specific customization and career-intelligent preferences
 */

export interface SettingsPreferencesProps {
  userProfile: UserProfile
  currentPreferences: UserPreferences
  intelligentDefaults: IntelligentDefaults
  customizationOptions: CustomizationOptions
}

export interface UserPreferences {
  learningPathPreferences: LearningPathPreferences
  practiceSessionSettings: PracticeSessionSettings
  feedbackCustomization: FeedbackCustomization
  industryContextSettings: IndustryContextSettings
  careerTransitionFocus: CareerTransitionFocus
  meetingTypePreferences: MeetingTypePreferences
  systemPreferences: SystemPreferences
}

export interface LearningPathPreferences {
  primaryFocus: 'MEETING_ANALYSIS' | 'PRACTICE_FIRST' | 'BALANCED'
  difficultyProgression: 'GRADUAL' | 'ACCELERATED' | 'ADAPTIVE'
  feedbackIntensity: 'GENTLE' | 'MODERATE' | 'INTENSIVE'
  industryContextEmphasis: number // 0-100
  frameworkFocus: FrameworkPreference[]
}

export interface PracticeSessionSettings {
  preferredSessionLength: number // minutes
  realTimeCoaching: boolean
  transcriptionDisplay: boolean
  backgroundNoise: 'ALLOW' | 'WARN' | 'BLOCK'
  qualityThreshold: 'FLEXIBLE' | 'STANDARD' | 'STRICT'
  retakePolicy: 'UNLIMITED' | 'LIMITED' | 'SINGLE_ATTEMPT'
}

export interface FeedbackCustomization {
  feedbackStyle: 'ENCOURAGING' | 'DIRECT' | 'ANALYTICAL'
  strengthEmphasis: number // 0-100, balance of strengths vs improvements
  careerContextIntegration: boolean
  benchmarkDisplay: boolean
  improvementTimelinePreference: 'OPTIMISTIC' | 'REALISTIC' | 'CONSERVATIVE'
}

export interface IndustryContextSettings {
  primaryIndustry: 'HEALTHCARE' | 'CYBERSECURITY' | 'FINTECH' | 'ENTERPRISE' | 'CONSUMER'
  regulatoryFocus: 'LOW' | 'MEDIUM' | 'HIGH'
  complianceEmphasis: string[]
  stakeholderPriority: string[]
  technicalDepth: 'BUSINESS_FOCUSED' | 'BALANCED' | 'TECHNICAL_FOCUSED'
}

export interface CareerTransitionFocus {
  currentLevel: 'PO' | 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR'
  targetLevel: 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR' | 'VP_PRODUCT'
  transitionTimeline: 'IMMEDIATE' | 'SIX_MONTHS' | 'ONE_YEAR' | 'TWO_YEARS'
  focusAreas: TransitionFocusArea[]
  confidenceLevel: number // 1-10
}

export interface MeetingTypePreferences {
  boardPresentation: BoardPresentationPreferences
  planningSession: PlanningSessionPreferences
  stakeholderUpdate: StakeholderUpdatePreferences
  coachingSession: CoachingSessionPreferences
}

export interface SystemPreferences {
  notifications: NotificationSettings
  privacy: PrivacySettings
  integrations: IntegrationSettings
  accessibility: AccessibilitySettings
}

// Career Transition Specific Types
export interface TransitionFocusArea {
  area: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  currentLevel: number // 1-10
  targetLevel: number // 1-10
  timeframe: string
}

export interface BoardPresentationPreferences {
  presentationStyle: 'FORMAL' | 'CONVERSATIONAL' | 'HYBRID'
  timeManagement: 'STRICT' | 'FLEXIBLE' | 'QUESTION_DRIVEN'
  contentFocus: 'METRICS_HEAVY' | 'NARRATIVE_DRIVEN' | 'BALANCED'
  confidenceBuilding: 'GRADUAL' | 'INTENSIVE' | 'PRESSURE_SIMULATION'
}

export interface PlanningSessionPreferences {
  strategicDepth: 'HIGH_LEVEL' | 'DETAILED' | 'TACTICAL'
  collaborationStyle: 'FACILITATION' | 'PRESENTATION' | 'DISCUSSION_LEADERSHIP'
  timelineCommunication: 'CONSERVATIVE' | 'AGGRESSIVE' | 'REALISTIC'
  stakeholderManagement: 'CONSENSUS_BUILDING' | 'DECISION_DRIVING' | 'COMPROMISE_FACILITATION'
}

export interface StakeholderUpdatePreferences {
  communicationStyle: 'FORMAL' | 'CONVERSATIONAL' | 'INTERACTIVE'
  detailLevel: 'EXECUTIVE_SUMMARY' | 'COMPREHENSIVE' | 'AUDIENCE_ADAPTIVE'
  problemCommunication: 'SOLUTION_FOCUSED' | 'COMPREHENSIVE_ANALYSIS' | 'COLLABORATIVE'
  accountability: 'CLEAR_OWNERSHIP' | 'SHARED_RESPONSIBILITY' | 'ESCALATION_FOCUSED'
}

export interface CoachingSessionPreferences {
  coachingIntensity: 'GENTLE' | 'MODERATE' | 'INTENSIVE'
  feedbackFrequency: 'REAL_TIME' | 'POST_SESSION' | 'WEEKLY_SUMMARY'
  encouragementStyle: 'HIGH_SUPPORT' | 'BALANCED' | 'CHALLENGE_FOCUSED'
  practiceComplexity: 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED'
}

// System Configuration Types
export interface NotificationSettings {
  progressUpdates: boolean
  achievementAlerts: boolean
  reminderFrequency: 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  emailDigest: boolean
  mobilePush: boolean
}

export interface PrivacySettings {
  dataRetention: 'MINIMAL' | 'STANDARD' | 'EXTENDED'
  meetingRecordingConsent: boolean
  analyticsSharing: boolean
  benchmarkParticipation: boolean
  profileVisibility: 'PRIVATE' | 'ANONYMOUS' | 'PUBLIC'
}

export interface IntegrationSettings {
  calendarSync: boolean
  slackIntegration: boolean
  zoomIntegration: boolean
  teamsIntegration: boolean
  exportFormat: 'JSON' | 'CSV' | 'PDF'
}

export interface AccessibilitySettings {
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE'
  contrast: 'NORMAL' | 'HIGH' | 'MAXIMUM'
  reduceMotion: boolean
  screenReaderOptimization: boolean
  keyboardNavigation: boolean
}

// Intelligent Defaults System
export interface IntelligentDefaults {
  careerBasedDefaults: CareerBasedDefaults
  industryBasedDefaults: IndustryBasedDefaults
  learningStyleDefaults: LearningStyleDefaults
  adaptiveRecommendations: AdaptiveRecommendation[]
}

export interface CareerBasedDefaults {
  [key: string]: CareerDefaultConfiguration
}

export interface CareerDefaultConfiguration {
  learningPathFocus: string
  feedbackIntensity: 'GENTLE' | 'MODERATE' | 'INTENSIVE'
  frameworkEmphasis: string[]
  industryContextWeight: number
  practiceSessionLength: number
  difficultyProgression: 'GRADUAL' | 'ACCELERATED' | 'ADAPTIVE'
  reasoning: string
}

export interface IndustryBasedDefaults {
  [key: string]: IndustryDefaultConfiguration
}

export interface IndustryDefaultConfiguration {
  regulatoryFocus: 'LOW' | 'MEDIUM' | 'HIGH'
  complianceEmphasis: string[]
  stakeholderPriority: string[]
  reasoning: string
  specializations?: { [key: string]: any }
}

export interface LearningStyleDefaults {
  visual: LearningStyleConfiguration
  auditory: LearningStyleConfiguration
  kinesthetic: LearningStyleConfiguration
  readingWriting: LearningStyleConfiguration
}

export interface LearningStyleConfiguration {
  preferredExerciseTypes: string[]
  feedbackFormat: string
  practiceStructure: string
  progressVisualization: string
}

export interface AdaptiveRecommendation {
  setting: string
  currentValue: any
  recommendedValue: any
  reasoning: string
  impact: string
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
  category: 'CAREER_ADVANCEMENT' | 'SKILL_DEVELOPMENT' | 'EFFICIENCY' | 'ENGAGEMENT'
}

// Framework and Skill Types
export interface FrameworkPreference {
  framework: string
  proficiencyLevel: number // 1-10
  practiceFrequency: 'LOW' | 'MEDIUM' | 'HIGH'
  applicationContext: string[]
}

export interface CustomizationOptions {
  availableIndustries: string[]
  supportedTransitions: string[]
  frameworkLibrary: string[]
  meetingTypeOptions: string[]
  coachingPersonalities: string[]
}

export interface UserProfile {
  id: string
  currentRole: string
  targetRole: string
  industry: string
  experienceLevel: number
  competencyScores: { [key: string]: number }
  learningGoals: string[]
  lastActive: Date
}

// Settings View Types
export interface SettingsSection {
  id: string
  title: string
  description: string
  icon: string
  component: React.ComponentType<any>
  isActive: boolean
}

export interface SettingItem {
  key: string
  label: string
  description: string
  type: 'toggle' | 'select' | 'slider' | 'multiselect' | 'text'
  value: any
  options?: string[]
  range?: { min: number; max: number; step: number }
  validation?: (value: any) => boolean
  impact?: string
}

export interface SettingsValidation {
  isValid: boolean
  warnings: string[]
  recommendations: string[]
  compatibilityIssues: string[]
}