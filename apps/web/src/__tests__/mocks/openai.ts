/**
 * OpenAI Service Mocks for ShipSpeak TDD Framework
 * Comprehensive mocking for OpenAI API integration testing
 */

import { createSecureTestFile } from '../utils/security-helpers'

// =============================================================================
// MOCK DATA TYPES
// =============================================================================

export interface MockTranscriptionResponse {
  text: string
  segments?: Array<{
    id: number
    seek: number
    start: number
    end: number
    text: string
    tokens: number[]
    temperature: number
    avg_logprob: number
    compression_ratio: number
    no_speech_prob: number
  }>
  language?: string
  duration?: number
}

export interface MockChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: 'assistant' | 'user' | 'system'
      content: string
    }
    finish_reason: 'stop' | 'length' | 'content_filter'
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface MockMeetingAnalysis {
  fillerWordsPerMinute: number
  confidenceScore: number
  speakingPace: number
  structureScore: number
  recommendations: string[]
  keyInsights: string[]
  improvementAreas: string[]
}

export interface MockPracticeModule {
  id: string
  type: 'FILLER_WORD_REDUCTION' | 'EXECUTIVE_PRESENCE' | 'STRATEGIC_NARRATIVE'
  title: string
  description: string
  exercises: Array<{
    id: string
    type: string
    prompt: string
    expectedDuration: number
    rubric: string[]
  }>
  estimatedDuration: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}

// =============================================================================
// REALISTIC MOCK DATA GENERATORS
// =============================================================================

/**
 * Generates realistic transcription responses based on audio characteristics
 */
export const generateMockTranscription = (
  options: {
    duration?: number
    hasFillerWords?: boolean
    speakingPace?: 'slow' | 'normal' | 'fast'
    includeSegments?: boolean
  } = {}
): MockTranscriptionResponse => {
  const {
    duration = 1800, // 30 minutes default
    hasFillerWords = true,
    speakingPace = 'normal',
    includeSegments = false
  } = options

  // Generate realistic meeting content
  const baseTexts = [
    "Thank you everyone for joining today's product review meeting.",
    "Let's start by discussing the user feedback we received this quarter.",
    "Our engagement metrics show a 15% increase in user retention.",
    "I think we should prioritize the mobile experience improvements.",
    "The engineering team has identified some technical challenges.",
    "We need to balance user needs with technical feasibility.",
    "Let's discuss the timeline for the upcoming product launch.",
    "I'd like to get everyone's input on the pricing strategy."
  ]

  let transcript = baseTexts.join(' ')

  // Add filler words based on speaking quality
  if (hasFillerWords) {
    const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually']
    const words = transcript.split(' ')
    const fillerCount = Math.floor(Math.random() * 5) + 3
    
    for (let i = 0; i < fillerCount; i++) {
      const randomFiller = fillerWords[Math.floor(Math.random() * fillerWords.length)]
      const insertPosition = Math.floor(Math.random() * words.length)
      words.splice(insertPosition, 0, randomFiller + ',')
    }
    
    transcript = words.join(' ')
  }

  const response: MockTranscriptionResponse = {
    text: transcript,
    language: 'en',
    duration
  }

  if (includeSegments) {
    // Generate segments for detailed analysis
    const words = transcript.split(' ')
    const segmentSize = Math.floor(words.length / 8) // ~8 segments
    const segments = []

    for (let i = 0; i < 8; i++) {
      const start = i * (duration / 8)
      const end = (i + 1) * (duration / 8)
      const segmentWords = words.slice(i * segmentSize, (i + 1) * segmentSize)
      
      segments.push({
        id: i,
        seek: start * 100,
        start,
        end,
        text: segmentWords.join(' '),
        tokens: segmentWords.map(() => Math.floor(Math.random() * 50000)),
        temperature: 0.2,
        avg_logprob: -0.3 - Math.random() * 0.5,
        compression_ratio: 1.8 + Math.random() * 0.4,
        no_speech_prob: Math.random() * 0.1
      })
    }

    response.segments = segments
  }

  return response
}

/**
 * Generates realistic meeting analysis responses
 */
