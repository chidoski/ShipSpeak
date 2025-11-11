/**
 * Mobile Radar Charts for ShipSpeak
 * Touch-optimized skill progression visualizations with gesture support
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { TouchGestureManager } from '../TouchOptimizedComponents/TouchGestureManager'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface SkillData {
  label: string
  value: number
  maxValue: number
  color: string
  industry?: string
  careerLevel?: string
}

interface MobileRadarChartProps {
  data: SkillData[]
  size?: number
  interactive?: boolean
  showLabels?: boolean
  showValues?: boolean
  onSkillTap?: (skill: SkillData, index: number) => void
  careerContext?: {
    currentRole: string
    targetRole: string
    industry: string
  }
}

// =============================================================================
// MOBILE RADAR CHART COMPONENT
// =============================================================================

export const MobileRadarChart: React.FC<MobileRadarChartProps> = ({
  data,
  size = 280,
  interactive = true,
  showLabels = true,
  showValues = true,
  onSkillTap,
  careerContext
}) => {
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const center = size / 2
  const maxRadius = (size - 80) / 2
  const numberOfSkills = data.length

  // =============================================================================
  // CHART CALCULATIONS
  // =============================================================================

  const getPointPosition = (index: number, value: number, maxValue: number, radius: number) => {
    const angle = (index / numberOfSkills) * 2 * Math.PI - Math.PI / 2
    const normalizedValue = (value / maxValue)
    const distance = radius * normalizedValue

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
      angle,
      distance
    }
  }

  const getLabelPosition = (index: number, radius: number, offset: number = 20) => {
    const angle = (index / numberOfSkills) * 2 * Math.PI - Math.PI / 2
    const labelRadius = radius + offset

    return {
      x: center + Math.cos(angle) * labelRadius,
      y: center + Math.sin(angle) * labelRadius,
      angle
    }
  }

  // =============================================================================
  // INTERACTION HANDLERS
  // =============================================================================

  const handleSkillInteraction = (index: number, skill: SkillData) => {
    if (!interactive) return

    setSelectedSkill(selectedSkill === index ? null : index)
    onSkillTap?.(skill, index)

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const handlePinchGesture = (event: any) => {
    if (!interactive) return

    const newScale = Math.max(0.5, Math.min(2, scale + (event.deltaY > 0 ? -0.1 : 0.1)))
    setScale(newScale)
  }

  const handleSwipeGesture = (event: any) => {
    if (!interactive || data.length === 0) return

    const currentIndex = selectedSkill || 0
    let newIndex: number

    if (event.direction === 'LEFT') {
      newIndex = (currentIndex + 1) % data.length
    } else if (event.direction === 'RIGHT') {
      newIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1
    } else {
      return
    }

    handleSkillInteraction(newIndex, data[newIndex])
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderGridLines = () => {
    const gridLevels = 5
    const gridLines = []

    for (let i = 1; i <= gridLevels; i++) {
      const radius = (maxRadius / gridLevels) * i
      const points = []

      for (let j = 0; j < numberOfSkills; j++) {
        const pos = getPointPosition(j, 100, 100, radius)
        points.push(`${pos.x},${pos.y}`)
      }

      gridLines.push(
        <polygon
          key={`grid-${i}`}
          points={points.join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeOpacity={0.5}
        />
      )
    }

    return gridLines
  }

  const renderAxes = () => {
    return data.map((_, index) => {
      const pos = getPointPosition(index, 100, 100, maxRadius)
      return (
        <line
          key={`axis-${index}`}
          x1={center}
          y1={center}
          x2={pos.x}
          y2={pos.y}
          stroke="#d1d5db"
          strokeWidth="1"
          strokeOpacity={0.6}
        />
      )
    })
  }

  const renderDataPolygon = () => {
    const points = data.map((skill, index) => {
      const pos = getPointPosition(index, skill.value, skill.maxValue, maxRadius)
      return `${pos.x},${pos.y}`
    }).join(' ')

    return (
      <polygon
        points={points}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3b82f6"
        strokeWidth="2"
        className="data-polygon"
      />
    )
  }

  const renderDataPoints = () => {
    return data.map((skill, index) => {
      const pos = getPointPosition(index, skill.value, skill.maxValue, maxRadius)
      const isSelected = selectedSkill === index

      return (
        <g key={`point-${index}`}>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={isSelected ? 8 : 6}
            fill={skill.color || '#3b82f6'}
            stroke="white"
            strokeWidth="2"
            className={`data-point ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSkillInteraction(index, skill)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          />
          {showValues && (
            <text
              x={pos.x}
              y={pos.y - 12}
              textAnchor="middle"
              fill="#374151"
              fontSize="10"
              fontWeight="600"
              className="point-value"
            >
              {skill.value}
            </text>
          )}
        </g>
      )
    })
  }

  const renderLabels = () => {
    if (!showLabels) return null

    return data.map((skill, index) => {
      const pos = getLabelPosition(index, maxRadius, 25)
      const isSelected = selectedSkill === index

      return (
        <text
          key={`label-${index}`}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isSelected ? '#3b82f6' : '#374151'}
          fontSize={isSelected ? '12' : '11'}
          fontWeight={isSelected ? '600' : '500'}
          className={`skill-label ${isSelected ? 'selected' : ''}`}
          onClick={() => handleSkillInteraction(index, skill)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          {skill.label}
        </text>
      )
    })
  }

  const renderSelectedSkillDetails = () => {
    if (selectedSkill === null) return null

    const skill = data[selectedSkill]
    const percentage = Math.round((skill.value / skill.maxValue) * 100)

    return (
      <div className="selected-skill-details">
        <div className="skill-name">{skill.label}</div>
        <div className="skill-value">
          <span className="value">{skill.value}</span>
          <span className="separator">/</span>
          <span className="max-value">{skill.maxValue}</span>
          <span className="percentage">({percentage}%)</span>
        </div>
        {careerContext && (
          <div className="skill-context">
            <span className="context-role">{careerContext.currentRole} → {careerContext.targetRole}</span>
            <span className="context-industry">{careerContext.industry}</span>
          </div>
        )}
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      className="mobile-radar-chart"
      data-testid="mobile-radar-chart"
      style={{ width: size, height: size + 100 }}
    >
      <TouchGestureManager
        onPinch={handlePinchGesture}
        onSwipeLeft={handleSwipeGesture}
        onSwipeRight={handleSwipeGesture}
        onTap={(e) => setSelectedSkill(null)}
      >
        <div className="chart-container" style={{ transform: `scale(${scale})` }}>
          <svg
            ref={svgRef}
            width={size}
            height={size}
            className="radar-chart-svg"
            viewBox={`0 0 ${size} ${size}`}
          >
            {renderGridLines()}
            {renderAxes()}
            {renderDataPolygon()}
            {renderDataPoints()}
            {renderLabels()}
          </svg>
        </div>
      </TouchGestureManager>

      {/* Selected Skill Details */}
      {renderSelectedSkillDetails()}

      {/* Instructions */}
      {interactive && (
        <div className="chart-instructions">
          <span>Tap skills for details • Pinch to zoom • Swipe to navigate</span>
        </div>
      )}

      <style jsx>{`
        .mobile-radar-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          user-select: none;
          -webkit-user-select: none;
        }

        .chart-container {
          transition: transform 0.2s ease;
          transform-origin: center;
        }

        .radar-chart-svg {
          overflow: visible;
        }

        .data-polygon {
          transition: all 0.3s ease;
        }

        .data-point {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .data-point:hover {
          transform: scale(1.2);
        }

        .data-point.selected {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
        }

        .skill-label {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .skill-label:hover {
          fill: #3b82f6;
        }

        .skill-label.selected {
          font-weight: 600;
          fill: #3b82f6;
        }

        .point-value {
          pointer-events: none;
        }

        .selected-skill-details {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          text-align: center;
          min-width: 200px;
          margin-top: 0.5rem;
        }

        .skill-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .skill-value {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
        }

        .separator {
          color: #64748b;
        }

        .max-value {
          color: #64748b;
        }

        .percentage {
          font-size: 0.875rem;
          color: #10b981;
          font-weight: 600;
        }

        .skill-context {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .context-role {
          font-size: 0.875rem;
          font-weight: 500;
          color: #3b82f6;
        }

        .context-industry {
          font-size: 0.75rem;
          color: #64748b;
        }

        .chart-instructions {
          font-size: 0.75rem;
          color: #64748b;
          text-align: center;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-top: 0.5rem;
        }

        /* Touch optimizations */
        @media (max-width: 480px) {
          .mobile-radar-chart {
            font-size: 0.875rem;
          }
          
          .skill-label {
            font-size: 10px !important;
          }
          
          .selected-skill-details {
            min-width: 180px;
            padding: 0.75rem;
          }
        }

        /* Animation optimizations for performance */
        @media (prefers-reduced-motion: reduce) {
          .data-polygon,
          .data-point,
          .skill-label,
          .chart-container {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}