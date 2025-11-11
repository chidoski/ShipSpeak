/**
 * Competency Filters Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * 5-point PM competency filtering with trend visualization
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/Card'
import { CompetencyCategory } from '@/types/competency'
import { CompetencyTrend } from '@/types/meeting'

interface CompetencyFiltersProps {
  selectedCompetencies: CompetencyCategory[]
  onCompetencyChange: (competencies: CompetencyCategory[]) => void
  trends?: CompetencyTrend[]
}

const competencyConfig = {
  'product-sense': {
    label: 'Product Sense & Strategic Thinking',
    icon: '🎯',
    color: 'blue',
    description: 'Framework usage, user problem articulation, market context'
  },
  'communication': {
    label: 'Communication & Executive Presence',
    icon: '💼',
    color: 'green', 
    description: 'Answer-first structure, strategic language, board presentation'
  },
  'stakeholder': {
    label: 'Stakeholder Management & Leadership',
    icon: '🤝',
    color: 'purple',
    description: 'Multi-audience communication, conflict resolution, cross-functional leadership'
  },
  'technical': {
    label: 'Technical Translation & Data Fluency',
    icon: '⚙️',
    color: 'orange',
    description: 'Complex concept simplification, data-driven reasoning, risk communication'
  },
  'business': {
    label: 'Business Impact & Organizational Leadership',
    icon: '📈',
    color: 'red',
    description: 'ROI articulation, resource allocation, organizational communication'
  }
} as const

export function CompetencyFilters({
  selectedCompetencies,
  onCompetencyChange,
  trends = []
}: CompetencyFiltersProps) {
  const [expandedCompetency, setExpandedCompetency] = useState<CompetencyCategory | null>(null)

  const handleCompetencyToggle = (competency: CompetencyCategory) => {
    if (selectedCompetencies.includes(competency)) {
      onCompetencyChange(selectedCompetencies.filter(c => c !== competency))
    } else {
      onCompetencyChange([...selectedCompetencies, competency])
    }
  }

  const getTrendForCompetency = (competency: CompetencyCategory) => {
    return trends.find(t => t.category === competency)
  }

  const getTrendIcon = (trend?: CompetencyTrend) => {
    if (!trend) return '📊'
    switch (trend.trend) {
      case 'IMPROVING': return '📈'
      case 'DECLINING': return '📉'
      case 'STABLE': return '➡️'
      default: return '📊'
    }
  }

  const getTrendColor = (trend?: CompetencyTrend) => {
    if (!trend) return 'text-gray-500'
    switch (trend.trend) {
      case 'IMPROVING': return 'text-green-600'
      case 'DECLINING': return 'text-red-600'
      case 'STABLE': return 'text-blue-600'
      default: return 'text-gray-500'
    }
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        PM Competency Filters
      </h3>
      
      <div className="space-y-3">
        {Object.entries(competencyConfig).map(([key, config]) => {
          const competency = key as CompetencyCategory
          const isSelected = selectedCompetencies.includes(competency)
          const trend = getTrendForCompetency(competency)
          const isExpanded = expandedCompetency === competency

          return (
            <div key={competency} className="space-y-2">
              {/* Main Competency Checkbox */}
              <div 
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => handleCompetencyToggle(competency)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCompetencyToggle(competency)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{config.icon}</span>
                        <span className="font-medium text-gray-900 text-sm leading-tight">
                          {config.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {config.description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Trend Indicator */}
                    <div className={`text-lg ${getTrendColor(trend)}`}>
                      {getTrendIcon(trend)}
                    </div>
                    
                    {/* Expand/Collapse */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedCompetency(isExpanded ? null : competency)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="ml-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {trend ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Recent Trend
                        </span>
                        <span className={`text-sm font-semibold ${getTrendColor(trend)}`}>
                          {trend.trend.toLowerCase()} (+{trend.changeRate.toFixed(1)}%)
                        </span>
                      </div>
                      
                      {/* Mini Trend Chart */}
                      <div className="flex items-end space-x-1 h-8">
                        {trend.dataPoints.slice(-5).map((point, index) => (
                          <div
                            key={index}
                            className="bg-blue-200 min-w-[8px] rounded-t"
                            style={{
                              height: `${(point.score / 100) * 100}%`,
                              backgroundColor: index === trend.dataPoints.length - 1 
                                ? '#3B82F6' 
                                : '#93C5FD'
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(trend.dataPoints[trend.dataPoints.length - 1]?.date || '').toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No recent meeting data for trend analysis
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Filter Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <button
            onClick={() => onCompetencyChange(Object.keys(competencyConfig) as CompetencyCategory[])}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Select All
          </button>
          <button
            onClick={() => onCompetencyChange([])}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Clear All
          </button>
        </div>
        
        {selectedCompetencies.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-800">
              <span className="font-medium">{selectedCompetencies.length}</span> competenc{selectedCompetencies.length === 1 ? 'y' : 'ies'} selected
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}