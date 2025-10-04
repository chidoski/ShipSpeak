import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Security testing utilities
global.SecurityTestUtils = {
  // XSS payloads for testing input sanitization
  xssPayloads: [
    '<script>alert("xss")</script>',
    'javascript:alert("xss")',
    '<img src="x" onerror="alert(\'xss\')" />',
    '<svg onload="alert(\'xss\')" />',
    '"><script>alert("xss")</script>',
    '\'); alert(\'xss\'); //',
    '<iframe src="javascript:alert(\'xss\')" />',
    '<object data="javascript:alert(\'xss\')" />',
    '<embed src="javascript:alert(\'xss\')" />',
    '<meta http-equiv="refresh" content="0;url=javascript:alert(\'xss\')" />'
  ],
  
  // SQL injection payloads
  sqlInjectionPayloads: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "admin'/*",
    "' OR 1=1--",
    "' OR 'a'='a",
    "') OR ('1'='1",
    "' OR '1'='1' /*",
    "1' AND '1'='1"
  ],
  
  // Path traversal payloads
  pathTraversalPayloads: [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config\\sam',
    '....//....//....//etc/passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
    '..%252f..%252f..%252fetc%252fpasswd',
    '..%c0%af..%c0%af..%c0%afetc%c0%afpasswd',
    '../\\../\\../\\etc/passwd',
    '..%%%%%%../../../../etc/passwd'
  ]
}

// Performance testing utilities
global.PerformanceTestUtils = {
  // Memory leak detection
  checkMemoryLeak: (testFunction, iterations = 100) => {
    const initialMemory = process.memoryUsage().heapUsed
    
    for (let i = 0; i < iterations; i++) {
      testFunction()
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
    
    const finalMemory = process.memoryUsage().heapUsed
    const memoryDiff = finalMemory - initialMemory
    
    return {
      initialMemory,
      finalMemory,
      memoryDiff,
      memoryLeakDetected: memoryDiff > 1024 * 1024 // 1MB threshold
    }
  },
  
  // Performance timing
  measurePerformance: async (asyncFunction) => {
    const start = performance.now()
    const result = await asyncFunction()
    const end = performance.now()
    
    return {
      result,
      duration: end - start,
      performant: (end - start) < 100 // 100ms threshold
    }
  },
  
  // Render time measurement
  measureRenderTime: (renderFunction) => {
    const start = performance.now()
    const component = renderFunction()
    const end = performance.now()
    
    return {
      component,
      renderTime: end - start,
      fastRender: (end - start) < 16 // 16ms for 60fps
    }
  }
}

// Test data generators
global.TestDataGenerators = {
  generateUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'individual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),
  
  generateMeetingAnalysis: (overrides = {}) => ({
    id: 'test-analysis-id',
    userId: 'test-user-id',
    duration: 1800, // 30 minutes
    communicationScores: {
      fillerWords: 85,
      pace: 78,
      confidence: 90,
      structure: 82
    },
    recommendations: [
      'Reduce filler words by practicing pause techniques',
      'Vary speaking pace for emphasis'
    ],
    createdAt: new Date().toISOString(),
    ...overrides
  }),
  
  generatePracticeModule: (overrides = {}) => ({
    id: 'test-module-id',
    title: 'Filler Word Reduction',
    type: 'FILLER_WORD_REDUCTION',
    difficulty: 'BEGINNER',
    estimatedDuration: 600, // 10 minutes
    exercises: [],
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...overrides
  })
}

// Console suppression for cleaner test output
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})