/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileContrastOptimizer } from '../../../../components/MobileResponsive/AccessibilityOptimization/MobileContrastOptimizer'

// Mock AmbientLightSensor
const mockAmbientLightSensor = {
  start: jest.fn(),
  stop: jest.fn(),
  onreading: null,
  onerror: null,
  illuminance: 100
}

Object.defineProperty(window, 'AmbientLightSensor', {
  value: jest.fn(() => mockAmbientLightSensor),
  writable: true
})

describe('MobileContrastOptimizer', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()
    
    // Reset DOM styles
    document.documentElement.style.cssText = ''
    
    // Reset sensor mock
    mockAmbientLightSensor.start.mockClear()
    mockAmbientLightSensor.stop.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <MobileContrastOptimizer>
          <div>Test content</div>
        </MobileContrastOptimizer>
      )

      expect(screen.getByTestId('mobile-contrast-optimizer')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
      expect(screen.getByTestId('contrast-settings-button')).toBeInTheDocument()
    })

    it('displays correct data attributes for default state', () => {
      render(
        <MobileContrastOptimizer pmIndustry="fintech">
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      const container = screen.getByTestId('mobile-contrast-optimizer')
      expect(container).toHaveAttribute('data-contrast-level', 'NORMAL')
      expect(container).toHaveAttribute('data-auto-mode', 'true')
      expect(container).toHaveAttribute('data-industry', 'fintech')
    })

    it('renders contrast control button with correct label', () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      const button = screen.getByLabelText('Open contrast settings')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('◐')
    })
  })

  describe('Contrast Settings Modal', () => {
    it('opens settings modal when button is clicked', async () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      const settingsButton = screen.getByTestId('contrast-settings-button')
      fireEvent.click(settingsButton)

      await waitFor(() => {
        expect(screen.getByText('Display & Contrast Settings')).toBeInTheDocument()
        expect(screen.getByLabelText('Auto-adjust based on lighting')).toBeInTheDocument()
      })
    })

    it('closes settings modal with close button', async () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      // Open settings
      const settingsButton = screen.getByTestId('contrast-settings-button')
      fireEvent.click(settingsButton)

      await waitFor(() => {
        expect(screen.getByText('Display & Contrast Settings')).toBeInTheDocument()
      })

      // Close settings
      const closeButton = screen.getByLabelText('Close settings')
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Display & Contrast Settings')).not.toBeInTheDocument()
      })
    })

    it('displays all contrast level options', async () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      const settingsButton = screen.getByTestId('contrast-settings-button')
      fireEvent.click(settingsButton)

      await waitFor(() => {
        expect(screen.getByLabelText('Normal')).toBeInTheDocument()
        expect(screen.getByLabelText('High Contrast')).toBeInTheDocument()
        expect(screen.getByLabelText('Maximum Contrast')).toBeInTheDocument()
      })
    })

    it('shows text size slider', async () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      const settingsButton = screen.getByTestId('contrast-settings-button')
      fireEvent.click(settingsButton)

      await waitFor(() => {
        const slider = screen.getByLabelText('Text size multiplier')
        expect(slider).toBeInTheDocument()
        expect(slider).toHaveAttribute('type', 'range')
        expect(slider).toHaveAttribute('min', '0.8')
        expect(slider).toHaveAttribute('max', '1.5')
      })
    })
  })

  describe('Contrast Level Management', () => {
    it('changes contrast level when radio button is selected', async () => {
      const mockCallback = jest.fn()

      render(
        <MobileContrastOptimizer onContrastChange={mockCallback}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      // Open settings
      fireEvent.click(screen.getByTestId('contrast-settings-button'))

      await waitFor(() => {
        expect(screen.getByLabelText('High Contrast')).toBeInTheDocument()
      })

      // Select high contrast
      fireEvent.click(screen.getByLabelText('High Contrast'))

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'HIGH',
            label: 'High Contrast',
            multiplier: 1.5
          })
        )
      })

      const container = screen.getByTestId('mobile-contrast-optimizer')
      expect(container).toHaveAttribute('data-contrast-level', 'HIGH')
    })

    it('applies CSS custom properties when contrast changes', async () => {
      render(
        <MobileContrastOptimizer pmIndustry="healthcare">
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      // Open settings and select maximum contrast
      fireEvent.click(screen.getByTestId('contrast-settings-button'))
      
      await waitFor(() => {
        fireEvent.click(screen.getByLabelText('Maximum Contrast'))
      })

      // Check that CSS custom properties are set
      const root = document.documentElement
      expect(root.style.getPropertyValue('--text-scale')).toBeTruthy()
      expect(root.style.getPropertyValue('--background-opacity')).toBeTruthy()
    })

    it('disables manual selection when auto mode is enabled', async () => {
      render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      fireEvent.click(screen.getByTestId('contrast-settings-button'))

      await waitFor(() => {
        const autoCheckbox = screen.getByLabelText('Auto-adjust based on lighting')
        expect(autoCheckbox).toBeChecked()

        const highContrastRadio = screen.getByLabelText('High Contrast')
        expect(highContrastRadio).toBeDisabled()
      })
    })
  })

  describe('Auto-Adjustment Features', () => {
    it('toggles auto mode when checkbox is clicked', async () => {
      render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      fireEvent.click(screen.getByTestId('contrast-settings-button'))

      await waitFor(() => {
        const autoCheckbox = screen.getByLabelText('Auto-adjust based on lighting')
        expect(autoCheckbox).toBeChecked()
      })

      // Toggle auto mode off
      fireEvent.click(screen.getByLabelText('Auto-adjust based on lighting'))

      await waitFor(() => {
        expect(screen.getByLabelText('Auto-adjust based on lighting')).not.toBeChecked()
        expect(screen.getByLabelText('High Contrast')).not.toBeDisabled()
      })
    })

    it('initializes ambient light sensor when available', () => {
      render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      expect(window.AmbientLightSensor).toHaveBeenCalled()
      expect(mockAmbientLightSensor.start).toHaveBeenCalled()
    })

    it('handles ambient light sensor readings', async () => {
      render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      // Simulate low light reading
      mockAmbientLightSensor.illuminance = 5
      mockAmbientLightSensor.onreading?.()

      await waitFor(() => {
        const container = screen.getByTestId('mobile-contrast-optimizer')
        expect(container).toHaveAttribute('data-contrast-level', 'MAXIMUM')
      })
    })

    it('shows current light reading in settings', async () => {
      render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      // Set illuminance and trigger reading
      mockAmbientLightSensor.illuminance = 150
      mockAmbientLightSensor.onreading?.()

      fireEvent.click(screen.getByTestId('contrast-settings-button'))

      await waitFor(() => {
        expect(screen.getByText('Current light: 150 lux')).toBeInTheDocument()
      })
    })

    it('handles ambient light sensor errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      // Simulate sensor error
      mockAmbientLightSensor.onerror?.({ error: 'permission-denied' })

      expect(consoleSpy).toHaveBeenCalledWith('Ambient light sensor error:', { error: 'permission-denied' })

      consoleSpy.mockRestore()
    })
  })

  describe('Text Size Control', () => {
    it('updates text size when slider changes', async () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      fireEvent.click(screen.getByTestId('contrast-settings-button'))

      const slider = await waitFor(() => screen.getByLabelText('Text size multiplier'))
      fireEvent.change(slider, { target: { value: '1.3' } })

      // Wait for the CSS property to be updated
      await waitFor(() => {
        const root = document.documentElement
        expect(root.style.getPropertyValue('--text-scale')).toBe('1.3')
      })
    })

    it('shows correct range labels for text size', async () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      fireEvent.click(screen.getByTestId('contrast-settings-button'))

      await waitFor(() => {
        expect(screen.getByText('Small')).toBeInTheDocument()
        expect(screen.getByText('Large')).toBeInTheDocument()
      })
    })
  })

  describe('Industry-Specific Features', () => {
    it('applies healthcare industry styles', () => {
      render(
        <MobileContrastOptimizer pmIndustry="healthcare">
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      const container = screen.getByTestId('mobile-contrast-optimizer')
      expect(container).toHaveAttribute('data-industry', 'healthcare')
    })

    it('adapts color scheme for different industries', () => {
      const industries = ['healthcare', 'fintech', 'cybersecurity', 'enterprise', 'consumer'] as const

      industries.forEach(industry => {
        const { unmount } = render(
          <MobileContrastOptimizer pmIndustry={industry}>
            <div>Content</div>
          </MobileContrastOptimizer>
        )

        const container = screen.getByTestId('mobile-contrast-optimizer')
        expect(container).toHaveAttribute('data-industry', industry)
        
        unmount()
      })
    })

    it('applies industry-specific CSS variables', async () => {
      render(
        <MobileContrastOptimizer pmIndustry="cybersecurity">
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      // Trigger contrast change to apply styles
      fireEvent.click(screen.getByTestId('contrast-settings-button'))
      
      await waitFor(() => {
        fireEvent.click(screen.getByLabelText('High Contrast'))
      })

      // Check that industry-specific CSS variables are set
      const root = document.documentElement
      expect(root.style.getPropertyValue('--security-high')).toBeTruthy()
      expect(root.style.getPropertyValue('--security-medium')).toBeTruthy()
      expect(root.style.getPropertyValue('--security-low')).toBeTruthy()
    })
  })

  describe('Accessibility Features', () => {
    it('provides proper ARIA labels', () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      expect(screen.getByLabelText('Open contrast settings')).toBeInTheDocument()
    })

    it('marks settings overlay as dialog', async () => {
      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      fireEvent.click(screen.getByTestId('contrast-settings-button'))

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
        expect(dialog).toHaveAttribute('aria-label', 'Contrast settings')
      })
    })

    it('supports prefers-contrast media query', () => {
      // Mock CSS.supports for high contrast
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('prefers-contrast: high'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <MobileContrastOptimizer>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      expect(screen.getByTestId('mobile-contrast-optimizer')).toBeInTheDocument()
    })
  })

  describe('Cleanup and Memory Management', () => {
    it('stops ambient light sensor on unmount', () => {
      const { unmount } = render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      unmount()

      expect(mockAmbientLightSensor.stop).toHaveBeenCalled()
    })

    it('handles sensor stop errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockAmbientLightSensor.stop.mockImplementation(() => {
        throw new Error('Sensor stop failed')
      })

      const { unmount } = render(
        <MobileContrastOptimizer enableAutoAdjustment={true}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      unmount()

      expect(consoleSpy).toHaveBeenCalledWith('Error stopping ambient light sensor:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('Integration with PM Context', () => {
    it('supports all PM industry contexts', () => {
      const industries = ['healthcare', 'fintech', 'cybersecurity', 'enterprise', 'consumer'] as const

      industries.forEach(industry => {
        const { unmount } = render(
          <MobileContrastOptimizer pmIndustry={industry}>
            <div>Industry: {industry}</div>
          </MobileContrastOptimizer>
        )

        expect(screen.getByText(`Industry: ${industry}`)).toBeInTheDocument()
        unmount()
      })
    })

    it('calls onContrastChange callback with correct parameters', async () => {
      const mockCallback = jest.fn()

      render(
        <MobileContrastOptimizer onContrastChange={mockCallback}>
          <div>Content</div>
        </MobileContrastOptimizer>
      )

      fireEvent.click(screen.getByTestId('contrast-settings-button'))
      
      await waitFor(() => {
        fireEvent.click(screen.getByLabelText('Maximum Contrast'))
      })

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'MAXIMUM',
          label: 'Maximum Contrast',
          multiplier: 2.0,
          textScale: 1.2,
          backgroundOpacity: 0.9
        })
      )
    })
  })
})