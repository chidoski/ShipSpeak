/**
 * Touch Friendly Controls for ShipSpeak Mobile Experience
 * Large, accessible touch controls for all interactions with haptic feedback
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useCallback, useRef, useEffect } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface TouchFeedback {
  type: 'HAPTIC' | 'VISUAL' | 'AUDIO'
  intensity?: 'LIGHT' | 'MEDIUM' | 'HEAVY'
  duration?: number
}

interface TouchTargetProps {
  minimumSize: number
  tapAreaExpansion: number
  feedbackType: TouchFeedback
  onTouch?: (event: TouchEvent) => void
  disabled?: boolean
}

interface TouchButtonProps extends TouchTargetProps {
  children: React.ReactNode
  variant?: 'PRIMARY' | 'SECONDARY' | 'DANGER' | 'SUCCESS'
  size?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE'
  fullWidth?: boolean
  loading?: boolean
  onClick: (event: React.MouseEvent | TouchEvent) => void
  className?: string
  'aria-label'?: string
}

interface TouchSliderProps extends TouchTargetProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  showValue?: boolean
}

interface TouchSwitchProps extends TouchTargetProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: 'SMALL' | 'MEDIUM' | 'LARGE'
}

// =============================================================================
// HAPTIC FEEDBACK UTILITIES
// =============================================================================

const triggerHapticFeedback = (feedback: TouchFeedback) => {
  if (feedback.type !== 'HAPTIC' || typeof navigator === 'undefined' || !navigator.vibrate) {
    return
  }

  const patterns = {
    LIGHT: [10],
    MEDIUM: [25],
    HEAVY: [50]
  }

  const pattern = patterns[feedback.intensity || 'MEDIUM']
  navigator.vibrate(pattern)
}

const triggerVisualFeedback = (element: HTMLElement, feedback: TouchFeedback) => {
  if (feedback.type !== 'VISUAL') return

  element.style.transform = 'scale(0.95)'
  element.style.transition = 'transform 0.1s ease'
  
  setTimeout(() => {
    element.style.transform = 'scale(1)'
  }, feedback.duration || 100)
}

// =============================================================================
// TOUCH BUTTON COMPONENT
// =============================================================================

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'PRIMARY',
  size = 'MEDIUM',
  fullWidth = false,
  loading = false,
  onClick,
  minimumSize = 44,
  tapAreaExpansion = 8,
  feedbackType = { type: 'HAPTIC', intensity: 'MEDIUM' },
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleInteraction = useCallback((event: React.MouseEvent | TouchEvent) => {
    if (disabled || loading) return

    // Trigger feedback
    triggerHapticFeedback(feedbackType)
    
    if (buttonRef.current) {
      triggerVisualFeedback(buttonRef.current, feedbackType)
    }

    // Call the onClick handler
    onClick(event)
  }, [onClick, disabled, loading, feedbackType])

  const sizeClasses = {
    SMALL: 'touch-btn-small',
    MEDIUM: 'touch-btn-medium', 
    LARGE: 'touch-btn-large',
    EXTRA_LARGE: 'touch-btn-xl'
  }

  const variantClasses = {
    PRIMARY: 'touch-btn-primary',
    SECONDARY: 'touch-btn-secondary',
    DANGER: 'touch-btn-danger',
    SUCCESS: 'touch-btn-success'
  }

  return (
    <button
      ref={buttonRef}
      className={`touch-button ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'full-width' : ''} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''} ${className}`}
      onClick={handleInteraction}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      data-testid="touch-button"
      {...props}
    >
      {loading ? (
        <span className="loading-spinner" aria-hidden="true">⟳</span>
      ) : (
        children
      )}
      
      <style jsx>{`
        .touch-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          min-height: ${minimumSize}px;
          min-width: ${minimumSize}px;
          padding: ${tapAreaExpansion}px;
        }

        .touch-button:before {
          content: '';
          position: absolute;
          top: -${tapAreaExpansion}px;
          left: -${tapAreaExpansion}px;
          right: -${tapAreaExpansion}px;
          bottom: -${tapAreaExpansion}px;
          border-radius: inherit;
        }

        .touch-button:active {
          transform: scale(0.95);
        }

        .touch-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .touch-button.full-width {
          width: 100%;
        }

        /* Size variants */
        .touch-btn-small {
          font-size: 0.875rem;
          padding: 8px 16px;
          min-height: 36px;
        }

        .touch-btn-medium {
          font-size: 1rem;
          padding: 12px 24px;
          min-height: 44px;
        }

        .touch-btn-large {
          font-size: 1.125rem;
          padding: 16px 32px;
          min-height: 52px;
        }

        .touch-btn-xl {
          font-size: 1.25rem;
          padding: 20px 40px;
          min-height: 60px;
        }

        /* Color variants */
        .touch-btn-primary {
          background: #3b82f6;
          color: white;
        }

        .touch-btn-primary:hover:not(.disabled) {
          background: #2563eb;
        }

        .touch-btn-secondary {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
        }

        .touch-btn-secondary:hover:not(.disabled) {
          background: #e2e8f0;
        }

        .touch-btn-danger {
          background: #ef4444;
          color: white;
        }

        .touch-btn-danger:hover:not(.disabled) {
          background: #dc2626;
        }

        .touch-btn-success {
          background: #10b981;
          color: white;
        }

        .touch-btn-success:hover:not(.disabled) {
          background: #059669;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}

// =============================================================================
// TOUCH SLIDER COMPONENT
// =============================================================================

export const TouchSlider: React.FC<TouchSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  showValue = true,
  minimumSize = 44,
  feedbackType = { type: 'HAPTIC', intensity: 'LIGHT' },
  disabled = false
}) => {
  const sliderRef = useRef<HTMLInputElement>(null)
  const percentage = ((value - min) / (max - min)) * 100

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    triggerHapticFeedback(feedbackType)
    onChange(newValue)
  }

  return (
    <div className="touch-slider-container" data-testid="touch-slider">
      {label && (
        <label className="touch-slider-label">
          {label}
          {showValue && (
            <span className="touch-slider-value">{value}</span>
          )}
        </label>
      )}
      
      <div className="touch-slider-track">
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="touch-slider-input"
        />
        <div 
          className="touch-slider-fill"
          style={{ width: `${percentage}%` }}
        />
        <div 
          className="touch-slider-thumb"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <style jsx>{`
        .touch-slider-container {
          width: 100%;
          margin: 1rem 0;
        }

        .touch-slider-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .touch-slider-value {
          color: #3b82f6;
          font-weight: 600;
        }

        .touch-slider-track {
          position: relative;
          height: ${minimumSize}px;
          background: #f1f5f9;
          border-radius: ${minimumSize / 2}px;
          display: flex;
          align-items: center;
          padding: 0 ${minimumSize / 4}px;
        }

        .touch-slider-input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }

        .touch-slider-input:disabled {
          cursor: not-allowed;
        }

        .touch-slider-fill {
          position: absolute;
          left: ${minimumSize / 4}px;
          height: 8px;
          background: #3b82f6;
          border-radius: 4px;
          transition: width 0.2s ease;
        }

        .touch-slider-thumb {
          position: absolute;
          width: ${minimumSize - 8}px;
          height: ${minimumSize - 8}px;
          background: white;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          transform: translateX(-50%);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
          z-index: 1;
        }

        .touch-slider-input:active + .touch-slider-fill + .touch-slider-thumb {
          transform: translateX(-50%) scale(1.1);
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// TOUCH SWITCH COMPONENT
// =============================================================================

export const TouchSwitch: React.FC<TouchSwitchProps> = ({
  checked,
  onChange,
  label,
  size = 'MEDIUM',
  minimumSize = 44,
  feedbackType = { type: 'HAPTIC', intensity: 'MEDIUM' },
  disabled = false
}) => {
  const switchRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    if (disabled) return
    
    triggerHapticFeedback(feedbackType)
    
    if (switchRef.current) {
      triggerVisualFeedback(switchRef.current, feedbackType)
    }
    
    onChange(!checked)
  }

  const sizeConfig = {
    SMALL: { width: 36, height: 20, thumb: 16 },
    MEDIUM: { width: 44, height: 24, thumb: 20 },
    LARGE: { width: 52, height: 28, thumb: 24 }
  }

  const config = sizeConfig[size]

  return (
    <div className="touch-switch-container" data-testid="touch-switch">
      <div
        ref={switchRef}
        className={`touch-switch ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="touch-switch-thumb" />
      </div>
      
      {label && (
        <label className="touch-switch-label" onClick={handleToggle}>
          {label}
        </label>
      )}

      <style jsx>{`
        .touch-switch-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.5rem 0;
        }

        .touch-switch {
          position: relative;
          width: ${config.width}px;
          height: ${config.height}px;
          background: #e5e7eb;
          border-radius: ${config.height / 2}px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: ${minimumSize}px;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .touch-switch.checked {
          background: #3b82f6;
        }

        .touch-switch.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .touch-switch-thumb {
          width: ${config.thumb}px;
          height: ${config.thumb}px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transform: translateX(${checked ? config.width - config.thumb - 4 : 0}px);
        }

        .touch-switch-label {
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          user-select: none;
        }

        .touch-switch.disabled + .touch-switch-label {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}