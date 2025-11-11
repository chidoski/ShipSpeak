'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, TrendingUp, Calendar, Zap, Target } from 'lucide-react'
import { mockCareerTrajectory, mockOverallProgress, mockSkillDimensionsProgress } from '@/lib/mockProgressData'

export function TimeToPromotionEstimator() {
  const trajectory = mockCareerTrajectory
  const progress = mockOverallProgress
  const skills = mockSkillDimensionsProgress

  // Calculate different timeline scenarios
  const calculateTimelineScenarios = () => {
    const currentRate = progress.monthlyProgressRate / 100 // Convert percentage to decimal
    const remainingProgress = (100 - trajectory.progressPercentage) / 100

    const scenarios = [
      {
        name: 'Current Pace',
        months: Math.ceil(remainingProgress / currentRate),
        description: 'Based on your current improvement rate',
        color: 'text-blue-600 bg-blue-100',
        icon: <Clock className="h-4 w-4" />
      },
      {
        name: 'Accelerated',
        months: Math.ceil(remainingProgress / (currentRate * 1.5)),
        description: 'With increased practice frequency',
        color: 'text-green-600 bg-green-100',
        icon: <TrendingUp className="h-4 w-4" />
      },
      {
        name: 'Intensive',
        months: Math.ceil(remainingProgress / (currentRate * 2)),
        description: 'With focused skill development plan',
        color: 'text-purple-600 bg-purple-100',
        icon: <Zap className="h-4 w-4" />
      }
    ]

    return scenarios.map(scenario => ({
      ...scenario,
      months: Math.max(1, scenario.months), // Minimum 1 month
      targetDate: new Date(Date.now() + scenario.months * 30 * 24 * 60 * 60 * 1000)
    }))
  }

  const scenarios = calculateTimelineScenarios()

  const getConfidenceLevel = (months: number) => {
    if (months <= 3) return { level: 'High', color: 'text-green-600', percentage: 85 }
    if (months <= 6) return { level: 'Medium', color: 'text-blue-600', percentage: 75 }
    if (months <= 12) return { level: 'Moderate', color: 'text-yellow-600', percentage: 65 }
    return { level: 'Low', color: 'text-red-600', percentage: 45 }
  }

  const getBottleneckSkills = () => {
    return skills
      .filter(skill => {
        const gap = skill.targetScore - skill.currentScore
        const timeToTarget = gap / skill.improvementRate
        return timeToTarget > 6 // Skills that will take longer than 6 months
      })
      .sort((a, b) => {
        const aTime = (a.targetScore - a.currentScore) / a.improvementRate
        const bTime = (b.targetScore - b.currentScore) / b.improvementRate
        return bTime - aTime
      })
  }

  const bottleneckSkills = getBottleneckSkills()

  const formatDuration = (months: number) => {
    if (months < 12) return `${months} months`
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years}y ${remainingMonths}m`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          Time to Promotion
        </CardTitle>
        <CardDescription>
          Data-driven promotion timeline estimates
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-primary">
            {trajectory.estimatedTimeToTarget}
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated time to {trajectory.targetLevel} readiness
          </p>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {progress.confidenceLevel} Confidence
          </Badge>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Timeline Scenarios</h4>
          
          {scenarios.map((scenario, index) => {
            const confidence = getConfidenceLevel(scenario.months)
            
            return (
              <div key={scenario.name} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {scenario.icon}
                    <span className="font-medium">{scenario.name}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold">{formatDuration(scenario.months)}</div>
                    <div className="text-xs text-muted-foreground">
                      {scenario.targetDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <Badge variant="secondary" className={confidence.color}>
                    {confidence.level} ({confidence.percentage}%)
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {bottleneckSkills.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-orange-700">Potential Bottlenecks</h4>
            {bottleneckSkills.slice(0, 2).map((skill) => {
              const timeToTarget = (skill.targetScore - skill.currentScore) / skill.improvementRate
              
              return (
                <div key={skill.dimension} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {skill.dimension.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </span>
                    <span className="text-sm text-orange-700">
                      {Math.ceil(timeToTarget)} months
                    </span>
                  </div>
                  <p className="text-xs text-orange-600">
                    Current improvement rate may delay overall timeline
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Acceleration Opportunities</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Practice Boost</span>
              </div>
              <p className="text-xs text-green-700">
                +2 sessions/week = -2 months
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Focus Areas</span>
              </div>
              <p className="text-xs text-purple-700">
                Priority skills = -1.5 months
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="font-medium text-indigo-800">Recommendation</span>
          </div>
          
          <p className="text-sm text-indigo-700 mb-3">
            Follow the Accelerated timeline for optimal results. Focus on Executive Communication 
            to remove your biggest bottleneck and achieve Senior PM readiness 2 months sooner.
          </p>
          
          <Button size="sm" className="w-full">
            Start Accelerated Plan
            <Target className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}