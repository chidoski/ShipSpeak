# ShipSpeak Phase 2 Implementation Prompt
## Slice 2-9: Usage & Limits Management

### Context Transfer for Implementation
This prompt provides complete implementation guidance for ShipSpeak's usage-based access control system with usage tracking, limit enforcement, usage dashboard, educational messaging, and upgrade pathways.

---

## Implementation Target: Usage & Limits Management
**Development Time**: 3-4 hours  
**Slice ID**: 2-9 "Usage & Limits Management"

### Core Purpose
Implement comprehensive usage-based access control with usage tracking per user, limit enforcement, usage dashboard, educational messaging about limits, and clear upgrade pathways for increased access.

---

## Critical Usage Management Architecture

### Usage Categories (MANDATORY)
The usage management system must track all platform resource consumption:

#### Meeting Analysis Usage
- **Meeting Analysis Minutes**: Total processed meeting duration per user
- **Monthly Analysis Limit**: Monthly meeting analysis time limits
- **Processing Queue Priority**: Usage-based processing priority
- **Analysis Quality**: Premium vs. standard analysis quality tiers
- **Historical Usage**: Meeting analysis usage history tracking

#### Practice Session Usage
- **Practice Session Count**: Number of practice sessions per period
- **AI Feedback Requests**: AI-powered feedback usage tracking
- **Module Access**: Premium vs. free module access
- **Session Duration**: Total practice time tracking
- **Performance Analytics**: Advanced analytics access

#### File Storage Usage
- **Audio File Storage**: Total file storage usage per user
- **Storage Duration**: File retention period based on usage tier
- **Upload Frequency**: File upload rate limiting
- **File Size Limits**: Maximum file size based on subscription
- **Archive Access**: Historical file access permissions

#### AI Service Usage
- **AI Processing Credits**: Credits for AI-powered features
- **Advanced Features**: Access to premium AI features
- **Real-time Feedback**: Advanced real-time coaching access
- **Personalization Level**: Depth of personalization available
- **Priority Processing**: Faster processing for premium users

### Subscription Tier Integration
Foundation must support multiple subscription levels:

#### Free Tier Limits
- **Meeting Analysis**: 30 minutes per month
- **Practice Sessions**: 10 sessions per month
- **File Storage**: 500 MB total storage
- **Basic Modules**: Access to foundation-level modules only
- **Standard Processing**: Regular processing priority and speed

#### Pro Tier Limits
- **Meeting Analysis**: 180 minutes per month (6 hours)
- **Practice Sessions**: 50 sessions per month
- **File Storage**: 5 GB total storage
- **Premium Modules**: Access to all practice modules
- **Priority Processing**: Faster processing and higher priority

#### Enterprise Tier Limits
- **Meeting Analysis**: Unlimited
- **Practice Sessions**: Unlimited
- **File Storage**: Unlimited
- **Custom Modules**: Custom company-specific modules
- **Dedicated Processing**: Dedicated processing resources

---

## Usage Enforcement Requirements

### Real-time Usage Tracking
- **Live Monitoring**: Real-time usage consumption tracking
- **Instant Validation**: Immediate usage limit validation
- **Soft Limits**: Warning notifications before hard limits
- **Usage Prediction**: Predicted usage based on current patterns
- **Reset Scheduling**: Automatic usage limit reset at billing cycles

### Limit Enforcement
- **Graceful Degradation**: Smooth limit enforcement without breaking UX
- **Feature Disabling**: Selective feature disabling when limits exceeded
- **Queue Deprioritization**: Lower priority when approaching limits
- **Upload Blocking**: Prevent uploads when storage limits exceeded
- **Processing Delays**: Extended processing times for limit-exceeded users

### Educational Messaging
- **Usage Awareness**: Clear communication of current usage status
- **Limit Notifications**: Proactive notifications when approaching limits
- **Value Communication**: Clear explanation of upgrade benefits
- **Usage Optimization**: Tips for optimizing usage within limits
- **Upgrade Guidance**: Clear pathways to increased limits

---

## Usage Dashboard

### User Usage Dashboard
- **Current Usage**: Real-time usage across all categories
- **Historical Trends**: Usage patterns and trends over time
- **Limit Status**: Current position relative to limits
- **Upgrade Benefits**: Clear visualization of upgrade benefits
- **Usage Optimization**: Recommendations for efficient usage

### Usage Analytics
- **Platform Metrics**: Overall platform usage analytics
- **Feature Adoption**: Usage pattern analysis across features
- **Limit Effectiveness**: Analysis of limit impact on user behavior
- **Upgrade Conversion**: Usage pattern correlation with upgrades
- **Resource Planning**: Usage data for infrastructure planning

### Billing Integration
- **Usage Attribution**: Accurate usage attribution for billing
- **Overage Calculation**: Automatic overage calculation and billing
- **Usage Reports**: Detailed usage reports for enterprise customers
- **Cost Projection**: Future cost projection based on usage trends
- **Budget Alerts**: Proactive budget and usage alerts

---

## Implementation Deliverables

