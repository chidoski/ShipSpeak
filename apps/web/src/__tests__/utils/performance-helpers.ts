/**
 * Performance Testing Utilities for ShipSpeak TDD Framework
 * Load testing, memory leak detection, and performance benchmarking
 */

import { performance } from 'perf_hooks'
import { ReactElement } from 'react'
import { render, cleanup } from '@testing-library/react'

// =============================================================================
// MEMORY LEAK DETECTION
// =============================================================================

export interface MemoryLeakResult {
  passed: boolean
  initialMemory: number
  finalMemory: number
  memoryIncrease: number
  iterations: number
  leakDetected: boolean
  details: {
    rss: number
    heapUsed: number
    heapTotal: number
    external: number
  }
}

/**
 * Advanced memory leak detection with detailed analysis
 */
export const detectMemoryLeak = (
  operation: () => void,
  options: {
    iterations?: number
    maxMemoryIncreaseMB?: number
    warmupIterations?: number
    cooldownMs?: number
  } = {}
): MemoryLeakResult => {
  const {
    iterations = 100,
    maxMemoryIncreaseMB = 1,
    warmupIterations = 10,
    cooldownMs = 100
  } = options

  // Warmup phase to stabilize memory
  for (let i = 0; i < warmupIterations; i++) {
    operation()
  }

  // Force garbage collection if available
  if (global.gc) {
    global.gc()
    global.gc() // Run twice for thorough cleanup
  }

  // Wait for memory to stabilize
  if (cooldownMs > 0) {
    const start = Date.now()
    while (Date.now() - start < cooldownMs) {
      // Busy wait
    }
  }

  const initialMemory = process.memoryUsage()

  // Run test iterations
  for (let i = 0; i < iterations; i++) {
    operation()
  }

  // Force garbage collection again
  if (global.gc) {
    global.gc()
    global.gc()
  }

  const finalMemory = process.memoryUsage()

  const memoryIncrease = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024
  const leakDetected = memoryIncrease > maxMemoryIncreaseMB

  return {
    passed: !leakDetected,
    initialMemory: initialMemory.heapUsed,
    finalMemory: finalMemory.heapUsed,
    memoryIncrease,
    iterations,
    leakDetected,
    details: {
      rss: (finalMemory.rss - initialMemory.rss) / 1024 / 1024,
      heapUsed: (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024,
      heapTotal: (finalMemory.heapTotal - initialMemory.heapTotal) / 1024 / 1024,
      external: (finalMemory.external - initialMemory.external) / 1024 / 1024
    }
  }
}

/**
 * Memory leak detection specifically for React components
 */
export const detectComponentMemoryLeak = (
  component: ReactElement,
  options: {
    iterations?: number
    maxMemoryIncreaseMB?: number
  } = {}
): MemoryLeakResult => {
  const operation = () => {
    const { unmount } = render(component)
    unmount()
    cleanup()
  }

  return detectMemoryLeak(operation, options)
}

// =============================================================================
// PERFORMANCE BENCHMARKING
// =============================================================================

export interface PerformanceBenchmark {
  operation: string
  iterations: number
  totalTime: number
  averageTime: number
  minTime: number
  maxTime: number
  standardDeviation: number
  throughput: number // operations per second
  passed: boolean
  target: number
}

/**
 * Comprehensive performance benchmarking
 */
export const benchmarkPerformance = (
  operation: () => void | Promise<void>,
  options: {
    name?: string
    iterations?: number
    maxAverageMs?: number
    warmupIterations?: number
  } = {}
): Promise<PerformanceBenchmark> => {
  const {
    name = 'Anonymous Operation',
    iterations = 1000,
    maxAverageMs = 10,
    warmupIterations = 100
  } = options

  return new Promise(async (resolve) => {
    // Warmup phase
    for (let i = 0; i < warmupIterations; i++) {
      await operation()
    }

    const times: number[] = []

    // Benchmark iterations
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      await operation()
      const end = performance.now()
      times.push(end - start)
    }

    // Calculate statistics
    const totalTime = times.reduce((sum, time) => sum + time, 0)
    const averageTime = totalTime / iterations
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)

    // Calculate standard deviation
    const variance = times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / iterations
    const standardDeviation = Math.sqrt(variance)

    const throughput = 1000 / averageTime // operations per second
    const passed = averageTime <= maxAverageMs

    resolve({
      operation: name,
      iterations,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      standardDeviation,
      throughput,
      passed,
      target: maxAverageMs
    })
  })
}

/**
 * Component render performance benchmarking
 */
