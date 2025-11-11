'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Brain, Target } from 'lucide-react'
import { mockFrameworkMastery } from '@/lib/mockProgressData'
import { MasteryLevel } from '@/types/progress-dashboard'

export function FrameworkMasteryTracker() {
  const frameworks = mockFrameworkMastery

  const getMasteryColor = (level: MasteryLevel) => {
    switch (level) {
      case 'EXPERT':
        return 'text-purple-600 bg-purple-100'
      case 'MASTERY':
        return 'text-green-600 bg-green-100'
      case 'PRACTICE':
        return 'text-blue-600 bg-blue-100'
      case 'FOUNDATION':
        return 'text-orange-600 bg-orange-100'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Framework Mastery
        </CardTitle>
        <CardDescription>
          PM framework usage and competency
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {frameworks.map((framework) => (
          <div key={framework.framework} className="p-3 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{framework.framework}</span>
              <Badge variant="secondary" className={getMasteryColor(framework.masteryLevel)}>
                {framework.masteryLevel}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Effectiveness</span>
                <span className="font-medium">{framework.effectivenessScore.toFixed(1)}/10</span>
              </div>
              <Progress value={(framework.effectivenessScore / 10) * 100} className="h-2" />
            </div>
            
            <div className="text-xs text-muted-foreground">
              Usage: {(framework.usageFrequency * 100).toFixed(0)}% of applicable scenarios
            </div>
          </div>
        ))}

        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-800">Framework Focus</span>
          </div>
          <p className="text-sm text-purple-700">
            RICE framework mastery achieved! Focus on Jobs-to-be-Done for next advancement.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}