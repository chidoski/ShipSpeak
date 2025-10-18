# Frontend Testing Strategy
## Comprehensive Testing Approach for Epic 3

**Version:** 1.0  
**Date:** October 16, 2025  
**Epic:** Epic 3 - Frontend Integration  
**Status:** Implementation Ready  
**Target Coverage:** 95%+ for critical paths  

---

## Executive Summary

This document defines ShipSpeak's comprehensive frontend testing strategy, ensuring the same high quality that achieved 99.5% test success in Epic 2. We employ a multi-layered testing approach combining unit tests, integration tests, end-to-end tests, and specialized testing for performance, accessibility, and security.

### Testing Philosophy
- **Test-Driven Development (TDD)** for all new features
- **Behavior-Driven Development (BDD)** for user journeys
- **Continuous Testing** in CI/CD pipeline
- **Shift-Left Testing** to catch issues early

---

## Testing Architecture

### Testing Pyramid
```
         ╱╲
        ╱E2E╲         (5%)  - Critical user journeys
       ╱──────╲
      ╱ Integr.╲      (20%) - Component interactions
     ╱──────────╲
    ╱   Unit     ╲    (75%) - Component logic
   ╱──────────────╲
  ╱________________╲
```

### Test Types & Coverage

| Test Type | Coverage Target | Tools | Purpose |
|-----------|----------------|-------|---------|
| Unit Tests | 90% | Jest, RTL | Component logic & utilities |
| Integration Tests | 80% | Jest, RTL, MSW | Component interactions |
| E2E Tests | Critical Paths | Playwright | User journeys |
| Visual Tests | UI Components | Storybook, Chromatic | UI consistency |
| Performance Tests | Core Features | Lighthouse, Web Vitals | Performance metrics |
| Accessibility Tests | 100% | axe-core, Pa11y | WCAG compliance |
| Security Tests | All Inputs | OWASP ZAP | Security vulnerabilities |

---

## Unit Testing

### Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
  ],
};
```

#### Test Setup
```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Component Testing Patterns

#### Basic Component Test
```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('prevents interaction when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('supports keyboard navigation', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Keyboard</Button>);
    const button = screen.getByRole('button');
    
    button.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
```

#### Hook Testing
```typescript
// __tests__/hooks/use-meeting-upload.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMeetingUpload } from '@/hooks/use-meeting-upload';
import { meetingsAPI } from '@/lib/api/endpoints/meetings';

jest.mock('@/lib/api/endpoints/meetings');

describe('useMeetingUpload Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('uploads file successfully', async () => {
    const mockMeetingId = 'meeting-123';
    const mockFile = new File(['content'], 'test.mp3', { type: 'audio/mp3' });
    
    (meetingsAPI.uploadFile as jest.Mock).mockResolvedValue({
      id: mockMeetingId,
      status: 'uploaded',
    });

    const { result } = renderHook(() => useMeetingUpload(), { wrapper });

    await act(async () => {
      result.current.upload(mockFile);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      id: mockMeetingId,
      status: 'uploaded',
    });
  });

  it('handles upload progress', async () => {
    const mockFile = new File(['content'], 'test.mp3', { type: 'audio/mp3' });
    const progressValues: number[] = [];

    (meetingsAPI.uploadFile as jest.Mock).mockImplementation(
      (id, file, onProgress) => {
        // Simulate progress updates
        setTimeout(() => onProgress?.(25), 10);
        setTimeout(() => onProgress?.(50), 20);
        setTimeout(() => onProgress?.(100), 30);
        
        return Promise.resolve({ id: 'meeting-123' });
      }
    );

    const { result } = renderHook(() => useMeetingUpload(), { wrapper });

    result.current.onProgress((progress) => {
      progressValues.push(progress);
    });

    await act(async () => {
      await result.current.upload(mockFile);
    });

    await waitFor(() => {
      expect(progressValues).toEqual([25, 50, 100]);
    });
  });
});
```

