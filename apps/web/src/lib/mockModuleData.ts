/**
 * ShipSpeak Module Library - Comprehensive Mock Data
 * PM-specific learning modules with career transition support and industry context
 */

import { 
  UserProfile, 
  ModuleCollection, 
  PracticeModule, 
  ModuleCategory,
  RecommendationEngine,
  ModuleRecommendation,
  LearningPath,
  Skill,
  LearningObjective,
  SkillAssessment,
  AssessedSkill
} from '@/types/modules'

// Core Skills Database
export const mockSkills: Skill[] = [
  {
    id: 'executive-communication',
    name: 'Executive Communication',
    category: 'Communication',
    description: 'Ability to communicate clearly and persuasively with senior stakeholders',
    levels: [
      { level: 1, name: 'Foundation', description: 'Can present basic information clearly', competencyIndicators: ['Clear verbal communication', 'Basic presentation skills'] },
      { level: 2, name: 'Developing', description: 'Can structure executive summaries', competencyIndicators: ['Answer-first methodology', 'Executive summary structure'] },
      { level: 3, name: 'Competent', description: 'Can handle executive Q&A sessions', competencyIndicators: ['Confident under pressure', 'Handles difficult questions'] },
      { level: 4, name: 'Proficient', description: 'Can lead board presentations', competencyIndicators: ['Board-ready presence', 'Strategic narrative'] },
      { level: 5, name: 'Expert', description: 'Can influence C-suite decisions', competencyIndicators: ['Executive influence', 'Strategic persuasion'] }
    ]
  },
  {
    id: 'strategic-thinking',
    name: 'Strategic Thinking',
    category: 'Strategy',
    description: 'Ability to analyze market trends and develop long-term product strategy',
    levels: [
      { level: 1, name: 'Foundation', description: 'Understands basic competitive analysis', competencyIndicators: ['Market research', 'Competitive awareness'] },
      { level: 2, name: 'Developing', description: 'Can identify strategic opportunities', competencyIndicators: ['Opportunity identification', 'Trend analysis'] },
      { level: 3, name: 'Competent', description: 'Can develop product roadmaps', competencyIndicators: ['Roadmap planning', 'Strategic prioritization'] },
      { level: 4, name: 'Proficient', description: 'Can shape market strategy', competencyIndicators: ['Market positioning', 'Competitive strategy'] },
      { level: 5, name: 'Expert', description: 'Can lead organizational strategy', competencyIndicators: ['Strategic vision', 'Market leadership'] }
    ]
  },
  {
    id: 'stakeholder-management',
    name: 'Stakeholder Management',
    category: 'Leadership',
    description: 'Ability to build relationships and influence across organizations',
    levels: [
      { level: 1, name: 'Foundation', description: 'Can work with direct team members', competencyIndicators: ['Team collaboration', 'Basic relationship building'] },
      { level: 2, name: 'Developing', description: 'Can coordinate cross-functional teams', competencyIndicators: ['Cross-team coordination', 'Conflict resolution'] },
      { level: 3, name: 'Competent', description: 'Can influence without authority', competencyIndicators: ['Influence skills', 'Persuasion techniques'] },
      { level: 4, name: 'Proficient', description: 'Can manage senior stakeholders', competencyIndicators: ['Executive relationship building', 'Strategic alignment'] },
      { level: 5, name: 'Expert', description: 'Can shape organizational culture', competencyIndicators: ['Cultural influence', 'Organizational change'] }
    ]
  },
  {
    id: 'framework-mastery',
    name: 'Framework Mastery',
    category: 'Methodology',
    description: 'Proficiency in PM frameworks and decision-making methodologies',
    levels: [
      { level: 1, name: 'Foundation', description: 'Knows basic prioritization frameworks', competencyIndicators: ['RICE framework', 'Basic prioritization'] },
      { level: 2, name: 'Developing', description: 'Can apply multiple frameworks appropriately', competencyIndicators: ['ICE framework', 'Jobs-to-be-Done'] },
      { level: 3, name: 'Competent', description: 'Can adapt frameworks to context', competencyIndicators: ['Framework customization', 'Context-aware application'] },
      { level: 4, name: 'Proficient', description: 'Can teach frameworks to others', competencyIndicators: ['Framework training', 'Best practice sharing'] },
      { level: 5, name: 'Expert', description: 'Can develop new frameworks', competencyIndicators: ['Framework innovation', 'Methodology creation'] }
    ]
  },
  {
    id: 'industry-expertise',
    name: 'Industry Expertise',
    category: 'Domain Knowledge',
    description: 'Deep understanding of specific industry dynamics and requirements',
    levels: [
      { level: 1, name: 'Foundation', description: 'Basic industry awareness', competencyIndicators: ['Industry terminology', 'Basic regulations'] },
      { level: 2, name: 'Developing', description: 'Understands industry trends', competencyIndicators: ['Market dynamics', 'Trend identification'] },
      { level: 3, name: 'Competent', description: 'Can speak industry language fluently', competencyIndicators: ['Industry fluency', 'Stakeholder credibility'] },
      { level: 4, name: 'Proficient', description: 'Recognized as industry expert', competencyIndicators: ['Industry thought leadership', 'External recognition'] },
      { level: 5, name: 'Expert', description: 'Can shape industry standards', competencyIndicators: ['Industry influence', 'Standard setting'] }
    ]
  }
]

