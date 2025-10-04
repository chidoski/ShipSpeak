/**
 * OpenAI Service Integration for ShipSpeak
 * Main exports and service factory functions
 */

import { GPTService } from './gpt-service'
import { WhisperService } from './whisper-service'
import { getOpenAIConfig, validateEnvironment } from './config'
import type {
  OpenAIConfig,
  ServiceResponse,
  MeetingAnalysisRequest,
  MeetingAnalysis,
  PracticeModuleRequest,
  PracticeModule,
  TranscriptionRequest,
  TranscriptionResponse
} from './types'

// =============================================================================
// SERVICE FACTORY
// =============================================================================

export class OpenAIServiceFactory {
  private static gptServiceInstance: GPTService | null = null
  private static whisperServiceInstance: WhisperService | null = null
  private static configCache: OpenAIConfig | null = null

  /**
   * Get or create GPT service instance
   */
  static getGPTService(config?: OpenAIConfig): GPTService {
    if (!this.gptServiceInstance || (config && config !== this.configCache)) {
      const serviceConfig = config || getOpenAIConfig()
      this.gptServiceInstance = new GPTService(serviceConfig)
      this.configCache = serviceConfig
    }
    return this.gptServiceInstance
  }

  /**
   * Get or create Whisper service instance
   */
  static getWhisperService(config?: OpenAIConfig): WhisperService {
    if (!this.whisperServiceInstance || (config && config !== this.configCache)) {
      const serviceConfig = config || getOpenAIConfig()
      this.whisperServiceInstance = new WhisperService(serviceConfig)
      this.configCache = serviceConfig
    }
    return this.whisperServiceInstance
  }

  /**
   * Reset all service instances (useful for testing)
   */
  static resetInstances(): void {
    this.gptServiceInstance = null
    this.whisperServiceInstance = null
    this.configCache = null
  }

  /**
   * Validate environment configuration
   */
  static validateEnvironment(): { valid: boolean; errors: string[] } {
    return validateEnvironment()
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Analyze a meeting transcript using GPT-4
 */
export async function analyzeMeeting(
  request: MeetingAnalysisRequest,
  config?: OpenAIConfig
): Promise<ServiceResponse<MeetingAnalysis>> {
  const gptService = OpenAIServiceFactory.getGPTService(config)
  return await gptService.analyzeMeeting(request)
}

/**
 * Generate practice modules based on meeting analysis
 */
export async function generatePracticeModules(
  request: PracticeModuleRequest,
  config?: OpenAIConfig
): Promise<ServiceResponse<PracticeModule[]>> {
  const gptService = OpenAIServiceFactory.getGPTService(config)
  return await gptService.generatePracticeModules(request)
}

/**
 * Transcribe audio using Whisper
 */
export async function transcribeAudio(
  request: TranscriptionRequest,
  config?: OpenAIConfig
): Promise<ServiceResponse<TranscriptionResponse>> {
  const whisperService = OpenAIServiceFactory.getWhisperService(config)
  return await whisperService.transcribeAudio(request)
}

/**
 * Complete workflow: Transcribe + Analyze + Generate Modules
 */
export async function processCompleteWorkflow(
  audioFile: File,
  options: {
    userRole?: 'pm' | 'po' | 'leader' | 'ic'
    meetingType?: 'standup' | 'review' | 'planning' | 'presentation' | 'other'
    analysisDepth?: 'basic' | 'detailed' | 'comprehensive'
    focusAreas?: string[]
    difficultyLevel?: 'beginner' | 'intermediate' | 'advanced'
    timeConstraint?: number
  } = {},
  config?: OpenAIConfig
): Promise<{
  transcription: ServiceResponse<TranscriptionResponse>
  analysis: ServiceResponse<MeetingAnalysis>
  modules: ServiceResponse<PracticeModule[]>
}> {
  // Step 1: Transcribe the audio
  const transcription = await transcribeAudio({
    audioFile,
    responseFormat: 'verbose_json',
    timestampGranularities: ['segment']
  }, config)

  if (!transcription.success || !transcription.data) {
    return {
      transcription,
      analysis: { success: false, error: 'Transcription failed' },
      modules: { success: false, error: 'Transcription failed' }
    }
  }

  // Step 2: Analyze the meeting
  const analysis = await analyzeMeeting({
    transcription: transcription.data.text,
    meetingContext: {
      duration: transcription.data.duration || 1800,
      meetingType: options.meetingType
    },
    userRole: options.userRole,
    analysisDepth: options.analysisDepth || 'detailed'
  }, config)

  if (!analysis.success || !analysis.data) {
    return {
      transcription,
      analysis,
      modules: { success: false, error: 'Analysis failed' }
    }
  }

  // Step 3: Generate practice modules
  const keyQuotes = transcription.data.segments
    ?.filter(segment => segment.text.length > 20)
    ?.slice(0, 5)
    ?.map(segment => segment.text) || []

  const modules = await generatePracticeModules({
    meetingAnalysis: analysis.data,
    userContent: {
      originalTranscript: transcription.data.text,
      keyQuotes,
      topicContext: 'Product management meeting'
    },
    userPreferences: {
      focusAreas: options.focusAreas,
      difficultyLevel: options.difficultyLevel,
      timeConstraint: options.timeConstraint
    }
  }, config)

  return {
    transcription,
    analysis,
    modules
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export { GPTService } from './gpt-service'
export { WhisperService } from './whisper-service'
export { getOpenAIConfig, validateEnvironment, MODEL_CONFIGS } from './config'
export type * from './types'

// Default export for convenience
export default {
  OpenAIServiceFactory,
  analyzeMeeting,
  generatePracticeModules,
  transcribeAudio,
  processCompleteWorkflow,
  validateEnvironment
}