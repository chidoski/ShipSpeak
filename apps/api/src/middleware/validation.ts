/**
 * Input Validation Middleware
 * Provides comprehensive validation for API requests
 */

import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { ApiError, ApiErrorCode } from '../types/api';

/**
 * Handle validation results
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => {
      let field = (error as any).path || (error as any).param || 'unknown';
      // Normalize array field names from tags[0] to tags.0
      field = field.replace(/\[(\d+)\]/g, '.$1');
      
      return {
        field,
        message: error.msg,
        value: (error as any).value
      };
    });

    const error = new ApiError({
      code: ApiErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      details: { errors: formattedErrors }
    });

    res.status(400).json({
      success: false,
      error: error.toJSON(),
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
    return;
  }

  next();
};

/**
 * Custom validators
 */
const customValidators = {
  isStrongPassword: (value: string) => {
    if (!value) return false;
    
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    return value.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  isValidMeetingType: (value: string) => {
    const validTypes = ['standup', 'review', 'planning', 'retrospective', 'one-on-one', 'presentation', 'demo', 'other'];
    return validTypes.includes(value.toLowerCase());
  },

  isValidDifficulty: (value: number) => {
    return Number.isInteger(value) && value >= 1 && value <= 5;
  },

  isValidProgress: (value: number) => {
    return typeof value === 'number' && value >= 0 && value <= 100;
  },

  isValidTimeRange: (value: string) => {
    const validRanges = ['1d', '7d', '30d', '90d', '365d', 'all'];
    return validRanges.includes(value);
  },

  isValidAudioFormat: (filename: string) => {
    const validFormats = /\.(mp3|wav|m4a|flac|ogg|aac)$/i;
    return validFormats.test(filename);
  },

  isValidExportFormat: (value: string) => {
    const validFormats = ['json', 'csv', 'pdf', 'xlsx'];
    return validFormats.includes(value.toLowerCase());
  },

  isValidSamplingRatio: (value: number) => {
    return typeof value === 'number' && value >= 0 && value <= 1;
  },

  isValidConfigName: (value: string) => {
    const validConfigs = ['COST_OPTIMIZED', 'BALANCED', 'QUALITY_FOCUSED', 'ENTERPRISE', 'CUSTOM'];
    return validConfigs.includes(value);
  }
};

/**
 * Authentication validation
 */
export const validateRegister: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .custom(customValidators.isStrongPassword)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be 1-50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be 1-50 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'premium'])
    .withMessage('Invalid role specified')
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

/**
 * Meeting validation
 */
export const validateCreateMeeting: ValidationChain[] = [
  body('title')
    .exists({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Meeting title is required and must be 1-200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('participantCount')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Participant count must be between 1 and 100'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 }) // 8 hours max
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('meetingType')
    .optional()
    .custom(customValidators.isValidMeetingType)
    .withMessage('Invalid meeting type'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Maximum 10 tags allowed'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be 1-30 characters')
];

export const validateUpdateMeeting: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Valid meeting ID is required'),
  ...validateCreateMeeting.map(validator => validator.optional())
];

export const validateMeetingId: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Valid meeting ID is required')
];

export const validateMeetingQuery: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'duration'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('status')
    .optional()
    .isIn(['CREATED', 'UPLOADED', 'PROCESSING', 'ANALYZED', 'FAILED'])
    .withMessage('Invalid status filter'),
  query('meetingType')
    .optional()
    .custom(customValidators.isValidMeetingType)
    .withMessage('Invalid meeting type filter')
];

/**
 * Scenario validation
 */
export const validateGenerateScenarios: ValidationChain[] = [
  body('count')
    .isInt({ min: 1, max: 10 })
    .withMessage('Count must be between 1 and 10'),
  body('category')
    .optional()
    .isIn([
      'EXECUTIVE_PRESENCE', 'STAKEHOLDER_INFLUENCE', 'STRATEGIC_COMMUNICATION',
      'DATA_STORYTELLING', 'CONFLICT_RESOLUTION', 'PRODUCT_STRATEGY',
      'ROADMAP_DEFENSE', 'RESOURCE_NEGOTIATION', 'CUSTOMER_ADVOCACY', 'TECHNICAL_TRANSLATION'
    ])
    .withMessage('Invalid scenario category'),
  body('difficulty')
    .optional()
    .custom(customValidators.isValidDifficulty)
    .withMessage('Difficulty must be between 1 and 5'),
  body('personalizeFor')
    .optional()
    .isUUID()
    .withMessage('Valid user ID required for personalization'),
  body('basedOnMeetingId')
    .optional()
    .isUUID()
    .withMessage('Valid meeting ID required'),
  body('focusOnWeaknesses')
    .optional()
    .isBoolean()
    .withMessage('Focus on weaknesses must be boolean'),
  body('adaptToCommunicationStyle')
    .optional()
    .isBoolean()
    .withMessage('Adapt to communication style must be boolean')
];

