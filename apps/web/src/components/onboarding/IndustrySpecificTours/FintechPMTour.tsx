'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Progress } from '../../ui/progress'
import { Badge } from '../../ui/badge'
import { 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Clock,
  BookOpen
} from 'lucide-react'

// Fintech-specific tour content
const fintechTourSteps = [
  {
    id: 'regulatory-dashboard',
    title: 'Regulatory Communication Dashboard',
    description: 'Track compliance language and risk communication patterns',
    targetFeature: 'Regulatory Metrics Panel',
    regulatoryContext: 'SEC, FINRA, and banking regulation integration',
    communicationFocus: 'Risk disclosure and customer protection language',
    careerImpact: 'Critical for fintech PM credibility with legal and compliance teams',
    practiceOpportunity: 'Practice regulatory communication scenarios with real compliance requirements',
    icon: Shield
  },
  {
    id: 'risk-communication',
    title: 'Financial Risk Communication Excellence',
    description: 'Balance transparency with customer confidence in financial products',
    targetFeature: 'Risk Assessment Communication Module',
    regulatoryContext: 'Consumer Financial Protection Bureau (CFPB) guidelines',
    communicationFocus: 'Clear risk explanation without creating unnecessary alarm',
    careerImpact: 'Essential for senior fintech PM roles requiring customer trust building',
    practiceOpportunity: 'Interactive scenarios for communicating market volatility and product risks',
    icon: AlertTriangle
  },
  {
    id: 'financial-metrics',
    title: 'Financial Performance Communication',
    description: 'Communicate P&L impact and revenue model implications',
    targetFeature: 'Financial Impact Analysis Dashboard',
    regulatoryContext: 'Revenue recognition and financial reporting accuracy',
    communicationFocus: 'Business model impact and financial reasoning',
    careerImpact: 'Required for fintech PM advancement to director and VP roles',
    practiceOpportunity: 'Practice explaining complex financial concepts to non-finance stakeholders',
    icon: TrendingUp
  },
  {
    id: 'trust-building',
    title: 'Customer Trust & Security Communication',
    description: 'Build confidence in financial product safety and reliability',
    targetFeature: 'Security Communication Framework',
    regulatoryContext: 'Data protection and financial security standards',
    communicationFocus: 'Security assurance without revealing vulnerabilities',
    careerImpact: 'Critical for consumer fintech PM success and customer adoption',
    practiceOpportunity: 'Practice communicating security features and incident response',
    icon: DollarSign
  }
]

interface FintechPMTourProps {
  onTourComplete?: () => void
  userRole?: 'PM' | 'SENIOR_PM' | 'GROUP_PM'
}

export default function FintechPMTour({ 
  onTourComplete, 
  userRole = 'PM' 
}: FintechPMTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const currentTourStep = fintechTourSteps[currentStep]
  const progressPercentage = ((currentStep + 1) / fintechTourSteps.length) * 100

  const nextStep = () => {
    if (!completedSteps.includes(currentTourStep.id)) {
      setCompletedSteps(prev => [...prev, currentTourStep.id])
    }
    
    if (currentStep < fintechTourSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onTourComplete?.()
    }
  }

  const skipStep = () => {
    nextStep()
  }

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Fintech PM Communication Tour</h2>
              <p className="text-muted-foreground">Navigate regulatory complexity and build customer trust</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Tour Progress</span>
              <Badge variant="secondary">
                Step {currentStep + 1} of {fintechTourSteps.length}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span>12-15 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>Regulatory Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              <span>Trust Building</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {fintechTourSteps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card 
              key={step.id}
              className={`cursor-pointer transition-all ${
                currentStep === index ? 'ring-2 ring-emerald-500 bg-emerald-50' :
                completedSteps.includes(step.id) ? 'bg-green-50 border-green-200' :
                'hover:bg-gray-50'
              }`}
              onClick={() => jumpToStep(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded ${
                    completedSteps.includes(step.id) ? 'bg-green-100' :
                    currentStep === index ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight">{step.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Step Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentTourStep.icon className="h-5 w-5" />
            {currentTourStep.title}
          </CardTitle>
          <p className="text-muted-foreground">{currentTourStep.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Feature Focus */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Feature Focus: {currentTourStep.targetFeature}
            </h4>
            <p className="text-sm text-emerald-700">{currentTourStep.description}</p>
          </div>

          {/* Regulatory Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <h5 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Regulatory Context
                </h5>
                <p className="text-sm text-orange-700">{currentTourStep.regulatoryContext}</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Communication Focus
                </h5>
                <p className="text-sm text-blue-700">{currentTourStep.communicationFocus}</p>
              </CardContent>
            </Card>
          </div>

          {/* Career Impact */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-purple-800 mb-1">Career Impact for {userRole}s</h5>
                  <p className="text-sm text-purple-700 mb-3">{currentTourStep.careerImpact}</p>
                  
                  <div className="p-3 bg-white/50 rounded border border-purple-200">
                    <h6 className="font-medium text-purple-800 text-xs mb-1">Practice Opportunity</h6>
                    <p className="text-xs text-purple-700">{currentTourStep.practiceOpportunity}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Element Highlight */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h5 className="font-medium text-yellow-800 mb-2">Try This Feature</h5>
            <p className="text-sm text-yellow-700 mb-3">
              Look for the "{currentTourStep.targetFeature}" in your dashboard to practice fintech-specific communication patterns.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                Explore Feature
              </Button>
              <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                Start Practice
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button variant="ghost" onClick={skipStep}>
              Skip Step
            </Button>
            <Button className="flex-1" onClick={nextStep}>
              {currentStep < fintechTourSteps.length - 1 ? 'Next Step' : 'Complete Tour'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fintech PM Success Tips */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-emerald-800 mb-3">Fintech PM Success Tips</h4>
          <div className="space-y-2 text-sm text-emerald-700">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5" />
              <span>Always integrate regulatory considerations in product communication</span>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 mt-0.5" />
              <span>Build customer trust through transparent but confident risk communication</span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 mt-0.5" />
              <span>Connect product decisions to financial impact and business model implications</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}