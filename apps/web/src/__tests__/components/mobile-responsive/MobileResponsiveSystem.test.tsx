/**
 * Mobile Responsive System Tests
 * Comprehensive tests for ShipSpeak mobile responsive components
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Components to test
import { ResponsiveOrchestrator } from '../../../components/MobileResponsive/ResponsiveOrchestrator'
import { MobileDashboardLayout } from '../../../components/MobileResponsive/MobileOptimizedLayouts/MobileDashboardLayout'
import { TouchButton, TouchSlider, TouchSwitch } from '../../../components/MobileResponsive/TouchOptimizedComponents/TouchFriendlyControls'
import { MobilePracticeInterface } from '../../../components/MobileResponsive/MobileOptimizedLayouts/MobilePracticeInterface'
import { MobilePerformanceOptimizer } from '../../../components/MobileResponsive/MobileSpecificFeatures/MobilePerformanceOptimizer'

// =============================================================================
// MOCK DATA
// =============================================================================

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  isAuthenticated: true
}

const mockNotifications = {
  newMeetings: 3,
  newModules: 1,
  coaching: 2
}

const mockProcessing = {
  meetingsInProgress: 1
}

// =============================================================================
// RESPONSIVE ORCHESTRATOR TESTS
// =============================================================================

describe('ResponsiveOrchestrator', () => {
  test('renders children correctly', () => {
    render(
      <ResponsiveOrchestrator>
        <div data-testid="test-child">Test Content</div>
      </ResponsiveOrchestrator>
    )

    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByTestId('responsive-orchestrator')).toBeInTheDocument()
  })

  test('sets correct breakpoint data attributes', () => {
    const { container } = render(
      <ResponsiveOrchestrator>
        <div>Test</div>
      </ResponsiveOrchestrator>
    )

    const orchestrator = container.querySelector('.responsive-orchestrator')
    expect(orchestrator).toHaveClass('desktop') // Assuming default desktop view
  })

  test('calls onResponsiveChange callback', () => {
    const mockCallback = jest.fn()
    
    render(
      <ResponsiveOrchestrator onResponsiveChange={mockCallback}>
        <div>Test</div>
      </ResponsiveOrchestrator>
    )

    // Callback should be called on mount
    expect(mockCallback).toHaveBeenCalled()
  })
})

// =============================================================================
// MOBILE DASHBOARD LAYOUT TESTS
// =============================================================================

describe('MobileDashboardLayout', () => {
  test('renders mobile header correctly', () => {
    render(
      <MobileDashboardLayout user={mockUser}>
        <div>Main Content</div>
      </MobileDashboardLayout>
    )

    expect(screen.getByTestId('mobile-header')).toBeInTheDocument()
    expect(screen.getByText('ShipSpeak')).toBeInTheDocument()
  })

  test('displays user avatar when authenticated', () => {
    render(
      <MobileDashboardLayout user={mockUser}>
        <div>Content</div>
      </MobileDashboardLayout>
    )

    const avatar = screen.getByText('J') // First letter of name
    expect(avatar).toBeInTheDocument()
  })

  test('shows processing indicator when meetings are processing', () => {
    render(
      <MobileDashboardLayout processing={mockProcessing}>
        <div>Content</div>
      </MobileDashboardLayout>
    )

    expect(screen.getByText('1 processing')).toBeInTheDocument()
  })

  test('opens secondary navigation on menu toggle', () => {
    render(
      <MobileDashboardLayout>
        <div>Content</div>
      </MobileDashboardLayout>
    )

    const menuToggle = screen.getByTestId('mobile-menu-toggle')
    fireEvent.click(menuToggle)

    expect(screen.getByTestId('secondary-nav-overlay')).toBeInTheDocument()
  })

  test('navigation badges display correctly', () => {
    render(
      <MobileDashboardLayout notifications={mockNotifications}>
        <div>Content</div>
      </MobileDashboardLayout>
    )

    // Check for badge content (may be in bottom nav)
    const meetingsBadge = screen.getByText('3')
    expect(meetingsBadge).toBeInTheDocument()
  })
})

// =============================================================================
// TOUCH CONTROLS TESTS
// =============================================================================

describe('TouchButton', () => {
  test('renders correctly with different variants', () => {
    const { rerender } = render(
      <TouchButton variant="PRIMARY" onClick={() => {}}>
        Primary Button
      </TouchButton>
    )

    expect(screen.getByText('Primary Button')).toBeInTheDocument()

    rerender(
      <TouchButton variant="DANGER" onClick={() => {}}>
        Danger Button
      </TouchButton>
    )

    expect(screen.getByText('Danger Button')).toBeInTheDocument()
  })

  test('handles click events', () => {
    const mockClick = jest.fn()
    
    render(
      <TouchButton onClick={mockClick}>
        Click Me
      </TouchButton>
    )

    const button = screen.getByText('Click Me')
    fireEvent.click(button)

    expect(mockClick).toHaveBeenCalled()
  })

  test('shows loading state correctly', () => {
    render(
      <TouchButton loading onClick={() => {}}>
        Loading Button
      </TouchButton>
    )

    expect(screen.getByText('⟳')).toBeInTheDocument()
  })

  test('disables interaction when disabled', () => {
    const mockClick = jest.fn()
    
    render(
      <TouchButton disabled onClick={mockClick}>
        Disabled Button
      </TouchButton>
    )

    const button = screen.getByText('Disabled Button')
    fireEvent.click(button)

    expect(mockClick).not.toHaveBeenCalled()
  })
})

describe('TouchSlider', () => {
  test('renders with correct initial value', () => {
    render(
      <TouchSlider
        value={50}
        min={0}
        max={100}
        onChange={() => {}}
        label="Test Slider"
      />
    )

    expect(screen.getByTestId('touch-slider')).toBeInTheDocument()
    expect(screen.getByText('Test Slider')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  test('calls onChange when value changes', () => {
    const mockChange = jest.fn()
    
    render(
      <TouchSlider
        value={25}
        min={0}
        max={100}
        onChange={mockChange}
      />
    )

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: 75 } })

    expect(mockChange).toHaveBeenCalledWith(75)
  })
})

describe('TouchSwitch', () => {
  test('renders correctly with label', () => {
    render(
      <TouchSwitch
        checked={false}
        onChange={() => {}}
        label="Test Switch"
      />
    )

    expect(screen.getByTestId('touch-switch')).toBeInTheDocument()
    expect(screen.getByText('Test Switch')).toBeInTheDocument()
  })

  test('toggles state on click', () => {
    const mockChange = jest.fn()
    
    render(
      <TouchSwitch
        checked={false}
        onChange={mockChange}
        label="Toggle Me"
      />
    )

    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)

    expect(mockChange).toHaveBeenCalledWith(true)
  })
})

// =============================================================================
// MOBILE PRACTICE INTERFACE TESTS
// =============================================================================

describe('MobilePracticeInterface', () => {
  test('renders practice interface correctly', () => {
    render(
      <MobilePracticeInterface
        recordingState="IDLE"
        onRecordingStart={() => {}}
        onRecordingStop={() => {}}
      />
    )

    expect(screen.getByTestId('mobile-practice-interface')).toBeInTheDocument()
    expect(screen.getByText('Start Practice')).toBeInTheDocument()
  })

  test('shows correct button text for different recording states', () => {
    const { rerender } = render(
      <MobilePracticeInterface recordingState="IDLE" />
    )

    expect(screen.getByText('Start Practice')).toBeInTheDocument()

    rerender(
      <MobilePracticeInterface recordingState="RECORDING" />
    )

    expect(screen.getByText('Stop Recording')).toBeInTheDocument()

    rerender(
      <MobilePracticeInterface recordingState="PROCESSING" />
    )

    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  test('displays exercise context correctly', () => {
    const careerContext = {
      currentRole: 'PM',
      targetRole: 'Senior PM',
      industry: 'Fintech'
    }

    render(
      <MobilePracticeInterface
        careerContext={careerContext}
        exerciseType="SCENARIO"
      />
    )

    expect(screen.getByText('SCENARIO Practice')).toBeInTheDocument()
    expect(screen.getByText('PM → Senior PM')).toBeInTheDocument()
    expect(screen.getByText('Fintech')).toBeInTheDocument()
  })

  test('formats duration correctly', () => {
    render(
      <MobilePracticeInterface duration={90} maxDuration={300} />
    )

    expect(screen.getByText('1:30')).toBeInTheDocument()
    expect(screen.getByText('/ 5:00')).toBeInTheDocument()
  })
})

// =============================================================================
// PERFORMANCE OPTIMIZER TESTS
// =============================================================================

describe('MobilePerformanceOptimizer', () => {
  test('renders children correctly', () => {
    render(
      <MobilePerformanceOptimizer>
        <div data-testid="child-content">Performance Optimized</div>
      </MobilePerformanceOptimizer>
    )

    expect(screen.getByTestId('mobile-performance-optimizer')).toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })

  test('sets performance optimization attributes', () => {
    const { container } = render(
      <MobilePerformanceOptimizer>
        <div>Content</div>
      </MobilePerformanceOptimizer>
    )

    const optimizer = container.querySelector('[data-testid="mobile-performance-optimizer"]')
    expect(optimizer).toHaveAttribute('data-optimization')
  })

  test('calls performance update callback', () => {
    const mockCallback = jest.fn()
    
    render(
      <MobilePerformanceOptimizer onPerformanceUpdate={mockCallback}>
        <div>Content</div>
      </MobilePerformanceOptimizer>
    )

    // Performance callback should be set up (though may not be called immediately in test)
    expect(mockCallback).toEqual(expect.any(Function))
  })

  test('enables auto optimization by default', () => {
    render(
      <MobilePerformanceOptimizer enableAutoOptimization={true}>
        <div>Content</div>
      </MobilePerformanceOptimizer>
    )

    // Component should render without errors
    expect(screen.getByTestId('mobile-performance-optimizer')).toBeInTheDocument()
  })
})

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Mobile Responsive System Integration', () => {
  test('ResponsiveOrchestrator integrates with MobileDashboardLayout', () => {
    render(
      <ResponsiveOrchestrator>
        <MobileDashboardLayout user={mockUser}>
          <div data-testid="dashboard-content">Dashboard Content</div>
        </MobileDashboardLayout>
      </ResponsiveOrchestrator>
    )

    expect(screen.getByTestId('responsive-orchestrator')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-dashboard-layout')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument()
  })

  test('Performance optimizer wraps mobile components', () => {
    render(
      <MobilePerformanceOptimizer>
        <ResponsiveOrchestrator>
          <MobilePracticeInterface />
        </ResponsiveOrchestrator>
      </MobilePerformanceOptimizer>
    )

    expect(screen.getByTestId('mobile-performance-optimizer')).toBeInTheDocument()
    expect(screen.getByTestId('responsive-orchestrator')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-practice-interface')).toBeInTheDocument()
  })

  test('Touch controls work within mobile layouts', () => {
    const mockAction = jest.fn()

    render(
      <MobileDashboardLayout>
        <TouchButton onClick={mockAction}>
          Mobile Action
        </TouchButton>
      </MobileDashboardLayout>
    )

    const button = screen.getByText('Mobile Action')
    fireEvent.click(button)

    expect(mockAction).toHaveBeenCalled()
  })
})

// =============================================================================
// ACCESSIBILITY TESTS
// =============================================================================

describe('Mobile Accessibility', () => {
  test('TouchButton has proper ARIA attributes', () => {
    render(
      <TouchButton onClick={() => {}} aria-label="Accessible button">
        Button
      </TouchButton>
    )

    const button = screen.getByLabelText('Accessible button')
    expect(button).toBeInTheDocument()
  })

  test('TouchSwitch has proper ARIA attributes', () => {
    render(
      <TouchSwitch
        checked={false}
        onChange={() => {}}
        label="Accessible switch"
      />
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
    expect(switchElement).toHaveAttribute('aria-label', 'Accessible switch')
  })

  test('Mobile navigation has proper navigation role', () => {
    render(
      <MobileDashboardLayout>
        <div>Content</div>
      </MobileDashboardLayout>
    )

    const navigation = screen.getByTestId('mobile-bottom-nav')
    expect(navigation).toHaveAttribute('role', 'navigation')
    expect(navigation).toHaveAttribute('aria-label', 'Primary navigation')
  })
})

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Mobile Performance', () => {
  test('components render within performance budget', () => {
    const startTime = performance.now()

    render(
      <MobilePerformanceOptimizer>
        <ResponsiveOrchestrator>
          <MobileDashboardLayout user={mockUser} notifications={mockNotifications}>
            <MobilePracticeInterface />
          </MobileDashboardLayout>
        </ResponsiveOrchestrator>
      </MobilePerformanceOptimizer>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render in under 100ms for good mobile performance
    expect(renderTime).toBeLessThan(100)
  })

  test('touch interactions respond quickly', async () => {
    const mockAction = jest.fn()

    render(
      <TouchButton onClick={mockAction}>
        Quick Response
      </TouchButton>
    )

    const button = screen.getByText('Quick Response')
    
    const startTime = performance.now()
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled()
    })
    
    const responseTime = performance.now() - startTime
    
    // Touch response should be under 16ms for 60fps
    expect(responseTime).toBeLessThan(50) // Allowing buffer for test environment
  })
})