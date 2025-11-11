'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Target, 
  Users, 
  TrendingUp,
  X,
  ArrowRight 
} from 'lucide-react'
import type { 
  OnboardingStatus, 
  Tour, 
  UserProfile,
  CareerTransitionType,
  Industry 
} from '../../types/onboarding'
import { mockUserProfile, mockOnboardingStatus, mockAvailableTours } from './shared/mockData'

interface OnboardingOrchestratorProps {
  isOpen?: boolean
  onClose?: () => void
  userProfile?: UserProfile
}

export default function OnboardingOrchestrator({ 
  isOpen = true, 
  onClose,
  userProfile = mockUserProfile 
}: OnboardingOrchestratorProps) {
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>(mockOnboardingStatus)
  const [availableTours] = useState<Tour[]>(mockAvailableTours)
  const [activeTour, setActiveTour] = useState<Tour | null>(null)
  const [currentTourStep, setCurrentTourStep] = useState<number>(0)

  // Filter tours based on user career transition and industry
  const relevantTours = availableTours.filter(tour => {
    const careerMatch = tour.careerRelevance === userProfile.careerTransition || 
                       tour.careerRelevance === 'ALL_LEVELS'
    const industryMatch = tour.industryContext.includes(userProfile.industry) || 
                         tour.industryContext.includes('ALL')
    return careerMatch && industryMatch
  }).sort((a, b) => {
    const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  const startTour = (tour: Tour) => {
    setActiveTour(tour)
    setCurrentTourStep(0)
  }

  const nextTourStep = () => {
    if (activeTour && currentTourStep < activeTour.steps.length - 1) {
      setCurrentTourStep(prev => prev + 1)
    } else {
      completeTour()
    }
  }

  const completeTour = () => {
    if (activeTour) {
      setOnboardingStatus(prev => ({
        ...prev,
        completedSections: [...prev.completedSections, activeTour.id],
        completionPercentage: Math.min(100, prev.completionPercentage + 25)
      }))
    }
    setActiveTour(null)
    setCurrentTourStep(0)
  }

  const skipTour = () => {
    setActiveTour(null)
    setCurrentTourStep(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Executive Development Guidance
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              PM-specific onboarding for {userProfile.careerTransition.replace('_', ' → ')} transition
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Onboarding Progress</span>
              <Badge variant="secondary">
                {onboardingStatus.completionPercentage}% Complete
              </Badge>
            </div>
            <Progress value={onboardingStatus.completionPercentage} className="h-2" />
            
            {/* Adaptive Guidance */}
            {onboardingStatus.adaptiveGuidance.length > 0 && (
              <div className="space-y-2">
                {onboardingStatus.adaptiveGuidance.map((guidance, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      guidance.urgency === 'HIGH' ? 'bg-orange-50 border-orange-200' :
                      guidance.urgency === 'MEDIUM' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 mt-0.5 text-blue-600" />
                      <p className="text-sm">{guidance.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Tour */}
          {activeTour && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    {activeTour.title}
                  </h3>
                  <Badge variant="secondary">
                    Step {currentTourStep + 1} of {activeTour.steps.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <Progress 
                    value={((currentTourStep + 1) / activeTour.steps.length) * 100} 
                    className="h-1" 
                  />

                  <div className="space-y-2">
                    <h4 className="font-medium">{activeTour.steps[currentTourStep].title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {activeTour.steps[currentTourStep].description}
                    </p>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-sm">
                        <strong>Explanation:</strong> {activeTour.steps[currentTourStep].explanation}
                      </p>
                      <p className="text-sm mt-2 text-blue-600">
                        <strong>Career Context:</strong> {activeTour.steps[currentTourStep].careerContext}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={nextTourStep} className="flex-1">
                      {currentTourStep < activeTour.steps.length - 1 ? 'Next Step' : 'Complete Tour'}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="outline" onClick={skipTour}>
                      Skip Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Tours */}
          {!activeTour && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommended Tours for Your Career Path
              </h3>

              <div className="grid gap-4">
                {relevantTours.map((tour) => (
                  <Card 
                    key={tour.id}
                    className={`cursor-pointer transition-colors ${
                      tour.priority === 'HIGH' ? 'border-orange-200 hover:bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => startTour(tour)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{tour.title}</h4>
                            <Badge variant={tour.priority === 'HIGH' ? 'default' : 'secondary'}>
                              {tour.priority} Priority
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {tour.estimatedDuration}min
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {tour.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {tour.careerRelevance.replace('_', ' → ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {tour.industryContext.includes('ALL') ? 'All Industries' : tour.industryContext.join(', ')}
                            </span>
                          </div>
                          {tour.completionRewards.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {tour.completionRewards.map((reward, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {reward}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Start Tour
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!activeTour && onboardingStatus.completionPercentage < 100 && (
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Continue Later
              </Button>
              <Button 
                className="flex-1"
                onClick={() => relevantTours.length > 0 && startTour(relevantTours[0])}
                disabled={relevantTours.length === 0}
              >
                Start Recommended Tour
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}