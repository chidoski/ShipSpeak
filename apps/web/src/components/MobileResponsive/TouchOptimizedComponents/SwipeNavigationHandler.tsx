/**
 * Swipe Navigation Handler for ShipSpeak Mobile
 * Gesture-based navigation for mobile content with PM-specific navigation patterns
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useCallback, useRef, useState } from 'react'
import { TouchGestureManager } from './TouchGestureManager'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface NavigationRoute {
  id: string
  path: string
  label: string
  icon: string
  swipeDirection?: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN'
  priority: number
}

interface SwipeNavigationConfig {
  enableTabSwipe: boolean
  enablePageSwipe: boolean
  enableVerticalSwipe: boolean
  swipeThreshold: number
  animationDuration: number
}

interface SwipeNavigationHandlerProps {
  children: React.ReactNode
  routes: NavigationRoute[]
  currentRoute: string
  onNavigate: (routeId: string) => void
  config?: Partial<SwipeNavigationConfig>
  disabled?: boolean
}

interface SwipeState {
  isActive: boolean
  direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | null
  progress: number
  targetRoute: string | null
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const defaultConfig: SwipeNavigationConfig = {
  enableTabSwipe: true,
  enablePageSwipe: true,
  enableVerticalSwipe: false,
  swipeThreshold: 50,
  animationDuration: 300
}

// =============================================================================
// SWIPE NAVIGATION HANDLER COMPONENT
// =============================================================================

export const SwipeNavigationHandler: React.FC<SwipeNavigationHandlerProps> = ({
  children,
  routes,
  currentRoute,
  onNavigate,
  config,
  disabled = false
}) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isActive: false,
    direction: null,
    progress: 0,
    targetRoute: null
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const mergedConfig = { ...defaultConfig, ...config }
  const sortedRoutes = routes.sort((a, b) => a.priority - b.priority)

  // =============================================================================
  // NAVIGATION HELPERS
  // =============================================================================

  const getCurrentRouteIndex = useCallback(() => {
    return sortedRoutes.findIndex(route => route.id === currentRoute)
  }, [sortedRoutes, currentRoute])

  const getTargetRoute = useCallback((direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN') => {
    const currentIndex = getCurrentRouteIndex()
    
    if (direction === 'LEFT' && mergedConfig.enableTabSwipe) {
      // Swipe left = next route
      const nextIndex = currentIndex + 1
      return nextIndex < sortedRoutes.length ? sortedRoutes[nextIndex] : null
    }
    
    if (direction === 'RIGHT' && mergedConfig.enableTabSwipe) {
      // Swipe right = previous route
      const prevIndex = currentIndex - 1
      return prevIndex >= 0 ? sortedRoutes[prevIndex] : null
    }
    
    if ((direction === 'UP' || direction === 'DOWN') && mergedConfig.enableVerticalSwipe) {
      // Vertical swipe for special routes
      return sortedRoutes.find(route => route.swipeDirection === direction) || null
    }
    
    return null
  }, [getCurrentRouteIndex, sortedRoutes, mergedConfig])

  const getSwipeProgress = useCallback((deltaX: number, deltaY: number, direction: string) => {
    const containerWidth = containerRef.current?.offsetWidth || 300
    const containerHeight = containerRef.current?.offsetHeight || 600
    
    if (direction === 'LEFT' || direction === 'RIGHT') {
      return Math.min(Math.abs(deltaX) / containerWidth, 1)
    } else {
      return Math.min(Math.abs(deltaY) / containerHeight, 1)
    }
  }, [])

  // =============================================================================
  // GESTURE HANDLERS
  // =============================================================================

  const handleSwipeStart = useCallback((event: any) => {
    if (disabled) return

    const direction = event.direction as 'LEFT' | 'RIGHT' | 'UP' | 'DOWN'
    const targetRoute = getTargetRoute(direction)
    
    if (!targetRoute) return

    setSwipeState({
      isActive: true,
      direction,
      progress: 0,
      targetRoute: targetRoute.id
    })

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25)
    }
  }, [disabled, getTargetRoute])

  const handleSwipeMove = useCallback((event: any) => {
    if (disabled || !swipeState.isActive || !swipeState.direction) return

    const progress = getSwipeProgress(event.deltaX, event.deltaY, swipeState.direction)
    
    setSwipeState(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(1, progress))
    }))
  }, [disabled, swipeState.isActive, swipeState.direction, getSwipeProgress])

  const handleSwipeEnd = useCallback((event: any) => {
    if (disabled || !swipeState.isActive) return

    const finalProgress = getSwipeProgress(event.deltaX, event.deltaY, event.direction)
    const threshold = mergedConfig.swipeThreshold / 100
    
    if (finalProgress >= threshold && swipeState.targetRoute) {
      // Complete navigation
      onNavigate(swipeState.targetRoute)
      
      // Strong haptic feedback for successful navigation
      if (navigator.vibrate) {
        navigator.vibrate([50, 25, 50])
      }
    }

    // Reset swipe state
    setSwipeState({
      isActive: false,
      direction: null,
      progress: 0,
      targetRoute: null
    })
  }, [disabled, swipeState, getSwipeProgress, mergedConfig.swipeThreshold, onNavigate])

  const handlePan = useCallback((event: any) => {
    if (disabled) return

    if (!swipeState.isActive) {
      handleSwipeStart(event)
    } else {
      handleSwipeMove(event)
    }
  }, [disabled, swipeState.isActive, handleSwipeStart, handleSwipeMove])

  // =============================================================================
  // VISUAL INDICATORS
  // =============================================================================

  const renderSwipeIndicator = () => {
    if (!swipeState.isActive || !swipeState.targetRoute) return null

    const targetRoute = routes.find(r => r.id === swipeState.targetRoute)
    if (!targetRoute) return null

    const opacity = Math.min(swipeState.progress * 2, 1)
    const scale = 0.8 + (swipeState.progress * 0.2)

    return (
      <div 
        className="swipe-indicator"
        style={{ 
          opacity,
          transform: `scale(${scale})`,
          [swipeState.direction === 'LEFT' ? 'right' : 
           swipeState.direction === 'RIGHT' ? 'left' :
           swipeState.direction === 'UP' ? 'bottom' : 'top']: '2rem'
        }}
      >
        <div className="indicator-content">
          <span className="indicator-icon">{targetRoute.icon}</span>
          <span className="indicator-label">{targetRoute.label}</span>
        </div>
        <div 
          className="indicator-progress"
          style={{ width: `${swipeState.progress * 100}%` }}
        />
      </div>
    )
  }

  const renderNavigationHints = () => {
    const currentIndex = getCurrentRouteIndex()
    const prevRoute = currentIndex > 0 ? sortedRoutes[currentIndex - 1] : null
    const nextRoute = currentIndex < sortedRoutes.length - 1 ? sortedRoutes[currentIndex + 1] : null

    if (!prevRoute && !nextRoute) return null

    return (
      <div className="navigation-hints">
        {prevRoute && (
          <div className="hint hint-left">
            <span className="hint-arrow">←</span>
            <span className="hint-text">{prevRoute.label}</span>
          </div>
        )}
        {nextRoute && (
          <div className="hint hint-right">
            <span className="hint-text">{nextRoute.label}</span>
            <span className="hint-arrow">→</span>
          </div>
        )}
      </div>
    )
  }

  // =============================================================================
  // ACCESSIBILITY
  // =============================================================================

  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (disabled) return

    const currentIndex = getCurrentRouteIndex()
    
    if (event.key === 'ArrowLeft' && currentIndex > 0) {
      event.preventDefault()
      onNavigate(sortedRoutes[currentIndex - 1].id)
    } else if (event.key === 'ArrowRight' && currentIndex < sortedRoutes.length - 1) {
      event.preventDefault()
      onNavigate(sortedRoutes[currentIndex + 1].id)
    }
  }, [disabled, getCurrentRouteIndex, sortedRoutes, onNavigate])

  // =============================================================================
  // EFFECTS
  // =============================================================================

  React.useEffect(() => {
    if (disabled) return

    document.addEventListener('keydown', handleKeyboardNavigation)
    return () => document.removeEventListener('keydown', handleKeyboardNavigation)
  }, [disabled, handleKeyboardNavigation])

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div
      ref={containerRef}
      className={`swipe-navigation-handler ${swipeState.isActive ? 'swiping' : ''}`}
      data-testid="swipe-navigation-handler"
      data-current-route={currentRoute}
      data-swiping={swipeState.isActive}
    >
      <TouchGestureManager
        onPan={handlePan}
        onTouchEnd={handleSwipeEnd}
        disabled={disabled}
        config={{
          swipeThreshold: mergedConfig.swipeThreshold,
          panThreshold: 10
        }}
      >
        <div className="navigation-content">
          {children}
        </div>
      </TouchGestureManager>

      {/* Visual Indicators */}
      {renderSwipeIndicator()}
      {!swipeState.isActive && renderNavigationHints()}

      {/* Styles */}
      <style jsx>{`
        .swipe-navigation-handler {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .swipe-navigation-handler.swiping {
          user-select: none;
          -webkit-user-select: none;
        }

        .navigation-content {
          width: 100%;
          height: 100%;
          transition: transform ${mergedConfig.animationDuration}ms ease-out;
          transform: translateX(${swipeState.isActive ? 
            (swipeState.direction === 'LEFT' ? `-${swipeState.progress * 20}px` :
             swipeState.direction === 'RIGHT' ? `${swipeState.progress * 20}px` : '0px') : '0px'});
        }

        .swipe-indicator {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          backdrop-filter: blur(10px);
          z-index: 100;
          min-width: 120px;
          transition: all 0.2s ease;
        }

        .indicator-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .indicator-icon {
          font-size: 1.5rem;
        }

        .indicator-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          text-align: center;
        }

        .indicator-progress {
          height: 3px;
          background: #3b82f6;
          border-radius: 1.5px;
          transition: width 0.1s ease;
        }

        .navigation-hints {
          position: absolute;
          bottom: 2rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 2rem;
          pointer-events: none;
          z-index: 50;
        }

        .hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .hint:hover {
          opacity: 1;
        }

        .hint-arrow {
          font-weight: bold;
          font-size: 1rem;
        }

        .hint-text {
          font-weight: 500;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .hint-left {
          flex-direction: row;
        }

        .hint-right {
          flex-direction: row-reverse;
        }

        /* Touch feedback */
        .swipe-navigation-handler.swiping .navigation-content {
          filter: brightness(0.95);
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .navigation-content,
          .swipe-indicator,
          .hint {
            transition: none !important;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .navigation-hints {
            bottom: 1rem;
            padding: 0 1rem;
          }
          
          .hint {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }
          
          .hint-text {
            max-width: 60px;
          }
          
          .swipe-indicator {
            min-width: 100px;
            padding: 0.75rem;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .swipe-indicator {
            border-width: 2px;
            border-color: #000;
          }
          
          .hint {
            background: #000;
            border: 1px solid #fff;
          }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// HOOK FOR SWIPE NAVIGATION
// =============================================================================

export const useSwipeNavigation = (routes: NavigationRoute[]) => {
  const [currentRoute, setCurrentRoute] = useState(routes[0]?.id || '')
  
  const navigate = useCallback((routeId: string) => {
    const route = routes.find(r => r.id === routeId)
    if (route) {
      setCurrentRoute(routeId)
    }
  }, [routes])
  
  return {
    currentRoute,
    navigate,
    routes: routes.sort((a, b) => a.priority - b.priority)
  }
}