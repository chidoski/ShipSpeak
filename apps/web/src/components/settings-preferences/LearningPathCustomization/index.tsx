'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, Zap, Target, Settings } from 'lucide-react'
import { UserPreferences, LearningPathPreferences, PracticeSessionSettings } from '@/types/settings-preferences'

interface LearningPathCustomizationProps {
  preferences: UserPreferences
  userProfile?: any
  onPreferenceChange: (updates: Partial<UserPreferences>) => void
  intelligentDefaults: any
}

export function LearningPathCustomization({
  preferences,
  userProfile,
  onPreferenceChange,
  intelligentDefaults
}: LearningPathCustomizationProps) {
  const [activeTab, setActiveTab] = useState('style')

  const learningFocusOptions = [
    {
      id: 'MEETING_ANALYSIS',
      title: 'Meeting Analysis First',
      description: 'Start with analyzing real meetings, then practice identified weak areas',
      benefits: ['Real-world relevance', 'Personalized insights', 'Targeted improvement'],
      recommendedFor: ['Experienced PMs', 'Specific improvement goals']
    },
    {
      id: 'PRACTICE_FIRST', 
      title: 'Practice First',
      description: 'Begin with foundational practice modules, then analyze meetings',
      benefits: ['Skill building foundation', 'Confidence development', 'Structured progression'],
      recommendedFor: ['New PMs', 'Career transition', 'Systematic learners']
    },
    {
      id: 'BALANCED',
      title: 'Balanced Approach',
      description: 'Alternate between meeting analysis and practice modules',
      benefits: ['Comprehensive development', 'Varied learning', 'Sustained engagement'],
      recommendedFor: ['Experienced learners', 'Long-term development']
    }
  ]

  const difficultyOptions = [
    {
      id: 'GRADUAL',
      title: 'Gradual Progression',
      description: 'Steady, predictable difficulty increases with mastery-based advancement',
      pace: 'Conservative',
      timeframe: '6-12 months to Senior PM'
    },
    {
      id: 'ACCELERATED',
      title: 'Accelerated Track',
      description: 'Faster progression with challenging scenarios and intensive feedback',
      pace: 'Aggressive', 
      timeframe: '3-6 months to Senior PM'
    },
    {
      id: 'ADAPTIVE',
      title: 'AI-Adaptive',
      description: 'Dynamic difficulty adjustment based on performance and confidence',
      pace: 'Performance-based',
      timeframe: 'Optimized for individual'
    }
  ]

  const feedbackIntensityLevels = [
    {
      level: 'GENTLE',
      title: 'Gentle Guidance',
      description: 'Encouraging feedback focused on positive reinforcement',
      frequency: 'Weekly summaries',
      style: 'Supportive coaching'
    },
    {
      level: 'MODERATE', 
      title: 'Balanced Feedback',
      description: 'Mix of encouragement and constructive development areas',
      frequency: 'Bi-weekly detailed',
      style: 'Professional mentoring'
    },
    {
      level: 'INTENSIVE',
      title: 'Intensive Coaching',
      description: 'Direct, frequent feedback with specific improvement actions',
      frequency: 'Real-time + daily',
      style: 'Executive coaching'
    }
  ]

  const handleLearningPathChange = (updates: Partial<LearningPathPreferences>) => {
    onPreferenceChange({
      learningPathPreferences: {
        ...preferences.learningPathPreferences,
        ...updates
      }
    })
  }

  const handlePracticeSettingsChange = (updates: Partial<PracticeSessionSettings>) => {
    onPreferenceChange({
      practiceSessionSettings: {
        ...preferences.practiceSessionSettings,
        ...updates
      }
    })
  }

  const handleIndustryEmphasisChange = (value: number[]) => {
    handleLearningPathChange({ industryContextEmphasis: value[0] })
  }

  return (
    <div className="space-y-6">
      {/* Learning Path Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Learning Path Configuration
          </CardTitle>
          <CardDescription>
            Customize your learning approach and development pace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Primary Focus</p>
              <p className="font-semibold text-purple-700">
                {preferences.learningPathPreferences.primaryFocus.replace('_', ' ')}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Progression</p>
              <p className="font-semibold text-blue-700">
                {preferences.learningPathPreferences.difficultyProgression}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Feedback Style</p>
              <p className="font-semibold text-green-700">
                {preferences.learningPathPreferences.feedbackIntensity}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Settings */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="style" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Learning Style</span>
                </TabsTrigger>
                <TabsTrigger value="difficulty" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Difficulty</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Feedback</span>
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Sessions</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Learning Style Selection */}
            <TabsContent value="style" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Primary Learning Focus</h3>
                <div className="space-y-4">
                  {learningFocusOptions.map(option => (
                    <div
                      key={option.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        preferences.learningPathPreferences.primaryFocus === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleLearningPathChange({ primaryFocus: option.id as any })}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{option.title}</h4>
                        {preferences.learningPathPreferences.primaryFocus === option.id && (
                          <Badge>Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-green-700 mb-1">Benefits:</p>
                          <ul className="text-green-600 text-xs space-y-1">
                            {option.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-blue-700 mb-1">Recommended for:</p>
                          <ul className="text-blue-600 text-xs space-y-1">
                            {option.recommendedFor.map((rec, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry Context Emphasis */}
              <div>
                <h3 className="font-semibold mb-4">Industry Context Emphasis</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Industry-Specific Content</p>
                      <p className="text-sm text-muted-foreground">
                        How much should practice focus on your industry context?
                      </p>
                    </div>
                    <Badge variant="outline">
                      {preferences.learningPathPreferences.industryContextEmphasis}%
                    </Badge>
                  </div>
                  
                  <Slider
                    value={[preferences.learningPathPreferences.industryContextEmphasis]}
                    onValueChange={handleIndustryEmphasisChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Generic PM Skills</span>
                    <span>Industry-Specific Focus</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Current setting: {
                      preferences.learningPathPreferences.industryContextEmphasis >= 80 ? 'Heavy industry focus' :
                      preferences.learningPathPreferences.industryContextEmphasis >= 60 ? 'Balanced approach' :
                      preferences.learningPathPreferences.industryContextEmphasis >= 40 ? 'General PM focus' :
                      'Generic skills focus'
                    }
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Difficulty Progression */}
            <TabsContent value="difficulty" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Difficulty Progression</h3>
                <div className="space-y-4">
                  {difficultyOptions.map(option => (
                    <div
                      key={option.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        preferences.learningPathPreferences.difficultyProgression === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleLearningPathChange({ difficultyProgression: option.id as any })}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{option.title}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">{option.pace}</Badge>
                          {preferences.learningPathPreferences.difficultyProgression === option.id && (
                            <Badge>Selected</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                      <p className="text-xs text-blue-600">
                        <strong>Timeline:</strong> {option.timeframe}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Feedback Intensity */}
            <TabsContent value="feedback" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Feedback Intensity</h3>
                <div className="space-y-4">
                  {feedbackIntensityLevels.map(level => (
                    <div
                      key={level.level}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        preferences.learningPathPreferences.feedbackIntensity === level.level
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleLearningPathChange({ feedbackIntensity: level.level as any })}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{level.title}</h4>
                        {preferences.learningPathPreferences.feedbackIntensity === level.level && (
                          <Badge>Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <span className="text-green-600">
                          <strong>Frequency:</strong> {level.frequency}
                        </span>
                        <span className="text-blue-600">
                          <strong>Style:</strong> {level.style}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Practice Session Settings */}
            <TabsContent value="sessions" className="p-6 space-y-6">
              <div className="space-y-6">
                {/* Session Length */}
                <div>
                  <h4 className="font-medium mb-3">Preferred Session Length</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Duration: {preferences.practiceSessionSettings.preferredSessionLength} minutes</span>
                      <Badge variant="outline">
                        {preferences.practiceSessionSettings.preferredSessionLength < 15 ? 'Quick' :
                         preferences.practiceSessionSettings.preferredSessionLength < 25 ? 'Standard' : 'Extended'}
                      </Badge>
                    </div>
                    <Slider
                      value={[preferences.practiceSessionSettings.preferredSessionLength]}
                      onValueChange={(value) => 
                        handlePracticeSettingsChange({ preferredSessionLength: value[0] })
                      }
                      max={45}
                      min={5}
                      step={5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 min</span>
                      <span>25 min</span>
                      <span>45 min</span>
                    </div>
                  </div>
                </div>

                {/* Toggle Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Real-time Coaching</p>
                      <p className="text-sm text-muted-foreground">Live feedback during practice sessions</p>
                    </div>
                    <Switch
                      checked={preferences.practiceSessionSettings.realTimeCoaching}
                      onCheckedChange={(checked) => 
                        handlePracticeSettingsChange({ realTimeCoaching: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Transcription Display</p>
                      <p className="text-sm text-muted-foreground">Show real-time transcription while speaking</p>
                    </div>
                    <Switch
                      checked={preferences.practiceSessionSettings.transcriptionDisplay}
                      onCheckedChange={(checked) => 
                        handlePracticeSettingsChange({ transcriptionDisplay: checked })
                      }
                    />
                  </div>
                </div>

                {/* Dropdown Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quality Threshold</label>
                    <Select 
                      value={preferences.practiceSessionSettings.qualityThreshold}
                      onValueChange={(value) => 
                        handlePracticeSettingsChange({ qualityThreshold: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FLEXIBLE">Flexible - Accept lower quality</SelectItem>
                        <SelectItem value="STANDARD">Standard - Balanced quality</SelectItem>
                        <SelectItem value="STRICT">Strict - High quality required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Retake Policy</label>
                    <Select 
                      value={preferences.practiceSessionSettings.retakePolicy}
                      onValueChange={(value) => 
                        handlePracticeSettingsChange({ retakePolicy: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNLIMITED">Unlimited retakes</SelectItem>
                        <SelectItem value="LIMITED">Limited (3 attempts)</SelectItem>
                        <SelectItem value="SINGLE_ATTEMPT">Single attempt only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}