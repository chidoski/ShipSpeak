/**
 * Meetings Page for ShipSpeak Dashboard
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Main page for meeting archive and capture functionality
 */

'use client'

import React from 'react'
import { MeetingArchive } from '@/components/meetings/MeetingArchive'

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MeetingArchive 
          userId="user-001"
          isExecutive={false}
          onMeetingSelect={(meeting) => {
            console.log('Meeting selected:', meeting.id)
            // Future: Navigate to detailed meeting view or trigger custom action
          }}
        />
      </div>
    </div>
  )
}