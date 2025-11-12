-- ShipSpeak Seed Data Migration
-- Migration: 002_seed_data.up.sql
-- Description: Insert base scenario templates and system configuration
-- Version: 1.0
-- Created: 2025-11-11

-- ============================================================================
-- SYSTEM CONFIGURATION
-- ============================================================================

INSERT INTO system_config (config_key, config_value, description) VALUES
('smart_sampling_presets', '{
    "COST_OPTIMIZED": {
        "sampling_percentage": 15,
        "chunk_selection": "strategic",
        "cost_target": "minimal"
    },
    "BALANCED": {
        "sampling_percentage": 25,
        "chunk_selection": "hybrid",
        "cost_target": "moderate"
    },
    "QUALITY_FOCUSED": {
        "sampling_percentage": 40,
        "chunk_selection": "comprehensive",
        "cost_target": "premium"
    },
    "ENTERPRISE": {
        "sampling_percentage": 60,
        "chunk_selection": "exhaustive",
        "cost_target": "maximum_quality"
    }
}', 'Smart Sampling Engine configuration presets'),

('ai_models', '{
    "gpt4_turbo": {
        "model": "gpt-4-turbo-preview",
        "cost_per_token": 0.00001,
        "use_case": "meeting_analysis"
    },
    "gpt4": {
        "model": "gpt-4",
        "cost_per_token": 0.00003,
        "use_case": "scenario_generation"
    },
    "whisper": {
        "model": "whisper-1",
        "cost_per_minute": 0.006,
        "use_case": "transcription"
    }
}', 'AI model configurations and pricing'),

('feature_flags', '{
    "voice_analysis": false,
    "real_time_feedback": false,
    "enterprise_features": false,
    "meeting_bots": false
}', 'Feature flags for gradual rollout')
ON CONFLICT (config_key) DO UPDATE SET
    config_value = EXCLUDED.config_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================================
-- BASE SCENARIO TEMPLATES
-- ============================================================================

-- Executive Presence Scenarios
INSERT INTO scenario_templates (name, category, difficulty_level, scenario_prompt, context_variables, stakeholder_personas, success_criteria, estimated_duration_minutes, tags) VALUES

('Executive Summary Presentation', 'executive_presence', 'foundation', 
'You need to present a 3-minute executive summary of {{product_initiative}} to {{stakeholder_type}}. Focus on {{key_metric}} and address concerns about {{main_challenge}}.', 
'{
    "product_initiative": ["new feature launch", "market expansion", "platform migration", "user experience redesign"],
    "stakeholder_type": ["CEO", "Board of Directors", "Executive Team", "Investors"],
    "key_metric": ["user growth", "revenue impact", "cost reduction", "market share"],
    "main_challenge": ["technical complexity", "resource constraints", "competitive pressure", "timeline concerns"]
}',
'{
    "CEO": {"name": "Sarah", "style": "data_driven", "concerns": ["ROI", "strategic_alignment"]},
    "Board_Member": {"name": "David", "style": "skeptical", "concerns": ["risk_mitigation", "competitive_advantage"]},
    "Investor": {"name": "Maria", "style": "growth_focused", "concerns": ["scalability", "market_opportunity"]}
}',
'{
    "clear_opening": "Start with key outcome within 30 seconds",
    "executive_presence": "Confident delivery, appropriate eye contact",
    "data_driven": "Support claims with 2-3 key metrics",
    "time_management": "Complete within time limit"
}', 5, ARRAY['executive_presence', 'presentations', 'data_storytelling']),

