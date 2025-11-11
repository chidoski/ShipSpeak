# ShipSpeak Phase 2 Implementation Prompt
## Slice 2-1: Database Schema & Migrations

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's database foundation with comprehensive PostgreSQL schema, Row Level Security (RLS), and migration system.

---

## Implementation Target: Database Schema & Migrations
**Development Time**: 4-5 hours  
**Slice ID**: 2-1 "Database Schema & Migrations"

### Core Purpose
Establish complete Supabase PostgreSQL database schema with Row Level Security policies, user isolation enforcement, data retention policies, and audit logging capabilities.

---

## Critical Database Architecture

### Core Tables (MANDATORY)
The database must support complete user isolation and meeting intelligence workflow:

#### User Management Tables
- **`profiles`** - User profiles and preferences with auth integration
- **`user_progress`** - Progress tracking across all learning dimensions
- **`usage_metrics`** - Privacy-safe usage analytics (ID-only tracking)

#### Meeting Intelligence Tables  
- **`meetings`** - Meeting metadata, status tracking, and ownership
- **`meeting_transcripts`** - Processed transcript data with speaker identification
- **`meeting_analyses`** - AI-generated insights and coaching recommendations

#### Practice System Tables
- **`practice_sessions`** - User practice data with performance metrics
- **`modules`** - Learning module definitions and content management
- **`session_feedback`** - AI-generated feedback and improvement tracking

### Security Architecture Integration
Foundation must support enterprise-grade security:

#### Row Level Security (RLS) Policies
- **User Isolation**: Complete data separation between users
- **Role-Based Access**: Support for different user tiers and permissions
- **Usage-Based Permissions**: Access control based on subscription levels
- **Audit Trail**: Complete activity logging for security compliance

---

## Development Standards

### Database Performance Requirements
- **Query Optimization**: No N+1 query patterns allowed
- **Indexing Strategy**: Proper indexes for all query patterns
- **Connection Pooling**: Efficient connection management
- **Response Times**: Database operations <100ms

### Security Requirements
- **Data Encryption**: At rest and in transit
- **SQL Injection Prevention**: Parameterized queries only
- **Data Retention**: Configurable retention policies
- **Privacy Compliance**: GDPR/CCPA ready data handling

### Migration Standards
- **Version Control**: All schema changes tracked
- **Rollback Capability**: Safe migration rollback procedures
- **Data Integrity**: No data loss during migrations
- **Testing**: Migration testing in staging environment

---

## Supabase Integration Requirements

### Authentication Integration
- **Auth Triggers**: Automatic profile creation on signup
- **Session Management**: Secure session handling
- **Role Assignment**: Default role assignment for new users

### Real-time Features Preparation
- **Real-time Subscriptions**: Tables prepared for real-time updates
- **WebSocket Support**: Database structure supporting live updates
- **Change Detection**: Optimized for real-time change tracking

### API Generation
- **Auto-generated APIs**: Supabase auto-API utilization
- **Type Safety**: TypeScript type generation
- **Query Optimization**: Efficient API query patterns

---

## Implementation Deliverables

### Schema Files
- **Migration Scripts**: Complete up/down migration files
- **Seed Data**: Development and testing seed data
- **Type Definitions**: Generated TypeScript types

### Security Configuration
- **RLS Policies**: Complete Row Level Security implementation
- **User Permissions**: Role and permission configuration
- **Audit Logging**: Activity tracking implementation

### Documentation
- **Schema Documentation**: Complete table and relationship documentation
- **Security Model**: RLS policy documentation
- **Migration Guide**: Database setup and migration procedures

---

## Quality Assurance Requirements

### Testing Standards
- **Migration Testing**: All migrations tested in clean environment
- **Performance Testing**: Query performance benchmarking
- **Security Testing**: RLS policy validation
- **Data Integrity**: Referential integrity validation

### Monitoring Setup
- **Performance Monitoring**: Query performance tracking
- **Security Monitoring**: Access pattern monitoring
- **Usage Analytics**: Privacy-safe usage tracking
- **Error Tracking**: Database error logging

---

## Integration Preparation

### API Layer Readiness
- **Query Patterns**: Optimized for API layer requirements
- **Validation Support**: Database-level validation where appropriate
- **Error Handling**: Proper constraint error handling

### AI Services Preparation
- **Meeting Data Storage**: Prepared for AI processing results
- **Analysis Storage**: Structured storage for AI insights
- **Progress Tracking**: Database support for AI processing status

### Phase 3 AI Integration Readiness
- **OpenAI Service Integration Points**: Database prepared for AI results
- **Smart Sampling Data**: Tables ready for cost optimization data
- **Scenario Generation**: Database support for adaptive content

---

## Success Criteria

### Functional Requirements
- [ ] All core tables created with proper relationships
- [ ] RLS policies implemented and tested
- [ ] Migration system functional with rollback capability
- [ ] Seed data loading successfully

### Performance Requirements  
- [ ] All database operations <100ms
- [ ] No N+1 query patterns in generated APIs
- [ ] Proper indexing strategy implemented
- [ ] Connection pooling configured

### Security Requirements
- [ ] Complete user data isolation validated
- [ ] All tables protected with RLS
- [ ] Audit logging functional
- [ ] Security compliance requirements met

### Integration Requirements
- [ ] Supabase Auth integration working
- [ ] TypeScript types generated and validated
- [ ] Real-time subscriptions prepared
- [ ] API layer integration points ready

---

## Phase 2 Integration Notes

This slice provides the foundation for all subsequent Phase 2 slices:
- **Slice 2-2**: Authentication system builds on user profiles
- **Slice 2-3**: API layer utilizes database schema
- **Slice 2-4**: File upload system stores metadata in meetings table
- **Slice 2-5**: Meeting processing pipeline updates meeting status

The database schema must be complete and tested before proceeding to subsequent slices.