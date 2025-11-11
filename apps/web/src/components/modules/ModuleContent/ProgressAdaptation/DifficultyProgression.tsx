/**
 * DifficultyProgression - Adaptive difficulty adjustment
 * Manages progression through Foundation → Practice → Mastery → Expert levels
 */

import React, { useState, useEffect } from 'react'
import { DifficultyLevel, DifficultyProgression as DifficultyProgressionType, ProgressionMilestone } from '@/types/module-content'

interface DifficultyProgressionProps {
  currentLevel: DifficultyLevel
  readinessForAdvancement: number
  lastAdvancement?: Date
  nextLevelRequirements: string[]
  onLevelChange?: (newLevel: DifficultyLevel) => void
}

const DIFFICULTY_PROGRESSION: Record<DifficultyLevel, {
  next?: DifficultyLevel
  requirements: {
    minimumScore: number
    consistentPerformance: number // Number of exercises
    timeAtLevel: number // Hours
    keySkills: string[]
  }
  description: string
  focus: string[]
}> = {
  Foundation: {
    next: 'Practice',
    requirements: {
      minimumScore: 7.0,
      consistentPerformance: 5,
      timeAtLevel: 2,
      keySkills: ['Basic PM vocabulary', 'Simple framework application', 'Clear communication structure']
    },
    description: 'Learning fundamental PM communication patterns and basic frameworks',
    focus: ['Answer-first structure', 'PM terminology', 'Basic stakeholder identification', 'Framework introduction']
  },
  Practice: {
    next: 'Mastery',
    requirements: {
      minimumScore: 7.5,
      consistentPerformance: 8,
      timeAtLevel: 5,
      keySkills: ['Multi-stakeholder communication', 'Framework integration', 'Executive presence basics']
    },
    description: 'Applying skills in realistic scenarios with multiple stakeholders',
    focus: ['Complex stakeholder dynamics', 'Framework mastery', 'Trade-off communication', 'Influence tactics']
  },
  Mastery: {
    next: 'Expert',
    requirements: {
      minimumScore: 8.0,
      consistentPerformance: 10,
      timeAtLevel: 10,
      keySkills: ['Crisis communication', 'Organizational influence', 'Strategic vision articulation']
    },
    description: 'Handling high-stakes scenarios with organizational complexity',
    focus: ['Crisis management', 'Board-level communication', 'Organizational politics', 'Vision leadership']
  },
  Expert: {
    requirements: {
      minimumScore: 8.5,
      consistentPerformance: 15,
      timeAtLevel: 20,
      keySkills: ['Market strategy communication', 'Business model innovation', 'Industry leadership']
    },
    description: 'Mastery of executive-level strategic communication and industry leadership',
    focus: ['Business strategy', 'Market positioning', 'Industry transformation', 'Executive leadership']
  }
}

