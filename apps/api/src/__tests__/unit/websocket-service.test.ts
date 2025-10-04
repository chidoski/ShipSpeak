/**
 * WebSocket Service Unit Tests
 * Testing WebSocket service functionality in isolation
 */

import { Server as HTTPServer, createServer } from 'http';
import { WebSocketService } from '../../services/websocket.service';

describe('WebSocketService', () => {
  let httpServer: HTTPServer;
  let webSocketService: WebSocketService;

  beforeAll(() => {
    httpServer = createServer();
    webSocketService = new WebSocketService(httpServer);
  });

  afterAll(() => {
    webSocketService.close();
    httpServer.close();
  });

  describe('Service Creation', () => {
    it('should create WebSocket service instance', () => {
      expect(webSocketService).toBeInstanceOf(WebSocketService);
    });

    it('should start with zero connected users', () => {
      expect(webSocketService.getConnectedUsersCount()).toBe(0);
    });
  });

  describe('Progress Updates', () => {
    it('should emit meeting analysis progress', () => {
      const progressData = {
        meetingId: 'meeting-123',
        analysisId: 'analysis-123',
        progress: 50,
        stage: 'transcription',
        message: 'Processing audio...',
        timestamp: new Date()
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisProgress(progressData);
      }).not.toThrow();
    });

    it('should emit smart sampling progress', () => {
      const progressData = {
        meetingId: 'meeting-123',
        analysisId: 'analysis-123',
        progress: 75,
        stage: 'moment-detection',
        message: 'Detecting critical moments...',
        timestamp: new Date(),
        momentsFound: 8,
        costSavings: 0.65
      };

      expect(() => {
        webSocketService.emitSmartSamplingProgress(progressData);
      }).not.toThrow();
    });

    it('should emit scenario generation progress', () => {
      const progressData = {
        generationId: 'generation-123',
        progress: 30,
        stage: 'scenario-creation',
        message: 'Generating scenarios...',
        timestamp: new Date(),
        scenariosCompleted: 2,
        totalScenarios: 5
      };

      expect(() => {
        webSocketService.emitScenarioGenerationProgress(progressData);
      }).not.toThrow();
    });

    it('should emit batch progress updates', () => {
      const progressData = {
        batchId: 'batch-123',
        progress: 60,
        stage: 'processing',
        message: 'Processing batch...',
        timestamp: new Date(),
        completedMeetings: 6,
        totalMeetings: 10,
        failedMeetings: 0,
        estimatedCompletion: new Date(Date.now() + 180000)
      };

      expect(() => {
        webSocketService.emitBatchProgress(progressData);
      }).not.toThrow();
    });
  });

  describe('Session Updates', () => {
    it('should emit practice session updates', () => {
      const sessionUpdate = {
        sessionId: 'session-123',
        event: 'response-submitted' as const,
        score: 85,
        feedback: {
          strengths: ['Clear communication'],
          improvements: ['More specific examples']
        }
      };

      expect(() => {
        webSocketService.emitPracticeSessionUpdate(sessionUpdate);
      }).not.toThrow();
    });

    it('should emit coaching hints', () => {
      expect(() => {
        webSocketService.emitCoachingHint(
          'session-123',
          'Consider starting with your conclusion',
          'speaking-pattern-detected',
          0.85
        );
      }).not.toThrow();
    });
  });

  describe('Completion Events', () => {
    it('should emit meeting analysis completion', () => {
      const results = {
        summary: 'Analysis completed successfully',
        insights: ['Strong executive presence', 'Clear communication'],
        score: 85
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisCompleted('meeting-123', 'analysis-123', results);
      }).not.toThrow();
    });

    it('should emit smart sampling completion', () => {
      const results = {
        costReduction: 0.75,
        qualityScore: 0.88,
        selectedMoments: [
          { startTime: 120, endTime: 180, reason: 'DECISION_POINT' }
        ],
        pmAnalysis: {
          executivePresence: { score: 78 },
          communicationStructure: { clarity: 88 }
        }
      };

      expect(() => {
        webSocketService.emitSmartSamplingCompleted('analysis-123', results);
      }).not.toThrow();
    });

    it('should emit scenario generation completion', () => {
      const scenarios = [
        {
          id: 'scenario-1',
          title: 'Executive Stakeholder Alignment',
          category: 'EXECUTIVE_PRESENCE',
          difficulty: 4
        }
      ];

      expect(() => {
        webSocketService.emitScenarioGenerationCompleted('generation-123', scenarios);
      }).not.toThrow();
    });
  });

  describe('Error Events', () => {
    it('should emit meeting analysis errors', () => {
      const error = {
        code: 'PROCESSING_FAILED',
        message: 'Audio processing failed due to unsupported format'
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisError('meeting-123', 'analysis-123', error);
      }).not.toThrow();
    });
  });

  describe('Utility Methods', () => {
    it('should check user connection status', () => {
      const isConnected = webSocketService.isUserConnected('user-123');
      expect(typeof isConnected).toBe('boolean');
      expect(isConnected).toBe(false); // No users connected in unit test
    });

    it('should get user rooms', () => {
      const rooms = webSocketService.getUserRooms('user-123');
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBe(0); // No rooms joined in unit test
    });

    it('should get room users', () => {
      const users = webSocketService.getRoomUsers('meeting-123');
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(0); // No users in room in unit test
    });
  });
});