export const generateMockMeetingAnalysis = (
  transcription: string,
  options: {
    userPerformance?: 'poor' | 'average' | 'good' | 'excellent'
  } = {}
): MockMeetingAnalysis => {
  const { userPerformance = 'average' } = options

  // Analyze transcript for realistic scoring
  const words = transcription.split(' ')
  const fillerWords = words.filter(word => 
    ['um', 'uh', 'like', 'you', 'know', 'so', 'actually'].includes(word.toLowerCase().replace(',', ''))
  )

  const duration = 30 // 30 minutes assumed
  const fillerWordsPerMinute = (fillerWords.length / duration) * 60

  // Generate scores based on performance level
  const performanceMultipliers = {
    poor: { base: 40, variance: 20 },
    average: { base: 70, variance: 15 },
    good: { base: 85, variance: 10 },
    excellent: { base: 95, variance: 5 }
  }

  const multiplier = performanceMultipliers[userPerformance]
  
  const generateScore = () => 
    Math.max(0, Math.min(100, multiplier.base + (Math.random() - 0.5) * multiplier.variance * 2))

  const analysis: MockMeetingAnalysis = {
    fillerWordsPerMinute: Math.max(0, fillerWordsPerMinute + (Math.random() - 0.5) * 2),
    confidenceScore: generateScore(),
    speakingPace: generateScore(),
    structureScore: generateScore(),
    recommendations: [],
    keyInsights: [],
    improvementAreas: []
  }

  // Generate recommendations based on scores
  if (analysis.fillerWordsPerMinute > 5) {
    analysis.recommendations.push("Practice pause techniques to reduce filler words")
    analysis.improvementAreas.push("Filler word reduction")
  }

  if (analysis.confidenceScore < 70) {
    analysis.recommendations.push("Use more assertive language patterns")
    analysis.improvementAreas.push("Executive presence")
  }

  if (analysis.structureScore < 70) {
    analysis.recommendations.push("Lead with recommendations, then provide supporting details")
    analysis.improvementAreas.push("Answer-first structure")
  }

  // Generate positive insights
  if (analysis.confidenceScore > 80) {
    analysis.keyInsights.push("Strong confident delivery throughout the meeting")
  }

  if (analysis.speakingPace > 75) {
    analysis.keyInsights.push("Good pacing allows listeners to follow your thoughts")
  }

  return analysis
}

/**
 * Generates realistic practice modules based on analysis
 */
export const generateMockPracticeModules = (
  analysis: MockMeetingAnalysis,
  options: {
    maxModules?: number
    userLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  } = {}
): MockPracticeModule[] => {
  const { maxModules = 3, userLevel = 'INTERMEDIATE' } = options
  const modules: MockPracticeModule[] = []

  // Generate modules based on improvement areas
  if (analysis.improvementAreas.includes("Filler word reduction") && modules.length < maxModules) {
    modules.push({
      id: `module-${Date.now()}-filler`,
      type: 'FILLER_WORD_REDUCTION',
      title: 'Reducing Filler Words',
      description: 'Practice delivering your key points without filler words using strategic pauses.',
      exercises: [
        {
          id: 'filler-1',
          type: 'pause_practice',
          prompt: 'Deliver your main recommendation from the meeting, pausing for 2 seconds instead of using filler words.',
          expectedDuration: 300,
          rubric: ['Clear pauses', 'No filler words', 'Maintained confidence']
        },
        {
          id: 'filler-2',
          type: 'structured_delivery',
          prompt: 'Present the same recommendation using answer-first structure: conclusion, then supporting points.',
          expectedDuration: 300,
          rubric: ['Answer first', 'Logical flow', 'Concise delivery']
        }
      ],
      estimatedDuration: 600,
      difficulty: userLevel
    })
  }

  if (analysis.improvementAreas.includes("Executive presence") && modules.length < maxModules) {
    modules.push({
      id: `module-${Date.now()}-presence`,
      type: 'EXECUTIVE_PRESENCE',
      title: 'Executive Presence Building',
      description: 'Develop confident language patterns and executive communication style.',
      exercises: [
        {
          id: 'presence-1',
          type: 'confident_language',
          prompt: 'Rephrase your key points using confident language: "I recommend" instead of "I think maybe".',
          expectedDuration: 240,
          rubric: ['Assertive language', 'Clear recommendations', 'Confident tone']
        },
        {
          id: 'presence-2',
          type: 'executive_summary',
          prompt: 'Deliver a 60-second executive summary of your meeting content.',
          expectedDuration: 360,
          rubric: ['Under 60 seconds', 'Key points covered', 'Executive tone']
        }
      ],
      estimatedDuration: 600,
      difficulty: userLevel
    })
  }

  if (analysis.improvementAreas.includes("Answer-first structure") && modules.length < maxModules) {
    modules.push({
      id: `module-${Date.now()}-structure`,
      type: 'STRATEGIC_NARRATIVE',
      title: 'Strategic Communication Structure',
      description: 'Practice leading with recommendations and building compelling narratives.',
      exercises: [
        {
          id: 'structure-1',
          type: 'recommendation_first',
          prompt: 'Start with your recommendation, then provide exactly 3 supporting points.',
          expectedDuration: 300,
          rubric: ['Recommendation first', 'Three clear points', 'Logical structure']
        },
        {
          id: 'structure-2',
          type: 'stakeholder_narrative',
          prompt: 'Present your case from the stakeholder\'s perspective: what they care about most.',
          expectedDuration: 300,
          rubric: ['Stakeholder focus', 'Clear benefits', 'Compelling narrative']
        }
      ],
      estimatedDuration: 600,
      difficulty: userLevel
    })
  }

  return modules
}

