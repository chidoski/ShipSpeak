# Epic 3: Architectural Decisions Record
## Final Technical Decisions & Implementation Guidelines

**Version:** 1.0  
**Date:** October 16, 2025  
**Status:** Approved for Implementation  
**Approach:** Full-Feature Release (No Phasing)  

---

## Executive Summary

Based on stakeholder input, this document finalizes all architectural decisions for Epic 3. We're pursuing a **full-feature, security-first approach** with **best-in-class performance** and **open-source analytics**. No MVP phasing - we're building the complete platform from day one.

---

## 1. Authentication Architecture

### OAuth Integration (Priority: P0)

**Decision:** Implement LinkedIn and Google OAuth alongside traditional email/password

#### LinkedIn OAuth Setup
```typescript
// lib/auth/providers/linkedin.ts
import { LinkedIn } from '@auth/core/providers/linkedin';

export const linkedInProvider = LinkedIn({
  clientId: process.env.LINKEDIN_CLIENT_ID!,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: 'openid profile email',
    },
  },
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      provider: 'linkedin',
      // Extract professional info
      headline: profile.headline,
      industry: profile.industry,
      currentRole: extractRoleFromHeadline(profile.headline),
    };
  },
});
```

#### Google OAuth Setup
```typescript
// lib/auth/providers/google.ts
import { Google } from '@auth/core/providers/google';

export const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      prompt: 'consent',
      access_type: 'offline',
      response_type: 'code',
    },
  },
});
```

#### Unified Auth Configuration
```typescript
// lib/auth/config.ts
import NextAuth from 'next-auth';
import { linkedInProvider } from './providers/linkedin';
import { googleProvider } from './providers/google';
import { EmailProvider } from './providers/email';

export const authConfig = {
  providers: [
    linkedInProvider,
    googleProvider,
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Enrich session with professional data from LinkedIn
      if (token.provider === 'linkedin') {
        session.user.currentRole = token.currentRole;
        session.user.industry = token.industry;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === 'linkedin') {
        token.currentRole = profile?.headline ? extractRoleFromHeadline(profile.headline) : null;
        token.industry = profile?.industry;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
};
```

---

## 2. Data Security Architecture

### Zero-Trust Security Model

**Decision:** Implement comprehensive data security with encryption at rest and in transit

#### Data Flow Security Layers
```
┌─────────────────────────────────────────────────┐
│                  Client Browser                  │
│         ┌─────────────────────────┐             │
│         │  Client-Side Encryption  │             │
│         │    (Sensitive Data)      │             │
│         └─────────────────────────┘             │
└─────────────────────────────────────────────────┘
                        ↓
                  [TLS 1.3 + HSTS]
                        ↓
┌─────────────────────────────────────────────────┐
│                   CDN/WAF Layer                  │
│         ┌─────────────────────────┐             │
│         │   DDoS Protection        │             │
│         │   Rate Limiting          │             │
│         └─────────────────────────┘             │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                Next.js Application               │
│  ┌──────────────────────────────────────────┐   │
│  │  Input Validation & Sanitization         │   │
│  │  CSRF Protection                         │   │
│  │  Content Security Policy                 │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              Express.js API (Epic 2)             │
│  ┌──────────────────────────────────────────┐   │
│  │  JWT Verification                        │   │
│  │  Permission Checks                       │   │
│  │  Audit Logging                          │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  PostgreSQL                      │
│  ┌──────────────────────────────────────────┐   │
│  │  Row-Level Security (RLS)               │   │
│  │  Encrypted at Rest (AES-256)            │   │
│  │  Audit Trails                           │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

#### Client-Side Security Implementation
```typescript
// lib/security/encryption.ts
import { AES, enc } from 'crypto-js';

export class ClientEncryption {
  private static deriveKey(userId: string): string {
    // Derive unique key per user session
    return `${userId}-${process.env.NEXT_PUBLIC_ENCRYPTION_SALT}`;
  }

  static encryptSensitiveData(data: any, userId: string): string {
    const key = this.deriveKey(userId);
    return AES.encrypt(JSON.stringify(data), key).toString();
  }

  static decryptSensitiveData(encrypted: string, userId: string): any {
    const key = this.deriveKey(userId);
    const bytes = AES.decrypt(encrypted, key);
    return JSON.parse(bytes.toString(enc.Utf8));
  }
}

// Usage for sensitive meeting content
const encryptedTranscript = ClientEncryption.encryptSensitiveData(
  meetingTranscript,
  user.id
);
```

#### Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=()'
  }
];

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com *.linkedin.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: *.google.com *.linkedin.com;
  font-src 'self';
  connect-src 'self' *.shipspeak.com wss://*.shipspeak.com;
  media-src 'self' blob:;
  object-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`;
