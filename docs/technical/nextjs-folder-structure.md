# Next.js App Router Folder Structure Template
## ShipSpeak Frontend Implementation Guide

**Version:** 1.0  
**Date:** October 4, 2025  
**Document Type:** Development Template  
**Framework:** Next.js 14 with App Router  

---

## Project Structure Overview

```
apps/web/                             # Next.js web application
├── README.md                         # Setup and development instructions
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration  
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── .env.local                        # Environment variables (git ignored)
├── .env.example                      # Environment variables template
│
├── public/                           # Static assets
│   ├── icons/                        # App icons and favicons
│   ├── images/                       # Static images
│   ├── logos/                        # Company logos
│   └── mockdata/                     # Mock JSON data for development
│
├── src/                              # Source code
│   ├── app/                          # App Router pages and layouts
│   ├── components/                   # React components
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Utility libraries and stores
│   ├── types/                        # TypeScript type definitions
│   └── styles/                       # Additional CSS files
│
└── docs/                             # Component documentation
    ├── components.md                 # Component library guide
    └── development.md                # Development workflow
```

---

## App Router Structure (`src/app/`)

### Authentication Routes
```
src/app/
├── (auth)/                           # Route group for authentication
│   ├── layout.tsx                    # Auth layout (centered forms)
│   ├── login/
│   │   ├── page.tsx                  # Login page
│   │   └── loading.tsx               # Login loading state
│   ├── register/
│   │   ├── page.tsx                  # Registration with onboarding
│   │   ├── loading.tsx               # Registration loading
│   │   └── success/
│   │       └── page.tsx              # Registration success
│   └── forgot-password/
│       ├── page.tsx                  # Password reset request
│       └── reset/
│           └── page.tsx              # Password reset form
```

### Dashboard Routes
```
├── (dashboard)/                      # Protected dashboard routes
│   ├── layout.tsx                    # Dashboard shell with navigation
│   ├── page.tsx                      # Main growth dashboard
│   ├── loading.tsx                   # Dashboard loading skeleton
│   ├── error.tsx                     # Dashboard error boundary
│   │
│   ├── onboarding/                   # First-time user setup
│   │   ├── page.tsx                  # Main onboarding flow
│   │   ├── current-role/
│   │   │   └── page.tsx              # Current role assessment
│   │   ├── target-companies/
│   │   │   └── page.tsx              # Company selection (required)
│   │   ├── skill-assessment/
│   │   │   └── page.tsx              # Baseline skill evaluation
│   │   └── growth-path/
│   │       └── page.tsx              # Generated growth pathway
│   │
│   ├── meetings/                     # Meeting analysis
│   │   ├── page.tsx                  # Meeting upload & history
│   │   ├── upload/
│   │   │   └── page.tsx              # File upload interface
│   │   └── [meetingId]/
│   │       ├── page.tsx              # Meeting analysis results
│   │       ├── loading.tsx           # Analysis loading state
│   │       └── analysis/
│   │           └── page.tsx          # Detailed analysis view
│   │
│   ├── practice/                     # Practice sessions
│   │   ├── page.tsx                  # Practice session selection
│   │   ├── scenarios/
│   │   │   ├── page.tsx              # Browse scenarios
│   │   │   └── [scenarioId]/
│   │   │       └── page.tsx          # Scenario details
│   │   ├── sessions/
│   │   │   └── [sessionId]/
│   │   │       ├── page.tsx          # Active practice session
│   │   │       ├── loading.tsx       # Session loading
│   │   │       └── results/
│   │   │           └── page.tsx      # Session feedback & scoring
│   │   └── history/
│   │       └── page.tsx              # Practice session history
│   │
│   ├── companies/                    # Company readiness tracking
│   │   ├── page.tsx                  # Company browse & search
│   │   ├── compare/
│   │   │   └── page.tsx              # Multi-company comparison
│   │   ├── [companyId]/
│   │   │   ├── page.tsx              # Company profile & rubrics
│   │   │   ├── loading.tsx           # Company loading state
│   │   │   ├── readiness/
│   │   │   │   └── page.tsx          # Detailed readiness analysis
│   │   │   └── scenarios/
│   │   │       └── page.tsx          # Company-specific scenarios
│   │   └── targets/
│   │       └── page.tsx              # Manage target companies
│   │
│   ├── progress/                     # Progress tracking & analytics
│   │   ├── page.tsx                  # Overall progress dashboard
│   │   ├── skills/
│   │   │   ├── page.tsx              # Skill breakdown analysis
│   │   │   └── [skillId]/
│   │   │       └── page.tsx          # Individual skill progress
│   │   ├── milestones/
│   │   │   └── page.tsx              # Achievement tracking
│   │   └── timeline/
│   │       └── page.tsx              # Progress timeline view
│   │
│   └── settings/                     # User settings
│       ├── page.tsx                  # General settings
│       ├── profile/
│       │   └── page.tsx              # Profile management
│       ├── preferences/
│       │   └── page.tsx              # Practice preferences
│       └── notifications/
│           └── page.tsx              # Notification settings
```

