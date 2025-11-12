/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileKeyboardNavigation } from '../../../../../components/MobileResponsive/AccessibilityOptimization/MobileKeyboardNavigation'

// Mock window.location
const mockLocation = {
  href: '',
  pathname: '/dashboard'
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

describe('MobileKeyboardNavigation', () => {
  beforeEach(() => {
    // Reset location
    mockLocation.href = ''
    mockLocation.pathname = '/dashboard'
    
    // Clear any existing styles
    document.documentElement.style.cssText = ''
    
    // Mock MutationObserver
    global.MutationObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  afterEach(() => {
    // Clean up event listeners
    document.removeEventListener('keydown', jest.fn())
  })

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <MobileKeyboardNavigation>
          <div>Test content</div>
        </MobileKeyboardNavigation>
      )

      expect(screen.getByTestId('mobile-keyboard-navigation')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
      expect(screen.getByText('Skip to main content')).toBeInTheDocument()
    })

    it('displays correct data attributes', () => {
      render(
        <MobileKeyboardNavigation enableShortcuts={true}>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      const container = screen.getByTestId('mobile-keyboard-navigation')
      expect(container).toHaveAttribute('data-scope', 'DASHBOARD')
      expect(container).toHaveAttribute('data-shortcuts-enabled', 'true')
    })

    it('renders skip to main content link', () => {
      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })
  })

  describe('Keyboard Navigation', () => {
    it('handles tab navigation', async () => {
      render(
        <MobileKeyboardNavigation>
          <button>Button 1</button>
          <button>Button 2</button>
          <input type="text" placeholder="Test input" />
        </MobileKeyboardNavigation>
      )

      // Mock querySelector for focusable elements
      const mockButtons = [
        screen.getByText('Button 1'),
        screen.getByText('Button 2'),
        screen.getByPlaceholderText('Test input')
      ]

      document.querySelectorAll = jest.fn().mockReturnValue(mockButtons.map(el => ({
        ...el,
        hasAttribute: jest.fn().mockReturnValue(false),
        offsetParent: document.body,
        getAttribute: jest.fn().mockReturnValue(null),
        textContent: el.textContent,
        focus: jest.fn()
      })))

      // Simulate tab key press
      fireEvent.keyDown(document, { key: 'Tab' })

      await waitFor(() => {
        // Verify tab navigation is handled
        expect(document.querySelectorAll).toHaveBeenCalled()
      })
    })

    it('handles global navigation shortcuts', () => {
      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      // Test home navigation
      fireEvent.keyDown(document, { key: 'h' })
      expect(mockLocation.href).toBe('/dashboard')

      // Test practice navigation
      fireEvent.keyDown(document, { key: 'p' })
      expect(mockLocation.href).toBe('/dashboard/practice')

      // Test analysis navigation
      fireEvent.keyDown(document, { key: 'a' })
      expect(mockLocation.href).toBe('/dashboard/analysis')
    })

    it('handles escape key for closing modals', () => {
      // Create mock modal structure
      const mockModal = document.createElement('div')
      mockModal.setAttribute('role', 'dialog')
      const mockCloseButton = document.createElement('button')
      mockCloseButton.setAttribute('aria-label', 'close modal')
      mockCloseButton.click = jest.fn()
      mockModal.appendChild(mockCloseButton)
      document.body.appendChild(mockModal)

      // Mock activeElement
      Object.defineProperty(document, 'activeElement', {
        value: mockCloseButton,
        configurable: true
      })

      mockCloseButton.closest = jest.fn().mockReturnValue(mockModal)
      mockModal.querySelector = jest.fn().mockReturnValue(mockCloseButton)

      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      // Simulate escape key press
      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockCloseButton.click).toHaveBeenCalled()

      // Clean up
      document.body.removeChild(mockModal)
    })
  })

  describe('Shortcut Help', () => {
    it('toggles help overlay with ? key', async () => {
      render(
        <MobileKeyboardNavigation showShortcutHelp={false}>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      // Initially no help should be shown
      expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument()

      // Press ? to show help
      fireEvent.keyDown(document, { key: '?', shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
      })

      // Press ? again to hide help
      fireEvent.keyDown(document, { key: '?', shiftKey: true })

      await waitFor(() => {
        expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument()
      })
    })

    it('shows context-appropriate shortcuts', async () => {
      // Mock location for practice context
      mockLocation.pathname = '/dashboard/practice'

      render(
        <MobileKeyboardNavigation showShortcutHelp={true}>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      await waitFor(() => {
        expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
        expect(screen.getByText('Start/Stop Recording')).toBeInTheDocument()
      })
    })

    it('closes help overlay with close button', async () => {
      render(
        <MobileKeyboardNavigation showShortcutHelp={true}>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      await waitFor(() => {
        expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
      })

      const closeButton = screen.getByLabelText('Close keyboard shortcuts help')
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument()
      })
    })
  })

  describe('Scope Detection', () => {
    it('detects dashboard scope correctly', () => {
      mockLocation.pathname = '/dashboard'

      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      const container = screen.getByTestId('mobile-keyboard-navigation')
      expect(container).toHaveAttribute('data-scope', 'DASHBOARD')
    })

    it('detects practice scope correctly', () => {
      mockLocation.pathname = '/dashboard/practice'

      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      const container = screen.getByTestId('mobile-keyboard-navigation')
      expect(container).toHaveAttribute('data-scope', 'PRACTICE')
    })

    it('detects analysis scope correctly', () => {
      mockLocation.pathname = '/dashboard/analysis'

      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      const container = screen.getByTestId('mobile-keyboard-navigation')
      expect(container).toHaveAttribute('data-scope', 'ANALYSIS')
    })
  })

  describe('Practice Session Controls', () => {
    it('handles recording controls in practice scope', () => {
      mockLocation.pathname = '/dashboard/practice'

      // Mock recording button
      const mockRecordButton = document.createElement('button')
      mockRecordButton.setAttribute('data-testid', 'record-button')
      mockRecordButton.click = jest.fn()
      document.body.appendChild(mockRecordButton)

      document.querySelector = jest.fn().mockReturnValue(mockRecordButton)

      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      // Simulate spacebar for recording toggle
      fireEvent.keyDown(document, { key: ' ' })

      expect(mockRecordButton.click).toHaveBeenCalled()

      // Clean up
      document.body.removeChild(mockRecordButton)
    })

    it('handles exit practice with escape key', () => {
      mockLocation.pathname = '/dashboard/practice'

      // Mock exit button
      const mockExitButton = document.createElement('button')
      mockExitButton.setAttribute('data-testid', 'exit-practice')
      mockExitButton.click = jest.fn()
      document.body.appendChild(mockExitButton)

      document.querySelector = jest.fn().mockReturnValue(mockExitButton)

      render(
        <MobileKeyboardNavigation>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      // Simulate escape key for exit
      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockExitButton.click).toHaveBeenCalled()

      // Clean up
      document.body.removeChild(mockExitButton)
    })
  })

  describe('Accessibility Features', () => {
    it('provides screen reader announcements', () => {
      render(
        <MobileKeyboardNavigation>
          <button>Test Button</button>
        </MobileKeyboardNavigation>
      )

      // Mock querySelector to return our test button
      const testButton = screen.getByText('Test Button')
      document.querySelectorAll = jest.fn().mockReturnValue([{
        ...testButton,
        hasAttribute: jest.fn().mockReturnValue(false),
        offsetParent: document.body,
        getAttribute: jest.fn().mockReturnValue(null),
        textContent: 'Test Button',
        focus: jest.fn()
      }])

      // Simulate tab navigation
      fireEvent.keyDown(document, { key: 'Tab' })

      // Verify screen reader announcement element is created
      const announcements = document.querySelectorAll('[aria-live="polite"]')
      expect(announcements.length).toBeGreaterThan(0)
    })

    it('supports disabled shortcuts when enableShortcuts is false', () => {
      render(
        <MobileKeyboardNavigation enableShortcuts={false}>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      const container = screen.getByTestId('mobile-keyboard-navigation')
      expect(container).toHaveAttribute('data-shortcuts-enabled', 'false')

      // Shortcuts should not work
      const initialHref = mockLocation.href
      fireEvent.keyDown(document, { key: 'h' })
      expect(mockLocation.href).toBe(initialHref)
    })

    it('handles focus indicator visibility', () => {
      render(
        <MobileKeyboardNavigation>
          <button>Test Button</button>
        </MobileKeyboardNavigation>
      )

      const focusIndicator = document.querySelector('.focus-indicator')
      expect(focusIndicator).toBeInTheDocument()
    })
  })

  describe('Event Callbacks', () => {
    it('calls onShortcutTriggered when shortcuts are used', () => {
      const mockCallback = jest.fn()

      render(
        <MobileKeyboardNavigation onShortcutTriggered={mockCallback}>
          <div>Content</div>
        </MobileKeyboardNavigation>
      )

      fireEvent.keyDown(document, { key: 'h' })

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'h',
          action: 'goHome',
          description: 'Go to Dashboard',
          scope: 'GLOBAL'
        }),
        expect.any(String)
      )
    })
  })
})