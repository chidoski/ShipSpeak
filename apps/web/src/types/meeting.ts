/**
 * Meeting Archive & Capture System Types
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 */

import { CompetencyCategory, PMCareerLevel, IndustryType } from './competency'

// =============================================================================
// MEETING CAPTURE PLATFORM INTEGRATION TYPES
// =============================================================================

export type CaptureMethod = 'ZOOM_BOT' | 'GOOGLE_MEET_EXTENSION' | 'TEAMS_APP' | 'MANUAL_UPLOAD'
export type ProcessingStatus = 'CAPTURING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type MeetingType = 'ONE_ON_ONE' | 'TEAM_STANDUP' | 'STAKEHOLDER_REVIEW' | 'BOARD_PRESENTATION' | 'CRISIS_COMMUNICATION' | 'CUSTOMER_MEETING' | 'SPEAKING_ENGAGEMENT'

export interface CapturedMeeting {
  id: string
  title: string
  participants: Participant[]
  captureMethod: CaptureMethod
  captureQuality: CaptureQuality
  processingStatus: ProcessingStatus
  competencyAnalysis: CompetencyAnalysis
  feedbackComplexity: 'PATTERN_BASED' | 'AI_ENHANCED' | 'FULL_AI_ANALYSIS'
  executivePriority: boolean
  industryContext: IndustryType
  meetingType: MeetingType
  privacy: PrivacySettings
  duration: number // minutes
  createdAt: string
  updatedAt: string
  userId: string
  transcript?: string
  audioQualityScore: number // 0-100
}

export interface Participant {
  id: string
  name: string
  email?: string
  role?: string
  speakingTime: number // percentage
  consentGiven: boolean
}

export interface CaptureQuality {
  audioLevel: number // 0-100
  speakerSeparation: number // 0-100 
  transcriptConfidence: number // 0-100
  platformMetadata: PlatformSpecificData
  noiseLevel: number // 0-100 (lower is better)
  latency: number // milliseconds
}

export interface PlatformSpecificData {
  platform: CaptureMethod
  meetingId?: string
  roomId?: string
  botDeploymentSuccess: boolean
  participantCount: number
  recordingPermissions: boolean[]
  platformVersion?: string
}

export interface PrivacySettings {
  confidential: boolean
  boardMeeting: boolean
  crisisMode: boolean
  speakingEngagement: boolean
  dataRetentionDays: number
  participantConsent: ConsentRecord[]
  encryptionLevel: 'STANDARD' | 'ENHANCED' | 'EXECUTIVE'
}

export interface ConsentRecord {
  participantId: string
  consentGiven: boolean
  timestamp: string
  ipAddress?: string
  consentMethod: 'PRE_MEETING' | 'IN_MEETING' | 'POST_MEETING'
}

// =============================================================================
// COMPETENCY ANALYSIS & PATTERN RECOGNITION TYPES
// =============================================================================

export interface CompetencyAnalysis {
  productSense: CompetencyScore
  communication: CompetencyScore
  stakeholderMgmt: CompetencyScore
  technicalTranslation: CompetencyScore
  businessImpact: CompetencyScore
  overallGrowth: GrowthVelocity
  executivePresenceMarkers: ExecutivePresenceMarkers
  frameworkUsage: FrameworkUsageDetection
}

export interface CompetencyScore {
  category: CompetencyCategory
  currentScore: number // 0-100
  previousScore?: number
  improvement: number
  confidenceLevel: number // 0-100
  patterns: DetectedPattern[]
  benchmarkComparison: BenchmarkComparison
  specificInsights: string[]
}

export interface DetectedPattern {
  type: PatternType
  frequency: number
  confidence: number // 0-100
  examples: string[]
  improvement: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
}

export type PatternType = 
  | 'ANSWER_FIRST_STRUCTURE'
  | 'FRAMEWORK_USAGE' 
  | 'STRATEGIC_LANGUAGE'
  | 'STAKEHOLDER_ADAPTATION'
  | 'TECHNICAL_TRANSLATION'
  | 'EXECUTIVE_PRESENCE'
  | 'CONFLICT_RESOLUTION'
  | 'DATA_DRIVEN_REASONING'
  | 'ROI_ARTICULATION'
  | 'USER_ADVOCACY'

export interface BenchmarkComparison {
  industryAverage: number
  careerLevelAverage: number
  topPerformers: number // Top 10%
  userPercentile: number
  faangBenchmarks: FANGBenchmarks
}

export interface FANGBenchmarks {
  amazon: number // LP adherence
  google: number // Data-driven
  meta: number // User-centric
  netflix: number // Context setting
}

export interface GrowthVelocity {
  monthlyImprovement: number
  projectedLevel: PMCareerLevel
  timeToNextLevel: number // months
  accelerationFactors: string[]
  riskFactors: string[]
}

export interface ExecutivePresenceMarkers {
  boardReadiness: number // 0-100
  crisisCommunication: number
  speakingEngagementQuality: number
  organizationalInfluence: number
  strategicVisionCommunication: number
}

