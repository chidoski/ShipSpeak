/**
 * Critical Bug Tracker - Critical functionality bug identification and tracking
 * ShipSpeak Slice 15: Comprehensive bug tracking and resolution system
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect } from 'react'
import { PMCareerLevel, IndustryType } from '../../../types/competency'

// =============================================================================
// BUG TRACKING INTERFACES
// =============================================================================

interface CriticalBug {
  id: string
  title: string
  description: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'IDENTIFIED' | 'IN_PROGRESS' | 'TESTING' | 'RESOLVED' | 'VERIFIED'
  impact: string
  affectedComponents: string[]
  careerContext?: PMCareerLevel
  industryContext?: IndustryType
  reproductionSteps: string[]
  expectedBehavior: string
  actualBehavior: string
  resolution?: string
  estimatedFixTime: number
  actualFixTime?: number
  assignee?: string
  reporter: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

interface BugResolutionMetrics {
  totalBugs: number
  criticalBugs: number
  resolvedBugs: number
  averageResolutionTime: number
  resolutionRate: number
  impactReduction: number
}

interface CriticalBugTrackerProps {
  bugs?: CriticalBug[]
  onBugUpdate?: (bug: CriticalBug) => void
  onMetricsUpdate?: (metrics: BugResolutionMetrics) => void
  autoDetect?: boolean
}

// =============================================================================
// MOCK CRITICAL BUGS DATA
// =============================================================================

const mockCriticalBugs: CriticalBug[] = [
  {
    id: 'BUG-001',
    title: 'Meeting upload fails on mobile Safari',
    description: 'Audio file upload functionality fails specifically on Safari mobile browser, blocking meeting analysis workflow',
    priority: 'CRITICAL',
    status: 'RESOLVED',
    impact: 'Blocks mobile meeting analysis functionality for iOS users',
    affectedComponents: ['MeetingUpload', 'MobileFileHandler', 'AudioProcessor'],
    careerContext: 'PM',
    industryContext: 'fintech',
    reproductionSteps: [
      'Open ShipSpeak on iOS Safari',
      'Navigate to meeting upload',
      'Select audio file from device',
      'Attempt to upload file'
    ],
    expectedBehavior: 'File uploads successfully and processing begins',
    actualBehavior: 'Upload fails with CORS error and file is not processed',
    resolution: 'Implemented Safari-specific file upload compatibility with MediaRecorder API fallback',
    estimatedFixTime: 2 * 60 * 60 * 1000, // 2 hours
    actualFixTime: 1.5 * 60 * 60 * 1000, // 1.5 hours
    assignee: 'Claude Code Assistant',
    reporter: 'QA Testing Suite',
    createdAt: new Date('2025-11-11T03:00:00Z'),
    updatedAt: new Date('2025-11-11T04:30:00Z'),
    resolvedAt: new Date('2025-11-11T04:30:00Z')
  },
  {
    id: 'BUG-002',
    title: 'AnalysisEngine startTime undefined error',
    description: 'Variable scope issue causing startTime reference error in transcript analysis processing',
    priority: 'CRITICAL',
    status: 'RESOLVED',
    impact: 'Breaks transcript analysis functionality across all career contexts',
    affectedComponents: ['AnalysisEngine', 'TranscriptProcessor', 'PatternDetection'],
    reproductionSteps: [
      'Upload meeting for analysis',
      'Start transcript analysis process',
      'Analysis fails with startTime undefined error'
    ],
    expectedBehavior: 'Analysis completes successfully with processing time metrics',
    actualBehavior: 'Analysis fails with "startTime is not defined" error',
    resolution: 'Moved startTime declaration to beginning of processTranscriptAnalysis function scope',
    estimatedFixTime: 30 * 60 * 1000, // 30 minutes
    actualFixTime: 15 * 60 * 1000, // 15 minutes
    assignee: 'Claude Code Assistant',
    reporter: 'Test Suite',
    createdAt: new Date('2025-11-11T04:00:00Z'),
    updatedAt: new Date('2025-11-11T04:15:00Z'),
    resolvedAt: new Date('2025-11-11T04:15:00Z')
  },
  {
    id: 'BUG-003',
    title: 'MobileContrastOptimizer text scaling not updating',
    description: 'Text size slider changes not reflected in CSS custom properties',
    priority: 'HIGH',
    status: 'RESOLVED',
    impact: 'Accessibility feature not working properly on mobile devices',
    affectedComponents: ['MobileContrastOptimizer', 'AccessibilitySettings'],
    careerContext: undefined,
    industryContext: undefined,
    reproductionSteps: [
      'Open mobile contrast settings',
      'Adjust text size slider',
      'CSS --text-scale property not updated'
    ],
    expectedBehavior: 'Text scaling updates immediately when slider changes',
    actualBehavior: 'Slider value updates but text scaling CSS property remains unchanged',
    resolution: 'Added useEffect dependency for textSizeOverride to trigger applyContrastStyles',
    estimatedFixTime: 1 * 60 * 60 * 1000, // 1 hour
    actualFixTime: 30 * 60 * 1000, // 30 minutes
    assignee: 'Claude Code Assistant',
    reporter: 'Mobile Testing',
    createdAt: new Date('2025-11-11T04:15:00Z'),
    updatedAt: new Date('2025-11-11T04:30:00Z'),
    resolvedAt: new Date('2025-11-11T04:30:00Z')
  },
  {
    id: 'BUG-004',
    title: 'Dashboard navigation test expecting "Analytics" instead of "Progress"',
    description: 'Test expectations out of sync with actual navigation implementation',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    impact: 'Test suite failures causing CI/CD pipeline issues',
    affectedComponents: ['DashboardLayout', 'NavigationTests'],
    reproductionSteps: [
      'Run dashboard layout tests',
      'Test looks for "Analytics" navigation item',
      'Actual navigation shows "Progress" item'
    ],
    expectedBehavior: 'Tests pass with correct navigation expectations',
    actualBehavior: 'Test fails: Unable to find element with text "Analytics"',
    resolution: 'Updated test expectation from "Analytics" to "Progress" to match implementation',
    estimatedFixTime: 15 * 60 * 1000, // 15 minutes
    actualFixTime: 10 * 60 * 1000, // 10 minutes
    assignee: 'Claude Code Assistant',
    reporter: 'Automated Testing',
    createdAt: new Date('2025-11-11T04:20:00Z'),
    updatedAt: new Date('2025-11-11T04:25:00Z'),
    resolvedAt: new Date('2025-11-11T04:25:00Z')
  }
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CriticalBugTracker: React.FC<CriticalBugTrackerProps> = ({
  bugs = mockCriticalBugs,
  onBugUpdate,
  onMetricsUpdate,
  autoDetect = true
}) => {
  const [trackedBugs, setTrackedBugs] = useState<CriticalBug[]>(bugs)
  const [selectedBug, setSelectedBug] = useState<CriticalBug | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterPriority, setFilterPriority] = useState<string>('ALL')

  // Calculate bug resolution metrics
  const calculateMetrics = (bugList: CriticalBug[]): BugResolutionMetrics => {
    const totalBugs = bugList.length
    const criticalBugs = bugList.filter(bug => bug.priority === 'CRITICAL').length
    const resolvedBugs = bugList.filter(bug => bug.status === 'RESOLVED').length
    
    const resolvedWithTimes = bugList.filter(bug => bug.status === 'RESOLVED' && bug.actualFixTime)
    const averageResolutionTime = resolvedWithTimes.length > 0 
      ? resolvedWithTimes.reduce((sum, bug) => sum + (bug.actualFixTime || 0), 0) / resolvedWithTimes.length
      : 0

    return {
      totalBugs,
      criticalBugs,
      resolvedBugs,
      averageResolutionTime,
      resolutionRate: totalBugs > 0 ? (resolvedBugs / totalBugs) * 100 : 0,
      impactReduction: resolvedBugs * 25 // Arbitrary impact reduction per bug
    }
  }

  // Filter bugs based on status and priority
  const filteredBugs = trackedBugs.filter(bug => {
    const statusMatch = filterStatus === 'ALL' || bug.status === filterStatus
    const priorityMatch = filterPriority === 'ALL' || bug.priority === filterPriority
    return statusMatch && priorityMatch
  })

  // Update bug status
  const updateBugStatus = (bugId: string, newStatus: CriticalBug['status']) => {
    setTrackedBugs(prev => prev.map(bug => {
      if (bug.id === bugId) {
        const updatedBug = {
          ...bug,
          status: newStatus,
          updatedAt: new Date(),
          ...(newStatus === 'RESOLVED' && { resolvedAt: new Date() })
        }
        
        if (onBugUpdate) {
          onBugUpdate(updatedBug)
        }
        
        return updatedBug
      }
      return bug
    }))
  }

  // Auto-detect new bugs (simulation)
  useEffect(() => {
    if (autoDetect) {
      const detectionInterval = setInterval(() => {
        // Simulate random bug detection (very low probability)
        if (Math.random() < 0.01) {
          const newBug: CriticalBug = {
            id: `BUG-${Date.now()}`,
            title: 'Auto-detected issue',
            description: 'Automatically detected performance degradation',
            priority: 'MEDIUM',
            status: 'IDENTIFIED',
            impact: 'Minor performance impact detected',
            affectedComponents: ['PerformanceMonitor'],
            reproductionSteps: ['Automated detection'],
            expectedBehavior: 'Normal performance',
            actualBehavior: 'Performance degradation detected',
            estimatedFixTime: 60 * 60 * 1000,
            assignee: 'Auto-assignment',
            reporter: 'Automated Detection',
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
          setTrackedBugs(prev => [newBug, ...prev])
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(detectionInterval)
    }
  }, [autoDetect])

  // Update metrics when bugs change
  useEffect(() => {
    const metrics = calculateMetrics(trackedBugs)
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics)
    }
  }, [trackedBugs, onMetricsUpdate])

  const metrics = calculateMetrics(filteredBugs)

  return (
    <div className="critical-bug-tracker" data-testid="critical-bug-tracker">
      <div className="tracker-header">
        <h3>Critical Bug Tracker</h3>
        <div className="bug-metrics">
          <div className="metric">
            <span className="metric-value">{metrics.totalBugs}</span>
            <span className="metric-label">Total Bugs</span>
          </div>
          <div className="metric">
            <span className="metric-value critical">{metrics.criticalBugs}</span>
            <span className="metric-label">Critical</span>
          </div>
          <div className="metric">
            <span className="metric-value resolved">{metrics.resolvedBugs}</span>
            <span className="metric-label">Resolved</span>
          </div>
          <div className="metric">
            <span className="metric-value">{metrics.resolutionRate.toFixed(1)}%</span>
            <span className="metric-label">Resolution Rate</span>
          </div>
        </div>
      </div>

      <div className="tracker-controls">
        <div className="filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Status</option>
            <option value="IDENTIFIED">Identified</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="TESTING">Testing</option>
            <option value="RESOLVED">Resolved</option>
            <option value="VERIFIED">Verified</option>
          </select>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Priority</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="bug-list">
        {filteredBugs.map(bug => (
          <div 
            key={bug.id} 
            className={`bug-item ${bug.priority.toLowerCase()} ${bug.status.toLowerCase()}`}
            onClick={() => setSelectedBug(bug)}
          >
            <div className="bug-header">
              <div className="bug-id">{bug.id}</div>
              <div className="bug-title">{bug.title}</div>
              <div className={`bug-priority ${bug.priority.toLowerCase()}`}>
                {bug.priority}
              </div>
            </div>
            <div className="bug-meta">
              <span className="bug-status">{bug.status}</span>
              <span className="bug-impact">{bug.impact}</span>
            </div>
            <div className="bug-actions">
              {bug.status !== 'RESOLVED' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    updateBugStatus(bug.id, 'RESOLVED')
                  }}
                  className="resolve-btn"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedBug && (
        <div className="bug-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{selectedBug.title}</h4>
              <button onClick={() => setSelectedBug(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="bug-details">
                <p><strong>Description:</strong> {selectedBug.description}</p>
                <p><strong>Impact:</strong> {selectedBug.impact}</p>
                <p><strong>Expected Behavior:</strong> {selectedBug.expectedBehavior}</p>
                <p><strong>Actual Behavior:</strong> {selectedBug.actualBehavior}</p>
                {selectedBug.resolution && (
                  <p><strong>Resolution:</strong> {selectedBug.resolution}</p>
                )}
                <div className="reproduction-steps">
                  <strong>Reproduction Steps:</strong>
                  <ol>
                    {selectedBug.reproductionSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .critical-bug-tracker {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tracker-header {
          margin-bottom: 1.5rem;
        }

        .bug-metrics {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
        }

        .metric-value.critical {
          color: #ef4444;
        }

        .metric-value.resolved {
          color: #10b981;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .tracker-controls {
          margin-bottom: 1.5rem;
        }

        .filters {
          display: flex;
          gap: 1rem;
        }

        .filter-select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
        }

        .bug-item {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bug-item:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .bug-item.critical {
          border-left: 4px solid #ef4444;
        }

        .bug-item.high {
          border-left: 4px solid #f59e0b;
        }

        .bug-item.resolved {
          opacity: 0.7;
          background: #f9fafb;
        }

        .bug-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .bug-id {
          font-family: monospace;
          font-size: 0.875rem;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .bug-title {
          flex: 1;
          font-weight: 500;
        }

        .bug-priority {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .bug-priority.critical {
          background: #fef2f2;
          color: #ef4444;
        }

        .bug-priority.high {
          background: #fef3c7;
          color: #f59e0b;
        }

        .bug-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .resolve-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .bug-detail-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .reproduction-steps ol {
          margin: 0.5rem 0;
          padding-left: 1.25rem;
        }
      `}</style>
    </div>
  )
}

export default CriticalBugTracker