/**
 * LibraryOrchestrator - Core module library management system
 * PM-specific learning module navigation and state management
 */

'use client'

import React, { useState, useEffect } from 'react'
import { UserProfile, LearningPath, RecommendationEngine, ModuleCollection } from '@/types/modules'
import { ModuleDiscovery } from './ModuleDiscovery'
import { RecommendationFeed } from './ModuleDiscovery/RecommendationFeed'
import { LearningPathViewer } from './ModuleDiscovery/LearningPathViewer'
import { CategoryBrowser } from './ModuleDiscovery/CategoryBrowser'
import { SearchInterface } from './ModuleDiscovery/SearchInterface'
import { ModuleInterface } from './ModuleInterface'
import { PersonalizationEngine } from './PersonalizationEngine'
import { ModuleCollections } from './ModuleCollection'

interface LibraryOrchestratorProps {
  userProfile: UserProfile
  className?: string
}

type ViewMode = 'discovery' | 'recommendations' | 'learning_paths' | 'categories' | 'search' | 'collections' | 'personalization'

export function LibraryOrchestrator({ userProfile, className = '' }: LibraryOrchestratorProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('discovery')
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock recommendation engine (would be API-driven in production)
  const [recommendationEngine, setRecommendationEngine] = useState<RecommendationEngine | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [moduleCollections, setModuleCollections] = useState<ModuleCollection[]>([])

  useEffect(() => {
    initializeLibrary()
  }, [userProfile])

  const initializeLibrary = async () => {
    setIsLoading(true)
    try {
      // Initialize recommendation engine based on user profile
      const engine = await generateRecommendationEngine(userProfile)
      setRecommendationEngine(engine)
      
      // Load learning paths for user's career transition
      const paths = await loadLearningPaths(userProfile.targetRole, userProfile.industry)
      setLearningPaths(paths)
      
      // Load relevant module collections
      const collections = await loadModuleCollections(userProfile.careerTransition)
      setModuleCollections(collections)
    } catch (error) {
      console.error('Failed to initialize module library:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view)
    setSelectedModule(null)
  }

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setCurrentView('search')
    }
  }

  const renderActiveView = () => {
    if (isLoading) {
      return <LibraryLoadingState />
    }

    switch (currentView) {
      case 'discovery':
        return (
          <ModuleDiscovery
            userProfile={userProfile}
            recommendationEngine={recommendationEngine}
            onModuleSelect={handleModuleSelect}
            onViewChange={handleViewChange}
          />
        )
      
      case 'recommendations':
        return recommendationEngine ? (
          <RecommendationFeed
            recommendations={recommendationEngine.personalizedRecommendations}
            userProfile={userProfile}
            onModuleSelect={handleModuleSelect}
          />
        ) : <EmptyRecommendationsState />
      
      case 'learning_paths':
        return (
          <LearningPathViewer
            learningPaths={learningPaths}
            userProfile={userProfile}
            onPathSelect={(pathId) => console.log('Path selected:', pathId)}
            onModuleSelect={handleModuleSelect}
          />
        )
      
      case 'categories':
        return (
          <CategoryBrowser
            userProfile={userProfile}
            onCategorySelect={(categoryId) => console.log('Category selected:', categoryId)}
            onModuleSelect={handleModuleSelect}
          />
        )
      
      case 'search':
        return (
          <SearchInterface
            searchQuery={searchQuery}
            userProfile={userProfile}
            onModuleSelect={handleModuleSelect}
            onResultsChange={(count) => console.log('Search results:', count)}
          />
        )
      
      case 'collections':
        return (
          <ModuleCollections
            collections={moduleCollections}
            userProfile={userProfile}
            onModuleSelect={handleModuleSelect}
          />
        )
      
      case 'personalization':
        return recommendationEngine ? (
          <PersonalizationEngine
            userProfile={userProfile}
            recommendationEngine={recommendationEngine}
            onProfileUpdate={(updates) => console.log('Profile updates:', updates)}
          />
        ) : <EmptyPersonalizationState />
      
      default:
        return <ModuleDiscovery userProfile={userProfile} onModuleSelect={handleModuleSelect} />
    }
  }

  return (
    <div className={`module-library-orchestrator ${className}`}>
      {/* Navigation Header */}
      <div className="library-header bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">Learning Library</h1>
            <LibraryNavigation
              currentView={currentView}
              onViewChange={handleViewChange}
              recommendationCount={recommendationEngine?.personalizedRecommendations.length || 0}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <LibrarySearch onSearch={handleSearch} />
            <ProfileQuickView userProfile={userProfile} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="library-content flex-1 min-h-0">
        {renderActiveView()}
      </div>

      {/* Module Detail Panel */}
      {selectedModule && (
        <ModuleInterface
          moduleId={selectedModule}
          userProfile={userProfile}
          onClose={() => setSelectedModule(null)}
          onModuleAction={(action, moduleId) => console.log('Module action:', action, moduleId)}
        />
      )}
    </div>
  )
}

