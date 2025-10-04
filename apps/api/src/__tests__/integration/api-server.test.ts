import request from 'supertest';
import app from '../../index';

describe('API Server Integration', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String),
        version: expect.any(String),
        uptime: expect.any(Number)
      });
    });
  });

  describe('API Root', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api/v1')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'ShipSpeak API v1',
        version: expect.any(String),
        timestamp: expect.any(String)
      });
    });
  });

  describe('404 Handling', () => {
    it('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route GET /non-existent-route not found'
        },
        meta: expect.objectContaining({
          requestId: expect.any(String),
          timestamp: expect.any(String)
        })
      });
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers when origin provided', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from helmet', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });
});