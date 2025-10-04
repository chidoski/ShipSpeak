/**
 * Core Testing Utilities for ShipSpeak TDD Framework
 * Provides comprehensive helpers for unit, integration, and performance testing
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { performance } from 'perf_hooks'

// =============================================================================
// PERFORMANCE TESTING UTILITIES
// =============================================================================

export interface PerformanceResult {
  result: any
  duration: number
  performant: boolean
  memoryUsage?: NodeJS.MemoryUsage
}

/**
 * Measures performance of async operations with memory tracking
 */
export const measureAsyncPerformance = async <T>(
  asyncFunction: () => Promise<T>,
  maxDurationMs = 100
): Promise<PerformanceResult> => {
  const initialMemory = process.memoryUsage()
  const start = performance.now()
  
  const result = await asyncFunction()
  
  const end = performance.now()
  const duration = end - start
  const finalMemory = process.memoryUsage()
  
  return {
    result,
    duration,
    performant: duration < maxDurationMs,
    memoryUsage: {
      rss: finalMemory.rss - initialMemory.rss,
      heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
      heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
      external: finalMemory.external - initialMemory.external,
      arrayBuffers: finalMemory.arrayBuffers - initialMemory.arrayBuffers
    }
  }
}

/**
 * Measures component render performance
 */
export const measureRenderPerformance = (
  ui: ReactElement,
  options?: RenderOptions
): { result: RenderResult; renderTime: number; fastRender: boolean } => {
  const start = performance.now()
  const result = render(ui, options)
  const end = performance.now()
  
  const renderTime = end - start
  
  return {
    result,
    renderTime,
    fastRender: renderTime < 16 // 60fps threshold
  }
}

/**
 * Memory leak detection for repeated operations
 */
export const detectMemoryLeak = (
  operation: () => void,
  iterations = 100,
  maxMemoryIncreaseMB = 1
): { memoryLeakDetected: boolean; memoryIncrease: number; iterations: number } => {
  const initialMemory = process.memoryUsage().heapUsed
  
  for (let i = 0; i < iterations; i++) {
    operation()
  }
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc()
    global.gc() // Run twice to ensure cleanup
  }
  
  const finalMemory = process.memoryUsage().heapUsed
  const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024 // Convert to MB
  
  return {
    memoryLeakDetected: memoryIncrease > maxMemoryIncreaseMB,
    memoryIncrease,
    iterations
  }
}

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

export interface MockUser {
  id: string
  email: string
  name: string
  role: 'individual' | 'team_member' | 'admin' | 'enterprise_admin'
  createdAt: string
  updatedAt: string
}

export const generateMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  email: `test-${Math.random().toString(36).substr(2, 5)}@example.com`,
  name: `Test User ${Math.random().toString(36).substr(2, 5)}`,
  role: 'individual',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export interface MockMeetingAnalysis {
  id: string
  userId: string
  duration: number
  communicationScores: {
    fillerWords: number
    pace: number
    confidence: number
    structure: number
  }
  recommendations: string[]
  createdAt: string
}

export const generateMockMeetingAnalysis = (
  overrides: Partial<MockMeetingAnalysis> = {}
): MockMeetingAnalysis => ({
  id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  userId: `user-${Math.random().toString(36).substr(2, 9)}`,
  duration: Math.floor(Math.random() * 3600) + 300, // 5 minutes to 1 hour
  communicationScores: {
    fillerWords: Math.floor(Math.random() * 100),
    pace: Math.floor(Math.random() * 100),
    confidence: Math.floor(Math.random() * 100),
    structure: Math.floor(Math.random() * 100)
  },
  recommendations: [
    'Reduce filler words by practicing pause techniques',
    'Vary speaking pace for emphasis',
    'Use confident language patterns'
  ],
  createdAt: new Date().toISOString(),
  ...overrides
})

export interface MockPracticeModule {
  id: string
  title: string
  type: 'FILLER_WORD_REDUCTION' | 'EXECUTIVE_PRESENCE' | 'STRATEGIC_NARRATIVE'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  estimatedDuration: number
  exercises: any[]
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: string
}

export const generateMockPracticeModule = (
  overrides: Partial<MockPracticeModule> = {}
): MockPracticeModule => ({
  id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Practice Module',
  type: 'FILLER_WORD_REDUCTION',
  difficulty: 'BEGINNER',
  estimatedDuration: 600, // 10 minutes
  exercises: [],
  status: 'pending',
  createdAt: new Date().toISOString(),
  ...overrides
})