('Difficult Stakeholder Conversation', 'executive_presence', 'practice',
'{{stakeholder_role}} is pushing back on your {{recommendation}} due to {{objection_reason}}. You need to maintain executive presence while addressing their concerns and moving toward {{desired_outcome}}.', 
'{
    "stakeholder_role": ["Engineering Director", "Sales VP", "Customer Success Lead", "Finance Director"],
    "recommendation": ["feature deprecation", "resource reallocation", "timeline adjustment", "scope reduction"],
    "objection_reason": ["technical debt concerns", "customer impact", "revenue implications", "team capacity"],
    "desired_outcome": ["alignment on path forward", "compromise solution", "escalation prevention", "timeline commitment"]
}',
'{
    "Engineering_Director": {"name": "Alex", "style": "technical_perfectionist", "triggers": ["technical_shortcuts", "quality_concerns"]},
    "Sales_VP": {"name": "Jordan", "style": "results_oriented", "triggers": ["revenue_impact", "customer_promises"]},
    "Finance_Director": {"name": "Taylor", "style": "risk_averse", "triggers": ["budget_overruns", "roi_uncertainty"]}
}',
'{
    "emotional_regulation": "Stay calm under pressure",
    "active_listening": "Acknowledge concerns before responding",
    "influence_techniques": "Use data and logic, not just authority",
    "outcome_focus": "Drive toward actionable next steps"
}', 8, ARRAY['difficult_conversations', 'stakeholder_management', 'conflict_resolution']),

-- Influence Skills Scenarios  
('Resource Negotiation', 'influence_skills', 'foundation',
'You need {{resource_type}} from {{resource_owner}} for {{project_name}}. They''ve cited {{constraint_reason}} as a blocker. Use influence techniques to secure {{specific_ask}}.', 
'{
    "resource_type": ["engineering bandwidth", "design support", "budget allocation", "executive time"],
    "resource_owner": ["Engineering Manager", "Design Lead", "Finance Director", "Executive Sponsor"],
    "project_name": ["Q4 product launch", "customer experience improvement", "technical debt reduction", "market expansion"],
    "constraint_reason": ["competing priorities", "resource constraints", "timeline concerns", "unclear ROI"],
    "specific_ask": ["2 engineers for 6 weeks", "$50K additional budget", "design review by Friday", "executive decision by EOW"]
}',
'{
    "Engineering_Manager": {"name": "Casey", "style": "pragmatic", "motivators": ["team_impact", "technical_excellence"]},
    "Design_Lead": {"name": "Morgan", "style": "user_focused", "motivators": ["user_experience", "design_quality"]},
    "Finance_Director": {"name": "Riley", "style": "analytical", "motivators": ["clear_roi", "risk_mitigation"]}
}',
'{
    "value_articulation": "Connect ask to business value",
    "reciprocity": "Offer something in return",
    "urgency_creation": "Explain timing importance",
    "stakeholder_alignment": "Use their language and priorities"
}', 6, ARRAY['influence_skills', 'resource_management', 'negotiation']),

('Cross-Functional Alignment', 'influence_skills', 'practice',
'You need to align {{team_a}} and {{team_b}} on {{contentious_issue}}. There''s tension around {{conflict_point}}. Facilitate alignment without formal authority.', 
'{
    "team_a": ["Engineering", "Sales", "Marketing", "Customer Success"],
    "team_b": ["Design", "Finance", "Legal", "Operations"],
    "contentious_issue": ["feature prioritization", "go-to-market strategy", "technical approach", "resource allocation"],
    "conflict_point": ["timeline expectations", "quality standards", "customer impact", "technical feasibility"]
}',
'{
    "Team_Lead_A": {"name": "Jordan", "style": "assertive", "concerns": ["team_reputation", "delivery_commitments"]},
    "Team_Lead_B": {"name": "Avery", "style": "collaborative", "concerns": ["sustainable_practices", "quality_outcomes"]},
    "Neutral_Observer": {"name": "Quinn", "style": "analytical", "role": "asks_probing_questions"}
}',
'{
    "neutral_facilitation": "Stay objective, don''t take sides",
    "common_ground": "Find shared objectives",
    "win_win_solutions": "Propose solutions that benefit both teams",
    "commitment_securing": "Get specific next steps and owners"
}', 10, ARRAY['influence_skills', 'facilitation', 'conflict_resolution', 'cross_functional']),

