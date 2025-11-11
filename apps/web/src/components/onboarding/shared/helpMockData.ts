import type { HelpGuide, HelpCategory } from '../../../types/onboarding'

export const mockHelpGuides: HelpGuide[] = [
  {
    id: 'executive-communication-fundamentals',
    title: 'Executive Communication Fundamentals for PM → Senior PM',
    category: 'CAREER_DEVELOPMENT',
    content: 'Learn answer-first methodology and strategic communication patterns essential for Senior PM success...',
    searchTags: ['executive', 'communication', 'answer-first', 'senior pm', 'c-suite'],
    careerRelevance: ['PM_TO_SENIOR_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'INTERMEDIATE',
    estimatedReadTime: 8
  },
  {
    id: 'meeting-upload-optimization',
    title: 'Optimize Meeting Uploads for Better Analysis',
    category: 'GETTING_STARTED',
    content: 'Best practices for selecting and uploading meetings that generate the most valuable practice modules...',
    searchTags: ['meeting', 'upload', 'analysis', 'optimization', 'audio quality'],
    careerRelevance: ['PO_TO_PM', 'PM_TO_SENIOR_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'BEGINNER',
    estimatedReadTime: 5
  },
  {
    id: 'fintech-regulatory-communication',
    title: 'Fintech PM Regulatory Communication Mastery',
    category: 'INDUSTRY_SPECIFIC',
    content: 'Navigate SEC compliance, banking regulations, and financial risk communication for fintech PMs...',
    searchTags: ['fintech', 'regulatory', 'compliance', 'sec', 'banking', 'risk'],
    careerRelevance: ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
    industryRelevance: ['FINTECH'],
    difficulty: 'ADVANCED',
    estimatedReadTime: 12
  },
  {
    id: 'framework-application-guide',
    title: 'PM Framework Application in Real Scenarios',
    category: 'CAREER_DEVELOPMENT',
    content: 'Master RICE, ICE, Jobs-to-be-Done frameworks with practical application in stakeholder communication...',
    searchTags: ['frameworks', 'rice', 'ice', 'jobs-to-be-done', 'prioritization', 'strategic'],
    careerRelevance: ['PO_TO_PM', 'PM_TO_SENIOR_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'INTERMEDIATE',
    estimatedReadTime: 10
  },
  {
    id: 'healthcare-pm-communication',
    title: 'Healthcare PM Communication & Regulatory Requirements',
    category: 'INDUSTRY_SPECIFIC',
    content: 'Communicate effectively with healthcare stakeholders while navigating FDA, HIPAA, and clinical requirements...',
    searchTags: ['healthcare', 'fda', 'hipaa', 'clinical', 'regulatory', 'patient safety'],
    careerRelevance: ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
    industryRelevance: ['HEALTHCARE'],
    difficulty: 'ADVANCED',
    estimatedReadTime: 15
  },
  {
    id: 'dashboard-metrics-interpretation',
    title: 'Understanding Your Progress Dashboard Metrics',
    category: 'GETTING_STARTED',
    content: 'Learn to interpret career progression metrics, skill development scores, and benchmark comparisons...',
    searchTags: ['dashboard', 'metrics', 'progress', 'career', 'benchmarks', 'scores'],
    careerRelevance: ['PO_TO_PM', 'PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'BEGINNER',
    estimatedReadTime: 6
  }
]

export const categoryLabels: Record<HelpCategory, string> = {
  'GETTING_STARTED': 'Getting Started',
  'MEETING_ANALYSIS': 'Meeting Analysis',
  'PRACTICE_MODULES': 'Practice Modules',
  'CAREER_DEVELOPMENT': 'Career Development',
  'INDUSTRY_SPECIFIC': 'Industry Specific',
  'TROUBLESHOOTING': 'Troubleshooting',
  'ADVANCED_FEATURES': 'Advanced Features'
}