// =============================================================================
// ASYNC TESTING UTILITIES
// =============================================================================

/**
 * Wait for async operations to complete with timeout
 */
export const waitForAsync = (ms = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wait for condition to be true with timeout
 */
export const waitForCondition = async (
  condition: () => boolean | Promise<boolean>,
  timeoutMs = 5000,
  intervalMs = 100
): Promise<void> => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) {
      return
    }
    await waitForAsync(intervalMs)
  }
  
  throw new Error(`Condition not met within ${timeoutMs}ms`)
}

// =============================================================================
// API TESTING UTILITIES
// =============================================================================

export interface MockAPIResponse<T = any> {
  data?: T
  error?: string
  status: number
  headers?: Record<string, string>
}

/**
 * Creates a mock API response for testing
 */
export const createMockAPIResponse = <T>(
  data?: T,
  status = 200,
  error?: string
): MockAPIResponse<T> => ({
  data,
  error,
  status,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Simulates network delay for API testing
 */
export const simulateNetworkDelay = (minMs = 100, maxMs = 500): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs
  return waitForAsync(delay)
}

// =============================================================================
// COMPONENT TESTING UTILITIES
// =============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any
  theme?: 'light' | 'dark'
}

/**
 * Custom render with providers and common setup
 */
export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { initialState, theme = 'light', ...renderOptions } = options
  
  // Mock providers wrapper
  const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
      <div data-theme={theme} data-testid="test-providers">
        {children}
      </div>
    )
  }
  
  return render(ui, { wrapper: AllTheProviders, ...renderOptions })
}

// =============================================================================
// VALIDATION TESTING UTILITIES
// =============================================================================

/**
 * Tests that a function properly validates required fields
 */
export const testRequiredFieldValidation = async (
  validationFn: (data: any) => Promise<any> | any,
  validData: Record<string, any>,
  requiredFields: string[]
): Promise<void> => {
  for (const field of requiredFields) {
    const invalidData = { ...validData }
    delete invalidData[field]
    
    await expect(validationFn(invalidData)).rejects.toThrow()
  }
}

/**
 * Tests that a function handles edge cases properly
 */
export const testEdgeCases = async (
  testFn: (input: any) => Promise<any> | any,
  edgeCases: Array<{ input: any; expectError?: boolean; description: string }>
): Promise<void> => {
  for (const { input, expectError = false, description } of edgeCases) {
    if (expectError) {
      await expect(testFn(input)).rejects.toThrow()
    } else {
      await expect(testFn(input)).resolves.not.toThrow()
    }
  }
}

// =============================================================================
// BROWSER TESTING UTILITIES
// =============================================================================

/**
 * Simulates user interactions with proper timing
 */
export const simulateUserInteraction = async (action: () => void): Promise<void> => {
  // Simulate human-like delay
  await waitForAsync(50)
  action()
  await waitForAsync(10)
}

/**
 * Checks accessibility attributes
 */
export const checkAccessibility = (element: HTMLElement): void => {
  // Check for ARIA attributes
  if (element.getAttribute('role')) {
    expect(element).toHaveAttribute('role')
  }
  
  // Check for proper labeling
  if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
    const hasLabel = element.getAttribute('aria-label') || 
                    element.getAttribute('aria-labelledby') ||
                    element.getAttribute('title')
    expect(hasLabel).toBeTruthy()
  }
}

// =============================================================================
// FILE TESTING UTILITIES
// =============================================================================

/**
 * Creates mock file objects for upload testing
 */
export const createMockFile = (
  name = 'test.mp3',
  size = 1024,
  type = 'audio/mpeg'
): File => {
  const content = new Array(size).fill('a').join('')
  return new File([content], name, { type })
}

/**
 * Creates mock FileList for testing file inputs
 */
export const createMockFileList = (files: File[]): FileList => {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      yield* files
    }
  }
  
  // Add files as indexed properties
  files.forEach((file, index) => {
    Object.defineProperty(fileList, index, {
      value: file,
      enumerable: true
    })
  })
  
  return fileList as FileList
}

// =============================================================================
// EXPORT ALL UTILITIES
// =============================================================================

// Re-export commonly used testing utilities
export { render, screen, fireEvent, userEvent, waitFor } from '@testing-library/react'
export { act } from 'react-dom/test-utils'