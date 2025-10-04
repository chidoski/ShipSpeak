/**
 * Smart Sampling Service TDD Tests
 * Following RED-GREEN-REFACTOR methodology
 */

import { SmartSamplingService } from '../../../services/smart-sampling.service';

describe('Smart Sampling Service - TDD', () => {
  let smartSamplingService: SmartSamplingService;

  beforeEach(() => {
    jest.clearAllMocks();
    smartSamplingService = new SmartSamplingService();
  });

  describe('Configuration Management', () => {
    it('should provide all predefined configurations', () => {
      const configs = smartSamplingService.getConfigs();
      
      expect(configs).toHaveLength(4);
      expect(configs.find(c => c.name === 'COST_OPTIMIZED')).toBeDefined();
      expect(configs.find(c => c.name === 'BALANCED')).toBeDefined();
      expect(configs.find(c => c.name === 'QUALITY_FOCUSED')).toBeDefined();
      expect(configs.find(c => c.name === 'ENTERPRISE')).toBeDefined();
    });

    it('should have correct COST_OPTIMIZED configuration', () => {
      const configs = smartSamplingService.getConfigs();
      const config = configs.find(c => c.name === 'COST_OPTIMIZED');
      
      expect(config).toMatchObject({
        name: 'COST_OPTIMIZED',
        samplingRatio: 0.25,
        chunkSizeSeconds: 30,
        overlapSeconds: 5,
        confidenceThreshold: 0.8,
        energyThreshold: 0.7
      });
    });

    it('should have correct BALANCED configuration', () => {
      const configs = smartSamplingService.getConfigs();
      const config = configs.find(c => c.name === 'BALANCED');
      
      expect(config).toMatchObject({
        name: 'BALANCED',
        samplingRatio: 0.5,
        chunkSizeSeconds: 20,
        overlapSeconds: 3,
        confidenceThreshold: 0.85,
        energyThreshold: 0.6
      });
    });

    it('should have correct QUALITY_FOCUSED configuration', () => {
      const configs = smartSamplingService.getConfigs();
      const config = configs.find(c => c.name === 'QUALITY_FOCUSED');
      
      expect(config).toMatchObject({
        name: 'QUALITY_FOCUSED',
        samplingRatio: 0.75,
        chunkSizeSeconds: 15,
        overlapSeconds: 2,
        confidenceThreshold: 0.9,
        energyThreshold: 0.5
      });
    });

    it('should validate custom configuration parameters', () => {
      const validCustomConfig = {
        samplingRatio: 0.3,
        chunkSizeSeconds: 25,
        overlapSeconds: 4,
        confidenceThreshold: 0.75,
        energyThreshold: 0.65
      };

      expect(() => {
        smartSamplingService.startAnalysis('test-meeting', 'user-123', 'CUSTOM', validCustomConfig);
      }).not.toThrow();
    });

    it('should reject invalid custom configuration parameters', async () => {
      const invalidConfigs = [
        { samplingRatio: 1.5 }, // > 1
        { samplingRatio: -0.1 }, // < 0
        { confidenceThreshold: 1.1 }, // > 1
        { confidenceThreshold: -0.1 } // < 0
      ];

      for (const invalidParams of invalidConfigs) {
        await expect(
          smartSamplingService.startAnalysis('test-meeting', 'user-123', 'CUSTOM', invalidParams)
        ).rejects.toThrow();
      }
    });
  });

  describe('Analysis Workflow', () => {
    const mockMeetingId = '123e4567-e89b-12d3-a456-426614174000';
    const mockUserId = '987fcdeb-51a2-43d1-b234-567890123456';

    it('should start analysis and create analysis record', async () => {
      const result = await smartSamplingService.startAnalysis(mockMeetingId, mockUserId, 'BALANCED');

      expect(result.id).toBeDefined();
      expect(result.meetingId).toBe(mockMeetingId);
      expect(result.userId).toBe(mockUserId);
      expect(result.status).toBe('PROCESSING');
      expect(result.progress).toBe(0);
      expect(result.config.name).toBe('BALANCED');
      expect(result.startedAt).toBeInstanceOf(Date);
    });

    it('should reject analysis for non-existent meeting', async () => {
      await expect(
        smartSamplingService.startAnalysis('non-existent-meeting', mockUserId, 'BALANCED')
      ).rejects.toThrow('Meeting not found');
    });

    it('should reject analysis with invalid configuration', async () => {
      await expect(
        smartSamplingService.startAnalysis(mockMeetingId, mockUserId, 'INVALID_CONFIG')
      ).rejects.toThrow('Invalid configuration');
    });

    it('should handle custom configuration correctly', async () => {
      const customConfig = {
        samplingRatio: 0.6,
        chunkSizeSeconds: 25,
        confidenceThreshold: 0.85
      };

      const result = await smartSamplingService.startAnalysis(mockMeetingId, mockUserId, 'CUSTOM', customConfig);

      expect(result.config.name).toBe('CUSTOM');
      expect(result.config.samplingRatio).toBe(0.6);
      expect(result.config.chunkSizeSeconds).toBe(25);
      expect(result.config.confidenceThreshold).toBe(0.85);
    });
  });

  describe('Analysis Retrieval', () => {
    const mockUserId = '987fcdeb-51a2-43d1-b234-567890123456';

    it('should get analysis by ID', async () => {
      const analysis = await smartSamplingService.getAnalysis('analysis-123', mockUserId);

      expect(analysis).toBeTruthy();
      expect(analysis?.id).toBe('analysis-123');
      expect(analysis?.userId).toBe(mockUserId);
      expect(analysis?.status).toBe('PROCESSING');
    });

    it('should get completed analysis with results', async () => {
      const analysis = await smartSamplingService.getAnalysis('analysis-completed', mockUserId);

      expect(analysis).toBeTruthy();
      expect(analysis?.status).toBe('COMPLETED');
      expect(analysis?.progress).toBe(100);
      expect(analysis?.results).toBeDefined();
      expect(analysis?.results?.costReduction).toBeGreaterThan(0);
      expect(analysis?.results?.qualityScore).toBeGreaterThan(0);
      expect(analysis?.completedAt).toBeInstanceOf(Date);
    });

    it('should return null for non-existent analysis', async () => {
      const analysis = await smartSamplingService.getAnalysis('non-existent', mockUserId);
      expect(analysis).toBeNull();
    });
  });

  describe('Critical Moments', () => {
    const mockUserId = '987fcdeb-51a2-43d1-b234-567890123456';

    it('should get critical moments for analysis', async () => {
      const result = await smartSamplingService.getCriticalMoments('analysis-123', mockUserId);

      expect(result.moments).toBeInstanceOf(Array);
      expect(result.totalMoments).toBeGreaterThan(0);
      expect(result.totalDuration).toBeGreaterThan(0);
      expect(result.moments[0]).toMatchObject({
        startTime: expect.any(Number),
        endTime: expect.any(Number),
        energyLevel: expect.any(Number),
        confidence: expect.any(Number),
        reason: expect.any(String)
      });
    });

    it('should filter moments by type', async () => {
      const result = await smartSamplingService.getCriticalMoments('analysis-123', mockUserId, { type: 'DECISION_POINT' });

      expect(result.moments).toBeInstanceOf(Array);
      result.moments.forEach(moment => {
        expect(moment.reason).toBe('DECISION_POINT');
      });
    });

    it('should filter moments by PM pattern', async () => {
      const result = await smartSamplingService.getCriticalMoments('analysis-123', mockUserId, { pmPattern: 'EXECUTIVE_SUMMARY' });

      expect(result.moments).toBeInstanceOf(Array);
      result.moments.forEach(moment => {
        expect(moment.pmSpecific?.communicationType).toBe('EXECUTIVE_SUMMARY');
      });
    });
  });

  describe('PM Insights', () => {
    const mockUserId = '987fcdeb-51a2-43d1-b234-567890123456';

    it('should generate comprehensive PM insights', async () => {
      const insights = await smartSamplingService.getPMInsights('analysis-123', mockUserId);

      expect(insights).toMatchObject({
        executivePresence: {
          score: expect.any(Number),
          strengths: expect.any(Array),
          improvements: expect.any(Array)
        },
        influenceSkills: {
          score: expect.any(Number),
          persuasionTechniques: expect.any(Array),
          stakeholderAlignment: expect.any(Number)
        },
        communicationStructure: {
          clarity: expect.any(Number),
          conciseness: expect.any(Number),
          answerFirst: expect.any(Boolean)
        },
        dataStorytelling: {
          score: expect.any(Number),
          visualSupport: expect.any(Boolean),
          contextualizing: expect.any(Number)
        },
        overallAssessment: {
          score: expect.any(Number),
          level: expect.stringMatching(/BEGINNER|INTERMEDIATE|ADVANCED|EXPERT/),
          recommendations: expect.any(Array)
        }
      });
    });

    it('should have valid score ranges', async () => {
      const insights = await smartSamplingService.getPMInsights('analysis-123', mockUserId);

      expect(insights.executivePresence.score).toBeGreaterThanOrEqual(0);
      expect(insights.executivePresence.score).toBeLessThanOrEqual(100);
      expect(insights.influenceSkills.score).toBeGreaterThanOrEqual(0);
      expect(insights.influenceSkills.score).toBeLessThanOrEqual(100);
      expect(insights.overallAssessment.score).toBeGreaterThanOrEqual(0);
      expect(insights.overallAssessment.score).toBeLessThanOrEqual(100);
    });
  });

  describe('Export Functionality', () => {
    const mockUserId = '987fcdeb-51a2-43d1-b234-567890123456';

    it('should export analysis in JSON format', async () => {
      const exportResult = await smartSamplingService.exportAnalysis('analysis-123', mockUserId, {
        format: 'json',
        includeMoments: true,
        includePMInsights: true
      });

      expect(exportResult).toMatchObject({
        exportId: expect.any(String),
        downloadUrl: expect.any(String),
        expiresAt: expect.any(Date),
        format: 'json'
      });
      expect(exportResult.downloadUrl).toContain('export');
    });

    it('should export analysis in PDF format', async () => {
      const exportResult = await smartSamplingService.exportAnalysis('analysis-123', mockUserId, {
        format: 'pdf',
        includeCharts: true,
        includeTranscript: true
      });

      expect(exportResult.format).toBe('pdf');
      expect(exportResult.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('Analytics', () => {
    const mockUserId = '987fcdeb-51a2-43d1-b234-567890123456';

    it('should provide comprehensive analytics', async () => {
      const analytics = await smartSamplingService.getAnalytics(mockUserId, {
        timeRange: '30d'
      });

      expect(analytics).toMatchObject({
        totalAnalyses: expect.any(Number),
        totalCostSavings: expect.any(Number),
        averageQualityScore: expect.any(Number),
        trendData: expect.any(Array),
        topInsights: expect.any(Array),
        configUsage: expect.any(Object)
      });
    });

    it('should have valid trend data structure', async () => {
      const analytics = await smartSamplingService.getAnalytics(mockUserId, {
        timeRange: '7d'
      });

      expect(analytics.trendData.length).toBeGreaterThan(0);
      analytics.trendData.forEach(trend => {
        expect(trend).toMatchObject({
          date: expect.any(String),
          analyses: expect.any(Number),
          costSavings: expect.any(Number),
          qualityScore: expect.any(Number)
        });
      });
    });

    it('should track configuration usage', async () => {
      const analytics = await smartSamplingService.getAnalytics(mockUserId, {
        timeRange: '30d'
      });

      expect(analytics.configUsage).toHaveProperty('COST_OPTIMIZED');
      expect(analytics.configUsage).toHaveProperty('BALANCED');
      expect(analytics.configUsage).toHaveProperty('QUALITY_FOCUSED');
      expect(analytics.configUsage).toHaveProperty('ENTERPRISE');
    });
  });

  describe('Batch Analysis', () => {
    const mockUserId = '987fcdeb-51a2-43d1-b234-567890123456';
    const mockMeetingIds = ['meeting-1', 'meeting-2', 'meeting-3'];

    it('should start batch analysis successfully', async () => {
      const batch = await smartSamplingService.startBatchAnalysis(
        mockUserId,
        mockMeetingIds,
        'BALANCED'
      );

      expect(batch).toMatchObject({
        id: expect.any(String),
        userId: mockUserId,
        status: 'QUEUED',
        progress: 0,
        totalMeetings: 3,
        completedMeetings: 0,
        failedMeetings: 0,
        results: [],
        estimatedCompletion: expect.any(Date),
        costEstimate: expect.objectContaining({
          originalCost: expect.any(Number),
          optimizedCost: expect.any(Number),
          savings: expect.any(Number),
          savingsPercentage: expect.any(Number),
          currency: 'USD'
        })
      });
    });

    it('should reject batch with too many meetings', async () => {
      const largeBatch = Array.from({ length: 101 }, (_, i) => `meeting-${i}`);

      await expect(
        smartSamplingService.startBatchAnalysis(mockUserId, largeBatch, 'BALANCED')
      ).rejects.toThrow('Maximum batch size is 100 meetings');
    });

    it('should get batch analysis status', async () => {
      const batch = await smartSamplingService.getBatchAnalysis('batch-123', mockUserId);

      expect(batch).toBeTruthy();
      expect(batch?.status).toBe('PROCESSING');
      expect(batch?.progress).toBeGreaterThan(0);
      expect(batch?.totalMeetings).toBeGreaterThan(0);
    });

    it('should return null for non-existent batch', async () => {
      const batch = await smartSamplingService.getBatchAnalysis('non-existent', mockUserId);
      expect(batch).toBeNull();
    });
  });

  describe('Mock Data Generation', () => {
    it('should generate valid critical moments', async () => {
      const result = await smartSamplingService.getCriticalMoments('analysis-123', 'user-123');
      const moments = result.moments;

      expect(moments).toHaveLength(2);
      
      moments.forEach(moment => {
        expect(moment.startTime).toBeGreaterThanOrEqual(0);
        expect(moment.endTime).toBeGreaterThan(moment.startTime);
        expect(moment.energyLevel).toBeGreaterThanOrEqual(0);
        expect(moment.energyLevel).toBeLessThanOrEqual(1);
        expect(moment.confidence).toBeGreaterThanOrEqual(0);
        expect(moment.confidence).toBeLessThanOrEqual(1);
        expect(['HIGH_ENERGY_AND_KEYWORDS', 'SPEAKER_TRANSITION', 'POST_SILENCE_HIGH_ENERGY', 'DECISION_POINT', 'EXECUTIVE_HANDOFF', 'STAKEHOLDER_PUSHBACK'])
          .toContain(moment.reason);
      });
    });

    it('should generate valid PM insights', async () => {
      const insights = await smartSamplingService.getPMInsights('analysis-123', 'user-123');

      // Validate score ranges
      expect(insights.executivePresence.score).toBeGreaterThanOrEqual(0);
      expect(insights.executivePresence.score).toBeLessThanOrEqual(100);
      expect(insights.influenceSkills.score).toBeGreaterThanOrEqual(0);
      expect(insights.influenceSkills.score).toBeLessThanOrEqual(100);
      expect(insights.communicationStructure.clarity).toBeGreaterThanOrEqual(0);
      expect(insights.communicationStructure.clarity).toBeLessThanOrEqual(100);
      expect(insights.communicationStructure.conciseness).toBeGreaterThanOrEqual(0);
      expect(insights.communicationStructure.conciseness).toBeLessThanOrEqual(100);
      expect(insights.dataStorytelling.score).toBeGreaterThanOrEqual(0);
      expect(insights.dataStorytelling.score).toBeLessThanOrEqual(100);
      expect(insights.overallAssessment.score).toBeGreaterThanOrEqual(0);
      expect(insights.overallAssessment.score).toBeLessThanOrEqual(100);

      // Validate arrays
      expect(insights.executivePresence.strengths).toBeInstanceOf(Array);
      expect(insights.executivePresence.improvements).toBeInstanceOf(Array);
      expect(insights.influenceSkills.persuasionTechniques).toBeInstanceOf(Array);
      expect(insights.overallAssessment.recommendations).toBeInstanceOf(Array);

      // Validate enums
      expect(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
        .toContain(insights.overallAssessment.level);
    });
  });
});