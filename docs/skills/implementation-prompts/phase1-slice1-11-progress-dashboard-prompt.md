# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-11: Progress Dashboard

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's intelligent progress dashboard with PM-specific skill tracking and career-intelligent advancement visualization.

---

## Implementation Target: Progress Dashboard
**Development Time**: 5-6 hours  
**Slice ID**: 1-11 "Progress Dashboard"

### Core Purpose
Build comprehensive progress dashboard that visualizes PM communication skill development with sophisticated career progression tracking, industry-contextualized benchmarking, and motivational advancement insights.

---

## Critical Framework Integration

### PM Career Transition Progress Tracking (MANDATORY)
Progress dashboard must visualize transition-specific skill development:

#### PO → PM Transition Progress Visualization
- **Strategic Thinking Development**: Business outcome focus vs delivery mindset progression tracking
- **PM Vocabulary Acquisition**: Business terminology usage improvement with context integration
- **Stakeholder Communication Expansion**: Cross-functional engagement skill development beyond engineering
- **Decision Framework Mastery**: RICE, ICE, value-based prioritization competency advancement

#### PM → Senior PM Transition Progress Visualization  
- **Executive Communication Excellence**: Answer-first methodology mastery and confidence development
- **Trade-off Articulation Advancement**: Complex decision reasoning sophistication with framework integration
- **Authority Development**: Influence without authority communication pattern strengthening
- **Strategic Altitude Mastery**: Stakeholder-appropriate communication depth control advancement

#### Senior PM → Group PM Transition Progress Visualization
- **Portfolio Strategy Communication**: Multi-product thinking development and strategic communication advancement
- **Leadership Language Development**: Mentorship conversation skills and coaching communication improvement
- **Organizational Impact Integration**: Department-level stakeholder management competency development
- **Resource Strategy Excellence**: Sophisticated resource allocation communication advancement

#### Group PM → Director Transition Progress Visualization
- **Board Presentation Mastery**: C-suite communication structure and executive presence development
- **Business Model Fluency**: P&L reasoning and financial communication competency advancement
- **Market Strategy Integration**: Competitive positioning and industry trend communication development
- **Vision Communication Excellence**: Organizational leadership and culture development advancement

### Industry-Specific Progress Tracking
Dashboard must visualize industry-contextualized skill development:

#### Healthcare & Life Sciences PM Progress
- **Regulatory Communication Development**: FDA, HIPAA, clinical terminology mastery advancement
- **Patient Outcome Prioritization**: Safety-first decision communication competency development
- **Evidence Integration Advancement**: Clinical evidence communication with stakeholder skill improvement
- **Compliance Communication Excellence**: Regulatory requirement integration mastery development

#### Cybersecurity & Enterprise Security PM Progress  
- **Risk Communication Mastery**: Threat assessment articulation and vulnerability communication advancement
- **Technical Translation Excellence**: Security concept communication clarity for business stakeholders
- **Compliance Framework Integration**: SOC2, ISO27001, GDPR communication competency development
- **Security-First Communication**: Zero-trust architecture communication pattern advancement

#### Financial Services & Fintech PM Progress
- **Regulatory Compliance Excellence**: SEC, banking regulation integration and audit readiness development
- **Risk Management Communication**: Financial risk assessment articulation advancement
- **Trust-Building Language Development**: Consumer confidence messaging competency improvement
- **Financial Metrics Mastery**: P&L reasoning and revenue model communication advancement

#### Enterprise Software & B2B PM Progress
- **ROI Communication Excellence**: Business case articulation and value proposition mastery development
- **Implementation Strategy Communication**: Customer success and change management advancement
- **Enterprise Stakeholder Management**: Complex stakeholder communication competency development
- **Customer Advocacy Excellence**: Reference creation and renewal strategy communication advancement

#### Consumer Technology & Apps PM Progress
- **User Experience Communication**: Behavioral psychology integration and engagement optimization advancement
- **Growth Metrics Mastery**: DAU, MAU, retention communication effectiveness development
- **Experimentation Framework**: A/B testing communication and data-driven decision advancement
- **Platform Strategy Communication**: Network effects and ecosystem communication competency development

