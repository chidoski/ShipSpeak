'use client';

import React, { useState } from 'react';
import { Industry, IndustryContext } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface IndustrySelectionStepProps {
  onComplete: (industryContext: IndustryContext) => void;
  onBack: () => void;
  initialData?: Partial<IndustryContext>;
}

const industries: Array<{
  value: Industry;
  label: string;
  description: string;
  communicationFocus: string;
  requirements: string[];
}> = [
  {
    value: 'healthcare',
    label: 'Healthcare & Life Sciences',
    description: 'Medical devices, pharmaceuticals, digital health platforms',
    communicationFocus: 'Patient safety, regulatory compliance, clinical evidence',
    requirements: [
      'FDA communication protocols',
      'Clinical stakeholder management', 
      'Patient safety messaging',
      'Regulatory compliance documentation'
    ]
  },
  {
    value: 'cybersecurity',
    label: 'Cybersecurity & Risk Management',
    description: 'Security platforms, risk management, compliance solutions',
    communicationFocus: 'Risk articulation, incident response, threat communication',
    requirements: [
      'Risk communication frameworks',
      'Incident response protocols',
      'Compliance stakeholder management',
      'Security threat assessment'
    ]
  },
  {
    value: 'fintech',
    label: 'Financial Technology',
    description: 'Banking, payments, trading platforms, financial services',
    communicationFocus: 'Financial risk, regulatory compliance, trust building',
    requirements: [
      'Regulatory compliance communication',
      'Financial risk articulation',
      'Trust-building messaging',
      'Investor relations protocols'
    ]
  },
  {
    value: 'enterprise',
    label: 'Enterprise & B2B Software',
    description: 'SaaS platforms, enterprise tools, business software',
    communicationFocus: 'ROI demonstration, customer success, implementation strategy',
    requirements: [
      'ROI communication frameworks',
      'Customer success storytelling',
      'Implementation planning communication',
      'B2B stakeholder management'
    ]
  },
  {
    value: 'consumer',
    label: 'Consumer & Platform Technology',
    description: 'Social platforms, consumer apps, marketplace solutions',
    communicationFocus: 'User engagement, growth metrics, platform dynamics',
    requirements: [
      'User engagement analysis',
      'Growth metrics communication',
      'Behavioral psychology insights',
      'Platform dynamics explanation'
    ]
  }
];

export default function IndustrySelectionStep({ 
  onComplete, 
  onBack, 
  initialData 
}: IndustrySelectionStepProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | ''>
    (initialData?.sector || '');
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  const currentIndustry = industries.find(ind => ind.value === selectedIndustry);

  const toggleRequirement = (requirement: string) => {
    setSelectedRequirements(prev => 
      prev.includes(requirement)
        ? prev.filter(r => r !== requirement)
        : [...prev, requirement]
    );
  };

  const handleSubmit = () => {
    if (!selectedIndustry || !currentIndustry) return;

    const industryContext: IndustryContext = {
      sector: selectedIndustry,
      specializedRequirements: {
        [selectedIndustry]: selectedRequirements[0] as any || currentIndustry.requirements[0] as any
      }
    };

    onComplete(industryContext);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Industry Context
        </h2>
        <p className="text-gray-600">
          Your industry shapes communication requirements and stakeholder expectations
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Industry Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Your Industry
          </label>
          
          <div className="space-y-3">
            {industries.map((industry) => (
              <button
                key={industry.value}
                onClick={() => {
                  setSelectedIndustry(industry.value);
                  setSelectedRequirements([]);
                }}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedIndustry === industry.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {industry.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {industry.description}
                    </div>
                    <div className="text-sm text-blue-600 mt-2 font-medium">
                      Communication Focus: {industry.communicationFocus}
                    </div>
                  </div>
                  
                  {selectedIndustry === industry.value && (
                    <div className="ml-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Specialized Requirements */}
        {currentIndustry && (
          <div className="space-y-4">
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Key Communication Requirements for {currentIndustry.label}
              </label>
              
              <p className="text-sm text-gray-600 mb-4">
                Select the areas most relevant to your role (optional):
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentIndustry.requirements.map((requirement) => (
                  <button
                    key={requirement}
                    onClick={() => toggleRequirement(requirement)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedRequirements.includes(requirement)
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{requirement}</span>
                      {selectedRequirements.includes(requirement) && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Why this matters:</strong> ShipSpeak will personalize your practice modules 
                  with industry-specific scenarios, stakeholder types, and communication patterns 
                  relevant to {currentIndustry.label.toLowerCase()}.
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="secondary"
        >
          Back to Role Assessment
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!selectedIndustry}
        >
          Continue to Skills Assessment
        </Button>
      </div>
    </div>
  );
}