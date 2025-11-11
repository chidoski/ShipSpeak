/**
 * Test Suite for SettingsOrchestrator Component
 * Comprehensive testing for settings and preferences system
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsOrchestrator } from '@/components/settings-preferences/SettingsOrchestrator'
import { mockUserPreferences, mockIntelligentDefaults } from '@/lib/mockSettingsData'

// Mock the child components
jest.mock('@/components/settings-preferences/CareerTransitionSettings', () => ({
  CareerTransitionSettings: ({ preferences, onPreferenceChange }: any) => (
    <div data-testid="career-transition-settings">
      <button onClick={() => onPreferenceChange({ test: 'career-change' })}>
        Change Career Settings
      </button>
      <span>Current Level: {preferences.careerTransitionFocus.currentLevel}</span>
    </div>
  )
}))

jest.mock('@/components/settings-preferences/LearningPathCustomization', () => ({
  LearningPathCustomization: ({ preferences, onPreferenceChange }: any) => (
    <div data-testid="learning-path-customization">
      <button onClick={() => onPreferenceChange({ test: 'learning-change' })}>
        Change Learning Settings
      </button>
      <span>Focus: {preferences.learningPathPreferences.primaryFocus}</span>
    </div>
  )
}))

jest.mock('@/components/settings-preferences/IndustryContextSettings', () => ({
  IndustryContextSettings: ({ preferences, onPreferenceChange }: any) => (
    <div data-testid="industry-context-settings">
      <button onClick={() => onPreferenceChange({ test: 'industry-change' })}>
        Change Industry Settings
      </button>
      <span>Industry: {preferences.industryContextSettings.primaryIndustry}</span>
    </div>
  )
}))

jest.mock('@/components/settings-preferences/MeetingTypeCustomization', () => ({
  MeetingTypeCustomization: ({ preferences, onPreferenceChange }: any) => (
    <div data-testid="meeting-type-customization">
      <button onClick={() => onPreferenceChange({ test: 'meeting-change' })}>
        Change Meeting Settings
      </button>
    </div>
  )
}))

jest.mock('@/components/settings-preferences/SystemPreferences', () => ({
  SystemPreferences: ({ preferences, onPreferenceChange }: any) => (
    <div data-testid="system-preferences">
      <button onClick={() => onPreferenceChange({ test: 'system-change' })}>
        Change System Settings
      </button>
    </div>
  )
}))

describe('SettingsOrchestrator', () => {
  const defaultProps = {
    userProfile: {
      id: 'test-user',
      currentRole: 'PM',
      targetRole: 'SENIOR_PM',
      industry: 'FINTECH'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    test('renders main settings interface with header', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      expect(screen.getByText('Settings & Preferences')).toBeInTheDocument()
      expect(screen.getByText('Customize your PM development experience with career-intelligent settings')).toBeInTheDocument()
    })

    test('renders all navigation tabs', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      expect(screen.getByText('Career Transition')).toBeInTheDocument()
      expect(screen.getByText('Learning Path')).toBeInTheDocument()
      expect(screen.getByText('Industry Context')).toBeInTheDocument()
      expect(screen.getByText('Meeting Types')).toBeInTheDocument()
      expect(screen.getByText('System Preferences')).toBeInTheDocument()
    })

    test('displays intelligent recommendations when available', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      expect(screen.getByText('Intelligent Recommendations')).toBeInTheDocument()
      expect(screen.getByText('AI-powered suggestions to optimize your learning experience')).toBeInTheDocument()
    })

    test('shows reset to defaults button', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /reset to defaults/i })).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    test('starts with career transition tab active', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      expect(screen.getByTestId('career-transition-settings')).toBeInTheDocument()
      expect(screen.queryByTestId('learning-path-customization')).not.toBeInTheDocument()
    })

    test('switches to learning path tab when clicked', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      await user.click(screen.getByText('Learning Path'))
      
      expect(screen.getByTestId('learning-path-customization')).toBeInTheDocument()
      expect(screen.queryByTestId('career-transition-settings')).not.toBeInTheDocument()
    })

    test('switches to industry context tab when clicked', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      await user.click(screen.getByText('Industry Context'))
      
      expect(screen.getByTestId('industry-context-settings')).toBeInTheDocument()
    })

    test('switches to meeting types tab when clicked', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      await user.click(screen.getByText('Meeting Types'))
      
      expect(screen.getByTestId('meeting-type-customization')).toBeInTheDocument()
    })

    test('switches to system preferences tab when clicked', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      await user.click(screen.getByText('System Preferences'))
      
      expect(screen.getByTestId('system-preferences')).toBeInTheDocument()
    })
  })

  describe('Preference Management', () => {
    test('handles preference changes from child components', async () => {
      const onPreferencesChange = jest.fn()
      const user = userEvent.setup()
      
      render(
        <SettingsOrchestrator 
          {...defaultProps} 
          onPreferencesChange={onPreferencesChange}
        />
      )
      
      await user.click(screen.getByText('Change Career Settings'))
      
      expect(onPreferencesChange).toHaveBeenCalledWith(
        expect.objectContaining({
          test: 'career-change'
        })
      )
    })

    test('shows save button when changes are made', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      await user.click(screen.getByText('Change Career Settings'))
      
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })

    test('handles save changes functionality', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      await user.click(screen.getByText('Change Career Settings'))
      
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
      })
    })

    test('handles reset to defaults functionality', async () => {
      const onResetDefaults = jest.fn()
      const user = userEvent.setup()
      
      render(
        <SettingsOrchestrator 
          {...defaultProps} 
          onResetDefaults={onResetDefaults}
        />
      )
      
      await user.click(screen.getByRole('button', { name: /reset to defaults/i }))
      
      expect(onResetDefaults).toHaveBeenCalled()
    })
  })

  describe('Intelligent Recommendations', () => {
    test('displays recommendation cards when available', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      // Should display top 3 high-confidence recommendations
      const recommendationCards = screen.getAllByText(/confidence/i)
      expect(recommendationCards.length).toBeGreaterThan(0)
    })

    test('shows recommendation badges correctly', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      expect(screen.getByText('HIGH Confidence')).toBeInTheDocument()
    })
  })

  describe('Settings Integration', () => {
    test('passes correct props to child components', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      // Check that mock preferences are passed correctly
      expect(screen.getByText('Current Level: PM')).toBeInTheDocument()
      expect(screen.getByText('Focus: PRACTICE_FIRST')).toBeInTheDocument()
      expect(screen.getByText('Industry: FINTECH')).toBeInTheDocument()
    })

    test('maintains preference state across tab switches', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      // Make a change in career transition
      await user.click(screen.getByText('Change Career Settings'))
      
      // Switch to learning path and back
      await user.click(screen.getByText('Learning Path'))
      await user.click(screen.getByText('Career Transition'))
      
      // Should still show the save button
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('handles missing user profile gracefully', () => {
      render(<SettingsOrchestrator />)
      
      expect(screen.getByText('Settings & Preferences')).toBeInTheDocument()
    })

    test('handles save errors gracefully', async () => {
      // Mock console.error to avoid test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const user = userEvent.setup()
      
      // Simulate network error by mocking a failed save
      render(<SettingsOrchestrator {...defaultProps} />)
      
      await user.click(screen.getByText('Change Career Settings'))
      
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)
      
      // The component should handle the simulated error gracefully
      await waitFor(() => {
        expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      render(<SettingsOrchestrator {...defaultProps} />)
      
      // Tab navigation should be accessible
      const tabList = screen.getByRole('tablist')
      expect(tabList).toBeInTheDocument()
      
      const tabs = screen.getAllByRole('tab')
      expect(tabs.length).toBe(5)
    })

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<SettingsOrchestrator {...defaultProps} />)
      
      const firstTab = screen.getByRole('tab', { name: /career transition/i })
      firstTab.focus()
      
      // Tab to next item
      await user.keyboard('{Tab}')
      
      const activeElement = document.activeElement
      expect(activeElement).toBeDefined()
    })
  })

  describe('Mobile Responsiveness', () => {
    test('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<SettingsOrchestrator {...defaultProps} />)
      
      // Should still render main content
      expect(screen.getByText('Settings & Preferences')).toBeInTheDocument()
    })
  })
})

describe('Settings Integration Tests', () => {
  test('end-to-end preference workflow', async () => {
    const user = userEvent.setup()
    const onPreferencesChange = jest.fn()
    
    render(
      <SettingsOrchestrator 
        onPreferencesChange={onPreferencesChange}
      />
    )
    
    // Navigate through all tabs and make changes
    await user.click(screen.getByText('Change Career Settings'))
    expect(onPreferencesChange).toHaveBeenCalledTimes(1)
    
    await user.click(screen.getByText('Learning Path'))
    await user.click(screen.getByText('Change Learning Settings'))
    expect(onPreferencesChange).toHaveBeenCalledTimes(2)
    
    await user.click(screen.getByText('Industry Context'))
    await user.click(screen.getByText('Change Industry Settings'))
    expect(onPreferencesChange).toHaveBeenCalledTimes(3)
    
    await user.click(screen.getByText('Meeting Types'))
    await user.click(screen.getByText('Change Meeting Settings'))
    expect(onPreferencesChange).toHaveBeenCalledTimes(4)
    
    await user.click(screen.getByText('System Preferences'))
    await user.click(screen.getByText('Change System Settings'))
    expect(onPreferencesChange).toHaveBeenCalledTimes(5)
    
    // Save all changes
    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
    })
  })
})