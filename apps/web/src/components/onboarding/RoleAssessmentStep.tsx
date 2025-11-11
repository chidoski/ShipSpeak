'use client';

import React, { useState } from 'react';
import { PMRole, RoleAssessment } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface RoleAssessmentStepProps {
  onComplete: (assessment: RoleAssessment) => void;
  onBack?: () => void;
  initialData?: Partial<RoleAssessment>;
}

const pmRoles: Array<{ value: PMRole; label: string; description: string }> = [
  { value: 'Product Owner', label: 'Product Owner', description: 'Focus on backlog management and feature definition' },
  { value: 'PM', label: 'Product Manager', description: 'Cross-functional leadership and strategic execution' },
  { value: 'Senior PM', label: 'Senior Product Manager', description: 'Complex product ownership and team mentorship' },
  { value: 'Group PM', label: 'Group Product Manager', description: 'Multiple product management and strategic alignment' },
  { value: 'Director', label: 'Director of Product', description: 'Portfolio leadership and organizational strategy' },
  { value: 'VP Product', label: 'VP of Product', description: 'Executive product strategy and company direction' },
  { value: 'CPO', label: 'Chief Product Officer', description: 'Board-level product vision and enterprise leadership' }
];

const motivationOptions = [
  'Board presentation skills',
  'Executive presence', 
  'Team leadership',
  'Strategic communication'
] as const;

export default function RoleAssessmentStep({ 
  onComplete, 
  onBack, 
  initialData 
}: RoleAssessmentStepProps) {
  const [currentRole, setCurrentRole] = useState<PMRole | ''>
    (initialData?.currentRole || '');
  const [experienceLevel, setExperienceLevel] = useState(
    initialData?.experienceLevel?.toString() || ''
  );
  const [industryExperience, setIndustryExperience] = useState(
    initialData?.industryExperience?.toString() || ''
  );
  const [targetRole, setTargetRole] = useState<PMRole | ''>
    (initialData?.targetRole || '');
  const [timeline, setTimeline] = useState(initialData?.timeline || '');
  const [motivations, setMotivations] = useState<string[]>(
    initialData?.motivations || []
  );

  const isExecutiveRole = (role: PMRole | ''): boolean => {
    return role !== '' && ['Director', 'VP Product', 'CPO'].includes(role);
  };

  const getTargetRoleOptions = (): Array<{ value: PMRole; label: string }> => {
    if (!currentRole) return [];
    
    const currentIndex = pmRoles.findIndex(role => role.value === currentRole);
    if (currentIndex === -1) return [];
    
    // Return current role + next 2-3 progression levels
    return pmRoles.slice(currentIndex, Math.min(currentIndex + 3, pmRoles.length))
      .map(role => ({ value: role.value, label: role.label }));
  };

  const getTimelineOptions = (): string[] => {
    if (isExecutiveRole(currentRole)) {
      return ['Maintaining current level', '6-12 months', '1-2 years'];
    }
    return ['6-12 months', '1-2 years', '2-3 years', '3+ years'];
  };

  const toggleMotivation = (motivation: string) => {
    setMotivations(prev => 
      prev.includes(motivation)
        ? prev.filter(m => m !== motivation)
        : [...prev, motivation]
    );
  };

  const handleSubmit = () => {
    if (!currentRole || !targetRole || !experienceLevel || !industryExperience || !timeline) {
      return;
    }

    const assessment: RoleAssessment = {
      currentRole,
      experienceLevel: parseInt(experienceLevel),
      industryExperience: parseInt(industryExperience),
      targetRole,
      timeline,
      motivations: motivations as Array<'Board presentation skills' | 'Executive presence' | 'Team leadership' | 'Strategic communication'>
    };

    onComplete(assessment);
  };

  const isValid = currentRole && targetRole && experienceLevel && industryExperience && timeline;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Career Assessment
        </h2>
        <p className="text-gray-600">
          Tell us about your PM journey to personalize your development path
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Current Role */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Current Role
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pmRoles.map((role) => (
              <button
                key={role.value}
                onClick={() => setCurrentRole(role.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  currentRole === role.value
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="font-medium">{role.label}</div>
                <div className="text-sm text-gray-500 mt-1">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Experience Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Months in Current Role
            </label>
            <input
              type="number"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              placeholder="e.g., 18"
              min="0"
              max="240"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Years in Product/Tech
            </label>
            <input
              type="number"
              value={industryExperience}
              onChange={(e) => setIndustryExperience(e.target.value)}
              placeholder="e.g., 5"
              min="0"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Target Role */}
        {currentRole && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Target Role
            </label>
            <div className="space-y-2">
              {getTargetRoleOptions().map((role) => (
                <button
                  key={role.value}
                  onClick={() => setTargetRole(role.value)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    targetRole === role.value
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {targetRole && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Target Timeline
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getTimelineOptions().map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeline(option)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    timeline === option
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Motivations */}
        {timeline && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Primary Development Goals (select all that apply)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {motivationOptions.map((motivation) => (
                <button
                  key={motivation}
                  onClick={() => toggleMotivation(motivation)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    motivations.includes(motivation)
                      ? 'border-orange-500 bg-orange-50 text-orange-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {motivation}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {onBack && (
          <Button
            onClick={onBack}
            variant="secondary"
          >
            Back
          </Button>
        )}
        
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className={onBack ? '' : 'ml-auto'}
        >
          Continue to Industry Selection
        </Button>
      </div>
    </div>
  );
}