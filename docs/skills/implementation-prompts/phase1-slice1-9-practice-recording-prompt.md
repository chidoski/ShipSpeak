# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-9: Practice Recording Interface

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent practice recording interface with PM-specific recording optimization and career-intelligent feedback systems.

---

## Implementation Target: Practice Recording Interface
**Development Time**: 3-4 hours  
**Slice ID**: 1-9 "Practice Recording Interface"

### Core Purpose
Build an intuitive practice recording interface that captures PM communication practice with sophisticated audio processing, real-time coaching feedback, and career-intelligent recording optimization.

---

## Critical Framework Integration

### PM Career Transition Recording Focus (MANDATORY)
Recording interface must optimize for transition-specific skill development:

#### PO → PM Transition Recording Optimization
- **Strategic Language Detection**: Real-time recognition of business outcome vs delivery language
- **Stakeholder Adaptation Coaching**: Live feedback on communication style for different audiences
- **Framework Usage Prompting**: Contextual reminders for RICE, ICE, value-based reasoning
- **Confidence Building**: Encouragement for business impact articulation and strategic thinking

#### PM → Senior PM Transition Recording Optimization  
- **Executive Structure Coaching**: Real-time answer-first methodology guidance
- **Trade-off Articulation Support**: Live prompting for multi-factor decision reasoning
- **Authority Language Development**: Coaching for influence without authority communication
- **Altitude Control Feedback**: Real-time guidance on stakeholder-appropriate detail levels

#### Senior PM → Group PM Transition Recording Optimization
- **Portfolio Thinking Coaching**: Live feedback on multi-product strategic communication
- **Leadership Language Development**: Real-time coaching for mentorship and team development
- **Resource Reasoning Support**: Live guidance on sophisticated resource allocation communication
- **Cross-team Coordination**: Coaching for department-level stakeholder management

#### Group PM → Director Transition Recording Optimization
- **Board Presentation Excellence**: Real-time coaching for C-suite communication structure
- **Business Model Fluency**: Live feedback on P&L reasoning and financial impact articulation
- **Market Strategy Integration**: Real-time guidance on competitive positioning communication
- **Vision Communication**: Coaching for organizational leadership and culture development

### Industry-Specific Recording Optimization
Interface must provide industry-contextualized recording guidance:

#### Healthcare & Life Sciences PM Recording
- **Regulatory Language Coaching**: Real-time feedback on FDA, HIPAA, clinical terminology usage
- **Patient Outcome Prioritization**: Live coaching on safety-first decision communication
- **Evidence Integration Support**: Real-time guidance on clinical evidence communication
- **Compliance Communication**: Live feedback on regulatory requirement integration

#### Cybersecurity & Enterprise Security PM Recording  
- **Risk Communication Coaching**: Real-time feedback on threat assessment articulation
- **Technical Translation Support**: Live guidance on security concept communication clarity
- **Compliance Framework Integration**: Real-time coaching on SOC2, ISO27001, GDPR communication
- **Security-First Thinking**: Live feedback on zero-trust architecture communication

#### Financial Services & Fintech PM Recording
- **Regulatory Compliance Coaching**: Real-time feedback on SEC, banking regulation integration
- **Risk Management Communication**: Live guidance on financial risk assessment articulation
- **Trust-Building Language**: Real-time coaching on consumer confidence messaging
- **Financial Metrics Integration**: Live feedback on P&L and revenue model communication

#### Enterprise Software & B2B PM Recording
- **ROI Communication Coaching**: Real-time feedback on business case articulation excellence
- **Implementation Strategy Support**: Live guidance on customer success communication
- **Enterprise Stakeholder Management**: Real-time coaching on complex stakeholder communication
- **Customer Advocacy Development**: Live feedback on reference and renewal communication

#### Consumer Technology & Apps PM Recording
- **User Experience Communication**: Real-time coaching on behavioral psychology integration
- **Growth Metrics Coaching**: Live feedback on DAU, MAU, retention communication effectiveness
- **Experimentation Framework**: Real-time guidance on A/B testing communication clarity
- **Platform Strategy Support**: Live coaching on network effects and ecosystem communication

### Meeting Type Recording Optimization
Interface must provide meeting-specific recording coaching:

#### Board Presentation Recording
- **Time Management Coaching**: Real-time pacing feedback for 2-3 minute executive summaries
- **Confidence Building**: Live encouragement for definitive language and risk acknowledgment
- **Metrics Integration**: Real-time guidance on business impact and competitive position communication
- **Strategic Narrative**: Live feedback on market context and business model integration

#### Planning Session Recording
- **Strategic Altitude Coaching**: Real-time feedback on market trend and competitive analysis integration
- **Resource Reasoning Support**: Live guidance on headcount allocation and budget prioritization
- **Timeline Communication**: Real-time coaching on realistic estimation with dependency awareness
- **Cross-functional Coordination**: Live feedback on engineering, design, marketing alignment

