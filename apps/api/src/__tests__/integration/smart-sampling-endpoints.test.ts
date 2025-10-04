import request from 'supertest';
import app from '../../index';
import { userService } from '../../controllers/user.controller';
import { PasswordService } from '../../utils/password';
import { User, UserRole } from '../../types/auth';

// Mock services
jest.mock('../../controllers/user.controller');
jest.mock('../../services/smart-sampling.service');

const mockUserService = userService as jest.Mocked<typeof userService>;
const passwordService = new PasswordService();

describe('Smart Sampling API Endpoints', () => {
  let authToken: string;
  let mockUser: User;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Setup authenticated user
    const password = 'SecurePass123!';
    const hashedPassword = await passwordService.hashPassword(password);
    
    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.PRODUCT_MANAGER,
      passwordHash: hashedPassword,
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUserService.findById.mockResolvedValue(mockUser);
    mockUserService.findByEmail.mockResolvedValue(mockUser);

    // Get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: password
      });

    authToken = loginResponse.body.data.token;
  });

  describe('GET /api/v1/smart-sampling/configs', () => {
    it('should get available sampling configurations', async () => {
      const response = await request(app)
        .get('/api/v1/smart-sampling/configs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          configs: expect.arrayContaining([
            expect.objectContaining({
              name: 'COST_OPTIMIZED',
              samplingRatio: 0.25,
              description: expect.any(String)
            }),
            expect.objectContaining({
              name: 'BALANCED',
              samplingRatio: 0.5,
              description: expect.any(String)
            }),
            expect.objectContaining({
              name: 'QUALITY_FOCUSED',
              samplingRatio: 0.75,
              description: expect.any(String)
            })
          ])
        }
      });
    });
  });

  describe('POST /api/v1/smart-sampling/analyze', () => {
    it('should start smart sampling analysis', async () => {
      const analysisRequest = {
        meetingId: 'meeting-123',
        config: 'COST_OPTIMIZED',
        customConfig: null,
        priority: 'standard'
      };

      const response = await request(app)
        .post('/api/v1/smart-sampling/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisRequest)
        .expect(202);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          analysisId: expect.any(String),
          status: 'PROCESSING',
          config: expect.objectContaining({
            name: 'COST_OPTIMIZED',
            samplingRatio: 0.25
          }),
          estimatedCompletion: expect.any(String),
          costEstimate: expect.any(Object)
        }
      });
    });

    it('should accept custom configuration', async () => {
      const analysisRequest = {
        meetingId: 'meeting-123',
        config: 'CUSTOM',
        customConfig: {
          chunkSizeSeconds: 30,
          overlapSeconds: 5,
          confidenceThreshold: 0.85,
          energyThreshold: 0.7,
          samplingRatio: 0.35
        }
      };

      const response = await request(app)
        .post('/api/v1/smart-sampling/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisRequest)
        .expect(202);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          analysisId: expect.any(String),
          config: expect.objectContaining({
            name: 'CUSTOM',
            samplingRatio: 0.35
          })
        }
      });
    });

    it('should validate meeting exists and has audio', async () => {
      const response = await request(app)
        .post('/api/v1/smart-sampling/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          meetingId: 'non-existent-meeting',
          config: 'BALANCED'
        })
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: expect.stringContaining('meeting')
        }
      });
    });

    it('should validate custom configuration parameters', async () => {
      const response = await request(app)
        .post('/api/v1/smart-sampling/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          meetingId: 'meeting-123',
          config: 'CUSTOM',
          customConfig: {
            samplingRatio: 1.5, // Invalid ratio > 1
            confidenceThreshold: -0.1 // Invalid negative threshold
          }
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR'
        }
      });
    });
  });

  describe('GET /api/v1/smart-sampling/analyze/:id', () => {
    it('should get analysis status and progress', async () => {
      const analysisId = 'analysis-123';

      const response = await request(app)
        .get(`/api/v1/smart-sampling/analyze/${analysisId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          analysis: {
            id: analysisId,
            meetingId: expect.any(String),
            status: expect.stringMatching(/^(PROCESSING|COMPLETED|FAILED)$/),
            progress: expect.any(Number),
            config: expect.any(Object),
            startedAt: expect.any(String)
          }
        }
      });
    });

    it('should include results when analysis is completed', async () => {
      const analysisId = 'analysis-completed';

      const response = await request(app)
        .get(`/api/v1/smart-sampling/analyze/${analysisId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.data.analysis.status === 'COMPLETED') {
        expect(response.body.data.analysis).toMatchObject({
          results: expect.objectContaining({
            costReduction: expect.any(Number),
            qualityScore: expect.any(Number),
            analyzedDuration: expect.any(Number),
            originalDuration: expect.any(Number),
            selectedMoments: expect.any(Array),
            pmAnalysis: expect.any(Object)
          }),
          completedAt: expect.any(String)
        });
      }
    });
  });

  describe('GET /api/v1/smart-sampling/analyze/:id/moments', () => {
    it('should get critical moments from analysis', async () => {
      const analysisId = 'analysis-123';

      const response = await request(app)
        .get(`/api/v1/smart-sampling/analyze/${analysisId}/moments`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          moments: expect.arrayContaining([
            expect.objectContaining({
              startTime: expect.any(Number),
              endTime: expect.any(Number),
              energyLevel: expect.any(Number),
              confidence: expect.any(Number),
              reason: expect.stringMatching(/^(HIGH_ENERGY_AND_KEYWORDS|SPEAKER_TRANSITION|POST_SILENCE_HIGH_ENERGY|DECISION_POINT|EXECUTIVE_HANDOFF|STAKEHOLDER_PUSHBACK)$/),
              pmSpecific: expect.any(Object)
            })
          ]),
          totalMoments: expect.any(Number),
          totalDuration: expect.any(Number)
        }
      });
    });

    it('should filter moments by type', async () => {
      const analysisId = 'analysis-123';

      const response = await request(app)
        .get(`/api/v1/smart-sampling/analyze/${analysisId}/moments`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ type: 'DECISION_POINT' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should filter moments by PM communication pattern', async () => {
      const analysisId = 'analysis-123';

      const response = await request(app)
        .get(`/api/v1/smart-sampling/analyze/${analysisId}/moments`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ pmPattern: 'EXECUTIVE_SUMMARY' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/smart-sampling/analyze/:id/pm-insights', () => {
    it('should get PM-specific analysis insights', async () => {
      const analysisId = 'analysis-123';

      const response = await request(app)
        .get(`/api/v1/smart-sampling/analyze/${analysisId}/pm-insights`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          insights: {
            executivePresence: expect.objectContaining({
              score: expect.any(Number),
              strengths: expect.any(Array),
              improvements: expect.any(Array)
            }),
            influenceSkills: expect.objectContaining({
              score: expect.any(Number),
              persuasionTechniques: expect.any(Array),
              stakeholderAlignment: expect.any(Number)
            }),
            communicationStructure: expect.objectContaining({
              clarity: expect.any(Number),
              conciseness: expect.any(Number),
              answerFirst: expect.any(Boolean)
            }),
            dataStorytelling: expect.objectContaining({
              score: expect.any(Number),
              visualSupport: expect.any(Boolean),
              contextualizing: expect.any(Number)
            }),
            overallAssessment: expect.objectContaining({
              score: expect.any(Number),
              level: expect.stringMatching(/^(BEGINNER|INTERMEDIATE|ADVANCED|EXPERT)$/),
              recommendations: expect.any(Array)
            })
          }
        }
      });
    });
  });

  describe('POST /api/v1/smart-sampling/analyze/:id/export', () => {
    it('should export analysis results', async () => {
      const analysisId = 'analysis-123';

      const response = await request(app)
        .post(`/api/v1/smart-sampling/analyze/${analysisId}/export`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          format: 'json',
          includeAudio: false,
          includeMoments: true,
          includePMInsights: true
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          exportId: expect.any(String),
          downloadUrl: expect.any(String),
          expiresAt: expect.any(String),
          format: 'json'
        }
      });
    });

    it('should support multiple export formats', async () => {
      const analysisId = 'analysis-123';

      const response = await request(app)
        .post(`/api/v1/smart-sampling/analyze/${analysisId}/export`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          format: 'pdf',
          includeCharts: true,
          includeTranscript: true
        })
        .expect(200);

      expect(response.body.data.format).toBe('pdf');
    });
  });

  describe('GET /api/v1/smart-sampling/analytics', () => {
    it('should get user smart sampling analytics', async () => {
      const response = await request(app)
        .get('/api/v1/smart-sampling/analytics')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          timeRange: '30d',
          groupBy: 'week'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          analytics: {
            totalAnalyses: expect.any(Number),
            totalCostSavings: expect.any(Number),
            averageQualityScore: expect.any(Number),
            trendData: expect.any(Array),
            topInsights: expect.any(Array),
            configUsage: expect.any(Object)
          }
        }
      });
    });

    it('should filter analytics by date range', async () => {
      const response = await request(app)
        .get('/api/v1/smart-sampling/analytics')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          timeRange: 'custom',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/smart-sampling/batch-analyze', () => {
    it('should start batch analysis for multiple meetings', async () => {
      const batchRequest = {
        meetingIds: ['meeting-1', 'meeting-2', 'meeting-3'],
        config: 'BALANCED',
        priority: 'low'
      };

      const response = await request(app)
        .post('/api/v1/smart-sampling/batch-analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send(batchRequest)
        .expect(202);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          batchId: expect.any(String),
          status: 'QUEUED',
          totalMeetings: 3,
          estimatedCompletion: expect.any(String),
          costEstimate: expect.any(Object)
        }
      });
    });

    it('should validate batch size limits', async () => {
      const response = await request(app)
        .post('/api/v1/smart-sampling/batch-analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          meetingIds: new Array(101).fill('meeting-id'), // Too many
          config: 'BALANCED'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('batch size')
        }
      });
    });
  });

  describe('GET /api/v1/smart-sampling/batch-analyze/:id', () => {
    it('should get batch analysis progress', async () => {
      const batchId = 'batch-123';

      const response = await request(app)
        .get(`/api/v1/smart-sampling/batch-analyze/${batchId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          batch: {
            id: batchId,
            status: expect.stringMatching(/^(QUEUED|PROCESSING|COMPLETED|FAILED)$/),
            progress: expect.any(Number),
            totalMeetings: expect.any(Number),
            completedMeetings: expect.any(Number),
            failedMeetings: expect.any(Number),
            results: expect.any(Array)
          }
        }
      });
    });
  });
});