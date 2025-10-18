/**
 * Meeting Analysis Component for ShipSpeak
 * Real-time WebSocket integration with comprehensive analysis display
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface MeetingAnalysisData {
  fillerWordsPerMinute: number
  confidenceScore: number
  speakingPace: number
  structureScore: number
  keyInsights: string[]
  improvementAreas: string[]
  recommendations: string[]
}

interface Meeting {
  id: string
  title: string
  duration: number
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  createdAt: string
  analysis?: MeetingAnalysisData
  error?: string
}

interface MeetingAnalysisProps {
  meeting: Meeting
  enableRealtime?: boolean
  onMeetingUpdate?: (meeting: Meeting) => void
  onGenerateModule?: (meetingId: string, improvementAreas: string[]) => void
  onShare?: (meetingId: string) => void
}

interface ProgressUpdate {
  progress: number
  stage: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MeetingAnalysis: React.FC<MeetingAnalysisProps> = ({
  meeting,
  enableRealtime = false,
  onMeetingUpdate,
  onGenerateModule,
  onShare
}) => {
  const [currentMeeting, setCurrentMeeting] = useState(meeting)
  const [progressData, setProgressData] = useState<ProgressUpdate | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // =============================================================================
  // WEBSOCKET EFFECTS
  // =============================================================================

  useEffect(() => {
    setCurrentMeeting(meeting)
  }, [meeting])

  useEffect(() => {
    if (enableRealtime && (currentMeeting.status === 'processing' || currentMeeting.status === 'uploading')) {
      connectWebSocket()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [enableRealtime, currentMeeting.id, currentMeeting.status])

  const connectWebSocket = () => {
    try {
      const wsUrl = `ws://localhost:3001/ws/meeting/${meeting.id}`
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.addEventListener('message', handleWebSocketMessage)
      wsRef.current.addEventListener('error', handleWebSocketError)
      wsRef.current.addEventListener('close', handleWebSocketClose)

      setConnectionError(false)
    } catch (error) {
      setConnectionError(true)
      scheduleRetry()
    }
  }

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data)
      
      switch (message.type) {
        case 'progress':
          setProgressData(message.data)
          break
        
        case 'completed':
          const updatedMeeting = {
            ...currentMeeting,
            status: 'completed' as const,
            analysis: message.data.analysis
          }
          setCurrentMeeting(updatedMeeting)
          onMeetingUpdate?.(updatedMeeting)
          setProgressData(null)
          break
        
        case 'failed':
          const failedMeeting = {
            ...currentMeeting,
            status: 'failed' as const,
            error: message.data.error
          }
          setCurrentMeeting(failedMeeting)
          onMeetingUpdate?.(failedMeeting)
          break
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  const handleWebSocketError = () => {
    setConnectionError(true)
    scheduleRetry()
  }

  const handleWebSocketClose = () => {
    if (currentMeeting.status === 'processing' || currentMeeting.status === 'uploading') {
      scheduleRetry()
    }
  }

  const scheduleRetry = () => {
    retryTimeoutRef.current = setTimeout(() => {
      connectWebSocket()
    }, 2000)
  }

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleGenerateModule = () => {
    if (currentMeeting.analysis) {
      onGenerateModule?.(currentMeeting.id, currentMeeting.analysis.improvementAreas)
    }
  }

  const handleShare = () => {
    onShare?.(currentMeeting.id)
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981' // green
    if (score >= 60) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'processing': return '#3b82f6'
      case 'uploading': return '#8b5cf6'
      case 'failed': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderProcessingState = () => {
    if (currentMeeting.status === 'uploading') {
      return (
        <div data-testid="upload-indicator" className="processing-state">
          <div className="spinner">⏳</div>
          <div>Uploading meeting audio...</div>
        </div>
      )
    }

    if (currentMeeting.status === 'processing') {
      return (
        <div data-testid="processing-indicator" className="processing-state">
          <div className="spinner">⟳</div>
          <div>
            Analyzing meeting...
            {progressData && (
              <div className="progress-info">
                <div>{progressData.progress}%</div>
                <div className="stage">{progressData.stage}</div>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (currentMeeting.status === 'failed') {
      return (
        <div data-testid="error-indicator" className="error-state">
          <div className="error-icon">❌</div>
          <div>Analysis failed</div>
          {currentMeeting.error && <div className="error-detail">{currentMeeting.error}</div>}
        </div>
      )
    }

    return null
  }

  const renderScoreChart = (label: string, score: number, testId: string) => (
    <div className="score-item">
      <div 
        data-testid={testId}
        className="score-circle"
        style={{ borderColor: getScoreColor(score) }}
        aria-label={`${label}: ${score} out of 100`}
      >
        <span className="score-value">{score}</span>
      </div>
      <div className="score-label">{label}</div>
    </div>
  )

  const renderAnalysisCharts = () => {
    if (!currentMeeting.analysis) return null

    const { analysis } = currentMeeting

    return (
      <div className="analysis-charts">
        <div className="scores-row">
          {renderScoreChart('Confidence', analysis.confidenceScore, 'confidence-score')}
          {renderScoreChart('Structure', analysis.structureScore, 'structure-score')}
        </div>
        
        <div className="metrics-row">
          <div data-testid="filler-words-chart" className="metric-item">
            <div className="metric-value">{analysis.fillerWordsPerMinute} per minute</div>
            <div className="metric-label">Filler Words</div>
          </div>
          
          <div data-testid="pace-chart" className="metric-item">
            <div className="metric-value">{analysis.speakingPace} WPM</div>
            <div className="metric-label">Speaking Pace</div>
          </div>
        </div>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div data-testid="meeting-analysis" className="meeting-analysis" aria-label="Meeting analysis results">
      {/* Header */}
      <div className="analysis-header">
        <div className="meeting-info">
          <h3 className="meeting-title">{currentMeeting.title}</h3>
          <div className="meeting-meta">
            <span>{formatDuration(currentMeeting.duration)}</span>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(currentMeeting.status) }}
            >
              {currentMeeting.status}
            </span>
          </div>
        </div>
        
        {currentMeeting.analysis && (
          <div className="action-buttons">
            <button onClick={handleGenerateModule} className="generate-btn">
              Generate Practice Module
            </button>
            <button 
              data-testid="share-analysis"
              onClick={handleShare} 
              className="share-btn"
            >
              Share
            </button>
          </div>
        )}
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div data-testid="connection-error" className="connection-error">
          Connection issues detected. Retrying...
        </div>
      )}

      {/* Content */}
      {currentMeeting.status !== 'completed' ? (
        renderProcessingState()
      ) : (
        <div className="analysis-content">
          {renderAnalysisCharts()}
          
          {/* Insights Section */}
          <div className="insights-section">
            <button
              data-testid="expand-insights"
              onClick={handleExpandToggle}
              className="expand-button"
              onKeyDown={(e) => e.key === 'Enter' && handleExpandToggle()}
            >
              Key Insights & Recommendations {isExpanded ? '▼' : '▶'}
            </button>
            
            {isExpanded && (
              <div data-testid="detailed-insights" className="detailed-insights">
                <div className="insights-grid">
                  <div className="insights-column">
                    <h4>Key Insights</h4>
                    <ul>
                      {currentMeeting.analysis?.keyInsights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="improvements-column">
                    <h4>Improvement Areas</h4>
                    <ul>
                      {currentMeeting.analysis?.improvementAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .meeting-analysis {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 1rem;
        }

        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .meeting-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .meeting-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .status-badge {
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          text-transform: capitalize;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .generate-btn, .share-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .generate-btn:hover, .share-btn:hover {
          background: #f9fafb;
        }

        .processing-state, .error-state {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          text-align: center;
          justify-content: center;
        }

        .spinner {
          font-size: 1.5rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .progress-info {
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        .stage {
          color: #6b7280;
          text-transform: capitalize;
        }

        .analysis-charts {
          margin-bottom: 1.5rem;
        }

        .scores-row {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .score-item {
          text-align: center;
        }

        .score-circle {
          width: 4rem;
          height: 4rem;
          border: 4px solid;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
        }

        .score-value {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .score-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .metrics-row {
          display: flex;
          gap: 2rem;
        }

        .metric-item {
          text-align: center;
        }

        .metric-value {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .expand-button {
          background: none;
          border: none;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detailed-insights {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .insights-column h4, .improvements-column h4 {
          margin: 0 0 0.75rem 0;
          font-weight: 600;
        }

        .insights-column ul, .improvements-column ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .insights-column li, .improvements-column li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .connection-error {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .analysis-header {
            flex-direction: column;
            gap: 1rem;
          }

          .scores-row, .metrics-row {
            justify-content: center;
          }

          .insights-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}