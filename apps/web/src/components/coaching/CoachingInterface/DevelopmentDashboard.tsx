'use client'

import React from 'react'
import { 
  CoachingSession, 
  ProgressMetrics,
  UserProfile,
  DevelopmentArea,
  PMTransitionType,
  Industry,
  Milestone
} from '@/types/coaching'
import { Card } from '@/components/ui/Card'

interface DevelopmentDashboardProps {
  userProfile: UserProfile
  developmentFocus: DevelopmentArea[]
  careerContext: PMTransitionType
  industryContext: Industry
  sessionHistory: CoachingSession[]
  progressMetrics: ProgressMetrics
  onSessionStart: (sessionType: any) => void
  onSessionEnd: () => void
  onProgressUpdate: (update: any) => void
}

export function DevelopmentDashboard({
  userProfile,
  developmentFocus,
  careerContext,
  industryContext,
  sessionHistory,
  progressMetrics
}: DevelopmentDashboardProps) {
  
  return (
    <div className="p-6 space-y-8">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ProgressCard
          title="Sessions Completed"
          value={progressMetrics.sessionsCompleted}
          change="+3 this week"
          positive
        />
        <ProgressCard
          title="Total Practice Hours"
          value={`${(progressMetrics.totalDuration / 60).toFixed(1)}h`}
          change="+2.5h this week"
          positive
        />
        <ProgressCard
          title="Skill Improvement"
          value={`${getAverageImprovement(progressMetrics)}%`}
          change="+8% this month"
          positive
        />
        <ProgressCard
          title="Milestones Achieved"
          value={progressMetrics.milestones.filter(m => m.achievedAt).length}
          change="2 this month"
          positive
        />
      </div>

      {/* Development Focus Areas */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Development Focus Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developmentFocus.map(area => (
            <DevelopmentAreaCard key={area.id} area={area} />
          ))}
        </div>
      </div>

      {/* Skill Progression Chart */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Skill Progression Over Time</h3>
        <Card className="p-6">
          <SkillProgressionChart progressMetrics={progressMetrics} />
        </Card>
      </div>

      {/* Career Transition Progress */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {careerContext.replace('_', ' → ')} Transition Progress
        </h3>
        <Card className="p-6">
          <CareerTransitionTracker 
            careerContext={careerContext}
            userProfile={userProfile}
            progressMetrics={progressMetrics}
          />
        </Card>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressMetrics.milestones
            .filter(m => m.achievedAt)
            .sort((a, b) => new Date(b.achievedAt!).getTime() - new Date(a.achievedAt!).getTime())
            .slice(0, 4)
            .map(milestone => (
              <AchievementCard key={milestone.id} milestone={milestone} />
            ))}
        </div>
      </div>

      {/* Weekly Progress Summary */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Progress Summary</h3>
        <Card className="p-6">
          <WeeklyProgressView progressMetrics={progressMetrics} />
        </Card>
      </div>
    </div>
  )
}

function ProgressCard({ 
  title, 
  value, 
  change, 
  positive 
}: { 
  title: string
  value: string | number
  change: string
  positive: boolean 
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
    </Card>
  )
}

function DevelopmentAreaCard({ area }: { area: DevelopmentArea }) {
  const progress = (area.currentLevel / area.targetLevel) * 100
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900">{area.name}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          area.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
          area.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {area.priority}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Current Level</span>
          <span>{area.currentLevel}/{area.targetLevel}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-600">
        {area.category.charAt(0) + area.category.slice(1).toLowerCase()} Development
      </p>
    </Card>
  )
}

function SkillProgressionChart({ progressMetrics }: { progressMetrics: ProgressMetrics }) {
  const skills = Object.entries(progressMetrics.skillProgression)
  
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900">Current Skill Levels</h4>
      {skills.map(([skill, level]) => (
        <div key={skill} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {skill.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">{level}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                level >= 80 ? 'bg-green-500' :
                level >= 60 ? 'bg-blue-500' :
                level >= 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${level}%` }}
            />
          </div>
        </div>
      ))}
      
      {progressMetrics.confidenceGrowth.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h5 className="text-md font-medium text-gray-900 mb-4">Confidence Growth Trend</h5>
          <div className="flex items-end space-x-2 h-24">
            {progressMetrics.confidenceGrowth.map((confidence, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(confidence / 100) * 80}px` }}
                />
                <span className="text-xs text-gray-500 mt-1">W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CareerTransitionTracker({ 
  careerContext, 
  userProfile, 
  progressMetrics 
}: { 
  careerContext: PMTransitionType
  userProfile: UserProfile
  progressMetrics: ProgressMetrics
}) {
  const transitionSteps = getTransitionSteps(careerContext)
  const currentProgress = calculateTransitionProgress(progressMetrics, careerContext)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900">
            {userProfile.currentRole} → {userProfile.targetRole} Progression
          </h4>
          <p className="text-sm text-gray-600">{Math.round(currentProgress)}% Complete</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            Estimated Time Remaining
          </p>
          <p className="text-sm text-gray-600">
            {calculateTimeRemaining(currentProgress)} months
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {transitionSteps.map((step, index) => {
          const isCompleted = (index + 1) * 25 <= currentProgress
          const isCurrent = !isCompleted && (index * 25) <= currentProgress
          
          return (
            <div key={step.name} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500 text-white' :
                isCurrent ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <h5 className={`font-medium ${
                  isCompleted ? 'text-green-700' :
                  isCurrent ? 'text-blue-700' :
                  'text-gray-700'
                }`}>
                  {step.name}
                </h5>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <div className={`text-sm font-medium ${
                isCompleted ? 'text-green-600' :
                isCurrent ? 'text-blue-600' :
                'text-gray-400'
              }`}>
                {isCompleted ? 'Complete' : isCurrent ? 'In Progress' : 'Pending'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AchievementCard({ milestone }: { milestone: Milestone }) {
  return (
    <Card className="p-6 border-l-4 border-green-500">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 text-xl">🏆</span>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900">{milestone.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="capitalize">{milestone.category.toLowerCase()}</span>
            <span>•</span>
            <span className="capitalize">{milestone.level.toLowerCase()}</span>
            {milestone.achievedAt && (
              <>
                <span>•</span>
                <span>{new Date(milestone.achievedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function WeeklyProgressView({ progressMetrics }: { progressMetrics: ProgressMetrics }) {
  const recentWeeks = progressMetrics.weeklyProgress.slice(-4)
  
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900">Last 4 Weeks Performance</h4>
      
      {recentWeeks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Complete more coaching sessions to see weekly progress trends
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentWeeks.map(week => (
            <div key={week.week} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">Week {week.week}</h5>
                <span className="text-sm text-gray-600">
                  {week.sessionsCount} sessions
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Skill Improvement</span>
                  <span className="font-medium text-green-600">
                    +{week.skillImprovement}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Focus Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {week.focusAreas.map(area => (
                    <span key={area} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                      {area}
                    </span>
                  ))}
                </div>
                
                {week.achievements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Achievements:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {week.achievements.map((achievement, index) => (
                        <li key={index}>• {achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper functions
function getAverageImprovement(progressMetrics: ProgressMetrics): number {
  const skills = Object.values(progressMetrics.skillProgression)
  return skills.length > 0 ? Math.round(skills.reduce((a, b) => a + b, 0) / skills.length) : 0
}

function getTransitionSteps(careerContext: PMTransitionType) {
  const steps = {
    'PO_TO_PM': [
      { name: 'Strategic Thinking Foundation', description: 'Develop customer outcome focus and business reasoning' },
      { name: 'Business Vocabulary Mastery', description: 'Learn PM-specific language and frameworks' },
      { name: 'Stakeholder Communication', description: 'Expand beyond engineering to business stakeholders' },
      { name: 'PM Role Integration', description: 'Demonstrate full PM competency in real scenarios' }
    ],
    'PM_TO_SENIOR_PM': [
      { name: 'Executive Communication', description: 'Master answer-first methodology and C-suite interaction' },
      { name: 'Strategic Altitude Control', description: 'Know when to dive deep vs stay strategic' },
      { name: 'Influence Without Authority', description: 'Build cross-functional leadership skills' },
      { name: 'Senior PM Excellence', description: 'Consistent senior-level performance and mentoring' }
    ],
    'SENIOR_PM_TO_GROUP_PM': [
      { name: 'Portfolio Strategy', description: 'Think and communicate across multiple products' },
      { name: 'Team Development', description: 'Coach and develop other PMs effectively' },
      { name: 'Organizational Impact', description: 'Drive department-level strategic initiatives' },
      { name: 'Group PM Leadership', description: 'Lead portfolio strategy and team development' }
    ],
    'GROUP_PM_TO_DIRECTOR': [
      { name: 'Board Presentation Skills', description: 'Master C-suite communication and board dynamics' },
      { name: 'Business Model Strategy', description: 'Understand P&L and business model optimization' },
      { name: 'Market Strategy', description: 'Develop competitive positioning and market expansion' },
      { name: 'Director Excellence', description: 'Lead organizational strategy and vision' }
    ]
  }
  
  return steps[careerContext]
}

function calculateTransitionProgress(progressMetrics: ProgressMetrics, careerContext: PMTransitionType): number {
  // Mock calculation based on skill progression and milestones
  const avgSkillLevel = getAverageImprovement(progressMetrics)
  const milestoneProgress = (progressMetrics.milestones.filter(m => m.achievedAt).length / 4) * 100
  
  return Math.min(100, (avgSkillLevel * 0.7) + (milestoneProgress * 0.3))
}

function calculateTimeRemaining(currentProgress: number): number {
  const monthsPerPercent = 0.2 // Assume 0.2 months per percentage point
  return Math.max(1, Math.round((100 - currentProgress) * monthsPerPercent))
}