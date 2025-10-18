/**
 * Dashboard Layout Component Tests for ShipSpeak
 * TDD implementation following RED-GREEN-REFACTOR methodology
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js router
const mockPush = jest.fn()
const mockPathname = '/dashboard'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: mockPathname
  }),
  usePathname: () => mockPathname
}))

// Import component after mocks
import { DashboardLayout } from '@/components/dashboard-layout'

describe('DashboardLayout Component', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('Basic Structure', () => {
    it('should render dashboard layout with basic elements', () => {
      render(
        <DashboardLayout>
          <div data-testid="main-content">Test Content</div>
        </DashboardLayout>
      )

      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-main')).toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })

    it('should display ShipSpeak branding', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )

      expect(screen.getByText('ShipSpeak')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
    })

    it('should show navigation menu', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Meetings')).toBeInTheDocument()
      expect(screen.getByText('Practice')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
    })
  })

  describe('Navigation Functionality', () => {
    it('should navigate when menu items are clicked', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )

      const meetingsLink = screen.getByTestId('nav-meetings')
      fireEvent.click(meetingsLink)

      expect(mockPush).toHaveBeenCalledWith('/dashboard/meetings')
    })
  })

  describe('User Profile Section', () => {
    it('should show sign-in when not authenticated', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )

      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })

    it('should display user info when authenticated', () => {
      render(
        <DashboardLayout 
          user={{ 
            name: 'John Doe', 
            email: 'john@example.com',
            isAuthenticated: true 
          }}
        >
          <div>Content</div>
        </DashboardLayout>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByTestId('user-profile')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )

      const layout = screen.getByTestId('dashboard-layout')
      expect(layout).toHaveClass('responsive')
    })
  })

  describe('Real-time Updates', () => {
    it('should display notification badges', () => {
      render(
        <DashboardLayout 
          notifications={{ newMeetings: 3 }}
        >
          <div>Content</div>
        </DashboardLayout>
      )

      const meetingsNav = screen.getByTestId('nav-meetings')
      const badge = meetingsNav.querySelector('.notification-badge')
      expect(badge).toHaveTextContent('3')
    })

    it('should show processing status', () => {
      render(
        <DashboardLayout 
          processing={{ meetingsInProgress: 2 }}
        >
          <div>Content</div>
        </DashboardLayout>
      )

      expect(screen.getByTestId('processing-indicator')).toBeInTheDocument()
      expect(screen.getByText('2 meetings processing')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )

      expect(screen.getByLabelText('Dashboard navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )

      const meetingsLink = screen.getByTestId('nav-meetings')
      fireEvent.keyDown(meetingsLink, { key: 'Enter' })
      
      expect(mockPush).toHaveBeenCalledWith('/dashboard/meetings')
    })
  })

  describe('Performance', () => {
    it('should render without errors', () => {
      const start = performance.now()
      
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      )
      
      const end = performance.now()
      const renderTime = end - start
      
      expect(renderTime).toBeLessThan(100) // 100ms threshold
    })
  })
})