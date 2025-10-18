# Component Requirements Matrix
## Detailed UI Component Specifications

**Version:** 1.0  
**Date:** October 16, 2025  
**Epic:** Epic 3 - Frontend Integration  
**Status:** Implementation Ready  

---

## Overview

This document provides detailed specifications for every UI component in the ShipSpeak frontend application. Each component is defined with its props, state management, behavior, accessibility requirements, and testing criteria.

---

## Component Hierarchy

```
App
├── Providers (Auth, Theme, Query)
├── Layouts
│   ├── AuthLayout
│   ├── DashboardLayout
│   └── PracticeLayout
├── Pages
│   ├── Authentication
│   ├── Dashboard
│   ├── Meetings
│   ├── Practice
│   └── Companies
└── Components
    ├── Core (Button, Input, Card)
    ├── Dashboard (Growth, Stats)
    ├── Meetings (Upload, Analysis)
    ├── Practice (Scenario, Session)
    └── Companies (Selector, Readiness)
```

---

## Core Components

### 1. Button Component

**Component:** `components/ui/button.tsx`  
**Priority:** P0 (Critical)  
**Extends:** shadcn/ui Button

#### Props Interface
```typescript
interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}
```

#### State Management
- Loading state with spinner
- Disabled state with reduced opacity
- Hover/focus states for interactivity

#### Behavior
- Prevents double-clicks during async operations
- Shows loading spinner when `loading=true`
- Keyboard navigation support (Enter/Space)
- Focus trap when in modal contexts

#### Accessibility
- ARIA labels for icon-only buttons
- Role="button" for non-button elements
- Keyboard focus indicators
- Screen reader announcements for state changes

#### Testing Requirements
- [ ] Renders all variants correctly
- [ ] Handles click events
- [ ] Shows loading state
- [ ] Prevents interaction when disabled
- [ ] Keyboard navigation works

---

### 2. Input Component

**Component:** `components/ui/input.tsx`  
**Priority:** P0 (Critical)  
**Extends:** shadcn/ui Input

#### Props Interface
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}
```

#### State Management
- Controlled/uncontrolled modes
- Error state display
- Focus state tracking
- Character count for maxLength

#### Behavior
- Real-time validation feedback
- Clear button for text inputs
- Password visibility toggle
- Auto-format for phone/credit card

#### Accessibility
- Label association with for/id
- Error messages linked via aria-describedby
- Required fields marked with aria-required
- Keyboard navigation support

---

### 3. Card Component

**Component:** `components/ui/card.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated' | 'company';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  selected?: boolean;
  companyAccent?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

#### Company Variant Features
- Dynamic accent color based on company
- Subtle branding without being distracting
- Hover state with accent highlight

---

## Dashboard Components

### 4. GrowthOverview Component

**Component:** `components/dashboard/growth-overview.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface GrowthOverviewProps {
  user: User;
  targetCompanies: Company[];
  currentReadiness: ReadinessScores;
  skillGaps: SkillGap[];
  timelineProjection: TimelineData;
  onCompanySelect: (companyId: string) => void;
  onPracticeStart: () => void;
}
```

#### State Management
```typescript
const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
```

#### Behavior
- Animated transitions between companies
- Progressive disclosure of details
- Real-time updates via WebSocket
- Responsive layout changes

#### Sub-components
1. **ReadinessScore** - Circular progress indicator
2. **SkillGapList** - Prioritized improvement areas
3. **TimelineProjection** - Estimated timeline to readiness
4. **QuickActions** - CTA buttons for practice

#### Testing Requirements
- [ ] Displays correct readiness percentages
- [ ] Handles company selection
- [ ] Updates in real-time
- [ ] Responsive on mobile
- [ ] Accessibility compliant

---

### 5. DailyChallenge Component

**Component:** `components/dashboard/daily-challenge.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface DailyChallengeProps {
  challenge: DailyChallenge | null;
  streak: number;
  lastCompleted?: Date;
  onStart: () => void;
  onSkip: () => void;
  loading?: boolean;
}
```

#### State Management
```typescript
const [expanded, setExpanded] = useState(false);
const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
```

#### Behavior
- Countdown timer for challenge availability
- Streak visualization with fire icon
- Preview expansion on hover/tap
- Motivational messages based on streak

---

## Meeting Components

### 6. MeetingUpload Component

**Component:** `components/meetings/upload-zone.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface MeetingUploadProps {
  onFileSelect: (file: File) => void;
  onUploadStart: () => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (meetingId: string) => void;
  onError: (error: Error) => void;
  maxFileSize?: number;
  acceptedFormats?: string[];
  multiple?: boolean;
}
```

#### State Management
```typescript
const [isDragging, setIsDragging] = useState(false);
const [files, setFiles] = useState<File[]>([]);
const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
const [errors, setErrors] = useState<Record<string, string>>({});
```

#### Behavior
- Drag & drop with visual feedback
- File validation (size, format)
- Multiple file queue management
- Chunked upload with resume
- Progress bars per file
- Cancel upload capability

#### Accessibility
- Keyboard-only file selection
- Screen reader announcements
- Progress updates for assistive tech
- Error message associations

