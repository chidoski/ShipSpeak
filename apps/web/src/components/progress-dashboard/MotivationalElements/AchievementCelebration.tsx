'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Sparkles, Star, Share, Download } from 'lucide-react'
import { mockRecentAchievements } from '@/lib/mockProgressData'
import { AchievementRarity, CelebrationLevel } from '@/types/progress-dashboard'

export function AchievementCelebration() {
  const achievements = mockRecentAchievements

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'text-purple-600 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'
      case 'EPIC':
        return 'text-orange-600 bg-gradient-to-r from-orange-100 to-red-100 border-orange-300'
      case 'RARE':
        return 'text-blue-600 bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300'
      case 'UNCOMMON':
        return 'text-green-600 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
      case 'COMMON':
        return 'text-gray-600 bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300'
    }
  }

  const getCelebrationIcon = (level: CelebrationLevel) => {
    switch (level) {
      case 'BREAKTHROUGH':
        return <Sparkles className="h-6 w-6 text-purple-600" />
      case 'MAJOR':
        return <Trophy className="h-6 w-6 text-yellow-600" />
      case 'MINOR':
        return <Star className="h-6 w-6 text-blue-600" />
    }
  }

  const getCelebrationMessage = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return '🎉 Incredible achievement! This is truly exceptional!'
      case 'EPIC':
        return '🌟 Outstanding work! You\'re making remarkable progress!'
      case 'RARE':
        return '🎊 Excellent achievement! Keep up the momentum!'
      case 'UNCOMMON':
        return '👏 Great job! You\'re building strong momentum!'
      case 'COMMON':
        return '✨ Nice work! Every step counts toward your goals!'
    }
  }

  const featuredAchievement = achievements[0] // Most recent achievement

  return (
    <div className="space-y-6">
      {/* Featured Achievement Celebration */}
      <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            {getCelebrationIcon(featuredAchievement.celebrationLevel)}
            <span>🎉 Latest Achievement!</span>
          </CardTitle>
          <CardDescription>
            Celebrating your recent breakthrough
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-yellow-800">
                {featuredAchievement.title}
              </h3>
              <p className="text-yellow-700">
                {featuredAchievement.shareableDescription}
              </p>
            </div>
            
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-2 ${getRarityColor(featuredAchievement.rarity)}`}
            >
              {featuredAchievement.rarity} ACHIEVEMENT
            </Badge>
            
            <div className="p-4 bg-white/60 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 font-medium mb-2">
                Career Impact:
              </p>
              <p className="text-sm text-yellow-700">
                {featuredAchievement.careerImpact}
              </p>
            </div>
            
            <p className="text-lg font-medium text-yellow-800">
              {getCelebrationMessage(featuredAchievement.rarity)}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Share className="h-4 w-4 mr-2" />
              Share Achievement
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold-600" />
            Achievement Gallery
          </CardTitle>
          <CardDescription>
            Your recent accomplishments and milestones
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {achievements.slice(0, 4).map((achievement) => (
              <div 
                key={achievement.achievementId} 
                className={`p-4 border-2 rounded-lg ${getRarityColor(achievement.rarity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getCelebrationIcon(achievement.celebrationLevel)}
                      <h4 className="font-semibold text-lg">{achievement.title}</h4>
                    </div>
                    <p className="text-sm opacity-80">
                      {achievement.description}
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-xs border-current">
                      {achievement.rarity}
                    </Badge>
                    <div className="text-xs opacity-60">
                      {achievement.earnedDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="p-2 bg-white/40 rounded border border-current/20">
                  <p className="text-sm font-medium">
                    {achievement.careerImpact}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">
                  {achievements.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Achievements
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-600">
                  {achievements.filter(a => a.rarity === 'RARE' || a.rarity === 'EPIC').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Rare+ Achievements
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {achievements.filter(a => a.celebrationLevel === 'MAJOR').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Major Milestones
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Achievement Insight</span>
            </div>
            <p className="text-sm text-yellow-700">
              You're earning achievements 3x faster than average! Your consistent practice and 
              breakthrough moments are accelerating your PM career development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}