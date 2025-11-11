'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Building2, TrendingUp } from 'lucide-react'
import { mockBenchmarkData, mockUserProfile } from '@/lib/mockProgressData'

export function IndustrySpecificProgress() {
  const industryBenchmark = mockBenchmarkData.industryBenchmarks[0]
  const userProfile = mockUserProfile

  const industryCompetencies = [
    { name: 'Regulatory Communication', score: 7.2, target: 8.5, isStrong: false },
    { name: 'Risk Management Fluency', score: 8.1, target: 8.3, isStrong: true },
    { name: 'Financial Metrics Mastery', score: 7.8, target: 8.0, isStrong: true },
    { name: 'Compliance Integration', score: 6.9, target: 8.2, isStrong: false }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-indigo-600" />
          {userProfile.industry} Industry Progress
        </CardTitle>
        <CardDescription>
          Sector-specific skill development tracking
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-indigo-800">Industry Ranking</span>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              {industryBenchmark.userPercentile}th percentile
            </Badge>
          </div>
          <p className="text-sm text-indigo-700">
            You outperform {industryBenchmark.userPercentile}% of fintech PMs
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Industry-Specific Competencies</h4>
          
          {industryCompetencies.map((competency) => (
            <div key={competency.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{competency.name}</span>
                <div className="flex items-center gap-2">
                  {competency.isStrong && (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  )}
                  <Badge 
                    variant="secondary" 
                    className={competency.isStrong ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                  >
                    {competency.score.toFixed(1)}/{competency.target.toFixed(1)}
                  </Badge>
                </div>
              </div>
              <Progress value={(competency.score / competency.target) * 100} className="h-2" />
            </div>
          ))}
        </div>

        <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <span className="font-medium text-indigo-800">Industry Focus</span>
          </div>
          <p className="text-sm text-indigo-700">
            Strengthen regulatory communication to reach top 10% in fintech industry.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}