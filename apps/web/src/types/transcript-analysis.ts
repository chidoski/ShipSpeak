/**
 * Intelligent Transcript Analysis & Communication Pattern Discovery Types
 * ShipSpeak Slice 5: PM-Specific Pattern Detection & Career Progression Insights
 */

import { PMCareerLevel, IndustryType, CompetencyCategory } from './competency'
import { MeetingType } from './meeting'

// =============================================================================
// CORE TRANSCRIPT ANALYSIS TYPES
// =============================================================================

export interface MeetingTranscript {
  id: string
  content: string
  speakers: SpeakerIdentification[]
  duration: number
  meetingType: MeetingType
  timestamp: Date
  audioQuality: QualityMetrics
  segmentedContent: TranscriptSegment[]
  processingStatus: AnalysisStatus
}

export interface SpeakerIdentification {
  id: string
  name: string
  role?: string
  speakingDuration: number // seconds
  wordCount: number
  confidence: number // 0-100
  segments: SpeakerSegment[]
}

export interface SpeakerSegment {
  startTime: number // seconds
  endTime: number
  content: string
  confidence: number
  patterns: DetectedPatternInstance[]
}

export interface TranscriptSegment {
  id: string
  startTime: number
  endTime: number
  speaker: string
  content: string
  analysisResult?: SegmentAnalysis
}

export interface QualityMetrics {
  transcriptConfidence: number // 0-100
  speakerSeparationQuality: number // 0-100
  audioClarity: number // 0-100
  backgroundNoise: number // 0-100 (lower better)
  completeness: number // 0-100
}

export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PARTIAL'

// =============================================================================
// PM CAREER TRANSITION PATTERN DETECTION
// =============================================================================

export interface PMTransitionDetection {
  currentLevel: PMCareerLevel
  targetLevel: PMCareerLevel
  transitionIndicators: TransitionMarkers
  progressScore: number // 0-100
  blockers: TransitionBlocker[]
  accelerators: TransitionAccelerator[]
}

export interface TransitionMarkers {
  poToPM: POToPMMarkers
  pmToSeniorPM: PMToSeniorPMMarkers
  seniorPMToGroupPM: SeniorPMToGroupPMMarkers
  groupPMToDirector: GroupPMToDirectorMarkers
}

export interface POToPMMarkers {
  strategicLanguageEmergence: PatternDetection
  businessImpactReasoning: PatternDetection
  stakeholderCommunicationEvolution: PatternDetection
  decisionFrameworkApplication: PatternDetection
  deliveryToOutcomesShift: PatternDetection
}

export interface PMToSeniorPMMarkers {
  executiveCommunicationStructure: PatternDetection
  tradeoffArticulationSophistication: PatternDetection
  influenceWithoutAuthority: PatternDetection
  strategicAltitudeControl: PatternDetection
  frameworkMastery: PatternDetection
}

export interface SeniorPMToGroupPMMarkers {
  portfolioThinkingLanguage: PatternDetection
  coachingCommunicationEmergence: PatternDetection
  organizationalImpactAwareness: PatternDetection
  resourceAllocationReasoning: PatternDetection
  crossProductStrategy: PatternDetection
}

export interface GroupPMToDirectorMarkers {
  boardPresentationReadiness: PatternDetection
  businessModelFluency: PatternDetection
  marketStrategyCommunication: PatternDetection
  organizationalLeadership: PatternDetection
  visionCommunication: PatternDetection
}

export interface PatternDetection {
  detected: boolean
  confidence: number // 0-100
  frequency: number
  examples: PatternExample[]
  improvement: 'STRONG' | 'EMERGING' | 'WEAK' | 'ABSENT'
  benchmarkComparison: number // vs career level expectations
}

export interface PatternExample {
  text: string
  timestamp: number
  context: string
  strength: number // 0-100
}

export interface TransitionBlocker {
  type: BlockerType
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  examples: string[]
  actionableSteps: string[]
}

export interface TransitionAccelerator {
  type: AcceleratorType
  strength: 'MINOR' | 'MODERATE' | 'STRONG' | 'EXCEPTIONAL'
  description: string
  examples: string[]
  leverageOpportunities: string[]
}

export type BlockerType = 
  | 'TECHNICAL_LANGUAGE_OVERUSE'
  | 'ANSWER_LAST_STRUCTURE'
  | 'FEATURE_FOCUSED_THINKING'
  | 'DEFENSIVE_COMMUNICATION'
  | 'STAKEHOLDER_MISALIGNMENT'
  | 'FRAMEWORK_ABSENCE'
  | 'BUSINESS_IMPACT_WEAKNESS'

export type AcceleratorType = 
  | 'EXECUTIVE_PRESENCE'
  | 'STRATEGIC_THINKING'
  | 'STAKEHOLDER_MANAGEMENT' 
  | 'FRAMEWORK_MASTERY'
  | 'INFLUENCE_SKILLS'
  | 'COMMUNICATION_CLARITY'
  | 'BUSINESS_ACUMEN'

