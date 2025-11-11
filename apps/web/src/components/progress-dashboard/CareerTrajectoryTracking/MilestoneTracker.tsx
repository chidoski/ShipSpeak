'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Flag, CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react'
import { mockCareerTrajectory } from '@/lib/mockProgressData'
import { CareerImpact } from '@/types/progress-dashboard'

export function MilestoneTracker() {
  const trajectory = mockCareerTrajectory

  const getImpactColor = (impact: CareerImpact) => {
    switch (impact) {
      case 'TRANSFORMATIVE':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'SIGNIFICANT':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'MODERATE':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'MINOR':
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getProgressIcon = (percentage: number) => {
    if (percentage >= 90) return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (percentage >= 50) return <Clock className="h-4 w-4 text-blue-600" />
    return <AlertTriangle className="h-4 w-4 text-orange-600" />
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  const isOverdue = (targetDate: Date) => {
    return new Date() > targetDate
  }

  const formatTimeToTarget = (targetDate: Date) => {
    const now = new Date()
    const diffTime = targetDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `${diffDays} days`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`
    return `${Math.ceil(diffDays / 30)} months`
  }

  const getSkillDisplayName = (dimension: string) => {
    return dimension.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-purple-600" />
          Milestone Tracker
        </CardTitle>
        <CardDescription>
          Key career advancement milestones and progress
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {trajectory.keyMilestones.map((milestone, index) => (
            <div key={milestone.milestoneId} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getProgressIcon(milestone.progressPercentage)}
                    <h4 className="font-semibold">{milestone.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
                
                <div className="text-right space-y-1">
                  <Badge variant="outline" className={getImpactColor(milestone.careerImpact)}>
                    {milestone.careerImpact}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatTimeToTarget(milestone.targetDate)}
                  </div>
                  {isOverdue(milestone.targetDate) && (
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{milestone.progressPercentage}%</span>
                </div>
                <div className="relative">
                  <Progress value={milestone.progressPercentage} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Required Skills:</h5>
                <div className="flex flex-wrap gap-1">
                  {milestone.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {getSkillDisplayName(skill)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Target: {milestone.targetDate.toLocaleDateString()}</span>
                <span className={milestone.progressPercentage >= 80 ? 'text-green-600 font-medium' : ''}>
                  {milestone.progressPercentage >= 80 ? 'On track' : 'Needs attention'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {trajectory.keyMilestones.filter(m => m.progressPercentage >= 80).length}
              </div>
              <div className="text-sm text-blue-600">On Track</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {trajectory.keyMilestones.filter(m => m.progressPercentage < 50).length}
              </div>
              <div className="text-sm text-orange-600">Needs Focus</div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Flag className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">Milestone Insight</span>
            </div>
            <p className="text-sm text-purple-700">
              Executive Presence Mastery is your highest-impact milestone. 
              Completing this will significantly accelerate your Senior PM timeline.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}