/**
 * ShipSpeak Module Library - TypeScript Type Definitions
 * PM-specific learning module system with career transition support
 */

export interface UserProfile {
  id: string
  name: string
  currentRole: PMRole
  targetRole: PMRole
  industry: Industry
  experienceLevel: ExperienceLevel
  completedModules: string[]
  skillAssessment: SkillAssessment
  learningGoals: string[]
  preferences: UserPreferences
}

export interface LearningPath {
  id: string
  name: string
  description: string
  estimatedDuration: string
  moduleCount: number
  targetTransition: PMTransitionType
  modules: string[]
  milestones: Milestone[]
  progressTracking: string
  createdAt: Date
  customizable: boolean
}

export interface RecommendationEngine {
  userProgressAnalysis: ProgressAnalysis
  skillGapIdentification: SkillGap[]
  careerGoalAlignment: CareerGoalAlignment
  personalizedRecommendations: ModuleRecommendation[]
}

export interface ModuleCollection {
  id: string
  name: string
  description: string
  modules: PracticeModule[]
  categories: ModuleCategory[]
  difficultyProgression: DifficultyLevel[]
  industryContext: Industry
  careerTransition: PMTransitionType
  moduleCount: number
  averageDuration: string
}

export interface PracticeModule {
  id: string
  title: string
  description: string
  shortDescription: string
  category: ModuleCategory
  subcategory?: string
  difficulty: DifficultyLevel
  estimatedDuration: number
  learningObjectives: LearningObjective[]
  prerequisites: string[]
  skills: Skill[]
  industryRelevance: IndustryRelevance[]
  careerImpact: CareerImpactArea[]
  moduleType: ModuleType
  content: ModuleContent
  assessment: ModuleAssessment
  ratings: ModuleRating
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ModuleRecommendation {
  module: PracticeModule
  relevanceScore: number
  reasoning: string
  urgencyLevel: UrgencyLevel
  careerImpact: string
  timeToCompletion: string
  skillGaps: string[]
  prerequisites: RecommendationPrerequisite[]
  expectedOutcome: string
}

export interface ProgressAnalysis {
  completedModules: number
  totalAvailableModules: number
  skillProgression: SkillProgression[]
  careerReadiness: CareerReadiness
  recentActivity: RecentActivity[]
  learningVelocity: number
  strongAreas: string[]
  improvementAreas: string[]
}

export interface SkillGap {
  skill: Skill
  currentLevel: number
  targetLevel: number
  gapSize: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  recommendedModules: string[]
  timeToClose: string
  impactOnCareer: string
}

export interface CareerGoalAlignment {
  targetRole: PMRole
  targetIndustry: Industry
  timeframe: string
  alignmentScore: number
  keyFocusAreas: string[]
  missingSkills: string[]
  strengthAreas: string[]
}

export interface ModuleCategory {
  id: string
  name: string
  description: string
  icon?: string
  moduleCount: number
  averageDuration: string
  skillLevel: string
  careerImpact: string
  subcategories?: ModuleSubcategory[]
}

export interface ModuleSubcategory {
  id: string
  name: string
  description: string
  moduleCount: number
  parentCategory: string
}

export interface LearningObjective {
  id: string
  description: string
  skillArea: Skill
  proficiencyTarget: number
  assessmentCriteria: string[]
}

export interface IndustryRelevance {
  industry: Industry
  relevanceScore: number
  specificContext: string
  keyRequirements: string[]
}

export interface CareerImpactArea {
  transitionType: PMTransitionType
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  specificBenefits: string[]
  timeToImpact: string
}

export interface ModuleContent {
  type: ModuleType
  scenarios: ModuleScenario[]
  practiceExercises: PracticeExercise[]
  frameworkApplication: FrameworkApplication[]
  realWorldContext: RealWorldContext
}

export interface ModuleAssessment {
  type: AssessmentType
  criteria: AssessmentCriteria[]
  passingScore: number
  feedback: AssessmentFeedback
  retryPolicy: RetryPolicy
}

export interface ModuleRating {
  averageRating: number
  totalRatings: number
  effectiveness: number
  careerRelevance: number
  difficultyAccuracy: number
  userReviews: UserReview[]
}

export interface SkillProgression {
  skill: Skill
  currentLevel: number
  previousLevel: number
  progression: number
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  lastUpdated: Date
}

export interface CareerReadiness {
  currentRole: PMRole
  targetRole: PMRole
  readinessScore: number
  readyAreas: string[]
  developmentAreas: string[]
  timeToReadiness: string
  nextMilestones: string[]
}

export interface RecentActivity {
  type: 'MODULE_COMPLETION' | 'SKILL_IMPROVEMENT' | 'MILESTONE_ACHIEVED'
  description: string
  date: Date
  impact: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  requirements: string[]
  completed: boolean
  completedAt?: Date
  order: number
}

export interface Skill {
  id: string
  name: string
  category: string
  description: string
  levels: SkillLevel[]
}

export interface SkillLevel {
  level: number
  name: string
  description: string
  competencyIndicators: string[]
}

export interface SkillAssessment {
  skills: AssessedSkill[]
  completedAt: Date
  overallScore: number
  nextAssessment?: Date
}

export interface AssessedSkill {
  skill: Skill
  level: number
  confidence: number
  evidence: string[]
  improvementAreas: string[]
}

export interface UserPreferences {
  learningStyle: LearningStyle
  sessionDuration: SessionDuration
  difficulty: DifficultyLevel
  focusAreas: string[]
  availableTime: AvailableTime
  notificationPreferences: NotificationPreferences
}

export interface ModuleScenario {
  id: string
  title: string
  context: string
  situation: string
  stakeholders: string[]
  challenges: string[]
  expectedOutcome: string
}

export interface PracticeExercise {
  id: string
  type: ExerciseType
  instruction: string
  timeLimit?: number
  materials: string[]
  evaluationCriteria: string[]
}

export interface FrameworkApplication {
  framework: PMFramework
  applicationContext: string
  practiceScenario: string
  expectedApplication: string
  commonMistakes: string[]
}

export interface RealWorldContext {
  industry: Industry
  companySize: CompanySize
  meetingType: MeetingType
  stakeholderLevel: StakeholderLevel
  businessContext: string
}

export interface AssessmentCriteria {
  criterion: string
  weight: number
  scoringRubric: ScoringRubric[]
}

export interface AssessmentFeedback {
  strengths: string[]
  improvementAreas: string[]
  specificSuggestions: string[]
  nextSteps: string[]
}

export interface RetryPolicy {
  maxAttempts: number
  cooldownPeriod: number
  improvementRequired: boolean
}

export interface UserReview {
  userId: string
  rating: number
  review: string
  careerRelevance: number
  effectiveness: number
  createdAt: Date
  helpful: number
}

export interface RecommendationPrerequisite {
  type: 'SKILL' | 'MODULE' | 'EXPERIENCE'
  requirement: string
  met: boolean
  suggestion?: string
}

export interface ScoringRubric {
  score: number
  description: string
  indicators: string[]
}

// Enums and Union Types
export type PMRole = 
  | 'Product Owner' 
  | 'Associate PM' 
  | 'Product Manager' 
  | 'Senior PM' 
  | 'Principal PM' 
  | 'Group PM' 
  | 'Director of Product' 
  | 'VP Product' 
  | 'CPO'

export type Industry = 
  | 'Healthcare & Life Sciences' 
  | 'Cybersecurity & Enterprise Security' 
  | 'Financial Services & Fintech' 
  | 'Enterprise Software & B2B' 
  | 'Consumer Technology & Apps'
  | 'E-commerce & Marketplace'
  | 'Media & Entertainment'
  | 'Education Technology'
  | 'Real Estate Technology'
  | 'Transportation & Mobility'

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export type DifficultyLevel = 'Foundation' | 'Practice' | 'Mastery' | 'Expert'

export type PMTransitionType = 
  | 'PO_TO_PM' 
  | 'PM_TO_SENIOR_PM' 
  | 'SENIOR_PM_TO_GROUP_PM' 
  | 'GROUP_PM_TO_DIRECTOR' 
  | 'DIRECTOR_TO_VP'
  | 'INDUSTRY_TRANSITION'
  | 'COMPANY_SIZE_TRANSITION'

export type ModuleType = 
  | 'COMMUNICATION_PRACTICE' 
  | 'FRAMEWORK_APPLICATION' 
  | 'SCENARIO_SIMULATION' 
  | 'SKILL_ASSESSMENT' 
  | 'REAL_WORLD_PROJECT'

export type UrgencyLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export type AssessmentType = 'PRACTICE' | 'EVALUATION' | 'CERTIFICATION' | 'SELF_ASSESSMENT'

export type LearningStyle = 'VISUAL' | 'AUDITORY' | 'KINESTHETIC' | 'READING_WRITING' | 'MIXED'

export type SessionDuration = 'SHORT' | 'MEDIUM' | 'LONG' | 'FLEXIBLE'

export type AvailableTime = 'DAILY' | 'WEEKLY' | 'WEEKEND' | 'FLEXIBLE'

export type ExerciseType = 'ROLE_PLAY' | 'FRAMEWORK_PRACTICE' | 'COMMUNICATION' | 'ANALYSIS' | 'PRESENTATION'

export type PMFramework = 'RICE' | 'ICE' | 'JOBS_TO_BE_DONE' | 'OKR' | 'KANO' | 'MOSCOW' | 'VALUE_PROP'

export type CompanySize = 'STARTUP' | 'SCALE_UP' | 'MID_MARKET' | 'ENTERPRISE' | 'MEGA_CORP'

export type MeetingType = 'BOARD_PRESENTATION' | 'PLANNING_SESSION' | 'STAKEHOLDER_UPDATE' | 'ONE_ON_ONE' | 'TEAM_MEETING'

export type StakeholderLevel = 'IC' | 'MANAGER' | 'DIRECTOR' | 'VP' | 'C_SUITE' | 'BOARD'

export interface NotificationPreferences {
  newModules: boolean
  recommendations: boolean
  milestones: boolean
  reminders: boolean
  frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
}

// Search and Filter Types
export interface ModuleSearchFilters {
  categories: string[]
  difficulties: DifficultyLevel[]
  industries: Industry[]
  careerTransitions: PMTransitionType[]
  duration: DurationFilter
  skills: string[]
  moduleTypes: ModuleType[]
  ratings: RatingFilter
}

export interface DurationFilter {
  min?: number
  max?: number
}

export interface RatingFilter {
  min: number
  sortBy?: 'RATING' | 'EFFECTIVENESS' | 'CAREER_RELEVANCE'
}

export interface SearchResult {
  modules: PracticeModule[]
  totalCount: number
  facets: SearchFacets
  suggestions: string[]
}

export interface SearchFacets {
  categories: FacetCount[]
  difficulties: FacetCount[]
  industries: FacetCount[]
  durations: FacetCount[]
}

export interface FacetCount {
  name: string
  count: number
  selected: boolean
}