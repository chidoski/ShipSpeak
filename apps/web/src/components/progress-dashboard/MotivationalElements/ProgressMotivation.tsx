'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, TrendingUp, ArrowRight } from 'lucide-react'
import { mockOverallProgress } from '@/lib/mockProgressData'

export function ProgressMotivation() {
  const progress = mockOverallProgress

  const motivationalMessages = [
    {
      title: 'Momentum Builder',
      message: 'Your improvement rate has accelerated 40% since joining!',
      action: 'Keep practicing',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Executive Ready',
      message: `You're ${progress.careerReadinessPercentage}% ready for Senior PM!`,
      action: 'View roadmap',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Practice Champion',
      message: `${progress.totalPracticeHours} hours invested in your future!`,
      action: 'Continue streak',
      color: 'bg-purple-100 text-purple-700'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          Progress Motivation
        </CardTitle>
        <CardDescription>
          Celebrating your journey and growth
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {motivationalMessages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg ${msg.color}`}>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{msg.title}</h4>
              <p className="text-sm">{msg.message}</p>
              <Button size="sm" variant="outline" className="w-full">
                {msg.action}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">Trending Up</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You're in the top 18% of fintech PMs!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}