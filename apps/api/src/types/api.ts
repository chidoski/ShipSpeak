import { Request } from 'express';
import { User } from './auth';

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;

  constructor({
    code,
    message,
    details,
    statusCode
  }: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, any>;
    statusCode?: number;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode || this.getStatusCodeFromErrorCode(code);

    Error.captureStackTrace(this, this.constructor);
  }

  private getStatusCodeFromErrorCode(code: ApiErrorCode): number {
    const statusMap: Record<ApiErrorCode, number> = {
      [ApiErrorCode.VALIDATION_ERROR]: 400,
      [ApiErrorCode.UNAUTHORIZED]: 401,
      [ApiErrorCode.AUTHENTICATION_ERROR]: 401,
      [ApiErrorCode.AUTHORIZATION_ERROR]: 403,
      [ApiErrorCode.NOT_FOUND]: 404,
      [ApiErrorCode.CONFLICT]: 409,
      [ApiErrorCode.RATE_LIMIT_EXCEEDED]: 429,
      [ApiErrorCode.INTERNAL_ERROR]: 500,
      [ApiErrorCode.SERVICE_UNAVAILABLE]: 503,
      [ApiErrorCode.EXTERNAL_SERVICE_ERROR]: 502
    };

    return statusMap[code] || 500;
  }

  public toJSON(): ApiErrorData {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }
}

export interface ApiRequest extends Request {
  user?: User;
  tokenPayload?: any;
  requestId: string;
  startTime: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiErrorData;
  meta?: ResponseMeta;
}

export interface ApiErrorData {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ResponseMeta {
  requestId: string;
  timestamp: string;
  version: string;
  processingTime: number;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  statusCode: number;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
}

export interface WebSocketRoom {
  id: string;
  name: string;
  users: Set<string>;
  created: Date;
}

export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  dependencies: {
    database: HealthCheck;
    openai: HealthCheck;
    supabase: HealthCheck;
  };
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  lastChecked: string;
  error?: string;
}