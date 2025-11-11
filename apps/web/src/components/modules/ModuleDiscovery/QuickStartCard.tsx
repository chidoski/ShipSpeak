/**
 * QuickStartCard - Quick access recommendation cards
 * PM-specific module recommendations for immediate engagement
 */

'use client'

import React from 'react'
import { ModuleRecommendation } from '@/types/modules'

interface QuickStartCardProps {
  recommendation: ModuleRecommendation
  onSelect: (moduleId: string) => void
}

export function QuickStartCard({ recommendation, onSelect }: QuickStartCardProps) {
  const { module, relevanceScore, urgencyLevel, careerImpact, timeToCompletion, reasoning } = recommendation

  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case 'HIGH':
        return 'border-red-500 bg-red-50'
      case 'MEDIUM':
        return 'border-yellow-500 bg-yellow-50'
      case 'LOW':
        return 'border-green-500 bg-green-50'
      default:
        return 'border-blue-500 bg-blue-50'
    }
  }

  const getRelevanceColor = () => {
    if (relevanceScore >= 90) return 'text-green-600'
    if (relevanceScore >= 75) return 'text-blue-600'
    if (relevanceScore >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getDifficultyIcon = () => {
    switch (module.difficulty) {
      case 'Foundation': return '🌱'
      case 'Practice': return '💪'
      case 'Mastery': return '🎯'
      case 'Expert': return '🏆'
      default: return '📚'
    }
  }

  return (
    <div className={`quick-start-card bg-white rounded-lg border-2 hover:shadow-lg transition-all duration-200 cursor-pointer ${getUrgencyColor()}`}>
      <div className="p-6">
        {/* Header with relevance score */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-6">
                {module.title}
              </h3>
              <span className="text-lg">{getDifficultyIcon()}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {module.shortDescription || module.description}
            </p>
          </div>
          <div className="ml-4 text-right">
            <div className={`text-2xl font-bold ${getRelevanceColor()}`}>
              {relevanceScore}%
            </div>
            <div className="text-xs text-gray-500">Match</div>
          </div>
        </div>

        {/* Module details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{module.estimatedDuration} min</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>🎯</span>
            <span>{module.category.name}</span>
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            urgencyLevel === 'HIGH'
              ? 'bg-red-100 text-red-700'
              : urgencyLevel === 'MEDIUM'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {urgencyLevel}
          </span>
        </div>

        {/* Why recommended */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Why this module:</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{reasoning}</p>
        </div>

        {/* Career impact */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Career Impact:</h4>
          <p className="text-sm text-gray-600 line-clamp-1">{careerImpact}</p>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Suggested Timeline:</h4>
          <p className="text-sm text-gray-600">{timeToCompletion}</p>
        </div>

        {/* Action button */}
        <button
          onClick={() => onSelect(module.id)}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            urgencyLevel === 'HIGH'
              ? 'bg-red-600 hover:bg-red-700'
              : urgencyLevel === 'MEDIUM'
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Start Module
        </button>
      </div>

      {/* Progress indicator if started */}
      {module.completionRate && module.completionRate > 0 && (
        <div className="px-6 pb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(module.completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${module.completionRate}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}