```

#### Data Privacy Controls
```typescript
// lib/privacy/data-controls.ts
export class DataPrivacyControls {
  // User-controlled data retention
  static async setRetentionPeriod(userId: string, days: number) {
    await api.updateUserPreferences(userId, {
      dataRetentionDays: Math.min(days, 365), // Max 1 year
    });
  }

  // Data export for GDPR compliance
  static async exportUserData(userId: string): Promise<UserDataExport> {
    const data = await api.getUserDataExport(userId);
    return {
      profile: data.profile,
      meetings: data.meetings.map(m => this.sanitizeMeetingData(m)),
      practiceHistory: data.practiceHistory,
      exportDate: new Date().toISOString(),
      format: 'json',
    };
  }

  // Complete data deletion
  static async deleteAllUserData(userId: string): Promise<void> {
    // Soft delete with 30-day recovery period
    await api.scheduleUserDataDeletion(userId, {
      scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      recoverable: true,
    });
  }

  // Anonymize meeting data
  private static sanitizeMeetingData(meeting: Meeting): SanitizedMeeting {
    return {
      ...meeting,
      transcript: '[REDACTED]',
      participants: meeting.participants.map(p => '[ANONYMIZED]'),
      audioUrl: null,
    };
  }
}
```

---

## 3. Performance Architecture

### Best-in-Class Performance Strategy

**Decision:** Achieve top-tier performance metrics through aggressive optimization

#### Performance Targets
- **First Contentful Paint (FCP)**: < 1.0s
- **Largest Contentful Paint (LCP)**: < 2.0s  
- **First Input Delay (FID)**: < 50ms
- **Cumulative Layout Shift (CLS)**: < 0.05
- **Time to Interactive (TTI)**: < 2.5s
- **JavaScript Bundle Size**: < 400KB (gzipped)

#### Optimization Techniques

```typescript
// next.config.js
module.exports = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: ['avatars.shipspeak.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Enable experimental features
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Tree shaking
    config.optimization.usedExports = true;
    
    // Split chunks optimally
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier());
            },
            name(module) {
              const hash = crypto.createHash('sha1');
              hash.update(module.identifier());
              return hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
};
```

#### Critical CSS Extraction
```typescript
// lib/performance/critical-css.ts
import { getCssInlineForPage } from 'critters';

export async function extractCriticalCSS(html: string, route: string): Promise<string> {
  const critical = await getCssInlineForPage(html, {
    path: route,
    publicPath: '/_next/',
    external: false,
    inlineThreshold: 10 * 1024, // 10KB
  });
  
  return critical;
}
```

#### Resource Hints
```typescript
// components/performance/resource-hints.tsx
export function ResourceHints() {
  return (
    <Head>
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://api.shipspeak.com" />
      <link rel="dns-prefetch" href="https://cdn.shipspeak.com" />
      
      {/* Preconnect */}
      <link rel="preconnect" href="https://api.shipspeak.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      
      {/* Prefetch critical routes */}
      <link rel="prefetch" href="/dashboard" />
      <link rel="prefetch" href="/practice" />
      
      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </Head>
  );
}
```

---

## 4. Analytics Architecture

### Open Source Analytics Stack

**Decision:** Implement PostHog for product analytics with privacy-first approach

#### PostHog Integration
```typescript
// lib/analytics/posthog.ts
import posthog from 'posthog-js';

