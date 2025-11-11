'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Target, Trophy, Clock, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  targetScore: number;
  currentProgress: number;
  estimatedWeeks: number;
  requiredActions: string[];
  careerImpact: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ProjectionScenario {
  name: string;
  timeframe: string;
  practiceFrequency: 'daily' | 'weekly' | 'biweekly';
  intensity: 'light' | 'moderate' | 'intensive';
  focusAreas: string[];
  projectedImprovement: number;
  confidenceLevel: number;
}

const mockMilestones: ProgressMilestone[] = [
  {
    id: 'eliminate-hesitation',
    title: 'Eliminate Hesitation Language',
    description: 'Remove uncertainty phrases and use definitive statements',
    targetScore: 8.0,
    currentProgress: 7.1,
    estimatedWeeks: 2,
    requiredActions: [
      'Daily practice with definitive language patterns',
      'Record 3 mock presentations per week',
      'Review and self-correct hesitation phrases'
    ],
    careerImpact: 'Immediate executive presence boost',
    difficulty: 'easy'
  },
  {
    id: 'industry-fluency',
    title: 'Fintech Regulatory Mastery',
    description: 'Master SEC regulations and banking compliance terminology',
    targetScore: 8.2,
    currentProgress: 6.9,
    estimatedWeeks: 6,
    requiredActions: [
      'Study SEC and banking regulation frameworks',
      'Practice regulatory context in product decisions',
      'Join fintech PM community discussions'
    ],
    careerImpact: 'Industry credibility and specialization',
    difficulty: 'hard'
  },
  {
    id: 'stakeholder-mastery',
    title: 'Executive Stakeholder Adaptation',
    description: 'Master C-suite communication and board presentation skills',
    targetScore: 8.5,
    currentProgress: 7.5,
    estimatedWeeks: 4,
    requiredActions: [
      'Practice board presentation structure',
      'Study C-suite communication patterns',
      'Role-play executive scenarios'
    ],
    careerImpact: 'Senior PM readiness',
    difficulty: 'medium'
  },
  {
    id: 'framework-integration',
    title: 'Advanced Framework Integration',
    description: 'Seamlessly combine multiple PM frameworks in complex scenarios',
    targetScore: 9.0,
    currentProgress: 8.7,
    estimatedWeeks: 3,
    requiredActions: [
      'Practice multi-framework scenarios',
      'Master ICE + RICE + Jobs-to-be-Done integration',
      'Apply frameworks to real product decisions'
    ],
    careerImpact: 'Analytical excellence recognition',
    difficulty: 'medium'
  }
];

const projectionScenarios: ProjectionScenario[] = [
  {
    name: 'Intensive Growth',
    timeframe: '3 months',
    practiceFrequency: 'daily',
    intensity: 'intensive',
    focusAreas: ['Executive Presence', 'Stakeholder Adaptation'],
    projectedImprovement: 1.8,
    confidenceLevel: 85
  },
  {
    name: 'Balanced Development',
    timeframe: '6 months',
    practiceFrequency: 'weekly',
    intensity: 'moderate',
    focusAreas: ['All Areas', 'Sustained Growth'],
    projectedImprovement: 2.1,
    confidenceLevel: 90
  },
  {
    name: 'Steady Progress',
    timeframe: '12 months',
    practiceFrequency: 'biweekly',
    intensity: 'light',
    focusAreas: ['Industry Fluency', 'Framework Mastery'],
    projectedImprovement: 1.4,
    confidenceLevel: 95
  }
];

