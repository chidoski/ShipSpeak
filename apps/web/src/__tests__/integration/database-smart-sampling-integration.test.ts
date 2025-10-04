/**
 * Integration Tests: Smart Sampling ↔ Database Integration
 * Tests the complete workflow of analyzing meetings and persisting results to database
 * 
 * TDD Phase: RED - Write failing tests first
 */

// Mock environment variables for testing BEFORE any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Mock the supabase module to avoid actual database calls in tests
jest.mock('../../../../../packages/database/supabase', () => ({
  saveMeetingUpload: jest.fn(),
  saveMeetingAnalysis: jest.fn(),
  getUserMeetings: jest.fn(),
  getSystemConfig: jest.fn(),
  subscribeMeetingAnalysis: jest.fn(),
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn() })) })),
      update: jest.fn(() => ({ eq: jest.fn() }))
    }))
  },
  supabaseAdmin: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })),
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn() })) })),
      delete: jest.fn(() => ({ eq: jest.fn() })),
      update: jest.fn(() => ({ eq: jest.fn() }))
    }))
  }
}));

import {
  SmartSamplingService,
  type SmartSamplingConfig,
  type PMAnalysisResult,
  type CriticalMoment,
  type AudioChunk
} from '../../services/smart-sampling.service';
import {
  saveMeetingUpload,
  saveMeetingAnalysis,
  getUserMeetings,
  getSystemConfig,
  subscribeMeetingAnalysis,
  supabase
} from '../../../../../packages/database/supabase';
import type {
  Meeting,
  MeetingAnalysis,
  MeetingTranscript,
  SamplingPreset
} from '../../../../../packages/database/types';

// Test data setup
const TEST_USER_ID = 'test-user-smart-sampling';
const TEST_MEETING_ID = 'test-meeting-smart-sampling';

