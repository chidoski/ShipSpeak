/**
 * Insight Cards - Structured display of actionable communication insights
 * ShipSpeak Slice 5: Card-based insight presentation with prioritized recommendations
 */

import React, { useState } from 'react'
import { 
  PatternHighlight,
  ImprovementArea,
  StrengthArea,
  ProgressionInsight
} from '../../../types/transcript-analysis'

interface InsightCardsProps {
  patternHighlights: PatternHighlight[]
  improvementAreas: ImprovementArea[]
  strengthAreas: StrengthArea[]
  progressionInsights: ProgressionInsight[]
}

export const InsightCards: React.FC<InsightCardsProps> = ({
  patternHighlights,
  improvementAreas,
  strengthAreas,
  progressionInsights
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'strengths' | 'improvements' | 'progression'>('all')

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  const getSignificanceColor = (significance: string): string => {
    switch (significance) {
      case 'HIGH': return 'bg-red-50 border-red-200 text-red-800'
      case 'MEDIUM': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'LOW': return 'bg-green-50 border-green-200 text-green-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-300'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {[
          { key: 'all', label: 'All Insights', count: patternHighlights.length + improvementAreas.length + strengthAreas.length + progressionInsights.length },
          { key: 'strengths', label: 'Strengths', count: patternHighlights.length + strengthAreas.length },
          { key: 'improvements', label: 'Development Areas', count: improvementAreas.length },
          { key: 'progression', label: 'Career Progression', count: progressionInsights.length }
        ].map(category => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category.key
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Pattern Highlights Cards */}
      {(activeCategory === 'all' || activeCategory === 'strengths') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-green-600 mr-2">✨</span>
            Communication Strengths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patternHighlights.map((highlight, index) => (
              <div
                key={`highlight-${index}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleCard(`highlight-${index}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{highlight.pattern}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded border ${getSignificanceColor(highlight.significance)}`}>
                        {highlight.significance}
                      </span>
                      <div className="text-lg font-bold text-green-600">{highlight.score}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{highlight.careerImpact}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {highlight.evidence.slice(0, 2).map((evidence, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {evidence}
                      </span>
                    ))}
                    {highlight.evidence.length > 2 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{highlight.evidence.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${highlight.score}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {expandedCard === `highlight-${index}` ? '−' : '+'}
                    </span>
                  </div>
                </div>

                {expandedCard === `highlight-${index}` && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-3 space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Evidence Details:</h5>
                      {highlight.evidence.map((evidence, i) => (
                        <div key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2 mt-0.5">•</span>
                          {evidence}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Areas Cards */}
      {(activeCategory === 'all' || activeCategory === 'improvements') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-amber-600 mr-2">🎯</span>
            Priority Development Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvementAreas.map((area, index) => (
              <div
                key={`improvement-${index}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleCard(`improvement-${index}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{area.specificFocus}</h4>
                    <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(area.priority)}`}>
                      {area.priority}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Current: {area.currentLevel}%</span>
                      <span>Target: {area.targetLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 relative">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${area.currentLevel}%` }}
                      />
                      <div 
                        className="absolute top-0 h-2 w-0.5 bg-amber-700"
                        style={{ left: `${area.targetLevel}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Gap: {area.gap} points</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">{area.examples[0]}</div>
                    {expandedCard === `improvement-${index}` && area.examples.length > 1 && (
                      <div className="space-y-1">
                        {area.examples.slice(1).map((example, i) => (
                          <div key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-amber-500 mr-2 mt-0.5">•</span>
                            {example}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{area.competency.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-500">
                      {expandedCard === `improvement-${index}` ? '−' : '+'}
                    </span>
                  </div>
                </div>

                {expandedCard === `improvement-${index}` && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-3 space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Recommended Practice Modules:</h5>
                        <div className="flex flex-wrap gap-2">
                          {area.practiceModules.map((module, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {module}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strength Areas Cards */}
      {(activeCategory === 'all' || activeCategory === 'strengths') && strengthAreas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-blue-600 mr-2">💪</span>
            Leverage Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strengthAreas.map((strength, index) => (
              <div
                key={`strength-${index}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleCard(`strength-${index}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{strength.competency.replace('_', ' ')}</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{strength.currentLevel}%</div>
                      <div className="text-xs text-gray-500">vs {strength.benchmarkComparison}% avg</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm text-blue-600 font-medium mb-1">
                      Top Leverage Opportunity:
                    </div>
                    <div className="text-sm text-gray-600">{strength.leverageOpportunities[0]}</div>
                  </div>

                  <div className="space-y-1">
                    {strength.examples.slice(0, 2).map((example, i) => (
                      <div key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {example}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${strength.currentLevel}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {expandedCard === `strength-${index}` ? '−' : '+'}
                    </span>
                  </div>
                </div>

                {expandedCard === `strength-${index}` && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-3 space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">All Leverage Opportunities:</h5>
                        {strength.leverageOpportunities.map((opportunity, i) => (
                          <div key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2 mt-0.5">→</span>
                            {opportunity}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Supporting Evidence:</h5>
                        {strength.examples.map((example, i) => (
                          <div key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2 mt-0.5">✓</span>
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Progression Insights */}
      {(activeCategory === 'all' || activeCategory === 'progression') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-purple-600 mr-2">🚀</span>
            Career Progression Insights
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {progressionInsights.map((insight, index) => (
              <div
                key={`insight-${index}`}
                className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleCard(`insight-${index}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 text-lg">{insight.transitionType}</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{insight.readinessScore}%</div>
                      <div className="text-sm text-gray-500">ready in {insight.timeToTarget}mo</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Key Milestones</h5>
                      <div className="space-y-1">
                        {insight.keyMilestones.slice(0, expandedCard === `insight-${index}` ? undefined : 2).map((milestone, i) => (
                          <div key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-purple-500 mr-2 mt-0.5">•</span>
                            {milestone}
                          </div>
                        ))}
                        {!expandedCard?.includes(`insight-${index}`) && insight.keyMilestones.length > 2 && (
                          <div className="text-xs text-gray-500">+{insight.keyMilestones.length - 2} more milestones</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Critical Actions</h5>
                      <div className="space-y-1">
                        {insight.criticalActions.slice(0, expandedCard === `insight-${index}` ? undefined : 2).map((action, i) => (
                          <div key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-orange-500 mr-2 mt-0.5">→</span>
                            {action}
                          </div>
                        ))}
                        {!expandedCard?.includes(`insight-${index}`) && insight.criticalActions.length > 2 && (
                          <div className="text-xs text-gray-500">+{insight.criticalActions.length - 2} more actions</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="w-full bg-purple-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${insight.readinessScore}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {expandedCard === `insight-${index}` ? '−' : '+'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {((activeCategory === 'strengths' && patternHighlights.length === 0 && strengthAreas.length === 0) ||
        (activeCategory === 'improvements' && improvementAreas.length === 0) ||
        (activeCategory === 'progression' && progressionInsights.length === 0)) && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No {activeCategory} insights available for this analysis.</p>
        </div>
      )}
    </div>
  )
}

export default InsightCards