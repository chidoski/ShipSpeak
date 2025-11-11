/**
 * Touch Gesture Manager for ShipSpeak Mobile Experience
 * Comprehensive gesture recognition and handling system
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useRef, useEffect, useCallback } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface GestureEvent {
  type: GestureType
  startPoint: Point
  currentPoint: Point
  deltaX: number
  deltaY: number
  distance: number
  velocity: number
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  timestamp: number
  duration: number
}

interface Point {
  x: number
  y: number
}

type GestureType = 'TAP' | 'SWIPE' | 'PINCH' | 'LONG_PRESS' | 'PAN'

interface GestureConfig {
  swipeThreshold: number
  longPressDelay: number
  tapMaxDistance: number
  pinchThreshold: number
  panThreshold: number
}

interface TouchGestureManagerProps {
  children: React.ReactNode
  onGesture?: (event: GestureEvent) => void
  onSwipeLeft?: (event: GestureEvent) => void
  onSwipeRight?: (event: GestureEvent) => void
  onSwipeUp?: (event: GestureEvent) => void
  onSwipeDown?: (event: GestureEvent) => void
  onTap?: (event: GestureEvent) => void
  onLongPress?: (event: GestureEvent) => void
  onPinch?: (event: GestureEvent) => void
  onPan?: (event: GestureEvent) => void
  config?: Partial<GestureConfig>
  disabled?: boolean
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const defaultConfig: GestureConfig = {
  swipeThreshold: 50,
  longPressDelay: 500,
  tapMaxDistance: 10,
  pinchThreshold: 10,
  panThreshold: 10
}

// =============================================================================
// TOUCH GESTURE MANAGER COMPONENT
// =============================================================================

export const TouchGestureManager: React.FC<TouchGestureManagerProps> = ({
  children,
  onGesture,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  onPinch,
  onPan,
  config,
  disabled = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<Touch[]>([])
  const touchStartTimeRef = useRef<number>(0)
  const longPressTimeoutRef = useRef<NodeJS.Timeout>()
  const gestureStateRef = useRef<{
    isGesturing: boolean
    gestureType?: GestureType
    startPoint?: Point
    startDistance?: number
  }>({
    isGesturing: false
  })

  const mergedConfig = { ...defaultConfig, ...config }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const getDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }

  const getDirection = (deltaX: number, deltaY: number): GestureEvent['direction'] => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'RIGHT' : 'LEFT'
    } else {
      return deltaY > 0 ? 'DOWN' : 'UP'
    }
  }

  const getVelocity = (distance: number, duration: number): number => {
    return distance / Math.max(duration, 1)
  }

  const getTouchPoint = (touch: Touch): Point => ({
    x: touch.clientX,
    y: touch.clientY
  })

  const getTouchCenter = (touches: Touch[]): Point => {
    if (touches.length === 1) {
      return getTouchPoint(touches[0])
    }

    const totalX = touches.reduce((sum, touch) => sum + touch.clientX, 0)
    const totalY = touches.reduce((sum, touch) => sum + touch.clientY, 0)

    return {
      x: totalX / touches.length,
      y: totalY / touches.length
    }
  }

  const getTouchDistance = (touches: Touch[]): number => {
    if (touches.length < 2) return 0
    
    const p1 = getTouchPoint(touches[0])
    const p2 = getTouchPoint(touches[1])
    
    return getDistance(p1, p2)
  }

  // =============================================================================
  // GESTURE HANDLERS
  // =============================================================================

  const createGestureEvent = (
    type: GestureType,
    startPoint: Point,
    currentPoint: Point,
    startTime: number
  ): GestureEvent => {
    const deltaX = currentPoint.x - startPoint.x
    const deltaY = currentPoint.y - startPoint.y
    const distance = getDistance(startPoint, currentPoint)
    const duration = Date.now() - startTime
    const velocity = getVelocity(distance, duration)
    const direction = getDirection(deltaX, deltaY)

    return {
      type,
      startPoint,
      currentPoint,
      deltaX,
      deltaY,
      distance,
      velocity,
      direction,
      timestamp: Date.now(),
      duration
    }
  }

  const clearLongPressTimeout = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = undefined
    }
  }

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (disabled) return

    const touches = Array.from(event.touches)
    touchStartRef.current = touches
    touchStartTimeRef.current = Date.now()
    gestureStateRef.current.isGesturing = true
    gestureStateRef.current.startPoint = getTouchCenter(touches)

    if (touches.length === 2) {
      gestureStateRef.current.gestureType = 'PINCH'
      gestureStateRef.current.startDistance = getTouchDistance(touches)
    } else if (touches.length === 1) {
      // Set up long press detection
      longPressTimeoutRef.current = setTimeout(() => {
        if (gestureStateRef.current.isGesturing && gestureStateRef.current.startPoint) {
          const gestureEvent = createGestureEvent(
            'LONG_PRESS',
            gestureStateRef.current.startPoint,
            gestureStateRef.current.startPoint,
            touchStartTimeRef.current
          )
          
          onLongPress?.(gestureEvent)
          onGesture?.(gestureEvent)
          
          gestureStateRef.current.gestureType = 'LONG_PRESS'
        }
      }, mergedConfig.longPressDelay)
    }

    event.preventDefault()
  }, [disabled, onLongPress, onGesture, mergedConfig.longPressDelay])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (disabled || !gestureStateRef.current.isGesturing || !gestureStateRef.current.startPoint) {
      return
    }

    const touches = Array.from(event.touches)
    const currentPoint = getTouchCenter(touches)
    const { startPoint } = gestureStateRef.current

    if (touches.length === 2 && gestureStateRef.current.gestureType === 'PINCH') {
      const currentDistance = getTouchDistance(touches)
      const startDistance = gestureStateRef.current.startDistance || 0
      const deltaDistance = Math.abs(currentDistance - startDistance)

      if (deltaDistance > mergedConfig.pinchThreshold) {
        const gestureEvent = createGestureEvent(
          'PINCH',
          startPoint,
          currentPoint,
          touchStartTimeRef.current
        )

        onPinch?.(gestureEvent)
        onGesture?.(gestureEvent)
      }
    } else if (touches.length === 1) {
      const distance = getDistance(startPoint, currentPoint)

      // Clear long press if finger moves too much
      if (distance > mergedConfig.tapMaxDistance) {
        clearLongPressTimeout()
      }

      // Detect pan gesture
      if (distance > mergedConfig.panThreshold && gestureStateRef.current.gestureType !== 'LONG_PRESS') {
        if (!gestureStateRef.current.gestureType) {
          gestureStateRef.current.gestureType = 'PAN'
        }

        if (gestureStateRef.current.gestureType === 'PAN') {
          const gestureEvent = createGestureEvent(
            'PAN',
            startPoint,
            currentPoint,
            touchStartTimeRef.current
          )

          onPan?.(gestureEvent)
          onGesture?.(gestureEvent)
        }
      }
    }

    event.preventDefault()
  }, [disabled, onPinch, onPan, onGesture, mergedConfig.pinchThreshold, mergedConfig.panThreshold, mergedConfig.tapMaxDistance])

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (disabled || !gestureStateRef.current.isGesturing || !gestureStateRef.current.startPoint) {
      return
    }

    clearLongPressTimeout()

    const touches = Array.from(event.changedTouches)
    const endPoint = getTouchPoint(touches[0])
    const { startPoint, gestureType } = gestureStateRef.current
    const distance = getDistance(startPoint, endPoint)
    const deltaX = endPoint.x - startPoint.x
    const deltaY = endPoint.y - startPoint.y

    // Determine final gesture type
    if (!gestureType || gestureType === 'PAN') {
      if (distance < mergedConfig.tapMaxDistance) {
        // Tap gesture
        const gestureEvent = createGestureEvent(
          'TAP',
          startPoint,
          endPoint,
          touchStartTimeRef.current
        )

        onTap?.(gestureEvent)
        onGesture?.(gestureEvent)
      } else if (distance > mergedConfig.swipeThreshold) {
        // Swipe gesture
        const gestureEvent = createGestureEvent(
          'SWIPE',
          startPoint,
          endPoint,
          touchStartTimeRef.current
        )

        onGesture?.(gestureEvent)

        // Trigger direction-specific handlers
        const direction = getDirection(deltaX, deltaY)
        switch (direction) {
          case 'LEFT':
            onSwipeLeft?.(gestureEvent)
            break
          case 'RIGHT':
            onSwipeRight?.(gestureEvent)
            break
          case 'UP':
            onSwipeUp?.(gestureEvent)
            break
          case 'DOWN':
            onSwipeDown?.(gestureEvent)
            break
        }
      }
    }

    // Reset gesture state
    gestureStateRef.current = {
      isGesturing: false
    }

    event.preventDefault()
  }, [disabled, onTap, onGesture, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, mergedConfig.tapMaxDistance, mergedConfig.swipeThreshold])

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    const element = elementRef.current
    if (!element || disabled) return

    // Add passive: false to preventDefault on touch events
    const options = { passive: false }

    element.addEventListener('touchstart', handleTouchStart, options)
    element.addEventListener('touchmove', handleTouchMove, options)
    element.addEventListener('touchend', handleTouchEnd, options)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      clearLongPressTimeout()
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled])

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div
      ref={elementRef}
      data-testid="touch-gesture-manager"
      className="touch-gesture-container"
      style={{
        width: '100%',
        height: '100%',
        touchAction: disabled ? 'auto' : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'relative'
      }}
    >
      {children}
      
      <style jsx>{`
        .touch-gesture-container {
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// GESTURE HOOK FOR COMPONENTS
// =============================================================================

export const useGestureHandler = (config?: Partial<GestureConfig>) => {
  const gestureRef = useRef<HTMLDivElement>(null)
  
  const enableGestures = (handlers: Partial<TouchGestureManagerProps>) => {
    return {
      ref: gestureRef,
      ...handlers,
      config
    }
  }
  
  return { gestureRef, enableGestures }
}