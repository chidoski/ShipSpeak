# Frontend Architecture: ShipSpeak Platform
## Technical Specification & Implementation Guide

**Version:** 1.0  
**Date:** October 4, 2025  
**Document Type:** Frontend Architecture  
**Status:** Epic 3 Foundation Specification  

---

## Executive Summary

This document defines the complete frontend architecture for ShipSpeak's web application, establishing technical decisions, design principles, and implementation patterns for Epic 3 and beyond. The architecture prioritizes growth-focused user experience, performance, and maintainability while preparing for future company rubric integration features.

### Key Architectural Decisions
- **Framework**: Next.js 14 with App Router for better server components and streaming
- **State Management**: Zustand + React Query (TanStack Query) hybrid approach
- **Design System**: Anthropic-inspired design language with subtle company integration
- **User Journey**: Growth-focused progression from current state to target companies
- **Mobile Strategy**: Progressive enhancement with single-company focus

---

## Technology Stack

### Core Framework
```typescript
// Primary Stack
Framework: Next.js 14 (App Router)
Runtime: React 18 with Concurrent Features
Language: TypeScript (strict mode)
Styling: Tailwind CSS + Custom CSS Variables
UI Components: shadcn/ui (extended with custom components)

// State Management
Client State: Zustand
Server State: React Query (TanStack Query)
Auth Context: React Context Provider
Theme: CSS Variables + React Context

// Data Visualization
Primary: Recharts (React-optimized charts)
Complex: D3.js (only for advanced network visualizations)
Icons: Lucide React + Custom SVGs

// Development
Testing: Jest + React Testing Library
Type Checking: TypeScript + ESLint
Formatting: Prettier
Build: Next.js built-in (Turbopack in dev)
```

### State Management Strategy

#### 1. Client State (Zustand)
```typescript
// User preferences, UI state, selected companies
interface AppStore {
  // User preferences
  user: {
    targetCompanies: Company[];
    currentRole: Role;
    practicePreferences: PracticeSettings;
  };
  
  // UI state
  ui: {
    selectedCompany: string | null;
    dashboardView: 'growth' | 'practice' | 'analytics';
    mobileNavOpen: boolean;
  };
  
  // Actions
  setTargetCompanies: (companies: Company[]) => void;
  selectCompany: (companyId: string) => void;
  updatePreferences: (settings: Partial<PracticeSettings>) => void;
}
```

#### 2. Server State (React Query)
```typescript
// Remote data, caching, synchronization
const useCompanyReadiness = (userId: string, companyId: string) => {
  return useQuery({
    queryKey: ['readiness', userId, companyId],
    queryFn: () => fetchReadinessScore(userId, companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

const usePracticeSessions = (userId: string) => {
  return useQuery({
    queryKey: ['sessions', userId],
    queryFn: () => fetchPracticeSessions(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
```