#### Context Testing
```typescript
// __tests__/contexts/auth-context.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { authAPI } from '@/lib/api/endpoints/auth';

jest.mock('@/lib/api/endpoints/auth');

const TestComponent = () => {
  const { user, isAuthenticated, login } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
  });

  it('handles login', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      profile: {},
    };

    (authAPI.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      tokens: { access: 'token', refresh: 'refresh' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });
});
```

---

## Integration Testing

### API Mocking with MSW

#### Mock Service Worker Setup
```typescript
// mocks/handlers.ts
import { rest } from 'msw';
import { API_BASE_URL } from '@/lib/constants';

export const handlers = [
  // Auth endpoints
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: 'user-123',
          email: req.body.email,
          profile: {},
        },
        tokens: {
          access: 'mock-access-token',
          refresh: 'mock-refresh-token',
        },
      })
    );
  }),

  // Meeting endpoints
  rest.get(`${API_BASE_URL}/meetings`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 'meeting-1',
          title: 'Product Review',
          status: 'analyzed',
          createdAt: new Date().toISOString(),
        },
      ])
    );
  }),

  rest.post(`${API_BASE_URL}/meetings/:id/analyze`, (req, res, ctx) => {
    return res(
      ctx.json({
        analysisId: 'analysis-123',
        status: 'processing',
      })
    );
  }),

  // WebSocket mock
  rest.get(`${API_BASE_URL}/ws`, (req, res, ctx) => {
    return res(
      ctx.status(101),
      ctx.set('Upgrade', 'websocket'),
    );
  }),
];

// Error scenarios
export const errorHandlers = [
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      })
    );
  }),
];
```

#### Integration Test Example
```typescript
// __tests__/integration/meeting-upload-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MeetingUploadFlow } from '@/features/meetings/upload-flow';
import { server } from '@/mocks/server';
import { rest } from 'msw';

describe('Meeting Upload Flow Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('completes full upload and analysis flow', async () => {
    const user = userEvent.setup();
    
    render(
      <QueryClientProvider client={queryClient}>
        <MeetingUploadFlow />
      </QueryClientProvider>
    );

    // Step 1: Select file
    const file = new File(['audio content'], 'meeting.mp3', {
      type: 'audio/mp3',
    });
    
    const input = screen.getByLabelText(/upload meeting/i);
    await user.upload(input, file);

    // Step 2: Verify file preview
    expect(screen.getByText('meeting.mp3')).toBeInTheDocument();
    expect(screen.getByText('audio/mp3')).toBeInTheDocument();

    // Step 3: Start upload
    const uploadButton = screen.getByRole('button', { name: /start upload/i });
    await user.click(uploadButton);

    // Step 4: Wait for upload progress
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // Step 5: Mock successful upload
    server.use(
      rest.post('*/meetings/upload', (req, res, ctx) => {
        return res(
          ctx.json({
            id: 'meeting-123',
            status: 'uploaded',
          })
        );
      })
    );

    // Step 6: Verify analysis starts
    await waitFor(() => {
      expect(screen.getByText(/analyzing meeting/i)).toBeInTheDocument();
    });

    // Step 7: Mock analysis completion
    server.use(
      rest.get('*/meetings/*/analysis', (req, res, ctx) => {
        return res(
          ctx.json({
            overallScore: 7.5,
            insights: ['Good structure', 'Clear communication'],
          })
        );
      })
    );

    // Step 8: Verify results display
    await waitFor(() => {
      expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
      expect(screen.getByText('7.5')).toBeInTheDocument();
      expect(screen.getByText('Good structure')).toBeInTheDocument();
    });
  });

  it('handles upload errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock upload failure
    server.use(
      rest.post('*/meetings/upload', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            error: {
              message: 'Upload failed',
            },
          })
        );
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MeetingUploadFlow />
      </QueryClientProvider>
    );

    const file = new File(['audio'], 'meeting.mp3', { type: 'audio/mp3' });
    const input = screen.getByLabelText(/upload meeting/i);
    
    await user.upload(input, file);
    await user.click(screen.getByRole('button', { name: /start upload/i }));

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
```

