/**
 * SearchResults - Search results display with module cards
 * PM-specific search results with career context
 */

'use client'

import React from 'react'
import { PracticeModule } from '@/types/modules'
import { ModuleCard } from '../ModuleInterface/ModuleCard'

interface SearchResultsProps {
  modules: PracticeModule[]
  isLoading: boolean
  query: string
  totalResults: number
  onModuleSelect: (moduleId: string) => void
}

export function SearchResults({ 
  modules, 
  isLoading, 
  query, 
  totalResults, 
  onModuleSelect 
}: SearchResultsProps) {
  if (isLoading) {
    return <SearchLoadingState />
  }

  if (!query && modules.length === 0) {
    return <SearchEmptyState />
  }

  if (query && modules.length === 0) {
    return <NoResultsState query={query} />
  }

  return (
    <div className="search-results">
      {/* Results Header */}
      {query && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-1">
            Search Results for "{query}"
          </h3>
          <p className="text-sm text-gray-600">
            {totalResults} module{totalResults !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onSelect={() => onModuleSelect(module.id)}
            variant="search"
          />
        ))}
      </div>

      {/* Load More (if needed) */}
      {modules.length < totalResults && (
        <div className="mt-8 text-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Load More Results
          </button>
        </div>
      )}
    </div>
  )
}

function SearchLoadingState() {
  return (
    <div className="search-loading">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SearchEmptyState() {
  return (
    <div className="search-empty text-center py-12">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Start Your Search
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Search for modules by topic, skill, framework, or career goal. 
        Use filters to narrow down results based on your needs.
      </p>
      
      {/* Popular searches */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Popular searches:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'executive communication',
            'board presentation',
            'strategic thinking',
            'stakeholder management',
            'RICE framework',
            'influence skills'
          ].map((term) => (
            <span
              key={term}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="no-results text-center py-12">
      <div className="text-6xl mb-4">📭</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No modules found for "{query}"
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
      
      {/* Search suggestions */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {getSuggestions(query).map((suggestion) => (
              <button
                key={suggestion}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-3">Or browse by category:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Executive Communication',
              'Strategic Thinking',
              'Framework Application',
              'Industry Expertise',
              'Meeting Mastery'
            ].map((category) => (
              <button
                key={category}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getSuggestions(query: string): string[] {
  const allSuggestions = [
    'communication',
    'presentation',
    'leadership',
    'strategy',
    'framework',
    'stakeholder',
    'executive',
    'board',
    'influence',
    'negotiation',
    'decision making',
    'product strategy'
  ]
  
  // Return suggestions that don't match the current query
  return allSuggestions
    .filter(s => !query.toLowerCase().includes(s.toLowerCase()))
    .slice(0, 6)
}