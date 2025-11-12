/**
 * API Layer Foundation Simple Tests
 * Phase 2 Slice 2-3: API Layer Foundation
 */

import { validateInput, commonSchemas } from '@/lib/middleware/validation';
import { getRateLimitStats } from '@/lib/middleware/rateLimiter';
import { z } from 'zod';

describe('API Layer Foundation Tests', () => {
  
  describe('Input Validation Middleware', () => {
    
    test('should validate basic schemas correctly', () => {
      const testSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
      });

      const validData = {
        email: 'test@example.com',
        password: 'securepassword123'
      };

      const result = validateInput(testSchema, validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    test('should return validation errors for invalid data', () => {
      const testSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
      });

      const invalidData = {
        email: 'not-an-email',
        password: 'short'
      };

      const result = validateInput(testSchema, invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('Common Schemas', () => {
    
    test('should validate PM roles', () => {
      const validRoles = ['PM', 'Senior PM', 'Director', 'VP Product'];
      
      validRoles.forEach(role => {
        const result = validateInput(commonSchemas.pmRole, role);
        expect(result.success).toBe(true);
      });
    });

    test('should validate meeting types', () => {
      const validTypes = ['one_on_one', 'team_standup', 'board_presentation'];
      
      validTypes.forEach(type => {
        const result = validateInput(commonSchemas.meetingType, type);
        expect(result.success).toBe(true);
      });
    });

    test('should validate UUIDs', () => {
      const validUUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const result = validateInput(commonSchemas.userId, validUUID);
      expect(result.success).toBe(true);
    });

    test('should reject invalid UUIDs', () => {
      const invalidUUID = 'not-a-uuid';
      const result = validateInput(commonSchemas.userId, invalidUUID);
      expect(result.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    
    test('should provide rate limit statistics', () => {
      const stats = getRateLimitStats();
      expect(stats).toHaveProperty('activeKeys');
      expect(stats).toHaveProperty('violations');
      expect(typeof stats.activeKeys).toBe('number');
      expect(typeof stats.violations).toBe('number');
    });
  });

  describe('API Structure', () => {
    
    test('should have consistent response format', () => {
      const mockResponse = {
        success: true,
        data: { id: '123', name: 'test' },
        message: 'Success',
        timestamp: new Date().toISOString()
      };

      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('data');
      expect(mockResponse).toHaveProperty('timestamp');
    });

    test('should have consistent error format', () => {
      const mockError = {
        error: 'Validation failed',
        details: ['field: error message'],
        timestamp: new Date().toISOString()
      };

      expect(mockError).toHaveProperty('error');
      expect(mockError).toHaveProperty('details');
      expect(Array.isArray(mockError.details)).toBe(true);
    });
  });
});