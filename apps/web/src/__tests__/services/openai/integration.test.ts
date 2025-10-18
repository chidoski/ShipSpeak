/**
 * OpenAI Service Integration Tests for ShipSpeak
 * End-to-end workflow testing with complete audio processing pipeline
 */

import {
  OpenAIServiceFactory,
  analyzeMeeting,
  generatePracticeModules,
  transcribeAudio,
  processCompleteWorkflow
} from '@/lib/services/openai'
import { OpenAIConfig } from '@/lib/services/openai/types'
import { setupOpenAIMocks, generateMockTranscription, generateMockMeetingAnalysis, TEST_SCENARIOS } from '@/__tests__/mocks/openai'
import { createSecureTestFile } from '@/__tests__/utils/security-helpers'
import { measureAsyncPerformance } from '@/__tests__/utils/test-helpers'

// Mock the OpenAI client
const mockCompletionsCreate = jest.fn()
const mockTranscriptionsCreate = jest.fn()

// Combined mock object for easy access in tests
const mockOpenAI = {
  generateChatCompletion: mockCompletionsCreate,
  createTranscription: mockTranscriptionsCreate
}

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCompletionsCreate
      }
    },
    audio: {
      transcriptions: {
        create: mockTranscriptionsCreate
      }
    }
  }))
})

