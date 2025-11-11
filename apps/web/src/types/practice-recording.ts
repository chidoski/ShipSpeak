// ShipSpeak Practice Recording Type Definitions
// Comprehensive TypeScript interfaces for executive-grade recording system

export interface ExerciseContext {
  id: string
  type: ExerciseType
  title: string
  description: string
  timeLimit: number
  difficulty: DifficultyLevel
  industryContext: IndustryType
  meetingType: MeetingType
  successCriteria: string[]
  frameworkPrompts: string[]
  stakeholderSimulation: boolean
}

export type ExerciseType = 
  | 'BOARD_PRESENTATION'
  | 'STAKEHOLDER_UPDATE' 
  | 'PLANNING_SESSION'
  | 'FRAMEWORK_PRACTICE'
  | 'EXECUTIVE_PRESENCE'

export type DifficultyLevel = 'FOUNDATION' | 'PRACTICE' | 'MASTERY' | 'EXPERT'

export type IndustryType = 
  | 'healthcare'
  | 'cybersecurity'
  | 'fintech'
  | 'enterprise'
  | 'consumer'

export type MeetingType = 
  | 'board_presentation'
  | 'planning_session'
  | 'stakeholder_update'
  | 'team_meeting'
  | 'customer_meeting'

export interface UserProfile {
  id: string
  currentRole: PMRole
  targetRole: PMRole
  industryExperience: IndustryType[]
  skillGaps: SkillArea[]
  coachingPreferences: CoachingPreferences
  recordingHistory: RecordingSession[]
}

export type PMRole = 
  | 'PO'
  | 'PM'
  | 'SENIOR_PM'
  | 'GROUP_PM'
  | 'DIRECTOR'
  | 'VP_PRODUCT'

export type SkillArea = 
  | 'STRATEGIC_THINKING'
  | 'EXECUTIVE_PRESENCE'
  | 'STAKEHOLDER_MANAGEMENT'
  | 'FRAMEWORK_APPLICATION'
  | 'COMMUNICATION_STRUCTURE'

export interface CoachingPreferences {
  realTimeHints: boolean
  coachingIntensity: CoachingIntensity
  frameworkReminders: boolean
  confidenceBuilding: boolean
  structureGuidance: boolean
}

export type CoachingIntensity = 'LOW' | 'MEDIUM' | 'HIGH'

export interface RecordingEngine {
  audioCapture: AudioCaptureSystem
  qualityMonitoring: AudioQualityTracker
  realTimeAnalysis: LiveAnalysisEngine
  progressTracking: RecordingProgressTracker
}

export interface AudioCaptureSystem {
  deviceDetection: MediaDeviceInfo[]
  qualityOptimization: AudioQualityOptimizer
  noiseReduction: NoiseReductionEngine
  recordingControls: RecordingControlInterface
  isRecording: boolean
  mediaStream: MediaStream | null
}

export interface AudioQualityTracker {
  currentQuality: AudioQuality
  qualityHistory: QualityMetric[]
  optimizationSuggestions: OptimizationSuggestion[]
  thresholds: QualityThresholds
}

export interface AudioQuality {
  clarity: number
  noiseLevel: number
  volume: number
  overall: QualityRating
  timestamp: Date
}

export type QualityRating = 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR'

export interface QualityMetric {
  timestamp: Date
  clarity: number
  noiseLevel: number
  volume: number
  rating: QualityRating
}

