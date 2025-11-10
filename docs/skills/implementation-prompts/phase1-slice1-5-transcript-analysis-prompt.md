# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-5: Intelligent Transcript Analysis & PM Pattern Detection

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent transcript analysis system with PM-specific pattern detection and career-aware insights generation.

---

## Implementation Target: Intelligent Transcript Analysis & PM Pattern Detection
**Development Time**: 5-6 hours  
**Slice ID**: 1-5 "Intelligent Transcript Analysis & Communication Pattern Discovery"

### Core Purpose
Build an intelligent transcript analysis engine that processes meeting transcripts to identify PM-specific communication patterns, executive presence markers, and career progression indicators with industry-contextualized insights.

---

## Critical Framework Integration

### PM Career Transition Patterns (MANDATORY)
Transcript analysis must detect communication patterns specific to PM career transitions:

#### PO → PM Transition Detection
- **Strategic Language Emergence**: Detecting shift from "delivery" to "outcomes" vocabulary
- **Business Impact Reasoning**: Recognition of customer value over feature completion focus
- **Stakeholder Communication Evolution**: Tracking expansion beyond engineering-focused language
- **Decision Framework Application**: Detection of RICE, ICE, or value-based reasoning patterns

#### PM → Senior PM Transition Detection  
- **Executive Communication Structure**: Answer-first methodology, conclusion-driven responses
- **Trade-off Articulation Sophistication**: Multi-factor decision reasoning with clear frameworks
- **Influence Without Authority**: Leadership language patterns in cross-functional contexts
- **Strategic Altitude Control**: Appropriate detail levels for different stakeholder types

#### Senior PM → Group PM Transition Detection
- **Portfolio Thinking Language**: Multi-product strategy communication patterns
- **Coaching Communication Emergence**: Mentorship and development conversation indicators
- **Organizational Impact Awareness**: Department-level stakeholder management evidence
- **Resource Allocation Reasoning**: Sophisticated headcount and priority reasoning patterns

#### Group PM → Director Transition Detection
- **Board Presentation Readiness**: C-suite appropriate language and structure patterns
- **Business Model Fluency**: P&L reasoning and financial impact communication
- **Market Strategy Communication**: Competitive positioning and industry trend integration
- **Organizational Leadership**: Vision communication and team alignment language

### Industry-Specific Pattern Detection
Analysis engine must identify industry-contextualized communication patterns:

#### Healthcare & Life Sciences PM Analysis
- **Regulatory Language Proficiency**: FDA, HIPAA, clinical trial terminology integration
- **Patient Outcome Prioritization**: Safety-first decision framing and risk communication
- **Evidence-Based Reasoning**: Clinical evidence integration in product decisions
- **Compliance Framework Usage**: Regulatory requirement integration in product planning

#### Cybersecurity & Enterprise Security PM Analysis  
- **Risk Communication Effectiveness**: Threat assessment articulation and vulnerability reasoning
- **Technical Translation Competency**: Security concept communication for business stakeholders
- **Compliance Framework Integration**: SOC2, ISO27001, GDPR requirement communication
- **Zero-Trust Architecture**: Security-first product thinking communication patterns

#### Financial Services & Fintech PM Analysis
- **Regulatory Compliance Communication**: SEC, banking regulation awareness in product decisions
- **Risk Management Integration**: Financial risk assessment and mitigation communication
- **Trust-Building Language**: Consumer confidence and fraud prevention messaging patterns
- **Audit Readiness**: Financial compliance and reporting communication structures

#### Enterprise Software & B2B PM Analysis
- **ROI Communication Competency**: Business case development and value proposition articulation
- **Implementation Planning**: Customer success and change management communication
- **Customer Advocacy Development**: Reference creation and renewal strategy communication
- **Enterprise Sales Support**: Complex deal support and technical stakeholder management

#### Consumer Technology & Apps PM Analysis
- **User Experience Communication**: Behavioral psychology and engagement optimization language
- **Growth Metrics Fluency**: DAU, MAU, retention, viral coefficient communication patterns
- **Rapid Iteration Framework**: A/B testing and experimentation communication effectiveness
- **Platform Thinking**: Network effects and ecosystem development communication

### Meeting Type Standards Detection
Analysis engine must recognize communication patterns by meeting context:

#### Board Presentation Pattern Detection
- **Executive Summary Structure**: 2-3 minute presentation organization and clarity
- **Metrics Focus**: Business impact and competitive position communication effectiveness
- **Confidence Indicators**: Definitive language usage and appropriate risk acknowledgment
- **Strategic Narrative**: Market context and business model integration

