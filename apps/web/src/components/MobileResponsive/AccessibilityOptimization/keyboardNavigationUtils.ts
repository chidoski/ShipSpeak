/**
 * Utility functions for Mobile Keyboard Navigation
 */

export interface KeyboardShortcut {
  key: string
  combination?: string[]
  action: string
  description: string
  scope: 'GLOBAL' | 'DASHBOARD' | 'PRACTICE' | 'ANALYSIS'
}

export interface FocusableElement {
  element: HTMLElement
  tabIndex: number
  role?: string
  label?: string
}

// =============================================================================
// KEYBOARD SHORTCUTS CONFIGURATION
// =============================================================================

export const keyboardShortcuts: KeyboardShortcut[] = [
  // Global Navigation
  { key: 'h', action: 'goHome', description: 'Go to Dashboard', scope: 'GLOBAL' },
  { key: 'p', action: 'goPractice', description: 'Go to Practice', scope: 'GLOBAL' },
  { key: 'a', action: 'goAnalysis', description: 'Go to Analysis', scope: 'GLOBAL' },
  { key: 'm', action: 'goMeetings', description: 'Go to Meetings', scope: 'GLOBAL' },
  { key: 's', action: 'goSettings', description: 'Go to Settings', scope: 'GLOBAL' },
  
  // Dashboard Navigation
  { key: 'o', action: 'openOverview', description: 'Open Overview', scope: 'DASHBOARD' },
  { key: 'r', action: 'startRecording', description: 'Start Recording', scope: 'DASHBOARD' },
  { key: 'l', action: 'openLibrary', description: 'Open Module Library', scope: 'DASHBOARD' },
  
  // Practice Session Controls
  { key: ' ', action: 'toggleRecording', description: 'Start/Stop Recording', scope: 'PRACTICE' },
  { key: 'Escape', action: 'exitPractice', description: 'Exit Practice Session', scope: 'PRACTICE' },
  
  // Analysis Navigation
  { key: 'ArrowLeft', action: 'previousInsight', description: 'Previous Insight', scope: 'ANALYSIS' },
  { key: 'ArrowRight', action: 'nextInsight', description: 'Next Insight', scope: 'ANALYSIS' },
  { key: 'Enter', action: 'expandInsight', description: 'Expand Current Insight', scope: 'ANALYSIS' }
]

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const updateFocusableElements = (): FocusableElement[] => {
  const elements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  return Array.from(elements)
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
    .map((el, index) => ({
      element: el as HTMLElement,
      tabIndex: index,
      role: el.getAttribute('role') || undefined,
      label: el.getAttribute('aria-label') || el.textContent?.trim() || undefined
    }))
}

export const announceToScreenReader = (message: string) => {
  const announcer = document.createElement('div')
  announcer.setAttribute('aria-live', 'polite')
  announcer.setAttribute('class', 'sr-only')
  announcer.textContent = message
  document.body.appendChild(announcer)
  
  setTimeout(() => document.body.removeChild(announcer), 1000)
}

export const triggerShortcutAction = (action: string) => {
  switch (action) {
    case 'goHome':
      window.location.href = '/dashboard'
      break
    case 'goPractice':
      window.location.href = '/dashboard/practice'
      break
    case 'goAnalysis':
      window.location.href = '/dashboard/analysis'
      break
    case 'goMeetings':
      window.location.href = '/dashboard/meetings'
      break
    case 'goSettings':
      window.location.href = '/dashboard/settings'
      break
    case 'toggleRecording':
      const recordButton = document.querySelector('[data-testid="record-button"]') as HTMLElement
      recordButton?.click()
      break
    case 'exitPractice':
      const exitButton = document.querySelector('[data-testid="exit-practice"]') as HTMLElement
      exitButton?.click()
      break
  }
}

export const detectCurrentScope = (): string => {
  const pathname = window.location.pathname
  
  if (pathname.includes('/practice')) {
    return 'PRACTICE'
  } else if (pathname.includes('/analysis')) {
    return 'ANALYSIS'
  } else if (pathname.includes('/dashboard')) {
    return 'DASHBOARD'
  } else {
    return 'GLOBAL'
  }
}

export const getRelevantShortcuts = (currentScope: string): KeyboardShortcut[] => {
  return keyboardShortcuts.filter(
    shortcut => shortcut.scope === currentScope || shortcut.scope === 'GLOBAL'
  )
}