// =============================================================================
// MOCK SERVICE IMPLEMENTATIONS
// =============================================================================

/**
 * Mock OpenAI service for testing
 */
export class MockOpenAIService {
  private apiKey: string
  private baseURL: string
  private requestDelay: number

  constructor(options: { apiKey?: string; baseURL?: string; requestDelay?: number } = {}) {
    this.apiKey = options.apiKey || 'mock-api-key'
    this.baseURL = options.baseURL || 'https://api.openai.com/v1'
    this.requestDelay = options.requestDelay || 100
  }

  /**
   * Mock audio transcription
   */
  async transcribeAudio(
    audioFile: File | Buffer,
    options: {
      model?: string
      language?: string
      response_format?: string
      temperature?: number
    } = {}
  ): Promise<MockTranscriptionResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, this.requestDelay))

    // Simulate different scenarios based on file size/type
    let hasFillerWords = true
    let speakingPace: 'slow' | 'normal' | 'fast' = 'normal'

    if (audioFile instanceof File) {
      // Simulate analysis based on file characteristics
      if (audioFile.size < 1024 * 1024) { // Small file = short, good quality
        hasFillerWords = false
      }
      if (audioFile.name.includes('fast')) {
        speakingPace = 'fast'
      }
    }

    return generateMockTranscription({
      hasFillerWords,
      speakingPace,
      includeSegments: options.response_format === 'verbose_json'
    })
  }

  /**
   * Mock chat completion for analysis
   */
  async generateChatCompletion(
    messages: Array<{ role: string; content: string }>,
    options: {
      model?: string
      temperature?: number
      max_tokens?: number
    } = {}
  ): Promise<MockChatCompletionResponse> {
    await new Promise(resolve => setTimeout(resolve, this.requestDelay))

    // Analyze the prompt to generate appropriate response
    const userMessage = messages.find(m => m.role === 'user')?.content || ''
    let responseContent = ''

    if (userMessage.includes('analyze') && userMessage.includes('meeting')) {
      // Generate meeting analysis
      const mockAnalysis = generateMockMeetingAnalysis(userMessage)
      responseContent = JSON.stringify(mockAnalysis)
    } else if (userMessage.includes('generate') && userMessage.includes('module')) {
      // Generate practice modules
      const mockModules = generateMockPracticeModules({
        fillerWordsPerMinute: 6,
        confidenceScore: 65,
        speakingPace: 70,
        structureScore: 60,
        recommendations: [],
        keyInsights: [],
        improvementAreas: ['Filler word reduction', 'Executive presence']
      })
      responseContent = JSON.stringify(mockModules)
    } else {
      // Generic helpful response
      responseContent = "I've analyzed the content and provided recommendations based on the communication patterns."
    }

    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: options.model || 'gpt-4',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: responseContent
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: Math.floor(userMessage.length / 4),
        completion_tokens: Math.floor(responseContent.length / 4),
        total_tokens: Math.floor((userMessage.length + responseContent.length) / 4)
      }
    }
  }

  /**
   * Mock error scenarios
   */
  async simulateError(errorType: 'rate_limit' | 'auth' | 'network' | 'quota'): Promise<never> {
    await new Promise(resolve => setTimeout(resolve, this.requestDelay))

    const errors = {
      rate_limit: new Error('Rate limit exceeded. Please try again later.'),
      auth: new Error('Invalid API key provided.'),
      network: new Error('Network error: Unable to connect to OpenAI servers.'),
      quota: new Error('You have exceeded your quota. Please upgrade your plan.')
    }

    throw errors[errorType]
  }
}

// =============================================================================
// JEST MOCKS
// =============================================================================

/**
 * Jest mock factory for OpenAI service
 */
