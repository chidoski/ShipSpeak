/**
 * PersonalizationEngine - User profile analysis and recommendation customization
 * PM-specific skill analysis and learning path personalization
 */

'use client'

import React, { useState } from 'react'
import { UserProfile, RecommendationEngine } from '@/types/modules'
import { UserProfileAnalyzer } from './UserProfileAnalyzer'
import { SkillGapIdentifier } from './SkillGapIdentifier'
import { CareerGoalAligner } from './CareerGoalAligner'
import { RecommendationGenerator } from './RecommendationGenerator'

interface PersonalizationEngineProps {
  userProfile: UserProfile
  recommendationEngine: RecommendationEngine
  onProfileUpdate: (updates: Partial<UserProfile>) => void
}

type AnalysisView = 'profile' | 'skills' | 'career' | 'recommendations'

export function PersonalizationEngine({ 
  userProfile, 
  recommendationEngine, 
  onProfileUpdate 
}: PersonalizationEngineProps) {
  const [currentView, setCurrentView] = useState<AnalysisView>('profile')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleReanalyze = async () => {
    setIsAnalyzing(true)
    try {
      // Trigger re-analysis of user profile and recommendations
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      // In production, this would call the recommendation engine API
    } catch (error) {
      console.error('Re-analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'profile':
        return (
          <UserProfileAnalyzer
            userProfile={userProfile}
            progressAnalysis={recommendationEngine.userProgressAnalysis}
            onProfileUpdate={onProfileUpdate}
          />
        )
      
      case 'skills':
        return (
          <SkillGapIdentifier
            skillGaps={recommendationEngine.skillGapIdentification}
            userProfile={userProfile}
            onSkillFocus={(skillId) => console.log('Focus on skill:', skillId)}
          />
        )
      
      case 'career':
        return (
          <CareerGoalAligner
            careerAlignment={recommendationEngine.careerGoalAlignment}
            userProfile={userProfile}
            onGoalUpdate={(goals) => console.log('Update goals:', goals)}
          />
        )
      
      case 'recommendations':
        return (
          <RecommendationGenerator
            recommendations={recommendationEngine.personalizedRecommendations}
            userProfile={userProfile}
            onRecommendationFeedback={(feedback) => console.log('Feedback:', feedback)}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="personalization-engine p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Personalization Engine
            </h2>
            <p className="text-gray-600">
              Your learning profile and recommendation analysis for {userProfile.currentRole} → {userProfile.targetRole}
            </p>
          </div>
          
          <button
            onClick={handleReanalyze}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Re-analyze</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <AnalysisTab
            id="profile"
            label="Profile Analysis"
            icon="👤"
            active={currentView === 'profile'}
            onClick={() => setCurrentView('profile')}
            count={Object.keys(userProfile.skillAssessment.skills).length}
          />
          <AnalysisTab
            id="skills"
            label="Skill Gaps"
            icon="📊"
            active={currentView === 'skills'}
            onClick={() => setCurrentView('skills')}
            count={recommendationEngine.skillGapIdentification.length}
          />
          <AnalysisTab
            id="career"
            label="Career Alignment"
            icon="🎯"
            active={currentView === 'career'}
            onClick={() => setCurrentView('career')}
            score={recommendationEngine.careerGoalAlignment.alignmentScore}
          />
          <AnalysisTab
            id="recommendations"
            label="Recommendation Logic"
            icon="⚡"
            active={currentView === 'recommendations'}
            onClick={() => setCurrentView('recommendations')}
            count={recommendationEngine.personalizedRecommendations.length}
          />
        </nav>
      </div>

      {/* Analysis Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <OverviewCard
          title="Learning Velocity"
          value={`${recommendationEngine.userProgressAnalysis.learningVelocity}x`}
          subtitle="Modules per week"
          trend="up"
          color="green"
        />
        <OverviewCard
          title="Career Readiness"
          value={`${recommendationEngine.userProgressAnalysis.careerReadiness.readinessScore}%`}
          subtitle={`for ${userProfile.targetRole}`}
          trend="up"
          color="blue"
        />
        <OverviewCard
          title="Skill Gaps"
          value={recommendationEngine.skillGapIdentification.length.toString()}
          subtitle="Areas to develop"
          trend="down"
          color="orange"
        />
        <OverviewCard
          title="Active Recommendations"
          value={recommendationEngine.personalizedRecommendations.length.toString()}
          subtitle="Personalized modules"
          trend="stable"
          color="purple"
        />
      </div>

      {/* Active Analysis View */}
      <div className="bg-white rounded-lg border border-gray-200">
        {renderActiveView()}
      </div>
    </div>
  )
}

function AnalysisTab({ 
  id, 
  label, 
  icon, 
  active, 
  onClick, 
  count, 
  score 
}: {
  id: string
  label: string
  icon: string
  active: boolean
  onClick: () => void
  count?: number
  score?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
      {score !== undefined && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          score >= 80 
            ? 'bg-green-100 text-green-700'
            : score >= 60
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {score}%
        </span>
      )}
    </button>
  )
}

function OverviewCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  color 
}: {
  title: string
  value: string
  subtitle: string
  trend: 'up' | 'down' | 'stable'
  color: 'green' | 'blue' | 'orange' | 'purple'
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200'
  }

  const valueColors = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  }

  const trendIcons = {
    up: '📈',
    down: '📉',
    stable: '➡️'
  }

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className="text-sm">{trendIcons[trend]}</span>
      </div>
      <div className={`text-2xl font-bold mb-1 ${valueColors[color]}`}>
        {value}
      </div>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  )
}