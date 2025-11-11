/**
 * ShipSpeak Module Content & Exercise Structure - TypeScript Type Definitions
 * Advanced exercise system with PM-specific scenarios and progressive difficulty
 */

import { Industry, PMRole, PMTransitionType, DifficultyLevel, PMFramework, CompanySize, MeetingType, StakeholderLevel } from './modules'

export interface ModuleContentProps {
  module: PracticeModule
  userProfile: UserProfile
  exerciseEngine: ExerciseEngine
  progressTracking: ProgressTracker
}

export interface ExerciseEngine {
  exerciseType: ExerciseType
  difficultyLevel: DifficultyLevel
  scenarioGenerator: ScenarioGenerator
  responseEvaluator: ResponseEvaluator
  adaptiveFeedback: AdaptiveFeedback
}

export interface ExerciseScenario {
  id: string
  title: string
  context: ScenarioContext
  stakeholders: Stakeholder[]
  objectives: LearningObjective[]
  constraints: ScenarioConstraint[]
  successCriteria: SuccessCriteria[]
  timeLimit?: number
  difficulty: DifficultyLevel
  careerRelevance: PMTransitionType[]
  industryContext: Industry[]
}

export interface ScenarioContext {
  industryContext: Industry
  companySize: CompanySize
  productContext: ProductContext
  marketConditions: MarketConditions
  organizationalPolitics: PoliticalComplexity
  timeline: string
  situation: string
  urgencyLevel: UrgencyLevel
}

