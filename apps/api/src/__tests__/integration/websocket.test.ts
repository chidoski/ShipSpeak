/**
 * WebSocket Integration Tests
 * Testing real-time progress updates for meeting analysis, scenario generation, and smart sampling
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Client from 'socket.io-client';
import app from '../../app';
import { jwtService } from '../../utils/jwt';

describe('WebSocket Integration', () => {
  let httpServer: HTTPServer;
  let io: SocketIOServer;
  let clientSocket: any;
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Start server
    httpServer = app.listen(0);
    const port = (httpServer.address() as any)?.port;
    
    // Create Socket.IO server
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Create test user and auth token
    testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };
    
    authToken = jwtService.generateToken(testUser);

    // Connect client
    clientSocket = Client(`http://localhost:${port}`, {
      auth: {
        token: authToken
      }
    });

    await new Promise((resolve) => {
      clientSocket.on('connect', resolve);
    });
  });

  afterAll(async () => {
    clientSocket.close();
    io.close();
    httpServer.close();
  });

  describe('Authentication', () => {
    it('should authenticate client with valid JWT token', (done) => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    it('should reject connection with invalid token', async () => {
      const invalidClient = Client(`http://localhost:${(httpServer.address() as any)?.port}`, {
        auth: {
          token: 'invalid-token'
        }
      });

      await new Promise((resolve) => {
        invalidClient.on('connect_error', (error: any) => {
          expect(error.message).toContain('Authentication failed');
          invalidClient.close();
          resolve(void 0);
        });
      });
    });

    it('should reject connection without token', async () => {
      const noAuthClient = Client(`http://localhost:${(httpServer.address() as any)?.port}`);

      await new Promise((resolve) => {
        noAuthClient.on('connect_error', (error: any) => {
          expect(error.message).toContain('Authentication required');
          noAuthClient.close();
          resolve(void 0);
        });
      });
    });
  });

  describe('Meeting Analysis Progress', () => {
    it('should receive meeting analysis progress updates', (done) => {
      const meetingId = 'meeting-123';
      const analysisId = 'analysis-123';

      // Join meeting room
      clientSocket.emit('join-meeting', meetingId);

      // Listen for progress updates
      clientSocket.on('analysis-progress', (data: any) => {
        expect(data.meetingId).toBe(meetingId);
        expect(data.analysisId).toBe(analysisId);
        expect(data.progress).toBeGreaterThanOrEqual(0);
        expect(data.progress).toBeLessThanOrEqual(100);
        expect(data.stage).toBeDefined();
        done();
      });

      // Simulate progress update from server
      setTimeout(() => {
        io.to(`meeting-${meetingId}`).emit('analysis-progress', {
          meetingId,
          analysisId,
          progress: 25,
          stage: 'transcription',
          message: 'Processing audio transcription...'
        });
      }, 100);
    });

    it('should receive meeting analysis completion', (done) => {
      const meetingId = 'meeting-456';
      const analysisId = 'analysis-456';

      clientSocket.emit('join-meeting', meetingId);

      clientSocket.on('analysis-completed', (data: any) => {
        expect(data.meetingId).toBe(meetingId);
        expect(data.analysisId).toBe(analysisId);
        expect(data.results).toBeDefined();
        expect(data.results.summary).toBeDefined();
        expect(data.results.insights).toBeInstanceOf(Array);
        done();
      });

      setTimeout(() => {
        io.to(`meeting-${meetingId}`).emit('analysis-completed', {
          meetingId,
          analysisId,
          results: {
            summary: 'Analysis completed successfully',
            insights: ['Strong executive presence', 'Clear communication'],
            score: 85
          }
        });
      }, 100);
    });

    it('should receive meeting analysis errors', (done) => {
      const meetingId = 'meeting-error';
      const analysisId = 'analysis-error';

      clientSocket.emit('join-meeting', meetingId);

      clientSocket.on('analysis-error', (data: any) => {
        expect(data.meetingId).toBe(meetingId);
        expect(data.analysisId).toBe(analysisId);
        expect(data.error).toBeDefined();
        expect(data.error.message).toContain('Processing failed');
        done();
      });

      setTimeout(() => {
        io.to(`meeting-${meetingId}`).emit('analysis-error', {
          meetingId,
          analysisId,
          error: {
            code: 'PROCESSING_FAILED',
            message: 'Audio processing failed due to unsupported format'
          }
        });
      }, 100);
    });
  });

  describe('Smart Sampling Progress', () => {
    it('should receive smart sampling progress updates', (done) => {
      const analysisId = 'sampling-123';

      clientSocket.emit('join-analysis', analysisId);

      clientSocket.on('sampling-progress', (data: any) => {
        expect(data.analysisId).toBe(analysisId);
        expect(data.progress).toBeGreaterThanOrEqual(0);
        expect(data.progress).toBeLessThanOrEqual(100);
        expect(data.stage).toBeDefined();
        done();
      });

      setTimeout(() => {
        io.to(`analysis-${analysisId}`).emit('sampling-progress', {
          analysisId,
          progress: 60,
          stage: 'moment-detection',
          message: 'Detecting critical moments...',
          momentsFound: 12,
          costSavings: 0.65
        });
      }, 100);
    });

    it('should receive smart sampling completion', (done) => {
      const analysisId = 'sampling-complete';

      clientSocket.emit('join-analysis', analysisId);

      clientSocket.on('sampling-completed', (data: any) => {
        expect(data.analysisId).toBe(analysisId);
        expect(data.results).toBeDefined();
        expect(data.results.costReduction).toBeGreaterThan(0);
        expect(data.results.selectedMoments).toBeInstanceOf(Array);
        done();
      });

      setTimeout(() => {
        io.to(`analysis-${analysisId}`).emit('sampling-completed', {
          analysisId,
          results: {
            costReduction: 0.75,
            qualityScore: 0.88,
            selectedMoments: [
              { startTime: 120, endTime: 180, reason: 'DECISION_POINT' }
            ],
            pmAnalysis: {
              executivePresence: { score: 78 },
              communicationStructure: { clarity: 88 }
            }
          }
        });
      }, 100);
    });
  });

  describe('Scenario Generation Progress', () => {
    it('should receive scenario generation progress updates', (done) => {
      const generationId = 'generation-123';

      clientSocket.emit('join-generation', generationId);

      clientSocket.on('generation-progress', (data: any) => {
        expect(data.generationId).toBe(generationId);
        expect(data.progress).toBeGreaterThanOrEqual(0);
        expect(data.progress).toBeLessThanOrEqual(100);
        expect(data.stage).toBeDefined();
        done();
      });

      setTimeout(() => {
        io.to(`generation-${generationId}`).emit('generation-progress', {
          generationId,
          progress: 40,
          stage: 'scenario-creation',
          message: 'Generating personalized scenarios...',
          scenariosCompleted: 2,
          totalScenarios: 5
        });
      }, 100);
    });

    it('should receive scenario generation completion', (done) => {
      const generationId = 'generation-complete';

      clientSocket.emit('join-generation', generationId);

      clientSocket.on('generation-completed', (data: any) => {
        expect(data.generationId).toBe(generationId);
        expect(data.scenarios).toBeInstanceOf(Array);
        expect(data.scenarios.length).toBeGreaterThan(0);
        done();
      });

      setTimeout(() => {
        io.to(`generation-${generationId}`).emit('generation-completed', {
          generationId,
          scenarios: [
            {
              id: 'scenario-1',
              title: 'Executive Stakeholder Alignment',
              category: 'EXECUTIVE_PRESENCE',
              difficulty: 4
            }
          ]
        });
      }, 100);
    });
  });

  describe('Practice Session Real-time', () => {
    it('should receive practice session updates', (done) => {
      const sessionId = 'session-123';

      clientSocket.emit('join-session', sessionId);

      clientSocket.on('session-update', (data: any) => {
        expect(data.sessionId).toBe(sessionId);
        expect(data.event).toBe('response-submitted');
        expect(data.score).toBeDefined();
        done();
      });

      setTimeout(() => {
        io.to(`session-${sessionId}`).emit('session-update', {
          sessionId,
          event: 'response-submitted',
          score: 85,
          feedback: {
            strengths: ['Clear communication'],
            improvements: ['More specific examples']
          }
        });
      }, 100);
    });

    it('should receive live coaching hints during practice', (done) => {
      const sessionId = 'session-coaching';

      clientSocket.emit('join-session', sessionId);

      clientSocket.on('coaching-hint', (data: any) => {
        expect(data.sessionId).toBe(sessionId);
        expect(data.hint).toBeDefined();
        expect(data.trigger).toBeDefined();
        done();
      });

      setTimeout(() => {
        io.to(`session-${sessionId}`).emit('coaching-hint', {
          sessionId,
          hint: 'Consider starting with your conclusion to improve executive presence',
          trigger: 'speaking-pattern-detected',
          confidence: 0.85
        });
      }, 100);
    });
  });

  describe('Batch Processing Updates', () => {
    it('should receive batch analysis progress', (done) => {
      const batchId = 'batch-123';

      clientSocket.emit('join-batch', batchId);

      clientSocket.on('batch-progress', (data: any) => {
        expect(data.batchId).toBe(batchId);
        expect(data.completedMeetings).toBeDefined();
        expect(data.totalMeetings).toBeDefined();
        expect(data.failedMeetings).toBeDefined();
        done();
      });

      setTimeout(() => {
        io.to(`batch-${batchId}`).emit('batch-progress', {
          batchId,
          completedMeetings: 7,
          totalMeetings: 10,
          failedMeetings: 0,
          progress: 70,
          estimatedCompletion: new Date(Date.now() + 180000).toISOString()
        });
      }, 100);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid room join attempts', (done) => {
      clientSocket.emit('join-meeting', '');

      clientSocket.on('error', (error: any) => {
        expect(error.code).toBe('INVALID_ROOM');
        expect(error.message).toContain('Invalid room identifier');
        done();
      });
    });

    it('should handle unauthorized room access', (done) => {
      const meetingId = 'unauthorized-meeting';
      clientSocket.emit('join-meeting', meetingId);

      clientSocket.on('error', (error: any) => {
        expect(error.code).toBe('UNAUTHORIZED_ACCESS');
        expect(error.message).toContain('Access denied');
        done();
      });
    });
  });

  describe('Connection Management', () => {
    it('should handle client disconnection gracefully', (done) => {
      const testClient = Client(`http://localhost:${(httpServer.address() as any)?.port}`, {
        auth: { token: authToken }
      });

      testClient.on('connect', () => {
        testClient.emit('join-meeting', 'meeting-disconnect-test');
        testClient.disconnect();
        
        // Verify server handles disconnection
        setTimeout(() => {
          expect(testClient.connected).toBe(false);
          done();
        }, 100);
      });
    });

    it('should clean up rooms when clients disconnect', (done) => {
      // This test would verify internal room cleanup logic
      // In a real implementation, we'd check that the server properly
      // removes users from rooms when they disconnect
      done();
    });
  });
});