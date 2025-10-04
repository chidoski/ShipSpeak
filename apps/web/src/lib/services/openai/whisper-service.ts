/**
 * Whisper Service for ShipSpeak
 * Handles audio transcription using OpenAI's Whisper API
 */

import OpenAI from 'openai'
import {
  OpenAIConfig,
  ServiceResponse,
  TranscriptionRequest,
  TranscriptionResponse,
  OpenAIServiceError
} from './types'
import { MODEL_CONFIGS, VALIDATION_RULES } from './config'

export class WhisperService {
  private client: OpenAI
  private config: OpenAIConfig

  constructor(config: OpenAIConfig) {
    this.config = config
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      organization: config.organization,
      timeout: config.timeout,
      maxRetries: config.maxRetries
    })
  }

  // =============================================================================
  // CORE TRANSCRIPTION METHOD
  // =============================================================================

  async transcribeAudio(request: TranscriptionRequest): Promise<ServiceResponse<TranscriptionResponse>> {
    // Validate the audio file
    const validation = await this.validateAudioFile(request.audioFile)
    if (!validation.valid) {
      return {
        success: false,
        error: `Audio validation failed: ${validation.errors.join(', ')}`
      }
    }

    try {
      // Prepare the transcription request
      const transcriptionParams = this.buildTranscriptionParams(request)
      
      // Call OpenAI Whisper API
      const response = await this.client.audio.transcriptions.create(transcriptionParams)

      // Process and return the response
      return {
        success: true,
        data: this.processTranscriptionResponse(response, request.responseFormat),
        usage: this.estimateTokenUsage(response)
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // =============================================================================
  // BATCH TRANSCRIPTION (FOR LARGE FILES)
  // =============================================================================

  async transcribeAudioInChunks(
    audioFile: File,
    options: {
      chunkSizeMs?: number
      overlapMs?: number
      language?: string
      model?: string
    } = {}
  ): Promise<ServiceResponse<TranscriptionResponse>> {
    const {
      chunkSizeMs = 300000, // 5 minutes
      overlapMs = 5000,     // 5 seconds
      language,
      model
    } = options

    try {
      // Validate the audio file
      const validation = await this.validateAudioFile(audioFile)
      if (!validation.valid) {
        return {
          success: false,
          error: `Audio validation failed: ${validation.errors.join(', ')}`
        }
      }

      // For now, treat as single file - chunking would require audio processing library
      // This is a placeholder for future implementation with audio splitting
      return await this.transcribeAudio({
        audioFile,
        model: model as 'whisper-1',
        language,
        responseFormat: 'verbose_json',
        timestampGranularities: ['segment', 'word']
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  // =============================================================================
  // VALIDATION HELPERS
  // =============================================================================

  private async validateAudioFile(audioFile: File | Buffer): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (audioFile instanceof File) {
      // File size validation
      if (audioFile.size > VALIDATION_RULES.TRANSCRIPTION.maxFileSize) {
        errors.push(`File size ${Math.round(audioFile.size / 1024 / 1024)}MB exceeds maximum ${VALIDATION_RULES.TRANSCRIPTION.maxFileSize / 1024 / 1024}MB`)
      }

      // File format validation
      const fileExtension = audioFile.name.split('.').pop()?.toLowerCase()
      if (!fileExtension || !VALIDATION_RULES.TRANSCRIPTION.supportedFormats.includes(fileExtension)) {
        errors.push(`Unsupported file format: ${fileExtension}. Supported: ${VALIDATION_RULES.TRANSCRIPTION.supportedFormats.join(', ')}`)
      }

      // Additional validation using file header (basic MIME type check)
      if (audioFile.type && !this.isValidAudioMimeType(audioFile.type)) {
        errors.push(`Invalid MIME type: ${audioFile.type}`)
      }
    } else if (audioFile instanceof Buffer) {
      // Buffer size validation
      if (audioFile.length > VALIDATION_RULES.TRANSCRIPTION.maxFileSize) {
        errors.push(`Buffer size ${Math.round(audioFile.length / 1024 / 1024)}MB exceeds maximum ${VALIDATION_RULES.TRANSCRIPTION.maxFileSize / 1024 / 1024}MB`)
      }
    } else {
      errors.push('Audio file must be a File or Buffer object')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  private isValidAudioMimeType(mimeType: string): boolean {
    const validMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/mp4',
      'audio/m4a',
      'audio/wav',
      'audio/wave',
      'audio/webm',
      'video/mp4', // Sometimes used for .m4a files
      'video/webm'
    ]
    
    return validMimeTypes.includes(mimeType.toLowerCase())
  }

  // =============================================================================
  // REQUEST BUILDING
  // =============================================================================

  private buildTranscriptionParams(request: TranscriptionRequest): any {
    const config = MODEL_CONFIGS.TRANSCRIPTION
    
    return {
      file: request.audioFile,
      model: request.model || config.model,
      language: request.language,
      prompt: request.prompt,
      response_format: request.responseFormat || config.responseFormat,
      temperature: request.temperature ?? config.temperature,
      timestamp_granularities: request.timestampGranularities || config.timestampGranularities
    }
  }

  // =============================================================================
  // RESPONSE PROCESSING
  // =============================================================================

  private processTranscriptionResponse(response: any, responseFormat?: string): TranscriptionResponse {
    // Handle different response formats
    if (responseFormat === 'text') {
      return {
        text: response as string,
        language: undefined,
        duration: undefined,
        segments: undefined,
        words: undefined
      }
    }

    // Handle JSON and verbose JSON responses
    const transcriptionData = typeof response === 'string' ? { text: response } : response

    return {
      text: transcriptionData.text || '',
      language: transcriptionData.language,
      duration: transcriptionData.duration,
      segments: transcriptionData.segments?.map((segment: any) => ({
        id: segment.id,
        seek: segment.seek,
        start: segment.start,
        end: segment.end,
        text: segment.text,
        tokens: segment.tokens || [],
        temperature: segment.temperature || 0,
        avgLogprob: segment.avg_logprob || 0,
        compressionRatio: segment.compression_ratio || 0,
        noSpeechProb: segment.no_speech_prob || 0
      })),
      words: transcriptionData.words?.map((word: any) => ({
        word: word.word,
        start: word.start,
        end: word.end
      }))
    }
  }

  // =============================================================================
  // ANALYSIS HELPERS
  // =============================================================================

  async analyzeTranscriptionQuality(transcription: TranscriptionResponse): Promise<{
    qualityScore: number
    confidence: number
    recommendedActions: string[]
    issues: string[]
  }> {
    const issues: string[] = []
    const recommendations: string[] = []
    let qualityScore = 100
    let confidence = 90

    // Analyze segments for quality indicators
    if (transcription.segments) {
      const lowConfidenceSegments = transcription.segments.filter(
        segment => segment.noSpeechProb > 0.3 || segment.avgLogprob < -1.0
      )

      if (lowConfidenceSegments.length > 0) {
        const lowConfidenceRatio = lowConfidenceSegments.length / transcription.segments.length
        qualityScore -= lowConfidenceRatio * 30
        confidence -= lowConfidenceRatio * 40

        if (lowConfidenceRatio > 0.2) {
          issues.push('High noise levels detected in audio')
          recommendations.push('Consider using a noise reduction tool before transcription')
        }
      }

      // Check for very short segments (possible audio issues)
      const veryShortSegments = transcription.segments.filter(
        segment => (segment.end - segment.start) < 0.5 && segment.text.trim().length < 5
      )

      if (veryShortSegments.length > transcription.segments.length * 0.1) {
        issues.push('Frequent short segments detected')
        recommendations.push('Audio may have interruptions or poor quality')
        qualityScore -= 15
      }
    }

    // Analyze text for quality indicators
    const text = transcription.text
    const wordCount = text.split(/\s+/).length
    
    if (wordCount < 10) {
      issues.push('Very short transcription')
      recommendations.push('Ensure audio contains clear speech')
      qualityScore -= 20
    }

    // Check for repeated patterns (possible transcription errors)
    const repeatedWords = this.findRepeatedPatterns(text)
    if (repeatedWords.length > 0) {
      issues.push('Repeated patterns detected')
      recommendations.push('Review transcription for accuracy')
      qualityScore -= 10
    }

    return {
      qualityScore: Math.max(0, qualityScore),
      confidence: Math.max(0, confidence),
      recommendedActions: recommendations,
      issues
    }
  }

  private findRepeatedPatterns(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/)
    const patterns: string[] = []
    const seen = new Set<string>()

    // Look for 3+ word sequences that repeat
    for (let i = 0; i < words.length - 5; i++) {
      const sequence = words.slice(i, i + 3).join(' ')
      const remaining = words.slice(i + 3).join(' ')
      
      if (remaining.includes(sequence) && !seen.has(sequence)) {
        patterns.push(sequence)
        seen.add(sequence)
      }
    }

    return patterns
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private estimateTokenUsage(response: any): { 
    promptTokens: number
    completionTokens: number
    totalTokens: number
  } {
    // Whisper API doesn't return token usage, so estimate
    const textLength = typeof response === 'string' ? response.length : (response.text || '').length
    const estimatedTokens = Math.ceil(textLength / 4) // Rough estimate: 1 token ≈ 4 characters

    return {
      promptTokens: 0, // Whisper doesn't use prompt tokens
      completionTokens: estimatedTokens,
      totalTokens: estimatedTokens
    }
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  private handleError(error: any): ServiceResponse<any> {
    console.error('Whisper Service Error:', error)

    if (error?.error?.type === 'insufficient_quota') {
      return {
        success: false,
        error: 'OpenAI quota exceeded. Please check your billing.'
      }
    }

    if (error?.error?.type === 'invalid_request_error') {
      if (error.error.message?.includes('file')) {
        return {
          success: false,
          error: 'Invalid audio file. Please check the file format and size.'
        }
      }
      return {
        success: false,
        error: 'Invalid request to OpenAI API. Please check your input.'
      }
    }

    if (error?.status === 429) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      }
    }

    if (error?.status === 401) {
      return {
        success: false,
        error: 'Invalid OpenAI API key. Please check your configuration.'
      }
    }

    if (error?.status === 413) {
      return {
        success: false,
        error: 'Audio file too large. Maximum size is 25MB.'
      }
    }

    return {
      success: false,
      error: error?.message || 'An unexpected error occurred during transcription.'
    }
  }
}