export interface ProductContext {
  productType: 'B2B' | 'B2C' | 'B2B2C' | 'PLATFORM' | 'MARKETPLACE'
  productStage: 'IDEATION' | 'MVP' | 'GROWTH' | 'MATURITY' | 'DECLINE'
  userBase: string
  revenue: string
  complexity: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface MarketConditions {
  competitiveIntensity: 'LOW' | 'MEDIUM' | 'HIGH'
  growthRate: 'DECLINING' | 'STABLE' | 'GROWING' | 'HYPERGROWTH'
  disruption: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
  regulatoryPressure: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface PoliticalComplexity {
  level: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'HIGHLY_COMPLEX'
  keyPlayers: string[]
  conflictAreas: string[]
  powerDynamics: string[]
}

export interface Stakeholder {
  role: string
  level: StakeholderLevel
  name: string
  motivation: string[]
  concerns: string[]
  influence: 'LOW' | 'MEDIUM' | 'HIGH'
  alignment: 'ALIGNED' | 'NEUTRAL' | 'OPPOSED'
  communicationStyle: CommunicationStyle
}

export interface CommunicationStyle {
  preference: 'DATA_DRIVEN' | 'NARRATIVE' | 'VISUAL' | 'DETAIL_ORIENTED' | 'BIG_PICTURE'
  attention: 'SHORT' | 'MEDIUM' | 'LONG'
  decisionStyle: 'QUICK' | 'DELIBERATE' | 'CONSENSUS'
  expertise: 'TECHNICAL' | 'BUSINESS' | 'BOTH' | 'DOMAIN_SPECIFIC'
}

export interface LearningObjective {
  id: string
  description: string
  skillArea: string
  proficiencyTarget: number
  assessmentCriteria: string[]
  careerImpact: string
  timeToMaster: string
}

export interface ScenarioConstraint {
  type: 'TIME' | 'BUDGET' | 'RESOURCE' | 'REGULATORY' | 'TECHNICAL' | 'POLITICAL'
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  workaround?: string
}

export interface SuccessCriteria {
  criterion: string
  weight: number
  measurement: string
  threshold: number
  examples: string[]
}

export interface ExerciseResponse {
  userResponse: string
  responseStructure: ResponseStructure
  frameworkUsage: FrameworkUsage[]
  communicationEffectiveness: EffectivenessMetrics
  improvementSuggestions: ImprovementSuggestion[]
  submittedAt: Date
  duration: number
}

export interface ResponseStructure {
  hasAnswerFirst: boolean
  logicalFlow: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  clarity: number
  conciseness: number
  completeness: number
  stakeholderAdaptation: number
}

export interface FrameworkUsage {
  framework: PMFramework
  correctlyApplied: boolean
  appropriatenessScore: number
  missingElements: string[]
  suggestions: string[]
}

export interface EffectivenessMetrics {
  overallScore: number
  executivePresence: number
  persuasiveness: number
  clarity: number
  confidence: number
  stakeholderResonance: number
}

export interface ImprovementSuggestion {
  area: ImprovementArea
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  specificExample: string
  practiceRecommendation: string
  timeToImprove: string
}

export interface ResponseEvaluation {
  overallScore: number
  structureScore: number
  contentScore: number
  stakeholderAdaptation: number
  frameworkApplication: number
  executivePresence: number
  detailedFeedback: DetailedFeedback
  nextSteps: NextStep[]
}

export interface DetailedFeedback {
  strengths: string[]
  improvementAreas: string[]
  specificSuggestions: string[]
  exampleImprovements: ExampleImprovement[]
}

export interface ExampleImprovement {
  original: string
  improved: string
  reasoning: string
  impact: string
}

export interface NextStep {
  action: string
  priority: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
  description: string
  resources: string[]
}

export interface ScenarioGenerator {
  industryScenarios: IndustryScenarioBank
  careerTransitionScenarios: CareerTransitionScenarios
  meetingTypeScenarios: MeetingTypeScenarios
  adaptiveBuilder: AdaptiveScenarioBuilder
}

export interface IndustryScenarioBank {
  industry: Industry
  scenarios: ExerciseScenario[]
  commonChallenges: string[]
  keyFrameworks: PMFramework[]
  stakeholderPatterns: StakeholderPattern[]
}

export interface StakeholderPattern {
  industry: Industry
  typicalRoles: string[]
  communicationPreferences: CommunicationStyle[]
  decisionFactors: string[]
  commonConcerns: string[]
}

export interface CareerTransitionScenarios {
  transitionType: PMTransitionType
  scenarios: ExerciseScenario[]
  skillFocus: string[]
  progressionMetrics: ProgressionMetric[]
}

export interface ProgressionMetric {
  skill: string
  currentLevel: number
  targetLevel: number
  measurementCriteria: string[]
}

export interface MeetingTypeScenarios {
  meetingType: MeetingType
  scenarios: ExerciseScenario[]
  communicationPatterns: CommunicationPattern[]
  successFactors: string[]
}

export interface CommunicationPattern {
  pattern: string
  description: string
  appropriateUse: string[]
  commonMistakes: string[]
  examples: string[]
}

export interface AdaptiveScenarioBuilder {
  userProgress: UserProgress
  skillGaps: SkillGap[]
  recentPerformance: PerformanceMetric[]
  adaptationRules: AdaptationRule[]
}

export interface UserProgress {
  completedScenarios: string[]
  skillLevels: SkillLevel[]
  recentScores: ScoreHistory[]
  preferredDifficulty: DifficultyLevel
  learningVelocity: number
}

export interface SkillLevel {
  skill: string
  level: number
  confidence: number
  lastAssessed: Date
  trajectory: 'IMPROVING' | 'STABLE' | 'DECLINING'
}

export interface ScoreHistory {
  scenarioId: string
  score: number
  date: Date
  skillsAssessed: string[]
  improvement: number
}

export interface PerformanceMetric {
  metric: string
  value: number
  trend: 'UP' | 'STABLE' | 'DOWN'
  period: string
}

export interface AdaptationRule {
  condition: AdaptationCondition
  action: AdaptationAction
  priority: number
  description: string
}

export interface AdaptationCondition {
  type: 'SCORE_THRESHOLD' | 'SKILL_GAP' | 'TIME_CONSTRAINT' | 'USER_PREFERENCE'
  threshold?: number
  skill?: string
  comparison: 'ABOVE' | 'BELOW' | 'EQUAL'
}

export interface AdaptationAction {
  type: 'INCREASE_DIFFICULTY' | 'DECREASE_DIFFICULTY' | 'FOCUS_SKILL' | 'CHANGE_SCENARIO_TYPE'
  parameter?: string
  value?: number
}

export interface ResponseEvaluator {
  structureAnalyzer: StructureAnalyzer
  frameworkEvaluator: FrameworkEvaluator
  stakeholderAdaptation: StakeholderAdaptationAnalyzer
  executivePresenceScorer: ExecutivePresenceScorer
}

export interface StructureAnalyzer {
  analyzeStructure: (response: string) => StructureAnalysis
  identifyPatterns: (response: string) => CommunicationPattern[]
  scoreClarity: (response: string) => number
  assessLogicalFlow: (response: string) => LogicalFlowAssessment
}

export interface StructureAnalysis {
  hasIntroduction: boolean
  hasConclusion: boolean
  logicalProgression: boolean
  clearTransitions: boolean
  appropriateLength: boolean
  answerFirstUsed: boolean
}

export interface LogicalFlowAssessment {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export interface FrameworkEvaluator {
  detectFrameworks: (response: string) => PMFramework[]
  evaluateUsage: (framework: PMFramework, response: string) => FrameworkEvaluation
  suggestFrameworks: (scenario: ExerciseScenario) => FrameworkSuggestion[]
}

export interface FrameworkEvaluation {
  framework: PMFramework
  correctlyIdentified: boolean
  appropriatelyApplied: boolean
  completenessScore: number
  missingElements: string[]
  improvementSuggestions: string[]
}

export interface FrameworkSuggestion {
  framework: PMFramework
  relevanceScore: number
  reasoning: string
  applicationExample: string
}

export interface StakeholderAdaptationAnalyzer {
  analyzeAdaptation: (response: string, stakeholders: Stakeholder[]) => AdaptationAnalysis
  scoreResonance: (response: string, stakeholder: Stakeholder) => number
  identifyMismatches: (response: string, stakeholders: Stakeholder[]) => AdaptationMismatch[]
}

export interface AdaptationAnalysis {
  overallScore: number
  stakeholderScores: StakeholderScore[]
  adaptationStrengths: string[]
  adaptationWeaknesses: string[]
}

export interface StakeholderScore {
  stakeholder: Stakeholder
  resonanceScore: number
  reasoning: string
  suggestions: string[]
}

export interface AdaptationMismatch {
  stakeholder: Stakeholder
  mismatchType: 'COMMUNICATION_STYLE' | 'LEVEL_OF_DETAIL' | 'TONE' | 'CONTENT_FOCUS'
  description: string
  suggestion: string
}

export interface ExecutivePresenceScorer {
  scorePresence: (response: string) => PresenceScore
  analyzeConfidence: (response: string) => ConfidenceAnalysis
  assessAuthority: (response: string) => AuthorityAssessment
}

export interface PresenceScore {
  overall: number
  confidence: number
  authority: number
  clarity: number
  conviction: number
  composure: number
}

export interface ConfidenceAnalysis {
  score: number
  indicators: ConfidenceIndicator[]
  recommendations: string[]
}

export interface ConfidenceIndicator {
  type: 'LANGUAGE' | 'STRUCTURE' | 'TONE' | 'ASSERTION'
  positive: boolean
  examples: string[]
  impact: string
}

export interface AuthorityAssessment {
  score: number
  strengthAreas: string[]
  developmentAreas: string[]
  recommendations: string[]
}

export interface AdaptiveFeedback {
  feedbackLevel: FeedbackLevel
  personalization: PersonalizationLevel
  deliveryMethod: DeliveryMethod
  followUpActions: FollowUpAction[]
}

export interface FollowUpAction {
  action: string
  timeline: string
  resources: string[]
  successMetrics: string[]
}

export interface ProgressTracker {
  skillProgression: SkillProgression[]
  difficultyProgression: DifficultyProgression
  masteryTracking: MasteryTracking
  personalizedFeedback: PersonalizedFeedbackSystem
}

export interface SkillProgression {
  skill: string
  baseline: number
  current: number
  target: number
  progression: ProgressionTrend[]
  milestones: ProgressionMilestone[]
}

export interface ProgressionTrend {
  date: Date
  score: number
  exercise: string
  improvement: number
}

export interface ProgressionMilestone {
  skill: string
  milestone: string
  achieved: boolean
  date?: Date
  requirements: string[]
}

export interface DifficultyProgression {
  currentLevel: DifficultyLevel
  readinessForAdvancement: number
  lastAdvancement?: Date
  nextLevelRequirements: string[]
}

export interface MasteryTracking {
  skillMasteries: SkillMastery[]
  overallMastery: number
  masteryTrajectory: 'ACCELERATING' | 'STEADY' | 'PLATEAUING'
}

export interface SkillMastery {
  skill: string
  masteryLevel: number
  consistency: number
  lastDemonstrated: Date
  certificationReady: boolean
}

export interface PersonalizedFeedbackSystem {
  feedbackHistory: FeedbackHistory[]
  learningStyle: LearningStyleProfile
  motivationFactors: MotivationFactor[]
  adaptationRules: FeedbackAdaptationRule[]
}

export interface FeedbackHistory {
  date: Date
  exerciseId: string
  feedback: string
  effectiveness: number
  userResponse: 'HELPFUL' | 'NEUTRAL' | 'NOT_HELPFUL'
}

export interface LearningStyleProfile {
  primary: LearningStyle
  secondary?: LearningStyle
  feedbackPreference: 'IMMEDIATE' | 'DELAYED' | 'BATCHED'
  detailLevel: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface MotivationFactor {
  factor: 'PROGRESS' | 'COMPETITION' | 'MASTERY' | 'RECOGNITION' | 'CHALLENGE'
  importance: number
  current: number
}

export interface FeedbackAdaptationRule {
  condition: string
  adaptation: string
  effectiveness: number
}

// Enums and Union Types
export type ExerciseType = 
  | 'SCENARIO_BASED' 
  | 'STAKEHOLDER_ROLEPLAY' 
  | 'FRAMEWORK_APPLICATION' 
  | 'COMMUNICATION_STRUCTURE'
  | 'BOARD_PRESENTATION'
  | 'CRISIS_COMMUNICATION'
  | 'NEGOTIATION'
  | 'INFLUENCE_PRACTICE'

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type ImprovementArea = 
  | 'STRUCTURE' 
  | 'CONTENT' 
  | 'STAKEHOLDER_ADAPTATION' 
  | 'FRAMEWORK_USAGE' 
  | 'EXECUTIVE_PRESENCE'
  | 'CLARITY'
  | 'CONFIDENCE'
  | 'PERSUASIVENESS'

export type FeedbackLevel = 'BASIC' | 'DETAILED' | 'COMPREHENSIVE'

export type PersonalizationLevel = 'GENERIC' | 'ROLE_SPECIFIC' | 'HIGHLY_PERSONALIZED'

export type DeliveryMethod = 'IMMEDIATE' | 'PROGRESSIVE' | 'ON_DEMAND'

export type LearningStyle = 'VISUAL' | 'AUDITORY' | 'KINESTHETIC' | 'READING' | 'MIXED'

// Mock Data Interfaces
export interface MockExerciseScenario {
  title: string
  context: MockScenarioContext
  challenge: string
  learningObjectives: string[]
  successCriteria: string[]
  difficulty: DifficultyLevel
  estimatedTime: number
}

export interface MockScenarioContext {
  industry: Industry
  companySize: CompanySize
  situation: string
  timeline: string
  stakeholders: string[]
  constraints: string[]
}

export interface MockResponseEvaluation {
  userResponse: string
  evaluation: MockEvaluation
}

export interface MockEvaluation {
  overallScore: number
  strengths: string[]
  improvementAreas: string[]
  frameworkApplication: string
  executivePresence: string
  nextSteps: string[]
}

export interface MockProgressiveDifficulty {
  level: DifficultyLevel
  description: string
  timeConstraint: string
  stakeholderComplexity: string
  frameworkSupport: string
}

// Re-export commonly used types from modules.ts
export type { 
  PracticeModule, 
  UserProfile,
  Industry,
  PMRole,
  PMTransitionType,
  DifficultyLevel,
  PMFramework,
  CompanySize,
  MeetingType,
  StakeholderLevel,
  SkillGap
} from './modules'