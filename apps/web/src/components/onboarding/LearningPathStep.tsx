'use client';

import React, { useState, useEffect } from 'react';
import { 
  LearningPath, 
  CompetencyBaseline, 
  RoleAssessment, 
  IndustryContext 
} from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface LearningPathStepProps {
  onComplete: (path: LearningPath) => void;
  onBack: () => void;
  roleAssessment: RoleAssessment;
  industryContext: IndustryContext;
  competencyBaseline: CompetencyBaseline;
}

interface PathRecommendation {
  path: LearningPath;
  title: string;
  description: string;
  bestFor: string[];
  timeCommitment: string;
  features: string[];
  confidence: number;
  reasoning: string;
}

export default function LearningPathStep({ 
  onComplete, 
  onBack,
  roleAssessment,
  industryContext,
  competencyBaseline
}: LearningPathStepProps) {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [recommendations, setRecommendations] = useState<PathRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    // Simulate AI analysis delay
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isExecutive = ['Director', 'VP Product', 'CPO'].includes(roleAssessment.currentRole);
    const avgCommunicationScore = competencyBaseline.communication.score;
    const hasUpcomingMeetings = roleAssessment.motivations.includes('Board presentation skills');
    const needsConfidenceBuilding = avgCommunicationScore < 60;

    const allRecommendations: PathRecommendation[] = [
      {
        path: 'meeting-analysis',
        title: 'Meeting Intelligence Path',
        description: 'Start by analyzing your real meetings to identify specific improvement areas',
        bestFor: [
          'PMs with upcoming board presentations',
          'Leaders with regular stakeholder meetings', 
          'Directors preparing for executive conversations'
        ],
        timeCommitment: '2-3 hours/week',
        features: [
          'Real meeting analysis with AI insights',
          'Personalized practice modules from your content',
          'Executive communication pattern recognition',
          'Board presentation optimization'
        ],
        confidence: hasUpcomingMeetings || isExecutive ? 95 : 70,
        reasoning: hasUpcomingMeetings 
          ? 'Perfect for your upcoming board presentations'
          : isExecutive 
          ? 'Ideal for executive-level communication requirements'
          : 'Great for improving real meeting performance'
      },
      {
        path: 'practice-first',
        title: 'Skill Building Path',
        description: 'Build foundational confidence with structured practice before meeting analysis',
        bestFor: [
          'New PMs building core communication skills',
          'POs transitioning to PM roles',
          'Anyone wanting to build confidence first'
        ],
        timeCommitment: '1-2 hours/week',
        features: [
          'Progressive skill building modules',
          'Safe practice environment',
          'Framework-based learning',
          'Confidence building exercises'
        ],
        confidence: needsConfidenceBuilding || roleAssessment.currentRole === 'Product Owner' ? 90 : 60,
        reasoning: needsConfidenceBuilding
          ? 'Recommended to build core communication confidence first'
          : roleAssessment.currentRole === 'Product Owner'
          ? 'Perfect for PO → PM transition skill development'
          : 'Good foundation building approach'
      },
      {
        path: 'executive-fast-track',
        title: 'Executive Excellence Path',
        description: 'Intensive executive development with board presentation mastery focus',
        bestFor: [
          'Directors and above',
          'C-suite communication requirements',
          'Board presentation preparation',
          'Speaking engagement preparation'
        ],
        timeCommitment: '3-4 hours/week',
        features: [
          'Executive presence optimization',
          'Board-level communication mastery',
          'Crisis communication preparation',
          'Speaking engagement coaching',
          'C-suite stakeholder management'
        ],
        confidence: isExecutive ? 100 : 30,
        reasoning: isExecutive 
          ? 'Specifically designed for your executive role requirements'
          : 'Consider this when you reach Director+ level'
      }
    ];

    // Sort by confidence score
    const sortedRecommendations = allRecommendations.sort((a, b) => b.confidence - a.confidence);
    setRecommendations(sortedRecommendations);
    
    // Auto-select the top recommendation
    setSelectedPath(sortedRecommendations[0].path);
    setIsAnalyzing(false);
  };

  const getRecommendationStyle = (recommendation: PathRecommendation) => {
    if (recommendation.confidence >= 90) return 'border-green-500 bg-green-50';
    if (recommendation.confidence >= 70) return 'border-blue-500 bg-blue-50';
    return 'border-gray-300 bg-gray-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'Highly Recommended';
    if (confidence >= 70) return 'Good Match';
    return 'Consider Later';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const handleSubmit = () => {
    if (selectedPath) {
      onComplete(selectedPath);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Analyzing Your Profile
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Creating personalized recommendations...</span>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
            <div className="space-y-2">
              <div>✓ Analyzing role progression from {roleAssessment.currentRole} to {roleAssessment.targetRole}</div>
              <div>✓ Processing {industryContext.sector} industry requirements</div>
              <div>✓ Evaluating competency scores across 5 key areas</div>
              <div>✓ Matching optimal learning path...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Personalized Learning Path
        </h2>
        <p className="text-gray-600">
          Based on your role, industry, and skills assessment
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <Card 
            key={recommendation.path}
            className={`p-6 transition-all cursor-pointer ${
              selectedPath === recommendation.path
                ? getRecommendationStyle(recommendation)
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => setSelectedPath(recommendation.path)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {recommendation.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                    {getConfidenceLabel(recommendation.confidence)}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {recommendation.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Best for:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {recommendation.bestFor.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Time Commitment:</h4>
                      <p className="text-sm text-gray-600">{recommendation.timeCommitment}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Why Recommended:</h4>
                      <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedPath === recommendation.path && (
                <div className="ml-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedPath && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <strong>Next Steps:</strong> We'll set up your personalized dashboard with modules 
            and practice sessions tailored to your {selectedPath.replace('-', ' ')} approach.
            You can always change your path later in settings.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="secondary"
        >
          Back to Skills Assessment
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!selectedPath}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}