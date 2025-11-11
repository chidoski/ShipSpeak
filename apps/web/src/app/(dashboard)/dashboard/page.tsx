/**
 * Dashboard Page for ShipSpeak
 * Career-intelligent dashboard with PM-specific metrics and empty states
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <DashboardContent />
    </div>
  )
}