#### Stakeholder Update Recording
- **Progress Communication Coaching**: Real-time feedback on commitment tracking and success criteria
- **Blocker Communication Support**: Live guidance on escalation clarity and solution proposition
- **Executive Reporting**: Real-time coaching on appropriate detail levels for different audiences
- **Action Orientation**: Live feedback on next steps and accountability communication

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core practice recording system structure
interface PracticeRecordingProps {
  exerciseContext: ExerciseContext
  userProfile: UserProfile
  recordingEngine: RecordingEngine
  realTimeCoaching: RealTimeCoaching
}

interface RecordingEngine {
  audioCapture: AudioCaptureSystem
  qualityMonitoring: AudioQualityTracker
  realTimeAnalysis: LiveAnalysisEngine
  progressTracking: RecordingProgressTracker
}

interface RealTimeCoaching {
  liveTranscription: LiveTranscriptionEngine
  patternRecognition: LivePatternDetection
  coachingPrompts: RealTimePromptSystem
  encouragementEngine: MotivationSystem
}

interface AudioCaptureSystem {
  deviceDetection: MediaDeviceInfo[]
  qualityOptimization: AudioQualityOptimizer
  noiseReduction: NoiseReductionEngine
  recordingControls: RecordingControlInterface
}

interface LiveAnalysisEngine {
  transcriptionAccuracy: number
  communicationPatterns: LivePatternAnalysis
  frameworkDetection: LiveFrameworkRecognition
  executivePresenceTracking: LivePresenceAnalysis
}

interface RealTimePromptSystem {
  contextualHints: ContextualHint[]
  frameworkReminders: FrameworkPrompt[]
  structureGuidance: StructurePrompt[]
  confidenceBuilding: EncouragementPrompt[]
}
```

### Recording Interface Component Structure
```
PracticeRecording/
├── RecordingOrchestrator.tsx    # Core recording session management
├── AudioCapture/
│   ├── DeviceSetup.tsx          # Microphone detection and optimization
│   ├── QualityMonitoring.tsx    # Real-time audio quality feedback
│   ├── NoiseReduction.tsx       # Background noise management
│   └── RecordingControls.tsx    # Start, pause, stop, re-record controls
├── RealTimeCoaching/
│   ├── LiveTranscription.tsx    # Real-time speech-to-text display
│   ├── PatternRecognition.tsx   # Live communication pattern detection
│   ├── CoachingPrompts.tsx      # Contextual coaching hint display
│   └── ConfidenceBuilding.tsx   # Motivational feedback and encouragement
├── RecordingOptimization/
│   ├── IndustryContextOptimizer.tsx # Industry-specific recording guidance
│   ├── CareerTransitionOptimizer.tsx # Transition-specific coaching integration
│   ├── MeetingTypeOptimizer.tsx     # Meeting-specific recording optimization
│   └── FrameworkIntegration.tsx     # PM framework usage coaching
└── RecordingInterface/
    ├── RecordingStudio.tsx      # Main recording interface with visual feedback
    ├── ProgressIndicator.tsx    # Recording progress and time management
    ├── QualityFeedback.tsx      # Audio quality and clarity indicators
    └── CoachingOverlay.tsx      # Non-intrusive real-time coaching display