export interface FrameworkUsageDetection {
  rice: FrameworkInstance[]
  ice: FrameworkInstance[]
  jobsToBeType: FrameworkInstance[]
  ogsm: FrameworkInstance[]
  custom: FrameworkInstance[]
}

export interface FrameworkInstance {
  framework: string
  usage: 'MENTIONED' | 'APPLIED' | 'MASTERED'
  contextAppropriate: boolean
  executionQuality: number // 0-100
  timestamp: string
}

// =============================================================================
// SMART FEEDBACK & COST OPTIMIZATION TYPES
// =============================================================================

export interface FeedbackRouting {
  complexity: 'PATTERN_BASED' | 'AI_ENHANCED' | 'FULL_AI_ANALYSIS'
  rationale: string
  costEstimate: number // USD
  processingTime: number // minutes
  userTier: 'FOUNDATION' | 'GROWTH' | 'EXECUTIVE'
  budgetRemaining: number
}

export interface PatternBasedFeedback {
  triggeredPatterns: string[]
  templateUsed: string
  customizations: string[]
  confidence: number // 0-100
  cost: number // Always 0
}

export interface AIEnhancedFeedback {
  baseTemplate: string
  aiEnhancements: string[]
  noveltyFactors: string[]
  confidence: number // 0-100
  cost: number // Low cost
}

export interface FullAIAnalysis {
  analysisDepth: 'STANDARD' | 'DEEP' | 'COMPREHENSIVE'
  executiveContext: boolean
  multiCompetencyIntegration: boolean
  customScenarioGeneration: boolean
  confidence: number // 0-100
  cost: number // High cost
}

// =============================================================================
// MEETING ARCHIVE FILTER & SEARCH TYPES
// =============================================================================

export interface MeetingArchiveFilters {
  dateRange: DateRange
  competencyFocus: CompetencyCategory[]
  meetingTypes: MeetingType[]
  captureMethod: CaptureMethod[]
  qualityThreshold: number
  executiveOnly: boolean
  industryContext: IndustryType[]
  participantCount: ParticipantRange
}

export interface DateRange {
  start: string // ISO date
  end: string // ISO date
}

export interface ParticipantRange {
  min: number
  max: number
}

export interface MeetingSearchResults {
  meetings: CapturedMeeting[]
  totalCount: number
  filteredCount: number
  aggregations: MeetingAggregations
  pagination: PaginationInfo
}

export interface MeetingAggregations {
  competencyTrends: CompetencyTrend[]
  patternFrequency: PatternFrequency[]
  qualityDistribution: QualityDistribution
  platformUsage: PlatformUsageStats
}

export interface CompetencyTrend {
  category: CompetencyCategory
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  changeRate: number
  dataPoints: TrendDataPoint[]
}

export interface TrendDataPoint {
  date: string
  score: number
  meetingId: string
}

export interface PatternFrequency {
  pattern: PatternType
  frequency: number
  lastSeen: string
  improvement: 'INCREASING' | 'STABLE' | 'DECREASING'
}

export interface QualityDistribution {
  excellent: number // 90-100
  good: number // 70-89
  fair: number // 50-69
  poor: number // 0-49
}

export interface PlatformUsageStats {
  zoomBot: number
  googleMeetExtension: number
  teamsApp: number
  manualUpload: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

// =============================================================================
// MEETING CAPTURE WORKFLOW TYPES
// =============================================================================

export interface CaptureWorkflowStage {
  stage: 'PRE_MEETING' | 'LIVE_MEETING' | 'POST_MEETING'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  progress: number // 0-100
  estimatedCompletion: string // ISO timestamp
  error?: string
}

export interface PreMeetingSetup {
  botScheduling: BotSchedulingStatus
  consentWorkflow: ConsentWorkflowStatus
  qualityPrecheck: QualityPrecheckStatus
}

export interface BotSchedulingStatus {
  calendarIntegration: boolean
  meetingDetected: boolean
  botDeployed: boolean
  platformCompatible: boolean
  error?: string
}

export interface ConsentWorkflowStatus {
  participantsNotified: boolean
  consentReceived: number
  consentPending: number
  recordingPermissions: boolean
  privacyCompliant: boolean
}

export interface QualityPrecheckStatus {
  audioSetup: boolean
  platformCompatibility: boolean
  networkStability: boolean
  botConnectivity: boolean
  estimatedQuality: number // 0-100
}

export interface LiveMeetingMonitoring {
  botStatus: 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING'
  audioQuality: number // 0-100
  participantDetection: number
  speakerSeparation: number // 0-100
  transcriptConfidence: number // 0-100
  latency: number // milliseconds
  warnings: MonitoringWarning[]
}

export interface MonitoringWarning {
  type: 'AUDIO_QUALITY' | 'SPEAKER_OVERLAP' | 'TRANSCRIPT_CONFIDENCE' | 'CONNECTIVITY'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message: string
  timestamp: string
  resolved: boolean
}