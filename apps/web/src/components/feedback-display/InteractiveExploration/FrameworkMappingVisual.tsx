'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Target, Clock, DollarSign, Users, Brain, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface FrameworkUsage {
  framework: string;
  usageCount: number;
  effectivenessScore: number;
  timepoints: FrameworkTimepoint[];
  strengths: string[];
  improvements: string[];
}

interface FrameworkTimepoint {
  timestamp: string;
  context: string;
  usage: string;
  effectiveness: 'high' | 'medium' | 'low';
  explanation: string;
}

interface FrameworkMappingVisualProps {
  frameworkUsages?: FrameworkUsage[];
  totalDuration?: string;
}

const mockFrameworkUsages: FrameworkUsage[] = [
  {
    framework: 'RICE',
    usageCount: 3,
    effectivenessScore: 87,
    timepoints: [
      {
        timestamp: '02:15',
        context: 'Feature prioritization discussion',
        usage: 'Full RICE analysis with specific metrics',
        effectiveness: 'high',
        explanation: 'Complete framework application with concrete numbers'
      },
      {
        timestamp: '08:42',
        context: 'Resource allocation decision',
        usage: 'Referenced RICE scores from previous analysis',
        effectiveness: 'medium',
        explanation: 'Good reference but could have shown updated calculation'
      },
      {
        timestamp: '12:33',
        context: 'Trade-off explanation',
        usage: 'Used RICE logic to explain priority ranking',
        effectiveness: 'high',
        explanation: 'Clear framework application to justify decision'
      }
    ],
    strengths: [
      'Consistent application throughout discussion',
      'Clear numerical backing for decisions',
      'Good integration with business context'
    ],
    improvements: [
      'Could show framework calculations visually',
      'Explain confidence levels for each component'
    ]
  },
  {
    framework: 'Jobs-to-be-Done',
    usageCount: 2,
    effectivenessScore: 72,
    timepoints: [
      {
        timestamp: '05:28',
        context: 'Customer problem analysis',
        usage: 'Identified customer job and current solution gaps',
        effectiveness: 'high',
        explanation: 'Strong customer-centric framing of the problem'
      },
      {
        timestamp: '14:07',
        context: 'Solution validation',
        usage: 'Referenced job outcomes but incomplete analysis',
        effectiveness: 'medium',
        explanation: 'Good start but could have gone deeper into job success metrics'
      }
    ],
    strengths: [
      'Strong customer focus',
      'Clear problem articulation'
    ],
    improvements: [
      'More detailed outcome specification',
      'Quantify job success metrics'
    ]
  },
  {
    framework: 'ICE',
    usageCount: 1,
    effectivenessScore: 45,
    timepoints: [
      {
        timestamp: '16:52',
        context: 'Quick feature comparison',
        usage: 'Mentioned ICE but no specific scoring',
        effectiveness: 'low',
        explanation: 'Framework reference without proper application'
      }
    ],
    strengths: [
      'Awareness of multiple frameworks'
    ],
    improvements: [
      'Provide specific ICE scores',
      'Show scoring rationale',
      'Compare with RICE analysis'
    ]
  }
];

const frameworkConfigs = {
  'RICE': {
    color: 'blue',
    icon: BarChart3,
    components: ['Reach', 'Impact', 'Confidence', 'Effort'],
    description: 'Prioritization framework for feature decisions'
  },
  'Jobs-to-be-Done': {
    color: 'green',
    icon: Users,
    components: ['Job', 'Outcome', 'Context', 'Constraints'],
    description: 'Customer-centric problem understanding'
  },
  'ICE': {
    color: 'purple',
    icon: Target,
    components: ['Impact', 'Confidence', 'Ease'],
    description: 'Quick prioritization for experiments'
  },
  'OKR': {
    color: 'orange',
    icon: TrendingUp,
    components: ['Objective', 'Key Results', 'Initiatives'],
    description: 'Goal setting and progress tracking'
  }
};

