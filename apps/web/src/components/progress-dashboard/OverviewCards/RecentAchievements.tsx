'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Sparkles, Star, Calendar } from 'lucide-react'
import { mockRecentAchievements } from '@/lib/mockProgressData'
import { CelebrationLevel } from '@/types/progress-dashboard'

export function RecentAchievements() {
  const achievements = mockRecentAchievements

  const getCelebrationIcon = (level: CelebrationLevel) => {
    switch (level) {
      case 'BREAKTHROUGH':
        return <Sparkles className="h-4 w-4 text-purple-600" />
      case 'MAJOR':
        return <Trophy className="h-4 w-4 text-yellow-600" />
      case 'MINOR':
        return <Star className="h-4 w-4 text-blue-600" />
    }
  }

  const getCelebrationBadgeColor = (level: CelebrationLevel) => {
    switch (level) {
      case 'BREAKTHROUGH':
        return 'bg-purple-100 text-purple-700'
      case 'MAJOR':
        return 'bg-yellow-100 text-yellow-700'
      case 'MINOR':
        return 'bg-blue-100 text-blue-700'
    }
  }

  const formatTimeAgo = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Recently'
    }
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday' 
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Recent Achievements
        </CardTitle>
        <CardDescription>
          Celebrating your latest milestones and breakthroughs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {achievements.slice(0, 3).map((achievement, index) => (
          <div key={`${achievement.milestone}-${index}`} className="p-3 bg-white/60 rounded-lg border border-yellow-200/50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getCelebrationIcon(achievement.celebrationLevel)}
                <h4 className="font-semibold text-sm">{achievement.milestone}</h4>
              </div>
              <Badge variant="secondary" className={getCelebrationBadgeColor(achievement.celebrationLevel)}>
                {achievement.celebrationLevel}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">
              {achievement.impactDescription}
            </p>
            
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-green-700">
                {achievement.careerSignificance}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatTimeAgo(achievement.achievedDate)}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-yellow-200/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Achievements</span>
            <span className="font-semibold text-yellow-700">{achievements.length}</span>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg text-center">
          <p className="text-sm font-medium text-yellow-800">
            🎉 You're on a breakthrough streak!
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Keep up the excellent progress toward Senior PM readiness
          </p>
        </div>
      </CardContent>
    </Card>
  )
}