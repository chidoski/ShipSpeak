'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Brain, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Star,
  Clock,
  ChevronRight,
  Play,
  Bookmark
} from 'lucide-react'
import { UserProfile, ModuleCollection, ModuleCategory, PracticeModule } from '@/types/modules'

interface CategoryBrowserProps {
  userProfile: UserProfile
  moduleCollections: ModuleCollection[]
  viewMode?: 'grid' | 'list'
}

const categoryIcons = {
  'Executive Communication': Users,
  'Strategic Thinking': Brain,
  'Industry Expertise': Briefcase,
  'Framework Mastery': Target,
  'Career Transition': TrendingUp
}

const CategoryBrowser: React.FC<CategoryBrowserProps> = ({
  userProfile,
  moduleCollections,
  viewMode = 'grid'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [bookmarkedModules, setBookmarkedModules] = useState<Set<string>>(new Set())

  // Get all unique categories from all collections
  const allCategories = React.useMemo(() => {
    const categoryMap = new Map<string, ModuleCategory>()
    
    moduleCollections.forEach(collection => {
      collection.categories.forEach(category => {
        if (!categoryMap.has(category.name)) {
          categoryMap.set(category.name, category)
        } else {
          // Merge module counts
          const existing = categoryMap.get(category.name)!
          existing.moduleCount += category.moduleCount
        }
      })
    })
    
    return Array.from(categoryMap.values()).sort((a, b) => b.moduleCount - a.moduleCount)
  }, [moduleCollections])

  // Get modules for selected category
  const getModulesForCategory = (categoryName: string): PracticeModule[] => {
    const modules: PracticeModule[] = []
    
    moduleCollections.forEach(collection => {
      collection.modules.forEach(module => {
        if (module.category.name === categoryName) {
          modules.push(module)
        }
      })
    })
    
    return modules.sort((a, b) => {
      // Prioritize modules relevant to user's career goals
      const aRelevant = a.careerImpact.some(impact => 
        impact.transitionType === getTransitionType(userProfile.currentRole, userProfile.targetRole)
      )
      const bRelevant = b.careerImpact.some(impact => 
        impact.transitionType === getTransitionType(userProfile.currentRole, userProfile.targetRole)
      )
      
      if (aRelevant && !bRelevant) return -1
      if (!aRelevant && bRelevant) return 1
      
      // Then by ratings
      return b.ratings.averageRating - a.ratings.averageRating
    })
  }

  const getTransitionType = (currentRole: string, targetRole: string) => {
    if (currentRole === 'Product Owner' && targetRole.includes('Manager')) return 'PO_TO_PM'
    if (currentRole === 'Product Manager' && targetRole === 'Senior PM') return 'PM_TO_SENIOR_PM'
    if (currentRole === 'Senior PM' && targetRole === 'Group PM') return 'SENIOR_PM_TO_GROUP_PM'
    return 'INDUSTRY_TRANSITION'
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

  const getRelevanceForUser = (module: PracticeModule): 'HIGH' | 'MEDIUM' | 'LOW' => {
    // Check career relevance
    const careerRelevant = module.careerImpact.some(impact => 
      impact.transitionType === getTransitionType(userProfile.currentRole, userProfile.targetRole) &&
      impact.impactLevel === 'HIGH'
    )
    
    if (careerRelevant) return 'HIGH'
    
    // Check industry relevance
    const industryRelevant = module.industryRelevance.some(ir => 
      ir.industry === userProfile.industry && ir.relevanceScore > 80
    )
    
    if (industryRelevant) return 'MEDIUM'
    
    return 'LOW'
  }

  const getRelevanceBadgeColor = (relevance: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (relevance) {
      case 'HIGH': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  if (selectedCategory) {
    const categoryModules = getModulesForCategory(selectedCategory)
    
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-600 hover:text-blue-700"
          >
            Categories
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{selectedCategory}</span>
        </div>

        {/* Category Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            {React.createElement(
              categoryIcons[selectedCategory as keyof typeof categoryIcons] || Target,
              { className: "w-8 h-8 text-blue-600 mt-1" }
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{selectedCategory}</h2>
              <p className="text-gray-600 mt-1">
                {allCategories.find(cat => cat.name === selectedCategory)?.description}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="text-sm text-gray-500">
                  {categoryModules.length} modules
                </span>
                <span className="text-sm text-gray-500">
                  Avg. {allCategories.find(cat => cat.name === selectedCategory)?.averageDuration} duration
                </span>
                <span className="text-sm text-gray-500">
                  {allCategories.find(cat => cat.name === selectedCategory)?.skillLevel} level
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
          {categoryModules.map((module) => {
            const relevance = getRelevanceForUser(module)
            const isBookmarked = bookmarkedModules.has(module.id)
            const isCompleted = userProfile.completedModules.includes(module.id)

            return (
              <Card 
                key={module.id} 
                className={`transition-all duration-200 hover:shadow-lg ${
                  relevance === 'HIGH' ? 'border-l-4 border-l-green-500' :
                  relevance === 'MEDIUM' ? 'border-l-4 border-l-yellow-500' :
                  'border-l-4 border-l-gray-300'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-gray-900 leading-tight">
                        {module.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{module.shortDescription}</p>
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
                    <Badge className={`text-xs border ${getRelevanceBadgeColor(relevance)}`}>
                      {relevance === 'HIGH' ? 'Highly Relevant' : 
                       relevance === 'MEDIUM' ? 'Relevant' : 'General'}
                    </Badge>
                    
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {module.ratings.averageRating.toFixed(1)}
                    </Badge>
                    
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {module.estimatedDuration}min
                    </Badge>

                    {isCompleted && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Learning Objectives Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">You'll learn to:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {module.learningObjectives.slice(0, 2).map((objective, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{objective.description}</span>
                          </li>
                        ))}
                        {module.learningObjectives.length > 2 && (
                          <li className="text-sm text-gray-500">
                            +{module.learningObjectives.length - 2} more objectives
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Skills developed:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {module.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{module.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Career Impact */}
                    {relevance === 'HIGH' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-900">High Career Impact</p>
                            <p className="text-sm text-green-700">
                              {module.careerImpact.find(impact => impact.impactLevel === 'HIGH')?.specificBenefits[0] || 
                               'Essential for your career progression'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button 
                      className={`w-full ${
                        isCompleted 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isCompleted ? 'Review Module' : 'Start Module'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {categoryModules.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-500">
                No modules available in this category yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Category Overview
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Browse by Category</h2>
        <p className="text-gray-500">
          Explore modules organized by PM competency areas and career development focus
        </p>
      </div>

      <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
        {allCategories.map((category) => {
          const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Target
          
          return (
            <Card 
              key={category.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-blue-300"
              onClick={() => setSelectedCategory(category.name)}
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{category.moduleCount}</p>
                    <p className="text-sm text-gray-500">Modules</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{category.averageDuration}</p>
                    <p className="text-sm text-gray-500">Avg. Duration</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Skill Level:</span>
                    <Badge variant="outline">{category.skillLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Career Impact:</span>
                    <Badge 
                      className={`text-xs ${
                        category.careerImpact.includes('High') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {category.careerImpact.includes('High') ? 'High Impact' : 'Career Building'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryBrowser