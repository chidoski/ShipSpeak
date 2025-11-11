/**
 * Mobile Practice Interface for ShipSpeak
 * Mobile practice recording and feedback interface optimized for PM development
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { TouchButton } from '../TouchOptimizedComponents/TouchFriendlyControls'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface MobilePracticeInterfaceProps {
  onRecordingStart?: () => void
  onRecordingStop?: () => void
  onRecordingPause?: () => void
  recordingState?: 'IDLE' | 'RECORDING' | 'PAUSED' | 'PROCESSING'
  exerciseType?: 'SCENARIO' | 'FRAMEWORK' | 'STAKEHOLDER' | 'COMMUNICATION'
  careerContext?: {
    currentRole: string
    targetRole: string
    industry: string
  }
  realTimeCoaching?: boolean
  practiceMode?: 'GUIDED' | 'FREEFORM' | 'TIMED'
  duration?: number
  maxDuration?: number
}

interface RecordingQuality {
  level: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  noiseLevel: number
  clarity: number
  volume: number
}

interface CoachingHint {
  id: string
  type: 'STRUCTURE' | 'PACE' | 'CLARITY' | 'FRAMEWORK' | 'CONFIDENCE'
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  timestamp: number
}

// =============================================================================
// MOBILE PRACTICE INTERFACE COMPONENT
// =============================================================================

export const MobilePracticeInterface: React.FC<MobilePracticeInterfaceProps> = ({
  onRecordingStart,
  onRecordingStop,
  onRecordingPause,
  recordingState = 'IDLE',
  exerciseType = 'SCENARIO',
  careerContext = {
    currentRole: 'PM',
    targetRole: 'Senior PM',
    industry: 'Fintech'
  },
  realTimeCoaching = true,
  practiceMode = 'GUIDED',
  duration = 0,
  maxDuration = 300
}) => {
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT')
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordingQuality, setRecordingQuality] = useState<RecordingQuality>({
    level: 'GOOD',
    noiseLevel: 0.1,
    clarity: 0.8,
    volume: 0.7
  })
  const [coachingHints, setCoachingHints] = useState<CoachingHint[]>([])
  const [isCoachingVisible, setIsCoachingVisible] = useState(true)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'LANDSCAPE' : 'PORTRAIT')
    }

    handleOrientationChange()
    window.addEventListener('resize', handleOrientationChange)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Audio visualization effect
  useEffect(() => {
    if (recordingState === 'RECORDING' && canvasRef.current) {
      drawAudioVisualization()
    }
  }, [recordingState, audioLevel])

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleRecordingToggle = () => {
    if (recordingState === 'IDLE' || recordingState === 'PAUSED') {
      onRecordingStart?.()
    } else if (recordingState === 'RECORDING') {
      onRecordingStop?.()
    }
  }

  const handleRecordingPause = () => {
    if (recordingState === 'RECORDING') {
      onRecordingPause?.()
    } else if (recordingState === 'PAUSED') {
      onRecordingStart?.()
    }
  }

  const dismissCoachingHint = (hintId: string) => {
    setCoachingHints(prev => prev.filter(hint => hint.id !== hintId))
  }

  const toggleCoachingVisibility = () => {
    setIsCoachingVisible(!isCoachingVisible)
  }

  // =============================================================================
  // AUDIO VISUALIZATION
  // =============================================================================

  const drawAudioVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Simulate audio waveform based on audio level
    const barWidth = 4
    const barSpacing = 2
    const barCount = Math.floor(width / (barWidth + barSpacing))
    const centerY = height / 2

    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * audioLevel * height * 0.8
      const x = i * (barWidth + barSpacing)
      const y = centerY - barHeight / 2

      ctx.fillStyle = recordingState === 'RECORDING' ? '#3b82f6' : '#94a3b8'
      ctx.fillRect(x, y, barWidth, barHeight)
    }

    if (recordingState === 'RECORDING') {
      animationRef.current = requestAnimationFrame(drawAudioVisualization)
    }
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRecordingButtonText = (): string => {
    switch (recordingState) {
      case 'RECORDING':
        return 'Stop Recording'
      case 'PAUSED':
        return 'Resume Recording'
      case 'PROCESSING':
        return 'Processing...'
      default:
        return 'Start Practice'
    }
  }

  const getRecordingButtonVariant = (): 'PRIMARY' | 'DANGER' | 'SUCCESS' => {
    switch (recordingState) {
      case 'RECORDING':
        return 'DANGER'
      case 'PAUSED':
        return 'SUCCESS'
      default:
        return 'PRIMARY'
    }
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderQualityIndicator = () => {
    const qualityColor = {
      EXCELLENT: '#10b981',
      GOOD: '#3b82f6',
      FAIR: '#f59e0b',
      POOR: '#ef4444'
    }

    return (
      <div className="quality-indicator">
        <div className="quality-label">Audio Quality</div>
        <div className="quality-bars">
          {[1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`quality-bar ${level <= (['POOR', 'FAIR', 'GOOD', 'EXCELLENT'].indexOf(recordingQuality.level) + 1) ? 'active' : ''}`}
              style={{ background: level <= (['POOR', 'FAIR', 'GOOD', 'EXCELLENT'].indexOf(recordingQuality.level) + 1) ? qualityColor[recordingQuality.level] : '#e5e7eb' }}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderCoachingHints = () => {
    if (!realTimeCoaching || !isCoachingVisible || coachingHints.length === 0) {
      return null
    }

    return (
      <div className="coaching-overlay">
        <div className="coaching-header">
          <span>Real-time Coaching</span>
          <TouchButton
            size="SMALL"
            variant="SECONDARY"
            onClick={toggleCoachingVisibility}
            minimumSize={32}
            feedbackType={{ type: 'HAPTIC', intensity: 'LIGHT' }}
            aria-label="Hide coaching hints"
          >
            ✕
          </TouchButton>
        </div>
        
        <div className="coaching-hints">
          {coachingHints.slice(-3).map(hint => (
            <div key={hint.id} className={`coaching-hint ${hint.severity.toLowerCase()}`}>
              <div className="hint-content">
                <span className="hint-type">{hint.type}</span>
                <p className="hint-message">{hint.message}</p>
              </div>
              <button
                className="hint-dismiss"
                onClick={() => dismissCoachingHint(hint.id)}
                aria-label="Dismiss hint"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderExerciseContext = () => (
    <div className="exercise-context">
      <div className="context-header">
        <h3>{exerciseType} Practice</h3>
        <span className="career-badge">{careerContext.currentRole} → {careerContext.targetRole}</span>
      </div>
      <div className="context-details">
        <span className="industry-tag">{careerContext.industry}</span>
        <span className="mode-tag">{practiceMode}</span>
      </div>
    </div>
  )

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      className={`mobile-practice-interface ${orientation.toLowerCase()}`}
      data-testid="mobile-practice-interface"
      data-recording-state={recordingState}
    >
      {/* Exercise Context */}
      {renderExerciseContext()}

      {/* Audio Visualization */}
      <div className="audio-visualization-container">
        <canvas
          ref={canvasRef}
          width={280}
          height={80}
          className="audio-visualization"
        />
        {renderQualityIndicator()}
      </div>

      {/* Recording Timer */}
      <div className="recording-timer">
        <span className="timer-display">{formatDuration(duration)}</span>
        <span className="timer-max">/ {formatDuration(maxDuration)}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(duration / maxDuration) * 100}%` }}
          />
        </div>
      </div>

      {/* Recording Controls */}
      <div className="recording-controls">
        <TouchButton
          size="EXTRA_LARGE"
          variant={getRecordingButtonVariant()}
          onClick={handleRecordingToggle}
          disabled={recordingState === 'PROCESSING'}
          loading={recordingState === 'PROCESSING'}
          minimumSize={72}
          feedbackType={{ type: 'HAPTIC', intensity: 'HEAVY' }}
          aria-label={getRecordingButtonText()}
          className="main-record-button"
        >
          {recordingState === 'RECORDING' ? '⏹️' : recordingState === 'PAUSED' ? '▶️' : '🎙️'}
          <span className="button-label">{getRecordingButtonText()}</span>
        </TouchButton>

        {recordingState === 'RECORDING' && (
          <TouchButton
            size="LARGE"
            variant="SECONDARY"
            onClick={handleRecordingPause}
            minimumSize={56}
            feedbackType={{ type: 'HAPTIC', intensity: 'MEDIUM' }}
            aria-label="Pause recording"
            className="pause-button"
          >
            ⏸️
          </TouchButton>
        )}
      </div>

      {/* Real-time Coaching */}
      {renderCoachingHints()}

      {/* Coaching Toggle */}
      {realTimeCoaching && !isCoachingVisible && (
        <TouchButton
          size="MEDIUM"
          variant="PRIMARY"
          onClick={toggleCoachingVisibility}
          minimumSize={48}
          feedbackType={{ type: 'HAPTIC', intensity: 'LIGHT' }}
          aria-label="Show coaching hints"
          className="coaching-toggle"
        >
          💡 Show Coaching
        </TouchButton>
      )}

      <style jsx>{`
        .mobile-practice-interface {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1rem;
          height: 100%;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .exercise-context {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .context-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .context-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .career-badge {
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .context-details {
          display: flex;
          gap: 0.5rem;
        }

        .industry-tag, .mode-tag {
          background: #f1f5f9;
          color: #64748b;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        .audio-visualization-container {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .audio-visualization {
          border-radius: 8px;
          background: #f8fafc;
          width: 100%;
          max-width: 280px;
        }

        .quality-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .quality-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
        }

        .quality-bars {
          display: flex;
          gap: 2px;
        }

        .quality-bar {
          width: 8px;
          height: 16px;
          border-radius: 2px;
          transition: background 0.2s ease;
        }

        .recording-timer {
          text-align: center;
        }

        .timer-display {
          font-size: 2rem;
          font-weight: bold;
          color: #1e293b;
        }

        .timer-max {
          font-size: 1rem;
          color: #64748b;
          margin-left: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          margin-top: 0.5rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.2s ease;
        }

        .recording-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin: 1rem 0;
        }

        .main-record-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .button-label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .coaching-overlay {
          position: fixed;
          bottom: 120px;
          left: 1rem;
          right: 1rem;
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 50;
          max-height: 200px;
          overflow-y: auto;
        }

        .coaching-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #1e293b;
        }

        .coaching-hints {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .coaching-hint {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .coaching-hint.low {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
        }

        .coaching-hint.medium {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
        }

        .coaching-hint.high {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
        }

        .hint-content {
          flex: 1;
        }

        .hint-type {
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #64748b;
        }

        .hint-message {
          margin: 0.25rem 0 0 0;
          color: #374151;
        }

        .hint-dismiss {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          margin-left: 0.5rem;
        }

        .coaching-toggle {
          position: fixed;
          bottom: 120px;
          right: 1rem;
          z-index: 50;
        }

        /* Landscape orientation adjustments */
        .mobile-practice-interface.landscape {
          flex-direction: row;
          align-items: stretch;
        }

        .mobile-practice-interface.landscape .audio-visualization-container {
          flex: 1;
        }

        .mobile-practice-interface.landscape .recording-controls {
          flex-direction: column;
          margin: 0;
        }

        @media (max-height: 600px) {
          .mobile-practice-interface {
            gap: 1rem;
            padding: 0.75rem;
          }
          
          .coaching-overlay {
            bottom: 100px;
          }
          
          .coaching-toggle {
            bottom: 100px;
          }
        }
      `}</style>
    </div>
  )
}