'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, Volume2, Eye, Brain, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';

interface ExecutivePresenceBreakdownProps {
  overallPresence: number;
  authorityMarkers: number;
  clarityScore: number;
  convictionLevel: number;
  composureRating: number;
  languageConfidence: number;
  hesitationCount?: number;
  definitiveLanguageUsage?: number;
  examples?: {
    strong: string[];
    improvement: string[];
  };
}

export const ExecutivePresenceBreakdown: React.FC<ExecutivePresenceBreakdownProps> = ({
  overallPresence = 7.1,
  authorityMarkers = 68,
  clarityScore = 82,
  convictionLevel = 65,
  composureRating = 78,
  languageConfidence = 72,
  hesitationCount = 8,
  definitiveLanguageUsage = 65,
  examples = {
    strong: [
      "Decisive language: 'We will implement this by Q2'",
      "Clear risk acknowledgment: 'The primary concern is...'",
      "Strong conclusion: 'Based on this analysis, the recommendation is...'"
    ],
    improvement: [
      "Used hesitation: 'I think maybe we should...'",
      "Uncertain language: 'This might be the right approach'",
      "Defensive tone: 'We tried our best but...'"
    ]
  }
}) => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getPresenceLevel = (score: number) => {
    if (score >= 8.5) return 'Executive Ready';
    if (score >= 7.5) return 'Strong Presence';
    if (score >= 6.5) return 'Developing';
    return 'Needs Focus';
  };

  const presenceMetrics = [
    {
      key: 'authority',
      label: 'Authority Markers',
      score: authorityMarkers,
      description: 'Decisive language and confident assertions',
      icon: Crown,
      details: 'Good use of definitive language but reduce hesitation phrases',
      improvementAreas: ['Eliminate "I think" phrases', 'Use "will" instead of "should"']
    },
    {
      key: 'clarity',
      label: 'Message Clarity',
      score: clarityScore,
      description: 'Clear and unambiguous communication',
      icon: Eye,
      details: 'Strong structural clarity with room for simpler language',
      improvementAreas: ['Reduce complex sentences', 'Use more concrete examples']
    },
    {
      key: 'conviction',
      label: 'Conviction Level',
      score: convictionLevel,
      description: 'Strength of belief in recommendations',
      icon: Brain,
      details: 'Good analytical confidence but strengthen conclusion delivery',
      improvementAreas: ['Stronger recommendation language', 'Confident risk acknowledgment']
    },
    {
      key: 'composure',
      label: 'Executive Composure',
      score: composureRating,
      description: 'Calm confidence under pressure',
      icon: Volume2,
      details: 'Maintains good composure throughout presentations',
      improvementAreas: ['Practice with challenging questions', 'Stronger voice projection']
    }
  ];

  const toggleMetric = (metricKey: string) => {
    setExpandedMetric(expandedMetric === metricKey ? null : metricKey);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            <span>Executive Presence Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getScoreColor(overallPresence * 10)}>
              {getPresenceLevel(overallPresence)}
            </Badge>
            <span className="text-2xl font-bold text-purple-600">
              {overallPresence.toFixed(1)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Assessment */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-purple-900">Executive Presence Overview</h3>
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              {Math.round((overallPresence / 10) * 100)}% of Target
            </Badge>
          </div>
          <Progress value={overallPresence * 10} className="h-3 mb-2" />
          <p className="text-sm text-purple-800">
            Strong foundational presence with excellent content delivery. 
            Focus on definitive language and authority markers for Senior PM readiness.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{definitiveLanguageUsage}%</div>
            <div className="text-xs text-blue-600">Definitive Language</div>
            <div className="text-xs text-blue-500">Target: 85%</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-700">{hesitationCount}</div>
            <div className="text-xs text-red-600">Hesitation Phrases</div>
            <div className="text-xs text-red-500">Target: &lt;3</div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Presence Dimensions</h4>
          <div className="space-y-3">
            {presenceMetrics.map((metric) => {
              const Icon = metric.icon;
              const isExpanded = expandedMetric === metric.key;
              
              return (
                <div key={metric.key} className={`border rounded-lg p-4 transition-all ${getScoreColor(metric.score).split(' ').slice(2).join(' ')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="font-medium">{metric.label}</div>
                        <div className="text-sm text-gray-600">{metric.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(metric.score)}>
                        {metric.score}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMetric(metric.key)}
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
                    <Progress value={metric.score} className="h-2" />
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-3">
                      <p className="text-sm text-gray-700">{metric.details}</p>
                      
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">Key Improvement Areas:</div>
                        <div className="space-y-1">
                          {metric.improvementAreas.map((area, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-start gap-2">
                              <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{area}</span>
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

        {/* Language Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Strong Examples
            </h4>
            <div className="space-y-2">
              {examples.strong.map((example, index) => (
                <div key={index} className="text-sm bg-green-50 p-3 rounded border-l-2 border-green-300">
                  <CheckCircle2 className="h-3 w-3 text-green-600 inline mr-2" />
                  {example}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-orange-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Areas for Improvement
            </h4>
            <div className="space-y-2">
              {examples.improvement.map((example, index) => (
                <div key={index} className="text-sm bg-orange-50 p-3 rounded border-l-2 border-orange-300">
                  <AlertCircle className="h-3 w-3 text-orange-600 inline mr-2" />
                  {example}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Executive Coaching Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Executive Development Pathway
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-purple-800 mb-1">Current Level</div>
              <div className="text-purple-700">Strong Individual Contributor</div>
              <div className="text-xs text-purple-600">Good content, developing presence</div>
            </div>
            <div>
              <div className="font-medium text-purple-800 mb-1">Target Level</div>
              <div className="text-purple-700">Senior PM Leadership</div>
              <div className="text-xs text-purple-600">Confident, decisive, authoritative</div>
            </div>
            <div>
              <div className="font-medium text-purple-800 mb-1">Time to Target</div>
              <div className="text-purple-700">2-3 months</div>
              <div className="text-xs text-purple-600">With focused practice</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-purple-200">
            <div className="text-sm text-purple-800">
              <strong>Priority Focus:</strong> Eliminate hesitation language and strengthen 
              definitive statements. Your analytical skills are strong - now build the 
              confident delivery that matches your expertise.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};