export function DifficultyProgression({
  currentLevel,
  readinessForAdvancement,
  lastAdvancement,
  nextLevelRequirements,
  onLevelChange
}: DifficultyProgressionProps) {
  const [showProgression, setShowProgression] = useState(true)
  const [animateProgress, setAnimateProgress] = useState(false)

  const currentLevelInfo = DIFFICULTY_PROGRESSION[currentLevel]
  const nextLevel = currentLevelInfo.next
  const nextLevelInfo = nextLevel ? DIFFICULTY_PROGRESSION[nextLevel] : null

  useEffect(() => {
    // Animate progress bar when readiness changes
    if (readinessForAdvancement > 0.8) {
      setAnimateProgress(true)
      const timer = setTimeout(() => setAnimateProgress(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [readinessForAdvancement])

  const handleLevelAdvancement = () => {
    if (nextLevel && readinessForAdvancement >= 0.8) {
      onLevelChange?.(nextLevel)
    }
  }

  const getDaysAtLevel = (): number => {
    if (!lastAdvancement) return 0
    const daysSince = (Date.now() - lastAdvancement.getTime()) / (1000 * 60 * 60 * 24)
    return Math.floor(daysSince)
  }

  const getProgressColor = (progress: number): string => {
    if (progress >= 0.8) return 'bg-green-500'
    if (progress >= 0.6) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getRequirementStatus = (requirement: string, currentProgress: number): 'completed' | 'in-progress' | 'not-started' => {
    // Simplified logic - in real implementation, this would check specific metrics
    if (currentProgress >= 0.8) return 'completed'
    if (currentProgress >= 0.4) return 'in-progress'
    return 'not-started'
  }

  const renderMilestone = (milestone: string, progress: number, index: number) => {
    const status = getRequirementStatus(milestone, progress)
    
    return (
      <div key={index} className="flex items-center space-x-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          status === 'completed' ? 'bg-green-500 border-green-500' :
          status === 'in-progress' ? 'bg-yellow-500 border-yellow-500' :
          'bg-gray-200 border-gray-300'
        }`}>
          {status === 'completed' && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </div>
        <span className={`text-sm ${
          status === 'completed' ? 'text-green-700 font-medium' :
          status === 'in-progress' ? 'text-yellow-700' :
          'text-gray-600'
        }`}>
          {milestone}
        </span>
      </div>
    )
  }

  if (!showProgression) {
    return (
      <button
        onClick={() => setShowProgression(true)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Show Difficulty Progression
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Difficulty Progression</h3>
        <button
          onClick={() => setShowProgression(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Hide
        </button>
      </div>

      {/* Current Level Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-blue-900">Current Level: {currentLevel}</h4>
          <span className="text-sm text-blue-700">
            {getDaysAtLevel()} days at this level
          </span>
        </div>
        <p className="text-blue-800 text-sm mb-3">{currentLevelInfo.description}</p>
        
        {/* Focus Areas */}
        <div>
          <span className="text-xs font-medium text-blue-800 mb-2 block">Current Focus Areas:</span>
          <div className="flex flex-wrap gap-2">
            {currentLevelInfo.focus.map((focus, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {focus}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Advancement Progress */}
      {nextLevel && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              Progress to {nextLevel}
            </h4>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(readinessForAdvancement * 100)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  getProgressColor(readinessForAdvancement)
                } ${animateProgress ? 'animate-pulse' : ''}`}
                style={{ width: `${readinessForAdvancement * 100}%` }}
              ></div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {readinessForAdvancement >= 0.8 && (
                <span className="text-xs text-white font-semibold">Ready!</span>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Requirements for {nextLevel}:</h5>
            <div className="space-y-2">
              {nextLevelRequirements.map((requirement, index) => 
                renderMilestone(requirement, readinessForAdvancement, index)
              )}
            </div>
          </div>

          {/* Key Skills for Next Level */}
          {nextLevelInfo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">
                Skills to Develop for {nextLevel}:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {nextLevelInfo.requirements.keySkills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advancement Button */}
          {readinessForAdvancement >= 0.8 && nextLevel && (
            <div className="text-center">
              <button
                onClick={handleLevelAdvancement}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Advance to {nextLevel} Level
              </button>
            </div>
          )}
        </div>
      )}

      {/* Difficulty Level Timeline */}
      <div className="border-t border-gray-200 pt-4">
        <h5 className="font-medium text-gray-900 mb-3">Learning Path</h5>
        <div className="flex items-center space-x-2">
          {(['Foundation', 'Practice', 'Mastery', 'Expert'] as DifficultyLevel[]).map((level, index) => (
            <React.Fragment key={level}>
              <div className={`flex items-center space-x-2 ${
                level === currentLevel ? 'bg-blue-100 rounded-lg px-2 py-1' : ''
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  level === currentLevel ? 'bg-blue-500' :
                  index < (['Foundation', 'Practice', 'Mastery', 'Expert'] as DifficultyLevel[]).indexOf(currentLevel) ? 'bg-green-500' :
                  'bg-gray-300'
                }`}></div>
                <span className={`text-xs font-medium ${
                  level === currentLevel ? 'text-blue-800' :
                  index < (['Foundation', 'Practice', 'Mastery', 'Expert'] as DifficultyLevel[]).indexOf(currentLevel) ? 'text-green-700' :
                  'text-gray-500'
                }`}>
                  {level}
                </span>
              </div>
              {index < 3 && (
                <div className={`w-4 h-0.5 ${
                  index < (['Foundation', 'Practice', 'Mastery', 'Expert'] as DifficultyLevel[]).indexOf(currentLevel) ? 'bg-green-500' :
                  'bg-gray-300'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Level Descriptions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">Level Descriptions</h5>
        <div className="space-y-2 text-sm">
          {Object.entries(DIFFICULTY_PROGRESSION).map(([level, info]) => (
            <div key={level} className={`${
              level === currentLevel ? 'text-blue-800 font-medium' : 'text-gray-600'
            }`}>
              <strong>{level}:</strong> {info.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DifficultyProgression