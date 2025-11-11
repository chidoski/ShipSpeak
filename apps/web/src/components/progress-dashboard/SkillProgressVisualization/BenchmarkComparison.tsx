'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart, Users, Trophy, Target } from 'lucide-react'
import { mockBenchmarkData, mockOverallProgress } from '@/lib/mockProgressData'

export function BenchmarkComparison() {
  const benchmarks = mockBenchmarkData
  const progress = mockOverallProgress
  const industryBenchmark = benchmarks.industryBenchmarks[0]
  const roleBenchmark = benchmarks.roleLevelBenchmarks[0]
  const faangBenchmarks = benchmarks.faangStandards

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'text-green-600 bg-green-100'
    if (percentile >= 75) return 'text-blue-600 bg-blue-100'
    if (percentile >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  const getReadinessColor = (readiness: string) => {
    if (readiness.includes('ready')) return 'text-green-600 bg-green-100'
    if (readiness.includes('track')) return 'text-blue-600 bg-blue-100'
    return 'text-yellow-600 bg-yellow-100'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-orange-600" />
          Benchmark Comparison
        </CardTitle>
        <CardDescription>
          Industry and role-level performance comparison
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Industry Benchmark */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              {industryBenchmark.industry.charAt(0) + industryBenchmark.industry.slice(1).toLowerCase()} Industry
            </h4>
            <Badge variant="secondary" className={getPercentileColor(industryBenchmark.userPercentile)}>
              {industryBenchmark.userPercentile}th percentile
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Your Score</p>
              <p className="font-bold text-lg text-primary">
                {progress.overallScore.toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Industry Avg</p>
              <p className="font-bold text-lg">
                {industryBenchmark.averageScore.toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Top Performer</p>
              <p className="font-bold text-lg text-green-600">
                {industryBenchmark.topPerformerScore.toFixed(1)}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <Progress value={(progress.overallScore / 10) * 100} className="h-2" />
            <div 
              className="absolute top-0 w-0.5 h-2 bg-gray-400"
              style={{ left: `${(industryBenchmark.averageScore / 10) * 100}%` }}
            />
            <div 
              className="absolute top-0 w-0.5 h-2 bg-green-600"
              style={{ left: `${(industryBenchmark.topPerformerScore / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Role Benchmark */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              {roleBenchmark.role} Requirements
            </h4>
            <Badge variant="secondary" className={getReadinessColor(roleBenchmark.userReadinessAssessment)}>
              {((progress.overallScore / roleBenchmark.requiredScore) * 100).toFixed(0)}% Ready
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to Required Score</span>
              <span className="font-medium">
                {progress.overallScore.toFixed(1)} / {roleBenchmark.requiredScore.toFixed(1)}
              </span>
            </div>
            <Progress value={(progress.overallScore / roleBenchmark.requiredScore) * 100} className="h-2" />
          </div>
          
          <p className="text-sm text-muted-foreground">
            {roleBenchmark.userReadinessAssessment}
          </p>
        </div>

        {/* FAANG Standards */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            FAANG Readiness
          </h4>
          
          <div className="space-y-3">
            {faangBenchmarks.slice(0, 2).map((standard) => (
              <div key={standard.company} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{standard.company}</span>
                  <Badge variant="secondary" className={getReadinessColor(standard.readinessLevel)}>
                    {standard.readinessLevel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {standard.communicationStyle}
                </p>
                <p className="text-xs text-blue-600">
                  {standard.leadershipPrinciples}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-orange-800">Competitive Position</span>
          </div>
          <p className="text-sm text-orange-700">
            You're in the top {100 - industryBenchmark.userPercentile}% of fintech PMs. 
            Focus on executive presence to reach top 10% and Senior PM readiness.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}