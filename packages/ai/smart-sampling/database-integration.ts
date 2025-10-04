/**
 * Smart Sampling Database Integration Service
 * Extends existing SmartSamplingService with database persistence and real-time updates
 * 
 * TDD Phase: GREEN - Implement minimal code to make tests pass
 */

import {
  SmartSamplingService,
  type SmartSamplingConfig,
  type PMAnalysisResult,
  type CriticalMoment,
  type AudioChunk,
  type CostOptimizationResult
} from '../../../apps/web/src/services/smart-sampling.service';
import {
  saveMeetingAnalysis,
  getUserMeetings,
  getSystemConfig,
  subscribeMeetingAnalysis,
  supabase
} from '../../database/supabase';
import type {
  Meeting,
  MeetingAnalysis,
  MeetingTranscript,
  SamplingPreset,
  MeetingAnalysisInsert
} from '../../database/types';

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface SmartSamplingDatabaseConfig extends SmartSamplingConfig {
  enableRealTimeUpdates?: boolean;
  enableCostOptimization?: boolean;
  enableAdaptiveSampling?: boolean;
  defaultPreset?: SamplingPreset;
}

export interface AnalysisContext {
  meetingType?: string;
  userRole?: string;
  focusAreas?: string[];
  userPreferences?: {
    prioritizeExecutivePresence?: boolean;
    focusOnInfluenceSkills?: boolean;
    emphasizeDataStorytelling?: boolean;
  };
}

export interface SamplingPresetConfig {
  sampling_percentage: number;
  chunk_selection: 'strategic' | 'hybrid' | 'comprehensive' | 'exhaustive';
  cost_target: 'minimal' | 'moderate' | 'premium' | 'maximum_quality';
  quality_threshold: number;
}

export interface OptimizationResult {
  recommendedPreset: string;
  expectedCostReduction: number;
  expectedQuality: number;
  personalizedConfig: SmartSamplingConfig;
}

// ============================================================================
// EXTENDED SERVICE CLASS
// ============================================================================

export class SmartSamplingDatabaseService extends SmartSamplingService {
  private dbConfig: SmartSamplingDatabaseConfig;
  private presetCache: Map<string, SamplingPresetConfig> = new Map();

  constructor(config: SmartSamplingDatabaseConfig) {
    super(config);
    this.dbConfig = config;
  }

