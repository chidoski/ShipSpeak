'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react'

interface ReadinessTimelineSettingsProps {
  timeline: string
  confidenceLevel: number
  onTimelineChange: (updates: any) => void
}

export function ReadinessTimelineSettings({
  timeline,
  confidenceLevel,
  onTimelineChange
}: ReadinessTimelineSettingsProps) {
  const timelineOptions = [
    {
      id: 'IMMEDIATE',
      label: 'Immediate',
      duration: '0-3 months',
      description: 'Ready for promotion now, need final polish',
      intensity: 'Very High',
      recommendedScore: 85,
      color: 'red'
    },
    {
      id: 'SIX_MONTHS',
      label: '6 Months',
      duration: '3-6 months',
      description: 'Targeted development with specific milestones',
      intensity: 'High',
      recommendedScore: 70,
      color: 'orange'
    },
    {
      id: 'ONE_YEAR',
      label: '1 Year',
      duration: '6-12 months',
      description: 'Comprehensive skill development program',
      intensity: 'Medium',
      recommendedScore: 55,
      color: 'blue'
    },
    {
      id: 'TWO_YEARS',
      label: '2+ Years',
      duration: '1-2+ years',
      description: 'Foundation building with gradual progression',
      intensity: 'Low',
      recommendedScore: 40,
      color: 'green'
    }
  ]

  const milestoneTemplates = [
    {
      timeline: 'IMMEDIATE',
      milestones: [
        { month: 1, title: 'Executive Communication Polish', target: 90 },
        { month: 2, title: 'Framework Mastery Validation', target: 95 },
        { month: 3, title: 'Transition Readiness Assessment', target: 85 }
      ]
    },
    {
      timeline: 'SIX_MONTHS',
      milestones: [
        { month: 2, title: 'Strategic Thinking Foundation', target: 75 },
        { month: 4, title: 'Stakeholder Management Mastery', target: 80 },
        { month: 6, title: 'Executive Presence Development', target: 85 }
      ]
    },
    {
      timeline: 'ONE_YEAR',
      milestones: [
        { month: 3, title: 'PM Framework Proficiency', target: 70 },
        { month: 6, title: 'Industry Expertise Building', target: 75 },
        { month: 9, title: 'Leadership Communication Skills', target: 80 },
        { month: 12, title: 'Transition Readiness Achieved', target: 85 }
      ]
    },
    {
      timeline: 'TWO_YEARS',
      milestones: [
        { month: 6, title: 'Core PM Skills Foundation', target: 60 },
        { month: 12, title: 'Strategic Thinking Development', target: 70 },
        { month: 18, title: 'Executive Communication Building', target: 75 },
        { month: 24, title: 'Leadership Readiness Achievement', target: 80 }
      ]
    }
  ]

  const currentOption = timelineOptions.find(opt => opt.id === timeline)
  const currentMilestones = milestoneTemplates.find(tmpl => tmpl.timeline === timeline)

  const handleTimelineSelect = (selectedTimeline: string) => {
    onTimelineChange({ transitionTimeline: selectedTimeline })
  }

  const handleConfidenceChange = (value: number[]) => {
    onTimelineChange({ confidenceLevel: value[0] })
  }

  const getReadinessLevel = () => {
    if (confidenceLevel >= 80) return { level: 'High', color: 'green', description: 'Well positioned for advancement' }
    if (confidenceLevel >= 60) return { level: 'Medium', color: 'blue', description: 'Good progress, continue development' }
    if (confidenceLevel >= 40) return { level: 'Building', color: 'orange', description: 'Foundation in place, focused effort needed' }
    return { level: 'Early', color: 'red', description: 'Early stage, significant development needed' }
  }

  const readiness = getReadinessLevel()

  return (
    <div className="space-y-6">
      {/* Current Timeline Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Timeline Preference
          </CardTitle>
          <CardDescription>
            Choose your preferred timeline for career advancement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timelineOptions.map(option => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  timeline === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTimelineSelect(option.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{option.label}</h3>
                  <Badge 
                    variant={timeline === option.id ? 'default' : 'outline'}
                    className={`text-${option.color}-600`}
                  >
                    {option.duration}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{option.description}</p>
                <div className="text-xs">
                  <span className="text-muted-foreground">Intensity: </span>
                  <span className="font-medium">{option.intensity}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Min. Score: </span>
                  <span className="font-medium">{option.recommendedScore}%</span>
                </div>
              </div>
            ))}
          </div>

          {currentOption && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Selected Timeline: {currentOption.label}</h4>
              <p className="text-sm text-blue-700">{currentOption.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-blue-600">
                  <strong>Duration:</strong> {currentOption.duration}
                </span>
                <span className="text-blue-600">
                  <strong>Intensity:</strong> {currentOption.intensity}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Readiness Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Current Readiness Level
          </CardTitle>
          <CardDescription>
            Self-assessment of your current readiness for the target role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Confidence Level</p>
              <p className="text-sm text-muted-foreground">How ready do you feel for advancement?</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{confidenceLevel}/10</p>
              <Badge variant={readiness.color === 'green' ? 'default' : 'outline'}>
                {readiness.level} Readiness
              </Badge>
            </div>
          </div>

          <Slider
            value={[confidenceLevel]}
            onValueChange={handleConfidenceChange}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Not Ready (1)</span>
            <span>Somewhat Ready (5)</span>
            <span>Very Ready (10)</span>
          </div>

          <Progress value={confidenceLevel * 10} className="h-3" />

          <div className={`p-3 border-l-4 border-${readiness.color}-400 bg-${readiness.color}-50 rounded-r-lg`}>
            <p className={`text-sm font-medium text-${readiness.color}-800`}>
              {readiness.level} Readiness Level
            </p>
            <p className={`text-${readiness.color}-700 text-sm`}>{readiness.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Timeline */}
      {currentMilestones && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Development Milestones
            </CardTitle>
            <CardDescription>
              Key milestones for your {currentOption?.label.toLowerCase()} timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentMilestones.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-sm">M{milestone.month}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{milestone.title}</h4>
                    <p className="text-xs text-muted-foreground">Month {milestone.month}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant="outline">
                      Target: {milestone.target}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">Timeline Insight</span>
              </div>
              <p className="text-sm text-purple-700">
                Based on your {currentOption?.label.toLowerCase()} timeline, focus on consistent practice 
                and milestone achievement. Your current {confidenceLevel}/10 confidence level 
                {confidenceLevel >= (currentOption?.recommendedScore || 50) / 10 
                  ? ' aligns well with' 
                  : ' suggests accelerated development needed for'
                } this timeline.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}