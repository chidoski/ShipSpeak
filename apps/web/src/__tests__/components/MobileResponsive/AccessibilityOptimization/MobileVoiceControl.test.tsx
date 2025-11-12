/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileVoiceControl } from '../../../../components/MobileResponsive/AccessibilityOptimization/MobileVoiceControl'

// Mock SpeechRecognition and SpeechSynthesis
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  onstart: null,
  onend: null,
  onerror: null,
  onresult: null,
  continuous: true,
  interimResults: true,
  lang: 'en-US',
  maxAlternatives: 3
}

const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn().mockReturnValue([])
}

// Mock window.location
const mockLocation = {
  href: '',
  pathname: '/dashboard'
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

Object.defineProperty(window, 'SpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true
})

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true
})

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true
})

describe('MobileVoiceControl', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Reset location
    mockLocation.href = ''
    mockLocation.pathname = '/dashboard'
    
    // Reset speech recognition state
    mockSpeechRecognition.start.mockClear()
    mockSpeechRecognition.stop.mockClear()
    mockSpeechSynthesis.speak.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders voice control button when speech recognition is available', () => {
      render(<MobileVoiceControl />)
      
      expect(screen.getByTestId('mobile-voice-control')).toBeInTheDocument()
      expect(screen.getByTestId('voice-control-toggle')).toBeInTheDocument()
      expect(screen.getByLabelText('Start voice control')).toBeInTheDocument()
    })

    it('does not render when voice control is disabled', () => {
      render(<MobileVoiceControl enableVoiceControl={false} />)
      
      expect(screen.queryByTestId('mobile-voice-control')).not.toBeInTheDocument()
    })

    it('renders with correct PM industry context', () => {
      render(<MobileVoiceControl pmIndustry="fintech" />)
      
      const container = screen.getByTestId('mobile-voice-control')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Voice Recognition Controls', () => {
    it('starts listening when voice control button is clicked', async () => {
      render(<MobileVoiceControl />)
      
      const voiceButton = screen.getByTestId('voice-control-toggle')
      fireEvent.click(voiceButton)
      
      await waitFor(() => {
        expect(mockSpeechRecognition.start).toHaveBeenCalled()
      })
    })

    it('stops listening when button is clicked while listening', async () => {
      render(<MobileVoiceControl />)
      
      const voiceButton = screen.getByTestId('voice-control-toggle')
      
      // Start listening
      fireEvent.click(voiceButton)
      
      // Simulate recognition starting
      mockSpeechRecognition.onstart?.()
      
      await waitFor(() => {
        expect(screen.getByLabelText('Stop voice control')).toBeInTheDocument()
      })
      
      // Stop listening
      fireEvent.click(voiceButton)
      
      await waitFor(() => {
        expect(mockSpeechRecognition.stop).toHaveBeenCalled()
      })
    })

    it('handles speech recognition errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      render(<MobileVoiceControl />)
      
      // Simulate speech recognition error
      mockSpeechRecognition.onerror?.({ error: 'network' })
      
      expect(consoleSpy).toHaveBeenCalledWith('Speech recognition error:', 'network')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Voice Command Processing', () => {
    it('processes navigation commands correctly', async () => {
      const mockCallback = jest.fn()
      
      render(<MobileVoiceControl onVoiceCommand={mockCallback} />)
      
      // Simulate voice input
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'go to dashboard', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'navigate_dashboard',
            description: 'Navigate to PM dashboard'
          }),
          'go to dashboard'
        )
      })
      
      expect(mockLocation.href).toBe('/dashboard')
    })

    it('processes PM framework commands', async () => {
      const mockCallback = jest.fn()
      
      render(<MobileVoiceControl onVoiceCommand={mockCallback} pmIndustry="enterprise" />)
      
      // Simulate RICE framework command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'practice rice framework', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'practice_rice',
            description: 'Practice RICE prioritization framework'
          }),
          'practice rice framework'
        )
      })
      
      expect(mockLocation.href).toBe('/dashboard/practice?framework=rice')
    })

    it('processes recording commands', async () => {
      // Mock recording button
      const mockRecordButton = document.createElement('button')
      mockRecordButton.setAttribute('data-testid', 'record-button')
      mockRecordButton.click = jest.fn()
      document.body.appendChild(mockRecordButton)
      
      document.querySelector = jest.fn().mockReturnValue(mockRecordButton)
      
      render(<MobileVoiceControl />)
      
      // Simulate start recording command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'start recording', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(mockRecordButton.click).toHaveBeenCalled()
      })
      
      // Clean up
      document.body.removeChild(mockRecordButton)
    })

    it('filters commands by industry context', async () => {
      const mockCallback = jest.fn()
      
      render(<MobileVoiceControl onVoiceCommand={mockCallback} pmIndustry="healthcare" />)
      
      // Simulate healthcare-specific command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'regulatory compliance', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'practice_compliance',
            pmContext: 'healthcare,fintech'
          }),
          'regulatory compliance'
        )
      })
    })

    it('handles unrecognized commands gracefully', async () => {
      render(<MobileVoiceControl />)
      
      // Simulate unrecognized command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'unknown command xyz', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(mockSpeechSynthesis.speak).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'Command not recognized. Say "help" for available commands.'
          })
        )
      })
    })

    it('requires minimum confidence threshold', async () => {
      const mockCallback = jest.fn()
      
      render(<MobileVoiceControl onVoiceCommand={mockCallback} />)
      
      // Simulate low confidence command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'go to dashboard', confidence: 0.5 }, // Below threshold
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(mockCallback).not.toHaveBeenCalled()
        expect(mockLocation.href).toBe('') // Should not navigate
      })
    })
  })

  describe('Voice Commands Help', () => {
    it('shows voice commands help when help command is recognized', async () => {
      render(<MobileVoiceControl pmIndustry="fintech" />)
      
      // Simulate help command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'help', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(screen.getByText('Voice Commands for Fintech PM')).toBeInTheDocument()
        expect(screen.getByText('Navigate to PM dashboard')).toBeInTheDocument()
      })
    })

    it('filters commands by industry in help display', async () => {
      render(<MobileVoiceControl pmIndustry="cybersecurity" />)
      
      // Simulate help command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'help', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(screen.getByText('Voice Commands for Cybersecurity PM')).toBeInTheDocument()
        expect(screen.getByText('Practice risk communication')).toBeInTheDocument()
      })
    })

    it('closes help overlay with close button', async () => {
      render(<MobileVoiceControl />)
      
      // Show help first
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'help', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(screen.getByLabelText('Close voice commands')).toBeInTheDocument()
      })
      
      // Close help
      const closeButton = screen.getByLabelText('Close voice commands')
      fireEvent.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Voice Commands for Enterprise PM')).not.toBeInTheDocument()
      })
    })
  })

  describe('Speech Synthesis Feedback', () => {
    it('provides audio feedback for recognized commands', async () => {
      render(<MobileVoiceControl />)
      
      // Simulate successful command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'go to dashboard', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(mockSpeechSynthesis.speak).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'Executing: Navigate to PM dashboard'
          })
        )
      })
    })

    it('configures speech synthesis properties correctly', async () => {
      render(<MobileVoiceControl />)
      
      // Trigger speech synthesis
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'start recording', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        const utteranceCall = mockSpeechSynthesis.speak.mock.calls[0]
        const utterance = utteranceCall[0]
        expect(utterance.rate).toBe(0.9)
        expect(utterance.pitch).toBe(1)
        expect(utterance.volume).toBe(0.8)
      })
    })
  })

  describe('Transcript Display', () => {
    it('displays live transcript during recognition', async () => {
      render(<MobileVoiceControl />)
      
      // Simulate interim result
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'go to dash', confidence: 0.7 },
          isFinal: false,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(screen.getByText('go to dash')).toBeInTheDocument()
      })
    })

    it('shows confidence indicator in transcript', async () => {
      render(<MobileVoiceControl />)
      
      // Simulate result with confidence
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'test command', confidence: 0.8 },
          isFinal: false,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        const confidenceFill = screen.getByText('test command').parentNode?.querySelector('.confidence-fill')
        expect(confidenceFill).toHaveStyle('width: 80%')
      })
    })

    it('displays last executed command', async () => {
      render(<MobileVoiceControl />)
      
      // Execute a command
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'go to dashboard', confidence: 0.9 },
          isFinal: true,
          length: 1
        }]
      }
      
      mockSpeechRecognition.onresult?.(mockEvent)
      
      await waitFor(() => {
        expect(screen.getByText('Command executed: Navigate to PM dashboard')).toBeInTheDocument()
      })
    })
  })

  describe('Integration with PM Context', () => {
    it('adapts to different meeting types', () => {
      render(<MobileVoiceControl meetingType="board" pmIndustry="fintech" />)
      
      expect(screen.getByTestId('mobile-voice-control')).toBeInTheDocument()
    })

    it('supports all PM industry contexts', () => {
      const industries = ['healthcare', 'fintech', 'cybersecurity', 'enterprise', 'consumer'] as const
      
      industries.forEach(industry => {
        const { unmount } = render(<MobileVoiceControl pmIndustry={industry} />)
        expect(screen.getByTestId('mobile-voice-control')).toBeInTheDocument()
        unmount()
      })
    })
  })
})