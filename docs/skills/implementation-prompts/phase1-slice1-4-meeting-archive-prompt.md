# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-4: Meeting Archive & Intelligent Pattern Recognition

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's meeting archive with integrated meeting capture functionality, multi-dimensional competency tracking, and smart feedback routing.

---

## Implementation Target: Meeting Archive & Intelligent Pattern Recognition
**Development Time**: 4 hours  
**Slice ID**: 1-4 "Meeting Archive & Intelligent Pattern Recognition"

### Core Purpose
Sophisticated meeting archive that serves as a learning laboratory, enabling PMs to recognize communication patterns across different meeting contexts with integrated Zoom/Google Meet/Teams capture functionality and multi-dimensional competency analysis.

---

## Critical Framework Integration

### Meeting Capture & Bot Integration (CORE DIFFERENTIATOR)
The archive must seamlessly integrate with ShipSpeak's meeting capture system:

#### Platform Integration Interface
- **Zoom Bot Deployment**: One-click bot scheduling with calendar integration and automatic meeting detection
- **Google Meet Extension**: Chrome extension capture with real-time quality monitoring and participant detection
- **Teams App Integration**: Microsoft Teams bot framework with admin permission handling and enterprise compliance
- **Capture Method Selection**: Primary (notetaker bot), backup (Chrome extension), fallback (manual upload) with platform compatibility indicators

#### Real-Time Capture Dashboard Integration
- **Live Meeting Status**: Active capture monitoring with bot deployment success indicators and audio quality tracking
- **Capture Quality Assurance**: Audio level monitoring, speaker separation validation, transcript quality indicators, processing status updates
- **Consent & Privacy Management**: Participant consent tracking, recording permissions, data retention controls, regulatory compliance indicators

#### Executive Meeting Capture Features
- **Board Meeting Security**: Enhanced privacy protocols, executive consent workflows, confidential meeting handling, investor communication protection
- **Crisis Communication Capture**: Emergency meeting recording, incident response documentation, stakeholder communication tracking, real-time sentiment analysis
- **Speaking Engagement Recording**: Conference presentation capture, external meeting documentation, thought leadership session recording, industry event analysis

### Multi-Dimensional Competency Pattern Recognition
Archive must visualize and track PM competency development:

#### 1. Product Sense & Strategic Thinking Patterns (20-95% scale)
- **Framework Usage Detection**: RICE, ICE, Jobs-to-be-Done methodology identification in meeting conversations
- **User Problem Articulation**: Customer pain point discussion recognition and solution evaluation demonstration
- **Market Context Integration**: Competitive landscape mentions, strategic positioning communication, hypothesis-driven reasoning patterns

#### 2. Communication & Executive Presence Patterns (15-90% scale)
- **Answer-First Structure Recognition**: Conclusion-driven communication identification and executive summary effectiveness
- **Strategic Language Usage**: Executive vocabulary detection, strategic vs tactical language analysis, influence without authority demonstration
- **Board Presentation Quality**: Investor-appropriate messaging, fiduciary responsibility communication, quarterly metrics presentation effectiveness

#### 3. Stakeholder Management & Cross-Functional Leadership Patterns (25-85% scale)
- **Multi-Audience Communication**: Engineer, designer, executive, customer stakeholder adaptation recognition
- **Conflict Resolution Effectiveness**: Difficult conversation management, consensus building demonstration, escalation management competency
- **Customer Advocacy**: User need representation, feedback translation, user-centric decision demonstration

#### 4. Technical Translation & Data Fluency Patterns (30-80% scale)
- **Complex Concept Simplification**: Technical architecture, engineering constraints, security risk business language translation
- **Data-Driven Reasoning**: Metrics usage, analytics integration, user research support demonstration in meeting conversations
- **Risk Communication**: Technical risk, security concerns, regulatory compliance stakeholder-appropriate articulation

#### 5. Business Impact & Organizational Leadership Patterns (10-95% scale)
- **ROI Articulation**: Business outcome connection, revenue impact reasoning, cost optimization communication demonstration
- **Resource Allocation Reasoning**: Headcount, budget, timeline decision justification with strategic business context
- **Organizational Communication**: All-hands presentation elements, culture reinforcement, strategic vision cascading, change management

### Smart Feedback Integration with Cost Optimization
Archive must route feedback through cost-optimized system:

#### Feedback Complexity Analysis
- **Level 1 Pattern Matching**: Common PM communication patterns trigger pre-written template feedback (0 AI cost)
- **Level 2 AI Enhancement**: Novel stakeholder combinations or competency intersections trigger AI-enhanced templates (low cost)
- **Level 3 Full AI Analysis**: Complex executive scenarios, multi-competency integration, board presentations trigger full AI analysis (high cost)

#### Executive Priority Routing
- **Automatic AI Escalation**: Director+ users, board presentations, crisis communications, speaking engagements automatically receive full AI analysis
- **Executive Budget Management**: Unlimited AI allocation for Executive tier users, measured allocation for Growth/Foundation users
- **Quality Optimization**: A/B testing between pattern-based and AI feedback to optimize cost-effectiveness while maintaining executive satisfaction

---

## Technical Implementation Requirements

