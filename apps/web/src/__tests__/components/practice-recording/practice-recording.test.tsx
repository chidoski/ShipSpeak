import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { jest } from '@jest/globals'
import { RecordingOrchestrator } from '../../../components/practice-recording/RecordingOrchestrator'
import { DeviceSetup } from '../../../components/practice-recording/AudioCapture/DeviceSetup'
import { RecordingStudio } from '../../../components/practice-recording/RecordingInterface/RecordingStudio'
import { LiveTranscription } from '../../../components/practice-recording/RealTimeCoaching/LiveTranscription'
import { CareerTransitionOptimizer } from '../../../components/practice-recording/RecordingOptimization/CareerTransitionOptimizer'
import { QualityMonitoring } from '../../../components/practice-recording/AudioCapture/QualityMonitoring'
import { CoachingOverlay } from '../../../components/practice-recording/RecordingInterface/CoachingOverlay'
import { 
  mockExerciseContexts, 
  mockUserProfiles, 
  mockQualityThresholds,
  getRecommendedExercise 
} from '../../../lib/mockPracticeRecordingData'
import { ExerciseContext, UserProfile, AudioQuality, RecordingControlInterface } from '../../../types/practice-recording'

// Mock browser APIs
const mockMediaStream = {
  getTracks: jest.fn(() => [{
    stop: jest.fn(),
    kind: 'audio',
    label: 'Mock Audio Track'
  }]),
  getAudioTracks: jest.fn(() => [{
    stop: jest.fn(),
    kind: 'audio', 
    label: 'Mock Audio Track'
  }])
} as unknown as MediaStream

const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  state: 'inactive',
  ondataavailable: null,
  onstop: null
} as unknown as MediaRecorder

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn(() => Promise.resolve(mockMediaStream)),
    enumerateDevices: jest.fn(() => Promise.resolve([
      {
        deviceId: 'default',
        kind: 'audioinput',
        label: 'Default Microphone',
        groupId: 'group1'
      },
      {
        deviceId: 'device2',
        kind: 'audioinput', 
        label: 'External Microphone',
        groupId: 'group2'
      }
    ]))
  }
})

// Mock MediaRecorder
global.MediaRecorder = jest.fn(() => mockMediaRecorder) as any
global.MediaRecorder.isTypeSupported = jest.fn(() => true)

// Mock AudioContext
global.AudioContext = jest.fn(() => ({
  createAnalyser: jest.fn(() => ({
    fftSize: 256,
    frequencyBinCount: 128,
    connect: jest.fn(),
    getByteFrequencyData: jest.fn((data) => {
      // Mock audio data
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 128
      }
    })
  })),
  createMediaStreamSource: jest.fn(() => ({
    connect: jest.fn()
  }))
})) as any