### API Routes
```
├── api/                              # API route handlers
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts              # POST /api/auth/login
│   │   ├── register/
│   │   │   └── route.ts              # POST /api/auth/register
│   │   ├── refresh/
│   │   │   └── route.ts              # POST /api/auth/refresh
│   │   └── logout/
│   │       └── route.ts              # POST /api/auth/logout
│   │
│   ├── companies/
│   │   ├── route.ts                  # GET /api/companies (browse)
│   │   ├── [companyId]/
│   │   │   └── route.ts              # GET /api/companies/[id]
│   │   └── readiness/
│   │       └── route.ts              # GET /api/companies/readiness
│   │
│   ├── practice/
│   │   ├── scenarios/
│   │   │   ├── route.ts              # GET /api/practice/scenarios
│   │   │   └── [scenarioId]/
│   │   │       └── route.ts          # GET /api/practice/scenarios/[id]
│   │   └── sessions/
│   │       ├── route.ts              # POST /api/practice/sessions
│   │       └── [sessionId]/
│   │           ├── route.ts          # GET/PUT /api/practice/sessions/[id]
│   │           └── submit/
│   │               └── route.ts      # POST /api/practice/sessions/[id]/submit
│   │
│   ├── meetings/
│   │   ├── route.ts                  # GET/POST /api/meetings
│   │   ├── upload/
│   │   │   └── route.ts              # POST /api/meetings/upload
│   │   └── [meetingId]/
│   │       ├── route.ts              # GET /api/meetings/[id]
│   │       └── analysis/
│   │           └── route.ts          # GET /api/meetings/[id]/analysis
│   │
│   └── user/
│       ├── profile/
│       │   └── route.ts              # GET/PUT /api/user/profile
│       ├── progress/
│       │   └── route.ts              # GET /api/user/progress
│       └── preferences/
│           └── route.ts              # GET/PUT /api/user/preferences
```

### Global App Files
```
├── layout.tsx                        # Root layout (providers, fonts)
├── loading.tsx                       # Global loading UI
├── error.tsx                         # Global error boundary
├── not-found.tsx                     # 404 page
├── globals.css                       # Global styles & CSS variables
└── page.tsx                          # Landing page (redirects to dashboard)
```

---

## Components Structure (`src/components/`)

### UI Foundation
```
src/components/
├── ui/                               # shadcn/ui base components
│   ├── button.tsx                    # Button variants and sizes
│   ├── card.tsx                      # Card layouts
│   ├── input.tsx                     # Form inputs
│   ├── select.tsx                    # Dropdown selects
│   ├── dialog.tsx                    # Modal dialogs
│   ├── progress.tsx                  # Progress bars
│   ├── skeleton.tsx                  # Loading skeletons
│   ├── toast.tsx                     # Toast notifications
│   └── index.ts                      # Re-exports
```

### Growth & Progress Components
```
├── growth/                           # Growth-focused components
│   ├── growth-overview.tsx           # Main dashboard growth section
│   ├── progress-ring.tsx             # Circular progress indicators
│   ├── milestone-tracker.tsx         # Achievement progress
│   ├── skill-gap-chart.tsx           # Skill gap visualization
│   ├── growth-timeline.tsx           # Progress timeline
│   ├── readiness-score.tsx           # Company readiness display
│   └── next-practice.tsx             # Recommended practice widget
```