#### 3. Real-time State (WebSocket)
```typescript
// Live updates for practice sessions and analysis
const useWebSocket = (userId: string) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const ws = new WebSocket(`wss://api.shipspeak.com/ws/${userId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'readiness_update':
          queryClient.invalidateQueries(['readiness', userId]);
          break;
        case 'practice_score':
          queryClient.setQueryData(['sessions', userId], (old) => 
            updateSessionScore(old, data.sessionId, data.score)
          );
          break;
      }
    };
    
    return () => ws.close();
  }, [userId]);
};
```

---

## Application Architecture

### Folder Structure (Next.js App Router)
```
apps/web/
├── app/                          # App Router structure
│   ├── (auth)/                   # Auth route group
│   │   ├── layout.tsx            # Auth layout (centered forms)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration with target companies
│   │
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx            # Dashboard shell with navigation
│   │   ├── page.tsx              # Growth-focused main dashboard
│   │   ├── meetings/
│   │   │   ├── page.tsx          # Meeting upload & history
│   │   │   └── [meetingId]/
│   │   │       └── page.tsx      # Meeting analysis results
│   │   ├── practice/
│   │   │   ├── page.tsx          # Practice session selection
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx      # Active practice session
│   │   └── companies/
│   │       ├── page.tsx          # Company browse & search
│   │       ├── compare/
│   │       │   └── page.tsx      # Multi-company comparison
│   │       └── [companyId]/
│   │           ├── page.tsx      # Company profile & rubrics
│   │           └── readiness/
│   │               └── page.tsx  # Detailed readiness analysis
│   │
│   ├── api/                      # API route handlers
│   │   ├── auth/
│   │   ├── companies/
│   │   └── readiness/
│   │
│   ├── globals.css               # Global styles & CSS variables
│   ├── layout.tsx                # Root layout
│   └── loading.tsx               # Global loading UI
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── charts/                   # Data visualization components
│   │   ├── readiness-chart.tsx   # Radar chart for skill readiness
│   │   ├── progress-ring.tsx     # Circular progress indicators
│   │   ├── timeline-chart.tsx    # Growth timeline visualization
│   │   └── gap-analysis.tsx      # Skill gap breakdown
│   │
│   ├── companies/                # Company-specific components
│   │   ├── company-card.tsx      # Company preview cards
│   │   ├── company-selector.tsx  # Multi-select for target companies
│   │   ├── readiness-dashboard.tsx
│   │   └── comparison-table.tsx  # Side-by-side company comparison
│   │
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── growth-overview.tsx   # Main growth progress section
│   │   ├── daily-practice.tsx    # Today's recommended practice
│   │   ├── milestone-tracker.tsx # Achievement progress
│   │   └── navigation.tsx        # Dashboard navigation
│   │
│   ├── practice/                 # Practice session components
│   │   ├── scenario-display.tsx  # Interactive scenario presentation
│   │   ├── response-recorder.tsx # Voice/text response capture
│   │   ├── live-feedback.tsx     # Real-time coaching hints
│   │   └── session-summary.tsx   # Post-practice results
│   │
│   └── meetings/                 # Meeting analysis components
│       ├── upload-zone.tsx       # Drag & drop file upload
│       ├── analysis-results.tsx  # Meeting insights display
│       └── progress-tracker.tsx  # Real-time analysis progress
│
├── hooks/                        # Custom React hooks
│   ├── use-company-readiness.ts  # Company readiness data
│   ├── use-websocket.ts          # WebSocket connection
│   ├── use-practice-session.ts   # Practice session management
│   ├── use-growth-metrics.ts     # Growth calculation utilities
│   └── use-mobile-detection.ts   # Responsive behavior
│
├── lib/                          # Utility libraries
│   ├── stores/                   # Zustand stores
│   │   ├── company-store.ts      # Company selection & comparison
│   │   ├── user-store.ts         # User preferences & settings
│   │   └── ui-store.ts           # UI state management
│   │
│   ├── api/                      # API client functions
│   │   ├── companies.ts          # Company data fetching
│   │   ├── readiness.ts          # Readiness score APIs
│   │   └── practice.ts           # Practice session APIs
│   │
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # className utility (clsx + twMerge)
│   │   ├── growth-calculations.ts # Progress & gap analysis
│   │   ├── chart-helpers.ts      # Data transformation for charts
│   │   └── validation.ts         # Form validation schemas
│   │
│   └── constants/                # Application constants
│       ├── companies.ts          # Supported companies list
│       ├── skills.ts             # Skill categories & definitions
│       └── colors.ts             # Design system color palette
│
├── types/                        # TypeScript type definitions
│   ├── api.ts                    # API response types
│   ├── company.ts                # Company & rubric types
│   ├── user.ts                   # User & profile types
│   ├── practice.ts               # Practice session types
│   └── chart.ts                  # Chart data types
│
└── styles/                       # Additional styling
    ├── components.css            # Component-specific styles
    └── charts.css                # Chart customization
```

---

## Component Architecture

### Design System Extensions

#### 1. Company-Aware Components
```tsx
// Company integration through CSS variables and props
interface CompanyAwareProps {
  companyId?: string;
  variant?: 'default' | 'company-accent';
}

const CompanyCard: React.FC<CompanyAwareProps> = ({ companyId, children }) => {
  const companyColor = getCompanyAccentColor(companyId);
  
  return (
    <Card 
      className="border-l-4 transition-all"
      style={{ 
        '--company-accent': companyColor,
        borderLeftColor: 'var(--company-accent-muted)'
      }}
    >
      {children}
    </Card>
  );
};

// Usage - automatic company theming
<CompanyCard companyId="meta">
  <ReadinessScore score={0.73} />
