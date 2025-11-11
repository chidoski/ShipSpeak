import { DashboardOrchestrator } from '@/components/progress-dashboard/DashboardOrchestrator'

export default function ProgressPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Progress Dashboard</h1>
        <p className="text-muted-foreground">
          Track your PM career development and skill advancement
        </p>
      </div>
      <DashboardOrchestrator />
    </div>
  )
}