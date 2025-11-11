/**
 * Mobile Performance Optimizer for ShipSpeak
 * Performance optimization for lower-end devices and battery management
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  cpuUsage: number
  batteryLevel?: number
  networkType: string
  renderTime: number
  componentCount: number
}

interface OptimizationSettings {
  enableAnimations: boolean
  enableBlur: boolean
  enableShadows: boolean
  imageQuality: 'LOW' | 'MEDIUM' | 'HIGH'
  animationDuration: number
  maxRenderComponents: number
  lazyLoadThreshold: number
}

interface MobilePerformanceOptimizerProps {
  children: React.ReactNode
  targetFPS?: number
  enableAutoOptimization?: boolean
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void
}

// =============================================================================
// PERFORMANCE MONITORING UTILITIES
// =============================================================================

const getMemoryUsage = (): number => {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    return memory.usedJSHeapSize / 1024 / 1024 // MB
  }
  return 0
}

const getBatteryInfo = async (): Promise<number | undefined> => {
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery()
      return battery.level * 100
    } catch {
      return undefined
    }
  }
  return undefined
}

const getNetworkType = (): string => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    return connection.effectiveType || 'unknown'
  }
  return 'unknown'
}

const measureRenderTime = (callback: () => void): number => {
  const start = performance.now()
  callback()
  return performance.now() - start
}

// =============================================================================
// MOBILE PERFORMANCE OPTIMIZER COMPONENT
// =============================================================================

export const MobilePerformanceOptimizer: React.FC<MobilePerformanceOptimizerProps> = ({
  children,
  targetFPS = 60,
  enableAutoOptimization = true,
  onPerformanceUpdate
}) => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    cpuUsage: 0,
    networkType: 'unknown',
    renderTime: 0,
    componentCount: 0
  })

  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    enableAnimations: true,
    enableBlur: true,
    enableShadows: true,
    imageQuality: 'HIGH',
    animationDuration: 300,
    maxRenderComponents: 50,
    lazyLoadThreshold: 100
  })

  const frameCountRef = useRef(0)
  const lastFrameTimeRef = useRef(performance.now())
  const fpsCalculationRef = useRef<number[]>([])
  const performanceMonitorRef = useRef<NodeJS.Timeout>()
  const renderTimeRef = useRef<number[]>([])

  // =============================================================================
  // FPS MONITORING
  // =============================================================================

  const calculateFPS = useCallback(() => {
    frameCountRef.current++
    const now = performance.now()
    const delta = now - lastFrameTimeRef.current

    if (delta >= 1000) { // Calculate FPS every second
      const currentFPS = Math.round((frameCountRef.current * 1000) / delta)
      fpsCalculationRef.current.push(currentFPS)
      
      // Keep only last 5 seconds of FPS data
      if (fpsCalculationRef.current.length > 5) {
        fpsCalculationRef.current.shift()
      }

      const averageFPS = fpsCalculationRef.current.reduce((sum, fps) => sum + fps, 0) / fpsCalculationRef.current.length

      setPerformanceMetrics(prev => ({
        ...prev,
        fps: Math.round(averageFPS)
      }))

      frameCountRef.current = 0
      lastFrameTimeRef.current = now
    }

    requestAnimationFrame(calculateFPS)
  }, [])

  // =============================================================================
  // PERFORMANCE OPTIMIZATION LOGIC
  // =============================================================================

  const optimizeForLowPerformance = useCallback(() => {
    setOptimizationSettings(prev => ({
      ...prev,
      enableAnimations: false,
      enableBlur: false,
      enableShadows: false,
      imageQuality: 'LOW',
      animationDuration: 150,
      maxRenderComponents: 25,
      lazyLoadThreshold: 50
    }))
  }, [])

  const optimizeForMediumPerformance = useCallback(() => {
    setOptimizationSettings(prev => ({
      ...prev,
      enableAnimations: true,
      enableBlur: false,
      enableShadows: false,
      imageQuality: 'MEDIUM',
      animationDuration: 200,
      maxRenderComponents: 35,
      lazyLoadThreshold: 75
    }))
  }, [])

  const optimizeForHighPerformance = useCallback(() => {
    setOptimizationSettings(prev => ({
      ...prev,
      enableAnimations: true,
      enableBlur: true,
      enableShadows: true,
      imageQuality: 'HIGH',
      animationDuration: 300,
      maxRenderComponents: 50,
      lazyLoadThreshold: 100
    }))
  }, [])

  const autoOptimize = useCallback(() => {
    const { fps, memoryUsage, batteryLevel } = performanceMetrics

    if (fps < 30 || memoryUsage > 100 || (batteryLevel && batteryLevel < 20)) {
      optimizeForLowPerformance()
    } else if (fps < 50 || memoryUsage > 50 || (batteryLevel && batteryLevel < 50)) {
      optimizeForMediumPerformance()
    } else {
      optimizeForHighPerformance()
    }
  }, [performanceMetrics, optimizeForLowPerformance, optimizeForMediumPerformance, optimizeForHighPerformance])

  // =============================================================================
  // PERFORMANCE MONITORING
  // =============================================================================

  const updatePerformanceMetrics = useCallback(async () => {
    const memoryUsage = getMemoryUsage()
    const batteryLevel = await getBatteryInfo()
    const networkType = getNetworkType()

    // Calculate average render time
    const averageRenderTime = renderTimeRef.current.length > 0
      ? renderTimeRef.current.reduce((sum, time) => sum + time, 0) / renderTimeRef.current.length
      : 0

    const newMetrics: PerformanceMetrics = {
      ...performanceMetrics,
      memoryUsage,
      batteryLevel,
      networkType,
      renderTime: averageRenderTime
    }

    setPerformanceMetrics(newMetrics)
    onPerformanceUpdate?.(newMetrics)

    // Clear render time history
    renderTimeRef.current = []
  }, [performanceMetrics, onPerformanceUpdate])

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    // Start FPS monitoring
    requestAnimationFrame(calculateFPS)

    // Start performance monitoring
    performanceMonitorRef.current = setInterval(updatePerformanceMetrics, 5000)

    return () => {
      if (performanceMonitorRef.current) {
        clearInterval(performanceMonitorRef.current)
      }
    }
  }, [calculateFPS, updatePerformanceMetrics])

  useEffect(() => {
    if (enableAutoOptimization) {
      autoOptimize()
    }
  }, [enableAutoOptimization, autoOptimize])

  // =============================================================================
  // CSS CUSTOM PROPERTIES
  // =============================================================================

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--animation-enabled', optimizationSettings.enableAnimations ? '1' : '0')
      document.documentElement.style.setProperty('--blur-enabled', optimizationSettings.enableBlur ? '1' : '0')
      document.documentElement.style.setProperty('--shadows-enabled', optimizationSettings.enableShadows ? '1' : '0')
      document.documentElement.style.setProperty('--animation-duration', `${optimizationSettings.animationDuration}ms`)
      document.documentElement.style.setProperty('--image-quality', optimizationSettings.imageQuality.toLowerCase())
    }
  }, [optimizationSettings])

  // =============================================================================
  // RENDER TIME TRACKING
  // =============================================================================

  const trackRenderTime = useCallback((renderFunction: () => void) => {
    const renderTime = measureRenderTime(renderFunction)
    renderTimeRef.current.push(renderTime)
    
    // Keep only last 10 render times
    if (renderTimeRef.current.length > 10) {
      renderTimeRef.current.shift()
    }
  }, [])

  // =============================================================================
  // PERFORMANCE CONTEXT
  // =============================================================================

  const performanceContext = {
    metrics: performanceMetrics,
    settings: optimizationSettings,
    trackRenderTime,
    optimizeForLowPerformance,
    optimizeForMediumPerformance,
    optimizeForHighPerformance
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div 
      className="mobile-performance-optimizer"
      data-testid="mobile-performance-optimizer"
      data-fps={performanceMetrics.fps}
      data-memory={Math.round(performanceMetrics.memoryUsage)}
      data-optimization={
        performanceMetrics.fps < 30 ? 'low' :
        performanceMetrics.fps < 50 ? 'medium' : 'high'
      }
    >
      {/* Performance Context Provider would go here in a real implementation */}
      <div className="performance-optimized-content">
        {children}
      </div>

      {/* Performance Debug Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="performance-debug-panel">
          <div className="debug-metric">
            <span>FPS:</span>
            <span className={performanceMetrics.fps < targetFPS ? 'warning' : 'good'}>
              {performanceMetrics.fps}
            </span>
          </div>
          <div className="debug-metric">
            <span>Memory:</span>
            <span className={performanceMetrics.memoryUsage > 100 ? 'warning' : 'good'}>
              {Math.round(performanceMetrics.memoryUsage)}MB
            </span>
          </div>
          <div className="debug-metric">
            <span>Render:</span>
            <span>{Math.round(performanceMetrics.renderTime)}ms</span>
          </div>
          {performanceMetrics.batteryLevel && (
            <div className="debug-metric">
              <span>Battery:</span>
              <span className={performanceMetrics.batteryLevel < 20 ? 'warning' : 'good'}>
                {Math.round(performanceMetrics.batteryLevel)}%
              </span>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .mobile-performance-optimizer {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .performance-optimized-content {
          width: 100%;
          height: 100%;
        }

        /* Global performance optimizations based on settings */
        .mobile-performance-optimizer[data-optimization="low"] {
          --animation-scale: 0;
          --blur-radius: 0px;
          --shadow-opacity: 0;
          --image-compression: 0.5;
        }

        .mobile-performance-optimizer[data-optimization="medium"] {
          --animation-scale: 0.5;
          --blur-radius: 2px;
          --shadow-opacity: 0.3;
          --image-compression: 0.7;
        }

        .mobile-performance-optimizer[data-optimization="high"] {
          --animation-scale: 1;
          --blur-radius: 8px;
          --shadow-opacity: 1;
          --image-compression: 1;
        }

        /* Apply performance optimizations to child elements */
        .mobile-performance-optimizer * {
          animation-duration: calc(var(--animation-duration, 300ms) * var(--animation-scale, 1));
          filter: blur(calc(var(--blur-radius, 0px) * var(--blur-enabled, 0)));
          box-shadow: var(--shadows-enabled, 1) == 1 ? 
            rgba(0,0,0,calc(0.1 * var(--shadow-opacity, 1))) 0 2px 8px : 
            none;
        }

        /* Debug panel styles */
        .performance-debug-panel {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 120px;
        }

        .debug-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .debug-metric .warning {
          color: #ef4444;
          font-weight: bold;
        }

        .debug-metric .good {
          color: #10b981;
        }

        /* Performance-based media queries */
        @media (max-width: 768px) and (max-resolution: 1.5dppx) {
          /* Low-end mobile optimizations */
          .mobile-performance-optimizer {
            --animation-scale: 0.5;
            --blur-radius: 0px;
            --shadow-opacity: 0.5;
          }
        }

        @media (max-width: 480px) {
          /* Extra small screen optimizations */
          .mobile-performance-optimizer {
            --animation-scale: 0.3;
            --blur-radius: 0px;
            --shadow-opacity: 0;
          }
        }

        /* Reduce motion for accessibility and performance */
        @media (prefers-reduced-motion: reduce) {
          .mobile-performance-optimizer * {
            animation-duration: 0ms !important;
            transition-duration: 0ms !important;
          }
        }

        /* Battery optimization */
        @media (prefers-reduced-motion: reduce), 
               (-webkit-animation-fill-mode: none) {
          .mobile-performance-optimizer {
            --animation-scale: 0;
          }
        }
      `}</style>
    </div>
  )
}