describe('Practice Recording System', () => {
  const mockExercise = mockExerciseContexts[0]
  const mockUser = mockUserProfiles[0]
  const mockOnComplete = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('RecordingOrchestrator', () => {
    it('renders exercise context and setup phase initially', () => {
      render(
        <RecordingOrchestrator
          exerciseContext={mockExercise}
          userProfile={mockUser}
          onSessionComplete={mockOnComplete}
          onSessionCancel={mockOnCancel}
        />
      )

      expect(screen.getByText(mockExercise.title)).toBeInTheDocument()
      expect(screen.getByText(mockExercise.description)).toBeInTheDocument()
      expect(screen.getByText('Time Limit: 3m 0s')).toBeInTheDocument()
      expect(screen.getByText('Difficulty: MASTERY')).toBeInTheDocument()
    })

    it('shows success criteria', () => {
      render(
        <RecordingOrchestrator
          exerciseContext={mockExercise}
          userProfile={mockUser}
          onSessionComplete={mockOnComplete}
          onSessionCancel={mockOnCancel}
        />
      )

      mockExercise.successCriteria.forEach(criteria => {
        expect(screen.getByText(criteria)).toBeInTheDocument()
      })
    })

    it('handles session cancellation', () => {
      render(
        <RecordingOrchestrator
          exerciseContext={mockExercise}
          userProfile={mockUser}
          onSessionComplete={mockOnComplete}
          onSessionCancel={mockOnCancel}
        />
      )

      const cancelButton = screen.getByText('Cancel Session')
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('progresses through recording phases correctly', async () => {
      render(
        <RecordingOrchestrator
          exerciseContext={mockExercise}
          userProfile={mockUser}
          onSessionComplete={mockOnComplete}
          onSessionCancel={mockOnCancel}
        />
      )

      // Should start in setup phase
      expect(screen.getByText('Grant Microphone Access')).toBeInTheDocument()
    })
  })

  describe('DeviceSetup', () => {
    it('requests microphone permissions', async () => {
      const mockOnSetupComplete = jest.fn()
      
      render(
        <DeviceSetup
          onSetupComplete={mockOnSetupComplete}
          exerciseContext={mockExercise}
          userProfile={mockUser}
        />
      )

      const grantButton = screen.getByText('Grant Microphone Access')
      fireEvent.click(grantButton)

      await waitFor(() => {
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        })
      })
    })

    it('displays available audio devices after permission granted', async () => {
      const mockOnSetupComplete = jest.fn()
      
      render(
        <DeviceSetup
          onSetupComplete={mockOnSetupComplete}
          exerciseContext={mockExercise}
          userProfile={mockUser}
        />
      )

      const grantButton = screen.getByText('Grant Microphone Access')
      fireEvent.click(grantButton)

      await waitFor(() => {
        expect(screen.getByText('Default Microphone')).toBeInTheDocument()
        expect(screen.getByText('External Microphone')).toBeInTheDocument()
      })
    })

    it('allows device selection and quality testing', async () => {
      const mockOnSetupComplete = jest.fn()
      
      render(
        <DeviceSetup
          onSetupComplete={mockOnSetupComplete}
          exerciseContext={mockExercise}
          userProfile={mockUser}
        />
      )

      // Grant permissions
      fireEvent.click(screen.getByText('Grant Microphone Access'))

      await waitFor(() => {
        const testButton = screen.getByText('Test Audio Quality')
        expect(testButton).toBeInTheDocument()
      })

      // Test audio quality
      fireEvent.click(screen.getByText('Test Audio Quality'))

      await waitFor(() => {
        expect(screen.getByText('Testing Audio Quality')).toBeInTheDocument()
      })
    })

    it('shows career context reminder', () => {
      const mockOnSetupComplete = jest.fn()
      
      render(
        <DeviceSetup
          onSetupComplete={mockOnSetupComplete}
          exerciseContext={mockExercise}
          userProfile={mockUser}
        />
      )

      expect(screen.getByText('PO → PM')).toBeInTheDocument()
      expect(screen.getByText('fintech')).toBeInTheDocument()
      expect(screen.getByText('BOARD PRESENTATION')).toBeInTheDocument()
    })
  })

  describe('RecordingStudio', () => {
    const mockRecordingState: RecordingControlInterface = {
      isRecording: false,
      isPaused: false,
      duration: 0,
      startTime: new Date(),
      pausedTime: 0,
      maxDuration: 180000
    }

    const mockProps = {
      mediaStream: mockMediaStream,
      exerciseContext: mockExercise,
      userProfile: mockUser,
      recordingState: mockRecordingState,
      onStartRecording: jest.fn(),
      onPauseRecording: jest.fn(),
      onResumeRecording: jest.fn(),
      onStopRecording: jest.fn(),
      onRecordingData: jest.fn()
    }

    it('renders recording controls in ready state', () => {
      render(<RecordingStudio {...mockProps} />)

      expect(screen.getByText('Start Recording')).toBeInTheDocument()
      expect(screen.getByText('READY')).toBeInTheDocument()
      expect(screen.getByText('0:00')).toBeInTheDocument()
    })

    it('shows pause and stop buttons when recording', () => {
      const recordingProps = {
        ...mockProps,
        recordingState: { ...mockRecordingState, isRecording: true }
      }

      render(<RecordingStudio {...recordingProps} />)

      expect(screen.getByText('Pause')).toBeInTheDocument()
      expect(screen.getByText('Stop')).toBeInTheDocument()
      expect(screen.getByText('RECORDING')).toBeInTheDocument()
    })

    it('handles recording control interactions', () => {
      render(<RecordingStudio {...mockProps} />)

      const startButton = screen.getByText('Start Recording')
      fireEvent.click(startButton)

      expect(mockProps.onStartRecording).toHaveBeenCalledTimes(1)
    })

    it('displays framework reminders', () => {
      render(<RecordingStudio {...mockProps} />)

      mockExercise.frameworkPrompts.forEach(prompt => {
        expect(screen.getByText(prompt)).toBeInTheDocument()
      })
    })

    it('shows audio level visualization', () => {
      render(<RecordingStudio {...mockProps} />)

      expect(screen.getByText('Audio Level')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  describe('LiveTranscription', () => {
    it('renders transcription interface', () => {
      render(
        <LiveTranscription
          mediaStream={mockMediaStream}
          isActive={true}
          exerciseContext={mockExercise}
          userProfile={mockUser}
        />
      )

      expect(screen.getByText('Live Transcription')).toBeInTheDocument()
      expect(screen.getByText('Listening')).toBeInTheDocument()
    })

    it('shows transcription metrics', () => {
      render(
        <LiveTranscription
          mediaStream={mockMediaStream}
          isActive={true}
          exerciseContext={mockExercise}
          userProfile={mockUser}
        />
      )

      expect(screen.getByText('Speaking Rate')).toBeInTheDocument()
      expect(screen.getByText('Confidence')).toBeInTheDocument()
      expect(screen.getByText('Word Count')).toBeInTheDocument()
      expect(screen.getByText('Patterns')).toBeInTheDocument()
    })

    it('displays communication patterns when detected', async () => {
      render(
        <LiveTranscription
          mediaStream={mockMediaStream}
          isActive={true}
          exerciseContext={mockExercise}
          userProfile={mockUser}
        />
      )

      // Wait for mock patterns to be detected
      await waitFor(() => {
        expect(screen.getByText('Communication Patterns Detected')).toBeInTheDocument()
      }, { timeout: 6000 })
    })
  })

  describe('CareerTransitionOptimizer', () => {
    it('displays career transition information', () => {
      render(
        <CareerTransitionOptimizer
          userProfile={mockUser}
          exerciseContext={mockExercise}
          currentPhase="SETUP"
        />
      )

      expect(screen.getByText('Career Transition Optimization')).toBeInTheDocument()
      expect(screen.getByText('PO')).toBeInTheDocument()
      expect(screen.getByText('PM')).toBeInTheDocument()
    })

    it('shows transition-specific focus areas', () => {
      render(
        <CareerTransitionOptimizer
          userProfile={mockUser}
          exerciseContext={mockExercise}
          currentPhase="SETUP"
        />
      )

      expect(screen.getByText('Transition Focus Areas')).toBeInTheDocument()
      expect(screen.getByText('Strategic thinking development')).toBeInTheDocument()
    })

    it('provides communication goals', () => {
      render(
        <CareerTransitionOptimizer
          userProfile={mockUser}
          exerciseContext={mockExercise}
          currentPhase="RECORDING"
        />
      )

      expect(screen.getByText('Communication Goals for This Session')).toBeInTheDocument()
    })

    it('shows industry-specific guidance', () => {
      render(
        <CareerTransitionOptimizer
          userProfile={mockUser}
          exerciseContext={mockExercise}
          currentPhase="SETUP"
        />
      )

      expect(screen.getByText('Financial Services & Fintech Context')).toBeInTheDocument()
    })
  })

  describe('QualityMonitoring', () => {
    const mockQuality: AudioQuality = {
      clarity: 85,
      noiseLevel: 10,
      volume: 75,
      overall: 'GOOD',
      timestamp: new Date()
    }

    it('displays audio quality metrics', () => {
      render(
        <QualityMonitoring
          currentQuality={mockQuality}
          isRecording={true}
          exerciseContext={mockExercise}
        />
      )

      expect(screen.getByText('Audio Quality Monitoring')).toBeInTheDocument()
      expect(screen.getByText('GOOD')).toBeInTheDocument()
      expect(screen.getByText('80%')).toBeInTheDocument() // Overall quality score
      expect(screen.getByText('85%')).toBeInTheDocument() // Clarity
      expect(screen.getByText('75%')).toBeInTheDocument() // Volume
      expect(screen.getByText('10%')).toBeInTheDocument() // Noise
    })

    it('shows quality status indicators', () => {
      render(
        <QualityMonitoring
          currentQuality={mockQuality}
          isRecording={true}
          exerciseContext={mockExercise}
        />
      )

      expect(screen.getByText('Live Monitoring Active')).toBeInTheDocument()
    })

    it('displays exercise-specific quality goals', () => {
      render(
        <QualityMonitoring
          currentQuality={mockQuality}
          isRecording={true}
          exerciseContext={mockExercise}
        />
      )

      expect(screen.getByText('Quality Goals for BOARD PRESENTATION')).toBeInTheDocument()
      expect(screen.getByText('• Clarity ≥85% for executive communication')).toBeInTheDocument()
    })
  })

  describe('CoachingOverlay', () => {
    it('renders real-time coaching interface', () => {
      render(
        <CoachingOverlay
          isRecording={true}
          exerciseContext={mockExercise}
          userProfile={mockUser}
          audioLevel={75}
          onToggleCoaching={jest.fn()}
        />
      )

      expect(screen.getByText('Real-time Coaching')).toBeInTheDocument()
    })

    it('shows career context reminder', () => {
      render(
        <CoachingOverlay
          isRecording={true}
          exerciseContext={mockExercise}
          userProfile={mockUser}
          audioLevel={75}
          onToggleCoaching={jest.fn()}
        />
      )

      expect(screen.getByText('PO → PM')).toBeInTheDocument()
      expect(screen.getByText(/fintech PM communication/)).toBeInTheDocument()
    })

    it('allows coaching intensity adjustment', () => {
      render(
        <CoachingOverlay
          isRecording={true}
          exerciseContext={mockExercise}
          userProfile={mockUser}
          audioLevel={75}
          onToggleCoaching={jest.fn()}
        />
      )

      expect(screen.getByText('Coaching Intensity')).toBeInTheDocument()
      expect(screen.getByText('LOW')).toBeInTheDocument()
      expect(screen.getByText('MEDIUM')).toBeInTheDocument()
      expect(screen.getByText('HIGH')).toBeInTheDocument()
    })

    it('can be minimized and expanded', () => {
      const mockToggle = jest.fn()
      
      render(
        <CoachingOverlay
          isRecording={true}
          exerciseContext={mockExercise}
          userProfile={mockUser}
          audioLevel={75}
          onToggleCoaching={mockToggle}
        />
      )

      // Find minimize button and click it
      const buttons = screen.getAllByRole('button')
      const minimizeButton = buttons.find(btn => btn.querySelector('svg'))
      if (minimizeButton) {
        fireEvent.click(minimizeButton)
      }
    })
  })

  describe('Integration Tests', () => {
    it('maintains recording session state across components', async () => {
      render(
        <RecordingOrchestrator
          exerciseContext={mockExercise}
          userProfile={mockUser}
          onSessionComplete={mockOnComplete}
          onSessionCancel={mockOnCancel}
        />
      )

      // Initial session should be created
      expect(screen.getByText(mockExercise.title)).toBeInTheDocument()
    })

    it('passes exercise context to all components correctly', () => {
      render(
        <CareerTransitionOptimizer
          userProfile={mockUser}
          exerciseContext={mockExercise}
          currentPhase="SETUP"
        />
      )

      // Exercise context should be reflected in optimization
      expect(screen.getByText('Financial Services & Fintech')).toBeInTheDocument()
      expect(screen.getByText('BOARD PRESENTATION Optimization')).toBeInTheDocument()
    })

    it('provides appropriate exercise recommendations based on user profile', () => {
      const poToPmUser = mockUserProfiles[0] // PO → PM
      const recommendedExercise = getRecommendedExercise(poToPmUser)
      
      expect(recommendedExercise.type).toBe('FRAMEWORK_PRACTICE')
      
      const pmToSeniorUser = mockUserProfiles[1] // PM → Senior PM  
      const seniorExercise = getRecommendedExercise(pmToSeniorUser)
      
      expect(seniorExercise.type).toBe('STAKEHOLDER_UPDATE')
    })
  })

  describe('Mock Data Validation', () => {
    it('provides complete exercise contexts', () => {
      mockExerciseContexts.forEach(exercise => {
        expect(exercise.id).toBeDefined()
        expect(exercise.title).toBeDefined()
        expect(exercise.successCriteria.length).toBeGreaterThan(0)
        expect(exercise.frameworkPrompts.length).toBeGreaterThan(0)
      })
    })

    it('provides valid user profiles', () => {
      mockUserProfiles.forEach(profile => {
        expect(profile.id).toBeDefined()
        expect(profile.currentRole).toBeDefined()
        expect(profile.targetRole).toBeDefined()
        expect(profile.skillGaps.length).toBeGreaterThan(0)
      })
    })

    it('has appropriate quality thresholds', () => {
      expect(mockQualityThresholds.excellent.clarity).toBeGreaterThan(mockQualityThresholds.good.clarity)
      expect(mockQualityThresholds.good.clarity).toBeGreaterThan(mockQualityThresholds.acceptable.clarity)
      expect(mockQualityThresholds.acceptable.clarity).toBeGreaterThan(mockQualityThresholds.poor.clarity)
    })
  })
})