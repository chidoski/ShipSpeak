import { Request, Response, NextFunction } from 'express';
import { errorHandler, notFoundHandler, asyncHandler } from '../../../middleware/error';
import { ApiError, ApiErrorCode } from '../../../types/api';

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
          stack: undefined
        },
        meta: {
          requestId: 'test-request-id',
          timestamp: expect.any(String),
          version: expect.any(String),
          processingTime: expect.any(Number)
        }
      });
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

      process.env.NODE_ENV = 'test';
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
  });
});