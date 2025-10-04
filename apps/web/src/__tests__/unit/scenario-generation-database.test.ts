/**
 * Unit Tests: Scenario Generation Database Integration
 * Tests the core functionality without external dependencies
 * 
 * TDD Phase: GREEN - Verify implementation works
 */

// Mock environment variables first
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the entire database module
jest.mock('../../../../../packages/database/supabase', () => ({
  saveGeneratedScenario: jest.fn().mockResolvedValue({
    id: 'test-scenario-001',
    user_id: 'test-user',
    template_id: 'test-template',
    title: 'Test Executive Presentation',
    personalized_prompt: 'Present your Q4 results to the CEO...',
    context_data: { stakeholder_type: 'CEO' },
    stakeholder_data: { name: 'Sarah', style: 'data_driven' },
    generation_method: 'user_profile',
    personalization_factors: { role: 'senior_pm' },
    times_practiced: 0,
    average_score: null,
    last_practiced_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),
  getUserScenarios: jest.fn().mockResolvedValue([
    {
      id: 'test-scenario-001',
      title: 'Test Executive Presentation',
      scenario_templates: {
        name: 'Executive Presence Template',
        category: 'executive_presence'
      }
    }
  ]),
  getScenarioTemplates: jest.fn().mockResolvedValue([
    {
      id: 'test-template-001',
      name: 'Executive Presence Template',
      category: 'executive_presence',
      difficulty_level: 'foundation'
    }
  ]),
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn() })) }))
    }))
  }
}));

import { 
  ScenarioGenerationDatabaseService,
  type ScenarioGenerationConfig
} from '../../../../../packages/ai/scenario-generation/database-integration';
import { saveGeneratedScenario } from '../../../../../packages/database/supabase';

describe('Scenario Generation Database Integration - Unit Tests', () => {
  let service: ScenarioGenerationDatabaseService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ScenarioGenerationDatabaseService({
      openaiApiKey: 'test-key',
      enableBatchGeneration: false,
      enableCaching: false
    });
  });

  describe('Core Integration Functionality', () => {
    it('should generate and persist scenario successfully', async () => {
      // Arrange
      const config: ScenarioGenerationConfig = {
        userId: 'test-user',
        templateId: 'test-template-001',
        personalizationContext: {
          currentRole: 'senior_pm',
          experienceYears: 5
        }
      };

      // Act
      const result = await service.generateScenario(config);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('test-scenario-001');
      expect(result.user_id).toBe('test-user');
      expect(result.template_id).toBe('test-template');
      expect(result.generation_method).toBe('user_profile');
      expect(saveGeneratedScenario).toHaveBeenCalledWith(
        'test-user',
        expect.stringMatching(/default-template-001|test-template-001/),
        expect.objectContaining({
          title: expect.stringContaining('Practice'),
          personalized_prompt: expect.any(String),
          generation_method: 'user_profile',
          personalization_factors: config.personalizationContext
        })
      );
    });

    it('should generate scenario from meeting context', async () => {
      // Arrange
      const config: ScenarioGenerationConfig = {
        userId: 'test-user',
        meetingContext: {
          meetingId: 'test-meeting-001',
          analysisInsights: {
            weaknessAreas: ['executive_presence'],
            communicationGaps: ['buried recommendations']
          }
        }
      };

      // Act
      const result = await service.generateScenarioFromMeeting(config);

      // Assert
      expect(result).toBeDefined();
      expect(result.generation_method).toBe('meeting_based');
      expect(saveGeneratedScenario).toHaveBeenCalledWith(
        'test-user',
        expect.any(String),
        expect.objectContaining({
          generation_method: 'meeting_based',
          meeting_id: 'test-meeting-001',
          personalization_factors: config.meetingContext!.analysisInsights
        })
      );
    });

    it('should handle missing template gracefully', async () => {
      // Arrange
      const config: ScenarioGenerationConfig = {
        userId: 'test-user',
        templateId: 'non-existent-template'
      };

      // Act & Assert - Should not throw, should create default template
      const result = await service.generateScenario(config);
      expect(result).toBeDefined();
      expect(result.user_id).toBe('test-user');
    });

    it('should enhance titles and prompts with meeting context', async () => {
      // Arrange
      const analysisInsights = {
        weaknessAreas: ['executive_presence'],
        improvementAreas: ['clearer structure', 'stronger data support'],
        meetingType: 'executive_review'
      };

      const config: ScenarioGenerationConfig = {
        userId: 'test-user',
        meetingContext: {
          meetingId: 'test-meeting-001',
          analysisInsights
        }
      };

      // Act
      const result = await service.generateScenarioFromMeeting(config);

      // Assert
      expect(saveGeneratedScenario).toHaveBeenCalledWith(
        'test-user',
        expect.any(String),
        expect.objectContaining({
          title: expect.stringContaining('executive_review'),
          personalized_prompt: expect.stringContaining('clearer structure')
        })
      );
    });
  });

  describe('Service Integration', () => {
    it('should create service instance with proper configuration', () => {
      // Arrange & Act
      const testService = new ScenarioGenerationDatabaseService({
        openaiApiKey: 'test-key',
        enableCaching: false
      });

      // Assert
      expect(testService).toBeInstanceOf(ScenarioGenerationDatabaseService);
    });

    it('should extend existing ScenarioGenerationService functionality', () => {
      // Arrange & Act
      const baseScenarios = service.getBaseScenarios();

      // Assert
      expect(baseScenarios).toBeDefined();
      expect(Array.isArray(baseScenarios)).toBe(true);
      // Should have scenarios from the base service
      expect(baseScenarios.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should throw descriptive error for missing meeting context', async () => {
      // Arrange
      const config: ScenarioGenerationConfig = {
        userId: 'test-user'
      };

      // Act & Assert
      await expect(service.generateScenarioFromMeeting(config))
        .rejects
        .toThrow('Meeting context required for meeting-based generation');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      (saveGeneratedScenario as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      const config: ScenarioGenerationConfig = {
        userId: 'test-user',
        templateId: 'test-template'
      };

      // Act & Assert
      await expect(service.generateScenario(config))
        .rejects
        .toThrow('Failed to generate scenario: Database error');
    });
  });
});