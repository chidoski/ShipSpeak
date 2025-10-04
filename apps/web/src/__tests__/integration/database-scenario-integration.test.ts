/**
 * Integration Tests: Scenario Generation ↔ Database Integration
 * Tests the complete workflow of generating scenarios and persisting them to database
 * 
 * TDD Phase: RED - Write failing tests first
 */

// Mock environment variables for testing BEFORE any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  ScenarioGenerationDatabaseService,
  type ScenarioGenerationConfig
} from '../../../../../packages/ai/scenario-generation/database-integration';

// Mock the supabase module to avoid actual database calls in tests
jest.mock('../../../../../packages/database/supabase', () => ({
  saveGeneratedScenario: jest.fn(),
  getUserScenarios: jest.fn(),
  getScenarioTemplates: jest.fn(),
  supabaseAdmin: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })),
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn() })) })),
      delete: jest.fn(() => ({ eq: jest.fn() }))
    }))
  }
}));

import { 
  saveGeneratedScenario,
  getUserScenarios,
  getScenarioTemplates,
  supabaseAdmin
} from '../../../../../packages/database/supabase';
import type { 
  ScenarioTemplate,
  GeneratedScenario,
  Meeting 
} from '../../../../../packages/database/types';

// Test data setup
const TEST_USER_ID = 'test-user-scenario-integration';
const TEST_TEMPLATE_ID = 'test-template-executive-presence';

