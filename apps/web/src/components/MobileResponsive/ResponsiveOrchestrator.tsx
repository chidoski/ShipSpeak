/**
 * Responsive Orchestrator for ShipSpeak Mobile Experience
 * Core mobile responsive layout management with PM-specific optimization
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ScreenSize {
  breakpoint: 'MOBILE' | 'TABLET' | 'DESKTOP'
  width: number
  height: number
  density: number
  safeAreaInsets: SafeAreaInsets
}

interface SafeAreaInsets {
  top: number
  bottom: number
  left: number
  right: number
}

interface TouchCapability {
  touchSupported: boolean
  gestureRecognition: GestureType[]
  hapticFeedback: boolean
  pressureSensitivity: boolean
}

type GestureType = 'TAP' | 'SWIPE' | 'PINCH' | 'LONG_PRESS'

interface DeviceOptimization {
  deviceType: 'iOS' | 'Android' | 'Web'
  browserOptimization: BrowserOptimization
  performanceLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  batteryOptimization: boolean
}

interface BrowserOptimization {
  userAgent: string
  supportsPWA: boolean
  supportsWebShare: boolean
  supportsVibration: boolean
}

interface MobileResponsiveProps {
  screenSize: ScreenSize
  orientation: 'PORTRAIT' | 'LANDSCAPE'
  touchCapability: TouchCapability
  deviceOptimization: DeviceOptimization
}

interface ResponsiveOrchestratorProps {
  children: React.ReactNode
  onResponsiveChange?: (responsive: MobileResponsiveProps) => void
}

// =============================================================================
// MOBILE DETECTION UTILITIES
// =============================================================================

const detectDeviceType = (): DeviceOptimization['deviceType'] => {
  if (typeof window === 'undefined') return 'Web'
  
  const userAgent = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS'
  if (/Android/i.test(userAgent)) return 'Android'
  return 'Web'
}

const detectTouchCapability = (): TouchCapability => {
  if (typeof window === 'undefined') {
    return {
      touchSupported: false,
      gestureRecognition: [],
      hapticFeedback: false,
      pressureSensitivity: false
    }
  }

  const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const hapticFeedback = 'vibrate' in navigator
  
  return {
    touchSupported,
    gestureRecognition: touchSupported ? ['TAP', 'SWIPE', 'PINCH', 'LONG_PRESS'] : ['TAP'],
    hapticFeedback,
    pressureSensitivity: false // Complex to detect, default to false
  }
}

const detectBrowserOptimization = (): BrowserOptimization => {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      supportsPWA: false,
      supportsWebShare: false,
      supportsVibration: false
    }
  }

  return {
    userAgent: navigator.userAgent,
    supportsPWA: 'serviceWorker' in navigator,
    supportsWebShare: 'share' in navigator,
    supportsVibration: 'vibrate' in navigator
  }
}

const getBreakpoint = (width: number): ScreenSize['breakpoint'] => {
  if (width < 768) return 'MOBILE'
  if (width < 1024) return 'TABLET'
  return 'DESKTOP'
}

const getPerformanceLevel = (): DeviceOptimization['performanceLevel'] => {
  if (typeof window === 'undefined') return 'MEDIUM'
  
  // Basic performance detection based on hardware concurrency and memory
  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as any).deviceMemory || 4
  
  if (cores >= 8 && memory >= 8) return 'HIGH'
  if (cores >= 4 && memory >= 4) return 'MEDIUM'
  return 'LOW'
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ResponsiveOrchestrator: React.FC<ResponsiveOrchestratorProps> = ({
  children,
  onResponsiveChange
}) => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    breakpoint: 'DESKTOP',
    width: 1024,
    height: 768,
    density: 1,
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
  })
  
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('LANDSCAPE')
  const [touchCapability, setTouchCapability] = useState<TouchCapability>(detectTouchCapability())
  const [deviceOptimization, setDeviceOptimization] = useState<DeviceOptimization>({
    deviceType: 'Web',
    browserOptimization: detectBrowserOptimization(),
    performanceLevel: 'MEDIUM',
    batteryOptimization: false
  })

  // =============================================================================
  // RESPONSIVE DETECTION
  // =============================================================================

  const updateScreenSize = useCallback(() => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight
    const density = window.devicePixelRatio || 1
    
    // Detect safe area insets (for mobile devices with notches)
    const safeAreaInsets = {
      top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0'),
      bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left') || '0'),
      right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right') || '0')
    }

    const newScreenSize: ScreenSize = {
      breakpoint: getBreakpoint(width),
      width,
      height,
      density,
      safeAreaInsets
    }

    const newOrientation: 'PORTRAIT' | 'LANDSCAPE' = width < height ? 'PORTRAIT' : 'LANDSCAPE'

    setScreenSize(newScreenSize)
    setOrientation(newOrientation)

    // Trigger callback with updated responsive props
    if (onResponsiveChange) {
      onResponsiveChange({
        screenSize: newScreenSize,
        orientation: newOrientation,
        touchCapability,
        deviceOptimization
      })
    }
  }, [touchCapability, deviceOptimization, onResponsiveChange])

  // =============================================================================
  // DEVICE OPTIMIZATION DETECTION
  // =============================================================================

  useEffect(() => {
    const deviceType = detectDeviceType()
    const browserOptimization = detectBrowserOptimization()
    const performanceLevel = getPerformanceLevel()
    const touchCap = detectTouchCapability()
    
    // Battery optimization detection
    const batteryOptimization = deviceType !== 'Web' && touchCap.touchSupported

    setDeviceOptimization({
      deviceType,
      browserOptimization,
      performanceLevel,
      batteryOptimization
    })

    setTouchCapability(touchCap)
  }, [])

  // =============================================================================
  // RESPONSIVE EVENT LISTENERS
  // =============================================================================

  useEffect(() => {
    updateScreenSize()
    
    window.addEventListener('resize', updateScreenSize)
    window.addEventListener('orientationchange', updateScreenSize)
    
    return () => {
      window.removeEventListener('resize', updateScreenSize)
      window.removeEventListener('orientationchange', updateScreenSize)
    }
  }, [updateScreenSize])

  // =============================================================================
  // CSS CUSTOM PROPERTIES
  // =============================================================================

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--screen-width', `${screenSize.width}px`)
      document.documentElement.style.setProperty('--screen-height', `${screenSize.height}px`)
      document.documentElement.style.setProperty('--pixel-density', screenSize.density.toString())
      document.documentElement.style.setProperty('--safe-area-top', `${screenSize.safeAreaInsets.top}px`)
      document.documentElement.style.setProperty('--safe-area-bottom', `${screenSize.safeAreaInsets.bottom}px`)
      document.documentElement.style.setProperty('--safe-area-left', `${screenSize.safeAreaInsets.left}px`)
      document.documentElement.style.setProperty('--safe-area-right', `${screenSize.safeAreaInsets.right}px`)
      document.documentElement.style.setProperty('--is-mobile', screenSize.breakpoint === 'MOBILE' ? '1' : '0')
      document.documentElement.style.setProperty('--is-touch', touchCapability.touchSupported ? '1' : '0')
    }
  }, [screenSize, touchCapability])

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div 
      className={`responsive-orchestrator ${screenSize.breakpoint.toLowerCase()} ${orientation.toLowerCase()} ${deviceOptimization.deviceType.toLowerCase()}`}
      data-testid="responsive-orchestrator"
      data-breakpoint={screenSize.breakpoint}
      data-orientation={orientation}
      data-device={deviceOptimization.deviceType}
      data-performance={deviceOptimization.performanceLevel}
      data-touch={touchCapability.touchSupported}
    >
      {children}
      
      <style jsx>{`
        .responsive-orchestrator {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        /* Mobile-first responsive base styles */
        .responsive-orchestrator.mobile {
          --touch-target-size: 44px;
          --content-padding: 1rem;
          --font-scale: 1;
        }
        
        .responsive-orchestrator.tablet {
          --touch-target-size: 40px;
          --content-padding: 1.5rem;
          --font-scale: 1.1;
        }
        
        .responsive-orchestrator.desktop {
          --touch-target-size: 32px;
          --content-padding: 2rem;
          --font-scale: 1.2;
        }
        
        /* Touch-specific optimizations */
        .responsive-orchestrator[data-touch="true"] button,
        .responsive-orchestrator[data-touch="true"] .interactive {
          min-height: var(--touch-target-size);
          min-width: var(--touch-target-size);
          touch-action: manipulation;
        }
        
        /* Performance-based optimizations */
        .responsive-orchestrator[data-performance="LOW"] {
          --animation-duration: 0.15s;
          --blur-enabled: 0;
        }
        
        .responsive-orchestrator[data-performance="MEDIUM"] {
          --animation-duration: 0.2s;
          --blur-enabled: 0.5;
        }
        
        .responsive-orchestrator[data-performance="HIGH"] {
          --animation-duration: 0.3s;
          --blur-enabled: 1;
        }
        
        /* Safe area support for modern mobile devices */
        .responsive-orchestrator.mobile {
          padding-top: env(safe-area-inset-top, var(--safe-area-top));
          padding-bottom: env(safe-area-inset-bottom, var(--safe-area-bottom));
          padding-left: env(safe-area-inset-left, var(--safe-area-left));
          padding-right: env(safe-area-inset-right, var(--safe-area-right));
        }
      `}</style>
    </div>
  )
}