// Mock User Profile for Testing
export const mockUserProfile: UserProfile = {
  id: 'user-sarah-chen',
  name: 'Sarah Chen',
  currentRole: 'Senior PM',
  targetRole: 'Group PM',
  industry: 'Financial Services & Fintech',
  experienceLevel: 'Advanced',
  completedModules: [
    'executive-comm-board-prep',
    'strategic-thinking-foundation',
    'fintech-compliance-intro'
  ],
  skillAssessment: {
    skills: [
      {
        skill: mockSkills[0], // Executive Communication
        level: 3.8,
        confidence: 0.85,
        evidence: ['Recent board presentation success', 'Positive stakeholder feedback'],
        improvementAreas: ['Strategic narrative development', 'Financial metrics communication']
      },
      {
        skill: mockSkills[1], // Strategic Thinking
        level: 3.2,
        confidence: 0.75,
        evidence: ['Successful roadmap development', 'Market analysis presentation'],
        improvementAreas: ['Competitive positioning', 'Long-term vision articulation']
      },
      {
        skill: mockSkills[2], // Stakeholder Management
        level: 4.1,
        confidence: 0.90,
        evidence: ['Cross-functional team leadership', 'Conflict resolution success'],
        improvementAreas: ['C-suite relationship building']
      },
      {
        skill: mockSkills[3], // Framework Mastery
        level: 3.5,
        confidence: 0.80,
        evidence: ['RICE framework implementation', 'Training junior PMs'],
        improvementAreas: ['Advanced frameworks', 'Framework customization']
      },
      {
        skill: mockSkills[4], // Industry Expertise
        level: 4.3,
        confidence: 0.95,
        evidence: ['Regulatory compliance leadership', 'Industry conference speaking'],
        improvementAreas: ['Emerging fintech trends', 'International regulations']
      }
    ],
    completedAt: new Date('2024-11-01'),
    overallScore: 76.8,
    nextAssessment: new Date('2025-02-01')
  },
  learningGoals: [
    'Achieve Group PM readiness within 6 months',
    'Master portfolio strategy communication',
    'Build C-suite executive presence',
    'Develop team mentorship skills'
  ],
  preferences: {
    learningStyle: 'MIXED',
    sessionDuration: 'MEDIUM',
    difficulty: 'Practice',
    focusAreas: ['Executive Communication', 'Portfolio Strategy', 'Team Development'],
    availableTime: 'DAILY',
    notificationPreferences: {
      newModules: true,
      recommendations: true,
      milestones: true,
      reminders: true,
      frequency: 'WEEKLY'
    }
  }
}

// Mock Module Categories
export const mockModuleCategories: ModuleCategory[] = [
  {
    id: 'executive-communication',
    name: 'Executive Communication',
    description: 'Master C-suite and senior stakeholder communication',
    icon: 'users',
    moduleCount: 23,
    averageDuration: '15 minutes',
    skillLevel: 'Intermediate to Advanced',
    careerImpact: 'High impact for PM → Senior PM and Senior PM → Group PM transitions',
    subcategories: [
      { id: 'board-presentations', name: 'Board Presentations', description: 'Master board-level communication', moduleCount: 8, parentCategory: 'executive-communication' },
      { id: 'stakeholder-updates', name: 'Stakeholder Updates', description: 'Effective executive reporting', moduleCount: 7, parentCategory: 'executive-communication' },
      { id: 'crisis-communication', name: 'Crisis Communication', description: 'Navigate difficult conversations', moduleCount: 8, parentCategory: 'executive-communication' }
    ]
  },
  {
    id: 'strategic-thinking',
    name: 'Strategic Thinking',
    description: 'Develop market strategy and competitive analysis skills',
    icon: 'brain',
    moduleCount: 18,
    averageDuration: '12 minutes',
    skillLevel: 'All levels',
    careerImpact: 'Essential for PO → PM and PM → Senior PM transitions',
    subcategories: [
      { id: 'market-analysis', name: 'Market Analysis', description: 'Competitive intelligence and positioning', moduleCount: 6, parentCategory: 'strategic-thinking' },
      { id: 'roadmap-planning', name: 'Roadmap Planning', description: 'Strategic product planning', moduleCount: 6, parentCategory: 'strategic-thinking' },
      { id: 'vision-development', name: 'Vision Development', description: 'Long-term strategic thinking', moduleCount: 6, parentCategory: 'strategic-thinking' }
    ]
  },
  {
    id: 'industry-expertise',
    name: 'Industry Expertise',
    description: 'Build sector-specific communication and decision-making skills',
    icon: 'briefcase',
    moduleCount: 45,
    averageDuration: '10 minutes',
    skillLevel: 'Beginner to Advanced',
    careerImpact: 'Critical for industry transition and specialization',
    subcategories: [
      { id: 'fintech-mastery', name: 'Fintech Mastery', description: 'Financial services expertise', moduleCount: 12, parentCategory: 'industry-expertise' },
      { id: 'healthcare-expertise', name: 'Healthcare Expertise', description: 'Life sciences and healthcare PM skills', moduleCount: 10, parentCategory: 'industry-expertise' },
      { id: 'cybersecurity-focus', name: 'Cybersecurity Focus', description: 'Security-first product thinking', moduleCount: 8, parentCategory: 'industry-expertise' }
    ]
  },
  {
    id: 'framework-mastery',
    name: 'Framework Mastery',
    description: 'Master PM frameworks and decision-making methodologies',
    icon: 'target',
    moduleCount: 15,
    averageDuration: '14 minutes',
    skillLevel: 'Beginner to Expert',
    careerImpact: 'Foundation for all PM career levels',
    subcategories: [
      { id: 'prioritization-frameworks', name: 'Prioritization Frameworks', description: 'RICE, ICE, and advanced methods', moduleCount: 6, parentCategory: 'framework-mastery' },
      { id: 'strategy-frameworks', name: 'Strategy Frameworks', description: 'Jobs-to-be-Done, OKRs, and strategy tools', moduleCount: 5, parentCategory: 'framework-mastery' },
      { id: 'decision-frameworks', name: 'Decision Frameworks', description: 'Decision-making methodologies', moduleCount: 4, parentCategory: 'framework-mastery' }
    ]
  },
  {
    id: 'career-transition',
    name: 'Career Transition',
    description: 'Role-specific development for PM career advancement',
    icon: 'trending-up',
    moduleCount: 32,
    averageDuration: '18 minutes',
    skillLevel: 'Intermediate to Advanced',
    careerImpact: 'Direct impact on career advancement readiness',
    subcategories: [
      { id: 'po-to-pm', name: 'PO → PM Transition', description: 'Product Owner to PM advancement', moduleCount: 8, parentCategory: 'career-transition' },
      { id: 'pm-to-senior', name: 'PM → Senior PM', description: 'Individual contributor to senior role', moduleCount: 10, parentCategory: 'career-transition' },
      { id: 'senior-to-group', name: 'Senior PM → Group PM', description: 'Individual to team leadership', moduleCount: 8, parentCategory: 'career-transition' },
      { id: 'group-to-director', name: 'Group PM → Director', description: 'Team lead to organizational leader', moduleCount: 6, parentCategory: 'career-transition' }
    ]
  }
]

