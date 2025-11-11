/**
 * Progress Timeline - Visual timeline of communication improvement over time
 * ShipSpeak Slice 5: Historical progress tracking with career milestone visualization
 */

import React from 'react'
import { 
  HistoricalProgressComparison,
  ProgressionInsight
} from '../../../types/transcript-analysis'

interface ProgressTimelineProps {
  historicalProgress: HistoricalProgressComparison
  careerInsights: ProgressionInsight[]
  currentScore: number
}

interface TimelinePoint {
  date: string
  score: number
  milestone?: string
  type: 'measurement' | 'milestone' | 'projection'
  description?: string
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  historicalProgress,
  careerInsights,
  currentScore
}) => {
  const timelineData = React.useMemo(() => {
    return generateTimelineData(historicalProgress, careerInsights, currentScore)
  }, [historicalProgress, careerInsights, currentScore])

  const getPointColor = (type: TimelinePoint['type'], score: number): string => {
    if (type === 'projection') return 'bg-purple-500'
    if (type === 'milestone') return 'bg-blue-500'
    if (score >= 80) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getPointSize = (type: TimelinePoint['type']): string => {
    return type === 'milestone' ? 'w-4 h-4' : 'w-3 h-3'
  }

  const getTrendIcon = (): string => {
    switch (historicalProgress.trajectoryDirection) {
      case 'ACCELERATING': return '📈'
      case 'STEADY': return '➡️'
      case 'PLATEAUING': return '📊'
      case 'DECLINING': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (): string => {
    switch (historicalProgress.trajectoryDirection) {
      case 'ACCELERATING': return 'text-green-600'
      case 'STEADY': return 'text-blue-600'
      case 'PLATEAUING': return 'text-yellow-600'
      case 'DECLINING': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {getTrendIcon()} {historicalProgress.improvementRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Monthly Growth</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{historicalProgress.consistencyScore}%</div>
          <div className="text-sm text-gray-600">Consistency</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{historicalProgress.keyMilestones.length}</div>
          <div className="text-sm text-gray-600">Milestones</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {historicalProgress.trajectoryDirection.toLowerCase()}
          </div>
          <div className="text-sm text-gray-600">Trajectory</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        {/* Timeline Points */}
        <div className="space-y-6">
          {timelineData.map((point, index) => (
            <div key={index} className="relative flex items-start">
              {/* Point Marker */}
              <div className={`
                relative z-10 flex-shrink-0 ${getPointSize(point.type)} rounded-full 
                ${getPointColor(point.type, point.score)} border-2 border-white shadow
              `}>
                {point.type === 'projection' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Content */}
              <div className="ml-6 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className={`font-medium ${
                      point.type === 'projection' ? 'text-purple-700' :
                      point.type === 'milestone' ? 'text-blue-700' :
                      'text-gray-900'
                    }`}>
                      {point.milestone || formatDateLabel(point.date)}
                    </h3>
                    <span className="text-sm text-gray-500">{point.date}</span>
                  </div>
                  <div className={`text-lg font-bold ${
                    point.type === 'projection' ? 'text-purple-600' :
                    point.score >= 80 ? 'text-green-600' :
                    point.score >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {point.score}
                    {point.type === 'projection' && (
                      <span className="text-sm text-gray-500 ml-1">(projected)</span>
                    )}
                  </div>
                </div>
                
                {point.description && (
                  <p className="text-sm text-gray-600 mt-1">{point.description}</p>
                )}

                {/* Progress Bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      point.type === 'projection' ? 'bg-purple-500' :
                      point.score >= 80 ? 'bg-green-500' :
                      point.score >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${point.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Progression Insights */}
      {careerInsights.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">Career Progression Forecast</h4>
          {careerInsights.slice(0, 2).map((insight, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{insight.transitionType}</h5>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {insight.timeToTarget} months
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h6 className="font-medium text-gray-700 mb-1">Key Milestones</h6>
                  <ul className="text-gray-600 space-y-1">
                    {insight.keyMilestones.slice(0, 3).map((milestone, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-blue-500 mr-2">•</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-gray-700 mb-1">Critical Actions</h6>
                  <ul className="text-gray-600 space-y-1">
                    {insight.criticalActions.slice(0, 3).map((action, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-orange-500 mr-2">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Strong Performance (80+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Good Performance (70-79)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Needs Improvement (&lt;70)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Career Milestone</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Projected Score</span>
        </div>
      </div>
    </div>
  )
}

// Generate timeline data from historical progress and insights
const generateTimelineData = (
  historical: HistoricalProgressComparison,
  insights: ProgressionInsight[],
  currentScore: number
): TimelinePoint[] => {
  const points: TimelinePoint[] = []
  const now = new Date()

  // Add historical milestones
  if (historical.keyMilestones && historical.keyMilestones.length > 0) {
    historical.keyMilestones.forEach(milestone => {
      points.push({
        date: milestone.date,
        score: milestone.score,
        milestone: milestone.achievement,
        type: 'milestone',
        description: milestone.significance
      })
    })
  }

  // Add mock historical data points (in real implementation, this would come from database)
  const mockHistoricalPoints = generateMockHistoricalPoints(currentScore, historical.improvementRate)
  points.push(...mockHistoricalPoints)

  // Add current score
  points.push({
    date: now.toISOString().split('T')[0],
    score: currentScore,
    type: 'measurement',
    description: 'Current communication analysis score'
  })

  // Add future projections based on insights
  if (insights.length > 0) {
    const primaryInsight = insights[0]
    const futureDate = new Date(now.getTime() + (primaryInsight.timeToTarget * 30 * 24 * 60 * 60 * 1000))
    const projectedScore = Math.min(100, currentScore + (historical.improvementRate * primaryInsight.timeToTarget))
    
    points.push({
      date: futureDate.toISOString().split('T')[0],
      score: Math.round(projectedScore),
      milestone: `Target: ${primaryInsight.transitionType}`,
      type: 'projection',
      description: `Projected score based on ${historical.improvementRate}% monthly improvement`
    })
  }

  // Sort by date
  return points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Generate mock historical data points
const generateMockHistoricalPoints = (currentScore: number, improvementRate: number): TimelinePoint[] => {
  const points: TimelinePoint[] = []
  const now = new Date()
  
  // Generate 6 months of historical data
  for (let i = 5; i >= 1; i--) {
    const date = new Date(now.getTime() - (i * 30 * 24 * 60 * 60 * 1000))
    const score = Math.max(30, currentScore - (improvementRate * i) + (Math.random() * 10 - 5))
    
    points.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(score),
      type: 'measurement',
      description: 'Historical communication score'
    })
  }
  
  return points
}

// Format date labels
const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
  return `${Math.ceil(diffDays / 365)} years ago`
}

export default ProgressTimeline