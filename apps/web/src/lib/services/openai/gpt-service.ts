/**
 * GPT Service for ShipSpeak
 * Handles meeting analysis and practice module generation using GPT-4
 */

import OpenAI from 'openai'
import {
  OpenAIConfig,
  ServiceResponse,
  ChatCompletionRequest,
  ChatCompletionResponse,
  MeetingAnalysisRequest,
  MeetingAnalysis,
  PracticeModuleRequest,
  PracticeModule,
  OpenAIServiceError,
  ChatMessage
} from './types'
import { MODEL_CONFIGS, SYSTEM_PROMPTS, PROMPT_TEMPLATES, VALIDATION_RULES } from './config'

export class GPTService {
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
  // CORE CHAT COMPLETION METHOD
  // =============================================================================

  async generateChatCompletion(request: ChatCompletionRequest): Promise<ServiceResponse<ChatCompletionResponse>> {
    try {
      const response = await this.client.chat.completions.create({
        model: request.model || MODEL_CONFIGS.MEETING_ANALYSIS.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        top_p: request.topP,
        frequency_penalty: request.frequencyPenalty,
        presence_penalty: request.presencePenalty,
        response_format: request.responseFormat
      })

      return {
        success: true,
        data: {
          id: response.id,
          object: response.object,
          created: response.created,
          model: response.model,
          choices: response.choices.map(choice => ({
            index: choice.index,
            message: {
              role: choice.message.role,
              content: choice.message.content || ''
            },
            finishReason: choice.finish_reason as any
          })),
          usage: {
            promptTokens: response.usage?.prompt_tokens || 0,
            completionTokens: response.usage?.completion_tokens || 0,
            totalTokens: response.usage?.total_tokens || 0
          }
        },
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // =============================================================================
  // MEETING ANALYSIS
  // =============================================================================

  async analyzeMeeting(request: MeetingAnalysisRequest): Promise<ServiceResponse<MeetingAnalysis>> {
    // Validate input
    const validation = this.validateAnalysisRequest(request)
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      }
    }

    try {
      // Prepare the analysis prompt
      const prompt = this.buildAnalysisPrompt(request)
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.MEETING_ANALYSIS
        },
        {
          role: 'user',
          content: prompt
        }
      ]

      // Get appropriate model config based on analysis depth
      const modelConfig = request.analysisDepth === 'basic' 
        ? MODEL_CONFIGS.QUICK_ANALYSIS 
        : MODEL_CONFIGS.MEETING_ANALYSIS

      const response = await this.generateChatCompletion({
        messages,
        model: modelConfig.model,
        temperature: modelConfig.temperature,
        maxTokens: modelConfig.maxTokens,
        topP: modelConfig.topP,
        responseFormat: { type: 'json_object' }
      })

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to analyze meeting'
        }
      }

      // Parse the analysis response
      const analysisData = this.parseAnalysisResponse(response.data.choices[0].message.content)
      
      return {
        success: true,
        data: analysisData,
        usage: response.usage
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // =============================================================================
  // PRACTICE MODULE GENERATION
  // =============================================================================

  async generatePracticeModules(request: PracticeModuleRequest): Promise<ServiceResponse<PracticeModule[]>> {
    try {
      // Prepare the module generation prompt
      const prompt = this.buildModulePrompt(request)
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.PRACTICE_MODULE_GENERATION
        },
        {
          role: 'user',
          content: prompt
        }
      ]

      const response = await this.generateChatCompletion({
        messages,
        model: MODEL_CONFIGS.PRACTICE_GENERATION.model,
        temperature: MODEL_CONFIGS.PRACTICE_GENERATION.temperature,
        maxTokens: MODEL_CONFIGS.PRACTICE_GENERATION.maxTokens,
        topP: MODEL_CONFIGS.PRACTICE_GENERATION.topP,
        responseFormat: { type: 'json_object' }
      })

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to generate practice modules'
        }
      }

      // Parse the modules response
      const modules = this.parseModulesResponse(response.data.choices[0].message.content)
      
      return {
        success: true,
        data: modules,
        usage: response.usage
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // =============================================================================
  // VALIDATION HELPERS
  // =============================================================================

  private validateAnalysisRequest(request: MeetingAnalysisRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!request.transcription) {
      errors.push('Transcription is required')
    } else {
      if (request.transcription.length < VALIDATION_RULES.ANALYSIS.minTranscriptLength) {
        errors.push(`Transcription too short (minimum ${VALIDATION_RULES.ANALYSIS.minTranscriptLength} characters)`)
      }
      if (request.transcription.length > VALIDATION_RULES.ANALYSIS.maxTranscriptLength) {
        errors.push(`Transcription too long (maximum ${VALIDATION_RULES.ANALYSIS.maxTranscriptLength} characters)`)
      }
    }

    if (request.meetingContext?.duration && request.meetingContext.duration <= 0) {
      errors.push('Meeting duration must be positive')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // =============================================================================
  // PROMPT BUILDING
  // =============================================================================

  private buildAnalysisPrompt(request: MeetingAnalysisRequest): string {
    const context = request.meetingContext || {}
    
    return PROMPT_TEMPLATES.MEETING_ANALYSIS
      .replace('{transcript}', request.transcription)
      .replace('{duration}', String(context.duration || 30))
      .replace('{meetingType}', context.meetingType || 'other')
      .replace('{userRole}', request.userRole || 'pm')
      .replace('{analysisDepth}', request.analysisDepth || 'detailed')
  }

  private buildModulePrompt(request: PracticeModuleRequest): string {
    const preferences = request.userPreferences || {}
    
    return PROMPT_TEMPLATES.PRACTICE_MODULE_GENERATION
      .replace('{analysisData}', JSON.stringify(request.meetingAnalysis, null, 2))
      .replace('{originalTranscript}', request.userContent.originalTranscript)
      .replace('{keyQuotes}', JSON.stringify(request.userContent.keyQuotes))
      .replace('{topicContext}', request.userContent.topicContext)
      .replace('{focusAreas}', JSON.stringify(preferences.focusAreas || []))
      .replace('{difficultyLevel}', preferences.difficultyLevel || 'intermediate')
      .replace('{timeConstraint}', String(preferences.timeConstraint || 15))
  }

  // =============================================================================
  // RESPONSE PARSING
  // =============================================================================

  private parseAnalysisResponse(content: string): MeetingAnalysis {
    try {
      const parsed = JSON.parse(content)
      
      // Validate required fields and provide defaults
      return {
        fillerWordsPerMinute: parsed.fillerWordsPerMinute || 0,
        confidenceScore: Math.max(0, Math.min(100, parsed.confidenceScore || 50)),
        speakingPace: Math.max(0, Math.min(100, parsed.speakingPace || 50)),
        structureScore: Math.max(0, Math.min(100, parsed.structureScore || 50)),
        executivePresenceScore: Math.max(0, Math.min(100, parsed.executivePresenceScore || 50)),
        
        communicationPatterns: {
          fillerWords: parsed.communicationPatterns?.fillerWords || [],
          sentenceStructure: parsed.communicationPatterns?.sentenceStructure || 'mixed',
          tonality: parsed.communicationPatterns?.tonality || 'neutral',
          clarityScore: Math.max(0, Math.min(100, parsed.communicationPatterns?.clarityScore || 50))
        },
        
        strategicThinking: {
          frameworkUsage: parsed.strategicThinking?.frameworkUsage || [],
          stakeholderAwareness: Math.max(0, Math.min(100, parsed.strategicThinking?.stakeholderAwareness || 50)),
          businessImpactClarity: Math.max(0, Math.min(100, parsed.strategicThinking?.businessImpactClarity || 50)),
          recommendationStrength: Math.max(0, Math.min(100, parsed.strategicThinking?.recommendationStrength || 50))
        },
        
        recommendations: parsed.recommendations || [],
        keyInsights: parsed.keyInsights || [],
        improvementAreas: parsed.improvementAreas || [],
        strengthAreas: parsed.strengthAreas || []
      }
    } catch (error) {
      // Fallback analysis if parsing fails
      return this.createFallbackAnalysis()
    }
  }

  private parseModulesResponse(content: string): PracticeModule[] {
    try {
      const parsed = JSON.parse(content)
      const modules = parsed.modules || []
      
      return modules.map((module: any) => ({
        id: module.id || `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: module.type || 'executive_presence',
        title: module.title || 'Communication Practice',
        description: module.description || 'Practice communication skills',
        estimatedDuration: Math.max(300, module.estimatedDuration || 600), // Min 5 minutes
        difficulty: module.difficulty || 'intermediate',
        exercises: module.exercises || [],
        sourceContent: module.sourceContent || {
          originalQuote: '',
          contextualBackground: '',
          targetImprovement: ''
        },
        successCriteria: module.successCriteria || [],
        evaluationRubric: module.evaluationRubric || []
      }))
    } catch (error) {
      // Return empty array if parsing fails
      return []
    }
  }

  private createFallbackAnalysis(): MeetingAnalysis {
    return {
      fillerWordsPerMinute: 3,
      confidenceScore: 70,
      speakingPace: 70,
      structureScore: 70,
      executivePresenceScore: 70,
      
      communicationPatterns: {
        fillerWords: [],
        sentenceStructure: 'mixed',
        tonality: 'neutral',
        clarityScore: 70
      },
      
      strategicThinking: {
        frameworkUsage: [],
        stakeholderAwareness: 70,
        businessImpactClarity: 70,
        recommendationStrength: 70
      },
      
      recommendations: ['Practice answer-first structure', 'Reduce filler words'],
      keyInsights: ['Communication analysis available'],
      improvementAreas: [],
      strengthAreas: ['Clear communication']
    }
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  private handleError(error: any): ServiceResponse<any> {
    console.error('GPT Service Error:', error)

    if (error?.error?.type === 'insufficient_quota') {
      return {
        success: false,
        error: 'OpenAI quota exceeded. Please check your billing.'
      }
    }

    if (error?.error?.type === 'invalid_request_error') {
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

    return {
      success: false,
      error: error?.message || 'An unexpected error occurred while processing your request.'
    }
  }
}