# API Integration Specification
## Frontend-Backend Communication Architecture

**Version:** 1.0  
**Date:** October 16, 2025  
**Epic:** Epic 3 - Frontend Integration  
**Status:** Implementation Ready  

---

## Overview

This document defines the complete API integration specification for ShipSpeak's frontend application, detailing how the Next.js frontend communicates with the Express.js backend services from Epic 2. It covers REST endpoints, WebSocket events, authentication flows, error handling, and data synchronization patterns.

---

## Architecture Overview

### Communication Layers
```
┌─────────────────────────────────────────────────────────┐
│                   Next.js Frontend                       │
├─────────────────────────────────────────────────────────┤
│                    API Client Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐     │
│  │   Axios  │  │  Socket.  │  │   React Query     │     │
│  │   Client │  │  IO Client│  │   (TanStack)      │     │
│  └──────────┘  └──────────┘  └───────────────────┘     │
├─────────────────────────────────────────────────────────┤
│                  Middleware & Interceptors               │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐     │
│  │   Auth   │  │  Retry   │  │   Rate Limit      │     │
│  │  Handler │  │  Logic   │  │   Handler         │     │
│  └──────────┘  └──────────┘  └───────────────────┘     │
└─────────────────────────────────────────────────────────┘
                            ↕
                     [HTTPS/WSS]
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  Express.js Backend                      │
│                    (Epic 2 APIs)                         │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication & Authorization

### JWT Token Flow
```typescript
// 1. Login Request
POST /api/v1/auth/login
Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": { ... }
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}

// 2. Token Storage (Frontend)
// Store in httpOnly secure cookie
document.cookie = `access_token=${access}; HttpOnly; Secure; SameSite=Strict`;
document.cookie = `refresh_token=${refresh}; HttpOnly; Secure; SameSite=Strict`;

// 3. Authenticated Request
GET /api/v1/meetings
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// 4. Token Refresh
POST /api/v1/auth/refresh
Headers: {
  "Authorization": "Bearer <refresh_token>"
}
```

### Frontend Auth Implementation
```typescript
// lib/api/auth.ts
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });

    const { tokens, user } = response.data;
    this.setTokens(tokens);
    return user;
  }

  async refreshAccessToken() {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${this.refreshToken}`
        }
      }
    ).then(response => {
      const { tokens } = response.data;
      this.setTokens(tokens);
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private setTokens(tokens: TokenPair) {
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
    
    // Store in secure cookies
    this.setCookie('access_token', tokens.access, tokens.expiresIn);
    this.setCookie('refresh_token', tokens.refresh, 7 * 24 * 60 * 60);
  }

  private setCookie(name: string, value: string, maxAge: number) {
    document.cookie = `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
  }

  getAuthHeader() {
    return this.accessToken ? `Bearer ${this.accessToken}` : '';
  }
}

