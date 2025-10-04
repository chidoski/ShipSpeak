# Cost & Technical Architecture: Meeting Analysis & Module Generation

**Product**: ShipSpeak - Cost & Technical Architecture  
**Version**: 1.0  
**Date**: October 4, 2025  
**Author**: Product Team  

---

## Overview

This document outlines the technical architecture and cost optimization strategies for ShipSpeak's Meeting Analysis & Module Generation system. The design prioritizes sustainable unit economics while delivering premium AI-powered experiences through smart sampling, intelligent caching, and progressive personalization.

---

## Cost Optimization Strategy

### Unit Economics Target
- **Monthly Cost per Active User**: <$5.00
- **Monthly Revenue per User**: $49-99 
- **Target Gross Margin**: 90%+
- **Break-even Timeline**: User profitable by month 2

### Cost Breakdown by Feature

#### Meeting Analysis: $0.03 per meeting
```
Smart Sampling Approach:
• Full transcription: $0.01 (Whisper API)
• Critical moment detection: $0.005 (lightweight model)
• Deep analysis (5-min segments): $0.020 (GPT-4)
• Pattern matching (rest of meeting): $0.005 (cached patterns)

vs. Traditional Approach: $0.10+ per meeting (full GPT-4 analysis)
Cost Reduction: 70%
```

#### Socratic Discovery Sessions: $0.02 per session
```
Question Tree Navigation:
• Initial context setup: $0.005 (GPT-4)
• Follow-up questions: $0.010 (cached decision trees + GPT-3.5)
• Insight revelation: $0.005 (templated responses + personalization)

Efficiency Gains:
• 80% of questions come from pre-built trees
• Only edge cases require full GPT-4 generation
• User responses guide efficient navigation
```

#### Practice Module Generation: $0.01 per module
```
Tiered Generation:
• Base scenario (Foundation level): $0.002 (cached templates)
• Personalized scenario (Practice level): $0.008 (GPT-3.5 + context)
• Custom scenario (Mastery level): $0.015 (GPT-4 full generation)

Weekly Batch Processing:
• Generate 100 scenarios Sunday nights: $5/week total
• On-demand personalization: $0.002-0.008 per request
• Real-time adaptation: $0.001 per session (cached patterns)
```

#### Daily Challenges: $0.005 per challenge
```
Historical Case Library:
• Pre-curated content: $0.001 (storage/delivery)
• Contextual adaptation: $0.003 (light personalization)
• Follow-up questions: $0.001 (cached Socratic trees)

Annual Content Creation Budget: $2,000 for 365 unique challenges
```

### Monthly Cost Model per Active User
```
Engagement Assumptions:
• 3 meetings analyzed per month: $0.09
• 6 Socratic sessions per month: $0.12  
• 12 practice modules per month: $0.12
• 20 daily challenges per month: $0.10
• Infrastructure & storage: $0.15

Total Monthly Cost: $0.58 per user
Safety Buffer (5x): $2.90 per user
Target with growth margin: <$5.00 per user
```

---

## Technical Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    ShipSpeak Platform                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer                                             │
│  ├── Web App (Next.js)                                     │
│  ├── Mobile App (React Native)                             │
│  └── Chrome Extension                                       │
├─────────────────────────────────────────────────────────────┤
│  API Gateway & Load Balancer                               │
│  ├── Authentication (Auth0/Supabase Auth)                  │
│  ├── Rate Limiting                                         │
│  └── Request Routing                                       │
├─────────────────────────────────────────────────────────────┤
│  Core Services (Microservices)                             │
│  ├── Meeting Analysis Service                              │
│  ├── Scenario Generation Service                           │
│  ├── Socratic AI Service                                   │
│  ├── User Progress Service                                 │
│  └── Content Management Service                            │
├─────────────────────────────────────────────────────────────┤
│  AI/ML Layer                                               │
│  ├── OpenAI API Integration                                │
│  ├── Whisper Transcription                                 │
│  ├── Custom Models (Critical Moment Detection)             │
│  └── Pattern Recognition Engine                            │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                │
│  ├── PostgreSQL (User data, scenarios, progress)           │
│  ├── Redis (Caching, sessions, real-time)                  │
│  ├── Vector DB (Scenario embeddings, pattern matching)     │
│  └── Object Storage (Audio files, media content)           │
└─────────────────────────────────────────────────────────────┘
```

### Core Services Detailed Design

#### Meeting Analysis Service
```
Technology Stack:
• Node.js with TypeScript
• Express.js with GraphQL endpoint
• Bull Queue for async processing
• Whisper API for transcription
• Custom TensorFlow model for critical moment detection

