# Scenario Generation Engine - Technical Documentation

**Version:** 1.0  
**Date:** October 4, 2025  
**Status:** Production Ready  

---

## Overview

The Scenario Generation Engine is a core component of ShipSpeak that creates personalized practice scenarios for Product Managers. It implements a sophisticated 3-phase generation pipeline that transforms 50 base scenarios into infinite personalized variations using AI and context variables.

## Architecture

### 3-Phase Generation Pipeline

1. **Phase 1: Batch Template Generation (Weekly)**
   - Cost-optimized batch processing using GPT-3.5
   - Generates 100+ scenario templates per week
   - Combines base scenarios with context variables
   - Target cost: ~$5 per week for entire batch

2. **Phase 2: Daily Personalization (On-Demand)**
   - GPT-4 powered personalization for individual users
   - Adapts templates to user profile and weaknesses
   - Target cost: $0.02 per personalized scenario

3. **Phase 3: Real-Time Adaptation (During Practice)**
   - Dynamic difficulty adjustment during practice sessions
   - Cached response patterns with minor adjustments
   - Target cost: $0.01 per practice session

### Core Components

```typescript
// Main service class
ScenarioGenerationService
├── Base Scenario Library (50 scenarios across 10 categories)
├── Context Variable System (5x multiplication factor)
├── Template Cache (Generated scenarios storage)
├── Personalization Engine (User-specific adaptation)
└── Smart Sampling Integration (Meeting-based scenarios)
```

## Base Scenario Taxonomy

### 10 Categories with 5 Scenarios Each

#### Communication-Focused Categories (25 scenarios)
1. **Stakeholder Management** - Executive pushback, customer escalations, board communications
2. **Decision Communication** - Strategy pivots, feature sunsets, resource requests
3. **Data & Metrics Defense** - Declining metrics, uncertain forecasting, conflicting interpretations
4. **Team Dynamics** - Engineering pushback, design conflicts, cross-functional alignment
5. **Crisis Communication** - Security breaches, production issues, competitive threats

#### Product Sense Categories (25 scenarios)
6. **Market & Competition** - Competitive response, pricing strategy, market positioning
7. **User Problem Solving** - Feature prioritization, user segment conflicts, technical constraints
8. **Business Model Thinking** - Unit economics, monetization pivots, growth vs profitability
9. **Systems Thinking** - Second-order effects, technical debt, scale considerations
10. **Innovation vs Optimization** - Innovation timing, risk assessment, resource allocation

## Context Variable System

### 5 Dimensions for Personalization

```typescript
interface ContextVariables {
  industry: IndustryContext        // B2B SaaS, Consumer, Marketplace, Fintech, Healthcare
  companyStage: CompanyStage       // Early Startup, Growth, Late Stage, Public, Turnaround
  urgencyLevel: UrgencyLevel       // Crisis Mode, Normal Planning, Strategic Thinking
  powerDynamics: PowerDynamics     // You Have Leverage, They Have Leverage, Equal Footing
  relationshipHistory: RelationshipHistory // First Interaction, Positive History, Tension/Conflict
}
```

### Multiplication Factor
- 5 industries × 5 company stages × 3 urgency levels × 3 power dynamics × 3 relationship histories
- = **1,125 unique context combinations per base scenario**
- = **56,250 total unique scenario templates possible**

## Implementation Details

### Service Configuration

```typescript
interface ScenarioGenerationConfig {
  openaiApiKey: string
  enableBatchGeneration: boolean
  batchGenerationSchedule: string    // cron: '0 0 * * SUN'
  personalizationCostLimit: number   // $0.05 max per scenario
  qualityThreshold: number           // 0.8 minimum quality score
  cacheEnabled: boolean
  cacheExpiryHours: number          // 24 hours default
}
```

### Quality Scoring Algorithm

The engine implements a comprehensive quality scoring system:

```typescript
Quality Score = (
  Content Completeness (30%) +
  Interactive Elements (40%) +
  Learning Elements (30%)
)

Factors:
- Scenario text length and depth
- Number of possible user responses
- Escalation path complexity
- Success criteria clarity
- Debrief question quality
```

### Base Scenario Structure

```typescript
interface BaseScenario {
  id: string                        // Unique identifier
  category: ScenarioCategory        // One of 10 categories
  subcategory: string              // Specific scenario type
  title: string                    // Human-readable name
  description: string              // Brief description
  coreNarrative: string           // Core story/situation
  stakeholderProfile: StakeholderProfile  // Who you're dealing with
  learningObjectives: LearningObjective[] // What skills are developed
  difficultyRange: [number, number]       // Min/max difficulty (1-5)
  estimatedDuration: number               // Minutes to complete
  pmSkillFocus: PMSkillArea[]            // Target PM skills
}
```

