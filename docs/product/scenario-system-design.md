# Scenario System Design & Generation Methodology

**Product**: ShipSpeak - Scenario System Design  
**Version**: 1.0  
**Date**: October 4, 2025  
**Author**: Product Team  

---

## Overview

The Scenario System is the engine that powers ShipSpeak's practice modules, generating contextually relevant, progressively challenging situations that develop both communication skills and product sense. This document outlines the systematic approach to creating, organizing, and generating scenarios at scale while maintaining quality and relevance.

---

## Core Design Philosophy

### 1. Systematic Quality at Scale
- Methodical taxonomy ensures comprehensive coverage
- Quality frameworks guarantee educational value
- Automated generation maintains consistency while enabling personalization

### 2. Progressive Complexity
- Scenarios adapt to user skill level and performance
- Multiple difficulty layers within each base scenario
- Thinking trees that go from surface-level to strategic depth

### 3. Real-World Relevance
- Based on actual PM situations and historical cases
- Industry-specific contexts and stakeholder dynamics
- Authentic language patterns and business pressures

---

## Scenario Taxonomy Structure

### Level 1: Base Scenario Categories (10 Categories)

#### Communication-Focused Categories (5)

**1. Stakeholder Management**
- Skeptical executive pushing back on strategy
- Angry customer escalation requiring PM response
- Confused board member asking basic questions
- Impatient engineering lead questioning priorities
- Risk-averse legal counsel blocking feature launch

**2. Decision Communication**
- Pivoting product direction mid-quarter
- Killing a beloved but underperforming feature
- Delaying high-visibility launch due to quality issues
- Requesting additional resources/budget
- Admitting strategic mistake and course correction

**3. Data & Metrics Defense**
- Explaining declining user engagement metrics
- Forecasting with high uncertainty/limited data
- Resolving conflicting metric interpretations
- Handling missing data for critical decisions
- Distinguishing correlation vs causation in results

**4. Team Dynamics**
- Engineering team pushback on technical feasibility
- Design-engineering disagreement on implementation
- Sales team overpromising features to prospects
- Remote team alignment challenges
- Managing underperforming team member

**5. Crisis Communication**
- Security breach affecting user data
- Major bug discovered in production
- Competitor launching similar feature
- Key team member leaving mid-project
- Regulatory changes affecting product strategy

#### Product Sense Categories (5)

**6. Market & Competition Analysis**
- Competitive feature response strategy
- Market disruption assessment and reaction
- Pricing strategy under competitive pressure
- Partnership evaluation with strategic implications
- Build vs. buy vs. partner decision framework

**7. User Problem Solving**
- Feature prioritization with conflicting user needs
- User segment conflicts (power users vs. mainstream)
- Edge case handling vs. core experience focus
- Technical constraint navigation affecting UX
- Balancing user requests vs. product vision

**8. Business Model Thinking**
- Unit economics deep dive with stakeholders
- Monetization strategy pivot discussion
- Growth vs. profitability trade-off decisions
- Platform vs. product strategic choice
- Network effects identification and leveraging

**9. Systems Thinking**
- Second-order consequences of feature decisions
- Technical debt implications for product roadmap
- Scale considerations (1K vs 1M vs 100M users)
- Cross-functional impact assessment
- Ecosystem effects on partners/developers

**10. Innovation vs. Optimization**
- When to innovate vs. iterate decisions
- Risk assessment for breakthrough features
- Resource allocation between maintenance and growth
- Timing decisions for market entry
- Success metrics definition for experimental features

### Level 2: Context Variables (5x Multiplication)

Each base scenario gets modified by:

#### Industry Context
- **B2B SaaS**: Enterprise sales cycles, compliance requirements
- **Consumer**: Viral growth, user engagement patterns
- **Marketplace**: Two-sided network effects, liquidity challenges
- **Fintech**: Regulatory constraints, security requirements
- **Healthcare**: Privacy regulations, safety considerations

#### Company Stage
- **Early Startup** (Pre-Series A): Resource constraints, product-market fit
- **Growth Stage** (Series A-C): Scaling challenges, team expansion
- **Late Stage** (Series D+): Market leadership, optimization focus
- **Public Company**: Quarterly pressure, regulatory requirements
- **Turnaround**: Cost reduction, strategic refocus

#### Urgency Level
- **Crisis Mode**: Immediate decision required, high stakes
- **Normal Planning**: Quarterly/annual planning timeframe
- **Strategic Thinking**: Long-term vision, 2-3 year horizon

