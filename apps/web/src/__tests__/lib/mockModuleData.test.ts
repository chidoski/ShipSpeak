/**
 * Mock Module Data Test Suite
 * Tests the comprehensive module library mock data structure and integrity
 */

import { 
  mockUserProfile, 
  mockModuleCollections, 
  mockRecommendationEngine,
  mockLearningPaths,
  mockSkills
} from '@/lib/mockModuleData'

describe('Mock Module Data Integrity', () => {
  describe('mockUserProfile', () => {
    it('has valid structure and required fields', () => {
      expect(mockUserProfile).toBeDefined()
      expect(mockUserProfile.id).toBeDefined()
      expect(mockUserProfile.name).toBeDefined()
      expect(mockUserProfile.currentRole).toBeDefined()
      expect(mockUserProfile.targetRole).toBeDefined()
      expect(mockUserProfile.industry).toBeDefined()
      expect(mockUserProfile.experienceLevel).toBeDefined()
    })

    it('has valid skill assessment', () => {
      expect(mockUserProfile.skillAssessment).toBeDefined()
      expect(Array.isArray(mockUserProfile.skillAssessment.skills)).toBe(true)
      expect(mockUserProfile.skillAssessment.overallScore).toBeGreaterThan(0)
      expect(mockUserProfile.skillAssessment.overallScore).toBeLessThanOrEqual(100)
      
      // Each skill should have valid structure
      mockUserProfile.skillAssessment.skills.forEach(skill => {
        expect(skill.skill).toBeDefined()
        expect(skill.level).toBeGreaterThan(0)
        expect(skill.level).toBeLessThanOrEqual(5)
        expect(skill.confidence).toBeGreaterThan(0)
        expect(skill.confidence).toBeLessThanOrEqual(1)
      })
    })

    it('has valid completed modules array', () => {
      expect(Array.isArray(mockUserProfile.completedModules)).toBe(true)
      expect(mockUserProfile.completedModules.length).toBeGreaterThan(0)
      
      mockUserProfile.completedModules.forEach(moduleId => {
        expect(typeof moduleId).toBe('string')
        expect(moduleId.length).toBeGreaterThan(0)
      })
    })

    it('has valid learning goals', () => {
      expect(Array.isArray(mockUserProfile.learningGoals)).toBe(true)
      expect(mockUserProfile.learningGoals.length).toBeGreaterThan(0)
      
      mockUserProfile.learningGoals.forEach(goal => {
        expect(typeof goal).toBe('string')
        expect(goal.length).toBeGreaterThan(0)
      })
    })

    it('has valid preferences', () => {
      expect(mockUserProfile.preferences).toBeDefined()
      expect(mockUserProfile.preferences.learningStyle).toBeDefined()
      expect(mockUserProfile.preferences.sessionDuration).toBeDefined()
      expect(mockUserProfile.preferences.difficulty).toBeDefined()
      expect(Array.isArray(mockUserProfile.preferences.focusAreas)).toBe(true)
    })
  })

  describe('mockSkills', () => {
    it('has valid structure for all skills', () => {
      expect(Array.isArray(mockSkills)).toBe(true)
      expect(mockSkills.length).toBeGreaterThan(0)
      
      mockSkills.forEach(skill => {
        expect(skill.id).toBeDefined()
        expect(skill.name).toBeDefined()
        expect(skill.category).toBeDefined()
        expect(skill.description).toBeDefined()
        expect(Array.isArray(skill.levels)).toBe(true)
        expect(skill.levels.length).toBe(5) // Should have 5 levels
        
        skill.levels.forEach((level, index) => {
          expect(level.level).toBe(index + 1)
          expect(level.name).toBeDefined()
          expect(level.description).toBeDefined()
          expect(Array.isArray(level.competencyIndicators)).toBe(true)
        })
      })
    })

    it('has unique skill IDs', () => {
      const skillIds = mockSkills.map(skill => skill.id)
      const uniqueIds = new Set(skillIds)
      expect(uniqueIds.size).toBe(skillIds.length)
    })

    it('covers key PM competencies', () => {
      const skillNames = mockSkills.map(skill => skill.name.toLowerCase())
      
      expect(skillNames.some(name => name.includes('communication'))).toBe(true)
      expect(skillNames.some(name => name.includes('strategic'))).toBe(true)
      expect(skillNames.some(name => name.includes('stakeholder'))).toBe(true)
      expect(skillNames.some(name => name.includes('framework'))).toBe(true)
    })
  })

  describe('mockModuleCollections', () => {
    it('has valid collection structure', () => {
      expect(Array.isArray(mockModuleCollections)).toBe(true)
      expect(mockModuleCollections.length).toBeGreaterThan(0)
      
      mockModuleCollections.forEach(collection => {
        expect(collection.id).toBeDefined()
        expect(collection.name).toBeDefined()
        expect(collection.description).toBeDefined()
        expect(Array.isArray(collection.modules)).toBe(true)
        expect(Array.isArray(collection.categories)).toBe(true)
        expect(collection.moduleCount).toBe(collection.modules.length)
      })
    })

    it('has valid modules in each collection', () => {
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          expect(module.id).toBeDefined()
          expect(module.title).toBeDefined()
          expect(module.description).toBeDefined()
          expect(module.category).toBeDefined()
          expect(module.difficulty).toBeDefined()
          expect(module.estimatedDuration).toBeGreaterThan(0)
          expect(Array.isArray(module.learningObjectives)).toBe(true)
          expect(Array.isArray(module.skills)).toBe(true)
          expect(Array.isArray(module.industryRelevance)).toBe(true)
          expect(Array.isArray(module.careerImpact)).toBe(true)
        })
      })
    })

    it('has realistic estimated durations', () => {
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          expect(module.estimatedDuration).toBeGreaterThanOrEqual(5)
          expect(module.estimatedDuration).toBeLessThanOrEqual(60)
        })
      })
    })

    it('has valid ratings for all modules', () => {
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          expect(module.ratings.averageRating).toBeGreaterThanOrEqual(1)
          expect(module.ratings.averageRating).toBeLessThanOrEqual(5)
          expect(module.ratings.totalRatings).toBeGreaterThanOrEqual(0)
          expect(module.ratings.effectiveness).toBeGreaterThanOrEqual(0)
          expect(module.ratings.effectiveness).toBeLessThanOrEqual(1)
        })
      })
    })

    it('has comprehensive industry relevance coverage', () => {
      const allIndustries = new Set<string>()
      
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          module.industryRelevance.forEach(relevance => {
            allIndustries.add(relevance.industry)
          })
        })
      })
      
      expect(allIndustries.size).toBeGreaterThanOrEqual(3)
      expect(allIndustries.has('Financial Services & Fintech')).toBe(true)
    })

    it('has valid career impact mappings', () => {
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          module.careerImpact.forEach(impact => {
            expect(impact.transitionType).toBeDefined()
            expect(['HIGH', 'MEDIUM', 'LOW']).toContain(impact.impactLevel)
            expect(Array.isArray(impact.specificBenefits)).toBe(true)
            expect(impact.timeToImpact).toBeDefined()
          })
        })
      })
    })
  })

  describe('mockRecommendationEngine', () => {
    it('has valid progress analysis', () => {
      const analysis = mockRecommendationEngine.userProgressAnalysis
      
      expect(analysis.completedModules).toBeGreaterThanOrEqual(0)
      expect(analysis.totalAvailableModules).toBeGreaterThan(analysis.completedModules)
      expect(Array.isArray(analysis.skillProgression)).toBe(true)
      expect(analysis.careerReadiness).toBeDefined()
      expect(Array.isArray(analysis.recentActivity)).toBe(true)
      expect(analysis.learningVelocity).toBeGreaterThan(0)
    })

    it('has valid skill gap identification', () => {
      const skillGaps = mockRecommendationEngine.skillGapIdentification
      
      expect(Array.isArray(skillGaps)).toBe(true)
      skillGaps.forEach(gap => {
        expect(gap.skill).toBeDefined()
        expect(gap.currentLevel).toBeGreaterThan(0)
        expect(gap.targetLevel).toBeGreaterThan(gap.currentLevel)
        expect(gap.gapSize).toBeGreaterThan(0)
        expect(['HIGH', 'MEDIUM', 'LOW']).toContain(gap.priority)
        expect(Array.isArray(gap.recommendedModules)).toBe(true)
      })
    })

    it('has valid career goal alignment', () => {
      const alignment = mockRecommendationEngine.careerGoalAlignment
      
      expect(alignment.targetRole).toBeDefined()
      expect(alignment.targetIndustry).toBeDefined()
      expect(alignment.alignmentScore).toBeGreaterThan(0)
      expect(alignment.alignmentScore).toBeLessThanOrEqual(100)
      expect(Array.isArray(alignment.keyFocusAreas)).toBe(true)
      expect(Array.isArray(alignment.missingSkills)).toBe(true)
      expect(Array.isArray(alignment.strengthAreas)).toBe(true)
    })

    it('has valid personalized recommendations', () => {
      const recommendations = mockRecommendationEngine.personalizedRecommendations
      
      expect(Array.isArray(recommendations)).toBe(true)
      expect(recommendations.length).toBeGreaterThan(0)
      
      recommendations.forEach(rec => {
        expect(rec.module).toBeDefined()
        expect(rec.relevanceScore).toBeGreaterThanOrEqual(0)
        expect(rec.relevanceScore).toBeLessThanOrEqual(100)
        expect(rec.reasoning).toBeDefined()
        expect(['HIGH', 'MEDIUM', 'LOW']).toContain(rec.urgencyLevel)
        expect(rec.careerImpact).toBeDefined()
        expect(rec.timeToCompletion).toBeDefined()
        expect(Array.isArray(rec.skillGaps)).toBe(true)
        expect(Array.isArray(rec.prerequisites)).toBe(true)
      })
    })
  })

  describe('mockLearningPaths', () => {
    it('has valid learning path structure', () => {
      expect(Array.isArray(mockLearningPaths)).toBe(true)
      expect(mockLearningPaths.length).toBeGreaterThan(0)
      
      mockLearningPaths.forEach(path => {
        expect(path.id).toBeDefined()
        expect(path.name).toBeDefined()
        expect(path.description).toBeDefined()
        expect(path.estimatedDuration).toBeDefined()
        expect(path.moduleCount).toBeGreaterThan(0)
        expect(path.targetTransition).toBeDefined()
        expect(Array.isArray(path.modules)).toBe(true)
        expect(Array.isArray(path.milestones)).toBe(true)
      })
    })

    it('has valid milestones', () => {
      mockLearningPaths.forEach(path => {
        expect(path.milestones.length).toBeGreaterThan(0)
        
        path.milestones.forEach((milestone, index) => {
          expect(milestone.id).toBeDefined()
          expect(milestone.title).toBeDefined()
          expect(milestone.description).toBeDefined()
          expect(Array.isArray(milestone.requirements)).toBe(true)
          expect(typeof milestone.completed).toBe('boolean')
          expect(milestone.order).toBe(index + 1)
        })
      })
    })

    it('covers key career transitions', () => {
      const transitionTypes = mockLearningPaths.map(path => path.targetTransition)
      
      expect(transitionTypes).toContain('SENIOR_PM_TO_GROUP_PM')
      expect(transitionTypes).toContain('INDUSTRY_TRANSITION')
    })
  })

  describe('Data Consistency', () => {
    it('has consistent skill references across collections', () => {
      const allModuleSkills = new Set<string>()
      
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          module.skills.forEach(skill => {
            allModuleSkills.add(skill.id)
          })
        })
      })
      
      const definedSkillIds = new Set(mockSkills.map(skill => skill.id))
      
      // All module skills should reference defined skills
      allModuleSkills.forEach(skillId => {
        expect(definedSkillIds.has(skillId)).toBe(true)
      })
    })

    it('has consistent user profile skill references', () => {
      const userSkillIds = mockUserProfile.skillAssessment.skills.map(skill => skill.skill.id)
      const definedSkillIds = mockSkills.map(skill => skill.id)
      
      userSkillIds.forEach(skillId => {
        expect(definedSkillIds).toContain(skillId)
      })
    })

    it('has valid module ID references in recommendations', () => {
      const allModuleIds = new Set<string>()
      
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          allModuleIds.add(module.id)
        })
      })
      
      mockRecommendationEngine.personalizedRecommendations.forEach(rec => {
        expect(allModuleIds.has(rec.module.id)).toBe(true)
      })
    })

    it('has realistic data relationships', () => {
      // User's target role should align with recommendations
      const userTransition = `${mockUserProfile.currentRole}_TO_${mockUserProfile.targetRole}`.replace(/ /g, '_').toUpperCase()
      
      const hasRelevantRecommendations = mockRecommendationEngine.personalizedRecommendations.some(rec => 
        rec.module.careerImpact.some(impact => 
          impact.transitionType.includes('SENIOR_PM_TO_GROUP_PM') || 
          impact.transitionType.includes('INDUSTRY_TRANSITION')
        )
      )
      
      expect(hasRelevantRecommendations).toBe(true)
    })
  })

  describe('Mock Data Quality', () => {
    it('has realistic content length and quality', () => {
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          expect(module.title.length).toBeGreaterThan(10)
          expect(module.title.length).toBeLessThan(100)
          expect(module.description.length).toBeGreaterThan(50)
          expect(module.shortDescription.length).toBeGreaterThan(20)
          expect(module.shortDescription.length).toBeLessThan(100)
        })
      })
    })

    it('has diverse and comprehensive content coverage', () => {
      const allCategories = new Set<string>()
      const allIndustries = new Set<string>()
      const allTransitions = new Set<string>()
      
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          allCategories.add(module.category.name)
          module.industryRelevance.forEach(rel => allIndustries.add(rel.industry))
          module.careerImpact.forEach(impact => allTransitions.add(impact.transitionType))
        })
      })
      
      expect(allCategories.size).toBeGreaterThanOrEqual(3)
      expect(allIndustries.size).toBeGreaterThanOrEqual(3)
      expect(allTransitions.size).toBeGreaterThanOrEqual(2)
    })

    it('has valid date fields', () => {
      mockModuleCollections.forEach(collection => {
        collection.modules.forEach(module => {
          expect(module.createdAt instanceof Date).toBe(true)
          expect(module.updatedAt instanceof Date).toBe(true)
          expect(module.updatedAt.getTime()).toBeGreaterThanOrEqual(module.createdAt.getTime())
        })
      })
      
      expect(mockUserProfile.skillAssessment.completedAt instanceof Date).toBe(true)
      
      mockLearningPaths.forEach(path => {
        expect(path.createdAt instanceof Date).toBe(true)
      })
    })
  })
})