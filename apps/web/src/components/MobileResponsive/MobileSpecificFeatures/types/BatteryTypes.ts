/**
 * Battery Optimization Types
 * ShipSpeak - Mobile battery optimization type definitions
 */

export interface BatteryStatus {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  isSupported: boolean
}

export interface OptimizationMode {
  mode: 'PERFORMANCE' | 'BALANCED' | 'BATTERY_SAVER' | 'ULTRA_SAVER'
  enableAnimations: boolean
  enableBackgroundProcessing: boolean
  enableAutoSync: boolean
  screenBrightness: number
  processingThrottle: number
  networkOptimization: boolean
}

export interface PowerConsumption {
  cpu: number
  screen: number
  network: number
  audio: number
  total: number
  trend: 'INCREASING' | 'STABLE' | 'DECREASING'
}

export interface MobileBatteryOptimizerProps {
  children: React.ReactNode
  onBatteryLow?: (batteryLevel: number) => void
  onOptimizationChange?: (mode: OptimizationMode) => void
  enableAutoOptimization?: boolean
  lowBatteryThreshold?: number
  criticalBatteryThreshold?: number
}

export interface BatteryContextValue {
  batteryStatus: BatteryStatus
  optimizationMode: OptimizationMode
  powerConsumption: PowerConsumption
  setOptimizationMode: (mode: OptimizationMode) => void
  isLowPower: boolean
  isCriticalPower: boolean
}