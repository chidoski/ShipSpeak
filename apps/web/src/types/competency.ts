// PM Competency Framework Types
export interface PMCompetency {
  id: string;
  name: string;
  description: string;
  score: number; // 0-100 scale
  level: CompetencyLevel;
  category: CompetencyCategory;
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
  benchmarks: CompetencyBenchmark[];
}

export type CompetencyLevel = 'foundation' | 'practice' | 'mastery' | 'executive';

export type CompetencyCategory = 
  | 'product-sense'
  | 'communication' 
  | 'stakeholder'
  | 'technical'
  | 'business';

export interface CompetencyBenchmark {
  level: CompetencyLevel;
  minScore: number;
  description: string;
  examples: string[];
}

// 5-Point Radar Chart Data
export interface CompetencyRadarData {
  productSense: number;
  communication: number;
  stakeholder: number;
  technical: number;
  business: number;
}

// PM Career Progression
export type PMCareerLevel = 
  | 'po'              // Product Owner
  | 'pm'              // Product Manager
  | 'senior-pm'       // Senior PM
  | 'group-pm'        // Group PM
  | 'director'        // Director of Product
  | 'executive';      // VP/Chief Product Officer

export interface CareerProgression {
  currentLevel: PMCareerLevel;
  targetLevel: PMCareerLevel;
  competencyGaps: CompetencyGap[];
  timeToPromotion: number; // months
  readinessScore: number; // 0-100
}

export interface CompetencyGap {
  competency: CompetencyCategory;
  currentScore: number;
  requiredScore: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  practiceModules: string[];
}

// Executive Features
export interface ExecutiveContext {
  boardPresentations: boolean;
  speakingEngagements: boolean;
  crisisCommunication: boolean;
  organizationalLeadership: boolean;
}

// Industry Specialization
export type IndustryType = 'healthcare' | 'cybersecurity' | 'fintech' | 'enterprise' | 'consumer';

export interface IndustryContext {
  type: IndustryType;
  specializations: string[];
  companySize: 'startup' | 'growth' | 'enterprise';
  companyStage: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'ipo' | 'public';
}

// Smart Feedback System
export type FeedbackComplexity = 'template' | 'pattern' | 'ai-analysis';

export interface FeedbackConfiguration {
  complexity: FeedbackComplexity;
  costOptimized: boolean;
  realTimeEnabled: boolean;
  executiveMode: boolean;
}