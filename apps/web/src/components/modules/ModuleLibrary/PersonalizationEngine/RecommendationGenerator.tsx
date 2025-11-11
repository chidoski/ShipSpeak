'use client'

import React from 'react'
import { 
  UserProfile, 
  PracticeModule, 
  ModuleRecommendation, 
  SkillGap, 
  CareerGoalAlignment,
  UrgencyLevel,
  PMTransitionType 
} from '@/types/modules'

interface RecommendationGeneratorProps {
  userProfile: UserProfile
  modules: PracticeModule[]
  onRecommendationsGenerated?: (recommendations: ModuleRecommendation[]) => void
}

export class RecommendationEngine {
  static generatePersonalizedRecommendations(
    userProfile: UserProfile,
    modules: PracticeModule[],
    maxRecommendations: number = 10
  ): ModuleRecommendation[] {
    const skillGaps = this.identifySkillGaps(userProfile)
    const careerAlignment = this.analyzeCareerGoals(userProfile)
    const moduleScores = this.scoreModulesForUser(modules, userProfile, skillGaps, careerAlignment)
    
    // Sort by relevance and take top recommendations
    const recommendations = moduleScores
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxRecommendations)
      .map(scored => this.createRecommendation(scored.module, scored.relevanceScore, userProfile, skillGaps))
    
