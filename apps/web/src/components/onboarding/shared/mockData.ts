import type { UserProfile, OnboardingStatus, Tour } from '../../../types/onboarding'

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  currentRole: 'PM',
  targetRole: 'SENIOR_PM',
  industry: 'FINTECH',
  experience: 'INTERMEDIATE',
  careerTransition: 'PM_TO_SENIOR_PM',
  completedOnboarding: false,
  preferences: {
    tourSpeed: 'MEDIUM',
    helpLevel: 'CONTEXTUAL',
    videoPreference: true,
    skipIntros: false
  }
}

export const mockOnboardingStatus: OnboardingStatus = {
  completionPercentage: 25,
  completedSections: ['PROFILE_SETUP'],
  currentStep: {
    id: 'executive-communication',
    section: 'CAREER_TRANSITION',
    title: 'Executive Communication Mastery',
    description: 'Learn answer-first methodology for Senior PM success'
  },
  skipReasons: [],
  adaptiveGuidance: [
    {
      type: 'CAREER_TIP',
      message: 'Senior PM roles require 40% more executive communication than PM roles',
      urgency: 'MEDIUM'
    },
    {
      type: 'FEATURE_HIGHLIGHT',
      message: 'Meeting analysis shows your current executive communication score: 7.2/10',
      urgency: 'LOW'
    }
  ]
}

export const mockAvailableTours: Tour[] = [
  {
    id: 'pm-to-senior-pm-executive',
    title: 'Executive Communication Mastery',
    description: 'Master answer-first methodology and C-suite interaction patterns',
    careerRelevance: 'PM_TO_SENIOR_PM',
    industryContext: ['ALL'],
    estimatedDuration: 15,
    completionRewards: ['Executive Communication Badge', '+10 Career Readiness'],
    prerequisites: [],
    priority: 'HIGH',
    steps: [
      {
        id: 'dashboard-exec-score',
        title: 'Your Executive Communication Score',
        description: 'See how ShipSpeak measures executive presence',
        targetElement: '#executive-score-card',
        actionRequired: false,
        interactionType: 'HIGHLIGHT',
        explanation: 'This score reflects your answer-first structure, authority language, and strategic altitude.',
        careerContext: 'Senior PMs need 8.5+ executive communication for C-suite credibility.'
      },
      {
        id: 'answer-first-practice',
        title: 'Practice Answer-First Structure',
        description: 'Experience the communication pattern that separates senior PMs',
        targetElement: '#answer-first-module',
        actionRequired: true,
        interactionType: 'CLICK',
        explanation: 'Answer-first methodology puts conclusions before reasoning for executive efficiency.',
        careerContext: 'This communication style is essential for board presentations and C-suite meetings.'
      }
    ]
  },
  {
    id: 'fintech-regulatory-communication',
    title: 'Fintech Regulatory Communication',
    description: 'Navigate SEC compliance and financial risk communication',
    careerRelevance: 'ALL_LEVELS',
    industryContext: ['FINTECH'],
    estimatedDuration: 12,
    completionRewards: ['Fintech Communication Badge', 'Industry Expert Status'],
    prerequisites: [],
    priority: 'MEDIUM',
    steps: [
      {
        id: 'regulatory-dashboard',
        title: 'Regulatory Communication Dashboard',
        description: 'Track compliance language and risk communication',
        targetElement: '#regulatory-metrics',
        actionRequired: false,
        interactionType: 'HIGHLIGHT',
        explanation: 'ShipSpeak tracks regulatory vocabulary and compliance communication patterns.',
        careerContext: 'Fintech PMs must integrate regulatory awareness in all stakeholder communication.'
      },
      {
        id: 'risk-communication-practice',
        title: 'Practice Financial Risk Communication',
        description: 'Learn to communicate risk with appropriate sophistication',
        targetElement: '#risk-communication-module',
        actionRequired: true,
        interactionType: 'CLICK',
        explanation: 'Balance transparency with customer confidence in financial product communication.',
        careerContext: 'Risk communication skills differentiate senior fintech PMs from junior PMs.'
      }
    ]
  },
  {
    id: 'framework-mastery-intro',
    title: 'PM Framework Application',
    description: 'Master RICE, ICE, and Jobs-to-be-Done in real scenarios',
    careerRelevance: 'PO_TO_PM',
    industryContext: ['ALL'],
    estimatedDuration: 18,
    completionRewards: ['Framework Expert Badge', 'Strategic Thinking +15'],
    prerequisites: [],
    priority: 'HIGH',
    steps: [
      {
        id: 'framework-dashboard',
        title: 'Framework Usage Dashboard',
        description: 'See how often you apply PM frameworks in meetings',
        targetElement: '#framework-metrics',
        actionRequired: false,
        interactionType: 'HIGHLIGHT',
        explanation: 'ShipSpeak detects when you use RICE, ICE, and other frameworks in meetings.',
        careerContext: 'Framework usage distinguishes PMs from POs and demonstrates strategic thinking.'
      },
      {
        id: 'rice-practice-interactive',
        title: 'Interactive RICE Application',
        description: 'Practice RICE prioritization with real PM scenarios',
        targetElement: '#rice-practice-module',
        actionRequired: true,
        interactionType: 'CLICK',
        explanation: 'Apply RICE framework to prioritize features with realistic constraints and data.',
        careerContext: 'RICE mastery is essential for PM credibility with engineering and business stakeholders.'
      }
    ]
  }
]