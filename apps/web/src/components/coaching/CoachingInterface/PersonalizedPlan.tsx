'use client'

import React, { useState } from 'react'
import { 
  CoachingSession, 
  CoachPersona,
  UserProfile,
  DevelopmentArea,
  PMTransitionType,
  Industry,
  DevelopmentGoal,
  CoachingSessionType
} from '@/types/coaching'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface PersonalizedPlanProps {
  userProfile: UserProfile
  developmentFocus: DevelopmentArea[]
  careerContext: PMTransitionType
  industryContext: Industry
  sessionHistory: CoachingSession[]
  recommendedCoaches: CoachPersona[]
  onSessionStart: (sessionType: CoachingSessionType) => void
  onSessionEnd: () => void
  onProgressUpdate: (update: any) => void
}

export function PersonalizedPlan({
  userProfile,
  developmentFocus,
  careerContext,
  industryContext,
  sessionHistory,
  recommendedCoaches,
  onSessionStart
}: PersonalizedPlanProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30_DAYS' | '60_DAYS' | '90_DAYS'>('60_DAYS')
  
  const developmentPlan = generateDevelopmentPlan(userProfile, developmentFocus, careerContext, selectedTimeframe)
  
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Plan Overview */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Your Personalized Development Plan
        </h2>
        <p className="text-gray-600 mb-6">
          Customized coaching roadmap for your {careerContext.replace('_', ' → ')} transition in {industryContext}
        </p>
        
        {/* Timeframe Selection */}
        <div className="flex justify-center space-x-4 mb-8">
          {(['30_DAYS', '60_DAYS', '90_DAYS'] as const).map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {timeframe.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Current Status Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Development Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusItem
            label="Overall Readiness"
            value={`${calculateOverallReadiness(userProfile)}%`}
            status={calculateOverallReadiness(userProfile) >= 70 ? 'good' : 'needs_improvement'}
          />
          <StatusItem
            label="Sessions Completed"
            value={sessionHistory.filter(s => s.status === 'COMPLETED').length}
            status="neutral"
          />
          <StatusItem
            label="Top Priority Area"
            value={developmentFocus.find(area => area.priority === 'HIGH')?.name || 'None'}
            status="neutral"
          />
        </div>
      </Card>

      {/* Development Phases */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Development Phases</h3>
        <div className="space-y-6">
          {developmentPlan.phases.map((phase, index) => (
            <PhaseCard 
              key={phase.id}
              phase={phase}
              phaseNumber={index + 1}
              onStartSession={onSessionStart}
            />
          ))}
        </div>
      </div>

      {/* Recommended Coaching Schedule */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Coaching Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Weekly Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Strategic Thinking Sessions</span>
                <span className="font-medium">2x per week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Executive Presence Practice</span>
                <span className="font-medium">1x per week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry-Specific Coaching</span>
                <span className="font-medium">1x per week</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Success Milestones</h4>
            <div className="space-y-2 text-sm">
              {developmentPlan.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Coach Recommendations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recommended Coaches for Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCoaches.slice(0, 3).map(coach => (
            <CoachRecommendationCard
              key={coach.id}
              coach={coach}
              careerContext={careerContext}
              industryMatch={coach.industry === industryContext}
            />
          ))}
        </div>
      </div>

      {/* Action Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Actions</h3>
        <div className="space-y-4">
          {developmentPlan.nextActions.map((action, index) => (
            <ActionItem
              key={index}
              action={action}
              priority={index < 2 ? 'HIGH' : 'MEDIUM'}
              onStart={() => onSessionStart(action.sessionType)}
            />
          ))}
        </div>
      </Card>

      {/* Progress Tracking */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Weekly Goals</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Complete 4 coaching sessions</li>
              <li>• Practice 2 framework applications</li>
              <li>• Apply learnings in real meeting</li>
              <li>• Review session feedback</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Monthly Targets</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Advance 1 skill level in priority area</li>
              <li>• Complete industry-specific module</li>
              <li>• Achieve coaching milestone</li>
              <li>• Demonstrate improvement in real work</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

function StatusItem({ 
  label, 
  value, 
  status 
}: { 
  label: string
  value: string | number
  status: 'good' | 'needs_improvement' | 'neutral' 
}) {
  const statusColors = {
    good: 'text-green-600',
    needs_improvement: 'text-red-600',
    neutral: 'text-gray-700'
  }

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${statusColors[status]}`}>{value}</p>
    </div>
  )
}

function PhaseCard({ 
  phase, 
  phaseNumber, 
  onStartSession 
}: { 
  phase: DevelopmentPhase
  phaseNumber: number
  onStartSession: (sessionType: CoachingSessionType) => void 
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-semibold text-sm">{phaseNumber}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-medium text-gray-900">{phase.name}</h4>
            <span className="text-sm text-gray-500">{phase.duration}</span>
          </div>
          
          <p className="text-gray-600 mb-4">{phase.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Focus Areas</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                {phase.focusAreas.map((area, index) => (
                  <li key={index}>• {area}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Expected Outcomes</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                {phase.outcomes.map((outcome, index) => (
                  <li key={index}>• {outcome}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {phase.suggestedSessions.map(sessionType => (
              <Button
                key={sessionType}
                variant="outline"
                size="sm"
                onClick={() => onStartSession(sessionType)}
                className="text-xs"
              >
                Start {sessionType.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function CoachRecommendationCard({
  coach,
  careerContext,
  industryMatch
}: {
  coach: CoachPersona
  careerContext: PMTransitionType
  industryMatch: boolean
}) {
  return (
    <Card className={`p-6 ${industryMatch ? 'border-blue-200 bg-blue-50' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {coach.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        {industryMatch && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            Industry Match
          </span>
        )}
      </div>
      
      <h4 className="font-medium text-gray-900 mb-1">{coach.name}</h4>
      <p className="text-sm text-gray-600 mb-3">{coach.expertiseArea}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium">Experience:</span>
          <span className="ml-1">{coach.yearsExperience} years</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium">Style:</span>
          <span className="ml-1 capitalize">{coach.communicationStyle.toLowerCase()}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        <p className="font-medium mb-1">Best for:</p>
        <p>{getCoachFitReason(coach, careerContext)}</p>
      </div>
    </Card>
  )
}

function ActionItem({
  action,
  priority,
  onStart
}: {
  action: NextAction
  priority: 'HIGH' | 'MEDIUM'
  onStart: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${
          priority === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'
        }`} />
        <div>
          <h4 className="font-medium text-gray-900">{action.title}</h4>
          <p className="text-sm text-gray-600">{action.description}</p>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onStart}
        className="ml-4"
      >
        Start Now
      </Button>
    </div>
  )
}

// Types for development plan
interface DevelopmentPhase {
  id: string
  name: string
  duration: string
  description: string
  focusAreas: string[]
  outcomes: string[]
  suggestedSessions: CoachingSessionType[]
}

interface NextAction {
  title: string
  description: string
  sessionType: CoachingSessionType
}

interface DevelopmentPlan {
  phases: DevelopmentPhase[]
  milestones: string[]
  nextActions: NextAction[]
}

// Helper functions
function generateDevelopmentPlan(
  userProfile: UserProfile,
  developmentFocus: DevelopmentArea[],
  careerContext: PMTransitionType,
  timeframe: '30_DAYS' | '60_DAYS' | '90_DAYS'
): DevelopmentPlan {
  const plans = {
    'PO_TO_PM': {
      phases: [
        {
          id: 'foundation',
          name: 'Strategic Thinking Foundation',
          duration: '2-3 weeks',
          description: 'Build core PM strategic reasoning and customer outcome focus',
          focusAreas: ['Customer outcome thinking', 'Business value creation', 'Framework introduction'],
          outcomes: ['Clear strategic reasoning', 'Customer-first mindset', 'Basic framework usage'],
          suggestedSessions: ['STRATEGIC_THINKING' as CoachingSessionType, 'FRAMEWORK_PRACTICE' as CoachingSessionType]
        },
        {
          id: 'communication',
          name: 'PM Communication Development',
          duration: '3-4 weeks',
          description: 'Develop business stakeholder communication and PM vocabulary',
          focusAreas: ['Business vocabulary', 'Stakeholder communication', 'Executive presence basics'],
          outcomes: ['Confident business communication', 'Expanded PM vocabulary', 'Initial executive presence'],
          suggestedSessions: ['EXECUTIVE_PRESENCE' as CoachingSessionType, 'INDUSTRY_FLUENCY' as CoachingSessionType]
        }
      ],
      milestones: [
        'Master customer outcome framework',
        'Demonstrate business stakeholder communication',
        'Apply PM frameworks in real scenarios'
      ],
      nextActions: [
        {
          title: 'Practice Strategic Framework Application',
          description: 'Start with RICE or ICE prioritization in a real scenario',
          sessionType: 'FRAMEWORK_PRACTICE'
        },
        {
          title: 'Develop Business Communication',
          description: 'Practice explaining product decisions in business terms',
          sessionType: 'EXECUTIVE_PRESENCE'
        }
      ]
    },
    'PM_TO_SENIOR_PM': {
      phases: [
        {
          id: 'executive_communication',
          name: 'Executive Communication Mastery',
          duration: '3-4 weeks',
          description: 'Master answer-first methodology and C-suite communication',
          focusAreas: ['Answer-first structure', 'Executive presence', 'Authority building'],
          outcomes: ['Confident executive communication', 'Clear authority markers', 'Structured thinking'],
          suggestedSessions: ['EXECUTIVE_PRESENCE' as CoachingSessionType, 'STRATEGIC_THINKING' as CoachingSessionType]
        },
        {
          id: 'strategic_altitude',
          name: 'Strategic Altitude Control',
          duration: '3-4 weeks',
          description: 'Learn when to dive deep vs stay strategic based on audience',
          focusAreas: ['Altitude control', 'Audience adaptation', 'Strategic frameworks'],
          outcomes: ['Flexible communication depth', 'Audience-appropriate messaging', 'Advanced framework usage'],
          suggestedSessions: ['STRATEGIC_THINKING' as CoachingSessionType, 'FRAMEWORK_PRACTICE' as CoachingSessionType]
        }
      ],
      milestones: [
        'Master answer-first methodology',
        'Demonstrate strategic altitude control',
        'Build influence without authority'
      ],
      nextActions: [
        {
          title: 'Practice Executive Presentations',
          description: 'Master the 2-minute executive summary format',
          sessionType: 'EXECUTIVE_PRESENCE'
        },
        {
          title: 'Develop Strategic Altitude',
          description: 'Practice audience-appropriate communication depth',
          sessionType: 'STRATEGIC_THINKING'
        }
      ]
    }
  }

  return plans[careerContext] || plans['PM_TO_SENIOR_PM']
}

function calculateOverallReadiness(userProfile: UserProfile): number {
  const competencyValues = Object.values(userProfile.competencyLevels)
  return competencyValues.length > 0 
    ? Math.round(competencyValues.reduce((a, b) => a + b, 0) / competencyValues.length)
    : 0
}

function getCoachFitReason(coach: CoachPersona, careerContext: PMTransitionType): string {
  const reasons = {
    'PO_TO_PM': 'Strategic thinking development and business communication fundamentals',
    'PM_TO_SENIOR_PM': 'Executive presence building and advanced framework application',
    'SENIOR_PM_TO_GROUP_PM': 'Portfolio strategy and team development coaching',
    'GROUP_PM_TO_DIRECTOR': 'Board presentation skills and business model strategy'
  }
  
  return reasons[careerContext] || 'Professional development and PM skills advancement'
}