</CompanyCard>
```

#### 2. Growth-Focused Data Display
```tsx
const GrowthProgress: React.FC<{ currentScore: number; targetScore: number }> = ({
  currentScore,
  targetScore
}) => {
  const progressPercentage = (currentScore / targetScore) * 100;
  const remainingGap = targetScore - currentScore;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Where you are</span>
        <span>Where you want to be</span>
      </div>
      
      <ProgressRing 
        value={progressPercentage}
        size="lg"
        className="mx-auto"
      />
      
      <div className="text-center">
        <p className="text-2xl font-semibold">{Math.round(progressPercentage)}% Ready</p>
        <p className="text-muted-foreground">
          {remainingGap.toFixed(1)} points to target
        </p>
      </div>
    </div>
  );
};
```

#### 3. Responsive Charts
```tsx
const ReadinessChart: React.FC<{ data: SkillReadiness[] }> = ({ data }) => {
  const { isMobile } = useMobileDetection();
  
  if (isMobile) {
    // Simplified view for mobile
    return (
      <div className="space-y-2">
        {data.map((skill) => (
          <SkillBar key={skill.name} skill={skill} />
        ))}
      </div>
    );
  }
  
  // Full radar chart for desktop
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis domain={[0, 10]} />
        <Radar 
          dataKey="current" 
          stroke="var(--primary)" 
          fill="var(--primary)" 
          fillOpacity={0.1} 
        />
        <Radar 
          dataKey="target" 
          stroke="var(--company-accent)" 
          strokeDasharray="5 5" 
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
```

---

## Data Flow Architecture

### 1. User Onboarding Flow
```typescript
// 1. Current State Assessment
const assessCurrentState = async (userId: string) => {
  const responses = await collectOnboardingResponses();
  const baselineSkills = await analyzeSkillLevel(responses);
  
  await saveUserBaseline(userId, baselineSkills);
  return baselineSkills;
};

// 2. Target Company Selection (Required)
const selectTargetCompanies = async (userId: string, companies: Company[]) => {
  if (companies.length === 0) {
    throw new Error('At least one target company required');
  }
  
  const skillGaps = await calculateSkillGaps(userId, companies);
  await saveTargetCompanies(userId, companies, skillGaps);
  
  return skillGaps;
};

// 3. Growth Path Generation
const generateGrowthPath = async (userId: string) => {
  const baseline = await getUserBaseline(userId);
  const targets = await getUserTargets(userId);
  
  const pathway = calculateOptimalLearningPath(baseline, targets);
  const milestones = generateMilestones(pathway);
  
  return { pathway, milestones };
};
```

### 2. Dashboard Data Loading
```typescript
// Progressive loading strategy
const DashboardPage = () => {
  // Load critical data first
  const { data: user } = useQuery(['user'], fetchUserProfile);
  const { data: targets } = useQuery(['targets'], fetchTargetCompanies, {
    enabled: !!user
  });
  
  // Load secondary data
  const { data: readiness } = useQuery(
    ['readiness', user?.id], 
    () => fetchAllReadinessScores(user!.id),
    { 
      enabled: !!user,
      staleTime: 5 * 60 * 1000 
    }
  );
  
  // Load tertiary data
  const { data: recommendations } = useQuery(
    ['recommendations', user?.id],
    () => fetchPracticeRecommendations(user!.id),
    { 
      enabled: !!user && !!readiness,
      staleTime: 10 * 60 * 1000 
    }
  );
  
  if (!user || !targets) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <GrowthOverview 
        user={user}
        targets={targets}
        readiness={readiness}
      />
      
      <Suspense fallback={<RecommendationsSkeleton />}>
        <DailyRecommendations data={recommendations} />
      </Suspense>
      
      <Suspense fallback={<ProgressSkeleton />}>
        <RecentProgress userId={user.id} />
      </Suspense>
    </div>
  );
};
```

### 3. Real-time Updates
```typescript
// WebSocket integration for live features
const useLiveProgress = (sessionId: string) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  
  useWebSocket({
    room: `practice_${sessionId}`,
    onMessage: (data) => {
      switch (data.type) {
        case 'progress':
          setProgress(data.value);
          break;
          
        case 'feedback':
          // Show live coaching hints
          showFeedbackToast(data.message);
          break;
          
        case 'score_update':
          // Update readiness scores in real-time
          queryClient.invalidateQueries(['readiness']);
          break;
      }
    }
  });
  
  return { progress };
};
```

---

## Performance Optimizations

### 1. Code Splitting Strategy
```typescript
// Route-based splitting (automatic with App Router)
const CompanyProfilePage = lazy(() => import('./[companyId]/page'));
const PracticeSession = lazy(() => import('./practice/[sessionId]/page'));

// Component-based splitting for heavy features
const CompanyComparison = lazy(() => import('@/components/companies/comparison-table'));
const AdvancedChart = lazy(() => import('@/components/charts/advanced-visualization'));

// Usage with Suspense
<Suspense fallback={<ChartSkeleton />}>
  <AdvancedChart data={complexData} />
</Suspense>
```

### 2. Data Fetching Optimization
```typescript
// Prefetch target company data during onboarding
const prefetchCompanyData = async (companyIds: string[]) => {
  const queryClient = useQueryClient();
  
  companyIds.forEach(id => {
    queryClient.prefetchQuery(['company', id], () => fetchCompany(id));
    queryClient.prefetchQuery(['rubric', id], () => fetchCompanyRubric(id));
  });
};

