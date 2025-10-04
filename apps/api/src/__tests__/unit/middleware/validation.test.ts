/**
 * Input Validation Middleware TDD Tests
 * Following RED-GREEN-REFACTOR methodology
 */

import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { 
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateCreateMeeting,
  validateMeetingQuery,
  validateGenerateScenarios,
  validateStartPracticeSession,
  validateStartAnalysis,
  validateAudioUpload,
  validateUUID,
  validatePagination,
  validateTimeRange,
  sanitizeInput
} from '../../../middleware/validation';

describe('Input Validation Middleware - TDD', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    
    // Add request ID middleware like in the main app
    app.use((req: Request, _res: Response, next: NextFunction) => {
      (req as any).requestId = uuidv4();
      next();
    });
    
    app.use(express.json());
    app.use(sanitizeInput);
  });

  describe('handleValidationErrors', () => {
    beforeEach(() => {
      app.post('/test-validation', 
        validateRegister,
        handleValidationErrors,
        (_req: Request, res: Response) => {
          res.json({ success: true, message: 'Validation passed' });
        }
      );
    });

    it('should pass through when no validation errors', async () => {
      const validUser = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/test-validation')
        .send(validUser)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Validation passed'
      });
    });

    it('should return validation error response when validation fails', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'weak',
        firstName: '',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/test-validation')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: {
            errors: expect.arrayContaining([
              expect.objectContaining({
                field: expect.any(String),
                message: expect.any(String)
              })
            ])
          }
        },
        meta: {
          timestamp: expect.any(String),
          requestId: expect.any(String)
        }
      });
    });

    it('should include specific field errors in validation response', async () => {
      const invalidUser = {
        email: 'not-an-email',
        password: 'weak'
      };

      const response = await request(app)
        .post('/test-validation')
        .send(invalidUser)
        .expect(400);

      const errors = response.body.error.details.errors;
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('email')
          }),
          expect.objectContaining({
            field: 'password',
            message: expect.stringContaining('Password must be')
          })
        ])
      );
    });
  });

  describe('Authentication Validation', () => {
    describe('validateRegister', () => {
      beforeEach(() => {
        app.post('/test-register', 
          validateRegister,
          handleValidationErrors,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid registration data', async () => {
        const validData = {
          email: 'user@example.com',
          password: 'SecurePass123!',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'user'
        };

        await request(app)
          .post('/test-register')
          .send(validData)
          .expect(200);
      });

      it('should reject invalid email format', async () => {
        const invalidData = {
          email: 'not-an-email',
          password: 'SecurePass123!',
          firstName: 'Jane',
          lastName: 'Smith'
        };

        const response = await request(app)
          .post('/test-register')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
              message: 'Valid email is required'
            })
          ])
        );
      });

      it('should reject weak passwords', async () => {
        const weakPasswords = [
          'short',
          'nouppercase123!',
          'NOLOWERCASE123!',
          'NoNumbers!',
          'NoSpecialChars123'
        ];

        for (const password of weakPasswords) {
          const invalidData = {
            email: 'test@example.com',
            password,
            firstName: 'Test',
            lastName: 'User'
          };

          const response = await request(app)
            .post('/test-register')
            .send(invalidData)
            .expect(400);

          expect(response.body.error.details.errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                field: 'password',
                message: expect.stringContaining('Password must be')
              })
            ])
          );
        }
      });

      it('should require firstName and lastName', async () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'SecurePass123!'
          // Missing firstName and lastName
        };

        const response = await request(app)
          .post('/test-register')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'firstName',
              message: expect.stringContaining('First name')
            }),
            expect.objectContaining({
              field: 'lastName',
              message: expect.stringContaining('Last name')
            })
          ])
        );
      });

      it('should reject invalid role values', async () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'Test',
          lastName: 'User',
          role: 'invalid-role'
        };

        const response = await request(app)
          .post('/test-register')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'role',
              message: 'Invalid role specified'
            })
          ])
        );
      });

      it('should trim and normalize firstName and lastName', async () => {
        const dataWithSpaces = {
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: '  John  ',
          lastName: '  Doe  '
        };

        await request(app)
          .post('/test-register')
          .send(dataWithSpaces)
          .expect(200);
      });
    });

    describe('validateLogin', () => {
      beforeEach(() => {
        app.post('/test-login',
          validateLogin,
          handleValidationErrors,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid login credentials', async () => {
        const validData = {
          email: 'user@example.com',
          password: 'anypassword'
        };

        await request(app)
          .post('/test-login')
          .send(validData)
          .expect(200);
      });

      it('should reject invalid email format', async () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'password'
        };

        const response = await request(app)
          .post('/test-login')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
              message: 'Valid email is required'
            })
          ])
        );
      });

      it('should require password field', async () => {
        const invalidData = {
          email: 'test@example.com'
          // Missing password
        };

        const response = await request(app)
          .post('/test-login')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'password',
              message: 'Password is required'
            })
          ])
        );
      });
    });
  });

  describe('Meeting Validation', () => {
    describe('validateCreateMeeting', () => {
      beforeEach(() => {
        app.post('/test-meeting',
          validateCreateMeeting,
          handleValidationErrors,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid meeting data', async () => {
        const validData = {
          title: 'Team Standup',
          description: 'Daily team standup meeting',
          participantCount: 5,
          duration: 30,
          meetingType: 'standup',
          tags: ['daily', 'team']
        };

        await request(app)
          .post('/test-meeting')
          .send(validData)
          .expect(200);
      });

      it('should require meeting title', async () => {
        const invalidData = {
          description: 'Meeting without title'
        };

        const response = await request(app)
          .post('/test-meeting')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'title',
              message: expect.stringContaining('Meeting title')
            })
          ])
        );
      });

      it('should validate title length limits', async () => {
        const invalidData = {
          title: 'a'.repeat(201) // 201 characters, exceeds 200 limit
        };

        const response = await request(app)
          .post('/test-meeting')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'title',
              message: expect.stringContaining('1-200 characters')
            })
          ])
        );
      });

      it('should validate participant count range', async () => {
        const invalidData = {
          title: 'Test Meeting',
          participantCount: 101 // Exceeds maximum of 100
        };

        const response = await request(app)
          .post('/test-meeting')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'participantCount',
              message: expect.stringContaining('between 1 and 100')
            })
          ])
        );
      });

      it('should validate meeting duration range', async () => {
        const invalidData = {
          title: 'Long Meeting',
          duration: 500 // Exceeds maximum of 480 minutes (8 hours)
        };

        const response = await request(app)
          .post('/test-meeting')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'duration',
              message: expect.stringContaining('between 1 and 480')
            })
          ])
        );
      });

      it('should validate meeting type', async () => {
        const invalidData = {
          title: 'Test Meeting',
          meetingType: 'invalid-type'
        };

        const response = await request(app)
          .post('/test-meeting')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'meetingType',
              message: 'Invalid meeting type'
            })
          ])
        );
      });

      it('should limit number of tags', async () => {
        const invalidData = {
          title: 'Test Meeting',
          tags: Array(11).fill('tag') // 11 tags, exceeds maximum of 10
        };

        const response = await request(app)
          .post('/test-meeting')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'tags',
              message: 'Maximum 10 tags allowed'
            })
          ])
        );
      });

      it('should validate individual tag length', async () => {
        const invalidData = {
          title: 'Test Meeting',
          tags: ['a'.repeat(31)] // 31 characters, exceeds 30 limit
        };

        const response = await request(app)
          .post('/test-meeting')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'tags.0',
              message: expect.stringContaining('1-30 characters')
            })
          ])
        );
      });
    });

    describe('validateMeetingQuery', () => {
      beforeEach(() => {
        app.get('/test-meetings',
          validateMeetingQuery,
          handleValidationErrors,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid query parameters', async () => {
        await request(app)
          .get('/test-meetings?page=1&limit=10&sortBy=createdAt&sortOrder=desc&status=CREATED')
          .expect(200);
      });

      it('should validate page parameter', async () => {
        const response = await request(app)
          .get('/test-meetings?page=0')
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'page',
              message: expect.stringContaining('positive integer')
            })
          ])
        );
      });

      it('should validate limit parameter range', async () => {
        const response = await request(app)
          .get('/test-meetings?limit=101')
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'limit',
              message: expect.stringContaining('between 1 and 100')
            })
          ])
        );
      });

      it('should validate sortBy parameter values', async () => {
        const response = await request(app)
          .get('/test-meetings?sortBy=invalidField')
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'sortBy',
              message: 'Invalid sort field'
            })
          ])
        );
      });

      it('should validate sortOrder parameter values', async () => {
        const response = await request(app)
          .get('/test-meetings?sortOrder=invalid')
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'sortOrder',
              message: expect.stringContaining('asc or desc')
            })
          ])
        );
      });
    });
  });

  describe('Scenario Validation', () => {
    describe('validateGenerateScenarios', () => {
      beforeEach(() => {
        app.post('/test-scenarios',
          validateGenerateScenarios,
          handleValidationErrors,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid scenario generation request', async () => {
        const validData = {
          count: 5,
          category: 'EXECUTIVE_PRESENCE',
          difficulty: 3,
          personalizeFor: '123e4567-e89b-12d3-a456-426614174000',
          focusOnWeaknesses: true,
          adaptToCommunicationStyle: false
        };

        await request(app)
          .post('/test-scenarios')
          .send(validData)
          .expect(200);
      });

      it('should validate count range', async () => {
        const invalidData = {
          count: 11 // Exceeds maximum of 10
        };

        const response = await request(app)
          .post('/test-scenarios')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'count',
              message: expect.stringContaining('between 1 and 10')
            })
          ])
        );
      });

      it('should validate scenario category', async () => {
        const invalidData = {
          count: 3,
          category: 'INVALID_CATEGORY'
        };

        const response = await request(app)
          .post('/test-scenarios')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'category',
              message: 'Invalid scenario category'
            })
          ])
        );
      });

      it('should validate difficulty range', async () => {
        const invalidData = {
          count: 3,
          difficulty: 6 // Exceeds maximum of 5
        };

        const response = await request(app)
          .post('/test-scenarios')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'difficulty',
              message: expect.stringContaining('between 1 and 5')
            })
          ])
        );
      });

      it('should validate UUID format for personalizeFor', async () => {
        const invalidData = {
          count: 3,
          personalizeFor: 'not-a-uuid'
        };

        const response = await request(app)
          .post('/test-scenarios')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'personalizeFor',
              message: expect.stringContaining('Valid user ID')
            })
          ])
        );
      });
    });

    describe('validateStartPracticeSession', () => {
      beforeEach(() => {
        app.post('/test-practice/:scenarioId',
          validateStartPracticeSession,
          handleValidationErrors,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid practice session data', async () => {
        const validData = {
          mode: 'guided',
          timeLimit: 1800, // 30 minutes
          recordSession: true
        };

        await request(app)
          .post('/test-practice/123e4567-e89b-12d3-a456-426614174000')
          .send(validData)
          .expect(200);
      });

      it('should validate scenario ID format', async () => {
        const validData = {
          mode: 'guided',
          recordSession: true
        };

        const response = await request(app)
          .post('/test-practice/invalid-uuid')
          .send(validData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'scenarioId',
              message: expect.stringContaining('Valid scenario ID')
            })
          ])
        );
      });

      it('should validate practice mode', async () => {
        const invalidData = {
          mode: 'invalid-mode',
          recordSession: true
        };

        const response = await request(app)
          .post('/test-practice/123e4567-e89b-12d3-a456-426614174000')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'mode',
              message: expect.stringContaining('guided, freeform, or timed')
            })
          ])
        );
      });

      it('should validate time limit range', async () => {
        const invalidData = {
          mode: 'timed',
          timeLimit: 30, // Below minimum of 60 seconds
          recordSession: true
        };

        const response = await request(app)
          .post('/test-practice/123e4567-e89b-12d3-a456-426614174000')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'timeLimit',
              message: expect.stringContaining('between 60 and 7200')
            })
          ])
        );
      });
    });
  });

  describe('Smart Sampling Validation', () => {
    describe('validateStartAnalysis', () => {
      beforeEach(() => {
        app.post('/test-analysis',
          validateStartAnalysis,
          handleValidationErrors,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid analysis request', async () => {
        const validData = {
          meetingId: '123e4567-e89b-12d3-a456-426614174000',
          configName: 'BALANCED',
          priority: 'standard'
        };

        await request(app)
          .post('/test-analysis')
          .send(validData)
          .expect(200);
      });

      it('should validate meeting ID format', async () => {
        const invalidData = {
          meetingId: 'invalid-uuid',
          configName: 'BALANCED'
        };

        const response = await request(app)
          .post('/test-analysis')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'meetingId',
              message: expect.stringContaining('Valid meeting ID')
            })
          ])
        );
      });

      it('should validate config name', async () => {
        const invalidData = {
          meetingId: '123e4567-e89b-12d3-a456-426614174000',
          configName: 'INVALID_CONFIG'
        };

        const response = await request(app)
          .post('/test-analysis')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'configName',
              message: 'Invalid configuration name'
            })
          ])
        );
      });

      it('should validate custom config parameters', async () => {
        const invalidData = {
          meetingId: '123e4567-e89b-12d3-a456-426614174000',
          configName: 'CUSTOM',
          customConfig: {
            samplingRatio: 1.5, // Invalid: > 1
            confidenceThreshold: -0.1, // Invalid: < 0
            chunkSizeSeconds: 3 // Invalid: < 5
          }
        };

        const response = await request(app)
          .post('/test-analysis')
          .send(invalidData)
          .expect(400);

        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'customConfig.samplingRatio',
              message: expect.stringContaining('between 0 and 1')
            }),
            expect.objectContaining({
              field: 'customConfig.confidenceThreshold',
              message: expect.stringContaining('between 0 and 1')
            }),
            expect.objectContaining({
              field: 'customConfig.chunkSizeSeconds',
              message: expect.stringContaining('between 5 and 300')
            })
          ])
        );
      });
    });
  });

  describe('File Upload Validation', () => {
    describe('validateAudioUpload', () => {
      beforeEach(() => {
        app.post('/test-upload',
          validateAudioUpload,
          (_req: Request, res: Response) => res.json({ success: true })
        );
      });

      it('should accept valid audio file upload (mock)', async () => {
        const response = await request(app)
          .post('/test-upload')
          .send({ 
            mockFile: true, 
            filename: 'meeting.mp3' 
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      it('should reject request without file', async () => {
        const response = await request(app)
          .post('/test-upload')
          .send({})
          .expect(400);

        expect(response.body.error.message).toContain('Audio file is required');
      });

      it('should validate audio file format', async () => {
        const response = await request(app)
          .post('/test-upload')
          .send({ 
            mockFile: true, 
            filename: 'document.pdf' 
          })
          .expect(400);

        expect(response.body.error.message).toContain('Invalid audio format');
      });

      it('should accept all supported audio formats', async () => {
        const supportedFormats = ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac'];

        for (const format of supportedFormats) {
          await request(app)
            .post('/test-upload')
            .send({ 
              mockFile: true, 
              filename: `audio.${format}` 
            })
            .expect(200);
        }
      });
    });
  });

  describe('sanitizeInput', () => {
    beforeEach(() => {
      app.post('/test-sanitize', (_req: Request, res: Response) => {
        res.json({ 
          body: (res as any).req.body,
          query: (res as any).req.query 
        });
      });
    });

    it('should remove null bytes from strings', async () => {
      const maliciousData = {
        title: 'Clean title\0with null byte',
        description: 'Normal text\0\0more nulls'
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousData)
        .expect(200);

      expect(response.body.body.title).toBe('Clean titlewith null byte');
      expect(response.body.body.description).toBe('Normal textmore nulls');
    });

    it('should normalize whitespace in strings', async () => {
      const messyData = {
        title: '  Multiple   spaces    normalized  ',
        tags: ['  tag1  ', '  tag2   with   spaces  ']
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(messyData)
        .expect(200);

      expect(response.body.body.title).toBe('Multiple spaces normalized');
      expect(response.body.body.tags).toEqual(['tag1', 'tag2 with spaces']);
    });

    it('should preserve non-string values', async () => {
      const mixedData = {
        title: '  String with spaces  ',
        count: 42,
        enabled: true,
        nullable: null,
        nested: {
          text: '  nested string  ',
          number: 123
        }
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(mixedData)
        .expect(200);

      expect(response.body.body).toEqual({
        title: 'String with spaces',
        count: 42,
        enabled: true,
        nullable: null,
        nested: {
          text: 'nested string',
          number: 123
        }
      });
    });
  });

  describe('UUID Validation', () => {
    it('should validate UUID parameters', async () => {
      app.get('/test-uuid/:id', 
        validateUUID('id'),
        handleValidationErrors,
        (_req: Request, res: Response) => res.json({ success: true })
      );

      // Valid UUID
      await request(app)
        .get('/test-uuid/123e4567-e89b-12d3-a456-426614174000')
        .expect(200);

      // Invalid UUID
      const response = await request(app)
        .get('/test-uuid/invalid-uuid')
        .expect(400);

      expect(response.body.error.details.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'id',
            message: expect.stringContaining('Valid id is required')
          })
        ])
      );
    });
  });

  describe('Pagination Validation', () => {
    beforeEach(() => {
      app.get('/test-pagination',
        validatePagination,
        handleValidationErrors,
        (_req: Request, res: Response) => res.json({ success: true })
      );
    });

    it('should accept valid pagination parameters', async () => {
      await request(app)
        .get('/test-pagination?page=2&limit=50')
        .expect(200);
    });

    it('should validate page parameter', async () => {
      const response = await request(app)
        .get('/test-pagination?page=-1')
        .expect(400);

      expect(response.body.error.details.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'page',
            message: expect.stringContaining('positive integer')
          })
        ])
      );
    });

    it('should validate limit parameter range', async () => {
      const response = await request(app)
        .get('/test-pagination?limit=200')
        .expect(400);

      expect(response.body.error.details.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'limit',
            message: expect.stringContaining('between 1 and 100')
          })
        ])
      );
    });
  });

  describe('Time Range Validation', () => {
    beforeEach(() => {
      app.get('/test-timerange',
        validateTimeRange,
        handleValidationErrors,
        (_req: Request, res: Response) => res.json({ success: true })
      );
    });

    it('should accept valid time range parameters', async () => {
      await request(app)
        .get('/test-timerange?timeRange=30d')
        .expect(200);

      await request(app)
        .get('/test-timerange?startDate=2023-01-01T00:00:00Z&endDate=2023-12-31T23:59:59Z')
        .expect(200);
    });

    it('should validate time range values', async () => {
      const response = await request(app)
        .get('/test-timerange?timeRange=invalid')
        .expect(400);

      expect(response.body.error.details.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'timeRange',
            message: 'Invalid time range'
          })
        ])
      );
    });

    it('should validate ISO 8601 date format', async () => {
      const response = await request(app)
        .get('/test-timerange?startDate=invalid-date')
        .expect(400);

      expect(response.body.error.details.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'startDate',
            message: expect.stringContaining('valid ISO 8601 date')
          })
        ])
      );
    });
  });
});