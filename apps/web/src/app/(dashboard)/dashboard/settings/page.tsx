import React from 'react'
import { SettingsOrchestrator } from '@/components/settings-preferences/SettingsOrchestrator'

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <SettingsOrchestrator />
    </div>
  )
}

export const metadata = {
  title: 'Settings & Preferences - ShipSpeak',
  description: 'Customize your PM development experience with career-intelligent settings and preferences',
}