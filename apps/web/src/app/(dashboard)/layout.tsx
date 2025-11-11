/**
 * Dashboard Layout Wrapper for ShipSpeak
 * Provides consistent layout structure for all dashboard pages
 */

'use client'

import React from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface DashboardLayoutWrapperProps {
  children: React.ReactNode
}

export default function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  // Mock user data for development
  const mockUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    isAuthenticated: true
  }

  const mockNotifications = {
    newMeetings: 2,
    newModules: 1
  }

  const mockProcessing = {
    meetingsInProgress: 0
  }

  return (
    <DashboardLayout
      user={mockUser}
      notifications={mockNotifications}
      processing={mockProcessing}
    >
      {children}
    </DashboardLayout>
  )
}