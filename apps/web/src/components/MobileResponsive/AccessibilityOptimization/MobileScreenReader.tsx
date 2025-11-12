/**
 * Mobile Screen Reader Optimization for ShipSpeak
 * Mobile screen reader compatibility with PM-specific content optimization
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useEffect, useCallback, useState, useRef } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ScreenReaderConfig {
  enableAnnouncements: boolean
  enableProgressAnnouncements: boolean
  enableNavigationAnnouncements: boolean
  announcementDelay: number
  verbosityLevel: 'MINIMAL' | 'STANDARD' | 'DETAILED'
}

interface Announcement {
  id: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  type: 'NAVIGATION' | 'PROGRESS' | 'ACTION' | 'ERROR' | 'SUCCESS'
  timestamp: number
}

interface MobileScreenReaderProps {
  children: React.ReactNode
  config?: Partial<ScreenReaderConfig>
  onScreenReaderDetected?: (isActive: boolean) => void
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const defaultConfig: ScreenReaderConfig = {
  enableAnnouncements: true,
  enableProgressAnnouncements: true,
  enableNavigationAnnouncements: true,
  announcementDelay: 500,
  verbosityLevel: 'STANDARD'
}

// =============================================================================
// SCREEN READER UTILITIES
// =============================================================================

const detectScreenReader = (): boolean => {
  if (typeof window === 'undefined') return false

  // Check for screen reader indicators
  const indicators = [
    // iOS VoiceOver
    window.navigator.userAgent.includes('Voice'),
    // Android TalkBack
    'speechSynthesis' in window && window.speechSynthesis.getVoices().length > 0,
    // High contrast mode (often used with screen readers)
    window.matchMedia('(prefers-contrast: high)').matches,
    // Reduced motion (common accessibility setting)
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    // Check for accessibility APIs
    'getComputedAccessibleNode' in document.createElement('div')
  ]

  return indicators.some(indicator => indicator)
}

const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('class', 'sr-only')
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// =============================================================================
// MOBILE SCREEN READER COMPONENT
// =============================================================================

export const MobileScreenReader: React.FC<MobileScreenReaderProps> = ({
  children,
  config,
  onScreenReaderDetected
}) => {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentFocus, setCurrentFocus] = useState<string>('')
  
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const mergedConfig = { ...defaultConfig, ...config }
  const announcementQueueRef = useRef<Announcement[]>([])

  // =============================================================================
  // SCREEN READER DETECTION
  // =============================================================================

  useEffect(() => {
    const checkScreenReader = () => {
      const isActive = detectScreenReader()
      setIsScreenReaderActive(isActive)
      onScreenReaderDetected?.(isActive)

      // Add screen reader specific styling
      if (isActive) {
        document.body.classList.add('screen-reader-active')
      } else {
        document.body.classList.remove('screen-reader-active')
      }
    }

    checkScreenReader()

    // Listen for accessibility preference changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = () => checkScreenReader()
    contrastQuery.addEventListener('change', handleChange)
    motionQuery.addEventListener('change', handleChange)

    return () => {
      contrastQuery.removeEventListener('change', handleChange)
      motionQuery.removeEventListener('change', handleChange)
    }
  }, [onScreenReaderDetected])

  // =============================================================================
  // ANNOUNCEMENT MANAGEMENT
  // =============================================================================

  const queueAnnouncement = useCallback((announcement: Omit<Announcement, 'id' | 'timestamp'>) => {
    const fullAnnouncement: Announcement = {
      ...announcement,
      id: `announcement-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    }

    announcementQueueRef.current.push(fullAnnouncement)
    setAnnouncements(prev => [...prev, fullAnnouncement])
  }, [])

  const processAnnouncementQueue = useCallback(() => {
    if (!mergedConfig.enableAnnouncements || announcementQueueRef.current.length === 0) {
      return
    }

    // Sort by priority
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    announcementQueueRef.current.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    const announcement = announcementQueueRef.current.shift()
    if (announcement) {
      const priority = announcement.priority === 'URGENT' || announcement.priority === 'HIGH' ? 'assertive' : 'polite'
      announceToScreenReader(announcement.message, priority)
    }

    // Process next announcement after delay
    if (announcementQueueRef.current.length > 0) {
      setTimeout(processAnnouncementQueue, mergedConfig.announcementDelay)
    }
  }, [mergedConfig.enableAnnouncements, mergedConfig.announcementDelay])

  useEffect(() => {
    if (announcements.length > 0) {
      const timer = setTimeout(processAnnouncementQueue, mergedConfig.announcementDelay)
      return () => clearTimeout(timer)
    }
  }, [announcements.length, processAnnouncementQueue, mergedConfig.announcementDelay])

  // =============================================================================
  // PM-SPECIFIC ANNOUNCEMENTS
  // =============================================================================

  const announceNavigationChange = useCallback((fromPage: string, toPage: string) => {
    if (!mergedConfig.enableNavigationAnnouncements) return

    const message = mergedConfig.verbosityLevel === 'DETAILED' 
      ? `Navigated from ${fromPage} to ${toPage}. Use swipe gestures or arrow keys to navigate between sections.`
      : `Now on ${toPage}`

    queueAnnouncement({
      message,
      priority: 'MEDIUM',
      type: 'NAVIGATION'
    })
  }, [mergedConfig.enableNavigationAnnouncements, mergedConfig.verbosityLevel, queueAnnouncement])

  const announceProgressUpdate = useCallback((metric: string, value: number, context?: string) => {
    if (!mergedConfig.enableProgressAnnouncements) return

    let message: string
    
    switch (mergedConfig.verbosityLevel) {
      case 'DETAILED':
        message = `${metric} updated to ${value}${context ? ` in ${context}` : ''}. This affects your PM career progression. Tap for details.`
        break
      case 'MINIMAL':
        message = `${metric}: ${value}`
        break
      default:
        message = `${metric} is now ${value}${context ? ` for ${context}` : ''}`
    }

    queueAnnouncement({
      message,
      priority: 'MEDIUM',
      type: 'PROGRESS'
    })
  }, [mergedConfig.enableProgressAnnouncements, mergedConfig.verbosityLevel, queueAnnouncement])

  const announceActionResult = useCallback((action: string, success: boolean, details?: string) => {
    const message = success 
      ? `${action} completed successfully${details ? `. ${details}` : ''}`
      : `${action} failed${details ? `. ${details}` : '. Please try again.'}`

    queueAnnouncement({
      message,
      priority: success ? 'MEDIUM' : 'HIGH',
      type: success ? 'SUCCESS' : 'ERROR'
    })
  }, [queueAnnouncement])

  const announcePracticeSessionUpdate = useCallback((state: 'STARTED' | 'PAUSED' | 'COMPLETED', duration?: number) => {
    let message: string

    switch (state) {
      case 'STARTED':
        message = 'Practice session started. Speak naturally and we\'ll provide feedback on your executive communication.'
        break
      case 'PAUSED':
        message = 'Practice session paused. Tap the play button to continue recording.'
        break
      case 'COMPLETED':
        message = `Practice session completed${duration ? ` after ${Math.round(duration / 60)} minutes` : ''}. Analyzing your communication patterns now.`
        break
    }

    queueAnnouncement({
      message,
      priority: 'HIGH',
      type: 'PROGRESS'
    })
  }, [queueAnnouncement])

  // =============================================================================
  // FOCUS MANAGEMENT
  // =============================================================================

  const handleFocusChange = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (!target) return

    // Get meaningful label for focused element
    const label = target.getAttribute('aria-label') || 
                  target.getAttribute('title') || 
                  target.textContent ||
                  target.tagName

    setCurrentFocus(label)

    // Announce complex UI elements
    if (target.getAttribute('role') === 'button' && target.getAttribute('aria-describedby')) {
      const description = document.getElementById(target.getAttribute('aria-describedby')!)?.textContent
      if (description) {
        queueAnnouncement({
          message: `${label}. ${description}`,
          priority: 'LOW',
          type: 'NAVIGATION'
        })
      }
    }
  }, [queueAnnouncement])

  useEffect(() => {
    if (!isScreenReaderActive) return

    document.addEventListener('focusin', handleFocusChange)
    return () => document.removeEventListener('focusin', handleFocusChange)
  }, [isScreenReaderActive, handleFocusChange])

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  const screenReaderAPI = {
    announceNavigationChange,
    announceProgressUpdate,
    announceActionResult,
    announcePracticeSessionUpdate,
    queueAnnouncement,
    isActive: isScreenReaderActive,
    currentFocus
  }

  // Provide API through React context (would be implemented in real app)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).shipSpeakScreenReader = screenReaderAPI
    }
  }, [screenReaderAPI])

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div 
      className="mobile-screen-reader"
      data-testid="mobile-screen-reader"
      data-active={isScreenReaderActive}
    >
      {/* Live Region for Announcements */}
      <div
        ref={liveRegionRef}
        className="sr-live-region"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions text"
      />

      {/* Assertive Live Region for Urgent Announcements */}
      <div
        className="sr-live-region-assertive"
        aria-live="assertive"
        aria-atomic="true"
      />

      {/* Skip Links */}
      {isScreenReaderActive && (
        <div className="skip-links">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <a href="#navigation" className="skip-link">
            Skip to navigation
          </a>
          <a href="#practice-controls" className="skip-link">
            Skip to practice controls
          </a>
        </div>
      )}

      {/* Screen Reader Instructions */}
      {isScreenReaderActive && (
        <div className="sr-instructions" aria-label="Screen reader instructions">
          <h2 className="sr-only">ShipSpeak Navigation Instructions</h2>
          <ul className="sr-only">
            <li>Use arrow keys or swipe gestures to navigate between sections</li>
            <li>Press space or double-tap to activate buttons</li>
            <li>Use headings navigation to jump between major sections</li>
            <li>Practice session controls are clearly labeled with detailed instructions</li>
          </ul>
        </div>
      )}

      {/* Enhanced Content */}
      <div className="screen-reader-enhanced-content">
        {children}
      </div>

      {/* Styles */}
      <style jsx>{`
        .mobile-screen-reader {
          width: 100%;
          height: 100%;
        }

        /* Screen Reader Only Styles */
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        .sr-live-region,
        .sr-live-region-assertive {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        /* Skip Links */
        .skip-links {
          position: absolute;
          top: -100px;
          left: 0;
          z-index: 9999;
        }

        .skip-link {
          position: absolute;
          top: 0;
          left: 0;
          background: #000;
          color: #fff;
          padding: 0.5rem 1rem;
          text-decoration: none;
          border-radius: 0 0 4px 0;
          font-weight: bold;
          z-index: 10000;
          transform: translateY(-100%);
          transition: transform 0.2s ease;
        }

        .skip-link:focus {
          transform: translateY(0);
        }

        /* Screen Reader Active Enhancements */
        :global(.screen-reader-active) {
          /* Increase touch target sizes */
        }

        :global(.screen-reader-active) button,
        :global(.screen-reader-active) [role="button"],
        :global(.screen-reader-active) a {
          min-height: 44px;
          min-width: 44px;
          position: relative;
        }

        /* Enhanced focus indicators */
        :global(.screen-reader-active) *:focus {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          :global(.screen-reader-active) {
            --text-color: #000;
            --bg-color: #fff;
            --link-color: #0000ff;
            --border-color: #000;
          }

          :global(.screen-reader-active) * {
            border-color: var(--border-color) !important;
            color: var(--text-color) !important;
          }

          :global(.screen-reader-active) a {
            color: var(--link-color) !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          :global(.screen-reader-active) *,
          :global(.screen-reader-active) *::before,
          :global(.screen-reader-active) *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Enhanced spacing for easier navigation */
        :global(.screen-reader-active) button + button,
        :global(.screen-reader-active) a + a {
          margin-left: 0.5rem;
        }

        /* Better landmark identification */
        :global(.screen-reader-active) main,
        :global(.screen-reader-active) nav,
        :global(.screen-reader-active) aside,
        :global(.screen-reader-active) section {
          position: relative;
        }

        :global(.screen-reader-active) main::before,
        :global(.screen-reader-active) nav::before,
        :global(.screen-reader-active) aside::before,
        :global(.screen-reader-active) section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -3px;
          width: 3px;
          height: 100%;
          background: #3b82f6;
        }

        /* Mobile screen reader specific optimizations */
        @media (max-width: 768px) {
          :global(.screen-reader-active) {
            font-size: 16px; /* Prevent zoom on focus */
          }

          .skip-links {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
          }

          .skip-link {
            position: relative;
            display: block;
            width: 100%;
            text-align: center;
            transform: translateY(-100%);
          }

          .skip-link:focus {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// HOOK FOR SCREEN READER INTEGRATION
// =============================================================================

export const useScreenReaderAnnouncements = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }, [])

  const announcePageChange = useCallback((pageName: string) => {
    announce(`Now on ${pageName} page`, 'polite')
  }, [announce])

  const announceError = useCallback((error: string) => {
    announce(`Error: ${error}`, 'assertive')
  }, [announce])

  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite')
  }, [announce])

  return {
    announce,
    announcePageChange,
    announceError,
    announceSuccess
  }
}