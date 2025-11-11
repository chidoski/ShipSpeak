/**
 * Smart Feedback Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Cost-optimized feedback routing with pattern matching and AI analysis
 */

'use client'

import React from 'react'
import { Card } from '../../ui/Card'
import { CapturedMeeting, CompetencyTrend } from '@/types/meeting'

interface SmartFeedbackProps {
  meetings: CapturedMeeting[]
  trends: CompetencyTrend[]
  isExecutive: boolean
}

export function SmartFeedback({ meetings, trends, isExecutive }: SmartFeedbackProps) {
  const totalMeetings = meetings.length
  const patternBasedCount = meetings.filter(m => m.feedbackComplexity === 'PATTERN_BASED').length
  const aiEnhancedCount = meetings.filter(m => m.feedbackComplexity === 'AI_ENHANCED').length
  const fullAiCount = meetings.filter(m => m.feedbackComplexity === 'FULL_AI_ANALYSIS').length

  const costOptimizationStats = {
    patternPercentage: Math.round((patternBasedCount / totalMeetings) * 100) || 0,
    aiEnhancedPercentage: Math.round((aiEnhancedCount / totalMeetings) * 100) || 0,
    fullAiPercentage: Math.round((fullAiCount / totalMeetings) * 100) || 0,
    estimatedSavings: 75 // Percentage savings from smart routing
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Feedback Analytics</h3>
        
        {/* Cost Optimization Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{costOptimizationStats.patternPercentage}%</div>
            <div className="text-sm text-green-700">Pattern-Based</div>
            <div className="text-xs text-green-600">$0.00 cost</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{costOptimizationStats.aiEnhancedPercentage}%</div>
            <div className="text-sm text-blue-700">AI-Enhanced</div>
            <div className="text-xs text-blue-600">Low cost</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{costOptimizationStats.fullAiPercentage}%</div>
            <div className="text-sm text-purple-700">Full AI Analysis</div>
            <div className="text-xs text-purple-600">Premium cost</div>
          </div>
        </div>

        {/* Savings Summary */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Cost Optimization Performance</h4>
              <p className="text-sm text-gray-600">Smart routing achieving significant savings</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{costOptimizationStats.estimatedSavings}%</div>
              <div className="text-sm text-gray-600">Cost Reduction</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pattern Recognition Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pattern Recognition Insights</h3>
        
        <div className="space-y-4">
          {trends.slice(0, 3).map((trend, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">
                    {trend.category.replace('-', ' ')} Trend
                  </h4>
                  <p className="text-sm text-gray-600">
                    {trend.trend.toLowerCase()} trajectory detected
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    trend.trend === 'IMPROVING' ? 'text-green-600' :
                    trend.trend === 'DECLINING' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {trend.trend === 'IMPROVING' ? '📈' : 
                     trend.trend === 'DECLINING' ? '📉' : '➡️'}
                  </div>
                  <div className="text-sm text-gray-600">
                    +{trend.changeRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Executive Priority Routing */}
      {isExecutive && (
        <Card className="p-6 bg-purple-50 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">
            Executive Priority Features
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-medium text-purple-800">Board Meeting Analysis</span>
              <span className="text-purple-600 text-sm">Auto-enabled</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-medium text-purple-800">Crisis Communication Priority</span>
              <span className="text-purple-600 text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-medium text-purple-800">Unlimited AI Budget</span>
              <span className="text-green-600 text-sm">✓ Enabled</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}