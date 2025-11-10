# ShipSpeak Phase 1 Implementation Prompt
## Slice 1-2: Authentication & Career-Focused Onboarding

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's authentication system with critical two-path fork that immediately connects users to their PM career progression goals and industry context.

---

## Implementation Target: Authentication & Career-Focused Onboarding
**Development Time**: 3 hours  
**Slice ID**: 1-2 "Authentication & Career-Focused Onboarding"

### Core Purpose
Complete signup/login with critical two-path fork that immediately connects users to their PM career progression goals and industry context, supporting executive PM maintenance alongside growth trajectories.

---

## Critical Framework Integration

### PM Career Transition Assessment (MANDATORY)
The onboarding must capture and support all PM career paths:

#### Career Transition Identification
- **Current Role Assessment**: PO, PM, Senior PM, Group PM, Director, VP, CPO with transition pattern recognition
- **Target Role Selection**: Clear progression path with timeline expectations and competency requirements
- **Executive Maintenance Path**: Directors+ seeking board presentation mastery, speaking engagement excellence, crisis communication readiness
- **Industry Context Capture**: Healthcare, Cybersecurity, Fintech, Enterprise, Consumer selection with sector-specific communication requirements

#### Two-Path Fork Enhanced Logic
- **Path A (Meeting Analysis)**: For PMs with upcoming board meetings, planning sessions, stakeholder presentations, or crisis communications
- **Path B (Practice First)**: For POs transitioning to PM, new PMs building confidence, or executives perfecting presentation skills
- **Executive Fast Track**: Automatic identification of Director+ users for specialized executive development workflow

### Multi-Dimensional Competency Baseline Assessment
Onboarding must establish baseline across 5 PM competency areas:

#### 1. Product Sense & Strategic Thinking Baseline (20-95% scale)
- **Quick Assessment Questions**: User problem identification scenarios, framework familiarity (RICE, ICE, Jobs-to-be-Done)
- **Market Context Evaluation**: Industry awareness, competitive landscape understanding, strategic positioning recognition

#### 2. Communication & Executive Presence Baseline (15-90% scale)
- **Presentation Comfort Assessment**: Board presentation experience, speaking engagement history, crisis communication exposure
- **Answer-First Structure Familiarity**: Executive communication preference evaluation, conclusion-driven thinking assessment

#### 3. Stakeholder Management & Cross-Functional Leadership Baseline (25-85% scale)
- **Multi-Audience Experience**: Engineer, designer, executive, customer communication comfort levels
- **Conflict Resolution History**: Difficult conversation management, consensus building experience, escalation effectiveness

#### 4. Technical Translation & Data Fluency Baseline (30-80% scale)
- **Complexity Simplification Experience**: Technical concept explanation comfort, business stakeholder communication history
- **Data Presentation Confidence**: Analytics communication, metrics storytelling, risk articulation experience

#### 5. Business Impact & Organizational Leadership Baseline (10-95% scale)
- **ROI Communication Experience**: Business case development, revenue impact articulation, cost optimization presentation
- **Organizational Communication History**: All-hands presentation experience, culture development participation, vision setting involvement

---

## Technical Implementation Requirements

### Enhanced Onboarding Flow (4 Steps)

#### Step 1: Role & Transition Context Assessment
```typescript
const RoleAssessmentStep = {
  currentRoleSelection: {
    options: ['Product Owner', 'PM', 'Senior PM', 'Group PM', 'Director', 'VP Product', 'CPO'],
    experienceLevel: 'months in current role',
    industryExperience: 'years in industry'
  },
  targetRoleSelection: {
    options: 'based on current role progression',
    timeline: 'realistic advancement timeline',
    motivations: ['Board presentation skills', 'Executive presence', 'Team leadership', 'Strategic communication']
  },
  executiveIdentification: {
    trigger: 'Director+ selection',
    specializedFlow: 'Executive maintenance vs advancement',
    priorityAccess: 'Board presentation, speaking engagement, crisis communication modules'
  }
}
```

#### Step 2: Industry Context & Communication Requirements
```typescript
const IndustrySelectionStep = {
  sectorSelection: {
    healthcare: 'FDA communication, clinical stakeholders, patient safety messaging',
    cybersecurity: 'Risk communication, incident response, compliance stakeholders',
    fintech: 'Regulatory compliance, financial risk, trust-building, investor relations',
    enterprise: 'ROI communication, customer success, implementation planning, B2B stakeholders',
    consumer: 'User engagement, growth metrics, behavioral psychology, platform dynamics'
  }
}
```

#### Step 3: Multi-Dimensional Competency Baseline
```typescript
const CompetencyBaselineStep = {
  productSenseAssessment: {
    userProblemIdentification: 'scenario-based quick assessment',
    frameworkFamiliarity: 'RICE, ICE, Jobs-to-be-Done experience level',
    marketContextAwareness: 'competitive landscape understanding',
    baselineScore: 'calibrated for career level and industry'
  },
  communicationAssessment: {
    executivePresentation: 'board presentation experience and comfort level',
    answerFirstStructure: 'conclusion-driven communication preference',
    stakeholderAdaptation: 'multi-audience communication experience',
    baselineScore: 'executive development potential identification'
  }
}
```

#### Step 4: Learning Path Selection with AI Recommendation
```typescript
const PathSelectionStep = {
  pathRecommendation: {
    meetingAnalysisPath: 'recommended for users with upcoming presentations, board meetings, stakeholder reviews',
    practiceFirstPath: 'recommended for skill building, confidence development, foundational competency improvement',
    executiveFastTrack: 'automatic for Director+ users focusing on board excellence, speaking mastery, crisis communication'
  }
}
```

---

## Implementation Checklist

### Phase 1: Authentication Foundation ✅
- [ ] Mock localStorage authentication with career context persistence
- [ ] Protected routes with intelligent redirect based on onboarding completion
- [ ] Career transition data model with PM role progression support
- [ ] Executive user identification and priority access routing

### Phase 2: Onboarding Wizard Implementation ✅
- [ ] 4-step wizard with progress tracking and career context capture
- [ ] Multi-dimensional competency baseline assessment with 5-point radar establishment
- [ ] Industry-specific onboarding variations with regulatory context awareness
- [ ] Two-path fork logic with AI-powered recommendation engine

### Phase 3: Executive Onboarding Specialization ✅
- [ ] Director+ identification with specialized executive development workflow
- [ ] Board presentation needs assessment with quarterly deck preparation focus
- [ ] Speaking engagement interest capture with conference preparation and thought leadership positioning
- [ ] Crisis communication preparedness evaluation with organizational leadership scenario assessment

### Phase 4: Integration & Polish ✅
- [ ] Seamless transition to appropriate dashboard based on selected path
- [ ] Competency baseline integration with progress tracking system
- [ ] Industry context persistence across all platform interactions
- [ ] Executive access level configuration with premium feature unlocking

---

*Implementation Time Estimate: 3 hours*
*Success Criteria: Career-intelligent onboarding system that immediately connects users to appropriate PM development path with executive support*