---

### 7. AnalysisProgress Component

**Component:** `components/meetings/analysis-progress.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface AnalysisProgressProps {
  meetingId: string;
  initialStatus?: AnalysisStatus;
  onComplete: (results: AnalysisResults) => void;
  onError: (error: Error) => void;
  showCostSavings?: boolean;
}
```

#### State Management
```typescript
const [status, setStatus] = useState<AnalysisStatus>(initialStatus);
const [progress, setProgress] = useState(0);
const [currentStep, setCurrentStep] = useState('');
const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
const [costSavings, setCostSavings] = useState<CostData | null>(null);
```

#### WebSocket Integration
```typescript
useWebSocket({
  room: `analysis_${meetingId}`,
  events: {
    'analysis:progress': (data) => {
      setProgress(data.percentage);
      setCurrentStep(data.step);
      setEstimatedTime(data.estimatedRemaining);
    },
    'analysis:complete': (data) => {
      setStatus('completed');
      onComplete(data.results);
    },
    'analysis:error': (error) => {
      setStatus('failed');
      onError(error);
    }
  }
});
```

#### Visual Elements
- Step-by-step progress indicator
- Animated progress bar
- Real-time status messages
- Cost savings visualization
- Estimated time remaining

---

## Practice Components

### 8. ScenarioCard Component

**Component:** `components/practice/scenario-card.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface ScenarioCardProps {
  scenario: Scenario;
  companyContext?: Company;
  userProgress?: ScenarioProgress;
  recommended?: boolean;
  onSelect: (scenarioId: string) => void;
  onBookmark: (scenarioId: string) => void;
  variant?: 'compact' | 'detailed';
}
```

#### Visual Design
- Difficulty badge (Foundation/Practice/Mastery)
- Duration estimate
- Skill tags
- Company logo if applicable
- Progress indicator if attempted
- Recommendation badge

---

### 9. PracticeSession Component

**Component:** `components/practice/practice-session.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface PracticeSessionProps {
  scenario: Scenario;
  sessionId: string;
  mode: 'guided' | 'freeform' | 'timed';
  onResponse: (response: PracticeResponse) => void;
  onComplete: (results: SessionResults) => void;
  onExit: () => void;
}
```

#### State Management
```typescript
const [phase, setPhase] = useState<'intro' | 'practice' | 'feedback'>('intro');
const [response, setResponse] = useState('');
const [recording, setRecording] = useState(false);
const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
const [hints, setHints] = useState<string[]>([]);
const [feedback, setFeedback] = useState<Feedback | null>(null);
```

#### Sub-components
1. **ScenarioDisplay** - Context and challenge presentation
2. **ResponseRecorder** - Voice/text input
3. **TimerDisplay** - For timed mode
4. **HintSystem** - Progressive hints
5. **FeedbackDisplay** - AI coaching feedback

#### Behavior
- Voice recording with waveform visualization
- Text input with auto-save
- Real-time hints via WebSocket
- Timer countdown for timed mode
- Phase transitions with animations

---

### 10. SocraticDialogue Component

**Component:** `components/practice/socratic-dialogue.tsx`  
**Priority:** P1 (High)  

#### Props Interface
```typescript
interface SocraticDialogueProps {
  sessionId: string;
  initialContext: DialogueContext;
  onMessageSend: (message: string) => void;
  onComplete: (insights: Insights) => void;
}
```

#### State Management
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [inputValue, setInputValue] = useState('');
const [thinking, setThinking] = useState(false);
const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
```

#### Chat Interface Features
- Message bubbles with sender identification
- Typing indicator for AI responses
- Message timestamps
- Copy message functionality
- Export conversation option

---

## Company Components

### 11. CompanySelector Component

**Component:** `components/companies/company-selector.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface CompanySelectorProps {
  selectedCompanies: Company[];
  maxSelections?: number;
  onSelect: (companies: Company[]) => void;
  showReadiness?: boolean;
  variant?: 'onboarding' | 'settings' | 'dashboard';
}
```

#### State Management
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
const [loadingReadiness, setLoadingReadiness] = useState(false);
```

#### Features
- Search with fuzzy matching
- Category filters (Tech, Finance, etc.)
- Multi-select with checkboxes
- Preview cards on hover
- Readiness preview if available
- Selection limit enforcement

---

### 12. ReadinessChart Component

**Component:** `components/companies/readiness-chart.tsx`  
**Priority:** P1 (High)  

#### Props Interface
```typescript
interface ReadinessChartProps {
  data: ReadinessData[];
  companies: Company[];
  variant?: 'radar' | 'bar' | 'progress';
  interactive?: boolean;
  onSkillClick?: (skill: string) => void;
  height?: number;
  showLegend?: boolean;
}
```

#### Chart Variants
1. **Radar Chart** - Multi-dimensional skill comparison
2. **Bar Chart** - Side-by-side skill gaps
3. **Progress Rings** - Individual company readiness

#### Responsive Behavior
- Simplified view on mobile
- Touch gestures for interaction
- Collapsible legend
- Export as image option

---

## Data Visualization Components

### 13. ProgressRing Component

**Component:** `components/charts/progress-ring.tsx`  
**Priority:** P1 (High)  

