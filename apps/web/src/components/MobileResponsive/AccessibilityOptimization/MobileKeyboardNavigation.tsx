/**
 * Mobile Keyboard Navigation for ShipSpeak
 * Alternative navigation for accessibility on mobile devices
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useEffect, useCallback, useState } from 'react'
import { 
  KeyboardShortcut, 
  FocusableElement,
  updateFocusableElements,
  announceToScreenReader,
  triggerShortcutAction,
  detectCurrentScope,
  getRelevantShortcuts
} from './keyboardNavigationUtils'
import { KeyboardShortcutHelp } from './KeyboardShortcutHelp'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface MobileKeyboardNavigationProps {
  children: React.ReactNode
  onShortcutTriggered?: (shortcut: KeyboardShortcut) => void
  enableShortcuts?: boolean
  showShortcutHelp?: boolean
}

// =============================================================================
// MOBILE KEYBOARD NAVIGATION COMPONENT
// =============================================================================

export const MobileKeyboardNavigation: React.FC<MobileKeyboardNavigationProps> = ({
  children,
  onShortcutTriggered,
  enableShortcuts = true,
  showShortcutHelp = false
}) => {
  const [focusableElements, setFocusableElements] = useState<FocusableElement[]>([])
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)
  const [currentScope, setCurrentScope] = useState<string>('GLOBAL')
  const [showHelp, setShowHelp] = useState(showShortcutHelp)

  // =============================================================================
  // FOCUSABLE ELEMENTS MANAGEMENT
  // =============================================================================

  const updateElements = useCallback(() => {
    setFocusableElements(updateFocusableElements())
  }, [])

  const focusElement = useCallback((index: number) => {
    if (index >= 0 && index < focusableElements.length) {
      focusableElements[index].element.focus()
      setCurrentFocusIndex(index)
      
      const element = focusableElements[index]
      const announcement = `Focused on ${element.label || element.role || 'element'}`
      announceToScreenReader(announcement)
    }
  }, [focusableElements])

  // =============================================================================
  // KEYBOARD EVENT HANDLERS
  // =============================================================================

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enableShortcuts) return

    // Handle tab navigation
    if (event.key === 'Tab') {
      event.preventDefault()
      const nextIndex = event.shiftKey 
        ? Math.max(0, currentFocusIndex - 1)
        : Math.min(focusableElements.length - 1, currentFocusIndex + 1)
      
      focusElement(nextIndex)
      return
    }

    // Handle escape to close modals/overlays
    if (event.key === 'Escape') {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && activeElement.closest('[role="dialog"]')) {
        const closeButton = activeElement.closest('[role="dialog"]')?.querySelector('[aria-label*="close"]') as HTMLElement
        closeButton?.click()
        return
      }
    }

    // Handle shortcut help toggle
    if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
      event.preventDefault()
      setShowHelp(!showHelp)
      return
    }

    // Handle application shortcuts
    const relevantShortcuts = getRelevantShortcuts(currentScope)

    for (const shortcut of relevantShortcuts) {
      if (event.key === shortcut.key) {
        event.preventDefault()
        onShortcutTriggered?.(shortcut)
        triggerShortcutAction(shortcut.action)
        break
      }
    }
  }, [enableShortcuts, currentFocusIndex, focusableElements, currentScope, showHelp, onShortcutTriggered])

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    updateElements()
    setCurrentScope(detectCurrentScope())
    
    // Update focusable elements when DOM changes
    const observer = new MutationObserver(updateElements)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => observer.disconnect()
  }, [updateElements])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      className="mobile-keyboard-navigation"
      data-testid="mobile-keyboard-navigation"
      data-scope={currentScope}
      data-shortcuts-enabled={enableShortcuts}
    >
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-to-main"
        onClick={() => {
          const mainContent = document.getElementById('main-content')
          mainContent?.focus()
        }}
      >
        Skip to main content
      </a>

      {/* Main content */}
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>

      {/* Keyboard shortcuts help overlay */}
      <KeyboardShortcutHelp
        showHelp={showHelp}
        onClose={() => setShowHelp(false)}
        shortcuts={getRelevantShortcuts(currentScope)}
        currentScope={currentScope}
      />

      {/* Focus indicator for mobile devices */}
      <div 
        className="focus-indicator"
        style={{ display: currentFocusIndex >= 0 ? 'block' : 'none' }}
        aria-hidden="true"
      />

      <style jsx>{`
        .mobile-keyboard-navigation {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .skip-to-main {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          z-index: 1000;
          transition: top 0.2s ease;
        }

        .skip-to-main:focus {
          top: 6px;
        }

        .focus-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 4px;
          height: 100vh;
          background: #3b82f6;
          pointer-events: none;
          z-index: 999;
        }

        /* Enhanced focus styles for mobile */
        :global(*:focus) {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .skip-to-main {
            padding: 6px 12px;
            font-size: 0.875rem;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .skip-to-main {
            border: 2px solid #fff;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .skip-to-main {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}