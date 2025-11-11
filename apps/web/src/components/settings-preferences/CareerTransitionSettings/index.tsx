'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Brain, Clock, Bell } from 'lucide-react'
import { UserPreferences, IntelligentDefaults } from '@/types/settings-preferences'
import { TransitionFocusCustomizer } from './TransitionFocusCustomizer'
import { SkillDevelopmentPreferences } from './SkillDevelopmentPreferences'
import { ReadinessTimelineSettings } from './ReadinessTimelineSettings'
import { MilestoneNotificationSettings } from './MilestoneNotificationSettings'

interface CareerTransitionSettingsProps {
  preferences: UserPreferences
  userProfile?: any
  onPreferenceChange: (updates: Partial<UserPreferences>) => void
  intelligentDefaults: IntelligentDefaults
}

export function CareerTransitionSettings({
  preferences,
  userProfile,
  onPreferenceChange,
  intelligentDefaults
}: CareerTransitionSettingsProps) {
  const [activeTab, setActiveTab] = useState('focus')

  const transitionSettings = [
    {
      id: 'focus',
      title: 'Transition Focus',
      description: 'Career path and development priorities',
      icon: TrendingUp,
      component: TransitionFocusCustomizer
    },
    {
      id: 'skills',
      title: 'Skill Development',
      description: 'Framework preferences and skill emphasis',
      icon: Brain,
      component: SkillDevelopmentPreferences
    },
    {
      id: 'timeline',
      title: 'Timeline Settings',
      description: 'Career advancement timeline preferences',
      icon: Clock,
      component: ReadinessTimelineSettings
    },
    {
      id: 'notifications',
      title: 'Milestone Alerts',
      description: 'Progress notifications and achievement alerts',
      icon: Bell,
      component: MilestoneNotificationSettings
    }
  ]

  const handleTransitionFocusChange = (updates: Partial<UserPreferences['careerTransitionFocus']>) => {
    onPreferenceChange({
      careerTransitionFocus: {
        ...preferences.careerTransitionFocus,
        ...updates
      }
    })
  }

  const handleSkillPreferencesChange = (updates: any) => {
    onPreferenceChange({
      learningPathPreferences: {
        ...preferences.learningPathPreferences,
        ...updates
      }
    })
  }

  const handleTimelineSettingsChange = (updates: any) => {
    onPreferenceChange({
      careerTransitionFocus: {
        ...preferences.careerTransitionFocus,
        ...updates
      }
    })
  }

  const handleNotificationSettingsChange = (updates: any) => {
    onPreferenceChange({
      systemPreferences: {
        ...preferences.systemPreferences,
        notifications: {
          ...preferences.systemPreferences?.notifications,
          ...updates
        }
      }
    })
  }

  const getCareerInsight = () => {
    const transition = preferences.careerTransitionFocus
    const currentLevel = transition.currentLevel
    const targetLevel = transition.targetLevel
    
    const insights: { [key: string]: string } = {
      'PO_TO_PM': 'Focus on strategic thinking development and business vocabulary acquisition',
      'PM_TO_SENIOR_PM': 'Emphasize executive communication and framework sophistication',
      'SENIOR_PM_TO_GROUP_PM': 'Develop portfolio strategy and team leadership communication',
      'GROUP_PM_TO_DIRECTOR': 'Master board presentations and business model fluency'
    }
    
    return insights[`${currentLevel}_TO_${targetLevel}`] || 'Continue developing PM competencies'
  }

  return (
    <div className="space-y-6">
      {/* Career Transition Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Career Transition Overview
          </CardTitle>
          <CardDescription>
            Current transition: {preferences.careerTransitionFocus.currentLevel} → {preferences.careerTransitionFocus.targetLevel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Role</p>
              <p className="font-semibold text-blue-700">
                {preferences.careerTransitionFocus.currentLevel}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Target Role</p>
              <p className="font-semibold text-green-700">
                {preferences.careerTransitionFocus.targetLevel}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Timeline</p>
              <p className="font-semibold text-purple-700">
                {preferences.careerTransitionFocus.transitionTimeline.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <p className="text-sm font-medium text-yellow-800">Career Intelligence Insight</p>
            <p className="text-yellow-700 text-sm">{getCareerInsight()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full grid-cols-4">
                {transitionSettings.map(setting => {
                  const IconComponent = setting.icon
                  return (
                    <TabsTrigger 
                      key={setting.id}
                      value={setting.id}
                      className="flex items-center gap-2 text-xs lg:text-sm"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{setting.title}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            <TabsContent value="focus" className="p-6">
              <TransitionFocusCustomizer
                transitionFocus={preferences.careerTransitionFocus}
                onFocusChange={handleTransitionFocusChange}
              />
            </TabsContent>

            <TabsContent value="skills" className="p-6">
              <SkillDevelopmentPreferences
                frameworkFocus={preferences.learningPathPreferences.frameworkFocus}
                skillEmphasis={{}} // You would derive this from preferences
                adaptiveLearning={preferences.learningPathPreferences.difficultyProgression === 'ADAPTIVE'}
                onFrameworkChange={(frameworks) => 
                  handleSkillPreferencesChange({ frameworkFocus: frameworks })
                }
                onSkillEmphasisChange={(emphasis) => {
                  // Handle skill emphasis changes
                }}
                onAdaptiveLearningChange={(enabled) =>
                  handleSkillPreferencesChange({ 
                    difficultyProgression: enabled ? 'ADAPTIVE' : 'GRADUAL' 
                  })
                }
              />
            </TabsContent>

            <TabsContent value="timeline" className="p-6">
              <ReadinessTimelineSettings
                timeline={preferences.careerTransitionFocus.transitionTimeline}
                confidenceLevel={preferences.careerTransitionFocus.confidenceLevel}
                onTimelineChange={handleTimelineSettingsChange}
              />
            </TabsContent>

            <TabsContent value="notifications" className="p-6">
              <MilestoneNotificationSettings
                notifications={preferences.systemPreferences?.notifications}
                onNotificationChange={handleNotificationSettingsChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Export individual components for direct access
export { TransitionFocusCustomizer } from './TransitionFocusCustomizer'
export { SkillDevelopmentPreferences } from './SkillDevelopmentPreferences'