#### Planning Session Pattern Detection
- **Strategic Altitude Communication**: Market trends and competitive analysis integration
- **Resource Reasoning**: Headcount and budget allocation rationale sophistication
- **Timeline Communication**: Realistic estimation with dependency awareness and risk factors
- **Cross-functional Coordination**: Engineering, design, marketing alignment communication

#### Stakeholder Update Pattern Detection
- **Progress Clarity**: Commitment tracking and success criteria communication effectiveness
- **Blocker Communication**: Escalation clarity and solution proposition sophistication
- **Executive Reporting**: Appropriate detail levels and action-oriented communication
- **Success Metric Integration**: KPI and OKR communication with business context

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core transcript analysis system structure
interface TranscriptAnalysisProps {
  transcript: MeetingTranscript
  userProfile: UserProfile
  meetingContext: MeetingContext
  analysisConfig: AnalysisConfiguration
}

interface MeetingTranscript {
  id: string
  content: string
  speakers: SpeakerIdentification[]
  duration: number
  meetingType: MeetingType
  timestamp: Date
  audioQuality: QualityMetrics
}

interface PMPatternDetection {
  careerTransitionIndicators: TransitionMarkers
  industrySpecificPatterns: IndustryPatterns
  meetingTypeEffectiveness: MeetingAnalysis
  executivePresenceMetrics: PresenceAnalysis
  communicationFrameworks: FrameworkUsage[]
}

interface AnalysisResults {
  overallScore: number
  patternHighlights: PatternHighlight[]
  improvementAreas: ImprovementArea[]
  strengthAreas: StrengthArea[]
  careerProgressionInsights: ProgressionInsight[]
}
```

### Analysis Engine Component Structure
```
TranscriptAnalysis/
├── AnalysisEngine.tsx           # Core analysis orchestration
├── PatternDetection/
│   ├── PMTransitionDetector.tsx # Career level communication patterns
│   ├── IndustryContextAnalyzer.tsx # Industry-specific pattern recognition
│   ├── MeetingTypeAnalyzer.tsx  # Meeting context pattern analysis
│   └── ExecutivePresenceScorer.tsx # Executive communication effectiveness
├── InsightGeneration/
│   ├── CareerProgressInsights.tsx # Transition-specific feedback
│   ├── IndustryContextInsights.tsx # Sector-specific development areas
│   ├── SkillGapIdentification.tsx # Specific improvement opportunities
│   └── StrengthReinforcement.tsx # Positive pattern recognition
└── AnalysisVisualization/
    ├── PatternHeatmap.tsx       # Visual pattern distribution
    ├── ProgressTimeline.tsx     # Communication improvement tracking
    ├── CompetencyRadar.tsx      # Multi-dimensional skill visualization
    └── InsightCards.tsx         # Actionable insight presentation
```

---

## User Experience Requirements

### Analysis Results Presentation
Transform complex linguistic analysis into actionable PM insights:

#### Primary Analysis View
- **Score Display**: Large numerical score (7.2/10) with career context
- **Quick Insights**: 3-4 bullet points with specific evidence from transcript
- **Pattern Highlights**: Visual indicators of detected PM frameworks and structures
- **Progress Indicators**: Career transition progress with specific milestone tracking

#### Detailed Analysis Breakdown
- **Communication Effectiveness**: Framework usage, structure, influence patterns
- **Industry Fluency**: Sector-specific vocabulary and concept integration
- **Stakeholder Adaptation**: Communication effectiveness by audience type
- **Executive Presence**: Leadership language and confidence indicators

---

## Success Validation Criteria

### Analysis Quality Validation
- **Pattern Recognition**: Correctly identifies PM frameworks and communication structures
- **Career Context**: Analysis maps directly to user's specific transition goals
- **Industry Specificity**: Recommendations incorporate sector-specific requirements
- **Actionable Insights**: Users can implement specific suggestions immediately

### Technical Performance Validation  
- **Processing Speed**: Analysis completes within 2 minutes for 30-minute meetings
- **Mobile Optimization**: Results fully accessible on mobile devices
- **Real-time Progress**: Processing indicators and preliminary insights
- **Data Integration**: Seamless integration with meeting archive

---

*Implementation Time Estimate: 5-6 hours*
*Success Criteria: Intelligent transcript analysis with PM-specific pattern detection*