    return recommendations
  }

  private static identifySkillGaps(userProfile: UserProfile): SkillGap[] {
    return userProfile.skillAssessment.skills.map(assessedSkill => {
      const targetLevel = this.getTargetLevelForRole(assessedSkill.skill.name, userProfile.targetRole)
      const gapSize = Math.max(0, targetLevel - assessedSkill.level)
      
      return {
        skill: assessedSkill.skill,
        currentLevel: assessedSkill.level,
        targetLevel,
        gapSize,
        priority: this.determineGapPriority(gapSize, assessedSkill.skill.name, userProfile),
        recommendedModules: this.findModulesForSkill(assessedSkill.skill.name, userProfile),
        timeToClose: this.estimateTimeToCloseGap(gapSize),
        impactOnCareer: this.assessCareerImpact(assessedSkill.skill.name, userProfile)
      }
    }).filter(gap => gap.gapSize > 0)
  }

  private static analyzeCareerGoals(userProfile: UserProfile): CareerGoalAlignment {
    const transitionType = this.getTransitionType(userProfile.currentRole, userProfile.targetRole)
    const alignmentScore = this.calculateAlignmentScore(userProfile)
    
    return {
      targetRole: userProfile.targetRole,
      targetIndustry: userProfile.industry,
      timeframe: this.estimateTransitionTimeframe(transitionType, alignmentScore),
      alignmentScore,
      keyFocusAreas: this.getKeyFocusAreasForTransition(transitionType),
      missingSkills: this.identifyMissingSkills(userProfile),
      strengthAreas: this.identifyStrengthAreas(userProfile)
    }
  }

  private static scoreModulesForUser(
    modules: PracticeModule[],
    userProfile: UserProfile,
    skillGaps: SkillGap[],
    careerAlignment: CareerGoalAlignment
  ) {
    return modules.map(module => ({
      module,
      relevanceScore: this.calculateRelevanceScore(module, userProfile, skillGaps, careerAlignment)
    }))
  }

  private static calculateRelevanceScore(
    module: PracticeModule,
    userProfile: UserProfile,
    skillGaps: SkillGap[],
    careerAlignment: CareerGoalAlignment
  ): number {
    let score = 0

    // Skill gap alignment (40% of score)
    const skillRelevance = this.calculateSkillRelevance(module, skillGaps)
    score += skillRelevance * 0.4

    // Career transition relevance (30% of score)
    const careerRelevance = this.calculateCareerRelevance(module, userProfile, careerAlignment)
    score += careerRelevance * 0.3

    // Industry relevance (20% of score)
    const industryRelevance = this.calculateIndustryRelevance(module, userProfile.industry)
    score += industryRelevance * 0.2

    // User preferences (10% of score)
    const preferenceRelevance = this.calculatePreferenceRelevance(module, userProfile)
    score += preferenceRelevance * 0.1

    // Bonus for high-quality modules
    if (module.ratings.averageRating >= 4.5) score += 5
    if (module.ratings.effectiveness >= 0.85) score += 3

    // Penalty for already completed modules
    if (userProfile.completedModules.includes(module.id)) score -= 50

    // Difficulty alignment bonus
    const difficultyBonus = this.calculateDifficultyAlignment(module, userProfile)
    score += difficultyBonus

    return Math.min(100, Math.max(0, score))
  }

  private static calculateSkillRelevance(module: PracticeModule, skillGaps: SkillGap[]): number {
    let relevance = 0
    const moduleSkills = module.skills

    for (const skill of moduleSkills) {
      const gap = skillGaps.find(g => g.skill.id === skill.id)
      if (gap) {
        // Higher relevance for larger gaps and higher priority skills
        const gapWeight = gap.gapSize * 20
        const priorityWeight = gap.priority === 'HIGH' ? 30 : gap.priority === 'MEDIUM' ? 20 : 10
        relevance += gapWeight + priorityWeight
      }
    }

    return Math.min(100, relevance)
  }

  private static calculateCareerRelevance(
    module: PracticeModule,
    userProfile: UserProfile,
    careerAlignment: CareerGoalAlignment
  ): number {
    const transitionType = this.getTransitionType(userProfile.currentRole, userProfile.targetRole)
    
    // Check if module specifically targets this transition
    const targetedTransition = module.careerImpact.find(impact => 
      impact.transitionType === transitionType && impact.impactLevel === 'HIGH'
    )
    
    if (targetedTransition) return 90

    // Check for related transitions
    const relatedTransition = module.careerImpact.find(impact => 
      this.isRelatedTransition(impact.transitionType, transitionType)
    )
    
    if (relatedTransition) {
      return relatedTransition.impactLevel === 'HIGH' ? 70 : 
             relatedTransition.impactLevel === 'MEDIUM' ? 50 : 30
    }

    // General career advancement relevance
    return this.getGeneralCareerRelevance(module, userProfile.targetRole)
  }

  private static calculateIndustryRelevance(module: PracticeModule, industry: string): number {
    const industryRelevance = module.industryRelevance.find(ir => ir.industry === industry)
    
    if (!industryRelevance) return 0
    
    return industryRelevance.relevanceScore
  }

  private static calculatePreferenceRelevance(module: PracticeModule, userProfile: UserProfile): number {
    let relevance = 50 // Base score

    // Duration preference
    const preferredDuration = userProfile.preferences.sessionDuration
    if (preferredDuration === 'SHORT' && module.estimatedDuration <= 15) relevance += 20
    if (preferredDuration === 'MEDIUM' && module.estimatedDuration <= 30) relevance += 15
    if (preferredDuration === 'LONG' && module.estimatedDuration > 30) relevance += 10

    // Learning style alignment (simplified)
    if (userProfile.preferences.learningStyle === 'VISUAL' && module.moduleType === 'SCENARIO_SIMULATION') {
      relevance += 10
    }

    // Focus area alignment
    const focusAreaMatch = userProfile.preferences.focusAreas.some(area =>
      module.skills.some(skill => skill.name.toLowerCase().includes(area.toLowerCase()))
    )
    if (focusAreaMatch) relevance += 15

    return Math.min(100, relevance)
  }

  private static calculateDifficultyAlignment(module: PracticeModule, userProfile: UserProfile): number {
    const userLevel = userProfile.experienceLevel
    const moduleLevel = module.difficulty

    // Perfect match bonus
    if ((userLevel === 'Beginner' && moduleLevel === 'Foundation') ||
        (userLevel === 'Intermediate' && moduleLevel === 'Practice') ||
        (userLevel === 'Advanced' && moduleLevel === 'Mastery') ||
        (userLevel === 'Expert' && moduleLevel === 'Expert')) {
      return 10
    }

    // Slight stretch bonus
    if ((userLevel === 'Beginner' && moduleLevel === 'Practice') ||
        (userLevel === 'Intermediate' && moduleLevel === 'Mastery')) {
      return 5
    }

    // Too easy penalty
    if ((userLevel === 'Advanced' && moduleLevel === 'Foundation') ||
        (userLevel === 'Expert' && (moduleLevel === 'Foundation' || moduleLevel === 'Practice'))) {
      return -5
    }

    return 0
  }

  private static createRecommendation(
    module: PracticeModule,
    relevanceScore: number,
    userProfile: UserProfile,
    skillGaps: SkillGap[]
  ): ModuleRecommendation {
    const urgency = this.determineUrgency(module, userProfile, skillGaps)
    const reasoning = this.generateReasoning(module, userProfile, skillGaps, relevanceScore)
    const careerImpact = this.generateCareerImpact(module, userProfile)
    const timeToCompletion = this.estimateCompletionTime(module, urgency)
    const affectedSkillGaps = skillGaps.filter(gap => 
      module.skills.some(skill => skill.id === gap.skill.id)
    ).map(gap => gap.skill.name)

    return {
      module,
      relevanceScore: Math.round(relevanceScore),
      reasoning,
      urgencyLevel: urgency,
      careerImpact,
      timeToCompletion,
      skillGaps: affectedSkillGaps,
      prerequisites: this.checkPrerequisites(module, userProfile),
      expectedOutcome: this.generateExpectedOutcome(module, userProfile)
    }
  }

  private static determineUrgency(
    module: PracticeModule,
    userProfile: UserProfile,
    skillGaps: SkillGap[]
  ): UrgencyLevel {
    // High urgency if addresses high-priority skill gaps
    const addressesHighPriorityGap = skillGaps.some(gap => 
      gap.priority === 'HIGH' && 
      module.skills.some(skill => skill.id === gap.skill.id)
    )
    
    if (addressesHighPriorityGap) return 'HIGH'

    // High urgency for career-critical modules
    const isCareerCritical = module.careerImpact.some(impact => 
      impact.impactLevel === 'HIGH' && 
      impact.transitionType === this.getTransitionType(userProfile.currentRole, userProfile.targetRole)
    )
    
    if (isCareerCritical) return 'HIGH'

    // Medium urgency for solid career advancement
    const hasCareerImpact = module.careerImpact.length > 0
    if (hasCareerImpact) return 'MEDIUM'

    return 'LOW'
  }

  private static generateReasoning(
    module: PracticeModule,
    userProfile: UserProfile,
    skillGaps: SkillGap[],
    relevanceScore: number
  ): string {
    const reasons = []

    // Skill gap reasoning
    const addressedGaps = skillGaps.filter(gap => 
      module.skills.some(skill => skill.id === gap.skill.id)
    )
    
    if (addressedGaps.length > 0) {
      const gapNames = addressedGaps.map(gap => gap.skill.name).slice(0, 2).join(' and ')
      reasons.push(`Addresses skill gaps in ${gapNames}`)
    }

    // Career transition reasoning
    const transitionType = this.getTransitionType(userProfile.currentRole, userProfile.targetRole)
    const careerRelevant = module.careerImpact.find(impact => impact.transitionType === transitionType)
    
    if (careerRelevant) {
      reasons.push(`Essential for ${userProfile.targetRole} transition`)
    }

    // Industry reasoning
    const industryMatch = module.industryRelevance.find(ir => ir.industry === userProfile.industry)
    if (industryMatch && industryMatch.relevanceScore > 70) {
      reasons.push(`Highly relevant for ${userProfile.industry} context`)
    }

    // Quality reasoning
    if (module.ratings.averageRating >= 4.5) {
      reasons.push('Highly rated by peers in similar roles')
    }

    return reasons.slice(0, 2).join('. ') + '.'
  }

  private static generateCareerImpact(module: PracticeModule, userProfile: UserProfile): string {
    const transitionType = this.getTransitionType(userProfile.currentRole, userProfile.targetRole)
    const relevantImpact = module.careerImpact.find(impact => impact.transitionType === transitionType)
    
    if (relevantImpact) {
      return relevantImpact.specificBenefits[0] || `Accelerates ${userProfile.targetRole} readiness`
    }

    return `Builds core competencies for ${userProfile.targetRole} role`
  }

  private static estimateCompletionTime(module: PracticeModule, urgency: UrgencyLevel): string {
    const baseDuration = module.estimatedDuration

    if (urgency === 'HIGH') {
      return baseDuration <= 20 ? 'Complete today' : 'Complete by end of week'
    }

    if (urgency === 'MEDIUM') {
      return baseDuration <= 30 ? 'Complete within 3 days' : 'Complete within 1 week'
    }

    return 'Complete when convenient'
  }

  // Utility methods for career transition and skill management
  private static getTransitionType(currentRole: string, targetRole: string): PMTransitionType {
    if (currentRole === 'Product Owner' && targetRole.includes('Manager')) return 'PO_TO_PM'
    if (currentRole === 'Product Manager' && targetRole === 'Senior PM') return 'PM_TO_SENIOR_PM'
    if (currentRole === 'Senior PM' && targetRole === 'Group PM') return 'SENIOR_PM_TO_GROUP_PM'
    if (currentRole === 'Group PM' && targetRole.includes('Director')) return 'GROUP_PM_TO_DIRECTOR'
    return 'INDUSTRY_TRANSITION'
  }

  private static getTargetLevelForRole(skillName: string, targetRole: string): number {
    const roleLevels = {
      'Product Owner': 3.0,
      'Product Manager': 3.5,
      'Senior PM': 4.0,
      'Group PM': 4.5,
      'Director of Product': 5.0
    }
    return roleLevels[targetRole] || 3.5
  }

  private static determineGapPriority(gapSize: number, skillName: string, userProfile: UserProfile): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (gapSize >= 1.5) return 'HIGH'
    if (gapSize >= 1.0) return 'MEDIUM'
    return 'LOW'
  }

  private static findModulesForSkill(skillName: string, userProfile: UserProfile): string[] {
    // Simplified - would typically search actual module database
    return [`module-${skillName.toLowerCase().replace(/\s+/g, '-')}-foundation`]
  }

  private static estimateTimeToCloseGap(gapSize: number): string {
    if (gapSize <= 0.5) return '2-3 weeks'
    if (gapSize <= 1.0) return '1-2 months'
    if (gapSize <= 1.5) return '2-3 months'
    return '3-6 months'
  }

  private static assessCareerImpact(skillName: string, userProfile: UserProfile): string {
    const criticalSkills = ['Executive Communication', 'Strategic Thinking', 'Stakeholder Management']
    return criticalSkills.includes(skillName) ? 
      'Critical for career advancement' : 
      'Important for role effectiveness'
  }

  private static calculateAlignmentScore(userProfile: UserProfile): number {
    return Math.round(userProfile.skillAssessment.overallScore * 0.8 + 
                     userProfile.completedModules.length * 2)
  }

  private static estimateTransitionTimeframe(transition: PMTransitionType, alignmentScore: number): string {
    const baseTimeframes = {
      'PO_TO_PM': 6,
      'PM_TO_SENIOR_PM': 12,
      'SENIOR_PM_TO_GROUP_PM': 18,
      'GROUP_PM_TO_DIRECTOR': 24,
      'INDUSTRY_TRANSITION': 9
    }
    
    const baseMonths = baseTimeframes[transition] || 12
    const adjustedMonths = Math.round(baseMonths * (100 - alignmentScore) / 100)
    
    return `${adjustedMonths}-${adjustedMonths + 6} months`
  }

  private static getKeyFocusAreasForTransition(transition: PMTransitionType): string[] {
    const focusAreas = {
      'PO_TO_PM': ['Strategic Thinking', 'Business Communication', 'Stakeholder Management'],
      'PM_TO_SENIOR_PM': ['Executive Communication', 'Trade-off Articulation', 'Influence Skills'],
      'SENIOR_PM_TO_GROUP_PM': ['Portfolio Strategy', 'Team Development', 'Organizational Impact'],
      'GROUP_PM_TO_DIRECTOR': ['Business Model Fluency', 'Board Communication', 'Strategic Leadership']
    }
    
    return focusAreas[transition] || ['Core PM Skills', 'Communication', 'Strategic Thinking']
  }

  private static identifyMissingSkills(userProfile: UserProfile): string[] {
    return userProfile.skillAssessment.skills
      .filter(skill => skill.level < 3.0)
      .map(skill => skill.skill.name)
      .slice(0, 3)
  }

  private static identifyStrengthAreas(userProfile: UserProfile): string[] {
    return userProfile.skillAssessment.skills
      .filter(skill => skill.level >= 4.0)
      .map(skill => skill.skill.name)
      .slice(0, 3)
  }

  private static isRelatedTransition(moduleTransition: PMTransitionType, userTransition: PMTransitionType): boolean {
    const transitionGroups = [
      ['PO_TO_PM', 'PM_TO_SENIOR_PM'],
      ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
      ['SENIOR_PM_TO_GROUP_PM', 'GROUP_PM_TO_DIRECTOR']
    ]
    
    return transitionGroups.some(group => 
      group.includes(moduleTransition) && group.includes(userTransition)
    )
  }

  private static getGeneralCareerRelevance(module: PracticeModule, targetRole: string): number {
    // Simplified general relevance scoring
    const roleRelevance = {
      'Senior PM': ['Executive Communication', 'Strategic Thinking'],
      'Group PM': ['Portfolio Strategy', 'Team Development'],
      'Director of Product': ['Business Model', 'Board Communication']
    }
    
    const relevantSkills = roleRelevance[targetRole] || []
    const hasRelevantSkill = module.skills.some(skill => 
      relevantSkills.some(relevant => skill.name.includes(relevant))
    )
    
    return hasRelevantSkill ? 60 : 30
  }

  private static checkPrerequisites(module: PracticeModule, userProfile: UserProfile) {
    return module.prerequisites.map(prereq => ({
      type: 'MODULE' as const,
      requirement: prereq,
      met: userProfile.completedModules.includes(prereq),
      suggestion: !userProfile.completedModules.includes(prereq) ? 
        `Complete "${prereq}" module first` : undefined
    }))
  }

  private static generateExpectedOutcome(module: PracticeModule, userProfile: UserProfile): string {
    const primarySkill = module.skills[0]?.name || 'communication skills'
    return `Improve ${primarySkill.toLowerCase()} by 0.3-0.5 points and increase readiness for ${userProfile.targetRole} role`
  }
}

const RecommendationGenerator: React.FC<RecommendationGeneratorProps> = ({
  userProfile,
  modules,
  onRecommendationsGenerated
}) => {
  React.useEffect(() => {
    const recommendations = RecommendationEngine.generatePersonalizedRecommendations(
      userProfile, 
      modules,
      10
    )
    onRecommendationsGenerated?.(recommendations)
  }, [userProfile, modules, onRecommendationsGenerated])

  return null // Utility component
}

export default RecommendationGenerator