// Create detailed learning objectives
const createLearningObjectives = (descriptions: string[], skillArea: Skill): LearningObjective[] => {
  return descriptions.map((desc, index) => ({
    id: `objective-${skillArea.id}-${index}`,
    description: desc,
    skillArea,
    proficiencyTarget: 4,
    assessmentCriteria: [`Demonstrate ${desc.toLowerCase()}`, 'Apply in realistic scenario', 'Explain methodology to others']
  }))
}

// Mock Practice Modules - Executive Communication
const executiveCommunicationModules: PracticeModule[] = [
  {
    id: 'executive-comm-board-prep',
    title: 'Board Presentation: Financial Impact Communication',
    description: 'Master the art of presenting product strategy and financial impact to board members with confidence and clarity.',
    shortDescription: 'Board-level product strategy and financial communication',
    category: mockModuleCategories[0],
    subcategory: 'Board Presentations',
    difficulty: 'Mastery',
    estimatedDuration: 18,
    learningObjectives: createLearningObjectives([
      'Structure board presentations using executive summary methodology',
      'Communicate financial impact with appropriate metrics and context',
      'Handle challenging board questions with confidence and data',
      'Align product strategy with business objectives for board consumption'
    ], mockSkills[0]),
    prerequisites: ['executive-comm-stakeholder-basics', 'strategic-metrics-foundation'],
    skills: [mockSkills[0], mockSkills[1]], // Executive Communication, Strategic Thinking
    industryRelevance: [
      { industry: 'Financial Services & Fintech', relevanceScore: 95, specificContext: 'Regulatory compliance and risk communication', keyRequirements: ['Risk articulation', 'Compliance reporting', 'Financial metrics'] },
      { industry: 'Healthcare & Life Sciences', relevanceScore: 88, specificContext: 'Clinical evidence and regulatory approval', keyRequirements: ['FDA communication', 'Clinical evidence', 'Patient impact'] },
      { industry: 'Enterprise Software & B2B', relevanceScore: 85, specificContext: 'ROI demonstration and customer success', keyRequirements: ['ROI communication', 'Customer metrics', 'Implementation success'] }
    ],
    careerImpact: [
      { transitionType: 'SENIOR_PM_TO_GROUP_PM', impactLevel: 'HIGH', specificBenefits: ['Essential for portfolio leadership', 'Board interaction readiness', 'Strategic communication mastery'], timeToImpact: '2-4 weeks' },
      { transitionType: 'GROUP_PM_TO_DIRECTOR', impactLevel: 'HIGH', specificBenefits: ['Director-level board presentation skills', 'Financial fluency demonstration'], timeToImpact: '1-2 weeks' }
    ],
    moduleType: 'SCENARIO_SIMULATION',
    content: {
      type: 'SCENARIO_SIMULATION',
      scenarios: [
        {
          id: 'board-quarterly-update',
          title: 'Quarterly Product Performance Review',
          context: 'Board of Directors quarterly meeting',
          situation: 'Present Q3 product performance, Q4 strategy, and budget requirements',
          stakeholders: ['Board Chair', 'CEO', 'CFO', 'Independent Directors'],
          challenges: ['Missed revenue target', 'Competitive pressure', 'Resource allocation'],
          expectedOutcome: 'Board approval for Q4 strategy and budget allocation'
        }
      ],
      practiceExercises: [
        {
          id: 'executive-summary-drill',
          type: 'COMMUNICATION',
          instruction: 'Deliver 2-minute executive summary with key metrics and recommendations',
          timeLimit: 120,
          materials: ['Product metrics dashboard', 'Competitive analysis', 'Budget proposal'],
          evaluationCriteria: ['Clarity of key messages', 'Financial impact articulation', 'Confidence under pressure']
        }
      ],
      frameworkApplication: [
        {
          framework: 'OKR',
          applicationContext: 'Board objective alignment',
          practiceScenario: 'Present product OKRs aligned with company objectives',
          expectedApplication: 'Clear connection between product metrics and business outcomes',
          commonMistakes: ['Too much tactical detail', 'Weak business connection', 'Unclear success metrics']
        }
      ],
      realWorldContext: {
        industry: 'Financial Services & Fintech',
        companySize: 'ENTERPRISE',
        meetingType: 'BOARD_PRESENTATION',
        stakeholderLevel: 'BOARD',
        businessContext: 'Quarterly performance review with strategic planning'
      }
    },
    assessment: {
      type: 'EVALUATION',
      criteria: [
        { criterion: 'Executive Summary Clarity', weight: 30, scoringRubric: [{ score: 5, description: 'Crystal clear key messages', indicators: ['Answer-first structure', 'Key metrics highlighted'] }] },
        { criterion: 'Financial Impact Communication', weight: 25, scoringRubric: [{ score: 5, description: 'Strong financial narrative', indicators: ['Clear ROI story', 'Business impact'] }] },
        { criterion: 'Board-level Confidence', weight: 25, scoringRubric: [{ score: 5, description: 'Executive presence', indicators: ['Confident delivery', 'Handles Q&A'] }] },
        { criterion: 'Strategic Alignment', weight: 20, scoringRubric: [{ score: 5, description: 'Clear strategic connection', indicators: ['Business alignment', 'Forward-looking'] }] }
      ],
      passingScore: 80,
      feedback: {
        strengths: ['Clear executive summary structure', 'Strong financial metrics presentation'],
        improvementAreas: ['Board Q&A handling', 'Strategic narrative development'],
        specificSuggestions: ['Practice difficult question scenarios', 'Strengthen competitive positioning story'],
        nextSteps: ['Advanced board simulation', 'CEO communication module']
      },
      retryPolicy: { maxAttempts: 3, cooldownPeriod: 24, improvementRequired: true }
    },
    ratings: {
      averageRating: 4.7,
      totalRatings: 89,
      effectiveness: 0.91,
      careerRelevance: 0.94,
      difficultyAccuracy: 0.88,
      userReviews: [
        {
          userId: 'user-marcus-rodriguez',
          rating: 5,
          review: 'This module completely changed my board presentation confidence. The financial impact framework is incredibly practical.',
          careerRelevance: 5,
          effectiveness: 5,
          createdAt: new Date('2024-10-15'),
          helpful: 12
        }
      ]
    },
    tags: ['board-communication', 'financial-impact', 'executive-presence', 'strategic-communication'],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-10-15')
  },
  {
    id: 'executive-comm-stakeholder-updates',
    title: 'Executive Stakeholder Update: Progress Communication Excellence',
    description: 'Learn to deliver compelling stakeholder updates that build confidence and drive action.',
    shortDescription: 'Master executive stakeholder reporting and progress communication',
    category: mockModuleCategories[0],
    subcategory: 'Stakeholder Updates',
    difficulty: 'Practice',
    estimatedDuration: 14,
    learningObjectives: createLearningObjectives([
      'Structure stakeholder updates for maximum impact',
      'Communicate progress, blockers, and next steps clearly',
      'Build stakeholder confidence through transparent communication',
      'Navigate difficult conversations with senior leaders'
    ], mockSkills[0]),
    prerequisites: ['communication-fundamentals'],
    skills: [mockSkills[0], mockSkills[2]], // Executive Communication, Stakeholder Management
    industryRelevance: [
      { industry: 'Enterprise Software & B2B', relevanceScore: 92, specificContext: 'Customer success and implementation updates', keyRequirements: ['Customer progress', 'Implementation metrics', 'Success indicators'] },
      { industry: 'Healthcare & Life Sciences', relevanceScore: 89, specificContext: 'Clinical trial and regulatory progress', keyRequirements: ['Clinical milestones', 'Regulatory updates', 'Patient safety'] }
    ],
    careerImpact: [
      { transitionType: 'PM_TO_SENIOR_PM', impactLevel: 'HIGH', specificBenefits: ['Senior stakeholder credibility', 'Executive communication confidence'], timeToImpact: '2-3 weeks' },
      { transitionType: 'SENIOR_PM_TO_GROUP_PM', impactLevel: 'MEDIUM', specificBenefits: ['Cross-functional leadership', 'Stakeholder alignment'], timeToImpact: '3-4 weeks' }
    ],
    moduleType: 'COMMUNICATION_PRACTICE',
    content: {
      type: 'COMMUNICATION_PRACTICE',
      scenarios: [
        {
          id: 'quarterly-stakeholder-update',
          title: 'Quarterly Executive Stakeholder Update',
          context: 'Executive team meeting',
          situation: 'Present quarterly progress, address blockers, outline next quarter strategy',
          stakeholders: ['CEO', 'CTO', 'VP Sales', 'VP Marketing'],
          challenges: ['Delayed feature launch', 'Resource constraints', 'Competitive pressure'],
          expectedOutcome: 'Stakeholder alignment on priorities and resource allocation'
        }
      ],
      practiceExercises: [
        {
          id: 'blocker-communication-drill',
          type: 'COMMUNICATION',
          instruction: 'Communicate project blocker with solution proposal in 90 seconds',
          timeLimit: 90,
          materials: ['Project status report', 'Resource allocation options', 'Risk mitigation plan'],
          evaluationCriteria: ['Problem clarity', 'Solution focus', 'Stakeholder confidence']
        }
      ],
      frameworkApplication: [
        {
          framework: 'RICE',
          applicationContext: 'Priority communication to stakeholders',
          practiceScenario: 'Explain feature prioritization using RICE framework',
          expectedApplication: 'Clear rationale for prioritization decisions',
          commonMistakes: ['Too technical', 'Weak business justification', 'Missing stakeholder context']
        }
      ],
      realWorldContext: {
        industry: 'Enterprise Software & B2B',
        companySize: 'MID_MARKET',
        meetingType: 'STAKEHOLDER_UPDATE',
        stakeholderLevel: 'VP',
        businessContext: 'Regular executive progress review'
      }
    },
    assessment: {
      type: 'PRACTICE',
      criteria: [
        { criterion: 'Progress Communication Clarity', weight: 30, scoringRubric: [{ score: 5, description: 'Clear progress narrative', indicators: ['Metric-driven updates', 'Clear achievements'] }] },
        { criterion: 'Blocker Communication', weight: 25, scoringRubric: [{ score: 5, description: 'Solution-focused problem presentation', indicators: ['Clear problem statement', 'Actionable solutions'] }] },
        { criterion: 'Stakeholder Confidence', weight: 25, scoringRubric: [{ score: 5, description: 'Builds stakeholder trust', indicators: ['Transparent communication', 'Confident delivery'] }] },
        { criterion: 'Action Orientation', weight: 20, scoringRubric: [{ score: 5, description: 'Clear next steps', indicators: ['Actionable plans', 'Owner identification'] }] }
      ],
      passingScore: 75,
      feedback: {
        strengths: ['Clear progress structure', 'Transparent blocker communication'],
        improvementAreas: ['Solution development', 'Stakeholder engagement'],
        specificSuggestions: ['Practice solution-first communication', 'Develop stakeholder question anticipation'],
        nextSteps: ['Advanced crisis communication', 'Board preparation module']
      },
      retryPolicy: { maxAttempts: 5, cooldownPeriod: 0, improvementRequired: false }
    },
    ratings: {
      averageRating: 4.4,
      totalRatings: 156,
      effectiveness: 0.87,
      careerRelevance: 0.89,
      difficultyAccuracy: 0.92,
      userReviews: [
        {
          userId: 'user-jennifer-kim',
          rating: 4,
          review: 'Great practical framework for stakeholder updates. The blocker communication section was particularly helpful.',
          careerRelevance: 4,
          effectiveness: 5,
          createdAt: new Date('2024-10-08'),
          helpful: 8
        }
      ]
    },
    tags: ['stakeholder-communication', 'progress-reporting', 'blocker-management', 'executive-updates'],
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-10-12')
  }
]

