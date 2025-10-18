/**
 * Whisper Service Tests for ShipSpeak
 * Comprehensive testing using existing mock framework
 */

import { WhisperService } from '@/lib/services/openai/whisper-service'
import { OpenAIConfig, TranscriptionRequest } from '@/lib/services/openai/types'
import { MockOpenAIService, setupOpenAIMocks, generateMockTranscription } from '../../mocks/openai'
import { createSecureTestFile } from '../../utils/security-helpers'

// Mock the OpenAI client
const mockTranscriptionsCreate = jest.fn()

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    audio: {
      transcriptions: {
        create: mockTranscriptionsCreate
      }
    }
  }))
})

describe('WhisperService', () => {
  let whisperService: WhisperService
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
    whisperService = new WhisperService(mockConfig)

    // Clear mocks
    mockTranscriptionsCreate.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(whisperService).toBeInstanceOf(WhisperService)
    })

    it('should handle minimal configuration', () => {
      const minimalConfig: OpenAIConfig = { apiKey: 'test-key' }
      const service = new WhisperService(minimalConfig)
      expect(service).toBeInstanceOf(WhisperService)
    })
  })

  // =============================================================================
  // TRANSCRIPTION TESTS
  // =============================================================================

  describe('transcribeAudio', () => {
    it('should successfully transcribe a valid audio file', async () => {
      // Create a mock audio file
      const audioFile = createSecureTestFile({
        name: 'test-meeting.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024 // 1MB
      })

      // Mock Whisper response
      const mockTranscription = generateMockTranscription({
        duration: 1800,
        hasFillerWords: true,
        includeSegments: true
      })

      mockTranscriptionsCreate.mockResolvedValueOnce(mockTranscription)

      const request: TranscriptionRequest = {
        audioFile,
        model: 'whisper-1',
        responseFormat: 'verbose_json',
        timestampGranularities: ['segment']
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.text).toBeTruthy()
      expect(result.data?.segments).toBeDefined()
      expect(result.usage).toBeDefined()
    })

    it('should handle text-only response format', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 512 * 1024
      })

      // Mock text-only response
      const textResponse = 'This is a simple text transcription'
      mockTranscriptionsCreate.mockResolvedValueOnce(textResponse)

      const request: TranscriptionRequest = {
        audioFile,
        responseFormat: 'text'
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(true)
      expect(result.data?.text).toBe(textResponse)
      expect(result.data?.segments).toBeUndefined()
      expect(result.data?.words).toBeUndefined()
    })

    it('should handle verbose JSON with word timestamps', async () => {
      const audioFile = createSecureTestFile({
        name: 'detailed-meeting.wav',
        type: 'audio/wav',
        size: 2 * 1024 * 1024
      })

      const mockResponse = {
        text: 'Hello everyone, welcome to our product review meeting.',
        language: 'en',
        duration: 1200,
        segments: [
          {
            id: 0,
            seek: 0,
            start: 0.0,
            end: 5.0,
            text: 'Hello everyone, welcome to our product review meeting.',
            tokens: [1234, 5678],
            temperature: 0.0,
            avg_logprob: -0.5,
            compression_ratio: 1.8,
            no_speech_prob: 0.1
          }
        ],
        words: [
          { word: 'Hello', start: 0.0, end: 0.5 },
          { word: 'everyone', start: 0.6, end: 1.2 }
        ]
      }

      mockTranscriptionsCreate.mockResolvedValueOnce(mockResponse)

      const request: TranscriptionRequest = {
        audioFile,
        responseFormat: 'verbose_json',
        timestampGranularities: ['segment', 'word']
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(true)
      expect(result.data?.text).toBe(mockResponse.text)
      expect(result.data?.segments).toHaveLength(1)
      expect(result.data?.words).toHaveLength(2)
      expect(result.data?.duration).toBe(1200)
    })

    it('should handle language detection', async () => {
      const audioFile = createSecureTestFile({
        name: 'spanish-meeting.m4a',
        type: 'audio/m4a',
        size: 1.5 * 1024 * 1024
      })

      const mockResponse = {
        text: 'Hola a todos, bienvenidos a nuestra reunión.',
        language: 'es',
        duration: 900
      }

      mockTranscriptionsCreate.mockResolvedValueOnce(mockResponse)

      const request: TranscriptionRequest = {
        audioFile,
        language: 'es'
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(true)
      expect(result.data?.language).toBe('es')
      expect(result.data?.text).toContain('Hola')
    })
  })

  // =============================================================================
  // VALIDATION TESTS
  // =============================================================================

  describe('Audio File Validation', () => {
    it('should reject files that are too large', async () => {
      const largeFile = createSecureTestFile({
        name: 'huge-meeting.mp3',
        type: 'audio/mpeg',
        size: 30 * 1024 * 1024 // 30MB - exceeds 25MB limit
      })

      const request: TranscriptionRequest = {
        audioFile: largeFile
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('File size')
      expect(result.error).toContain('exceeds maximum')
    })

    it('should reject unsupported file formats', async () => {
      const unsupportedFile = createSecureTestFile({
        name: 'document.txt',
        type: 'text/plain',
        size: 1024
      })

      const request: TranscriptionRequest = {
        audioFile: unsupportedFile
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unsupported file format')
    })

    it('should accept all supported audio formats', async () => {
      const supportedFormats = [
        { name: 'test.mp3', type: 'audio/mpeg' },
        { name: 'test.wav', type: 'audio/wav' },
        { name: 'test.m4a', type: 'audio/m4a' },
        { name: 'test.webm', type: 'audio/webm' },
        { name: 'test.mp4', type: 'video/mp4' }
      ]

      for (const format of supportedFormats) {
        const audioFile = createSecureTestFile({
          name: format.name,
          type: format.type,
          size: 1024 * 1024
        })

        mockTranscriptionsCreate.mockResolvedValueOnce(
          generateMockTranscription({ duration: 600 })
        )

        const request: TranscriptionRequest = { audioFile }
        const result = await whisperService.transcribeAudio(request)

        expect(result.success).toBe(true)
      }
    })

    it('should validate MIME types correctly', async () => {
      const invalidMimeFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'application/octet-stream', // Invalid MIME type
        size: 1024 * 1024
      })

      const request: TranscriptionRequest = {
        audioFile: invalidMimeFile
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid MIME type')
    })

    it('should handle Buffer input', async () => {
      const audioBuffer = Buffer.alloc(1024 * 1024) // 1MB buffer
      
      mockTranscriptionsCreate.mockResolvedValueOnce(
        generateMockTranscription({ duration: 300 })
      )

      const request: TranscriptionRequest = {
        audioFile: audioBuffer
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should reject oversized Buffer input', async () => {
      const largeBuffer = Buffer.alloc(30 * 1024 * 1024) // 30MB

      const request: TranscriptionRequest = {
        audioFile: largeBuffer
      }

      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Buffer size')
    })
  })

  // =============================================================================
  // CHUNKED TRANSCRIPTION TESTS
  // =============================================================================

  describe('transcribeAudioInChunks', () => {
    it('should handle chunked transcription for large files', async () => {
      const largeFile = createSecureTestFile({
        name: 'long-meeting.mp3',
        type: 'audio/mpeg',
        size: 20 * 1024 * 1024 // 20MB
      })

      mockTranscriptionsCreate.mockResolvedValueOnce(
        generateMockTranscription({ duration: 3600, includeSegments: true })
      )

      const result = await whisperService.transcribeAudioInChunks(largeFile, {
        chunkSizeMs: 300000, // 5 minutes
        language: 'en'
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should reject invalid files in chunked transcription', async () => {
      const invalidFile = createSecureTestFile({
        name: 'invalid.txt',
        type: 'text/plain',
        size: 1024
      })

      const result = await whisperService.transcribeAudioInChunks(invalidFile)

      expect(result.success).toBe(false)
      expect(result.error).toContain('validation failed')
    })
  })

  // =============================================================================
  // QUALITY ANALYSIS TESTS
  // =============================================================================

  describe('analyzeTranscriptionQuality', () => {
    it('should analyze high-quality transcription', async () => {
      const highQualityTranscription = {
        text: 'This is a clear and well-structured meeting transcript with excellent audio quality.',
        duration: 1800,
        segments: [
          {
            id: 0,
            seek: 0,
            start: 0,
            end: 5,
            text: 'This is a clear and well-structured meeting transcript',
            tokens: [1, 2, 3],
            temperature: 0.0,
            avgLogprob: -0.2,
            compressionRatio: 2.1,
            noSpeechProb: 0.05
          }
        ]
      }

      const analysis = await whisperService.analyzeTranscriptionQuality(highQualityTranscription)

      expect(analysis.qualityScore).toBeGreaterThan(80)
      expect(analysis.confidence).toBeGreaterThan(80)
      expect(analysis.issues).toHaveLength(0)
    })

    it('should detect poor quality transcription', async () => {
      const poorQualityTranscription = {
        text: 'um uh this is a this is a unclear transcript',
        duration: 300,
        segments: [
          {
            id: 0,
            seek: 0,
            start: 0,
            end: 1,
            text: 'um',
            tokens: [1],
            temperature: 0.5,
            avgLogprob: -1.5,
            compressionRatio: 1.2,
            noSpeechProb: 0.8
          },
          {
            id: 1,
            seek: 100,
            start: 1,
            end: 2,
            text: 'uh',
            tokens: [2],
            temperature: 0.5,
            avgLogprob: -1.5,
            compressionRatio: 1.2,
            noSpeechProb: 0.8
          }
        ]
      }

      const analysis = await whisperService.analyzeTranscriptionQuality(poorQualityTranscription)

      expect(analysis.qualityScore).toBeLessThan(70)
      expect(analysis.confidence).toBeLessThan(70)
      expect(analysis.issues.length).toBeGreaterThan(0)
      expect(analysis.recommendedActions.length).toBeGreaterThan(0)
    })

    it('should detect very short transcription', async () => {
      const shortTranscription = {
        text: 'Short',
        duration: 60
      }

      const analysis = await whisperService.analyzeTranscriptionQuality(shortTranscription)

      expect(analysis.issues).toContain('Very short transcription')
      expect(analysis.recommendedActions).toContain('Ensure audio contains clear speech')
    })

    it('should detect repeated patterns', async () => {
      const repeatedTranscription = {
        text: 'We need to we need to we need to implement this feature',
        duration: 300
      }

      const analysis = await whisperService.analyzeTranscriptionQuality(repeatedTranscription)

      expect(analysis.issues).toContain('Repeated patterns detected')
    })
  })

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle quota exceeded errors', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const quotaError = new Error('Quota exceeded')
      quotaError.error = { type: 'insufficient_quota' }
      
      mockTranscriptionsCreate.mockRejectedValueOnce(quotaError)

      const request: TranscriptionRequest = { audioFile }
      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('quota exceeded')
    })

    it('should handle file size limit errors', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const sizeError = new Error('File too large')
      sizeError.status = 413
      
      mockTranscriptionsCreate.mockRejectedValueOnce(sizeError)

      const request: TranscriptionRequest = { audioFile }
      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('too large')
    })

    it('should handle authentication errors', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const authError = new Error('Unauthorized')
      authError.status = 401
      
      mockTranscriptionsCreate.mockRejectedValueOnce(authError)

      const request: TranscriptionRequest = { audioFile }
      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid OpenAI API key')
    })

    it('should handle rate limit errors', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const rateLimitError = new Error('Rate limited')
      rateLimitError.status = 429
      
      mockTranscriptionsCreate.mockRejectedValueOnce(rateLimitError)

      const request: TranscriptionRequest = { audioFile }
      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limit exceeded')
    })

    it('should handle file-related invalid request errors', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const fileError = new Error('Invalid file')
      fileError.error = { 
        type: 'invalid_request_error',
        message: 'Invalid file format provided'
      }
      
      mockTranscriptionsCreate.mockRejectedValueOnce(fileError)

      const request: TranscriptionRequest = { audioFile }
      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid audio file')
    })

    it('should handle generic errors', async () => {
      const audioFile = createSecureTestFile({
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024
      })

      const genericError = new Error('Something went wrong')
      
      mockTranscriptionsCreate.mockRejectedValueOnce(genericError)

      const request: TranscriptionRequest = { audioFile }
      const result = await whisperService.transcribeAudio(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Something went wrong')
    })
  })
})