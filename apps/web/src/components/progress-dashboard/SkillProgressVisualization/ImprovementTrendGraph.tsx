'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'
import { mockSkillDimensionsProgress, mockProgressTimeline } from '@/lib/mockProgressData'

export function ImprovementTrendGraph() {
  const skillDimensions = mockSkillDimensionsProgress
  const timeline = mockProgressTimeline

  const getSkillDisplayName = (dimension: string) => {
    return dimension.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const getTrendColor = (rate: number) => {
    if (rate >= 0.15) return 'bg-green-500'
    if (rate >= 0.08) return 'bg-blue-500'
    if (rate >= 0.05) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  const getTrendLabel = (rate: number) => {
    if (rate >= 0.15) return 'Rapid'
    if (rate >= 0.08) return 'Strong'
    if (rate >= 0.05) return 'Steady'
    return 'Gradual'
  }

  // Simple bar chart visualization
  const BarVisualization = () => (
    <div className="space-y-4">
      {skillDimensions.map((skill) => (
        <div key={skill.dimension} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {getSkillDisplayName(skill.dimension)}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                +{skill.monthlyGrowthRate.toFixed(2)}/month
              </Badge>
              <span className="text-xs text-muted-foreground">
                {getTrendLabel(skill.monthlyGrowthRate)}
              </span>
            </div>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getTrendColor(skill.monthlyGrowthRate)} rounded-full transition-all`}
              style={{ width: `${Math.min((skill.monthlyGrowthRate / 0.25) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-600" />
          Improvement Trends
        </CardTitle>
        <CardDescription>
          Monthly skill development rate analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <BarVisualization />
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Fastest Growing</span>
            </div>
            <div className="space-y-1">
              {skillDimensions
                .sort((a, b) => b.monthlyGrowthRate - a.monthlyGrowthRate)
                .slice(0, 2)
                .map((skill) => (
                  <div key={skill.dimension} className="text-sm">
                    <span className="text-muted-foreground">
                      {getSkillDisplayName(skill.dimension)}
                    </span>
                    <span className="ml-2 text-green-600 font-medium">
                      +{skill.monthlyGrowthRate.toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Recent Progress</span>
            </div>
            <div className="space-y-1">
              {timeline.slice(0, 2).map((entry, index) => {
                const previous = timeline[index + 1]
                const change = previous ? entry.overallScore - previous.overallScore : 0
                return (
                  <div key={entry.period} className="text-sm">
                    <span className="text-muted-foreground">
                      {entry.period}
                    </span>
                    <span className={`ml-2 font-medium ${change > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Progress Insight</span>
          </div>
          <p className="text-sm text-green-700">
            Your improvement rate has accelerated 40% since joining. Executive Communication 
            shows breakthrough-level growth (+{skillDimensions[0].monthlyGrowthRate.toFixed(2)}/month).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}