// Mock Practice Modules - Strategic Thinking
const strategicThinkingModules: PracticeModule[] = [
  {
    id: 'strategic-market-positioning',
    title: 'Market Positioning: Competitive Intelligence & Strategic Narrative',
    description: 'Develop the skills to analyze competitive landscape and position products strategically in the market.',
    shortDescription: 'Master competitive analysis and strategic market positioning',
    category: mockModuleCategories[1],
    subcategory: 'Market Analysis',
    difficulty: 'Practice',
    estimatedDuration: 16,
    learningObjectives: createLearningObjectives([
      'Conduct comprehensive competitive analysis',
      'Develop compelling strategic positioning narrative',
      'Identify market opportunities and threats',
      'Communicate positioning strategy to stakeholders'
    ], mockSkills[1]),
    prerequisites: ['market-research-basics'],
    skills: [mockSkills[1], mockSkills[0]], // Strategic Thinking, Executive Communication
    industryRelevance: [
      { industry: 'Consumer Technology & Apps', relevanceScore: 94, specificContext: 'Mobile app market positioning', keyRequirements: ['User acquisition strategy', 'App store optimization', 'Feature differentiation'] },
      { industry: 'Enterprise Software & B2B', relevanceScore: 90, specificContext: 'B2B software competitive positioning', keyRequirements: ['Enterprise feature comparison', 'ROI positioning', 'Integration capabilities'] }
    ],
    careerImpact: [
      { transitionType: 'PM_TO_SENIOR_PM', impactLevel: 'HIGH', specificBenefits: ['Strategic thinking demonstration', 'Market leadership capability'], timeToImpact: '3-4 weeks' },
      { transitionType: 'SENIOR_PM_TO_GROUP_PM', impactLevel: 'MEDIUM', specificBenefits: ['Portfolio strategy foundation', 'Cross-product positioning'], timeToImpact: '4-6 weeks' }
    ],
    moduleType: 'FRAMEWORK_APPLICATION',
    content: {
      type: 'FRAMEWORK_APPLICATION',
      scenarios: [
        {
          id: 'competitive-positioning-challenge',
          title: 'Competitive Response Strategy Development',
          context: 'Product strategy planning session',
          situation: 'Major competitor launched similar feature, need positioning response',
          stakeholders: ['Product Team', 'Marketing Team', 'Sales Team', 'Executive Sponsor'],
          challenges: ['Feature parity pressure', 'Differentiation challenge', 'Go-to-market timing'],
          expectedOutcome: 'Clear competitive response strategy and positioning narrative'
        }
      ],
      practiceExercises: [
        {
          id: 'positioning-narrative-development',
          type: 'ANALYSIS',
          instruction: 'Develop 3-minute competitive positioning presentation',
          timeLimit: 180,
          materials: ['Competitive analysis template', 'Market research data', 'Product feature comparison'],
          evaluationCriteria: ['Strategic insight', 'Compelling narrative', 'Actionable recommendations']
        }
      ],
      frameworkApplication: [
        {
          framework: 'JOBS_TO_BE_DONE',
          applicationContext: 'Market differentiation strategy',
          practiceScenario: 'Position product using jobs-to-be-done framework vs competitors',
          expectedApplication: 'Clear customer job differentiation and value proposition',
          commonMistakes: ['Feature-focused positioning', 'Weak customer insight', 'Generic value proposition']
        }
      ],
      realWorldContext: {
        industry: 'Consumer Technology & Apps',
        companySize: 'SCALE_UP',
        meetingType: 'PLANNING_SESSION',
        stakeholderLevel: 'DIRECTOR',
        businessContext: 'Competitive response strategy development'
      }
    },
    assessment: {
      type: 'EVALUATION',
      criteria: [
        { criterion: 'Competitive Analysis Quality', weight: 30, scoringRubric: [{ score: 5, description: 'Comprehensive competitive insight', indicators: ['Deep competitor analysis', 'Market trend identification'] }] },
        { criterion: 'Strategic Positioning', weight: 25, scoringRubric: [{ score: 5, description: 'Clear differentiation strategy', indicators: ['Unique value proposition', 'Compelling positioning'] }] },
        { criterion: 'Market Opportunity Identification', weight: 25, scoringRubric: [{ score: 5, description: 'Strategic market insights', indicators: ['Opportunity identification', 'Threat analysis'] }] },
        { criterion: 'Stakeholder Communication', weight: 20, scoringRubric: [{ score: 5, description: 'Clear strategy communication', indicators: ['Compelling narrative', 'Actionable recommendations'] }] }
      ],
      passingScore: 78,
      feedback: {
        strengths: ['Strong competitive analysis', 'Clear positioning framework'],
        improvementAreas: ['Market opportunity synthesis', 'Strategic narrative development'],
        specificSuggestions: ['Deepen market trend analysis', 'Strengthen positioning story'],
        nextSteps: ['Advanced strategy module', 'Portfolio positioning']
      },
      retryPolicy: { maxAttempts: 3, cooldownPeriod: 12, improvementRequired: true }
    },
    ratings: {
      averageRating: 4.5,
      totalRatings: 127,
      effectiveness: 0.88,
      careerRelevance: 0.91,
      difficultyAccuracy: 0.85,
      userReviews: [
        {
          userId: 'user-alex-martinez',
          rating: 5,
          review: 'Excellent framework for competitive positioning. Really helped me think strategically about market opportunities.',
          careerRelevance: 5,
          effectiveness: 4,
          createdAt: new Date('2024-10-20'),
          helpful: 15
        }
      ]
    },
    tags: ['competitive-analysis', 'market-positioning', 'strategic-narrative', 'market-intelligence'],
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-10-25')
  }
]

