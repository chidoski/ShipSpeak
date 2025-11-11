'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, User, Brain, Building, Users, Shield } from 'lucide-react'
import { UserPreferences, SettingsSection, IntelligentDefaults, AdaptiveRecommendation } from '@/types/settings-preferences'
import { CareerTransitionSettings } from './CareerTransitionSettings'
import { LearningPathCustomization } from './LearningPathCustomization'
import { IndustryContextSettings } from './IndustryContextSettings'
import { MeetingTypeCustomization } from './MeetingTypeCustomization'
import { SystemPreferences } from './SystemPreferences'
import { mockUserPreferences, mockIntelligentDefaults } from '@/lib/mockSettingsData'

export interface SettingsOrchestratorProps {
  userProfile?: any
  onPreferencesChange?: (preferences: UserPreferences) => void
  onResetDefaults?: () => void
}

export function SettingsOrchestrator({
  userProfile,
  onPreferencesChange,
  onResetDefaults
}: SettingsOrchestratorProps) {
  const [activeSection, setActiveSection] = useState('career-transition')
  const [preferences, setPreferences] = useState<UserPreferences>(mockUserPreferences)
  const [intelligentDefaults] = useState<IntelligentDefaults>(mockIntelligentDefaults)
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const settingsSections: SettingsSection[] = [
    {
      id: 'career-transition',
      title: 'Career Transition',
      description: 'PM career advancement preferences and transition-specific customization',
      icon: 'User',
      component: CareerTransitionSettings,
      isActive: activeSection === 'career-transition'
    },
    {
      id: 'learning-path',
      title: 'Learning Path',
      description: 'Learning style, difficulty progression, and practice session preferences',
      icon: 'Brain',
      component: LearningPathCustomization,
      isActive: activeSection === 'learning-path'
    },
    {
      id: 'industry-context',
      title: 'Industry Context',
      description: 'Industry-specific emphasis and regulatory communication focus',
      icon: 'Building',
      component: IndustryContextSettings,
      isActive: activeSection === 'industry-context'
    },
    {
      id: 'meeting-types',
      title: 'Meeting Types',
      description: 'Board presentation, planning session, and stakeholder update preferences',
      icon: 'Users',
      component: MeetingTypeCustomization,
      isActive: activeSection === 'meeting-types'
    },
    {
      id: 'system',
      title: 'System Preferences',
      description: 'Notifications, privacy, integrations, and accessibility settings',
      icon: 'Shield',
      component: SystemPreferences,
      isActive: activeSection === 'system'
    }
  ]

  const topRecommendations = intelligentDefaults.adaptiveRecommendations
    .filter(rec => rec.confidence === 'HIGH')
    .slice(0, 3)

  const handlePreferenceChange = (section: string, updates: Partial<UserPreferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...updates
    }
    setPreferences(updatedPreferences)
    setHasChanges(true)
    onPreferencesChange?.(updatedPreferences)
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasChanges(false)
      // In real implementation, would save to backend
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetToDefaults = () => {
    const defaultPreferences = generateIntelligentDefaults(userProfile)
    setPreferences(defaultPreferences)
    setHasChanges(true)
    onResetDefaults?.()
  }

  const generateIntelligentDefaults = (profile: any): UserPreferences => {
    // Generate career and industry-aware defaults based on user profile
    return mockUserPreferences // Simplified for now
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      User,
      Brain,
      Building,
      Users,
      Shield
    }
    return icons[iconName] || Settings
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings & Preferences</h1>
          <p className="text-muted-foreground">
            Customize your PM development experience with career-intelligent settings
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button 
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleResetToDefaults}
            disabled={isLoading}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Intelligent Recommendations */}
      {topRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Intelligent Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered suggestions to optimize your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={rec.confidence === 'HIGH' ? 'default' : 'secondary'}>
                      {rec.confidence} Confidence
                    </Badge>
                    <Badge variant="outline">{rec.category}</Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{rec.reasoning}</p>
                  <p className="text-xs text-muted-foreground">{rec.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Settings Interface */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
                {settingsSections.map(section => {
                  const IconComponent = getIconComponent(section.icon)
                  return (
                    <TabsTrigger 
                      key={section.id}
                      value={section.id}
                      className="flex items-center gap-2 text-xs lg:text-sm"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{section.title}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {settingsSections.map(section => (
              <TabsContent 
                key={section.id}
                value={section.id}
                className="p-6 space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>
                
                <section.component
                  preferences={preferences}
                  userProfile={userProfile}
                  onPreferenceChange={(updates) => handlePreferenceChange(section.id, updates)}
                  intelligentDefaults={intelligentDefaults}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}