-- Strategic Communication Scenarios
('Vision Alignment Meeting', 'strategic_communication', 'foundation',
'Present your {{vision_type}} vision for {{product_area}} to {{audience_type}}. Address concerns about {{strategic_challenge}} while maintaining momentum.', 
'{
    "vision_type": ["3-year product", "market expansion", "platform evolution", "customer experience"],
    "product_area": ["core platform", "mobile experience", "enterprise features", "developer tools"],
    "audience_type": ["product team", "engineering leadership", "executive committee", "board members"],
    "strategic_challenge": ["technical complexity", "market competition", "resource requirements", "timeline ambition"]
}',
'{
    "Product_Manager": {"name": "Sam", "style": "detail_oriented", "questions": ["implementation_specifics", "success_metrics"]},
    "Engineering_Lead": {"name": "Dakota", "style": "pragmatic", "questions": ["technical_feasibility", "resource_needs"]},
    "Executive": {"name": "Phoenix", "style": "strategic", "questions": ["market_positioning", "competitive_advantage"]}
}',
'{
    "vision_clarity": "Paint clear picture of future state",
    "strategic_rationale": "Connect to business objectives",
    "implementation_pathway": "Show how to get there",
    "stakeholder_buy_in": "Address specific concerns"
}', 12, ARRAY['strategic_communication', 'vision_setting', 'leadership']),

-- Difficult Conversations Scenarios
('Performance Discussion', 'difficult_conversations', 'practice',
'You need to address {{performance_issue}} with {{team_member_type}}. They''ve been {{specific_behavior}} which impacts {{team_impact}}. Have a constructive conversation.', 
'{
    "performance_issue": ["missed deadlines", "communication gaps", "quality concerns", "collaboration challenges"],
    "team_member_type": ["senior engineer", "product designer", "data analyst", "junior PM"],
    "specific_behavior": ["working in isolation", "missing key meetings", "delivering incomplete work", "conflicting with stakeholders"],
    "team_impact": ["team morale", "project timeline", "stakeholder confidence", "product quality"]
}',
'{
    "Team_Member": {"name": "River", "style": "defensive", "background": "high_performer_struggling"},
    "HR_Partner": {"name": "Sage", "style": "supportive", "role": "guidance_provider"}
}',
'{
    "empathetic_approach": "Lead with care and understanding",
    "specific_examples": "Use concrete, observable behaviors",
    "collaborative_solutions": "Work together on improvement plan",
    "clear_expectations": "Set specific, measurable goals"
}', 7, ARRAY['difficult_conversations', 'performance_management', 'team_leadership']),

-- Board Presentations Scenarios
('Quarterly Business Review', 'board_presentations', 'mastery',
'Present Q{{quarter_number}} results to the board. {{performance_status}} against targets. Address questions about {{strategic_concern}} and present plan for {{next_quarter_focus}}.', 
'{
    "quarter_number": ["1", "2", "3", "4"],
    "performance_status": ["exceeded expectations", "met targets", "missed key metrics", "mixed results"],
    "strategic_concern": ["competitive threats", "market headwinds", "execution challenges", "scaling issues"],
    "next_quarter_focus": ["growth acceleration", "operational efficiency", "market expansion", "product innovation"]
}',
'{
    "Board_Chair": {"name": "Dr. Chen", "style": "strategic_questioner", "focus": ["long_term_vision", "risk_management"]},
    "Investor_Representative": {"name": "Pat Kim", "style": "metrics_driven", "focus": ["growth_metrics", "unit_economics"]},
    "Industry_Expert": {"name": "Alex Rivera", "style": "market_focused", "focus": ["competitive_position", "market_trends"]}
}',
'{
    "executive_summary": "Lead with key takeaways",
    "data_storytelling": "Make numbers compelling",
    "strategic_thinking": "Connect tactics to strategy",
    "confidence_under_pressure": "Handle tough questions gracefully"
}', 15, ARRAY['board_presentations', 'executive_communication', 'strategic_leadership']),

