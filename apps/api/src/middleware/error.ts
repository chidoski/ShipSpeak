import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode, ApiResponse } from '../types/api';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = (req as any).requestId || 'unknown';
  const startTime = (req as any).startTime || Date.now();
  const processingTime = Date.now() - startTime;

  if (error instanceof ApiError) {
    logger.warn('API Error', {
      requestId,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      request: {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      },
      processingTime
    });

    const response: ApiResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime
      }
    };

    res.status(error.statusCode).json(response);
    return;
  }

  logger.error('Unhandled Error', {
    requestId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    },
    processingTime
  });

  const response: ApiResponse = {
    success: false,
    error: {
      code: ApiErrorCode.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0.0',
      processingTime
    }
  };

  res.status(500).json(response);
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new ApiError({
    code: ApiErrorCode.NOT_FOUND,
    message: `Route ${req.method} ${req.path} not found`
  });

  next(error);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};