---

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

#### User Journey Test
```typescript
// e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('New User Journey', () => {
  test('completes onboarding and first practice', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Click get started
    await page.click('text=Get Started');
    
    // Registration
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePassword123!');
    await page.fill('[name="confirmPassword"]', 'SecurePassword123!');
    await page.click('button[type="submit"]');
    
    // Skill assessment
    await expect(page).toHaveURL('/onboarding/assessment');
    await page.selectOption('[name="currentRole"]', 'senior_pm');
    await page.selectOption('[name="industry"]', 'b2b_saas');
    await page.click('text=Next');
    
    // Company selection (required)
    await expect(page).toHaveURL('/onboarding/companies');
    await page.click('[data-company="meta"]');
    await page.click('[data-company="google"]');
    await page.click('text=Continue');
    
    // Dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Your Growth Journey')).toBeVisible();
    
    // Start daily challenge
    await page.click('text=Start Daily Challenge');
    await expect(page).toHaveURL(/\/practice\//);
    
    // Complete practice
    await page.fill('[name="response"]', 'My practice response');
    await page.click('text=Submit');
    
    // View results
    await expect(page.locator('text=Practice Complete')).toBeVisible();
    await expect(page.locator('[data-testid="score"]')).toBeVisible();
  });
});
```

#### Critical Path Test
```typescript
// e2e/critical-paths.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Critical User Paths', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('uploads and analyzes meeting', async ({ page }) => {
    await page.click('text=Upload Meeting');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('fixtures/sample-meeting.mp3');
    
    // Start analysis
    await page.click('text=Analyze');
    
    // Wait for progress
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    
    // Wait for completion (mock should be fast)
    await expect(page.locator('text=Analysis Complete')).toBeVisible({
      timeout: 30000,
    });
    
    // Verify results
    await expect(page.locator('[data-testid="overall-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="insights"]')).toBeVisible();
  });

  test('completes practice session', async ({ page }) => {
    await page.click('text=Practice');
    
    // Select scenario
    await page.click('[data-scenario-id="exec-presence-1"]');
    
    // Start practice
    await page.click('text=Start Practice');
    
    // Record response
    await page.click('[data-testid="record-button"]');
    await page.waitForTimeout(3000); // Simulate recording
    await page.click('[data-testid="stop-button"]');
    
    // Submit
    await page.click('text=Submit Response');
    
    // View feedback
    await expect(page.locator('[data-testid="ai-feedback"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-breakdown"]')).toBeVisible();
  });
});
```

---

## Visual Testing

### Storybook Configuration

```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};
```

### Component Stories

```typescript
// components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button leftIcon={<span>←</span>}>Left Icon</Button>
      <Button rightIcon={<span>→</span>}>Right Icon</Button>
    </div>
  ),
};
```

### Visual Regression Testing

```typescript
// visual-tests/button.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Button Visual Tests', () => {
  test('button variants match snapshots', async ({ page }) => {
    await page.goto('/storybook/iframe.html?id=ui-button--all-variants');
    await expect(page).toHaveScreenshot('button-variants.png');
  });

  test('button states match snapshots', async ({ page }) => {
    await page.goto('/storybook/iframe.html?id=ui-button--default');
    
    // Default state
    await expect(page.locator('button')).toHaveScreenshot('button-default.png');
    
    // Hover state
    await page.locator('button').hover();
    await expect(page.locator('button')).toHaveScreenshot('button-hover.png');
    
    // Focus state
    await page.locator('button').focus();
    await expect(page.locator('button')).toHaveScreenshot('button-focus.png');
  });
});
```

---

## Performance Testing

