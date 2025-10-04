# Technical Architecture

## Technology Stack

### Backend Services
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with TypeScript
- **API**: GraphQL (Apollo Server) + REST hybrid
- **Database**: PostgreSQL 15 with Redis caching
- **Message Queue**: Redis + Bull for async processing
- **AI/ML**: OpenAI GPT-4, Whisper (self-hosted), AssemblyAI

### Frontend Applications
- **Web App**: Next.js 14 + React 18 + TypeScript
- **Browser Extension**: Chrome Extension Manifest V3 (Google Meet, Zoom Web)
- **Desktop App**: Electron + Native Audio APIs (Zoom Desktop, Teams)
- **Mobile**: React Native + Expo (Phase 3)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand + React Query (TanStack Query)

### Infrastructure
- **Cloud**: AWS/Azure with Kubernetes orchestration
- **Storage**: S3/Azure Blob for files, Pinecone for vectors
- **Monitoring**: Prometheus + Grafana + Sentry
- **Security**: JWT authentication, end-to-end encryption

## Platform Coverage Strategy
- **Phase 1 (MVP)**: Chrome extension for Google Meet (~40% coverage)
- **Phase 2**: Desktop app for Zoom desktop (~70% total coverage)  
- **Phase 3**: Full desktop app + optional bots (100% coverage)

## Database Schema

### Core Tables
```sql
-- Users and authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'individual',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Meeting records
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Meeting analysis results
CREATE TABLE meeting_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id),
    communication_score INTEGER,
    improvement_areas JSONB,
    recommendations TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Practice modules
CREATE TABLE practice_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    source_analysis_id UUID REFERENCES meeting_analyses(id),
    module_type module_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    exercises JSONB NOT NULL,
    estimated_duration INTEGER,
    difficulty difficulty_level,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Architecture

### Authentication Flow
1. User login → JWT access token (15min) + refresh token (30d)
2. All API requests include access token in Authorization header
3. Token refresh happens automatically on expiry
4. Logout invalidates both tokens

### Data Encryption
- All sensitive data encrypted at rest using AES-256
- Meeting audio encrypted with user-specific keys
- Zero-knowledge processing: decrypt only in memory
- No plaintext audio storage

### Privacy Controls
- Explicit consent required for all recording
- User controls data retention periods
- Right to delete all data
- Granular permission system