export const benchmarkComponentRender = (
  component: ReactElement,
  options: {
    iterations?: number
    maxRenderTimeMs?: number
  } = {}
): PerformanceBenchmark => {
  const { iterations = 100, maxRenderTimeMs = 16 } = options

  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    const { unmount } = render(component)
    const end = performance.now()
    unmount()
    cleanup()
    times.push(end - start)
  }

  const totalTime = times.reduce((sum, time) => sum + time, 0)
  const averageTime = totalTime / iterations
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)

  const variance = times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / iterations
  const standardDeviation = Math.sqrt(variance)

  const throughput = 1000 / averageTime
  const passed = averageTime <= maxRenderTimeMs

  return {
    operation: 'Component Render',
    iterations,
    totalTime,
    averageTime,
    minTime,
    maxTime,
    standardDeviation,
    throughput,
    passed,
    target: maxRenderTimeMs
  }
}

// =============================================================================
// LOAD TESTING
// =============================================================================

export interface LoadTestResult {
  concurrency: number
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  requestsPerSecond: number
  errorRate: number
  passed: boolean
  errors: string[]
}

/**
 * Concurrent load testing simulation
 */
export const runLoadTest = async (
  operation: () => Promise<any>,
  options: {
    concurrency?: number
    totalRequests?: number
    maxAverageResponseTime?: number
    maxErrorRate?: number
  } = {}
): Promise<LoadTestResult> => {
  const {
    concurrency = 10,
    totalRequests = 100,
    maxAverageResponseTime = 100,
    maxErrorRate = 0.05 // 5%
  } = options

  const startTime = performance.now()
  const results: Array<{ success: boolean; responseTime: number; error?: string }> = []
  const errors: string[] = []

  // Create concurrent batches
  const batchSize = Math.ceil(totalRequests / concurrency)
  const batches: Promise<void>[] = []

  for (let batch = 0; batch < concurrency; batch++) {
    const batchPromise = (async () => {
      for (let i = 0; i < batchSize && results.length < totalRequests; i++) {
        const requestStart = performance.now()
        try {
          await operation()
          const requestEnd = performance.now()
          results.push({
            success: true,
            responseTime: requestEnd - requestStart
          })
        } catch (error) {
          const requestEnd = performance.now()
          const errorMessage = error instanceof Error ? error.message : String(error)
          results.push({
            success: false,
            responseTime: requestEnd - requestStart,
            error: errorMessage
          })
          errors.push(errorMessage)
        }
      }
    })()
    batches.push(batchPromise)
  }

  // Wait for all batches to complete
  await Promise.all(batches)

  const endTime = performance.now()
  const totalDuration = endTime - startTime

  // Calculate metrics
  const successfulRequests = results.filter(r => r.success).length
  const failedRequests = results.filter(r => !r.success).length
  const responseTimes = results.map(r => r.responseTime)

  const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
  const minResponseTime = Math.min(...responseTimes)
  const maxResponseTime = Math.max(...responseTimes)

  const requestsPerSecond = (totalRequests / totalDuration) * 1000
  const errorRate = failedRequests / totalRequests

  const passed = averageResponseTime <= maxAverageResponseTime && errorRate <= maxErrorRate

  return {
    concurrency,
    totalRequests: results.length,
    successfulRequests,
    failedRequests,
    averageResponseTime,
    minResponseTime,
    maxResponseTime,
    requestsPerSecond,
    errorRate,
    passed,
    errors: [...new Set(errors)] // Remove duplicates
  }
}

// =============================================================================
// API PERFORMANCE TESTING
// =============================================================================

export interface APIPerformanceResult {
  endpoint: string
  method: string
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  successRate: number
  throughput: number
  passed: boolean
  statusCodes: Record<number, number>
  errors: string[]
}

/**
 * API endpoint performance testing
 */
export const testAPIPerformance = async (
  apiCall: () => Promise<Response>,
  options: {
    endpoint?: string
    method?: string
    iterations?: number
    maxResponseTime?: number
    minSuccessRate?: number
  } = {}
): Promise<APIPerformanceResult> => {
  const {
    endpoint = 'Unknown',
    method = 'GET',
    iterations = 50,
    maxResponseTime: maxResponseTimeLimit = 200,
    minSuccessRate = 0.95
  } = options

  const results: Array<{ responseTime: number; status: number; success: boolean; error?: string }> = []
  const errors: string[] = []
  const statusCodes: Record<number, number> = {}

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    try {
      const response = await apiCall()
      const end = performance.now()
      const responseTime = end - start
      const status = response.status
      const success = status >= 200 && status < 300

      results.push({ responseTime, status, success })

      // Count status codes
      statusCodes[status] = (statusCodes[status] || 0) + 1

      if (!success) {
        errors.push(`HTTP ${status}`)
      }
    } catch (error) {
      const end = performance.now()
      const responseTime = end - start
      const errorMessage = error instanceof Error ? error.message : String(error)

      results.push({ responseTime, status: 0, success: false, error: errorMessage })
      errors.push(errorMessage)
    }
  }

  // Calculate metrics
  const responseTimes = results.map(r => r.responseTime)
  const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
  const minResponseTime = Math.min(...responseTimes)
  const maxResponseTime = Math.max(...responseTimes)

  const successfulRequests = results.filter(r => r.success).length
  const successRate = successfulRequests / iterations
  const throughput = 1000 / averageResponseTime // requests per second

  const passed = averageResponseTime <= maxResponseTimeLimit && successRate >= minSuccessRate

  return {
    endpoint,
    method,
    averageResponseTime,
    minResponseTime,
    maxResponseTime,
    successRate,
    throughput,
    passed,
    statusCodes,
    errors: [...new Set(errors)]
  }
}

