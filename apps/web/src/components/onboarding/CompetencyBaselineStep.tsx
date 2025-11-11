'use client';

import React, { useState } from 'react';
import { CompetencyBaseline, PMRole, Industry } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CompetencyBaselineStepProps {
  onComplete: (baseline: CompetencyBaseline) => void;
  onBack: () => void;
  userRole: PMRole;
  userIndustry: Industry;
  initialData?: Partial<CompetencyBaseline>;
}

interface AssessmentQuestion {
  id: string;
  category: keyof CompetencyBaseline;
  subcategory: string;
  question: string;
  examples: string[];
  scale: { min: number; max: number; minLabel: string; maxLabel: string };
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'product-sense-1',
    category: 'product-sense',
    subcategory: 'userProblemIdentification',
    question: 'How confident are you in identifying and articulating user problems?',
    examples: [
      'Writing clear problem statements',
      'Conducting user research analysis',
      'Identifying root causes vs symptoms'
    ],
    scale: { min: 20, max: 95, minLabel: 'Need significant development', maxLabel: 'Expert level' }
  },
  {
    id: 'product-sense-2',
    category: 'product-sense',
    subcategory: 'frameworkFamiliarity',
    question: 'How comfortable are you with PM frameworks (RICE, ICE, Jobs-to-be-Done)?',
    examples: [
      'Applying prioritization frameworks',
      'Using customer journey mapping',
      'Implementing OKRs and metrics'
    ],
    scale: { min: 15, max: 90, minLabel: 'Learning fundamentals', maxLabel: 'Teaching others' }
  },
  {
    id: 'communication-1',
    category: 'communication',
    subcategory: 'executivePresentation',
    question: 'How comfortable are you presenting to executives and board members?',
    examples: [
      'C-suite presentations and updates',
      'Board meeting participation',
      'High-stakes stakeholder meetings'
    ],
    scale: { min: 15, max: 90, minLabel: 'Avoid when possible', maxLabel: 'Seek opportunities' }
  },
  {
    id: 'communication-2',
    category: 'communication',
    subcategory: 'answerFirstStructure',
    question: 'How naturally do you use answer-first communication structure?',
    examples: [
      'Leading with conclusions',
      'Executive summary thinking',
      'Bottom-line up-front messaging'
    ],
    scale: { min: 20, max: 85, minLabel: 'Tell stories first', maxLabel: 'Always lead with answer' }
  },
  {
    id: 'stakeholder-1',
    category: 'stakeholder-management',
    subcategory: 'multiAudienceExperience',
    question: 'How effectively do you adapt communication for different audiences?',
    examples: [
      'Technical teams vs business stakeholders',
      'Customer-facing vs internal messaging',
      'Cross-cultural communication'
    ],
    scale: { min: 25, max: 85, minLabel: 'One-size-fits-all approach', maxLabel: 'Naturally adaptive' }
  },
  {
    id: 'technical-1',
    category: 'technical-translation',
    subcategory: 'complexitySimplification',
    question: 'How well do you translate technical complexity for business audiences?',
    examples: [
      'Explaining architecture decisions',
      'Communicating technical debt',
      'Simplifying engineering tradeoffs'
    ],
    scale: { min: 30, max: 80, minLabel: 'Struggle with translation', maxLabel: 'Master translator' }
  },
  {
    id: 'business-1',
    category: 'business-impact',
    subcategory: 'roiCommunication',
    question: 'How confidently do you communicate business impact and ROI?',
    examples: [
      'Revenue impact presentations',
      'Cost-benefit analysis communication',
      'Market opportunity sizing'
    ],
    scale: { min: 10, max: 95, minLabel: 'Avoid financial discussions', maxLabel: 'CFO-level fluency' }
  }
];

