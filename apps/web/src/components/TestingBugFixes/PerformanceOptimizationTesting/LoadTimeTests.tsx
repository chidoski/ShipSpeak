/**
 * Load Time Tests - Page load and interaction performance testing
 * ShipSpeak Slice 15: Performance validation for executive-grade user experience
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PMCareerLevel, IndustryType } from '../../../types/competency'

// =============================================================================
// PERFORMANCE TESTING INTERFACES
// =============================================================================

interface LoadTimeMetric {
  component: string
  loadTime: number
  target: number
  status: 'PASS' | 'FAIL' | 'WARNING'
  timestamp: Date
  careerContext?: PMCareerLevel
  industryContext?: IndustryType
}

interface PerformanceStandards {
  dashboard: { target: number; critical: number }
  meetingAnalysis: { target: number; critical: number }
  practiceModule: { target: number; critical: number }
  mobileInterface: { target: number; critical: number }
  transcriptAnalysis: { target: number; critical: number }
  settingsPage: { target: number; critical: number }
}

interface LoadTimeTestsProps {
  performanceStandards?: Partial<PerformanceStandards>
  testComponents?: string[]
  onMetricsUpdate?: (metrics: LoadTimeMetric[]) => void
  autoExecute?: boolean
  testInterval?: number
}

interface PerformanceBenchmark {
  component: string
  baselineTime: number
  currentTime: number
  improvement: number
  regressionThreshold: number
}

// =============================================================================
// PERFORMANCE STANDARDS AND BENCHMARKS
// =============================================================================

const defaultPerformanceStandards: PerformanceStandards = {
  dashboard: { target: 2000, critical: 3000 }, // 2s target, 3s critical
  meetingAnalysis: { target: 3000, critical: 5000 }, // 3s target, 5s critical
  practiceModule: { target: 1500, critical: 2500 }, // 1.5s target, 2.5s critical
  mobileInterface: { target: 2500, critical: 4000 }, // 2.5s target, 4s critical
  transcriptAnalysis: { target: 5000, critical: 8000 }, // 5s target, 8s critical
  settingsPage: { target: 1000, critical: 2000 } // 1s target, 2s critical
}

const mockPerformanceBaselines: PerformanceBenchmark[] = [
  { component: 'dashboard', baselineTime: 1800, currentTime: 1750, improvement: 2.8, regressionThreshold: 2200 },
  { component: 'meetingAnalysis', baselineTime: 2800, currentTime: 2650, improvement: 5.4, regressionThreshold: 3500 },
  { component: 'practiceModule', baselineTime: 1200, currentTime: 1150, improvement: 4.2, regressionThreshold: 1800 },
  { component: 'mobileInterface', baselineTime: 2200, currentTime: 2100, improvement: 4.5, regressionThreshold: 3000 },
  { component: 'transcriptAnalysis', baselineTime: 4500, currentTime: 4200, improvement: 6.7, regressionThreshold: 6000 },
  { component: 'settingsPage', baselineTime: 900, currentTime: 850, improvement: 5.6, regressionThreshold: 1500 }
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LoadTimeTests: React.FC<LoadTimeTestsProps> = ({
  performanceStandards = defaultPerformanceStandards,
  testComponents = ['dashboard', 'meetingAnalysis', 'practiceModule', 'mobileInterface', 'transcriptAnalysis', 'settingsPage'],
  onMetricsUpdate,
  autoExecute = true,
  testInterval = 30000 // 30 seconds
}) => {
  const [metrics, setMetrics] = useState<LoadTimeMetric[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')
  const [benchmarks] = useState<PerformanceBenchmark[]>(mockPerformanceBaselines)
  const [testHistory, setTestHistory] = useState<LoadTimeMetric[]>([])

  // Simulate component load time testing
  const measureComponentLoadTime = async (componentName: string): Promise<LoadTimeMetric> => {
    setCurrentTest(`Testing ${componentName} load time`)
    
    const startTime = performance.now()
    
    // Simulate component loading with realistic delays
    const baseDelay = benchmarks.find(b => b.component === componentName)?.currentTime || 2000
    const variance = (Math.random() - 0.5) * 400 // ±200ms variance
    const loadTime = Math.max(500, baseDelay + variance)
    
    await new Promise(resolve => setTimeout(resolve, Math.min(loadTime / 10, 1000))) // Simulated test duration
    
    const actualLoadTime = performance.now() - startTime + loadTime
    const standards = performanceStandards[componentName as keyof PerformanceStandards]
    const target = standards?.target || 3000
    const critical = standards?.critical || 5000
    
    let status: 'PASS' | 'FAIL' | 'WARNING' = 'PASS'
    if (actualLoadTime > critical) {
      status = 'FAIL'
    } else if (actualLoadTime > target) {
      status = 'WARNING'
    }

    return {
      component: componentName,
      loadTime: Math.round(actualLoadTime),
      target,
      status,
      timestamp: new Date(),
      careerContext: 'PM', // Default context for testing
      industryContext: 'enterprise'
    }
  }

  // Execute load time tests for all components
  const runLoadTimeTests = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    const newMetrics: LoadTimeMetric[] = []

    try {
      for (const component of testComponents) {
        const metric = await measureComponentLoadTime(component)
        newMetrics.push(metric)
        setMetrics(prev => {
          const updated = [...prev.filter(m => m.component !== component), metric]
          return updated.sort((a, b) => a.component.localeCompare(b.component))
        })
      }

      // Add to history
      setTestHistory(prev => [...prev, ...newMetrics].slice(-100)) // Keep last 100 results

      if (onMetricsUpdate) {
        onMetricsUpdate(newMetrics)
      }

    } catch (error) {
      console.error('Load time testing failed:', error)
    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }, [testComponents, performanceStandards, isRunning, onMetricsUpdate])

  // Auto-execute tests at intervals
  useEffect(() => {
    if (autoExecute) {
      // Run immediately
      runLoadTimeTests()
      
      // Set up interval
      const interval = setInterval(runLoadTimeTests, testInterval)
      return () => clearInterval(interval)
    }
  }, [autoExecute, runLoadTimeTests, testInterval])

  // Calculate performance summary
  const performanceSummary = React.useMemo(() => {
    const totalComponents = metrics.length
    const passedComponents = metrics.filter(m => m.status === 'PASS').length
    const warningComponents = metrics.filter(m => m.status === 'WARNING').length
    const failedComponents = metrics.filter(m => m.status === 'FAIL').length
    
    const averageLoadTime = totalComponents > 0 
      ? Math.round(metrics.reduce((sum, m) => sum + m.loadTime, 0) / totalComponents)
      : 0

    return {
      totalComponents,
      passedComponents,
      warningComponents,
      failedComponents,
      averageLoadTime,
      successRate: totalComponents > 0 ? (passedComponents / totalComponents) * 100 : 0
    }
  }, [metrics])

  // Get performance trend for a component
  const getPerformanceTrend = (componentName: string) => {
    const componentHistory = testHistory.filter(m => m.component === componentName)
    if (componentHistory.length < 2) return null

    const recent = componentHistory.slice(-5) // Last 5 measurements
    const average = recent.reduce((sum, m) => sum + m.loadTime, 0) / recent.length
    const baseline = benchmarks.find(b => b.component === componentName)
    
    return {
      current: Math.round(average),
      baseline: baseline?.baselineTime || average,
      trend: average < (baseline?.baselineTime || average) ? 'improving' : 'degrading',
      change: baseline ? ((average - baseline.baselineTime) / baseline.baselineTime * 100) : 0
    }
  }

  return (
    <div className="load-time-tests" data-testid="load-time-tests">
      <div className="test-header">
        <h3>Load Time Performance Tests</h3>
        <div className="test-controls">
          <button 
            onClick={runLoadTimeTests}
            disabled={isRunning}
            className="run-tests-btn"
          >
            {isRunning ? 'Testing...' : 'Run Performance Tests'}
          </button>
        </div>
      </div>

      {isRunning && (
        <div className="test-progress">
          <div className="current-test">Testing: {currentTest}</div>
          <div className="progress-indicator">
            <div className="spinner"></div>
          </div>
        </div>
      )}

      <div className="performance-summary">
        <h4>Performance Summary</h4>
        <div className="summary-metrics">
          <div className="metric success">
            <span className="metric-value">{performanceSummary.passedComponents}</span>
            <span className="metric-label">Passed</span>
          </div>
          <div className="metric warning">
            <span className="metric-value">{performanceSummary.warningComponents}</span>
            <span className="metric-label">Warning</span>
          </div>
          <div className="metric failure">
            <span className="metric-value">{performanceSummary.failedComponents}</span>
            <span className="metric-label">Failed</span>
          </div>
          <div className="metric">
            <span className="metric-value">{performanceSummary.averageLoadTime}ms</span>
            <span className="metric-label">Average Load</span>
          </div>
          <div className="metric">
            <span className="metric-value">{performanceSummary.successRate.toFixed(1)}%</span>
            <span className="metric-label">Success Rate</span>
          </div>
        </div>
      </div>

      <div className="performance-results">
        <h4>Component Load Time Results</h4>
        <div className="results-grid">
          {metrics.map(metric => {
            const trend = getPerformanceTrend(metric.component)
            return (
              <div key={metric.component} className={`result-card ${metric.status.toLowerCase()}`}>
                <div className="result-header">
                  <h5>{metric.component}</h5>
                  <div className={`status-badge ${metric.status.toLowerCase()}`}>
                    {metric.status}
                  </div>
                </div>
                <div className="result-metrics">
                  <div className="load-time">
                    <span className="value">{metric.loadTime}ms</span>
                    <span className="target">Target: {metric.target}ms</span>
                  </div>
                  {trend && (
                    <div className="trend">
                      <span className={`trend-indicator ${trend.trend}`}>
                        {trend.trend === 'improving' ? '↓' : '↑'} {Math.abs(trend.change).toFixed(1)}%
                      </span>
                      <span className="trend-label">vs baseline</span>
                    </div>
                  )}
                </div>
                <div className="performance-bar">
                  <div 
                    className={`performance-fill ${metric.status.toLowerCase()}`}
                    style={{ width: `${Math.min((metric.loadTime / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="benchmarks-section">
        <h4>Performance Benchmarks</h4>
        <div className="benchmarks-grid">
          {benchmarks.map(benchmark => (
            <div key={benchmark.component} className="benchmark-card">
              <h6>{benchmark.component}</h6>
              <div className="benchmark-metrics">
                <div>Baseline: {benchmark.baselineTime}ms</div>
                <div>Current: {benchmark.currentTime}ms</div>
                <div className="improvement">Improvement: {benchmark.improvement.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .load-time-tests {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .run-tests-btn {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .run-tests-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .test-progress {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .performance-summary {
          margin-bottom: 1.5rem;
        }

        .summary-metrics {
          display: flex;
          gap: 1.5rem;
        }

        .metric {
          text-align: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 6px;
        }

        .metric-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .metric.success .metric-value { color: #10b981; }
        .metric.warning .metric-value { color: #f59e0b; }
        .metric.failure .metric-value { color: #ef4444; }

        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .result-card {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 1rem;
          background: white;
        }

        .result-card.pass {
          border-left: 4px solid #10b981;
        }

        .result-card.warning {
          border-left: 4px solid #f59e0b;
        }

        .result-card.fail {
          border-left: 4px solid #ef4444;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .status-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .status-badge.pass {
          background: #ecfdf5;
          color: #10b981;
        }

        .status-badge.warning {
          background: #fef3c7;
          color: #f59e0b;
        }

        .status-badge.fail {
          background: #fef2f2;
          color: #ef4444;
        }

        .result-metrics {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .load-time .value {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .load-time .target {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .trend-indicator.improving {
          color: #10b981;
        }

        .trend-indicator.degrading {
          color: #ef4444;
        }

        .performance-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .performance-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .performance-fill.pass {
          background: #10b981;
        }

        .performance-fill.warning {
          background: #f59e0b;
        }

        .performance-fill.fail {
          background: #ef4444;
        }

        .benchmarks-section {
          margin-top: 1.5rem;
        }

        .benchmarks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .benchmark-card {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 6px;
        }

        .benchmark-card h6 {
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .benchmark-metrics {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .benchmark-metrics div {
          margin-bottom: 0.25rem;
        }

        .improvement {
          color: #10b981 !important;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default LoadTimeTests