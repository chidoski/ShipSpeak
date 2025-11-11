'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Zap, PlayCircle, RotateCcw, TrendingUp, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImprovementAction {
  id: string;
  name: string;
  category: 'Executive Presence' | 'Communication Structure' | 'Industry Fluency' | 'Framework Application' | 'Stakeholder Adaptation';
  currentLevel: number;
  maxLevel: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImpact: number; // weeks
  description: string;
  impact: {
    executivePresence?: number;
    communicationStructure?: number;
    frameworkApplication?: number;
    industryFluency?: number;
    stakeholderAdaptation?: number;
  };
}

interface SimulationResult {
  overallScoreImprovement: number;
  dimensionalImprovements: Record<string, number>;
  timelineWeeks: number;
  careerImpact: string;
  nextSteps: string[];
}

const mockImprovementActions: ImprovementAction[] = [
  {
    id: 'definitive-language',
    name: 'Eliminate Hesitation Language',
    category: 'Executive Presence',
    currentLevel: 0,
    maxLevel: 3,
    difficulty: 'easy',
    timeToImpact: 2,
    description: 'Remove "I think", "maybe", "possibly" and use definitive statements',
    impact: {
      executivePresence: 1.2,
      communicationStructure: 0.4
    }
  },
  {
    id: 'answer-first-mastery',
    name: 'Advanced Answer-First Techniques',
    category: 'Communication Structure',
    currentLevel: 0,
    maxLevel: 3,
    difficulty: 'medium',
    timeToImpact: 4,
    description: 'Master complex answer-first structures for multi-part decisions',
    impact: {
      communicationStructure: 1.5,
      executivePresence: 0.8
    }
  },
  {
    id: 'fintech-vocabulary',
    name: 'Fintech Regulatory Mastery',
    category: 'Industry Fluency',
    currentLevel: 0,
    maxLevel: 3,
    difficulty: 'hard',
    timeToImpact: 6,
    description: 'Master SEC, banking regulations, and compliance terminology',
    impact: {
      industryFluency: 1.8,
      stakeholderAdaptation: 0.5
    }
  },
  {
    id: 'framework-integration',
    name: 'Multi-Framework Integration',
    category: 'Framework Application',
    currentLevel: 0,
    maxLevel: 3,
    difficulty: 'medium',
    timeToImpact: 3,
    description: 'Seamlessly combine RICE, ICE, and Jobs-to-be-Done frameworks',
    impact: {
      frameworkApplication: 1.3,
      communicationStructure: 0.6
    }
  },
  {
    id: 'stakeholder-personas',
    name: 'Advanced Stakeholder Adaptation',
    category: 'Stakeholder Adaptation',
    currentLevel: 0,
    maxLevel: 3,
    difficulty: 'medium',
    timeToImpact: 4,
    description: 'Master C-suite, engineering, and customer communication styles',
    impact: {
      stakeholderAdaptation: 1.6,
      executivePresence: 0.7
    }
  }
];