### Meeting Type Progress Specialization
Dashboard must track meeting-specific communication advancement:

#### Board Presentation Progress Tracking
- **Executive Summary Excellence**: 2-3 minute presentation organization and delivery mastery
- **Time Management Advancement**: Pacing effectiveness and key message delivery competency
- **Confidence Development**: Definitive language usage and risk acknowledgment advancement
- **Strategic Narrative Mastery**: Market context integration and business model communication development

#### Planning Session Progress Tracking
- **Strategic Communication Advancement**: Market trend analysis and competitive intelligence integration
- **Resource Reasoning Excellence**: Headcount allocation and budget prioritization communication mastery
- **Timeline Communication Development**: Realistic estimation with dependency awareness advancement
- **Cross-functional Coordination**: Engineering, design, marketing alignment communication improvement

#### Stakeholder Update Progress Tracking
- **Progress Communication Excellence**: Commitment tracking and success criteria articulation mastery
- **Blocker Communication Advancement**: Escalation clarity and solution proposition competency development
- **Executive Reporting Development**: Appropriate detail levels and action-oriented communication advancement
- **Accountability Communication**: Next steps definition and responsibility assignment mastery

---

## Technical Implementation Requirements

### Component Architecture
```typescript
// Core progress dashboard system structure
interface ProgressDashboardProps {
  userProfile: UserProfile
  skillProgressData: SkillProgressData
  careerTrajectory: CareerTrajectory
  benchmarkData: BenchmarkData
}

interface SkillProgressData {
  overallProgress: OverallProgressMetrics
  skillDimensions: SkillDimensionProgress[]
  recentImprovements: RecentImprovement[]
  milestoneAchievements: MilestoneAchievement[]
  practiceSessionHistory: PracticeSessionSummary[]
}

interface CareerTrajectory {
  currentLevel: PMLevel
  targetLevel: PMLevel
  progressPercentage: number
  estimatedTimeToTarget: string
  keyMilestones: CareerMilestone[]
  readinessIndicators: ReadinessIndicator[]
}

interface SkillDimensionProgress {
  dimension: string
  currentScore: number
  targetScore: number
  recentTrend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  improvementRate: number
  nextMilestone: string
  practiceRecommendations: string[]
}

interface BenchmarkData {
  industryBenchmarks: IndustryBenchmark[]
  roleLevelBenchmarks: RoleBenchmark[]
  peerComparisons: PeerComparison[]
  faangStandards: FAANGBenchmark[]
}

interface MilestoneAchievement {
  milestone: string
  achievedDate: Date
  impactDescription: string
  careerSignificance: string
  celebrationLevel: 'MINOR' | 'MAJOR' | 'BREAKTHROUGH'
}
```

### Progress Dashboard Component Structure
```
ProgressDashboard/
├── DashboardOrchestrator.tsx    # Core progress visualization management
├── OverviewCards/
│   ├── CareerProgressionCard.tsx # Primary career advancement visualization
│   ├── OverallSkillScore.tsx     # Comprehensive skill development summary
│   ├── RecentAchievements.tsx    # Recent milestone and improvement celebration
│   └── NextMilestoneCard.tsx     # Upcoming development goals and timeline
├── SkillProgressVisualization/
│   ├── SkillRadarChart.tsx       # Multi-dimensional skill progression radar
│   ├── ProgressTimeline.tsx      # Historical skill development timeline
│   ├── ImprovementTrendGraph.tsx # Skill advancement trend analysis
│   └── BenchmarkComparison.tsx   # Industry and role-level performance comparison
├── CareerTrajectoryTracking/
│   ├── TransitionReadiness.tsx   # Career transition readiness assessment
│   ├── MilestoneTracker.tsx      # Career milestone achievement progression
│   ├── SkillGapVisualization.tsx # Remaining development areas visualization
│   └── TimeToPromotionEstimator.tsx # Data-driven promotion timeline projection
├── DetailedAnalytics/
│   ├── IndustrySpecificProgress.tsx # Sector-specific skill development tracking
│   ├── MeetingTypeEffectiveness.tsx # Meeting-specific communication advancement
│   ├── FrameworkMasteryTracker.tsx  # PM framework usage competency development
│   └── PracticeSessionAnalytics.tsx # Practice session effectiveness and pattern analysis
└── MotivationalElements/
    ├── AchievementCelebration.tsx # Milestone achievement recognition and celebration
    ├── StreakTracker.tsx          # Practice consistency and engagement tracking
    ├── ProgressMotivation.tsx     # Encouraging progress messaging and reinforcement
    └── CommunityComparison.tsx    # Anonymous peer progress comparison for motivation
```

