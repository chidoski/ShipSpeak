/**
 * OpenAI Service Types for ShipSpeak
 * Interfaces for GPT-4 and Whisper service integration
 */

// =============================================================================
// CORE SERVICE TYPES
// =============================================================================

export interface OpenAIConfig {
  apiKey: string
  baseURL?: string
  organization?: string
  timeout?: number
  maxRetries?: number
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  usage?: TokenUsage
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

// =============================================================================
// WHISPER SERVICE TYPES
// =============================================================================

export interface TranscriptionRequest {
  audioFile: File | Buffer
  model?: 'whisper-1'
  language?: string
  prompt?: string
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  temperature?: number
  timestampGranularities?: ('word' | 'segment')[]
}

export interface TranscriptionResponse {
  text: string
  language?: string
  duration?: number
  segments?: TranscriptionSegment[]
  words?: TranscriptionWord[]
}

export interface TranscriptionSegment {
  id: number
  seek: number
  start: number
  end: number
  text: string
  tokens: number[]
  temperature: number
  avgLogprob: number
  compressionRatio: number
  noSpeechProb: number
}

export interface TranscriptionWord {
  word: string
  start: number
  end: number
}

// =============================================================================
// GPT SERVICE TYPES
// =============================================================================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  responseFormat?: { type: 'json_object' } | { type: 'text' }
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: ChatChoice[]
  usage: TokenUsage
}

export interface ChatChoice {
  index: number
  message: ChatMessage
  finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls'
}

// =============================================================================
// MEETING ANALYSIS TYPES
// =============================================================================

export interface MeetingAnalysisRequest {
  transcription: string
  meetingContext?: {
    duration: number
    participantCount?: number
    meetingType?: 'standup' | 'review' | 'planning' | 'presentation' | 'other'
  }
  userRole?: 'pm' | 'po' | 'leader' | 'ic'
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive'
}

export interface MeetingAnalysis {
  // Communication Metrics
  fillerWordsPerMinute: number
  confidenceScore: number
  speakingPace: number
  structureScore: number
  executivePresenceScore: number
  
  // Detailed Analysis
  communicationPatterns: {
    fillerWords: { word: string; count: number; timestamps: number[] }[]
    sentenceStructure: 'answer_first' | 'buried_lede' | 'mixed'
    tonality: 'confident' | 'hesitant' | 'assertive' | 'neutral'
    clarityScore: number
  }
  
  // Strategic Content Analysis
  strategicThinking: {
    frameworkUsage: string[]
    stakeholderAwareness: number
    businessImpactClarity: number
    recommendationStrength: number
  }
  
  // Actionable Insights
  recommendations: string[]
  keyInsights: string[]
  improvementAreas: ImprovementArea[]
  strengthAreas: string[]
}

export interface ImprovementArea {
  category: 'filler_words' | 'structure' | 'confidence' | 'pacing' | 'clarity' | 'strategic_thinking'
  severity: 'low' | 'medium' | 'high'
  description: string
  examples: string[]
  practiceRecommendations: string[]
}

// =============================================================================
// PRACTICE MODULE TYPES
// =============================================================================

export interface PracticeModuleRequest {
  meetingAnalysis: MeetingAnalysis
  userContent: {
    originalTranscript: string
    keyQuotes: string[]
    topicContext: string
  }
  userPreferences?: {
    focusAreas?: string[]
    difficultyLevel?: 'beginner' | 'intermediate' | 'advanced'
    timeConstraint?: number // minutes
    learningStyle?: 'practice' | 'simulation' | 'feedback'
  }
}

export interface PracticeModule {
  id: string
  type: ModuleType
  title: string
  description: string
  estimatedDuration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  
  // Core Content
  exercises: PracticeExercise[]
  sourceContent: {
    originalQuote: string
    contextualBackground: string
    targetImprovement: string
  }
  
  // Success Metrics
  successCriteria: string[]
  evaluationRubric: EvaluationCriterion[]
}

export type ModuleType = 
  | 'filler_word_reduction'
  | 'executive_presence' 
  | 'strategic_narrative'
  | 'answer_first_structure'
  | 'stakeholder_influence'
  | 'technical_translation'
  | 'confidence_building'

export interface PracticeExercise {
  id: string
  type: 'delivery_practice' | 'structure_drill' | 'simulation' | 'reflection'
  prompt: string
  userContent: string // Their actual content to practice with
  instructions: string[]
  timeLimit?: number
  expectedOutcome: string
}

export interface EvaluationCriterion {
  metric: string
  description: string
  weight: number
  targetScore: number
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface OpenAIError {
  code: string
  message: string
  type: 'api_error' | 'auth_error' | 'rate_limit' | 'quota_exceeded' | 'network_error'
  retryable: boolean
}

export class OpenAIServiceError extends Error {
  public readonly code: string
  public readonly type: OpenAIError['type']
  public readonly retryable: boolean

  constructor(error: OpenAIError) {
    super(error.message)
    this.name = 'OpenAIServiceError'
    this.code = error.code
    this.type = error.type
    this.retryable = error.retryable
  }
}