export const ImprovementSimulator: React.FC = () => {
  const [selectedActions, setSelectedActions] = useState<Record<string, number>>({});
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Current baseline scores
  const baselineScores = {
    executivePresence: 7.1,
    communicationStructure: 8.4,
    frameworkApplication: 8.7,
    industryFluency: 6.9,
    stakeholderAdaptation: 7.5
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const improvements = { ...baselineScores };
      let totalTimeWeeks = 0;
      let totalImprovement = 0;

      // Apply selected improvements
      Object.entries(selectedActions).forEach(([actionId, level]) => {
        const action = mockImprovementActions.find(a => a.id === actionId);
        if (action && level > 0) {
          const multiplier = level / action.maxLevel;
          
          // Apply impacts
          Object.entries(action.impact).forEach(([dimension, impact]) => {
            if (improvements[dimension as keyof typeof improvements] !== undefined) {
              improvements[dimension as keyof typeof improvements] += impact! * multiplier;
            }
          });
          
          // Calculate time (parallel improvements don't stack linearly)
          totalTimeWeeks = Math.max(totalTimeWeeks, action.timeToImpact * multiplier);
        }
      });

      // Calculate overall score improvement
      const newOverallScore = Object.values(improvements).reduce((sum, score) => sum + score, 0) / 5;
      const baselineOverallScore = Object.values(baselineScores).reduce((sum, score) => sum + score, 0) / 5;
      totalImprovement = newOverallScore - baselineOverallScore;

      // Determine career impact
      let careerImpact = 'Minimal Impact';
      if (totalImprovement >= 1.5) careerImpact = 'Significant advancement readiness';
      else if (totalImprovement >= 1.0) careerImpact = 'Strong improvement toward goals';
      else if (totalImprovement >= 0.5) careerImpact = 'Noticeable skill development';

      // Generate next steps
      const nextSteps: string[] = [];
      if (improvements.executivePresence < 8.0) {
        nextSteps.push('Focus on eliminating hesitation language first');
      }
      if (improvements.industryFluency < 8.0) {
        nextSteps.push('Build regulatory vocabulary for credibility');
      }
      if (improvements.stakeholderAdaptation < 8.5) {
        nextSteps.push('Practice C-suite presentation skills');
      }

      setSimulationResult({
        overallScoreImprovement: totalImprovement,
        dimensionalImprovements: improvements,
        timelineWeeks: Math.ceil(totalTimeWeeks),
        careerImpact,
        nextSteps
      });
      
      setIsSimulating(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setSelectedActions({});
    setSimulationResult(null);
  };

  const updateActionLevel = (actionId: string, level: number) => {
    setSelectedActions(prev => ({
      ...prev,
      [actionId]: level
    }));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Improvement Impact Simulator</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={runSimulation}
              disabled={isSimulating || Object.keys(selectedActions).length === 0}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
            <Button
              variant="outline"
              onClick={resetSimulation}
              disabled={isSimulating}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Improvement Actions Selection */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Select Improvement Actions</h4>
          
          <div className="grid gap-4">
            {mockImprovementActions.map((action) => (
              <div key={action.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{action.name}</span>
                      <Badge className={getDifficultyColor(action.difficulty)}>
                        {action.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {action.timeToImpact} weeks
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{action.description}</div>
                    <div className="text-xs text-gray-500">
                      Category: {action.category}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Commitment Level</span>
                    <span className="text-sm text-gray-600">
                      {selectedActions[action.id] || 0} / {action.maxLevel}
                    </span>
                  </div>
                  
                  <Slider
                    value={[selectedActions[action.id] || 0]}
                    onValueChange={(value) => updateActionLevel(action.id, value[0])}
                    max={action.maxLevel}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>None</span>
                    <span>Basic</span>
                    <span>Intermediate</span>
                    <span>Advanced</span>
                  </div>
                </div>

                {/* Show impact preview */}
                {selectedActions[action.id] > 0 && (
                  <div className="bg-blue-50 rounded p-2 text-xs">
                    <div className="font-medium text-blue-900 mb-1">Projected Impact:</div>
                    {Object.entries(action.impact).map(([dimension, impact]) => (
                      <div key={dimension} className="text-blue-800">
                        {dimension}: +{((impact! * selectedActions[action.id]) / action.maxLevel).toFixed(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Results */}
        {simulationResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-700">Simulation Results</h4>
            </div>

            {/* Overall Impact */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    +{simulationResult.overallScoreImprovement.toFixed(1)}
                  </div>
                  <div className="text-sm text-green-600">Overall Score Improvement</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">
                    {simulationResult.timelineWeeks}
                  </div>
                  <div className="text-sm text-blue-600">Weeks to Impact</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-700">
                    {simulationResult.careerImpact}
                  </div>
                  <div className="text-sm text-purple-600">Career Impact</div>
                </div>
              </div>
            </div>

            {/* Dimensional Improvements */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-700">Projected Score Changes</h5>
              {Object.entries(simulationResult.dimensionalImprovements).map(([dimension, newScore]) => {
                const baseline = baselineScores[dimension as keyof typeof baselineScores];
                const improvement = newScore - baseline;
                const isPositive = improvement > 0;
                
                return (
                  <div key={dimension} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">
                        {dimension.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        {baseline.toFixed(1)} → {newScore.toFixed(1)}
                      </div>
                      {isPositive && (
                        <Badge className="bg-green-100 text-green-800">
                          +{improvement.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Steps */}
            {simulationResult.nextSteps.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-700">Recommended Next Steps</h5>
                <div className="space-y-2">
                  {simulationResult.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h5 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Your Personalized Action Plan
              </h5>
              <div className="space-y-2 text-sm text-purple-800">
                <div>
                  <strong>Phase 1 (Weeks 1-2):</strong> Start with high-impact, low-effort improvements
                </div>
                <div>
                  <strong>Phase 2 (Weeks 3-{Math.ceil(simulationResult.timelineWeeks/2)}):</strong> Focus on structural communication changes
                </div>
                <div>
                  <strong>Phase 3 (Weeks {Math.ceil(simulationResult.timelineWeeks/2)+1}-{simulationResult.timelineWeeks}):</strong> Master advanced techniques and integration
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {Object.keys(selectedActions).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-2">Design Your Improvement Plan</p>
            <p>Select improvement actions above and adjust commitment levels to see projected impact.</p>
            <p className="text-sm mt-2">Higher commitment levels = greater impact but more time investment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};