// =============================================================================
// INDUSTRY-SPECIFIC PATTERN ANALYSIS
// =============================================================================

export interface IndustryPatternAnalysis {
  industryType: IndustryType
  industrySpecificMarkers: IndustryMarkers
  compliancePatterns: CompliancePattern[]
  vocabularyFluency: VocabularyFluency
  benchmarkComparison: IndustryBenchmarkComparison
}

export interface IndustryMarkers {
  healthcare?: HealthcareMarkers
  cybersecurity?: CybersecurityMarkers
  fintech?: FintechMarkers
  enterprise?: EnterpriseMarkers
  consumer?: ConsumerMarkers
}

export interface HealthcareMarkers {
  regulatoryLanguageProficiency: PatternDetection
  patientOutcomePrioritization: PatternDetection
  evidenceBasedReasoning: PatternDetection
  complianceFrameworkUsage: PatternDetection
  clinicalEvidenceIntegration: PatternDetection
}

export interface CybersecurityMarkers {
  riskCommunicationEffectiveness: PatternDetection
  technicalTranslationCompetency: PatternDetection
  complianceFrameworkIntegration: PatternDetection
  zeroTrustArchitecture: PatternDetection
  threatAssessmentArticulation: PatternDetection
}

export interface FintechMarkers {
  regulatoryComplianceCommunication: PatternDetection
  riskManagementIntegration: PatternDetection
  trustBuildingLanguage: PatternDetection
  auditReadiness: PatternDetection
  financialImpactArticulation: PatternDetection
}

export interface EnterpriseMarkers {
  roiCommunicationCompetency: PatternDetection
  implementationPlanning: PatternDetection
  customerAdvocacyDevelopment: PatternDetection
  enterpriseSalesSupport: PatternDetection
  changeManagementCommunication: PatternDetection
}

export interface ConsumerMarkers {
  userExperienceCommunication: PatternDetection
  growthMetricsFluency: PatternDetection
  rapidIterationFramework: PatternDetection
  platformThinking: PatternDetection
  behavioralPsychologyIntegration: PatternDetection
}

export interface CompliancePattern {
  frameworkType: string
  adherenceLevel: number // 0-100
  riskAreas: string[]
  strengthAreas: string[]
}

export interface VocabularyFluency {
  industryTermsUsage: number // 0-100
  contextualAppropriateness: number // 0-100
  sophisticationLevel: number // 0-100
  professionalCredibility: number // 0-100
}

export interface IndustryBenchmarkComparison {
  industryAverage: number
  topPerformers: number
  userPercentile: number
  competitivePosition: 'LEADING' | 'COMPETITIVE' | 'DEVELOPING' | 'CONCERNING'
}

// =============================================================================
// MEETING TYPE EFFECTIVENESS ANALYSIS
// =============================================================================

export interface MeetingTypeAnalysis {
  meetingType: MeetingType
  effectivenessScore: number // 0-100
  communicationPatterns: MeetingCommunicationPatterns
  audienceAdaptation: AudienceAdaptation
  contextualAppropriate: boolean
}

export interface MeetingCommunicationPatterns {
  boardPresentation?: BoardPresentationPatterns
  planningSession?: PlanningSessionPatterns
  stakeholderUpdate?: StakeholderUpdatePatterns
  oneOnOne?: OneOnOnePatterns
  teamStandup?: TeamStandupPatterns
  crisisCommunication?: CrisisCommunicationPatterns
}

export interface BoardPresentationPatterns {
  executiveSummaryStructure: PatternDetection
  metricsFocus: PatternDetection
  confidenceIndicators: PatternDetection
  strategicNarrative: PatternDetection
  timeManagement: PatternDetection
}

export interface PlanningSessionPatterns {
  strategicAltitudeCommunication: PatternDetection
  resourceReasoning: PatternDetection
  timelineCommunication: PatternDetection
  crossFunctionalCoordination: PatternDetection
  riskAssessment: PatternDetection
}

export interface StakeholderUpdatePatterns {
  progressClarity: PatternDetection
  blockerCommunication: PatternDetection
  executiveReporting: PatternDetection
  successMetricIntegration: PatternDetection
  actionOrientation: PatternDetection
}

export interface OneOnOnePatterns {
  relationshipBuilding: PatternDetection
  careerDevelopment: PatternDetection
  feedbackDelivery: PatternDetection
  goalAlignment: PatternDetection
  supportProvision: PatternDetection
}

export interface TeamStandupPatterns {
  coordinationEffectiveness: PatternDetection
  blockerIdentification: PatternDetection
  priorityAlignment: PatternDetection
  teamMotivation: PatternDetection
  efficiencyMaintenance: PatternDetection
}

export interface CrisisCommunicationPatterns {
  calmnessProjection: PatternDetection
  clarityUnderPressure: PatternDetection
  stakeholderReassurance: PatternDetection
  actionablePlanning: PatternDetection
  transparencyBalance: PatternDetection
}

export interface AudienceAdaptation {
  executiveAudience: number // 0-100
  technicalAudience: number // 0-100
  businessStakeholders: number // 0-100
  customerFacing: number // 0-100
  teamMembers: number // 0-100
}

