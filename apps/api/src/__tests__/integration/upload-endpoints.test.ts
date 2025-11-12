import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../utils/auth-utils';
import { supabase } from '../../../../packages/database/supabase';

describe('Upload Endpoints Integration Tests', () => {
  let authToken: string;
  const userId = 'test-user-upload-integration';

  beforeAll(async () => {
    authToken = generateTestToken(userId);
  });

  afterAll(async () => {
    // Clean up any test data
    await cleanupTestData();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete File Upload Workflow', () => {
    it('should handle complete chunked upload workflow', async () => {
      // Step 1: Initiate upload
      const initiateResponse = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fileName: 'integration-test-audio.mp3',
          fileSize: 1024000,
          metadata: {
            title: 'Integration Test Meeting',
            meetingType: 'executive_review',
            participantCount: 3
          }
        });

      expect(initiateResponse.status).toBe(200);
      expect(initiateResponse.body.success).toBe(true);
      
      const { sessionId, totalChunks, chunkSize } = initiateResponse.body.data;
      expect(sessionId).toBeDefined();
      expect(totalChunks).toBeGreaterThan(0);

      // Step 2: Upload chunks
      const audioContent = Buffer.from('Mock audio file content for integration testing'.repeat(1000));
      const chunks = [];
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, audioContent.length);
        const chunkData = audioContent.slice(start, end);
        chunks.push(chunkData);
      }

      // Upload each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunkResponse = await request(app)
          .post('/api/v1/upload/chunk')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            sessionId,
            chunkIndex: i,
            chunkData: chunks[i].toString('base64'),
            checksum: require('crypto').createHash('sha256').update(chunks[i]).digest('hex')
          });

        expect(chunkResponse.status).toBe(200);
        expect(chunkResponse.body.success).toBe(true);
        expect(chunkResponse.body.data.chunkIndex).toBe(i);

        // Check progress
        const progressResponse = await request(app)
          .get(`/api/v1/upload/progress/${sessionId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(progressResponse.status).toBe(200);
        expect(progressResponse.body.data.uploadedChunks).toBe(i + 1);
      }

      // Step 3: Complete upload
      const completeResponse = await request(app)
        .post('/api/v1/upload/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sessionId });

      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.success).toBe(true);
      expect(completeResponse.body.data).toHaveProperty('meetingId');
      expect(completeResponse.body.data).toHaveProperty('storagePath');

      // Verify meeting was created in database
      const meetingId = completeResponse.body.data.meetingId;
      const meeting = await getMeetingFromDb(meetingId);
      expect(meeting).toBeDefined();
      expect(meeting.user_id).toBe(userId);
      expect(meeting.title).toBe('Integration Test Meeting');
    }, 30000); // Extended timeout for integration test

    it('should handle simple upload workflow', async () => {
      const audioBuffer = Buffer.from('Simple upload test audio content');

      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', audioBuffer, 'simple-test-audio.mp3');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('meetingId');
      expect(response.body.data).toHaveProperty('storagePath');

      // Verify meeting was created
      const meetingId = response.body.data.meetingId;
      const meeting = await getMeetingFromDb(meetingId);
      expect(meeting).toBeDefined();
      expect(meeting.original_filename).toBe('simple-test-audio.mp3');
      expect(meeting.file_size_bytes).toBe(audioBuffer.length);
    });

    it('should validate file before upload', async () => {
      const audioBuffer = Buffer.from('Test audio content for validation');

      const response = await request(app)
        .post('/api/v1/upload/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', audioBuffer, 'validation-test.mp3');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('validation');
      expect(response.body.data).toHaveProperty('security');
      expect(response.body.data).toHaveProperty('fileInfo');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle upload cancellation', async () => {
      // Initiate upload
      const initiateResponse = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fileName: 'cancellation-test.mp3',
          fileSize: 1024000
        });

      const { sessionId } = initiateResponse.body.data;

      // Cancel upload
      const cancelResponse = await request(app)
        .delete(`/api/v1/upload/session/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.success).toBe(true);

      // Try to upload chunk after cancellation
      const chunkResponse = await request(app)
        .post('/api/v1/upload/chunk')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          chunkIndex: 0,
          chunkData: Buffer.from('test chunk').toString('base64')
        });

      expect(chunkResponse.status).toBe(404);
      expect(chunkResponse.body.error.message).toContain('Upload session not found');
    });

    it('should handle incomplete upload completion', async () => {
      const initiateResponse = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fileName: 'incomplete-test.mp3',
          fileSize: 1024000
        });

      const { sessionId } = initiateResponse.body.data;

      // Try to complete without uploading all chunks
      const completeResponse = await request(app)
        .post('/api/v1/upload/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sessionId });

      expect(completeResponse.status).toBe(400);
      expect(completeResponse.body.error.message).toContain('Missing chunks');
    });

    it('should handle invalid file types', async () => {
      const textBuffer = Buffer.from('This is not an audio file');

      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', textBuffer, 'not-audio.txt');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('validation failed');
    });

    it('should handle oversized files', async () => {
      const initiateResponse = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fileName: 'oversized-file.mp3',
          fileSize: 150 * 1024 * 1024 // 150MB
        });

      expect(initiateResponse.status).toBe(400);
      expect(initiateResponse.body.error.message).toContain('File size exceeds 100MB limit');
    });

    it('should handle malicious files', async () => {
      // Create a buffer with script-like content
      const maliciousBuffer = Buffer.from('<script>alert("xss")</script>');

      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', maliciousBuffer, 'malicious.mp3');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Security scan failed');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce upload rate limits', async () => {
      const requests = [];
      
      // Make rapid upload requests
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .post('/api/v1/upload/initiate')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              fileName: `rate-limit-test-${i}.mp3`,
              fileSize: 1024000
            })
        );
      }

      const responses = await Promise.all(requests.map(req => req.catch(err => err)));
      const rateLimitedCount = responses.filter(res => 
        res.status === 429 || (res.body && res.body.error && res.body.error.message.includes('rate limit'))
      ).length;

      expect(rateLimitedCount).toBeGreaterThan(0);
    }, 15000);
  });

  describe('Authentication and Authorization', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/upload/initiate')
        .send({
          fileName: 'test.mp3',
          fileSize: 1024000
        });

      expect(response.status).toBe(401);
    });

    it('should reject requests with invalid tokens', async () => {
      const response = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          fileName: 'test.mp3',
          fileSize: 1024000
        });

      expect(response.status).toBe(401);
    });

    it('should prevent access to other users sessions', async () => {
      const otherUserToken = generateTestToken('other-user-id');

      // Create session with first user
      const initiateResponse = await request(app)
        .post('/api/v1/upload/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fileName: 'test.mp3',
          fileSize: 1024000
        });

      const { sessionId } = initiateResponse.body.data;

      // Try to access with different user
      const progressResponse = await request(app)
        .get(`/api/v1/upload/progress/${sessionId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(progressResponse.status).toBe(403);
      expect(progressResponse.body.error.message).toContain('Access denied');
    });
  });

  describe('Database Integration', () => {
    it('should create meeting records with correct metadata', async () => {
      const audioBuffer = Buffer.from('Database integration test content');
      
      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', audioBuffer, 'db-integration-test.mp3');

      expect(response.status).toBe(200);
      
      const meetingId = response.body.data.meetingId;
      const meeting = await getMeetingFromDb(meetingId);

      expect(meeting).toBeDefined();
      expect(meeting.user_id).toBe(userId);
      expect(meeting.original_filename).toBe('db-integration-test.mp3');
      expect(meeting.file_size_bytes).toBe(audioBuffer.length);
      expect(meeting.file_format).toBe('audio/mp3');
      expect(meeting.status).toBe('uploaded');
      expect(meeting.storage_path).toContain('audio/');
    });

    it('should handle database connection failures', async () => {
      // Mock database failure scenario would be set up here
      // This is a placeholder for testing database resilience
      
      const audioBuffer = Buffer.from('Test content for db failure');
      
      // This test would require mocking Supabase to simulate failures
      // Implementation depends on testing strategy for external dependencies
    });
  });

  describe('Storage Integration', () => {
    it('should upload files to Supabase storage', async () => {
      const audioBuffer = Buffer.from('Storage integration test content');
      
      const response = await request(app)
        .post('/api/v1/upload/simple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', audioBuffer, 'storage-test.mp3');

      expect(response.status).toBe(200);
      expect(response.body.data.storagePath).toContain('audio/');
      expect(response.body.data.storagePath).toContain(userId);

      // Verify file exists in storage by generating signed URL
      // This would require actual Supabase connection in full integration test
    });
  });

  // Helper functions
  async function getMeetingFromDb(meetingId: string) {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single();

      if (error) {
        console.error('Database query error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get meeting from database:', error);
      return null;
    }
  }

  async function cleanupTestData() {
    try {
      // Clean up test meetings
      await supabase
        .from('meetings')
        .delete()
        .eq('user_id', userId);

      // Clean up test files from storage
      const { data: files } = await supabase.storage
        .from('audio-files')
        .list(`audio/${userId}`, {
          limit: 100
        });

      if (files && files.length > 0) {
        const filePaths = files.map(file => `audio/${userId}/${file.name}`);
        await supabase.storage
          .from('audio-files')
          .remove(filePaths);
      }
    } catch (error) {
      console.warn('Failed to clean up test data:', error);
    }
  }
});