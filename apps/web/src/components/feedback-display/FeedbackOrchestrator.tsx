'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Trophy, Target, Brain, BarChart3, ArrowRight } from 'lucide-react';
import { FeedbackDisplayProps, AnalysisResults } from '@/types/feedback-analysis';
import { mockAnalysisResults, mockUserProfile, mockImprovementEngine } from '@/lib/mockFeedbackData';
import { OverallScoreCard } from './ScoreVisualization/OverallScoreCard';
import { DimensionalRadar } from './ScoreVisualization/DimensionalRadar';
import { StrengthHighlights } from './InsightGeneration/StrengthHighlights';
import { ImprovementPriorities } from './InsightGeneration/ImprovementPriorities';
import { CareerProgressionInsights } from './InsightGeneration/CareerProgressionInsights';
import { CommunicationStructure } from './DetailedAnalysis/CommunicationStructure';
import { ExecutivePresenceBreakdown } from './DetailedAnalysis/ExecutivePresenceBreakdown';
import { IndustryFluencyAnalysis } from './DetailedAnalysis/IndustryFluencyAnalysis';
import { StakeholderAdaptationAssessment } from './DetailedAnalysis/StakeholderAdaptationAssessment';
import { TranscriptHighlighting } from './InteractiveExploration/TranscriptHighlighting';
import { FrameworkMappingVisual } from './InteractiveExploration/FrameworkMappingVisual';
import { ImprovementSimulator } from './InteractiveExploration/ImprovementSimulator';
import { ProgressProjection } from './InteractiveExploration/ProgressProjection';

interface FeedbackOrchestratorProps {
  sessionId: string;
  analysisResults?: AnalysisResults;
  onActionSelected?: (actionId: string) => void;
}

export const FeedbackOrchestrator: React.FC<FeedbackOrchestratorProps> = ({
  sessionId,
  analysisResults = mockAnalysisResults,
  onActionSelected
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'analysis' | 'insights' | 'actions' | 'interactive'>('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['score', 'strengths']);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);

  const userProfile = mockUserProfile;
  const improvementEngine = mockImprovementEngine;

  const visualizationConfig = {
    chartType: 'RADAR' as const,
    interactivity: 'HIGH' as const,
    animationStyle: 'SMOOTH' as const,
    colorScheme: 'PROFESSIONAL' as const
  };

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleImprovementSelect = (improvementId: string) => {
    setSelectedImprovements(prev => 
      prev.includes(improvementId)
        ? prev.filter(id => id !== improvementId)
        : [...prev, improvementId]
    );
    onActionSelected?.(improvementId);
  };

  const getOverallGrade = (score: number): { grade: string; color: string } => {
    if (score >= 8.5) return { grade: 'A', color: 'text-green-600' };
    if (score >= 7.5) return { grade: 'B+', color: 'text-blue-600' };
    if (score >= 6.5) return { grade: 'B', color: 'text-yellow-600' };
    if (score >= 5.5) return { grade: 'C+', color: 'text-orange-600' };
    return { grade: 'C', color: 'text-red-600' };
  };

  const { grade, color } = getOverallGrade(analysisResults.overallScore);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Summary */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Practice Session Analysis</h1>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)} PM
          </Badge>
        </div>
        
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className={`text-5xl font-bold ${color}`}>{grade}</div>
            <div className="text-sm text-gray-600">Overall Grade</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{analysisResults.overallScore.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Score</div>
            {analysisResults.scoreImprovement && (
              <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-3 w-3" />
                +{analysisResults.scoreImprovement.toFixed(1)}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{analysisResults.careerProgressionInsights.readinessPercentage}%</div>
            <div className="text-sm text-gray-600">Career Ready</div>
          </div>
        </div>

        <Progress 
          value={analysisResults.careerProgressionInsights.readinessPercentage} 
          className="w-96 mx-auto"
        />
        <p className="text-gray-600">
          {analysisResults.careerProgressionInsights.estimatedTimeToReadiness} to {analysisResults.careerProgressionInsights.targetLevel} readiness
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="interactive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Interactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OverallScoreCard 
              analysisResults={analysisResults}
              userProfile={userProfile}
            />
            <DimensionalRadar 
              scores={analysisResults.dimensionalScores}
              benchmarkData={{ industry: userProfile.industry, role: userProfile.currentRole }}
            />
          </div>
          
          <StrengthHighlights 
            strengths={analysisResults.strengthAreas}
            onExpand={(id) => handleSectionToggle(`strength-${id}`)}
            expandedItems={expandedSections.filter(id => id.startsWith('strength-'))}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6">
            <CommunicationStructure 
              structureScore={analysisResults.dimensionalScores.communicationStructure}
              answerFirstUsage={85}
              logicalFlow={78}
              timeManagement={92}
              clarityScore={82}
            />
            <ExecutivePresenceBreakdown 
              overallPresence={analysisResults.dimensionalScores.executivePresence}
              authorityMarkers={68}
              clarityScore={82}
              convictionLevel={65}
              composureRating={78}
              languageConfidence={72}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IndustryFluencyAnalysis 
                industry={userProfile.industry}
                overallFluency={analysisResults.dimensionalScores.industryFluency}
                vocabularyUsage={72}
                regulatoryAwareness={65}
                marketContext={78}
                competitorKnowledge={68}
              />
              <StakeholderAdaptationAssessment 
                overallAdaptation={analysisResults.dimensionalScores.stakeholderAdaptation}
                executiveAdaptation={72}
                engineeringAdaptation={78}
                businessAdaptation={81}
                customerAdaptation={69}
                audienceRecognition={75}
                messageCustomization={73}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <CareerProgressionInsights 
              progressionData={analysisResults.careerProgressionInsights}
              userProfile={userProfile}
            />
            <ImprovementPriorities 
              improvements={analysisResults.improvementAreas}
              onSelectImprovement={handleImprovementSelect}
              selectedImprovements={selectedImprovements}
            />
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid gap-6">
            <ImprovementSimulator />
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.improvementAreas.map((improvement, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{improvement.area}</h4>
                      <div className="space-y-2">
                        {improvement.improvementActions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-center justify-between">
                            <span className="text-sm">{action.action}</span>
                            <Button 
                              size="sm" 
                              onClick={() => handleImprovementSelect(`${improvement.area}-${actionIndex}`)}
                            >
                              Start Practice
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactive" className="space-y-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TranscriptHighlighting />
              <FrameworkMappingVisual />
            </div>
            <ProgressProjection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};