export class Analytics {
  static initialize() {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: false, // We'll manually track
        capture_pageleave: true,
        autocapture: false, // Manual control for privacy
        disable_session_recording: false,
        mask_all_text: true, // Privacy by default
        mask_all_element_attributes: true,
        respect_dnt: true,
        secure_cookie: true,
        persistence: 'localStorage+cookie',
      });
    }
  }

  static identify(userId: string, traits?: Record<string, any>) {
    posthog.identify(userId, {
      ...traits,
      // Don't send PII
      email: undefined,
      name: undefined,
    });
  }

  static track(event: string, properties?: Record<string, any>) {
    // Filter sensitive data
    const safeProperties = this.filterSensitiveData(properties);
    posthog.capture(event, safeProperties);
  }

  static trackPageView(url: string, referrer?: string) {
    posthog.capture('$pageview', {
      $current_url: url,
      $referrer: referrer,
    });
  }

  private static filterSensitiveData(data?: Record<string, any>): Record<string, any> {
    if (!data) return {};
    
    const sensitiveKeys = ['password', 'email', 'phone', 'ssn', 'transcript', 'audio'];
    const filtered = { ...data };
    
    sensitiveKeys.forEach(key => {
      if (key in filtered) {
        filtered[key] = '[REDACTED]';
      }
    });
    
    return filtered;
  }
}
```

#### Custom Analytics Events
```typescript
// lib/analytics/events.ts
export const AnalyticsEvents = {
  // User Journey
  USER_REGISTERED: 'user_registered',
  USER_ONBOARDED: 'user_onboarded',
  USER_LOGGED_IN: 'user_logged_in',
  
  // Meeting Analysis
  MEETING_UPLOADED: 'meeting_uploaded',
  MEETING_ANALYSIS_STARTED: 'meeting_analysis_started',
  MEETING_ANALYSIS_COMPLETED: 'meeting_analysis_completed',
  MEETING_INSIGHTS_VIEWED: 'meeting_insights_viewed',
  
  // Practice Sessions
  PRACTICE_SESSION_STARTED: 'practice_session_started',
  PRACTICE_SESSION_COMPLETED: 'practice_session_completed',
  PRACTICE_RESPONSE_SUBMITTED: 'practice_response_submitted',
  PRACTICE_FEEDBACK_RECEIVED: 'practice_feedback_received',
  
  // Company Readiness
  COMPANY_SELECTED: 'company_selected',
  READINESS_SCORE_VIEWED: 'readiness_score_viewed',
  SKILL_GAP_ANALYZED: 'skill_gap_analyzed',
  
  // Engagement
  DAILY_CHALLENGE_STARTED: 'daily_challenge_started',
  DAILY_CHALLENGE_COMPLETED: 'daily_challenge_completed',
  STREAK_MILESTONE_REACHED: 'streak_milestone_reached',
  
  // Performance
  PAGE_LOAD_TIME: 'page_load_time',
  API_RESPONSE_TIME: 'api_response_time',
  ERROR_OCCURRED: 'error_occurred',
} as const;

// Usage example
Analytics.track(AnalyticsEvents.MEETING_UPLOADED, {
  fileSize: file.size,
  fileType: file.type,
  duration: meetingDuration,
  // Don't include: fileName, transcript, participants
});
```

#### Privacy-Compliant Session Recording
```typescript
// lib/analytics/session-recording.ts
export function initializeSessionRecording(userId: string) {
  // Only record if user explicitly opts in
  const hasConsent = localStorage.getItem('recording_consent') === 'true';
  
  if (hasConsent) {
    posthog.startSessionRecording();
    
    // Set recording options
    posthog.set_config({
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '.sensitive',
        blockSelector: '.private',
      },
    });
  }
}
```

#### Analytics Dashboard Configuration
```typescript
// lib/analytics/dashboards.ts
export const analyticsDashboards = {
  userEngagement: {
    metrics: [
      'Daily Active Users',
      'Weekly Active Users',
      'Average Session Duration',
      'Practice Sessions per User',
    ],
    charts: [
      'User Growth Over Time',
      'Feature Adoption Funnel',
      'Retention Cohorts',
    ],
  },
  
  performance: {
    metrics: [
      'Page Load Times (P50, P95, P99)',
      'API Response Times',
      'Error Rates',
      'WebSocket Connection Stability',
    ],
    alerts: [
      { metric: 'errorRate', threshold: 0.01, action: 'notify' },
      { metric: 'p99LoadTime', threshold: 3000, action: 'alert' },
    ],
  },
  
  businessMetrics: {
    metrics: [
      'Meeting Analysis Cost per User',
      'Practice Session Completion Rate',
      'Skill Improvement Rate',
      'Company Readiness Progress',
    ],
    goals: [
      { metric: 'completionRate', target: 0.8 },
      { metric: 'costPerUser', target: 0.1 },
    ],
  },
};
```

---

## 5. Browser Support & Compatibility

### Full Browser Support Matrix

**Decision:** Support all modern browsers with graceful degradation

#### Supported Browsers
```json
{
  "browserslist": [
    "Chrome >= 90",
    "Edge >= 90",
    "Firefox >= 88",
    "Safari >= 14",
    "iOS >= 14",
    "Android >= 10",
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions",
    "last 2 Edge versions"
  ]
}
```

#### Progressive Enhancement Strategy
```typescript
// lib/compatibility/feature-detection.ts
export class FeatureDetection {
  static supports = {
    webAudio: typeof window !== 'undefined' && 'AudioContext' in window,
    webRTC: typeof window !== 'undefined' && 'RTCPeerConnection' in window,
    serviceWorker: typeof window !== 'undefined' && 'serviceWorker' in navigator,
    webSocket: typeof window !== 'undefined' && 'WebSocket' in window,
    indexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
    webWorker: typeof window !== 'undefined' && 'Worker' in window,
  };

  static async checkBrowserCompatibility(): Promise<BrowserCompatibility> {
    const features = {
      core: this.checkCoreFeatures(),
      audio: this.checkAudioFeatures(),
      performance: await this.checkPerformanceFeatures(),
    };

    return {
      isFullySupported: features.core && features.audio,
      features,
      fallbacks: this.determineFallbacks(features),
    };
  }

