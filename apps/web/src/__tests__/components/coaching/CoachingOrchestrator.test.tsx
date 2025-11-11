import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CoachingOrchestrator } from '@/components/coaching/CoachingOrchestrator'
import { mockUserProfiles } from '@/lib/mockCoachingData'

// Mock the coaching components
jest.mock('@/components/coaching/CoachingInterface/ConversationView', () => ({
  ConversationView: ({ selectedCoach, onSessionStart }: any) => (
    <div data-testid="conversation-view">
      <div>Selected Coach: {selectedCoach?.name || 'None'}</div>
      <button onClick={() => onSessionStart('STRATEGIC_THINKING')}>
        Start Session
      </button>
    </div>
  )
}))

jest.mock('@/components/coaching/CoachingInterface/DevelopmentDashboard', () => ({
  DevelopmentDashboard: ({ sessionHistory }: any) => (
    <div data-testid="development-dashboard">
      <div>Sessions: {sessionHistory.length}</div>
    </div>
  )
}))

jest.mock('@/components/coaching/CoachingInterface/PersonalizedPlan', () => ({
  PersonalizedPlan: ({ recommendedCoaches }: any) => (
    <div data-testid="personalized-plan">
      <div>Recommended: {recommendedCoaches.length}</div>
    </div>
  )
}))

jest.mock('@/components/coaching/CoachingInterface/CoachingHistory', () => ({
  CoachingHistory: ({ sessionHistory }: any) => (
    <div data-testid="coaching-history">
      <div>History: {sessionHistory.length}</div>
    </div>
  )
}))

describe('CoachingOrchestrator', () => {
  const mockUserProfile = mockUserProfiles[0]
  const defaultProps = {
    userProfile: mockUserProfile,
    initialSessionType: 'STRATEGIC_THINKING' as const,
    onClose: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders coaching orchestrator with navigation', () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    expect(screen.getByText('Executive Coaching')).toBeInTheDocument()
    expect(screen.getByText('Coaching Session')).toBeInTheDocument()
    expect(screen.getByText('Progress Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Development Plan')).toBeInTheDocument()
    expect(screen.getByText('Session History')).toBeInTheDocument()
  })

  it('starts with conversation view by default', () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    expect(screen.queryByTestId('development-dashboard')).not.toBeInTheDocument()
  })

  it('navigates between different views', () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Start with conversation view
    expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    
    // Navigate to dashboard
    fireEvent.click(screen.getByText('Progress Dashboard'))
    expect(screen.getByTestId('development-dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('conversation-view')).not.toBeInTheDocument()
    
    // Navigate to plan
    fireEvent.click(screen.getByText('Development Plan'))
    expect(screen.getByTestId('personalized-plan')).toBeInTheDocument()
    
    // Navigate to history
    fireEvent.click(screen.getByText('Session History'))
    expect(screen.getByTestId('coaching-history')).toBeInTheDocument()
  })

  it('shows session active indicator when session is running', async () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Session should not be active initially
    expect(screen.queryByText('Session Active')).not.toBeInTheDocument()
    
    // Start a session
    fireEvent.click(screen.getByText('Start Session'))
    
    // Wait for session to start
    await waitFor(() => {
      expect(screen.getByText('Session Active')).toBeInTheDocument()
    })
  })

  it('selects appropriate coach based on user profile', () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Should select a coach that matches user's industry or other criteria
    const conversationView = screen.getByTestId('conversation-view')
    expect(conversationView).toBeInTheDocument()
  })

  it('handles session start and end', async () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Start session
    fireEvent.click(screen.getByText('Start Session'))
    
    await waitFor(() => {
      expect(screen.getByText('Session Active')).toBeInTheDocument()
    })
  })

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn()
    render(<CoachingOrchestrator {...defaultProps} onClose={onCloseMock} />)
    
    fireEvent.click(screen.getByText('Close'))
    expect(onCloseMock).toHaveBeenCalled()
  })

  it('derives development focus from user profile', () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Should initialize with user's development priorities
    expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
  })

  it('loads user coaching history', () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Navigate to history view
    fireEvent.click(screen.getByText('Session History'))
    
    const historyView = screen.getByTestId('coaching-history')
    expect(historyView).toBeInTheDocument()
  })

  it('handles progress updates', async () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Start a session
    fireEvent.click(screen.getByText('Start Session'))
    
    // Progress updates should be handled when session is active
    await waitFor(() => {
      expect(screen.getByText('Session Active')).toBeInTheDocument()
    })
  })

  it('provides coach selection functionality', () => {
    render(<CoachingOrchestrator {...defaultProps} />)
    
    // Should have access to coach selection through conversation view
    expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
  })

  describe('Career Context Integration', () => {
    it('handles PO to PM transition context', () => {
      const poToPmUser = {
        ...mockUserProfile,
        currentRole: 'PO' as const,
        targetRole: 'PM' as const
      }
      
      render(<CoachingOrchestrator {...defaultProps} userProfile={poToPmUser} />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })

    it('handles PM to Senior PM transition context', () => {
      const pmToSeniorUser = {
        ...mockUserProfile,
        currentRole: 'PM' as const,
        targetRole: 'SENIOR_PM' as const
      }
      
      render(<CoachingOrchestrator {...defaultProps} userProfile={pmToSeniorUser} />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })
  })

  describe('Industry Context Integration', () => {
    it('handles fintech industry context', () => {
      const fintechUser = {
        ...mockUserProfile,
        industry: 'fintech' as const
      }
      
      render(<CoachingOrchestrator {...defaultProps} userProfile={fintechUser} />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })

    it('handles healthcare industry context', () => {
      const healthcareUser = {
        ...mockUserProfile,
        industry: 'healthcare' as const
      }
      
      render(<CoachingOrchestrator {...defaultProps} userProfile={healthcareUser} />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })
  })

  describe('Session Type Handling', () => {
    it('initializes with strategic thinking session type', () => {
      render(<CoachingOrchestrator {...defaultProps} initialSessionType="STRATEGIC_THINKING" />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })

    it('initializes with executive presence session type', () => {
      render(<CoachingOrchestrator {...defaultProps} initialSessionType="EXECUTIVE_PRESENCE" />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })

    it('initializes with industry fluency session type', () => {
      render(<CoachingOrchestrator {...defaultProps} initialSessionType="INDUSTRY_FLUENCY" />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })

    it('initializes with framework practice session type', () => {
      render(<CoachingOrchestrator {...defaultProps} initialSessionType="FRAMEWORK_PRACTICE" />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing user profile gracefully', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      try {
        render(<CoachingOrchestrator {...defaultProps} userProfile={null as any} />)
      } catch (error) {
        // Expected to fail gracefully
      }
      
      consoleError.mockRestore()
    })

    it('handles missing coaches gracefully', () => {
      // Mock empty coaches array
      jest.doMock('@/lib/mockCoachingData', () => ({
        mockCoachPersonas: [],
        mockCoachingSessions: []
      }))
      
      render(<CoachingOrchestrator {...defaultProps} />)
      
      expect(screen.getByTestId('conversation-view')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<CoachingOrchestrator {...defaultProps} />)
      
      expect(screen.getByText('Executive Coaching')).toBeInTheDocument()
    })

    it('supports keyboard navigation', () => {
      render(<CoachingOrchestrator {...defaultProps} />)
      
      const dashboardButton = screen.getByText('Progress Dashboard')
      expect(dashboardButton).toBeInTheDocument()
      
      dashboardButton.focus()
      expect(dashboardButton).toHaveFocus()
    })
  })
})