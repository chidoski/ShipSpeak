'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Gap, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { mockSkillDimensionsProgress, mockBenchmarkData } from '@/lib/mockProgressData'

export function SkillGapVisualization() {
  const skillDimensions = mockSkillDimensionsProgress
  const benchmarks = mockBenchmarkData.roleLevelBenchmarks[0]

  const getSkillDisplayName = (dimension: string) => {
    return dimension.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const calculateGap = (currentScore: number, targetScore: number) => {
    return Math.max(0, targetScore - currentScore)
  }

  const getGapSeverity = (gap: number) => {
    if (gap <= 0.3) return { level: 'MINOR', color: 'text-green-600 bg-green-100' }
    if (gap <= 0.7) return { level: 'MODERATE', color: 'text-yellow-600 bg-yellow-100' }
    if (gap <= 1.2) return { level: 'SIGNIFICANT', color: 'text-orange-600 bg-orange-100' }
    return { level: 'CRITICAL', color: 'text-red-600 bg-red-100' }
  }

  const calculateTimeToTarget = (currentScore: number, targetScore: number, improvementRate: number) => {
    const gap = targetScore - currentScore
    if (gap <= 0) return 'Achieved'
    if (improvementRate <= 0) return 'Unknown'
    
    const monthsToTarget = Math.ceil(gap / improvementRate)
    if (monthsToTarget <= 2) return `${monthsToTarget} months`
    if (monthsToTarget <= 12) return `${monthsToTarget} months`
    return `${Math.ceil(monthsToTarget / 12)} years`
  }

  const getPriorityOrder = () => {
    return skillDimensions
      .map(skill => ({
        ...skill,
        gap: calculateGap(skill.currentScore, skill.targetScore),
        severity: getGapSeverity(calculateGap(skill.currentScore, skill.targetScore))
      }))
      .sort((a, b) => {
        // Sort by gap severity first, then by gap size
        const severityOrder = { 'CRITICAL': 4, 'SIGNIFICANT': 3, 'MODERATE': 2, 'MINOR': 1 }
        const aSeverity = severityOrder[a.severity.level as keyof typeof severityOrder]
        const bSeverity = severityOrder[b.severity.level as keyof typeof severityOrder]
        if (aSeverity !== bSeverity) return bSeverity - aSeverity
        return b.gap - a.gap
      })
  }

  const prioritizedSkills = getPriorityOrder()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gap className="h-5 w-5 text-red-600" />
          Skill Gap Analysis
        </CardTitle>
        <CardDescription>
          Current vs target skill levels for {benchmarks.role}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Target Role: {benchmarks.role}</span>
          </div>
          <p className="text-sm text-blue-700">
            Required overall score: {benchmarks.requiredScore.toFixed(1)}/10
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Priority Development Areas</h4>
          
          {prioritizedSkills.map((skill, index) => {
            const gap = skill.gap
            const timeToTarget = calculateTimeToTarget(
              skill.currentScore, 
              skill.targetScore, 
              skill.improvementRate
            )
            
            return (
              <div key={skill.dimension} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getSkillDisplayName(skill.dimension)}</span>
                      {index < 2 && (
                        <Badge variant="destructive" className="text-xs">
                          Priority #{index + 1}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Current: {skill.currentScore.toFixed(1)}</span>
                      <span>Target: {skill.targetScore.toFixed(1)}</span>
                      <span>Gap: {gap.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <Badge variant="secondary" className={skill.severity.color}>
                      {skill.severity.level}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      ETA: {timeToTarget}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress to Target</span>
                    <span className="font-medium">
                      {Math.min(((skill.currentScore / skill.targetScore) * 100), 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(((skill.currentScore / skill.targetScore) * 100), 100)} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-700">Recommended Focus:</h5>
                  <ul className="space-y-1">
                    {skill.practiceRecommendations.slice(0, 2).map((recommendation, recIndex) => (
                      <li key={recIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="text-lg font-bold text-red-600">
                {prioritizedSkills.filter(s => s.severity.level === 'CRITICAL').length}
              </div>
              <div className="text-xs text-red-600">Critical Gaps</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">
                {prioritizedSkills.filter(s => s.severity.level === 'SIGNIFICANT').length}
              </div>
              <div className="text-xs text-orange-600">Significant Gaps</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {prioritizedSkills.filter(s => s.gap <= 0.3).length}
              </div>
              <div className="text-xs text-green-600">Nearly Ready</div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Development Strategy</span>
            </div>
            <p className="text-sm text-red-700">
              Focus intensively on {getSkillDisplayName(prioritizedSkills[0].dimension)} - 
              it's your biggest gap and highest career impact for Senior PM readiness.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}