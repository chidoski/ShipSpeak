'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Building2, Shield, DollarSign, Users, Smartphone, BookOpen, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';

interface IndustryFluencyAnalysisProps {
  industry: 'fintech' | 'healthcare' | 'cybersecurity' | 'enterprise' | 'consumer';
  overallFluency: number;
  vocabularyUsage: number;
  regulatoryAwareness: number;
  marketContext: number;
  competitorKnowledge: number;
  examples?: {
    strong: string[];
    missing: string[];
  };
}

const industryConfigs = {
  fintech: {
    name: 'Financial Technology',
    icon: DollarSign,
    color: 'green',
    keyAreas: [
      'Regulatory Compliance (SEC, Banking)',
      'Risk Management & Fraud Prevention', 
      'Payment Processing & Settlement',
      'Financial Product Knowledge'
    ],
    vocabulary: ['KYC', 'AML', 'PCI DSS', 'ACH', 'Settlement', 'Chargeback', 'APR', 'Credit scoring'],
    regulatoryFrameworks: ['SOX', 'PCI DSS', 'GDPR', 'SEC regulations'],
    competitorLandscape: 'Traditional banks, Fintech startups, Payment processors'
  },
  healthcare: {
    name: 'Healthcare & Life Sciences',
    icon: Users,
    color: 'blue',
    keyAreas: [
      'HIPAA & Patient Privacy',
      'FDA Regulatory Pathways',
      'Clinical Workflows & EHR',
      'Patient Safety & Outcomes'
    ],
    vocabulary: ['HIPAA', 'FDA', 'EHR', 'HL7', 'FHIR', 'Clinical trial', 'Adverse event', 'Biomarker'],
    regulatoryFrameworks: ['FDA 21 CFR Part 11', 'HIPAA', 'HITECH', 'GCP'],
    competitorLandscape: 'EMR vendors, Health systems, Digital health startups'
  },
  cybersecurity: {
    name: 'Cybersecurity & Enterprise Security',
    icon: Shield,
    color: 'red',
    keyAreas: [
      'Threat Landscape & Attack Vectors',
      'Compliance Frameworks (SOC2, ISO27001)',
      'Zero-Trust Architecture',
      'Incident Response & Recovery'
    ],
    vocabulary: ['Zero-trust', 'SIEM', 'SOC', 'Threat intel', 'APT', 'MITRE ATT&CK', 'Vulnerability assessment'],
    regulatoryFrameworks: ['SOC2', 'ISO27001', 'NIST', 'GDPR'],
    competitorLandscape: 'Enterprise security vendors, Cloud security, Managed services'
  },
  enterprise: {
    name: 'Enterprise Software & B2B',
    icon: Building2,
    color: 'purple',
    keyAreas: [
      'Enterprise Sales Cycles',
      'ROI & Business Case Development',
      'Implementation & Change Management',
      'Customer Success & Retention'
    ],
    vocabulary: ['ROI', 'TCO', 'SLA', 'Enterprise architecture', 'Change management', 'Stakeholder matrix'],
    regulatoryFrameworks: ['SOX', 'GDPR', 'Industry-specific compliance'],
    competitorLandscape: 'Legacy enterprise vendors, Cloud-native solutions, Niche specialists'
  },
  consumer: {
    name: 'Consumer Technology & Apps',
    icon: Smartphone,
    color: 'orange',
    keyAreas: [
      'User Experience & Behavioral Psychology',
      'Growth Metrics & Retention',
      'App Store Optimization',
      'Privacy & Data Protection'
    ],
    vocabulary: ['DAU', 'MAU', 'LTV', 'CAC', 'Retention curve', 'A/B testing', 'Cohort analysis', 'Viral coefficient'],
    regulatoryFrameworks: ['GDPR', 'CCPA', 'App Store policies', 'FTC guidelines'],
    competitorLandscape: 'Big Tech platforms, App ecosystem players, Direct competitors'
  }
};