```

### Mock Data Requirements
Create realistic recording scenarios with comprehensive coaching:

#### Real-Time Coaching Examples
```typescript
const mockRealTimeCoaching = [
  {
    triggerPhrase: "We need to prioritize based on...",
    coachingPrompt: {
      type: 'FRAMEWORK_REMINDER',
      message: 'Great start! Consider RICE framework: Reach × Impact × Confidence ÷ Effort',
      timing: 'AFTER_PAUSE',
      urgency: 'MEDIUM',
      careerRelevance: 'Essential for PM → Senior PM transition'
    }
  },
  {
    triggerPattern: 'LONG_EXPLANATION_DETECTED',
    coachingPrompt: {
      type: 'STRUCTURE_GUIDANCE',
      message: 'Try answer-first: Start with your recommendation, then provide supporting evidence',
      timing: 'IMMEDIATE',
      urgency: 'HIGH',
      careerRelevance: 'Critical for executive communication'
    }
  },
  {
    triggerPattern: 'UNCERTAIN_LANGUAGE_DETECTED',
    coachingPrompt: {
      type: 'CONFIDENCE_BUILDING',
      message: 'Strong insights! Use definitive language: "This will..." instead of "This should..."',
      timing: 'AFTER_COMPLETION',
      urgency: 'MEDIUM',
      careerRelevance: 'Executive presence development'
    }
  }
]
```

#### Recording Session Configuration
```typescript
const mockRecordingConfigurations = [
  {
    exerciseType: 'BOARD_PRESENTATION',
    timeLimit: 180, // 3 minutes
    coachingIntensity: 'HIGH',
    realTimeHints: true,
    industryContext: 'fintech',
    stakeholderSimulation: true,
    frameworkPrompts: ['Answer-first structure', 'Business impact focus', 'Risk acknowledgment'],
    successCriteria: [
      'Complete presentation within time limit',
      'Clear conclusion in first 30 seconds',
      'Business metrics integration',
      'Confident delivery without hesitation'
    ]
  },
  {
    exerciseType: 'STAKEHOLDER_UPDATE',
    timeLimit: 300, // 5 minutes
    coachingIntensity: 'MEDIUM',
    realTimeHints: false,
    industryContext: 'healthcare',
    stakeholderSimulation: false,
    frameworkPrompts: ['Progress clarity', 'Blocker communication', 'Next steps definition'],
    successCriteria: [
      'Clear progress communication',
      'Specific blocker identification',
      'Action-oriented next steps',
      'Appropriate stakeholder adaptation'
    ]
  }
]
```

#### Audio Quality Optimization
```typescript
const mockAudioOptimization = {
  qualityThresholds: {
    excellent: { clarity: 95, noiseLevel: 5, volume: 85 },
    good: { clarity: 85, noiseLevel: 15, volume: 75 },
    acceptable: { clarity: 75, noiseLevel: 25, volume: 65 },
    poor: { clarity: 65, noiseLevel: 35, volume: 55 }
  },
  optimizationSuggestions: [
    {
      issue: 'LOW_CLARITY',
      suggestion: 'Move closer to microphone for better clarity',
      impact: 'Critical for accurate feedback and analysis'
    },
    {
      issue: 'BACKGROUND_NOISE',
      suggestion: 'Find quieter environment or use noise cancellation',
      impact: 'Improves transcription accuracy and focus'
    },
    {
      issue: 'LOW_VOLUME',
      suggestion: 'Speak with more projection and confidence',
      impact: 'Essential for executive presence development'
    }
  ]
}
```

---

## User Experience Requirements

### Recording Studio Interface Design
Create professional, confidence-building recording environment:

#### Main Recording Interface
- **Clean Visual Design**: Professional recording studio aesthetic with minimal distractions
- **Quality Indicators**: Real-time audio quality feedback with optimization suggestions
- **Time Management**: Clear progress indication with countdown and pacing guidance
- **Coaching Integration**: Non-intrusive real-time coaching hints and encouragement

#### Pre-Recording Setup
- **Device Optimization**: Automatic microphone detection with quality testing
- **Exercise Context**: Clear scenario reminder and success criteria display
- **Coaching Preferences**: User control over real-time coaching intensity and frequency
- **Quality Baseline**: Audio quality testing with optimization recommendations

#### During Recording Experience
- **Live Transcription**: Real-time speech-to-text display for communication pattern awareness
- **Pattern Recognition**: Visual indicators for framework usage and communication structure
- **Confidence Building**: Positive reinforcement and encouragement during difficult moments
- **Time Awareness**: Subtle pacing guidance without pressure or distraction

#### Post-Recording Options
- **Immediate Playback**: Quick review option with quality assessment
- **Re-recording Support**: Easy restart with coaching adjustment options
- **Analysis Preview**: Preliminary feedback before detailed analysis
- **Progress Integration**: Automatic contribution to skill development tracking

### Adaptive Recording Experience
- **Industry Optimization**: Recording coaching adapts to user's PM sector context
- **Career Stage Relevance**: Coaching intensity and focus appropriate for transition goals
- **Skill Gap Targeting**: Real-time coaching prioritizes identified development areas
- **Learning Style Adaptation**: Coaching delivery style adjusts to user preference

---

## Success Validation Criteria

### Recording Quality Validation
- **Audio Clarity**: Recording quality sufficient for accurate analysis and feedback
- **User Confidence**: Interface encourages natural communication without excessive self-consciousness
- **Coaching Effectiveness**: Real-time coaching improves communication without disruption
- **Technical Reliability**: Recording system works consistently across devices and environments

### User Experience Validation  
- **Ease of Use**: Users can focus on communication practice without technical difficulties
- **Confidence Building**: Recording experience builds rather than undermines communication confidence
- **Learning Integration**: Recording sessions feel productive and contribute to skill development
- **Mobile Optimization**: Full recording experience available on mobile devices

### Framework Integration Validation
- **Career Transition Support**: Recording interface effectively supports all PM transition patterns
- **Industry Context Integration**: Healthcare, cybersecurity, fintech, enterprise, consumer optimization
- **Meeting Type Preparation**: Recording coaching prepares users for specific meeting types
- **Continuous Learning**: Recording sessions contribute effectively to overall skill development

---

*Implementation Time Estimate: 3-4 hours*
*Success Criteria: Intuitive practice recording interface with real-time coaching and career-intelligent optimization*