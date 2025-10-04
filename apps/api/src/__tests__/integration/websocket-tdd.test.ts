/**
 * WebSocket Integration Tests - TDD Extension
 * Following RED-GREEN-REFACTOR methodology
 * Comprehensive testing of advanced WebSocket scenarios
 */

import { Server as HTTPServer, createServer } from 'http';
import Client from 'socket.io-client';
import { WebSocketService } from '../../services/websocket.service';

// Mock the JWT service import
jest.mock('../../utils/jwt', () => ({
  jwtService: {
    verifyToken: jest.fn(),
    generateToken: jest.fn()
  }
}));

// Import the mocked service
import { jwtService } from '../../utils/jwt';

describe('WebSocket Integration - TDD Advanced', () => {
  let httpServer: HTTPServer;
  let webSocketService: WebSocketService;
  let mockUser: any;
  let validToken: string;

  beforeAll(() => {
    // Setup mock user
    mockUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };

    validToken = 'valid-jwt-token';

    // Configure JWT mock
    (jwtService.verifyToken as jest.Mock).mockImplementation((token: string) => {
      if (token === validToken) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    });

    (jwtService.generateToken as jest.Mock).mockReturnValue(validToken);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create fresh server and service for each test
    httpServer = createServer();
    webSocketService = new WebSocketService(httpServer);
    
    // Start server on random port
    httpServer.listen(0);
  });

  afterEach(() => {
    webSocketService.close();
    httpServer.close();
  });

  describe('Authentication & Authorization - TDD', () => {
    it('should successfully authenticate with valid JWT token', async () => {
      const port = (httpServer.address() as any)?.port;
      const client = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      const connected = await new Promise<boolean>((resolve) => {
        client.on('connect', () => resolve(true));
        client.on('connect_error', () => resolve(false));
        setTimeout(() => resolve(false), 1000);
      });

      expect(connected).toBe(true);
      expect(jwtService.verifyToken).toHaveBeenCalledWith(validToken);
      
      client.close();
    });

    it('should reject authentication with invalid JWT token', async () => {
      const port = (httpServer.address() as any)?.port;
      const client = Client(`http://localhost:${port}`, {
        auth: { token: 'invalid-token' }
      });

      const error = await new Promise<any>((resolve) => {
        client.on('connect_error', resolve);
        client.on('connect', () => resolve(null));
        setTimeout(() => resolve(null), 1000);
      });

      expect(error).toBeTruthy();
      expect(error.message).toContain('Authentication failed');
      expect(jwtService.verifyToken).toHaveBeenCalledWith('invalid-token');
      
      client.close();
    });

    it('should reject connection without authentication token', async () => {
      const port = (httpServer.address() as any)?.port;
      const client = Client(`http://localhost:${port}`);

      const error = await new Promise<any>((resolve) => {
        client.on('connect_error', resolve);
        client.on('connect', () => resolve(null));
        setTimeout(() => resolve(null), 1000);
      });

      expect(error).toBeTruthy();
      expect(error.message).toContain('Authentication required');
      
      client.close();
    });

    it('should handle JWT verification failures gracefully', async () => {
      (jwtService.verifyToken as jest.Mock).mockRejectedValueOnce(new Error('JWT verification failed'));

      const port = (httpServer.address() as any)?.port;
      const client = Client(`http://localhost:${port}`, {
        auth: { token: 'failing-token' }
      });

      const error = await new Promise<any>((resolve) => {
        client.on('connect_error', resolve);
        client.on('connect', () => resolve(null));
        setTimeout(() => resolve(null), 1000);
      });

      expect(error).toBeTruthy();
      expect(error.message).toContain('Authentication failed');
      
      client.close();
    });
  });

  describe('Room Management - TDD', () => {
    let authenticatedClient: any;

    beforeEach(async () => {
      const port = (httpServer.address() as any)?.port;
      authenticatedClient = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        authenticatedClient.on('connect', resolve);
      });
    });

    afterEach(() => {
      if (authenticatedClient) {
        authenticatedClient.close();
      }
    });

    it('should successfully join valid meeting room', (done) => {
      const meetingId = 'meeting-123';
      
      authenticatedClient.emit('join-meeting', meetingId);
      
      // Verify client joined room by checking if they receive room-specific events
      setTimeout(() => {
        const userRooms = webSocketService.getUserRooms(mockUser.id);
        expect(userRooms).toContain(`meeting-${meetingId}`);
        done();
      }, 100);
    });

    it('should reject empty meeting room identifier', (done) => {
      authenticatedClient.on('error', (error: any) => {
        expect(error.code).toBe('INVALID_ROOM');
        expect(error.message).toContain('Invalid room identifier');
        done();
      });

      authenticatedClient.emit('join-meeting', '');
    });

    it('should reject whitespace-only room identifier', (done) => {
      authenticatedClient.on('error', (error: any) => {
        expect(error.code).toBe('INVALID_ROOM');
        expect(error.message).toContain('Invalid room identifier');
        done();
      });

      authenticatedClient.emit('join-meeting', '   ');
    });

    it('should handle unauthorized meeting access', (done) => {
      authenticatedClient.on('error', (error: any) => {
        expect(error.code).toBe('UNAUTHORIZED_ACCESS');
        expect(error.message).toContain('Access denied to this meeting');
        done();
      });

      authenticatedClient.emit('join-meeting', 'unauthorized-meeting');
    });

    it('should join multiple different room types', (done) => {
      const meetingId = 'meeting-multi';
      const analysisId = 'analysis-multi';
      const generationId = 'generation-multi';
      const sessionId = 'session-multi';
      const batchId = 'batch-multi';

      let joinedRooms = 0;
      const expectedRooms = 5;

      const checkCompletion = () => {
        joinedRooms++;
        if (joinedRooms === expectedRooms) {
          const userRooms = webSocketService.getUserRooms(mockUser.id);
          expect(userRooms).toContain(`meeting-${meetingId}`);
          expect(userRooms).toContain(`analysis-${analysisId}`);
          expect(userRooms).toContain(`generation-${generationId}`);
          expect(userRooms).toContain(`session-${sessionId}`);
          expect(userRooms).toContain(`batch-${batchId}`);
          expect(userRooms.length).toBe(expectedRooms);
          done();
        }
      };

      // Join all room types
      authenticatedClient.emit('join-meeting', meetingId);
      setTimeout(checkCompletion, 10);
      
      authenticatedClient.emit('join-analysis', analysisId);
      setTimeout(checkCompletion, 20);
      
      authenticatedClient.emit('join-generation', generationId);
      setTimeout(checkCompletion, 30);
      
      authenticatedClient.emit('join-session', sessionId);
      setTimeout(checkCompletion, 40);
      
      authenticatedClient.emit('join-batch', batchId);
      setTimeout(checkCompletion, 50);
    });
  });

  describe('Real-time Progress Updates - TDD', () => {
    let authenticatedClient: any;

    beforeEach(async () => {
      const port = (httpServer.address() as any)?.port;
      authenticatedClient = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        authenticatedClient.on('connect', resolve);
      });
    });

    afterEach(() => {
      if (authenticatedClient) {
        authenticatedClient.close();
      }
    });

    it('should emit and receive meeting analysis progress with correct data structure', (done) => {
      const meetingId = 'meeting-progress-test';
      const analysisId = 'analysis-progress-test';

      authenticatedClient.emit('join-meeting', meetingId);

      authenticatedClient.on('analysis-progress', (data: any) => {
        expect(data).toMatchObject({
          meetingId,
          analysisId,
          progress: expect.any(Number),
          stage: expect.any(String),
          message: expect.any(String),
          timestamp: expect.any(String)
        });
        
        expect(data.progress).toBeGreaterThanOrEqual(0);
        expect(data.progress).toBeLessThanOrEqual(100);
        expect(data.momentsFound).toBe(5);
        expect(data.costSavings).toBe(0.45);
        done();
      });

      // Emit progress through service
      setTimeout(() => {
        webSocketService.emitMeetingAnalysisProgress({
          meetingId,
          analysisId,
          progress: 65,
          stage: 'moment-detection',
          message: 'Detecting critical moments...',
          timestamp: new Date(),
          momentsFound: 5,
          costSavings: 0.45
        });
      }, 100);
    });

    it('should emit and receive smart sampling progress with performance metrics', (done) => {
      const analysisId = 'smart-sampling-test';

      authenticatedClient.emit('join-analysis', analysisId);

      authenticatedClient.on('sampling-progress', (data: any) => {
        expect(data).toMatchObject({
          analysisId,
          progress: 80,
          stage: 'pm-analysis',
          message: 'Analyzing PM communication patterns...',
          timestamp: expect.any(String)
        });
        done();
      });

      setTimeout(() => {
        webSocketService.emitSmartSamplingProgress({
          meetingId: 'meeting-123',
          analysisId,
          progress: 80,
          stage: 'pm-analysis',
          message: 'Analyzing PM communication patterns...',
          timestamp: new Date()
        });
      }, 100);
    });

    it('should emit and receive scenario generation progress with scenario counts', (done) => {
      const generationId = 'generation-progress-test';

      authenticatedClient.emit('join-generation', generationId);

      authenticatedClient.on('generation-progress', (data: any) => {
        expect(data).toMatchObject({
          generationId,
          progress: 60,
          stage: 'personalization',
          message: 'Personalizing scenarios...',
          scenariosCompleted: 3,
          totalScenarios: 5,
          timestamp: expect.any(String)
        });
        done();
      });

      setTimeout(() => {
        webSocketService.emitScenarioGenerationProgress({
          generationId,
          progress: 60,
          stage: 'personalization',
          message: 'Personalizing scenarios...',
          timestamp: new Date(),
          scenariosCompleted: 3,
          totalScenarios: 5
        });
      }, 100);
    });

    it('should emit and receive batch progress with detailed metrics', (done) => {
      const batchId = 'batch-progress-test';

      authenticatedClient.emit('join-batch', batchId);

      authenticatedClient.on('batch-progress', (data: any) => {
        expect(data).toMatchObject({
          batchId,
          progress: 70,
          stage: 'processing',
          message: 'Processing meeting batch...',
          completedMeetings: 7,
          totalMeetings: 10,
          failedMeetings: 0,
          estimatedCompletion: expect.any(String),
          timestamp: expect.any(String)
        });
        done();
      });

      setTimeout(() => {
        webSocketService.emitBatchProgress({
          batchId,
          progress: 70,
          stage: 'processing',
          message: 'Processing meeting batch...',
          timestamp: new Date(),
          completedMeetings: 7,
          totalMeetings: 10,
          failedMeetings: 0,
          estimatedCompletion: new Date(Date.now() + 300000)
        });
      }, 100);
    });
  });

  describe('Completion Events - TDD', () => {
    let authenticatedClient: any;

    beforeEach(async () => {
      const port = (httpServer.address() as any)?.port;
      authenticatedClient = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        authenticatedClient.on('connect', resolve);
      });
    });

    afterEach(() => {
      if (authenticatedClient) {
        authenticatedClient.close();
      }
    });

    it('should emit completion with comprehensive analysis results', (done) => {
      const meetingId = 'meeting-completion';
      const analysisId = 'analysis-completion';

      authenticatedClient.emit('join-meeting', meetingId);

      authenticatedClient.on('analysis-completed', (data: any) => {
        expect(data).toMatchObject({
          meetingId,
          analysisId,
          results: {
            summary: expect.any(String),
            insights: expect.any(Array),
            score: expect.any(Number),
            executivePresence: expect.any(Object),
            communicationStructure: expect.any(Object)
          },
          timestamp: expect.any(String)
        });
        
        expect(data.results.insights.length).toBeGreaterThan(0);
        expect(data.results.score).toBeGreaterThanOrEqual(0);
        expect(data.results.score).toBeLessThanOrEqual(100);
        done();
      });

      setTimeout(() => {
        webSocketService.emitMeetingAnalysisCompleted(meetingId, analysisId, {
          summary: 'Comprehensive analysis completed successfully',
          insights: ['Strong executive presence', 'Clear communication', 'Data-driven decisions'],
          score: 88,
          executivePresence: { score: 85, level: 'Advanced' },
          communicationStructure: { clarity: 90, conciseness: 85 }
        });
      }, 100);
    });

    it('should emit smart sampling completion with cost savings', (done) => {
      const analysisId = 'sampling-completion';

      authenticatedClient.emit('join-analysis', analysisId);

      authenticatedClient.on('sampling-completed', (data: any) => {
        expect(data).toMatchObject({
          analysisId,
          results: {
            costReduction: expect.any(Number),
            qualityScore: expect.any(Number),
            selectedMoments: expect.any(Array),
            pmAnalysis: expect.any(Object)
          },
          timestamp: expect.any(String)
        });
        
        expect(data.results.costReduction).toBeGreaterThan(0);
        expect(data.results.qualityScore).toBeGreaterThan(0);
        expect(data.results.selectedMoments.length).toBeGreaterThan(0);
        done();
      });

      setTimeout(() => {
        webSocketService.emitSmartSamplingCompleted(analysisId, {
          costReduction: 0.78,
          qualityScore: 0.92,
          selectedMoments: [
            { startTime: 120, endTime: 180, reason: 'DECISION_POINT', confidence: 0.95 },
            { startTime: 300, endTime: 360, reason: 'EXECUTIVE_HANDOFF', confidence: 0.88 }
          ],
          pmAnalysis: {
            executivePresence: { score: 82, strengths: ['Confident delivery'] },
            influenceSkills: { score: 78, persuasionTechniques: ['Data storytelling'] }
          }
        });
      }, 100);
    });

    it('should emit scenario generation completion with generated scenarios', (done) => {
      const generationId = 'scenario-completion';

      authenticatedClient.emit('join-generation', generationId);

      authenticatedClient.on('generation-completed', (data: any) => {
        expect(data).toMatchObject({
          generationId,
          scenarios: expect.any(Array),
          timestamp: expect.any(String)
        });
        
        expect(data.scenarios.length).toBe(3);
        data.scenarios.forEach((scenario: any) => {
          expect(scenario).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            category: expect.any(String),
            difficulty: expect.any(Number)
          });
        });
        done();
      });

      setTimeout(() => {
        webSocketService.emitScenarioGenerationCompleted(generationId, [
          {
            id: 'scenario-1',
            title: 'Executive Stakeholder Alignment',
            category: 'EXECUTIVE_PRESENCE',
            difficulty: 4
          },
          {
            id: 'scenario-2',
            title: 'Data-Driven Product Decision',
            category: 'DATA_STORYTELLING',
            difficulty: 3
          },
          {
            id: 'scenario-3',
            title: 'Resource Negotiation',
            category: 'RESOURCE_NEGOTIATION',
            difficulty: 5
          }
        ]);
      }, 100);
    });
  });

  describe('Error Handling - TDD', () => {
    let authenticatedClient: any;

    beforeEach(async () => {
      const port = (httpServer.address() as any)?.port;
      authenticatedClient = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        authenticatedClient.on('connect', resolve);
      });
    });

    afterEach(() => {
      if (authenticatedClient) {
        authenticatedClient.close();
      }
    });

    it('should emit analysis errors with detailed error information', (done) => {
      const meetingId = 'meeting-error';
      const analysisId = 'analysis-error';

      authenticatedClient.emit('join-meeting', meetingId);

      authenticatedClient.on('analysis-error', (data: any) => {
        expect(data).toMatchObject({
          meetingId,
          analysisId,
          error: {
            code: 'PROCESSING_FAILED',
            message: expect.any(String),
            details: expect.any(Object)
          },
          timestamp: expect.any(String)
        });
        
        expect(data.error.details.stage).toBe('transcription');
        expect(data.error.details.retryable).toBe(true);
        done();
      });

      setTimeout(() => {
        webSocketService.emitMeetingAnalysisError(meetingId, analysisId, {
          code: 'PROCESSING_FAILED',
          message: 'Audio transcription failed due to poor audio quality',
          details: {
            stage: 'transcription',
            originalError: 'Audio quality too low for transcription',
            retryable: true,
            suggestedAction: 'Please upload a higher quality audio file'
          }
        });
      }, 100);
    });

    it('should handle multiple error types gracefully', (done) => {
      const meetingId = 'meeting-multiple-errors';
      const analysisId = 'analysis-multiple-errors';

      authenticatedClient.emit('join-meeting', meetingId);

      let errorCount = 0;
      const expectedErrors = 3;

      authenticatedClient.on('analysis-error', (data: any) => {
        errorCount++;
        expect(data.meetingId).toBe(meetingId);
        expect(data.analysisId).toBe(analysisId);
        expect(data.error.code).toBeDefined();
        
        if (errorCount === expectedErrors) {
          done();
        }
      });

      // Emit multiple error types
      setTimeout(() => {
        webSocketService.emitMeetingAnalysisError(meetingId, analysisId, {
          code: 'AUDIO_FORMAT_ERROR',
          message: 'Unsupported audio format'
        });
      }, 50);

      setTimeout(() => {
        webSocketService.emitMeetingAnalysisError(meetingId, analysisId, {
          code: 'QUOTA_EXCEEDED',
          message: 'API quota exceeded'
        });
      }, 100);

      setTimeout(() => {
        webSocketService.emitMeetingAnalysisError(meetingId, analysisId, {
          code: 'NETWORK_ERROR',
          message: 'Network connection failed'
        });
      }, 150);
    });
  });

  describe('Practice Session Real-time Features - TDD', () => {
    let authenticatedClient: any;

    beforeEach(async () => {
      const port = (httpServer.address() as any)?.port;
      authenticatedClient = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        authenticatedClient.on('connect', resolve);
      });
    });

    afterEach(() => {
      if (authenticatedClient) {
        authenticatedClient.close();
      }
    });

    it('should emit practice session updates with detailed feedback', (done) => {
      const sessionId = 'session-detailed-feedback';

      authenticatedClient.emit('join-session', sessionId);

      authenticatedClient.on('session-update', (data: any) => {
        expect(data).toMatchObject({
          sessionId,
          event: 'response-submitted',
          score: 87,
          feedback: {
            strengths: expect.any(Array),
            improvements: expect.any(Array),
            suggestions: expect.any(Array)
          },
          timestamp: expect.any(String)
        });
        
        expect(data.feedback.strengths.length).toBeGreaterThan(0);
        expect(data.feedback.improvements.length).toBeGreaterThan(0);
        expect(data.feedback.suggestions.length).toBeGreaterThan(0);
        done();
      });

      setTimeout(() => {
        webSocketService.emitPracticeSessionUpdate({
          sessionId,
          event: 'response-submitted',
          score: 87,
          feedback: {
            strengths: ['Clear executive summary', 'Strong data support'],
            improvements: ['More concise conclusion', 'Better stakeholder alignment'],
            suggestions: ['Practice SCQA framework', 'Focus on outcome-driven messaging']
          }
        });
      }, 100);
    });

    it('should emit real-time coaching hints with confidence levels', (done) => {
      const sessionId = 'session-coaching-hints';

      authenticatedClient.emit('join-session', sessionId);

      authenticatedClient.on('coaching-hint', (data: any) => {
        expect(data).toMatchObject({
          sessionId,
          hint: expect.any(String),
          trigger: expect.any(String),
          confidence: expect.any(Number),
          timestamp: expect.any(String)
        });
        
        expect(data.confidence).toBeGreaterThanOrEqual(0);
        expect(data.confidence).toBeLessThanOrEqual(1);
        expect(data.hint).toContain('executive presence');
        done();
      });

      setTimeout(() => {
        webSocketService.emitCoachingHint(
          sessionId,
          'Consider starting with your conclusion to improve executive presence',
          'communication-pattern-detected',
          0.89
        );
      }, 100);
    });

    it('should handle multiple session event types', (done) => {
      const sessionId = 'session-multiple-events';

      authenticatedClient.emit('join-session', sessionId);

      let eventCount = 0;
      const expectedEvents = 4;
      const receivedEvents: string[] = [];

      authenticatedClient.on('session-update', (data: any) => {
        eventCount++;
        receivedEvents.push(data.event);
        
        if (eventCount === expectedEvents) {
          expect(receivedEvents).toContain('response-submitted');
          expect(receivedEvents).toContain('hint-triggered');
          expect(receivedEvents).toContain('session-paused');
          expect(receivedEvents).toContain('session-resumed');
          done();
        }
      });

      // Emit different session events
      const events = ['response-submitted', 'hint-triggered', 'session-paused', 'session-resumed'];
      events.forEach((event, index) => {
        setTimeout(() => {
          webSocketService.emitPracticeSessionUpdate({
            sessionId,
            event: event as any
          });
        }, (index + 1) * 50);
      });
    });
  });

  describe('Connection Management & Cleanup - TDD', () => {
    it('should track connected users correctly', async () => {
      const port = (httpServer.address() as any)?.port;
      
      expect(webSocketService.getConnectedUsersCount()).toBe(0);

      const client1 = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        client1.on('connect', resolve);
      });

      expect(webSocketService.getConnectedUsersCount()).toBe(1);
      expect(webSocketService.isUserConnected(mockUser.id)).toBe(true);

      client1.close();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(webSocketService.getConnectedUsersCount()).toBe(0);
      expect(webSocketService.isUserConnected(mockUser.id)).toBe(false);
    });

    it('should clean up user rooms on disconnect', async () => {
      const port = (httpServer.address() as any)?.port;
      const client = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        client.on('connect', resolve);
      });

      // Join multiple rooms
      client.emit('join-meeting', 'meeting-cleanup');
      client.emit('join-analysis', 'analysis-cleanup');
      client.emit('join-generation', 'generation-cleanup');

      await new Promise(resolve => setTimeout(resolve, 100));

      const userRooms = webSocketService.getUserRooms(mockUser.id);
      expect(userRooms.length).toBe(3);

      client.close();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userRoomsAfterDisconnect = webSocketService.getUserRooms(mockUser.id);
      expect(userRoomsAfterDisconnect.length).toBe(0);
    });

    it('should handle multiple concurrent connections from same user', async () => {
      const port = (httpServer.address() as any)?.port;
      
      const client1 = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      const client2 = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await Promise.all([
        new Promise<void>((resolve) => client1.on('connect', resolve)),
        new Promise<void>((resolve) => client2.on('connect', resolve))
      ]);

      // Note: Current implementation may override connections for same user
      // This test verifies the behavior
      const connectedCount = webSocketService.getConnectedUsersCount();
      expect(connectedCount).toBeGreaterThan(0);
      expect(connectedCount).toBeLessThanOrEqual(2);

      client1.close();
      client2.close();
    });
  });

  describe('Service Utility Methods - TDD', () => {
    let authenticatedClient: any;

    beforeEach(async () => {
      const port = (httpServer.address() as any)?.port;
      authenticatedClient = Client(`http://localhost:${port}`, {
        auth: { token: validToken }
      });

      await new Promise<void>((resolve) => {
        authenticatedClient.on('connect', resolve);
      });
    });

    afterEach(() => {
      if (authenticatedClient) {
        authenticatedClient.close();
      }
    });

    it('should correctly identify room users', async () => {
      const meetingId = 'meeting-room-users';
      
      authenticatedClient.emit('join-meeting', meetingId);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const roomUsers = webSocketService.getRoomUsers(`meeting-${meetingId}`);
      expect(roomUsers).toContain(mockUser.id);
      expect(roomUsers.length).toBe(1);
    });

    it('should return empty array for non-existent rooms', () => {
      const roomUsers = webSocketService.getRoomUsers('non-existent-room');
      expect(Array.isArray(roomUsers)).toBe(true);
      expect(roomUsers.length).toBe(0);
    });

    it('should handle service close gracefully', () => {
      expect(() => {
        webSocketService.close();
      }).not.toThrow();
      
      expect(webSocketService.getConnectedUsersCount()).toBe(0);
    });
  });
});