export const authService = new AuthService();
```

---

## API Client Configuration

### Axios Instance Setup
```typescript
// lib/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = authService.getAuthHeader();
    if (token) {
      config.headers.Authorization = token;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authService.refreshAccessToken();
        originalRequest.headers.Authorization = authService.getAuthHeader();
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      if (retryAfter && !originalRequest._retry) {
        originalRequest._retry = true;
        await delay(parseInt(retryAfter) * 1000);
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### React Query Configuration
```typescript
// lib/api/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 429
        if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 429) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
```

---

## REST API Endpoints

### 1. Authentication Endpoints

```typescript
// lib/api/endpoints/auth.ts
import apiClient from '../client';

export const authAPI = {
  // Register new user
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Refresh token
  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/auth/verify', { token });
    return response.data;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const response = await apiClient.post('/auth/reset-password', { email });
    return response.data;
  },
};
```

### 2. Meeting Management Endpoints

```typescript
// lib/api/endpoints/meetings.ts
import apiClient from '../client';

export const meetingsAPI = {
  // List user meetings
  list: async (params?: MeetingListParams) => {
    const response = await apiClient.get('/meetings', { params });
    return response.data;
  },

  // Get meeting details
  get: async (id: string) => {
    const response = await apiClient.get(`/meetings/${id}`);
    return response.data;
  },

  // Create meeting upload
  create: async (data: CreateMeetingData) => {
    const response = await apiClient.post('/meetings', data);
    return response.data;
  },

  // Upload meeting file (multipart)
  uploadFile: async (meetingId: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      `/meetings/${meetingId}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );
    return response.data;
  },

  // Start meeting analysis
  analyze: async (meetingId: string, config?: AnalysisConfig) => {
    const response = await apiClient.post(`/meetings/${meetingId}/analyze`, config);
    return response.data;
  },

  // Get analysis results
  getAnalysis: async (meetingId: string) => {
    const response = await apiClient.get(`/meetings/${meetingId}/analysis`);
    return response.data;
  },

  // Delete meeting
  delete: async (meetingId: string) => {
    const response = await apiClient.delete(`/meetings/${meetingId}`);
    return response.data;
  },
};
```

### 3. Scenario & Practice Endpoints

```typescript
// lib/api/endpoints/scenarios.ts
import apiClient from '../client';

export const scenariosAPI = {
  // List available scenarios
  list: async (filters?: ScenarioFilters) => {
    const response = await apiClient.get('/scenarios', { params: filters });
    return response.data;
  },

  // Get scenario details
  get: async (id: string) => {
    const response = await apiClient.get(`/scenarios/${id}`);
    return response.data;
  },

  // Generate personalized scenarios
  generate: async (params: GenerateScenarioParams) => {
    const response = await apiClient.post('/scenarios/generate', params);
    return response.data;
  },

  // Start practice session
  startPractice: async (scenarioId: string, mode: PracticeMode) => {
    const response = await apiClient.post(`/scenarios/${scenarioId}/practice`, { mode });
    return response.data;
  },

  // Submit practice response
  submitResponse: async (sessionId: string, response: PracticeResponse) => {
    const response = await apiClient.post(`/practice-sessions/${sessionId}/response`, response);
    return response.data;
  },

  // Complete practice session
  completeSession: async (sessionId: string, assessment: SelfAssessment) => {
    const response = await apiClient.post(`/practice-sessions/${sessionId}/complete`, assessment);
    return response.data;
  },

  // Get practice history
  getPracticeHistory: async (userId: string, limit?: number) => {
    const response = await apiClient.get(`/users/${userId}/practice-sessions`, { 
      params: { limit } 
    });
    return response.data;
  },
};
```

### 4. Smart Sampling Endpoints

```typescript
// lib/api/endpoints/smart-sampling.ts
import apiClient from '../client';

export const smartSamplingAPI = {
  // Start analysis
  analyze: async (data: AnalysisRequest) => {
    const response = await apiClient.post('/smart-sampling/analyze', data);
    return response.data;
  },

  // Get analysis status
  getStatus: async (analysisId: string) => {
    const response = await apiClient.get(`/smart-sampling/status/${analysisId}`);
    return response.data;
  },

  // Get configuration presets
  getPresets: async () => {
    const response = await apiClient.get('/smart-sampling/presets');
    return response.data;
  },

  // Export analysis results
  export: async (analysisId: string, format: ExportFormat) => {
    const response = await apiClient.get(`/smart-sampling/${analysisId}/export`, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json',
    });
    return response.data;
  },
};
```

---

## WebSocket Integration

### WebSocket Client Setup
```typescript
// lib/websocket/client.ts
import { io, Socket } from 'socket.io-client';
import { authService } from '../api/auth';

class WebSocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string) {
    if (this.socket?.connected) return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    
    this.socket = io(WS_URL, {
      auth: {
        token: authService.getAuthHeader(),
        userId,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('ws:connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.emit('ws:disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('ws:max_reconnect_failed');
      }
    });

    // Business events
    this.socket.on('analysis_progress', (data) => {
      this.emit('analysis:progress', data);
    });

    this.socket.on('analysis_complete', (data) => {
      this.emit('analysis:complete', data);
    });

    this.socket.on('practice_feedback', (data) => {
      this.emit('practice:feedback', data);
    });

    this.socket.on('practice_hint', (data) => {
      this.emit('practice:hint', data);
    });

    this.socket.on('readiness_update', (data) => {
      this.emit('readiness:update', data);
    });
  }

  // Event subscription
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Event emission
  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Send message to server
  send(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, queuing message');
      // Queue message for when connection is restored
      this.once('ws:connected', () => {
        this.socket?.emit(event, data);
      });
    }
  }

  // Join room
  joinRoom(room: string) {
    this.send('join_room', { room });
  }

  // Leave room
  leaveRoom(room: string) {
    this.send('leave_room', { room });
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Helper for one-time listeners
  private once(event: string, callback: Function) {
    const unsubscribe = this.on(event, (...args: any[]) => {
      callback(...args);
      unsubscribe();
    });
  }
}

export const wsClient = new WebSocketClient();
```

### WebSocket React Hook
```typescript
// hooks/use-websocket.ts
import { useEffect, useRef } from 'react';
import { wsClient } from '@/lib/websocket/client';

interface UseWebSocketOptions {
  userId?: string;
  room?: string;
  onMessage?: (event: string, data: any) => void;
  events?: Record<string, (data: any) => void>;
  autoConnect?: boolean;
}

export const useWebSocket = ({
  userId,
  room,
  onMessage,
  events = {},
  autoConnect = true,
}: UseWebSocketOptions) => {
  const unsubscribesRef = useRef<Function[]>([]);

  useEffect(() => {
    if (!autoConnect || !userId) return;

    // Connect to WebSocket
    wsClient.connect(userId);

    // Join room if specified
    if (room) {
      wsClient.joinRoom(room);
    }

    // Subscribe to events
    Object.entries(events).forEach(([event, handler]) => {
      const unsubscribe = wsClient.on(event, handler);
      unsubscribesRef.current.push(unsubscribe);
    });

    // General message handler
    if (onMessage) {
      const unsubscribe = wsClient.on('message', onMessage);
      unsubscribesRef.current.push(unsubscribe);
    }

    // Cleanup
    return () => {
      if (room) {
        wsClient.leaveRoom(room);
      }
      unsubscribesRef.current.forEach(unsubscribe => unsubscribe());
      unsubscribesRef.current = [];
    };
  }, [userId, room, autoConnect]);

  return {
    send: (event: string, data: any) => wsClient.send(event, data),
    disconnect: () => wsClient.disconnect(),
  };
};
```

---

## Error Handling

### Error Response Format
```typescript
// Standard error response from backend
interface APIError {
  error: {
    code: string;
    message: string;
    details?: {
      field?: string;
      errors?: Array<{
        field: string;
        message: string;
        code: string;
      }>;
    };
    timestamp: string;
    requestId: string;
  };
}
```

### Frontend Error Handler
```typescript
// lib/api/error-handler.ts
export class APIErrorHandler {
  static handle(error: any): ErrorResponse {
    // Network error
    if (!error.response) {
      return {
        type: 'network',
        message: 'Network error. Please check your connection.',
        retry: true,
      };
    }

    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: data.error?.message || 'Invalid request',
          details: data.error?.details,
          retry: false,
        };

      case 401:
        return {
          type: 'authentication',
          message: 'Please log in to continue',
          retry: false,
        };

      case 403:
        return {
          type: 'authorization',
          message: 'You do not have permission to perform this action',
          retry: false,
        };

      case 404:
        return {
          type: 'not_found',
          message: data.error?.message || 'Resource not found',
          retry: false,
        };

      case 429:
        return {
          type: 'rate_limit',
          message: 'Too many requests. Please try again later.',
          retryAfter: error.response.headers['retry-after'],
          retry: true,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: 'server',
          message: 'Server error. Please try again later.',
          retry: true,
        };