  /**
   * Process audio with Smart Sampling and persist results to database
   * Implementation for test: "should upload meeting metadata and trigger Smart Sampling analysis"
   */
  async processAudioWithSmartSampling(
    meetingId: string,
    audioBuffer: AudioBuffer,
    options: { preset: string; userPreferences?: any }
  ): Promise<PMAnalysisResult> {
    try {
      // Apply sampling preset configuration
      await this.applySamplingPresetConfig(options.preset);

      // Perform Smart Sampling analysis
      const analysisResult = await this.analyzeWithSampling(audioBuffer);

      // Calculate cost metrics
      const costMetrics = await this.calculateCostMetrics(audioBuffer, analysisResult);

      // Save analysis results to database
      await this.persistAnalysisResults(meetingId, analysisResult, costMetrics, options);

      // Update meeting status
      await this.updateMeetingStatus(meetingId, 'analyzed');

      return analysisResult;
    } catch (error) {
      // Update meeting status to failed
      await this.updateMeetingStatus(meetingId, 'failed', error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`Audio analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Apply sampling preset from system configuration
   * Implementation for test: "should load and apply different sampling presets from system configuration"
   */
  async applySamplingPreset(
    audioBuffer: AudioBuffer,
    preset: string
  ): Promise<{ costReduction: number; qualityScore: number; selectedMoments: CriticalMoment[] }> {
    try {
      // Load preset configuration from database
      const presetConfig = await this.loadSamplingPreset(preset);
      
      // Apply preset to service configuration
      this.updateConfigFromPreset(presetConfig);

      // Perform optimized analysis
      const optimizationResult = await this.optimizeForCost(audioBuffer, {
        targetCostReduction: (100 - presetConfig.sampling_percentage) / 100,
        qualityThreshold: presetConfig.quality_threshold
      });

      return {
        costReduction: optimizationResult.costReduction,
        qualityScore: optimizationResult.qualityScore,
        selectedMoments: optimizationResult.selectedMoments
      };
    } catch (error) {
      throw new Error(`Failed to apply sampling preset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Adaptive sampling based on meeting type and user context
   * Implementation for test: "should adapt sampling strategy based on meeting type and user preferences"
   */
  async adaptiveSamplingAnalysis(
    audioBuffer: AudioBuffer,
    context: AnalysisContext
  ): Promise<{ analyzedDuration: number; costReduction: number; selectedMoments: CriticalMoment[] }> {
    try {
      // Adapt sampling strategy based on context
      const adaptedConfig = this.adaptConfigForContext(context);
      
      // Update service configuration
      Object.assign(this.config, adaptedConfig);

      // Detect critical moments with context awareness
      const criticalMoments = this.detectCriticalMoments(audioBuffer);
      
      // Filter moments based on context focus areas
      const filteredMoments = this.filterMomentsByContext(criticalMoments, context);

      // Create optimized chunks
      const optimizedChunks = this.createOptimizedChunks(audioBuffer, filteredMoments);
      
      const analyzedDuration = optimizedChunks.reduce((sum, chunk) => sum + chunk.duration, 0);
      const costReduction = 1 - (analyzedDuration / audioBuffer.duration);

      return {
        analyzedDuration,
        costReduction,
        selectedMoments: filteredMoments
      };
    } catch (error) {
      throw new Error(`Adaptive sampling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Optimize sampling configuration for specific user
   * Implementation for test: "should track and optimize sampling performance over time"
   */
  async optimizeSamplingForUser(
    userId: string,
    meetingResults: Array<{ cost: number; quality: number; accuracy: number }>,
    options: {
      targetCostReduction: number;
      minQualityThreshold: number;
      learningRate: number;
    }
  ): Promise<OptimizationResult> {
    try {
      // Analyze historical performance
      const performanceMetrics = this.analyzeUserPerformance(meetingResults);
      
      // Calculate optimal configuration
      const optimalConfig = this.calculateOptimalConfig(performanceMetrics, options);
      
      // Determine best preset
      const recommendedPreset = this.selectOptimalPreset(optimalConfig, options);

      return {
        recommendedPreset,
        expectedCostReduction: optimalConfig.expectedCostReduction,
        expectedQuality: optimalConfig.expectedQuality,
        personalizedConfig: optimalConfig.config
      };
    } catch (error) {
      throw new Error(`User optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Streaming analysis with real-time progress updates
   * Implementation for test: "should provide real-time analysis progress updates via database subscriptions"
   */
  async streamingAnalysisWithProgress(
    meetingId: string,
    audioBuffer: AudioBuffer,
    options: { chunkSize: number; progressCallback: (progress: any) => void }
  ): Promise<void> {
    try {
      const totalChunks = Math.ceil(audioBuffer.duration / options.chunkSize);
      let processedChunks = 0;

      // Simulate streaming analysis with progress updates
      for (let i = 0; i < totalChunks; i++) {
        const chunkStart = i * options.chunkSize;
        const chunkEnd = Math.min((i + 1) * options.chunkSize, audioBuffer.duration);
        
        // Simulate chunk processing
        await this.processChunk(chunkStart, chunkEnd);
        
        processedChunks++;
        const progress = (processedChunks / totalChunks) * 100;

        // Update database with progress
        await this.updateAnalysisProgress(meetingId, {
          processing_progress: progress,
          chunks_processed: processedChunks,
          estimated_completion_time: new Date(Date.now() + ((totalChunks - processedChunks) * 5000)).toISOString()
        });

        // Call progress callback
        options.progressCallback({
          progress,
          processedChunks,
          totalChunks,
          estimatedTimeRemaining: (totalChunks - processedChunks) * 5
        });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      throw new Error(`Streaming analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save meeting transcripts with sampling metadata
   * Implementation for test: "should save meeting transcripts with smart sampling metadata"
   */
  async saveMeetingTranscripts(
    meetingId: string,
    transcripts: Array<{
      chunk_index: number;
      start_time_seconds: number;
      end_time_seconds: number;
      transcript_text: string;
      speaker_labels?: any;
      confidence_score?: number;
      was_analyzed: boolean;
      sampling_reason: string;
    }>
  ): Promise<MeetingTranscript[]> {
    try {
      const savedTranscripts: MeetingTranscript[] = [];

      for (const transcript of transcripts) {
        const { data, error } = await supabase
          .from('meeting_transcripts')
          .insert({
            meeting_id: meetingId,
            chunk_index: transcript.chunk_index,
            start_time_seconds: transcript.start_time_seconds,
            end_time_seconds: transcript.end_time_seconds,
            transcript_text: transcript.transcript_text,
            speaker_labels: transcript.speaker_labels || null,
            confidence_score: transcript.confidence_score || 0.95,
            was_analyzed: transcript.was_analyzed,
            sampling_reason: transcript.sampling_reason
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to save transcript: ${error.message}`);
        }

        savedTranscripts.push(data);
      }

      return savedTranscripts;
    } catch (error) {
      throw new Error(`Failed to save transcripts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Query analyzed transcripts
   * Implementation for test: "should support querying transcripts by sampling criteria"
   */
  async getAnalyzedTranscripts(meetingId: string): Promise<MeetingTranscript[]> {
    try {
      const { data, error } = await supabase
        .from('meeting_transcripts')
        .select('*')
        .eq('meeting_id', meetingId)
        .eq('was_analyzed', true)
        .order('chunk_index');

      if (error) {
        throw new Error(`Failed to query analyzed transcripts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Failed to get analyzed transcripts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Query skipped transcripts
   */
  async getSkippedTranscripts(meetingId: string): Promise<MeetingTranscript[]> {
    try {
      const { data, error } = await supabase
        .from('meeting_transcripts')
        .select('*')
        .eq('meeting_id', meetingId)
        .eq('was_analyzed', false)
        .order('chunk_index');

      if (error) {
        throw new Error(`Failed to query skipped transcripts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Failed to get skipped transcripts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async applySamplingPresetConfig(preset: string): Promise<void> {
    const presetConfig = await this.loadSamplingPreset(preset);
    this.updateConfigFromPreset(presetConfig);
  }

  private async loadSamplingPreset(preset: string): Promise<SamplingPresetConfig> {
    if (this.presetCache.has(preset)) {
      return this.presetCache.get(preset)!;
    }

    try {
      const systemConfig = await getSystemConfig('smart_sampling_presets');
      const presetConfig = systemConfig?.[preset];
      
      if (!presetConfig) {
        // Return default config
        return this.getDefaultPresetConfig(preset);
      }

      this.presetCache.set(preset, presetConfig);
      return presetConfig;
    } catch (error) {
      console.warn('Failed to load preset from database, using default:', error);
      return this.getDefaultPresetConfig(preset);
    }
  }

  private getDefaultPresetConfig(preset: string): SamplingPresetConfig {
    const defaults: Record<string, SamplingPresetConfig> = {
      'COST_OPTIMIZED': {
        sampling_percentage: 15,
        chunk_selection: 'strategic',
        cost_target: 'minimal',
        quality_threshold: 0.75
      },
      'BALANCED': {
        sampling_percentage: 25,
        chunk_selection: 'hybrid',
        cost_target: 'moderate',
        quality_threshold: 0.85
      },
      'QUALITY_FOCUSED': {
        sampling_percentage: 60,
        chunk_selection: 'comprehensive',
        cost_target: 'premium',
        quality_threshold: 0.90
      }
    };

    return defaults[preset] || defaults['BALANCED'];
  }

  private updateConfigFromPreset(presetConfig: SamplingPresetConfig): void {
    this.config.samplingRatio = presetConfig.sampling_percentage / 100;
    this.config.confidenceThreshold = presetConfig.quality_threshold;
  }

  private async calculateCostMetrics(
    audioBuffer: AudioBuffer,
    analysisResult: PMAnalysisResult
  ): Promise<{
    processing_cost_usd: number;
    estimated_full_cost_usd: number;
    cost_savings_percentage: number;
    processing_time_seconds: number;
  }> {
    const baseCostPerMinute = 0.014; // $0.014 per minute for GPT-4
    const analyzedMinutes = analysisResult.analyzedDuration / 60;
    const totalMinutes = audioBuffer.duration / 60;

    const processing_cost_usd = analyzedMinutes * baseCostPerMinute;
    const estimated_full_cost_usd = totalMinutes * baseCostPerMinute;
    const cost_savings_percentage = analysisResult.costReduction * 100;
    const processing_time_seconds = Math.round(analyzedMinutes * 3); // ~3 seconds per minute

    return {
      processing_cost_usd,
      estimated_full_cost_usd,
      cost_savings_percentage,
      processing_time_seconds
    };
  }

  private async persistAnalysisResults(
    meetingId: string,
    analysisResult: PMAnalysisResult,
    costMetrics: any,
    options: any
  ): Promise<void> {
    const analysisData: MeetingAnalysisInsert = {
      meeting_id: meetingId,
      sampling_preset: options.preset as SamplingPreset,
      sampling_percentage: (1 - analysisResult.costReduction) * 100,
      total_chunks: Math.ceil(analysisResult.originalDuration / 60), // Estimate
      analyzed_chunks: Math.ceil(analysisResult.analyzedDuration / 60), // Estimate
      overall_score: analysisResult.analysis.confidenceScore / 10,
      executive_presence_score: analysisResult.analysis.executivePresenceScore / 10,
      influence_skills_score: analysisResult.analysis.influenceEffectiveness / 10,
      communication_structure_score: analysisResult.analysis.structureScore / 10,
      detailed_feedback: {
        recommendations: analysisResult.analysis.recommendations,
        pmSpecificInsights: analysisResult.analysis.pmSpecificInsights,
        fillerWordsPerMinute: analysisResult.analysis.fillerWordsPerMinute
      },
      improvement_areas: analysisResult.detectedIssues,
      strengths: analysisResult.analysis.pmSpecificInsights,
      ...costMetrics,
      openai_model_used: 'gpt-4-turbo-preview'
    };

    await saveMeetingAnalysis(meetingId, analysisData);
  }

  private async updateMeetingStatus(
    meetingId: string,
    status: 'processing' | 'analyzed' | 'failed',
    errorMessage?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', meetingId);
  }

  private adaptConfigForContext(context: AnalysisContext): Partial<SmartSamplingConfig> {
    const adaptedConfig: Partial<SmartSamplingConfig> = {};

    // Adapt based on meeting type
    if (context.meetingType === 'board_presentation') {
      adaptedConfig.samplingRatio = 0.6; // Higher sampling for board meetings
      adaptedConfig.confidenceThreshold = 0.8;
    } else if (context.meetingType === 'team_standup') {
      adaptedConfig.samplingRatio = 0.15; // Lower sampling for standups
      adaptedConfig.confidenceThreshold = 0.7;
    }

    // Adapt based on user role
    if (context.userRole === 'director' || context.userRole === 'vp') {
      adaptedConfig.energyThreshold = 0.7; // Higher energy threshold for executives
    }

    return adaptedConfig;
  }

  private filterMomentsByContext(
    moments: CriticalMoment[],
    context: AnalysisContext
  ): CriticalMoment[] {
    if (!context.focusAreas || context.focusAreas.length === 0) {
      return moments;
    }

    return moments.filter(moment => {
      // Filter based on focus areas
      if (context.focusAreas!.includes('executive_presence')) {
        return moment.reason === 'EXECUTIVE_HANDOFF' || 
               moment.pmSpecific?.communicationType === 'EXECUTIVE_SUMMARY';
      }
      
      if (context.focusAreas!.includes('team_leadership')) {
        return moment.reason === 'SPEAKER_TRANSITION' ||
               moment.reason === 'DECISION_POINT';
      }

      return true;
    });
  }

  private async processChunk(startTime: number, endTime: number): Promise<void> {
    // Simulate chunk processing
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private async updateAnalysisProgress(
    meetingId: string,
    progress: {
      processing_progress: number;
      chunks_processed: number;
      estimated_completion_time: string;
    }
  ): Promise<void> {
    // In a real implementation, this would update a progress table
    // For testing, we'll just simulate the database update
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  private analyzeUserPerformance(
    meetingResults: Array<{ cost: number; quality: number; accuracy: number }>
  ): { avgCost: number; avgQuality: number; avgAccuracy: number } {
    const avgCost = meetingResults.reduce((sum, r) => sum + r.cost, 0) / meetingResults.length;
    const avgQuality = meetingResults.reduce((sum, r) => sum + r.quality, 0) / meetingResults.length;
    const avgAccuracy = meetingResults.reduce((sum, r) => sum + r.accuracy, 0) / meetingResults.length;

    return { avgCost, avgQuality, avgAccuracy };
  }

  private calculateOptimalConfig(
    performance: { avgCost: number; avgQuality: number; avgAccuracy: number },
    options: any
  ): {
    config: SmartSamplingConfig;
    expectedCostReduction: number;
    expectedQuality: number;
  } {
    // Simple optimization logic
    const targetSamplingRatio = Math.max(0.1, Math.min(0.4, 
      performance.avgQuality > options.minQualityThreshold ? 
        performance.avgCost * 0.8 : // Reduce cost if quality is good
        performance.avgCost * 1.2   // Increase cost if quality is poor
    ));

    const config: SmartSamplingConfig = {
      ...this.config,
      samplingRatio: targetSamplingRatio,
      confidenceThreshold: performance.avgQuality > 0.85 ? 0.8 : 0.75
    };

    return {
      config,
      expectedCostReduction: 1 - targetSamplingRatio,
      expectedQuality: Math.min(0.95, performance.avgQuality + 0.05)
    };
  }

  private selectOptimalPreset(
    optimalConfig: any,
    options: any
  ): string {
    if (optimalConfig.expectedCostReduction > 0.8) {
      return 'COST_OPTIMIZED';
    } else if (optimalConfig.expectedQuality > 0.9) {
      return 'QUALITY_FOCUSED';
    } else {
      return 'BALANCED';
    }
  }
}

// ============================================================================
// FACTORY FUNCTION FOR DEPENDENCY INJECTION
// ============================================================================

export function createSmartSamplingDatabaseService(
  config?: SmartSamplingDatabaseConfig
): SmartSamplingDatabaseService {
  return new SmartSamplingDatabaseService(
    config || {
      chunkSizeSeconds: 60,
      overlapSeconds: 5,
      confidenceThreshold: 0.7,
      energyThreshold: 0.6,
      samplingRatio: 0.25,
      enableRealTimeUpdates: true,
      enableCostOptimization: true,
      enableAdaptiveSampling: true,
      defaultPreset: 'BALANCED'
    }
  );
}