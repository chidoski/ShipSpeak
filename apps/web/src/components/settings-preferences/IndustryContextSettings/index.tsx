'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building, Shield, Users, Settings } from 'lucide-react'
import { UserPreferences, IndustryContextSettings as ICS } from '@/types/settings-preferences'
import { mockIndustryCustomizations } from '@/lib/mockSettingsData'

interface IndustryContextSettingsProps {
  preferences: UserPreferences
  userProfile?: any
  onPreferenceChange: (updates: Partial<UserPreferences>) => void
  intelligentDefaults: any
}

export function IndustryContextSettings({
  preferences,
  userProfile,
  onPreferenceChange,
  intelligentDefaults
}: IndustryContextSettingsProps) {
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>(
    preferences.industryContextSettings.complianceEmphasis || []
  )

  const industries = [
    {
      id: 'HEALTHCARE',
      title: 'Healthcare & Life Sciences',
      description: 'Medical devices, pharmaceuticals, digital health',
      focus: ['Patient Safety', 'Regulatory Compliance', 'Clinical Evidence'],
      complexity: 'High'
    },
    {
      id: 'CYBERSECURITY', 
      title: 'Cybersecurity & Enterprise Security',
      description: 'Security products, threat intelligence, compliance',
      focus: ['Risk Communication', 'Technical Translation', 'Threat Assessment'],
      complexity: 'High'
    },
    {
      id: 'FINTECH',
      title: 'Financial Services & Fintech',
      description: 'Banking, payments, investment platforms, InsurTech',
      focus: ['Regulatory Compliance', 'Risk Management', 'Trust Building'],
      complexity: 'High'
    },
    {
      id: 'ENTERPRISE',
      title: 'Enterprise Software & B2B',
      description: 'SaaS platforms, productivity tools, infrastructure',
      focus: ['ROI Communication', 'Stakeholder Management', 'Implementation'],
      complexity: 'Medium'
    },
    {
      id: 'CONSUMER',
      title: 'Consumer Technology & Apps',
      description: 'Mobile apps, social platforms, consumer devices',
      focus: ['User Experience', 'Growth Metrics', 'Viral Mechanics'],
      complexity: 'Medium'
    }
  ]

  const regulatoryLevels = [
    { value: 'LOW', label: 'Low', description: 'Basic compliance awareness' },
    { value: 'MEDIUM', label: 'Medium', description: 'Regular regulatory considerations' },
    { value: 'HIGH', label: 'High', description: 'Heavy regulatory environment' }
  ]

  const technicalDepthOptions = [
    { value: 'BUSINESS_FOCUSED', label: 'Business Focused', description: 'Minimal technical depth' },
    { value: 'BALANCED', label: 'Balanced', description: 'Mix of business and technical' },
    { value: 'TECHNICAL_FOCUSED', label: 'Technical Focused', description: 'Deep technical understanding' }
  ]

  const handleIndustryChange = (industry: string) => {
    const industryData = mockIndustryCustomizations[industry as keyof typeof mockIndustryCustomizations]
    
    onPreferenceChange({
      industryContextSettings: {
        ...preferences.industryContextSettings,
        primaryIndustry: industry as any,
        complianceEmphasis: industryData?.requiredCompliance || [],
        stakeholderPriority: industryData?.keyStakeholders || []
      }
    })
  }

  const handleSettingChange = (updates: Partial<ICS>) => {
    onPreferenceChange({
      industryContextSettings: {
        ...preferences.industryContextSettings,
        ...updates
      }
    })
  }

  const currentIndustry = industries.find(i => i.id === preferences.industryContextSettings.primaryIndustry)
  const currentCustomization = mockIndustryCustomizations[preferences.industryContextSettings.primaryIndustry as keyof typeof mockIndustryCustomizations]

  return (
    <div className="space-y-6">
      {/* Industry Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Industry Specialization
          </CardTitle>
          <CardDescription>
            Select your primary industry for contextualized communication training
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map(industry => (
              <div
                key={industry.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  preferences.industryContextSettings.primaryIndustry === industry.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleIndustryChange(industry.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{industry.title}</h4>
                  <Badge 
                    variant={industry.complexity === 'High' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {industry.complexity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{industry.description}</p>
                
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">Key Focus Areas:</p>
                  <div className="flex flex-wrap gap-1">
                    {industry.focus.map((focus, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentIndustry && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected: {currentIndustry.title}</h4>
              <p className="text-sm text-blue-700">{currentIndustry.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Regulatory Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Regulatory & Compliance Focus
          </CardTitle>
          <CardDescription>
            Configure regulatory emphasis for your industry context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Regulatory Focus Level</label>
            <Select 
              value={preferences.industryContextSettings.regulatoryFocus}
              onValueChange={(value) => handleSettingChange({ regulatoryFocus: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regulatoryLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-muted-foreground">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentCustomization && (
            <div>
              <label className="text-sm font-medium mb-2 block">Industry Compliance Areas</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {currentCustomization.requiredCompliance.map((compliance, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={compliance}
                      checked={preferences.industryContextSettings.complianceEmphasis.includes(compliance)}
                      onChange={(e) => {
                        const current = preferences.industryContextSettings.complianceEmphasis
                        const updated = e.target.checked 
                          ? [...current, compliance]
                          : current.filter(c => c !== compliance)
                        handleSettingChange({ complianceEmphasis: updated })
                      }}
                      className="rounded"
                    />
                    <label htmlFor={compliance} className="text-sm">{compliance}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stakeholder Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Stakeholder Priorities
          </CardTitle>
          <CardDescription>
            Configure communication focus for key stakeholder groups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentCustomization && (
            <div className="space-y-4">
              {currentCustomization.keyStakeholders.map((stakeholder, index) => {
                const priority = preferences.industryContextSettings.stakeholderPriority.indexOf(stakeholder) + 1
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{stakeholder}</p>
                      <p className="text-xs text-muted-foreground">
                        {currentCustomization.communicationFocus[index] || 'General communication'}
                      </p>
                    </div>
                    <Badge variant={priority <= 2 ? 'default' : 'outline'}>
                      Priority {priority || 'Not Set'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Depth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Technical Communication Depth
          </CardTitle>
          <CardDescription>
            Balance between technical detail and business communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Technical Focus</label>
            <Select 
              value={preferences.industryContextSettings.technicalDepth}
              onValueChange={(value) => handleSettingChange({ technicalDepth: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {technicalDepthOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Current Configuration</p>
            <p className="text-xs text-muted-foreground">
              {currentIndustry?.title} with {preferences.industryContextSettings.regulatoryFocus.toLowerCase()} regulatory focus
              and {preferences.industryContextSettings.technicalDepth.toLowerCase().replace('_', ' ')} communication depth.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}