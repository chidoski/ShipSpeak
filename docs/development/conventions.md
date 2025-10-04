# Code Style and Conventions

## TypeScript Standards

### Naming Conventions
```typescript
// PascalCase for classes, interfaces, types, enums
class MeetingAnalysisService {}
interface UserProfile {}
type PracticeModuleType = 'FILLER_WORD_REDUCTION' | 'EXECUTIVE_PRESENCE';
enum AnalysisStatus {}

// camelCase for variables, functions, methods
const analysisResult = await analyzeAudio(audioData);
function generatePracticeModules() {}

// SCREAMING_SNAKE_CASE for constants
const MAX_AUDIO_DURATION = 1800; // 30 minutes
const API_ENDPOINTS = {
  ANALYZE_MEETING: '/api/meetings/analyze'
};

// kebab-case for file names
meeting-analysis.service.ts
practice-module.types.ts
user-dashboard.component.tsx
```

### Code Organization
```typescript
// Service class example
export class MeetingAnalysisService {
  // Private fields first
  private readonly aiService: AIService;
  private readonly config: AnalysisConfig;
  
  // Constructor
  constructor(aiService: AIService, config: AnalysisConfig) {
    this.aiService = aiService;
    this.config = config;
  }
  
  // Public methods
  public async analyzeMeeting(audioData: AudioData): Promise<MeetingAnalysis> {
    // Implementation
  }
  
  public async generatePracticeModules(analysis: MeetingAnalysis): Promise<PracticeModule[]> {
    // Implementation
  }
  
  // Private methods last
  private shouldGenerateModule(analysis: MeetingAnalysis, moduleType: ModuleType): boolean {
    // Implementation
  }
}
```

### Type Definitions
```typescript
// Use interfaces for object shapes
interface MeetingAnalysis {
  readonly id: string;
  readonly userId: string;
  readonly duration: number;
  readonly scores: CommunicationScores;
  readonly recommendations: string[];
  readonly createdAt: Date;
}

// Use types for unions and computed types
type PracticeModuleStatus = 'pending' | 'in_progress' | 'completed';
type UserRole = 'individual' | 'team_member' | 'admin' | 'enterprise_admin';

// Use enums for fixed sets of constants
enum AnalysisDifficulty {
  BEGINNER = 1,
  INTERMEDIATE = 2,  
  ADVANCED = 3,
  EXPERT = 4
}
```

## React/Next.js Conventions

### Component Structure
```typescript
// components/practice-session/PracticeSessionCard.tsx
interface PracticeSessionCardProps {
  session: PracticeSession;
  onStart: (sessionId: string) => void;
  onComplete: (sessionId: string, result: SessionResult) => void;
  className?: string;
}

export function PracticeSessionCard({ 
  session, 
  onStart, 
  onComplete, 
  className 
}: PracticeSessionCardProps) {
  // Hooks first
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Event handlers
  const handleStartSession = useCallback(() => {
    setIsLoading(true);
    onStart(session.id);
  }, [session.id, onStart]);
  
  // Render
  return (
    <Card className={cn('practice-session-card', className)}>
      <CardHeader>
        <CardTitle>{session.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component JSX */}
      </CardContent>
    </Card>
  );
}
```

### Custom Hooks
```typescript
// hooks/use-meeting-analysis.ts
interface UseMeetingAnalysisOptions {
  userId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseMeetingAnalysisReturn {
  analyses: MeetingAnalysis[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  analyzeMeeting: (audioData: AudioData) => Promise<MeetingAnalysis>;
}

export function useMeetingAnalysis(options: UseMeetingAnalysisOptions): UseMeetingAnalysisReturn {
  // Hook implementation
}
```

## API Design Conventions

### REST Endpoint Patterns
```typescript
// RESTful resource naming
GET    /api/users/:id/meetings              # List user's meetings
POST   /api/users/:id/meetings              # Create new meeting analysis  
GET    /api/users/:id/meetings/:meetingId   # Get specific meeting
PUT    /api/users/:id/meetings/:meetingId   # Update meeting
DELETE /api/users/:id/meetings/:meetingId   # Delete meeting

GET    /api/users/:id/practice-sessions     # List practice sessions
POST   /api/users/:id/practice-sessions     # Create practice session

# Non-resource actions use verbs
POST   /api/meetings/:id/analyze             # Analyze meeting audio
POST   /api/meetings/:id/generate-modules    # Generate practice modules
POST   /api/practice-sessions/:id/complete   # Complete practice session
```

### GraphQL Schema Patterns
```typescript
// GraphQL types
type User {
  id: ID!
  email: String!
  profile: UserProfile!
  meetings: [Meeting!]!
  practiceModules: [PracticeModule!]!
  progress: UserProgress!
}

type Meeting {
  id: ID!
  title: String!
  analysis: MeetingAnalysis
  generatedModules: [PracticeModule!]!
  createdAt: DateTime!
}

# Queries
type Query {
  me: User
  myMeetings(first: Int, after: String): MeetingConnection!
  practiceModules(filter: PracticeModuleFilter): [PracticeModule!]!
}

# Mutations  
type Mutation {
  startMeetingAnalysis(input: StartMeetingAnalysisInput!): MeetingAnalysisPayload!
  completePracticeSession(input: CompletePracticeSessionInput!): PracticeSessionPayload!
}
```

## Git Conventions

### Branch Naming
```bash
# Feature branches
feature/US001-user-registration
feature/US003-meeting-analysis
feature/US025-practice-modules

# Bug fixes
bugfix/audio-processing-memory-leak
bugfix/dashboard-loading-performance

# Hotfixes
hotfix/security-vulnerability-fix
hotfix/payment-processing-error

# Chores
chore/update-dependencies
chore/improve-documentation
```

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Commit Types**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples**
```bash
feat(auth): add JWT token refresh functionality

Implements automatic token refresh when tokens expire.
Includes retry logic and fallback to login redirect.

Closes #123

fix(audio): resolve memory leak in audio processing pipeline

The audio buffer was not being properly released after analysis.
Added proper cleanup in the finally block.

test(meeting-analysis): add integration tests for practice module generation

Added comprehensive test coverage for the TDD workflow.
Tests cover edge cases and error conditions.
```