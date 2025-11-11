// Core onboarding and help system types

export type CareerTransitionType = 
  | 'PO_TO_PM'
  | 'PM_TO_SENIOR_PM' 
  | 'SENIOR_PM_TO_GROUP_PM'
  | 'GROUP_PM_TO_DIRECTOR'

export type Industry = 
  | 'HEALTHCARE'
  | 'CYBERSECURITY'
  | 'FINTECH'
  | 'ENTERPRISE'
  | 'CONSUMER'
  | 'ALL'

export type ExperienceLevel = 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export type UserRole = 'PO' | 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR' | 'VP_PRODUCT'

export interface UserProfile {
  id: string
  currentRole: UserRole
  targetRole: UserRole
  industry: Industry
  experience: ExperienceLevel
  careerTransition: CareerTransitionType
  completedOnboarding: boolean
  preferences: UserPreferences
}

export interface UserPreferences {
  tourSpeed: 'SLOW' | 'MEDIUM' | 'FAST'
  helpLevel: 'MINIMAL' | 'CONTEXTUAL' | 'COMPREHENSIVE'
  videoPreference: boolean
  skipIntros: boolean
}

// Onboarding Status and Progress
export interface OnboardingStatus {
  completionPercentage: number
  completedSections: string[]
  currentStep: OnboardingStep
  skipReasons: SkipReason[]
  adaptiveGuidance: AdaptiveGuidance[]
}

export interface OnboardingStep {
  id: string
  section: OnboardingSectionType
  title: string
  description: string
}

export type OnboardingSectionType = 
  | 'PROFILE_SETUP'
  | 'CAREER_TRANSITION' 
  | 'INDUSTRY_CONTEXT'
  | 'FEATURE_DISCOVERY'
  | 'FIRST_ACTIONS'

export interface SkipReason {
  stepId: string
  reason: 'TIME_CONSTRAINT' | 'ALREADY_FAMILIAR' | 'NOT_RELEVANT' | 'TECHNICAL_ISSUE'
  feedback?: string
}

export interface AdaptiveGuidance {
  type: 'CAREER_TIP' | 'FEATURE_HIGHLIGHT' | 'BEST_PRACTICE' | 'WARNING'
  message: string
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  actionable?: boolean
  dismissible?: boolean
}

// Tour System
export interface TourEngine {
  activeTour: Tour | null
  availableTours: Tour[]
  tourProgress: TourProgress
  contextualTriggers: ContextualTrigger[]
}

