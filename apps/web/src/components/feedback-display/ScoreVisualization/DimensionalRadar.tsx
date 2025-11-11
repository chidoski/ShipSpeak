'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DimensionalScoreBreakdown } from '@/types/feedback-analysis';
import { BarChart3, Target, TrendingUp } from 'lucide-react';

interface DimensionalRadarProps {
  scores: DimensionalScoreBreakdown;
  benchmarkData?: {
    industry: string;
    role: string;
  };
  showBenchmark?: boolean;
}

export const DimensionalRadar: React.FC<DimensionalRadarProps> = ({
  scores,
  benchmarkData,
  showBenchmark = true
}) => {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'current' | 'comparison'>('current');

  const dimensions = [
    { key: 'communicationStructure', label: 'Communication Structure', description: 'Answer-first methodology and clarity' },
    { key: 'executivePresence', label: 'Executive Presence', description: 'Confidence and authority in delivery' },
    { key: 'frameworkApplication', label: 'Framework Application', description: 'RICE, ICE, and strategic frameworks' },
    { key: 'industryFluency', label: 'Industry Fluency', description: 'Sector-specific knowledge and terminology' },
    { key: 'stakeholderAdaptation', label: 'Stakeholder Adaptation', description: 'Audience-appropriate communication' },
    { key: 'confidenceLevel', label: 'Confidence Level', description: 'Delivery confidence and conviction' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-100';
    if (score >= 7.5) return 'text-blue-600 bg-blue-100';
    if (score >= 6.5) return 'text-yellow-600 bg-yellow-100';
    if (score >= 5.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7.5) return 'Strong';
    if (score >= 6.5) return 'Good';
    if (score >= 5.5) return 'Developing';
    return 'Needs Focus';
  };

  // Simple radar chart representation using CSS
  const RadarChart = () => {
    const centerX = 120;
    const centerY = 120;
    const maxRadius = 100;
    
    const points = dimensions.map((dimension, index) => {
      const angle = (index * 60 - 90) * (Math.PI / 180); // 60 degrees apart, starting at top
      const score = scores[dimension.key as keyof DimensionalScoreBreakdown];
      const radius = (score / 10) * maxRadius;
      
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        score,
        label: dimension.label
      };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="flex justify-center">
        <svg width="240" height="240" className="border rounded-lg">
          {/* Grid circles */}
          {[2, 4, 6, 8, 10].map(value => (
            <circle
              key={value}
              cx={centerX}
              cy={centerY}
              r={(value / 10) * maxRadius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {dimensions.map((_, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const endX = centerX + maxRadius * Math.cos(angle);
            const endY = centerY + maxRadius * Math.sin(angle);
            
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Score polygon */}
          <path
            d={pathData}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Score points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              className="cursor-pointer hover:fill-blue-700"
              onClick={() => setSelectedDimension(dimensions[index].key)}
            />
          ))}
          
          {/* Labels */}
          {dimensions.map((dimension, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const labelRadius = maxRadius + 20;
            const labelX = centerX + labelRadius * Math.cos(angle);
            const labelY = centerY + labelRadius * Math.sin(angle);
            
            return (
              <text
                key={index}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-700"
                style={{ fontSize: '10px' }}
              >
                {dimension.label.split(' ')[0]}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Skill Dimensions</span>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'current' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('current')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            {showBenchmark && (
              <Button
                variant={viewMode === 'comparison' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('comparison')}
              >
                <Target className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {viewMode === 'current' ? (
          <>
            <RadarChart />
            
            <div className="grid gap-2">
              {dimensions.map(dimension => {
                const score = scores[dimension.key as keyof DimensionalScoreBreakdown];
                const colorClass = getScoreColor(score);
                
                return (
                  <div
                    key={dimension.key}
                    className={`p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedDimension === dimension.key ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedDimension(dimension.key)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{dimension.label}</div>
                        <div className="text-xs text-gray-600">{dimension.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={colorClass}>
                          {getScoreLabel(score)}
                        </Badge>
                        <span className="font-bold">{score.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Comparison vs {benchmarkData?.industry} {benchmarkData?.role}s
            </div>
            
            {/* Industry benchmark comparison */}
            {dimensions.map(dimension => {
              const score = scores[dimension.key as keyof DimensionalScoreBreakdown];
              const industryAvg = 7.2; // Mock industry average
              const diff = score - industryAvg;
              
              return (
                <div key={dimension.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dimension.label}</span>
                    <div className="flex items-center gap-2">
                      {diff > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
                      )}
                      <span className={`text-sm ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{score.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedDimension && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900">
              {dimensions.find(d => d.key === selectedDimension)?.label} Details
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Score: {scores[selectedDimension as keyof DimensionalScoreBreakdown].toFixed(1)}/10
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {dimensions.find(d => d.key === selectedDimension)?.description}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};