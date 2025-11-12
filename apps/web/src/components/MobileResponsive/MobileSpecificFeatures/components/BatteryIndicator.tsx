/**
 * Battery Indicator Component
 * ShipSpeak - Visual battery status indicator with charging animation
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { BatteryStatus } from '../types/BatteryTypes'
import { getBatteryLevelColor, calculateBatteryTimeRemaining } from '../utils/BatteryUtils'

interface BatteryIndicatorProps {
  batteryStatus: BatteryStatus
  powerConsumption?: { total: number }
  showDetails?: boolean
  compact?: boolean
}

export const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({
  batteryStatus,
  powerConsumption = { total: 25 },
  showDetails = false,
  compact = false
}) => {
  const batteryColor = getBatteryLevelColor(batteryStatus.level, batteryStatus.charging)
  const timeRemaining = calculateBatteryTimeRemaining(batteryStatus.level, { 
    ...powerConsumption, 
    cpu: 15, 
    screen: 20, 
    network: 8, 
    audio: 2 
  } as any)

  const getBatteryIcon = () => {
    if (batteryStatus.charging) return '🔌'
    if (batteryStatus.level > 75) return '🔋'
    if (batteryStatus.level > 50) return '🔋'
    if (batteryStatus.level > 25) return '🪫'
    return '🪫'
  }

  const getBatteryStatusText = () => {
    if (batteryStatus.charging) {
      if (batteryStatus.chargingTime !== Infinity) {
        const hours = Math.floor(batteryStatus.chargingTime / 3600)
        const minutes = Math.floor((batteryStatus.chargingTime % 3600) / 60)
        return `${hours}h ${minutes}m to full`
      }
      return 'Charging...'
    }
    return timeRemaining
  }

  const getStatusAriaLabel = () => {
    const status = batteryStatus.charging ? 'charging' : 'discharging'
    const level = Math.round(batteryStatus.level)
    return `Battery ${status} at ${level}%, ${getBatteryStatusText()}`
  }

  if (compact) {
    return (
      <div 
        className="battery-indicator compact"
        role="status"
        aria-label={getStatusAriaLabel()}
        title={getStatusAriaLabel()}
      >
        <div className="battery-icon-simple" style={{ color: batteryColor }}>
          {getBatteryIcon()}
        </div>
        <span className="battery-percentage">
          {Math.round(batteryStatus.level)}%
        </span>
        
        <style jsx>{`
          .battery-indicator.compact {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.875rem;
            color: #64748b;
          }

          .battery-icon-simple {
            font-size: 1rem;
          }

          .battery-percentage {
            font-weight: 500;
            color: ${batteryColor};
          }
        `}</style>
      </div>
    )
  }

  return (
    <div 
      className="battery-indicator"
      role="status"
      aria-label={getStatusAriaLabel()}
    >
      <div className="battery-display">
        <div className="battery-icon" style={{ borderColor: batteryColor }}>
          <div 
            className="battery-fill"
            style={{ 
              width: `${batteryStatus.level}%`,
              backgroundColor: batteryColor 
            }}
          />
          <div className="battery-tip" style={{ backgroundColor: batteryColor }} />
          
          {batteryStatus.charging && (
            <div className="charging-indicator" aria-hidden="true">
              ⚡
            </div>
          )}
        </div>

        <div className="battery-info">
          <div className="battery-level" style={{ color: batteryColor }}>
            {Math.round(batteryStatus.level)}%
          </div>
          
          {showDetails && (
            <div className="battery-status-text">
              {getBatteryStatusText()}
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="battery-details" role="complementary" aria-label="Battery details">
          <div className="detail-item">
            <span>Status:</span>
            <span>{batteryStatus.charging ? 'Charging' : 'On Battery'}</span>
          </div>
          
          {!batteryStatus.charging && (
            <div className="detail-item">
              <span>Time Remaining:</span>
              <span>{timeRemaining}</span>
            </div>
          )}
          
          {batteryStatus.charging && batteryStatus.chargingTime !== Infinity && (
            <div className="detail-item">
              <span>Time to Full:</span>
              <span>{getBatteryStatusText()}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span>Power Usage:</span>
            <span>{powerConsumption.total.toFixed(1)}%</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .battery-indicator {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          min-width: 200px;
        }

        .battery-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .battery-icon {
          position: relative;
          width: 40px;
          height: 22px;
          border: 2px solid #64748b;
          border-radius: 4px;
          background: white;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .battery-icon::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
          width: 4px;
          height: 10px;
          background: currentColor;
          border-radius: 0 2px 2px 0;
        }

        .battery-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
          border-radius: 1px;
        }

        .battery-tip {
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
          width: 4px;
          height: 10px;
          border-radius: 0 2px 2px 0;
          transition: background-color 0.3s ease;
        }

        .charging-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.75rem;
          color: #fbbf24;
          animation: pulse 1.5s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }

        .battery-info {
          flex: 1;
        }

        .battery-level {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .battery-status-text {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1;
        }

        .battery-details {
          border-top: 1px solid #e5e7eb;
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .detail-item span:first-child {
          color: #64748b;
          font-weight: 500;
        }

        .detail-item span:last-child {
          color: #334155;
          font-weight: 600;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .battery-indicator {
            min-width: 180px;
          }
          
          .battery-icon {
            width: 36px;
            height: 20px;
          }
          
          .battery-level {
            font-size: 1rem;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .battery-icon {
            border-width: 3px;
          }
          
          .charging-indicator {
            text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .battery-fill,
          .battery-tip {
            transition: none;
          }
          
          .charging-indicator {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default BatteryIndicator