'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Star, 
  Play, 
  Bookmark,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { UserProfile, RecommendationEngine, ModuleRecommendation, UrgencyLevel } from '@/types/modules'

interface RecommendationFeedProps {
  userProfile: UserProfile
  recommendationEngine: RecommendationEngine
  viewMode?: 'grid' | 'list'
  maxRecommendations?: number
}

const urgencyConfig = {
  HIGH: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle,
    label: 'High Priority'
  },
  MEDIUM: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'Medium Priority'
  },
  LOW: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Low Priority'
  }
}

const RecommendationFeed: React.FC<RecommendationFeedProps> = ({
  userProfile,
  recommendationEngine,
  viewMode = 'grid',
  maxRecommendations = 8
}) => {
  const [recommendations, setRecommendations] = useState<ModuleRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [bookmarkedModules, setBookmarkedModules] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Simulate loading recommendations
    const timer = setTimeout(() => {
      const sortedRecommendations = recommendationEngine.personalizedRecommendations
        .sort((a, b) => {
          // Sort by urgency first, then by relevance score
          const urgencyOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
          const urgencyDiff = urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel]
          return urgencyDiff !== 0 ? urgencyDiff : b.relevanceScore - a.relevanceScore
        })
        .slice(0, maxRecommendations)
      
      setRecommendations(sortedRecommendations)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [recommendationEngine, maxRecommendations])

  const toggleExpanded = (moduleId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedCards(newExpanded)
  }

  const toggleBookmark = (moduleId: string) => {
    const newBookmarked = new Set(bookmarkedModules)
    if (newBookmarked.has(moduleId)) {
      newBookmarked.delete(moduleId)
    } else {
      newBookmarked.add(moduleId)
    }
    setBookmarkedModules(newBookmarked)
  }

  const getRelevanceColor = (score: number): string => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getCompletionUrgencyColor = (urgency: UrgencyLevel): string => {
    const colors = {
      HIGH: 'text-red-600',
      MEDIUM: 'text-yellow-600',
      LOW: 'text-green-600'
    }
    return colors[urgency]
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Generating personalized recommendations...</p>
        </div>
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations available</h3>
          <p className="text-gray-500 mb-4">
            Complete your skill assessment to receive personalized module recommendations.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Complete Assessment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Personalized for You</h2>
          <p className="text-gray-500">
            {recommendations.length} modules curated based on your career goals and skill gaps
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full border border-red-200"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full border border-yellow-200"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full border border-green-200"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
        {recommendations.map((recommendation) => {
          const { module } = recommendation
          const urgencySettings = urgencyConfig[recommendation.urgencyLevel]
          const isExpanded = expandedCards.has(module.id)
          const isBookmarked = bookmarkedModules.has(module.id)
          const UrgencyIcon = urgencySettings.icon

          return (
            <Card 
              key={module.id} 
              className={`transition-all duration-200 hover:shadow-lg border-l-4 ${
                recommendation.urgencyLevel === 'HIGH' ? 'border-l-red-500' :
                recommendation.urgencyLevel === 'MEDIUM' ? 'border-l-yellow-500' :
                'border-l-green-500'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                      {module.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{module.category.name}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(module.id)}
                    className="p-1 h-8 w-8"
                  >
                    <Bookmark 
                      className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400'}`} 
                    />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`text-xs ${urgencySettings.color} border`}>
                    <UrgencyIcon className="w-3 h-3 mr-1" />
                    {urgencySettings.label}
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {recommendation.relevanceScore}% match
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {module.estimatedDuration}min
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Recommendation Reasoning */}
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {recommendation.reasoning}
                    </p>
                  </div>

                  {/* Career Impact */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Career Impact</p>
                        <p className="text-sm text-blue-700">{recommendation.careerImpact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Completion Timeline */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Timeline:</span>
                    <span className={`font-medium ${getCompletionUrgencyColor(recommendation.urgencyLevel)}`}>
                      {recommendation.timeToCompletion}
                    </span>
                  </div>

                  {/* Skill Gaps Addressed */}
                  {recommendation.skillGaps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Addresses skill gaps:</p>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.skillGaps.map((gap) => (
                          <Badge key={gap} variant="secondary" className="text-xs">
                            {gap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Expected Outcome:</p>
                        <p className="text-sm text-gray-600">{recommendation.expectedOutcome}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Learning Objectives:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {module.learningObjectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{objective.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {recommendation.prerequisites.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Prerequisites:</p>
                          <div className="space-y-1">
                            {recommendation.prerequisites.map((prereq, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className={`w-3 h-3 ${prereq.met ? 'text-green-500' : 'text-gray-400'}`} />
                                <span className={prereq.met ? 'text-gray-600' : 'text-gray-500'}>
                                  {prereq.requirement}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Module
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(module.id)}
                      className="px-3"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      {recommendations.length >= maxRecommendations && (
        <div className="text-center">
          <Button variant="outline" className="px-8">
            Load More Recommendations
          </Button>
        </div>
      )}
    </div>
  )
}

export default RecommendationFeed