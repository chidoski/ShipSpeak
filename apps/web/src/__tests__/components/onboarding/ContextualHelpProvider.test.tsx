import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContextualHelpProvider from '../../../components/onboarding/InteractiveGuidance/ContextualHelpProvider'
import type { CareerTransitionType } from '../../../types/onboarding'

describe('ContextualHelpProvider', () => {
  const defaultProps = {
    currentPath: '/dashboard',
    userCareerTransition: 'PM_TO_SENIOR_PM' as CareerTransitionType,
    onHelpInteraction: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Trigger Detection', () => {
    it('shows meeting upload help on meeting upload page', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      expect(screen.getByText('Meeting Upload Best Practices')).toBeInTheDocument()
      expect(screen.getByText(/15-30 minute meeting segments/i)).toBeInTheDocument()
    })

    it('shows practice module help on modules page', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/modules" 
        />
      )
      
      expect(screen.getByText(/Choosing Practice Modules for PM → Senior PM/i)).toBeInTheDocument()
      expect(screen.getByText(/executive communication modules/i)).toBeInTheDocument()
    })

    it('shows analysis help on feedback page', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/analysis" 
        />
      )
      
      expect(screen.getByText('Interpreting Your Communication Analysis')).toBeInTheDocument()
      expect(screen.getByText(/Overall scores compare you to peers/i)).toBeInTheDocument()
    })

    it('shows dashboard confusion help for long time on dashboard', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard"
          userBehavior={{ timeOnPage: 35000 }}
        />
      )
      
      expect(screen.getByText('Understanding Your PM Development Dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Executive Readiness shows your preparedness/i)).toBeInTheDocument()
    })

    it('does not show help when no trigger matches', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/some/random/path" 
        />
      )
      
      expect(screen.queryByText(/Meeting Upload Best Practices/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Practice Modules/i)).not.toBeInTheDocument()
    })
  })

  describe('Career Transition Relevance', () => {
    it('shows PM to Senior PM specific help content', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/modules"
          userCareerTransition="PM_TO_SENIOR_PM"
        />
      )
      
      expect(screen.getByText(/PM → Senior PM/i)).toBeInTheDocument()
      expect(screen.getByText(/executive communication modules/i)).toBeInTheDocument()
      expect(screen.getByText(/Strategic module selection can accelerate PM → Senior PM advancement/i)).toBeInTheDocument()
    })

    it('filters help based on career relevance', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/modules"
          userCareerTransition="PO_TO_PM"
        />
      )
      
      // Should not show PM to Senior PM specific content for PO to PM user
      expect(screen.queryByText(/PM → Senior PM/i)).not.toBeInTheDocument()
    })

    it('shows ALL_LEVELS content for any career transition', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload"
          userCareerTransition="SENIOR_PM_TO_GROUP_PM"
        />
      )
      
      expect(screen.getByText('Meeting Upload Best Practices')).toBeInTheDocument()
      expect(screen.getByText(/ALL LEVELS/i)).toBeInTheDocument()
    })
  })

  describe('Help Content Display', () => {
    beforeEach(() => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
    })

    it('displays help title and career relevance badge', () => {
      expect(screen.getByText('Meeting Upload Best Practices')).toBeInTheDocument()
      expect(screen.getByText(/ALL LEVELS/i)).toBeInTheDocument()
    })

    it('shows quick tips section with first two tips', () => {
      expect(screen.getByText('Quick Tips')).toBeInTheDocument()
      expect(screen.getByText(/Upload 15-30 minute meeting segments/i)).toBeInTheDocument()
      expect(screen.getByText(/Include meetings where you presented/i)).toBeInTheDocument()
      
      // Should only show first 2 tips
      const tips = screen.getAllByText(/✓/i) // Assuming checkmarks for tips
      expect(tips).toHaveLength(2)
    })

    it('displays career impact section', () => {
      expect(screen.getByText('Career Impact')).toBeInTheDocument()
      expect(screen.getByText(/Quality meeting uploads directly improve/i)).toBeInTheDocument()
    })

    it('shows action buttons', () => {
      expect(screen.getByText('Learn More')).toBeInTheDocument()
      expect(screen.getByText('Video')).toBeInTheDocument()
    })

    it('displays related topics as badges', () => {
      expect(screen.getByText('Audio Quality')).toBeInTheDocument()
      expect(screen.getByText('Meeting Selection')).toBeInTheDocument()
      expect(screen.getByText('Analysis Optimization')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    beforeEach(() => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
    })

    it('calls onHelpInteraction when Learn More clicked', () => {
      const learnMoreButton = screen.getByText('Learn More')
      fireEvent.click(learnMoreButton)
      
      expect(defaultProps.onHelpInteraction).toHaveBeenCalledWith(
        'meeting-upload-help',
        'learn-more'
      )
    })

    it('calls onHelpInteraction when Video button clicked', () => {
      const videoButton = screen.getByText('Video')
      fireEvent.click(videoButton)
      
      expect(defaultProps.onHelpInteraction).toHaveBeenCalledWith(
        'meeting-upload-help',
        'watch-video'
      )
    })

    it('calls onHelpInteraction when related topic clicked', () => {
      const topicBadge = screen.getByText('Audio Quality')
      fireEvent.click(topicBadge)
      
      expect(defaultProps.onHelpInteraction).toHaveBeenCalledWith(
        'meeting-upload-help',
        'related-topic-Audio Quality'
      )
    })

    it('dismisses help and calls interaction handler when X clicked', () => {
      const dismissButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(dismissButton)
      
      expect(defaultProps.onHelpInteraction).toHaveBeenCalledWith(
        'meeting-upload-help',
        'dismissed'
      )
      
      expect(screen.queryByText('Meeting Upload Best Practices')).not.toBeInTheDocument()
    })
  })

  describe('Dismissal Management', () => {
    it('does not show previously dismissed help', () => {
      const { rerender } = render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      // Dismiss the help
      const dismissButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(dismissButton)
      
      // Re-render with same path - should not show help
      rerender(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      expect(screen.queryByText('Meeting Upload Best Practices')).not.toBeInTheDocument()
    })

    it('shows different help on path change even if previous was dismissed', () => {
      const { rerender } = render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      // Dismiss the help
      const dismissButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(dismissButton)
      
      // Change path to modules page
      rerender(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/modules"
        />
      )
      
      // Should show different help content
      expect(screen.getByText(/Choosing Practice Modules/i)).toBeInTheDocument()
    })
  })

  describe('Conditional Content Display', () => {
    it('shows video button only when video tutorial available', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      expect(screen.getByText('Video')).toBeInTheDocument()
    })

    it('hides video button when no video tutorial available', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/modules" 
        />
      )
      
      expect(screen.queryByText('Video')).not.toBeInTheDocument()
    })

    it('shows related topics when available', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      expect(screen.getByText('Audio Quality')).toBeInTheDocument()
      expect(screen.getByText('Meeting Selection')).toBeInTheDocument()
    })
  })

  describe('Visual Styling and Animation', () => {
    it('applies proper styling classes for contextual help card', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      const helpCard = screen.getByText('Meeting Upload Best Practices').closest('.border-blue-200')
      expect(helpCard).toHaveClass('bg-blue-50', 'shadow-lg')
    })

    it('positions help overlay in bottom-right corner', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      const helpContainer = screen.getByText('Meeting Upload Best Practices').closest('.fixed')
      expect(helpContainer).toHaveClass('bottom-4', 'right-4', 'z-50')
    })

    it('applies animation classes for help appearance', () => {
      render(
        <ContextualHelpProvider 
          {...defaultProps} 
          currentPath="/dashboard/meetings/upload" 
        />
      )
      
      const helpContainer = screen.getByText('Meeting Upload Best Practices').closest('.animate-in')
      expect(helpContainer).toHaveClass('slide-in-from-bottom-2')
    })
  })
})