  private static checkCoreFeatures(): boolean {
    return (
      this.supports.webSocket &&
      this.supports.serviceWorker &&
      this.supports.indexedDB
    );
  }

  private static checkAudioFeatures(): boolean {
    return this.supports.webAudio || this.supports.webRTC;
  }

  private static async checkPerformanceFeatures(): Promise<boolean> {
    // Check for Performance Observer API
    return 'PerformanceObserver' in window;
  }

  private static determineFallbacks(features: any): Fallbacks {
    return {
      audio: !features.audio ? 'file-upload-only' : null,
      realtime: !this.supports.webSocket ? 'polling' : null,
      offline: !this.supports.serviceWorker ? 'disabled' : null,
    };
  }
}
```

---

## 6. API Integration Strategy

### Best Practice API Architecture

**Decision:** Extend Epic 2 APIs with frontend-optimized endpoints

#### GraphQL Gateway Layer (Optional Enhancement)
```typescript
// lib/api/graphql/schema.ts
import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Query {
    # Optimized dashboard data fetch
    dashboardData(userId: ID!): DashboardData!
    
    # Batched company readiness
    companyReadiness(userId: ID!, companyIds: [ID!]!): [CompanyReadiness!]!
    
    # Meeting with analysis
    meetingWithAnalysis(meetingId: ID!): MeetingComplete!
  }

  type DashboardData {
    user: User!
    recentMeetings: [Meeting!]!
    practiceRecommendations: [Scenario!]!
    readinessScores: [CompanyReadiness!]!
    dailyChallenge: DailyChallenge
    streak: Int!
  }

  type Subscription {
    analysisProgress(meetingId: ID!): AnalysisProgress!
    practiceSessionUpdate(sessionId: ID!): SessionUpdate!
  }
`;

// Optimized data fetching
export const DASHBOARD_QUERY = gql`
  query GetDashboardData($userId: ID!) {
    dashboardData(userId: $userId) {
      user {
        id
        profile {
          currentRole
          targetCompanies
        }
      }
      recentMeetings {
        id
        title
        status
        analysis {
          overallScore
        }
      }
      readinessScores {
        companyId
        score
        lastUpdated
      }
      dailyChallenge {
        id
        title
        duration
      }
      streak
    }
  }
`;
```

#### API Response Caching Strategy
```typescript
// lib/api/cache-strategy.ts
export const cacheStrategy = {
  // Static data - cache aggressively
  companies: {
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  // User data - moderate caching
  userProfile: {
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Dynamic data - short cache
  meetings: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Real-time data - minimal cache
  analysisProgress: {
    staleTime: 0, // Always fetch fresh
    cacheTime: 60 * 1000, // 1 minute
  },
};
```

---

## 7. Deployment & Infrastructure

### Production Deployment Architecture

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.production
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${API_URL}
      - NEXT_PUBLIC_WS_URL=${WS_URL}
    ports:
      - "3000:3000"
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
```

---

## 8. Release Strategy

### Full-Feature Launch Approach

**Decision:** No MVP, launch with complete feature set

#### Launch Checklist
```markdown
## Pre-Launch (Week -1)
- [ ] Security audit completed
- [ ] Performance testing passed (all metrics green)
- [ ] Browser compatibility verified
- [ ] Analytics configured and tested
- [ ] OAuth providers verified
- [ ] Load testing completed (1000+ concurrent users)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Legal review completed (privacy policy, ToS)

## Launch Day
- [ ] DNS configured and propagated
- [ ] SSL certificates installed and verified
- [ ] CDN configured and cache warmed
- [ ] Monitoring dashboards active
- [ ] Support team briefed
- [ ] Rollback plan documented

## Post-Launch (Week +1)
- [ ] Performance metrics review
- [ ] User feedback collection active
- [ ] Error rate monitoring
- [ ] Security scan scheduled
- [ ] Analytics review meeting
```

---

## Implementation Priority Order

1. **Week 1-2: Foundation**
   - Authentication with OAuth
   - Security headers and CSP
   - PostHog analytics integration
   - Core component library

2. **Week 3-4: Core Features**
   - Dashboard with real-time updates
   - Meeting upload and analysis
   - Practice session interface
   - Company readiness system

3. **Week 5-6: Enhancement & Polish**
   - Performance optimization
   - Cross-browser testing
   - Accessibility improvements
   - Error handling and recovery

4. **Week 7-8: Launch Preparation**
   - Security audit
   - Load testing
   - Documentation
   - Deployment setup

---

This architectural decision record ensures ShipSpeak launches with enterprise-grade security, best-in-class performance, and comprehensive analytics while maintaining user privacy and data protection.