#### Props Interface
```typescript
interface ProgressRingProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
  duration?: number;
}
```

#### Animation Features
- Smooth fill animation on mount
- Value change transitions
- Hover scale effect
- Completion celebration

---

### 14. SkillTree Component

**Component:** `components/charts/skill-tree.tsx`  
**Priority:** P2 (Medium)  

#### Props Interface
```typescript
interface SkillTreeProps {
  skills: SkillNode[];
  userProgress: UserSkillProgress;
  onNodeClick?: (skillId: string) => void;
  variant?: 'tree' | 'linear' | 'grid';
  showUnlockAnimation?: boolean;
}
```

#### Visual Design
- Hierarchical node layout
- Connection lines between skills
- Lock/unlock states
- Progress indicators per node
- Hover tooltips with details

---

## Layout Components

### 15. DashboardLayout Component

**Component:** `components/layouts/dashboard-layout.tsx`  
**Priority:** P0 (Critical)  

#### Props Interface
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  activeSection?: string;
  showNotifications?: boolean;
}
```

#### Layout Structure
```
┌──────────────────────────────────┐
│         Top Navigation           │
├────────┬─────────────────────────┤
│        │                         │
│  Side  │      Main Content       │
│  Nav   │                         │
│        │                         │
└────────┴─────────────────────────┘
```

#### Responsive Behavior
- Collapsible sidebar on tablet
- Bottom navigation on mobile
- Hamburger menu for small screens
- Persistent header

---

## Mobile-Specific Components

### 16. MobileNav Component

**Component:** `components/mobile/mobile-nav.tsx`  
**Priority:** P1 (High)  

#### Props Interface
```typescript
interface MobileNavProps {
  activeRoute: string;
  user: User;
  notificationCount?: number;
  onNavigate: (route: string) => void;
}
```

#### Bottom Navigation Items
1. Dashboard (Home icon)
2. Meetings (Upload icon)
3. Practice (Play icon)
4. Companies (Building icon)
5. Profile (User icon)

---

## Accessibility Components

### 17. ScreenReaderAnnouncer Component

**Component:** `components/a11y/screen-reader-announcer.tsx`  
**Priority:** P1 (High)  

#### Props Interface
```typescript
interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}
```

#### Implementation
```typescript
return (
  <div
    role="status"
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);
```

---

## Testing Requirements Matrix

### Component Testing Coverage

| Component | Unit Tests | Integration Tests | E2E Tests | A11y Tests |
|-----------|------------|------------------|-----------|------------|
| Button | ✓ | ✓ | ✓ | ✓ |
| Input | ✓ | ✓ | ✓ | ✓ |
| Card | ✓ | ✓ | - | ✓ |
| GrowthOverview | ✓ | ✓ | ✓ | ✓ |
| DailyChallenge | ✓ | ✓ | ✓ | ✓ |
| MeetingUpload | ✓ | ✓ | ✓ | ✓ |
| AnalysisProgress | ✓ | ✓ | - | ✓ |
| ScenarioCard | ✓ | ✓ | - | ✓ |
| PracticeSession | ✓ | ✓ | ✓ | ✓ |
| CompanySelector | ✓ | ✓ | ✓ | ✓ |
| ReadinessChart | ✓ | ✓ | - | ✓ |

### Test Scenarios Per Component

#### Critical User Flows
1. **Onboarding Flow**
   - CompanySelector → SkillAssessment → GrowthOverview
   
2. **Meeting Analysis Flow**
   - MeetingUpload → AnalysisProgress → ResultsDisplay
   
3. **Practice Session Flow**
   - ScenarioCard → PracticeSession → FeedbackDisplay
   
4. **Dashboard Navigation**
   - DashboardLayout → GrowthOverview → DailyChallenge

---

## Performance Requirements

### Component Load Times
- Initial render: < 50ms
- Re-render: < 16ms (60fps)
- Lazy-loaded: < 200ms

### Bundle Size Limits
- Core components: < 50KB
- Dashboard components: < 100KB
- Chart components: < 150KB
- Total bundle: < 500KB

### Memory Management
- Cleanup subscriptions on unmount
- Debounce expensive operations
- Virtualize long lists
- Lazy load heavy components

---

## Style Guide

### Component Styling Rules
1. Use Tailwind utility classes primarily
2. CSS modules for complex animations
3. CSS variables for theming
4. No inline styles except for dynamic values
5. Consistent spacing using design tokens

### Naming Conventions
- Components: PascalCase
- Props: camelCase
- CSS classes: kebab-case
- Data attributes: data-testid

### File Structure
```
component-name/
├── index.tsx           # Main component
├── types.ts           # TypeScript interfaces
├── styles.module.css  # Component styles (if needed)
├── utils.ts          # Helper functions
└── __tests__/        # Component tests
```

---

## Component Library Documentation

Each component should include:
1. Storybook stories for all variants
2. JSDoc comments for props
3. Usage examples in README
4. Accessibility notes
5. Performance considerations

---

This component requirements matrix ensures consistent, accessible, and performant UI components across the ShipSpeak platform, with clear specifications for implementation and testing.