// Infinite scroll for company browse
const useCompanyBrowse = () => {
  return useInfiniteQuery({
    queryKey: ['companies'],
    queryFn: ({ pageParam = 0 }) => fetchCompanies(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
```

### 3. Mobile Optimizations
```typescript
// Progressive enhancement for mobile
const useMobileOptimizedChart = (data: ChartData[]) => {
  const { isMobile } = useMobileDetection();
  
  return useMemo(() => {
    if (isMobile) {
      // Reduce data points for mobile
      return data.filter((_, index) => index % 2 === 0);
    }
    return data;
  }, [data, isMobile]);
};

// Lazy load heavy components on mobile
const MobileOptimizedComponent = ({ data }: Props) => {
  const { isMobile } = useMobileDetection();
  
  if (isMobile) {
    return <SimplifiedMobileView data={data} />;
  }
  
  return (
    <Suspense fallback={<Skeleton />}>
      <FullDesktopView data={data} />
    </Suspense>
  );
};
```

---

## Security & Accessibility

### 1. Authentication Flow
```typescript
// JWT-based auth with secure storage
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (credentials: LoginCredentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const { user, token } = await response.json();
      
      // Secure token storage
      document.cookie = `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`;
      setUser(user);
      
      return user;
    }
    
    throw new Error('Authentication failed');
  };
  
  return { user, login };
};
```

### 2. Accessibility Standards
```typescript
// WCAG 2.1 AA compliance
const AccessibleChart = ({ data, title }: ChartProps) => {
  return (
    <div role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
      <h3 id="chart-title">{title}</h3>
      <p id="chart-desc" className="sr-only">
        Chart showing readiness scores across {data.length} skill areas
      </p>
      
      <ResponsiveContainer>
        <RadarChart data={data}>
          {/* Chart implementation */}
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Data table fallback for screen readers */}
      <table className="sr-only">
        <caption>Skill readiness data</caption>
        <thead>
          <tr>
            <th>Skill</th>
            <th>Current Score</th>
            <th>Target Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.skill}>
              <td>{item.skill}</td>
              <td>{item.current}</td>
              <td>{item.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## Testing Strategy

### 1. Component Testing
```typescript
// React Testing Library + Jest
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GrowthOverview } from './growth-overview';

describe('GrowthOverview', () => {
  it('displays progress toward target companies', async () => {
    const mockData = {
      user: createMockUser(),
      targets: [createMockCompany('meta'), createMockCompany('google')],
      readiness: { meta: 0.73, google: 0.45 }
    };
    
    render(<GrowthOverview {...mockData} />);
    
    expect(screen.getByText('73% Ready for Meta')).toBeInTheDocument();
    expect(screen.getByText('45% Ready for Google')).toBeInTheDocument();
  });
  
  it('handles company selection change', async () => {
    const user = userEvent.setup();
    const onCompanySelect = jest.fn();
    
    render(<CompanySelector onSelect={onCompanySelect} />);
    
    await user.click(screen.getByRole('button', { name: /select company/i }));
    await user.click(screen.getByText('Meta'));
    
    expect(onCompanySelect).toHaveBeenCalledWith('meta');
  });
});
```

### 2. Integration Testing
```typescript
// E2E user journeys with Playwright
test('complete user onboarding flow', async ({ page }) => {
  // Navigate to registration
  await page.goto('/register');
  
  // Fill out current role assessment
  await page.fill('[data-testid="current-role"]', 'Senior PM');
  await page.click('[data-testid="industry-b2b"]');
  
  // Select target companies (required)
  await page.click('[data-testid="company-meta"]');
  await page.click('[data-testid="company-google"]');
  
  // Complete registration
  await page.click('[data-testid="complete-onboarding"]');
  
  // Verify dashboard shows growth path
  await expect(page.locator('[data-testid="growth-overview"]')).toBeVisible();
  await expect(page.locator('text=Your Path to Meta')).toBeVisible();
  await expect(page.locator('text=Your Path to Google')).toBeVisible();
});
```

---

## Deployment & Performance

### 1. Build Optimization
```typescript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### 2. Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: Metric) => {
  // Send to your analytics service
  analytics.track('Web Vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
};

// Track all vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## Migration & Integration Timeline

### Phase 1: Epic 3 Foundation (Weeks 1-4)
1. **Week 1**: Next.js App Router setup, basic routing structure
2. **Week 2**: Authentication, dashboard shell, navigation
3. **Week 3**: Mock data integration, basic charts and components  
4. **Week 4**: Mobile responsive design, initial user testing

### Phase 2: Company Integration Preparation (Weeks 5-8)
1. **Week 5**: Company selection UI, target setting flow
2. **Week 6**: Growth visualization components, progress tracking
3. **Week 7**: Practice session interface, real-time features
4. **Week 8**: Performance optimization, accessibility audit

### Phase 3: Backend Integration (Epic 6)
1. **API Integration**: Replace mock data with real endpoints
2. **WebSocket Connection**: Enable real-time features
3. **Community Features**: Add validation and feedback systems
4. **Enterprise Features**: Advanced analytics, admin panels

---

This architecture provides a solid foundation for building ShipSpeak's frontend while maintaining flexibility for future enhancements and company rubric integration features.