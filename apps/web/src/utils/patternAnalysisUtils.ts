/**
 * Pattern Analysis Utilities - Shared functions for pattern detection and analysis
 * ShipSpeak Slice 5 Refactoring
 */

import { PMCareerLevel } from '../types/competency'

export const getSignificanceWeight = (significance: string): number => {
  return { HIGH: 3, MEDIUM: 2, LOW: 1 }[significance] || 1
}

export const getPriorityScore = (priority: string): number => {
  return { HIGH: 3, MEDIUM: 2, LOW: 1 }[priority] || 1
}

export const getPriorityNumber = (priority: string): number => {
  return { HIGH: 1, MEDIUM: 2, LOW: 3 }[priority] || 2
}

export const getIndustryLabel = (industry: string): string => {
  const labels: { [key: string]: string } = {
    HEALTHCARE: 'Healthcare',
    CYBERSECURITY: 'Cybersecurity',
    FINTECH: 'Fintech',
    ENTERPRISE: 'Enterprise',
    CONSUMER: 'Consumer Technology'
  }
  return labels[industry] || industry
}

export const calculateTimeToTarget = (readinessScore: number, current: PMCareerLevel, target: PMCareerLevel): number => {
  const baseTime = { IC: 6, SENIOR: 12, STAFF: 18, PRINCIPAL: 24 }[target] || 12
  const readinessMultiplier = Math.max(0.5, (100 - readinessScore) / 100)
  return Math.round(baseTime * readinessMultiplier)
}

export const generateKeyMilestones = (current: PMCareerLevel, target: PMCareerLevel, readiness: number): string[] => {
  const baseMilestones = [
    'Demonstrate consistent framework application',
    'Build cross-functional influence',
    'Lead strategic initiatives',
    'Achieve stakeholder recognition'
  ]
  return baseMilestones.slice(0, readiness > 70 ? 3 : 4)
}

export const getDifficultyForLevel = (level: PMCareerLevel): 'FOUNDATION' | 'PRACTICE' | 'MASTERY' => {
  const difficultyMap = {
    IC: 'FOUNDATION',
    SENIOR: 'PRACTICE', 
    STAFF: 'PRACTICE',
    PRINCIPAL: 'MASTERY',
    DIRECTOR: 'MASTERY',
    VP: 'MASTERY'
  }
  return difficultyMap[level] || 'PRACTICE'
}

export const getStageDescription = (stage: string): string => {
  const descriptions = {
    'INITIALIZING': 'Initializing insight generation...',
    'PATTERN_HIGHLIGHTS': 'Identifying key communication strengths',
    'IMPROVEMENT_AREAS': 'Analyzing development opportunities',
    'STRENGTH_AREAS': 'Identifying leverage opportunities',
    'PROGRESSION_INSIGHTS': 'Generating career progression insights',
    'IMMEDIATE_ACTIONS': 'Creating immediate action recommendations',
    'PRACTICE_MODULES': 'Recommending practice modules',
    'COMPLETED': 'Insight generation complete',
    'ERROR': 'Generation failed'
  }
  return descriptions[stage] || stage
}