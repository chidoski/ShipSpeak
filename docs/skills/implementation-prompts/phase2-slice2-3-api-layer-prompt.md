# ShipSpeak Phase 2 Implementation Prompt
## Slice 2-3: API Layer Foundation

### Context Transfer for Implementation
This prompt provides complete implementation guidance for building ShipSpeak's API layer with Next.js App Router, input validation, authentication middleware, rate limiting, and comprehensive error handling.

---

## Implementation Target: API Layer Foundation
**Development Time**: 5-6 hours  
**Slice ID**: 2-3 "API Layer Foundation"

### Core Purpose
Build comprehensive API layer with RESTful endpoints following Next.js 14 patterns, input validation schemas, authentication middleware, rate limiting, usage tracking, and proper HTTP status code handling.

---

## Critical API Architecture

### Core API Endpoints (MANDATORY)
The API layer must support complete Meeting Intelligence and practice workflow:

#### Authentication Management
- **`/api/auth/register`** - User registration with validation
- **`/api/auth/login`** - User authentication with session management
- **`/api/auth/logout`** - Secure session termination
- **`/api/auth/refresh`** - Token refresh for session renewal
- **`/api/auth/reset-password`** - Password reset workflow

#### Meeting CRUD Operations
- **`/api/meetings`** - Meeting list with pagination and filtering
- **`/api/meetings/[id]`** - Individual meeting CRUD operations
- **`/api/meetings/[id]/upload`** - Audio file upload endpoint
- **`/api/meetings/[id]/status`** - Processing status tracking
- **`/api/meetings/[id]/analysis`** - Analysis results retrieval

#### Practice Session Management
- **`/api/practice/sessions`** - Practice session CRUD operations
- **`/api/practice/modules`** - Learning module access
- **`/api/practice/feedback`** - AI feedback submission and retrieval
- **`/api/practice/progress`** - Progress tracking and analytics

### API Standards Integration
Foundation must follow enterprise API standards:

#### Input Validation
- **Schema Validation**: Zod schema validation for all inputs
- **Type Safety**: Complete TypeScript coverage
- **Sanitization**: Input sanitization for XSS prevention
- **Business Rule Validation**: Meeting ownership and permission validation

#### Error Handling
- **Consistent Error Responses**: Standardized error response format
- **HTTP Status Codes**: Proper status code usage
- **Error Logging**: Comprehensive error logging and tracking
- **User-Friendly Messages**: Clear, actionable error messages

---

## Middleware Architecture Requirements

### Authentication Middleware
- **Token Validation**: JWT token validation and verification
- **User Context**: Request user context injection
- **Permission Checking**: Role and usage-based permission validation
- **Session Management**: Session state validation and renewal

### Rate Limiting Middleware
- **General API Limiting**: 1000 requests per 15 minutes per user
- **Authentication Limiting**: 20 requests per 15 minutes per IP
- **File Upload Limiting**: 5 requests per 15 minutes per user
- **AI Processing Limiting**: 10 requests per 15 minutes per user
- **Adaptive Rate Limiting**: Violation tracking and progressive penalties

### Validation Middleware
- **Request Validation**: Input validation with detailed error messages
- **Response Validation**: Output validation for API consistency
- **Content Type Validation**: Proper content type handling
- **Size Limits**: Request size limitations for security

---

## Security Requirements

### API Security
- **CORS Configuration**: Proper cross-origin resource sharing
- **Content Security Policy**: CSP headers for XSS prevention
- **Request Signing**: API request integrity validation
- **IP Whitelisting**: Optional IP-based access control

### Data Protection
- **Input Sanitization**: XSS and injection prevention
- **Output Encoding**: Safe data output encoding
- **SQL Injection Prevention**: Parameterized queries only
- **File Upload Security**: Secure file handling and validation

### Usage Tracking
- **API Analytics**: Usage pattern tracking and analysis
- **Performance Monitoring**: Response time and error rate tracking
- **Quota Management**: Usage quota tracking and enforcement
- **Abuse Detection**: Automated abuse pattern detection

---

