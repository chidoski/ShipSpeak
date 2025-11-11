'use client'

import React from 'react'
import { UserProfile, ProgressAnalysis, PMTransitionType } from '@/types/modules'

interface UserProfileAnalyzerProps {
  userProfile: UserProfile
  onAnalysisUpdate?: (analysis: ProgressAnalysis) => void
}

export class UserProfileAnalyzer {
  static analyzeUserProgress(userProfile: UserProfile): ProgressAnalysis {
    const completedModules = userProfile.completedModules.length
    const totalAvailableModules = this.estimateTotalAvailableModules(userProfile)
    
    return {
      completedModules,
      totalAvailableModules,
      skillProgression: this.calculateSkillProgression(userProfile),
      careerReadiness: this.assessCareerReadiness(userProfile),
      recentActivity: this.generateRecentActivity(userProfile),
      learningVelocity: this.calculateLearningVelocity(userProfile),
      strongAreas: this.identifyStrongAreas(userProfile),
      improvementAreas: this.identifyImprovementAreas(userProfile)
    }
  }

  private static estimateTotalAvailableModules(userProfile: UserProfile): number {
    // Base modules available to all users
    let baseModules = 150
    
    // Industry-specific modules
    const industryModules = {
      'Healthcare & Life Sciences': 45,
      'Cybersecurity & Enterprise Security': 38,
      'Financial Services & Fintech': 52,
      'Enterprise Software & B2B': 41,
      'Consumer Technology & Apps': 49
    }
    
    baseModules += industryModules[userProfile.industry] || 35
    
    // Career transition specific modules
    const transitionModules = this.getTransitionType(userProfile.currentRole, userProfile.targetRole)
    baseModules += this.getTransitionModuleCount(transitionModules)
    
    return baseModules
  }

  private static calculateSkillProgression(userProfile: UserProfile) {
    return userProfile.skillAssessment.skills.map(assessedSkill => ({
      skill: assessedSkill.skill,
      currentLevel: assessedSkill.level,
      previousLevel: Math.max(1, assessedSkill.level - 0.5), // Simulated previous
      progression: 0.5, // Simulated progression
      trend: 'IMPROVING' as const,
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random within last week
    }))
  }

  private static assessCareerReadiness(userProfile: UserProfile) {
    const currentRoleScore = this.getRoleComplexityScore(userProfile.currentRole)
    const targetRoleScore = this.getRoleComplexityScore(userProfile.targetRole)
    const skillScore = userProfile.skillAssessment.overallScore
    const experienceBonus = this.getExperienceBonus(userProfile.experienceLevel)
    
    // Calculate readiness score (0-100)
    const progressRatio = currentRoleScore / targetRoleScore
    const adjustedSkillScore = skillScore * (1 + experienceBonus)
    const readinessScore = Math.min(100, Math.round((progressRatio * 0.4 + adjustedSkillScore * 0.6)))
    
    return {
      currentRole: userProfile.currentRole,
      targetRole: userProfile.targetRole,
      readinessScore,
      readyAreas: this.getReadyAreas(userProfile),
      developmentAreas: this.getDevelopmentAreas(userProfile),
      timeToReadiness: this.estimateTimeToReadiness(readinessScore),
      nextMilestones: this.getNextMilestones(userProfile)
    }
  }

  private static generateRecentActivity(userProfile: UserProfile) {
    const activities = []
    const now = new Date()
    
    // Simulate recent module completions
    if (userProfile.completedModules.length > 0) {
      activities.push({
        type: 'MODULE_COMPLETION' as const,
        description: 'Completed "Executive Communication: Board Presentation Mastery"',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        impact: 'Improved executive presence score by 8 points'
      })
    }
    
    // Simulate skill improvements
    activities.push({
      type: 'SKILL_IMPROVEMENT' as const,
      description: 'Strategic Thinking skill improved from Level 3.2 to Level 3.7',
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      impact: 'Moved closer to Senior PM readiness threshold'
    })
    
    // Simulate milestone achievements
    if (userProfile.completedModules.length >= 5) {
      activities.push({
        type: 'MILESTONE_ACHIEVED' as const,
        description: 'Achieved "Communication Foundation" milestone',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        impact: 'Unlocked advanced executive communication modules'
      })
    }
    
    return activities.slice(0, 5) // Return latest 5 activities
  }

  private static calculateLearningVelocity(userProfile: UserProfile): number {
    // Modules completed per week (simulated)
    const weeksActive = Math.max(1, userProfile.completedModules.length / 2)
    return Number((userProfile.completedModules.length / weeksActive).toFixed(1))
  }

