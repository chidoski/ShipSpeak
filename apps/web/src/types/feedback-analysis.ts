export interface FeedbackDisplayProps {
  analysisResults: AnalysisResults;
  userProfile: UserProfile;
  improvementEngine: ImprovementEngine;
  visualizationConfig: VisualizationConfig;
}

export interface AnalysisResults {
  overallScore: number;
  scoreImprovement?: number;
  industryBenchmark: number;
  roleBenchmark: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  dimensionalScores: DimensionalScoreBreakdown;
  strengthAreas: StrengthAnalysis[];
  improvementAreas: ImprovementAnalysis[];
  frameworkUsage: FrameworkUsageAnalysis;
  careerProgressionInsights: CareerProgressionAnalysis;
}

export interface DimensionalScoreBreakdown {
  communicationStructure: number;
  executivePresence: number;
  frameworkApplication: number;
  industryFluency: number;
  stakeholderAdaptation: number;
  confidenceLevel: number;
}

export interface StrengthAnalysis {
  area: string;
  score: number;
  evidence: string[];
  careerLeverage: string;
  reinforcementSuggestions: string[];
}

export interface ImprovementAnalysis {
  area: string;
  currentScore: number;
  targetScore: number;
  specificEvidence: string[];
  improvementActions: ImprovementAction[];
  priorityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  careerImpact: string;
}

export interface ImprovementAction {
  action: string;
  method: 'PRACTICE_MODULE' | 'COACHING_SESSION' | 'FRAMEWORK_STUDY' | 'REAL_MEETING_APPLICATION';
  estimatedTimeToImprovement: string;
  successMetrics: string[];
}

export interface FrameworkUsageAnalysis {
  frameworksDetected: string[];
  usageQuality: number;
  integrationEffectiveness: number;
  recommendedFrameworks: string[];
}

export interface CareerProgressionAnalysis {
  currentLevel: 'PO' | 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR';
  targetLevel: 'PM' | 'SENIOR_PM' | 'GROUP_PM' | 'DIRECTOR' | 'VP_PRODUCT';
  readinessPercentage: number;
  keyGapsClosing: number;
  estimatedTimeToReadiness: string;
  criticalSkillGaps: string[];
}

export interface UserProfile {
  currentRole: string;
  targetRole: string;
  industry: 'healthcare' | 'cybersecurity' | 'fintech' | 'enterprise' | 'consumer';
  experienceLevel: 'junior' | 'mid' | 'senior' | 'principal';
  strengths: string[];
  goals: string[];
}

export interface ImprovementEngine {
  priorityWeights: PriorityWeights;
  recommendationTypes: RecommendationType[];
  learningPreferences: LearningPreferences;
}

export interface PriorityWeights {
  careerImpact: number;
  quickWins: number;
  foundationalSkills: number;
  industryRelevance: number;
}

export interface RecommendationType {
  type: 'COACHING' | 'PRACTICE' | 'FRAMEWORK' | 'MEETING';
  weight: number;
  conditions: string[];
}

export interface LearningPreferences {
  preferredMethods: string[];
  timeAvailability: number; // hours per week
  difficultyPreference: 'gradual' | 'challenge' | 'mixed';
  feedbackStyle: 'detailed' | 'concise' | 'motivational';
}

export interface VisualizationConfig {
  chartType: 'RADAR' | 'BAR' | 'TIMELINE' | 'HEATMAP';
  interactivity: 'HIGH' | 'MEDIUM' | 'LOW';
  animationStyle: 'SMOOTH' | 'INSTANT' | 'STEPPED';
  colorScheme: 'PROFESSIONAL' | 'ENCOURAGING' | 'NEUTRAL';
}

export type MeetingType = 'board_presentation' | 'planning_session' | 'stakeholder_update' | 'practice_session';

export type IndustryContext = 'healthcare' | 'cybersecurity' | 'fintech' | 'enterprise' | 'consumer';

export type CareerTransition = 'PO_TO_PM' | 'PM_TO_SENIOR_PM' | 'SENIOR_PM_TO_GROUP_PM' | 'GROUP_PM_TO_DIRECTOR';

export interface FeedbackSession {
  id: string;
  userId: string;
  recordingId: string;
  analysisResults: AnalysisResults;
  meetingType: MeetingType;
  industryContext: IndustryContext;
  createdAt: Date;
  completedAt?: Date;
  feedbackViewed: boolean;
  improvementActionsSelected: string[];
}

export interface BenchmarkData {
  industry: IndustryContext;
  role: string;
  averageScores: DimensionalScoreBreakdown;
  topPerformerScores: DimensionalScoreBreakdown;
  improvementTimelines: Record<string, string>;
}