# Development Workflow

## Development Environment Setup

### Required Tools
- Node.js 18+
- PostgreSQL 15+
- Redis 6+
- Docker & Docker Compose
- FFmpeg (for audio processing)

### Optional Tools
- Kubernetes CLI (for production deployment)
- Postman/Insomnia (API testing)
- TablePlus/pgAdmin (database management)

### Environment Variables
```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/shipspeak_dev
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-...
ASSEMBLYAI_API_KEY=...
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Build Commands

### Setup and Installation
```bash
# Clone repository
git clone https://github.com/your-org/shipspeak.git
cd shipspeak

# Install dependencies
npm install

# Desktop app setup (if developing desktop app)
cd apps/desktop
npm install
npm run build:native # Build native modules

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Setup database
npm run db:setup
npm run db:migrate
npm run db:seed
```

### Development Commands
```bash
# Start all applications in development mode
npm run dev

# Start specific applications
npm run dev:web          # Web app only
npm run dev:api          # Backend API only
npm run dev:desktop      # Desktop app only
npm run dev:extension    # Browser extension only
npm run dev:mobile       # Mobile app only (Phase 3)

# Database operations
npm run db:migrate       # Run database migrations
npm run db:rollback      # Rollback last migration
npm run db:seed          # Seed database with test data
npm run db:reset         # Reset database (migrate + seed)

# AI/ML operations
npm run ai:train         # Train custom models
npm run ai:test          # Test AI pipeline
npm run whisper:setup    # Setup self-hosted Whisper
```

### Testing Commands (TDD Framework)
```bash
# Run all tests
npm test

# Test-Driven Development workflow
npm run test:watch       # Watch mode for TDD
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # End-to-end tests
npm run test:coverage    # Generate coverage report

# AI-specific testing
npm run test:ai          # AI model accuracy tests
npm run test:audio       # Audio processing pipeline tests
```

### Production Commands
```bash
# Build for production
npm run build

# Build specific applications
npm run build:web
npm run build:api
npm run build:mobile

# Production utilities
npm run lint             # Lint all code
npm run type-check       # TypeScript type checking
npm run security-audit   # Security vulnerability scan
npm run performance      # Performance benchmarks
```

## Git Workflow

### Daily Development Flow
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/US001-user-registration

# TDD Cycle
git add tests/unit/auth/registration.test.ts
git commit -m "test(auth): add user registration validation tests"

git add src/services/auth.service.ts  
git commit -m "feat(auth): implement user registration with validation"

git add src/services/auth.service.ts
git commit -m "refactor(auth): improve error handling and validation logic"

# Push feature branch
git push -u origin feature/US001-user-registration
```

### Pull Request Process
```bash
# Create PR from feature branch to develop
gh pr create --title "feat: User Registration and Validation (US001)" \
             --body "Implements user registration with email validation and password requirements. All tests passing with 100% coverage."

# After PR approval, merge and clean up
git checkout develop
git pull origin develop
git branch -d feature/US001-user-registration
git push origin --delete feature/US001-user-registration
```

## Daily Changelog Workflow

### Directory Structure
```
changelog/
├── README.md                    # Changelog guidelines and best practices
├── templates/                   # Templates for different entry types
│   ├── daily-log-template.md   # Daily work log template
│   ├── feature-template.md     # New feature documentation
│   └── bugfix-template.md      # Bug fix analysis template
├── 2025/                       # Year-based organization
│   └── 09-september/          # Month folders
│       └── 2025-09-25.md      # Daily entries (YYYY-MM-DD format)
└── CHANGELOG.md               # Consolidated changelog for releases
```

### Daily Workflow Integration

**During Development:**
1. **Start of Day**: Create daily entry from template or continue existing entry
2. **Throughout Day**: Update changelog in real-time as you work
3. **With Each Commit**: Reference changelog entry in commit messages
4. **End of Day**: Review and finalize daily entry

**Creating Daily Entry:**
```bash
# Create today's changelog entry
cp changelog/templates/daily-log-template.md changelog/2025/$(date +%m-%B)/$(date +%Y-%m-%d).md

# Edit the file with your changes
code changelog/2025/$(date +%m-%B)/$(date +%Y-%m-%d).md
```

### TDD Integration in Changelog
Each development entry should reflect the TDD cycle:

```markdown
### 🆕 FEATURES
**US001: User Registration System**
- **Red Phase**: Added failing tests for email validation and password hashing
- **Green Phase**: Implemented minimal user registration endpoint
- **Refactor Phase**: Enhanced validation, improved error handling, optimized database queries
- **Tests Added**: 12 unit tests covering edge cases and error conditions
- **Coverage**: 100% for authentication service
- **Time**: 4 hours
```