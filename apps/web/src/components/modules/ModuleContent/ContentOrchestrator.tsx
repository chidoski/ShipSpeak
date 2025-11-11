/**
 * ContentOrchestrator - Core module content delivery and progression
 * Manages sophisticated exercise delivery with PM-specific scenarios and adaptive difficulty
 */

import React, { useState, useEffect } from 'react'
import { 
  ModuleContentProps, 
  ExerciseScenario, 
  ExerciseResponse, 
  ResponseEvaluation,
  ExerciseType,
  DifficultyLevel
} from '@/types/module-content'
import { ScenarioBasedExercise } from './ExerciseTypes/ScenarioBasedExercise'
import { StakeholderRolePlay } from './ExerciseTypes/StakeholderRolePlay'
import { FrameworkApplication } from './ExerciseTypes/FrameworkApplication'
import { CommunicationStructure } from './ExerciseTypes/CommunicationStructure'
import { StructureAnalyzer } from './ResponseEvaluation/StructureAnalyzer'
import { DifficultyProgression } from './ProgressAdaptation/DifficultyProgression'

interface ContentOrchestratorState {
  currentExercise?: ExerciseScenario
  userResponse?: string
  evaluation?: ResponseEvaluation
  exerciseHistory: ExerciseResponse[]
  currentDifficulty: DifficultyLevel
  skillProgress: Record<string, number>
}

interface ContentOrchestratorProps extends ModuleContentProps {
  onExerciseComplete?: (response: ExerciseResponse) => void
  onProgressUpdate?: (progress: Record<string, number>) => void
  onDifficultyChange?: (newDifficulty: DifficultyLevel) => void
}

