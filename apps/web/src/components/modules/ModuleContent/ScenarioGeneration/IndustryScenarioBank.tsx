/**
 * IndustryScenarioBank - Industry-specific scenario collections
 * Curated scenarios reflecting real PM challenges in different industries
 */

import React from 'react'
import { Industry, ExerciseScenario, PMFramework, StakeholderLevel, DifficultyLevel } from '@/types/module-content'

export const INDUSTRY_SCENARIOS: Record<Industry, ExerciseScenario[]> = {
  'Healthcare & Life Sciences': [
    {
      id: 'healthcare-regulatory-approval',
      title: 'FDA Regulatory Approval Communication',
      context: {
        industryContext: 'Healthcare & Life Sciences',
        companySize: 'ENTERPRISE',
        productContext: {
          productType: 'B2B',
          productStage: 'MVP',
          userBase: 'Healthcare providers',
          revenue: '$50M ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'GROWING',
          disruption: 'MEDIUM',
          regulatoryPressure: 'HIGH'
        },
        organizationalPolitics: {
          level: 'COMPLEX',
          keyPlayers: ['Chief Medical Officer', 'Regulatory Affairs', 'Engineering VP'],
          conflictAreas: ['Timeline vs Compliance', 'Feature scope vs Safety'],
          powerDynamics: ['CMO has veto power', 'Regulatory team risk-averse']
        },
        timeline: 'FDA submission deadline in 6 weeks',
        situation: 'Clinical trial data shows promising results but requires additional safety documentation. Engineering wants to add features while regulatory insists on minimal viable submission.',
        urgencyLevel: 'CRITICAL'
      },
      stakeholders: [
        {
          role: 'Chief Medical Officer',
          level: 'C_SUITE',
          name: 'Dr. Sarah Chen',
          motivation: ['Patient safety', 'Scientific integrity', 'Regulatory compliance'],
          concerns: ['Rushing to market', 'Incomplete safety data', 'Reputation risk'],
          influence: 'HIGH',
          alignment: 'NEUTRAL',
          communicationStyle: {
            preference: 'DATA_DRIVEN',
            attention: 'LONG',
            decisionStyle: 'DELIBERATE',
            expertise: 'DOMAIN_SPECIFIC'
          }
        },
        {
          role: 'VP Engineering',
          level: 'VP',
          name: 'Mark Rodriguez',
          motivation: ['Technical excellence', 'Product competitiveness', 'Team efficiency'],
          concerns: ['Feature limitations', 'Technical debt', 'Resource allocation'],
          influence: 'HIGH',
          alignment: 'OPPOSED',
          communicationStyle: {
            preference: 'TECHNICAL',
            attention: 'MEDIUM',
            decisionStyle: 'QUICK',
            expertise: 'TECHNICAL'
          }
        }
      ],
      objectives: [
        {
          id: 'regulatory-communication',
          description: 'Communicate complex regulatory requirements to technical teams',
          skillArea: 'Regulatory Communication',
          proficiencyTarget: 8,
          assessmentCriteria: ['Clarity of regulatory constraints', 'Technical feasibility assessment', 'Risk communication'],
          careerImpact: 'Critical for healthcare PM roles',
          timeToMaster: '3-6 months'
        }
      ],
      constraints: [
        {
          type: 'REGULATORY',
          description: 'FDA submission deadline cannot be moved',
          severity: 'CRITICAL',
          workaround: 'Phase approach with minimal viable submission'
        },
        {
          type: 'RESOURCE',
          description: 'Limited regulatory affairs bandwidth',
          severity: 'HIGH'
        }
      ],
      successCriteria: [
        {
          criterion: 'Clear recommendation within 30 seconds',
          weight: 0.3,
          measurement: 'Answer-first structure used',
          threshold: 8,
          examples: ['I recommend we proceed with minimal viable submission']
        },
        {
          criterion: 'Regulatory framework understanding',
          weight: 0.25,
          measurement: 'Demonstrates FDA process knowledge',
          threshold: 7,
          examples: ['References 510(k) pathway', 'Mentions predicate devices']
        }
      ],
      timeLimit: 180,
      difficulty: 'Mastery',
      careerRelevance: ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
      industryContext: ['Healthcare & Life Sciences']
    }
  ],

  'Cybersecurity & Enterprise Security': [
    {
      id: 'security-breach-response',
      title: 'Security Breach Communication During Crisis',
      context: {
        industryContext: 'Cybersecurity & Enterprise Security',
        companySize: 'SCALE_UP',
        productContext: {
          productType: 'B2B',
          productStage: 'GROWTH',
          userBase: 'Enterprise IT teams',
          revenue: '$25M ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'GROWING',
          disruption: 'HIGH',
          regulatoryPressure: 'HIGH'
        },
        organizationalPolitics: {
          level: 'HIGHLY_COMPLEX',
          keyPlayers: ['CISO', 'Legal Counsel', 'Customer Success'],
          conflictAreas: ['Disclosure timing', 'Communication scope', 'Customer retention'],
          powerDynamics: ['Legal has final say on external comms', 'Customer Success owns retention']
        },
        timeline: 'Customer notification required within 24 hours',
        situation: 'Zero-day vulnerability discovered in core product. 30% of enterprise customers potentially affected. Fix available but requires emergency deployment.',
        urgencyLevel: 'CRITICAL'
      },
      stakeholders: [
        {
          role: 'Chief Information Security Officer',
          level: 'C_SUITE',
          name: 'Alex Thompson',
          motivation: ['Risk mitigation', 'Compliance', 'Customer trust'],
          concerns: ['Disclosure liability', 'Competitive advantage loss', 'Regulatory penalties'],
          influence: 'HIGH',
          alignment: 'ALIGNED',
          communicationStyle: {
            preference: 'DATA_DRIVEN',
            attention: 'MEDIUM',
            decisionStyle: 'QUICK',
            expertise: 'TECHNICAL'
          }
        }
      ],
      objectives: [
        {
          id: 'crisis-communication',
          description: 'Master crisis communication under extreme pressure',
          skillArea: 'Crisis Management',
          proficiencyTarget: 9,
          assessmentCriteria: ['Calm authority', 'Clear action plan', 'Stakeholder confidence'],
          careerImpact: 'Essential for senior security PM roles',
          timeToMaster: '6-12 months'
        }
      ],
      constraints: [
        {
          type: 'TIME',
          description: '24-hour customer notification deadline',
          severity: 'CRITICAL'
        },
        {
          type: 'REGULATORY',
          description: 'SOC 2 compliance requirements',
          severity: 'HIGH'
        }
      ],
      successCriteria: [
        {
          criterion: 'Confidence under pressure',
          weight: 0.3,
          measurement: 'Executive presence score',
          threshold: 8,
          examples: ['Calm, authoritative tone', 'Clear action plan']
        }
      ],
      timeLimit: 120,
      difficulty: 'Expert',
      careerRelevance: ['SENIOR_PM_TO_GROUP_PM', 'GROUP_PM_TO_DIRECTOR'],
      industryContext: ['Cybersecurity & Enterprise Security']
    }
  ],

  'Financial Services & Fintech': [
    {
      id: 'fintech-regulatory-compliance',
      title: 'SEC Regulatory Inquiry Response',
      context: {
        industryContext: 'Financial Services & Fintech',
        companySize: 'SCALE_UP',
        productContext: {
          productType: 'B2C',
          productStage: 'GROWTH',
          userBase: 'Retail investors',
          revenue: '$100M ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'HYPERGROWTH',
          disruption: 'HIGH',
          regulatoryPressure: 'CRITICAL'
        },
        organizationalPolitics: {
          level: 'HIGHLY_COMPLEX',
          keyPlayers: ['Chief Compliance Officer', 'CEO', 'Legal General Counsel'],
          conflictAreas: ['Feature rollback vs compliance', 'Customer communication', 'Timeline pressure'],
          powerDynamics: ['CCO has regulatory veto power', 'CEO focused on growth metrics']
        },
        timeline: 'SEC response required in 10 business days',
        situation: 'SEC inquiry about new algorithmic trading feature launched last quarter. Questions about adequate risk disclosures and suitability assessments for retail users.',
        urgencyLevel: 'CRITICAL'
      },
      stakeholders: [
        {
          role: 'Chief Compliance Officer',
          level: 'C_SUITE',
          name: 'Jennifer Kim',
          motivation: ['Regulatory compliance', 'Risk mitigation', 'Company protection'],
          concerns: ['Enforcement action', 'Fine exposure', 'License risk'],
          influence: 'HIGH',
          alignment: 'ALIGNED',
          communicationStyle: {
            preference: 'DETAIL_ORIENTED',
            attention: 'LONG',
            decisionStyle: 'DELIBERATE',
            expertise: 'DOMAIN_SPECIFIC'
          }
        }
      ],
      objectives: [
        {
          id: 'regulatory-expertise',
          description: 'Demonstrate deep regulatory knowledge in fintech context',
          skillArea: 'Regulatory Affairs',
          proficiencyTarget: 9,
          assessmentCriteria: ['SEC regulation knowledge', 'Risk assessment accuracy', 'Compliance strategy'],
          careerImpact: 'Critical for fintech leadership roles',
          timeToMaster: '12-18 months'
        }
      ],
      constraints: [
        {
          type: 'REGULATORY',
          description: 'SEC response deadline',
          severity: 'CRITICAL'
        },
        {
          type: 'BUDGET',
          description: 'Potential fine exposure $10M+',
          severity: 'HIGH'
        }
      ],
      successCriteria: [
        {
          criterion: 'Regulatory knowledge demonstration',
          weight: 0.4,
          measurement: 'Specific SEC rule references',
          threshold: 8,
          examples: ['Cites Regulation Best Interest', 'References suitability requirements']
        }
      ],
      timeLimit: 300,
      difficulty: 'Expert',
      careerRelevance: ['SENIOR_PM_TO_GROUP_PM', 'GROUP_PM_TO_DIRECTOR'],
      industryContext: ['Financial Services & Fintech']
    }
  ],

  'Enterprise Software & B2B': [
    {
      id: 'enterprise-roi-justification',
      title: 'Enterprise ROI Defense to CFO Committee',
      context: {
        industryContext: 'Enterprise Software & B2B',
        companySize: 'ENTERPRISE',
        productContext: {
          productType: 'B2B',
          productStage: 'MATURITY',
          userBase: 'Enterprise customers',
          revenue: '$500M ARR',
          complexity: 'HIGH'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'STABLE',
          disruption: 'MEDIUM',
          regulatoryPressure: 'LOW'
        },
        organizationalPolitics: {
          level: 'COMPLEX',
          keyPlayers: ['CFO', 'Sales VP', 'Customer Success VP'],
          conflictAreas: ['Development cost vs revenue potential', 'Short-term vs long-term ROI'],
          powerDynamics: ['CFO controls budget approval', 'Sales has revenue accountability']
        },
        timeline: 'Budget approval meeting in 3 days',
        situation: 'Proposed $5M investment in AI-powered analytics feature. CFO questioning ROI projections. Sales team claims competitive necessity but limited customer validation.',
        urgencyLevel: 'HIGH'
      },
      stakeholders: [
        {
          role: 'Chief Financial Officer',
          level: 'C_SUITE',
          name: 'David Chen',
          motivation: ['ROI optimization', 'Cost control', 'Shareholder value'],
          concerns: ['Uncertain payback period', 'Development risk', 'Opportunity cost'],
          influence: 'HIGH',
          alignment: 'OPPOSED',
          communicationStyle: {
            preference: 'DATA_DRIVEN',
            attention: 'MEDIUM',
            decisionStyle: 'DELIBERATE',
            expertise: 'BUSINESS'
          }
        }
      ],
      objectives: [
        {
          id: 'financial-communication',
          description: 'Master financial justification and ROI communication',
          skillArea: 'Financial Analysis',
          proficiencyTarget: 8,
          assessmentCriteria: ['ROI calculation accuracy', 'Risk assessment', 'Business case strength'],
          careerImpact: 'Essential for enterprise PM advancement',
          timeToMaster: '6-9 months'
        }
      ],
      constraints: [
        {
          type: 'BUDGET',
          description: '$5M development investment required',
          severity: 'HIGH'
        },
        {
          type: 'TIME',
          description: 'Competitive window closing',
          severity: 'MEDIUM'
        }
      ],
      successCriteria: [
        {
          criterion: 'ROI framework usage',
          weight: 0.35,
          measurement: 'Financial framework application',
          threshold: 8,
          examples: ['NPV calculation', 'Payback period analysis', 'Risk-adjusted ROI']
        }
      ],
      timeLimit: 240,
      difficulty: 'Practice',
      careerRelevance: ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
      industryContext: ['Enterprise Software & B2B']
    }
  ],

  'Consumer Technology & Apps': [
    {
      id: 'consumer-growth-metrics',
      title: 'User Growth Optimization Under Acquisition Cost Pressure',
      context: {
        industryContext: 'Consumer Technology & Apps',
        companySize: 'SCALE_UP',
        productContext: {
          productType: 'B2C',
          productStage: 'GROWTH',
          userBase: '10M MAU',
          revenue: '$50M ARR',
          complexity: 'MEDIUM'
        },
        marketConditions: {
          competitiveIntensity: 'HIGH',
          growthRate: 'GROWING',
          disruption: 'HIGH',
          regulatoryPressure: 'MEDIUM'
        },
        organizationalPolitics: {
          level: 'MODERATE',
          keyPlayers: ['Growth VP', 'Marketing VP', 'Engineering Director'],
          conflictAreas: ['CAC vs LTV optimization', 'Feature velocity vs growth experiments'],
          powerDynamics: ['Growth VP owns metrics', 'Marketing controls spend']
        },
        timeline: 'Board meeting next week showing growth metrics',
        situation: 'User acquisition cost increased 40% while conversion rates declined 15%. Growth team wants more experiments while engineering pushes feature development.',
        urgencyLevel: 'HIGH'
      },
      stakeholders: [
        {
          role: 'VP Growth',
          level: 'VP',
          name: 'Sarah Martinez',
          motivation: ['User growth', 'CAC optimization', 'Conversion improvement'],
          concerns: ['Growth plateau', 'Investor pressure', 'Competitive threats'],
          influence: 'HIGH',
          alignment: 'ALIGNED',
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
          id: 'growth-optimization',
          description: 'Master growth metrics and optimization strategies',
          skillArea: 'Growth Strategy',
          proficiencyTarget: 8,
          assessmentCriteria: ['Metrics knowledge', 'Optimization strategy', 'Data-driven reasoning'],
          careerImpact: 'Critical for consumer product PM roles',
          timeToMaster: '4-6 months'
        }
      ],
      constraints: [
        {
          type: 'BUDGET',
          description: 'CAC budget pressure from investors',
          severity: 'HIGH'
        },
        {
          type: 'RESOURCE',
          description: 'Engineering capacity constraints',
          severity: 'MEDIUM'
        }
      ],
      successCriteria: [
        {
          criterion: 'Growth framework application',
          weight: 0.3,
          measurement: 'CAC/LTV analysis demonstrated',
          threshold: 7,
          examples: ['Cohort analysis', 'Funnel optimization', 'A/B test strategy']
        }
      ],
      timeLimit: 180,
      difficulty: 'Practice',
      careerRelevance: ['PM_TO_SENIOR_PM'],
      industryContext: ['Consumer Technology & Apps']
    }
  ],

  // Additional industries with placeholder scenarios
  'E-commerce & Marketplace': [],
  'Media & Entertainment': [],
  'Education Technology': [],
  'Real Estate Technology': [],
  'Transportation & Mobility': []
}

