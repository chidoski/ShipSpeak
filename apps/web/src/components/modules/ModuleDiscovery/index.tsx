/**
 * ModuleDiscovery - Main module discovery interface
 * PM-specific learning module exploration with intelligent recommendations
 */

'use client'

import React, { useState, useEffect } from 'react'
import { UserProfile, RecommendationEngine, PracticeModule, ModuleRecommendation } from '@/types/modules'
import { RecommendationFeed } from './RecommendationFeed'
import { QuickStartCard } from './QuickStartCard'
import { ProgressOverview } from './ProgressOverview'
import { TrendingModules } from './TrendingModules'

interface ModuleDiscoveryProps {
  userProfile: UserProfile
  recommendationEngine?: RecommendationEngine | null
  onModuleSelect: (moduleId: string) => void
  onViewChange?: (view: string) => void
}

export function ModuleDiscovery({ 
  userProfile, 
  recommendationEngine, 
  onModuleSelect, 
  onViewChange 
}: ModuleDiscoveryProps) {
  const [topRecommendations, setTopRecommendations] = useState<ModuleRecommendation[]>([])
  const [trendingModules, setTrendingModules] = useState<PracticeModule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDiscoveryData()
  }, [userProfile, recommendationEngine])

  const loadDiscoveryData = async () => {
    setIsLoading(true)
    try {
      // Load top 3 recommendations for quick access
      if (recommendationEngine?.personalizedRecommendations) {
        const top3 = recommendationEngine.personalizedRecommendations
          .slice(0, 3)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
        setTopRecommendations(top3)
      }

      // Load trending modules based on user's industry and career stage
      const trending = await loadTrendingModules(userProfile.industry, userProfile.currentRole)
      setTrendingModules(trending)
    } catch (error) {
      console.error('Failed to load discovery data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <DiscoveryLoadingState />
  }

  const hasRecommendations = topRecommendations.length > 0
  const progressAnalysis = recommendationEngine?.userProgressAnalysis

  return (
    <div className="module-discovery p-6 space-y-8">
      {/* Welcome Header */}
      <div className="welcome-section">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userProfile.name.split(' ')[0]}! 👋
        </h2>
        <p className="text-lg text-gray-600">
          Continue your journey from {userProfile.currentRole} to {userProfile.targetRole}
        </p>
      </div>

      {/* Quick Start Section */}
      <div className="quick-start-section">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Quick Start</h3>
          {hasRecommendations && (
            <button
              onClick={() => onViewChange?.('recommendations')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all recommendations →
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasRecommendations ? (
            topRecommendations.map((recommendation) => (
              <QuickStartCard
                key={recommendation.module.id}
                recommendation={recommendation}
                onSelect={onModuleSelect}
              />
            ))
          ) : (
            <EmptyRecommendationsCard userProfile={userProfile} />
          )}
        </div>
      </div>

      {/* Progress Overview */}
      {progressAnalysis && (
        <div className="progress-section">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Progress</h3>
          <ProgressOverview 
            progressAnalysis={progressAnalysis} 
            userProfile={userProfile}
            onViewDetails={() => onViewChange?.('personalization')}
          />
        </div>
      )}

      {/* Trending in Your Field */}
      <div className="trending-section">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Trending in {userProfile.industry}
        </h3>
        <TrendingModules
          modules={trendingModules}
          userProfile={userProfile}
          onModuleSelect={onModuleSelect}
        />
      </div>

      {/* Explore More Section */}
      <div className="explore-section">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Explore More</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ExploreCard
            title="Learning Paths"
            description="Structured roadmaps for your career transition"
            icon="🛤️"
            onClick={() => onViewChange?.('learning_paths')}
          />
          <ExploreCard
            title="Browse Categories"
            description="Explore modules by skill area and competency"
            icon="📚"
            onClick={() => onViewChange?.('categories')}
          />
          <ExploreCard
            title="Module Collections"
            description="Curated sets of modules for specific goals"
            icon="📦"
            onClick={() => onViewChange?.('collections')}
          />
          <ExploreCard
            title="My Bookmarks"
            description="Modules you've saved for later"
            icon="🔖"
            onClick={() => console.log('Navigate to bookmarks')}
          />
        </div>
      </div>
    </div>
  )
}

function DiscoveryLoadingState() {
  return (
    <div className="module-discovery p-6">
      <div className="animate-pulse space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Quick Start Cards */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

function EmptyRecommendationsCard({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="text-center">
        <div className="text-4xl mb-3">🎯</div>
        <h4 className="font-semibold text-gray-900 mb-2">Getting Your Recommendations</h4>
        <p className="text-sm text-gray-600 mb-4">
          We're analyzing your {userProfile.currentRole} profile to create personalized module recommendations.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Complete Profile Assessment
        </button>
      </div>
    </div>
  )
}

function ExploreCard({ 
  title, 
  description, 
  icon, 
  onClick 
}: { 
  title: string
  description: string
  icon: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  )
}

// Mock API function
async function loadTrendingModules(industry: string, currentRole: string): Promise<PracticeModule[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return []
}