export const FrameworkMappingVisual: React.FC<FrameworkMappingVisualProps> = ({
  frameworkUsages = mockFrameworkUsages,
  totalDuration = '18:45'
}) => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'effectiveness' | 'breakdown'>('timeline');

  const getEffectivenessColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getUsageEffectiveness = (effectiveness: string) => {
    switch (effectiveness) {
      case 'high': return { color: 'bg-green-500', label: 'Effective' };
      case 'medium': return { color: 'bg-yellow-500', label: 'Moderate' };
      case 'low': return { color: 'bg-red-500', label: 'Needs Work' };
      default: return { color: 'bg-gray-500', label: 'Unknown' };
    }
  };

  const totalUsages = frameworkUsages.reduce((sum, fw) => sum + fw.usageCount, 0);
  const averageEffectiveness = frameworkUsages.reduce((sum, fw) => sum + fw.effectivenessScore, 0) / frameworkUsages.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Framework Usage Mapping</span>
          </div>
          <Badge variant="outline" className="text-purple-700">
            {totalUsages} total usages
          </Badge>
        </CardTitle>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <Clock className="h-4 w-4 mr-1" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'effectiveness' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('effectiveness')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Effectiveness
          </Button>
          <Button
            variant={viewMode === 'breakdown' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('breakdown')}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Breakdown
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalUsages}</div>
            <div className="text-xs text-blue-700">Total Framework Uses</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{averageEffectiveness.toFixed(0)}%</div>
            <div className="text-xs text-green-700">Average Effectiveness</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{frameworkUsages.length}</div>
            <div className="text-xs text-purple-700">Frameworks Used</div>
          </div>
        </div>

        {viewMode === 'timeline' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Framework Usage Timeline</h4>
            
            {/* Visual Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <div className="space-y-4">
                {frameworkUsages
                  .flatMap(fw => fw.timepoints.map(tp => ({ ...tp, framework: fw.framework })))
                  .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
                  .map((point, index) => {
                    const config = frameworkConfigs[point.framework as keyof typeof frameworkConfigs];
                    const Icon = config.icon;
                    const effectiveness = getUsageEffectiveness(point.effectiveness);
                    
                    return (
                      <div key={index} className="flex items-start gap-4 relative">
                        <div className={`w-8 h-8 rounded-full bg-${config.color}-100 border-2 border-${config.color}-300 flex items-center justify-center relative z-10`}>
                          <Icon className={`h-4 w-4 text-${config.color}-600`} />
                        </div>
                        
                        <div className="flex-1 bg-white border rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`bg-${config.color}-100 text-${config.color}-800 border-${config.color}-300`}>
                                {point.framework}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {point.timestamp}
                              </Badge>
                            </div>
                            <Badge className={`${effectiveness.color} text-white`}>
                              {effectiveness.label}
                            </Badge>
                          </div>
                          
                          <div className="text-sm mb-1 font-medium">{point.context}</div>
                          <div className="text-sm text-gray-600 mb-2">{point.usage}</div>
                          <div className="text-xs text-gray-500">{point.explanation}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'effectiveness' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Framework Effectiveness Analysis</h4>
            
            <div className="space-y-3">
              {frameworkUsages
                .sort((a, b) => b.effectivenessScore - a.effectivenessScore)
                .map((framework) => {
                  const config = frameworkConfigs[framework.framework as keyof typeof frameworkConfigs];
                  const Icon = config.icon;
                  
                  return (
                    <div 
                      key={framework.framework} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedFramework === framework.framework ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedFramework(
                        selectedFramework === framework.framework ? null : framework.framework
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 text-${config.color}-600`} />
                          <div>
                            <div className="font-medium">{framework.framework}</div>
                            <div className="text-sm text-gray-600">{config.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getEffectivenessColor(framework.effectivenessScore)}>
                            {framework.effectivenessScore}%
                          </Badge>
                          <Badge variant="outline">
                            {framework.usageCount} uses
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Progress value={framework.effectivenessScore} className="h-2" />
                      </div>

                      {selectedFramework === framework.framework && (
                        <div className="pt-3 border-t space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                Strengths
                              </div>
                              <div className="space-y-1">
                                {framework.strengths.map((strength, index) => (
                                  <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                                    {strength}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Improvements
                              </div>
                              <div className="space-y-1">
                                {framework.improvements.map((improvement, index) => (
                                  <div key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                                    {improvement}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {viewMode === 'breakdown' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Framework Component Analysis</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frameworkUsages.map((framework) => {
                const config = frameworkConfigs[framework.framework as keyof typeof frameworkConfigs];
                const Icon = config.icon;
                
                return (
                  <div key={framework.framework} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`h-4 w-4 text-${config.color}-600`} />
                      <div className="font-medium">{framework.framework}</div>
                      <Badge className={getEffectivenessColor(framework.effectivenessScore)}>
                        {framework.effectivenessScore}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">Components Covered:</div>
                      <div className="grid grid-cols-2 gap-1">
                        {config.components.map((component, index) => (
                          <Badge key={index} variant="outline" className="text-xs justify-center">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-600">
                      {framework.usageCount} usage{framework.usageCount !== 1 ? 's' : ''} across meeting
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Framework Usage Insights
          </h4>
          
          <div className="space-y-2 text-sm text-purple-800">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
              <span>
                RICE framework shows excellent mastery with 87% effectiveness across 3 applications
              </span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
              <span>
                Jobs-to-be-Done used effectively for customer context but could go deeper
              </span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-red-600 mt-1 flex-shrink-0" />
              <span>
                ICE framework mentioned but not properly applied - opportunity for improvement
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};