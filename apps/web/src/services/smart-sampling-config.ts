/**
 * Smart Sampling Engine Configuration Management
 * Handles configuration presets, validation, and optimization for different use cases
 */

import { SmartSamplingEngineConfig } from './smart-sampling-engine'

export type ConfigPreset = 'COST_OPTIMIZED' | 'BALANCED' | 'QUALITY_FOCUSED' | 'ENTERPRISE' | 'CUSTOM'

export interface ConfigPresetOptions {
  userTier: 'FREE' | 'PRO' | 'ENTERPRISE'
  primaryUseCase: 'EXEC_MEETINGS' | 'TEAM_COLLABORATION' | 'CLIENT_CALLS' | 'ONE_ON_ONE' | 'ALL_PURPOSE'
  qualityPriority: 'COST' | 'SPEED' | 'ACCURACY' | 'BALANCED'
  budgetConstraints: {
    maxCostPerMeeting: number
    monthlyBudget: number
  }
}

export class SmartSamplingConfigManager {
  private static readonly PRESET_CONFIGS: Record<ConfigPreset, Partial<SmartSamplingEngineConfig>> = {
    COST_OPTIMIZED: {
      samplingRatio: 0.20, // 80% cost reduction
      qualityThreshold: 0.75,
      maxProcessingTime: 15000,
      pmFocusWeight: 0.9,
      executiveContextWeight: 0.8,
      influencePatternWeight: 0.8,
      budgetPerMeeting: 0.25,
      fallbackMode: 'COST',
      enableCaching: true,
      cacheExpiryHours: 48
    },

    BALANCED: {
      samplingRatio: 0.25, // 75% cost reduction
      qualityThreshold: 0.8,
      maxProcessingTime: 30000,
      pmFocusWeight: 0.8,
      executiveContextWeight: 0.9,
      influencePatternWeight: 0.85,
      budgetPerMeeting: 0.50,
      fallbackMode: 'BALANCED',
      enableCaching: true,
      cacheExpiryHours: 24
    },

    QUALITY_FOCUSED: {
      samplingRatio: 0.35, // 65% cost reduction
      qualityThreshold: 0.85,
      maxProcessingTime: 45000,
      pmFocusWeight: 0.8,
      executiveContextWeight: 0.95,
      influencePatternWeight: 0.9,
      budgetPerMeeting: 1.00,
      fallbackMode: 'QUALITY',
      enableCaching: true,
      cacheExpiryHours: 12
    },

    ENTERPRISE: {
      samplingRatio: 0.30, // 70% cost reduction
      qualityThreshold: 0.85,
      maxProcessingTime: 60000,
      pmFocusWeight: 0.85,
      executiveContextWeight: 0.95,
      influencePatternWeight: 0.9,
      budgetPerMeeting: 2.00,
      fallbackMode: 'QUALITY',
      enableCaching: true,
      cacheExpiryHours: 6
    },

    CUSTOM: {
      // Will be overridden by user settings
    }
  }

  private static readonly USE_CASE_ADJUSTMENTS: Record<string, Partial<SmartSamplingEngineConfig>> = {
    EXEC_MEETINGS: {
      executiveContextWeight: 0.95,
      pmFocusWeight: 0.9,
      samplingRatio: 0.30, // More thorough for executive context
      qualityThreshold: 0.85
    },

    TEAM_COLLABORATION: {
      influencePatternWeight: 0.9,
      pmFocusWeight: 0.8,
      samplingRatio: 0.25,
      qualityThreshold: 0.8
    },

    CLIENT_CALLS: {
      executiveContextWeight: 0.9,
      influencePatternWeight: 0.95,
      samplingRatio: 0.28,
      qualityThreshold: 0.85
    },

    ONE_ON_ONE: {
      influencePatternWeight: 0.95,
      pmFocusWeight: 0.85,
      samplingRatio: 0.22, // More cost-effective for simpler meetings
      qualityThreshold: 0.75
    },

    ALL_PURPOSE: {
      // Use balanced defaults
    }
  }