## Implementation Deliverables

### Core API Routes
- **Authentication Routes**: Complete auth endpoint implementation
- **Meeting Routes**: Meeting CRUD with ownership validation
- **Practice Routes**: Practice session and module management
- **Progress Routes**: Analytics and progress tracking
- **Health Routes**: API health and status endpoints

### Middleware Components
- **Auth Middleware**: Authentication and authorization
- **Rate Limiting**: Comprehensive rate limiting implementation
- **Validation**: Input and output validation middleware
- **Logging**: Request/response logging and monitoring
- **Error Handling**: Global error handling and recovery

### Validation Schemas
- **Zod Schemas**: Complete validation schema library
- **Type Definitions**: Generated TypeScript types
- **Business Rules**: Meeting and user validation rules
- **Error Messages**: Internationalized error messages

---

## Quality Assurance Requirements

### Performance Standards
- **Response Time**: API endpoints <500ms average response time
- **Throughput**: Support for 1000+ concurrent requests
- **Database Optimization**: No N+1 query patterns
- **Caching Strategy**: Appropriate response caching

### Security Testing
- **Authentication Testing**: Complete auth flow validation
- **Authorization Testing**: Permission and access control testing
- **Input Validation**: Comprehensive input validation testing
- **Rate Limiting**: Rate limit enforcement testing

### Integration Testing
- **Database Integration**: Complete database operation testing
- **Authentication Integration**: Auth service integration testing
- **Error Scenario Testing**: Error handling and recovery testing
- **Performance Testing**: Load and stress testing

---

## API Documentation

### OpenAPI Specification
- **Complete API Docs**: Comprehensive endpoint documentation
- **Request/Response Examples**: Clear usage examples
- **Error Response Documentation**: Error scenario documentation
- **Authentication Guide**: Auth implementation guide

### Integration Guides
- **Frontend Integration**: Client-side API usage guide
- **Rate Limiting Guide**: Rate limit handling best practices
- **Error Handling Guide**: Error recovery implementation
- **Performance Guide**: Optimization best practices

---

## Integration Preparation

### Database Integration
- **Query Optimization**: Efficient database query patterns
- **Connection Management**: Database connection pooling
- **Transaction Handling**: Proper transaction management
- **Error Recovery**: Database error handling and recovery

### Frontend Integration
- **Type Safety**: Generated types for frontend consumption
- **Error Handling**: Client-side error handling patterns
- **Loading States**: API loading state management
- **Caching Strategy**: Client-side caching integration

### Phase 3 AI Service Preparation
- **AI Endpoint Structure**: API structure for AI service integration
- **Processing Status**: Status tracking for AI processing
- **Cost Tracking**: API usage cost attribution
- **Queue Management**: AI processing queue integration

---

## Success Criteria

### Functional Requirements
- [ ] All core API endpoints implemented and tested
- [ ] Authentication middleware functional
- [ ] Input validation preventing all common attacks
- [ ] Rate limiting enforced and tested
- [ ] Error handling comprehensive and user-friendly

### Performance Requirements
- [ ] All API endpoints <500ms response time
- [ ] No N+1 database query patterns
- [ ] Proper caching strategy implemented
- [ ] Concurrent request handling validated

### Security Requirements
- [ ] All security middleware functional
- [ ] Input sanitization preventing XSS and injection
- [ ] Rate limiting preventing abuse
- [ ] Authentication and authorization bulletproof

### Integration Requirements
- [ ] Database integration optimized and tested
- [ ] Frontend type safety and error handling ready
- [ ] API documentation complete and accurate
- [ ] AI service integration points prepared

---

## Phase 2 Integration Notes

This slice provides the API foundation for all subsequent Phase 2 features:
- **File Upload (Slice 2-4)**: Requires API endpoints for upload handling
- **Meeting Processing (Slice 2-5)**: Needs API status tracking and updates
- **Practice Module (Slice 2-6)**: Requires practice session API endpoints
- **Real-time Updates (Slice 2-8)**: API integration with WebSocket events

The API layer must be complete and tested before implementing dependent features.