### Web Vitals Monitoring

```typescript
// utils/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}

// Track in analytics
reportWebVitals((metric) => {
  // Send to analytics
  window.analytics?.track('Web Vital', {
    name: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  });
  
  // Log poor performance
  if (metric.rating === 'poor') {
    console.warn(`Poor ${metric.name} performance:`, metric.value);
  }
});
```

### Performance Test Suite

```typescript
// __tests__/performance/dashboard.perf.test.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Performance', () => {
  test('loads within performance budget', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const navEntry = entries.find(e => e.entryType === 'navigation');
          
          resolve({
            domContentLoaded: navEntry?.domContentLoadedEventEnd,
            loadComplete: navEntry?.loadEventEnd,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
          });
        }).observe({ entryTypes: ['navigation', 'paint'] });
        
        window.location.reload();
      });
    });

    expect(metrics.firstContentfulPaint).toBeLessThan(1500);
    expect(metrics.domContentLoaded).toBeLessThan(3000);
    expect(metrics.loadComplete).toBeLessThan(5000);
  });

  test('maintains 60fps during interactions', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Start performance recording
    await page.evaluate(() => {
      window.frameCount = 0;
      const countFrames = () => {
        window.frameCount++;
        requestAnimationFrame(countFrames);
      };
      countFrames();
    });

    // Perform interactions
    await page.click('[data-testid="tab-growth"]');
    await page.click('[data-testid="tab-practice"]');
    await page.click('[data-testid="tab-meetings"]');
    
    // Wait 1 second
    await page.waitForTimeout(1000);
    
    // Check frame rate
    const fps = await page.evaluate(() => window.frameCount);
    expect(fps).toBeGreaterThan(55); // Allow small margin
  });
});
```

---

## Accessibility Testing

### Automated A11y Tests

```typescript
// __tests__/a11y/components.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

expect.extend(toHaveNoViolations);

describe('Component Accessibility', () => {
  test('Button has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Button>Default Button</Button>
        <Button disabled>Disabled Button</Button>
        <Button loading>Loading Button</Button>
      </div>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Input has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Input label="Email" type="email" required />
        <Input label="Password" type="password" error="Invalid password" />
        <Input label="Disabled" disabled />
      </div>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Form with proper ARIA attributes', async () => {
    const { container } = render(
      <form aria-label="Login form">
        <Input
          label="Email"
          type="email"
          required
          aria-required="true"
          aria-describedby="email-error"
        />
        <span id="email-error" role="alert">
          Email is required
        </span>
        <Button type="submit">Submit</Button>
      </form>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual A11y Testing Checklist

```markdown
## Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Focus indicators clearly visible
- [ ] Skip links work correctly
- [ ] Modal focus trap implemented
- [ ] Escape key closes modals

## Screen Reader
- [ ] Page structure uses semantic HTML
- [ ] Headings in logical order
- [ ] Images have alt text
- [ ] Form labels properly associated
- [ ] Error messages announced

## Visual
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Text resizable to 200%
- [ ] No information conveyed by color alone
- [ ] Focus indicators have sufficient contrast
- [ ] Animations respect prefers-reduced-motion
```

---

## Security Testing

### Input Validation Tests

```typescript
// __tests__/security/input-validation.test.ts
describe('Input Security', () => {
  test('sanitizes XSS attempts', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert');
  });

  test('prevents SQL injection', () => {
    const sqlInjection = "'; DROP TABLE users; --";
    const sanitized = sanitizeInput(sqlInjection);
    
    expect(sanitized).not.toContain('DROP TABLE');
    expect(sanitized).not.toContain("'");
  });

  test('validates file uploads', () => {
    const maliciousFile = new File([''], '../../../etc/passwd');
    const isValid = validateFile(maliciousFile);
    
    expect(isValid).toBe(false);
  });
});
```

---

## Test Data Management

### Test Fixtures

```typescript
// fixtures/users.ts
export const testUsers = {
  seniorPM: {
    id: 'user-1',
    email: 'sarah.chen@example.com',
    profile: {
      currentRole: 'senior_pm',
      experienceYears: 5,
      targetCompanies: ['meta', 'google'],
    },
  },
  juniorPM: {
    id: 'user-2',
    email: 'marcus.rodriguez@example.com',
    profile: {
      currentRole: 'pm',
      experienceYears: 2,
      targetCompanies: ['airbnb'],
    },
  },
};

