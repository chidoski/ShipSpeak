import { Request, Response, NextFunction } from 'express';
import { ApiError, errorHandler, notFoundHandler, asyncHandler } from '@/middleware/error';
import { ApiErrorCode } from '@/types/api';
import { logger } from '@/utils/logger';

jest.mock('@/utils/logger');

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test',
      path: '/test',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent')
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    (mockRequest as any).requestId = 'test-request-id';
    (mockRequest as any).startTime = Date.now() - 100;

    jest.clearAllMocks();
  });

  describe('ApiError', () => {
    it('should create ApiError with correct properties', () => {
      const error = new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Test validation error',
        details: { field: 'email' }
      });

      expect(error.name).toBe('ApiError');
      expect(error.code).toBe(ApiErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Test validation error');
      expect(error.details).toEqual({ field: 'email' });
      expect(error.statusCode).toBe(400);
    });

    it('should map error codes to correct status codes', () => {
      const testCases = [
        { code: ApiErrorCode.VALIDATION_ERROR, expectedStatus: 400 },
        { code: ApiErrorCode.AUTHENTICATION_ERROR, expectedStatus: 401 },
        { code: ApiErrorCode.AUTHORIZATION_ERROR, expectedStatus: 403 },
        { code: ApiErrorCode.NOT_FOUND, expectedStatus: 404 },
        { code: ApiErrorCode.CONFLICT, expectedStatus: 409 },
        { code: ApiErrorCode.RATE_LIMIT_EXCEEDED, expectedStatus: 429 },
        { code: ApiErrorCode.INTERNAL_ERROR, expectedStatus: 500 },
        { code: ApiErrorCode.SERVICE_UNAVAILABLE, expectedStatus: 503 },
        { code: ApiErrorCode.EXTERNAL_SERVICE_ERROR, expectedStatus: 502 }
      ];

      testCases.forEach(({ code, expectedStatus }) => {
        const error = new ApiError({
          code,
          message: 'Test error'
        });

        expect(error.statusCode).toBe(expectedStatus);
      });
    });

    it('should allow custom status code', () => {
      const error = new ApiError({
        code: ApiErrorCode.INTERNAL_ERROR,
        message: 'Test error',
        statusCode: 418
      });

      expect(error.statusCode).toBe(418);
    });
  });

  describe('errorHandler', () => {
    it('should handle ApiError correctly', () => {
      const apiError = new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Test validation error',
        details: { field: 'email' }
      });

      errorHandler(
        apiError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Test validation error',
          details: { field: 'email' },
          stack: expect.any(String)
        },
        meta: {
          requestId: 'test-request-id',
          timestamp: expect.any(String),
          version: expect.any(String),
          processingTime: expect.any(Number)
        }
      });

      expect(logger.warn).toHaveBeenCalledWith(
        'API Error',
        expect.objectContaining({
          requestId: 'test-request-id',
          error: expect.objectContaining({
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Test validation error'
          })
        })
      );
    });

    it('should handle generic Error in development', () => {
      process.env.NODE_ENV = 'development';
      
      const genericError = new Error('Generic error message');

      errorHandler(
        genericError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ApiErrorCode.INTERNAL_ERROR,
          message: 'Generic error message',
          stack: expect.any(String)
        },
        meta: expect.any(Object)
      });

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled Error',
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Generic error message'
          })
        })
      );

      process.env.NODE_ENV = 'test';
    });

    it('should handle generic Error in production', () => {
      process.env.NODE_ENV = 'production';
      
      const genericError = new Error('Generic error message');

      errorHandler(
        genericError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ApiErrorCode.INTERNAL_ERROR,
          message: 'Internal server error',
          stack: undefined
        },
        meta: expect.any(Object)
      });

      process.env.NODE_ENV = 'test';
    });

    it('should handle missing requestId gracefully', () => {
      delete (mockRequest as any).requestId;
      delete (mockRequest as any).startTime;

      const apiError = new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Not found'
      });

      errorHandler(
        apiError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: expect.any(Object),
        meta: {
          requestId: 'unknown',
          timestamp: expect.any(String),
          version: expect.any(String),
          processingTime: expect.any(Number)
        }
      });
    });
  });

  describe('notFoundHandler', () => {
    it('should create not found error', () => {
      notFoundHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          code: ApiErrorCode.NOT_FOUND,
          message: 'Route GET /test not found'
        })
      );
    });
  });

  describe('asyncHandler', () => {
    it('should handle successful async function', async () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = asyncHandler(asyncFn);

      wrappedFn(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      await new Promise(process.nextTick);

      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should catch and forward async function errors', async () => {
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(asyncFn);

      wrappedFn(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      await new Promise(process.nextTick);

      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle synchronous errors in async function', async () => {
      const error = new Error('Sync error in async');
      const asyncFn = jest.fn().mockImplementation(() => {
        throw error;
      });
      const wrappedFn = asyncHandler(asyncFn);

      wrappedFn(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      await new Promise(process.nextTick);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});