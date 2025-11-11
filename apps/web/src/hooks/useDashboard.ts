/**
 * Dashboard Hook for ShipSpeak
 * Manages dashboard state and provides PM-specific data
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '@/types/auth'
import { PMProgressData, LearningData } from '@/types/dashboard'
import { mockDashboardData } from '@/lib/mockData'

// =============================================================================
// HOOK INTERFACE
// =============================================================================

interface UseDashboardReturn {
  user: User | null
  progressData: PMProgressData | null
  learningData: LearningData | null
  isLoading: boolean
  hasContent: boolean
  error: string | null
  refreshData: () => Promise<void>
}

// =============================================================================
// MAIN HOOK
// =============================================================================

export const useDashboard = (): UseDashboardReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [progressData, setProgressData] = useState<PMProgressData | null>(null)
  const [learningData, setLearningData] = useState<LearningData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const hasContent = useCallback(() => {
    if (!user || !learningData) return false
    
    return learningData.practiceSessionsCompleted > 0 || 
           learningData.modulesCompleted > 0 ||
           learningData.weeklyStreak > 0
  }, [user, learningData])

  // =============================================================================
  // DATA LOADING
  // =============================================================================

  const loadDashboardData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API call with realistic loading time
      await new Promise(resolve => setTimeout(resolve, 800))

      // Load mock data (in real app, this would be API calls)
      const mockData = mockDashboardData.getDashboardData()
      
      setUser(mockData.user)
      setProgressData(mockData.progressData)
      setLearningData(mockData.learningData)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshData = useCallback(async (): Promise<void> => {
    await loadDashboardData()
  }, [loadDashboardData])

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    user,
    progressData,
    learningData,
    isLoading,
    hasContent: hasContent(),
    error,
    refreshData
  }
}