'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Search, 
  Target, 
  TrendingUp, 
  Filter,
  Grid,
  List,
  Star
} from 'lucide-react'
import { UserProfile, ModuleCollection, RecommendationEngine, ModuleSearchFilters, PracticeModule } from '@/types/modules'
import CategoryBrowser from './ModuleDiscovery/CategoryBrowser'
import SearchInterface from './ModuleDiscovery/SearchInterface'
import RecommendationFeed from './ModuleDiscovery/RecommendationFeed'
import LearningPathViewer from './ModuleDiscovery/LearningPathViewer'
import { mockUserProfile, mockModuleCollections, mockRecommendationEngine } from '@/lib/mockModuleData'

interface LibraryOrchestratorProps {
  userProfile?: UserProfile
  className?: string
}

type LibraryView = 'discover' | 'browse' | 'recommendations' | 'learning-paths' | 'my-modules'

interface ViewConfig {
  id: LibraryView
  label: string
  icon: React.ReactNode
  description: string
}

const viewConfigs: ViewConfig[] = [
  {
    id: 'discover',
    label: 'Discover',
    icon: <Search className="w-4 h-4" />,
    description: 'Find new modules with smart search and filtering'
  },
  {
    id: 'browse',
    label: 'Browse',
    icon: <Grid className="w-4 h-4" />,
    description: 'Explore modules by category and career path'
  },
  {
    id: 'recommendations',
    label: 'For You',
    icon: <Target className="w-4 h-4" />,
    description: 'Personalized recommendations based on your goals'
  },
  {
    id: 'learning-paths',
    label: 'Learning Paths',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Structured career progression pathways'
  },
  {
    id: 'my-modules',
    label: 'My Library',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'Your saved and completed modules'
  }
]

const LibraryOrchestrator: React.FC<LibraryOrchestratorProps> = ({
  userProfile = mockUserProfile,
  className = ''
}) => {
  const [currentView, setCurrentView] = useState<LibraryView>('recommendations')
  const [moduleCollections] = useState<ModuleCollection[]>(mockModuleCollections)
  const [recommendationEngine] = useState<RecommendationEngine>(mockRecommendationEngine)
  const [searchFilters, setSearchFilters] = useState<ModuleSearchFilters>({
    categories: [],
    difficulties: [],
    industries: [],
    careerTransitions: [],
    duration: {},
    skills: [],
    moduleTypes: [],
    ratings: { min: 0 }
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(false)

  // Get all available modules across collections
  const allModules = useMemo(() => {
    return moduleCollections.flatMap(collection => collection.modules)
  }, [moduleCollections])

  // Get user's bookmarked/saved modules
  const savedModules = useMemo(() => {
    return allModules.filter(module => 
      userProfile.completedModules.includes(module.id) || 
      module.ratings.userReviews.some(review => review.userId === userProfile.id)
    )
  }, [allModules, userProfile])

  // Handle view changes with loading simulation
  const handleViewChange = (viewId: LibraryView) => {
    if (viewId === currentView) return
    
    setIsLoading(true)
    
    // Simulate loading for realistic UX
    setTimeout(() => {
      setCurrentView(viewId)
      setIsLoading(false)
    }, 300)
  }

  // Reset filters when changing views
  useEffect(() => {
    if (currentView === 'recommendations' || currentView === 'learning-paths') {
      setSearchFilters({
        categories: [],
        difficulties: [],
        industries: [],
        careerTransitions: [],
        duration: {},
        skills: [],
        moduleTypes: [],
        ratings: { min: 0 }
      })
    }
  }, [currentView])

  // Render view content based on current selection
  const renderViewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading modules...</p>
          </div>
        </div>
      )
    }

    switch (currentView) {
      case 'discover':
        return (
          <SearchInterface
            userProfile={userProfile}
            modules={allModules}
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            viewMode={viewMode}
          />
        )

      case 'browse':
        return (
          <CategoryBrowser
            userProfile={userProfile}
            moduleCollections={moduleCollections}
            viewMode={viewMode}
          />
        )

      case 'recommendations':
        return (
          <RecommendationFeed
            userProfile={userProfile}
            recommendationEngine={recommendationEngine}
            viewMode={viewMode}
          />
        )

      case 'learning-paths':
        return (
          <LearningPathViewer
            userProfile={userProfile}
            moduleCollections={moduleCollections}
            viewMode={viewMode}
          />
        )

      case 'my-modules':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{userProfile.completedModules.length}</p>
                      <p className="text-sm text-gray-500">Completed Modules</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{savedModules.length}</p>
                      <p className="text-sm text-gray-500">Saved Modules</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(userProfile.skillAssessment.overallScore)}%
                      </p>
                      <p className="text-sm text-gray-500">Skill Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              {userProfile.completedModules.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed modules yet</h3>
                    <p className="text-gray-500 mb-4">
                      Start with personalized recommendations to begin your learning journey.
                    </p>
                    <Button 
                      onClick={() => handleViewChange('recommendations')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Explore Recommendations
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {savedModules.slice(0, 5).map((module) => (
                    <Card key={module.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-500">{module.category.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">Completed</p>
                            <p className="text-xs text-gray-500">{module.estimatedDuration} min</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module Library</h1>
            <p className="text-gray-500">
              Accelerate your PM career with personalized learning modules
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
              aria-label="Grid view"
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
              aria-label="List view"
              title="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Navigation */}
        <div className="flex flex-wrap gap-2">
          {viewConfigs.map((config) => (
            <Button
              key={config.id}
              variant={currentView === config.id ? 'default' : 'outline'}
              onClick={() => handleViewChange(config.id)}
              className="flex items-center space-x-2"
            >
              {config.icon}
              <span>{config.label}</span>
            </Button>
          ))}
        </div>

        {/* View Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            {viewConfigs.find(config => config.id === currentView)?.description}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {renderViewContent()}
      </div>
    </div>
  )
}

export default LibraryOrchestrator