  /**
   * Generate configuration based on preset and options
   */
  static generateConfig(
    preset: ConfigPreset,
    options: Partial<ConfigPresetOptions> = {},
    baseApiKey: string
  ): SmartSamplingEngineConfig {
    // Start with base preset
    let config = { ...this.PRESET_CONFIGS[preset] }

    // Apply use case adjustments
    if (options.primaryUseCase && this.USE_CASE_ADJUSTMENTS[options.primaryUseCase]) {
      config = { ...config, ...this.USE_CASE_ADJUSTMENTS[options.primaryUseCase] }
    }

    // Apply tier-specific adjustments
    if (options.userTier) {
      config = { ...config, ...this.getTierAdjustments(options.userTier) }
    }

    // Apply budget constraints
    if (options.budgetConstraints) {
      config = { ...config, ...this.applyBudgetConstraints(config, options.budgetConstraints) }
    }

    // Apply quality priority adjustments
    if (options.qualityPriority) {
      config = { ...config, ...this.getQualityPriorityAdjustments(options.qualityPriority) }
    }

    // Ensure all required fields are present
    return this.validateAndComplete(config, baseApiKey)
  }

  /**
   * Get tier-specific configuration adjustments
   */
  private static getTierAdjustments(tier: 'FREE' | 'PRO' | 'ENTERPRISE'): Partial<SmartSamplingEngineConfig> {
    switch (tier) {
      case 'FREE':
        return {
          budgetPerMeeting: 0.15,
          maxProcessingTime: 15000,
          cacheExpiryHours: 72, // Longer cache for free tier
          samplingRatio: Math.min(0.20, 0.20) // Max 20% for free
        }

      case 'PRO':
        return {
          budgetPerMeeting: 0.75,
          maxProcessingTime: 45000,
          cacheExpiryHours: 24,
          enableCaching: true
        }

      case 'ENTERPRISE':
        return {
          budgetPerMeeting: 3.00,
          maxProcessingTime: 90000,
          cacheExpiryHours: 6,
          qualityThreshold: 0.9
        }

      default:
        return {}
    }
  }

  /**
   * Apply budget constraints to configuration
   */
  private static applyBudgetConstraints(
    config: Partial<SmartSamplingEngineConfig>,
    constraints: { maxCostPerMeeting: number; monthlyBudget: number }
  ): Partial<SmartSamplingEngineConfig> {
    const adjustments: Partial<SmartSamplingEngineConfig> = {}

    // Adjust budget per meeting
    if (constraints.maxCostPerMeeting < (config.budgetPerMeeting || 0.5)) {
      adjustments.budgetPerMeeting = constraints.maxCostPerMeeting
      
      // If budget is very tight, increase cost reduction
      if (constraints.maxCostPerMeeting < 0.25) {
        adjustments.samplingRatio = Math.min(config.samplingRatio || 0.25, 0.18) // Max 18%
        adjustments.fallbackMode = 'COST'
      }
    }

    // Enable more aggressive caching for budget constraints
    if (constraints.monthlyBudget < 50) {
      adjustments.enableCaching = true
      adjustments.cacheExpiryHours = 72 // Longer cache
    }

    return adjustments
  }

  /**
   * Get quality priority adjustments
   */
  private static getQualityPriorityAdjustments(
    priority: 'COST' | 'SPEED' | 'ACCURACY' | 'BALANCED'
  ): Partial<SmartSamplingEngineConfig> {
    switch (priority) {
      case 'COST':
        return {
          samplingRatio: 0.18, // Aggressive cost cutting
          qualityThreshold: 0.7,
          fallbackMode: 'COST',
          maxProcessingTime: 15000
        }

      case 'SPEED':
        return {
          maxProcessingTime: 10000,
          enableCaching: true,
          cacheExpiryHours: 48,
          samplingRatio: 0.22
        }

      case 'ACCURACY':
        return {
          qualityThreshold: 0.9,
          samplingRatio: 0.35,
          fallbackMode: 'QUALITY',
          maxProcessingTime: 60000
        }

      case 'BALANCED':
      default:
        return {} // Use preset defaults
    }
  }

  /**
   * Validate configuration and fill in missing required fields
   */
  private static validateAndComplete(
    config: Partial<SmartSamplingEngineConfig>,
    apiKey: string
  ): SmartSamplingEngineConfig {
    // Set required fields with defaults if missing
    const complete: SmartSamplingEngineConfig = {
      samplingRatio: config.samplingRatio || 0.25,
      qualityThreshold: config.qualityThreshold || 0.8,
      maxProcessingTime: config.maxProcessingTime || 30000,
      pmFocusWeight: config.pmFocusWeight || 0.8,
      executiveContextWeight: config.executiveContextWeight || 0.9,
      influencePatternWeight: config.influencePatternWeight || 0.85,
      budgetPerMeeting: config.budgetPerMeeting || 0.50,
      fallbackMode: config.fallbackMode || 'BALANCED',
      openaiApiKey: apiKey,
      enableCaching: config.enableCaching !== undefined ? config.enableCaching : true,
      cacheExpiryHours: config.cacheExpiryHours || 24
    }

    // Validate ranges
    this.validateConfigRanges(complete)

    return complete
  }