export interface IndustryScenarioBankProps {
  industry: Industry
  difficulty: DifficultyLevel
  onScenarioSelect: (scenario: ExerciseScenario) => void
}

export function IndustryScenarioBank({
  industry,
  difficulty,
  onScenarioSelect
}: IndustryScenarioBankProps) {
  const scenarios = INDUSTRY_SCENARIOS[industry] || []
  const filteredScenarios = scenarios.filter(scenario => 
    scenario.difficulty === difficulty || 
    (difficulty === 'Foundation' && ['Foundation', 'Practice', 'Mastery'].includes(scenario.difficulty)) ||
    (difficulty === 'Practice' && ['Foundation', 'Practice', 'Mastery'].includes(scenario.difficulty))
  )

  const getScenarioComplexity = (scenario: ExerciseScenario): string => {
    const stakeholderCount = scenario.stakeholders.length
    const constraintCount = scenario.constraints.length
    
    if (stakeholderCount >= 3 && constraintCount >= 3) return 'High'
    if (stakeholderCount >= 2 && constraintCount >= 2) return 'Medium'
    return 'Low'
  }

  const getTimeEstimate = (scenario: ExerciseScenario): string => {
    const baseTime = scenario.timeLimit || 300
    return `${Math.floor(baseTime / 60)}-${Math.ceil((baseTime + 120) / 60)} min`
  }

  if (filteredScenarios.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          scenarios available
        </h3>
        <p className="text-gray-600">
          Scenarios for {industry} at {difficulty} level are coming soon.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {industry} Scenarios
        </h3>
        <span className="text-sm text-gray-500">
          {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''} available
        </span>
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scenario.context.urgencyLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                  scenario.context.urgencyLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {scenario.context.urgencyLevel}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {scenario.context.situation}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>{scenario.stakeholders.length} stakeholder{scenario.stakeholders.length !== 1 ? 's' : ''}</span>
                <span>Complexity: {getScenarioComplexity(scenario)}</span>
                <span>{getTimeEstimate(scenario)}</span>
              </div>
              
              <div className="flex -space-x-1">
                {scenario.stakeholders.slice(0, 3).map((stakeholder, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-executive-primary rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-semibold"
                    title={stakeholder.name}
                  >
                    {stakeholder.name.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
                {scenario.stakeholders.length > 3 && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                    +{scenario.stakeholders.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {scenario.objectives.slice(0, 2).map((objective, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {objective.skillArea}
                  </span>
                ))}
                {scenario.objectives.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{scenario.objectives.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}