// =============================================================================
// COMPREHENSIVE PERFORMANCE TEST SUITE
// =============================================================================

export interface PerformanceTestSuite {
  memoryLeak: MemoryLeakResult
  benchmark: PerformanceBenchmark
  loadTest: LoadTestResult
  componentRender?: PerformanceBenchmark
  apiPerformance?: APIPerformanceResult
  overall: {
    passed: boolean
    score: number
    issues: string[]
  }
}

/**
 * Runs comprehensive performance test suite
 */
export const runPerformanceTestSuite = async (
  operations: {
    basicOperation: () => void
    asyncOperation?: () => Promise<any>
    component?: ReactElement
    apiCall?: () => Promise<Response>
  },
  options: {
    memoryLeakOptions?: any
    benchmarkOptions?: any
    loadTestOptions?: any
    componentOptions?: any
    apiOptions?: any
  } = {}
): Promise<PerformanceTestSuite> => {
  const results: PerformanceTestSuite = {
    memoryLeak: detectMemoryLeak(operations.basicOperation, options.memoryLeakOptions),
    benchmark: await benchmarkPerformance(operations.basicOperation, options.benchmarkOptions),
    loadTest: await runLoadTest(
      operations.asyncOperation || (() => Promise.resolve()),
      options.loadTestOptions
    ),
    overall: { passed: true, score: 0, issues: [] }
  }

  if (operations.component) {
    results.componentRender = benchmarkComponentRender(operations.component, options.componentOptions)
  }

  if (operations.apiCall) {
    results.apiPerformance = await testAPIPerformance(operations.apiCall, options.apiOptions)
  }

  // Calculate overall performance score
  let totalTests = 3
  let passedTests = 0
  const issues: string[] = []

  if (results.memoryLeak.passed) passedTests++
  else issues.push('Memory leak detected')

  if (results.benchmark.passed) passedTests++
  else issues.push(`Benchmark failed: ${results.benchmark.averageTime}ms > ${results.benchmark.target}ms`)

  if (results.loadTest.passed) passedTests++
  else issues.push(`Load test failed: ${(results.loadTest.errorRate * 100).toFixed(1)}% error rate`)

  if (results.componentRender) {
    totalTests++
    if (results.componentRender.passed) passedTests++
    else issues.push(`Component render too slow: ${results.componentRender.averageTime}ms`)
  }

  if (results.apiPerformance) {
    totalTests++
    if (results.apiPerformance.passed) passedTests++
    else issues.push(`API performance failed: ${results.apiPerformance.averageResponseTime}ms`)
  }

  const score = (passedTests / totalTests) * 100
  results.overall = {
    passed: passedTests === totalTests,
    score,
    issues
  }

  return results
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Creates a CPU-intensive operation for testing
 */
export const createCPUIntensiveOperation = (complexity = 1000): (() => void) => {
  return () => {
    let result = 0
    for (let i = 0; i < complexity; i++) {
      result += Math.sqrt(i * Math.random())
    }
    return result
  }
}

/**
 * Creates a memory-intensive operation for testing
 */
export const createMemoryIntensiveOperation = (sizeMB = 1): (() => void) => {
  return () => {
    const bytes = sizeMB * 1024 * 1024
    const buffer = new ArrayBuffer(bytes)
    const view = new Uint8Array(buffer)
    view.fill(Math.random() * 255)
    return buffer
  }
}

/**
 * Simulates network delay for testing
 */
export const simulateNetworkDelay = (minMs = 50, maxMs = 200): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Performance monitoring decorator
 */
export const withPerformanceMonitoring = <T extends (...args: any[]) => any>(
  fn: T,
  name?: string
): T => {
  return ((...args: any[]) => {
    const start = performance.now()
    const result = fn(...args)
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now()
        console.log(`[Performance] ${name || fn.name}: ${(end - start).toFixed(2)}ms`)
      })
    } else {
      const end = performance.now()
      console.log(`[Performance] ${name || fn.name}: ${(end - start).toFixed(2)}ms`)
      return result
    }
  }) as T
}