export const validateStartPracticeSession: ValidationChain[] = [
  param('scenarioId')
    .isUUID()
    .withMessage('Valid scenario ID is required'),
  body('mode')
    .isIn(['guided', 'freeform', 'timed'])
    .withMessage('Mode must be guided, freeform, or timed'),
  body('timeLimit')
    .optional()
    .isInt({ min: 60, max: 7200 }) // 1 minute to 2 hours
    .withMessage('Time limit must be between 60 and 7200 seconds'),
  body('recordSession')
    .isBoolean()
    .withMessage('Record session must be boolean')
];

export const validateSubmitResponse: ValidationChain[] = [
  param('sessionId')
    .isUUID()
    .withMessage('Valid session ID is required'),
  body('responseText')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Response text must be 1-5000 characters'),
  body('timeSpent')
    .isInt({ min: 1 })
    .withMessage('Time spent must be positive integer'),
  body('responseType')
    .isIn(['written', 'audio', 'combined'])
    .withMessage('Response type must be written, audio, or combined')
];

/**
 * Smart Sampling validation
 */
export const validateStartAnalysis: ValidationChain[] = [
  body('meetingId')
    .isUUID()
    .withMessage('Valid meeting ID is required'),
  body('configName')
    .custom(customValidators.isValidConfigName)
    .withMessage('Invalid configuration name'),
  body('customConfig')
    .optional()
    .isObject()
    .withMessage('Custom config must be an object'),
  body('customConfig.samplingRatio')
    .optional()
    .custom(customValidators.isValidSamplingRatio)
    .withMessage('Sampling ratio must be between 0 and 1'),
  body('customConfig.confidenceThreshold')
    .optional()
    .custom(customValidators.isValidSamplingRatio)
    .withMessage('Confidence threshold must be between 0 and 1'),
  body('customConfig.chunkSizeSeconds')
    .optional()
    .isInt({ min: 5, max: 300 })
    .withMessage('Chunk size must be between 5 and 300 seconds'),
  body('priority')
    .optional()
    .isIn(['low', 'standard', 'high'])
    .withMessage('Priority must be low, standard, or high')
];

export const validateExportAnalysis: ValidationChain[] = [
  param('analysisId')
    .isUUID()
    .withMessage('Valid analysis ID is required'),
  body('format')
    .custom(customValidators.isValidExportFormat)
    .withMessage('Invalid export format'),
  body('includeAudio')
    .optional()
    .isBoolean()
    .withMessage('Include audio must be boolean'),
  body('includeMoments')
    .optional()
    .isBoolean()
    .withMessage('Include moments must be boolean'),
  body('includePMInsights')
    .optional()
    .isBoolean()
    .withMessage('Include PM insights must be boolean')
];

export const validateBatchAnalysis: ValidationChain[] = [
  body('meetingIds')
    .isArray({ min: 1, max: 100 })
    .withMessage('Meeting IDs array must contain 1-100 items'),
  body('meetingIds.*')
    .isUUID()
    .withMessage('Each meeting ID must be valid UUID'),
  body('config')
    .custom(customValidators.isValidConfigName)
    .withMessage('Invalid configuration name'),
  body('priority')
    .optional()
    .isIn(['low', 'standard', 'high'])
    .withMessage('Priority must be low, standard, or high')
];

/**
 * File upload validation
 */
export const validateAudioUpload = (req: Request, res: Response, next: NextFunction): void => {
  const file = (req as any).file;
  
  if (!file && !req.body.mockFile) {
    const error = new ApiError({
      code: ApiErrorCode.VALIDATION_ERROR,
      message: 'Audio file is required'
    });
    
    res.status(400).json({
      success: false,
      error: error.toJSON(),
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
    return;
  }

  // For mock files in testing
  if (req.body.mockFile || req.body.filename) {
    const filename = req.body.filename || 'test.mp3';
    if (!customValidators.isValidAudioFormat(filename)) {
      const error = new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Invalid audio format. Supported formats: mp3, wav, m4a, flac, ogg, aac'
      });
      
      res.status(400).json({
        success: false,
        error: error.toJSON(),
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId
        }
      });
      return;
    }
  }

  // Validate actual file if present
  if (file) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      const error = new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'File size must not exceed 100MB'
      });
      
      res.status(400).json({
        success: false,
        error: error.toJSON(),
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId
        }
      });
      return;
    }

    if (!customValidators.isValidAudioFormat(file.originalname)) {
      const error = new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Invalid audio format. Supported formats: mp3, wav, m4a, flac, ogg, aac'
      });
      
      res.status(400).json({
        success: false,
        error: error.toJSON(),
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId
        }
      });
      return;
    }
  }

  next();
};

/**
 * General validation helpers
 */
export const validateUUID = (paramName: string): ValidationChain[] => [
  param(paramName)
    .isUUID()
    .withMessage(`Valid ${paramName} is required`)
];

export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const validateTimeRange: ValidationChain[] = [
  query('timeRange')
    .optional()
    .custom(customValidators.isValidTimeRange)
    .withMessage('Invalid time range'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

/**
 * Sanitization helpers
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  // Remove any null bytes and normalize whitespace
  const sanitizeString = (str: string): string => {
    return str.replace(/\0/g, '').replace(/\s+/g, ' ').trim();
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};