'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users, MessageSquare } from 'lucide-react'
import { mockMeetingTypeProgress } from '@/lib/mockProgressData'

export function MeetingTypeEffectiveness() {
  const meetingProgress = mockMeetingTypeProgress

  const getMeetingTypeIcon = (type: string) => {
    return <MessageSquare className="h-4 w-4" />
  }

  const getEffectivenessColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 7) return 'text-blue-600 bg-blue-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          Meeting Effectiveness
        </CardTitle>
        <CardDescription>
          Communication performance by meeting type
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {meetingProgress.map((meeting) => (
          <div key={meeting.meetingType} className="p-3 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMeetingTypeIcon(meeting.meetingType)}
                <span className="font-medium text-sm">
                  {meeting.meetingType.replace('_', ' ').toLowerCase()
                    .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              <Badge variant="secondary" className={getEffectivenessColor(meeting.effectivenessScore)}>
                {meeting.effectivenessScore.toFixed(1)}/10
              </Badge>
            </div>
            
            <Progress value={(meeting.effectivenessScore / 10) * 100} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Strengths: </span>
                <span>{meeting.keyStrengths[0]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Focus: </span>
                <span>{meeting.developmentAreas[0]}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Stakeholder Updates are your strongest meeting type!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}