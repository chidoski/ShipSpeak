'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Target } from 'lucide-react'
import { mockBenchmarkData } from '@/lib/mockProgressData'

export function CommunityComparison() {
  const benchmarks = mockBenchmarkData

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Community Comparison
        </CardTitle>
        <CardDescription>
          Anonymous peer progress comparison
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-blue-600">
            82nd
          </div>
          <p className="text-sm text-muted-foreground">
            Percentile in fintech industry
          </p>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Top 18%
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <span className="text-sm">Practice consistency</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Above average
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span className="text-sm">Framework mastery</span>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Excellent
            </Badge>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-800">
            You're outpacing 82% of your peers!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}