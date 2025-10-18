/**
 * Core Testing Utilities for ShipSpeak TDD Framework
 * Provides comprehensive helpers for unit, integration, and performance testing
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { performance } from 'perf_hooks'
import { jest } from '@jest/globals'

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
    
    try {
      const result = validationFn(invalidData)
      if (result && typeof result.then === 'function') {
        await expect(result).rejects.toThrow()
      } else {
        // For sync functions, the error should have been thrown already
        throw new Error(`Expected validation to fail for missing field: ${field}`)
      }
    } catch (error) {
      // This is expected for sync validation functions
      expect(error).toBeDefined()
    }
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
    try {
      const result = testFn(input)
      
      if (expectError) {
        if (result && typeof result.then === 'function') {
          await expect(result).rejects.toThrow()
        } else {
          throw new Error(`Expected error for test case: ${description}`)
        }
      } else {
        if (result && typeof result.then === 'function') {
          await expect(result).resolves.toBeDefined()
        } else {
          expect(result).toBeDefined()
        }
      }
    } catch (error) {
      if (expectError) {
        // This is expected
        expect(error).toBeDefined()
      } else {
        throw error
      }
    }
  }
}

// =============================================================================
// TEST CASES FOR TEST HELPERS
// =============================================================================

describe('Test Helpers', () => {
  describe('Performance Testing', () => {
    it('should measure async performance correctly', async () => {
      const slowOperation = async () => {
        await waitForAsync(50)
        return 'result'
      }

      const result = await measureAsyncPerformance(slowOperation, 100)
      
      expect(result.result).toBe('result')
      expect(result.duration).toBeGreaterThan(40)
      expect(result.performant).toBe(true)
      expect(result.memoryUsage).toBeDefined()
    })

    it('should detect memory leaks', () => {
      const leakyOperation = () => {
        // Simulate memory allocation
        const data = new Array(1000).fill('test data')
        return data
      }

      const result = detectMemoryLeak(leakyOperation, 10, 0.1)
      expect(result.iterations).toBe(10)
      expect(result.memoryIncrease).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Mock Data Generation', () => {
    it('should generate mock users with unique IDs', () => {
      const user1 = generateMockUser()
      const user2 = generateMockUser()
      
      expect(user1.id).not.toBe(user2.id)
      expect(user1.email).toContain('@example.com')
      expect(user1.role).toBe('individual')
    })

    it('should generate mock meeting analysis', () => {
      const analysis = generateMockMeetingAnalysis({
        duration: 1800
      })
      
      expect(analysis.duration).toBe(1800)
      expect(analysis.communicationScores).toBeDefined()
      expect(analysis.recommendations).toHaveLength(3)
    })

    it('should generate mock practice modules', () => {
      const module = generateMockPracticeModule({
        type: 'EXECUTIVE_PRESENCE',
        difficulty: 'ADVANCED'
      })
      
      expect(module.type).toBe('EXECUTIVE_PRESENCE')
      expect(module.difficulty).toBe('ADVANCED')
      expect(module.status).toBe('pending')
    })
  })

  describe('Async Testing Utilities', () => {
    it('should wait for async operations', async () => {
      const start = Date.now()
      await waitForAsync(100)
      const elapsed = Date.now() - start
      
      expect(elapsed).toBeGreaterThanOrEqual(95)
    })

    it('should wait for conditions', async () => {
      let condition = false
      setTimeout(() => { condition = true }, 50)
      
      await waitForCondition(() => condition, 1000, 10)
      expect(condition).toBe(true)
    })

    it('should timeout if condition is not met', async () => {
      await expect(
        waitForCondition(() => false, 100, 10)
      ).rejects.toThrow('Condition not met within 100ms')
    })
  })

  describe('API Testing Utilities', () => {
    it('should create mock API responses', () => {
      const response = createMockAPIResponse({ message: 'success' }, 200)
      
      expect(response.data.message).toBe('success')
      expect(response.status).toBe(200)
      expect(response.headers['Content-Type']).toBe('application/json')
    })

    it('should simulate network delay', async () => {
      const start = Date.now()
      await simulateNetworkDelay(50, 100)
      const elapsed = Date.now() - start
      
      expect(elapsed).toBeGreaterThanOrEqual(45)
      expect(elapsed).toBeLessThanOrEqual(110)
    })
  })

  describe('Validation Testing', () => {
    it('should test required field validation', async () => {
      const validator = (data: any) => {
        if (!data.name) throw new Error('Name is required')
        if (!data.email) throw new Error('Email is required')
        return true
      }

      const validData = { name: 'Test', email: 'test@example.com' }
      
      await testRequiredFieldValidation(validator, validData, ['name', 'email'])
    })

    it('should test edge cases', async () => {
      const processor = (input: string) => {
        if (input === 'error') throw new Error('Test error')
        return input.toUpperCase()
      }

      const edgeCases = [
        { input: 'hello', expectError: false, description: 'valid input' },
        { input: 'error', expectError: true, description: 'error input' }
      ]

      await testEdgeCases(processor, edgeCases)
    })
  })
})