// Navigation Component
function LibraryNavigation({ 
  currentView, 
  onViewChange, 
  recommendationCount 
}: {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  recommendationCount: number
}) {
  const navItems = [
    { id: 'discovery' as ViewMode, label: 'Discovery', icon: '🎯' },
    { id: 'recommendations' as ViewMode, label: 'Recommended', icon: '⭐', badge: recommendationCount },
    { id: 'learning_paths' as ViewMode, label: 'Learning Paths', icon: '🛤️' },
    { id: 'categories' as ViewMode, label: 'Categories', icon: '📚' },
    { id: 'collections' as ViewMode, label: 'Collections', icon: '📦' }
  ]

  return (
    <nav className="flex space-x-6">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === item.id
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
          {item.badge && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

// Search Component
function LibrarySearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search modules..."
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
      </div>
    </form>
  )
}

// Profile Quick View
function ProfileQuickView({ userProfile }: { userProfile: UserProfile }) {
  const progressPercentage = Math.round(
    (userProfile.completedModules.length / 100) * 100
  )

  return (
    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
        {userProfile.name.charAt(0)}
      </div>
      <div className="text-sm">
        <div className="font-medium text-gray-900">{userProfile.name}</div>
        <div className="text-gray-500">{progressPercentage}% Complete</div>
      </div>
    </div>
  )
}

// Loading States
function LibraryLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your personalized library...</p>
      </div>
    </div>
  )
}

function EmptyRecommendationsState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendations Loading</h3>
        <p className="text-gray-600">We're analyzing your profile to create personalized recommendations.</p>
      </div>
    </div>
  )
}

function EmptyPersonalizationState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Personalization Loading</h3>
        <p className="text-gray-600">Setting up your personalized learning engine...</p>
      </div>
    </div>
  )
}

// Mock API functions (would be replaced with real API calls)
async function generateRecommendationEngine(userProfile: UserProfile): Promise<RecommendationEngine> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock recommendation engine based on user profile
  return {
    userProgressAnalysis: {
      completedModules: userProfile.completedModules.length,
      totalAvailableModules: 150,
      skillProgression: [],
      careerReadiness: {
        currentRole: userProfile.currentRole,
        targetRole: userProfile.targetRole,
        readinessScore: 67,
        readyAreas: ['Technical Communication', 'Framework Application'],
        developmentAreas: ['Executive Presence', 'Strategic Thinking'],
        timeToReadiness: '3-4 months',
        nextMilestones: ['Complete 5 Executive Communication modules', 'Practice board presentation']
      },
      recentActivity: [],
      learningVelocity: 2.3,
      strongAreas: ['Technical Communication'],
      improvementAreas: ['Executive Presence', 'Strategic Communication']
    },
    skillGapIdentification: [],
    careerGoalAlignment: {
      targetRole: userProfile.targetRole,
      targetIndustry: userProfile.industry,
      timeframe: '6 months',
      alignmentScore: 78,
      keyFocusAreas: ['Executive Communication', 'Strategic Thinking'],
      missingSkills: ['Board Presentation', 'Financial Communication'],
      strengthAreas: ['Technical Knowledge', 'Team Leadership']
    },
    personalizedRecommendations: []
  }
}

async function loadLearningPaths(targetRole: string, industry: string): Promise<LearningPath[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
    {
      id: 'pm-to-senior-pm',
      name: 'PM → Senior PM: Executive Readiness',
      description: 'Complete development path for PM to Senior PM transition',
      estimatedDuration: '6-8 weeks',
      moduleCount: 12,
      targetTransition: 'PM_TO_SENIOR_PM',
      modules: [],
      milestones: [],
      progressTracking: 'Module completion + skill assessment + meeting application',
      createdAt: new Date(),
      customizable: true
    }
  ]
}

async function loadModuleCollections(careerTransition: string): Promise<ModuleCollection[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return []
}