// Mock Practice Modules - Industry Expertise (Fintech)
const industryExpertiseModules: PracticeModule[] = [
  {
    id: 'fintech-regulatory-compliance',
    title: 'Fintech Regulatory Communication: Risk & Compliance Excellence',
    description: 'Master regulatory communication for fintech products, including risk assessment and compliance frameworks.',
    shortDescription: 'Fintech regulatory compliance and risk communication mastery',
    category: mockModuleCategories[2],
    subcategory: 'Fintech Mastery',
    difficulty: 'Mastery',
    estimatedDuration: 20,
    learningObjectives: createLearningObjectives([
      'Navigate complex fintech regulatory requirements',
      'Communicate risk assessment to stakeholders',
      'Develop compliance-first product thinking',
      'Build credibility with regulatory and legal teams'
    ], mockSkills[4]),
    prerequisites: ['fintech-fundamentals', 'risk-management-basics'],
    skills: [mockSkills[4], mockSkills[0]], // Industry Expertise, Executive Communication
    industryRelevance: [
      { industry: 'Financial Services & Fintech', relevanceScore: 98, specificContext: 'Regulatory compliance and risk management', keyRequirements: ['SEC compliance', 'Banking regulations', 'Risk frameworks'] }
    ],
    careerImpact: [
      { transitionType: 'INDUSTRY_TRANSITION', impactLevel: 'HIGH', specificBenefits: ['Fintech industry credibility', 'Regulatory expertise demonstration'], timeToImpact: '2-3 weeks' },
      { transitionType: 'PM_TO_SENIOR_PM', impactLevel: 'HIGH', specificBenefits: ['Industry expertise for senior role'], timeToImpact: '3-4 weeks' }
    ],
    moduleType: 'REAL_WORLD_PROJECT',
    content: {
      type: 'REAL_WORLD_PROJECT',
      scenarios: [
        {
          id: 'regulatory-compliance-review',
          title: 'Product Feature Regulatory Assessment',
          context: 'New feature launch preparation',
          situation: 'Assess regulatory compliance for new payment feature before launch',
          stakeholders: ['Legal Team', 'Compliance Officer', 'Risk Management', 'Engineering Team'],
          challenges: ['Complex regulatory requirements', 'Multiple jurisdiction compliance', 'Technical implementation constraints'],
          expectedOutcome: 'Regulatory approval and compliant feature launch plan'
        }
      ],
      practiceExercises: [
        {
          id: 'risk-assessment-presentation',
          type: 'PRESENTATION',
          instruction: 'Present risk assessment and mitigation plan to compliance committee',
          timeLimit: 300,
          materials: ['Regulatory framework guide', 'Risk assessment template', 'Mitigation strategies'],
          evaluationCriteria: ['Regulatory accuracy', 'Risk identification', 'Mitigation completeness']
        }
      ],
      frameworkApplication: [
        {
          framework: 'RICE',
          applicationContext: 'Regulatory feature prioritization',
          practiceScenario: 'Prioritize compliance features using risk-adjusted RICE',
          expectedApplication: 'Balanced approach to feature value and regulatory risk',
          commonMistakes: ['Ignoring regulatory impact', 'Underestimating compliance effort', 'Poor risk communication']
        }
      ],
      realWorldContext: {
        industry: 'Financial Services & Fintech',
        companySize: 'ENTERPRISE',
        meetingType: 'PLANNING_SESSION',
        stakeholderLevel: 'DIRECTOR',
        businessContext: 'Regulatory compliance planning for product launch'
      }
    },
    assessment: {
      type: 'CERTIFICATION',
      criteria: [
        { criterion: 'Regulatory Knowledge', weight: 35, scoringRubric: [{ score: 5, description: 'Expert regulatory understanding', indicators: ['Accurate regulatory interpretation', 'Compliance framework mastery'] }] },
        { criterion: 'Risk Assessment Skill', weight: 30, scoringRubric: [{ score: 5, description: 'Comprehensive risk analysis', indicators: ['Thorough risk identification', 'Effective mitigation strategies'] }] },
        { criterion: 'Stakeholder Communication', weight: 20, scoringRubric: [{ score: 5, description: 'Clear compliance communication', indicators: ['Regulatory clarity', 'Stakeholder confidence'] }] },
        { criterion: 'Product Application', weight: 15, scoringRubric: [{ score: 5, description: 'Practical compliance integration', indicators: ['Product-focused solutions', 'Implementation feasibility'] }] }
      ],
      passingScore: 85,
      feedback: {
        strengths: ['Strong regulatory foundation', 'Comprehensive risk analysis'],
        improvementAreas: ['Stakeholder engagement', 'Technical implementation'],
        specificSuggestions: ['Practice with legal team scenarios', 'Deepen technical compliance understanding'],
        nextSteps: ['Advanced fintech strategy', 'International compliance module']
      },
      retryPolicy: { maxAttempts: 2, cooldownPeriod: 48, improvementRequired: true }
    },
    ratings: {
      averageRating: 4.8,
      totalRatings: 64,
      effectiveness: 0.93,
      careerRelevance: 0.96,
      difficultyAccuracy: 0.87,
      userReviews: [
        {
          userId: 'user-david-thompson',
          rating: 5,
          review: 'As someone transitioning into fintech, this module was invaluable. The regulatory framework understanding is now my competitive advantage.',
          careerRelevance: 5,
          effectiveness: 5,
          createdAt: new Date('2024-10-18'),
          helpful: 22
        }
      ]
    },
    tags: ['fintech-regulation', 'compliance-management', 'risk-assessment', 'regulatory-communication'],
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-10-28')
  }
]