  /**
   * Validate configuration parameter ranges
   */
  private static validateConfigRanges(config: SmartSamplingEngineConfig): void {
    const validations = [
      { field: 'samplingRatio', min: 0.1, max: 0.5, value: config.samplingRatio },
      { field: 'qualityThreshold', min: 0.5, max: 1.0, value: config.qualityThreshold },
      { field: 'pmFocusWeight', min: 0.5, max: 1.0, value: config.pmFocusWeight },
      { field: 'executiveContextWeight', min: 0.5, max: 1.0, value: config.executiveContextWeight },
      { field: 'influencePatternWeight', min: 0.5, max: 1.0, value: config.influencePatternWeight },
      { field: 'budgetPerMeeting', min: 0.05, max: 10.0, value: config.budgetPerMeeting },
      { field: 'maxProcessingTime', min: 5000, max: 300000, value: config.maxProcessingTime },
      { field: 'cacheExpiryHours', min: 1, max: 168, value: config.cacheExpiryHours }
    ]

    const errors = validations
      .filter(v => v.value < v.min || v.value > v.max)
      .map(v => `${v.field} must be between ${v.min} and ${v.max}, got ${v.value}`)

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`)
    }

    if (!config.openaiApiKey || config.openaiApiKey.length < 10) {
      throw new Error('Valid OpenAI API key is required')
    }
  }

  /**
   * Get preset recommendations based on user profile
   */
  static getRecommendedPreset(options: ConfigPresetOptions): ConfigPreset {
    // Enterprise users with high budgets
    if (options.userTier === 'ENTERPRISE' && options.budgetConstraints.monthlyBudget > 200) {
      return 'ENTERPRISE'
    }

    // Quality-focused use cases
    if (options.primaryUseCase === 'EXEC_MEETINGS' && options.qualityPriority === 'ACCURACY') {
      return 'QUALITY_FOCUSED'
    }

    // Cost-sensitive users
    if (options.userTier === 'FREE' || options.budgetConstraints.maxCostPerMeeting < 0.25) {
      return 'COST_OPTIMIZED'
    }

    // Speed priority
    if (options.qualityPriority === 'SPEED') {
      return 'BALANCED' // Balanced offers good speed with reasonable quality
    }

    // Default recommendation
    return 'BALANCED'
  }

  /**
   * Calculate expected metrics for a configuration
   */
  static calculateExpectedMetrics(config: SmartSamplingEngineConfig): {
    expectedCostReduction: number
    expectedQualityScore: number
    expectedProcessingTime: number
    recommendedMeetingTypes: string[]
  } {
    const expectedCostReduction = 1 - config.samplingRatio
    const expectedQualityScore = Math.min(0.95, config.qualityThreshold + 0.05) // Slight boost from smart sampling
    const expectedProcessingTime = config.maxProcessingTime * 0.3 // Typical processing time

    // Determine recommended meeting types based on weights
    const recommendedMeetingTypes = []
    if (config.executiveContextWeight > 0.9) recommendedMeetingTypes.push('Executive Reviews')
    if (config.influencePatternWeight > 0.9) recommendedMeetingTypes.push('Client Calls', 'Stakeholder Meetings')
    if (config.pmFocusWeight > 0.85) recommendedMeetingTypes.push('Team Meetings', 'Product Reviews')
    if (recommendedMeetingTypes.length === 0) recommendedMeetingTypes.push('All Meeting Types')

    return {
      expectedCostReduction,
      expectedQualityScore,
      expectedProcessingTime,
      recommendedMeetingTypes
    }
  }

  /**
   * Export configuration for debugging and logging
   */
  static exportConfig(config: SmartSamplingEngineConfig): Record<string, any> {
    return {
      samplingRatio: config.samplingRatio,
      qualityThreshold: config.qualityThreshold,
      maxProcessingTime: config.maxProcessingTime,
      pmFocusWeight: config.pmFocusWeight,
      executiveContextWeight: config.executiveContextWeight,
      influencePatternWeight: config.influencePatternWeight,
      budgetPerMeeting: config.budgetPerMeeting,
      fallbackMode: config.fallbackMode,
      enableCaching: config.enableCaching,
      cacheExpiryHours: config.cacheExpiryHours,
      // Exclude API key for security
      hasApiKey: !!config.openaiApiKey
    }
  }
}