export interface OptimizationSuggestion {
  issue: AudioIssue
  suggestion: string
  impact: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export type AudioIssue = 
  | 'LOW_CLARITY'
  | 'BACKGROUND_NOISE'
  | 'LOW_VOLUME'
  | 'HIGH_VOLUME'
  | 'DEVICE_ISSUE'

export interface QualityThresholds {
  excellent: { clarity: number; noiseLevel: number; volume: number }
  good: { clarity: number; noiseLevel: number; volume: number }
  acceptable: { clarity: number; noiseLevel: number; volume: number }
  poor: { clarity: number; noiseLevel: number; volume: number }
}

export interface NoiseReductionEngine {
  enabled: boolean
  level: NoiseReductionLevel
  backgroundNoiseDetection: boolean
  adaptiveFiltering: boolean
}

export type NoiseReductionLevel = 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH' | 'AGGRESSIVE'

export interface RecordingControlInterface {
  isRecording: boolean
  isPaused: boolean
  duration: number
  startTime: Date | null
  pausedTime: number
  maxDuration: number
}

export interface LiveAnalysisEngine {
  transcriptionAccuracy: number
  communicationPatterns: LivePatternAnalysis
  frameworkDetection: LiveFrameworkRecognition
  executivePresenceTracking: LivePresenceAnalysis
  isAnalyzing: boolean
}

export interface LivePatternAnalysis {
  structureScore: number
  clarityScore: number
  confidenceScore: number
  frameworkUsage: string[]
  detectedPatterns: CommunicationPattern[]
}

export interface CommunicationPattern {
  pattern: PatternType
  confidence: number
  timestamp: Date
  context: string
  suggestion?: string
}

export type PatternType = 
  | 'ANSWER_FIRST'
  | 'FRAMEWORK_USAGE'
  | 'UNCERTAIN_LANGUAGE'
  | 'EXECUTIVE_STRUCTURE'
  | 'STAKEHOLDER_ADAPTATION'

export interface LiveFrameworkRecognition {
  detectedFrameworks: FrameworkUsage[]
  suggestedFrameworks: FrameworkSuggestion[]
  accuracyScore: number
}

export interface FrameworkUsage {
  framework: PMFramework
  confidence: number
  context: string
  completeness: number
}

export type PMFramework = 
  | 'RICE'
  | 'ICE'
  | 'JOBS_TO_BE_DONE'
  | 'OKR'
  | 'SCRUM'
  | 'LEAN'

export interface FrameworkSuggestion {
  framework: PMFramework
  relevance: number
  trigger: string
  guidance: string
}

export interface LivePresenceAnalysis {
  authorityScore: number
  clarityScore: number
  convictionScore: number
  composureScore: number
  overallPresence: number
}

export interface RecordingProgressTracker {
  elapsedTime: number
  remainingTime: number
  progressPercentage: number
  milestones: ProgressMilestone[]
  pacing: PacingAnalysis
}

export interface ProgressMilestone {
  name: string
  timeTarget: number
  achieved: boolean
  timestamp?: Date
}

export interface PacingAnalysis {
  currentPace: PacingRating
  recommendedAdjustment: PacingAdjustment
  timeAllocation: TimeAllocation[]
}

export type PacingRating = 'TOO_FAST' | 'GOOD' | 'TOO_SLOW'

export interface PacingAdjustment {
  direction: 'SPEED_UP' | 'SLOW_DOWN' | 'MAINTAIN'
  intensity: 'SLIGHT' | 'MODERATE' | 'SIGNIFICANT'
  reason: string
}

export interface TimeAllocation {
  phase: string
  allocatedTime: number
  actualTime: number
  efficiency: number
}

export interface RealTimeCoaching {
  liveTranscription: LiveTranscriptionEngine
  patternRecognition: LivePatternDetection
  coachingPrompts: RealTimePromptSystem
  encouragementEngine: MotivationSystem
}

export interface LiveTranscriptionEngine {
  isTranscribing: boolean
  currentText: string
  confidence: number
  wordCount: number
  speakingRate: number
}

export interface LivePatternDetection {
  activePatterns: CommunicationPattern[]
  triggerPhrases: TriggerPhrase[]
  contextAnalysis: ContextAnalysis
}

export interface TriggerPhrase {
  phrase: string
  pattern: PatternType
  action: CoachingAction
  careerRelevance: string
}

export interface ContextAnalysis {
  currentContext: ExercisePhase
  stakeholderFocus: string[]
  communicationGoals: string[]
  timeContext: TimeContext
}

export type ExercisePhase = 
  | 'OPENING'
  | 'MAIN_CONTENT'
  | 'FRAMEWORK_APPLICATION'
  | 'CONCLUSION'
  | 'Q_AND_A'

export interface TimeContext {
  phase: ExercisePhase
  timeRemaining: number
  suggestedTransition: string
}

export interface RealTimePromptSystem {
  contextualHints: ContextualHint[]
  frameworkReminders: FrameworkPrompt[]
  structureGuidance: StructurePrompt[]
  confidenceBuilding: EncouragementPrompt[]
  isActive: boolean
}

export interface ContextualHint {
  id: string
  type: PromptType
  message: string
  timing: PromptTiming
  urgency: PromptUrgency
  careerRelevance: string
  triggerCondition: string
}

export type PromptType = 
  | 'FRAMEWORK_REMINDER'
  | 'STRUCTURE_GUIDANCE'
  | 'CONFIDENCE_BUILDING'
  | 'TIME_MANAGEMENT'
  | 'STAKEHOLDER_ADAPTATION'

export type PromptTiming = 
  | 'IMMEDIATE'
  | 'AFTER_PAUSE'
  | 'AFTER_COMPLETION'
  | 'ON_TRIGGER'

export type PromptUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface FrameworkPrompt {
  framework: PMFramework
  context: string
  guidance: string
  application: string
}

export interface StructurePrompt {
  structure: CommunicationStructure
  guidance: string
  example: string
}

export type CommunicationStructure = 
  | 'ANSWER_FIRST'
  | 'PYRAMID_PRINCIPLE'
  | 'SITUATION_COMPLICATION_RESOLUTION'
  | 'PROBLEM_SOLUTION_BENEFIT'

export interface EncouragementPrompt {
  message: string
  trigger: EncouragementTrigger
  timing: PromptTiming
  personalizedContext: string
}

export type EncouragementTrigger = 
  | 'LONG_PAUSE'
  | 'UNCERTAIN_LANGUAGE'
  | 'LOW_CONFIDENCE'
  | 'GOOD_FRAMEWORK_USAGE'
  | 'MILESTONE_REACHED'

export interface MotivationSystem {
  currentEncouragement: EncouragementState
  motivationHistory: MotivationEvent[]
  personalizedMessages: PersonalizedMessage[]
}

export interface EncouragementState {
  level: MotivationLevel
  lastEncouragement: Date
  consecutivePositive: number
  totalEncouragements: number
}

export type MotivationLevel = 'NEEDS_SUPPORT' | 'NEUTRAL' | 'CONFIDENT' | 'HIGHLY_MOTIVATED'

export interface MotivationEvent {
  timestamp: Date
  trigger: EncouragementTrigger
  message: string
  impact: MotivationImpact
}

export type MotivationImpact = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'

export interface PersonalizedMessage {
  context: string
  message: string
  careerPhase: PMRole
  industryContext: IndustryType
}

export interface RecordingSession {
  id: string
  exerciseId: string
  userId: string
  startTime: Date
  endTime?: Date
  duration: number
  status: RecordingStatus
  audioQualityMetrics: AudioQuality[]
  transcription: TranscriptionResult
  analysisResults?: SessionAnalysis
  coachingEvents: CoachingEvent[]
}

export type RecordingStatus = 
  | 'SETUP'
  | 'RECORDING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'ANALYZING'

export interface TranscriptionResult {
  fullText: string
  wordTimestamps: WordTimestamp[]
  confidence: number
  speakingRate: number
  pauseAnalysis: PauseAnalysis
}

export interface WordTimestamp {
  word: string
  startTime: number
  endTime: number
  confidence: number
}

export interface PauseAnalysis {
  totalPauses: number
  averagePauseLength: number
  strategicPauses: number
  fillerWords: number
}

export interface SessionAnalysis {
  overallScore: number
  communicationPatterns: PatternAnalysisResult[]
  frameworkUsage: FrameworkAnalysisResult[]
  executivePresence: PresenceAnalysisResult
  improvementAreas: ImprovementArea[]
  strengths: StrengthArea[]
}

export interface PatternAnalysisResult {
  pattern: PatternType
  frequency: number
  effectiveness: number
  examples: PatternExample[]
}

export interface PatternExample {
  text: string
  timestamp: number
  score: number
  feedback: string
}

export interface FrameworkAnalysisResult {
  framework: PMFramework
  usage: number
  accuracy: number
  completeness: number
  contextualFit: number
}

export interface PresenceAnalysisResult {
  authority: PresenceScore
  clarity: PresenceScore
  conviction: PresenceScore
  composure: PresenceScore
  overall: number
}

export interface PresenceScore {
  score: number
  indicators: PresenceIndicator[]
  improvementSuggestions: string[]
}

export interface PresenceIndicator {
  indicator: string
  presence: boolean
  impact: number
  examples: string[]
}

export interface ImprovementArea {
  area: SkillArea
  currentLevel: number
  targetLevel: number
  specificFeedback: string
  practiceRecommendations: string[]
}

export interface StrengthArea {
  area: SkillArea
  level: number
  evidence: string[]
  leverageOpportunities: string[]
}

export interface CoachingEvent {
  id: string
  timestamp: Date
  type: PromptType
  trigger: string
  message: string
  userResponse?: string
  effectiveness: CoachingEffectiveness
}

export type CoachingEffectiveness = 'VERY_HELPFUL' | 'HELPFUL' | 'NEUTRAL' | 'DISTRACTING'

export interface AudioQualityOptimizer {
  currentSettings: AudioSettings
  recommendedSettings: AudioSettings
  optimizationHistory: OptimizationAction[]
  deviceCapabilities: DeviceCapabilities
}

export interface AudioSettings {
  sampleRate: number
  bitDepth: number
  channels: number
  gainLevel: number
  noiseReduction: NoiseReductionLevel
}

export interface OptimizationAction {
  timestamp: Date
  action: string
  reason: string
  impact: QualityImpact
}

export type QualityImpact = 'SIGNIFICANT' | 'MODERATE' | 'MINIMAL' | 'NONE'

export interface DeviceCapabilities {
  maxSampleRate: number
  supportedFormats: string[]
  hasNoiseReduction: boolean
  hasEchoCancellation: boolean
  hasAutoGainControl: boolean
}