Processing Pipeline:
1. Audio Upload → Object Storage (S3/CloudFlare R2)
2. Transcription → Whisper API (chunked processing)
3. Critical Moment Detection → Custom ML model
4. Deep Analysis → GPT-4 on selected segments only
5. Pattern Matching → Vector similarity search
6. Results Storage → PostgreSQL + Redis cache

Performance Targets:
• Processing time: <3 minutes for 60-min meeting
• Accuracy: >90% critical moment detection
• Cost: <$0.03 per meeting
```

#### Scenario Generation Service
```
Technology Stack:
• Python with FastAPI
• Celery for background job processing
• Redis for job queuing
• PostgreSQL for scenario storage
• Vector embeddings for similarity matching

Generation Pipeline:
1. Weekly Batch Generation (Sunday nights)
   └── Base scenarios → Context variations → Quality scoring
2. On-Demand Personalization
   └── User profile + Base scenario → GPT-4 → Personalized scenario
3. Real-Time Adaptation
   └── User response + Cached patterns → Adjusted difficulty

Caching Strategy:
• L1: Redis (hot scenarios, user preferences)
• L2: PostgreSQL (all scenarios, metadata)
• L3: Vector DB (semantic search, pattern matching)
```

#### Socratic AI Service
```
Technology Stack:
• Node.js with TypeScript
• WebSocket for real-time conversations
• Redis for conversation state
• Decision tree engine for question navigation

Conversation Flow:
1. Context Setup → Load user history + scenario context
2. Question Selection → Decision tree navigation + GPT-4 fallback
3. Response Analysis → Pattern recognition + sentiment analysis
4. Follow-up Generation → Cached trees (80%) + AI generation (20%)
5. Insight Timing → Progressive revelation based on user engagement

Optimization Features:
• Pre-computed question trees for common patterns
• User response classification for efficient routing
• Dynamic difficulty adjustment based on engagement
• Memory integration for personalized conversations
```

### Smart Sampling Implementation

#### Critical Moment Detection Algorithm
```python
class CriticalMomentDetector:
    def __init__(self):
        self.indicators = {
            'decision_points': ['should we', 'what if', 'how about'],
            'pushback_patterns': ['but', 'however', 'what about'],
            'question_clusters': ['why', 'how', 'what', 'when'],
            'stakeholder_concerns': ['risk', 'timeline', 'budget', 'scope'],
            'emotion_changes': [sentiment_shift_threshold > 0.3]
        }
    
    def detect_moments(self, transcript):
        moments = []
        for segment in transcript.segments:
            score = self.calculate_criticality_score(segment)
            if score > self.threshold:
                moments.append({
                    'start_time': segment.start,
                    'end_time': segment.end,
                    'score': score,
                    'type': self.classify_moment_type(segment)
                })
        return self.select_top_moments(moments, max_count=3)
```

#### Analysis Cost Optimization
```python
class MeetingAnalyzer:
    def analyze_meeting(self, audio_file, user_profile):
        # Step 1: Full transcription (cheap)
        transcript = self.transcribe(audio_file)  # $0.01
        
        # Step 2: Critical moment detection (very cheap)
        critical_moments = self.detect_critical_moments(transcript)  # $0.005
        
        # Step 3: Deep analysis only on critical segments (targeted expense)
        for moment in critical_moments:
            segment_text = transcript.get_segment(moment.start, moment.end)
            analysis = self.deep_analyze_segment(segment_text, user_profile)  # $0.007 each
            
        # Step 4: Pattern matching for remaining content (cheap)
        patterns = self.match_patterns(transcript, self.pattern_library)  # $0.005
        
        return self.combine_insights(deep_analysis, patterns)
```

### Caching Architecture

#### Multi-Layer Caching Strategy
```
Layer 1: Redis (Hot Data)
• User session data (5-min TTL)
• Active scenario content (1-hour TTL)
• Conversation state (30-min TTL)
• API response cache (15-min TTL)

Layer 2: Application Cache
• Scenario templates (1-day TTL)
• Question decision trees (1-week TTL)
• User preference patterns (1-hour TTL)

Layer 3: Database Optimization
• PostgreSQL query optimization
• Index strategy for common lookups
• Read replicas for analytics queries

Layer 4: CDN Caching
• Static scenario content
• Audio file delivery
• Media assets and images
```

#### Pattern Library Caching
```python
class PatternLibrary:
    def __init__(self):
        self.cache = {
            'communication_patterns': {},  # Common PM communication issues
            'stakeholder_responses': {},   # Typical stakeholder reaction patterns
            'framework_applications': {}, # When/how to apply PM frameworks
            'success_paths': {}           # Proven solution patterns
        }
    
    def get_cached_response(self, scenario_type, user_weakness):
        cache_key = f"{scenario_type}:{user_weakness}"
        if cache_key in self.cache:
            return self.cache[cache_key]  # $0 cost
        else:
            response = self.generate_new_response(scenario_type, user_weakness)  # $0.01 cost
            self.cache[cache_key] = response
            return response
