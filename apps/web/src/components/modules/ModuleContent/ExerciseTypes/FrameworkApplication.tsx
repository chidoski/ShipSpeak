/**
 * FrameworkApplication - PM framework usage and mastery practice
 * Interactive exercises for mastering PM frameworks in realistic scenarios
 */

import React, { useState, useEffect } from 'react'
import { ExerciseScenario, UserProfile, PMFramework } from '@/types/module-content'

interface FrameworkStep {
  id: string
  framework: PMFramework
  step: string
  description: string
  prompt: string
  required: boolean
  example?: string
}

interface FrameworkResponse {
  stepId: string
  response: string
  score?: number
  feedback?: string[]
}

interface FrameworkApplicationProps {
  scenario: ExerciseScenario
  userProfile: UserProfile
  onResponseSubmit: (response: string) => void
  isLoading: boolean
}

const FRAMEWORK_DEFINITIONS = {
  RICE: {
    name: 'RICE (Reach, Impact, Confidence, Effort)',
    description: 'Prioritization framework using quantitative scoring',
    steps: [
      { key: 'reach', label: 'Reach', description: 'How many people will this impact over a given time period?', unit: 'people/month' },
      { key: 'impact', label: 'Impact', description: 'How much will this impact each person?', scale: '0.25 (minimal) to 3 (massive)' },
      { key: 'confidence', label: 'Confidence', description: 'How confident are you in your estimates?', scale: '50% to 100%' },
      { key: 'effort', label: 'Effort', description: 'How much work will this require?', unit: 'person-months' }
    ],
    calculation: '(Reach × Impact × Confidence) ÷ Effort = RICE Score'
  },
  ICE: {
    name: 'ICE (Impact, Confidence, Ease)',
    description: 'Simple prioritization using 1-10 scoring',
    steps: [
      { key: 'impact', label: 'Impact', description: 'How much will this move the needle?', scale: '1 (low) to 10 (high)' },
      { key: 'confidence', label: 'Confidence', description: 'How sure are you this will work?', scale: '1 (low) to 10 (high)' },
      { key: 'ease', label: 'Ease', description: 'How easy is this to implement?', scale: '1 (hard) to 10 (easy)' }
    ],
    calculation: '(Impact + Confidence + Ease) ÷ 3 = ICE Score'
  },
  JOBS_TO_BE_DONE: {
    name: 'Jobs-to-be-Done Framework',
    description: 'Understanding customer motivation and context',
    steps: [
      { key: 'job', label: 'Core Job', description: 'What job is the customer trying to get done?', unit: 'functional outcome' },
      { key: 'situation', label: 'Situation', description: 'What situation triggers this job?', unit: 'context/trigger' },
      { key: 'outcome', label: 'Desired Outcome', description: 'How does the customer measure success?', unit: 'success metrics' },
      { key: 'constraints', label: 'Constraints', description: 'What prevents the customer from getting the job done?', unit: 'barriers' }
    ],
    calculation: 'Job Story: When [situation], I want to [job], so I can [outcome]'
  }
}

