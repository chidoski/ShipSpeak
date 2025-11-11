import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OnboardingOrchestrator from '../../../components/onboarding/OnboardingOrchestrator'
import type { UserProfile } from '../../../types/onboarding'

// Mock user profiles for testing
const mockPMToSeniorPMUser: UserProfile = {
  id: 'user-1',
  currentRole: 'PM',
  targetRole: 'SENIOR_PM',
  industry: 'FINTECH',
  experience: 'INTERMEDIATE',
  careerTransition: 'PM_TO_SENIOR_PM',
  completedOnboarding: false,
  preferences: {
    tourSpeed: 'MEDIUM',
    helpLevel: 'CONTEXTUAL',
    videoPreference: true,
    skipIntros: false
  }
}

const mockPOToPMUser: UserProfile = {
  id: 'user-2',
  currentRole: 'PO',
  targetRole: 'PM',
  industry: 'HEALTHCARE',
  experience: 'FOUNDATION',
  careerTransition: 'PO_TO_PM',
  completedOnboarding: false,
  preferences: {
    tourSpeed: 'SLOW',
    helpLevel: 'COMPREHENSIVE',
    videoPreference: true,
    skipIntros: false
  }
}

describe('OnboardingOrchestrator', () => {
  describe('Component Rendering', () => {
    it('renders onboarding orchestrator with PM to Senior PM context', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText('Executive Development Guidance')).toBeInTheDocument()
      expect(screen.getByText(/PM → Senior PM transition/i)).toBeInTheDocument()
      expect(screen.getByText('Onboarding Progress')).toBeInTheDocument()
    })

    it('displays correct career transition title for PO to PM', () => {
      render(<OnboardingOrchestrator userProfile={mockPOToPMUser} />)
      
      expect(screen.getByText(/PO → PM transition/i)).toBeInTheDocument()
    })

    it('shows progress indicator with initial completion percentage', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText(/25% Complete/i)).toBeInTheDocument()
    })

    it('renders close button when onClose handler provided', () => {
      const mockOnClose = jest.fn()
      render(
        <OnboardingOrchestrator 
          userProfile={mockPMToSeniorPMUser} 
          onClose={mockOnClose} 
        />
      )
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
      
      fireEvent.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Tour Management', () => {
    it('filters tours based on career transition relevance', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      // Should show PM to Senior PM specific tours
      expect(screen.getByText('Executive Communication Mastery')).toBeInTheDocument()
      expect(screen.getByText(/answer-first methodology/i)).toBeInTheDocument()
    })

    it('filters tours based on industry context', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      // Should show fintech-specific tour for fintech user
      expect(screen.getByText('Fintech Regulatory Communication')).toBeInTheDocument()
      expect(screen.getByText(/SEC compliance/i)).toBeInTheDocument()
    })

    it('prioritizes HIGH priority tours first', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      const priorityBadges = screen.getAllByText('HIGH Priority')
      const mediumBadges = screen.getAllByText('MEDIUM Priority')
      
      expect(priorityBadges.length).toBeGreaterThan(0)
      expect(mediumBadges.length).toBeGreaterThan(0)
      
      // First tour should be high priority (in document order)
      const firstTourCard = screen.getAllByText(/Start Tour/i)[0].closest('[role="button"]')
      expect(firstTourCard).toHaveTextContent('HIGH Priority')
    })

    it('starts tour when Start Tour button clicked', async () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      const startButton = screen.getAllByText('Start Tour')[0]
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Step 1 of/i)).toBeInTheDocument()
        expect(screen.getByText('Your Executive Communication Score')).toBeInTheDocument()
      })
    })
  })

  describe('Active Tour Navigation', () => {
    beforeEach(() => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      // Start the first tour
      const startButton = screen.getAllByText('Start Tour')[0]
      fireEvent.click(startButton)
    })

    it('displays current tour step with explanation and career context', async () => {
      await waitFor(() => {
        expect(screen.getByText('Your Executive Communication Score')).toBeInTheDocument()
        expect(screen.getByText(/This score reflects your answer-first structure/i)).toBeInTheDocument()
        expect(screen.getByText(/Senior PMs need 8.5+ executive communication/i)).toBeInTheDocument()
      })
    })

    it('advances to next step when Next Step clicked', async () => {
      await waitFor(() => {
        const nextButton = screen.getByText('Next Step')
        fireEvent.click(nextButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Practice Answer-First Structure')).toBeInTheDocument()
        expect(screen.getByText(/Step 2 of/i)).toBeInTheDocument()
      })
    })

    it('completes tour when on final step', async () => {
      // Navigate to final step
      await waitFor(() => {
        const nextButton = screen.getByText('Next Step')
        fireEvent.click(nextButton) // Step 2
      })

      await waitFor(() => {
        const completeButton = screen.getByText('Complete Tour')
        fireEvent.click(completeButton)
      })

      await waitFor(() => {
        // Should return to tour selection view
        expect(screen.getByText('Recommended Tours for Your Career Path')).toBeInTheDocument()
        // Progress should be updated
        expect(screen.getByText(/50% Complete/i)).toBeInTheDocument()
      })
    })

    it('allows skipping tour', async () => {
      await waitFor(() => {
        const skipButton = screen.getByText('Skip Tour')
        fireEvent.click(skipButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Recommended Tours for Your Career Path')).toBeInTheDocument()
      })
    })
  })

  describe('Adaptive Guidance', () => {
    it('displays career tips with appropriate urgency levels', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText(/Senior PM roles require 40% more executive communication/i)).toBeInTheDocument()
      expect(screen.getByText(/Meeting analysis shows your current executive communication score/i)).toBeInTheDocument()
    })

    it('shows guidance with visual urgency indicators', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      // Medium urgency should have blue styling
      const mediumUrgencyGuidance = screen.getByText(/Senior PM roles require 40% more executive communication/i).closest('div')
      expect(mediumUrgencyGuidance).toHaveClass('bg-blue-50')
      
      // Low urgency should have gray styling  
      const lowUrgencyGuidance = screen.getByText(/Meeting analysis shows your current executive communication score/i).closest('div')
      expect(lowUrgencyGuidance).toHaveClass('bg-gray-50')
    })
  })

  describe('User Experience Features', () => {
    it('shows completion rewards for tours', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText('Executive Communication Badge')).toBeInTheDocument()
      expect(screen.getByText('+10 Career Readiness')).toBeInTheDocument()
    })

    it('displays estimated duration for tours', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText('15min')).toBeInTheDocument()
      expect(screen.getByText('12min')).toBeInTheDocument()
    })

    it('shows career relevance and industry context', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText('PM → Senior PM')).toBeInTheDocument()
      expect(screen.getByText('All Industries')).toBeInTheDocument()
    })

    it('provides quick action buttons for different completion states', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText('Continue Later')).toBeInTheDocument()
      expect(screen.getByText('Start Recommended Tour')).toBeInTheDocument()
    })
  })

  describe('Career-Specific Content', () => {
    it('shows framework mastery tour for PO to PM transition', () => {
      render(<OnboardingOrchestrator userProfile={mockPOToPMUser} />)
      
      expect(screen.getByText('PM Framework Application')).toBeInTheDocument()
      expect(screen.getByText(/RICE, ICE, and Jobs-to-be-Done/i)).toBeInTheDocument()
      expect(screen.getByText('Framework Expert Badge')).toBeInTheDocument()
    })

    it('emphasizes executive communication for PM to Senior PM', () => {
      render(<OnboardingOrchestrator userProfile={mockPMToSeniorPMUser} />)
      
      expect(screen.getByText('Executive Communication Mastery')).toBeInTheDocument()
      expect(screen.getByText(/C-suite interaction patterns/i)).toBeInTheDocument()
    })

    it('adapts content based on industry context', () => {
      const healthcareUser = { ...mockPOToPMUser, industry: 'HEALTHCARE' as const }
      render(<OnboardingOrchestrator userProfile={healthcareUser} />)
      
      // Should not show fintech-specific content for healthcare user
      expect(screen.queryByText('Fintech Regulatory Communication')).not.toBeInTheDocument()
    })
  })
})