export const ProgressProjection: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('Balanced Development');
  const [timeHorizon, setTimeHorizon] = useState<number>(16); // weeks

  const scenario = projectionScenarios.find(s => s.name === selectedScenario) || projectionScenarios[1];

  const getProjectedScores = useMemo(() => {
    const baselineScores = {
      executivePresence: 7.1,
      communicationStructure: 8.4,
      frameworkApplication: 8.7,
      industryFluency: 6.9,
      stakeholderAdaptation: 7.5
    };

    // Apply scenario-based improvements over time horizon
    const improvementMultiplier = Math.min(timeHorizon / 12, 2); // Cap at 2x improvement
    const scenarioMultiplier = scenario.projectedImprovement / 2.1; // Normalize to balanced scenario

    const projectedScores = { ...baselineScores };
    projectedScores.executivePresence += (1.2 * improvementMultiplier * scenarioMultiplier);
    projectedScores.industryFluency += (1.5 * improvementMultiplier * scenarioMultiplier);
    projectedScores.stakeholderAdaptation += (1.0 * improvementMultiplier * scenarioMultiplier);
    projectedScores.communicationStructure += (0.6 * improvementMultiplier * scenarioMultiplier);
    projectedScores.frameworkApplication += (0.3 * improvementMultiplier * scenarioMultiplier);

    return projectedScores;
  }, [scenario, timeHorizon]);

  const getMilestoneTimeline = useMemo(() => {
    return mockMilestones
      .filter(milestone => milestone.estimatedWeeks <= timeHorizon)
      .sort((a, b) => a.estimatedWeeks - b.estimatedWeeks)
      .map((milestone, index) => ({
        ...milestone,
        completionWeek: milestone.estimatedWeeks,
        isAchievable: milestone.estimatedWeeks <= timeHorizon
      }));
  }, [timeHorizon]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScenarioColor = (scenarioName: string) => {
    switch (scenarioName) {
      case 'Intensive Growth': return 'border-red-200 bg-red-50';
      case 'Balanced Development': return 'border-blue-200 bg-blue-50';
      case 'Steady Progress': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Progress Projection & Development Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Scenario Selection */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Development Scenarios</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projectionScenarios.map((scenarioOption) => (
              <div
                key={scenarioOption.name}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedScenario === scenarioOption.name 
                    ? `ring-2 ring-blue-500 ${getScenarioColor(scenarioOption.name)}` 
                    : `hover:shadow-md ${getScenarioColor(scenarioOption.name)}`
                }`}
                onClick={() => setSelectedScenario(scenarioOption.name)}
              >
                <div className="font-medium text-sm mb-1">{scenarioOption.name}</div>
                <div className="text-xs text-gray-600 mb-2">{scenarioOption.timeframe}</div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    +{scenarioOption.projectedImprovement} improvement
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {scenarioOption.confidenceLevel}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Horizon Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Time Horizon</h4>
            <Badge variant="outline">{timeHorizon} weeks</Badge>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="4"
              max="52"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 month</span>
              <span>6 months</span>
              <span>1 year</span>
            </div>
          </div>
        </div>

        {/* Projected Score Improvements */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Projected Score Improvements</h4>
          
          <div className="grid gap-3">
            {Object.entries(getProjectedScores).map(([dimension, projectedScore]) => {
              const baseline = {
                executivePresence: 7.1,
                communicationStructure: 8.4,
                frameworkApplication: 8.7,
                industryFluency: 6.9,
                stakeholderAdaptation: 7.5
              }[dimension as keyof typeof getProjectedScores];
              
              const improvement = projectedScore - baseline!;
              const maxScore = 10;
              
              return (
                <div key={dimension} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm capitalize">
                      {dimension.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {baseline!.toFixed(1)} → {projectedScore.toFixed(1)}
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        +{improvement.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={(projectedScore / maxScore) * 100} className="h-2" />
                    <div 
                      className="absolute top-0 h-2 bg-gray-300 rounded-full"
                      style={{ width: `${(baseline! / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Achievement Timeline</h4>
          
          <div className="space-y-3">
            {getMilestoneTimeline.map((milestone, index) => (
              <div key={milestone.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.isAchievable 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {milestone.isAchievable ? (
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {index < getMilestoneTimeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-300 mt-2" />
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{milestone.title}</span>
                    <Badge className={getDifficultyColor(milestone.difficulty)}>
                      {milestone.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Week {milestone.completionWeek}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {milestone.description}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600">
                      {milestone.careerImpact}
                    </span>
                    <div className="text-sm">
                      <span className="text-gray-500">Target: </span>
                      <span className="font-medium">{milestone.targetScore}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Impact Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Projected Career Impact
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-purple-800 mb-2">By Week {Math.ceil(timeHorizon/2)}:</div>
              <div className="text-purple-700 space-y-1">
                <div>• Noticeable executive presence improvement</div>
                <div>• Stronger framework application skills</div>
                <div>• Enhanced stakeholder communication</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-purple-800 mb-2">By Week {timeHorizon}:</div>
              <div className="text-purple-700 space-y-1">
                <div>• Senior PM communication readiness</div>
                <div>• Industry expertise recognition</div>
                <div>• Advanced framework mastery</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200">
            <div className="text-sm text-purple-800">
              <strong>Overall projection:</strong> With {scenario.intensity} practice and {scenario.practiceFrequency} sessions, 
              you're projected to achieve Senior PM communication level within {timeHorizon} weeks 
              ({scenario.confidenceLevel}% confidence).
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Your Action Plan</h4>
          
          <div className="space-y-2">
            {getMilestoneTimeline.slice(0, 3).map((milestone, index) => (
              <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-medium flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{milestone.title}</div>
                  <div className="text-xs text-gray-600">
                    Start week {Math.max(1, milestone.completionWeek - 2)} • Complete by week {milestone.completionWeek}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};