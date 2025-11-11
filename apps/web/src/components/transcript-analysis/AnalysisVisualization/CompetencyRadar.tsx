/**
 * Competency Radar - Multi-dimensional visualization of PM competency analysis
 * ShipSpeak Slice 5: Interactive radar chart showing competency strengths and improvement areas
 */

import React from 'react'
import { 
  ImprovementArea,
  StrengthArea
} from '../../../types/transcript-analysis'

interface CompetencyRadarProps {
  improvementAreas: ImprovementArea[]
  strengthAreas: StrengthArea[]
  selectedCompetency: string | null
}

interface RadarData {
  competency: string
  current: number
  target: number
  benchmark: number
  category: 'strength' | 'improvement' | 'neutral'
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({
  improvementAreas,
  strengthAreas,
  selectedCompetency
}) => {
  const radarData = React.useMemo(() => {
    return generateRadarData(improvementAreas, strengthAreas)
  }, [improvementAreas, strengthAreas])

  const [hoveredCompetency, setHoveredCompetency] = React.useState<string | null>(null)

  // SVG dimensions
  const size = 300
  const center = size / 2
  const radius = 120
  const levels = 5

  // Calculate points for radar chart
  const getRadarPoints = (values: number[]): string => {
    return values.map((value, index) => {
      const angle = (index * 2 * Math.PI) / radarData.length - Math.PI / 2
      const r = (value / 100) * radius
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')
  }

  // Get axis line endpoints
  const getAxisEndpoints = (index: number) => {
    const angle = (index * 2 * Math.PI) / radarData.length - Math.PI / 2
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return { x, y }
  }

  // Get label position
  const getLabelPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / radarData.length - Math.PI / 2
    const labelRadius = radius + 25
    const x = center + labelRadius * Math.cos(angle)
    const y = center + labelRadius * Math.sin(angle)
    return { x, y }
  }

  const isCompetencyHighlighted = (competency: string): boolean => {
    return selectedCompetency === competency || hoveredCompetency === competency
  }

  const getCompetencyColor = (category: RadarData['category']): string => {
    switch (category) {
      case 'strength': return '#10B981' // green
      case 'improvement': return '#F59E0B' // amber
      default: return '#6B7280' // gray
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Radar Chart SVG */}
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background circles (levels) */}
          {Array.from({ length: levels }, (_, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={(radius * (i + 1)) / levels}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {radarData.map((_, index) => {
            const endpoint = getAxisEndpoints(index)
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={endpoint.x}
                y2={endpoint.y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            )
          })}

          {/* Benchmark polygon (gray background) */}
          <polygon
            points={getRadarPoints(radarData.map(d => d.benchmark))}
            fill="#F3F4F6"
            stroke="#9CA3AF"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Target polygon (dashed line) */}
          <polygon
            points={getRadarPoints(radarData.map(d => d.target))}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.7"
          />

          {/* Current performance polygon */}
          <polygon
            points={getRadarPoints(radarData.map(d => d.current))}
            fill={selectedCompetency ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)'}
            stroke="#3B82F6"
            strokeWidth="3"
          />

          {/* Data points */}
          {radarData.map((data, index) => {
            const angle = (index * 2 * Math.PI) / radarData.length - Math.PI / 2
            const r = (data.current / 100) * radius
            const x = center + r * Math.cos(angle)
            const y = center + r * Math.sin(angle)
            const isHighlighted = isCompetencyHighlighted(data.competency)

            return (
              <g key={index}>
                {/* Point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHighlighted ? 6 : 4}
                  fill={getCompetencyColor(data.category)}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredCompetency(data.competency)}
                  onMouseLeave={() => setHoveredCompetency(null)}
                />

                {/* Score label */}
                {isHighlighted && (
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    className="text-xs font-bold fill-gray-700"
                  >
                    {data.current}%
                  </text>
                )}
              </g>
            )
          })}

          {/* Competency labels */}
          {radarData.map((data, index) => {
            const pos = getLabelPosition(index)
            const isHighlighted = isCompetencyHighlighted(data.competency)
            
            return (
              <text
                key={index}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-xs font-medium cursor-pointer transition-all duration-200 ${
                  isHighlighted 
                    ? 'fill-gray-900 font-bold' 
                    : 'fill-gray-600 hover:fill-gray-800'
                }`}
                onMouseEnter={() => setHoveredCompetency(data.competency)}
                onMouseLeave={() => setHoveredCompetency(null)}
              >
                {formatCompetencyLabel(data.competency)}
              </text>
            )
          })}
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-full shadow-sm border-2 border-gray-200 w-16 h-16 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-gray-900">
              {Math.round(radarData.reduce((acc, d) => acc + d.current, 0) / radarData.length)}
            </div>
            <div className="text-xs text-gray-500">avg</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Current Performance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-blue-500 bg-transparent rounded" style={{ borderStyle: 'dashed' }}></div>
          <span>Target Level</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span>Benchmark</span>
        </div>
      </div>

      {/* Competency Details */}
      {hoveredCompetency && (
        <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg border">
          {(() => {
            const competencyData = radarData.find(d => d.competency === hoveredCompetency)
            if (!competencyData) return null

            const improvement = improvementAreas.find(area => area.competency === hoveredCompetency)
            const strength = strengthAreas.find(area => area.competency === hoveredCompetency)

            return (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {formatCompetencyLabel(hoveredCompetency)}
                </h4>
                
                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{competencyData.current}%</div>
                    <div className="text-gray-500">Current</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{competencyData.target}%</div>
                    <div className="text-gray-500">Target</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-600">{competencyData.benchmark}%</div>
                    <div className="text-gray-500">Benchmark</div>
                  </div>
                </div>

                {improvement && (
                  <div className="mb-2">
                    <div className="text-xs text-amber-700 font-medium mb-1">Development Focus:</div>
                    <div className="text-sm text-gray-600">{improvement.specificFocus}</div>
                  </div>
                )}

                {strength && (
                  <div>
                    <div className="text-xs text-green-700 font-medium mb-1">Leverage Opportunity:</div>
                    <div className="text-sm text-gray-600">{strength.leverageOpportunities[0]}</div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Scale indicators */}
      <div className="flex items-center justify-between w-full max-w-xs text-xs text-gray-500">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

// Generate radar data from improvement and strength areas
const generateRadarData = (
  improvementAreas: ImprovementArea[],
  strengthAreas: StrengthArea[]
): RadarData[] => {
  const competencies = ['COMMUNICATION', 'STAKEHOLDER_MANAGEMENT', 'BUSINESS_IMPACT', 'TECHNICAL_TRANSLATION', 'STRATEGIC_THINKING']
  
  return competencies.map(competency => {
    const improvement = improvementAreas.find(area => area.competency === competency)
    const strength = strengthAreas.find(area => area.competency === competency)

    let current = 70 // default
    let target = 80 // default
    let benchmark = 75 // default
    let category: RadarData['category'] = 'neutral'

    if (improvement) {
      current = improvement.currentLevel
      target = improvement.targetLevel
      benchmark = 75 // industry benchmark
      category = 'improvement'
    } else if (strength) {
      current = strength.currentLevel
      target = Math.min(100, current + 10)
      benchmark = strength.benchmarkComparison
      category = 'strength'
    }

    return {
      competency,
      current,
      target,
      benchmark,
      category
    }
  })
}

// Format competency labels for display
const formatCompetencyLabel = (competency: string): string => {
  const labels: { [key: string]: string } = {
    'COMMUNICATION': 'Communication',
    'STAKEHOLDER_MANAGEMENT': 'Stakeholder Mgmt',
    'BUSINESS_IMPACT': 'Business Impact',
    'TECHNICAL_TRANSLATION': 'Tech Translation',
    'STRATEGIC_THINKING': 'Strategic Thinking'
  }
  return labels[competency] || competency.replace('_', ' ')
}

export default CompetencyRadar