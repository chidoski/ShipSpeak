'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Progress } from '../../ui/progress'
import { Badge } from '../../ui/badge'
import { 
  Target, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  Clock
} from 'lucide-react'
import type { OnboardingSection } from '../../../types/onboarding'

// PM → Senior PM specific onboarding flow
const pmToSeniorPMSections: OnboardingSection[] = [
  {
    id: 'executive-communication',
    title: 'Executive Communication Mastery',
    steps: 4,
    description: 'Master answer-first methodology for C-suite interaction',
    careerImpact: 'Critical for Senior PM executive presence and board readiness',
    requiredActions: [
      'Complete executive communication assessment',
      'Practice answer-first structure with real scenarios',
      'Record executive presentation practice session'
    ],
    optionalActions: [
      'Watch executive communication masterclass',
      'Review C-suite meeting examples'
    ]
  },
  {
    id: 'trade-off-articulation',
    title: 'Trade-off Articulation Excellence',
    description: 'Advanced decision reasoning with strategic frameworks',
    careerImpact: 'Essential for Senior PM strategic communication credibility',
    steps: 3,
    requiredActions: [
      'Practice complex trade-off scenarios',
      'Master multi-stakeholder decision communication',
      'Complete strategic reasoning assessment'
    ],
    optionalActions: [
      'Explore advanced framework applications',
      'Study trade-off communication examples'
    ]
  },
  {
    id: 'influence-without-authority',
    title: 'Influence Without Authority Development',
    description: 'Leadership language and confidence building techniques',
    careerImpact: 'Required for Senior PM cross-functional leadership effectiveness',
    steps: 3,
    requiredActions: [
      'Practice persuasion scenarios with resistant stakeholders',
      'Master confidence-building language patterns',
      'Complete influence assessment and feedback'
    ],
    optionalActions: [
      'Review negotiation and persuasion case studies',
      'Practice with challenging stakeholder simulations'
    ]
  },
  {
    id: 'strategic-altitude-control',
    title: 'Strategic Altitude Mastery',
    description: 'Adaptive communication for different stakeholder levels',
    careerImpact: 'Critical for Senior PM multi-audience communication effectiveness',
    steps: 2,
    requiredActions: [
      'Practice stakeholder-appropriate detail adaptation',
      'Master strategic vs tactical communication switching'
    ],
    optionalActions: [
      'Explore audience analysis techniques',
      'Review executive vs IC communication examples'
    ]
  }
]

interface PMToSeniorPMOnboardingProps {
  onSectionComplete?: (sectionId: string) => void
  onComplete?: () => void
  currentProgress?: number
}

export default function PMToSeniorPMOnboarding({
  onSectionComplete,
  onComplete,
  currentProgress = 0
}: PMToSeniorPMOnboardingProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<string[]>([])

  const currentSection = pmToSeniorPMSections[currentSectionIndex]
  const totalSteps = pmToSeniorPMSections.reduce((sum, section) => sum + section.steps, 0)
  const completedSteps = completedSections.length * 3 // Average steps per section

  const completeSection = (sectionId: string) => {
    setCompletedSections(prev => [...prev, sectionId])
    onSectionComplete?.(sectionId)
    
    if (currentSectionIndex < pmToSeniorPMSections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1)
    } else {
      onComplete?.()
    }
  }

  const skipToSection = (index: number) => {
    setCurrentSectionIndex(index)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">PM → Senior PM Transition</h2>
              <p className="text-muted-foreground">Executive Communication & Strategic Leadership</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Onboarding Progress</span>
              <Badge variant="secondary">
                {completedSections.length} of {pmToSeniorPMSections.length} sections
              </Badge>
            </div>
            <Progress value={(completedSections.length / pmToSeniorPMSections.length) * 100} className="h-2" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>15-18 minutes total</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span>4 key competency areas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pmToSeniorPMSections.map((section, index) => (
          <Card 
            key={section.id}
            className={`cursor-pointer transition-all ${
              currentSectionIndex === index ? 'ring-2 ring-blue-500 bg-blue-50' :
              completedSections.includes(section.id) ? 'bg-green-50 border-green-200' :
              'hover:bg-gray-50'
            }`}
            onClick={() => skipToSection(index)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded ${
                  completedSections.includes(section.id) ? 'bg-green-100' :
                  currentSectionIndex === index ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {completedSections.includes(section.id) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <span className="text-xs font-medium px-1">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight">{section.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{section.steps} steps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Section Detail */}
      {currentSection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {currentSection.title}
            </CardTitle>
            <p className="text-muted-foreground">{currentSection.description}</p>
            <Badge variant="outline" className="w-fit">
              {currentSection.careerImpact}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Required Actions */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Required Actions ({currentSection.requiredActions.length})
              </h4>
              <div className="space-y-2">
                {currentSection.requiredActions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="p-1 bg-blue-100 rounded">
                      <span className="text-xs font-medium text-blue-700">{index + 1}</span>
                    </div>
                    <span className="flex-1 text-sm">{action}</span>
                    <Button size="sm" variant="outline">
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Actions */}
            {currentSection.optionalActions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Optional Enhancements ({currentSection.optionalActions.length})
                </h4>
                <div className="space-y-2">
                  {currentSection.optionalActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="p-1 bg-gray-200 rounded">
                        <span className="text-xs font-medium text-gray-600">+{index + 1}</span>
                      </div>
                      <span className="flex-1 text-sm">{action}</span>
                      <Button size="sm" variant="ghost">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Explore
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Impact Insight */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-amber-800">Career Impact</h5>
                    <p className="text-sm text-amber-700 mt-1">{currentSection.careerImpact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => currentSectionIndex > 0 && setCurrentSectionIndex(prev => prev - 1)}
                disabled={currentSectionIndex === 0}
              >
                Previous Section
              </Button>
              <Button 
                className="flex-1"
                onClick={() => completeSection(currentSection.id)}
              >
                Complete Section
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}