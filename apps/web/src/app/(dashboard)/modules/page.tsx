/**
 * Module Library Page - PM Learning Module Discovery
 * Comprehensive module library with personalized recommendations
 */

'use client'

import React from 'react'
import { LibraryOrchestrator } from '@/components/modules/LibraryOrchestrator'
import { mockUserProfile } from '@/lib/mockModuleData'

export default function ModulesPage() {
  return (
    <div className="modules-page min-h-screen bg-gray-50">
      <LibraryOrchestrator
        userProfile={mockUserProfile}
        className="h-full"
      />
    </div>
  )
}