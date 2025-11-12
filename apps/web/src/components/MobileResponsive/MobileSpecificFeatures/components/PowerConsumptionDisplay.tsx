/**
 * Power Consumption Display Component
 * ShipSpeak - Real-time power usage visualization and optimization controls
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { PowerConsumption, OptimizationMode } from '../types/BatteryTypes'
import { formatPowerUsage } from '../utils/BatteryUtils'

interface PowerConsumptionDisplayProps {
  powerConsumption: PowerConsumption
  optimizationMode: OptimizationMode
  onOptimizationChange?: (mode: OptimizationMode) => void
  estimatedRuntime?: string
  powerSavings?: number
  compact?: boolean
}

export const PowerConsumptionDisplay: React.FC<PowerConsumptionDisplayProps> = ({
  powerConsumption,
  optimizationMode,
  onOptimizationChange,
  estimatedRuntime = '4h 30m',
  powerSavings = 25,
  compact = false
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'INCREASING': return { icon: '📈', color: '#ef4444', label: 'Power usage increasing' }
      case 'STABLE': return { icon: '➡️', color: '#3b82f6', label: 'Power usage stable' }
      case 'DECREASING': return { icon: '📉', color: '#10b981', label: 'Power usage decreasing' }
      default: return { icon: '➡️', color: '#64748b', label: 'Power trend unknown' }
    }
  }

  const getUsageColor = (usage: number): string => {
    if (usage > 30) return '#ef4444' // Red for high usage
    if (usage > 15) return '#f59e0b' // Yellow for medium usage
    return '#10b981' // Green for low usage
  }

  const renderUsageBar = (label: string, usage: number, icon: string) => {
    const color = getUsageColor(usage)
    const percentage = Math.min((usage / 40) * 100, 100) // Scale to 40% max for visual

    return (
      <div className="usage-item" role="listitem">
        <div className="usage-header">
          <span className="usage-icon" aria-hidden="true">{icon}</span>
          <span className="usage-label">{label}</span>
          <span className="usage-value" style={{ color }}>
            {formatPowerUsage(usage)}
          </span>
        </div>
        <div 
          className="usage-bar"
          role="progressbar"
          aria-label={`${label} power usage: ${formatPowerUsage(usage)}`}
          aria-valuenow={usage}
          aria-valuemax={40}
          aria-valuetext={`${formatPowerUsage(usage)} power usage`}
        >
          <div 
            className="usage-fill"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
    )
  }

  const trendInfo = getTrendIcon(powerConsumption.trend)

  if (compact) {
    return (
      <div 
        className="power-consumption compact"
        role="region"
        aria-label="Power consumption summary"
      >
        <div className="compact-summary">
          <div className="total-usage">
            <span className="total-label">Power:</span>
            <span className="total-value" style={{ color: getUsageColor(powerConsumption.total) }}>
              {formatPowerUsage(powerConsumption.total)}
            </span>
          </div>
          <div 
            className="trend-indicator"
            aria-label={trendInfo.label}
            title={trendInfo.label}
          >
            <span style={{ color: trendInfo.color }}>{trendInfo.icon}</span>
          </div>
        </div>

        <style jsx>{`
          .power-consumption.compact {
            background: white;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          }

          .compact-summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
          }

          .total-usage {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
          }

          .total-label {
            color: #64748b;
            font-weight: 500;
          }

          .total-value {
            font-weight: 600;
          }

          .trend-indicator {
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div 
      className="power-consumption"
      role="region"
      aria-label="Detailed power consumption and optimization"
    >
      <div className="power-header">
        <h3>Power Consumption</h3>
        <div 
          className="power-trend"
          aria-label={trendInfo.label}
          title={trendInfo.label}
        >
          <span className="trend-icon" style={{ color: trendInfo.color }}>
            {trendInfo.icon}
          </span>
          <span className="trend-text" style={{ color: trendInfo.color }}>
            {powerConsumption.trend.toLowerCase().replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="usage-breakdown" role="list" aria-label="Power usage breakdown">
        {renderUsageBar('CPU', powerConsumption.cpu, '🧠')}
        {renderUsageBar('Screen', powerConsumption.screen, '📱')}
        {renderUsageBar('Network', powerConsumption.network, '📶')}
        {renderUsageBar('Audio', powerConsumption.audio, '🔊')}
      </div>

      <div className="total-consumption">
        <div className="total-header">
          <span>Total Power Usage</span>
          <span 
            className="total-percentage"
            style={{ color: getUsageColor(powerConsumption.total) }}
          >
            {formatPowerUsage(powerConsumption.total)}
          </span>
        </div>
        <div 
          className="total-bar"
          role="progressbar"
          aria-label={`Total power consumption: ${formatPowerUsage(powerConsumption.total)}`}
          aria-valuenow={powerConsumption.total}
          aria-valuemax={100}
        >
          <div 
            className="total-fill"
            style={{ 
              width: `${Math.min(powerConsumption.total, 100)}%`,
              backgroundColor: getUsageColor(powerConsumption.total)
            }}
          />
        </div>
      </div>

      <div className="optimization-info">
        <div className="current-mode">
          <span>Current Mode:</span>
          <span className="mode-name">{optimizationMode.mode.replace('_', ' ')}</span>
        </div>
        
        <div className="estimates">
          <div className="estimate-item">
            <span>Estimated Runtime:</span>
            <span className="estimate-value">{estimatedRuntime}</span>
          </div>
          <div className="estimate-item">
            <span>Power Savings:</span>
            <span className="savings-value">{powerSavings}%</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .power-consumption {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .power-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .power-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .power-trend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .trend-icon {
          font-size: 1rem;
        }

        .usage-breakdown {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .usage-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .usage-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .usage-icon {
          font-size: 1rem;
        }

        .usage-label {
          flex: 1;
          margin-left: 0.5rem;
          color: #374151;
          font-weight: 500;
        }

        .usage-value {
          font-weight: 600;
        }

        .usage-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .usage-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .total-consumption {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .total-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .total-percentage {
          font-size: 1.125rem;
        }

        .total-bar {
          height: 10px;
          background: #e5e7eb;
          border-radius: 5px;
          overflow: hidden;
        }

        .total-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .optimization-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .current-mode {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          padding: 0.75rem;
          background: #f1f5f9;
          border-radius: 6px;
        }

        .mode-name {
          font-weight: 600;
          color: #3b82f6;
          text-transform: capitalize;
        }

        .estimates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .estimate-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          text-align: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 6px;
        }

        .estimate-item span:first-child {
          color: #64748b;
          font-weight: 500;
        }

        .estimate-value,
        .savings-value {
          color: #059669;
          font-weight: 700;
          font-size: 1rem;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .power-consumption {
            padding: 1rem;
          }

          .power-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .estimates {
            grid-template-columns: 1fr;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .usage-fill,
          .total-fill {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}

export default PowerConsumptionDisplay