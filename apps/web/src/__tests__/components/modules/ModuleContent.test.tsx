/**
 * Comprehensive test suite for Module Content & Exercise Structure (Slice 8)
 * Tests all major components and functionality
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { ContentOrchestrator } from '../../../components/modules/ModuleContent/ContentOrchestrator'
import { ScenarioBasedExercise } from '../../../components/modules/ModuleContent/ExerciseTypes/ScenarioBasedExercise'
import { StakeholderRolePlay } from '../../../components/modules/ModuleContent/ExerciseTypes/StakeholderRolePlay'
import { FrameworkApplication } from '../../../components/modules/ModuleContent/ExerciseTypes/FrameworkApplication'
import { CommunicationStructure } from '../../../components/modules/ModuleContent/ExerciseTypes/CommunicationStructure'
import { IndustryScenarioBank, INDUSTRY_SCENARIOS } from '../../../components/modules/ModuleContent/ScenarioGeneration/IndustryScenarioBank'
import { CareerTransitionScenarios, TRANSITION_SCENARIOS } from '../../../components/modules/ModuleContent/ScenarioGeneration/CareerTransitionScenarios'
import { StructureAnalyzer, StructureAnalysisDisplay } from '../../../components/modules/ModuleContent/ResponseEvaluation/StructureAnalyzer'
import DifficultyProgression from '../../../components/modules/ModuleContent/ProgressAdaptation/DifficultyProgression'

// Mock data for testing
const mockModule = {
  id: 'test-module',
  title: 'Test Exercise Module',
  description: 'Test module for PM communication practice',
  category: {
    id: 'communication',
    name: 'Communication',
    description: 'PM Communication Skills',
    moduleCount: 10,
    averageDuration: '30 min',
    skillLevel: 'Intermediate',
    careerImpact: 'High'
  },
  difficulty: 'Practice' as const,
  estimatedDuration: 30,
  learningObjectives: [],
  prerequisites: [],
  skills: [],
  industryRelevance: [],
  careerImpact: [],
  moduleType: 'COMMUNICATION_PRACTICE' as const,
  content: {
    type: 'COMMUNICATION_PRACTICE' as const,
    scenarios: [],
    practiceExercises: [],
    frameworkApplication: [],
    realWorldContext: {
      industry: 'Enterprise Software & B2B' as const,
      companySize: 'SCALE_UP' as const,
      meetingType: 'PLANNING_SESSION' as const,
      stakeholderLevel: 'VP' as const,
      businessContext: 'Test business context'
    }
  },
  assessment: {
    type: 'PRACTICE' as const,
    criteria: [],
    passingScore: 7,
    feedback: { strengths: [], improvementAreas: [], specificSuggestions: [], nextSteps: [] },
    retryPolicy: { maxAttempts: 3, cooldownPeriod: 0, improvementRequired: false }
  },
  ratings: { averageRating: 8.5, totalRatings: 100, effectiveness: 9, careerRelevance: 8, difficultyAccuracy: 8, userReviews: [] },
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  shortDescription: 'Test module'
}

const mockUserProfile = {
  id: 'user-1',
  name: 'Test User',
  currentRole: 'Product Manager',
  targetRole: 'Senior PM',
  industry: 'Enterprise Software & B2B' as const,
  experienceLevel: 'Intermediate' as const,
  completedModules: [],
  skillAssessment: {
    skills: [],
    completedAt: new Date(),
    overallScore: 7,
    nextAssessment: new Date()
  },
  learningGoals: ['Executive presence', 'Strategic communication'],
  preferences: {
    learningStyle: 'MIXED' as const,
    sessionDuration: 'MEDIUM' as const,
    difficulty: 'Practice' as const,
    focusAreas: ['Communication', 'Frameworks'],
    availableTime: 'WEEKLY' as const,
    notificationPreferences: {
      newModules: true,
      recommendations: true,
      milestones: true,
      reminders: true,
      frequency: 'WEEKLY' as const
    }
  }
}

const mockExerciseEngine = {
  exerciseType: 'SCENARIO_BASED' as const,
  difficultyLevel: 'Practice' as const,
  scenarioGenerator: {
    industryScenarios: {
      industry: 'Enterprise Software & B2B' as const,
      scenarios: [],
      commonChallenges: [],
      keyFrameworks: [],
      stakeholderPatterns: []
    },
    careerTransitionScenarios: {
      transitionType: 'PM_TO_SENIOR_PM' as const,
      scenarios: [],
      skillFocus: [],
      progressionMetrics: []
    },
    meetingTypeScenarios: {
      meetingType: 'PLANNING_SESSION' as const,
      scenarios: [],
      communicationPatterns: [],
      successFactors: []
    },
    adaptiveBuilder: {
      generateScenario: jest.fn().mockResolvedValue({
        id: 'test-scenario',
        title: 'Test Scenario',
        context: {
          industryContext: 'Enterprise Software & B2B' as const,
          companySize: 'SCALE_UP' as const,
          situation: 'Test scenario situation',
          timeline: '1 week',
          urgencyLevel: 'HIGH' as const
        },
        stakeholders: [{
          role: 'VP Engineering',
          level: 'VP' as const,
          name: 'John Doe',
          motivation: ['Technical excellence'],
          concerns: ['Resource allocation'],
          influence: 'HIGH' as const,
          alignment: 'NEUTRAL' as const,
          communicationStyle: {
            preference: 'TECHNICAL' as const,
            attention: 'MEDIUM' as const,
            decisionStyle: 'DELIBERATE' as const,
            expertise: 'TECHNICAL' as const
          }
        }],
        objectives: [],
        constraints: [],
        successCriteria: [],
        difficulty: 'Practice' as const,
        careerRelevance: ['PM_TO_SENIOR_PM'],
        industryContext: ['Enterprise Software & B2B']
      }),
      userProgress: {
        completedScenarios: [],
        skillLevels: [],
        recentScores: [],
        preferredDifficulty: 'Practice' as const,
        learningVelocity: 0.5
      },
      skillGaps: [],
      recentPerformance: [],
      adaptationRules: []
    }
  },
  responseEvaluator: {
    structureAnalyzer: {
      analyzeStructure: jest.fn().mockReturnValue({
        hasAnswerFirst: true,
        logicalFlow: 'GOOD' as const,
        clarity: 8,
        conciseness: 7,
        completeness: 8,
        stakeholderAdaptation: 7
      })
    },
    frameworkEvaluator: {
      detectFrameworks: jest.fn().mockReturnValue(['RICE']),
      evaluateUsage: jest.fn().mockReturnValue({
        framework: 'RICE' as const,
        correctlyApplied: true,
        appropriatenessScore: 8,
        missingElements: [],
        suggestions: []
      })
    },
    stakeholderAdaptation: {
      analyzeAdaptation: jest.fn(),
      scoreResonance: jest.fn(),
      identifyMismatches: jest.fn()
    },
    executivePresenceScorer: {
      scorePresence: jest.fn().mockReturnValue({
        overall: 8,
        confidence: 7,
        authority: 8,
        clarity: 8,
        conviction: 7,
        composure: 8
      })
    }
  },
  adaptiveFeedback: {
    feedbackLevel: 'DETAILED' as const,
    personalization: 'ROLE_SPECIFIC' as const,
    deliveryMethod: 'IMMEDIATE' as const,
    followUpActions: []
  }
}

const mockProgressTracking = {
  skillProgression: [],
  difficultyProgression: {
    currentLevel: 'Practice' as const,
    readinessForAdvancement: 0.7,
    lastAdvancement: new Date(),
    nextLevelRequirements: ['Score 8+ consistently', 'Complete 5+ exercises', 'Master framework application']
  },
  masteryTracking: {
    skillMasteries: [],
    overallMastery: 0.6,
    masteryTrajectory: 'STEADY' as const
  },
  personalizedFeedback: {
    feedbackHistory: [],
    learningStyle: {
      primary: 'MIXED' as const,
      feedbackPreference: 'IMMEDIATE' as const,
      detailLevel: 'HIGH' as const
    },
    motivationFactors: [],
    adaptationRules: []
  }
}

describe('Module Content & Exercise Structure (Slice 8)', () => {
  describe('ContentOrchestrator', () => {
    it('renders module content with proper header and navigation', async () => {
      const mockOnExerciseComplete = jest.fn()
      const mockOnProgressUpdate = jest.fn()
      const mockOnDifficultyChange = jest.fn()

      render(
        <ContentOrchestrator
          module={mockModule}
          userProfile={mockUserProfile}
          exerciseEngine={mockExerciseEngine}
          progressTracking={mockProgressTracking}
          onExerciseComplete={mockOnExerciseComplete}
          onProgressUpdate={mockOnProgressUpdate}
          onDifficultyChange={mockOnDifficultyChange}
        />
      )

      expect(screen.getByText('Test Exercise Module')).toBeInTheDocument()
      expect(screen.getByText(/Test module for PM communication practice/)).toBeInTheDocument()
      expect(screen.getByText('Practice')).toBeInTheDocument()
      expect(screen.getByText(/Product Manager → Senior PM/)).toBeInTheDocument()
    })

    it('initializes exercise scenario on mount', async () => {
      render(
        <ContentOrchestrator
          module={mockModule}
          userProfile={mockUserProfile}
          exerciseEngine={mockExerciseEngine}
          progressTracking={mockProgressTracking}
        />
      )

      await waitFor(() => {
        expect(mockExerciseEngine.scenarioGenerator.adaptiveBuilder.generateScenario).toHaveBeenCalled()
      })
    })

    it('handles response submission and evaluation', async () => {
      const mockOnExerciseComplete = jest.fn()
      
      render(
        <ContentOrchestrator
          module={mockModule}
          userProfile={mockUserProfile}
          exerciseEngine={mockExerciseEngine}
          progressTracking={mockProgressTracking}
          onExerciseComplete={mockOnExerciseComplete}
        />
      )

      // Wait for scenario to load
      await waitFor(() => {
        expect(screen.getByText('Test Scenario')).toBeInTheDocument()
      })

      // Submit a response
      const textarea = screen.getByPlaceholderText(/Provide your response to this scenario/)
      await userEvent.type(textarea, 'I recommend we proceed with this approach because it provides the best ROI.')
      
      const submitButton = screen.getByText('Submit Response')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnExerciseComplete).toHaveBeenCalled()
      })
    })
  })

  describe('ScenarioBasedExercise', () => {
    const mockScenario = {
      id: 'test-scenario',
      title: 'Product Strategy Decision',
      context: {
        industryContext: 'Enterprise Software & B2B' as const,
        companySize: 'SCALE_UP' as const,
        productContext: {
          productType: 'B2B' as const,
          productStage: 'GROWTH' as const,
          userBase: 'Enterprise customers',
          revenue: '$10M ARR',
          complexity: 'HIGH' as const
        },
        marketConditions: {
          competitiveIntensity: 'HIGH' as const,
          growthRate: 'GROWING' as const,
          disruption: 'MEDIUM' as const,
          regulatoryPressure: 'LOW' as const
        },
        organizationalPolitics: {
          level: 'MODERATE' as const,
          keyPlayers: ['CEO', 'VP Engineering'],
          conflictAreas: ['Resource allocation'],
          powerDynamics: ['CEO drives strategy']
        },
        timeline: 'Board meeting next week',
        situation: 'Major competitor launched similar feature. Board questioning product strategy.',
        urgencyLevel: 'HIGH' as const
      },
      stakeholders: [{
        role: 'Chief Executive Officer',
        level: 'C_SUITE' as const,
        name: 'Sarah Chen',
        motivation: ['Revenue growth', 'Market leadership'],
        concerns: ['Competitive threats', 'Strategic positioning'],
        influence: 'HIGH' as const,
        alignment: 'ALIGNED' as const,
        communicationStyle: {
          preference: 'BIG_PICTURE' as const,
          attention: 'SHORT' as const,
          decisionStyle: 'QUICK' as const,
          expertise: 'BUSINESS' as const
        }
      }],
      objectives: [{
        id: 'strategic-communication',
        description: 'Communicate strategic decisions with confidence',
        skillArea: 'Strategic Communication',
        proficiencyTarget: 8,
        assessmentCriteria: ['Clear strategy articulation', 'Confident delivery'],
        careerImpact: 'High impact for PM advancement',
        timeToMaster: '3-6 months'
      }],
      constraints: [{
        type: 'TIME' as const,
        description: 'Board meeting deadline cannot be moved',
        severity: 'HIGH' as const
      }],
      successCriteria: [{
        criterion: 'Answer-first communication',
        weight: 0.3,
        measurement: 'Opens with clear recommendation',
        threshold: 8,
        examples: ['I recommend we...', 'My analysis suggests...']
      }],
      timeLimit: 180,
      difficulty: 'Practice' as const,
      careerRelevance: ['PM_TO_SENIOR_PM'],
      industryContext: ['Enterprise Software & B2B']
    }

    it('renders scenario details correctly', () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <ScenarioBasedExercise
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByText('Product Strategy Decision')).toBeInTheDocument()
      expect(screen.getByText('Practice')).toBeInTheDocument()
      expect(screen.getByText(/Major competitor launched similar feature/)).toBeInTheDocument()
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
      expect(screen.getByText('ALIGNED')).toBeInTheDocument()
    })

    it('shows timer functionality', () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <ScenarioBasedExercise
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByText('3:00')).toBeInTheDocument()
      expect(screen.getByText('Start')).toBeInTheDocument()
    })

    it('allows response submission', async () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <ScenarioBasedExercise
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      const textarea = screen.getByPlaceholderText(/Provide your response to this scenario/)
      const submitButton = screen.getByText('Submit Response')

      await userEvent.type(textarea, 'I recommend we accelerate our product differentiation strategy by focusing on unique value propositions that our competitor cannot easily replicate.')
      await userEvent.click(submitButton)

      expect(mockOnResponseSubmit).toHaveBeenCalledWith(
        'I recommend we accelerate our product differentiation strategy by focusing on unique value propositions that our competitor cannot easily replicate.'
      )
    })

    it('shows hints when requested', async () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <ScenarioBasedExercise
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      const showHintsButton = screen.getByText('Show Hints')
      await userEvent.click(showHintsButton)

      expect(screen.getByText('Communication Tips')).toBeInTheDocument()
      expect(screen.getByText(/Start with your recommendation/)).toBeInTheDocument()
    })
  })

  describe('FrameworkApplication', () => {
    const mockScenario = {
      id: 'framework-scenario',
      title: 'Prioritization Framework Application',
      context: {
        industryContext: 'Enterprise Software & B2B' as const,
        companySize: 'SCALE_UP' as const,
        situation: 'Multiple feature requests require prioritization using RICE framework',
        timeline: 'Sprint planning next week',
        urgencyLevel: 'MEDIUM' as const
      },
      stakeholders: [],
      objectives: [],
      constraints: [],
      successCriteria: [],
      difficulty: 'Practice' as const,
      careerRelevance: ['PM_TO_SENIOR_PM'],
      industryContext: ['Enterprise Software & B2B']
    }

    it('renders framework selection interface', () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <FrameworkApplication
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByText('Prioritization Framework Application')).toBeInTheDocument()
      expect(screen.getByText('Recommended Frameworks')).toBeInTheDocument()
      expect(screen.getByText('RICE (Reach, Impact, Confidence, Effort)')).toBeInTheDocument()
    })

    it('allows framework selection and input', async () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <FrameworkApplication
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      // Select RICE framework (should be default)
      expect(screen.getByText('Apply RICE (Reach, Impact, Confidence, Effort)')).toBeInTheDocument()

      // Fill in RICE values
      const reachInput = screen.getByPlaceholderText(/Enter reach/)
      await userEvent.type(reachInput, '1000')

      const impactInput = screen.getByPlaceholderText(/Enter impact/)
      await userEvent.type(impactInput, '2')

      const confidenceInput = screen.getByPlaceholderText(/Enter confidence/)
      await userEvent.type(confidenceInput, '80')

      const effortInput = screen.getByPlaceholderText(/Enter effort/)
      await userEvent.type(effortInput, '3')

      // Check for live calculation
      await waitFor(() => {
        expect(screen.getByText(/RICE Score:/)).toBeInTheDocument()
      })
    })

    it('provides framework guidance', async () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <FrameworkApplication
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByText(/Prioritization framework using quantitative scoring/)).toBeInTheDocument()
      expect(screen.getByText(/How many people will this impact/)).toBeInTheDocument()
    })
  })

  describe('CommunicationStructure', () => {
    const mockScenario = {
      id: 'communication-scenario',
      title: 'Executive Presentation Structure',
      context: {
        industryContext: 'Enterprise Software & B2B' as const,
        companySize: 'ENTERPRISE' as const,
        situation: 'Need to present quarterly results to board with strategic recommendations',
        timeline: 'Board meeting tomorrow',
        urgencyLevel: 'HIGH' as const
      },
      stakeholders: [],
      objectives: [],
      constraints: [],
      successCriteria: [],
      difficulty: 'Mastery' as const,
      careerRelevance: ['PM_TO_SENIOR_PM'],
      industryContext: ['Enterprise Software & B2B']
    }

    it('renders communication pattern options', () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <CommunicationStructure
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByText('Executive Presentation Structure')).toBeInTheDocument()
      expect(screen.getByText('Communication Structure Pattern')).toBeInTheDocument()
      expect(screen.getByText('Answer-First')).toBeInTheDocument()
      expect(screen.getByText('Pyramid Principle')).toBeInTheDocument()
    })

    it('shows real-time structure analysis', async () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <CommunicationStructure
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      const textarea = screen.getByPlaceholderText(/Craft your response using executive communication principles/)
      await userEvent.type(textarea, 'I recommend we focus on three key areas for next quarter based on our analysis')

      await waitFor(() => {
        expect(screen.getByText('Real-time Structure Analysis')).toBeInTheDocument()
      })
    })

    it('provides executive language guidance', () => {
      const mockOnResponseSubmit = jest.fn()

      render(
        <CommunicationStructure
          scenario={mockScenario}
          userProfile={mockUserProfile}
          onResponseSubmit={mockOnResponseSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByText('Executive Language Patterns')).toBeInTheDocument()
      expect(screen.getByText('✓ Confident Language:')).toBeInTheDocument()
      expect(screen.getByText('✗ Hedging Language:')).toBeInTheDocument()
    })
  })

  describe('IndustryScenarioBank', () => {
    it('displays industry-specific scenarios', () => {
      const mockOnScenarioSelect = jest.fn()

      render(
        <IndustryScenarioBank
          industry="Healthcare & Life Sciences"
          difficulty="Practice"
          onScenarioSelect={mockOnScenarioSelect}
        />
      )

      expect(screen.getByText('Healthcare & Life Sciences Scenarios')).toBeInTheDocument()
    })

    it('filters scenarios by difficulty', () => {
      const mockOnScenarioSelect = jest.fn()

      render(
        <IndustryScenarioBank
          industry="Enterprise Software & B2B"
          difficulty="Foundation"
          onScenarioSelect={mockOnScenarioSelect}
        />
      )

      // Should show appropriate scenarios for foundation level
      expect(screen.getByText(/scenario.*available/)).toBeInTheDocument()
    })

    it('handles scenario selection', async () => {
      const mockOnScenarioSelect = jest.fn()

      render(
        <IndustryScenarioBank
          industry="Healthcare & Life Sciences"
          difficulty="Mastery"
          onScenarioSelect={mockOnScenarioSelect}
        />
      )

      if (INDUSTRY_SCENARIOS['Healthcare & Life Sciences'].length > 0) {
        const scenarioCard = screen.getByText(/FDA Regulatory Approval Communication/)
        await userEvent.click(scenarioCard)
        expect(mockOnScenarioSelect).toHaveBeenCalled()
      }
    })
  })

  describe('CareerTransitionScenarios', () => {
    it('displays transition-specific scenarios', () => {
      const mockOnScenarioSelect = jest.fn()

      render(
        <CareerTransitionScenarios
          transitionType="PM_TO_SENIOR_PM"
          difficulty="Practice"
          onScenarioSelect={mockOnScenarioSelect}
        />
      )

      expect(screen.getByText(/PM TO SENIOR PM Scenarios/)).toBeInTheDocument()
      expect(screen.getByText(/PM to Senior PM - Executive presence and influence without authority/)).toBeInTheDocument()
    })

    it('shows coming soon message for unavailable scenarios', () => {
      const mockOnScenarioSelect = jest.fn()

      render(
        <CareerTransitionScenarios
          transitionType="INDUSTRY_TRANSITION"
          difficulty="Practice"
          onScenarioSelect={mockOnScenarioSelect}
        />
      )

      expect(screen.getByText('Scenarios Coming Soon')).toBeInTheDocument()
    })
  })

  describe('StructureAnalyzer', () => {
    it('analyzes answer-first structure correctly', () => {
      const analyzer = new StructureAnalyzer()
      const response = 'I recommend we prioritize the security update over new features because it affects 80% of our users.'
      
      const analysis = analyzer.analyzeStructure(response)
      
      expect(analysis.hasAnswerFirst).toBe(true)
      expect(analysis.logicalFlow).toBe('GOOD')
      expect(analysis.clarity).toBeGreaterThan(6)
    })

    it('identifies communication patterns', () => {
      const analyzer = new StructureAnalyzer()
      const response = 'I recommend prioritizing feature A. Three reasons support this: first, user demand is high; second, development effort is low; third, competitive advantage is significant.'
      
      const patterns = analyzer.identifyPatterns(response)
      
      expect(patterns.some(p => p.pattern === 'Answer-First')).toBe(true)
      expect(patterns.some(p => p.pattern === 'Pyramid Principle')).toBe(true)
    })

    it('scores clarity appropriately', () => {
      const analyzer = new StructureAnalyzer()
      const clearResponse = 'I recommend option A because it delivers the best ROI.'
      const unclearResponse = 'Well, maybe we could possibly consider option A, though there might be some issues.'
      
      const clearScore = analyzer.scoreClarity(clearResponse)
      const unclearScore = analyzer.scoreClarity(unclearResponse)
      
      expect(clearScore).toBeGreaterThan(unclearScore)
    })
  })

  describe('DifficultyProgression', () => {
    it('renders current level and progress', () => {
      const mockOnLevelChange = jest.fn()

      render(
        <DifficultyProgression
          currentLevel="Practice"
          readinessForAdvancement={0.7}
          lastAdvancement={new Date()}
          nextLevelRequirements={['Score 8+ consistently', 'Complete 5+ exercises']}
          onLevelChange={mockOnLevelChange}
        />
      )

      expect(screen.getByText('Current Level: Practice')).toBeInTheDocument()
      expect(screen.getByText('Progress to Mastery')).toBeInTheDocument()
      expect(screen.getByText('70%')).toBeInTheDocument()
    })

    it('shows advancement button when ready', () => {
      const mockOnLevelChange = jest.fn()

      render(
        <DifficultyProgression
          currentLevel="Practice"
          readinessForAdvancement={0.9}
          lastAdvancement={new Date()}
          nextLevelRequirements={['Score 8+ consistently']}
          onLevelChange={mockOnLevelChange}
        />
      )

      expect(screen.getByText('Advance to Mastery Level')).toBeInTheDocument()
    })

    it('handles level advancement', async () => {
      const mockOnLevelChange = jest.fn()

      render(
        <DifficultyProgression
          currentLevel="Practice"
          readinessForAdvancement={0.9}
          lastAdvancement={new Date()}
          nextLevelRequirements={['Score 8+ consistently']}
          onLevelChange={mockOnLevelChange}
        />
      )

      const advanceButton = screen.getByText('Advance to Mastery Level')
      await userEvent.click(advanceButton)

      expect(mockOnLevelChange).toHaveBeenCalledWith('Mastery')
    })

    it('displays learning path timeline', () => {
      const mockOnLevelChange = jest.fn()

      render(
        <DifficultyProgression
          currentLevel="Practice"
          readinessForAdvancement={0.5}
          lastAdvancement={new Date()}
          nextLevelRequirements={[]}
          onLevelChange={mockOnLevelChange}
        />
      )

      expect(screen.getByText('Learning Path')).toBeInTheDocument()
      expect(screen.getByText('Foundation')).toBeInTheDocument()
      expect(screen.getByText('Mastery')).toBeInTheDocument()
      expect(screen.getByText('Expert')).toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('maintains state consistency across exercise completion flow', async () => {
      const mockOnExerciseComplete = jest.fn()
      const mockOnProgressUpdate = jest.fn()

      render(
        <ContentOrchestrator
          module={mockModule}
          userProfile={mockUserProfile}
          exerciseEngine={mockExerciseEngine}
          progressTracking={mockProgressTracking}
          onExerciseComplete={mockOnExerciseComplete}
          onProgressUpdate={mockOnProgressUpdate}
        />
      )

      // Wait for scenario initialization
      await waitFor(() => {
        expect(screen.getByText('Test Scenario')).toBeInTheDocument()
      })

      // Complete an exercise
      const textarea = screen.getByPlaceholderText(/Provide your response to this scenario/)
      await userEvent.type(textarea, 'I recommend we proceed with option A because analysis shows 20% improvement in user engagement.')
      
      const submitButton = screen.getByText('Submit Response')
      await userEvent.click(submitButton)

      // Verify evaluation appears
      await waitFor(() => {
        expect(screen.getByText('Performance Analysis')).toBeInTheDocument()
      })

      // Verify callbacks were called
      expect(mockOnExerciseComplete).toHaveBeenCalled()
      expect(mockOnProgressUpdate).toHaveBeenCalled()
    })

    it('adapts difficulty based on performance', async () => {
      const mockOnDifficultyChange = jest.fn()

      // Mock high performance scenario
      const highPerformanceEngine = {
        ...mockExerciseEngine,
        responseEvaluator: {
          ...mockExerciseEngine.responseEvaluator,
          structureAnalyzer: {
            analyzeStructure: jest.fn().mockReturnValue({
              hasAnswerFirst: true,
              logicalFlow: 'EXCELLENT' as const,
              clarity: 9,
              conciseness: 9,
              completeness: 9,
              stakeholderAdaptation: 9
            })
          }
        }
      }

      const highReadinessTracking = {
        ...mockProgressTracking,
        difficultyProgression: {
          currentLevel: 'Practice' as const,
          readinessForAdvancement: 0.9,
          lastAdvancement: new Date(),
          nextLevelRequirements: ['High performance achieved']
        }
      }

      render(
        <ContentOrchestrator
          module={mockModule}
          userProfile={mockUserProfile}
          exerciseEngine={highPerformanceEngine}
          progressTracking={highReadinessTracking}
          onDifficultyChange={mockOnDifficultyChange}
        />
      )

      // Submit high-quality response
      await waitFor(() => {
        expect(screen.getByText('Test Scenario')).toBeInTheDocument()
      })

      const textarea = screen.getByPlaceholderText(/Provide your response to this scenario/)
      await userEvent.type(textarea, 'I recommend we implement the new feature architecture because data shows 35% performance improvement and user testing confirms 90% satisfaction rate.')
      
      const submitButton = screen.getByText('Submit Response')
      await userEvent.click(submitButton)

      // The difficulty change should be triggered in the evaluation logic
      await waitFor(() => {
        expect(screen.getByText('Performance Analysis')).toBeInTheDocument()
      })
    })
  })
})