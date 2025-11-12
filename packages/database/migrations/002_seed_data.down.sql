-- ShipSpeak Seed Data Rollback Migration
-- Migration: 002_seed_data.down.sql
-- Description: Remove base scenario templates and system configuration
-- Version: 1.0
-- Created: 2025-11-11

-- ============================================================================
-- REMOVE SEED DATA
-- ============================================================================

-- Remove base scenario templates
DELETE FROM scenario_templates WHERE name IN (
    'Executive Summary Presentation',
    'Difficult Stakeholder Conversation',
    'Resource Negotiation',
    'Cross-Functional Alignment',
    'Vision Alignment Meeting',
    'Performance Discussion',
    'Quarterly Business Review',
    'Team Motivation During Crisis',
    'Customer Escalation Response',
    'Feature vs Technical Debt Prioritization',
    'Security Incident Response',
    'Product Strategy Alignment'
);

-- Remove system configuration
DELETE FROM system_config WHERE config_key IN (
    'smart_sampling_presets',
    'ai_models',
    'feature_flags'
);