describe('Scenario Generation ↔ Database Integration', () => {
  let scenarioService: ScenarioGenerationDatabaseService;
  let testMeeting: Meeting;
  let testTemplate: ScenarioTemplate;

  beforeEach(async () => {
    // Initialize scenario generation service
    scenarioService = new ScenarioGenerationDatabaseService({
      openaiApiKey: 'test-key',
      enableBatchGeneration: false,
      enableCaching: false // Disable for testing
    });

    // Clean up any existing test data
    await cleanupTestData();

    // Create test scenario template
    testTemplate = await createTestScenarioTemplate();

    // Create test meeting for meeting-based scenario generation
    testMeeting = await createTestMeeting();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Scenario Template to Database Persistence', () => {
    it('should persist generated scenario to database with correct metadata', async () => {
      // Arrange
      const generationConfig: ScenarioGenerationConfig = {
        templateId: testTemplate.id,
        userId: TEST_USER_ID,
        personalizationContext: {
          currentRole: 'senior_pm',
          experienceYears: 5,
          companySize: 'medium',
          focusAreas: ['executive_presence', 'influence_skills']
        },
        contextVariables: {
          stakeholder_type: 'CEO',
          product_initiative: 'new feature launch',
          key_metric: 'user growth',
          main_challenge: 'timeline concerns'
        }
      };

      // Act
      const generatedScenario = await scenarioService.generateScenario(generationConfig);
      
      // This should fail initially - service doesn't exist yet
      const savedScenario = await saveGeneratedScenario(
        TEST_USER_ID,
        testTemplate.id,
        {
          title: generatedScenario.title,
          personalized_prompt: generatedScenario.personalizedPrompt,
          context_data: generatedScenario.contextData,
          stakeholder_data: generatedScenario.stakeholderData,
          generation_method: 'user_profile',
          personalization_factors: generationConfig.personalizationContext
        }
      );

      // Assert
      expect(savedScenario).toBeDefined();
      expect(savedScenario.user_id).toBe(TEST_USER_ID);
      expect(savedScenario.template_id).toBe(testTemplate.id);
      expect(savedScenario.title).toBe(generatedScenario.title);
      expect(savedScenario.generation_method).toBe('user_profile');
      expect(savedScenario.personalization_factors).toEqual(generationConfig.personalizationContext);
    });

    it('should retrieve user scenarios with template and meeting relationships', async () => {
      // Arrange - Create a scenario first
      const scenarioData = {
        title: 'Test Executive Presentation',
        personalized_prompt: 'Present your Q4 results to the CEO...',
        context_data: { stakeholder_type: 'CEO' },
        stakeholder_data: { name: 'Sarah', style: 'data_driven' },
        generation_method: 'user_profile' as const,
        personalization_factors: { role: 'senior_pm' }
      };

      await saveGeneratedScenario(TEST_USER_ID, testTemplate.id, scenarioData);

      // Act
      const userScenarios = await getUserScenarios(TEST_USER_ID, 5);

      // Assert
      expect(userScenarios).toHaveLength(1);
      expect(userScenarios[0].title).toBe(scenarioData.title);
      expect(userScenarios[0].scenario_templates).toBeDefined();
      expect(userScenarios[0].scenario_templates?.name).toBe(testTemplate.name);
    });

    it('should filter scenario templates by category and difficulty', async () => {
      // Arrange - Create templates with different categories
      await createTestScenarioTemplate('influence_skills', 'practice');
      await createTestScenarioTemplate('strategic_communication', 'mastery');

      // Act
      const executivePresenceScenarios = await getScenarioTemplates('executive_presence', 'foundation');
      const influenceSkillsScenarios = await getScenarioTemplates('influence_skills', 'practice');

      // Assert
      expect(executivePresenceScenarios).toHaveLength(1);
      expect(executivePresenceScenarios[0].category).toBe('executive_presence');
      expect(executivePresenceScenarios[0].difficulty_level).toBe('foundation');

      expect(influenceSkillsScenarios).toHaveLength(1);
      expect(influenceSkillsScenarios[0].category).toBe('influence_skills');
      expect(influenceSkillsScenarios[0].difficulty_level).toBe('practice');
    });
  });

  describe('Meeting-Based Scenario Generation Integration', () => {
    it('should generate scenarios based on meeting analysis and persist with meeting relationship', async () => {
      // Arrange - Mock meeting analysis data
      const meetingAnalysisInsights = {
        weaknessAreas: ['executive_presence', 'influence_skills'],
        communicationGaps: ['buried recommendations', 'lack of executive summary'],
        stakeholderContext: ['Engineering Director', 'Sales VP'],
        recommendedScenarios: ['executive_presence', 'difficult_conversations']
      };

      const generationConfig: ScenarioGenerationConfig = {
        templateId: testTemplate.id,
        userId: TEST_USER_ID,
        meetingContext: {
          meetingId: testMeeting.id,
          analysisInsights: meetingAnalysisInsights
        },
        personalizationContext: {
          currentRole: 'senior_pm',
          experienceYears: 5
        }
      };

      // Act
      const generatedScenario = await scenarioService.generateScenarioFromMeeting(generationConfig);
      
      const savedScenario = await saveGeneratedScenario(
        TEST_USER_ID,
        testTemplate.id,
        {
          title: generatedScenario.title,
          personalized_prompt: generatedScenario.personalizedPrompt,
          context_data: generatedScenario.contextData,
          stakeholder_data: generatedScenario.stakeholderData,
          generation_method: 'meeting_based',
          personalization_factors: meetingAnalysisInsights,
          meeting_id: testMeeting.id
        }
      );

      // Assert
      expect(savedScenario.meeting_id).toBe(testMeeting.id);
      expect(savedScenario.generation_method).toBe('meeting_based');
      expect(savedScenario.personalization_factors).toEqual(meetingAnalysisInsights);
      
      // Verify the scenario incorporates meeting-specific insights
      expect(savedScenario.personalized_prompt).toContain('executive presence');
    });

    it('should batch generate multiple scenarios from single meeting analysis', async () => {
      // Arrange
      const analysisInsights = {
        weaknessAreas: ['executive_presence', 'influence_skills', 'strategic_communication'],
        communicationGaps: ['buried recommendations', 'unclear strategic narrative']
      };

      const templateIds = [
        testTemplate.id,
        await createTestScenarioTemplate('influence_skills', 'foundation'),
        await createTestScenarioTemplate('strategic_communication', 'practice')
      ];

      // Act
      const batchConfig = {
        userId: TEST_USER_ID,
        meetingId: testMeeting.id,
        analysisInsights,
        recommendedCategories: ['executive_presence', 'influence_skills', 'strategic_communication'],
        maxScenariosPerCategory: 1
      };

      const generatedScenarios = await scenarioService.batchGenerateFromMeeting(batchConfig);

      // Assert
      expect(generatedScenarios).toHaveLength(3);
      
      for (const scenario of generatedScenarios) {
        expect(scenario.meetingId).toBe(testMeeting.id);
        expect(scenario.generationMethod).toBe('meeting_based');
      }
    });
  });

  describe('Progressive Difficulty Integration', () => {
    it('should track scenario practice history and recommend next difficulty level', async () => {
      // Arrange - Create scenarios at different difficulty levels
      const foundationScenario = await saveGeneratedScenario(
        TEST_USER_ID,
        testTemplate.id,
        {
          title: 'Foundation Executive Presence',
          personalized_prompt: 'Basic executive summary...',
          context_data: {},
          stakeholder_data: {},
          generation_method: 'user_profile',
          personalization_factors: {}
        }
      );

      // Act - Simulate practice sessions with improving scores
      await simulatePracticeProgression(foundationScenario.id, [6.0, 7.5, 8.5]);

      // Get updated scenario with practice history
      const updatedScenarios = await getUserScenarios(TEST_USER_ID, 5);
      const practicedScenario = updatedScenarios.find(s => s.id === foundationScenario.id);

      // Assert
      expect(practicedScenario?.times_practiced).toBe(3);
      expect(practicedScenario?.average_score).toBeCloseTo(7.33, 1);
      expect(practicedScenario?.last_practiced_at).toBeDefined();
    });

    it('should recommend scenarios based on user progress and weak areas', async () => {
      // Arrange - Create user progress data
      await createUserProgressData(TEST_USER_ID, {
        executive_presence: { score: 6.5, level: 'foundation' },
        influence_skills: { score: 4.2, level: 'foundation' }
      });

      // Act
      const recommendedScenarios = await scenarioService.getRecommendedScenarios(
        TEST_USER_ID,
        { focusOnWeakAreas: true, maxRecommendations: 3 }
      );

      // Assert
      expect(recommendedScenarios).toHaveLength(3);
      // Should prioritize influence_skills (lower score)
      expect(recommendedScenarios[0].category).toBe('influence_skills');
    });
  });

  describe('Error Handling and Data Integrity', () => {
    it('should handle scenario generation failures gracefully', async () => {
      // Arrange - Invalid template ID
      const invalidConfig: ScenarioGenerationConfig = {
        templateId: 'invalid-template-id',
        userId: TEST_USER_ID,
        personalizationContext: {}
      };

      // Act & Assert
      await expect(scenarioService.generateScenario(invalidConfig))
        .rejects
        .toThrow('Scenario template not found');
    });

    it('should maintain referential integrity when deleting meetings', async () => {
      // Arrange - Create scenario linked to meeting
      const scenario = await saveGeneratedScenario(
        TEST_USER_ID,
        testTemplate.id,
        {
          title: 'Meeting-linked scenario',
          personalized_prompt: 'Test prompt',
          context_data: {},
          stakeholder_data: {},
          generation_method: 'meeting_based',
          personalization_factors: {},
          meeting_id: testMeeting.id
        }
      );

      // Act - Delete meeting (should cascade or handle gracefully)
      await supabaseAdmin
        .from('meetings')
        .delete()
        .eq('id', testMeeting.id);

      // Assert - Scenario should still exist but meeting_id should be null
      const scenarios = await getUserScenarios(TEST_USER_ID, 5);
      const updatedScenario = scenarios.find(s => s.id === scenario.id);
      expect(updatedScenario).toBeDefined();
      // Implementation should handle this gracefully
    });
  });

  // Helper functions
  async function createTestScenarioTemplate(
    category: string = 'executive_presence',
    difficulty: string = 'foundation'
  ): Promise<ScenarioTemplate> {
    const { data, error } = await supabaseAdmin
      .from('scenario_templates')
      .insert({
        name: `Test ${category} Template`,
        category: category as any,
        difficulty_level: difficulty as any,
        scenario_prompt: 'Test prompt with {{variable}}',
        context_variables: { variable: ['option1', 'option2'] },
        stakeholder_personas: { persona1: { name: 'Test' } },
        success_criteria: { criteria: 'Test criteria' },
        estimated_duration_minutes: 5,
        tags: ['test'],
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function createTestMeeting(): Promise<Meeting> {
    const { data, error } = await supabaseAdmin
      .from('meetings')
      .insert({
        user_id: TEST_USER_ID,
        title: 'Test Executive Review',
        meeting_type: 'executive_review',
        duration_seconds: 1800,
        participant_count: 4,
        original_filename: 'test-meeting.wav',
        file_size_bytes: 1024000,
        file_format: 'audio/wav',
        storage_path: 'test/path/meeting.wav',
        status: 'analyzed',
        has_consent: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function simulatePracticeProgression(scenarioId: string, scores: number[]) {
    for (const score of scores) {
      await supabaseAdmin
        .from('practice_sessions')
        .insert({
          user_id: TEST_USER_ID,
          scenario_id: scenarioId,
          session_type: 'practice',
          duration_seconds: 300,
          overall_score: score,
          completion_status: 'completed',
          ai_feedback: { summary: 'Test feedback' },
          improvement_suggestions: ['Test suggestion'],
          strengths_identified: ['Test strength'],
          difficulty_attempted: 'foundation',
          completed_at: new Date().toISOString()
        });
    }
  }

  async function createUserProgressData(userId: string, progressData: any) {
    for (const [skillArea, data] of Object.entries(progressData)) {
      await supabaseAdmin
        .from('user_progress')
        .insert({
          user_id: userId,
          skill_area: skillArea as any,
          current_level: data.level,
          skill_score: data.score,
          sessions_completed: 3,
          total_practice_time_minutes: 45
        });
    }
  }

  async function cleanupTestData() {
    // Clean up in reverse dependency order
    await supabaseAdmin.from('practice_sessions').delete().eq('user_id', TEST_USER_ID);
    await supabaseAdmin.from('user_progress').delete().eq('user_id', TEST_USER_ID);
    await supabaseAdmin.from('generated_scenarios').delete().eq('user_id', TEST_USER_ID);
    await supabaseAdmin.from('meeting_analyses').delete().match({ 
      meeting_id: { in: `(SELECT id FROM meetings WHERE user_id = '${TEST_USER_ID}')` }
    });
    await supabaseAdmin.from('meetings').delete().eq('user_id', TEST_USER_ID);
    await supabaseAdmin.from('scenario_templates').delete().like('name', 'Test %');
  }
});