// Combine all modules
const allMockModules = [
  ...executiveCommunicationModules,
  ...strategicThinkingModules,
  ...industryExpertiseModules
]

// Mock Module Collections
export const mockModuleCollections: ModuleCollection[] = [
  {
    id: 'executive-communication-collection',
    name: 'Executive Communication Mastery',
    description: 'Comprehensive collection of executive communication modules for PM career advancement',
    modules: executiveCommunicationModules,
    categories: [mockModuleCategories[0]],
    difficultyProgression: ['Foundation', 'Practice', 'Mastery', 'Expert'],
    industryContext: 'Financial Services & Fintech',
    careerTransition: 'SENIOR_PM_TO_GROUP_PM',
    moduleCount: executiveCommunicationModules.length,
    averageDuration: '15 minutes'
  },
  {
    id: 'strategic-thinking-collection',
    name: 'Strategic Thinking Development',
    description: 'Build strategic thinking capabilities for product leadership roles',
    modules: strategicThinkingModules,
    categories: [mockModuleCategories[1]],
    difficultyProgression: ['Foundation', 'Practice', 'Mastery'],
    industryContext: 'Consumer Technology & Apps',
    careerTransition: 'PM_TO_SENIOR_PM',
    moduleCount: strategicThinkingModules.length,
    averageDuration: '14 minutes'
  },
  {
    id: 'fintech-expertise-collection',
    name: 'Fintech Industry Mastery',
    description: 'Industry-specific expertise for fintech product managers',
    modules: industryExpertiseModules,
    categories: [mockModuleCategories[2]],
    difficultyProgression: ['Foundation', 'Practice', 'Mastery'],
    industryContext: 'Financial Services & Fintech',
    careerTransition: 'INDUSTRY_TRANSITION',
    moduleCount: industryExpertiseModules.length,
    averageDuration: '18 minutes'
  }
]

