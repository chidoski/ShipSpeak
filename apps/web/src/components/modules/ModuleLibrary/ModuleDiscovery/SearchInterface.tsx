'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock, 
  TrendingUp,
  Play,
  Bookmark,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react'
import { 
  UserProfile, 
  PracticeModule, 
  ModuleSearchFilters, 
  DifficultyLevel, 
  Industry, 
  PMTransitionType,
  ModuleType
} from '@/types/modules'

interface SearchInterfaceProps {
  userProfile: UserProfile
  modules: PracticeModule[]
  filters: ModuleSearchFilters
  onFiltersChange: (filters: ModuleSearchFilters) => void
  viewMode?: 'grid' | 'list'
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  userProfile,
  modules,
  filters,
  onFiltersChange,
  viewMode = 'grid'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'duration' | 'difficulty'>('relevance')
  const [bookmarkedModules, setBookmarkedModules] = useState<Set<string>>(new Set())

  // Available filter options
  const filterOptions = {
    difficulties: ['Foundation', 'Practice', 'Mastery', 'Expert'] as DifficultyLevel[],
    industries: [
      'Healthcare & Life Sciences',
      'Cybersecurity & Enterprise Security', 
      'Financial Services & Fintech',
      'Enterprise Software & B2B',
      'Consumer Technology & Apps'
    ] as Industry[],
    careerTransitions: [
      'PO_TO_PM',
      'PM_TO_SENIOR_PM', 
      'SENIOR_PM_TO_GROUP_PM',
      'GROUP_PM_TO_DIRECTOR',
      'INDUSTRY_TRANSITION'
    ] as PMTransitionType[],
    moduleTypes: [
      'COMMUNICATION_PRACTICE',
      'FRAMEWORK_APPLICATION',
      'SCENARIO_SIMULATION',
      'SKILL_ASSESSMENT',
      'REAL_WORLD_PROJECT'
    ] as ModuleType[]
  }