### Usage Tracking System
- **Usage Collectors**: Real-time usage data collection
- **Usage Calculators**: Accurate usage calculation across categories
- **Limit Validators**: Real-time limit validation and enforcement
- **Usage Aggregators**: Usage data aggregation and reporting
- **Reset Schedulers**: Automatic usage reset and billing cycle management

### Enforcement Components
- **Limit Gates**: Usage limit enforcement at access points
- **Feature Guards**: Feature-level access control based on usage
- **Queue Managers**: Usage-based priority queue management
- **Message Generators**: Educational and notification message generation
- **Upgrade Prompts**: Contextual upgrade prompts and pathways

### Dashboard Interface
- **Usage Visualizations**: Clear usage charts and progress indicators
- **Historical Views**: Historical usage trends and patterns
- **Limit Displays**: Clear limit status and remaining usage
- **Upgrade CTAs**: Strategic upgrade call-to-action placement
- **Optimization Tools**: Usage optimization tools and recommendations

---

## Quality Assurance Requirements

### Accuracy Standards
- **Usage Precision**: Accurate usage tracking down to the minute/MB
- **Calculation Validation**: Validated usage calculation algorithms
- **Real-time Accuracy**: Real-time usage data accuracy and consistency
- **Billing Accuracy**: 100% accurate billing integration
- **Audit Trail**: Complete usage audit trail for verification

### Performance Standards
- **Real-time Tracking**: Instant usage tracking without performance impact
- **Dashboard Performance**: Fast-loading usage dashboard
- **Enforcement Speed**: Instant limit enforcement without delays
- **Query Optimization**: Efficient usage data queries
- **Scalability**: Usage system scalable to large user bases

### User Experience Standards
- **Transparent Limits**: Clear and understandable limit communication
- **Graceful Enforcement**: Limit enforcement without breaking workflows
- **Helpful Messaging**: Educational and actionable limit messaging
- **Upgrade Clarity**: Clear upgrade benefits and process
- **Usage Optimization**: Helpful usage optimization guidance

---

## Integration Requirements

### Database Integration
- **Usage Tables**: Comprehensive usage data storage
- **Billing Integration**: Integration with billing and subscription data
- **Historical Storage**: Long-term usage data storage and retrieval
- **Real-time Updates**: Real-time usage data updates
- **Performance Optimization**: Optimized queries for usage tracking

### Platform Integration
- **Feature Integration**: Integration with all usage-tracked features
- **Authentication Integration**: User-based usage tracking
- **Processing Integration**: Integration with meeting processing pipeline
- **Practice Integration**: Integration with practice session management
- **Storage Integration**: Integration with file storage management

### External Integration
- **Billing System**: Integration with subscription billing system
- **Analytics Platform**: Integration with usage analytics platform
- **Notification System**: Integration with notification delivery
- **Support System**: Integration with customer support tools
- **Monitoring System**: Integration with system monitoring and alerting

---

## Subscription Management

### Tier Management
- **Subscription Detection**: Accurate subscription tier detection
- **Limit Configuration**: Configurable limits per subscription tier
- **Upgrade Processing**: Seamless subscription upgrade processing
- **Downgrade Handling**: Graceful subscription downgrade handling
- **Trial Management**: Free trial and usage tracking

### Usage-Based Billing
- **Overage Tracking**: Accurate overage usage tracking
- **Billing Events**: Usage events for billing system integration
- **Cost Calculation**: Real-time cost calculation for usage
- **Budget Tracking**: Budget tracking and alert system
- **Invoice Integration**: Detailed usage breakdown for invoices

---

## Success Criteria

### Functional Requirements
- [ ] Usage tracking accurate across all platform features
- [ ] Limit enforcement working smoothly without breaking UX
- [ ] Usage dashboard providing clear usage visibility
- [ ] Educational messaging helping users understand limits
- [ ] Upgrade pathways clear and accessible

### Accuracy Requirements
- [ ] Usage tracking accurate to the minute/MB level
- [ ] Billing integration 100% accurate
- [ ] Real-time usage data consistent and reliable
- [ ] Limit calculations precise and validated
- [ ] Audit trail comprehensive and verifiable

### Performance Requirements
- [ ] Usage tracking adding minimal performance overhead
- [ ] Real-time limit validation working instantly
- [ ] Dashboard loading quickly with large usage datasets
- [ ] Enforcement mechanisms responding immediately
- [ ] Query performance optimized for large-scale usage

### User Experience Requirements
- [ ] Limit communication clear and helpful
- [ ] Enforcement graceful and non-disruptive
- [ ] Upgrade benefits clearly communicated
- [ ] Usage optimization guidance helpful
- [ ] Overall UX maintained despite usage constraints

---

## Phase 2 Integration Notes

This slice enables sustainable platform operation through usage management:
- **Meeting Processing (Slice 2-5)**: Enforces meeting analysis usage limits
- **Practice Module (Slice 2-6)**: Controls practice session access based on usage
- **File Upload (Slice 2-4)**: Enforces storage limits and upload restrictions
- **Progress Tracking (Slice 2-7)**: Tracks usage analytics for optimization

Usage management is critical for platform scalability and business sustainability.