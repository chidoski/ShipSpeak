'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, Brain, Clock, Award } from 'lucide-react'
import { mockOverallProgress } from '@/lib/mockProgressData'

export function OverallSkillScore() {
  const progress = mockOverallProgress

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 7) return 'text-blue-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 9) return 'A+'
    if (score >= 8.5) return 'A'
    if (score >= 8) return 'A-'
    if (score >= 7.5) return 'B+'
    if (score >= 7) return 'B'
    if (score >= 6.5) return 'B-'
    return 'C+'
  }

  const getTrendIcon = (improvement: number) => {
    if (improvement > 0.1) return <TrendingUp className="h-3.5 w-3.5 text-green-600" />
    if (improvement < -0.1) return <TrendingDown className="h-3.5 w-3.5 text-red-600" />
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
  }

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-600" />
            Overall Skill Score
          </span>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {getScoreGrade(progress.overallScore)}
          </Badge>
        </CardTitle>
        <CardDescription>
          PM Communication & Leadership Competency
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getScoreColor(progress.overallScore)}`}>
            {progress.overallScore.toFixed(1)}
            <span className="text-lg text-muted-foreground ml-1">/10</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            {getTrendIcon(progress.monthlyImprovement)}
            <span className="text-muted-foreground">
              {progress.monthlyImprovement > 0 ? '+' : ''}
              {progress.monthlyImprovement.toFixed(1)} this month
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Practice Hours
            </div>
            <p className="text-lg font-semibold">
              {progress.totalPracticeHours}h
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Award className="h-3.5 w-3.5" />
              Sessions Completed
            </div>
            <p className="text-lg font-semibold">
              {progress.practiceSessionsCompleted}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm text-green-700 mb-2">Strongest Areas</h4>
            <div className="flex flex-wrap gap-1">
              {progress.strongestAreas.map((area) => (
                <Badge key={area} variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-orange-700 mb-2">Development Priorities</h4>
            <div className="flex flex-wrap gap-1">
              {progress.developmentPriorities.map((priority) => (
                <Badge key={priority} variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                  {priority}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-center">
            Career Readiness: {progress.careerReadinessPercentage}%
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {progress.timeToTarget} to Senior PM readiness
          </p>
        </div>
      </CardContent>
    </Card>
  )
}