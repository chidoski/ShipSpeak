/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileScreenReader, useScreenReaderAnnouncements } from '@/components/MobileResponsive/AccessibilityOptimization/MobileScreenReader'

// Mock DOM methods
const mockMatchMedia = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

// Mock speech synthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    getVoices: jest.fn(() => [{ name: 'MockVoice' }])
  },
})

describe('MobileScreenReader', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.classList.remove('screen-reader-active')
    
    // Setup default matchMedia responses
    mockMatchMedia
      .mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // =============================================================================
  // BASIC RENDERING TESTS
  // =============================================================================

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )
      
      expect(screen.getByTestId('mobile-screen-reader')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders skip links when screen reader is detected', () => {
      // Mock screen reader detection
      mockMatchMedia
        .mockImplementation(query => {
          if (query.includes('prefers-contrast: high')) {
            return { matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }
          }
          return { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }
        })

      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      expect(screen.getByText('Skip to main content')).toBeInTheDocument()
      expect(screen.getByText('Skip to navigation')).toBeInTheDocument()
      expect(screen.getByText('Skip to practice controls')).toBeInTheDocument()
    })

    it('includes screen reader instructions when active', () => {
      mockMatchMedia
        .mockImplementation(query => {
          if (query.includes('prefers-contrast: high')) {
            return { matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }
          }
          return { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }
        })

      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      expect(screen.getByLabelText('Screen reader instructions')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // SCREEN READER DETECTION TESTS
  // =============================================================================

  describe('Screen Reader Detection', () => {
    it('detects screen reader from high contrast preference', async () => {
      const onDetected = jest.fn()
      
      mockMatchMedia
        .mockImplementation(query => {
          if (query.includes('prefers-contrast: high')) {
            return { matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }
          }
          return { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }
        })

      render(
        <MobileScreenReader onScreenReaderDetected={onDetected}>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      await waitFor(() => {
        expect(onDetected).toHaveBeenCalledWith(true)
      })
    })

    it('detects screen reader from reduced motion preference', async () => {
      const onDetected = jest.fn()
      
      mockMatchMedia
        .mockImplementation(query => {
          if (query.includes('prefers-reduced-motion: reduce')) {
            return { matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }
          }
          return { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }
        })

      render(
        <MobileScreenReader onScreenReaderDetected={onDetected}>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      await waitFor(() => {
        expect(onDetected).toHaveBeenCalledWith(true)
      })
    })

    it('adds screen reader class to body when detected', async () => {
      mockMatchMedia
        .mockImplementation(query => {
          if (query.includes('prefers-contrast: high')) {
            return { matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }
          }
          return { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }
        })

      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      await waitFor(() => {
        expect(document.body.classList.contains('screen-reader-active')).toBe(true)
      })
    })
  })

  // =============================================================================
  // ACCESSIBILITY FEATURES TESTS
  // =============================================================================

  describe('Accessibility Features', () => {
    it('creates live regions for announcements', () => {
      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      const politeRegion = document.querySelector('[aria-live="polite"]')
      const assertiveRegion = document.querySelector('[aria-live="assertive"]')
      
      expect(politeRegion).toBeInTheDocument()
      expect(assertiveRegion).toBeInTheDocument()
    })

    it('handles focus events for navigation announcements', async () => {
      render(
        <MobileScreenReader>
          <button aria-label="Test Button">Click Me</button>
        </MobileScreenReader>
      )

      const button = screen.getByRole('button', { name: 'Test Button' })
      
      // Trigger focus
      fireEvent.focusIn(button)

      // Should handle focus without errors
      expect(button).toBeInTheDocument()
    })

    it('exposes screen reader API globally', async () => {
      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      await waitFor(() => {
        expect((window as any).shipSpeakScreenReader).toBeDefined()
        expect((window as any).shipSpeakScreenReader.announceNavigationChange).toBeFunction()
        expect((window as any).shipSpeakScreenReader.announceProgressUpdate).toBeFunction()
      })
    })
  })

  // =============================================================================
  // CONFIGURATION TESTS
  // =============================================================================

  describe('Configuration', () => {
    it('accepts custom configuration', () => {
      const customConfig = {
        enableAnnouncements: false,
        verbosityLevel: 'DETAILED' as const,
        announcementDelay: 1000
      }

      render(
        <MobileScreenReader config={customConfig}>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      expect(screen.getByTestId('mobile-screen-reader')).toBeInTheDocument()
    })

    it('merges custom config with defaults', () => {
      const partialConfig = {
        verbosityLevel: 'MINIMAL' as const
      }

      render(
        <MobileScreenReader config={partialConfig}>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      expect(screen.getByTestId('mobile-screen-reader')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // PM-SPECIFIC FUNCTIONALITY TESTS
  // =============================================================================

  describe('PM-Specific Features', () => {
    it('provides PM-specific announcement methods', async () => {
      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      await waitFor(() => {
        const api = (window as any).shipSpeakScreenReader
        expect(api.announcePracticeSessionUpdate).toBeFunction()
        expect(api.announceProgressUpdate).toBeFunction()
        expect(api.announceActionResult).toBeFunction()
      })
    })

    it('handles practice session state announcements', async () => {
      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      await waitFor(() => {
        const api = (window as any).shipSpeakScreenReader
        
        // Should not throw when calling PM-specific methods
        expect(() => {
          api.announcePracticeSessionUpdate('STARTED')
          api.announcePracticeSessionUpdate('PAUSED')
          api.announcePracticeSessionUpdate('COMPLETED', 180)
        }).not.toThrow()
      })
    })

    it('handles progress updates with PM context', async () => {
      render(
        <MobileScreenReader>
          <div>Test Content</div>
        </MobileScreenReader>
      )

      await waitFor(() => {
        const api = (window as any).shipSpeakScreenReader
        
        // Should not throw when announcing progress updates
        expect(() => {
          api.announceProgressUpdate('Executive Presence', 85, 'stakeholder meetings')
          api.announceProgressUpdate('Strategic Communication', 72)
        }).not.toThrow()
      })
    })
  })

  // =============================================================================
  // HOOK TESTS
  // =============================================================================

  describe('useScreenReaderAnnouncements Hook', () => {
    const TestComponent: React.FC = () => {
      const { announce, announcePageChange, announceError, announceSuccess } = useScreenReaderAnnouncements()
      
      return (
        <div>
          <button onClick={() => announce('Test announcement')}>Announce</button>
          <button onClick={() => announcePageChange('Dashboard')}>Page Change</button>
          <button onClick={() => announceError('Something went wrong')}>Error</button>
          <button onClick={() => announceSuccess('Task completed')}>Success</button>
        </div>
      )
    }

    it('provides announcement functions', () => {
      render(<TestComponent />)
      
      expect(screen.getByText('Announce')).toBeInTheDocument()
      expect(screen.getByText('Page Change')).toBeInTheDocument()
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Success')).toBeInTheDocument()
    })

    it('handles announcements without errors', () => {
      render(<TestComponent />)
      
      const announceButton = screen.getByText('Announce')
      const pageChangeButton = screen.getByText('Page Change')
      const errorButton = screen.getByText('Error')
      const successButton = screen.getByText('Success')
      
      expect(() => {
        fireEvent.click(announceButton)
        fireEvent.click(pageChangeButton)
        fireEvent.click(errorButton)
        fireEvent.click(successButton)
      }).not.toThrow()
    })
  })

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration', () => {
    it('works with complex PM dashboard content', () => {
      const ComplexDashboard = () => (
        <MobileScreenReader>
          <main id="main-content">
            <nav id="navigation" aria-label="Main navigation">
              <button aria-label="Dashboard">Dashboard</button>
              <button aria-label="Practice">Practice</button>
              <button aria-label="Analysis">Analysis</button>
            </nav>
            <section aria-label="Practice session controls" id="practice-controls">
              <button aria-label="Start recording">Record</button>
              <button aria-label="Pause recording">Pause</button>
            </section>
            <section aria-label="Analysis results" id="analysis-results">
              <div role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
                Executive Presence: 75%
              </div>
            </section>
          </main>
        </MobileScreenReader>
      )

      render(<ComplexDashboard />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start recording' })).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('maintains accessibility during dynamic content changes', async () => {
      const DynamicContent: React.FC = () => {
        const [content, setContent] = React.useState('Initial content')
        
        return (
          <MobileScreenReader>
            <div>
              <button onClick={() => setContent('Updated content')}>
                Update Content
              </button>
              <div aria-live="polite">{content}</div>
            </div>
          </MobileScreenReader>
        )
      }

      render(<DynamicContent />)
      
      const updateButton = screen.getByRole('button', { name: 'Update Content' })
      
      expect(screen.getByText('Initial content')).toBeInTheDocument()
      
      fireEvent.click(updateButton)
      
      await waitFor(() => {
        expect(screen.getByText('Updated content')).toBeInTheDocument()
      })
    })
  })
})

// =============================================================================
// UTILITY FUNCTIONS FOR TESTING
// =============================================================================

expect.extend({
  toBeFunction(received) {
    const pass = typeof received === 'function'
    if (pass) {
      return {
        message: () => `expected ${received} not to be a function`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be a function`,
        pass: false,
      }
    }
  },
})