'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CareerProgressionAnalysis, UserProfile } from '@/types/feedback-analysis';

interface CareerProgressionInsightsProps {
  progressionData: CareerProgressionAnalysis;
  userProfile: UserProfile;
}

export const CareerProgressionInsights: React.FC<CareerProgressionInsightsProps> = ({
  progressionData,
  userProfile
}) => {
  const getReadinessLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Ready', color: 'text-green-600 bg-green-100', icon: CheckCircle2 };
    if (percentage >= 75) return { level: 'Nearly Ready', color: 'text-blue-600 bg-blue-100', icon: Target };
    if (percentage >= 50) return { level: 'Developing', color: 'text-yellow-600 bg-yellow-100', icon: TrendingUp };
    return { level: 'Building Foundation', color: 'text-gray-600 bg-gray-100', icon: Award };
  };

  const getCareerPath = (current: string, target: string) => {
    const transitions: Record<string, { description: string; keySkills: string[]; timeline: string }> = {
      'PO_TO_PM': {
        description: 'Product Owner → Product Manager',
        keySkills: ['Strategic Thinking', 'Business Impact', 'Stakeholder Management'],
        timeline: '6-9 months'
      },
      'PM_TO_SENIOR_PM': {
        description: 'Product Manager → Senior Product Manager',
        keySkills: ['Executive Communication', 'Trade-off Decisions', 'Authority Language'],
        timeline: '4-6 months'
      },
      'SENIOR_PM_TO_GROUP_PM': {
        description: 'Senior PM → Group Product Manager',
        keySkills: ['Portfolio Strategy', 'Team Leadership', 'Cross-functional Coordination'],
        timeline: '3-5 months'
      },
      'GROUP_PM_TO_DIRECTOR': {
        description: 'Group PM → Director of Product',
        keySkills: ['Business Strategy', 'Board Communication', 'Organizational Leadership'],
        timeline: '6-12 months'
      }
    };

    const key = `${current.toUpperCase()}_TO_${target.toUpperCase()}`;
    return transitions[key] || {
      description: `${current} → ${target}`,
      keySkills: ['Leadership', 'Communication', 'Strategy'],
      timeline: 'Variable'
    };
  };

  const { level, color, icon: Icon } = getReadinessLevel(progressionData.readinessPercentage);
  const careerPath = getCareerPath(progressionData.currentLevel, progressionData.targetLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Career Progression Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Transition Progress</h3>
            </div>
            <Badge className={color}>
              {level}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {careerPath.description}
              </span>
              <span className="text-2xl font-bold text-blue-700">
                {progressionData.readinessPercentage}%
              </span>
            </div>
            
            <Progress 
              value={progressionData.readinessPercentage} 
              className="h-3"
            />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Est. time: {progressionData.estimatedTimeToReadiness}
              </span>
              <span className="text-blue-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {progressionData.keyGapsClosing} gaps closing
              </span>
            </div>
          </div>
        </div>

        {/* Critical Skills Gap Analysis */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Critical Skill Gaps</h4>
          <div className="grid gap-3">
            {progressionData.criticalSkillGaps.map((gap, index) => (
              <div key={index} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">{gap}</span>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Priority
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Focus area for {progressionData.targetLevel} advancement
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Path Requirements */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Key Skills for Advancement</h4>
          <div className="grid gap-2">
            {careerPath.keySkills.map((skill, index) => {
              const isCompleted = !progressionData.criticalSkillGaps.includes(skill);
              
              return (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                    {skill}
                  </span>
                  {isCompleted && (
                    <Badge variant="outline" className="text-green-600 border-green-200 ml-auto">
                      ✓ Strong
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Recommended Next Steps
          </h4>
          <div className="space-y-2">
            {progressionData.readinessPercentage >= 75 ? (
              <>
                <div className="text-sm text-gray-700">
                  • Schedule advancement conversations with your manager
                </div>
                <div className="text-sm text-gray-700">
                  • Focus on remaining skill gaps: {progressionData.criticalSkillGaps.join(', ')}
                </div>
                <div className="text-sm text-gray-700">
                  • Document examples of {progressionData.targetLevel}-level work
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-700">
                  • Prioritize high-impact skill development in identified gap areas
                </div>
                <div className="text-sm text-gray-700">
                  • Practice {progressionData.targetLevel}-level communication patterns
                </div>
                <div className="text-sm text-gray-700">
                  • Build portfolio of work demonstrating next-level capabilities
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {progressionData.readinessPercentage}%
            </div>
            <div className="text-xs text-blue-700">Ready for {progressionData.targetLevel}</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {progressionData.keyGapsClosing}
            </div>
            <div className="text-xs text-green-700">Gaps closing this month</div>
          </div>
        </div>

        {/* Industry Context */}
        <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
          <strong>Industry Context:</strong> {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)} PMs typically need strong {careerPath.keySkills.slice(0, 2).join(' and ')} for {progressionData.targetLevel} roles. Your progress aligns with typical {careerPath.timeline} advancement timeline.
        </div>
      </CardContent>
    </Card>
  );
};