### Company Components
```
├── companies/                        # Company-specific components
│   ├── company-card.tsx              # Company preview cards
│   ├── company-selector.tsx          # Multi-select for targets
│   ├── company-logo.tsx              # Company logo with fallback
│   ├── readiness-dashboard.tsx       # Company readiness overview
│   ├── comparison-table.tsx          # Side-by-side comparison
│   ├── company-profile.tsx           # Full company profile
│   └── rubric-visualization.tsx      # Company rubric display
```

### Charts & Data Visualization
```
├── charts/                           # Data visualization components
│   ├── readiness-radar.tsx           # Radar chart for skills
│   ├── progress-bar-chart.tsx        # Horizontal progress bars
│   ├── skill-comparison.tsx          # Multi-company skill comparison
│   ├── timeline-chart.tsx            # Progress over time
│   ├── gap-analysis.tsx              # Skill gap breakdown
│   └── chart-container.tsx           # Common chart wrapper
```

### Practice & Sessions
```
├── practice/                         # Practice session components
│   ├── scenario-card.tsx             # Scenario preview cards
│   ├── scenario-display.tsx          # Full scenario presentation
│   ├── response-recorder.tsx         # Voice/text response capture
│   ├── live-feedback.tsx             # Real-time coaching hints
│   ├── session-timer.tsx             # Practice session timer
│   ├── feedback-display.tsx          # Post-session feedback
│   └── session-summary.tsx           # Session results overview
```

### Dashboard Components
```
├── dashboard/                        # Dashboard-specific components
│   ├── dashboard-shell.tsx           # Main dashboard layout
│   ├── navigation.tsx                # Dashboard navigation
│   ├── sidebar.tsx                   # Collapsible sidebar
│   ├── header.tsx                    # Dashboard header
│   ├── daily-summary.tsx             # Today's summary widget
│   ├── quick-actions.tsx             # Quick action buttons
│   └── notification-center.tsx       # Notification dropdown
```

### Meeting Analysis
```
├── meetings/                         # Meeting analysis components
│   ├── upload-zone.tsx               # Drag & drop file upload
│   ├── upload-progress.tsx           # Upload progress indicator
│   ├── analysis-progress.tsx         # Real-time analysis progress
│   ├── analysis-results.tsx          # Meeting insights display
│   ├── transcript-viewer.tsx         # Audio transcript with highlights
│   ├── critical-moments.tsx          # Key moments identification
│   └── meeting-insights.tsx          # AI-generated insights
```

### Forms & Onboarding
```
├── forms/                            # Form components
│   ├── auth-forms.tsx                # Login/register forms
│   ├── onboarding-forms.tsx          # Multi-step onboarding
│   ├── role-assessment.tsx           # Current role assessment
│   ├── company-selection.tsx         # Target company selection
│   ├── skill-assessment.tsx          # Baseline skill evaluation
│   └── form-validation.tsx           # Validation utilities
```

### Common Components
```
├── common/                           # Shared components
│   ├── loading-states.tsx            # Various loading indicators
│   ├── error-boundaries.tsx          # Error handling components
│   ├── empty-states.tsx              # Empty data states
│   ├── confirmation-dialogs.tsx      # Confirmation modals
│   ├── search-input.tsx              # Search with filtering
│   ├── pagination.tsx                # Pagination controls
│   └── breadcrumbs.tsx               # Navigation breadcrumbs
```

---

## Hooks Structure (`src/hooks/`)

### Data Fetching Hooks
```
src/hooks/
├── api/                              # API data hooks
│   ├── use-companies.ts              # Company data fetching
│   ├── use-readiness.ts              # Readiness score fetching
│   ├── use-practice-sessions.ts      # Practice session data
│   ├── use-meetings.ts               # Meeting data and upload
│   ├── use-scenarios.ts              # Scenario data fetching
│   └── use-user-progress.ts          # User progress tracking
```

### UI & Interaction Hooks
```
├── ui/                               # UI interaction hooks
│   ├── use-mobile-detection.ts       # Responsive behavior detection
│   ├── use-websocket.ts              # WebSocket connection management
│   ├── use-local-storage.ts          # Persistent local storage
│   ├── use-debounce.ts               # Input debouncing
│   ├── use-intersection.ts           # Intersection observer
│   └── use-key-press.ts              # Keyboard shortcuts
```

