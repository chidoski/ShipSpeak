import { NextRequest } from 'next/server';

// In-memory store for rate limiting
// In production, you'd use Redis or similar
class RateLimiter {
  private store: Map<string, { count: number; resetTime: number; violations: number }> = new Map();
  private violationStore: Map<string, { count: number; resetTime: number }> = new Map();

  private getKey(request: NextRequest, type: string): string {
    // Use IP for auth endpoints, user ID for others when available
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // For user-specific endpoints, we'd get user ID from auth
    // For now, using IP + type as key
    return `${ip}:${type}`;
  }

  async checkLimit(
    request: NextRequest, 
    type: 'general' | 'auth' | 'upload' | 'ai',
    limit: number,
    windowMs: number = 15 * 60 * 1000 // 15 minutes default
  ): Promise<{ success: boolean; remaining: number; retryAfter?: number }> {
    const key = this.getKey(request, type);
    const now = Date.now();

    // Check for violations
    const violation = this.violationStore.get(key);
    if (violation && now < violation.resetTime) {
      // User is in violation cooldown
      return {
        success: false,
        remaining: 0,
        retryAfter: Math.ceil((violation.resetTime - now) / 1000)
      };
    }

    // Get or create rate limit entry
    let entry = this.store.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + windowMs,
        violations: entry?.violations || 0
      };
    }

    // Check if limit exceeded
    if (entry.count >= limit) {
      // Increment violations
      entry.violations += 1;
      this.store.set(key, entry);

      // Apply progressive penalties for violations
      let violationPenalty = 0;
      if (entry.violations >= 3) {
        violationPenalty = 60 * 60 * 1000; // 1 hour
      } else if (entry.violations >= 2) {
        violationPenalty = 30 * 60 * 1000; // 30 minutes
      } else {
        violationPenalty = 5 * 60 * 1000; // 5 minutes
      }

      this.violationStore.set(key, {
        count: entry.violations,
        resetTime: now + violationPenalty
      });

      return {
        success: false,
        remaining: 0,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    // Increment count and save
    entry.count += 1;
    this.store.set(key, entry);

    return {
      success: true,
      remaining: limit - entry.count
    };
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }

    for (const [key, entry] of this.violationStore.entries()) {
      if (now > entry.resetTime) {
        this.violationStore.delete(key);
      }
    }
  }

  // Get statistics for monitoring
  getStats(): { activeKeys: number; violations: number } {
    return {
      activeKeys: this.store.size,
      violations: this.violationStore.size
    };
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

// Rate limit configurations
const RATE_LIMITS = {
  general: { limit: 1000, window: 15 * 60 * 1000 }, // 1000 req/15min
  auth: { limit: 20, window: 15 * 60 * 1000 },     // 20 req/15min  
  upload: { limit: 5, window: 15 * 60 * 1000 },    // 5 req/15min
  ai: { limit: 10, window: 15 * 60 * 1000 }        // 10 req/15min
} as const;

// Main rate limiting function
export async function rateLimit(
  request: NextRequest,
  type: keyof typeof RATE_LIMITS,
  customLimit?: number
): Promise<{ success: boolean; remaining?: number; retryAfter?: number }> {
  try {
    const config = RATE_LIMITS[type];
    const limit = customLimit || config.limit;
    
    const result = await rateLimiter.checkLimit(request, type, limit, config.window);
    
    // Log rate limit attempts for monitoring
    if (!result.success) {
      console.warn(`Rate limit exceeded for ${type}:`, {
        key: rateLimiter['getKey'](request, type),
        limit,
        retryAfter: result.retryAfter
      });
    }
    
    return result;
  } catch (error) {
    console.error('Rate limiter error:', error);
    // On error, allow the request (fail open)
    return { success: true };
  }
}

// Rate limiting middleware for API routes
export function withRateLimit(
  type: keyof typeof RATE_LIMITS,
  customLimit?: number
) {
  return async (request: NextRequest) => {
    const result = await rateLimit(request, type, customLimit);
    return result;
  };
}

// Export for monitoring
export const getRateLimitStats = () => rateLimiter.getStats();