export const IndustryFluencyAnalysis: React.FC<IndustryFluencyAnalysisProps> = ({
  industry = 'fintech',
  overallFluency = 6.9,
  vocabularyUsage = 72,
  regulatoryAwareness = 65,
  marketContext = 78,
  competitorKnowledge = 68,
  examples = {
    strong: [
      "Good ROI focus in business reasoning",
      "Clear understanding of customer value proposition", 
      "Appropriate use of business metrics and KPIs"
    ],
    missing: [
      "Limited regulatory context in product decisions",
      "Missing compliance framework integration",
      "Could strengthen risk management vocabulary"
    ]
  }
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const config = industryConfigs[industry];
  const colorClasses = {
    green: 'text-green-600 bg-green-100 border-green-200',
    blue: 'text-blue-600 bg-blue-100 border-blue-200', 
    red: 'text-red-600 bg-red-100 border-red-200',
    purple: 'text-purple-600 bg-purple-100 border-purple-200',
    orange: 'text-orange-600 bg-orange-100 border-orange-200'
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const fluencyMetrics = [
    {
      key: 'vocabulary',
      label: 'Industry Vocabulary',
      score: vocabularyUsage,
      description: 'Appropriate use of industry-specific terminology',
      details: `Good foundational vocabulary but missing key ${industry} terms`
    },
    {
      key: 'regulatory', 
      label: 'Regulatory Awareness',
      score: regulatoryAwareness,
      description: 'Understanding of compliance requirements',
      details: `Needs stronger integration of ${config.regulatoryFrameworks.slice(0,2).join(' and ')} considerations`
    },
    {
      key: 'market',
      label: 'Market Context',
      score: marketContext, 
      description: 'Industry trends and market dynamics',
      details: 'Good market awareness with room for competitive positioning'
    },
    {
      key: 'competitors',
      label: 'Competitive Knowledge',
      score: competitorKnowledge,
      description: 'Understanding of competitive landscape',
      details: 'Basic competitor awareness, could strengthen differentiation messaging'
    }
  ];

  const toggleSection = (sectionKey: string) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey);
  };

  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 text-${config.color}-600`} />
            <span>{config.name} Fluency</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getScoreColor(overallFluency * 10)}>
              {overallFluency >= 8 ? 'Expert' : overallFluency >= 7 ? 'Proficient' : overallFluency >= 6 ? 'Developing' : 'Beginner'}
            </Badge>
            <span className={`text-2xl font-bold text-${config.color}-600`}>
              {overallFluency.toFixed(1)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Industry Overview */}
        <div className={`${colorClasses[config.color]} rounded-lg p-4`}>
          <h3 className="font-medium mb-2">Industry Context Assessment</h3>
          <div className="text-sm space-y-1">
            <div>• <strong>Specialization:</strong> {config.name}</div>
            <div>• <strong>Key Focus:</strong> {config.keyAreas.slice(0,2).join(', ')}</div>
            <div>• <strong>Regulatory Environment:</strong> {config.regulatoryFrameworks.slice(0,2).join(', ')}</div>
          </div>
        </div>

        {/* Fluency Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Fluency Dimensions</h4>
          <div className="space-y-3">
            {fluencyMetrics.map((metric) => {
              const isExpanded = expandedSection === metric.key;
              
              return (
                <div key={metric.key} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-medium">{metric.label}</div>
                      <div className="text-sm text-gray-600">{metric.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(metric.score)}>
                        {metric.score}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(metric.key)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Progress value={metric.score} className="h-2 mb-2" />

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-700 mb-3">{metric.details}</p>
                      
                      {metric.key === 'vocabulary' && (
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-2">Key Terms to Master:</div>
                          <div className="flex flex-wrap gap-1">
                            {config.vocabulary.slice(0, 6).map((term, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Strong Usage
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
              <AlertTriangle className="h-4 w-4" />
              Areas to Develop
            </h4>
            <div className="space-y-2">
              {examples.missing.map((example, index) => (
                <div key={index} className="text-sm bg-orange-50 p-3 rounded border-l-2 border-orange-300">
                  <AlertTriangle className="h-3 w-3 text-orange-600 inline mr-2" />
                  {example}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development Roadmap */}
        <div className={`bg-gradient-to-r from-${config.color}-50 to-blue-50 rounded-lg p-4 border border-${config.color}-200`}>
          <h4 className={`font-medium text-${config.color}-900 mb-3 flex items-center gap-2`}>
            <BookOpen className="h-4 w-4" />
            {config.name} Development Path
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className={`font-medium text-${config.color}-800 mb-2`}>Priority Learning Areas</div>
              <div className={`text-${config.color}-700 space-y-1`}>
                {config.keyAreas.slice(0,2).map((area, index) => (
                  <div key={index}>• {area}</div>
                ))}
              </div>
            </div>
            <div>
              <div className={`font-medium text-${config.color}-800 mb-2`}>Timeline to Proficiency</div>
              <div className={`text-${config.color}-700 space-y-1`}>
                <div>• Vocabulary: 2-3 weeks</div>
                <div>• Regulatory context: 4-6 weeks</div>
                <div>• Expert level: 3-4 months</div>
              </div>
            </div>
          </div>

          <div className={`mt-3 pt-3 border-t border-${config.color}-200`}>
            <div className={`text-sm text-${config.color}-800`}>
              <strong>Next Steps:</strong> Focus on integrating {config.regulatoryFrameworks[0]} and 
              {config.regulatoryFrameworks[1]} requirements into your product decisions. 
              Practice using {config.vocabulary.slice(0,3).join(', ')} terminology in context.
            </div>
          </div>
        </div>

        {/* Competitive Context */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Competitive Landscape Context</h4>
          <p className="text-sm text-gray-600 mb-2">{config.competitorLandscape}</p>
          <div className="text-xs text-gray-500">
            Strengthen your competitive positioning by understanding how your product 
            fits within this ecosystem and what differentiates your approach.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};