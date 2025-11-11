/**
 * CareerTransitionScenarios - PM career transition-specific scenarios
 * Targeted scenarios for each PM career transition pattern
 */

import React from 'react'
import { PMTransitionType, ExerciseScenario, DifficultyLevel } from '@/types/module-content'

export const TRANSITION_SCENARIOS: Record<PMTransitionType, ExerciseScenario[]> = {
  PO_TO_PM: [
    {
      id: 'po-to-pm-strategic-thinking',
      title: 'Strategic Product Roadmap Planning',
      context: {
        industryContext: 'Enterprise Software & B2B',
        companySize: 'SCALE_UP',
        productContext: {
          productType: 'B2B',
          productStage: 'GROWTH',
          userBase: 'Mid-market businesses',
          revenue: '$10M ARR',
          complexity: 'MEDIUM'
        },
        marketConditions: {
          competitiveIntensity: 'MEDIUM',
          growthRate: 'GROWING',
          disruption: 'MEDIUM',
          regulatoryPressure: 'LOW'
        },
        organizationalPolitics: {
          level: 'MODERATE',
          keyPlayers: ['VP Product', 'Engineering Director', 'Sales Director'],
          conflictAreas: ['Feature requests vs platform investment', 'Short-term revenue vs long-term vision'],
          powerDynamics: ['Sales has strong voice in prioritization', 'Engineering wants technical debt reduction']
        },
        timeline: 'Quarterly roadmap review next week',
        situation: 'Transitioning from backlog management to strategic roadmap planning. Need to present 6-month vision balancing customer requests, technical debt, and market opportunities.',
        urgencyLevel: 'HIGH'
      },
      stakeholders: [
        {
          role: 'VP Product',
          level: 'VP',
          name: 'Lisa Chen',
          motivation: ['Strategic vision', 'Market positioning', 'Team development'],
          concerns: ['Strategic thinking depth', 'Market awareness', 'Stakeholder alignment'],
          influence: 'HIGH',
          alignment: 'ALIGNED',
          communicationStyle: {
            preference: 'BIG_PICTURE',
            attention: 'MEDIUM',
            decisionStyle: 'DELIBERATE',
            expertise: 'BUSINESS'
          }
        },
        {
          role: 'Sales Director',
          level: 'DIRECTOR',
          name: 'Mark Thompson',
          motivation: ['Revenue growth', 'Customer satisfaction', 'Deal velocity'],
          concerns: ['Feature gaps losing deals', 'Competitive differentiation', 'Customer commitments'],
          influence: 'HIGH',
          alignment: 'NEUTRAL',
          communicationStyle: {
            preference: 'DATA_DRIVEN',
            attention: 'SHORT',
            decisionStyle: 'QUICK',
            expertise: 'BUSINESS'
          }
        }
      ],
      objectives: [
        {
          id: 'strategic-vision',
          description: 'Develop and communicate strategic product vision beyond tactical features',
          skillArea: 'Strategic Thinking',
          proficiencyTarget: 7,
          assessmentCriteria: ['Market analysis depth', 'Vision clarity', 'Stakeholder alignment'],
          careerImpact: 'Essential for PO to PM transition',
          timeToMaster: '3-6 months'
        }
      ],
      constraints: [
        {
          type: 'TIME',
          description: 'Quarterly planning deadline',
          severity: 'HIGH'
        },
        {
          type: 'RESOURCE',
          description: 'Engineering capacity for 2 major initiatives max',
          severity: 'MEDIUM'
        }
      ],
      successCriteria: [
        {
          criterion: 'Strategic framework usage',
          weight: 0.3,
          measurement: 'Use of strategic frameworks like Jobs-to-be-Done',
          threshold: 7,
          examples: ['Customer journey analysis', 'Market opportunity sizing']
        }
      ],
      timeLimit: 240,
      difficulty: 'Practice',
      careerRelevance: ['PO_TO_PM'],
      industryContext: ['Enterprise Software & B2B']
    }
  ],

  PM_TO_SENIOR_PM: [
    {
      id: 'pm-to-senior-executive-presence',
      title: 'Board Presentation on Product Strategy',
      context: {
        industryContext: 'Consumer Technology & Apps',
        companySize: 'ENTERPRISE',
        productContext: {
          productType: 'B2C',
          productStage: 'MATURITY',
          userBase: '50M MAU',
          revenue: '$200M ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'STABLE',
          disruption: 'HIGH',
          regulatoryPressure: 'MEDIUM'
        },
        organizationalPolitics: {
          level: 'COMPLEX',
          keyPlayers: ['CEO', 'Board Members', 'CPO'],
          conflictAreas: ['Growth vs profitability', 'Innovation vs optimization'],
          powerDynamics: ['Board has strategic oversight', 'CEO drives execution priorities']
        },
        timeline: 'Board meeting in 48 hours',
        situation: 'User growth plateauing while competition intensifies. Board questions current product strategy effectiveness. Need to present strategy for next 18 months with confidence.',
        urgencyLevel: 'CRITICAL'
      },
      stakeholders: [
        {
          role: 'Board Member',
          level: 'BOARD',
          name: 'James Wilson',
          motivation: ['Shareholder value', 'Strategic direction', 'Risk management'],
          concerns: ['Competitive threats', 'Growth sustainability', 'Management execution'],
          influence: 'HIGH',
          alignment: 'NEUTRAL',
          communicationStyle: {
            preference: 'BIG_PICTURE',
            attention: 'SHORT',
            decisionStyle: 'DELIBERATE',
            expertise: 'BUSINESS'
          }
        }
      ],
      objectives: [
        {
          id: 'executive-presence',
          description: 'Master board-level communication with executive presence',
          skillArea: 'Executive Presence',
          proficiencyTarget: 8,
          assessmentCriteria: ['Confidence projection', 'Strategic articulation', 'Question handling'],
          careerImpact: 'Critical for senior PM advancement',
          timeToMaster: '6-12 months'
        }
      ],
      constraints: [
        {
          type: 'TIME',
          description: '20-minute presentation slot',
          severity: 'HIGH'
        },
        {
          type: 'POLITICAL',
          description: 'Board confidence in management team',
          severity: 'HIGH'
        }
      ],
      successCriteria: [
        {
          criterion: 'Answer-first executive communication',
          weight: 0.4,
          measurement: 'Opens with clear strategic recommendation',
          threshold: 8,
          examples: ['I recommend we pivot to platform strategy']
        }
      ],
      timeLimit: 120,
      difficulty: 'Mastery',
      careerRelevance: ['PM_TO_SENIOR_PM'],
      industryContext: ['Consumer Technology & Apps']
    }
  ],

  SENIOR_PM_TO_GROUP_PM: [
    {
      id: 'senior-to-group-portfolio-strategy',
      title: 'Multi-Product Portfolio Strategy Communication',
      context: {
        industryContext: 'Financial Services & Fintech',
        companySize: 'ENTERPRISE',
        productContext: {
          productType: 'B2B2C',
          productStage: 'MATURITY',
          userBase: 'Financial institutions + end consumers',
          revenue: '$500M ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'STABLE',
          disruption: 'HIGH',
          regulatoryPressure: 'HIGH'
        },
        organizationalPolitics: {
          level: 'HIGHLY_COMPLEX',
          keyPlayers: ['CPO', 'Individual PMs', 'Engineering VPs', 'Business Line Heads'],
          conflictAreas: ['Resource allocation across products', 'Platform vs product investments'],
          powerDynamics: ['Business lines own P&L', 'Engineering shared across products']
        },
        timeline: 'Annual planning process starting next month',
        situation: 'Managing portfolio of 5 products with competing resource needs. Need to communicate unified strategy that balances individual product goals with platform synergies.',
        urgencyLevel: 'HIGH'
      },
      stakeholders: [
        {
          role: 'Product Manager',
          level: 'MANAGER',
          name: 'Sarah Martinez',
          motivation: ['Product success', 'Team resources', 'Career advancement'],
          concerns: ['Resource competition', 'Product roadmap impact', 'Team priorities'],
          influence: 'MEDIUM',
          alignment: 'NEUTRAL',
          communicationStyle: {
            preference: 'DATA_DRIVEN',
            attention: 'MEDIUM',
            decisionStyle: 'DELIBERATE',
            expertise: 'TECHNICAL'
          }
        }
      ],
      objectives: [
        {
          id: 'portfolio-strategy',
          description: 'Develop portfolio-level strategic thinking and communication',
          skillArea: 'Portfolio Management',
          proficiencyTarget: 8,
          assessmentCriteria: ['Portfolio coherence', 'Resource optimization', 'Strategic trade-offs'],
          careerImpact: 'Essential for Group PM roles',
          timeToMaster: '6-9 months'
        }
      ],
      constraints: [
        {
          type: 'RESOURCE',
          description: 'Shared engineering capacity across products',
          severity: 'HIGH'
        },
        {
          type: 'POLITICAL',
          description: 'Individual PM autonomy expectations',
          severity: 'MEDIUM'
        }
      ],
      successCriteria: [
        {
          criterion: 'Portfolio optimization framework',
          weight: 0.35,
          measurement: 'Demonstrates portfolio-level thinking',
          threshold: 7,
          examples: ['Platform investment rationale', 'Cross-product synergies']
        }
      ],
      timeLimit: 300,
      difficulty: 'Mastery',
      careerRelevance: ['SENIOR_PM_TO_GROUP_PM'],
      industryContext: ['Financial Services & Fintech']
    }
  ],

  GROUP_PM_TO_DIRECTOR: [
    {
      id: 'group-to-director-organizational-leadership',
      title: 'Organizational Product Vision and Team Leadership',
      context: {
        industryContext: 'Healthcare & Life Sciences',
        companySize: 'ENTERPRISE',
        productContext: {
          productType: 'B2B',
          productStage: 'MATURITY',
          userBase: 'Healthcare systems',
          revenue: '$1B ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'MEDIUM',
          growthRate: 'STABLE',
          disruption: 'MEDIUM',
          regulatoryPressure: 'CRITICAL'
        },
        organizationalPolitics: {
          level: 'HIGHLY_COMPLEX',
          keyPlayers: ['C-Suite', 'Product Teams', 'Business Units', 'Regulatory Affairs'],
          conflictAreas: ['Innovation vs compliance', 'Centralized vs decentralized product'],
          powerDynamics: ['Regulatory has veto power', 'Business units control budgets']
        },
        timeline: 'Product organization restructure announcement next month',
        situation: 'Leading 30-person product organization through strategic transformation. Need to communicate vision for product-led growth while maintaining regulatory excellence.',
        urgencyLevel: 'HIGH'
      },
      stakeholders: [
        {
          role: 'Group PM',
          level: 'DIRECTOR',
          name: 'Alex Chen',
          motivation: ['Team development', 'Product excellence', 'Career growth'],
          concerns: ['Organizational change', 'Role clarity', 'Resource access'],
          influence: 'MEDIUM',
          alignment: 'ALIGNED',
          communicationStyle: {
            preference: 'DETAIL_ORIENTED',
            attention: 'LONG',
            decisionStyle: 'DELIBERATE',
            expertise: 'BOTH'
          }
        }
      ],
      objectives: [
        {
          id: 'organizational-leadership',
          description: 'Lead large product organization with vision and influence',
          skillArea: 'Organizational Leadership',
          proficiencyTarget: 9,
          assessmentCriteria: ['Vision communication', 'Change leadership', 'Team inspiration'],
          careerImpact: 'Critical for Director+ roles',
          timeToMaster: '12-18 months'
        }
      ],
      constraints: [
        {
          type: 'ORGANIZATIONAL',
          description: 'Existing team structure and relationships',
          severity: 'HIGH'
        },
        {
          type: 'REGULATORY',
          description: 'Healthcare compliance requirements',
          severity: 'CRITICAL'
        }
      ],
      successCriteria: [
        {
          criterion: 'Organizational vision clarity',
          weight: 0.4,
          measurement: 'Inspirational and actionable vision',
          threshold: 8,
          examples: ['Clear transformation narrative', 'Individual role connections']
        }
      ],
      timeLimit: 360,
      difficulty: 'Expert',
      careerRelevance: ['GROUP_PM_TO_DIRECTOR'],
      industryContext: ['Healthcare & Life Sciences']
    }
  ],

  DIRECTOR_TO_VP: [
    {
      id: 'director-to-vp-business-strategy',
      title: 'Market Strategy and Business Model Innovation',
      context: {
        industryContext: 'Enterprise Software & B2B',
        companySize: 'ENTERPRISE',
        productContext: {
          productType: 'B2B',
          productStage: 'MATURITY',
          userBase: 'Enterprise customers',
          revenue: '$2B ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'DECLINING',
          disruption: 'HIGH',
          regulatoryPressure: 'MEDIUM'
        },
        organizationalPolitics: {
          level: 'HIGHLY_COMPLEX',
          keyPlayers: ['CEO', 'Board', 'Business Unit Leaders', 'Sales Leadership'],
          conflictAreas: ['Traditional vs new business models', 'Short-term revenue vs transformation'],
          powerDynamics: ['CEO drives strategic decisions', 'Sales owns customer relationships']
        },
        timeline: 'Strategic planning offsite next quarter',
        situation: 'Market disruption threatening core business model. Need to articulate strategy for business model evolution while maintaining current revenue streams.',
        urgencyLevel: 'CRITICAL'
      },
      stakeholders: [
        {
          role: 'Chief Executive Officer',
          level: 'C_SUITE',
          name: 'Michael Johnson',
          motivation: ['Shareholder value', 'Market leadership', 'Strategic transformation'],
          concerns: ['Disruption risk', 'Execution capability', 'Timeline pressure'],
          influence: 'HIGH',
          alignment: 'ALIGNED',
          communicationStyle: {
            preference: 'BIG_PICTURE',
            attention: 'SHORT',
            decisionStyle: 'QUICK',
            expertise: 'BUSINESS'
          }
        }
      ],
      objectives: [
        {
          id: 'business-strategy',
          description: 'Master business-level strategy and market positioning',
          skillArea: 'Business Strategy',
          proficiencyTarget: 9,
          assessmentCriteria: ['Market analysis', 'Business model innovation', 'Strategic communication'],
          careerImpact: 'Essential for VP Product roles',
          timeToMaster: '18-24 months'
        }
      ],
      constraints: [
        {
          type: 'BUDGET',
          description: 'Transformation investment while maintaining profitability',
          severity: 'HIGH'
        },
        {
          type: 'TIME',
          description: 'Competitive pressure accelerating',
          severity: 'CRITICAL'
        }
      ],
      successCriteria: [
        {
          criterion: 'Business model articulation',
          weight: 0.4,
          measurement: 'Clear business strategy communication',
          threshold: 9,
          examples: ['Market opportunity sizing', 'Competitive differentiation', 'Financial projections']
        }
      ],
      timeLimit: 420,
      difficulty: 'Expert',
      careerRelevance: ['DIRECTOR_TO_VP'],
      industryContext: ['Enterprise Software & B2B']
    }
  ],

  // Placeholder for other transition types
  INDUSTRY_TRANSITION: [],
  COMPANY_SIZE_TRANSITION: []
}