export const createMockOpenAI = (overrides: Partial<MockOpenAIService> = {}): jest.Mocked<MockOpenAIService> => {
  const mockService = new MockOpenAIService()
  
  return {
    ...mockService,
    transcribeAudio: jest.fn().mockImplementation(mockService.transcribeAudio.bind(mockService)),
    generateChatCompletion: jest.fn().mockImplementation(mockService.generateChatCompletion.bind(mockService)),
    simulateError: jest.fn().mockImplementation(mockService.simulateError.bind(mockService)),
    ...overrides
  } as jest.Mocked<MockOpenAIService>
}

/**
 * Setup function for common OpenAI mocks
 */
export const setupOpenAIMocks = (): {
  mockOpenAI: jest.Mocked<MockOpenAIService>
  resetMocks: () => void
} => {
  const mockOpenAI = createMockOpenAI()

  const resetMocks = () => {
    mockOpenAI.transcribeAudio.mockClear()
    mockOpenAI.generateChatCompletion.mockClear()
    mockOpenAI.simulateError.mockClear()
  }

  return { mockOpenAI, resetMocks }
}

// =============================================================================
// TEST SCENARIOS
// =============================================================================

/**
 * Predefined test scenarios for common use cases
 */
export const TEST_SCENARIOS = {
  PERFECT_MEETING: {
    transcription: generateMockTranscription({ hasFillerWords: false, speakingPace: 'normal' }),
    analysis: generateMockMeetingAnalysis('', { userPerformance: 'excellent' })
  },
  
  NEEDS_IMPROVEMENT: {
    transcription: generateMockTranscription({ hasFillerWords: true, speakingPace: 'fast' }),
    analysis: generateMockMeetingAnalysis('um uh like you know', { userPerformance: 'poor' })
  },
  
  AVERAGE_PERFORMANCE: {
    transcription: generateMockTranscription({ hasFillerWords: true, speakingPace: 'normal' }),
    analysis: generateMockMeetingAnalysis('um so like', { userPerformance: 'average' })
  }
} as const

export default MockOpenAIService

// =============================================================================
// TEST CASES FOR OPENAI MOCKS
// =============================================================================

describe('OpenAI Mock Service', () => {
  let mockOpenAI: MockOpenAIService

  beforeEach(() => {
    mockOpenAI = new MockOpenAIService()
  })

  describe('Mock Data Generation', () => {
    it('should generate realistic transcription data', () => {
      const transcription = generateMockTranscription({
        duration: 1800,
        hasFillerWords: true,
        speakingPace: 'normal'
      })

      expect(transcription.text).toBeDefined()
      expect(transcription.duration).toBe(1800)
      expect(transcription.language).toBe('en')
      expect(transcription.text).toContain('Thank')
    })

    it('should generate meeting analysis based on transcript', () => {
      const transcript = 'um, so like, I think we should um, move forward'
      const analysis = generateMockMeetingAnalysis(transcript, {
        userPerformance: 'poor'
      })

      expect(analysis.fillerWordsPerMinute).toBeGreaterThan(0)
      expect(analysis.confidenceScore).toBeLessThan(70)
      expect(analysis.improvementAreas).toContain('Filler word reduction')
    })

    it('should generate practice modules from analysis', () => {
      const analysis = {
        fillerWordsPerMinute: 8,
        confidenceScore: 60,
        speakingPace: 70,
        structureScore: 55,
        recommendations: [],
        keyInsights: [],
        improvementAreas: ['Filler word reduction', 'Executive presence']
      }

      const modules = generateMockPracticeModules(analysis)
      expect(modules).toHaveLength(2)
      expect(modules[0].type).toBe('FILLER_WORD_REDUCTION')
      expect(modules[1].type).toBe('EXECUTIVE_PRESENCE')
    })
  })

  describe('Mock Service Operations', () => {
    it('should transcribe audio files', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' })
      const result = await mockOpenAI.transcribeAudio(mockFile)

      expect(result.text).toBeDefined()
      expect(result.language).toBe('en')
    })

    it('should generate chat completions', async () => {
      const messages = [{
        role: 'user',
        content: 'analyze this meeting transcript for communication patterns'
      }]

      const result = await mockOpenAI.generateChatCompletion(messages)
      expect(result.choices[0].message.content).toBeDefined()
      expect(result.usage.total_tokens).toBeGreaterThan(0)
    })

    it('should simulate error scenarios', async () => {
      await expect(mockOpenAI.simulateError('rate_limit'))
        .rejects.toThrow('Rate limit exceeded')
      
      await expect(mockOpenAI.simulateError('auth'))
        .rejects.toThrow('Invalid API key')
    })
  })
})