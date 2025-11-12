/**
 * Mobile Recording Controls for ShipSpeak
 * Optimized recording interface for mobile devices with PM-specific recording features
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { TouchButton } from './TouchFriendlyControls'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface RecordingState {
  status: 'IDLE' | 'RECORDING' | 'PAUSED' | 'PROCESSING' | 'COMPLETED'
  duration: number
  quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  volume: number
  noiseLevel: number
}

interface MobileRecordingControlsProps {
  recordingState: RecordingState
  onStartRecording?: () => void
  onStopRecording?: () => void
  onPauseRecording?: () => void
  onResumeRecording?: () => void
  onCancelRecording?: () => void
  maxDuration?: number
  exerciseType?: 'SCENARIO' | 'FRAMEWORK' | 'STAKEHOLDER' | 'COMMUNICATION'
  showAdvancedControls?: boolean
  enableBackgroundRecording?: boolean
}

interface AudioVisualization {
  levels: number[]
  frequency: number
}

// =============================================================================
// MOBILE RECORDING CONTROLS COMPONENT
// =============================================================================

export const MobileRecordingControls: React.FC<MobileRecordingControlsProps> = ({
  recordingState,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onCancelRecording,
  maxDuration = 600, // 10 minutes
  exerciseType = 'SCENARIO',
  showAdvancedControls = false,
  enableBackgroundRecording = true
}) => {
  const [isLandscape, setIsLandscape] = useState(false)
  const [showQualityDetails, setShowQualityDetails] = useState(false)
  const [audioVisualization, setAudioVisualization] = useState<AudioVisualization>({
    levels: new Array(20).fill(0),
    frequency: 0
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    
    handleOrientationChange()
    window.addEventListener('resize', handleOrientationChange)
    
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [])

  // Audio visualization effect
  useEffect(() => {
    if (recordingState.status === 'RECORDING') {
      startAudioVisualization()
    } else {
      stopAudioVisualization()
    }
    
    return () => stopAudioVisualization()
  }, [recordingState.status])

  // =============================================================================
  // AUDIO VISUALIZATION
  // =============================================================================

  const startAudioVisualization = useCallback(() => {
    const updateVisualization = () => {
      // Simulate audio levels based on volume and noise
      const baseLevels = Array.from({ length: 20 }, () => 
        Math.random() * recordingState.volume * 0.8 + 
        Math.random() * recordingState.noiseLevel * 0.2
      )
      
      setAudioVisualization({
        levels: baseLevels,
        frequency: Math.random() * 1000 + 500
      })
      
      drawVisualization(baseLevels)
      
      if (recordingState.status === 'RECORDING') {
        animationRef.current = requestAnimationFrame(updateVisualization)
      }
    }
    
    updateVisualization()
  }, [recordingState.volume, recordingState.noiseLevel, recordingState.status])

  const stopAudioVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
  }, [])

  const drawVisualization = useCallback((levels: number[]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barWidth = width / levels.length
    
    ctx.clearRect(0, 0, width, height)
    
    levels.forEach((level, index) => {
      const barHeight = level * height
      const x = index * barWidth
      const y = height - barHeight

      // Color based on recording quality
      const color = recordingState.quality === 'EXCELLENT' ? '#10b981' :
                   recordingState.quality === 'GOOD' ? '#3b82f6' :
                   recordingState.quality === 'FAIR' ? '#f59e0b' : '#ef4444'
      
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth - 2, barHeight)
    })
  }, [recordingState.quality])

  // =============================================================================
  // RECORDING HANDLERS
  // =============================================================================

  const handleStartRecording = useCallback(() => {
    onStartRecording?.()
    
    // Strong haptic feedback for start
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
  }, [onStartRecording])

  const handleStopRecording = useCallback(() => {
    onStopRecording?.()
    
    // Strong haptic feedback for stop
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }
  }, [onStopRecording])

  const handlePauseResume = useCallback(() => {
    if (recordingState.status === 'RECORDING') {
      onPauseRecording?.()
    } else if (recordingState.status === 'PAUSED') {
      onResumeRecording?.()
    }
    
    // Medium haptic feedback for pause/resume
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, [recordingState.status, onPauseRecording, onResumeRecording])

  const handleCancelRecording = useCallback(() => {
    onCancelRecording?.()
    
    // Gentle haptic feedback for cancel
    if (navigator.vibrate) {
      navigator.vibrate(25)
    }
  }, [onCancelRecording])

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = (): number => {
    return (recordingState.duration / maxDuration) * 100
  }

  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'EXCELLENT': return '#10b981'
      case 'GOOD': return '#3b82f6'
      case 'FAIR': return '#f59e0b'
      case 'POOR': return '#ef4444'
      default: return '#64748b'
    }
  }

  const getRecordingButtonText = (): string => {
    switch (recordingState.status) {
      case 'RECORDING': return 'Stop'
      case 'PAUSED': return 'Resume'
      case 'PROCESSING': return 'Processing...'
      case 'COMPLETED': return 'Completed'
      default: return 'Start Recording'
    }
  }

  const getRecordingButtonIcon = (): string => {
    switch (recordingState.status) {
      case 'RECORDING': return '⏹️'
      case 'PAUSED': return '▶️'
      case 'PROCESSING': return '⟳'
      case 'COMPLETED': return '✅'
      default: return '🎙️'
    }
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderRecordingTimer = () => (
    <div className="recording-timer">
      <div className="timer-display">
        <span className="current-time">{formatDuration(recordingState.duration)}</span>
        <span className="max-time">/ {formatDuration(maxDuration)}</span>
      </div>
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>
    </div>
  )

  const renderQualityIndicator = () => (
    <div 
      className="quality-indicator"
      onClick={() => setShowQualityDetails(!showQualityDetails)}
    >
      <div className="quality-header">
        <span className="quality-label">Recording Quality</span>
        <span 
          className="quality-status"
          style={{ color: getQualityColor(recordingState.quality) }}
        >
          {recordingState.quality}
        </span>
      </div>
      
      {showQualityDetails && (
        <div className="quality-details">
          <div className="quality-metric">
            <span>Volume:</span>
            <div className="metric-bar">
              <div 
                className="metric-fill volume"
                style={{ width: `${recordingState.volume * 100}%` }}
              />
            </div>
          </div>
          <div className="quality-metric">
            <span>Noise Level:</span>
            <div className="metric-bar">
              <div 
                className="metric-fill noise"
                style={{ width: `${recordingState.noiseLevel * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderExerciseContext = () => (
    <div className="exercise-context">
      <span className="exercise-type">{exerciseType} Practice</span>
      <span className="exercise-tip">
        {exerciseType === 'SCENARIO' ? 'Respond naturally to the scenario' :
         exerciseType === 'FRAMEWORK' ? 'Structure your response clearly' :
         exerciseType === 'STAKEHOLDER' ? 'Address different stakeholder needs' :
         'Focus on clear communication'}
      </span>
    </div>
  )

  const renderMainControls = () => (
    <div className={`main-controls ${isLandscape ? 'landscape' : 'portrait'}`}>
      {/* Primary Recording Button */}
      <TouchButton
        size="EXTRA_LARGE"
        variant={recordingState.status === 'RECORDING' ? 'DANGER' : 'PRIMARY'}
        onClick={recordingState.status === 'IDLE' ? handleStartRecording : handleStopRecording}
        disabled={recordingState.status === 'PROCESSING'}
        loading={recordingState.status === 'PROCESSING'}
        minimumSize={80}
        feedbackType={{ type: 'HAPTIC', intensity: 'HEAVY' }}
        className="primary-record-button"
        aria-label={getRecordingButtonText()}
      >
        <div className="button-content">
          <span className="button-icon">{getRecordingButtonIcon()}</span>
          <span className="button-text">{getRecordingButtonText()}</span>
        </div>
      </TouchButton>

      {/* Secondary Controls */}
      {(recordingState.status === 'RECORDING' || recordingState.status === 'PAUSED') && (
        <div className="secondary-controls">
          <TouchButton
            size="LARGE"
            variant="SECONDARY"
            onClick={handlePauseResume}
            minimumSize={56}
            feedbackType={{ type: 'HAPTIC', intensity: 'MEDIUM' }}
            aria-label={recordingState.status === 'RECORDING' ? 'Pause recording' : 'Resume recording'}
          >
            {recordingState.status === 'RECORDING' ? '⏸️' : '▶️'}
          </TouchButton>
          
          <TouchButton
            size="LARGE"
            variant="DANGER"
            onClick={handleCancelRecording}
            minimumSize={56}
            feedbackType={{ type: 'HAPTIC', intensity: 'LIGHT' }}
            aria-label="Cancel recording"
          >
            ✕
          </TouchButton>
        </div>
      )}
    </div>
  )

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      className={`mobile-recording-controls ${recordingState.status.toLowerCase()} ${isLandscape ? 'landscape' : 'portrait'}`}
      data-testid="mobile-recording-controls"
      data-recording-status={recordingState.status}
    >
      {/* Exercise Context */}
      {renderExerciseContext()}

      {/* Audio Visualization */}
      <div className="audio-visualization-section">
        <canvas
          ref={canvasRef}
          width={280}
          height={80}
          className="audio-canvas"
        />
        {renderQualityIndicator()}
      </div>

      {/* Recording Timer */}
      {renderRecordingTimer()}

      {/* Main Controls */}
      {renderMainControls()}

      {/* Advanced Controls */}
      {showAdvancedControls && recordingState.status !== 'IDLE' && (
        <div className="advanced-controls">
          <div className="control-section">
            <span>Background Recording</span>
            <TouchButton
              size="SMALL"
              variant={enableBackgroundRecording ? 'SUCCESS' : 'SECONDARY'}
              onClick={() => {}}
              minimumSize={36}
              feedbackType={{ type: 'HAPTIC', intensity: 'LIGHT' }}
            >
              {enableBackgroundRecording ? 'ON' : 'OFF'}
            </TouchButton>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {recordingState.status === 'PROCESSING' && (
        <div className="status-message processing">
          <span>🔄 Analyzing your communication patterns...</span>
        </div>
      )}

      {recordingState.status === 'COMPLETED' && (
        <div className="status-message completed">
          <span>✅ Recording completed! Analysis will be ready shortly.</span>
        </div>
      )}

      <style jsx>{`
        .mobile-recording-controls {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100%;
          align-items: center;
        }

        .mobile-recording-controls.landscape {
          flex-direction: row;
          align-items: stretch;
        }

        .exercise-context {
          text-align: center;
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }

        .exercise-type {
          display: block;
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 0.5rem;
        }

        .exercise-tip {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.4;
        }

        .audio-visualization-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }

        .audio-canvas {
          border-radius: 8px;
          background: #f8fafc;
          width: 100%;
          max-width: 280px;
          height: 80px;
        }

        .quality-indicator {
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 8px;
          background: #f8fafc;
          width: 100%;
          transition: background 0.2s ease;
        }

        .quality-indicator:hover {
          background: #f1f5f9;
        }

        .quality-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quality-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
        }

        .quality-status {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .quality-details {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quality-metric {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
        }

        .quality-metric span {
          min-width: 80px;
          color: #64748b;
        }

        .metric-bar {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.2s ease;
        }

        .metric-fill.volume {
          background: #3b82f6;
        }

        .metric-fill.noise {
          background: #f59e0b;
        }

        .recording-timer {
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        .timer-display {
          margin-bottom: 1rem;
        }

        .current-time {
          font-size: 3rem;
          font-weight: bold;
          color: #1e293b;
          line-height: 1;
        }

        .max-time {
          font-size: 1rem;
          color: #64748b;
          margin-left: 0.5rem;
        }

        .progress-container {
          max-width: 300px;
          margin: 0 auto;
        }

        .progress-track {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
          transition: width 0.2s ease;
        }

        .main-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .main-controls.landscape {
          flex-direction: row;
          justify-content: center;
        }

        .primary-record-button {
          position: relative;
        }

        .button-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .button-icon {
          font-size: 2rem;
        }

        .button-text {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .secondary-controls {
          display: flex;
          gap: 1rem;
        }

        .advanced-controls {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          max-width: 400px;
          width: 100%;
        }

        .control-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .status-message {
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
          max-width: 400px;
          width: 100%;
        }

        .status-message.processing {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
        }

        .status-message.completed {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
        }

        /* Recording state styles */
        .mobile-recording-controls.recording {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        }

        .mobile-recording-controls.recording .current-time {
          color: #dc2626;
        }

        .mobile-recording-controls.paused {
          background: linear-gradient(135deg, #fefbef 0%, #fef3c7 100%);
        }

        .mobile-recording-controls.paused .current-time {
          color: #d97706;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .mobile-recording-controls {
            padding: 0.75rem;
            gap: 1rem;
          }
          
          .current-time {
            font-size: 2.5rem;
          }
          
          .audio-visualization-section {
            padding: 1rem;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .quality-indicator {
            border: 1px solid #000;
          }
          
          .progress-track {
            border: 1px solid #000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .progress-fill,
          .metric-fill {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}