// Mock Personalized Recommendations
const mockRecommendations: ModuleRecommendation[] = [
  {
    module: executiveCommunicationModules[0], // Board Presentation module
    relevanceScore: 94,
    reasoning: 'Addresses skill gaps in Executive Communication and Strategic Thinking. Essential for Group PM transition.',
    urgencyLevel: 'HIGH',
    careerImpact: 'Critical for Senior PM → Group PM transition readiness',
    timeToCompletion: 'Complete by end of week for maximum impact',
    skillGaps: ['Executive Communication', 'Strategic Thinking'],
    prerequisites: [
      { type: 'MODULE', requirement: 'executive-comm-stakeholder-basics', met: true },
      { type: 'MODULE', requirement: 'strategic-metrics-foundation', met: false, suggestion: 'Complete "Strategic Metrics Foundation" module first' }
    ],
    expectedOutcome: 'Improve executive communication by 0.4-0.6 points and increase readiness for Group PM role'
  },
  {
    module: strategicThinkingModules[0], // Market Positioning module
    relevanceScore: 87,
    reasoning: 'Highly relevant for Consumer Technology & Apps context. Strengthens strategic thinking capabilities.',
    urgencyLevel: 'MEDIUM',
    careerImpact: 'Strengthens strategic leadership for career advancement',
    timeToCompletion: 'Complete within 2 weeks',
    skillGaps: ['Strategic Thinking'],
    prerequisites: [
      { type: 'MODULE', requirement: 'market-research-basics', met: true }
    ],
    expectedOutcome: 'Improve strategic thinking by 0.3-0.5 points and build market analysis confidence'
  },
  {
    module: industryExpertiseModules[0], // Fintech Compliance module
    relevanceScore: 91,
    reasoning: 'Perfect match for Financial Services & Fintech background. Builds on existing industry expertise.',
    urgencyLevel: 'HIGH',
    careerImpact: 'Essential for fintech industry specialization and credibility',
    timeToCompletion: 'Complete within 1 week',
    skillGaps: ['Industry Expertise'],
    prerequisites: [
      { type: 'MODULE', requirement: 'fintech-fundamentals', met: true },
      { type: 'MODULE', requirement: 'risk-management-basics', met: true }
    ],
    expectedOutcome: 'Achieve fintech regulatory expertise and strengthen industry leadership credentials'
  }
]

