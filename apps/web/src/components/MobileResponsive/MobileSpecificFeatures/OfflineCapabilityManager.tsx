/**
 * Offline Capability Manager for ShipSpeak
 * Offline functionality for critical features with intelligent sync
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface OfflineData {
  practiceRecordings: Array<{
    id: string
    audioBlob: Blob
    metadata: any
    timestamp: number
  }>
  analysisResults: Array<{
    id: string
    data: any
    timestamp: number
  }>
  userProgress: {
    scores: any[]
    milestones: any[]
    lastSync: number
  }
  queuedActions: Array<{
    id: string
    type: string
    data: any
    timestamp: number
  }>
}

interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  lastSync: number
  pendingItems: number
  errors: string[]
}

interface OfflineCapabilityManagerProps {
  onSyncComplete?: (status: SyncStatus) => void
  onOfflineModeChange?: (isOffline: boolean) => void
  enableAutoSync?: boolean
  maxStorageSize?: number // MB
}

// =============================================================================
// OFFLINE CAPABILITY MANAGER COMPONENT
// =============================================================================

export const OfflineCapabilityManager: React.FC<OfflineCapabilityManagerProps> = ({
  onSyncComplete,
  onOfflineModeChange,
  enableAutoSync = true,
  maxStorageSize = 100
}) => {
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    lastSync: 0,
    pendingItems: 0,
    errors: []
  })
  const [offlineData, setOfflineData] = useState<OfflineData>({
    practiceRecordings: [],
    analysisResults: [],
    userProgress: { scores: [], milestones: [], lastSync: 0 },
    queuedActions: []
  })
  const [storageUsage, setStorageUsage] = useState(0)

  // =============================================================================
  // STORAGE MANAGEMENT
  // =============================================================================

  const getStorageKey = (type: string) => `shipspeak_offline_${type}`

  const saveToStorage = useCallback(async (key: string, data: any) => {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(getStorageKey(key), serialized)
      await updateStorageUsage()
      return true
    } catch (error) {
      console.error('Error saving to offline storage:', error)
      return false
    }
  }, [])

  const loadFromStorage = useCallback(async (key: string) => {
    try {
      const stored = localStorage.getItem(getStorageKey(key))
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error loading from offline storage:', error)
      return null
    }
  }, [])

  const updateStorageUsage = useCallback(async () => {
    try {
      let totalSize = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('shipspeak_offline_')) {
          const value = localStorage.getItem(key)
          totalSize += (value?.length || 0) * 2 // Approximate bytes (2 bytes per char)
        }
      }
      setStorageUsage(totalSize / 1024 / 1024) // Convert to MB
    } catch (error) {
      console.error('Error calculating storage usage:', error)
    }
  }, [])

  const cleanupStorage = useCallback(async () => {
    if (storageUsage > maxStorageSize) {
      // Remove oldest practice recordings first
      const recordings = offlineData.practiceRecordings
        .sort((a, b) => a.timestamp - b.timestamp)
      
      const toRemove = Math.ceil(recordings.length * 0.3) // Remove 30%
      const updatedRecordings = recordings.slice(toRemove)
      
      setOfflineData(prev => ({
        ...prev,
        practiceRecordings: updatedRecordings
      }))
      
      await saveToStorage('recordings', updatedRecordings)
    }
  }, [storageUsage, maxStorageSize, offlineData.practiceRecordings, saveToStorage])

  // =============================================================================
  // OFFLINE DATA MANAGEMENT
  // =============================================================================

  const storePracticeRecording = useCallback(async (audioBlob: Blob, metadata: any) => {
    const recording = {
      id: `offline_${Date.now()}`,
      audioBlob,
      metadata: {
        ...metadata,
        createdOffline: true,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }

    setOfflineData(prev => ({
      ...prev,
      practiceRecordings: [...prev.practiceRecordings, recording]
    }))

    // Convert blob to base64 for storage
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Data = reader.result as string
      saveToStorage('recordings', [
        ...offlineData.practiceRecordings,
        { ...recording, audioBlob: base64Data }
      ])
    }
    reader.readAsDataURL(audioBlob)

    return recording.id
  }, [offlineData.practiceRecordings, saveToStorage])

  const storeAnalysisResult = useCallback(async (analysisData: any) => {
    const result = {
      id: `analysis_${Date.now()}`,
      data: {
        ...analysisData,
        createdOffline: true,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }

    setOfflineData(prev => ({
      ...prev,
      analysisResults: [...prev.analysisResults, result]
    }))

    await saveToStorage('analysis', [...offlineData.analysisResults, result])
    return result.id
  }, [offlineData.analysisResults, saveToStorage])

  const queueAction = useCallback(async (type: string, actionData: any) => {
    const action = {
      id: `action_${Date.now()}`,
      type,
      data: actionData,
      timestamp: Date.now()
    }

    setOfflineData(prev => ({
      ...prev,
      queuedActions: [...prev.queuedActions, action]
    }))

    await saveToStorage('actions', [...offlineData.queuedActions, action])
    return action.id
  }, [offlineData.queuedActions, saveToStorage])

  // =============================================================================
  // SYNC FUNCTIONALITY
  // =============================================================================

  const syncOfflineData = useCallback(async () => {
    if (!isOnline) return

    setSyncStatus(prev => ({ ...prev, isSyncing: true, errors: [] }))

    try {
      let syncedItems = 0
      const errors: string[] = []

      // Sync practice recordings
      for (const recording of offlineData.practiceRecordings) {
        try {
          // Convert base64 back to blob if needed
          let audioBlob = recording.audioBlob
          if (typeof audioBlob === 'string') {
            const response = await fetch(audioBlob)
            audioBlob = await response.blob()
          }

          // Upload to server (mock implementation)
          const formData = new FormData()
          formData.append('audio', audioBlob as Blob)
          formData.append('metadata', JSON.stringify(recording.metadata))

          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 100))
          syncedItems++
        } catch (error) {
          errors.push(`Failed to sync recording ${recording.id}`)
        }
      }

      // Sync analysis results
      for (const result of offlineData.analysisResults) {
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 50))
          syncedItems++
        } catch (error) {
          errors.push(`Failed to sync analysis ${result.id}`)
        }
      }

      // Sync queued actions
      for (const action of offlineData.queuedActions) {
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 30))
          syncedItems++
        } catch (error) {
          errors.push(`Failed to sync action ${action.id}`)
        }
      }

      // Clear synced data
      if (errors.length === 0) {
        setOfflineData({
          practiceRecordings: [],
          analysisResults: [],
          userProgress: offlineData.userProgress,
          queuedActions: []
        })

        // Clear storage
        await saveToStorage('recordings', [])
        await saveToStorage('analysis', [])
        await saveToStorage('actions', [])
      }

      const newStatus: SyncStatus = {
        isOnline: true,
        isSyncing: false,
        lastSync: Date.now(),
        pendingItems: offlineData.practiceRecordings.length + 
                      offlineData.analysisResults.length + 
                      offlineData.queuedActions.length,
        errors
      }

      setSyncStatus(newStatus)
      onSyncComplete?.(newStatus)

    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        errors: [...prev.errors, 'Sync failed: ' + (error as Error).message]
      }))
    }
  }, [isOnline, offlineData, saveToStorage, onSyncComplete])

  // =============================================================================
  // NETWORK STATUS MONITORING
  // =============================================================================

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setSyncStatus(prev => ({ ...prev, isOnline: true }))
      onOfflineModeChange?.(false)
      
      if (enableAutoSync) {
        syncOfflineData()
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus(prev => ({ ...prev, isOnline: false }))
      onOfflineModeChange?.(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [enableAutoSync, syncOfflineData, onOfflineModeChange])

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  useEffect(() => {
    const loadOfflineData = async () => {
      const recordings = await loadFromStorage('recordings') || []
      const analysis = await loadFromStorage('analysis') || []
      const actions = await loadFromStorage('actions') || []
      const progress = await loadFromStorage('progress') || { scores: [], milestones: [], lastSync: 0 }

      setOfflineData({
        practiceRecordings: recordings,
        analysisResults: analysis,
        queuedActions: actions,
        userProgress: progress
      })

      const pendingItems = recordings.length + analysis.length + actions.length
      setSyncStatus(prev => ({ ...prev, pendingItems }))

      await updateStorageUsage()
    }

    loadOfflineData()
  }, [loadFromStorage, updateStorageUsage])

  useEffect(() => {
    cleanupStorage()
  }, [cleanupStorage])

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  const offlineAPI = {
    storePracticeRecording,
    storeAnalysisResult,
    queueAction,
    syncOfflineData,
    isOnline,
    syncStatus,
    storageUsage,
    maxStorageSize,
    pendingItems: syncStatus.pendingItems
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div 
      className="offline-capability-manager"
      data-testid="offline-capability-manager"
      data-online={isOnline}
      data-pending-items={syncStatus.pendingItems}
    >
      {/* Offline Status Indicator */}
      {!isOnline && (
        <div className="offline-banner">
          <div className="offline-content">
            <span className="offline-icon">📴</span>
            <div className="offline-text">
              <strong>Working Offline</strong>
              <p>Your practice data will sync when you're back online</p>
            </div>
            <div className="pending-count">
              {syncStatus.pendingItems} pending
            </div>
          </div>
        </div>
      )}

      {/* Sync Status */}
      {isOnline && syncStatus.isSyncing && (
        <div className="sync-banner">
          <div className="sync-content">
            <span className="sync-icon">🔄</span>
            <span>Syncing offline data...</span>
          </div>
        </div>
      )}

      {/* Storage Usage Warning */}
      {storageUsage > maxStorageSize * 0.8 && (
        <div className="storage-warning">
          <span className="warning-icon">⚠️</span>
          <span>Storage almost full ({Math.round(storageUsage)}MB / {maxStorageSize}MB)</span>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <div>Online: {isOnline ? 'Yes' : 'No'}</div>
          <div>Pending: {syncStatus.pendingItems}</div>
          <div>Storage: {Math.round(storageUsage * 100) / 100}MB</div>
          {syncStatus.errors.length > 0 && (
            <div>Errors: {syncStatus.errors.length}</div>
          )}
        </div>
      )}

      <style jsx>{`
        .offline-capability-manager {
          position: relative;
        }

        .offline-banner, .sync-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0.75rem 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .offline-banner {
          background: #f59e0b;
          color: white;
        }

        .sync-banner {
          background: #3b82f6;
          color: white;
        }

        .offline-content, .sync-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .offline-icon, .sync-icon {
          font-size: 1.25rem;
        }

        .sync-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .offline-text {
          flex: 1;
        }

        .offline-text strong {
          display: block;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .offline-text p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .pending-count {
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .storage-warning {
          position: fixed;
          bottom: 100px;
          left: 1rem;
          right: 1rem;
          background: #f59e0b;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          z-index: 999;
        }

        .warning-icon {
          font-size: 1.125rem;
        }

        .debug-info {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          z-index: 999;
        }

        .debug-info div {
          margin-bottom: 0.25rem;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .offline-content, .sync-content {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .storage-warning {
            font-size: 0.75rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}