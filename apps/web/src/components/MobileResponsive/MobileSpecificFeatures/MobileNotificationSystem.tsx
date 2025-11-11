/**
 * Mobile Notification System for ShipSpeak
 * Native mobile notification integration for progress updates and coaching reminders
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

interface MobileNotification {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  actions?: NotificationAction[]
  data?: any
  timestamp: number
}

interface NotificationAction {
  action: string
  title: string
  icon?: string
}

interface MobileNotificationSystemProps {
  onNotificationClick?: (notification: MobileNotification) => void
  onPermissionChange?: (permission: NotificationPermission) => void
  enableProgressUpdates?: boolean
  enableCoachingReminders?: boolean
  enableBadgeUpdates?: boolean
}

// =============================================================================
// NOTIFICATION UTILITIES
// =============================================================================

const checkNotificationSupport = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
}

const getNotificationPermission = (): NotificationPermission => {
  if (!checkNotificationSupport()) {
    return { granted: false, denied: true, default: false }
  }

  const permission = Notification.permission
  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default'
  }
}

const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!checkNotificationSupport()) {
    return { granted: false, denied: true, default: false }
  }

  try {
    const permission = await Notification.requestPermission()
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return { granted: false, denied: true, default: false }
  }
}

// =============================================================================
// MOBILE NOTIFICATION SYSTEM COMPONENT
// =============================================================================

export const MobileNotificationSystem: React.FC<MobileNotificationSystemProps> = ({
  onNotificationClick,
  onPermissionChange,
  enableProgressUpdates = true,
  enableCoachingReminders = true,
  enableBadgeUpdates = true
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission())
  const [notificationQueue, setNotificationQueue] = useState<MobileNotification[]>([])
  const [badgeCount, setBadgeCount] = useState(0)
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false)

  // =============================================================================
  // SERVICE WORKER REGISTRATION
  // =============================================================================

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          setIsServiceWorkerRegistered(true)
          console.log('Service Worker registered:', registration)
        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }
    }

    registerServiceWorker()
  }, [])

  // =============================================================================
  // PERMISSION MANAGEMENT
  // =============================================================================

  const requestPermission = useCallback(async () => {
    const newPermission = await requestNotificationPermission()
    setPermission(newPermission)
    onPermissionChange?.(newPermission)
  }, [onPermissionChange])

  useEffect(() => {
    if (permission.default) {
      requestPermission()
    }
  }, [permission.default, requestPermission])

  // =============================================================================
  // NOTIFICATION METHODS
  // =============================================================================

  const showNotification = useCallback(async (notification: MobileNotification) => {
    if (!permission.granted) {
      console.warn('Notification permission not granted')
      return false
    }

    try {
      if (isServiceWorkerRegistered && 'serviceWorker' in navigator) {
        // Use service worker for better mobile experience
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icons/icon-192.png',
          badge: notification.badge || '/icons/badge-72.png',
          tag: notification.tag,
          requireInteraction: notification.requireInteraction || false,
          actions: notification.actions || [],
          data: { ...notification.data, id: notification.id },
          vibrate: [200, 100, 200], // Mobile vibration pattern
          timestamp: notification.timestamp
        })
      } else {
        // Fallback to regular notification
        const notif = new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icons/icon-192.png',
          tag: notification.tag,
          requireInteraction: notification.requireInteraction || false,
          data: { ...notification.data, id: notification.id }
        })

        notif.onclick = () => {
          onNotificationClick?.(notification)
          notif.close()
        }
      }

      return true
    } catch (error) {
      console.error('Error showing notification:', error)
      return false
    }
  }, [permission.granted, isServiceWorkerRegistered, onNotificationClick])

  const queueNotification = useCallback((notification: MobileNotification) => {
    setNotificationQueue(prev => [...prev, notification])
  }, [])

  const clearNotificationQueue = useCallback(() => {
    setNotificationQueue([])
  }, [])

  // =============================================================================
  // BADGE MANAGEMENT
  // =============================================================================

  const updateBadge = useCallback(async (count: number) => {
    if (!enableBadgeUpdates) return

    setBadgeCount(count)

    if ('setAppBadge' in navigator) {
      try {
        if (count > 0) {
          await (navigator as any).setAppBadge(count)
        } else {
          await (navigator as any).clearAppBadge()
        }
      } catch (error) {
        console.error('Error updating app badge:', error)
      }
    }
  }, [enableBadgeUpdates])

  const clearBadge = useCallback(async () => {
    await updateBadge(0)
  }, [updateBadge])

  // =============================================================================
  // PM-SPECIFIC NOTIFICATIONS
  // =============================================================================

  const showProgressNotification = useCallback((data: {
    type: 'MEETING_ANALYSIS_COMPLETE' | 'PRACTICE_SESSION_COMPLETE' | 'SKILL_MILESTONE'
    title: string
    message: string
    actionData?: any
  }) => {
    if (!enableProgressUpdates) return

    const notification: MobileNotification = {
      id: `progress-${Date.now()}`,
      title: data.title,
      body: data.message,
      icon: '/icons/progress-icon.png',
      tag: `progress-${data.type}`,
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: '/icons/view-icon.png'
        },
        {
          action: 'practice',
          title: 'Start Practice',
          icon: '/icons/practice-icon.png'
        }
      ],
      data: { type: 'PROGRESS_UPDATE', ...data.actionData },
      timestamp: Date.now()
    }

    showNotification(notification)
  }, [enableProgressUpdates, showNotification])

  const showCoachingReminder = useCallback((data: {
    type: 'DAILY_PRACTICE' | 'SKILL_FOCUS' | 'CAREER_MILESTONE'
    message: string
    actionData?: any
  }) => {
    if (!enableCoachingReminders) return

    const notification: MobileNotification = {
      id: `coaching-${Date.now()}`,
      title: 'ShipSpeak Coaching Reminder',
      body: data.message,
      icon: '/icons/coaching-icon.png',
      tag: `coaching-${data.type}`,
      requireInteraction: true,
      actions: [
        {
          action: 'practice_now',
          title: 'Practice Now',
          icon: '/icons/practice-icon.png'
        },
        {
          action: 'remind_later',
          title: 'Remind Later',
          icon: '/icons/clock-icon.png'
        }
      ],
      data: { type: 'COACHING_REMINDER', ...data.actionData },
      timestamp: Date.now()
    }

    showNotification(notification)
  }, [enableCoachingReminders, showNotification])

  // =============================================================================
  // NOTIFICATION SCHEDULING
  // =============================================================================

  const scheduleNotification = useCallback((notification: MobileNotification, delay: number) => {
    setTimeout(() => {
      showNotification(notification)
    }, delay)
  }, [showNotification])

  const scheduleCoachingReminders = useCallback(() => {
    if (!enableCoachingReminders) return

    // Schedule daily practice reminder
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0) // 9 AM next day

    const timeUntilReminder = tomorrow.getTime() - now.getTime()

    scheduleNotification({
      id: `daily-reminder-${Date.now()}`,
      title: 'Daily PM Practice',
      body: 'Ready to boost your executive presence? Practice for 5 minutes today.',
      tag: 'daily-practice',
      requireInteraction: false,
      actions: [
        { action: 'practice_now', title: 'Practice Now' },
        { action: 'skip_today', title: 'Skip Today' }
      ],
      data: { type: 'DAILY_PRACTICE' },
      timestamp: Date.now()
    }, timeUntilReminder)
  }, [enableCoachingReminders, scheduleNotification])

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    scheduleCoachingReminders()
  }, [scheduleCoachingReminders])

  // Service worker message handling
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICK') {
        const notification = event.data.notification
        onNotificationClick?.(notification)
      }
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [onNotificationClick])

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  const notificationAPI = {
    showNotification,
    queueNotification,
    clearNotificationQueue,
    updateBadge,
    clearBadge,
    showProgressNotification,
    showCoachingReminder,
    scheduleNotification,
    requestPermission,
    permission,
    isSupported: checkNotificationSupport(),
    badgeCount
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div 
      className="mobile-notification-system"
      data-testid="mobile-notification-system"
      data-permission={permission.granted ? 'granted' : permission.denied ? 'denied' : 'default'}
      data-badge-count={badgeCount}
    >
      {/* Permission Request UI */}
      {permission.default && (
        <div className="permission-banner">
          <div className="banner-content">
            <span className="banner-icon">🔔</span>
            <div className="banner-text">
              <strong>Enable notifications</strong>
              <p>Get updates on your PM skill progress and practice reminders</p>
            </div>
            <button
              className="enable-button"
              onClick={requestPermission}
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* Notification Queue Status (Debug) */}
      {process.env.NODE_ENV === 'development' && notificationQueue.length > 0 && (
        <div className="debug-queue">
          <span>Queued notifications: {notificationQueue.length}</span>
          <button onClick={clearNotificationQueue}>Clear Queue</button>
        </div>
      )}

      <style jsx>{`
        .mobile-notification-system {
          position: relative;
        }

        .permission-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #3b82f6;
          color: white;
          z-index: 1000;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .banner-icon {
          font-size: 1.5rem;
        }

        .banner-text {
          flex: 1;
        }

        .banner-text strong {
          display: block;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .banner-text p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .enable-button {
          background: white;
          color: #3b82f6;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .enable-button:hover {
          background: #f1f5f9;
        }

        .debug-queue {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 999;
        }

        .debug-queue button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
          .banner-content {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }
          
          .banner-text {
            order: 1;
          }
          
          .enable-button {
            order: 2;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// HOOK FOR USING NOTIFICATION SYSTEM
// =============================================================================

export const useMobileNotifications = () => {
  const [notificationSystem, setNotificationSystem] = useState<any>(null)

  const initializeNotifications = useCallback((config: Partial<MobileNotificationSystemProps> = {}) => {
    // This would return the notification API
    return {
      showProgress: (data: any) => console.log('Progress notification:', data),
      showCoaching: (data: any) => console.log('Coaching notification:', data),
      updateBadge: (count: number) => console.log('Badge update:', count),
      requestPermission: () => requestNotificationPermission()
    }
  }, [])

  return { initializeNotifications }
}