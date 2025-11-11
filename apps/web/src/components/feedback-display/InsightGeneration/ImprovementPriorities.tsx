'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, AlertCircle, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { ImprovementAnalysis } from '@/types/feedback-analysis';

interface ImprovementPrioritiesProps {
  improvements: ImprovementAnalysis[];
  onSelectImprovement: (improvementId: string) => void;
  selectedImprovements: string[];
}

export const ImprovementPriorities: React.FC<ImprovementPrioritiesProps> = ({
  improvements,
  onSelectImprovement,
  selectedImprovements
}) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return {
          color: 'text-red-600 bg-red-100 border-red-200',
          icon: AlertCircle,
          bgColor: 'bg-red-50 border-red-200',
          label: 'High Priority'
        };
      case 'MEDIUM':
        return {
          color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
          icon: Clock,
          bgColor: 'bg-yellow-50 border-yellow-200',
          label: 'Medium Priority'
        };
      case 'LOW':
        return {
          color: 'text-blue-600 bg-blue-100 border-blue-200',
          icon: Target,
          bgColor: 'bg-blue-50 border-blue-200',
          label: 'Low Priority'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100 border-gray-200',
          icon: Target,
          bgColor: 'bg-gray-50 border-gray-200',
          label: 'Normal Priority'
        };
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'COACHING_SESSION': return '👥';
      case 'PRACTICE_MODULE': return '🎯';
      case 'FRAMEWORK_STUDY': return '📚';
      case 'REAL_MEETING_APPLICATION': return '💼';
      default: return '🎯';
    }
  };

  const sortedImprovements = [...improvements].sort((a, b) => {
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return priorityOrder[b.priorityLevel] - priorityOrder[a.priorityLevel];
  });

  if (improvements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Improvement Priorities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No improvement areas identified</p>
            <p className="text-sm">Great work! Keep practicing to maintain your skills.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Development Opportunities
          <Badge variant="outline" className="ml-auto">
            {improvements.length} {improvements.length === 1 ? 'area' : 'areas'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedImprovements.map((improvement, index) => {
          const priorityConfig = getPriorityConfig(improvement.priorityLevel);
          const Icon = priorityConfig.icon;
          const isSelected = selectedImprovements.includes(improvement.area);
          const progressPercentage = (improvement.currentScore / improvement.targetScore) * 100;
          
          return (
            <div 
              key={index} 
              className={`border rounded-lg p-4 transition-all hover:shadow-sm ${priorityConfig.bgColor}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-current" />
                    <h3 className="font-semibold">{improvement.area}</h3>
                    <Badge className={priorityConfig.color}>
                      {priorityConfig.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {improvement.careerImpact}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {improvement.currentScore.toFixed(1)} → {improvement.targetScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Current → Target</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress to Target</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Evidence Section */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Specific Evidence:</div>
                <div className="space-y-1">
                  {improvement.specificEvidence.slice(0, 3).map((evidence, evidenceIndex) => (
                    <div key={evidenceIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{evidence}</span>
                    </div>
                  ))}
                  {improvement.specificEvidence.length > 3 && (
                    <div className="text-xs text-gray-500 italic">
                      +{improvement.specificEvidence.length - 3} more insights
                    </div>
                  )}
                </div>
              </div>

              {/* Action Items */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</div>
                <div className="space-y-2">
                  {improvement.improvementActions.map((action, actionIndex) => (
                    <div key={actionIndex} className="bg-white rounded-md p-3 border">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getMethodIcon(action.method)}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{action.action}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {action.estimatedTimeToImprovement}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {action.successMetrics.slice(0, 2).map((metric, metricIndex) => (
                              <Badge key={metricIndex} variant="outline" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                            {action.successMetrics.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{action.successMetrics.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-gray-500">
                  {improvement.improvementActions.length} action{improvement.improvementActions.length !== 1 ? 's' : ''} available
                </div>
                <Button
                  onClick={() => onSelectImprovement(improvement.area)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Added to Plan
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Start Improving
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {/* Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Development Summary</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-red-600">
                {improvements.filter(i => i.priorityLevel === 'HIGH').length}
              </div>
              <div className="text-xs text-gray-600">High Priority</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {improvements.filter(i => i.priorityLevel === 'MEDIUM').length}
              </div>
              <div className="text-xs text-gray-600">Medium Priority</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {selectedImprovements.length}
              </div>
              <div className="text-xs text-gray-600">In Progress</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center mt-2">
            Focus on high priority areas for maximum career impact
          </div>
        </div>
      </CardContent>
    </Card>
  );
};