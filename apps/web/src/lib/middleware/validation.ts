import { z } from 'zod';
import { NextRequest } from 'next/server';

// Validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Input validation with Zod
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: ['Validation error occurred']
    };
  }
}

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Sanitize object recursively
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

// Content type validation
export function validateContentType(
  request: NextRequest,
  expectedTypes: string[] = ['application/json']
): boolean {
  const contentType = request.headers.get('content-type');
  
  if (!contentType) {
    return false;
  }
  
  return expectedTypes.some(type => 
    contentType.toLowerCase().includes(type.toLowerCase())
  );
}

// Request size validation (in bytes)
export async function validateRequestSize(
  request: NextRequest,
  maxSize: number = 10 * 1024 * 1024 // 10MB default
): Promise<boolean> {
  try {
    const contentLength = request.headers.get('content-length');
    
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      return size <= maxSize;
    }
    
    // If no content-length header, try to get body size
    const clone = request.clone();
    const body = await clone.text();
    const size = new Blob([body]).size;
    
    return size <= maxSize;
  } catch {
    return false;
  }
}

// Common validation schemas
export const commonSchemas = {
  // User ID validation
  userId: z.string().uuid('Invalid user ID format'),
  
  // Meeting ID validation  
  meetingId: z.string().uuid('Invalid meeting ID format'),
  
  // Pagination parameters
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20)
  }),
  
  // Meeting type validation
  meetingType: z.enum([
    'one_on_one',
    'team_standup', 
    'executive_review',
    'client_meeting',
    'board_presentation',
    'product_review',
    'other'
  ], {
    errorMap: () => ({ message: 'Invalid meeting type' })
  }),
  
  // PM role validation
  pmRole: z.enum([
    'PM',
    'Senior PM', 
    'Staff PM',
    'Principal PM',
    'Group PM',
    'Director',
    'VP Product',
    'CPO',
    'Product Owner'
  ], {
    errorMap: () => ({ message: 'Invalid PM role' })
  }),
  
  // Industry validation
  industry: z.enum([
    'healthcare',
    'fintech',
    'cybersecurity', 
    'enterprise',
    'consumer',
    'other'
  ], {
    errorMap: () => ({ message: 'Invalid industry' })
  })
};

// Business rule validation functions
export const businessRules = {
  // Validate user owns the meeting
  async validateMeetingOwnership(
    meetingId: string,
    userId: string,
    supabase: any
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('user_id')
        .eq('id', meetingId)
        .single();
      
      if (error) {
        return { valid: false, error: 'Meeting not found' };
      }
      
      if (data.user_id !== userId) {
        return { valid: false, error: 'Access denied' };
      }
      
      return { valid: true };
    } catch {
      return { valid: false, error: 'Validation failed' };
    }
  },

  // Validate practice session ownership
  async validatePracticeSessionOwnership(
    sessionId: string,
    userId: string,
    supabase: any
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('user_id')
        .eq('id', sessionId)
        .single();
      
      if (error) {
        return { valid: false, error: 'Practice session not found' };
      }
      
      if (data.user_id !== userId) {
        return { valid: false, error: 'Access denied' };
      }
      
      return { valid: true };
    } catch {
      return { valid: false, error: 'Validation failed' };
    }
  },

  // Validate file upload constraints
  validateFileUpload(
    file: File,
    allowedTypes: string[] = ['audio/mpeg', 'audio/wav', 'audio/webm'],
    maxSize: number = 100 * 1024 * 1024 // 100MB
  ): { valid: boolean; error?: string } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
      };
    }
    
    // Check file size
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return { 
        valid: false, 
        error: `File too large. Maximum size: ${maxMB}MB` 
      };
    }
    
    return { valid: true };
  }
};

// Error response formatter
export function formatValidationError(errors: string[]) {
  return {
    error: 'Validation failed',
    details: errors,
    timestamp: new Date().toISOString()
  };
}

// Success response formatter
export function formatSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}