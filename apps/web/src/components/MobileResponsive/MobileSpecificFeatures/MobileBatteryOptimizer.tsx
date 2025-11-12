/**
 * Mobile Battery Optimizer - Main Orchestrator
 * ShipSpeak - Battery usage optimization for extended PM practice sessions
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { MobileBatteryOptimizerProps, BatteryStatus, OptimizationMode, PowerConsumption } from './types/BatteryTypes'
import { getBatteryInfo, estimatePowerConsumption } from './utils/BatteryUtils'
import { optimizationPresets, getRecommendedMode, getModeDescription, getModeIcon } from './config/BatteryOptimizationPresets'
import BatteryIndicator from './components/BatteryIndicator'
import PowerConsumptionDisplay from './components/PowerConsumptionDisplay'
import { batteryOptimizerStyles } from './styles/BatteryOptimizerStyles'

export const MobileBatteryOptimizer: React.FC<MobileBatteryOptimizerProps> = ({
  children,
  onBatteryLow,
  onOptimizationChange,
  enableAutoOptimization = true,
  lowBatteryThreshold = 20,
  criticalBatteryThreshold = 5
}) => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>({
    level: 85,
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    isSupported: false
  })
  
  const [currentOptimization, setCurrentOptimization] = useState<OptimizationMode>(
    optimizationPresets.BALANCED
  )
  
  const [powerConsumption, setPowerConsumption] = useState<PowerConsumption>(
    estimatePowerConsumption()
  )
  
  const [showOptimizationPanel, setShowOptimizationPanel] = useState(false)

  // Update battery info periodically
  useEffect(() => {
    const updateBatteryInfo = async () => {
      const info = await getBatteryInfo()
      setBatteryStatus(info)
      
      // Trigger low battery callback
      if (info.level <= lowBatteryThreshold && !info.charging) {
        onBatteryLow?.(info.level)
      }
    }

    updateBatteryInfo()
    const interval = setInterval(updateBatteryInfo, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [lowBatteryThreshold, onBatteryLow])

  // Update power consumption periodically
  useEffect(() => {
    const updatePowerConsumption = () => {
      setPowerConsumption(estimatePowerConsumption())
    }

    const interval = setInterval(updatePowerConsumption, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Auto-optimization based on battery level
  useEffect(() => {
    if (!enableAutoOptimization) return

    const recommendedMode = getRecommendedMode(batteryStatus.level, batteryStatus.charging)
    const newOptimization = optimizationPresets[recommendedMode]
    
    if (newOptimization.mode !== currentOptimization.mode) {
      setCurrentOptimization(newOptimization)
      onOptimizationChange?.(newOptimization)
    }
  }, [batteryStatus, enableAutoOptimization, currentOptimization.mode, onOptimizationChange])

  // Handle manual optimization mode change
  const handleOptimizationChange = useCallback((mode: OptimizationMode) => {
    setCurrentOptimization(mode)
    onOptimizationChange?.(mode)
    setShowOptimizationPanel(false)
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, [onOptimizationChange])

  // Handle keyboard navigation for optimization panel
  const handleKeyDown = useCallback((event: React.KeyboardEvent, mode: OptimizationMode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOptimizationChange(mode)
    }
  }, [handleOptimizationChange])

  const calculateEstimatedRuntime = (): string => {
    const baseRuntime = 8 // 8 hours base
    const optimizationMultiplier = currentOptimization.processingThrottle
    const batteryMultiplier = batteryStatus.level / 100
    
    const estimatedHours = baseRuntime * optimizationMultiplier * batteryMultiplier
    const hours = Math.floor(estimatedHours)
    const minutes = Math.round((estimatedHours - hours) * 60)
    
    return `${hours}h ${minutes}m`
  }

  const calculatePowerSavings = (): number => {
    const basePower = 100
    const currentPower = currentOptimization.processingThrottle * 100
    return Math.round(((basePower - currentPower) / basePower) * 100)
  }

  const renderOptimizationPanel = () => {
    if (!showOptimizationPanel) return null

    return (
      <div 
        className="optimization-panel" 
        role="dialog" 
        aria-label="Battery optimization settings"
        aria-modal="true"
      >
        <div className="panel-header">
          <h3>Battery Optimization</h3>
          <button 
            className="close-button"
            onClick={() => setShowOptimizationPanel(false)}
            aria-label="Close optimization panel"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            ✕
          </button>
        </div>

        <div className="optimization-modes" role="radiogroup" aria-label="Optimization modes">
          {Object.entries(optimizationPresets).map(([key, mode]) => (
            <button
              key={key}
              className={`mode-option ${currentOptimization.mode === mode.mode ? 'active' : ''}`}
              onClick={() => handleOptimizationChange(mode)}
              onKeyDown={(e) => handleKeyDown(e, mode)}
              role="radio"
              aria-checked={currentOptimization.mode === mode.mode}
              aria-label={`${mode.mode.replace('_', ' ')} mode: ${getModeDescription(mode.mode)}`}
              style={{ minHeight: '44px' }}
            >
              <div className="mode-header">
                <span className="mode-icon" aria-hidden="true">{getModeIcon(mode.mode)}</span>
                <span className="mode-name">{mode.mode.replace('_', ' ')}</span>
              </div>
              <span className="mode-description">{getModeDescription(mode.mode)}</span>
            </button>
          ))}
        </div>

        <PowerConsumptionDisplay
          powerConsumption={powerConsumption}
          optimizationMode={currentOptimization}
          estimatedRuntime={calculateEstimatedRuntime()}
          powerSavings={calculatePowerSavings()}
        />
      </div>
    )
  }

  const isLowPower = batteryStatus.level <= lowBatteryThreshold && !batteryStatus.charging
  const isCriticalPower = batteryStatus.level <= criticalBatteryThreshold && !batteryStatus.charging

  return (
    <div 
      className="mobile-battery-optimizer"
      data-testid="mobile-battery-optimizer"
      data-battery-level={Math.round(batteryStatus.level)}
      data-optimization-mode={currentOptimization.mode}
      data-charging={batteryStatus.charging}
      role="main"
      aria-label="Battery optimized PM practice interface"
    >
      {/* Battery Status Bar */}
      {batteryStatus.isSupported && (
        <div className="battery-status-bar" role="banner">
          <BatteryIndicator 
            batteryStatus={batteryStatus} 
            powerConsumption={powerConsumption}
            compact 
          />
          
          {isLowPower && (
            <button 
              className="optimize-button"
              onClick={() => setShowOptimizationPanel(true)}
              aria-label="Open battery optimization settings"
              style={{ minHeight: '44px' }}
            >
              Optimize Battery
            </button>
          )}
        </div>
      )}

      {/* Critical Battery Warning */}
      {isCriticalPower && (
        <div className="critical-battery-warning" role="alert" aria-live="assertive">
          <span className="warning-icon" aria-hidden="true">🔋</span>
          <span>Critical battery level! Ultra power saving mode activated.</span>
        </div>
      )}

      {/* Optimization Panel */}
      {renderOptimizationPanel()}

      {/* Optimized Content */}
      <div className={`battery-optimized-content ${currentOptimization.mode.toLowerCase()}`}>
        {children}
      </div>

      <style jsx>{batteryOptimizerStyles}</style>
    </div>
  )
}

export default MobileBatteryOptimizer