```

### Database Design

#### Core Tables Schema
```sql
-- User management and progress tracking
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    company_stage VARCHAR,
    pm_level VARCHAR,
    industry VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE user_skills (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    skill_category VARCHAR,
    current_level INTEGER,
    progress_history JSONB,
    last_practiced TIMESTAMP
);

-- Meeting analysis and content
CREATE TABLE meetings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR,
    duration_minutes INTEGER,
    transcription TEXT,
    critical_moments JSONB,
    analysis_results JSONB,
    created_at TIMESTAMP
);

CREATE TABLE scenarios (
    id UUID PRIMARY KEY,
    base_category VARCHAR,
    context_variables JSONB,
    content TEXT,
    learning_objectives JSONB,
    difficulty_level INTEGER,
    usage_count INTEGER,
    success_rate DECIMAL
);

-- Practice sessions and progress
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    scenario_id UUID REFERENCES scenarios(id),
    user_responses JSONB,
    ai_feedback JSONB,
    session_score DECIMAL,
    completed_at TIMESTAMP
);
```

#### Performance Optimization
```sql
-- Indexes for common queries
CREATE INDEX idx_users_company_stage ON users(company_stage, pm_level);
CREATE INDEX idx_scenarios_category_difficulty ON scenarios(base_category, difficulty_level);
CREATE INDEX idx_practice_sessions_user_recent ON practice_sessions(user_id, completed_at DESC);
CREATE INDEX idx_user_skills_category ON user_skills(user_id, skill_category);

-- Partitioning for large tables
CREATE TABLE practice_sessions_2025_q4 PARTITION OF practice_sessions
FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
```

### Infrastructure & Deployment

#### Kubernetes Deployment Strategy
```yaml
# Meeting Analysis Service
apiVersion: apps/v1
kind: Deployment
metadata:
  name: meeting-analysis-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: meeting-analysis
  template:
    spec:
      containers:
      - name: meeting-analysis
        image: shipspeak/meeting-analysis:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: openai-key
```

#### Auto-scaling Configuration
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: meeting-analysis-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: meeting-analysis-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Security & Privacy Architecture

#### Data Security Measures
```
Encryption:
• Data at rest: AES-256 encryption for all stored data
• Data in transit: TLS 1.3 for all API communications
• Audio files: Client-side encryption before upload

Access Control:
• JWT-based authentication with short-lived tokens
• Role-based access control (RBAC) for admin functions
• API rate limiting per user and endpoint

Privacy Protection:
• Audio files automatically deleted after 30 days
• Transcriptions anonymized for training data
• User opt-out for data usage in system improvements
• GDPR/CCPA compliance with data export/deletion
```

#### API Security Implementation
```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit scenario generation requests
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/generate-scenario', strictLimiter);
```

### Monitoring & Observability

#### Key Performance Indicators
```
System Performance:
• API response times (p95 < 200ms)
• Meeting processing time (< 3 minutes)
• Scenario generation time (< 30 seconds)
• System uptime (99.9%+)

Cost Monitoring:
• OpenAI API usage per user per month
• Infrastructure costs per active user
• Storage costs for audio files
• Bandwidth costs for content delivery

User Experience:
• Session completion rates
• User engagement time per session
• Error rates by feature
• User satisfaction scores
```

#### Alerting Configuration
```python
# Cost monitoring alerts
class CostMonitor:
    def check_monthly_costs(self):
        current_cost_per_user = self.calculate_current_month_costs()
        if current_cost_per_user > 5.00:
            self.send_alert("Cost per user exceeded target", 
                          f"Current: ${current_cost_per_user}")
    
    def check_openai_usage(self):
        daily_usage = self.get_openai_daily_usage()
        if daily_usage > self.budget_threshold:
            self.send_alert("OpenAI usage spike detected",
                          f"Daily usage: ${daily_usage}")
```

### Disaster Recovery & Backup

#### Data Backup Strategy
```
Database Backups:
• Daily automated backups with 30-day retention
• Point-in-time recovery capability
• Cross-region backup replication

Application State:
• Redis state backup every 6 hours
• Configuration backup to version control
• Container image backup to multiple registries

Recovery Procedures:
• RTO (Recovery Time Objective): 4 hours
• RPO (Recovery Point Objective): 1 hour
• Automated failover for critical services
• Manual procedures documented and tested quarterly
```

This technical architecture balances cost efficiency with scalability, ensuring ShipSpeak can deliver premium AI experiences while maintaining sustainable unit economics as we scale to thousands of users.