// fixtures/meetings.ts
export const testMeetings = {
  analyzed: {
    id: 'meeting-1',
    title: 'Product Review Q3',
    status: 'analyzed',
    duration: 1800,
    analysis: {
      overallScore: 7.5,
      executivePresence: 8.0,
      influenceSkills: 7.0,
      communicationStructure: 7.5,
    },
  },
  processing: {
    id: 'meeting-2',
    title: 'Team Standup',
    status: 'processing',
    duration: 900,
  },
};
```

### Factory Functions

```typescript
// factories/user.factory.ts
import { faker } from '@faker-js/faker';

export function createUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    profile: {
      currentRole: faker.helpers.arrayElement(['pm', 'senior_pm', 'staff_pm']),
      experienceYears: faker.number.int({ min: 1, max: 15 }),
      targetCompanies: faker.helpers.arrayElements(['meta', 'google', 'apple'], 2),
    },
    ...overrides,
  };
}

export function createMeeting(overrides = {}) {
  return {
    id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    status: faker.helpers.arrayElement(['uploaded', 'processing', 'analyzed']),
    duration: faker.number.int({ min: 600, max: 3600 }),
    createdAt: faker.date.recent(),
    ...overrides,
  };
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/frontend-tests.yml
name: Frontend Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: frontend
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            coverage/
            test-results/
            playwright-report/
      
      - name: Performance testing
        run: npm run test:performance
      
      - name: Accessibility testing
        run: npm run test:a11y
```

---

## Test Reporting

### Coverage Reports

```javascript
// jest.config.js coverage reporters
coverageReporters: [
  'text',
  'text-summary',
  'html',
  'lcov',
  'json-summary',
];

// Generate coverage badge
// package.json script
"coverage:badge": "coverage-badges --output ./badges"
```

### Test Results Dashboard

```typescript
// utils/test-reporter.ts
export class TestReporter {
  static generateReport(results: TestResults) {
    return {
      summary: {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        skipped: results.skipped,
        duration: results.duration,
      },
      coverage: {
        lines: results.coverage.lines,
        branches: results.coverage.branches,
        functions: results.coverage.functions,
        statements: results.coverage.statements,
      },
      failedTests: results.failures.map(f => ({
        name: f.name,
        error: f.error,
        file: f.file,
        line: f.line,
      })),
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

## Testing Best Practices

### Do's and Don'ts

#### Do's ✅
- Write tests before code (TDD)
- Test user behavior, not implementation
- Use data-testid for test selectors
- Mock external dependencies
- Test error states and edge cases
- Keep tests isolated and independent
- Use descriptive test names
- Clean up after tests

#### Don'ts ❌
- Don't test implementation details
- Don't use arbitrary timeouts
- Don't share state between tests
- Don't test third-party libraries
- Don't ignore flaky tests
- Don't skip accessibility tests
- Don't hardcode test data

### Testing Checklist

```markdown
## Before Committing
- [ ] All tests passing locally
- [ ] Coverage meets threshold (90%)
- [ ] No console errors/warnings
- [ ] Accessibility tests pass
- [ ] Visual tests updated if UI changed
- [ ] E2E tests cover critical paths
- [ ] Performance budgets met
- [ ] Test documentation updated
```

---

This comprehensive testing strategy ensures ShipSpeak's frontend maintains the highest quality standards, matching the 99.5% success rate achieved in Epic 2's backend development.