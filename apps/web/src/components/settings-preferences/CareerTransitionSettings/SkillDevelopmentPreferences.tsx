'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Brain, Target, Zap, Users } from 'lucide-react'
import { FrameworkPreference } from '@/types/settings-preferences'

interface SkillDevelopmentPreferencesProps {
  frameworkFocus: FrameworkPreference[]
  skillEmphasis: { [key: string]: number }
  adaptiveLearning: boolean
  onFrameworkChange: (frameworks: FrameworkPreference[]) => void
  onSkillEmphasisChange: (emphasis: { [key: string]: number }) => void
  onAdaptiveLearningChange: (enabled: boolean) => void
}

export function SkillDevelopmentPreferences({
  frameworkFocus,
  skillEmphasis,
  adaptiveLearning,
  onFrameworkChange,
  onSkillEmphasisChange,
  onAdaptiveLearningChange
}: SkillDevelopmentPreferencesProps) {
  const availableFrameworks = [
    { 
      name: 'RICE Prioritization',
      description: 'Reach, Impact, Confidence, Effort framework for feature prioritization',
      category: 'PRIORITIZATION',
      difficulty: 'INTERMEDIATE'
    },
    { 
      name: 'Jobs-to-be-Done',
      description: 'Customer-centered framework for product development',
      category: 'CUSTOMER_FOCUS',
      difficulty: 'ADVANCED'
    },
    { 
      name: 'OKR Planning',
      description: 'Objectives and Key Results for goal setting',
      category: 'STRATEGY',
      difficulty: 'INTERMEDIATE'
    },
    { 
      name: 'Design Thinking',
      description: 'Human-centered problem solving methodology',
      category: 'INNOVATION',
      difficulty: 'ADVANCED'
    },
    { 
      name: 'Lean Startup',
      description: 'Build-Measure-Learn cycle for product validation',
      category: 'VALIDATION',
      difficulty: 'INTERMEDIATE'
    },
    { 
      name: 'Customer Journey Mapping',
      description: 'End-to-end customer experience visualization',
      category: 'CUSTOMER_FOCUS',
      difficulty: 'BEGINNER'
    },
    { 
      name: 'Agile Estimation',
      description: 'Story points, planning poker, velocity tracking',
      category: 'DELIVERY',
      difficulty: 'BEGINNER'
    },
    { 
      name: 'North Star Framework',
      description: 'Product vision and metrics alignment',
      category: 'STRATEGY',
      difficulty: 'ADVANCED'
    }
  ]

  const skillCategories = [
    { 
      key: 'strategic_thinking',
      label: 'Strategic Thinking',
      description: 'Long-term vision and market analysis',
      icon: Brain,
      color: 'blue'
    },
    { 
      key: 'execution_excellence',
      label: 'Execution Excellence',
      description: 'Delivery and implementation effectiveness',
      icon: Target,
      color: 'green'
    },
    { 
      key: 'influence_skills',
      label: 'Influence Skills',
      description: 'Stakeholder management and persuasion',
      icon: Users,
      color: 'purple'
    },
    { 
      key: 'innovation_mindset',
      label: 'Innovation Mindset',
      description: 'Creative problem solving and experimentation',
      icon: Zap,
      color: 'orange'
    }
  ]

  const handleFrameworkToggle = (frameworkName: string) => {
    const existingIndex = frameworkFocus.findIndex(f => f.framework === frameworkName)
    
    if (existingIndex >= 0) {
      // Remove framework
      const updatedFrameworks = frameworkFocus.filter((_, i) => i !== existingIndex)
      onFrameworkChange(updatedFrameworks)
    } else {
      // Add framework with defaults
      const newFramework: FrameworkPreference = {
        framework: frameworkName,
        proficiencyLevel: 5,
        practiceFrequency: 'MEDIUM',
        applicationContext: ['General Practice']
      }
      onFrameworkChange([...frameworkFocus, newFramework])
    }
  }

  const handleFrameworkUpdate = (index: number, updates: Partial<FrameworkPreference>) => {
    const updatedFrameworks = frameworkFocus.map((framework, i) =>
      i === index ? { ...framework, ...updates } : framework
    )
    onFrameworkChange(updatedFrameworks)
  }

  const handleSkillEmphasisUpdate = (skill: string, value: number) => {
    const updatedEmphasis = {
      ...skillEmphasis,
      [skill]: value
    }
    onSkillEmphasisChange(updatedEmphasis)
  }

  const getFrameworkByName = (name: string) => {
    return availableFrameworks.find(f => f.name === name)
  }

  const isFrameworkSelected = (frameworkName: string) => {
    return frameworkFocus.some(f => f.framework === frameworkName)
  }

  return (
    <div className="space-y-6">
      {/* Adaptive Learning Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Learning Adaptation
          </CardTitle>
          <CardDescription>
            Control how the system adapts to your performance and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Adaptive Difficulty</p>
              <p className="text-sm text-muted-foreground">
                Automatically adjust difficulty based on performance
              </p>
            </div>
            <Switch
              checked={adaptiveLearning}
              onCheckedChange={onAdaptiveLearningChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skill Emphasis Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Skill Development Emphasis
          </CardTitle>
          <CardDescription>
            Adjust the relative emphasis on different PM skill categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {skillCategories.map((category) => {
            const IconComponent = category.icon
            const currentEmphasis = skillEmphasis[category.key] || 50
            
            return (
              <div key={category.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 text-${category.color}-600`} />
                    <div>
                      <p className="font-medium">{category.label}</p>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {currentEmphasis}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Slider
                    value={[currentEmphasis]}
                    onValueChange={(value) => handleSkillEmphasisUpdate(category.key, value[0])}
                    max={100}
                    min={0}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Priority</span>
                    <span>High Priority</span>
                  </div>
                </div>
                
                <Progress value={currentEmphasis} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Framework Focus Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Framework Focus
          </CardTitle>
          <CardDescription>
            Select and prioritize the PM frameworks you want to develop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Available Frameworks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableFrameworks.map((framework) => (
              <div
                key={framework.name}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isFrameworkSelected(framework.name) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFrameworkToggle(framework.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{framework.name}</h4>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {framework.category}
                    </Badge>
                    <Badge 
                      variant={framework.difficulty === 'BEGINNER' ? 'secondary' : 
                               framework.difficulty === 'INTERMEDIATE' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {framework.difficulty}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{framework.description}</p>
              </div>
            ))}
          </div>

          {/* Selected Framework Details */}
          {frameworkFocus.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Selected Framework Configuration</h4>
              {frameworkFocus.map((framework, index) => {
                const details = getFrameworkByName(framework.framework)
                
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{framework.framework}</h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFrameworkToggle(framework.framework)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Proficiency Level: {framework.proficiencyLevel}/10
                        </label>
                        <Slider
                          value={[framework.proficiencyLevel]}
                          onValueChange={(value) => 
                            handleFrameworkUpdate(index, { proficiencyLevel: value[0] })
                          }
                          max={10}
                          min={1}
                          step={1}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Practice Frequency</label>
                        <select
                          value={framework.practiceFrequency}
                          onChange={(e) => 
                            handleFrameworkUpdate(index, { practiceFrequency: e.target.value as any })
                          }
                          className="w-full p-2 border rounded text-sm"
                        >
                          <option value="LOW">Low (Monthly)</option>
                          <option value="MEDIUM">Medium (Weekly)</option>
                          <option value="HIGH">High (Daily)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}