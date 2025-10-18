/**
 * Refactored Meeting Analysis Component for ShipSpeak
 * Uses custom hooks, shared types, theme system, and utility functions
 * Improved maintainability and reduced complexity
 */

'use client'

import React, { useState, useCallback } from 'react'
import { Meeting, MeetingAnalysisData, WebSocketMessage } from '@/types/dashboard'
import { useWebSocket } from '@/hooks/useWebSocket'
import { lightTheme, getScoreColor, getStatusColor } from '@/styles/theme'
import { formatDuration, formatProgress, formatScoreDescription } from '@/utils/formatting'

// =============================================================================
// TYPES
// =============================================================================

interface MeetingAnalysisProps {
  meeting: Meeting
  enableRealtime?: boolean
  onMeetingUpdate?: (meeting: Meeting) => void
  onGenerateModule?: (meetingId: string, improvementAreas: string[]) => void
  onShare?: (meetingId: string) => void
}

interface ProgressState {
  progress: number
  stage: string
}

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

const useMeetingState = (
  initialMeeting: Meeting,
  onMeetingUpdate?: (meeting: Meeting) => void
) => {
  const [meeting, setMeeting] = useState(initialMeeting)
  const [progressData, setProgressData] = useState<ProgressState | null>(null)

  const updateMeeting = useCallback((updatedMeeting: Meeting) => {
    setMeeting(updatedMeeting)
    onMeetingUpdate?.(updatedMeeting)
  }, [onMeetingUpdate])

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'progress':
        if (message.data.progress && message.data.stage) {
          setProgressData({
            progress: message.data.progress,
            stage: message.data.stage
          })
        }
        break
      
      case 'completed':
        if (message.data.analysis) {
          const completedMeeting = {
            ...meeting,
            status: 'completed' as const,
            analysis: message.data.analysis
          }
          updateMeeting(completedMeeting)
          setProgressData(null)
        }
        break
      
      case 'failed':
        const failedMeeting = {
          ...meeting,
          status: 'failed' as const,
          error: message.data.error || 'Analysis failed'
        }
        updateMeeting(failedMeeting)
        setProgressData(null)
        break
    }
  }, [meeting, updateMeeting])

  return {
    meeting,
    progressData,
    updateMeeting,
    handleWebSocketMessage
  }
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const ProcessingIndicator: React.FC<{
  status: Meeting['status']
  progressData: ProgressState | null
  error?: string
}> = ({ status, progressData, error }) => {
  const theme = lightTheme

  if (status === 'uploading') {
    return (
      <div data-testid="upload-indicator" style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.xl,
        textAlign: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: '1.5rem' }}>⏳</span>
        <div>Uploading meeting audio...</div>
      </div>
    )
  }

  if (status === 'processing') {
    return (
      <div data-testid="processing-indicator" style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.xl,
        textAlign: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ 
          fontSize: '1.5rem',
          animation: 'spin 1s linear infinite'
        }}>⟳</span>
        <div>
          Analyzing meeting...
          {progressData && (
            <div style={{ marginTop: theme.spacing.sm, fontSize: theme.typography.fontSize.sm }}>
              <div>{progressData.progress}%</div>
              <div style={{ color: theme.colors.text.secondary, textTransform: 'capitalize' }}>
                {progressData.stage}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div data-testid="error-indicator" style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.xl,
        textAlign: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: '1.5rem' }}>❌</span>
        <div>
          <div>Analysis failed</div>
          {error && (
            <div style={{ 
              marginTop: theme.spacing.sm,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

const ScoreChart: React.FC<{
  label: string
  score: number
  testId: string
}> = ({ label, score, testId }) => {
  const theme = lightTheme
  const color = getScoreColor(score, theme)
  const description = formatScoreDescription(score)

  return (
    <div style={{ textAlign: 'center' }}>
      <div 
        data-testid={testId}
        style={{
          width: '4rem',
          height: '4rem',
          border: `4px solid ${color}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.5rem'
        }}
        aria-label={`${label}: ${score} out of 100`}
      >
        <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{score}</span>
      </div>
      <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
        {label}
      </div>
      <div style={{ fontSize: theme.typography.fontSize.xs, color }}>
        {description}
      </div>
    </div>
  )
}

const AnalysisCharts: React.FC<{ analysis: MeetingAnalysisData }> = ({ analysis }) => {
  const theme = lightTheme

  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      <div style={{
        display: 'flex',
        gap: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
        justifyContent: 'center'
      }}>
        <ScoreChart label="Confidence" score={analysis.confidenceScore} testId="confidence-score" />
        <ScoreChart label="Structure" score={analysis.structureScore} testId="structure-score" />
      </div>
      
      <div style={{
        display: 'flex',
        gap: theme.spacing.xl,
        justifyContent: 'center'
      }}>
        <div data-testid="filler-words-chart" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {analysis.fillerWordsPerMinute} per minute
          </div>
          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
            Filler Words
          </div>
        </div>
        
        <div data-testid="pace-chart" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {analysis.speakingPace} WPM
          </div>
          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
            Speaking Pace
          </div>
        </div>
      </div>
    </div>
  )
}

const InsightsSection: React.FC<{
  analysis: MeetingAnalysisData
  isExpanded: boolean
  onToggle: () => void
}> = ({ analysis, isExpanded, onToggle }) => {
  const theme = lightTheme

  return (
    <div>
      <button
        data-testid="expand-insights"
        onClick={onToggle}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        style={{
          background: 'none',
          border: 'none',
          fontWeight: 500,
          cursor: 'pointer',
          padding: `${theme.spacing.sm} 0`,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm
        }}
      >
        Key Insights & Recommendations {isExpanded ? '▼' : '▶'}
      </button>
      
      {isExpanded && (
        <div data-testid="detailed-insights" style={{
          marginTop: theme.spacing.md,
          paddingTop: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.border}`
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: theme.spacing.xl
          }}>
            <div>
              <h4 style={{ margin: `0 0 ${theme.spacing.sm} 0`, fontWeight: 600 }}>
                Key Insights
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {analysis.keyInsights.map((insight, index) => (
                  <li key={index} style={{ marginBottom: theme.spacing.sm, lineHeight: 1.5 }}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ margin: `0 0 ${theme.spacing.sm} 0`, fontWeight: 600 }}>
                Improvement Areas
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {analysis.improvementAreas.map((area, index) => (
                  <li key={index} style={{ marginBottom: theme.spacing.sm, lineHeight: 1.5 }}>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MeetingAnalysisRefactored: React.FC<MeetingAnalysisProps> = ({
  meeting: initialMeeting,
  enableRealtime = false,
  onMeetingUpdate,
  onGenerateModule,
  onShare
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const theme = lightTheme

  const {
    meeting,
    progressData,
    handleWebSocketMessage
  } = useMeetingState(initialMeeting, onMeetingUpdate)

  // WebSocket connection for real-time updates
  const { connectionError } = useWebSocket({
    url: `ws://localhost:3001/ws/meeting/${meeting.id}`,
    enabled: enableRealtime && (meeting.status === 'processing' || meeting.status === 'uploading'),
    onMessage: handleWebSocketMessage,
    onError: () => console.error('WebSocket connection error')
  })

  const handleExpandToggle = () => setIsExpanded(!isExpanded)
  
  const handleGenerateModule = () => {
    if (meeting.analysis) {
      onGenerateModule?.(meeting.id, meeting.analysis.improvementAreas)
    }
  }

  const handleShare = () => onShare?.(meeting.id)

  return (
    <div 
      data-testid="meeting-analysis" 
      style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.md,
        marginBottom: theme.spacing.md
      }}
      aria-label="Meeting analysis results"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.lg
      }}>
        <div>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            margin: `0 0 ${theme.spacing.sm} 0`
          }}>
            {meeting.title}
          </h3>
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary
          }}>
            <span>{formatDuration(meeting.duration)}</span>
            <span 
              style={{
                backgroundColor: getStatusColor(meeting.status, theme),
                color: 'white',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.xs,
                textTransform: 'capitalize'
              }}
            >
              {meeting.status}
            </span>
          </div>
        </div>
        
        {meeting.analysis && (
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            <button 
              onClick={handleGenerateModule}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                background: theme.colors.surface,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm
              }}
            >
              Generate Practice Module
            </button>
            <button 
              data-testid="share-analysis"
              onClick={handleShare}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                background: theme.colors.surface,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm
              }}
            >
              Share
            </button>
          </div>
        )}
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div data-testid="connection-error" style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          color: '#92400e',
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing.md,
          textAlign: 'center'
        }}>
          Connection issues detected. Retrying...
        </div>
      )}

      {/* Content */}
      {meeting.status !== 'completed' ? (
        <ProcessingIndicator 
          status={meeting.status} 
          progressData={progressData}
          error={meeting.error}
        />
      ) : meeting.analysis ? (
        <div>
          <AnalysisCharts analysis={meeting.analysis} />
          <InsightsSection 
            analysis={meeting.analysis}
            isExpanded={isExpanded}
            onToggle={handleExpandToggle}
          />
        </div>
      ) : null}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        button:hover {
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .insights-grid {
            grid-template-columns: 1fr !important;
            gap: ${theme.spacing.md} !important;
          }
        }
      `}</style>
    </div>
  )
}