### Mock Data Requirements
Create comprehensive progress tracking with realistic advancement patterns:

#### Overall Progress Metrics
```typescript
const mockProgressData = {
  careerProgression: {
    currentLevel: 'PM',
    targetLevel: 'SENIOR_PM',
    overallReadiness: 78, // percentage
    timeToTarget: '4-6 months',
    monthlyProgressRate: 8.2, // percentage points per month
    confidenceLevel: 'HIGH'
  },
  
  skillDevelopmentSummary: {
    overallScore: 7.4, // out of 10
    monthlyImprovement: +0.3,
    yearlyImprovement: +2.1,
    strongestAreas: ['Framework Application', 'Communication Structure'],
    developmentPriorities: ['Executive Presence', 'Industry Fluency'],
    practiceSessionsCompleted: 47,
    totalPracticeHours: 23.5
  },
  
  recentMilestones: [
    {
      achievement: 'Executive Communication Breakthrough',
      date: '2024-03-15',
      description: 'Consistently uses answer-first methodology in practice sessions',
      careerImpact: 'Critical advancement toward Senior PM readiness',
      celebrationLevel: 'MAJOR'
    },
    {
      achievement: 'RICE Framework Mastery',
      date: '2024-03-08',
      description: 'Sophisticated trade-off articulation with multiple factor integration',
      careerImpact: 'Enhanced strategic decision communication',
      celebrationLevel: 'MAJOR'
    }
  ]
}
```

#### Skill Dimension Progress Tracking
```typescript
const mockSkillProgressTracking = [
  {
    dimension: 'Executive Communication',
    currentScore: 7.8,
    targetScore: 8.5,
    progressTrend: 'IMPROVING',
    monthlyGrowthRate: 0.2,
    practiceSessionImpact: +0.15, // per session
    nextMilestone: 'Board presentation confidence',
    timeToMilestone: '3-4 weeks',
    specificEvidence: [
      'Consistent answer-first structure usage',
      'Improved confidence in trade-off articulation',
      'Better time management in executive summaries'
    ]
  },
  {
    dimension: 'Industry Fluency - Fintech',
    currentScore: 6.9,
    targetScore: 8.2,
    progressTrend: 'IMPROVING',
    monthlyGrowthRate: 0.18,
    practiceSessionImpact: +0.12,
    nextMilestone: 'Regulatory compliance communication',
    timeToMilestone: '4-6 weeks',
    specificEvidence: [
      'Strong ROI communication but weak regulatory context',
      'Excellent customer focus development',
      'Improving risk management vocabulary'
    ]
  },
  {
    dimension: 'Framework Application',
    currentScore: 8.7,
    targetScore: 9.0,
    progressTrend: 'STABLE',
    monthlyGrowthRate: 0.05,
    practiceSessionImpact: +0.03,
    nextMilestone: 'Advanced framework integration',
    timeToMilestone: '6-8 weeks',
    specificEvidence: [
      'Excellent RICE framework mastery',
      'Sophisticated trade-off reasoning',
      'Strong framework teaching ability'
    ]
  }
]
```

