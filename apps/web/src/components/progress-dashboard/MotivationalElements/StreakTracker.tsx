'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Flame, Calendar, Target } from 'lucide-react'
import { mockStreakData } from '@/lib/mockProgressData'

export function StreakTracker() {
  const streakData = mockStreakData

  const getStreakColor = (streak: number) => {
    if (streak >= 20) return 'text-purple-600 bg-purple-100'
    if (streak >= 10) return 'text-orange-600 bg-orange-100'
    if (streak >= 5) return 'text-blue-600 bg-blue-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-600" />
          Practice Streak
        </CardTitle>
        <CardDescription>
          Consistency tracking and motivation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-orange-600">
            {streakData.currentStreak}
          </div>
          <p className="text-sm text-muted-foreground">
            Day streak • {streakData.streakType.replace('_', ' ').toLowerCase()}
          </p>
          <Badge variant="secondary" className={getStreakColor(streakData.currentStreak)}>
            {streakData.currentStreak >= 20 ? 'Amazing!' : 
             streakData.currentStreak >= 10 ? 'Excellent!' :
             streakData.currentStreak >= 5 ? 'Great job!' : 'Keep going!'}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Personal Best</span>
            <span className="font-semibold">{streakData.longestStreak} days</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Activity</span>
            <span className="font-semibold">Today</span>
          </div>
        </div>

        <div className="p-3 bg-orange-50 rounded-lg text-center">
          <p className="text-sm font-medium text-orange-800">
            🔥 You're on fire! Keep the momentum going!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}