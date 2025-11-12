/**
 * Mobile Voice Control for ShipSpeak
 * Voice control integration for mobile accessibility
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useEffect, useCallback, useState, useRef } from 'react'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface VoiceCommand {
  pattern: string[]
  action: string
  description: string
  pmContext?: string
  confidence: number
}

interface MobileVoiceControlProps {
  onVoiceCommand?: (command: VoiceCommand, transcript: string) => void
  enableVoiceControl?: boolean
  pmIndustry?: 'healthcare' | 'fintech' | 'cybersecurity' | 'enterprise' | 'consumer'
  meetingType?: 'board' | 'planning' | 'stakeholder'
}

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

interface VoiceSettings {
  language: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  grammars?: string[]
}

// =============================================================================
// VOICE COMMANDS CONFIGURATION
// =============================================================================

const pmVoiceCommands: VoiceCommand[] = [
  // Navigation Commands
  { pattern: ['go to dashboard', 'open dashboard', 'show dashboard'], action: 'navigate_dashboard', description: 'Navigate to PM dashboard', confidence: 0.8 },
  { pattern: ['start recording', 'begin recording', 'record session'], action: 'start_recording', description: 'Start practice recording', confidence: 0.9 },
  { pattern: ['stop recording', 'end recording', 'finish recording'], action: 'stop_recording', description: 'Stop practice recording', confidence: 0.9 },
  { pattern: ['play feedback', 'show analysis', 'view results'], action: 'show_feedback', description: 'Play feedback or show analysis', confidence: 0.8 },
  
  // PM-Specific Commands
  { pattern: ['practice rice framework', 'use rice method'], action: 'practice_rice', description: 'Practice RICE prioritization framework', pmContext: 'framework', confidence: 0.85 },
  { pattern: ['practice ice scoring', 'use ice framework'], action: 'practice_ice', description: 'Practice ICE scoring method', pmContext: 'framework', confidence: 0.85 },
  { pattern: ['jobs to be done', 'practice jobs framework'], action: 'practice_jtbd', description: 'Practice Jobs-to-be-Done framework', pmContext: 'framework', confidence: 0.8 },
  
  // Communication Commands
  { pattern: ['executive summary', 'answer first approach'], action: 'practice_executive', description: 'Practice executive communication', pmContext: 'communication', confidence: 0.85 },
  { pattern: ['stakeholder update', 'team update'], action: 'practice_stakeholder', description: 'Practice stakeholder communication', pmContext: 'communication', confidence: 0.8 },
  { pattern: ['board presentation', 'board prep'], action: 'practice_board', description: 'Practice board presentation', pmContext: 'presentation', confidence: 0.85 },
  
  // Industry-Specific Commands
  { pattern: ['regulatory compliance', 'compliance check'], action: 'practice_compliance', description: 'Practice compliance communication', pmContext: 'healthcare,fintech', confidence: 0.8 },
  { pattern: ['risk assessment', 'security review'], action: 'practice_risk', description: 'Practice risk communication', pmContext: 'cybersecurity,fintech', confidence: 0.8 },
  { pattern: ['user experience', 'customer feedback'], action: 'practice_ux', description: 'Practice UX communication', pmContext: 'consumer,enterprise', confidence: 0.8 },
  
  // System Commands
  { pattern: ['help', 'voice commands', 'what can I say'], action: 'show_help', description: 'Show available voice commands', confidence: 0.9 },
  { pattern: ['settings', 'preferences', 'configure voice'], action: 'open_settings', description: 'Open voice control settings', confidence: 0.8 }
]

// =============================================================================
// MOBILE VOICE CONTROL COMPONENT
// =============================================================================

export const MobileVoiceControl: React.FC<MobileVoiceControlProps> = ({
  onVoiceCommand,
  enableVoiceControl = true,
  pmIndustry = 'enterprise',
  meetingType = 'planning'
}) => {
  const [isListening, setIsListening] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null)
  const [showCommands, setShowCommands] = useState(false)
  
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // =============================================================================
  // SPEECH RECOGNITION SETUP
  // =============================================================================

  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported')
      setIsAvailable(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      setIsListening(true)
      console.log('Voice recognition started')
    }

    recognition.onend = () => {
      setIsListening(false)
      console.log('Voice recognition ended')
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      let currentTranscript = ''
      let currentConfidence = 0

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        currentTranscript += result[0].transcript
        currentConfidence = Math.max(currentConfidence, result[0].confidence)
      }

      setTranscript(currentTranscript)
      setConfidence(currentConfidence)

      if (event.results[event.results.length - 1].isFinal) {
        processVoiceCommand(currentTranscript, currentConfidence)
      }
    }

    recognitionRef.current = recognition
    setIsAvailable(true)
  }, [])

  // =============================================================================
  // COMMAND PROCESSING
  // =============================================================================

  const processVoiceCommand = useCallback((text: string, confidence: number) => {
    const lowercaseText = text.toLowerCase().trim()
    
    // Filter commands by industry context
    const contextualCommands = pmVoiceCommands.filter(cmd => {
      if (!cmd.pmContext) return true
      return cmd.pmContext.includes(pmIndustry)
    })

    // Find matching command
    for (const command of contextualCommands) {
      for (const pattern of command.pattern) {
        if (lowercaseText.includes(pattern.toLowerCase())) {
          if (confidence >= command.confidence) {
            setLastCommand(command)
            executeVoiceCommand(command, text)
            onVoiceCommand?.(command, text)
            return
          }
        }
      }
    }

    // If no command found, provide feedback
    announceResult(`Command not recognized. Say "help" for available commands.`)
  }, [pmIndustry, onVoiceCommand])

  const executeVoiceCommand = useCallback((command: VoiceCommand, transcript: string) => {
    announceResult(`Executing: ${command.description}`)
    
    switch (command.action) {
      case 'navigate_dashboard':
        window.location.href = '/dashboard'
        break
      case 'start_recording':
        const recordBtn = document.querySelector('[data-testid="record-button"]') as HTMLElement
        recordBtn?.click()
        break
      case 'stop_recording':
        const stopBtn = document.querySelector('[data-testid="stop-button"]') as HTMLElement
        stopBtn?.click()
        break
      case 'show_feedback':
        window.location.href = '/dashboard/feedback'
        break
      case 'practice_rice':
        window.location.href = '/dashboard/practice?framework=rice'
        break
      case 'practice_ice':
        window.location.href = '/dashboard/practice?framework=ice'
        break
      case 'practice_jtbd':
        window.location.href = '/dashboard/practice?framework=jtbd'
        break
      case 'show_help':
        setShowCommands(true)
        break
      case 'open_settings':
        window.location.href = '/dashboard/settings'
        break
    }
  }, [])

  // =============================================================================
  // VOICE FEEDBACK
  // =============================================================================

  const announceResult = useCallback((message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  // =============================================================================
  // VOICE CONTROL ACTIONS
  // =============================================================================

  const startListening = useCallback(() => {
    if (recognitionRef.current && isAvailable && enableVoiceControl) {
      try {
        recognitionRef.current.start()
        announceResult('Voice control activated')
      } catch (error) {
        console.error('Error starting voice recognition:', error)
      }
    }
  }, [isAvailable, enableVoiceControl])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      announceResult('Voice control deactivated')
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    initializeSpeechRecognition()
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [initializeSpeechRecognition])

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderVoiceCommands = () => {
    if (!showCommands) return null

    const contextualCommands = pmVoiceCommands.filter(cmd => {
      if (!cmd.pmContext) return true
      return cmd.pmContext.includes(pmIndustry)
    })

    return (
      <div className="voice-commands-overlay" role="dialog" aria-label="Voice commands help">
        <div className="commands-content">
          <div className="commands-header">
            <h2>Voice Commands for {pmIndustry.charAt(0).toUpperCase() + pmIndustry.slice(1)} PM</h2>
            <button onClick={() => setShowCommands(false)} aria-label="Close voice commands">✕</button>
          </div>
          
          <div className="commands-list">
            {contextualCommands.map((command, index) => (
              <div key={index} className="command-item">
                <div className="command-patterns">
                  {command.pattern.map((pattern, pIndex) => (
                    <span key={pIndex} className="command-pattern">"{pattern}"</span>
                  ))}
                </div>
                <div className="command-description">{command.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  if (!isAvailable || !enableVoiceControl) {
    return null
  }

  return (
    <div className="mobile-voice-control" data-testid="mobile-voice-control">
      <button
        className={`voice-control-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
        data-testid="voice-control-toggle"
      >
        <div className="mic-icon">🎤</div>
        <div className="listening-indicator" />
      </button>

      {transcript && (
        <div className="voice-transcript" role="status" aria-live="polite">
          <div className="transcript-text">{transcript}</div>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidence * 100}%` }} />
          </div>
        </div>
      )}

      {lastCommand && (
        <div className="last-command" role="status" aria-live="assertive">
          Command executed: {lastCommand.description}
        </div>
      )}

      {renderVoiceCommands()}

      <style jsx>{`
        .mobile-voice-control {
          position: fixed;
          bottom: 80px;
          right: 16px;
          z-index: 1000;
        }

        .voice-control-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #3b82f6;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .voice-control-button:hover {
          background: #2563eb;
          transform: scale(1.05);
        }

        .voice-control-button.listening {
          background: #ef4444;
          animation: pulse 1.5s infinite;
        }

        .mic-icon {
          font-size: 24px;
          color: white;
        }

        .listening-indicator {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.6);
          animation: ripple 1s infinite;
          display: none;
        }

        .voice-control-button.listening .listening-indicator {
          display: block;
        }

        .voice-transcript {
          position: absolute;
          bottom: 70px;
          right: 0;
          background: white;
          border-radius: 8px;
          padding: 12px;
          min-width: 200px;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }

        .transcript-text {
          font-size: 14px;
          color: #374151;
          margin-bottom: 8px;
        }

        .confidence-bar {
          width: 100%;
          height: 4px;
          background: #f3f4f6;
          border-radius: 2px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.3s ease;
        }

        .last-command {
          position: absolute;
          bottom: 140px;
          right: 0;
          background: #10b981;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          animation: slideIn 0.3s ease;
        }

        .voice-commands-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .commands-content {
          background: white;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .commands-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .commands-header h2 {
          margin: 0;
          color: #1e293b;
          font-weight: 600;
        }

        .commands-header button {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
        }

        .commands-list {
          padding: 1.5rem;
        }

        .command-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .command-patterns {
          margin-bottom: 0.5rem;
        }

        .command-pattern {
          display: inline-block;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875rem;
          margin-right: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .command-description {
          color: #6b7280;
          font-size: 0.875rem;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .voice-control-button {
            width: 48px;
            height: 48px;
            bottom: 70px;
            right: 12px;
          }

          .voice-transcript {
            max-width: 250px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}