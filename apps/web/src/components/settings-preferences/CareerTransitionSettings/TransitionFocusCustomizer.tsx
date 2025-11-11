'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, Target, Clock, Brain } from 'lucide-react'
import { CareerTransitionFocus, TransitionFocusArea } from '@/types/settings-preferences'

interface TransitionFocusCustomizerProps {
  transitionFocus: CareerTransitionFocus
  onFocusChange: (focus: Partial<CareerTransitionFocus>) => void
}

export function TransitionFocusCustomizer({ 
  transitionFocus, 
  onFocusChange 
}: TransitionFocusCustomizerProps) {
  const transitionPaths = [
    { current: 'PO', target: 'PM', label: 'Product Owner → Product Manager' },
    { current: 'PM', target: 'SENIOR_PM', label: 'PM → Senior PM' },
    { current: 'SENIOR_PM', target: 'GROUP_PM', label: 'Senior PM → Group PM' },
    { current: 'GROUP_PM', target: 'DIRECTOR', label: 'Group PM → Director' },
    { current: 'DIRECTOR', target: 'VP_PRODUCT', label: 'Director → VP Product' }
  ]

  const timelineOptions = [
    { value: 'IMMEDIATE', label: 'Immediate (0-3 months)', urgency: 'high' },
    { value: 'SIX_MONTHS', label: '6 Months', urgency: 'medium' },
    { value: 'ONE_YEAR', label: '1 Year', urgency: 'medium' },
    { value: 'TWO_YEARS', label: '2+ Years', urgency: 'low' }
  ]

  const getCurrentTransitionPath = () => {
    return transitionPaths.find(path => 
      path.current === transitionFocus.currentLevel && path.target === transitionFocus.targetLevel
    )
  }

  const handleTransitionChange = (value: string) => {
    const [current, target] = value.split('_TO_')
    onFocusChange({
      currentLevel: current as any,
      targetLevel: target as any
    })
  }

  const handleConfidenceChange = (value: number[]) => {
    onFocusChange({ confidenceLevel: value[0] })
  }

  const handleTimelineChange = (value: string) => {
    onFocusChange({ transitionTimeline: value as any })
  }

  const addFocusArea = (area: string) => {
    const newArea: TransitionFocusArea = {
      area,
      priority: 'MEDIUM',
      currentLevel: 5,
      targetLevel: 8,
      timeframe: '6 months'
    }
    onFocusChange({
      focusAreas: [...transitionFocus.focusAreas, newArea]
    })
  }

  const updateFocusArea = (index: number, updates: Partial<TransitionFocusArea>) => {
    const updatedAreas = transitionFocus.focusAreas.map((area, i) =>
      i === index ? { ...area, ...updates } : area
    )
    onFocusChange({ focusAreas: updatedAreas })
  }

  const removeFocusArea = (index: number) => {
    const updatedAreas = transitionFocus.focusAreas.filter((_, i) => i !== index)
    onFocusChange({ focusAreas: updatedAreas })
  }

  const currentPath = getCurrentTransitionPath()

  return (
    <div className="space-y-6">
      {/* Career Transition Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Career Transition Path
          </CardTitle>
          <CardDescription>
            Define your current role and career advancement target
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Transition Path</label>
            <Select 
              value={`${transitionFocus.currentLevel}_TO_${transitionFocus.targetLevel}`}
              onValueChange={handleTransitionChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transitionPaths.map(path => (
                  <SelectItem 
                    key={`${path.current}_TO_${path.target}`}
                    value={`${path.current}_TO_${path.target}`}
                  >
                    {path.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentPath && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Selected Path:</p>
              <p className="text-blue-700">{currentPath.label}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Timeline Goal</label>
            <Select 
              value={transitionFocus.transitionTimeline}
              onValueChange={handleTimelineChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timelineOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <Badge 
                        variant={
                          option.urgency === 'high' ? 'destructive' :
                          option.urgency === 'medium' ? 'default' : 'secondary'
                        }
                        className="ml-2"
                      >
                        {option.urgency}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Current Confidence Level: {transitionFocus.confidenceLevel}/10
            </label>
            <Slider
              value={[transitionFocus.confidenceLevel]}
              onValueChange={handleConfidenceChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Not Confident</span>
              <span>Very Confident</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Areas Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Development Focus Areas
          </CardTitle>
          <CardDescription>
            Prioritize specific skills and competencies for your transition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Focus Areas */}
          {transitionFocus.focusAreas.length > 0 && (
            <div className="space-y-3">
              {transitionFocus.focusAreas.map((area, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{area.area}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        area.priority === 'HIGH' ? 'destructive' :
                        area.priority === 'MEDIUM' ? 'default' : 'secondary'
                      }>
                        {area.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFocusArea(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Priority</label>
                      <Select 
                        value={area.priority}
                        onValueChange={(value) => updateFocusArea(index, { priority: value as any })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Current: {area.currentLevel}/10
                      </label>
                      <Slider
                        value={[area.currentLevel]}
                        onValueChange={(value) => updateFocusArea(index, { currentLevel: value[0] })}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Target: {area.targetLevel}/10
                      </label>
                      <Slider
                        value={[area.targetLevel]}
                        onValueChange={(value) => updateFocusArea(index, { targetLevel: value[0] })}
                        max={10}
                        min={area.currentLevel}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Focus Area */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'Executive Communication',
              'Strategic Thinking',
              'Framework Application',
              'Stakeholder Management',
              'Industry Expertise',
              'Technical Leadership',
              'Data-Driven Decisions',
              'Cross-Functional Collaboration'
            ].filter(area => !transitionFocus.focusAreas.some(existing => existing.area === area))
             .map(area => (
              <Button
                key={area}
                variant="outline"
                size="sm"
                onClick={() => addFocusArea(area)}
                className="text-xs"
              >
                + {area}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}