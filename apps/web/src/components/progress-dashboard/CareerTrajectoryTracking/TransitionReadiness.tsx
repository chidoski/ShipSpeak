'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Rocket, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import { mockCareerTrajectory } from '@/lib/mockProgressData'
import { ReadinessStatus } from '@/types/progress-dashboard'

export function TransitionReadiness() {
  const trajectory = mockCareerTrajectory

  const getStatusIcon = (status: ReadinessStatus) => {
    switch (status) {
      case 'ACHIEVED':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'NEARLY_COMPLETE':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'NOT_STARTED':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
    }
  }

  const getStatusColor = (status: ReadinessStatus) => {
    switch (status) {
      case 'ACHIEVED':
        return 'bg-green-100 text-green-700'
      case 'NEARLY_COMPLETE':
        return 'bg-blue-100 text-blue-700'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700'
      case 'NOT_STARTED':
        return 'bg-orange-100 text-orange-700'
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'CRITICAL':
        return 'border-l-red-500 bg-red-50'
      case 'HIGH':
        return 'border-l-orange-500 bg-orange-50'
      case 'MEDIUM':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'LOW':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getReadinessPercentage = () => {
    const total = trajectory.readinessIndicators.length
    const achieved = trajectory.readinessIndicators.filter(
      indicator => indicator.currentStatus === 'ACHIEVED' || indicator.currentStatus === 'NEARLY_COMPLETE'
    ).length
    return Math.round((achieved / total) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-600" />
          Transition Readiness
        </CardTitle>
        <CardDescription>
          {trajectory.currentLevel} → {trajectory.targetLevel} progression status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold text-primary">
            {trajectory.progressPercentage}%
          </div>
          <p className="text-sm text-muted-foreground">
            Overall readiness for {trajectory.targetLevel}
          </p>
          <Progress value={trajectory.progressPercentage} className="h-3" />
          
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-muted-foreground">
              Estimated completion: {trajectory.estimatedTimeToTarget}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Readiness Indicators</h4>
          
          <div className="space-y-3">
            {trajectory.readinessIndicators.map((indicator, index) => (
              <div 
                key={indicator.indicator} 
                className={`p-4 border-l-4 rounded-r-lg ${getImportanceColor(indicator.importance)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(indicator.currentStatus)}
                      <h5 className="font-medium text-sm">{indicator.indicator}</h5>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(indicator.currentStatus)}>
                      {indicator.currentStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {indicator.importance}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {indicator.timeToAchieve}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700">Required Actions:</p>
                  <ul className="space-y-1">
                    {indicator.requiredActions.slice(0, 2).map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-blue-800">
              {trajectory.targetLevel} Readiness Assessment
            </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {getReadinessPercentage()}% Complete
            </Badge>
          </div>
          
          <p className="text-sm text-blue-700 mb-3">
            You're making excellent progress toward Senior PM readiness. 
            Focus on the critical indicators to accelerate your timeline.
          </p>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              View Action Plan
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button size="sm" className="flex-1">
              Start Practice
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}