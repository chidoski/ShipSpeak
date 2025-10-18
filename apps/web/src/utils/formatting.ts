/**
 * Formatting Utilities for ShipSpeak
 * Reusable formatting functions to reduce duplication
 */

/**
 * Format duration in seconds to human readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} min`
}

/**
 * Format timestamp to relative time
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}

/**
 * Format speaking pace to descriptive text
 */
export const formatSpeakingPace = (wpm: number): string => {
  if (wpm < 120) return `${wpm} WPM (Slow)`
  if (wpm < 160) return `${wpm} WPM (Normal)`
  if (wpm < 200) return `${wpm} WPM (Fast)`
  return `${wpm} WPM (Very Fast)`
}

/**
 * Format score with color coding description
 */
export const formatScoreDescription = (score: number): string => {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Average'
  if (score >= 60) return 'Needs Improvement'
  return 'Requires Focus'
}

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Format progress percentage with stage description
 */
export const formatProgress = (progress: number, stage: string): string => {
  const stageMap: Record<string, string> = {
    'upload': 'Uploading audio file',
    'transcription': 'Converting speech to text',
    'analysis': 'Analyzing communication patterns',
    'insights': 'Generating insights',
    'completion': 'Finalizing results'
  }
  
  const stageDescription = stageMap[stage] || stage
  return `${progress}% - ${stageDescription}`
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Format meeting platform name
 */
export const formatPlatform = (platform: string): string => {
  const platformMap: Record<string, string> = {
    'google_meet': 'Google Meet',
    'zoom': 'Zoom',
    'teams': 'Microsoft Teams',
    'manual_upload': 'Manual Upload'
  }
  
  return platformMap[platform] || platform
}

/**
 * Generate avatar initials from name
 */
export const getAvatarInitials = (name?: string): string => {
  if (!name) return 'U'
  
  const words = name.trim().split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate unique ID for components
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}