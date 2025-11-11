/**
 * ScenarioBasedExercise - Real-world PM scenario practice
 * Immersive scenarios that mirror actual PM communication challenges
 */

import React, { useState, useEffect } from 'react'
import { ExerciseScenario, UserProfile } from '@/types/module-content'

interface ScenarioBasedExerciseProps {
  scenario: ExerciseScenario
  userProfile: UserProfile
  onResponseSubmit: (response: string) => void
  isLoading: boolean
}

export function ScenarioBasedExercise({
  scenario,
  userProfile,
  onResponseSubmit,
  isLoading
}: ScenarioBasedExerciseProps) {
  const [response, setResponse] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(scenario.timeLimit || 300) // 5 minutes default
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isTimerActive, timeRemaining])

  const startTimer = () => {
    setIsTimerActive(true)
  }

  const pauseTimer = () => {
    setIsTimerActive(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmit = () => {
    if (response.trim()) {
      setIsTimerActive(false)
      onResponseSubmit(response.trim())
    }
  }

  const renderStakeholder = (stakeholder: any, index: number) => (
    <div key={index} className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{stakeholder.name}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          stakeholder.alignment === 'ALIGNED' ? 'bg-green-100 text-green-800' :
          stakeholder.alignment === 'OPPOSED' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {stakeholder.alignment}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{stakeholder.role}</p>
      <div className="space-y-1">
        <div className="text-xs text-gray-500">Motivations:</div>
        <ul className="text-xs text-gray-600 list-disc list-inside">
          {stakeholder.motivation?.map((motivation: string, i: number) => (
            <li key={i}>{motivation}</li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderConstraints = () => (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-900">Key Constraints</h4>
      <div className="space-y-2">
        {scenario.constraints.map((constraint, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              constraint.severity === 'CRITICAL' ? 'bg-red-500' :
              constraint.severity === 'HIGH' ? 'bg-orange-500' :
              constraint.severity === 'MEDIUM' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            <div>
              <span className="font-medium text-sm text-gray-900 uppercase">
                {constraint.type}
              </span>
              <p className="text-sm text-gray-600">{constraint.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSuccessCriteria = () => (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-900">Success Criteria</h4>
      <div className="space-y-2">
        {scenario.successCriteria.map((criterion, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-executive-primary rounded-full" />
            <span className="text-sm text-gray-700">{criterion.criterion}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const getHints = () => {
    const hints = [
      "Start with your recommendation (answer-first approach)",
      "Use specific PM frameworks like RICE or ICE when appropriate",
      "Address each stakeholder's concerns directly",
      "Provide concrete next steps and timelines",
      "Show confidence while acknowledging constraints"
    ]
    return hints
  }

  return (
    <div className="p-6 space-y-6">
      {/* Scenario Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{scenario.title}</h2>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              scenario.difficulty === 'Foundation' ? 'bg-green-100 text-green-800' :
              scenario.difficulty === 'Practice' ? 'bg-blue-100 text-blue-800' :
              scenario.difficulty === 'Mastery' ? 'bg-purple-100 text-purple-800' :
              'bg-red-100 text-red-800'
            }`}>
              {scenario.difficulty}
            </span>
            
            {scenario.timeLimit && (
              <div className="flex items-center space-x-2">
                <span className={`font-mono text-lg ${
                  timeRemaining <= 60 ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
                <button
                  onClick={isTimerActive ? pauseTimer : startTimer}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  {isTimerActive ? 'Pause' : 'Start'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Context */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">Scenario Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Industry:</span> {scenario.context.industryContext}
            </div>
            <div>
              <span className="font-medium text-blue-800">Company Size:</span> {scenario.context.companySize}
            </div>
            <div>
              <span className="font-medium text-blue-800">Timeline:</span> {scenario.context.timeline}
            </div>
            <div>
              <span className="font-medium text-blue-800">Urgency:</span> {scenario.context.urgencyLevel}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-blue-800">{scenario.context.situation}</p>
          </div>
        </div>

        {/* Career Focus */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Career Development Focus</h3>
          <p className="text-sm text-green-800">
            This exercise targets your transition from <strong>{userProfile.currentRole}</strong> to <strong>{userProfile.targetRole}</strong> 
            with specific focus on {userProfile.industry} industry communication patterns.
          </p>
        </div>
      </div>

      {/* Exercise Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Stakeholders */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Key Stakeholders</h3>
          <div className="space-y-3">
            {scenario.stakeholders.map((stakeholder, index) => 
              renderStakeholder(stakeholder, index)
            )}
          </div>
        </div>

        {/* Right Column - Constraints & Success Criteria */}
        <div className="space-y-6">
          {renderConstraints()}
          {renderSuccessCriteria()}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-3">Learning Objectives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenario.objectives.map((objective, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-yellow-800">{objective.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Response Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Your Response</h3>
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
        </div>

        {showHints && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Communication Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {getHints().map((hint, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Provide your response to this scenario. Consider the stakeholders, constraints, and success criteria as you craft your communication..."
            className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-executive-primary focus:border-transparent"
            disabled={isLoading}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Word count: {response.split(' ').filter(word => word.length > 0).length}
              {response.split(' ').filter(word => word.length > 0).length < 50 && 
                <span className="text-amber-600 ml-2">Consider adding more detail (aim for 50-200 words)</span>
              }
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!response.trim() || isLoading}
              className="px-6 py-3 bg-executive-primary text-white rounded-lg font-semibold hover:bg-executive-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Submit Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}