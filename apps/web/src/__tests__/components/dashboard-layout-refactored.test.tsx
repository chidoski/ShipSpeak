/**
 * Tests for Refactored Dashboard Layout Component
 * Ensures refactored version maintains same functionality
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DashboardLayoutRefactored } from '@/components/dashboard-layout-refactored'

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

describe('DashboardLayoutRefactored Component', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('should render with same structure as original', () => {
    render(
      <DashboardLayoutRefactored>
        <div data-testid="main-content">Test Content</div>
      </DashboardLayoutRefactored>
    )

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-main')).toBeInTheDocument()
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
  })

  it('should display ShipSpeak branding', () => {
    render(
      <DashboardLayoutRefactored>
        <div>Content</div>
      </DashboardLayoutRefactored>
    )

    expect(screen.getByText('ShipSpeak')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
  })

  it('should show navigation menu items', () => {
    render(
      <DashboardLayoutRefactored>
        <div>Content</div>
      </DashboardLayoutRefactored>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Meetings')).toBeInTheDocument()
    expect(screen.getByText('Practice')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('should handle navigation clicks', () => {
    render(
      <DashboardLayoutRefactored>
        <div>Content</div>
      </DashboardLayoutRefactored>
    )

    const meetingsLink = screen.getByTestId('nav-meetings')
    fireEvent.click(meetingsLink)

    expect(mockPush).toHaveBeenCalledWith('/dashboard/meetings')
  })

  it('should display user profile when authenticated', () => {
    render(
      <DashboardLayoutRefactored 
        user={{ 
          name: 'John Doe', 
          email: 'john@example.com',
          isAuthenticated: true 
        }}
      >
        <div>Content</div>
      </DashboardLayoutRefactored>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByTestId('user-profile')).toBeInTheDocument()
  })

  it('should show notification badges', () => {
    render(
      <DashboardLayoutRefactored 
        notifications={{ newMeetings: 3 }}
      >
        <div>Content</div>
      </DashboardLayoutRefactored>
    )

    const meetingsNav = screen.getByTestId('nav-meetings')
    const badge = meetingsNav.querySelector('.notification-badge')
    expect(badge).toHaveTextContent('3')
  })

  it('should show processing indicator', () => {
    render(
      <DashboardLayoutRefactored 
        processing={{ meetingsInProgress: 2 }}
      >
        <div>Content</div>
      </DashboardLayoutRefactored>
    )

    expect(screen.getByTestId('processing-indicator')).toBeInTheDocument()
    expect(screen.getByText('2 meetings processing')).toBeInTheDocument()
  })

  it('should support dark theme', () => {
    render(
      <DashboardLayoutRefactored theme="dark">
        <div>Content</div>
      </DashboardLayoutRefactored>
    )

    const layout = screen.getByTestId('dashboard-layout')
    expect(layout).toHaveClass('theme-dark')
  })
})