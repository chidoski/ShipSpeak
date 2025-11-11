'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, Radar } from 'lucide-react'
import { mockSkillDimensionsProgress } from '@/lib/mockProgressData'
import { SkillDimensionProgress, TrendDirection } from '@/types/progress-dashboard'

export function SkillRadarChart() {
  const skillDimensions = mockSkillDimensionsProgress

  const getTrendIcon = (trend: TrendDirection) => {
    switch (trend) {
      case 'IMPROVING':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'DECLINING':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      case 'STABLE':
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getTrendColor = (trend: TrendDirection) => {
    switch (trend) {
      case 'IMPROVING':
        return 'text-green-600'
      case 'DECLINING':
        return 'text-red-600'
      case 'STABLE':
        return 'text-muted-foreground'
    }
  }

  const getSkillDisplayName = (dimension: string) => {
    return dimension.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-100'
    if (score >= 7.5) return 'text-blue-600 bg-blue-100'
    if (score >= 6.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  // Create a simple radar visualization using CSS
  const RadarVisualization = () => (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Radar grid circles */}
        <div className="absolute inset-0 border-2 border-gray-200 rounded-full opacity-30" />
        <div className="absolute inset-4 border border-gray-200 rounded-full opacity-30" />
        <div className="absolute inset-8 border border-gray-200 rounded-full opacity-30" />
        <div className="absolute inset-12 border border-gray-200 rounded-full opacity-30" />
        
        {/* Skill points */}
        {skillDimensions.map((skill, index) => {
          const angle = (index * 60) * (Math.PI / 180) // 6 skills = 60 degrees each
          const radius = (skill.currentScore / 10) * 85 // Max radius based on score
          const x = 96 + radius * Math.cos(angle - Math.PI / 2)
          const y = 96 + radius * Math.sin(angle - Math.PI / 2)
          
          return (
            <div
              key={skill.dimension}
              className="absolute w-3 h-3 bg-primary rounded-full transform -translate-x-1.5 -translate-y-1.5"
              style={{ left: x, top: y }}
              title={`${getSkillDisplayName(skill.dimension)}: ${skill.currentScore.toFixed(1)}`}
            />
          )
        })}
        
        {/* Radar lines */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index * 60) * (Math.PI / 180)
          const x2 = 96 + 85 * Math.cos(angle - Math.PI / 2)
          const y2 = 96 + 85 * Math.sin(angle - Math.PI / 2)
          
          return (
            <svg
              key={index}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <line
                x1="96"
                y1="96"
                x2={x2}
                y2={y2}
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity="0.5"
              />
            </svg>
          )
        })}
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radar className="h-5 w-5 text-blue-600" />
          Skill Radar Chart
        </CardTitle>
        <CardDescription>
          Multi-dimensional skill progression overview
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RadarVisualization />
        
        <div className="space-y-3">
          {skillDimensions.map((skill) => (
            <div key={skill.dimension} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {getSkillDisplayName(skill.dimension)}
                </span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(skill.recentTrend)}
                  <Badge variant="secondary" className={getScoreColor(skill.currentScore)}>
                    {skill.currentScore.toFixed(1)}/10
                  </Badge>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Target: {skill.targetScore.toFixed(1)} • 
                Growth: <span className={getTrendColor(skill.recentTrend)}>
                  +{skill.monthlyGrowthRate.toFixed(2)}/month
                </span>
              </div>
              
              <div className="text-xs text-blue-600 font-medium">
                Next: {skill.nextMilestone} ({skill.timeToMilestone})
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}