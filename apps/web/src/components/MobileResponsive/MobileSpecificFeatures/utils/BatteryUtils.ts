/**
 * Battery Utility Functions
 * ShipSpeak - Battery monitoring and power consumption utilities
 */

import { BatteryStatus, PowerConsumption } from '../types/BatteryTypes'

export const getBatteryInfo = async (): Promise<BatteryStatus> => {
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery()
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        isSupported: true
      }
    } catch (error) {
      console.warn('Battery API not supported:', error)
      return getFallbackBatteryStatus()
    }
  }
  
  return getFallbackBatteryStatus()
}

export const getFallbackBatteryStatus = (): BatteryStatus => ({
  level: 85, // Assume reasonable battery level
  charging: false,
  chargingTime: Infinity,
  dischargingTime: Infinity,
  isSupported: false
})

export const estimatePowerConsumption = (): PowerConsumption => {
  // Simulate realistic power consumption patterns
  const cpu = Math.random() * 25 + 15 // 15-40% CPU usage
  const screen = Math.random() * 20 + 20 // 20-40% screen usage
  const network = Math.random() * 10 + 5 // 5-15% network usage
  const audio = Math.random() * 8 + 2 // 2-10% audio usage
  const total = cpu + screen + network + audio

  return {
    cpu: Math.round(cpu * 10) / 10,
    screen: Math.round(screen * 10) / 10,
    network: Math.round(network * 10) / 10,
    audio: Math.round(audio * 10) / 10,
    total: Math.round(total * 10) / 10,
    trend: total > 65 ? 'INCREASING' : total > 35 ? 'STABLE' : 'DECREASING'
  }
}

export const calculateBatteryTimeRemaining = (
  batteryLevel: number, 
  powerConsumption: PowerConsumption
): string => {
  if (batteryLevel <= 0) return '0 minutes'
  
  // Estimate based on power consumption (simplified model)
  const consumptionRate = powerConsumption.total / 100 // % per hour
  const hoursRemaining = batteryLevel / consumptionRate
  
  if (hoursRemaining > 24) return '24+ hours'
  if (hoursRemaining > 1) return `${Math.round(hoursRemaining)} hours`
  
  const minutesRemaining = Math.round(hoursRemaining * 60)
  return `${Math.max(minutesRemaining, 1)} minutes`
}

export const getBatteryLevelColor = (level: number, charging: boolean): string => {
  if (charging) return '#10b981' // Green when charging
  if (level > 50) return '#3b82f6' // Blue for good battery
  if (level > 20) return '#f59e0b' // Yellow for medium battery
  return '#ef4444' // Red for low battery
}

export const formatPowerUsage = (usage: number): string => {
  return `${usage.toFixed(1)}%`
}

export const isBatterySupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'getBattery' in navigator
}