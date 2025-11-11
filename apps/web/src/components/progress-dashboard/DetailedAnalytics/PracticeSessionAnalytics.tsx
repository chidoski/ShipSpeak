'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Clock, TrendingUp } from 'lucide-react'
import { mockOverallProgress, mockSkillProgressData } from '@/lib/mockProgressData'

export function PracticeSessionAnalytics() {
  const progress = mockOverallProgress
  const skillData = mockSkillProgressData

  const sessionStats = [
    { label: 'Total Sessions', value: progress.practiceSessionsCompleted, color: 'text-blue-600' },
    { label: 'Practice Hours', value: `${progress.totalPracticeHours}h`, color: 'text-green-600' },
    { label: 'Avg. Session', value: '30 min', color: 'text-purple-600' },
    { label: 'Weekly Avg.', value: '3.2 sessions', color: 'text-orange-600' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Practice Analytics
        </CardTitle>
        <CardDescription>
          Session effectiveness and patterns
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {sessionStats.map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-muted/30 rounded-lg">
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Recent Impact</h4>
          {skillData.practiceSessionHistory.slice(0, 2).map((session) => (
            <div key={session.sessionId} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{session.date.toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  +{session.scoreImprovement.toFixed(2)} points
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {session.keyInsights[0]}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Practice Insight</span>
          </div>
          <p className="text-sm text-blue-700">
            Your session effectiveness is improving! Average score gain increased 40% this month.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}