'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  OnboardingData, 
  RoleAssessment, 
  IndustryContext, 
  CompetencyBaseline, 
  LearningPath,
  User 
} from '@/types/auth';
import { authService } from '@/services/auth.service';
import RoleAssessmentStep from './RoleAssessmentStep';
import IndustrySelectionStep from './IndustrySelectionStep';
import CompetencyBaselineStep from './CompetencyBaselineStep';
import LearningPathStep from './LearningPathStep';

interface OnboardingWizardProps {
  user: User;
  onComplete: (user: User) => void;
}

type Step = 'role-assessment' | 'industry-selection' | 'competency-baseline' | 'learning-path';

const STEPS: Array<{ id: Step; title: string; description: string }> = [
  {
    id: 'role-assessment',
    title: 'Career Assessment',
    description: 'Tell us about your PM journey'
  },
  {
    id: 'industry-selection', 
    title: 'Industry Context',
    description: 'Your industry communication focus'
  },
  {
    id: 'competency-baseline',
    title: 'Skills Assessment',
    description: 'Current capabilities baseline'
  },
  {
    id: 'learning-path',
    title: 'Learning Path',
    description: 'Personalized development plan'
  }
];

export default function OnboardingWizard({ user, onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('role-assessment');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(() => {
    // Load any existing onboarding data
    const existing = authService.getOnboardingData();
    return existing || {
      userId: user.id,
      step: 1,
      completedSteps: [],
      isExecutive: user.isExecutive
    };
  });
  const [isCompleting, setIsCompleting] = useState(false);

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  // Save onboarding data whenever it changes
  useEffect(() => {
    if (onboardingData.userId) {
      authService.saveOnboardingData(onboardingData);
    }
  }, [onboardingData]);

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      ...updates,
      completedSteps: [...(prev.completedSteps || []), currentStepIndex + 1].filter((v, i, a) => a.indexOf(v) === i)
    }));
  };

  const handleRoleAssessmentComplete = (assessment: RoleAssessment) => {
    updateOnboardingData({ 
      roleAssessment: assessment,
      isExecutive: ['Director', 'VP Product', 'CPO'].includes(assessment.currentRole)
    });
    setCurrentStep('industry-selection');
  };

  const handleIndustrySelectionComplete = (industryContext: IndustryContext) => {
    updateOnboardingData({ industryContext });
    setCurrentStep('competency-baseline');
  };

  const handleCompetencyBaselineComplete = (competencyBaseline: CompetencyBaseline) => {
    updateOnboardingData({ competencyBaseline });
    setCurrentStep('learning-path');
  };

  const handleLearningPathComplete = async (learningPath: LearningPath) => {
    setIsCompleting(true);
    
    try {
      const finalData: OnboardingData = {
        ...onboardingData as OnboardingData,
        recommendedPath: learningPath,
        completedAt: new Date().toISOString(),
        step: STEPS.length,
        completedSteps: [1, 2, 3, 4]
      };

      const response = await authService.completeOnboarding(finalData);
      
      if (response.success && response.user) {
        onComplete(response.user);
        // Redirect based on learning path
        const redirectPath = learningPath === 'executive-fast-track' 
          ? '/dashboard?focus=executive'
          : learningPath === 'meeting-analysis'
          ? '/dashboard?focus=meetings'
          : '/dashboard?focus=practice';
        
        router.push(redirectPath);
      } else {
        console.error('Failed to complete onboarding:', response.message);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStepBack = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Setting up your experience...</h2>
            <p className="text-gray-600">Creating your personalized dashboard and learning modules</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <div className="space-y-2 text-sm text-blue-700">
              <div>✓ Saving your career progression profile</div>
              <div>✓ Configuring industry-specific scenarios</div>
              <div>✓ Setting up competency tracking</div>
              <div>✓ Personalizing your learning path...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to ShipSpeak</h1>
          <p className="text-gray-600 mt-2">Let's personalize your PM development journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Setup Progress</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="relative">
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index <= currentStepIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStepIndex ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 'role-assessment' && (
            <RoleAssessmentStep
              onComplete={handleRoleAssessmentComplete}
              initialData={onboardingData.roleAssessment}
            />
          )}
          
          {currentStep === 'industry-selection' && onboardingData.roleAssessment && (
            <IndustrySelectionStep
              onComplete={handleIndustrySelectionComplete}
              onBack={handleStepBack}
              initialData={onboardingData.industryContext}
            />
          )}
          
          {currentStep === 'competency-baseline' && 
           onboardingData.roleAssessment && 
           onboardingData.industryContext && (
            <CompetencyBaselineStep
              onComplete={handleCompetencyBaselineComplete}
              onBack={handleStepBack}
              userRole={onboardingData.roleAssessment.currentRole}
              userIndustry={onboardingData.industryContext.sector}
              initialData={onboardingData.competencyBaseline}
            />
          )}
          
          {currentStep === 'learning-path' && 
           onboardingData.roleAssessment && 
           onboardingData.industryContext && 
           onboardingData.competencyBaseline && (
            <LearningPathStep
              onComplete={handleLearningPathComplete}
              onBack={handleStepBack}
              roleAssessment={onboardingData.roleAssessment}
              industryContext={onboardingData.industryContext}
              competencyBaseline={onboardingData.competencyBaseline}
            />
          )}
        </div>
      </div>
    </div>
  );
}