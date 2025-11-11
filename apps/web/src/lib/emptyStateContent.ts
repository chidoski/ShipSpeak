/**
 * Empty State Content Generator for ShipSpeak
 * Centralized logic for generating career-specific empty state content
 * Max 300 lines for efficiency and maintainability
 */

import { User } from '@/types/auth'
import { EmptyState } from '@/types/dashboard'

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const getTargetRole = (currentRole: string): string => {
  const roleProgression: Record<string, string> = {
    'Product Owner': 'PM',
    'PM': 'Senior PM',
    'Senior PM': 'Group PM',
    'Group PM': 'Director',
    'Director': 'VP Product'
  }
  return roleProgression[currentRole] || 'Senior PM'
}

export const getIndustryIcon = (industry: string): string => {
  const industryIcons: Record<string, string> = {
    healthcare: '🏥',
    cybersecurity: '🔐',
    fintech: '🏦',
    enterprise: '🏢',
    consumer: '📱'
  }
  return industryIcons[industry] || '🏢'
}

// =============================================================================
// CONTENT GENERATORS
// =============================================================================

export const generateNoMeetingsContent = (user: User | null) => {
  const industry = user?.industry || 'fintech'
  const currentRole = user?.role || 'PM'
  const targetRole = getTargetRole(currentRole)

  return {
    headline: 'Start Building PM Executive Presence',
    subtext: 'Master foundation skills that make every interaction more impactful',
    visual: '🎯',
    ctas: [
      {
        id: 'begin-vocabulary',
        text: `Begin Strategic Vocabulary Development (${currentRole}→${targetRole})`,
        href: '/dashboard/practice/vocabulary',
        type: 'primary' as const,
        icon: '🎯'
      },
      {
        id: 'practice-basics',
        text: 'Practice Executive Communication Basics',
        href: '/dashboard/practice/executive-basics',
        type: 'secondary' as const,
        icon: '💼'
      },
      {
        id: 'industry-templates',
        text: `Explore ${industry.charAt(0).toUpperCase() + industry.slice(1)} PM Templates`,
        href: `/dashboard/practice/industry/${industry}`,
        type: 'tertiary' as const,
        icon: getIndustryIcon(industry)
      }
    ]
  }
}

export const generateNewUserContent = (user: User | null) => {
  const industry = user?.industry || 'fintech'
  const currentRole = user?.role || 'PM'
  const targetRole = getTargetRole(currentRole)

  return {
    headline: `Your Path to ${targetRole} Communication Mastery`,
    subtext: `Based on your current ${currentRole} role in ${industry}, here's your personalized roadmap`,
    visual: '🚀',
    ctas: [
      {
        id: 'start-roadmap',
        text: 'Start Your PM Development Journey',
        href: '/dashboard/practice/roadmap',
        type: 'primary' as const,
        icon: '🚀'
      },
      {
        id: 'assessment',
        text: 'Take Communication Assessment',
        href: '/dashboard/assessment',
        type: 'secondary' as const,
        icon: '📋'
      }
    ]
  }
}

export const generatePracticeFirstContent = (user: User | null) => {
  const industry = user?.industry || 'fintech'

  return {
    headline: 'Your PM Communication Foundation',
    subtext: 'Build confidence through structured skill development before analyzing real meetings',
    visual: '📚',
    ctas: [
      {
        id: 'foundation-modules',
        text: 'Start Foundation Modules',
        href: '/dashboard/practice/foundation',
        type: 'primary' as const,
        icon: '🏗️'
      },
      {
        id: 'micro-learning',
        text: '3-Minute Daily Practice',
        href: '/dashboard/practice/daily',
        type: 'secondary' as const,
        icon: '⏱️'
      },
      {
        id: 'industry-scenarios',
        text: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Scenarios`,
        href: `/dashboard/practice/scenarios/${industry}`,
        type: 'tertiary' as const,
        icon: getIndustryIcon(industry)
      }
    ]
  }
}

export const generateMeetingAnalysisContent = (user: User | null) => {
  return {
    headline: 'Ready for Your Next Meeting',
    subtext: 'Upload a meeting recording or prepare with meeting-specific templates',
    visual: '🎙️',
    ctas: [
      {
        id: 'upload-meeting',
        text: 'Upload Meeting Recording',
        href: '/dashboard/meetings/upload',
        type: 'primary' as const,
        icon: '📁'
      },
      {
        id: 'meeting-prep',
        text: 'Meeting Preparation Templates',
        href: '/dashboard/practice/meeting-prep',
        type: 'secondary' as const,
        icon: '📋'
      },
      {
        id: 'pattern-training',
        text: 'Pattern Recognition Training',
        href: '/dashboard/practice/patterns',
        type: 'tertiary' as const,
        icon: '🔍'
      }
    ]
  }
}

// =============================================================================
// MAIN CONTENT GENERATOR
// =============================================================================

export const getEmptyStateContent = (
  type: 'no_meetings' | 'new_user' | 'practice_first' | 'meeting_analysis',
  user: User | null
) => {
  switch (type) {
    case 'no_meetings':
      return generateNoMeetingsContent(user)
    case 'new_user':
      return generateNewUserContent(user)
    case 'practice_first':
      return generatePracticeFirstContent(user)
    case 'meeting_analysis':
      return generateMeetingAnalysisContent(user)
    default:
      return generateNoMeetingsContent(user)
  }
}