## Smart Sampling Integration

The engine integrates with the Smart Sampling system to generate scenarios based on actual meeting analysis:

### Meeting-Based Scenario Flow
1. **Analysis Input** - Receives PMAnalysisResult from Smart Sampling
2. **Weakness Identification** - Maps detected issues to practice areas
3. **Scenario Selection** - Finds relevant base scenarios
4. **Context Generation** - Creates appropriate context variables
5. **Personalized Output** - Generates targeted practice scenario

### Supported Analysis Mappings
- `CONFIDENCE_ISSUES` → Executive Presence scenarios
- `STRUCTURE_PROBLEMS` → Strategic Communication scenarios
- `STAKEHOLDER_CONFLICTS` → Stakeholder Management scenarios
- `DATA_ISSUES` → Data & Metrics Defense scenarios

## API Methods

### Core Generation Methods

```typescript
// Phase 1: Batch template generation
generateBatchTemplates(count: number, options?: BatchOptions): Promise<BatchResult>

// Phase 2: User personalization
generatePersonalizedScenario(
  templateId: string, 
  context: PersonalizationContext,
  options?: PersonalizationOptions
): Promise<GeneratedScenario | null>

// Phase 3: Meeting-based generation
generateFromMeetingAnalysis(
  analysis: PMAnalysisResult,
  userProfile: UserProfile
): Promise<GeneratedScenario | null>
```

### Utility Methods

```typescript
// Scenario discovery
getBaseScenarios(): BaseScenario[]
getScenariosByCategory(category: ScenarioCategory): BaseScenario[]

// Cache management
getCachedTemplates(): ScenarioTemplate[]
clearCache(): void
```

## Performance Characteristics

### Generation Times
- **Batch Template**: ~30 seconds per template (GPT-3.5)
- **Personalization**: ~15 seconds per scenario (GPT-4)
- **Meeting-Based**: ~45 seconds total (analysis + generation)

### Cost Optimization
- **75% cost reduction** through smart sampling techniques
- **Batch processing** during off-peak hours
- **Template reuse** across multiple personalizations
- **Fallback mechanisms** to prevent API failures

### Quality Metrics
- **Quality threshold**: 0.8/1.0 minimum score
- **Realism validation**: "Would a real PM face this?" test
- **Learning effectiveness**: Skill improvement tracking
- **User engagement**: Completion rates and feedback

## Testing Strategy

### Test Coverage
- **31 comprehensive tests** covering all major functionality
- **100% code path coverage** for critical methods
- **Mock services** for OpenAI and Smart Sampling integration
- **Error handling** for all failure scenarios

### Test Categories
1. **Initialization Tests** - Base scenario loading and service setup
2. **Batch Generation Tests** - Template generation and context application
3. **Personalization Tests** - User-specific scenario adaptation
4. **Integration Tests** - Smart Sampling and meeting analysis integration
5. **Quality Tests** - Scenario quality scoring and validation
6. **Error Handling Tests** - Graceful failure and fallback mechanisms

## Deployment and Operations

### Environment Setup
```bash
# Install dependencies
npm install

# Run tests
npm test -- --testPathPattern=scenario-generation

# Production deployment
npm run build
```

### Monitoring
- **Generation success rates** - Track API call success/failure
- **Quality scores** - Monitor scenario quality over time
- **Cost tracking** - OpenAI API usage and costs
- **User engagement** - Scenario completion and satisfaction rates

### Troubleshooting

Common issues and solutions:

1. **Template Generation Failures**
   - Check OpenAI API key validity
   - Verify API rate limits not exceeded
   - Review prompt structure and formatting

2. **Low Quality Scores**
   - Increase GPT temperature for more creativity
   - Enhance prompt engineering for better context
   - Add more detailed base scenario narratives

3. **Cache Performance Issues**
   - Adjust cache expiry settings
   - Monitor memory usage patterns
   - Implement cache size limits

## Future Enhancements

### Planned Features
1. **Community Scenarios** - User-submitted scenario validation and integration
2. **Historical Cases** - Real PM decision scenarios from tech history
3. **Industry Specialization** - Deep industry-specific scenario banks
4. **Adaptive Difficulty** - Machine learning-based difficulty adjustment
5. **Multi-language Support** - Scenario generation in multiple languages

### Performance Improvements
1. **Streaming Generation** - Real-time scenario streaming
2. **Predictive Caching** - AI-powered cache preloading
3. **Edge Computing** - Distributed scenario generation
4. **Cost Optimization** - Advanced prompt compression techniques

---

**Last Updated:** October 4, 2025  
**Next Review:** January 4, 2026  
**Maintainer:** ShipSpeak Engineering Team