#### Benchmark and Comparison Data
```typescript
const mockBenchmarkData = {
  industryBenchmarks: {
    fintech: {
      averageScore: 7.1,
      topPerformerScore: 8.8,
      userPercentile: 82,
      keyCompetencies: [
        'Regulatory compliance communication',
        'Risk management articulation',
        'Financial metrics fluency'
      ]
    }
  },
  
  roleLevelBenchmarks: {
    seniorPM: {
      requiredScore: 8.0,
      averageTimeToAchieve: '6-9 months',
      criticalCompetencies: [
        'Executive communication excellence',
        'Trade-off articulation sophistication',
        'Strategic altitude control'
      ],
      userReadinessAssessment: 'On track for 4-6 month timeline'
    }
  },
  
  faangStandards: {
    amazon: {
      leadershipPrinciples: 'Strong bias for action, customer obsession evident',
      communicationStyle: 'Answer-first methodology consistently applied',
      readinessLevel: 'Senior PM ready with continued practice'
    },
    google: {
      dataOrientation: 'Excellent OKR and metrics communication',
      structuredThinking: 'Strong framework application and reasoning',
      readinessLevel: 'Senior PM ready'
    }
  }
}
```

#### Historical Progress Timeline
```typescript
const mockProgressTimeline = [
  {
    period: '2024-03',
    overallScore: 7.4,
    keyImprovements: ['Executive presence breakthrough', 'RICE mastery achievement'],
    practiceHours: 8.5,
    milestonesAchieved: 2
  },
  {
    period: '2024-02', 
    overallScore: 7.1,
    keyImprovements: ['Answer-first consistency', 'Framework application improvement'],
    practiceHours: 6.2,
    milestonesAchieved: 1
  },
  {
    period: '2024-01',
    overallScore: 6.8,
    keyImprovements: ['Stakeholder adaptation', 'Communication structure development'],
    practiceHours: 5.8,
    milestonesAchieved: 1
  }
]
```

---

## User Experience Requirements

### Progress Dashboard Interface Design
Create motivational, comprehensive progress visualization that celebrates advancement:

#### Main Progress Overview
- **Career Progression Highlight**: Prominent career advancement visualization with timeline and readiness
- **Achievement Celebration**: Recent milestone achievements with impact description and recognition
- **Skill Development Summary**: Multi-dimensional progress with clear improvement trends
- **Next Steps Clarity**: Upcoming milestones and development priorities with specific timelines

#### Interactive Progress Exploration
- **Skill Radar Visualization**: Interactive multi-dimensional skill radar with historical comparison
- **Progress Timeline**: Historical advancement tracking with milestone achievement celebration
- **Benchmark Integration**: Industry and role-level comparison with aspirational goal setting
- **Detailed Analytics**: Deep-dive analysis with evidence and improvement pattern recognition

#### Motivational Progress Elements
- **Streak Tracking**: Practice consistency recognition with achievement celebration
- **Improvement Celebration**: Progress highlighting with specific advancement recognition
- **Milestone Anticipation**: Upcoming achievement preview with encouragement and timeline
- **Peer Inspiration**: Anonymous community comparison for motivation and goal setting

### Career Context Integration
- **Transition Timeline**: Clear visualization of progress toward specific career goals
- **Readiness Assessment**: Current transition readiness with specific competency gap identification
- **Industry Specialization**: Sector-specific skill development tracking with benchmark comparison
- **Meeting Type Mastery**: Communication effectiveness across different meeting contexts

---

## Success Validation Criteria

### Progress Tracking Quality Validation
- **Accuracy**: Progress metrics accurately reflect user skill development and advancement
- **Motivation**: Dashboard encourages continued practice and skill development engagement
- **Career Relevance**: All progress tracking directly connects to specific career progression goals
- **Actionability**: Progress insights lead to specific development actions and practice priorities

### User Experience Validation  
- **Engagement**: Users regularly visit dashboard and explore progress insights
- **Clarity**: Progress visualization is easy to understand and interpret without confusion
- **Inspiration**: Dashboard motivates continued practice and skill development effort
- **Mobile Optimization**: Full progress dashboard experience accessible on mobile devices

### Framework Integration Validation
- **Career Transition Support**: Dashboard effectively supports all PM transition pattern tracking
- **Industry Context Integration**: Healthcare, cybersecurity, fintech, enterprise, consumer progress visualization
- **Meeting Type Development**: Progress tracking for specific meeting communication advancement
- **Continuous Learning**: Dashboard integrates seamlessly with overall skill development framework

---

*Implementation Time Estimate: 5-6 hours*
*Success Criteria: Comprehensive progress dashboard with career-intelligent advancement tracking and motivational development visualization*