### Business Logic Hooks
```
├── business/                         # Business logic hooks
│   ├── use-growth-calculations.ts    # Growth metrics calculations
│   ├── use-skill-gap-analysis.ts     # Skill gap computations
│   ├── use-milestone-tracking.ts     # Achievement progress
│   ├── use-practice-recommendations.ts # AI practice suggestions
│   └── use-company-comparison.ts     # Multi-company analysis
```

---

## Libraries & Utilities (`src/lib/`)

### State Management
```
src/lib/
├── stores/                           # Zustand stores
│   ├── company-store.ts              # Company selection & data
│   ├── user-store.ts                 # User preferences & profile
│   ├── ui-store.ts                   # UI state management
│   ├── practice-store.ts             # Practice session state
│   └── progress-store.ts             # Progress tracking state
```

### API Client
```
├── api/                              # API client functions
│   ├── client.ts                     # Base API client setup
│   ├── auth.ts                       # Authentication APIs
│   ├── companies.ts                  # Company-related APIs
│   ├── practice.ts                   # Practice session APIs
│   ├── meetings.ts                   # Meeting analysis APIs
│   ├── progress.ts                   # Progress tracking APIs
│   └── types.ts                      # API response types
```

### Utilities
```
├── utils/                            # Utility functions
│   ├── cn.ts                         # className utility (clsx + twMerge)
│   ├── constants.ts                  # App-wide constants
│   ├── formatting.ts                 # Data formatting utilities
│   ├── validation.ts                 # Form validation schemas
│   ├── calculations.ts               # Business logic calculations
│   ├── date-utils.ts                 # Date manipulation
│   ├── chart-helpers.ts              # Chart data transformation
│   └── mock-data.ts                  # Development mock data
```

### Configuration
```
├── config/                           # Configuration files
│   ├── env.ts                        # Environment variable validation
│   ├── constants.ts                  # Application constants
│   ├── companies.ts                  # Company definitions
│   ├── skills.ts                     # Skill categories
│   ├── routes.ts                     # Route definitions
│   └── features.ts                   # Feature flags
```

---

## Type Definitions (`src/types/`)

### Core Types
```
src/types/
├── index.ts                          # Main type exports
├── api.ts                            # API request/response types
├── auth.ts                           # Authentication types
├── user.ts                           # User and profile types
├── company.ts                        # Company and rubric types
├── practice.ts                       # Practice session types
├── meeting.ts                        # Meeting analysis types
├── progress.ts                       # Progress tracking types
├── skill.ts                          # Skill and assessment types
└── ui.ts                             # UI component types
```

### Example Type Definitions
```typescript
// src/types/company.ts
export interface Company {
  id: string;
  name: string;
  domain: CompanyDomain;
  logoUrl: string;
  description: string;
  culturalValues: string[];
  pmLevels: PMLevel[];
  rubrics: CompanyRubric[];
}

export interface CompanyReadiness {
  companyId: string;
  userId: string;
  overallScore: number;
  skillScores: SkillScore[];
  estimatedTimeline: string;
  nextMilestones: Milestone[];
  lastUpdated: Date;
}

// src/types/practice.ts
export interface PracticeSession {
  id: string;
  scenarioId: string;
  userId: string;
  companyFocus?: string;
  status: SessionStatus;
  responses: SessionResponse[];
  feedback: SessionFeedback;
  score: number;
  duration: number;
  completedAt?: Date;
}
```

---

## Styling Structure (`src/styles/`)

```
src/styles/
├── globals.css                       # Global styles & CSS variables
├── components.css                    # Component-specific styles
├── charts.css                        # Chart styling overrides
└── animations.css                    # Custom animations
```

---

## Development Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "analyze": "ANALYZE=true next build",
    "clean": "rm -rf .next",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

---

## Environment Variables (`.env.example`)

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs
OPENAI_API_KEY=your_openai_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_key

# Feature Flags
NEXT_PUBLIC_ENABLE_COMPANY_FEATURES=true
NEXT_PUBLIC_ENABLE_WEBSOCKETS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Development
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
```

---

## Quick Start Commands

### Initial Setup
```bash
# Navigate to web app directory
cd apps/web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Development Workflow
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests in watch mode
npm run test:watch

# Format code
npm run format

# Build for production
npm run build
```

---

This folder structure provides a solid foundation for building the ShipSpeak frontend with Next.js App Router, focusing on scalability, maintainability, and developer experience while supporting the growth-focused user journey and company readiness features.