/**
 * OpenAI Service Configuration for ShipSpeak
 * Environment-based configuration and defaults
 */

import { OpenAIConfig } from './types'

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

export const DEFAULT_CONFIG: Omit<OpenAIConfig, 'apiKey'> = {
  baseURL: 'https://api.openai.com/v1',
  timeout: 60000, // 60 seconds
  maxRetries: 3
}

export const MODEL_CONFIGS = {
  // GPT Models for different use cases
  MEETING_ANALYSIS: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.2,
    maxTokens: 2000,
    topP: 0.9
  },
  
  PRACTICE_GENERATION: {
    model: 'gpt-4-turbo-preview', 
    temperature: 0.3,
    maxTokens: 1500,
    topP: 0.95
  },
  
  QUICK_ANALYSIS: {
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    maxTokens: 1000,
    topP: 0.8
  },
  
  // Whisper Model
  TRANSCRIPTION: {
    model: 'whisper-1' as const,
    temperature: 0.0,
    responseFormat: 'verbose_json' as const,
    timestampGranularities: ['segment'] as const
  }
} as const

// =============================================================================
// PROMPT TEMPLATES
// =============================================================================

export const SYSTEM_PROMPTS = {
  MEETING_ANALYSIS: `You are an expert communication coach specializing in product management and executive presence. Analyze meeting transcriptions to identify communication patterns, strengths, and improvement opportunities.

Focus on:
- Filler word usage and speaking clarity
- Message structure (answer-first vs buried recommendations) 
- Confidence indicators in language patterns
- Strategic thinking demonstration
- Executive presence markers
- Stakeholder influence techniques

Provide specific, actionable feedback with examples from the transcript. Always include both strengths and growth areas.`,

  PRACTICE_MODULE_GENERATION: `You are an expert practice designer creating personalized communication exercises. Generate practice modules that use the person's actual meeting content to help them improve specific communication skills.

Requirements:
- Use their real quotes and content for practice scenarios
- Create exercises that feel relevant to their actual work
- Focus on specific, measurable improvements
- Provide clear success criteria and evaluation rubrics
- Match the difficulty to their current skill level
- Include both delivery practice and strategic thinking exercises

Each module should feel like practicing for their real job, not generic communication training.`
} as const

export const PROMPT_TEMPLATES = {
  MEETING_ANALYSIS: `Analyze this meeting transcript for communication effectiveness:

TRANSCRIPT:
{transcript}

CONTEXT:
- Meeting Duration: {duration} minutes
- Meeting Type: {meetingType}
- User Role: {userRole}
- Analysis Depth: {analysisDepth}

Provide analysis in this JSON format:
{
  "fillerWordsPerMinute": number,
  "confidenceScore": number (0-100),
  "speakingPace": number (0-100),
  "structureScore": number (0-100),
  "executivePresenceScore": number (0-100),
  "communicationPatterns": {
    "fillerWords": [{"word": string, "count": number, "timestamps": number[]}],
    "sentenceStructure": "answer_first" | "buried_lede" | "mixed",
    "tonality": "confident" | "hesitant" | "assertive" | "neutral",
    "clarityScore": number (0-100)
  },
  "strategicThinking": {
    "frameworkUsage": string[],
    "stakeholderAwareness": number (0-100),
    "businessImpactClarity": number (0-100),
    "recommendationStrength": number (0-100)
  },
  "recommendations": string[],
  "keyInsights": string[],
  "improvementAreas": [{"category": string, "severity": string, "description": string, "examples": string[], "practiceRecommendations": string[]}],
  "strengthAreas": string[]
}`,

  PRACTICE_MODULE_GENERATION: `Based on this meeting analysis, generate personalized practice modules using the user's actual content:

MEETING ANALYSIS:
{analysisData}

USER'S ORIGINAL CONTENT:
{originalTranscript}

KEY QUOTES TO PRACTICE WITH:
{keyQuotes}

TOPIC CONTEXT:
{topicContext}

USER PREFERENCES:
- Focus Areas: {focusAreas}
- Difficulty Level: {difficultyLevel}
- Time Available: {timeConstraint} minutes

Generate 2-3 practice modules in this JSON format:
{
  "modules": [
    {
      "id": string,
      "type": "filler_word_reduction" | "executive_presence" | "strategic_narrative" | "answer_first_structure" | "stakeholder_influence" | "technical_translation" | "confidence_building",
      "title": string,
      "description": string,
      "estimatedDuration": number,
      "difficulty": "beginner" | "intermediate" | "advanced",
      "exercises": [
        {
          "id": string,
          "type": "delivery_practice" | "structure_drill" | "simulation" | "reflection",
          "prompt": string,
          "userContent": string,
          "instructions": string[],
          "timeLimit": number,
          "expectedOutcome": string
        }
      ],
      "sourceContent": {
        "originalQuote": string,
        "contextualBackground": string,
        "targetImprovement": string
      },
      "successCriteria": string[],
      "evaluationRubric": [{"metric": string, "description": string, "weight": number, "targetScore": number}]
    }
  ]
}`
} as const

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const VALIDATION_RULES = {
  TRANSCRIPTION: {
    maxFileSize: 25 * 1024 * 1024, // 25MB (OpenAI limit)
    supportedFormats: ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'],
    maxDuration: 1800 // 30 minutes for reasonable processing time
  },
  
  ANALYSIS: {
    minTranscriptLength: 100, // characters
    maxTranscriptLength: 50000, // characters (~12,500 words)
    maxRetries: 3
  },
  
  PRACTICE_MODULES: {
    maxModules: 5,
    minExercises: 1,
    maxExercises: 4,
    maxModuleDuration: 1800 // 30 minutes
  }
} as const

// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

export function getOpenAIConfig(): OpenAIConfig {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  
  return {
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || DEFAULT_CONFIG.baseURL,
    organization: process.env.OPENAI_ORGANIZATION,
    timeout: process.env.OPENAI_TIMEOUT ? parseInt(process.env.OPENAI_TIMEOUT) : DEFAULT_CONFIG.timeout,
    maxRetries: process.env.OPENAI_MAX_RETRIES ? parseInt(process.env.OPENAI_MAX_RETRIES) : DEFAULT_CONFIG.maxRetries
  }
}

export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY environment variable is required')
  }
  
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    errors.push('OPENAI_API_KEY must start with "sk-"')
  }
  
  if (process.env.OPENAI_TIMEOUT && isNaN(parseInt(process.env.OPENAI_TIMEOUT))) {
    errors.push('OPENAI_TIMEOUT must be a valid number')
  }
  
  if (process.env.OPENAI_MAX_RETRIES && isNaN(parseInt(process.env.OPENAI_MAX_RETRIES))) {
    errors.push('OPENAI_MAX_RETRIES must be a valid number')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}