export interface Tour {
  id: string
  title: string
  description: string
  careerRelevance: CareerTransitionType | 'ALL_LEVELS'
  industryContext: Industry[]
  steps: TourStep[]
  estimatedDuration: number
  prerequisites: string[]
  completionRewards: string[]
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface TourStep {
  id: string
  title: string
  description: string
  targetElement: string
  actionRequired: boolean
  interactionType: 'HIGHLIGHT' | 'CLICK' | 'INPUT' | 'WAIT'
  explanation: string
  careerContext: string
  optional?: boolean
}

export interface TourProgress {
  tourId: string
  currentStepIndex: number
  startedAt: Date
  stepsCompleted: string[]
  timeSpent: number
}

export interface ContextualTrigger {
  id: string
  trigger: TriggerCondition
  tourId: string
  priority: number
  cooldownPeriod: number
  maxOccurrences?: number
}

export type TriggerCondition = 
  | 'FIRST_VISIT'
  | 'FEATURE_STRUGGLE'
  | 'MILESTONE_REACHED'
  | 'TIME_BASED'
  | 'BEHAVIOR_PATTERN'

// Help System
export interface HelpSystem {
  contextualHelp: ContextualHelp[]
  searchableGuides: HelpGuide[]
  videoTutorials: VideoTutorial[]
  interactiveWalkthrough: InteractiveWalkthrough[]
}

export interface ContextualHelp {
  id: string
  trigger: HelpTrigger
  helpContent: HelpContent
  careerRelevance: CareerTransitionType | 'ALL_LEVELS'
  industrySpecific: Industry[]
}

export type HelpTrigger = 
  | 'MEETING_UPLOAD_PAGE'
  | 'PRACTICE_MODULE_SELECTION'
  | 'ANALYSIS_RESULTS_VIEW'
  | 'DASHBOARD_CONFUSION'
  | 'SETTINGS_ACCESS'
  | 'ERROR_STATE'

export interface HelpContent {
  title: string
  quickTips: string[]
  detailedGuidance: string
  careerContext: string
  videoTutorial?: string
  interactiveGuide?: boolean
  relatedTopics?: string[]
}

export interface HelpGuide {
  id: string
  title: string
  category: HelpCategory
  content: string
  searchTags: string[]
  careerRelevance: CareerTransitionType[]
  industryRelevance: Industry[]
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  estimatedReadTime: number
}

export type HelpCategory = 
  | 'GETTING_STARTED'
  | 'MEETING_ANALYSIS'
  | 'PRACTICE_MODULES'
  | 'CAREER_DEVELOPMENT'
  | 'INDUSTRY_SPECIFIC'
  | 'TROUBLESHOOTING'
  | 'ADVANCED_FEATURES'

export interface VideoTutorial {
  id: string
  title: string
  duration: number
  careerRelevance: CareerTransitionType | 'ALL_LEVELS'
  industryContext: Industry | 'ALL'
  description: string
  keyTakeaways: string[]
  thumbnail?: string
  transcript?: string
  chaptersMarks?: ChapterMark[]
}

export interface ChapterMark {
  timestamp: number
  title: string
  description: string
}

export interface InteractiveWalkthrough {
  id: string
  title: string
  description: string
  steps: WalkthroughStep[]
  careerFocus: CareerTransitionType[]
  industryFocus: Industry[]
  estimatedDuration: number
  prerequisites: string[]
}

export interface WalkthroughStep {
  id: string
  title: string
  instruction: string
  targetElement?: string
  validationMethod: 'USER_CONFIRMATION' | 'ELEMENT_INTERACTION' | 'API_CHECK'
  hints: string[]
  careerExplanation: string
}

// Career-Specific Onboarding Data
export interface CareerTransitionOnboarding {
  transitionType: CareerTransitionType
  totalSteps: number
  estimatedDuration: string
  sections: OnboardingSection[]
  successMetrics: string[]
  commonChallenges: string[]
}

export interface OnboardingSection {
  id: string
  title: string
  steps: number
  description: string
  careerImpact: string
  requiredActions: string[]
  optionalActions: string[]
}

// Industry-Specific Tours
export interface IndustryTour {
  industryType: Industry
  tours: Tour[]
  industryContext: IndustryContext
}

export interface IndustryContext {
  keyTerms: string[]
  regulatoryFocus: string[]
  stakeholderTypes: string[]
  commonFrameworks: string[]
  careerPathways: string[]
}

// Analytics and Optimization
export interface OnboardingAnalytics {
  userId: string
  tourId?: string
  stepId?: string
  event: AnalyticsEvent
  timestamp: Date
  metadata?: Record<string, any>
}

export type AnalyticsEvent = 
  | 'ONBOARDING_STARTED'
  | 'SECTION_COMPLETED'
  | 'TOUR_STARTED'
  | 'TOUR_COMPLETED'
  | 'TOUR_ABANDONED'
  | 'HELP_ACCESSED'
  | 'STEP_SKIPPED'
  | 'ERROR_ENCOUNTERED'

// Mock Data Types
export interface MockOnboardingData {
  userProfiles: UserProfile[]
  onboardingFlows: Record<CareerTransitionType, CareerTransitionOnboarding>
  tours: Tour[]
  helpContent: ContextualHelp[]
  videoTutorials: VideoTutorial[]
  industryTours: IndustryTour[]
}

// Response and Feedback Types
export interface OnboardingFeedback {
  tourId: string
  stepId: string
  rating: number
  feedback: string
  suggestions?: string[]
  wouldRecommend: boolean
}

export interface TourOptimization {
  tourId: string
  completionRate: number
  averageTime: number
  dropoffPoints: string[]
  userSatisfaction: number
  improvementSuggestions: string[]
}