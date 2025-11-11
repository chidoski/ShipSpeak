'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, MessageSquare, Clock, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';

interface CommunicationStructureProps {
  structureScore: number;
  answerFirstUsage: number;
  logicalFlow: number;
  timeManagement: number;
  clarityScore: number;
  examples?: string[];
  recommendations?: string[];
}

export const CommunicationStructure: React.FC<CommunicationStructureProps> = ({
  structureScore = 8.4,
  answerFirstUsage = 85,
  logicalFlow = 78,
  timeManagement = 92,
  clarityScore = 82,
  examples = [
    "Excellent opening: 'The answer is we should prioritize Feature A because...'",
    "Strong conclusion-first structure in trade-off explanation",
    "Clear three-part framework: Problem → Analysis → Recommendation"
  ],
  recommendations = [
    "Practice more complex answer-first scenarios",
    "Strengthen transition phrases between points",
    "Add executive summary for longer presentations"
  ]
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  const communicationElements = [
    {
      key: 'answer-first',
      label: 'Answer-First Methodology',
      score: answerFirstUsage,
      description: 'Leading with conclusions and recommendations',
      icon: MessageSquare,
      details: 'Consistent use of conclusion-first structure. Strong executive readiness.'
    },
    {
      key: 'logical-flow',
      label: 'Logical Flow',
      score: logicalFlow,
      description: 'Clear progression of ideas and arguments',
      icon: TrendingUp,
      details: 'Good transitions but could strengthen connection between points.'
    },
    {
      key: 'time-management',
      label: 'Time Management',
      score: timeManagement,
      description: 'Efficient use of allocated presentation time',
      icon: Clock,
      details: 'Excellent pacing and priority focus. Natural time boundaries.'
    },
    {
      key: 'clarity',
      label: 'Message Clarity',
      score: clarityScore,
      description: 'Clear and unambiguous communication',
      icon: CheckCircle2,
      details: 'Strong clarity with occasional opportunities for simplification.'
    }
  ];

  const toggleSection = (sectionKey: string) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Communication Structure Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getScoreColor(structureScore)}>
              {getScoreLabel(structureScore)}
            </Badge>
            <span className="text-2xl font-bold text-blue-600">
              {structureScore.toFixed(1)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Structure Quality</span>
            <span>{structureScore.toFixed(1)}/10</span>
          </div>
          <Progress value={structureScore * 10} className="h-3" />
          <p className="text-sm text-gray-600">
            Strong executive communication structure with consistent answer-first methodology.
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Structure Elements</h4>
          <div className="grid gap-3">
            {communicationElements.map((element) => {
              const Icon = element.icon;
              const isExpanded = expandedSection === element.key;
              
              return (
                <div key={element.key} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">{element.label}</div>
                        <div className="text-sm text-gray-600">{element.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(element.score)}>
                        {element.score}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(element.key)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <Progress value={element.score} className="h-2" />
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-700 mb-2">{element.details}</p>
                      {element.key === 'answer-first' && examples && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-600">Examples:</div>
                          {examples.slice(0, 2).map((example, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-green-50 p-2 rounded border-l-2 border-green-200">
                              <CheckCircle2 className="h-3 w-3 text-green-600 inline mr-1" />
                              {example}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pattern Recognition */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Communication Patterns Detected
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-800">Strengths</div>
              <div className="text-blue-700 space-y-1">
                <div>• Consistent answer-first structure</div>
                <div>• Strong time management</div>
                <div>• Clear executive summary style</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800">Growth Areas</div>
              <div className="text-blue-700 space-y-1">
                <div>• Strengthen logical transitions</div>
                <div>• Add more concrete examples</div>
                <div>• Practice complex scenarios</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Improvement Recommendations</h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-gray-700">{rec}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Impact */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Career Impact</h4>
          <p className="text-sm text-purple-800">
            Your communication structure shows <strong>strong executive readiness</strong>. 
            The consistent answer-first methodology and excellent time management demonstrate 
            Senior PM-level communication skills. Focus on strengthening logical flow for 
            maximum advancement impact.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};