export function FrameworkApplication({
  scenario,
  userProfile,
  onResponseSubmit,
  isLoading
}: FrameworkApplicationProps) {
  const [selectedFramework, setSelectedFramework] = useState<PMFramework | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [calculations, setCalculations] = useState<Record<string, number>>({})
  const [showGuidance, setShowGuidance] = useState(true)
  const [frameworkScore, setFrameworkScore] = useState<number | null>(null)

  const suggestedFrameworks = getSuggestedFrameworks(scenario)

  useEffect(() => {
    if (suggestedFrameworks.length > 0 && !selectedFramework) {
      setSelectedFramework(suggestedFrameworks[0])
    }
  }, [scenario])

  function getSuggestedFrameworks(scenario: ExerciseScenario): PMFramework[] {
    // Suggest frameworks based on scenario context
    const suggestions: PMFramework[] = []
    
    if (scenario.context.situation.toLowerCase().includes('priorit')) {
      suggestions.push('RICE', 'ICE')
    }
    
    if (scenario.context.situation.toLowerCase().includes('customer') || 
        scenario.context.situation.toLowerCase().includes('user')) {
      suggestions.push('JOBS_TO_BE_DONE')
    }
    
    if (suggestions.length === 0) {
      suggestions.push('RICE') // Default framework
    }
    
    return suggestions
  }

  const handleFrameworkSelect = (framework: PMFramework) => {
    setSelectedFramework(framework)
    setCurrentStep(0)
    setResponses({})
    setCalculations({})
    setFrameworkScore(null)
  }

  const handleStepResponse = (stepKey: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [stepKey]: value
    }))

    // Auto-calculate if numeric
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue)) {
      setCalculations(prev => ({
        ...prev,
        [stepKey]: numericValue
      }))
    }
  }

  const calculateFrameworkScore = (): number => {
    if (!selectedFramework) return 0

    switch (selectedFramework) {
      case 'RICE':
        const { reach = 0, impact = 0, confidence = 0, effort = 1 } = calculations
        return (reach * impact * (confidence / 100)) / effort
        
      case 'ICE':
        const { impact: iceImpact = 0, confidence: iceConfidence = 0, ease = 0 } = calculations
        return (iceImpact + iceConfidence + ease) / 3
        
      case 'JOBS_TO_BE_DONE':
        // For Jobs-to-be-Done, score based on completeness
        const jobSteps = FRAMEWORK_DEFINITIONS.JOBS_TO_BE_DONE.steps
        const completedSteps = jobSteps.filter(step => responses[step.key]?.trim()).length
        return (completedSteps / jobSteps.length) * 10
        
      default:
        return 0
    }
  }

  const handleCompleteFramework = () => {
    const score = calculateFrameworkScore()
    setFrameworkScore(score)

    // Generate comprehensive response
    const frameworkAnalysis = generateFrameworkAnalysis()
    onResponseSubmit(frameworkAnalysis)
  }

  const generateFrameworkAnalysis = (): string => {
    if (!selectedFramework) return ''

    const framework = FRAMEWORK_DEFINITIONS[selectedFramework]
    const score = calculateFrameworkScore()

    let analysis = `## ${framework.name} Analysis\n\n`
    analysis += `**Scenario:** ${scenario.title}\n\n`

    // Add step-by-step analysis
    framework.steps.forEach(step => {
      const response = responses[step.key] || 'Not provided'
      analysis += `**${step.label}:** ${response}\n`
      if (step.description) {
        analysis += `*${step.description}*\n`
      }
      analysis += '\n'
    })

    // Add calculation
    analysis += `**Calculation:** ${framework.calculation}\n`
    if (selectedFramework !== 'JOBS_TO_BE_DONE') {
      analysis += `**Score:** ${score.toFixed(2)}\n\n`
    }

    // Add recommendation
    analysis += `**Recommendation:** ${generateRecommendation(score)}\n\n`
    
    // Add rationale
    analysis += `**Rationale:** This framework application helps address the scenario by providing structured decision-making criteria and quantifiable reasoning for stakeholder communication.`

    return analysis
  }

  const generateRecommendation = (score: number): string => {
    if (!selectedFramework) return ''

    switch (selectedFramework) {
      case 'RICE':
        if (score > 50) return 'High priority - recommend immediate implementation'
        if (score > 10) return 'Medium priority - schedule for next quarter'
        return 'Low priority - consider for future roadmap'
        
      case 'ICE':
        if (score > 8) return 'High priority - excellent candidate for implementation'
        if (score > 6) return 'Medium priority - good option with some trade-offs'
        return 'Low priority - may not be worth the effort at this time'
        
      case 'JOBS_TO_BE_DONE':
        if (score > 8) return 'Strong product-market fit - well-defined customer job'
        if (score > 6) return 'Good understanding - some gaps to explore further'
        return 'Needs more customer research - job definition unclear'
        
      default:
        return 'Framework analysis complete'
    }
  }

  const getStepValidation = (stepKey: string, value: string): string[] => {
    const issues: string[] = []

    if (!selectedFramework) return issues

    if (selectedFramework === 'RICE') {
      switch (stepKey) {
        case 'reach':
          if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
            issues.push('Reach should be a positive number (people per month)')
          }
          break
        case 'impact':
          const impact = parseFloat(value)
          if (isNaN(impact) || impact < 0.25 || impact > 3) {
            issues.push('Impact should be between 0.25 and 3')
          }
          break
        case 'confidence':
          const confidence = parseFloat(value)
          if (isNaN(confidence) || confidence < 50 || confidence > 100) {
            issues.push('Confidence should be between 50% and 100%')
          }
          break
        case 'effort':
          if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
            issues.push('Effort should be a positive number (person-months)')
          }
          break
      }
    }

    if (selectedFramework === 'ICE') {
      const score = parseFloat(value)
      if (isNaN(score) || score < 1 || score > 10) {
        issues.push('Score should be between 1 and 10')
      }
    }

    return issues
  }

  const renderFrameworkSelector = () => (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-900 mb-3">Recommended Frameworks</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {suggestedFrameworks.map(framework => (
          <button
            key={framework}
            onClick={() => handleFrameworkSelect(framework)}
            className={`text-left p-4 rounded-lg border-2 transition-colors ${
              selectedFramework === framework
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="font-semibold text-gray-900">
              {FRAMEWORK_DEFINITIONS[framework].name}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {FRAMEWORK_DEFINITIONS[framework].description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )

  const renderFrameworkSteps = () => {
    if (!selectedFramework) return null

    const framework = FRAMEWORK_DEFINITIONS[selectedFramework]
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Apply {framework.name}
          </h3>
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showGuidance ? 'Hide' : 'Show'} Guidance
          </button>
        </div>

        {showGuidance && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 mb-2">{framework.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Calculation:</strong> {framework.calculation}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {framework.steps.map((step, index) => {
            const value = responses[step.key] || ''
            const validation = getStepValidation(step.key, value)
            
            return (
              <div key={step.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{step.label}</h4>
                  {step.scale && (
                    <span className="text-sm text-gray-500">{step.scale}</span>
                  )}
                  {step.unit && (
                    <span className="text-sm text-gray-500">{step.unit}</span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                
                <div className="space-y-2">
                  {selectedFramework === 'JOBS_TO_BE_DONE' ? (
                    <textarea
                      value={value}
                      onChange={(e) => handleStepResponse(step.key, e.target.value)}
                      placeholder={`Enter ${step.label.toLowerCase()}...`}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-executive-primary focus:border-transparent"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleStepResponse(step.key, e.target.value)}
                      placeholder={`Enter ${step.label.toLowerCase()}...`}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-executive-primary focus:border-transparent"
                      step="any"
                    />
                  )}
                  
                  {validation.length > 0 && (
                    <div className="text-sm text-red-600 space-y-1">
                      {validation.map((issue, i) => (
                        <div key={i}>• {issue}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCalculation = () => {
    if (!selectedFramework || Object.keys(calculations).length === 0) return null

    const score = calculateFrameworkScore()
    const framework = FRAMEWORK_DEFINITIONS[selectedFramework]

    return (
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-3">Framework Calculation</h4>
        
        {selectedFramework === 'RICE' && (
          <div className="space-y-2 text-sm">
            <div>Reach: {calculations.reach || 0} people/month</div>
            <div>Impact: {calculations.impact || 0} (0.25-3 scale)</div>
            <div>Confidence: {calculations.confidence || 0}%</div>
            <div>Effort: {calculations.effort || 1} person-months</div>
            <div className="border-t pt-2 font-semibold">
              RICE Score: {score.toFixed(2)}
            </div>
          </div>
        )}

        {selectedFramework === 'ICE' && (
          <div className="space-y-2 text-sm">
            <div>Impact: {calculations.impact || 0}/10</div>
            <div>Confidence: {calculations.confidence || 0}/10</div>
            <div>Ease: {calculations.ease || 0}/10</div>
            <div className="border-t pt-2 font-semibold">
              ICE Score: {score.toFixed(1)}/10
            </div>
          </div>
        )}

        <div className="mt-3 p-3 bg-white rounded border text-sm">
          <strong>Recommendation:</strong> {generateRecommendation(score)}
        </div>
      </div>
    )
  }

  const isFrameworkComplete = (): boolean => {
    if (!selectedFramework) return false
    
    const framework = FRAMEWORK_DEFINITIONS[selectedFramework]
    return framework.steps.every(step => {
      const value = responses[step.key]
      return value && value.trim().length > 0
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h2>
        <p className="text-gray-600">Apply PM frameworks to structure your analysis and decision-making</p>
      </div>

      {/* Framework Selector */}
      {renderFrameworkSelector()}

      {/* Framework Steps */}
      {selectedFramework && renderFrameworkSteps()}

      {/* Live Calculation */}
      {renderCalculation()}

      {/* Submit Button */}
      {isFrameworkComplete() && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleCompleteFramework}
            disabled={isLoading}
            className="px-6 py-3 bg-executive-primary text-white rounded-lg font-semibold hover:bg-executive-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing Framework Application...' : 'Complete Framework Analysis'}
          </button>
        </div>
      )}

      {/* Framework Score Display */}
      {frameworkScore !== null && (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Framework Application Score</h3>
          <div className="text-3xl font-bold text-blue-800">
            {selectedFramework === 'JOBS_TO_BE_DONE' ? 
              `${(frameworkScore * 10).toFixed(0)}%` : 
              frameworkScore.toFixed(2)
            }
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {generateRecommendation(frameworkScore)}
          </p>
        </div>
      )}
    </div>
  )
}