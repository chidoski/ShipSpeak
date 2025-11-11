'use client'

import { DashboardOrchestrator } from '@/components/progress-dashboard/DashboardOrchestrator'

export default function ProgressPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Progress Dashboard</h1>
        <p className="text-muted-foreground">
          Track your PM communication skill development and career advancement
        </p>
      </div>
      
      <DashboardOrchestrator />
    </div>
  )
}