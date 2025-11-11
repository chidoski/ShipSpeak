/**
 * Progress Circle Component for ShipSpeak
 * Reusable circular progress indicator with percentage display
 * Max 100 lines for efficiency and maintainability
 */

'use client'

import React from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ProgressCircleProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div 
      className={`progress-circle ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="progress-text">
        {Math.round(progress)}%
      </div>
      
      <style jsx>{`
        .progress-circle {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .progress-text {
          position: absolute;
          font-size: ${size > 60 ? '0.875rem' : '0.75rem'};
          font-weight: 600;
          color: #1F2937;
        }
      `}</style>
    </div>
  )
}