// =============================================================================
// COMPREHENSIVE ANALYSIS RESULTS
// =============================================================================

export interface TranscriptAnalysisResults {
  overallScore: number // 0-100
  analysisId: string
  meetingId: string
  timestamp: Date
  processingTime: number // milliseconds
  
  // Core Analysis Components
  transitionAnalysis: PMTransitionDetection
  industryAnalysis: IndustryPatternAnalysis
  meetingTypeAnalysis: MeetingTypeAnalysis
  
  // Key Insights
  patternHighlights: PatternHighlight[]
  improvementAreas: ImprovementArea[]
  strengthAreas: StrengthArea[]
  careerProgressionInsights: ProgressionInsight[]
  
  // Actionable Recommendations
  immediateActions: ActionableRecommendation[]
  practiceModuleRecommendations: ModuleRecommendation[]
  
  // Benchmark Comparisons
  peerComparison: PeerBenchmarkComparison
  historicalProgress: HistoricalProgressComparison
}

export interface PatternHighlight {
  pattern: string
  score: number // 0-100
  evidence: string[]
  significance: 'HIGH' | 'MEDIUM' | 'LOW'
  careerImpact: string
}

export interface ImprovementArea {
  competency: CompetencyCategory
  currentLevel: number // 0-100
  targetLevel: number // 0-100
  gap: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  specificFocus: string
  examples: string[]
  practiceModules: string[]
}

export interface StrengthArea {
  competency: CompetencyCategory
  currentLevel: number // 0-100
  benchmarkComparison: number
  leverageOpportunities: string[]
  examples: string[]
}

export interface ProgressionInsight {
  transitionType: string
  readinessScore: number // 0-100
  timeToTarget: number // months
  keyMilestones: string[]
  criticalActions: string[]
}

export interface ActionableRecommendation {
  category: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
  action: string
  rationale: string
  expectedImpact: string
  effort: 'LOW' | 'MEDIUM' | 'HIGH'
  timeframe: string
}

export interface ModuleRecommendation {
  moduleType: string
  difficulty: 'FOUNDATION' | 'PRACTICE' | 'MASTERY'
  priority: number // 1-10
  focusArea: string
  expectedOutcome: string
}

export interface PeerBenchmarkComparison {
  overallPercentile: number
  careerLevelPercentile: number
  industryPercentile: number
  strengths: string[]
  opportunities: string[]
}

export interface HistoricalProgressComparison {
  improvementRate: number // % per month
  consistencyScore: number // 0-100
  trajectoryDirection: 'ACCELERATING' | 'STEADY' | 'PLATEAUING' | 'DECLINING'
  keyMilestones: HistoricalMilestone[]
}

export interface HistoricalMilestone {
  date: string
  achievement: string
  score: number
  significance: string
}

// =============================================================================
// ANALYSIS CONFIGURATION & PROCESSING
// =============================================================================

export interface AnalysisConfiguration {
  analysisDepth: 'QUICK' | 'STANDARD' | 'COMPREHENSIVE'
  focusAreas: CompetencyCategory[]
  industryContext: IndustryType
  careerGoals: PMCareerLevel
  benchmarkLevel: 'INDUSTRY' | 'CAREER_LEVEL' | 'TOP_PERFORMERS'
  includeHistoricalComparison: boolean
  generatePracticeModules: boolean
}

export interface AnalysisProgress {
  stage: AnalysisStage
  progress: number // 0-100
  estimatedTimeRemaining: number // seconds
  currentTask: string
  error?: string
}

export type AnalysisStage = 
  | 'TRANSCRIPT_PREPROCESSING'
  | 'SPEAKER_IDENTIFICATION'
  | 'PATTERN_DETECTION'
  | 'INDUSTRY_ANALYSIS'
  | 'TRANSITION_ANALYSIS'
  | 'BENCHMARK_COMPARISON'
  | 'INSIGHT_GENERATION'
  | 'RECOMMENDATION_CREATION'
  | 'FINALIZATION'

// =============================================================================
// SEGMENT-LEVEL ANALYSIS
// =============================================================================

export interface SegmentAnalysis {
  segmentId: string
  speaker: string
  analysisScore: number // 0-100
  detectedPatterns: DetectedPatternInstance[]
  communicationMarkers: CommunicationMarker[]
  improvementOpportunities: SegmentImprovement[]
}

export interface DetectedPatternInstance {
  patternType: string
  confidence: number // 0-100
  startPosition: number
  endPosition: number
  textSpan: string
  context: string
  qualityScore: number // 0-100
}

export interface CommunicationMarker {
  type: 'EXECUTIVE_PRESENCE' | 'STRATEGIC_THINKING' | 'FRAMEWORK_USAGE' | 'STAKEHOLDER_ADAPTATION'
  strength: number // 0-100
  evidence: string
  careerLevelAppropriate: boolean
}

export interface SegmentImprovement {
  focus: string
  currentText: string
  suggestedImprovement: string
  rationale: string
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW'
}