describe('Smart Sampling ↔ Database Integration', () => {
  let smartSamplingService: SmartSamplingService;
  let testMeeting: Meeting;
  let mockAudioBuffer: AudioBuffer;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Initialize Smart Sampling service with test config
    const config: SmartSamplingConfig = {
      chunkSizeSeconds: 60,
      overlapSeconds: 5,
      confidenceThreshold: 0.7,
      energyThreshold: 0.6,
      samplingRatio: 0.25 // 25% sampling for cost optimization
    };
    
    smartSamplingService = new SmartSamplingService(config);

    // Create mock audio buffer for testing
    mockAudioBuffer = createMockAudioBuffer({
      duration: 1800, // 30 minutes
      testSegments: [
        { start: 0, end: 60, energy: 0.8, hasImportantKeywords: true },
        { start: 300, end: 360, energy: 0.9, hasImportantKeywords: true },
        { start: 900, end: 960, energy: 0.7, hasImportantKeywords: false },
        { start: 1500, end: 1560, energy: 0.85, hasImportantKeywords: true }
      ],
      testPatterns: {
        fillerWordCount: 12,
        confidenceIssues: 2,
        keyDecisionPoints: 3
      },
      testIssues: {
        hasFillerWords: true,
        hasConfidenceIssues: true,
        hasStructureProblems: false,
        hasInterruptions: true
      }
    });

    // Create test meeting record
    testMeeting = await createTestMeeting();

    // Clean up any existing test data
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Meeting Upload and Analysis Pipeline', () => {
    it('should upload meeting metadata and trigger Smart Sampling analysis', async () => {
      // Arrange
      const fileMetadata = {
        title: 'Executive Product Review',
        meeting_type: 'executive_review' as const,
        duration_seconds: 1800,
        participant_count: 4,
        original_filename: 'product-review-2024.wav',
        file_size_bytes: 45000000,
        file_format: 'audio/wav',
        storage_path: 'meetings/test-user/product-review-2024.wav',
        has_consent: true,
        consent_participants: ['John CEO', 'Sarah CTO', 'Mike PM', 'Lisa Design']
      };

      // Act
      const uploadedMeeting = await saveMeetingUpload(TEST_USER_ID, fileMetadata);

      // This should fail initially - integration service doesn't exist yet
      const analysisResult = await processAudioWithSmartSampling(
        uploadedMeeting.id,
        mockAudioBuffer,
        {
          preset: 'COST_OPTIMIZED',
          userPreferences: {
            prioritizeExecutivePresence: true,
            focusOnInfluenceSkills: true
          }
        }
      );

      // Assert
      expect(saveMeetingUpload).toHaveBeenCalledWith(TEST_USER_ID, fileMetadata);
      expect(uploadedMeeting).toBeDefined();
      expect(uploadedMeeting.status).toBe('uploaded');
      
      expect(analysisResult).toBeDefined();
      expect(analysisResult.costReduction).toBeGreaterThan(0.7); // >70% cost reduction
      expect(analysisResult.qualityScore).toBeGreaterThan(0.8); // >80% quality retained
    });

    it('should save Smart Sampling analysis results with detailed metadata', async () => {
      // Arrange
      const analysisResult: PMAnalysisResult = {
        originalDuration: 1800,
        analyzedDuration: 450, // 25% sampling
        costReduction: 0.75,
        analysis: {
          fillerWordsPerMinute: 3.2,
          confidenceScore: 72,
          executivePresenceScore: 78,
          influenceEffectiveness: 68,
          structureScore: 85,
          recommendations: [
            'Use more assertive language when presenting to executives',
            'Lead with recommendations before providing context'
          ],
          pmSpecificInsights: [
            'Strong product vocabulary usage',
            'Good stakeholder adaptation in technical discussions'
          ]
        },
        detectedIssues: ['CONFIDENCE_ISSUES', 'STRUCTURE_PROBLEMS', 'EXECUTIVE_PRESENCE']
      };

      const samplingMetadata = {
        sampling_preset: 'COST_OPTIMIZED' as const,
        sampling_percentage: 25.0,
        total_chunks: 16,
        analyzed_chunks: 4,
        processing_cost_usd: 0.10,
        estimated_full_cost_usd: 0.42,
        cost_savings_percentage: 75.0,
        processing_time_seconds: 45,
        openai_model_used: 'gpt-4-turbo-preview'
      };

      // Act
      const savedAnalysis = await saveMeetingAnalysis(TEST_MEETING_ID, {
        ...samplingMetadata,
        overall_score: analysisResult.analysis.confidenceScore / 10,
        executive_presence_score: analysisResult.analysis.executivePresenceScore / 10,
        influence_skills_score: analysisResult.analysis.influenceEffectiveness / 10,
        communication_structure_score: analysisResult.analysis.structureScore / 10,
        detailed_feedback: {
          criticalMoments: analysisResult.analyzedDuration / 60, // mock critical moments
          pmPatterns: analysisResult.analysis.pmSpecificInsights,
          recommendations: analysisResult.analysis.recommendations
        },
        improvement_areas: analysisResult.detectedIssues,
        strengths: analysisResult.analysis.pmSpecificInsights
      });

      // Assert
      expect(savedAnalysis).toBeDefined();
      expect(savedAnalysis.meeting_id).toBe(TEST_MEETING_ID);
      expect(savedAnalysis.sampling_preset).toBe('COST_OPTIMIZED');
      expect(savedAnalysis.cost_savings_percentage).toBe(75.0);
      expect(savedAnalysis.processing_cost_usd).toBe(0.10);
      expect(savedAnalysis.improvement_areas).toContain('CONFIDENCE_ISSUES');
    });

    it('should retrieve meeting history with analysis results and cost metrics', async () => {
      // Arrange - Create sample meeting analysis
      await saveMeetingAnalysis(TEST_MEETING_ID, {
        sampling_preset: 'BALANCED',
        sampling_percentage: 40.0,
        total_chunks: 20,
        analyzed_chunks: 8,
        overall_score: 7.5,
        executive_presence_score: 7.8,
        influence_skills_score: 6.8,
        communication_structure_score: 8.5,
        detailed_feedback: { summary: 'Good overall performance' },
        improvement_areas: ['CONFIDENCE_ISSUES'],
        strengths: ['CLEAR_COMMUNICATION'],
        processing_cost_usd: 0.18,
        estimated_full_cost_usd: 0.42,
        cost_savings_percentage: 57.1,
        processing_time_seconds: 62,
        openai_model_used: 'gpt-4-turbo-preview'
      });

      // Act
      const userMeetings = await getUserMeetings(TEST_USER_ID, 5);

      // Assert
      expect(userMeetings).toHaveLength(1);
      expect(userMeetings[0].meeting_analyses).toBeDefined();
      expect(userMeetings[0].meeting_analyses[0].sampling_preset).toBe('BALANCED');
      expect(userMeetings[0].meeting_analyses[0].cost_savings_percentage).toBe(57.1);
      expect(userMeetings[0].meeting_analyses[0].processing_cost_usd).toBe(0.18);
    });
  });

  describe('Sampling Configuration and Optimization', () => {
    it('should load and apply different sampling presets from system configuration', async () => {
      // Arrange
      const mockSystemConfig = {
        COST_OPTIMIZED: {
          sampling_percentage: 15,
          chunk_selection: 'strategic',
          cost_target: 'minimal'
        },
        QUALITY_FOCUSED: {
          sampling_percentage: 60,
          chunk_selection: 'comprehensive',
          cost_target: 'premium'
        }
      };

      (getSystemConfig as jest.Mock).mockResolvedValue(mockSystemConfig);

      // Act
      const costOptimizedResult = await applySamplingPreset(
        mockAudioBuffer,
        'COST_OPTIMIZED'
      );
      
      const qualityFocusedResult = await applySamplingPreset(
        mockAudioBuffer,
        'QUALITY_FOCUSED'
      );

      // Assert
      expect(getSystemConfig).toHaveBeenCalledWith('smart_sampling_presets');
      
      expect(costOptimizedResult.costReduction).toBeGreaterThan(0.8); // >80% cost reduction
      expect(costOptimizedResult.qualityScore).toBeGreaterThan(0.75); // Still good quality

      expect(qualityFocusedResult.costReduction).toBeLessThan(0.5); // <50% cost reduction
      expect(qualityFocusedResult.qualityScore).toBeGreaterThan(0.9); // Higher quality
    });

    it('should adapt sampling strategy based on meeting type and user preferences', async () => {
      // Arrange
      const boardMeetingBuffer = createMockAudioBuffer({
        duration: 3600, // 60 minutes
        meetingType: 'board_presentation'
      });

      const standupBuffer = createMockAudioBuffer({
        duration: 900, // 15 minutes
        meetingType: 'team_standup'
      });

      // Act
      const boardResult = await adaptiveSamplingAnalysis(
        boardMeetingBuffer,
        {
          meetingType: 'board_presentation',
          userRole: 'director',
          focusAreas: ['executive_presence', 'strategic_communication']
        }
      );

      const standupResult = await adaptiveSamplingAnalysis(
        standupBuffer,
        {
          meetingType: 'team_standup',
          userRole: 'senior_pm',
          focusAreas: ['team_leadership', 'decision_communication']
        }
      );

      // Assert
      // Board meetings should have higher sampling for executive presence
      expect(boardResult.analyzedDuration).toBeGreaterThan(standupResult.analyzedDuration);
      expect(boardResult.selectedMoments).toContain(
        expect.objectContaining({
          reason: 'EXECUTIVE_HANDOFF'
        })
      );

      // Standup should focus on efficiency and quick decisions
      expect(standupResult.costReduction).toBeGreaterThan(boardResult.costReduction);
    });

    it('should track and optimize sampling performance over time', async () => {
      // Arrange - Simulate multiple meetings for the same user
      const meetingResults = [
        { cost: 0.12, quality: 0.85, accuracy: 0.88 },
        { cost: 0.08, quality: 0.82, accuracy: 0.90 },
        { cost: 0.10, quality: 0.87, accuracy: 0.92 }
      ];

      // Act
      const optimizationResult = await optimizeSamplingForUser(
        TEST_USER_ID,
        meetingResults,
        {
          targetCostReduction: 0.75,
          minQualityThreshold: 0.85,
          learningRate: 0.1
        }
      );

      // Assert
      expect(optimizationResult).toBeDefined();
      expect(optimizationResult.recommendedPreset).toBeDefined();
      expect(optimizationResult.expectedCostReduction).toBeGreaterThan(0.75);
      expect(optimizationResult.expectedQuality).toBeGreaterThan(0.85);
      
      // Should learn from user patterns
      expect(optimizationResult.personalizedConfig).toBeDefined();
      expect(optimizationResult.personalizedConfig.samplingRatio).toBeGreaterThan(0.1);
      expect(optimizationResult.personalizedConfig.samplingRatio).toBeLessThan(0.4);
    });
  });

  describe('Real-time Analysis and Streaming', () => {
    it('should provide real-time analysis progress updates via database subscriptions', async () => {
      // Arrange
      const progressUpdates: any[] = [];
      const mockSubscription = {
        unsubscribe: jest.fn()
      };

      (subscribeMeetingAnalysis as jest.Mock).mockImplementation((meetingId, callback) => {
        // Simulate progress updates
        setTimeout(() => {
          callback({
            eventType: 'UPDATE',
            new: {
              id: 'analysis-001',
              meeting_id: meetingId,
              processing_progress: 25,
              chunks_processed: 2,
              estimated_completion_time: new Date(Date.now() + 60000).toISOString()
            }
          });
        }, 100);

        return mockSubscription;
      });

      // Act
      const subscription = subscribeMeetingAnalysis(TEST_MEETING_ID, (update) => {
        progressUpdates.push(update);
      });

      // Simulate streaming analysis
      await streamingAnalysisWithProgress(
        TEST_MEETING_ID,
        mockAudioBuffer,
        {
          chunkSize: 30, // 30-second chunks
          progressCallback: (progress) => {
            progressUpdates.push({ type: 'progress', data: progress });
          }
        }
      );

      // Wait for updates
      await new Promise(resolve => setTimeout(resolve, 200));

      // Assert
      expect(subscribeMeetingAnalysis).toHaveBeenCalledWith(
        TEST_MEETING_ID,
        expect.any(Function)
      );
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[0]).toMatchObject({
        eventType: 'UPDATE',
        new: expect.objectContaining({
          meeting_id: TEST_MEETING_ID,
          processing_progress: expect.any(Number)
        })
      });

      subscription.unsubscribe();
    });

    it('should handle analysis failures and update meeting status accordingly', async () => {
      // Arrange
      const corruptedAudioBuffer = createMockAudioBuffer({
        duration: 1800,
        isCorrupted: true
      });

      // Act & Assert
      await expect(processAudioWithSmartSampling(
        TEST_MEETING_ID,
        corruptedAudioBuffer,
        { preset: 'BALANCED' }
      )).rejects.toThrow('Audio analysis failed');

      // Should update meeting status to 'failed'
      expect(supabase.from).toHaveBeenCalledWith('meetings');
      // Verify status update call pattern
    });
  });

  describe('Transcript Storage and Chunking', () => {
    it('should save meeting transcripts with smart sampling metadata', async () => {
      // Arrange
      const analysisResult = await smartSamplingService.analyzeWithSampling(mockAudioBuffer);
      const criticalMoments = mockAudioBuffer._testSegments?.map((segment: any, index: number) => ({
        chunk_index: index,
        start_time_seconds: segment.start,
        end_time_seconds: segment.end,
        transcript_text: `Mock transcript for segment ${index + 1}`,
        speaker_labels: { speakers: ['Speaker 1', 'Speaker 2'] },
        confidence_score: 0.95,
        was_analyzed: segment.hasImportantKeywords,
        sampling_reason: segment.hasImportantKeywords ? 'High value content detected' : 'Skipped for cost optimization'
      }));

      // Act
      const savedTranscripts = await saveMeetingTranscripts(
        TEST_MEETING_ID,
        criticalMoments || []
      );

      // Assert
      expect(savedTranscripts).toHaveLength(4); // 4 test segments
      expect(savedTranscripts.filter(t => t.was_analyzed)).toHaveLength(3); // 3 had important keywords
      expect(savedTranscripts[0]).toMatchObject({
        meeting_id: TEST_MEETING_ID,
        chunk_index: 0,
        was_analyzed: true,
        sampling_reason: 'High value content detected'
      });
    });

    it('should support querying transcripts by sampling criteria', async () => {
      // Arrange - Save transcripts with different sampling reasons
      await saveMeetingTranscripts(TEST_MEETING_ID, [
        {
          chunk_index: 0,
          start_time_seconds: 0,
          end_time_seconds: 60,
          transcript_text: 'Executive summary discussion',
          was_analyzed: true,
          sampling_reason: 'EXECUTIVE_HANDOFF'
        },
        {
          chunk_index: 1,
          start_time_seconds: 300,
          end_time_seconds: 360,
          transcript_text: 'Technical details',
          was_analyzed: false,
          sampling_reason: 'LOW_PRIORITY_CONTENT'
        }
      ]);

      // Act
      const analyzedTranscripts = await getAnalyzedTranscripts(TEST_MEETING_ID);
      const skippedTranscripts = await getSkippedTranscripts(TEST_MEETING_ID);

      // Assert
      expect(analyzedTranscripts).toHaveLength(1);
      expect(analyzedTranscripts[0].sampling_reason).toBe('EXECUTIVE_HANDOFF');
      
      expect(skippedTranscripts).toHaveLength(1);
      expect(skippedTranscripts[0].sampling_reason).toBe('LOW_PRIORITY_CONTENT');
    });
  });

  // Helper functions - These should fail initially since services don't exist yet
  async function processAudioWithSmartSampling(
    meetingId: string,
    audioBuffer: AudioBuffer,
    options: { preset: string; userPreferences?: any }
  ): Promise<PMAnalysisResult> {
    throw new Error('Smart Sampling Database Integration service not implemented');
  }

  async function applySamplingPreset(
    audioBuffer: AudioBuffer,
    preset: string
  ): Promise<{ costReduction: number; qualityScore: number; selectedMoments: CriticalMoment[] }> {
    throw new Error('Sampling preset application not implemented');
  }

  async function adaptiveSamplingAnalysis(
    audioBuffer: AudioBuffer,
    context: { meetingType: string; userRole: string; focusAreas: string[] }
  ): Promise<{ analyzedDuration: number; costReduction: number; selectedMoments: CriticalMoment[] }> {
    throw new Error('Adaptive sampling analysis not implemented');
  }

  async function optimizeSamplingForUser(
    userId: string,
    meetingResults: any[],
    options: any
  ): Promise<{ recommendedPreset: string; expectedCostReduction: number; expectedQuality: number; personalizedConfig: any }> {
    throw new Error('User sampling optimization not implemented');
  }

  async function streamingAnalysisWithProgress(
    meetingId: string,
    audioBuffer: AudioBuffer,
    options: { chunkSize: number; progressCallback: (progress: any) => void }
  ): Promise<void> {
    throw new Error('Streaming analysis not implemented');
  }

  async function saveMeetingTranscripts(
    meetingId: string,
    transcripts: any[]
  ): Promise<MeetingTranscript[]> {
    throw new Error('Meeting transcript storage not implemented');
  }

  async function getAnalyzedTranscripts(meetingId: string): Promise<MeetingTranscript[]> {
    throw new Error('Transcript querying not implemented');
  }

  async function getSkippedTranscripts(meetingId: string): Promise<MeetingTranscript[]> {
    throw new Error('Transcript querying not implemented');
  }

  // Test utility functions
  function createMockAudioBuffer(options: {
    duration: number;
    testSegments?: any[];
    testPatterns?: any;
    testIssues?: any;
    meetingType?: string;
    isCorrupted?: boolean;
  }): AudioBuffer {
    const buffer = new (global as any).AudioBuffer({
      duration: options.duration,
      numberOfChannels: 1,
      sampleRate: 44100
    });

    // Add test data for Smart Sampling Service
    (buffer as any)._testSegments = options.testSegments;
    (buffer as any)._testPatterns = options.testPatterns;
    (buffer as any)._testIssues = options.testIssues;
    (buffer as any)._meetingType = options.meetingType;
    (buffer as any)._isCorrupted = options.isCorrupted;

    return buffer;
  }

  async function createTestMeeting(): Promise<Meeting> {
    const meetingData = {
      id: TEST_MEETING_ID,
      user_id: TEST_USER_ID,
      title: 'Test Executive Review',
      meeting_type: 'executive_review' as const,
      duration_seconds: 1800,
      participant_count: 4,
      original_filename: 'test-meeting.wav',
      file_size_bytes: 45000000,
      file_format: 'audio/wav',
      storage_path: 'test/meetings/test-meeting.wav',
      status: 'uploaded' as const,
      error_message: null,
      has_consent: true,
      consent_participants: ['John', 'Sarah', 'Mike', 'Lisa'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return meetingData;
  }

  async function cleanupTestData() {
    // Mock cleanup operations
    const cleanup = jest.fn();
    await cleanup();
  }
});