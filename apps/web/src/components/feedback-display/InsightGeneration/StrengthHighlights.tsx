'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trophy, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { StrengthAnalysis } from '@/types/feedback-analysis';

interface StrengthHighlightsProps {
  strengths: StrengthAnalysis[];
  onExpand: (strengthId: string) => void;
  expandedItems: string[];
}

export const StrengthHighlights: React.FC<StrengthHighlightsProps> = ({
  strengths,
  onExpand,
  expandedItems
}) => {
  const getStrengthLevel = (score: number) => {
    if (score >= 9.0) return { level: 'Exceptional', color: 'text-purple-600 bg-purple-100', icon: Trophy };
    if (score >= 8.5) return { level: 'Excellent', color: 'text-green-600 bg-green-100', icon: Star };
    if (score >= 8.0) return { level: 'Strong', color: 'text-blue-600 bg-blue-100', icon: TrendingUp };
    return { level: 'Good', color: 'text-yellow-600 bg-yellow-100', icon: Star };
  };

  const topStrength = strengths[0];
  const otherStrengths = strengths.slice(1);

  if (strengths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Strength Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Complete your analysis to see strength areas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Strength Areas
          <Badge variant="outline" className="ml-auto">
            {strengths.length} {strengths.length === 1 ? 'strength' : 'strengths'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top Strength - Featured */}
        {topStrength && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-green-900">Top Strength</h3>
                </div>
                <div className="font-medium text-green-800">{topStrength.area}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">{topStrength.score.toFixed(1)}</div>
                <div className="text-xs text-green-600">
                  {getStrengthLevel(topStrength.score).level}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-green-700 font-medium">
                {topStrength.careerLeverage}
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-medium text-green-800">Evidence:</div>
                {topStrength.evidence.slice(0, 2).map((evidence, index) => (
                  <div key={index} className="text-xs text-green-700 flex items-start gap-2">
                    <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{evidence}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExpand(topStrength.area)}
                className="w-full mt-2 text-green-700 hover:text-green-800"
              >
                {expandedItems.includes(`strength-${topStrength.area}`) ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    View Reinforcement Suggestions
                  </>
                )}
              </Button>
              
              {expandedItems.includes(`strength-${topStrength.area}`) && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="text-xs font-medium text-green-800 mb-2">
                    Ways to leverage this strength:
                  </div>
                  <div className="space-y-1">
                    {topStrength.reinforcementSuggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-green-700 flex items-start gap-2">
                        <TrendingUp className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other Strengths */}
        {otherStrengths.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Additional Strengths</h4>
            {otherStrengths.map((strength, index) => {
              const { level, color, icon: Icon } = getStrengthLevel(strength.score);
              const isExpanded = expandedItems.includes(`strength-${strength.area}`);
              
              return (
                <div key={index} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{strength.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={color}>{level}</Badge>
                      <span className="font-semibold">{strength.score.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {strength.careerLeverage}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {strength.evidence.length} evidence points
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onExpand(strength.area)}
                      className="text-xs"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Less
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-3 w-3 mr-1" />
                          Details
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-1">Evidence:</div>
                        <div className="space-y-1">
                          {strength.evidence.map((evidence, evidenceIndex) => (
                            <div key={evidenceIndex} className="text-xs text-gray-600 flex items-start gap-2">
                              <Star className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span>{evidence}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-1">
                          Reinforcement suggestions:
                        </div>
                        <div className="space-y-1">
                          {strength.reinforcementSuggestions.map((suggestion, suggestionIndex) => (
                            <div key={suggestionIndex} className="text-xs text-gray-600 flex items-start gap-2">
                              <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
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
        )}
        
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700 mb-1">
            Strength Summary
          </div>
          <div className="text-xs text-gray-600">
            You have {strengths.length} identified strength{strengths.length !== 1 ? 's' : ''}.
            {topStrength && (
              <> Your top strength ({topStrength.area}) shows exceptional performance and should be leveraged for career advancement.</>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};