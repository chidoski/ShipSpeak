/**
 * Mobile Contrast Optimizer for ShipSpeak  
 * Dynamic contrast and sizing for mobile visibility
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useEffect, useCallback, useState, useRef } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ContrastLevel {
  name: 'NORMAL' | 'HIGH' | 'MAXIMUM'
  label: string
  multiplier: number
  textScale: number
  backgroundOpacity: number
}

interface MobileContrastOptimizerProps {
  children: React.ReactNode
  onContrastChange?: (level: ContrastLevel) => void
  enableAutoAdjustment?: boolean
  pmIndustry?: 'healthcare' | 'fintech' | 'cybersecurity' | 'enterprise' | 'consumer'
}

interface AmbientLightReading {
  illuminance: number
  timestamp: number
  recommendation: ContrastLevel['name']
}

interface ColorScheme {
  primary: string
  secondary: string
  background: string
  text: string
  border: string
  accent: string
}

// =============================================================================
// CONTRAST LEVELS CONFIGURATION
// =============================================================================

const contrastLevels: ContrastLevel[] = [
  {
    name: 'NORMAL',
    label: 'Normal',
    multiplier: 1.0,
    textScale: 1.0,
    backgroundOpacity: 1.0
  },
  {
    name: 'HIGH',
    label: 'High Contrast',
    multiplier: 1.5,
    textScale: 1.1,
    backgroundOpacity: 0.95
  },
  {
    name: 'MAXIMUM',
    label: 'Maximum Contrast',
    multiplier: 2.0,
    textScale: 1.2,
    backgroundOpacity: 0.9
  }
]

// Industry-specific color schemes with high contrast support
const industryColorSchemes: Record<string, ColorScheme> = {
  healthcare: {
    primary: '#059669', // Medical green
    secondary: '#3b82f6', // Trust blue
    background: '#f8fafc',
    text: '#1e293b',
    border: '#e2e8f0',
    accent: '#dc2626' // Alert red
  },
  fintech: {
    primary: '#1d4ed8', // Finance blue
    secondary: '#059669', // Success green
    background: '#f9fafb',
    text: '#111827',
    border: '#d1d5db',
    accent: '#f59e0b' // Warning amber
  },
  cybersecurity: {
    primary: '#dc2626', // Security red
    secondary: '#f59e0b', // Warning amber
    background: '#0f172a',
    text: '#f8fafc',
    border: '#334155',
    accent: '#10b981' // Safe green
  },
  enterprise: {
    primary: '#6366f1', // Professional indigo
    secondary: '#8b5cf6', // Enterprise purple
    background: '#ffffff',
    text: '#374151',
    border: '#e5e7eb',
    accent: '#3b82f6' // Corporate blue
  },
  consumer: {
    primary: '#ec4899', // Consumer pink
    secondary: '#8b5cf6', // Engaging purple
    background: '#fefefe',
    text: '#1f2937',
    border: '#f3f4f6',
    accent: '#f59e0b' // Attention amber
  }
}

// =============================================================================
// MOBILE CONTRAST OPTIMIZER COMPONENT
// =============================================================================

export const MobileContrastOptimizer: React.FC<MobileContrastOptimizerProps> = ({
  children,
  onContrastChange,
  enableAutoAdjustment = true,
  pmIndustry = 'enterprise'
}) => {
  const [currentLevel, setCurrentLevel] = useState<ContrastLevel>(contrastLevels[0])
  const [ambientLight, setAmbientLight] = useState<number | null>(null)
  const [isAutoMode, setIsAutoMode] = useState(enableAutoAdjustment)
  const [colorScheme, setColorScheme] = useState<ColorScheme>(industryColorSchemes[pmIndustry])
  const [showSettings, setShowSettings] = useState(false)
  const [textSizeOverride, setTextSizeOverride] = useState(1.0)
  
  const sensorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // =============================================================================
  // AMBIENT LIGHT DETECTION
  // =============================================================================

  const initializeAmbientLightSensor = useCallback(() => {
    if (typeof window === 'undefined' || !('AmbientLightSensor' in window)) {
      console.log('Ambient Light Sensor not available, using fallback')
      return
    }

    try {
      const sensor = new (window as any).AmbientLightSensor({ frequency: 1 })
      
      sensor.onreading = () => {
        const illuminance = sensor.illuminance
        setAmbientLight(illuminance)
        
        if (isAutoMode) {
          const recommendedLevel = getRecommendedContrastLevel(illuminance)
          updateContrastLevel(recommendedLevel)
        }
      }

      sensor.onerror = (event: any) => {
        console.error('Ambient light sensor error:', event)
      }

      sensor.start()
      sensorRef.current = sensor
    } catch (error) {
      console.error('Failed to initialize ambient light sensor:', error)
    }
  }, [isAutoMode])

  const getRecommendedContrastLevel = (illuminance: number): ContrastLevel['name'] => {
    if (illuminance < 10) return 'MAXIMUM' // Very dark conditions
    if (illuminance < 100) return 'HIGH' // Low light conditions
    return 'NORMAL' // Normal lighting
  }

  // =============================================================================
  // CONTRAST MANAGEMENT
  // =============================================================================

  const updateContrastLevel = useCallback((levelName: ContrastLevel['name']) => {
    const level = contrastLevels.find(l => l.name === levelName) || contrastLevels[0]
    setCurrentLevel(level)
    onContrastChange?.(level)
    
    // Apply contrast changes to DOM
    if (containerRef.current) {
      applyContrastStyles(level)
    }
  }, [onContrastChange])

  const applyContrastStyles = (level: ContrastLevel) => {
    const root = document.documentElement
    const scheme = colorScheme
    
    // Base contrast multiplier
    const contrast = level.multiplier
    const textScale = level.textScale * textSizeOverride
    
    // Apply contrast-enhanced colors
    root.style.setProperty('--contrast-primary', adjustColorContrast(scheme.primary, contrast))
    root.style.setProperty('--contrast-secondary', adjustColorContrast(scheme.secondary, contrast))
    root.style.setProperty('--contrast-background', adjustColorContrast(scheme.background, contrast))
    root.style.setProperty('--contrast-text', adjustColorContrast(scheme.text, contrast))
    root.style.setProperty('--contrast-border', adjustColorContrast(scheme.border, contrast))
    root.style.setProperty('--contrast-accent', adjustColorContrast(scheme.accent, contrast))
    
    // Apply text scaling
    root.style.setProperty('--text-scale', textScale.toString())
    root.style.setProperty('--background-opacity', level.backgroundOpacity.toString())
    
    // Apply industry-specific visual enhancements
    applyIndustrySpecificStyles(pmIndustry, contrast)
  }

  const adjustColorContrast = (color: string, multiplier: number): string => {
    // Simple color contrast adjustment
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const num = parseInt(hex, 16)
      
      let r = (num >> 16) & 255
      let g = (num >> 8) & 255
      let b = num & 255
      
      // Enhance contrast based on luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      
      if (luminance > 0.5) {
        // Light colors: make darker for more contrast
        r = Math.max(0, Math.floor(r / multiplier))
        g = Math.max(0, Math.floor(g / multiplier))
        b = Math.max(0, Math.floor(b / multiplier))
      } else {
        // Dark colors: make lighter for more contrast
        r = Math.min(255, Math.floor(r * multiplier))
        g = Math.min(255, Math.floor(g * multiplier))
        b = Math.min(255, Math.floor(b * multiplier))
      }
      
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
    }
    return color
  }

  const applyIndustrySpecificStyles = (industry: string, contrast: number) => {
    const root = document.documentElement
    
    switch (industry) {
      case 'healthcare':
        // Enhance medical alert colors
        root.style.setProperty('--medical-alert', adjustColorContrast('#dc2626', contrast))
        root.style.setProperty('--medical-safe', adjustColorContrast('#059669', contrast))
        break
      
      case 'fintech':
        // Enhance financial data colors
        root.style.setProperty('--financial-gain', adjustColorContrast('#059669', contrast))
        root.style.setProperty('--financial-loss', adjustColorContrast('#dc2626', contrast))
        root.style.setProperty('--financial-neutral', adjustColorContrast('#6b7280', contrast))
        break
      
      case 'cybersecurity':
        // Enhance security status colors
        root.style.setProperty('--security-high', adjustColorContrast('#dc2626', contrast))
        root.style.setProperty('--security-medium', adjustColorContrast('#f59e0b', contrast))
        root.style.setProperty('--security-low', adjustColorContrast('#10b981', contrast))
        break
      
      case 'enterprise':
        // Enhance business metric colors
        root.style.setProperty('--metric-positive', adjustColorContrast('#059669', contrast))
        root.style.setProperty('--metric-negative', adjustColorContrast('#dc2626', contrast))
        root.style.setProperty('--metric-warning', adjustColorContrast('#f59e0b', contrast))
        break
      
      case 'consumer':
        // Enhance user experience colors
        root.style.setProperty('--ux-success', adjustColorContrast('#10b981', contrast))
        root.style.setProperty('--ux-error', adjustColorContrast('#ef4444', contrast))
        root.style.setProperty('--ux-info', adjustColorContrast('#3b82f6', contrast))
        break
    }
  }

  // =============================================================================
  // USER CONTROLS
  // =============================================================================

  const toggleAutoMode = useCallback(() => {
    setIsAutoMode(!isAutoMode)
    if (!isAutoMode && ambientLight !== null) {
      const recommendedLevel = getRecommendedContrastLevel(ambientLight)
      updateContrastLevel(recommendedLevel)
    }
  }, [isAutoMode, ambientLight, updateContrastLevel])

  const handleManualContrastChange = (levelName: ContrastLevel['name']) => {
    setIsAutoMode(false)
    updateContrastLevel(levelName)
  }

  const handleTextSizeChange = (scale: number) => {
    setTextSizeOverride(scale)
    applyContrastStyles(currentLevel)
  }

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    setColorScheme(industryColorSchemes[pmIndustry])
    applyContrastStyles(currentLevel)
  }, [pmIndustry])

  useEffect(() => {
    applyContrastStyles(currentLevel)
  }, [textSizeOverride])

  useEffect(() => {
    initializeAmbientLightSensor()
    applyContrastStyles(currentLevel)
    
    return () => {
      if (sensorRef.current) {
        try {
          sensorRef.current.stop()
        } catch (error) {
          console.error('Error stopping ambient light sensor:', error)
        }
      }
    }
  }, [initializeAmbientLightSensor])

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderContrastSettings = () => {
    if (!showSettings) return null

    return (
      <div className="contrast-settings-overlay" role="dialog" aria-label="Contrast settings">
        <div className="settings-content">
          <div className="settings-header">
            <h2>Display & Contrast Settings</h2>
            <button onClick={() => setShowSettings(false)} aria-label="Close settings">✕</button>
          </div>
          
          <div className="settings-body">
            <div className="setting-section">
              <label>
                <input
                  type="checkbox"
                  checked={isAutoMode}
                  onChange={toggleAutoMode}
                />
                Auto-adjust based on lighting
              </label>
              {ambientLight !== null && (
                <div className="light-reading">
                  Current light: {Math.round(ambientLight)} lux
                </div>
              )}
            </div>
            
            <div className="setting-section">
              <h3>Contrast Level</h3>
              {contrastLevels.map(level => (
                <label key={level.name} className="contrast-option">
                  <input
                    type="radio"
                    name="contrast"
                    checked={currentLevel.name === level.name}
                    onChange={() => handleManualContrastChange(level.name)}
                    disabled={isAutoMode}
                  />
                  {level.label}
                </label>
              ))}
            </div>
            
            <div className="setting-section">
              <h3>Text Size</h3>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                value={textSizeOverride}
                onChange={(e) => handleTextSizeChange(parseFloat(e.target.value))}
                aria-label="Text size multiplier"
              />
              <div className="range-labels">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      ref={containerRef}
      className="mobile-contrast-optimizer"
      data-testid="mobile-contrast-optimizer"
      data-contrast-level={currentLevel.name}
      data-auto-mode={isAutoMode}
      data-industry={pmIndustry}
    >
      {children}
      
      <button
        className="contrast-control-button"
        onClick={() => setShowSettings(true)}
        aria-label="Open contrast settings"
        data-testid="contrast-settings-button"
      >
        <div className="contrast-icon">◐</div>
      </button>

      {renderContrastSettings()}

      <style jsx global>{`
        .mobile-contrast-optimizer {
          width: 100%;
          height: 100%;
          transition: all 0.3s ease;
        }

        .contrast-control-button {
          position: fixed;
          bottom: 140px;
          right: 16px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--contrast-primary, #3b82f6);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .contrast-control-button:hover {
          transform: scale(1.1);
        }

        .contrast-icon {
          font-size: 24px;
          color: white;
        }

        .contrast-settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, var(--background-opacity, 0.8));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .settings-content {
          background: var(--contrast-background, white);
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          color: var(--contrast-text, #374151);
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--contrast-border, #e5e7eb);
        }

        .settings-header h2 {
          margin: 0;
          font-weight: 600;
          font-size: calc(1.125rem * var(--text-scale, 1));
        }

        .settings-header button {
          background: none;
          border: none;
          font-size: calc(1.25rem * var(--text-scale, 1));
          cursor: pointer;
          padding: 0.25rem;
          color: var(--contrast-text, #374151);
        }

        .settings-body {
          padding: 1.5rem;
        }

        .setting-section {
          margin-bottom: 1.5rem;
        }

        .setting-section h3 {
          margin: 0 0 0.75rem 0;
          font-weight: 500;
          font-size: calc(1rem * var(--text-scale, 1));
          color: var(--contrast-text, #374151);
        }

        .setting-section label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: calc(0.875rem * var(--text-scale, 1));
          color: var(--contrast-text, #374151);
        }

        .contrast-option {
          margin-bottom: 0.5rem;
        }

        .light-reading {
          font-size: calc(0.75rem * var(--text-scale, 1));
          color: var(--contrast-secondary, #6b7280);
          margin-top: 0.25rem;
        }

        .setting-section input[type="range"] {
          width: 100%;
          margin: 0.5rem 0;
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: calc(0.75rem * var(--text-scale, 1));
          color: var(--contrast-secondary, #6b7280);
        }

        /* Enhanced contrast styles */
        [data-contrast-level="HIGH"] {
          filter: contrast(1.5);
        }

        [data-contrast-level="MAXIMUM"] {
          filter: contrast(2.0);
        }

        /* Industry-specific enhancements */
        [data-industry="healthcare"] .medical-status {
          background: var(--medical-safe, #059669);
          color: white;
        }

        [data-industry="fintech"] .financial-metric {
          border-color: var(--financial-neutral, #6b7280);
        }

        [data-industry="cybersecurity"] .security-indicator {
          background: var(--security-low, #10b981);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .contrast-control-button {
            width: 44px;
            height: 44px;
            bottom: 120px;
            right: 12px;
          }

          .settings-content {
            margin: 0.5rem;
            max-height: 90vh;
          }

          .contrast-icon {
            font-size: 20px;
          }
        }

        /* High contrast mode override */
        @media (prefers-contrast: high) {
          .mobile-contrast-optimizer {
            filter: contrast(2.0);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .mobile-contrast-optimizer * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}