      default:
        return {
          type: 'unknown',
          message: data.error?.message || 'An unexpected error occurred',
          retry: false,
        };
    }
  }
}
```

### React Error Boundary
```typescript
// components/error-boundary.tsx
import React from 'react';
import { APIErrorHandler } from '@/lib/api/error-handler';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to analytics
    if (window.analytics) {
      window.analytics.track('Error Boundary Triggered', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but something unexpected happened.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Data Synchronization

### Optimistic Updates
```typescript
// hooks/use-optimistic-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useOptimisticMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    queryKey: string[];
    optimisticUpdate: (old: any, variables: TVariables) => any;
    onError?: (error: any, variables: TVariables, context: any) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: options.queryKey });

      // Snapshot current state
      const previousData = queryClient.getQueryData(options.queryKey);

      // Optimistically update
      queryClient.setQueryData(
        options.queryKey,
        (old: any) => options.optimisticUpdate(old, variables)
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(options.queryKey, context.previousData);
      }
      options.onError?.(error, variables, context);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: options.queryKey });
    },
  });
};
```

### Real-time Sync with WebSocket
```typescript
// hooks/use-realtime-query.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './use-websocket';
import { useEffect } from 'react';

export const useRealtimeQuery = <TData>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  wsEvent: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  const queryClient = useQueryClient();
  
  // Standard query
  const query = useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled,
    staleTime: options?.staleTime,
  });

  // WebSocket updates
  useWebSocket({
    events: {
      [wsEvent]: (data: TData) => {
        // Update cache with WebSocket data
        queryClient.setQueryData(queryKey, data);
      },
    },
  });

  return query;
};
```

---

## Rate Limiting & Retry Logic

### Rate Limit Handler
```typescript
// lib/api/rate-limiter.ts
class RateLimiter {
  private queues: Map<string, Array<() => Promise<any>>> = new Map();
  private processing: Map<string, boolean> = new Map();
  private limits: Map<string, { count: number; resetAt: number }> = new Map();

  async execute<T>(
    endpoint: string,
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    // Check if rate limited
    const limit = this.limits.get(endpoint);
    if (limit && limit.count <= 0 && Date.now() < limit.resetAt) {
      // Queue the request
      return this.enqueue(endpoint, fn);
    }

    try {
      const result = await fn();
      this.updateLimit(endpoint, 1);
      return result;
    } catch (error: any) {
      if (error.response?.status === 429) {
        // Rate limited - parse headers
        const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
        const remaining = parseInt(error.response.headers['x-ratelimit-remaining'] || '0');
        const reset = parseInt(error.response.headers['x-ratelimit-reset'] || '0');

        this.limits.set(endpoint, {
          count: remaining,
          resetAt: reset * 1000,
        });

        if (maxRetries > 0) {
          await this.delay(retryAfter * 1000);
          return this.execute(endpoint, fn, maxRetries - 1);
        }
      }
      throw error;
    }
  }

  private async enqueue<T>(endpoint: string, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const queue = this.queues.get(endpoint) || [];
      queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.queues.set(endpoint, queue);
      this.processQueue(endpoint);
    });
  }

  private async processQueue(endpoint: string) {
    if (this.processing.get(endpoint)) return;
    
    this.processing.set(endpoint, true);
    const queue = this.queues.get(endpoint) || [];
    
    while (queue.length > 0) {
      const limit = this.limits.get(endpoint);
      
      if (limit && limit.count <= 0 && Date.now() < limit.resetAt) {
        // Wait until reset
        await this.delay(limit.resetAt - Date.now());
      }
      
      const fn = queue.shift();
      if (fn) await fn();
      
      // Delay between requests
      await this.delay(100);
    }
    
    this.processing.set(endpoint, false);
  }

  private updateLimit(endpoint: string, consumed: number) {
    const limit = this.limits.get(endpoint);
    if (limit) {
      limit.count = Math.max(0, limit.count - consumed);
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const rateLimiter = new RateLimiter();
```

---

## File Upload Handling

### Chunked Upload Implementation
```typescript
// lib/api/upload.ts
class ChunkedUploader {
  private chunkSize = 1024 * 1024; // 1MB chunks
  private maxRetries = 3;

  async upload(
    file: File,
    meetingId: string,
    onProgress?: (progress: number) => void,
    onChunkComplete?: (chunk: number, total: number) => void
  ): Promise<UploadResult> {
    const chunks = this.createChunks(file);
    const uploadId = generateUploadId();
    let uploadedChunks = 0;

    // Initialize upload
    await apiClient.post(`/meetings/${meetingId}/upload/init`, {
      uploadId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      totalChunks: chunks.length,
    });

    // Upload chunks
    for (let i = 0; i < chunks.length; i++) {
      await this.uploadChunk(
        chunks[i],
        i,
        chunks.length,
        meetingId,
        uploadId,
        this.maxRetries
      );
      
      uploadedChunks++;
      const progress = (uploadedChunks / chunks.length) * 100;
      
      onProgress?.(progress);
      onChunkComplete?.(uploadedChunks, chunks.length);
    }

    // Complete upload
    const result = await apiClient.post(`/meetings/${meetingId}/upload/complete`, {
      uploadId,
    });

    return result.data;
  }

  private createChunks(file: File): Blob[] {
    const chunks: Blob[] = [];
    let start = 0;

    while (start < file.size) {
      const end = Math.min(start + this.chunkSize, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }

    return chunks;
  }

  private async uploadChunk(
    chunk: Blob,
    index: number,
    totalChunks: number,
    meetingId: string,
    uploadId: string,
    retries: number
  ): Promise<void> {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('index', index.toString());
    formData.append('uploadId', uploadId);

    try {
      await apiClient.post(
        `/meetings/${meetingId}/upload/chunk`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    } catch (error) {
      if (retries > 0) {
        await this.delay(1000 * (4 - retries)); // Exponential backoff
        return this.uploadChunk(chunk, index, totalChunks, meetingId, uploadId, retries - 1);
      }
      throw error;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const chunkedUploader = new ChunkedUploader();
```

---

## Caching Strategy

### Cache Configuration
```typescript
// lib/api/cache.ts
export const cacheConfig = {
  // User data - cache for session
  user: {
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Meeting list - refresh frequently
  meetings: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Scenarios - cache longer
  scenarios: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Company data - cache longest
  companies: {
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Readiness scores - moderate cache
  readiness: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  },
};
```

---

## Testing API Integration

### Mock API Client for Testing
```typescript
// lib/api/__mocks__/client.ts
export const mockApiClient = {
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

export default mockApiClient;
```

### Integration Test Example
```typescript
// __tests__/api/meetings.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMeetings } from '@/hooks/use-meetings';
import { meetingsAPI } from '@/lib/api/endpoints/meetings';

jest.mock('@/lib/api/endpoints/meetings');

describe('Meetings API Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('fetches meetings successfully', async () => {
    const mockMeetings = [
      { id: '1', title: 'Meeting 1' },
      { id: '2', title: 'Meeting 2' },
    ];

    (meetingsAPI.list as jest.Mock).mockResolvedValue(mockMeetings);

    const { result } = renderHook(() => useMeetings(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMeetings);
  });
});
```

---

## Migration Guide

### Phase 1: Basic Integration (Week 1)
1. Set up API client with authentication
2. Implement error handling
3. Configure React Query
4. Test with mock data

### Phase 2: Core Features (Week 2-3)
1. Implement all REST endpoints
2. Add WebSocket support
3. Implement file upload
4. Add optimistic updates

### Phase 3: Advanced Features (Week 4)
1. Add rate limiting
2. Implement caching strategy
3. Add retry logic
4. Performance optimization

---

This specification provides a complete blueprint for integrating the Next.js frontend with the existing Express.js backend from Epic 2, ensuring robust, performant, and maintainable API communication.