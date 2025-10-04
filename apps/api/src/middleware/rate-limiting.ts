/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and excessive usage
 * 
 * Features:
 * - Multi-tier rate limiting for different endpoint types
 * - Violation tracking and statistics
 * - Adaptive rate limiting based on system load
 * - Consistent error handling with API format
 * - Custom key generation for user-based limits
 */

import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode } from '../types/api';
import { logger } from '../utils/logger';

// Configuration constants
const VIOLATION_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const VIOLATION_RETENTION_PERIOD = 24 * 60 * 60 * 1000; // 24 hours
const HIGH_MEMORY_THRESHOLD = 0.8; // 80% memory usage

interface ViolationRecord {
  count: number;
  firstViolation: Date;
}

// Store for tracking rate limit violations
const violationStore = new Map<string, ViolationRecord>();

// Clean up old violation records periodically
const cleanupInterval = setInterval(() => {
  const now = new Date();
  for (const [ip, data] of violationStore.entries()) {
    if (now.getTime() - data.firstViolation.getTime() > VIOLATION_RETENTION_PERIOD) {
      violationStore.delete(ip);
    }
  }
}, VIOLATION_CLEANUP_INTERVAL);

/**
 * Extract client identifier from request
 */
const getClientIdentifier = (req: Request): string => {
  return req.ip || req.connection.remoteAddress || 'unknown';
};

/**
 * Track rate limit violations for monitoring
 */
const trackViolation = (clientIp: string): void => {
  const existing = violationStore.get(clientIp);
  if (existing) {
    existing.count++;
  } else {
    violationStore.set(clientIp, { count: 1, firstViolation: new Date() });
  }
};

/**
 * Custom rate limit handler with enhanced security and monitoring
 */
const rateLimitHandler = (req: Request, res: Response, _next: NextFunction): void => {
  const clientIp = getClientIdentifier(req);
  
  // Track this violation
  trackViolation(clientIp);

  // Log rate limit violation with context
  logger.warn('Rate limit exceeded', {
    ip: clientIp,
    path: req.path,
    method: req.method,
    userAgent: req.get('User-Agent'),
    violations: violationStore.get(clientIp)?.count || 0,
    timestamp: new Date().toISOString()
  });

  // Create standardized error response
  const error = new ApiError({
    code: ApiErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many requests. Please try again later.',
    details: {
      retryAfter: '60 seconds',
      limit: 'Varies by endpoint'
    }
  });

  res.status(429).json({
    success: false,
    error: error.toJSON(),
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    }
  });
};

/**
 * Rate limiting configuration presets
 */
const RATE_LIMIT_CONFIGS = {
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: 'Too many requests from this IP, please try again later'
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 auth attempts per window
    message: 'Too many authentication attempts, please try again later'
  },
  UPLOAD: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 uploads per window
    message: 'Too many upload requests, please try again later'
  },
  AI_PROCESSING: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 AI requests per hour
    message: 'AI processing quota exceeded, please try again later'
  },
  BATCH_PROCESSING: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10, // 10 batch operations per day
    message: 'Daily batch processing limit exceeded'
  },
  SENSITIVE: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 sensitive operations per hour
    message: 'Too many sensitive operations, please try again later'
  }
} as const;

/**
 * Common rate limit options
 */
const commonRateLimitOptions = {
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: rateLimitHandler
};

/**
 * Skip rate limiting for health checks and internal requests
 */
const shouldSkipRateLimit = (req: Request): boolean => {
  return req.path === '/health' || 
         req.path === '/api/v1' || 
         req.ip === '127.0.0.1';
};

/**
 * Generate rate limit key by user ID when available, fallback to IP
 */
const generateUserBasedKey = (req: Request): string => {
  const apiReq = req as any;
  return apiReq.user?.id || getClientIdentifier(req);
};

/**
 * General API rate limiting - applies to most endpoints
 */
export const generalRateLimit = rateLimit({
  ...RATE_LIMIT_CONFIGS.GENERAL,
  ...commonRateLimitOptions,
  skip: shouldSkipRateLimit
});

/**
 * Strict rate limiting for authentication endpoints
 */
export const authRateLimit = rateLimit({
  ...RATE_LIMIT_CONFIGS.AUTH,
  ...commonRateLimitOptions,
  skipSuccessfulRequests: true // Don't count successful requests
});

/**
 * Very strict rate limiting for sensitive operations
 */
export const sensitiveRateLimit = rateLimit({
  ...RATE_LIMIT_CONFIGS.SENSITIVE,
  ...commonRateLimitOptions
});

/**
 * File upload rate limiting
 */
export const uploadRateLimit = rateLimit({
  ...RATE_LIMIT_CONFIGS.UPLOAD,
  ...commonRateLimitOptions,
  keyGenerator: generateUserBasedKey
});

/**
 * AI processing rate limiting (expensive operations)
 */
export const aiProcessingRateLimit = rateLimit({
  ...RATE_LIMIT_CONFIGS.AI_PROCESSING,
  ...commonRateLimitOptions,
  keyGenerator: generateUserBasedKey
});

/**
 * Batch processing rate limiting
 */
export const batchProcessingRateLimit = rateLimit({
  ...RATE_LIMIT_CONFIGS.BATCH_PROCESSING,
  ...commonRateLimitOptions,
  keyGenerator: generateUserBasedKey
});

/**
 * Check if system is under high load
 */
const isSystemUnderHighLoad = (): boolean => {
  const memoryUsage = process.memoryUsage();
  return memoryUsage.heapUsed / memoryUsage.heapTotal > HIGH_MEMORY_THRESHOLD;
};

/**
 * Adaptive rate limiting based on system load
 */
export const adaptiveRateLimit = (req: Request, res: Response, next: NextFunction): void => {
  if (isSystemUnderHighLoad()) {
    // Apply stricter rate limiting during high load
    const strictLimit = rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 100, // Reduced limit during high load
      message: 'System under high load, please try again later',
      ...commonRateLimitOptions
    });
    
    strictLimit(req, res, next);
    return;
  }
  
  next();
};

/**
 * Rate limiting configuration for different endpoint types
 */
export const rateLimitConfig = {
  general: generalRateLimit,
  auth: authRateLimit,
  sensitive: sensitiveRateLimit,
  upload: uploadRateLimit,
  aiProcessing: aiProcessingRateLimit,
  batchProcessing: batchProcessingRateLimit,
  adaptive: adaptiveRateLimit
};

/**
 * Get comprehensive rate limit violation statistics for monitoring
 */
export const getRateLimitStats = () => {
  const stats = {
    totalViolations: 0,
    uniqueIPs: violationStore.size,
    topViolators: [] as Array<{ ip: string; violations: number; firstViolation: Date }>
  };

  for (const [ip, data] of violationStore.entries()) {
    stats.totalViolations += data.count;
    stats.topViolators.push({ 
      ip, 
      violations: data.count,
      firstViolation: data.firstViolation
    });
  }

  // Sort by violations (descending) and limit to top 10
  stats.topViolators.sort((a, b) => b.violations - a.violations);
  stats.topViolators = stats.topViolators.slice(0, 10);

  return stats;
};

/**
 * Clear all violation records (useful for testing)
 */
export const clearViolationStats = (): void => {
  violationStore.clear();
};

/**
 * Clean up resources when shutting down
 */
export const cleanup = (): void => {
  clearInterval(cleanupInterval);
  clearViolationStats();
};