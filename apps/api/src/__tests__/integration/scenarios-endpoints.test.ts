import request from 'supertest';
import app from '../../index';
import { userService } from '../../controllers/user.controller';
import { PasswordService } from '../../utils/password';
import { User, UserRole } from '../../types/auth';

// Mock services
jest.mock('../../controllers/user.controller');
jest.mock('../../services/scenario.service');

const mockUserService = userService as jest.Mocked<typeof userService>;
const passwordService = new PasswordService();

describe('Scenarios API Endpoints', () => {
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

  describe('GET /api/v1/scenarios', () => {
    it('should get available scenarios with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/scenarios')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          scenarios: expect.any(Array),
          pagination: {
            page: 1,
            limit: 10,
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean)
          }
        }
      });
    });

    it('should filter scenarios by category', async () => {
      const response = await request(app)
        .get('/api/v1/scenarios')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ category: 'EXECUTIVE_PRESENCE' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.scenarios).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: 'EXECUTIVE_PRESENCE'
          })
        ])
      );
    });

    it('should filter scenarios by difficulty', async () => {
      const response = await request(app)
        .get('/api/v1/scenarios')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ difficulty: 3 })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should filter scenarios by PM skill focus', async () => {
      const response = await request(app)
        .get('/api/v1/scenarios')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ skillFocus: 'STAKEHOLDER_MANAGEMENT' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/scenarios/:id', () => {
    it('should get scenario by id', async () => {
      const scenarioId = 'scenario-123';

      const response = await request(app)
        .get(`/api/v1/scenarios/${scenarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          scenario: {
            id: scenarioId,
            title: expect.any(String),
            description: expect.any(String),
            category: expect.any(String),
            difficulty: expect.any(Number),
            estimatedDuration: expect.any(Number),
            learningObjectives: expect.any(Array),
            pmSkillFocus: expect.any(Array)
          }
        }
      });
    });

    it('should return 404 for non-existent scenario', async () => {
      const response = await request(app)
        .get('/api/v1/scenarios/non-existent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND'
        }
      });
    });
  });

  describe('POST /api/v1/scenarios/generate', () => {
    it('should generate personalized scenarios', async () => {
      const generationRequest = {
        count: 3,
        category: 'STAKEHOLDER_INFLUENCE',
        difficulty: 3,
        personalizeFor: mockUser.id,
        context: {
          industry: 'fintech',
          companySize: 'startup',
          roleLevel: 'senior',
          weaknessAreas: ['executive_presence', 'data_storytelling']
        }
      };

      const response = await request(app)
        .post('/api/v1/scenarios/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(generationRequest)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          generationId: expect.any(String),
          status: 'GENERATING',
          scenarios: expect.any(Array),
          estimatedCompletion: expect.any(String)
        }
      });
    });

    it('should generate scenarios based on meeting analysis', async () => {
      const generationRequest = {
        count: 5,
        basedOnMeetingId: 'meeting-123',
        focusOnWeaknesses: true,
        adaptToCommunicationStyle: true
      };

      const response = await request(app)
        .post('/api/v1/scenarios/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(generationRequest)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          generationId: expect.any(String),
          status: 'GENERATING',
          basedOnMeeting: 'meeting-123'
        }
      });
    });

    it('should validate generation parameters', async () => {
      const response = await request(app)
        .post('/api/v1/scenarios/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          count: 50, // Too many
          difficulty: 6 // Invalid difficulty
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

  describe('GET /api/v1/scenarios/generation/:id', () => {
    it('should get generation status and results', async () => {
      const generationId = 'generation-123';

      const response = await request(app)
        .get(`/api/v1/scenarios/generation/${generationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          generation: {
            id: generationId,
            status: expect.stringMatching(/^(GENERATING|COMPLETED|FAILED)$/),
            progress: expect.any(Number),
            scenarios: expect.any(Array)
          }
        }
      });
    });
  });

  describe('POST /api/v1/scenarios/:id/practice', () => {
    it('should start practice session', async () => {
      const scenarioId = 'scenario-123';

      const response = await request(app)
        .post(`/api/v1/scenarios/${scenarioId}/practice`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          mode: 'guided',
          timeLimit: 900, // 15 minutes
          recordSession: true
        })
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          sessionId: expect.any(String),
          status: 'ACTIVE',
          scenario: {
            id: scenarioId,
            content: expect.any(Object)
          },
          timeLimit: 900,
          startedAt: expect.any(String)
        }
      });
    });

    it('should validate practice mode', async () => {
      const scenarioId = 'scenario-123';

      const response = await request(app)
        .post(`/api/v1/scenarios/${scenarioId}/practice`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          mode: 'invalid_mode'
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

  describe('GET /api/v1/scenarios/practice/sessions', () => {
    it('should get user practice sessions', async () => {
      const response = await request(app)
        .get('/api/v1/scenarios/practice/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          sessions: expect.any(Array),
          pagination: expect.any(Object)
        }
      });
    });

    it('should filter sessions by status', async () => {
      const response = await request(app)
        .get('/api/v1/scenarios/practice/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'COMPLETED' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/scenarios/practice/sessions/:id', () => {
    it('should get practice session details', async () => {
      const sessionId = 'session-123';

      const response = await request(app)
        .get(`/api/v1/scenarios/practice/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          session: {
            id: sessionId,
            scenarioId: expect.any(String),
            status: expect.any(String),
            startedAt: expect.any(String),
            responses: expect.any(Array),
            score: expect.any(Number)
          }
        }
      });
    });
  });

  describe('POST /api/v1/scenarios/practice/sessions/:id/response', () => {
    it('should submit practice response', async () => {
      const sessionId = 'session-123';

      const response = await request(app)
        .post(`/api/v1/scenarios/practice/sessions/${sessionId}/response`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          responseText: 'Thank you for bringing this to my attention. Based on our analysis...',
          audioRecording: null, // Optional audio response
          timeSpent: 45,
          responseType: 'written'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          response: {
            id: expect.any(String),
            sessionId: sessionId,
            responseText: expect.any(String),
            score: expect.any(Number),
            feedback: expect.any(Object),
            submittedAt: expect.any(String)
          }
        }
      });
    });
  });

  describe('POST /api/v1/scenarios/practice/sessions/:id/complete', () => {
    it('should complete practice session', async () => {
      const sessionId = 'session-123';

      const response = await request(app)
        .post(`/api/v1/scenarios/practice/sessions/${sessionId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          selfAssessment: {
            confidence: 4,
            difficulty: 3,
            realism: 5,
            learningValue: 4
          }
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          session: {
            id: sessionId,
            status: 'COMPLETED',
            finalScore: expect.any(Number),
            completedAt: expect.any(String),
            detailedFeedback: expect.any(Object),
            nextRecommendations: expect.any(Array)
          }
        }
      });
    });
  });
});