-- Team Leadership Scenarios
('Team Motivation During Crisis', 'team_leadership', 'practice',
'Your team is facing {{crisis_type}} which has led to {{team_morale_issue}}. You need to {{leadership_action}} while maintaining {{business_outcome}}.', 
'{
    "crisis_type": ["major customer churn", "competitive threat", "technical outage", "organizational restructuring"],
    "team_morale_issue": ["decreased confidence", "increased stress", "unclear priorities", "fear of layoffs"],
    "leadership_action": ["refocus the team", "boost morale", "clarify priorities", "demonstrate stability"],
    "business_outcome": ["product delivery", "customer satisfaction", "team retention", "stakeholder confidence"]
}',
'{
    "Team_Member_Optimist": {"name": "Sunny", "style": "solution_focused", "reaction": "looks_for_opportunities"},
    "Team_Member_Realist": {"name": "Practical Pat", "style": "fact_based", "reaction": "asks_hard_questions"},
    "Team_Member_Worried": {"name": "Concerned Chris", "style": "risk_aware", "reaction": "expresses_fears"}
}',
'{
    "authentic_leadership": "Be genuine about challenges",
    "clear_communication": "Provide transparent updates",
    "team_support": "Show care for team members",
    "path_forward": "Paint picture of recovery"
}', 8, ARRAY['team_leadership', 'crisis_management', 'change_management']),

-- Stakeholder Management Scenarios
('Customer Escalation Response', 'stakeholder_management', 'practice',
'{{customer_type}} has escalated {{issue_type}} to executive level. You need to {{response_action}} while ensuring {{relationship_outcome}}.', 
'{
    "customer_type": ["enterprise client", "strategic partner", "high-value customer", "vocal community member"],
    "issue_type": ["feature regression", "service outage", "unmet expectations", "competitive disadvantage"],
    "response_action": ["investigate and respond", "propose compensation", "escalate internally", "negotiate solution"],
    "relationship_outcome": ["trust restoration", "contract renewal", "reference customer", "community advocacy"]
}',
'{
    "Customer_Executive": {"name": "demanding_leader", "style": "results_oriented", "emotion": "frustrated_but_professional"},
    "Internal_Executive": {"name": "supportive_sponsor", "style": "solution_focused", "role": "wants_quick_resolution"},
    "Customer_Success_Manager": {"name": "relationship_owner", "style": "diplomatic", "role": "context_provider"}
}',
'{
    "active_listening": "Understand the real impact",
    "ownership_taking": "Accept responsibility appropriately",
    "solution_orientation": "Focus on fixing, not blame",
    "relationship_preservation": "Strengthen long-term partnership"
}', 10, ARRAY['stakeholder_management', 'customer_success', 'crisis_response']),

-- Product Decisions Scenarios
('Feature vs Technical Debt Prioritization', 'product_decisions', 'foundation',
'You must decide between {{feature_option}} requested by {{stakeholder}} and {{technical_debt_type}} recommended by {{engineering_advocate}}. {{constraint}} limits your options.', 
'{
    "feature_option": ["customer-requested integration", "competitive feature parity", "new user acquisition feature", "enterprise customization"],
    "stakeholder": ["Sales team", "Key customer", "Executive sponsor", "Marketing team"],
    "technical_debt_type": ["performance optimization", "security updates", "architecture refactoring", "testing infrastructure"],
    "engineering_advocate": ["Tech Lead", "Engineering Manager", "Senior Engineer", "Principal Architect"],
    "constraint": ["Limited engineering capacity", "Hard deadline approaching", "Budget restrictions", "Resource dependencies"]
}',
'{
    "Sales_Advocate": {"name": "Revenue Riley", "style": "urgency_driven", "argument": "customer_impact_and_revenue"},
    "Engineering_Advocate": {"name": "Quality Quinn", "style": "long_term_focused", "argument": "sustainability_and_reliability"},
    "Executive_Sponsor": {"name": "Strategic Sam", "style": "big_picture", "role": "wants_balanced_view"}
}',
'{
    "data_driven_analysis": "Use metrics to support decision",
    "stakeholder_empathy": "Acknowledge all perspectives",
    "clear_rationale": "Explain decision reasoning",
    "risk_mitigation": "Address concerns of non-chosen option"
}', 6, ARRAY['product_decisions', 'prioritization', 'stakeholder_balance']),

