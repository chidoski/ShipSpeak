export type PMRole = 
  | 'Product Owner'
  | 'PM'
  | 'Senior PM'
  | 'Group PM'
  | 'Director'
  | 'VP Product'
  | 'CPO';

export type Industry = 
  | 'healthcare'
  | 'cybersecurity'
  | 'fintech'
  | 'enterprise'
  | 'consumer';

export type LearningPath = 
  | 'meeting-analysis'
  | 'practice-first'
  | 'executive-fast-track';

export type CompetencyArea = 
  | 'product-sense'
  | 'communication'
  | 'stakeholder-management'
  | 'technical-translation'
  | 'business-impact';

export interface CompetencyBaseline {
  'product-sense': {
    userProblemIdentification: number;
    frameworkFamiliarity: number;
    marketContextAwareness: number;
    score: number;
  };
  communication: {
    executivePresentation: number;
    answerFirstStructure: number;
    stakeholderAdaptation: number;
    score: number;
  };
  'stakeholder-management': {
    multiAudienceExperience: number;
    conflictResolution: number;
    crossFunctionalLeadership: number;
    score: number;
  };
  'technical-translation': {
    complexitySimplification: number;
    dataPresentationConfidence: number;
    businessStakeholderCommunication: number;
    score: number;
  };
  'business-impact': {
    roiCommunication: number;
    organizationalCommunication: number;
    visionSetting: number;
    score: number;
  };
}

export interface RoleAssessment {
  currentRole: PMRole;
  experienceLevel: number; // months in current role
  industryExperience: number; // years in industry
  targetRole: PMRole;
  timeline: string;
  motivations: Array<'Board presentation skills' | 'Executive presence' | 'Team leadership' | 'Strategic communication'>;
}

export interface IndustryContext {
  sector: Industry;
  specializedRequirements: {
    healthcare?: 'FDA communication' | 'clinical stakeholders' | 'patient safety messaging';
    cybersecurity?: 'Risk communication' | 'incident response' | 'compliance stakeholders';
    fintech?: 'Regulatory compliance' | 'financial risk' | 'trust-building' | 'investor relations';
    enterprise?: 'ROI communication' | 'customer success' | 'implementation planning' | 'B2B stakeholders';
    consumer?: 'User engagement' | 'growth metrics' | 'behavioral psychology' | 'platform dynamics';
  };
}

export interface OnboardingData {
  userId: string;
  step: number;
  completedSteps: number[];
  roleAssessment?: RoleAssessment;
  industryContext?: IndustryContext;
  competencyBaseline?: CompetencyBaseline;
  recommendedPath?: LearningPath;
  isExecutive: boolean;
  completedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: PMRole;
  industry: Industry;
  isExecutive: boolean;
  competencyBaseline: CompetencyBaseline;
  learningPath: LearningPath;
  onboardingCompleted: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  onboardingData: OnboardingData | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  role: PMRole;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  requiresOnboarding?: boolean;
}