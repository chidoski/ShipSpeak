/**
 * ModuleCard - Reusable module display card
 * PM-specific module preview card for search results and collections
 */

'use client'

import React from 'react'
import { PracticeModule } from '@/types/modules'

interface ModuleCardProps {
  module: PracticeModule
  onSelect: () => void
  variant?: 'default' | 'search' | 'recommendation' | 'collection'
  showProgress?: boolean
}

export function ModuleCard({ 
  module, 
  onSelect, 
  variant = 'default', 
  showProgress = true 
}: ModuleCardProps) {
  const getDifficultyColor = () => {
    switch (module.difficulty) {
      case 'Foundation': return 'bg-green-100 text-green-700 border-green-200'
      case 'Practice': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Mastery': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Expert': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getModuleTypeIcon = () => {
    switch (module.moduleType) {
      case 'COMMUNICATION_PRACTICE': return '💬'
      case 'FRAMEWORK_APPLICATION': return '📋'
      case 'SCENARIO_SIMULATION': return '🎭'
      case 'SKILL_ASSESSMENT': return '📊'
      case 'REAL_WORLD_PROJECT': return '🏗️'
      default: return '📚'
    }
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐')
    }
    if (hasHalfStar) {
      stars.push('⭐')
    }
    while (stars.length < 5) {
      stars.push('☆')
    }
    
    return stars.join('')
  }

  const getIndustryRelevance = () => {
    const topRelevance = module.industryRelevance
      .sort((a, b) => b.relevanceScore - a.relevanceScore)[0]
    return topRelevance
  }

  const getCareerImpact = () => {
    const highImpact = module.careerImpact.find(impact => impact.impactLevel === 'HIGH')
    return highImpact || module.careerImpact[0]
  }

  const industryRelevance = getIndustryRelevance()
  const careerImpact = getCareerImpact()

  return (
    <div 
      className={`module-card bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer ${
        variant === 'recommendation' ? 'ring-2 ring-blue-100' : ''
      }`}
      onClick={onSelect}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-lg">{getModuleTypeIcon()}</span>
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {module.title}
              </h3>
            </div>
            {module.subcategory && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {module.subcategory}
              </span>
            )}
          </div>
          
          <div className="ml-4 flex flex-col items-end space-y-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor()}`}>
              {module.difficulty}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {module.shortDescription || module.description}
        </p>

        {/* Module Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{module.estimatedDuration} min</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>🎯</span>
            <span>{module.category.name}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>📈</span>
            <span>{module.learningObjectives.length} objectives</span>
          </span>
        </div>

        {/* Industry & Career Relevance */}
        {variant === 'search' && industryRelevance && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-blue-900">Industry Relevance</span>
              <span className="text-sm font-bold text-blue-600">{industryRelevance.relevanceScore}%</span>
            </div>
            <p className="text-xs text-blue-800">{industryRelevance.specificContext}</p>
          </div>
        )}

        {variant === 'recommendation' && careerImpact && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-green-900">Career Impact</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                careerImpact.impactLevel === 'HIGH' 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {careerImpact.impactLevel}
              </span>
            </div>
            <p className="text-xs text-green-800">
              {careerImpact.transitionType.replace(/_/g, ' → ')}
            </p>
          </div>
        )}

        {/* Prerequisites */}
        {module.prerequisites.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs font-medium text-gray-700 mb-1">Prerequisites</h5>
            <div className="flex flex-wrap gap-1">
              {module.prerequisites.slice(0, 2).map((prereq) => (
                <span
                  key={prereq}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {prereq}
                </span>
              ))}
              {module.prerequisites.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{module.prerequisites.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && module.completionRate && module.completionRate > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
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

        {/* Rating & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-yellow-500">
              {getRatingStars(module.ratings.averageRating).slice(0, 5)}
            </div>
            <span className="text-xs text-gray-500">
              {module.ratings.averageRating.toFixed(1)} ({module.ratings.totalRatings})
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              module.isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : module.completionRate && module.completionRate > 0
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {module.isCompleted ? 'Review' : module.completionRate && module.completionRate > 0 ? 'Continue' : 'Start'}
          </button>
        </div>

        {/* Tags */}
        {module.tags.length > 0 && variant !== 'collection' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {module.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {module.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{module.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bookmark indicator */}
      {module.isBookmarked && (
        <div className="absolute top-2 right-2">
          <span className="text-yellow-500 text-lg">🔖</span>
        </div>
      )}
    </div>
  )
}