// Mock Learning Paths
export const mockLearningPaths: LearningPath[] = [
  {
    id: 'senior-to-group-pm-path',
    name: 'Senior PM → Group PM: Leadership Readiness',
    description: 'Complete development path for Senior PM to Group PM transition with executive readiness focus',
    estimatedDuration: '6-8 weeks',
    moduleCount: 12,
    targetTransition: 'SENIOR_PM_TO_GROUP_PM',
    modules: ['executive-comm-board-prep', 'portfolio-strategy-fundamentals', 'team-development-essentials'],
    milestones: [
      { id: 'milestone-1', title: 'Master Executive Communication', description: 'Board-level presentation confidence', requirements: ['Board presentation certification'], completed: false, order: 1 },
      { id: 'milestone-2', title: 'Develop Portfolio Thinking', description: 'Multi-product strategy capability', requirements: ['Portfolio strategy module'], completed: false, order: 2 },
      { id: 'milestone-3', title: 'Build Team Leadership', description: 'PM mentorship and development', requirements: ['Team development module'], completed: false, order: 3 },
      { id: 'milestone-4', title: 'Achieve Group PM Readiness', description: 'Complete readiness assessment', requirements: ['All modules completed'], completed: false, order: 4 }
    ],
    progressTracking: 'Module completion + skill assessment + meeting application',
    createdAt: new Date('2024-10-01'),
    customizable: true
  },
  {
    id: 'fintech-specialization-path',
    name: 'Fintech PM Specialization',
    description: 'Industry-specific expertise for healthcare and life sciences product managers',
    estimatedDuration: '4-6 weeks',
    moduleCount: 15,
    targetTransition: 'INDUSTRY_TRANSITION',
    modules: ['fintech-regulatory-compliance', 'fintech-risk-management', 'financial-metrics-mastery'],
    milestones: [
      { id: 'milestone-1', title: 'Regulatory Foundation', description: 'Master compliance frameworks', requirements: ['Compliance certification'], completed: false, order: 1 },
      { id: 'milestone-2', title: 'Risk Management', description: 'Financial risk assessment', requirements: ['Risk management module'], completed: false, order: 2 },
      { id: 'milestone-3', title: 'Financial Fluency', description: 'Financial metrics and modeling', requirements: ['Financial metrics module'], completed: false, order: 3 },
      { id: 'milestone-4', title: 'Industry Expert', description: 'Fintech thought leadership', requirements: ['Industry capstone project'], completed: false, order: 4 }
    ],
    progressTracking: 'Industry knowledge + regulatory compliance + financial communication',
    createdAt: new Date('2024-09-15'),
    customizable: false
  }
]

// Mock Recommendation Engine
export const mockRecommendationEngine: RecommendationEngine = {
  userProgressAnalysis: {
    completedModules: mockUserProfile.completedModules.length,
    totalAvailableModules: 85,
    skillProgression: mockUserProfile.skillAssessment.skills.map(skill => ({
      skill: skill.skill,
      currentLevel: skill.level,
      previousLevel: skill.level - 0.3,
      progression: 0.3,
      trend: 'IMPROVING',
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    })),
    careerReadiness: {
      currentRole: mockUserProfile.currentRole,
      targetRole: mockUserProfile.targetRole,
      readinessScore: 78,
      readyAreas: ['Industry Expertise', 'Stakeholder Management'],
      developmentAreas: ['Executive Communication', 'Strategic Thinking'],
      timeToReadiness: '4-6 months',
      nextMilestones: ['Master board communication', 'Develop portfolio thinking', 'Build team leadership skills']
    },
    recentActivity: [
      {
        type: 'MODULE_COMPLETION',
        description: 'Completed "Executive Communication: Board Presentation Mastery"',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        impact: 'Improved executive presence score by 8 points'
      },
      {
        type: 'SKILL_IMPROVEMENT',
        description: 'Strategic Thinking skill improved from Level 3.0 to Level 3.2',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        impact: 'Moved closer to Group PM readiness threshold'
      }
    ],
    learningVelocity: 1.2,
    strongAreas: ['Industry Expertise', 'Stakeholder Management'],
    improvementAreas: ['Executive Communication', 'Strategic Thinking']
  },
  skillGapIdentification: [
    {
      skill: mockSkills[0], // Executive Communication
      currentLevel: 3.8,
      targetLevel: 4.5,
      gapSize: 0.7,
      priority: 'HIGH',
      recommendedModules: ['executive-comm-board-prep', 'executive-comm-stakeholder-updates'],
      timeToClose: '2-3 months',
      impactOnCareer: 'Critical for Group PM transition'
    },
    {
      skill: mockSkills[1], // Strategic Thinking
      currentLevel: 3.2,
      targetLevel: 4.0,
      gapSize: 0.8,
      priority: 'HIGH',
      recommendedModules: ['strategic-market-positioning', 'portfolio-strategy-fundamentals'],
      timeToClose: '3-4 months',
      impactOnCareer: 'Essential for senior leadership roles'
    }
  ],
  careerGoalAlignment: {
    targetRole: mockUserProfile.targetRole,
    targetIndustry: mockUserProfile.industry,
    timeframe: '4-6 months',
    alignmentScore: 78,
    keyFocusAreas: ['Executive Communication', 'Portfolio Strategy', 'Team Development'],
    missingSkills: ['Portfolio Management', 'Team Leadership'],
    strengthAreas: ['Industry Expertise', 'Stakeholder Management', 'Framework Mastery']
  },
  personalizedRecommendations: mockRecommendations
}