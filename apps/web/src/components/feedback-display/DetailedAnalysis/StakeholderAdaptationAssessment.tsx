'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users, Crown, Code, DollarSign, Target, Brain, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';

interface StakeholderAdaptationAssessmentProps {
  overallAdaptation: number;
  executiveAdaptation: number;
  engineeringAdaptation: number;
  businessAdaptation: number;
  customerAdaptation: number;
  audienceRecognition: number;
  messageCustomization: number;
  examples?: {
    [key: string]: {
      effective: string[];
      needsWork: string[];
    };
  };
}

export const StakeholderAdaptationAssessment: React.FC<StakeholderAdaptationAssessmentProps> = ({
  overallAdaptation = 7.5,
  executiveAdaptation = 72,
  engineeringAdaptation = 78,
  businessAdaptation = 81,
  customerAdaptation = 69,
  audienceRecognition = 75,
  messageCustomization = 73,
  examples = {
    executive: {
      effective: [
        "Led with business impact: 'This will increase revenue by 15%'",
        "Used answer-first structure with clear recommendation"
      ],
      needsWork: [
        "Too much technical detail for C-suite audience",
        "Could strengthen strategic context"
      ]
    },
    engineering: {
      effective: [
        "Provided technical context and feasibility considerations",
        "Acknowledged implementation challenges"
      ],
      needsWork: [
        "Could better explain business rationale",
        "More specific technical requirements needed"
      ]
    },
    business: {
      effective: [
        "Clear ROI discussion with supporting metrics",
        "Good market context and competitive positioning"
      ],
      needsWork: [
        "Could strengthen customer impact story",
        "More specific success metrics needed"
      ]
    }
  }
}) => {
  const [expandedStakeholder, setExpandedStakeholder] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getAdaptationLevel = (score: number) => {
    if (score >= 8.5) return 'Expert Adaptation';
    if (score >= 7.5) return 'Strong Adaptation';
    if (score >= 6.5) return 'Good Adaptation';
    return 'Needs Development';
  };

  const stakeholderTypes = [
    {
      key: 'executive',
      label: 'Executive Leadership',
      score: executiveAdaptation,
      description: 'C-suite, VPs, and senior leadership',
      icon: Crown,
      color: 'purple',
      focus: ['Business impact', 'Strategic context', 'Risk awareness', 'Clear recommendations'],
      commonMistakes: ['Too much detail', 'Missing ROI context', 'Unclear next steps']
    },
    {
      key: 'engineering',
      label: 'Engineering Teams',
      score: engineeringAdaptation,
      description: 'Developers, architects, and technical leads',
      icon: Code,
      color: 'blue',
      focus: ['Technical feasibility', 'Implementation details', 'Resource requirements', 'Timeline realism'],
      commonMistakes: ['Insufficient technical depth', 'Unrealistic timelines', 'Missing dependency context']
    },
    {
      key: 'business',
      label: 'Business Partners',
      score: businessAdaptation,
      description: 'Sales, marketing, operations, and finance',
      icon: DollarSign,
      color: 'green',
      focus: ['Market opportunity', 'Customer impact', 'Revenue implications', 'Competitive advantage'],
      commonMistakes: ['Too technical', 'Missing market context', 'Weak business case']
    },
    {
      key: 'customer',
      label: 'Customer-Facing',
      score: customerAdaptation,
      description: 'Support, success, and external stakeholders',
      icon: Target,
      color: 'orange',
      focus: ['User experience', 'Customer value', 'Implementation impact', 'Support considerations'],
      commonMistakes: ['Internal jargon', 'Missing customer perspective', 'Unclear value proposition']
    }
  ];

  const toggleStakeholder = (stakeholderKey: string) => {
    setExpandedStakeholder(expandedStakeholder === stakeholderKey ? null : stakeholderKey);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Stakeholder Adaptation Assessment</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getScoreColor(overallAdaptation * 10)}>
              {getAdaptationLevel(overallAdaptation)}
            </Badge>
            <span className="text-2xl font-bold text-blue-600">
              {overallAdaptation.toFixed(1)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Adaptation Overview */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-blue-900">Audience Adaptation Skills</h3>
            <div className="text-sm text-blue-700">
              {Math.round((overallAdaptation / 10) * 100)}% of Advanced Level
            </div>
          </div>
          <Progress value={overallAdaptation * 10} className="h-3 mb-2" />
          <p className="text-sm text-blue-800">
            Good foundational stakeholder awareness with strong business and engineering adaptation. 
            Focus on executive communication and customer-facing scenarios for advancement readiness.
          </p>
        </div>

        {/* Adaptation Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-700">{audienceRecognition}%</div>
            <div className="text-xs text-purple-600">Audience Recognition</div>
            <div className="text-xs text-purple-500">Identifying stakeholder needs</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{messageCustomization}%</div>
            <div className="text-xs text-green-600">Message Customization</div>
            <div className="text-xs text-green-500">Adapting communication style</div>
          </div>
        </div>

        {/* Stakeholder-Specific Analysis */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Stakeholder-Specific Adaptation</h4>
          <div className="space-y-3">
            {stakeholderTypes.map((stakeholder) => {
              const Icon = stakeholder.icon;
              const isExpanded = expandedStakeholder === stakeholder.key;
              const colorClass = `text-${stakeholder.color}-600 bg-${stakeholder.color}-100 border-${stakeholder.color}-200`;
              
              return (
                <div key={stakeholder.key} className={`border rounded-lg p-4 transition-all ${getScoreColor(stakeholder.score).split(' ').slice(2).join(' ')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 text-${stakeholder.color}-600`} />
                      <div>
                        <div className="font-medium">{stakeholder.label}</div>
                        <div className="text-sm text-gray-600">{stakeholder.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(stakeholder.score)}>
                        {stakeholder.score}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStakeholder(stakeholder.key)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Progress value={stakeholder.score} className="h-2 mb-2" />

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-4">
                      {/* Key Focus Areas */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Key Focus Areas:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {stakeholder.focus.map((focus, index) => (
                            <div key={index} className={`text-xs p-2 rounded bg-${stakeholder.color}-50 border border-${stakeholder.color}-200`}>
                              <CheckCircle2 className={`h-3 w-3 text-${stakeholder.color}-600 inline mr-1`} />
                              {focus}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Examples */}
                      {examples[stakeholder.key] && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-medium text-green-700 mb-2">Effective Examples:</div>
                            <div className="space-y-2">
                              {examples[stakeholder.key].effective.map((example, index) => (
                                <div key={index} className="text-xs bg-green-50 p-2 rounded border-l-2 border-green-300">
                                  <CheckCircle2 className="h-3 w-3 text-green-600 inline mr-1" />
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs font-medium text-orange-700 mb-2">Areas for Improvement:</div>
                            <div className="space-y-2">
                              {examples[stakeholder.key].needsWork.map((example, index) => (
                                <div key={index} className="text-xs bg-orange-50 p-2 rounded border-l-2 border-orange-300">
                                  <AlertTriangle className="h-3 w-3 text-orange-600 inline mr-1" />
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Common Mistakes */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Common Mistakes to Avoid:</div>
                        <div className="space-y-1">
                          {stakeholder.commonMistakes.map((mistake, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{mistake}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Adaptation Strategies */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Stakeholder Adaptation Strategies
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-800 mb-2">Before Every Communication:</div>
              <div className="text-blue-700 space-y-1">
                <div>• Identify primary stakeholder type</div>
                <div>• Consider their key concerns & motivations</div>
                <div>• Choose appropriate detail level</div>
                <div>• Select relevant examples & metrics</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800 mb-2">Communication Tactics:</div>
              <div className="text-blue-700 space-y-1">
                <div>• Lead with what matters to them</div>
                <div>• Use their language & terminology</div>
                <div>• Address their likely objections</div>
                <div>• Provide actionable next steps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Focus */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Priority Development Areas
          </h4>
          
          <div className="text-sm text-yellow-800 space-y-2">
            <div>
              <strong>1. Executive Communication:</strong> Strengthen C-suite adaptation by 
              leading with business impact and using more strategic language.
            </div>
            <div>
              <strong>2. Customer-Facing Skills:</strong> Improve external stakeholder communication 
              by simplifying technical concepts and emphasizing user value.
            </div>
            <div>
              <strong>3. Cross-Functional Fluency:</strong> Practice switching between technical 
              depth (engineering) and business impact (executives) within the same meeting.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};