#### Power Dynamics
- **You Have Leverage**: Strong performance, market success
- **They Have Leverage**: Poor results, external pressure
- **Equal Footing**: Balanced negotiation, mutual respect

#### Relationship History
- **First Interaction**: No established relationship
- **Positive History**: Previous successful collaborations
- **Tension/Conflict**: Past disagreements or failures

### Level 3: Personalization Layer (Infinite Variations)

Based on user profile:

#### Personal Weaknesses
- Communication style (over-explaining, defensive, unclear)
- Product sense gaps (market awareness, technical depth)
- Stakeholder management challenges
- Decision-making patterns

#### Professional Context
- Current company industry and stage
- PM level and scope of responsibility
- Recent meeting analysis patterns
- Practice history and progress

#### Learning Preferences
- Preferred difficulty progression rate
- Communication vs. product sense focus
- Scenario length and format preferences

---

## Scenario Generation Pipeline

### Phase 1: Weekly Batch Generation (Cost-Optimized)
**Timing**: Sunday nights, off-peak hours  
**Volume**: 100+ scenarios per week  
**Cost**: ~$5 for entire week's content  

```
Input: Base scenario + Context variables
Process: GPT-3.5 variations of proven patterns
Output: Semi-structured scenario templates

Example Output:
{
  "base_scenario": "stakeholder_pushback_pricing",
  "context": {
    "industry": "b2b_saas",
    "stage": "series_b", 
    "urgency": "normal_planning",
    "power": "equal_footing",
    "history": "positive"
  },
  "scenario_text": "Your head of sales approaches you during quarterly planning...",
  "stakeholder_motivation": "Concerned about losing deals to lower-priced competitors",
  "difficulty_level": 3,
  "learning_objectives": ["pricing_strategy", "sales_alignment"]
}
```

### Phase 2: Daily Personalization (On-Demand)
**Timing**: When user requests practice session  
**Process**: Batch scenario + user context → personalized version  
**Cost**: $0.02 per personalized scenario  

```
Input: Batch scenario + User profile
Process: GPT-4 customization pass
Output: Fully personalized scenario

Personalization adds:
- User's actual company context
- Specific weakness targeting
- Communication style adaptation
- Industry-specific language
```

### Phase 3: Real-Time Adaptation (During Practice)
**Timing**: As user practices and responds  
**Process**: Cached response patterns + minor adjustments  
**Cost**: $0.01 per practice session  

```
User Response Analysis:
- Quality of reasoning
- Communication clarity
- Framework application
- Confidence level

Adaptation Logic:
- If struggling → Provide more guidance
- If excelling → Increase difficulty
- If confused → Clarify context
- If defensive → Adjust stakeholder approach
```

---

## Quality Framework

### Every Scenario Must Include:

#### 1. Clear Learning Objective
```
Primary: What skill is being developed?
Secondary: What framework or pattern should they recognize?
Tertiary: What meta-skill (thinking about thinking) is being built?

Example:
Primary: Stakeholder objection handling
Secondary: Understanding underlying motivations vs. surface concerns
Tertiary: Asking clarifying questions before responding
```

#### 2. Realistic Context
```
Based on actual PM situations:
- Authentic stakeholder language patterns
- Realistic business pressures and constraints
- Industry-appropriate technical details
- Credible timelines and resource limitations

Validation: "Would a real PM face this exact situation?"
```

#### 3. Multiple Valid Approaches
```
No single "right" answer, but clear principles:
- Different communication styles can succeed
- Various frameworks can apply
- Multiple paths to good outcomes
- Clear criteria for evaluation

Prevents overly prescriptive training
```

#### 4. Escalation Trees
```
Stakeholder response patterns:
If user does X → stakeholder responds Y
If user does A → stakeholder responds B

Dynamic scenarios that adapt to user choices:
- Defensive response → stakeholder becomes more skeptical
- Collaborative approach → stakeholder shares more context
- Data-driven response → stakeholder asks deeper questions
```

#### 5. Debrief Insights
```
Pattern recognition focus:
- What communication pattern did you use?
- What product thinking framework applied?
- How did stakeholder motivations influence the interaction?
- What would you do differently next time?

Connects practice to broader PM skill development
```

---

## Thinking Trees: Deep Product Sense Development

### 5-Level Progression for Strategic Thinking

#### Example: "Should we build an AI feature?"

**Level 1: Surface Thinking**
- "AI is trendy and customers expect it"
- "Competitors are doing it"
- Basic feature comparison