describe('OpenAI Service Integration', () => {
  let mockConfig: OpenAIConfig

  beforeEach(() => {
    mockConfig = {
      apiKey: 'test-api-key',
      baseURL: 'https://api.openai.com/v1',
      timeout: 30000,
      maxRetries: 3
    }

    // Clear mocks
    mockCompletionsCreate.mockClear()
    mockTranscriptionsCreate.mockClear()
  })

  afterEach(() => {
    OpenAIServiceFactory.resetInstances()
    jest.clearAllMocks()
  })

  // =============================================================================
  // SERVICE FACTORY TESTS
  // =============================================================================

  describe('OpenAIServiceFactory', () => {
    it('should create and reuse GPT service instances', () => {
      const service1 = OpenAIServiceFactory.getGPTService(mockConfig)
      const service2 = OpenAIServiceFactory.getGPTService(mockConfig)
      
      expect(service1).toBe(service2) // Should be the same instance
    })

    it('should create and reuse Whisper service instances', () => {
      const service1 = OpenAIServiceFactory.getWhisperService(mockConfig)
      const service2 = OpenAIServiceFactory.getWhisperService(mockConfig)
      
      expect(service1).toBe(service2) // Should be the same instance
    })

    it('should create new instances when config changes', () => {
      const service1 = OpenAIServiceFactory.getGPTService(mockConfig)
      
      const newConfig = { ...mockConfig, timeout: 60000 }
      const service2 = OpenAIServiceFactory.getGPTService(newConfig)
      
      expect(service1).not.toBe(service2) // Should be different instances
    })

    it('should reset instances correctly', () => {
      const service1 = OpenAIServiceFactory.getGPTService(mockConfig)
      OpenAIServiceFactory.resetInstances()
      const service2 = OpenAIServiceFactory.getGPTService(mockConfig)
      
      expect(service1).not.toBe(service2)
    })

    it('should validate environment configuration', () => {
      // Mock environment variables
      const originalEnv = process.env.OPENAI_API_KEY
      process.env.OPENAI_API_KEY = 'sk-test-key'

      const validation = OpenAIServiceFactory.validateEnvironment()
      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)

      // Restore original env
      process.env.OPENAI_API_KEY = originalEnv
    })

    it('should detect invalid environment configuration', () => {
      const originalEnv = process.env.OPENAI_API_KEY
      delete process.env.OPENAI_API_KEY

      const validation = OpenAIServiceFactory.validateEnvironment()
      expect(validation.valid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)

      // Restore original env
      process.env.OPENAI_API_KEY = originalEnv
    })
  })

  // =============================================================================
  // CONVENIENCE FUNCTION TESTS
  // =============================================================================

  describe('Convenience Functions', () => {
    it('should analyze meeting using convenience function', async () => {
      const mockAnalysis = TEST_SCENARIOS.AVERAGE_PERFORMANCE.analysis

      mockCompletionsCreate.mockResolvedValueOnce({
        id: 'test-completion',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: JSON.stringify(mockAnalysis)
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 500, completion_tokens: 300, total_tokens: 800 }
      })

      const result = await analyzeMeeting({
        transcription: 'This is a test meeting transcript with communication patterns that demonstrates various speaking styles and contains enough content to meet the minimum requirements for processing.',
        userRole: 'pm',
        analysisDepth: 'detailed'
      }, mockConfig)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.usage).toBeDefined()
    })

    it('should generate practice modules using convenience function', async () => {
      const mockModules = [{
        id: 'module-1',
        type: 'filler_word_reduction' as const,
        title: 'Test Module',
        description: 'Test description',
        estimatedDuration: 600,
        difficulty: 'intermediate' as const,
        exercises: [],
        sourceContent: {
          originalQuote: 'test quote',
          contextualBackground: 'test context',
          targetImprovement: 'test improvement'
        },
        successCriteria: [],
        evaluationRubric: []
      }]

      mockCompletionsCreate.mockResolvedValueOnce({
        id: 'test-completion',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: JSON.stringify({ modules: mockModules })
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 600, completion_tokens: 400, total_tokens: 1000 }
      })

      const result = await generatePracticeModules({
        meetingAnalysis: TEST_SCENARIOS.NEEDS_IMPROVEMENT.analysis,
        userContent: {
          originalTranscript: 'Test transcript',
          keyQuotes: ['Test quote'],
          topicContext: 'Test context'
        }
      }, mockConfig)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should transcribe audio using convenience function', async () => {
      const audioFile = createSecureTestFile({
        name: 'test-meeting.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const mockTranscription = generateMockTranscription({
        duration: 1800,
        includeSegments: true
      })

      mockTranscriptionsCreate.mockResolvedValueOnce(mockTranscription)

      const result = await transcribeAudio({
        audioFile,
        responseFormat: 'verbose_json'
      }, mockConfig)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.text).toBeTruthy()
    })
  })

  // =============================================================================
  // COMPLETE WORKFLOW TESTS
  // =============================================================================

  describe('Complete Workflow', () => {
    it('should process complete workflow successfully', async () => {
      const audioFile = createSecureTestFile({
        name: 'complete-meeting.mp3',
        type: 'audio/mpeg',
        size: 2 * 1024 * 1024
      })

      // Mock transcription response
      const mockTranscription = generateMockTranscription({
        duration: 1800,
        hasFillerWords: true,
        includeSegments: true
      })

      // Mock analysis response
      const mockAnalysis = TEST_SCENARIOS.NEEDS_IMPROVEMENT.analysis

      // Mock practice modules response
      const mockModules = [{
        id: 'module-1',
        type: 'filler_word_reduction' as const,
        title: 'Reduce Filler Words',
        description: 'Practice reducing um and uh',
        estimatedDuration: 600,
        difficulty: 'intermediate' as const,
        exercises: [{
          id: 'exercise-1',
          type: 'delivery_practice' as const,
          prompt: 'Practice your key points without filler words',
          userContent: 'I think we should maybe consider this feature',
          instructions: ['Use pauses instead of fillers'],
          timeLimit: 300,
          expectedOutcome: 'Clear delivery'
        }],
        sourceContent: {
          originalQuote: 'I think we should maybe consider this feature',
          contextualBackground: 'Product planning meeting',
          targetImprovement: 'Remove hesitant language'
        },
        successCriteria: ['No filler words'],
        evaluationRubric: []
      }]

      // Setup mocks in sequence
      mockTranscriptionsCreate.mockResolvedValueOnce(mockTranscription)
      mockCompletionsCreate
        .mockResolvedValueOnce({
          id: 'analysis-completion',
          object: 'chat.completion',
          created: Date.now(),
          model: 'gpt-4',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: JSON.stringify(mockAnalysis)
            },
            finish_reason: 'stop'
          }],
          usage: { prompt_tokens: 500, completion_tokens: 300, total_tokens: 800 }
        })
        .mockResolvedValueOnce({
          id: 'modules-completion',
          object: 'chat.completion',
          created: Date.now(),
          model: 'gpt-4',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: JSON.stringify({ modules: mockModules })
            },
            finish_reason: 'stop'
          }],
          usage: { prompt_tokens: 600, completion_tokens: 400, total_tokens: 1000 }
        })

      const result = await processCompleteWorkflow(audioFile, {
        userRole: 'pm',
        meetingType: 'review',
        analysisDepth: 'detailed',
        focusAreas: ['filler_words'],
        difficultyLevel: 'intermediate'
      }, mockConfig)

      expect(result.transcription.success).toBe(true)
      expect(result.analysis.success).toBe(true)
      expect(result.modules.success).toBe(true)

      expect(result.transcription.data?.text).toBeTruthy()
      expect(result.analysis.data?.fillerWordsPerMinute).toBeDefined()
      expect(result.modules.data).toHaveLength(1)
    })

    it('should handle transcription failure in workflow', async () => {
      const audioFile = createSecureTestFile({
        name: 'bad-audio.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const transcriptionError = new Error('Transcription failed')
      mockTranscriptionsCreate.mockRejectedValueOnce(transcriptionError)

      const result = await processCompleteWorkflow(audioFile, {}, mockConfig)

      expect(result.transcription.success).toBe(false)
      expect(result.analysis.success).toBe(false)
      expect(result.modules.success).toBe(false)
      expect(result.analysis.error).toContain('Transcription failed')
    })

    it('should handle analysis failure in workflow', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const mockTranscription = generateMockTranscription({ duration: 1800 })
      mockTranscriptionsCreate.mockResolvedValueOnce(mockTranscription)

      const analysisError = new Error('Analysis failed')
      mockCompletionsCreate.mockRejectedValueOnce(analysisError)

      const result = await processCompleteWorkflow(audioFile, {}, mockConfig)

      expect(result.transcription.success).toBe(true)
      expect(result.analysis.success).toBe(false)
      expect(result.modules.success).toBe(false)
      expect(result.modules.error).toContain('Analysis failed')
    })
  })

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance Tests', () => {
    it('should complete analysis within performance threshold', async () => {
      const mockAnalysis = TEST_SCENARIOS.AVERAGE_PERFORMANCE.analysis

      mockCompletionsCreate.mockResolvedValueOnce({
        id: 'test-completion',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: JSON.stringify(mockAnalysis)
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 500, completion_tokens: 300, total_tokens: 800 }
      })

      const performance = await measureAsyncPerformance(async () => {
        return await analyzeMeeting({
          transcription: 'This is a performance test transcript with adequate length for testing and contains enough content to meet the minimum requirements for processing.',
          userRole: 'pm'
        }, mockConfig)
      })

      expect(performance.duration).toBeLessThan(5000) // 5 seconds
      expect(performance.memoryUsage?.heapUsed).toBeLessThan(50 * 1024 * 1024) // 50MB
    })

    it('should handle concurrent requests efficiently', async () => {
      const mockAnalysis = TEST_SCENARIOS.AVERAGE_PERFORMANCE.analysis

      // Mock multiple responses
      mockCompletionsCreate.mockResolvedValue({
        id: 'test-completion',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: JSON.stringify(mockAnalysis)
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 500, completion_tokens: 300, total_tokens: 800 }
      })

      const requests = Array.from({ length: 5 }, (_, i) => 
        analyzeMeeting({
          transcription: `Test transcript ${i} for concurrent testing with adequate length and sufficient content to meet the minimum requirements for processing and analysis.`,
          userRole: 'pm'
        }, mockConfig)
      )

      const performance = await measureAsyncPerformance(async () => {
        return await Promise.all(requests)
      })

      const results = performance.result
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result.success).toBe(true)
      })

      expect(performance.duration).toBeLessThan(10000) // 10 seconds for all
    })
  })

  // =============================================================================
  // ERROR RECOVERY TESTS
  // =============================================================================

  describe('Error Recovery', () => {
    it('should handle failures gracefully', async () => {
      // Mock a failure
      mockCompletionsCreate.mockRejectedValueOnce(new Error('Network timeout'))

      const result = await analyzeMeeting({
        transcription: 'Test transcript for error handling that contains enough content to meet the minimum requirements for processing.',
        userRole: 'pm'
      }, mockConfig)

      // Service should handle errors gracefully and return success: false
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(mockCompletionsCreate).toHaveBeenCalledTimes(1)
    })

    it('should maintain service instances across errors', async () => {
      const service1 = OpenAIServiceFactory.getGPTService(mockConfig)

      // Simulate an error
      mockCompletionsCreate.mockRejectedValueOnce(new Error('Test error'))

      await analyzeMeeting({
        transcription: 'Test transcript',
        userRole: 'pm'
      }, mockConfig)

      const service2 = OpenAIServiceFactory.getGPTService(mockConfig)
      expect(service1).toBe(service2) // Should maintain same instance
    })
  })
})