  private static identifyStrongAreas(userProfile: UserProfile): string[] {
    return userProfile.skillAssessment.skills
      .filter(skill => skill.level >= 4.0)
      .map(skill => skill.skill.name)
      .slice(0, 3)
  }

  private static identifyImprovementAreas(userProfile: UserProfile): string[] {
    return userProfile.skillAssessment.skills
      .filter(skill => skill.level < 3.0)
      .map(skill => skill.skill.name)
      .slice(0, 3)
  }

  private static getTransitionType(currentRole: string, targetRole: string): PMTransitionType {
    if (currentRole === 'Product Owner' && targetRole.includes('PM')) return 'PO_TO_PM'
    if (currentRole === 'Product Manager' && targetRole === 'Senior PM') return 'PM_TO_SENIOR_PM'
    if (currentRole === 'Senior PM' && targetRole === 'Group PM') return 'SENIOR_PM_TO_GROUP_PM'
    if (currentRole === 'Group PM' && targetRole === 'Director of Product') return 'GROUP_PM_TO_DIRECTOR'
    return 'INDUSTRY_TRANSITION'
  }

  private static getTransitionModuleCount(transition: PMTransitionType): number {
    const counts = {
      'PO_TO_PM': 25,
      'PM_TO_SENIOR_PM': 30,
      'SENIOR_PM_TO_GROUP_PM': 35,
      'GROUP_PM_TO_DIRECTOR': 40,
      'DIRECTOR_TO_VP': 45,
      'INDUSTRY_TRANSITION': 20,
      'COMPANY_SIZE_TRANSITION': 15
    }
    return counts[transition] || 20
  }

  private static getRoleComplexityScore(role: string): number {
    const scores = {
      'Product Owner': 30,
      'Associate PM': 40,
      'Product Manager': 50,
      'Senior PM': 70,
      'Principal PM': 80,
      'Group PM': 85,
      'Director of Product': 90,
      'VP Product': 95,
      'CPO': 100
    }
    return scores[role] || 50
  }

  private static getExperienceBonus(level: string): number {
    const bonuses = {
      'Beginner': 0,
      'Intermediate': 0.1,
      'Advanced': 0.2,
      'Expert': 0.3
    }
    return bonuses[level] || 0
  }

  private static getReadyAreas(userProfile: UserProfile): string[] {
    return userProfile.skillAssessment.skills
      .filter(skill => skill.level >= 3.5)
      .map(skill => skill.skill.name)
      .slice(0, 4)
  }

  private static getDevelopmentAreas(userProfile: UserProfile): string[] {
    return userProfile.skillAssessment.skills
      .filter(skill => skill.level < 3.0)
      .map(skill => skill.skill.name)
      .slice(0, 4)
  }

  private static estimateTimeToReadiness(readinessScore: number): string {
    if (readinessScore >= 85) return '1-2 months'
    if (readinessScore >= 70) return '3-4 months'
    if (readinessScore >= 50) return '6-8 months'
    return '9-12 months'
  }

  private static getNextMilestones(userProfile: UserProfile): string[] {
    const transition = this.getTransitionType(userProfile.currentRole, userProfile.targetRole)
    
    const milestones = {
      'PO_TO_PM': [
        'Master strategic thinking frameworks',
        'Develop stakeholder communication',
        'Build business vocabulary',
        'Practice decision articulation'
      ],
      'PM_TO_SENIOR_PM': [
        'Perfect answer-first communication',
        'Master trade-off articulation',
        'Build executive presence',
        'Develop influence skills'
      ],
      'SENIOR_PM_TO_GROUP_PM': [
        'Lead portfolio strategy',
        'Mentor team members',
        'Drive organizational impact',
        'Master cross-team coordination'
      ],
      'GROUP_PM_TO_DIRECTOR': [
        'Excel at board presentations',
        'Fluency in business models',
        'Strategic market positioning',
        'Organizational leadership'
      ]
    }
    
    return milestones[transition] || [
      'Complete skill assessment',
      'Identify development priorities',
      'Practice core competencies',
      'Build industry expertise'
    ]
  }
}

const UserProfileAnalyzer: React.FC<UserProfileAnalyzerProps> = ({
  userProfile,
  onAnalysisUpdate
}) => {
  React.useEffect(() => {
    const analysis = UserProfileAnalyzer.analyzeUserProgress(userProfile)
    onAnalysisUpdate?.(analysis)
  }, [userProfile, onAnalysisUpdate])

  return null // This is a utility component that doesn't render anything
}

export default UserProfileAnalyzer