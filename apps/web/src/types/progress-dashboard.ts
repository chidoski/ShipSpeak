// Core progress dashboard types
export interface ProgressDashboardProps {
  userProfile: UserProfile
  skillProgressData: SkillProgressData
  careerTrajectory: CareerTrajectory
  benchmarkData: BenchmarkData
}

export interface UserProfile {
  id: string
  name: string
  currentRole: PMLevel
  targetRole: PMLevel
  industry: Industry
  experienceMonths: number
  joinedDate: Date
}

export interface SkillProgressData {
  overallProgress: OverallProgressMetrics
  skillDimensions: SkillDimensionProgress[]
  recentImprovements: RecentImprovement[]
  milestoneAchievements: MilestoneAchievement[]
  practiceSessionHistory: PracticeSessionSummary[]
}

export interface CareerTrajectory {
  currentLevel: PMLevel
  targetLevel: PMLevel
  progressPercentage: number
  estimatedTimeToTarget: string
  keyMilestones: CareerMilestone[]
  readinessIndicators: ReadinessIndicator[]
}

export interface SkillDimensionProgress {
  dimension: SkillDimension
  currentScore: number
  targetScore: number
  recentTrend: TrendDirection
  improvementRate: number
  nextMilestone: string
  practiceRecommendations: string[]
  specificEvidence: string[]
  monthlyGrowthRate: number
  practiceSessionImpact: number
  timeToMilestone: string
}

export interface BenchmarkData {
  industryBenchmarks: IndustryBenchmark[]
  roleLevelBenchmarks: RoleBenchmark[]
  peerComparisons: PeerComparison[]
  faangStandards: FAANGBenchmark[]
}

export interface MilestoneAchievement {
  milestone: string
  achievedDate: Date
  impactDescription: string
  careerSignificance: string
  celebrationLevel: CelebrationLevel
}

export interface OverallProgressMetrics {
  overallScore: number
  monthlyImprovement: number
  yearlyImprovement: number
  strongestAreas: string[]
  developmentPriorities: string[]
  practiceSessionsCompleted: number
  totalPracticeHours: number
  careerReadinessPercentage: number
  timeToTarget: string
  monthlyProgressRate: number
  confidenceLevel: ConfidenceLevel
}

export interface RecentImprovement {
  area: string
  improvementType: ImprovementType
  date: Date
  description: string
  impact: number
  evidence: string[]
}

export interface PracticeSessionSummary {
  sessionId: string
  date: Date
  duration: number
  type: PracticeType
  skillsImproved: SkillDimension[]
  scoreImprovement: number
  keyInsights: string[]
}

export interface CareerMilestone {
  milestoneId: string
  title: string
  description: string
  targetDate: Date
  progressPercentage: number
  requiredSkills: SkillDimension[]
  careerImpact: CareerImpact
}

export interface ReadinessIndicator {
  indicator: string
  currentStatus: ReadinessStatus
  importance: ImportanceLevel
  timeToAchieve: string
  requiredActions: string[]
}

export interface IndustryBenchmark {
  industry: Industry
  averageScore: number
  topPerformerScore: number
  userPercentile: number
  keyCompetencies: string[]
  competitiveAdvantages: string[]
}

export interface RoleBenchmark {
  role: PMLevel
  requiredScore: number
  averageTimeToAchieve: string
  criticalCompetencies: string[]
  userReadinessAssessment: string
}

export interface PeerComparison {
  anonymizedPeerId: string
  similarityScore: number
  relativePeer: 'ABOVE' | 'SIMILAR' | 'BELOW'
  comparisonAreas: string[]
  learningOpportunities: string[]
}

export interface FAANGBenchmark {
  company: FAANGCompany
  leadershipPrinciples: string
  communicationStyle: string
  readinessLevel: string
  specificCriteria: Record<string, string>
}

export interface ProgressTimelineEntry {
  period: string
  overallScore: number
  keyImprovements: string[]
  practiceHours: number
  milestonesAchieved: number
  significantEvents: string[]
}

export interface SkillTrendData {
  date: Date
  skillScores: Record<SkillDimension, number>
  overallScore: number
  practiceIntensity: number
}

export interface MeetingTypeProgress {
  meetingType: MeetingType
  effectivenessScore: number
  improvementRate: number
  keyStrengths: string[]
  developmentAreas: string[]
  recentSessions: number
}

export interface FrameworkMastery {
  framework: PMFramework
  masteryLevel: MasteryLevel
  usageFrequency: number
  effectivenessScore: number
  recentApplications: string[]
  nextLevelRequirements: string[]
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  streakType: StreakType
  lastActivityDate: Date
  milestoneStreaks: number[]
}

export interface AchievementData {
  achievementId: string
  title: string
  description: string
  earnedDate: Date
  rarity: AchievementRarity
  careerImpact: string
  shareableDescription: string
}

// Enums and Types
export type PMLevel = 'PO' | 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR' | 'VP_PRODUCT'

export type Industry = 'HEALTHCARE' | 'CYBERSECURITY' | 'FINTECH' | 'ENTERPRISE' | 'CONSUMER'

export type SkillDimension = 
  | 'EXECUTIVE_COMMUNICATION'
  | 'STRATEGIC_THINKING' 
  | 'INDUSTRY_FLUENCY'
  | 'FRAMEWORK_APPLICATION'
  | 'STAKEHOLDER_MANAGEMENT'
  | 'TECHNICAL_TRANSLATION'

export type TrendDirection = 'IMPROVING' | 'STABLE' | 'DECLINING'

export type CelebrationLevel = 'MINOR' | 'MAJOR' | 'BREAKTHROUGH'

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'

export type ImprovementType = 'SKILL_BREAKTHROUGH' | 'CONSISTENCY_GAIN' | 'FRAMEWORK_MASTERY' | 'CONFIDENCE_BOOST'

export type PracticeType = 'SCENARIO_BASED' | 'FRAMEWORK_PRACTICE' | 'MEETING_SIMULATION' | 'RECORDING_ANALYSIS'

export type CareerImpact = 'MINOR' | 'MODERATE' | 'SIGNIFICANT' | 'TRANSFORMATIVE'

export type ReadinessStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'NEARLY_COMPLETE' | 'ACHIEVED'

export type ImportanceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type FAANGCompany = 'AMAZON' | 'GOOGLE' | 'META' | 'NETFLIX' | 'APPLE'

export type MeetingType = 'BOARD_PRESENTATION' | 'PLANNING_SESSION' | 'STAKEHOLDER_UPDATE' | 'ONE_ON_ONE' | 'TEAM_MEETING'

export type PMFramework = 'RICE' | 'ICE' | 'JOBS_TO_BE_DONE' | 'OKR' | 'SMART_GOALS' | 'NORTH_STAR'

export type MasteryLevel = 'FOUNDATION' | 'PRACTICE' | 'MASTERY' | 'EXPERT'

export type StreakType = 'PRACTICE_SESSIONS' | 'DAILY_ENGAGEMENT' | 'SKILL_IMPROVEMENT' | 'MODULE_COMPLETION'

export type AchievementRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'