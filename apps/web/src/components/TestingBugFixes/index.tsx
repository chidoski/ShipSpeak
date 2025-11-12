/**
 * Testing & Bug Fixes - Main orchestrator for comprehensive QA testing
 * ShipSpeak Slice 15: Executive-Grade Quality Assurance & Professional Polish Validation
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState } from 'react'
import { TestOrchestrator } from './TestOrchestrator'
import { TransitionScenarioTests } from './CareerContextTesting/TransitionScenarioTests'
import { CriticalBugTracker } from './BugIdentificationFixing/CriticalBugTracker'
import { LoadTimeTests } from './PerformanceOptimizationTesting/LoadTimeTests'
import { PMCareerLevel, IndustryType } from '../../types/competency'

// =============================================================================
// MAIN TESTING INTERFACE
// =============================================================================

interface TestingBugFixesProps {
  initialTab?: 'orchestrator' | 'career' | 'bugs' | 'performance'
  careerContexts?: PMCareerLevel[]
  industryContexts?: IndustryType[]
  autoExecuteTests?: boolean
}

export const TestingBugFixes: React.FC<TestingBugFixesProps> = ({
  initialTab = 'orchestrator',
  careerContexts = ['PO', 'PM', 'SENIOR_PM', 'GROUP_PM', 'DIRECTOR'],
  industryContexts = ['healthcare', 'fintech', 'cybersecurity', 'enterprise', 'consumer'],
  autoExecuteTests = false
}) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [overallMetrics, setOverallMetrics] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    resolvedBugs: 0,
    performanceScore: 0
  })

  const tabs = [
    { id: 'orchestrator', label: 'Test Orchestrator', icon: '🎯' },
    { id: 'career', label: 'Career Context Tests', icon: '📈' },
    { id: 'bugs', label: 'Bug Tracker', icon: '🐛' },
    { id: 'performance', label: 'Performance Tests', icon: '⚡' }
  ]

  const handleMetricsUpdate = (source: string, metrics: any) => {
    // Update overall metrics based on source
    console.log(`Metrics update from ${source}:`, metrics)
    
    // This would normally update a centralized metrics state
    setOverallMetrics(prev => ({
      ...prev,
      [source]: metrics
    }))
  }

  return (
    <div className="testing-bug-fixes-container" data-testid="testing-bug-fixes">
      <div className="testing-header">
        <h2>ShipSpeak Quality Assurance Testing Suite</h2>
        <p>Comprehensive testing coverage and systematic bug fixing for PM communication development</p>
        
        <div className="overall-metrics">
          <div className="metric-card">
            <div className="metric-value">{overallMetrics.totalTests}</div>
            <div className="metric-label">Total Tests</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{overallMetrics.passedTests}</div>
            <div className="metric-label">Passed</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{overallMetrics.resolvedBugs}</div>
            <div className="metric-label">Bugs Resolved</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{overallMetrics.performanceScore}%</div>
            <div className="metric-label">Performance</div>
          </div>
        </div>
      </div>

      <div className="testing-navigation">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="testing-content">
        {activeTab === 'orchestrator' && (
          <TestOrchestrator
            careerContexts={careerContexts}
            industryContexts={industryContexts}
            onTestComplete={(results) => handleMetricsUpdate('orchestrator', results)}
            onQualityMetricsUpdate={(metrics) => handleMetricsUpdate('quality', metrics)}
          />
        )}

        {activeTab === 'career' && (
          <div className="career-testing-section">
            <TransitionScenarioTests
              industryFilter={undefined}
              onTestComplete={(results) => handleMetricsUpdate('career', results)}
              autoExecute={autoExecuteTests}
            />
          </div>
        )}

        {activeTab === 'bugs' && (
          <CriticalBugTracker
            onBugUpdate={(bug) => handleMetricsUpdate('bug', bug)}
            onMetricsUpdate={(metrics) => handleMetricsUpdate('bugMetrics', metrics)}
            autoDetect={true}
          />
        )}

        {activeTab === 'performance' && (
          <LoadTimeTests
            onMetricsUpdate={(metrics) => handleMetricsUpdate('performance', metrics)}
            autoExecute={autoExecuteTests}
            testInterval={60000} // Test every minute
          />
        )}
      </div>

      <div className="testing-footer">
        <div className="footer-info">
          <h4>Testing Standards Compliance</h4>
          <div className="compliance-list">
            <div className="compliance-item">
              <span className="compliance-icon">✅</span>
              <span>PM Career Context Testing</span>
            </div>
            <div className="compliance-item">
              <span className="compliance-icon">✅</span>
              <span>Industry-Specific Validation</span>
            </div>
            <div className="compliance-item">
              <span className="compliance-icon">✅</span>
              <span>Performance Standards Verification</span>
            </div>
            <div className="compliance-item">
              <span className="compliance-icon">✅</span>
              <span>Critical Bug Tracking & Resolution</span>
            </div>
            <div className="compliance-item">
              <span className="compliance-icon">✅</span>
              <span>Executive-Grade Quality Assurance</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testing-bug-fixes-container {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem;
        }

        .testing-header {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .testing-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
        }

        .testing-header p {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
          font-size: 1.125rem;
        }

        .overall-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .metric-card {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e5e7eb;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .testing-navigation {
          margin-bottom: 2rem;
        }

        .nav-tabs {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 0.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
          flex: 1;
          justify-content: center;
        }

        .nav-tab:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .nav-tab.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .tab-icon {
          font-size: 1.25rem;
        }

        .tab-label {
          font-size: 0.875rem;
        }

        .testing-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .career-testing-section {
          padding: 0;
        }

        .testing-footer {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .footer-info h4 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-weight: 600;
        }

        .compliance-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.75rem;
        }

        .compliance-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .compliance-icon {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .testing-bug-fixes-container {
            padding: 1rem;
          }

          .nav-tabs {
            flex-direction: column;
          }

          .nav-tab {
            justify-content: flex-start;
          }

          .overall-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .compliance-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default TestingBugFixes

// Export individual components for standalone use
export {
  TestOrchestrator,
  TransitionScenarioTests,
  CriticalBugTracker,
  LoadTimeTests
}