export interface CareerTransitionScenariosProps {
  transitionType: PMTransitionType
  difficulty: DifficultyLevel
  onScenarioSelect: (scenario: ExerciseScenario) => void
}

export function CareerTransitionScenarios({
  transitionType,
  difficulty,
  onScenarioSelect
}: CareerTransitionScenariosProps) {
  const scenarios = TRANSITION_SCENARIOS[transitionType] || []
  const filteredScenarios = scenarios.filter(scenario => 
    scenario.difficulty === difficulty ||
    (difficulty === 'Foundation' && ['Foundation', 'Practice', 'Mastery'].includes(scenario.difficulty)) ||
    (difficulty === 'Practice' && ['Foundation', 'Practice', 'Mastery', 'Expert'].includes(scenario.difficulty))
  )

  const getTransitionDescription = (transition: PMTransitionType): string => {
    const descriptions = {
      PO_TO_PM: 'Product Owner to Product Manager - Strategic thinking and business acumen development',
      PM_TO_SENIOR_PM: 'PM to Senior PM - Executive presence and influence without authority',
      SENIOR_PM_TO_GROUP_PM: 'Senior PM to Group PM - Portfolio management and team leadership',
      GROUP_PM_TO_DIRECTOR: 'Group PM to Director - Organizational leadership and vision setting',
      DIRECTOR_TO_VP: 'Director to VP Product - Business strategy and market positioning',
      INDUSTRY_TRANSITION: 'Industry Transition - Sector-specific knowledge and adaptation',
      COMPANY_SIZE_TRANSITION: 'Company Size Transition - Scale-appropriate communication and processes'
    }
    return descriptions[transition] || 'Career transition scenarios'
  }

  if (filteredScenarios.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Scenarios Coming Soon
        </h3>
        <p className="text-gray-600 mb-4">
          {getTransitionDescription(transitionType)}
        </p>
        <p className="text-sm text-gray-500">
          Targeted scenarios for this transition are being developed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {transitionType.replace(/_/g, ' ').toUpperCase()} Scenarios
        </h3>
        <p className="text-sm text-gray-600">
          {getTransitionDescription(transitionType)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-executive-primary hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onScenarioSelect(scenario)}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scenario.difficulty === 'Foundation' ? 'bg-green-100 text-green-800' :
                  scenario.difficulty === 'Practice' ? 'bg-blue-100 text-blue-800' :
                  scenario.difficulty === 'Mastery' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {scenario.difficulty}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3">
              {scenario.context.situation}
            </p>

            <div className="space-y-2">
              {scenario.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-executive-primary rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    <strong>{objective.skillArea}:</strong> {objective.description}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>{scenario.stakeholders.length} stakeholder{scenario.stakeholders.length !== 1 ? 's' : ''}</span>
              <span>Industry: {scenario.context.industryContext}</span>
              <span>{scenario.timeLimit ? `${Math.floor(scenario.timeLimit / 60)} min` : 'Flexible timing'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}