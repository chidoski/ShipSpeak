'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { CompetencyRadarData, CompetencyCategory } from '@/types/competency'

interface RadarChartProps {
  data: CompetencyRadarData
  size?: number
  executive?: boolean
  interactive?: boolean
  showLabels?: boolean
  onCompetencyClick?: (category: CompetencyCategory) => void
}

export function RadarChart({ 
  data, 
  size = 240, 
  executive = false,
  interactive = true,
  showLabels = true,
  onCompetencyClick 
}: RadarChartProps) {
  const [hoveredCategory, setHoveredCategory] = useState<CompetencyCategory | null>(null)
  
  const center = size / 2
  const radius = (size / 2) - 40
  
  // Convert competency data to radar chart points
  const competencies: Array<{ key: CompetencyCategory; label: string; value: number }> = [
    { key: 'product-sense', label: 'Product Sense', value: data.productSense },
    { key: 'communication', label: 'Communication', value: data.communication },
    { key: 'stakeholder', label: 'Stakeholder', value: data.stakeholder },
    { key: 'technical', label: 'Technical', value: data.technical },
    { key: 'business', label: 'Business', value: data.business },
  ]

  // Calculate points for pentagon shape
  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2 // Start from top
    const distance = (value / 100) * radius
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    }
  }

  // Calculate label positions (slightly outside the chart)
  const getLabelPoint = (index: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2
    const distance = radius + 25
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    }
  }

  // Generate pentagon grid lines
  const gridLevels = [20, 40, 60, 80, 100]
  
  const generateGridPath = (level: number) => {
    const points = Array.from({ length: 5 }, (_, i) => getPoint(i, level))
    const path = points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ') + ' Z'
    return path
  }

  // Generate axis lines
  const axisLines = Array.from({ length: 5 }, (_, i) => {
    const endPoint = getPoint(i, 100)
    return { x1: center, y1: center, x2: endPoint.x, y2: endPoint.y }
  })

  // Generate data polygon
  const dataPoints = competencies.map((comp, i) => getPoint(i, comp.value))
  const dataPath = dataPoints.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ') + ' Z'

  const getCompetencyColor = (category: CompetencyCategory, value: number) => {
    const colors = {
      'product-sense': value >= 80 ? '#3b82f6' : value >= 60 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444',
      'communication': value >= 80 ? '#3b82f6' : value >= 60 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444',
      'stakeholder': value >= 80 ? '#3b82f6' : value >= 60 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444',
      'technical': value >= 80 ? '#3b82f6' : value >= 60 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444',
      'business': value >= 80 ? '#3b82f6' : value >= 60 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444',
    }
    return colors[category]
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid lines */}
        {gridLevels.map((level) => (
          <path
            key={level}
            d={generateGridPath(level)}
            fill="none"
            stroke={executive ? '#475569' : '#e2e8f0'}
            strokeWidth="1"
            strokeOpacity={level === 100 ? 0.8 : 0.3}
          />
        ))}
        
        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={executive ? '#475569' : '#e2e8f0'}
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        ))}
        
        {/* Data area */}
        <path
          d={dataPath}
          fill={executive ? '#3b82f6' : '#3b82f6'}
          fillOpacity="0.2"
          stroke={executive ? '#3b82f6' : '#3b82f6'}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        
        {/* Data points */}
        {dataPoints.map((point, i) => {
          const competency = competencies[i]
          const isHovered = hoveredCategory === competency.key
          
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={isHovered ? 6 : 4}
              fill={getCompetencyColor(competency.key, competency.value)}
              stroke="white"
              strokeWidth="2"
              className={clsx(
                'transition-all duration-200',
                interactive && 'cursor-pointer hover:r-6'
              )}
              onMouseEnter={() => interactive && setHoveredCategory(competency.key)}
              onMouseLeave={() => interactive && setHoveredCategory(null)}
              onClick={() => interactive && onCompetencyClick?.(competency.key)}
            />
          )
        })}
        
        {/* Labels */}
        {showLabels && competencies.map((competency, i) => {
          const labelPoint = getLabelPoint(i)
          const isHovered = hoveredCategory === competency.key
          
          return (
            <g key={competency.key}>
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={clsx(
                  'text-xs font-medium transition-all duration-200',
                  isHovered ? 'text-executive-primary' : 'text-executive-text-secondary',
                  interactive && 'cursor-pointer'
                )}
                onMouseEnter={() => interactive && setHoveredCategory(competency.key)}
                onMouseLeave={() => interactive && setHoveredCategory(null)}
                onClick={() => interactive && onCompetencyClick?.(competency.key)}
              >
                {competency.label}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className={clsx(
                  'text-xs font-semibold',
                  isHovered ? 'text-executive-primary' : 'text-executive-text-muted'
                )}
              >
                {competency.value}%
              </text>
            </g>
          )
        })}
      </svg>
      
      {/* Legend for executive mode */}
      {executive && (
        <div className="flex items-center space-x-4 text-xs text-executive-text-secondary">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Foundation (0-39%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Practice (40-59%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Mastery (60-79%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Executive (80-100%)</span>
          </div>
        </div>
      )}
    </div>
  )
}