export function ContentOrchestrator({
  module,
  userProfile,
  exerciseEngine,
  progressTracking,
  onExerciseComplete,
  onProgressUpdate,
  onDifficultyChange
}: ContentOrchestratorProps) {
  const [state, setState] = useState<ContentOrchestratorState>({
    exerciseHistory: [],
    currentDifficulty: exerciseEngine.difficultyLevel,
    skillProgress: {}
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showEvaluation, setShowEvaluation] = useState(false)

  // Initialize exercise on mount
  useEffect(() => {
    initializeExercise()
  }, [module, userProfile])

  // Update difficulty when engine changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      currentDifficulty: exerciseEngine.difficultyLevel
    }))
  }, [exerciseEngine.difficultyLevel])

  const initializeExercise = async () => {
    setIsLoading(true)
    try {
      const scenario = await generateScenario()
      setState(prev => ({
        ...prev,
        currentExercise: scenario,
        userResponse: undefined,
        evaluation: undefined
      }))
      setShowEvaluation(false)
    } catch (error) {
      console.error('Failed to initialize exercise:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateScenario = async (): Promise<ExerciseScenario> => {
    // Generate scenario based on user profile and current difficulty
    const careerTransition = determineCareerTransition(userProfile.currentRole, userProfile.targetRole)
    const industryContext = userProfile.industry
    
    return exerciseEngine.scenarioGenerator.adaptiveBuilder.generateScenario({
      careerTransition,
      industryContext,
      difficulty: state.currentDifficulty,
      exerciseType: exerciseEngine.exerciseType,
      userProgress: progressTracking.skillProgression,
      recentPerformance: state.exerciseHistory.slice(-5)
    })
  }

  const determineCareerTransition = (currentRole: string, targetRole: string) => {
    const transitionMap: Record<string, string> = {
      'Product Owner-Product Manager': 'PO_TO_PM',
      'Product Manager-Senior PM': 'PM_TO_SENIOR_PM',
      'Senior PM-Group PM': 'SENIOR_PM_TO_GROUP_PM',
      'Group PM-Director of Product': 'GROUP_PM_TO_DIRECTOR'
    }
    
    return transitionMap[`${currentRole}-${targetRole}`] || 'PM_TO_SENIOR_PM'
  }

  const handleResponseSubmit = async (response: string) => {
    if (!state.currentExercise) return

    setIsLoading(true)
    try {
      const exerciseResponse: ExerciseResponse = {
        userResponse: response,
        responseStructure: await analyzeStructure(response),
        frameworkUsage: await evaluateFrameworks(response),
        communicationEffectiveness: await assessEffectiveness(response),
        improvementSuggestions: [],
        submittedAt: new Date(),
        duration: calculateResponseTime()
      }

      const evaluation = await evaluateResponse(exerciseResponse)
      
      setState(prev => ({
        ...prev,
        userResponse: response,
        evaluation,
        exerciseHistory: [...prev.exerciseHistory, exerciseResponse],
        skillProgress: updateSkillProgress(prev.skillProgress, evaluation)
      }))

      setShowEvaluation(true)
      onExerciseComplete?.(exerciseResponse)
      onProgressUpdate?.(state.skillProgress)

      // Check for difficulty progression
      await checkDifficultyProgression(evaluation)
    } catch (error) {
      console.error('Failed to evaluate response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeStructure = async (response: string) => {
    return exerciseEngine.responseEvaluator.structureAnalyzer.analyzeStructure(response)
  }

  const evaluateFrameworks = async (response: string) => {
    const frameworks = exerciseEngine.responseEvaluator.frameworkEvaluator.detectFrameworks(response)
    return frameworks.map(framework => 
      exerciseEngine.responseEvaluator.frameworkEvaluator.evaluateUsage(framework, response)
    )
  }

  const assessEffectiveness = async (response: string) => {
    if (!state.currentExercise) return { overallScore: 0, executivePresence: 0, persuasiveness: 0, clarity: 0, confidence: 0, stakeholderResonance: 0 }
    
    return {
      overallScore: calculateOverallScore(response),
      executivePresence: exerciseEngine.responseEvaluator.executivePresenceScorer.scorePresence(response).overall,
      persuasiveness: assessPersuasiveness(response),
      clarity: assessClarity(response),
      confidence: assessConfidence(response),
      stakeholderResonance: calculateStakeholderResonance(response, state.currentExercise.stakeholders)
    }
  }

  const evaluateResponse = async (exerciseResponse: ExerciseResponse): Promise<ResponseEvaluation> => {
    const structureScore = calculateStructureScore(exerciseResponse.responseStructure)
    const contentScore = calculateContentScore(exerciseResponse.communicationEffectiveness)
    const frameworkScore = calculateFrameworkScore(exerciseResponse.frameworkUsage)
    
    return {
      overallScore: (structureScore + contentScore + frameworkScore) / 3,
      structureScore,
      contentScore,
      stakeholderAdaptation: exerciseResponse.communicationEffectiveness.stakeholderResonance,
      frameworkApplication: frameworkScore,
      executivePresence: exerciseResponse.communicationEffectiveness.executivePresence,
      detailedFeedback: generateDetailedFeedback(exerciseResponse),
      nextSteps: generateNextSteps(exerciseResponse)
    }
  }

  const updateSkillProgress = (currentProgress: Record<string, number>, evaluation: ResponseEvaluation) => {
    const newProgress = { ...currentProgress }
    
    // Update based on exercise performance
    Object.keys(newProgress).forEach(skill => {
      const improvement = calculateSkillImprovement(skill, evaluation)
      newProgress[skill] = Math.min(10, Math.max(0, newProgress[skill] + improvement))
    })
    
    return newProgress
  }

  const checkDifficultyProgression = async (evaluation: ResponseEvaluation) => {
    const readinessScore = progressTracking.difficultyProgression.readinessForAdvancement
    
    if (evaluation.overallScore >= 8.0 && readinessScore >= 0.8) {
      const nextDifficulty = getNextDifficulty(state.currentDifficulty)
      if (nextDifficulty) {
        setState(prev => ({ ...prev, currentDifficulty: nextDifficulty }))
        onDifficultyChange?.(nextDifficulty)
      }
    }
  }

  const getNextDifficulty = (current: DifficultyLevel): DifficultyLevel | null => {
    const progression: DifficultyLevel[] = ['Foundation', 'Practice', 'Mastery', 'Expert']
    const currentIndex = progression.indexOf(current)
    return currentIndex < progression.length - 1 ? progression[currentIndex + 1] : null
  }

  const calculateResponseTime = () => {
    // Simplified - in real implementation, track actual time
    return Math.floor(Math.random() * 300) + 60 // 1-5 minutes
  }

  const calculateOverallScore = (response: string) => {
    // Simplified scoring - real implementation would use NLP analysis
    const wordCount = response.split(' ').length
    const hasStructure = response.includes('first') || response.includes('conclusion')
    const hasFramework = /\b(RICE|ICE|OKR)\b/i.test(response)
    
    let score = 5 // Base score
    if (wordCount >= 50 && wordCount <= 200) score += 1
    if (hasStructure) score += 1.5
    if (hasFramework) score += 1.5
    if (response.length > 100) score += 1
    
    return Math.min(10, score)
  }

  const assessPersuasiveness = (response: string) => {
    // Check for persuasive language patterns
    const persuasiveWords = ['recommend', 'should', 'will', 'benefit', 'advantage', 'impact']
    const count = persuasiveWords.filter(word => 
      response.toLowerCase().includes(word)
    ).length
    return Math.min(10, (count / persuasiveWords.length) * 10)
  }

  const assessClarity = (response: string) => {
    // Simple clarity assessment based on sentence structure
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgSentenceLength = response.length / sentences.length
    
    // Optimal sentence length for business communication: 15-20 words
    if (avgSentenceLength >= 15 && avgSentenceLength <= 20) return 9
    if (avgSentenceLength >= 10 && avgSentenceLength <= 25) return 7
    return 5
  }

  const assessConfidence = (response: string) => {
    const hedgingWords = ['maybe', 'perhaps', 'possibly', 'might', 'could']
    const confidenceWords = ['will', 'recommend', 'believe', 'confident', 'certain']
    
    const hedging = hedgingWords.filter(word => response.toLowerCase().includes(word)).length
    const confidence = confidenceWords.filter(word => response.toLowerCase().includes(word)).length
    
    return Math.max(1, Math.min(10, 6 + confidence - hedging))
  }

  const calculateStakeholderResonance = (response: string, stakeholders: any[]) => {
    // Simplified stakeholder resonance calculation
    return Math.floor(Math.random() * 4) + 6 // 6-10 range
  }

  const calculateStructureScore = (structure: any) => {
    let score = 0
    if (structure.hasAnswerFirst) score += 3
    if (structure.logicalFlow === 'EXCELLENT') score += 2
    else if (structure.logicalFlow === 'GOOD') score += 1
    
    score += structure.clarity * 2
    score += structure.conciseness * 2
    score += structure.completeness * 1
    
    return Math.min(10, score)
  }

  const calculateContentScore = (effectiveness: any) => {
    return (effectiveness.clarity + effectiveness.persuasiveness + effectiveness.confidence) / 3
  }

  const calculateFrameworkScore = (frameworkUsage: any[]) => {
    if (frameworkUsage.length === 0) return 3
    
    const avgScore = frameworkUsage.reduce((sum, usage) => sum + usage.appropriatenessScore, 0) / frameworkUsage.length
    return Math.min(10, avgScore)
  }

  const calculateSkillImprovement = (skill: string, evaluation: ResponseEvaluation) => {
    // Simplified skill improvement calculation
    const baseImprovement = (evaluation.overallScore - 5) / 10 // -0.5 to +0.5
    return baseImprovement * 0.2 // Small incremental improvements
  }

  const generateDetailedFeedback = (exerciseResponse: ExerciseResponse) => {
    return {
      strengths: [
        'Clear communication structure',
        'Appropriate stakeholder consideration',
        'Good use of business language'
      ],
      improvementAreas: [
        'Framework application could be more explicit',
        'Consider adding more specific metrics',
        'Strengthen executive presence language'
      ],
      specificSuggestions: [
        'Use the RICE framework to structure your prioritization',
        'Include specific timeline and success metrics',
        'Start with your conclusion for executive audiences'
      ],
      exampleImprovements: [
        {
          original: 'I think we should consider this option',
          improved: 'I recommend we prioritize this option based on RICE scoring',
          reasoning: 'Shows confidence and framework usage',
          impact: 'Increases executive presence and credibility'
        }
      ]
    }
  }

  const generateNextSteps = (exerciseResponse: ExerciseResponse) => {
    return [
      {
        action: 'Practice answer-first communication',
        priority: 'IMMEDIATE' as const,
        description: 'Start responses with your conclusion or recommendation',
        resources: ['Answer-First Communication Guide', 'Executive Presence Module']
      },
      {
        action: 'Strengthen framework application',
        priority: 'SHORT_TERM' as const,
        description: 'Practice explicit use of PM frameworks in scenarios',
        resources: ['RICE Framework Practice', 'PM Decision-Making Module']
      }
    ]
  }

  const handleNextExercise = () => {
    initializeExercise()
  }

  const renderCurrentExercise = () => {
    if (!state.currentExercise) return null

    const commonProps = {
      scenario: state.currentExercise,
      userProfile,
      onResponseSubmit: handleResponseSubmit,
      isLoading
    }

    switch (exerciseEngine.exerciseType) {
      case 'SCENARIO_BASED':
        return <ScenarioBasedExercise {...commonProps} />
      case 'STAKEHOLDER_ROLEPLAY':
        return <StakeholderRolePlay {...commonProps} />
      case 'FRAMEWORK_APPLICATION':
        return <FrameworkApplication {...commonProps} />
      case 'COMMUNICATION_STRUCTURE':
        return <CommunicationStructure {...commonProps} />
      default:
        return <ScenarioBasedExercise {...commonProps} />
    }
  }

  if (isLoading && !state.currentExercise) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-executive-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading your personalized exercise...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
            <p className="text-gray-600 mt-1">{module.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Difficulty</div>
            <div className="text-lg font-semibold text-executive-primary">
              {state.currentDifficulty}
            </div>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Exercise {state.exerciseHistory.length + 1}</span>
          <span>•</span>
          <span>Career Focus: {userProfile.currentRole} → {userProfile.targetRole}</span>
          <span>•</span>
          <span>Industry: {userProfile.industry}</span>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderCurrentExercise()}
      </div>

      {/* Evaluation Results */}
      {showEvaluation && state.evaluation && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Performance Analysis</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-executive-primary">
                {state.evaluation.overallScore.toFixed(1)}/10
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>
          
          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {state.evaluation.structureScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Structure</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {state.evaluation.contentScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Content</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {state.evaluation.frameworkApplication.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Framework</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {state.evaluation.executivePresence.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Presence</div>
            </div>
          </div>
          
          {/* Detailed Feedback */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Strengths</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {state.evaluation.detailedFeedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {state.evaluation.detailedFeedback.improvementAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Next Exercise Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleNextExercise}
              className="px-6 py-3 bg-executive-primary text-white rounded-lg font-semibold hover:bg-executive-primary/90 transition-colors"
            >
              Next Exercise
            </button>
          </div>
        </div>
      )}
    </div>
  )
}