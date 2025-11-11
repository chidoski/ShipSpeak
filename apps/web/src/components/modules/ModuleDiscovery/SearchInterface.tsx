/**
 * SearchInterface - Advanced module search with intelligent filtering
 * PM-specific search with career context and skill-based filtering
 */

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { UserProfile, PracticeModule, ModuleSearchFilters, DifficultyLevel, Industry, PMTransitionType, ModuleType } from '@/types/modules'
import { SearchResults } from './SearchResults'

interface SearchInterfaceProps {
  searchQuery: string
  userProfile: UserProfile
  onModuleSelect: (moduleId: string) => void
  onResultsChange: (count: number) => void
}

export function SearchInterface({ 
  searchQuery, 
  userProfile, 
  onModuleSelect, 
  onResultsChange 
}: SearchInterfaceProps) {
  const [query, setQuery] = useState(searchQuery)
  const [filters, setFilters] = useState<ModuleSearchFilters>({
    categories: [],
    difficulties: [],
    industries: [],
    careerTransitions: [],
    duration: {},
    skills: [],
    moduleTypes: [],
    ratings: { min: 0 }
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<PracticeModule[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'duration' | 'difficulty'>('relevance')

  useEffect(() => {
    if (searchQuery !== query) {
      setQuery(searchQuery)
    }
  }, [searchQuery])

  useEffect(() => {
    performSearch()
  }, [query, filters, sortBy])

  const performSearch = async () => {
    setIsSearching(true)
    try {
      const results = await searchModules(query, filters, sortBy, userProfile)
      setSearchResults(results.modules)
      setTotalResults(results.totalCount)
      onResultsChange(results.totalCount)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
      setTotalResults(0)
      onResultsChange(0)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFilterChange = (filterType: keyof ModuleSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
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

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length
      if (typeof filter === 'object' && filter !== null) {
        return count + Object.keys(filter).length
      }
      return count
    }, 0)
  }, [filters])

  const getSearchSuggestions = () => {
    const suggestions = [
      'executive communication',
      'board presentation',
      'strategic thinking',
      'stakeholder management',
      'framework application',
      'influence skills',
      'financial communication',
      'product strategy'
    ]
    
    return suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase()) && s.toLowerCase() !== query.toLowerCase()
    ).slice(0, 5)
  }

  return (
    <div className="search-interface p-6">
      {/* Search Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Modules</h2>
        <p className="text-gray-600">
          Find the perfect modules for your {userProfile.currentRole} to {userProfile.targetRole} journey
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for modules, skills, frameworks..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        
        {/* Search Suggestions */}
        {query.length > 0 && getSearchSuggestions().length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Suggestions:</span>
            {getSearchSuggestions().map(suggestion => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <span>🎛️</span>
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {totalResults} module{totalResults !== 1 ? 's' : ''} found
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Most Relevant</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Shortest Duration</option>
              <option value="difficulty">Difficulty Level</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <AdvancedFilters
              filters={filters}
              userProfile={userProfile}
              onChange={handleFilterChange}
            />
          </div>
        )}
      </div>

      {/* Search Results */}
      <SearchResults
        modules={searchResults}
        isLoading={isSearching}
        query={query}
        totalResults={totalResults}
        onModuleSelect={onModuleSelect}
      />
    </div>
  )
}

function AdvancedFilters({ 
  filters, 
  userProfile, 
  onChange 
}: {
  filters: ModuleSearchFilters
  userProfile: UserProfile
  onChange: (filterType: keyof ModuleSearchFilters, value: any) => void
}) {
  const difficulties: DifficultyLevel[] = ['Foundation', 'Practice', 'Mastery', 'Expert']
  const industries: Industry[] = [
    'Healthcare & Life Sciences',
    'Cybersecurity & Enterprise Security',
    'Financial Services & Fintech',
    'Enterprise Software & B2B',
    'Consumer Technology & Apps'
  ]
  const transitions: PMTransitionType[] = [
    'PO_TO_PM',
    'PM_TO_SENIOR_PM',
    'SENIOR_PM_TO_GROUP_PM',
    'GROUP_PM_TO_DIRECTOR'
  ]
  const moduleTypes: ModuleType[] = [
    'COMMUNICATION_PRACTICE',
    'FRAMEWORK_APPLICATION',
    'SCENARIO_SIMULATION',
    'SKILL_ASSESSMENT'
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Difficulty Filter */}
      <FilterSection title="Difficulty Level" icon="📊">
        {difficulties.map(difficulty => (
          <FilterCheckbox
            key={difficulty}
            label={difficulty}
            checked={filters.difficulties.includes(difficulty)}
            onChange={(checked) => {
              const newDifficulties = checked
                ? [...filters.difficulties, difficulty]
                : filters.difficulties.filter(d => d !== difficulty)
              onChange('difficulties', newDifficulties)
            }}
          />
        ))}
      </FilterSection>

      {/* Industry Filter */}
      <FilterSection title="Industry Focus" icon="🏢">
        {industries.map(industry => (
          <FilterCheckbox
            key={industry}
            label={industry}
            checked={filters.industries.includes(industry)}
            onChange={(checked) => {
              const newIndustries = checked
                ? [...filters.industries, industry]
                : filters.industries.filter(i => i !== industry)
              onChange('industries', newIndustries)
            }}
            recommended={industry === userProfile.industry}
          />
        ))}
      </FilterSection>

      {/* Career Transition Filter */}
      <FilterSection title="Career Transition" icon="🎯">
        {transitions.map(transition => (
          <FilterCheckbox
            key={transition}
            label={transition.replace(/_/g, ' → ').replace('TO', 'to')}
            checked={filters.careerTransitions.includes(transition)}
            onChange={(checked) => {
              const newTransitions = checked
                ? [...filters.careerTransitions, transition]
                : filters.careerTransitions.filter(t => t !== transition)
              onChange('careerTransitions', newTransitions)
            }}
            recommended={transition === userProfile.careerTransition}
          />
        ))}
      </FilterSection>

      {/* Module Type Filter */}
      <FilterSection title="Module Type" icon="📚">
        {moduleTypes.map(type => (
          <FilterCheckbox
            key={type}
            label={type.replace(/_/g, ' ')}
            checked={filters.moduleTypes.includes(type)}
            onChange={(checked) => {
              const newTypes = checked
                ? [...filters.moduleTypes, type]
                : filters.moduleTypes.filter(t => t !== type)
              onChange('moduleTypes', newTypes)
            }}
          />
        ))}
      </FilterSection>

      {/* Duration Filter */}
      <FilterSection title="Duration" icon="⏱️">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.duration.min || ''}
              onChange={(e) => onChange('duration', {
                ...filters.duration,
                min: e.target.value ? parseInt(e.target.value) : undefined
              })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.duration.max || ''}
              onChange={(e) => onChange('duration', {
                ...filters.duration,
                max: e.target.value ? parseInt(e.target.value) : undefined
              })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-500 text-sm">min</span>
          </div>
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Minimum Rating" icon="⭐">
        <select
          value={filters.ratings.min}
          onChange={(e) => onChange('ratings', {
            ...filters.ratings,
            min: parseFloat(e.target.value)
          })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value={0}>Any Rating</option>
          <option value={3}>3+ Stars</option>
          <option value={4}>4+ Stars</option>
          <option value={4.5}>4.5+ Stars</option>
        </select>
      </FilterSection>
    </div>
  )
}

function FilterSection({ 
  title, 
  icon, 
  children 
}: { 
  title: string
  icon: string
  children: React.ReactNode 
}) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

function FilterCheckbox({ 
  label, 
  checked, 
  onChange, 
  recommended = false 
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  recommended?: boolean
}) {
  return (
    <label className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="flex-1">{label}</span>
      {recommended && (
        <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">recommended</span>
      )}
    </label>
  )
}

// Mock search API
async function searchModules(
  query: string,
  filters: ModuleSearchFilters,
  sortBy: string,
  userProfile: UserProfile
) {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    modules: [],
    totalCount: 0,
    facets: {
      categories: [],
      difficulties: [],
      industries: []
    },
    suggestions: []
  }
}