-- Crisis Management Scenarios
('Security Incident Response', 'crisis_management', 'mastery',
'A {{security_incident_type}} has been detected affecting {{impact_scope}}. You need to {{immediate_action}} while communicating with {{stakeholder_group}}.', 
'{
    "security_incident_type": ["data breach", "system compromise", "API vulnerability", "third-party breach"],
    "impact_scope": ["customer data", "internal systems", "partner integrations", "public-facing services"],
    "immediate_action": ["contain the breach", "assess damage", "notify authorities", "implement fixes"],
    "stakeholder_group": ["executive team", "affected customers", "regulatory bodies", "public/media"]
}',
'{
    "CISO": {"name": "Security Sarah", "style": "technical_precise", "priority": "containment_and_analysis"},
    "Legal_Counsel": {"name": "Compliance Chris", "style": "risk_averse", "priority": "regulatory_requirements"},
    "CEO": {"name": "Leadership Lee", "style": "reputation_focused", "priority": "customer_trust_and_transparency"},
    "Customer": {"name": "Concerned Casey", "style": "trust_seeking", "emotion": "worried_about_data"}
}',
'{
    "crisis_leadership": "Take charge with calm authority",
    "transparent_communication": "Share what you know, when you know it",
    "stakeholder_prioritization": "Address most critical needs first",
    "recovery_focus": "Balance immediate response with long-term trust"
}', 20, ARRAY['crisis_management', 'security_response', 'executive_communication']),

-- Vision Setting Scenarios
('Product Strategy Alignment', 'vision_setting', 'mastery',
'You need to align the organization around your {{strategy_type}} strategy for {{time_horizon}}. Address concerns about {{strategic_risk}} while building consensus on {{key_investment}}.', 
'{
    "strategy_type": ["product differentiation", "market expansion", "platform consolidation", "customer experience"],
    "time_horizon": ["next 6 months", "fiscal year", "next 2-3 years", "5-year vision"],
    "strategic_risk": ["market timing", "execution complexity", "competitive response", "resource requirements"],
    "key_investment": ["new technology platform", "expanded team", "market entry", "customer acquisition"]
}',
'{
    "Product_Team": {"name": "Tactical Taylor", "style": "execution_focused", "concern": "implementation_complexity"},
    "Engineering_Leadership": {"name": "Architecture Alex", "style": "technical_realist", "concern": "technical_feasibility"},
    "Executive_Sponsor": {"name": "Vision Vivian", "style": "strategic_thinker", "concern": "market_positioning"},
    "Finance_Partner": {"name": "ROI Robin", "style": "metrics_driven", "concern": "investment_returns"}
}',
'{
    "compelling_vision": "Paint inspiring picture of future",
    "strategic_reasoning": "Connect vision to market realities",
    "execution_roadmap": "Show credible path forward",
    "stakeholder_alignment": "Build coalition of support"
}', 18, ARRAY['vision_setting', 'strategic_planning', 'organizational_alignment'])
ON CONFLICT (name, category, difficulty_level) DO UPDATE SET
    scenario_prompt = EXCLUDED.scenario_prompt,
    context_variables = EXCLUDED.context_variables,
    stakeholder_personas = EXCLUDED.stakeholder_personas,
    success_criteria = EXCLUDED.success_criteria,
    estimated_duration_minutes = EXCLUDED.estimated_duration_minutes,
    tags = EXCLUDED.tags,
    updated_at = NOW();