  // Get unique categories from modules
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>()
    modules.forEach(module => categories.add(module.category.name))
    return Array.from(categories).sort()
  }, [modules])

  // Filter and search modules
  const filteredModules = useMemo(() => {
    let filtered = modules

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.shortDescription.toLowerCase().includes(query) ||
        module.skills.some(skill => skill.name.toLowerCase().includes(query)) ||
        module.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(module =>
        filters.categories.includes(module.category.name)
      )
    }

    // Difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(module =>
        filters.difficulties.includes(module.difficulty)
      )
    }

    // Industry filter
    if (filters.industries.length > 0) {
      filtered = filtered.filter(module =>
        module.industryRelevance.some(ir => 
          filters.industries.includes(ir.industry)
        )
      )
    }

    // Career transition filter
    if (filters.careerTransitions.length > 0) {
      filtered = filtered.filter(module =>
        module.careerImpact.some(impact =>
          filters.careerTransitions.includes(impact.transitionType)
        )
      )
    }

    // Module type filter
    if (filters.moduleTypes.length > 0) {
      filtered = filtered.filter(module =>
        filters.moduleTypes.includes(module.moduleType)
      )
    }

    // Duration filter
    if (filters.duration.min !== undefined || filters.duration.max !== undefined) {
      filtered = filtered.filter(module => {
        if (filters.duration.min !== undefined && module.estimatedDuration < filters.duration.min) return false
        if (filters.duration.max !== undefined && module.estimatedDuration > filters.duration.max) return false
        return true
      })
    }

    // Rating filter
    if (filters.ratings.min > 0) {
      filtered = filtered.filter(module =>
        module.ratings.averageRating >= filters.ratings.min
      )
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.ratings.averageRating - a.ratings.averageRating
        case 'duration':
          return a.estimatedDuration - b.estimatedDuration
        case 'difficulty':
          const difficultyOrder = { Foundation: 1, Practice: 2, Mastery: 3, Expert: 4 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'relevance':
        default:
          // Calculate relevance based on user profile
          const aRelevance = calculateRelevance(a, userProfile)
          const bRelevance = calculateRelevance(b, userProfile)
          return bRelevance - aRelevance
      }
    })

    return filtered
  }, [modules, searchQuery, filters, sortBy, userProfile])

  // Calculate module relevance for user
  const calculateRelevance = (module: PracticeModule, user: UserProfile): number => {
    let score = 0
    
    // Industry relevance
    const industryMatch = module.industryRelevance.find(ir => ir.industry === user.industry)
    if (industryMatch) score += industryMatch.relevanceScore * 0.3

    // Career transition relevance
    const transitionType = getTransitionType(user.currentRole, user.targetRole)
    const careerMatch = module.careerImpact.find(impact => impact.transitionType === transitionType)
    if (careerMatch) {
      score += careerMatch.impactLevel === 'HIGH' ? 30 : careerMatch.impactLevel === 'MEDIUM' ? 20 : 10
    }

    // Skill gap relevance
    const userSkills = user.skillAssessment.skills
    module.skills.forEach(moduleSkill => {
      const userSkill = userSkills.find(us => us.skill.id === moduleSkill.id)
      if (userSkill && userSkill.level < 4.0) {
        score += (4.0 - userSkill.level) * 10
      }
    })

    return score
  }

  const getTransitionType = (currentRole: string, targetRole: string): PMTransitionType => {
    if (currentRole === 'Product Owner' && targetRole.includes('Manager')) return 'PO_TO_PM'
    if (currentRole === 'Product Manager' && targetRole === 'Senior PM') return 'PM_TO_SENIOR_PM'
    if (currentRole === 'Senior PM' && targetRole === 'Group PM') return 'SENIOR_PM_TO_GROUP_PM'
    return 'INDUSTRY_TRANSITION'
  }

  const toggleFilter = (filterType: keyof ModuleSearchFilters, value: any) => {
    const newFilters = { ...filters }
    
    if (Array.isArray(newFilters[filterType])) {
      const currentArray = newFilters[filterType] as any[]
      if (currentArray.includes(value)) {
        newFilters[filterType] = currentArray.filter(item => item !== value) as any
      } else {
        newFilters[filterType] = [...currentArray, value] as any
      }
    }
    
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      difficulties: [],
      industries: [],
      careerTransitions: [],
      duration: {},
      skills: [],
      moduleTypes: [],
      ratings: { min: 0 }
    })
    setSearchQuery('')
  }

  const getActiveFilterCount = () => {
    return filters.categories.length +
           filters.difficulties.length +
           filters.industries.length +
           filters.careerTransitions.length +
           filters.moduleTypes.length +
           (filters.duration.min || filters.duration.max ? 1 : 0) +
           (filters.ratings.min > 0 ? 1 : 0)
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

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search modules by title, skills, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Sort and Results Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {filteredModules.length} modules found
            </span>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          </div>

          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Categories</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uniqueCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleFilter('categories', category)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
                <div className="space-y-2">
                  {filterOptions.difficulties.map((difficulty) => (
                    <label key={difficulty} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.difficulties.includes(difficulty)}
                        onChange={() => toggleFilter('difficulties', difficulty)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Industry</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.industries.map((industry) => (
                    <label key={industry} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.industries.includes(industry)}
                        onChange={() => toggleFilter('industries', industry)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-xs">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Module Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Module Type</label>
                <div className="space-y-2">
                  {filterOptions.moduleTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.moduleTypes.includes(type)}
                        onChange={() => toggleFilter('moduleTypes', type)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{type.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Duration (minutes)</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.duration.min || ''}
                      onChange={(e) => onFiltersChange({
                        ...filters,
                        duration: { ...filters.duration, min: e.target.value ? parseInt(e.target.value) : undefined }
                      })}
                      className="w-20 text-sm"
                    />
                    <span className="text-gray-400">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.duration.max || ''}
                      onChange={(e) => onFiltersChange({
                        ...filters,
                        duration: { ...filters.duration, max: e.target.value ? parseInt(e.target.value) : undefined }
                      })}
                      className="w-20 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.ratings.min === rating}
                        onChange={() => onFiltersChange({
                          ...filters,
                          ratings: { ...filters.ratings, min: rating }
                        })}
                        className="border-gray-300"
                      />
                      <span className="text-sm">{rating}+ stars</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge key={`cat-${category}`} variant="secondary" className="flex items-center space-x-1">
              <span>{category}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilter('categories', category)} 
              />
            </Badge>
          ))}
          {filters.difficulties.map((difficulty) => (
            <Badge key={`diff-${difficulty}`} variant="secondary" className="flex items-center space-x-1">
              <span>{difficulty}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilter('difficulties', difficulty)} 
              />
            </Badge>
          ))}
          {/* Add other active filter badges similarly */}
        </div>
      )}

      {/* Results */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
        {filteredModules.map((module) => {
          const isBookmarked = bookmarkedModules.has(module.id)
          const isCompleted = userProfile.completedModules.includes(module.id)
          const relevanceScore = calculateRelevance(module, userProfile)

          return (
            <Card 
              key={module.id} 
              className="transition-all duration-200 hover:shadow-lg"
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
                  {sortBy === 'relevance' && relevanceScore > 50 && (
                    <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                      High Match
                    </Badge>
                  )}
                  
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
                  <p className="text-sm text-gray-600">{module.description}</p>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

      {filteredModules.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find relevant modules.
            </p>
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SearchInterface