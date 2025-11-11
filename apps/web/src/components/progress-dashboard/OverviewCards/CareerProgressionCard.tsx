'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Clock } from 'lucide-react'
import { mockUserProfile, mockCareerTrajectory } from '@/lib/mockProgressData'

export function CareerProgressionCard() {
  const trajectory = mockCareerTrajectory
  const profile = mockUserProfile

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Career Progression
          </span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {trajectory.progressPercentage}% Ready
          </Badge>
        </CardTitle>
        <CardDescription>
          {profile.currentRole} → {profile.targetRole} Transition
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to Senior PM</span>
            <span className="font-medium">{trajectory.progressPercentage}%</span>
          </div>
          <Progress value={trajectory.progressPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Time to Target
            </div>
            <p className="text-lg font-semibold text-primary">
              {trajectory.estimatedTimeToTarget}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Monthly Growth
            </div>
            <p className="text-lg font-semibold text-green-600">
              +{(trajectory.progressPercentage / 6).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Next Milestones</h4>
          <div className="space-y-2">
            {trajectory.keyMilestones.slice(0, 2).map((milestone) => (
              <div key={milestone.milestoneId} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{milestone.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {milestone.targetDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Progress value={milestone.progressPercentage} className="w-16 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {milestone.progressPercentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}