export default function CompetencyBaselineStep({ 
  onComplete, 
  onBack, 
  userRole, 
  userIndustry,
  initialData 
}: CompetencyBaselineStepProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const handleResponse = (value: number) => {
    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: value
    };
    setResponses(updatedResponses);

    if (isLastQuestion) {
      // Calculate baseline scores
      const baseline = calculateBaseline(updatedResponses);
      onComplete(baseline);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const calculateBaseline = (responses: Record<string, number>): CompetencyBaseline => {
    return {
      'product-sense': {
        userProblemIdentification: responses['product-sense-1'] || 50,
        frameworkFamiliarity: responses['product-sense-2'] || 45,
        marketContextAwareness: responses['product-sense-1'] ? responses['product-sense-1'] - 10 : 40,
        score: Math.round((
          (responses['product-sense-1'] || 50) + 
          (responses['product-sense-2'] || 45) + 
          ((responses['product-sense-1'] || 50) - 10)
        ) / 3)
      },
      communication: {
        executivePresentation: responses['communication-1'] || 40,
        answerFirstStructure: responses['communication-2'] || 45,
        stakeholderAdaptation: responses['stakeholder-1'] || 50,
        score: Math.round((
          (responses['communication-1'] || 40) + 
          (responses['communication-2'] || 45) + 
          (responses['stakeholder-1'] || 50)
        ) / 3)
      },
      'stakeholder-management': {
        multiAudienceExperience: responses['stakeholder-1'] || 50,
        conflictResolution: responses['stakeholder-1'] ? responses['stakeholder-1'] - 5 : 45,
        crossFunctionalLeadership: responses['stakeholder-1'] ? responses['stakeholder-1'] - 10 : 40,
        score: Math.round((
          (responses['stakeholder-1'] || 50) + 
          ((responses['stakeholder-1'] || 50) - 5) + 
          ((responses['stakeholder-1'] || 50) - 10)
        ) / 3)
      },
      'technical-translation': {
        complexitySimplification: responses['technical-1'] || 45,
        dataPresentationConfidence: responses['technical-1'] ? responses['technical-1'] + 5 : 50,
        businessStakeholderCommunication: responses['technical-1'] ? responses['technical-1'] + 10 : 55,
        score: Math.round((
          (responses['technical-1'] || 45) + 
          ((responses['technical-1'] || 45) + 5) + 
          ((responses['technical-1'] || 45) + 10)
        ) / 3)
      },
      'business-impact': {
        roiCommunication: responses['business-1'] || 35,
        organizationalCommunication: responses['business-1'] ? responses['business-1'] + 10 : 45,
        visionSetting: responses['business-1'] ? responses['business-1'] + 15 : 50,
        score: Math.round((
          (responses['business-1'] || 35) + 
          ((responses['business-1'] || 35) + 10) + 
          ((responses['business-1'] || 35) + 15)
        ) / 3)
      }
    };
  };

  const getRoleAdjustedExamples = (examples: string[]): string[] => {
    const isExecutive = ['Director', 'VP Product', 'CPO'].includes(userRole);
    
    if (isExecutive && currentQuestion.category === 'communication') {
      return [
        'Board presentations and quarterly reviews',
        'All-hands company communications',
        'Investor relations and external speaking'
      ];
    }
    
    if (userIndustry === 'healthcare' && currentQuestion.category === 'product-sense') {
      return [
        'Patient safety and clinical outcome problems',
        'FDA compliance and regulatory requirements',
        'Clinical workflow optimization'
      ];
    }
    
    return examples;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Skills Assessment
        </h2>
        <p className="text-gray-600">
          Help us understand your current capabilities to personalize your development path
        </p>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {assessmentQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Examples include:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                {getRoleAdjustedExamples(currentQuestion.examples).map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scale */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{currentQuestion.scale.minLabel}</span>
              <span>{currentQuestion.scale.maxLabel}</span>
            </div>
            
            <div className="relative">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4, 5].map((level) => {
                  const value = currentQuestion.scale.min + 
                    ((currentQuestion.scale.max - currentQuestion.scale.min) * (level - 1) / 4);
                  
                  return (
                    <button
                      key={level}
                      onClick={() => handleResponse(Math.round(value))}
                      className={`w-16 h-16 rounded-lg border-2 transition-all hover:scale-105 ${
                        responses[currentQuestion.id] && 
                        Math.abs(responses[currentQuestion.id] - value) < 10
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">{level}</div>
                      <div className="text-xs text-gray-500">{Math.round(value)}%</div>
                    </button>
                  );
                })}
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-2">
                Click a level to continue
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={handlePrevious}
          variant="secondary"
        >
          {currentQuestionIndex === 0 ? 'Back to Industry' : 'Previous Question'}
        </Button>
        
        {responses[currentQuestion.id] && (
          <Button
            onClick={() => handleResponse(responses[currentQuestion.id])}
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  );
}