/**
 * Battery Optimization Presets
 * ShipSpeak - Predefined battery optimization configurations
 */

import { OptimizationMode } from '../types/BatteryTypes'

export const optimizationPresets: Record<string, OptimizationMode> = {
  PERFORMANCE: {
    mode: 'PERFORMANCE',
    enableAnimations: true,
    enableBackgroundProcessing: true,
    enableAutoSync: true,
    screenBrightness: 1.0,
    processingThrottle: 1.0,
    networkOptimization: false
  },
  
  BALANCED: {
    mode: 'BALANCED',
    enableAnimations: true,
    enableBackgroundProcessing: true,
    enableAutoSync: true,
    screenBrightness: 0.85,
    processingThrottle: 0.85,
    networkOptimization: true
  },
  
  BATTERY_SAVER: {
    mode: 'BATTERY_SAVER',
    enableAnimations: false,
    enableBackgroundProcessing: false,
    enableAutoSync: false,
    screenBrightness: 0.65,
    processingThrottle: 0.65,
    networkOptimization: true
  },
  
  ULTRA_SAVER: {
    mode: 'ULTRA_SAVER',
    enableAnimations: false,
    enableBackgroundProcessing: false,
    enableAutoSync: false,
    screenBrightness: 0.45,
    processingThrottle: 0.45,
    networkOptimization: true
  }
}

export const getOptimizationPreset = (mode: string): OptimizationMode => {
  return optimizationPresets[mode] || optimizationPresets.BALANCED
}

export const getRecommendedMode = (batteryLevel: number, charging: boolean): string => {
  if (charging) return 'PERFORMANCE'
  if (batteryLevel > 70) return 'PERFORMANCE'
  if (batteryLevel > 40) return 'BALANCED'
  if (batteryLevel > 15) return 'BATTERY_SAVER'
  return 'ULTRA_SAVER'
}

export const getModeDescription = (mode: string): string => {
  const descriptions = {
    PERFORMANCE: 'Maximum performance with full features enabled',
    BALANCED: 'Optimized balance between performance and battery life',
    BATTERY_SAVER: 'Extended battery life with reduced performance',
    ULTRA_SAVER: 'Maximum battery conservation for critical situations'
  }
  
  return descriptions[mode as keyof typeof descriptions] || descriptions.BALANCED
}

export const getModeIcon = (mode: string): string => {
  const icons = {
    PERFORMANCE: '🚀',
    BALANCED: '⚖️',
    BATTERY_SAVER: '🔋',
    ULTRA_SAVER: '🌙'
  }
  
  return icons[mode as keyof typeof icons] || icons.BALANCED
}