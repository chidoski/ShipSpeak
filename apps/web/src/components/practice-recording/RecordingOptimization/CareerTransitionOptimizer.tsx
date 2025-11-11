"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Alert, AlertDescription } from '../../ui/alert'
import { UserProfile, ExerciseContext, PMRole, IndustryType } from '../../../types/practice-recording'
import { TrendingUp, Target, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react'

interface CareerTransitionOptimizerProps {
  userProfile: UserProfile
  exerciseContext: ExerciseContext
  currentPhase: 'SETUP' | 'RECORDING' | 'PAUSED' | 'COMPLETED' | 'ANALYSIS'
}

interface TransitionGuidance {
  focusAreas: string[]
  communicationGoals: string[]
  frameworkEmphasis: string[]
  executivePresenceTargets: string[]
  industrySpecificGuidance: string[]
}

export function CareerTransitionOptimizer({ 
  userProfile, 
  exerciseContext, 
  currentPhase 
}: CareerTransitionOptimizerProps) {

  const getTransitionGuidance = (current: PMRole, target: PMRole, industry: IndustryType): TransitionGuidance => {
    const transitionKey = `${current}_TO_${target}`
    
    const baseGuidance: Record<string, Partial<TransitionGuidance>> = {
      'PO_TO_PM': {
        focusAreas: [
          'Strategic thinking development',
          'Business vocabulary acquisition', 
          'Stakeholder communication expansion',
          'Decision framework training'
        ],
        communicationGoals: [
          'Shift from delivery language to business outcome language',
          'Develop confidence in business impact articulation',
          'Practice strategic altitude control in conversations'
        ],
        frameworkEmphasis: [
          'RICE prioritization for business decisions',
          'ICE scoring for feature evaluation',
          'Jobs-to-be-Done for customer value'
        ],
        executivePresenceTargets: [
          'Business impact articulation',
          'Strategic reasoning confidence',
          'Cross-functional stakeholder adaptation'
        ]
      },
      'PM_TO_SENIOR_PM': {
        focusAreas: [
          'Executive communication mastery',
          'Trade-off articulation excellence',
          'Influence without authority development',
          'Strategic altitude control'
        ],
        communicationGoals: [
          'Master answer-first methodology for executive audiences',
          'Develop sophisticated trade-off reasoning',
          'Build confidence in challenging senior stakeholders'
        ],
        frameworkEmphasis: [
          'Advanced RICE with ROI integration',
          'OKR alignment and cascade communication',
          'Strategic framework application'
        ],
        executivePresenceTargets: [
          'Authority in multi-factor decisions',
          'Clarity in complex trade-off communication',
          'Conviction in strategic recommendations'
        ]
      },
      'SENIOR_PM_TO_GROUP_PM': {
        focusAreas: [
          'Portfolio strategy communication',
          'Team development coaching',
          'Organizational impact integration',
          'Resource allocation reasoning'
        ],
        communicationGoals: [
          'Communicate multi-product strategic thinking',
          'Develop leadership language for team development',
          'Master resource reasoning for portfolio decisions'
        ],
        frameworkEmphasis: [
          'Portfolio-level prioritization frameworks',
          'Team development methodologies',
          'Cross-product dependency planning'
        ],
        executivePresenceTargets: [
          'Leadership authority across products',
          'Mentorship and development capability',
          'Organizational strategic thinking'
        ]
      },
      'GROUP_PM_TO_DIRECTOR': {
        focusAreas: [
          'Board presentation excellence',
          'Business model fluency',
          'Market strategy articulation',
          'Vision communication mastery'
        ],
        communicationGoals: [
          'Master C-suite communication structure',
          'Develop P&L reasoning and financial articulation',
          'Build competitive positioning expertise'
        ],
        frameworkEmphasis: [
          'Business model frameworks',
          'Competitive strategy analysis',
          'Financial impact modeling'
        ],
        executivePresenceTargets: [
          'Board-ready presentation capability',
          'Financial fluency and P&L communication',
          'Vision and culture development'
        ]
      }
    }

    const industryGuidance: Record<IndustryType, string[]> = {
      healthcare: [
        'Regulatory communication (FDA, HIPAA, clinical terminology)',
        'Patient outcome prioritization in decision reasoning',
        'Clinical evidence integration in business cases',
        'Safety-first decision framework communication'
      ],
      cybersecurity: [
        'Risk communication and threat assessment articulation',
        'Technical translation for business stakeholders',
        'Compliance framework integration (SOC2, ISO27001, GDPR)',
        'Zero-trust architecture business reasoning'
      ],
      fintech: [
        'Regulatory compliance integration (SEC, banking regulations)',
        'Financial risk management communication',
        'Trust-building language for consumer confidence',
        'P&L and revenue model sophisticated articulation'
      ],
      enterprise: [
        'ROI communication and business case excellence',
        'Enterprise customer success and implementation strategy',
        'Complex stakeholder management across organizations',
        'Customer advocacy and reference development'
      ],
      consumer: [
        'User experience and behavioral psychology integration',
        'Growth metrics communication (DAU, MAU, retention)',
        'Experimentation and A/B testing business reasoning',
        'Platform strategy and network effects communication'
      ]
    }

    const guidance = baseGuidance[transitionKey] || baseGuidance['PM_TO_SENIOR_PM']
    
    return {
      focusAreas: guidance.focusAreas || [],
      communicationGoals: guidance.communicationGoals || [],
      frameworkEmphasis: guidance.frameworkEmphasis || [],
      executivePresenceTargets: guidance.executivePresenceTargets || [],
      industrySpecificGuidance: industryGuidance[industry] || []
    }
  }

  const getMeetingTypeOptimization = (meetingType: string) => {
    const optimizations: Record<string, string[]> = {
      'BOARD_PRESENTATION': [
        'Time management: Complete executive summary in first 30 seconds',
        'Confidence building: Use definitive language and acknowledge risks clearly',
        'Metrics integration: Lead with business impact and competitive position',
        'Strategic narrative: Integrate market context and business model reasoning'
      ],
      'PLANNING_SESSION': [
        'Strategic altitude: Integrate market trends and competitive analysis',
        'Resource reasoning: Articulate headcount allocation and budget prioritization',
        'Timeline communication: Provide realistic estimation with dependency awareness',
        'Cross-functional coordination: Demonstrate engineering, design, marketing alignment'
      ],
      'STAKEHOLDER_UPDATE': [
        'Progress communication: Track commitments and success criteria clearly',
        'Blocker communication: Escalate with clarity and solution proposition',
        'Executive reporting: Adapt detail levels for different audience types',
        'Action orientation: Conclude with next steps and accountability'
      ]
    }

    return optimizations[exerciseContext.type] || optimizations['STAKEHOLDER_UPDATE']
  }

  const guidance = getTransitionGuidance(
    userProfile.currentRole, 
    userProfile.targetRole, 
    exerciseContext.industryContext
  )

  const meetingOptimization = getMeetingTypeOptimization(exerciseContext.type)

  const getTransitionLabel = (current: PMRole, target: PMRole) => {
    const roleLabels: Record<PMRole, string> = {
      PO: 'Product Owner',
      PM: 'Product Manager', 
      SENIOR_PM: 'Senior PM',
      GROUP_PM: 'Group PM',
      DIRECTOR: 'Director',
      VP_PRODUCT: 'VP Product'
    }
    
    return `${roleLabels[current]} → ${roleLabels[target]}`
  }

  const getIndustryLabel = (industry: IndustryType) => {
    const industryLabels: Record<IndustryType, string> = {
      healthcare: 'Healthcare & Life Sciences',
      cybersecurity: 'Cybersecurity & Enterprise Security',
      fintech: 'Financial Services & Fintech',
      enterprise: 'Enterprise Software & B2B',
      consumer: 'Consumer Technology & Apps'
    }
    
    return industryLabels[industry]
  }

  const getPhaseSpecificGuidance = () => {
    switch (currentPhase) {
      case 'SETUP':
        return {
          title: 'Pre-Recording Optimization',
          guidance: [
            'Review your transition-specific communication goals',
            'Focus on the highlighted framework applications',
            'Remember your industry context for vocabulary choices'
          ]
        }
      case 'RECORDING':
        return {
          title: 'Live Recording Guidance', 
          guidance: [
            'Apply answer-first structure for executive presence',
            'Use frameworks naturally in your reasoning',
            'Adapt your communication style to stakeholder context'
          ]
        }
      case 'PAUSED':
        return {
          title: 'Mid-Recording Reflection',
          guidance: [
            'Consider if you\'re hitting your communication goals',
            'Adjust your approach based on real-time feedback',
            'Maintain focus on transition-specific objectives'
          ]
        }
      default:
        return {
          title: 'Career Transition Focus',
          guidance: [
            'Practice builds the specific skills for your career advancement',
            'Industry context shapes your vocabulary and examples',
            'Framework application demonstrates PM maturity'
          ]
        }
    }
  }

  const phaseGuidance = getPhaseSpecificGuidance()

  return (
    <div className="space-y-4">
      {/* Career Transition Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Career Transition Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{userProfile.currentRole}</Badge>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <Badge className="bg-blue-100 text-blue-800">{userProfile.targetRole}</Badge>
            </div>
            <Badge variant="secondary">
              {getIndustryLabel(exerciseContext.industryContext)}
            </Badge>
          </div>
          
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              <strong>{phaseGuidance.title}:</strong> This {exerciseContext.type.replace('_', ' ').toLowerCase()} practice is optimized for your {getTransitionLabel(userProfile.currentRole, userProfile.targetRole)} advancement.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Transition Focus Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidance.focusAreas.map((area, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span className="text-sm">{area}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Communication Goals for This Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {guidance.communicationGoals.map((goal, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-800">{goal}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Framework Emphasis */}
      {guidance.frameworkEmphasis.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Framework Applications to Practice</h3>
            <div className="flex flex-wrap gap-2">
              {guidance.frameworkEmphasis.map((framework, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {framework}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry-Specific Guidance */}
      {guidance.industrySpecificGuidance.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">
              {getIndustryLabel(exerciseContext.industryContext)} Context
            </h3>
            <div className="space-y-2">
              {guidance.industrySpecificGuidance.slice(0, 2).map((guidance, index) => (
                <div key={index} className="text-sm text-gray-700">
                  • {guidance}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meeting Type Optimization */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3">
            {exerciseContext.type.replace('_', ' ')} Optimization
          </h3>
          <div className="space-y-2">
            {meetingOptimization.slice(0, 3).map((optimization, index) => (
              <div key={index} className="text-sm text-gray-700">
                • {optimization}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase-Specific Guidance */}
      {currentPhase !== 'SETUP' && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Current Focus:</strong>{' '}
            {phaseGuidance.guidance.join(' • ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}