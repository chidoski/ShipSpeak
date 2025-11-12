import request from 'supertest';
import app from '../../../app';
import { uploadService } from '../../../services/upload.service';
import { generateTestToken } from '../../utils/auth-utils';

// Mock the upload service
jest.mock('../../../services/upload.service');
const mockUploadService = uploadService as jest.Mocked<typeof uploadService>;

// Mock file upload utilities
jest.mock('../../../../../web/src/lib/file-upload', () => ({
  validateAudioFile: jest.fn(),
  scanFileForSecurity: jest.fn(),
  processChunkedUpload: jest.fn(),
  clearUploadSessions: jest.fn()
}));

describe('Upload Controller', () => {
  let authToken: string;
  const userId = 'test-user-id';

  beforeEach(() => {
    authToken = generateTestToken(userId);
    jest.clearAllMocks();
  });

  describe('POST /api/v1/upload/initiate', () => {
    it('should initiate chunked upload successfully', async () => {
      const uploadData = {
        fileName: 'test-audio.mp3',
        fileSize: 1024000,
        metadata: {
          title: 'Test Meeting',
          meetingType: 'executive_review'
        }
      };

      const response = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(uploadData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data).toHaveProperty('totalChunks');
      expect(response.body.data).toHaveProperty('chunkSize');
    });

    it('should reject files larger than 100MB', async () => {
      const uploadData = {
        fileName: 'large-audio.mp3',
        fileSize: 110 * 1024 * 1024, // 110MB
      };

      const response = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(uploadData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('File size exceeds 100MB limit');
    });

    it('should reject invalid file types', async () => {
      const uploadData = {
        fileName: 'test-video.mp4',
        fileSize: 1024000,
      };

      const response = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(uploadData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Invalid file type');
    });

    it('should require authentication', async () => {
      const uploadData = {
        fileName: 'test-audio.mp3',
        fileSize: 1024000,
      };

      const response = await request(app)
        .post('/api/v1/upload/initiate')
        .send(uploadData);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/upload/chunk', () => {
    const validChunkData = {
      sessionId: 'session-123',
      chunkIndex: 0,
      chunkData: Buffer.from('audio chunk data').toString('base64'),
      checksum: 'valid-checksum'
    };

    beforeEach(() => {
      // Mock session exists in memory (this would normally be handled by the controller)
    });

    it('should upload chunk successfully', async () => {
      const response = await request(app)
        .post('/api/v1/upload/chunk')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validChunkData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('chunkIndex');
      expect(response.body.data).toHaveProperty('progress');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        sessionId: 'session-123',
        // Missing chunkIndex and chunkData
      };

      const response = await request(app)
        .post('/api/v1/upload/chunk')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('sessionId, chunkIndex, and chunkData are required');
    });

    it('should reject invalid base64 data', async () => {
      const invalidChunkData = {
        ...validChunkData,
        chunkData: 'invalid-base64!!!'
      };

      const response = await request(app)
        .post('/api/v1/upload/chunk')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidChunkData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Invalid chunk data format');
    });
  });

  describe('POST /api/v1/upload/complete', () => {
    beforeEach(() => {
      mockUploadService.uploadToSupabaseStorage.mockResolvedValue({
        success: true,
        storagePath: 'audio/test-user/2024-01-01/test-audio.mp3'
      });

      mockUploadService.saveFileMetadata.mockResolvedValue({
        success: true,
        fileId: 'file-123',
        meetingId: 'meeting-123',
        storagePath: 'audio/test-user/2024-01-01/test-audio.mp3'
      });
    });

    it('should complete upload successfully', async () => {
      const completeData = {
        sessionId: 'session-123'
      };

      const response = await request(app)
        .post('/api/v1/upload/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(completeData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('meetingId');
      expect(response.body.data).toHaveProperty('storagePath');
    });

    it('should handle storage upload failures', async () => {
      mockUploadService.uploadToSupabaseStorage.mockResolvedValue({
        success: false,
        error: 'Storage service unavailable'
      });

      const completeData = {
        sessionId: 'session-123'
      };

      const response = await request(app)
        .post('/api/v1/upload/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(completeData);

      expect(response.status).toBe(500);
      expect(response.body.error.message).toContain('Upload to storage failed');
    });

    it('should handle database save failures', async () => {
      mockUploadService.saveFileMetadata.mockResolvedValue({
        success: false,
        error: 'Database connection failed'
      });

      const completeData = {
        sessionId: 'session-123'
      };

      const response = await request(app)
        .post('/api/v1/upload/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(completeData);

      expect(response.status).toBe(500);
      expect(response.body.error.message).toContain('Failed to save file metadata');
    });
  });

  describe('GET /api/v1/upload/progress/:sessionId', () => {
    it('should return upload progress', async () => {
      const sessionId = 'session-123';

      const response = await request(app)
        .get(`/api/v1/upload/progress/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('progress');
      expect(response.body.data).toHaveProperty('uploadedChunks');
      expect(response.body.data).toHaveProperty('totalChunks');
    });

    it('should handle non-existent sessions', async () => {
      const sessionId = 'non-existent-session';

      const response = await request(app)
        .get(`/api/v1/upload/progress/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toContain('Upload session not found');
    });
  });

  describe('POST /api/v1/upload/simple', () => {
    beforeEach(() => {
      const { validateAudioFile, scanFileForSecurity } = require('../../../../../web/src/lib/file-upload');
      
      validateAudioFile.mockResolvedValue({
        isValid: true,
        mimeType: 'audio/mp3',
        sanitizedFilename: 'test-audio.mp3'
      });

      scanFileForSecurity.mockResolvedValue({
        isSafe: true,
        threats: []
      });

      mockUploadService.uploadToSupabaseStorage.mockResolvedValue({
        success: true,
        storagePath: 'audio/test-user/2024-01-01/test-audio.mp3'
      });

      mockUploadService.saveFileMetadata.mockResolvedValue({
        success: true,
        fileId: 'file-123',
        meetingId: 'meeting-123',
        storagePath: 'audio/test-user/2024-01-01/test-audio.mp3'
      });
    });

    it('should upload file successfully', async () => {
      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', Buffer.from('audio file content'), 'test-audio.mp3');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('meetingId');
      expect(response.body.data).toHaveProperty('storagePath');
    });

    it('should reject files that fail validation', async () => {
      const { validateAudioFile } = require('../../../../../web/src/lib/file-upload');
      validateAudioFile.mockResolvedValue({
        isValid: false,
        error: 'Invalid file format'
      });

      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', Buffer.from('invalid content'), 'test-file.txt');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('File validation failed');
    });

    it('should reject files that fail security scan', async () => {
      const { scanFileForSecurity } = require('../../../../../web/src/lib/file-upload');
      scanFileForSecurity.mockResolvedValue({
        isSafe: false,
        threats: ['XSS', 'COMMAND_INJECTION']
      });

      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', Buffer.from('malicious content'), 'malicious-file.mp3');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Security scan failed');
    });

    it('should require file upload', async () => {
      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('No file provided');
    });
  });

  describe('POST /api/v1/upload/validate', () => {
    beforeEach(() => {
      const { validateAudioFile, scanFileForSecurity } = require('../../../../../web/src/lib/file-upload');
      
      validateAudioFile.mockResolvedValue({
        isValid: true,
        mimeType: 'audio/mp3',
        sanitizedFilename: 'test-audio.mp3'
      });

      scanFileForSecurity.mockResolvedValue({
        isSafe: true,
        threats: []
      });
    });

    it('should validate file successfully', async () => {
      const response = await request(app)
        .post('/api/v1/upload/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('audio file content'), 'test-audio.mp3');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('validation');
      expect(response.body.data).toHaveProperty('security');
      expect(response.body.data).toHaveProperty('fileInfo');
    });

    it('should return validation and security details', async () => {
      const { validateAudioFile, scanFileForSecurity } = require('../../../../../web/src/lib/file-upload');
      
      validateAudioFile.mockResolvedValue({
        isValid: false,
        error: 'File too large'
      });

      scanFileForSecurity.mockResolvedValue({
        isSafe: false,
        threats: ['XSS']
      });

      const response = await request(app)
        .post('/api/v1/upload/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('large malicious content'), 'large-file.mp3');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.validation.isValid).toBe(false);
      expect(response.body.data.security.isSafe).toBe(false);
      expect(response.body.data.security.threats).toContain('XSS');
    });
  });

  describe('DELETE /api/v1/upload/session/:sessionId', () => {
    it('should cancel upload session successfully', async () => {
      const sessionId = 'session-123';

      const response = await request(app)
        .delete(`/api/v1/upload/session/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('Upload session cancelled successfully');
    });

    it('should handle non-existent sessions', async () => {
      const sessionId = 'non-existent-session';

      const response = await request(app)
        .delete(`/api/v1/upload/session/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toContain('Upload session not found');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply file upload rate limits', async () => {
      // Make multiple rapid requests to test rate limiting
      const requests = Array(6).fill(null).map(() => 
        request(app)
          .post('/api/v1/upload/initiate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            fileName: 'test-audio.mp3',
            fileSize: 1024000
          })
      );

      const responses = await Promise.all(requests);
      
      // Expect some requests to be rate limited (429 status)
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      // Mock an unexpected error in the upload service
      mockUploadService.uploadToSupabaseStorage.mockRejectedValue(new Error('Unexpected storage error'));

      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', Buffer.from('audio content'), 'test-audio.mp3');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should provide helpful error messages', async () => {
      const uploadData = {
        fileName: '',
        fileSize: 0
      };

      const response = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(uploadData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('fileName and fileSize are required');
    });
  });
});