### Meeting Archive Component Architecture
```typescript
components/meetings/
├── MeetingArchive.tsx           # Main archive view with competency filters
├── CaptureIntegration/
│   ├── ZoomBotDeploy.tsx       # Zoom meeting bot scheduling and management
│   ├── GoogleMeetExtension.tsx  # Chrome extension capture interface
│   ├── TeamsIntegration.tsx     # Microsoft Teams bot deployment
│   └── CaptureStatus.tsx        # Real-time capture monitoring dashboard
├── CompetencyFilters/
│   ├── ProductSenseFilter.tsx   # Framework usage and strategic thinking filters
│   ├── CommunicationFilter.tsx  # Executive presence and answer-first structure filters
│   ├── LeadershipFilter.tsx     # Stakeholder management and cross-functional filters
│   ├── TechnicalFilter.tsx      # Translation and data fluency filters
│   └── BusinessImpactFilter.tsx # ROI and organizational leadership filters
├── SmartFeedback/
│   ├── FeedbackRouter.tsx       # Complexity analysis and routing logic
│   ├── CostOptimization.tsx     # AI budget management and pattern matching
│   └── ExecutivePriority.tsx    # Director+ automatic AI routing
└── ExecutiveFeatures/
    ├── BoardMeetingSecurity.tsx # Enhanced privacy and confidentiality
    ├── CrisisCapture.tsx        # Emergency meeting recording
    └── SpeakingEngagement.tsx   # Conference presentation integration
```

### Meeting Capture Data Models
```typescript
interface CapturedMeeting {
  id: string
  title: string
  participants: Participant[]
  captureMethod: 'ZOOM_BOT' | 'GOOGLE_MEET_EXTENSION' | 'TEAMS_APP' | 'MANUAL_UPLOAD'
  captureQuality: CaptureQuality
  processingStatus: 'CAPTURING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  competencyAnalysis: CompetencyAnalysis
  feedbackComplexity: 'PATTERN_BASED' | 'AI_ENHANCED' | 'FULL_AI_ANALYSIS'
  executivePriority: boolean
  industryContext: Industry
  meetingType: MeetingType
  privacy: PrivacySettings
}

interface CaptureQuality {
  audioLevel: number // 0-100
  speakerSeparation: number // 0-100 
  transcriptConfidence: number // 0-100
  platformMetadata: PlatformSpecificData
}

interface CompetencyAnalysis {
  productSense: CompetencyScore
  communication: CompetencyScore
  stakeholderMgmt: CompetencyScore
  technicalTranslation: CompetencyScore
  businessImpact: CompetencyScore
  overallGrowth: GrowthVelocity
}
```

### Meeting Capture Workflow Integration
```typescript
// Real-time capture monitoring
const CaptureWorkflow = {
  preMeetingSetup: {
    botScheduling: 'calendar integration with automatic meeting detection',
    consentWorkflow: 'participant notification and recording permissions',
    qualityPrecheck: 'audio setup validation and platform compatibility'
  },
  liveMeeting: {
    realTimeMonitoring: 'bot status, audio quality, participant detection',
    qualityAssurance: 'speaker separation, transcript confidence, latency tracking',
    executiveProtocols: 'enhanced security for board meetings and crisis communications'
  },
  postMeeting: {
    processingPipeline: 'transcript generation → speaker diarization → competency analysis → feedback routing',
    feedbackGeneration: 'complexity analysis → pattern matching vs AI routing → personalized feedback delivery',
    archiveIntegration: 'meeting classification, competency tagging, executive priority flagging'
  }
}
```

---

## Implementation Checklist

### Phase 1: Meeting Capture Foundation ✅
- [ ] Zoom bot deployment interface with calendar integration
- [ ] Google Meet Chrome extension capture interface
- [ ] Microsoft Teams app integration framework
- [ ] Real-time capture status monitoring dashboard

### Phase 2: Competency Pattern Recognition ✅
- [ ] 5-point competency analysis integration with meeting archive
- [ ] Framework usage detection (RICE, ICE, Jobs-to-be-Done) in conversations
- [ ] Executive communication pattern recognition (answer-first, strategic language)
- [ ] Multi-competency intersection analysis and visualization

### Phase 3: Smart Feedback Integration ✅
- [ ] Feedback complexity routing (Level 1/2/3) based on meeting analysis
- [ ] Cost optimization with pattern-based vs AI feedback routing
- [ ] Executive priority system with automatic AI allocation
- [ ] A/B testing framework for feedback effectiveness optimization

### Phase 4: Executive & Security Features ✅
- [ ] Board meeting enhanced privacy protocols and confidential handling
- [ ] Crisis communication emergency capture and incident documentation
- [ ] Speaking engagement conference presentation integration
- [ ] Industry-specific regulatory compliance and data retention controls

---

## Success Validation Criteria

### Meeting Capture Excellence
- **Platform Integration**: Seamless bot deployment across Zoom, Google Meet, Teams with high success rates
- **Capture Quality**: Consistent audio quality, speaker separation, transcript confidence across platforms
- **Real-Time Monitoring**: Live capture status, quality indicators, participant tracking working reliably
- **Executive Security**: Board meeting privacy, crisis communication confidentiality, speaking engagement professional handling

### Competency Analysis Integration
- **Pattern Recognition**: Accurate identification of PM framework usage, strategic language, executive presence markers
- **Multi-Dimensional Tracking**: 5-point radar competency analysis integrated with meeting archive visualization
- **Growth Velocity**: Competency improvement tracking over time with no-ceiling philosophy reinforcement
- **Industry Context**: Sector-specific competency requirements reflected in meeting analysis and pattern recognition

### Smart Feedback Cost Optimization
- **Routing Effectiveness**: 80% pattern-based, 15% AI-enhanced, 5% full AI analysis distribution achieved
- **Cost Control**: Significant AI cost reduction while maintaining high user satisfaction with feedback quality
- **Executive Priority**: Director+ users receive appropriate AI allocation for board presentations and crisis communications
- **Feedback Quality**: User engagement and satisfaction maintained across all feedback complexity levels

---

*Implementation Time Estimate: 4 hours*
*Success Criteria: Meeting archive with integrated capture functionality, multi-dimensional competency tracking, and cost-optimized smart feedback routing*