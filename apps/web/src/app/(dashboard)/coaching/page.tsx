'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CoachingOrchestrator } from '@/components/coaching/CoachingOrchestrator'
import { mockUserProfiles } from '@/lib/mockCoachingData'
import type { CoachingSessionType } from '@/types/coaching'

// =============================================================================
// COACHING PAGE COMPONENT
// =============================================================================

export default function CoachingPage() {
  const router = useRouter()
  const [sessionType, setSessionType] = useState<CoachingSessionType>('STRATEGIC_THINKING')
  
  // Mock user profile - in production this would come from auth context
  const userProfile = mockUserProfiles[0]

  const handleClose = () => {
    router.push('/dashboard')
  }

  return (
    <div className="coaching-page">
      <CoachingOrchestrator
        userProfile={userProfile}
        initialSessionType={sessionType}
        onClose={handleClose}
      />
      
      <style jsx>{`
        .coaching-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
      `}</style>
    </div>
  )
}