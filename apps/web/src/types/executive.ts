// Executive Features & Context Types
export interface ExecutiveFeatures {
  boardPresentations: {
    enabled: boolean;
    quarterlyReviews: boolean;
    investorUpdates: boolean;
    strategicPlanning: boolean;
  };
  speakingEngagements: {
    enabled: boolean;
    industryConferences: boolean;
    thoughtLeadership: boolean;
    panelDiscussions: boolean;
  };
  crisisCommunication: {
    enabled: boolean;
    stakeholderUpdates: boolean;
    mediaRelations: boolean;
    teamCommunication: boolean;
  };
  organizationalLeadership: {
    enabled: boolean;
    allHandsMeetings: boolean;
    strategicVisionCascading: boolean;
    changeManagement: boolean;
  };
}

// Executive UI Modes
export type ExecutiveUIMode = 'standard' | 'board-ready' | 'crisis' | 'presentation';

export interface ExecutiveUIConfiguration {
  mode: ExecutiveUIMode;
  theme: 'executive' | 'healthcare' | 'cybersecurity' | 'fintech' | 'enterprise' | 'consumer';
  typography: 'professional' | 'approachable' | 'authoritative';
  density: 'compact' | 'comfortable' | 'spacious';
}

// Executive Dashboard Context
export interface ExecutiveDashboardContext {
  upcomingBoardMeeting?: {
    date: Date;
    agenda: string[];
    preparationStatus: 'not-started' | 'in-progress' | 'ready';
  };
  criticalMetrics: {
    label: string;
    value: string | number;
    trend: 'up' | 'down' | 'stable';
    urgency: 'low' | 'medium' | 'high';
  }[];
  stakeholderAlerts: {
    type: 'positive' | 'neutral' | 'concern';
    message: string;
    stakeholder: string;
    actionRequired: boolean;
  }[];
}

// Executive Communication Standards
export interface ExecutiveCommunicationStandards {
  answerFirst: boolean;          // Conclusion-driven communication
  executiveSummary: boolean;     // Always include exec summary
  dataVisualization: boolean;    // Charts and graphs required
  stakeholderMapping: boolean;   // Context for all audiences
  riskAssessment: boolean;       // Risk/mitigation included
}