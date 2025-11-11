/**
 * RecommendationFeed - Personalized module recommendations display
 * PM-specific intelligent recommendations with career impact analysis
 */

'use client'

import React, { useState, useMemo } from 'react'
import { UserProfile, ModuleRecommendation, UrgencyLevel } from '@/types/modules'

interface RecommendationFeedProps {
  recommendations: ModuleRecommendation[]
  userProfile: UserProfile
  onModuleSelect: (moduleId: string) => void
}

export function RecommendationFeed({ recommendations, userProfile, onModuleSelect }: RecommendationFeedProps) {
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | 'ALL'>('ALL')
  const [sortBy, setSortBy] = useState<'relevance' | 'urgency' | 'duration'>('relevance')

  const filteredAndSortedRecommendations = useMemo(() => {
    let filtered = recommendations

    // Filter by urgency
    if (selectedUrgency !== 'ALL') {
      filtered = filtered.filter(rec => rec.urgencyLevel === selectedUrgency)
    }

    // Sort recommendations
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore
        case 'urgency':
          const urgencyOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
          return urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel]
        case 'duration':
          return a.module.estimatedDuration - b.module.estimatedDuration
        default:
          return 0
      }
    })

    return sorted
  }, [recommendations, selectedUrgency, sortBy])

  const urgencyCounts = useMemo(() => {
    return recommendations.reduce((counts, rec) => {
      counts[rec.urgencyLevel] = (counts[rec.urgencyLevel] || 0) + 1
      return counts
    }, {} as Record<UrgencyLevel, number>)
  }, [recommendations])

  if (recommendations.length === 0) {
    return <EmptyRecommendationsState userProfile={userProfile} />
  }

  return (
    <div className="recommendation-feed p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personalized Recommendations
        </h2>
        <p className="text-gray-600">
          Modules selected based on your {userProfile.currentRole} to {userProfile.targetRole} transition
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Urgency Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Priority:</span>
              <div className="flex space-x-2">
                <FilterButton
                  active={selectedUrgency === 'ALL'}
                  onClick={() => setSelectedUrgency('ALL')}
                  label="All"
                  count={recommendations.length}
                />
                <FilterButton
                  active={selectedUrgency === 'HIGH'}
                  onClick={() => setSelectedUrgency('HIGH')}
                  label="High"
                  count={urgencyCounts.HIGH || 0}
                  urgency="HIGH"
                />
                <FilterButton
                  active={selectedUrgency === 'MEDIUM'}
                  onClick={() => setSelectedUrgency('MEDIUM')}
                  label="Medium"
                  count={urgencyCounts.MEDIUM || 0}
                  urgency="MEDIUM"
                />
                <FilterButton
                  active={selectedUrgency === 'LOW'}
                  onClick={() => setSelectedUrgency('LOW')}
                  label="Low"
                  count={urgencyCounts.LOW || 0}
                  urgency="LOW"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Relevance</option>
              <option value="urgency">Priority</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredAndSortedRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.module.id}
            recommendation={recommendation}
            onSelect={() => onModuleSelect(recommendation.module.id)}
          />
        ))}
      </div>

      {filteredAndSortedRecommendations.length === 0 && selectedUrgency !== 'ALL' && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">🎯</div>
          <p className="text-gray-600">
            No {selectedUrgency.toLowerCase()} priority recommendations found.
          </p>
        </div>
      )}
    </div>
  )
}

function FilterButton({ 
  active, 
  onClick, 
  label, 
  count, 
  urgency 
}: { 
  active: boolean
  onClick: () => void
  label: string
  count: number
  urgency?: UrgencyLevel
}) {
  const getUrgencyColor = () => {
    switch (urgency) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
        active
          ? urgency ? getUrgencyColor() : 'bg-blue-100 text-blue-700 border-blue-200'
          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
      }`}
    >
      <span>{label}</span>
      <span className="bg-white rounded px-1.5 py-0.5 text-xs">{count}</span>
    </button>
  )
}

function RecommendationCard({ 
  recommendation, 
  onSelect 
}: { 
  recommendation: ModuleRecommendation
  onSelect: () => void
}) {
  const { module, relevanceScore, reasoning, urgencyLevel, careerImpact, timeToCompletion } = recommendation

  const getUrgencyBadge = () => {
    const colors = {
      HIGH: 'bg-red-100 text-red-800 border-red-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-green-100 text-green-800 border-green-200'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[urgencyLevel]}`}>
        {urgencyLevel} Priority
      </span>
    )
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
              {getUrgencyBadge()}
            </div>
            <p className="text-gray-600 mb-2">{module.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>⏱️ {module.estimatedDuration} min</span>
              <span>📊 {module.difficulty}</span>
              <span>🎯 {module.category.name}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className={`text-2xl font-bold ${getRelevanceColor(relevanceScore)}`}>
              {relevanceScore}%
            </div>
            <span className="text-xs text-gray-500">Relevance</span>
          </div>
        </div>

        {/* Why Recommended */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Why this is recommended:</h4>
          <p className="text-sm text-blue-800">{reasoning}</p>
        </div>

        {/* Career Impact & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Career Impact</h4>
            <p className="text-sm text-gray-600">{careerImpact}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Suggested Timeline</h4>
            <p className="text-sm text-gray-600">{timeToCompletion}</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onSelect}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Start Module
        </button>
      </div>
    </div>
  )
}

function EmptyRecommendationsState({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎯</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Building Your Personalized Recommendations
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We're analyzing your {userProfile.currentRole} profile and career goals to create 
        targeted module recommendations for your {userProfile.targetRole} transition.
      </p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Complete Career Assessment
      </button>
    </div>
  )
}