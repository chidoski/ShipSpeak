/**
 * GPT Service Tests for ShipSpeak
 * Comprehensive testing using existing mock framework
 */

import { GPTService } from '@/lib/services/openai/gpt-service'
import { OpenAIConfig, MeetingAnalysisRequest, PracticeModuleRequest } from '@/lib/services/openai/types'
import { MockOpenAIService, setupOpenAIMocks, TEST_SCENARIOS } from '@/__tests__/mocks/openai'

// Mock the OpenAI client
const mockCompletionsCreate = jest.fn()

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCompletionsCreate
      }
    }
  }))
})

describe('GPTService', () => {
  let gptService: GPTService
  let mockConfig: OpenAIConfig

  beforeEach(() => {
    // Setup mock configuration
    mockConfig = {
      apiKey: 'test-api-key',
      baseURL: 'https://api.openai.com/v1',
      timeout: 30000,
      maxRetries: 3
    }

    // Create service instance
    gptService = new GPTService(mockConfig)

    // Clear mocks
    mockCompletionsCreate.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(gptService).toBeInstanceOf(GPTService)
    })

    it('should handle missing optional configuration', () => {
      const minimalConfig: OpenAIConfig = { apiKey: 'test-key' }
      const service = new GPTService(minimalConfig)
      expect(service).toBeInstanceOf(GPTService)
    })
  })

  // =============================================================================
  // MEETING ANALYSIS TESTS
  // =============================================================================

  describe('analyzeMeeting', () => {
    it('should successfully analyze a meeting with detailed analysis', async () => {
      // Mock OpenAI response with proper analysis structure
      const mockAnalysis = {
        fillerWordsPerMinute: 3.5,
        confidenceScore: 75,
        speakingPace: 70,
        structureScore: 80,
        executivePresenceScore: 72,
        communicationPatterns: {
          fillerWords: [{word: 'um', count: 2, timestamps: [10, 25]}],
          sentenceStructure: 'mixed',
          tonality: 'neutral',
          clarityScore: 75
        },
        strategicThinking: {
          frameworkUsage: ['SWOT'],
          stakeholderAwareness: 70,
          businessImpactClarity: 75,
          recommendationStrength: 80
        },
        recommendations: ['Practice pause techniques'],
        keyInsights: ['Good strategic thinking'],
        improvementAreas: [],
        strengthAreas: ['Clear communication']
      }
      
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
        usage: {
          prompt_tokens: 500,
          completion_tokens: 300,
          total_tokens: 800
        }
      })

      const request: MeetingAnalysisRequest = {
        transcription: 'This is a test meeting transcript with some filler words like um and uh. We discussed the product roadmap and user feedback. The engagement metrics show promising results. We need to prioritize the mobile experience improvements based on user research findings.',
        meetingContext: {
          duration: 1800,
          meetingType: 'review'
        },
        userRole: 'pm',
        analysisDepth: 'detailed'
      }

      const result = await gptService.analyzeMeeting(request)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.fillerWordsPerMinute).toBeGreaterThanOrEqual(0)
      expect(result.data?.confidenceScore).toBeGreaterThanOrEqual(0)
      expect(result.data?.confidenceScore).toBeLessThanOrEqual(100)
      expect(result.usage).toBeDefined()
    })

    it('should handle validation errors for invalid input', async () => {
      const request: MeetingAnalysisRequest = {
        transcription: '', // Empty transcription should fail validation
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Validation failed')
    })

    it('should handle short transcriptions', async () => {
      const request: MeetingAnalysisRequest = {
        transcription: 'Too short', // Very short transcription
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('too short')
    })

    it('should handle extremely long transcriptions', async () => {
      const longTranscription = 'a'.repeat(60000) // Exceeds max length
      const request: MeetingAnalysisRequest = {
        transcription: longTranscription,
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('too long')
    })

    it('should provide fallback analysis when JSON parsing fails', async () => {
      // Mock invalid JSON response
      mockCompletionsCreate.mockResolvedValueOnce({
        id: 'test-completion',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Invalid JSON response'
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 }
      })

      const request: MeetingAnalysisRequest = {
        transcription: 'Valid meeting transcript for testing fallback behavior. This transcript needs to be long enough to pass validation which requires at least 100 characters. We discussed strategic initiatives and market opportunities.',
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.confidenceScore).toBe(70) // Fallback default
    })

    it('should use quick analysis model for basic depth', async () => {
      const mockAnalysis = {
        fillerWordsPerMinute: 1.5,
        confidenceScore: 90,
        speakingPace: 85,
        structureScore: 88,
        executivePresenceScore: 92,
        communicationPatterns: {
          fillerWords: [],
          sentenceStructure: 'answer_first',
          tonality: 'confident',
          clarityScore: 90
        },
        strategicThinking: {
          frameworkUsage: ['STAR', 'SWOT'],
          stakeholderAwareness: 85,
          businessImpactClarity: 90,
          recommendationStrength: 88
        },
        recommendations: ['Maintain current communication style'],
        keyInsights: ['Excellent executive presence'],
        improvementAreas: [],
        strengthAreas: ['Clear structure', 'Confident delivery']
      }
      
      mockCompletionsCreate.mockResolvedValueOnce({
        id: 'test-completion',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-3.5-turbo', // Should use quick analysis model
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: JSON.stringify(mockAnalysis)
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 200, completion_tokens: 150, total_tokens: 350 }
      })

      const request: MeetingAnalysisRequest = {
        transcription: 'Test meeting transcript for basic analysis. This transcript needs to meet the minimum length requirement of 100 characters for validation. We covered product strategy and team alignment.',
        analysisDepth: 'basic',
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })

  // =============================================================================
  // PRACTICE MODULE GENERATION TESTS
  // =============================================================================

  describe('generatePracticeModules', () => {
    it('should generate practice modules based on analysis', async () => {
      const mockModules = [
        {
          id: 'module-1',
          type: 'filler_word_reduction',
          title: 'Reducing Filler Words',
          description: 'Practice eliminating filler words',
          estimatedDuration: 600,
          difficulty: 'intermediate',
          exercises: [
            {
              id: 'exercise-1',
              type: 'delivery_practice',
              prompt: 'Practice your recommendation without filler words',
              userContent: 'I think we should maybe consider the new feature',
              instructions: ['Use strategic pauses', 'Speak with confidence'],
              timeLimit: 300,
              expectedOutcome: 'Clear delivery without filler words'
            }
          ],
          sourceContent: {
            originalQuote: 'I think we should maybe consider the new feature',
            contextualBackground: 'Product review meeting',
            targetImprovement: 'Remove hesitant language'
          },
          successCriteria: ['No filler words', 'Confident delivery'],
          evaluationRubric: [
            { metric: 'Clarity', description: 'Clear communication', weight: 50, targetScore: 80 }
          ]
        }
      ]

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

      const mockAnalysis = {
        fillerWordsPerMinute: 6,
        confidenceScore: 60,
        speakingPace: 70,
        structureScore: 65,
        executivePresenceScore: 58,
        communicationPatterns: {
          fillerWords: [{word: 'um', count: 8, timestamps: [5, 12, 18]}],
          sentenceStructure: 'buried_lede',
          tonality: 'hesitant',
          clarityScore: 60
        },
        strategicThinking: {
          frameworkUsage: [],
          stakeholderAwareness: 55,
          businessImpactClarity: 60,
          recommendationStrength: 50
        },
        recommendations: ['Practice pause techniques', 'Use more assertive language'],
        keyInsights: ['Clear improvement opportunities identified'],
        improvementAreas: ['Filler word reduction', 'Executive presence'],
        strengthAreas: []
      }

      const request: PracticeModuleRequest = {
        meetingAnalysis: mockAnalysis,
        userContent: {
          originalTranscript: 'Meeting transcript with filler words um and uh.',
          keyQuotes: ['I think we should maybe consider'],
          topicContext: 'Product planning'
        },
        userPreferences: {
          focusAreas: ['filler_words'],
          difficultyLevel: 'intermediate',
          timeConstraint: 15
        }
      }

      const result = await gptService.generatePracticeModules(request)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data!.length).toBeGreaterThan(0)
      expect(result.data![0].exercises).toBeDefined()
      expect(result.data![0].sourceContent).toBeDefined()
    })

    it('should handle empty modules response gracefully', async () => {
      mockCompletionsCreate.mockResolvedValueOnce({
        id: 'test-completion',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Invalid JSON'
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 }
      })

      const request: PracticeModuleRequest = {
        meetingAnalysis: TEST_SCENARIOS.PERFECT_MEETING.analysis,
        userContent: {
          originalTranscript: 'Perfect meeting transcript.',
          keyQuotes: [],
          topicContext: 'Strategy'
        }
      }

      const result = await gptService.generatePracticeModules(request)

      expect(result.success).toBe(true)
      expect(result.data).toEqual([]) // Should return empty array
    })
  })

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle quota exceeded errors', async () => {
      const quotaError = new Error('Quota exceeded')
      quotaError.error = { type: 'insufficient_quota' }
      
      mockCompletionsCreate.mockRejectedValueOnce(quotaError)

      const request: MeetingAnalysisRequest = {
        transcription: 'This is a longer test transcript that meets the minimum character requirements for validation and should trigger the expected error handling behavior.',
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('OpenAI quota exceeded')
    })

    it('should handle rate limit errors', async () => {
      const rateLimitError = new Error('Rate limited')
      rateLimitError.status = 429
      
      mockCompletionsCreate.mockRejectedValueOnce(rateLimitError)

      const request: MeetingAnalysisRequest = {
        transcription: 'This is a longer test transcript that meets the minimum character requirements for validation and should trigger the expected error handling behavior.',
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limit exceeded')
    })

    it('should handle authentication errors', async () => {
      const authError = new Error('Unauthorized')
      authError.status = 401
      
      mockCompletionsCreate.mockRejectedValueOnce(authError)

      const request: MeetingAnalysisRequest = {
        transcription: 'This is a longer test transcript that meets the minimum character requirements for validation and should trigger the expected error handling behavior.',
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid OpenAI API key')
    })

    it('should handle invalid request errors', async () => {
      const invalidError = new Error('Invalid request')
      invalidError.error = { type: 'invalid_request_error' }
      
      mockCompletionsCreate.mockRejectedValueOnce(invalidError)

      const request: MeetingAnalysisRequest = {
        transcription: 'This is a longer test transcript that meets the minimum character requirements for validation and should trigger the expected error handling behavior.',
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid request to OpenAI API')
    })

    it('should handle generic errors', async () => {
      const genericError = new Error('Something went wrong')
      
      mockCompletionsCreate.mockRejectedValueOnce(genericError)

      const request: MeetingAnalysisRequest = {
        transcription: 'This is a longer test transcript that meets the minimum character requirements for validation and should trigger the expected error handling behavior.',
        userRole: 'pm'
      }

      const result = await gptService.analyzeMeeting(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Something went wrong')
    })
  })

  // =============================================================================
  // CHAT COMPLETION TESTS
  // =============================================================================

  describe('generateChatCompletion', () => {
    it('should handle successful chat completion', async () => {
      const mockResponse = {
        id: 'test-id',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: { role: 'assistant', content: 'Test response' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
      }

      mockCompletionsCreate.mockResolvedValueOnce(mockResponse)

      const result = await gptService.generateChatCompletion({
        messages: [{ role: 'user', content: 'Test message' }],
        model: 'gpt-4',
        temperature: 0.7
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.choices[0].message.content).toBe('Test response')
      expect(result.usage?.totalTokens).toBe(15)
    })
  })
})