**Level 2: User-Centered Thinking**
- "What problem does AI solve for our users?"
- "Which user segments would benefit most?"
- Basic user needs analysis

**Level 3: Strategic Positioning**
- "Is this a core differentiator or table stakes?"
- "How does this affect our competitive positioning?"
- Market dynamics understanding

**Level 4: Systems & Trade-offs**
- "What's the opportunity cost? What won't we build?"
- "How does this affect our technical architecture?"
- Resource allocation and long-term implications

**Level 5: Ecosystem & Vision**
- "How does this affect our platform strategy?"
- "What new capabilities does this unlock?"
- "How does this align with our 3-year vision?"
- Strategic ecosystem thinking

### AI Mentor Progression Through Levels

```
Level 1 Response: "AI would be cool for our users"

AI: "That's a start. What specific problem would AI solve for them?"

Level 2 Response: "Help them analyze their data faster"

AI: "Good! Now think bigger picture - how does 'faster data analysis' 
affect your competitive position?"

Level 3 Response: "We'd be the only platform with built-in AI insights"

AI: "Interesting positioning. What would you need to invest to make that true? 
And what would you have to sacrifice?"

[Continues guiding toward Level 4/5 thinking]
```

---

## Scenario Library Management

### Content Organization

#### Core Library Structure
```
scenarios/
├── base_templates/          # 50 foundational scenarios
├── context_variations/      # 250 contextualized versions  
├── user_personalized/       # Infinite personalized variants
├── historical_cases/        # Real PM situations (anonymized)
└── community_generated/     # User-submitted scenarios (future)
```

#### Quality Control Process
```
1. Expert Review: Senior PM validates realism and learning value
2. User Testing: Beta scenarios tested with sample users
3. Effectiveness Measurement: Track learning outcome success rates
4. Iterative Refinement: Update based on user feedback and performance
```

### Content Refresh Strategy

#### Monthly Content Updates
- Add 10 new base scenarios per month
- Update context variables based on market changes
- Refresh industry-specific details
- Incorporate user feedback and requests

#### Seasonal Industry Focus
- Q1: Planning and strategy scenarios
- Q2: Growth and scaling challenges  
- Q3: Optimization and efficiency
- Q4: Vision setting and team development

---

## Advanced Generation Features

### Historical Case Integration
```
Source: Famous PM decisions from tech history
Examples:
- "You're at Instagram in 2012: Facebook offers $1B acquisition"
- "You're at Netflix in 2011: Should you split streaming and DVDs?"
- "You're at Slack in 2019: How do you respond to Microsoft Teams?"

Value: Learn from real strategic decisions with known outcomes
Format: User practices the decision, then sees what actually happened
```

### Industry Simulation Mode
```
Deep industry-specific scenarios:
- Healthcare: FDA approval processes, patient safety
- Financial Services: Regulatory compliance, risk management
- Gaming: Live ops, monetization ethics
- Enterprise: Procurement cycles, compliance requirements

Customization: Scenarios reflect actual industry constraints and stakeholders
```

### Adaptive Difficulty Engine
```
Performance Tracking:
- Communication clarity score
- Strategic thinking depth
- Speed of pattern recognition
- Framework application consistency

Adaptation Logic:
- Struggling → Easier scenarios with more guidance
- Excelling → Complex multi-stakeholder situations
- Plateau → Different scenario types to challenge new skills
- Mastery → Teaching scenarios where user coaches others
```

---

## Success Metrics & Optimization

### Content Quality Metrics
- **Scenario Realism Score**: User rating of "would this actually happen?"
- **Learning Effectiveness**: Skill improvement per scenario type
- **Engagement Level**: Time spent per scenario, completion rates
- **Transfer Success**: Application of practiced skills in real meetings

### Generation Efficiency Metrics
- **Cost per Scenario**: Target <$0.05 for personalized scenarios
- **Generation Speed**: <30 seconds for personalized scenario
- **Quality Consistency**: Automated checks for learning objectives
- **Coverage Completeness**: Ensuring all skill areas are addressed

### User Experience Metrics
- **Scenario Relevance**: "This feels like my actual work" rating
- **Difficulty Appropriateness**: Neither too easy nor too hard
- **Variety Satisfaction**: Fresh content preventing repetition
- **Progress Recognition**: Clear skill development visibility

---

This systematic approach to scenario generation ensures ShipSpeak can deliver personalized, high-quality practice experiences at scale while maintaining educational effectiveness and cost efficiency.