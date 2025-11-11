'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timeline, TrendingUp, Clock, Award } from 'lucide-react'
import { mockProgressTimeline } from '@/lib/mockProgressData'

export function ProgressTimeline() {
  const timeline = mockProgressTimeline

  const getScoreChangeColor = (current: number, previous: number) => {
    const change = current - previous
    if (change > 0.2) return 'text-green-600'
    if (change > 0) return 'text-blue-600'
    if (change < -0.1) return 'text-red-600'
    return 'text-muted-foreground'
  }

  const getScoreChangeIcon = (current: number, previous: number) => {
    const change = current - previous
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    return null
  }

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timeline className="h-5 w-5 text-purple-600" />
          Progress Timeline
        </CardTitle>
        <CardDescription>
          Historical skill development tracking
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-200 via-blue-200 to-green-200" />
          
          <div className="space-y-6">
            {timeline.map((entry, index) => {
              const previousEntry = timeline[index + 1]
              const scoreChange = previousEntry ? entry.overallScore - previousEntry.overallScore : 0
              const isLatest = index === 0
              
              return (
                <div key={entry.period} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 transform -translate-x-1.5 ${
                    isLatest 
                      ? 'bg-primary border-primary' 
                      : 'bg-white border-gray-300'
                  }`} />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">
                        {formatPeriod(entry.period)}
                      </h4>
                      <div className="flex items-center gap-2">
                        {scoreChange > 0 && getScoreChangeIcon(entry.overallScore, previousEntry?.overallScore || 0)}
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {entry.overallScore.toFixed(1)}/10
                        </Badge>
                        {scoreChange !== 0 && (
                          <span className={`text-sm ${getScoreChangeColor(entry.overallScore, previousEntry?.overallScore || 0)}`}>
                            {scoreChange > 0 ? '+' : ''}{scoreChange.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {entry.practiceHours}h practice
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {entry.milestonesAchieved} milestones
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {entry.keyImprovements.length} improvements
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm text-green-700">Key Improvements</h5>
                      <div className="space-y-1">
                        {entry.keyImprovements.map((improvement, improvementIndex) => (
                          <div key={improvementIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {improvement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {entry.significantEvents && entry.significantEvents.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-blue-700">Significant Events</h5>
                        <div className="space-y-1">
                          {entry.significantEvents.map((event, eventIndex) => (
                            <div key={eventIndex} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {event}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}