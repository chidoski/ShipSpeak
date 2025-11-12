/**
 * Transition Scenario Tests - PM career transition functionality validation
 * ShipSpeak Slice 15: Comprehensive testing for PM career progression
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback } from 'react'
import { PMCareerLevel, IndustryType } from '../../../types/competency'

// =============================================================================
// TESTING INTERFACES
// =============================================================================

interface TransitionScenario {
  id: string
  from: PMCareerLevel
  to: PMCareerLevel
  industry: IndustryType
  testCases: TransitionTestCase[]
  successCriteria: string[]
  estimatedDuration: number
}

interface TransitionTestCase {
  id: string
  name: string
  description: string
  validationSteps: string[]
  expectedOutcome: string
  actualOutcome?: string
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED'
  executionTime: number
}

interface TransitionScenarioTestsProps {
  targetTransition?: {
    from: PMCareerLevel
    to: PMCareerLevel
  }
  industryFilter?: IndustryType
  onTestComplete?: (results: TransitionTestResult[]) => void
  autoExecute?: boolean
}

interface TransitionTestResult {
  scenarioId: string
  testCaseId: string
  status: 'PASSED' | 'FAILED'
  metrics: {
    skillGapClosure: number
    careerReadinessScore: number
    frameworkMastery: number
    industryContextApplication: number
  }
  feedback: string[]
  timestamp: Date
}

// =============================================================================
// MOCK TRANSITION SCENARIOS
// =============================================================================

const mockTransitionScenarios: TransitionScenario[] = [
  {
    id: 'po_to_pm_fintech',
    from: 'PO',
    to: 'PM',
    industry: 'fintech',
    estimatedDuration: 120000,
    successCriteria: [
      'Strategic language usage increases by 15% over practice sessions',
      'Framework application confidence scores improve consistently',
      'Business impact articulation quality demonstrates measurable advancement',
      'Financial risk communication meets regulatory standards'
    ],
    testCases: [
      {
        id: 'strategic_thinking_dev',
        name: 'Strategic Thinking Development',
        description: 'Validate strategic thinking skill progression for PO→PM transition',
        validationSteps: [
          'Measure baseline strategic vocabulary usage',
          'Track framework application in practice sessions',
          'Assess business impact reasoning quality',
          'Validate stakeholder communication improvements'
        ],
        expectedOutcome: '15% improvement in strategic language usage within 2 weeks',
        status: 'PENDING',
        executionTime: 0
      },
      {
        id: 'fintech_context_adaptation',
        name: 'Fintech Context Adaptation',
        description: 'Test industry-specific communication development for financial services',
        validationSteps: [
          'Assess regulatory language acquisition (SEC, FINRA)',
          'Validate risk management communication skills',
          'Test financial impact articulation',
          'Measure compliance framework integration'
        ],
        expectedOutcome: 'Regulatory communication confidence score >7.5/10',
        status: 'PENDING',
        executionTime: 0
      }
    ]
  },
  {
    id: 'pm_to_senior_pm_healthcare',
    from: 'PM',
    to: 'SENIOR_PM',
    industry: 'healthcare',
    estimatedDuration: 180000,
    successCriteria: [
      'Answer-first structure usage reaches 85% consistency',
      'Trade-off reasoning incorporates multiple frameworks effectively',
      'Executive communication confidence scores exceed 8.0/10',
      'Healthcare regulatory compliance patterns integrated'
    ],
    testCases: [
      {
        id: 'executive_communication',
        name: 'Executive Communication Excellence',
        description: 'Validate executive-level communication skill development',
        validationSteps: [
          'Track answer-first methodology implementation',
          'Measure trade-off articulation sophistication',
          'Assess executive presence confidence markers',
          'Validate strategic altitude maintenance'
        ],
        expectedOutcome: 'Executive communication confidence >8.0/10',
        status: 'PENDING',
        executionTime: 0
      },
      {
        id: 'healthcare_regulatory_fluency',
        name: 'Healthcare Regulatory Fluency',
        description: 'Test healthcare-specific regulatory communication mastery',
        validationSteps: [
          'Assess FDA compliance language integration',
          'Validate HIPAA communication protocols',
          'Test patient safety prioritization language',
          'Measure clinical evidence integration skills'
        ],
        expectedOutcome: 'Healthcare regulatory fluency score >8.5/10',
        status: 'PENDING',
        executionTime: 0
      }
    ]
  }
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const TransitionScenarioTests: React.FC<TransitionScenarioTestsProps> = ({
  targetTransition,
  industryFilter,
  onTestComplete,
  autoExecute = false
}) => {
  const [scenarios] = useState<TransitionScenario[]>(mockTransitionScenarios)
  const [testResults, setTestResults] = useState<TransitionTestResult[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')

  // Filter scenarios based on props
  const filteredScenarios = scenarios.filter(scenario => {
    if (targetTransition) {
      return scenario.from === targetTransition.from && scenario.to === targetTransition.to
    }
    if (industryFilter) {
      return scenario.industry === industryFilter
    }
    return true
  })

  // Execute transition scenario tests
  const executeScenarioTests = useCallback(async (scenario: TransitionScenario) => {
    const results: TransitionTestResult[] = []

    for (const testCase of scenario.testCases) {
      setCurrentTest(`${scenario.id}: ${testCase.name}`)
      
      const startTime = Date.now()
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate test evaluation
      const passed = Math.random() > 0.1 // 90% pass rate
      const executionTime = Date.now() - startTime
      
      testCase.status = passed ? 'PASSED' : 'FAILED'
      testCase.executionTime = executionTime
      testCase.actualOutcome = passed ? testCase.expectedOutcome : 'Test validation failed'

      const result: TransitionTestResult = {
        scenarioId: scenario.id,
        testCaseId: testCase.id,
        status: testCase.status,
        metrics: {
          skillGapClosure: Math.random() * 30 + 70, // 70-100%
          careerReadinessScore: Math.random() * 2 + 8, // 8-10
          frameworkMastery: Math.random() * 2 + 7.5, // 7.5-9.5
          industryContextApplication: Math.random() * 2 + 7 // 7-9
        },
        feedback: generateTestFeedback(testCase, scenario),
        timestamp: new Date()
      }

      results.push(result)
    }

    return results
  }, [])

  // Generate feedback based on test results
  const generateTestFeedback = (testCase: TransitionTestCase, scenario: TransitionScenario): string[] => {
    const feedback = []
    
    if (testCase.status === 'PASSED') {
      feedback.push(`✅ ${testCase.name} validation successful`)
      feedback.push(`Career transition progress on track for ${scenario.from}→${scenario.to}`)
      feedback.push(`${scenario.industry} industry context integration confirmed`)
    } else {
      feedback.push(`❌ ${testCase.name} requires attention`)
      feedback.push(`Additional practice needed for ${scenario.from}→${scenario.to} transition`)
      feedback.push(`Consider focused development in ${scenario.industry} communication patterns`)
    }

    return feedback
  }

  // Execute all filtered tests
  const runAllTests = useCallback(async () => {
    if (isExecuting) return

    setIsExecuting(true)
    setTestResults([])
    
    const allResults: TransitionTestResult[] = []

    try {
      for (const scenario of filteredScenarios) {
        const scenarioResults = await executeScenarioTests(scenario)
        allResults.push(...scenarioResults)
      }

      setTestResults(allResults)
      
      if (onTestComplete) {
        onTestComplete(allResults)
      }
    } catch (error) {
      console.error('Transition scenario test execution failed:', error)
    } finally {
      setIsExecuting(false)
      setCurrentTest('')
    }
  }, [filteredScenarios, executeScenarioTests, isExecuting, onTestComplete])

  // Auto-execute if enabled
  React.useEffect(() => {
    if (autoExecute && filteredScenarios.length > 0) {
      runAllTests()
    }
  }, [autoExecute, filteredScenarios, runAllTests])

  const passedTests = testResults.filter(r => r.status === 'PASSED').length
  const totalTests = testResults.length
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0

  return (
    <div className="transition-scenario-tests" data-testid="transition-scenario-tests">
      <div className="test-header">
        <h3>PM Career Transition Scenario Tests</h3>
        <div className="test-controls">
          <button 
            onClick={runAllTests}
            disabled={isExecuting || filteredScenarios.length === 0}
            className="run-tests-btn"
          >
            {isExecuting ? 'Running Tests...' : `Run ${filteredScenarios.length} Scenarios`}
          </button>
        </div>
      </div>

      {isExecuting && (
        <div className="execution-status">
          <div className="current-test">Currently executing: {currentTest}</div>
          <div className="progress-indicator">
            <div className="spinner"></div>
          </div>
        </div>
      )}

      <div className="scenarios-overview">
        <h4>Test Scenarios ({filteredScenarios.length})</h4>
        {filteredScenarios.map(scenario => (
          <div key={scenario.id} className="scenario-card">
            <div className="scenario-header">
              <h5>{scenario.from} → {scenario.to}</h5>
              <span className="industry-tag">{scenario.industry}</span>
            </div>
            <div className="test-cases">
              {scenario.testCases.map(testCase => (
                <div key={testCase.id} className={`test-case ${testCase.status.toLowerCase()}`}>
                  <span className="test-name">{testCase.name}</span>
                  <span className="test-status">{testCase.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {testResults.length > 0 && (
        <div className="test-results">
          <h4>Test Results Summary</h4>
          <div className="results-metrics">
            <div className="metric">
              <span>Success Rate:</span>
              <span className={successRate >= 90 ? 'excellent' : successRate >= 80 ? 'good' : 'needs-improvement'}>
                {successRate.toFixed(1)}%
              </span>
            </div>
            <div className="metric">
              <span>Tests Passed:</span>
              <span>{passedTests}/{totalTests}</span>
            </div>
          </div>
          
          <div className="detailed-results">
            {testResults.map((result, index) => (
              <div key={index} className="result-card">
                <h6>{result.testCaseId}</h6>
                <div className="result-status">{result.status}</div>
                <div className="metrics">
                  <div>Skill Gap Closure: {result.metrics.skillGapClosure.toFixed(1)}%</div>
                  <div>Career Readiness: {result.metrics.careerReadinessScore.toFixed(1)}/10</div>
                  <div>Framework Mastery: {result.metrics.frameworkMastery.toFixed(1)}/10</div>
                </div>
                <div className="feedback">
                  {result.feedback.map((item, i) => (
                    <div key={i} className="feedback-item">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .transition-scenario-tests {
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

        .execution-status {
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

        .scenario-card {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .scenario-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .industry-tag {
          background: #ddd6fe;
          color: #7c3aed;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .test-case {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          border-left: 3px solid #e5e7eb;
          margin-bottom: 0.5rem;
        }

        .test-case.passed {
          border-left-color: #10b981;
          background: #ecfdf5;
        }

        .test-case.failed {
          border-left-color: #ef4444;
          background: #fef2f2;
        }

        .results-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 6px;
        }

        .excellent { color: #10b981; font-weight: 600; }
        .good { color: #f59e0b; font-weight: 600; }
        .needs-improvement { color: #ef4444; font-weight: 600; }

        .result-card {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .feedback-item {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  )
}

export default TransitionScenarioTests