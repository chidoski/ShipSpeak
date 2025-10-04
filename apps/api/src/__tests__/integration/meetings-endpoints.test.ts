import request from 'supertest';
import app from '../../index';
import { userService } from '../../controllers/user.controller';
import { PasswordService } from '../../utils/password';
import { User, UserRole } from '../../types/auth';

// Mock services
jest.mock('../../controllers/user.controller');
jest.mock('../../services/meeting.service');

const mockUserService = userService as jest.Mocked<typeof userService>;
const passwordService = new PasswordService();

describe('Meetings API Endpoints', () => {
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

  describe('POST /api/v1/meetings', () => {
    it('should create a new meeting', async () => {
      const meetingData = {
        title: 'Product Strategy Review',
        description: 'Quarterly product strategy review with leadership team',
        participantCount: 8,
        duration: 60,
        meetingType: 'strategy_review',
        tags: ['strategy', 'quarterly', 'leadership']
      };

      const response = await request(app)
        .post('/api/v1/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(meetingData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          meeting: {
            id: expect.any(String),
            title: meetingData.title,
            description: meetingData.description,
            participantCount: meetingData.participantCount,
            duration: meetingData.duration,
            meetingType: meetingData.meetingType,
            tags: meetingData.tags,
            userId: mockUser.id,
            status: 'CREATED',
            createdAt: expect.any(String)
          }
        }
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing title'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('title')
        }
      });
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/meetings')
        .send({
          title: 'Test Meeting'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED'
        }
      });
    });
  });

  describe('GET /api/v1/meetings', () => {
    it('should get user meetings with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          meetings: expect.any(Array),
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

    it('should filter meetings by status', async () => {
      const response = await request(app)
        .get('/api/v1/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'ANALYZED' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should filter meetings by type', async () => {
      const response = await request(app)
        .get('/api/v1/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ meetingType: 'standup' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/meetings/:id', () => {
    it('should get meeting by id', async () => {
      const meetingId = 'meeting-123';

      const response = await request(app)
        .get(`/api/v1/meetings/${meetingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          meeting: {
            id: meetingId,
            title: expect.any(String),
            status: expect.any(String),
            userId: mockUser.id
          }
        }
      });
    });

    it('should return 404 for non-existent meeting', async () => {
      const response = await request(app)
        .get('/api/v1/meetings/non-existent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND'
        }
      });
    });

    it('should prevent access to other users meetings', async () => {
      const response = await request(app)
        .get('/api/v1/meetings/other-user-meeting')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR'
        }
      });
    });
  });

  describe('POST /api/v1/meetings/:id/upload', () => {
    it('should upload meeting audio', async () => {
      const meetingId = 'meeting-123';

      const response = await request(app)
        .post(`/api/v1/meetings/${meetingId}/upload`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', Buffer.from('fake audio data'), 'meeting.mp3')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          uploadId: expect.any(String),
          status: 'UPLOADED',
          fileInfo: {
            filename: expect.any(String),
            size: expect.any(Number),
            mimeType: expect.any(String)
          }
        }
      });
    });

    it('should validate file format', async () => {
      const meetingId = 'meeting-123';

      const response = await request(app)
        .post(`/api/v1/meetings/${meetingId}/upload`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', Buffer.from('fake data'), 'meeting.txt')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('audio format')
        }
      });
    });
  });

  describe('POST /api/v1/meetings/:id/analyze', () => {
    it('should start meeting analysis', async () => {
      const meetingId = 'meeting-123';

      const response = await request(app)
        .post(`/api/v1/meetings/${meetingId}/analyze`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          analysisType: 'smart_sampling',
          config: {
            samplingRatio: 0.25,
            confidenceThreshold: 0.8
          }
        })
        .expect(202);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          analysisId: expect.any(String),
          status: 'PROCESSING',
          estimatedCompletion: expect.any(String)
        }
      });
    });

    it('should require uploaded audio', async () => {
      const meetingId = 'meeting-without-audio';

      const response = await request(app)
        .post(`/api/v1/meetings/${meetingId}/analyze`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          analysisType: 'full_analysis'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('audio')
        }
      });
    });
  });

  describe('GET /api/v1/meetings/:id/analysis', () => {
    it('should get meeting analysis results', async () => {
      const meetingId = 'meeting-123';

      const response = await request(app)
        .get(`/api/v1/meetings/${meetingId}/analysis`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          analysis: {
            id: expect.any(String),
            meetingId: meetingId,
            status: expect.any(String),
            results: expect.any(Object),
            completedAt: expect.any(String)
          }
        }
      });
    });

    it('should return 404 for meetings without analysis', async () => {
      const meetingId = 'meeting-no-analysis';

      const response = await request(app)
        .get(`/api/v1/meetings/${meetingId}/analysis`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: expect.stringContaining('analysis')
        }
      });
    });
  });

  describe('PUT /api/v1/meetings/:id', () => {
    it('should update meeting details', async () => {
      const meetingId = 'meeting-123';
      const updateData = {
        title: 'Updated Meeting Title',
        description: 'Updated description',
        tags: ['updated', 'tags']
      };

      const response = await request(app)
        .put(`/api/v1/meetings/${meetingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          meeting: {
            id: meetingId,
            title: updateData.title,
            description: updateData.description,
            tags: updateData.tags,
            updatedAt: expect.any(String)
          }
        }
      });
    });
  });

  describe('DELETE /api/v1/meetings/:id', () => {
    it('should delete meeting', async () => {
      const meetingId = 'meeting-123';

      const response = await request(app)
        .delete(`/api/v1/meetings/${meetingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Meeting deleted successfully'
        }
      });
    });

    it('should prevent deletion of analyzed meetings', async () => {
      const meetingId = 'meeting-analyzed';

      const response = await request(app)
        .delete(`/api/v1/meetings/${meetingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('analyzed meetings')
        }
      });
    });
  });
});