/**
 * ModuleInterface - Module detail view and interaction interface
 * PM-specific module preview, tracking, and engagement system
 */

'use client'

import React, { useState, useEffect } from 'react'
import { UserProfile, PracticeModule } from '@/types/modules'
import { ModulePreview } from './ModulePreview'
import { ProgressTracking } from './ProgressTracking'
import { BookmarkingSystem } from './BookmarkingSystem'

interface ModuleInterfaceProps {
  moduleId: string
  userProfile: UserProfile
  onClose: () => void
  onModuleAction: (action: 'start' | 'bookmark' | 'complete' | 'rate', moduleId: string) => void
}

export function ModuleInterface({ 
  moduleId, 
  userProfile, 
  onClose, 
  onModuleAction 
}: ModuleInterfaceProps) {
  const [module, setModule] = useState<PracticeModule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadModule(moduleId)
  }, [moduleId])

  const loadModule = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // In production, this would be an API call
      const moduleData = await fetchModule(id)
      setModule(moduleData)
    } catch (err) {
      setError('Failed to load module')
      console.error('Module loading failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = (action: 'start' | 'bookmark' | 'complete' | 'rate') => {
    if (module) {
      onModuleAction(action, module.id)
    }
  }

  if (isLoading) {
    return (
      <div className="module-interface-overlay">
        <div className="module-interface-panel">
          <ModuleLoadingState onClose={onClose} />
        </div>
      </div>
    )
  }

  if (error || !module) {
    return (
      <div className="module-interface-overlay">
        <div className="module-interface-panel">
          <ModuleErrorState error={error} onClose={onClose} onRetry={() => loadModule(moduleId)} />
        </div>
      </div>
    )
  }

  return (
    <div className="module-interface-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="module-interface-panel bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{module.title}</h2>
            <ModuleBadge module={module} />
          </div>
          
          <div className="flex items-center space-x-3">
            <BookmarkingSystem
              module={module}
              isBookmarked={userProfile.bookmarkedModules.includes(module.id)}
              onBookmarkToggle={() => handleAction('bookmark')}
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ModulePreview
                module={module}
                userProfile={userProfile}
                onStart={() => handleAction('start')}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ProgressTracking
                module={module}
                userProfile={userProfile}
                onComplete={() => handleAction('complete')}
              />
              
              <RecommendedNext module={module} userProfile={userProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModuleBadge({ module }: { module: PracticeModule }) {
  const getDifficultyColor = () => {
    switch (module.difficulty) {
      case 'Foundation': return 'bg-green-100 text-green-700'
      case 'Practice': return 'bg-blue-100 text-blue-700'
      case 'Mastery': return 'bg-purple-100 text-purple-700'
      case 'Expert': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
        {module.difficulty}
      </span>
      <span className="text-sm text-gray-500">
        {module.estimatedDuration} min
      </span>
    </div>
  )
}

function RecommendedNext({ 
  module, 
  userProfile 
}: { 
  module: PracticeModule
  userProfile: UserProfile
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Recommended Next</h4>
      <div className="space-y-3">
        {/* Mock recommended modules */}
        {[
          {
            id: '1',
            title: 'Advanced Stakeholder Communication',
            duration: 15,
            category: 'Executive Communication'
          },
          {
            id: '2',
            title: 'Financial Impact Presentation',
            duration: 20,
            category: 'Board Presentation'
          }
        ].map((nextModule) => (
          <div key={nextModule.id} className="bg-white rounded p-3 hover:shadow-md transition-shadow cursor-pointer">
            <h5 className="font-medium text-gray-900 text-sm mb-1">
              {nextModule.title}
            </h5>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{nextModule.duration} min</span>
              <span>•</span>
              <span>{nextModule.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModuleLoadingState({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <span className="text-2xl">×</span>
        </button>
      </div>
      
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

function ModuleErrorState({ 
  error, 
  onClose, 
  onRetry 
}: { 
  error: string | null
  onClose: () => void
  onRetry: () => void
}) {
  return (
    <div className="p-6 text-center">
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <span className="text-2xl">×</span>
        </button>
      </div>
      
      <div className="text-6xl mb-4">😞</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Module</h3>
      <p className="text-gray-600 mb-6">{error || 'An unexpected error occurred'}</p>
      
      <div className="space-x-3">
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// Mock API function
async function fetchModule(moduleId: string): Promise<PracticeModule> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock module data
  return {
    id: moduleId,
    title: 'Executive Communication Mastery',
    description: 'Master the art of executive-level communication with clear, concise, and compelling messaging that drives decision-making and influences stakeholders.',
    shortDescription: 'Master executive-level communication for better stakeholder influence.',
    category: {
      id: 'exec-comm',
      name: 'Executive Communication',
      description: 'Communication skills for senior leadership',
      moduleCount: 15,
      averageDuration: '18 minutes',
      skillLevel: 'Advanced',
      careerImpact: 'High impact for senior PM roles'
    },
    difficulty: 'Mastery',
    estimatedDuration: 20,
    learningObjectives: [
      {
        id: '1',
        description: 'Structure executive summaries using answer-first methodology',
        skillArea: {
          id: 'communication',
          name: 'Communication',
          category: 'Core Skills',
          description: 'Verbal and written communication skills',
          levels: []
        },
        proficiencyTarget: 4,
        assessmentCriteria: ['Clear structure', 'Answer-first approach', 'Executive appropriate']
      }
    ],
    prerequisites: ['Basic PM Communication', 'Stakeholder Management Basics'],
    skills: [],
    industryRelevance: [{
      industry: 'Financial Services & Fintech',
      relevanceScore: 95,
      specificContext: 'Critical for regulatory communication and board presentations',
      keyRequirements: ['Risk communication', 'Compliance articulation']
    }],
    careerImpact: [{
      transitionType: 'PM_TO_SENIOR_PM',
      impactLevel: 'HIGH',
      specificBenefits: ['Board readiness', 'Executive presence', 'Influence skills'],
      timeToImpact: '2-3 months'
    }],
    moduleType: 'COMMUNICATION_PRACTICE',
    content: {
      type: 'COMMUNICATION_PRACTICE',
      scenarios: [],
      practiceExercises: [],
      frameworkApplication: [],
      realWorldContext: {
        industry: 'Financial Services & Fintech',
        companySize: 'ENTERPRISE',
        meetingType: 'BOARD_PRESENTATION',
        stakeholderLevel: 'C_SUITE',
        businessContext: 'Quarterly business review with focus on risk and compliance'
      }
    },
    assessment: {
      type: 'PRACTICE',
      criteria: [],
      passingScore: 80,
      feedback: {
        strengths: [],
        improvementAreas: [],
        specificSuggestions: [],
        nextSteps: []
      },
      retryPolicy: {
        maxAttempts: 3,
        cooldownPeriod: 24,
        improvementRequired: true
      }
    },
    ratings: {
      averageRating: 4.7,
      totalRatings: 234,
      effectiveness: 4.8,
      careerRelevance: 4.9,
      difficultyAccuracy: 4.6,
      userReviews: []
    },
    tags: ['executive', 'communication', 'presentation', 'leadership'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-15')
  }
}