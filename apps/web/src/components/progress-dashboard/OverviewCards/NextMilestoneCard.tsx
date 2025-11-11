'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Clock, CheckSquare, ArrowRight } from 'lucide-react'
import { mockCareerTrajectory } from '@/lib/mockProgressData'

export function NextMilestoneCard() {
  const trajectory = mockCareerTrajectory
  const nextMilestone = trajectory.keyMilestones[0] // Get the first upcoming milestone
  const nextReadinessIndicator = trajectory.readinessIndicators[0]

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700'
      case 'HIGH':
        return 'bg-orange-100 text-orange-700'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700'
      case 'LOW':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Next Milestone
        </CardTitle>
        <CardDescription>
          Your immediate development focus
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-lg">{nextMilestone.title}</h4>
              <p className="text-sm text-muted-foreground">
                {nextMilestone.description}
              </p>
            </div>
            <Badge variant="secondary" className={getImportanceColor(nextMilestone.careerImpact)}>
              {nextMilestone.careerImpact}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{nextMilestone.progressPercentage}%</span>
            </div>
            <Progress 
              value={nextMilestone.progressPercentage} 
              className="h-2"
            />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Target: {nextMilestone.targetDate.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckSquare className="h-3.5 w-3.5" />
              {nextMilestone.requiredSkills.length} Skills
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-semibold text-sm">Critical Next Steps</h5>
          <div className="space-y-2">
            {nextReadinessIndicator.requiredActions.slice(0, 3).map((action, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white/60 rounded border border-blue-200/50">
                <div className="w-4 h-4 rounded-full border border-blue-300 flex-shrink-0" />
                <span className="text-sm">{action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-100/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              {nextReadinessIndicator.indicator}
            </span>
            <Badge variant="secondary" className={getImportanceColor(nextReadinessIndicator.importance)}>
              {nextReadinessIndicator.importance}
            </Badge>
          </div>
          <p className="text-xs text-blue-700">
            Time to achieve: {nextReadinessIndicator.timeToAchieve}
          </p>
        </div>

        <Button className="w-full" size="sm">
          Start Practice Session
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}