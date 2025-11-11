'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { AnalysisResults, UserProfile } from '@/types/feedback-analysis';

interface OverallScoreCardProps {
  analysisResults: AnalysisResults;
  userProfile: UserProfile;
}

export const OverallScoreCard: React.FC<OverallScoreCardProps> = ({
  analysisResults,
  userProfile
}) => {
  const { overallScore, scoreImprovement, industryBenchmark, roleBenchmark, confidenceLevel } = analysisResults;
  
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreStatus = (score: number, benchmark: number) => {
    const diff = score - benchmark;
    if (diff > 0.5) return { text: 'Above Average', color: 'text-green-600', icon: TrendingUp };
    if (diff < -0.5) return { text: 'Below Average', color: 'text-red-600', icon: TrendingDown };
    return { text: 'Average', color: 'text-blue-600', icon: Target };
  };

  const industryStatus = getScoreStatus(overallScore, industryBenchmark);
  const roleStatus = getScoreStatus(overallScore, roleBenchmark);
  const IndustryIcon = industryStatus.icon;
  const RoleIcon = roleStatus.icon;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Performance Summary</span>
          <Badge className={getConfidenceColor(confidenceLevel)}>
            {confidenceLevel} Confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-blue-600">
            {overallScore.toFixed(1)}/10
          </div>
          {scoreImprovement && (
            <div className="flex items-center justify-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+{scoreImprovement.toFixed(1)} improvement</span>
            </div>
          )}
        </div>

        {/* Progress Visualization */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Score</span>
              <span>{overallScore.toFixed(1)}/10</span>
            </div>
            <Progress value={overallScore * 10} className="h-3" />
          </div>
        </div>

        {/* Benchmark Comparisons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IndustryIcon className={`h-4 w-4 ${industryStatus.color}`} />
              <span className="text-sm font-medium">Industry</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>You: {overallScore.toFixed(1)}</span>
                <span>Avg: {industryBenchmark.toFixed(1)}</span>
              </div>
              <Progress value={(overallScore / 10) * 100} className="h-2" />
              <span className={`text-xs ${industryStatus.color}`}>
                {industryStatus.text}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RoleIcon className={`h-4 w-4 ${roleStatus.color}`} />
              <span className="text-sm font-medium">Role</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>You: {overallScore.toFixed(1)}</span>
                <span>Avg: {roleBenchmark.toFixed(1)}</span>
              </div>
              <Progress value={(overallScore / 10) * 100} className="h-2" />
              <span className={`text-xs ${roleStatus.color}`}>
                {roleStatus.text}
              </span>
            </div>
          </div>
        </div>

        {/* Career Context */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <div className="text-sm font-medium text-blue-900">
                {userProfile.currentRole} → {userProfile.targetRole} Progress
              </div>
              <div className="text-xs text-blue-700">
                {analysisResults.careerProgressionInsights.readinessPercentage}% ready for advancement
              </div>
              <div className="text-xs text-blue-600">
                Est. time to readiness: {analysisResults.careerProgressionInsights.estimatedTimeToReadiness}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Key Insights</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div>• Framework usage is excellent ({analysisResults.frameworkUsage.usageQuality}/10)</div>
            <div>• Communication structure shows executive readiness</div>
            <div>• {analysisResults.careerProgressionInsights.keyGapsClosing} skill gaps closing this month</div>
            {analysisResults.strengthAreas.length > 0 && (
              <div>• Strongest area: {analysisResults.strengthAreas[0].area}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};