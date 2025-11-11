# ShipSpeak Phase 2 Implementation Prompt
## Slice 2-2: Authentication System Integration

### Context Transfer for Implementation
This prompt provides complete implementation guidance for replacing mock authentication with Supabase Auth, including session management, protected routes, and user profile creation.

---

## Implementation Target: Authentication System Integration
**Development Time**: 3-4 hours  
**Slice ID**: 2-2 "Authentication System Integration"

### Core Purpose
Replace Phase 1 mock authentication with production Supabase Auth system, implementing email/password authentication, session management, protected route middleware, and seamless data migration from localStorage.

---

## Critical Authentication Architecture

### Supabase Auth Integration (MANDATORY)
The authentication system must provide enterprise-grade security with seamless UX:

#### Core Authentication Features
- **Email/Password Authentication**: Primary authentication method
- **Session Management**: Secure session handling with automatic renewal
- **User Profile Creation**: Automatic profile creation on successful signup
- **Password Reset**: Secure password reset workflow
- **Email Verification**: Optional email verification for enhanced security

#### Protected Route System
- **Middleware Integration**: Next.js 14 middleware for route protection
- **Role-Based Access**: Support for different user tiers and permissions
- **Usage-Based Permissions**: Access control based on subscription levels
- **Graceful Degradation**: Proper handling of auth state changes

### Migration Strategy Integration
Foundation must support seamless transition from Phase 1:

#### Data Migration from localStorage
- **User Preference Migration**: Transfer user settings to database
- **Session State Preservation**: Maintain user state during migration
- **Graceful Fallback**: Handle missing or corrupted localStorage data
- **Progress Preservation**: Maintain user progress through migration

---

## Authentication Flow Requirements

### Signup/Login Experience
- **Streamlined Onboarding**: Minimal friction registration process
- **Progressive Profile Building**: Collect additional data over time
- **Onboarding Data Persistence**: Store onboarding responses in database
- **Welcome Experience**: Post-signup guided tour integration

### Session Management
- **Token Handling**: Secure JWT token management
- **Auto-refresh**: Automatic session renewal before expiration
- **Cross-tab Sync**: Session state sync across browser tabs
- **Logout Handling**: Complete session cleanup on logout

### Error Handling
- **Network Issues**: Graceful handling of connectivity problems
- **Invalid Credentials**: Clear, helpful error messaging
- **Rate Limiting**: Protection against brute force attacks
- **Recovery Options**: Clear paths for account recovery

---

## Security Requirements

### Authentication Security
- **Secure Password Handling**: bcrypt hashing with proper salting
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Cross-site request forgery prevention

### Session Security
- **Secure Cookie Handling**: HttpOnly, Secure, SameSite cookies
- **Token Validation**: Proper JWT validation and verification
- **Session Timeout**: Configurable session timeout periods
- **Concurrent Session Handling**: Multiple device session management

### Data Protection
- **PII Protection**: Minimal personally identifiable information storage
- **Data Encryption**: Sensitive data encryption at rest
- **Access Logging**: Authentication attempt logging
- **Privacy Compliance**: GDPR/CCPA ready authentication

---

## Integration Requirements

### Supabase Integration
- **Auth Provider Setup**: Complete Supabase Auth configuration
- **Database Triggers**: Auth-triggered profile creation
- **RLS Integration**: Row Level Security policy integration
- **Real-time Auth**: Real-time auth state management

### Frontend Integration
- **Auth Context**: React context for auth state management
- **Protected Components**: Component-level auth protection
- **Loading States**: Proper loading and error states
- **Redirect Handling**: Post-login redirect management

### API Integration
- **Middleware Authentication**: API route authentication
- **Token Validation**: Server-side token validation
- **User Context**: Request user context in API routes
- **Permission Checking**: API-level permission validation

---

## Implementation Deliverables

### Authentication Components
- **Login Component**: Email/password login form
- **Signup Component**: User registration form
- **Password Reset**: Forgot password workflow
- **Profile Management**: User profile editing

### Middleware & Protection
- **Auth Middleware**: Next.js middleware for route protection
- **Protected Route HOC**: Higher-order component for page protection
- **API Middleware**: API route authentication middleware
- **Permission Guards**: Component and route permission guards

### Migration Utilities
- **Data Migration Scripts**: localStorage to database migration
- **Preference Migration**: User settings migration utilities
- **Progress Migration**: User progress transfer utilities
- **Cleanup Utilities**: localStorage cleanup after migration

---

## Quality Assurance Requirements

### Security Testing
- **Authentication Testing**: Login/logout flow testing
- **Authorization Testing**: Permission and access control testing
- **Session Testing**: Session management and timeout testing
- **Security Vulnerability**: OWASP security testing

### Performance Testing
- **Auth Speed**: Authentication response time <500ms
- **Session Management**: Efficient session handling
- **Database Performance**: User lookup optimization
- **Migration Performance**: Smooth data migration experience

### User Experience Testing
- **Flow Testing**: Complete authentication user flows
- **Error Handling**: Error state and recovery testing
- **Cross-device Testing**: Multi-device session testing
- **Accessibility**: Authentication accessibility compliance

---

## Integration Preparation

### Phase 2 Slice Dependencies
- **Database Schema (Slice 2-1)**: Requires completed user tables
- **API Layer (Slice 2-3)**: Provides auth context for API routes
- **File Upload (Slice 2-4)**: User authentication for file ownership
- **Meeting Processing (Slice 2-5)**: User context for meeting ownership

### Phase 3 AI Integration Preparation
- **User Context**: User identification for AI processing
- **Usage Tracking**: User-based AI service usage
- **Permission Management**: AI feature access control
- **Cost Attribution**: User-based cost tracking

---

## Success Criteria

### Functional Requirements
- [ ] Supabase Auth fully integrated and functional
- [ ] Email/password authentication working
- [ ] Protected routes enforcing authentication
- [ ] User profile creation automated on signup
- [ ] Session management with auto-refresh working

### Security Requirements
- [ ] All security best practices implemented
- [ ] RLS integration functional
- [ ] No authentication bypass vulnerabilities
- [ ] Secure session handling validated

### Migration Requirements
- [ ] localStorage data successfully migrated
- [ ] User preferences preserved through migration
- [ ] No data loss during authentication migration
- [ ] Graceful fallback for migration errors

### Integration Requirements
- [ ] Frontend auth context working
- [ ] API authentication middleware functional
- [ ] Database user lookup optimized
- [ ] Real-time auth state management active

---

## Phase 2 Integration Notes

This slice enables all subsequent Phase 2 authentication-dependent features:
- **API Layer (Slice 2-3)**: Requires user authentication context
- **File Upload (Slice 2-4)**: Needs user ownership validation
- **Meeting Processing (Slice 2-5)**: Requires user context for processing
- **Progress Tracking (Slice 2-7)**: Needs user identification for analytics

Authentication must be fully functional before implementing user-dependent features.