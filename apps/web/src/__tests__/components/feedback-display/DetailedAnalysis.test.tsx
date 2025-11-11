import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommunicationStructure } from '@/components/feedback-display/DetailedAnalysis/CommunicationStructure';
import { ExecutivePresenceBreakdown } from '@/components/feedback-display/DetailedAnalysis/ExecutivePresenceBreakdown';
import { IndustryFluencyAnalysis } from '@/components/feedback-display/DetailedAnalysis/IndustryFluencyAnalysis';
import { StakeholderAdaptationAssessment } from '@/components/feedback-display/DetailedAnalysis/StakeholderAdaptationAssessment';

describe('DetailedAnalysis Components', () => {
  describe('CommunicationStructure', () => {
    it('renders communication structure analysis', () => {
      render(
        <CommunicationStructure
          structureScore={8.4}
          answerFirstUsage={85}
          logicalFlow={78}
          timeManagement={92}
          clarityScore={82}
        />
      );

      expect(screen.getByText('Communication Structure Analysis')).toBeInTheDocument();
      expect(screen.getByText('8.4')).toBeInTheDocument();
      expect(screen.getByText('Answer-First Methodology')).toBeInTheDocument();
      expect(screen.getByText('Logical Flow')).toBeInTheDocument();
      expect(screen.getByText('Time Management')).toBeInTheDocument();
    });

    it('allows expanding communication elements', () => {
      render(
        <CommunicationStructure
          structureScore={8.4}
          answerFirstUsage={85}
          logicalFlow={78}
          timeManagement={92}
          clarityScore={82}
        />
      );

      const expandButton = screen.getAllByRole('button')[0];
      fireEvent.click(expandButton);

      expect(screen.getByText('Consistent use of conclusion-first structure')).toBeInTheDocument();
    });
  });

  describe('ExecutivePresenceBreakdown', () => {
    it('renders executive presence analysis', () => {
      render(
        <ExecutivePresenceBreakdown
          overallPresence={7.1}
          authorityMarkers={68}
          clarityScore={82}
          convictionLevel={65}
          composureRating={78}
          languageConfidence={72}
        />
      );

      expect(screen.getByText('Executive Presence Analysis')).toBeInTheDocument();
      expect(screen.getByText('7.1')).toBeInTheDocument();
      expect(screen.getByText('Authority Markers')).toBeInTheDocument();
      expect(screen.getByText('Executive Composure')).toBeInTheDocument();
    });

    it('shows definitive language metrics', () => {
      render(
        <ExecutivePresenceBreakdown
          overallPresence={7.1}
          authorityMarkers={68}
          clarityScore={82}
          convictionLevel={65}
          composureRating={78}
          languageConfidence={72}
          definitiveLanguageUsage={65}
          hesitationCount={8}
        />
      );

      expect(screen.getByText('65%')).toBeInTheDocument();
      expect(screen.getByText('Definitive Language')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Hesitation Phrases')).toBeInTheDocument();
    });
  });

  describe('IndustryFluencyAnalysis', () => {
    it('renders industry fluency for fintech', () => {
      render(
        <IndustryFluencyAnalysis
          industry="fintech"
          overallFluency={6.9}
          vocabularyUsage={72}
          regulatoryAwareness={65}
          marketContext={78}
          competitorKnowledge={68}
        />
      );

      expect(screen.getByText('Financial Technology Fluency')).toBeInTheDocument();
      expect(screen.getByText('6.9')).toBeInTheDocument();
      expect(screen.getByText('Industry Vocabulary')).toBeInTheDocument();
      expect(screen.getByText('Regulatory Awareness')).toBeInTheDocument();
    });

    it('shows industry-specific vocabulary terms', () => {
      render(
        <IndustryFluencyAnalysis
          industry="fintech"
          overallFluency={6.9}
          vocabularyUsage={72}
          regulatoryAwareness={65}
          marketContext={78}
          competitorKnowledge={68}
        />
      );

      // Expand vocabulary section
      const vocabularySection = screen.getAllByRole('button').find(
        button => button.getAttribute('aria-expanded') !== null
      );
      if (vocabularySection) {
        fireEvent.click(vocabularySection);
      }

      // Check for fintech-specific terms
      expect(screen.getByText('KYC')).toBeInTheDocument();
      expect(screen.getByText('PCI DSS')).toBeInTheDocument();
    });

    it('renders different industry contexts', () => {
      render(
        <IndustryFluencyAnalysis
          industry="healthcare"
          overallFluency={7.5}
          vocabularyUsage={80}
          regulatoryAwareness={85}
          marketContext={75}
          competitorKnowledge={70}
        />
      );

      expect(screen.getByText('Healthcare & Life Sciences Fluency')).toBeInTheDocument();
      expect(screen.getByText('HIPAA & Patient Privacy')).toBeInTheDocument();
      expect(screen.getByText('FDA Regulatory Pathways')).toBeInTheDocument();
    });
  });

  describe('StakeholderAdaptationAssessment', () => {
    it('renders stakeholder adaptation analysis', () => {
      render(
        <StakeholderAdaptationAssessment
          overallAdaptation={7.5}
          executiveAdaptation={72}
          engineeringAdaptation={78}
          businessAdaptation={81}
          customerAdaptation={69}
          audienceRecognition={75}
          messageCustomization={73}
        />
      );

      expect(screen.getByText('Stakeholder Adaptation Assessment')).toBeInTheDocument();
      expect(screen.getByText('7.5')).toBeInTheDocument();
      expect(screen.getByText('Executive Leadership')).toBeInTheDocument();
      expect(screen.getByText('Engineering Teams')).toBeInTheDocument();
      expect(screen.getByText('Business Partners')).toBeInTheDocument();
    });

    it('shows audience recognition metrics', () => {
      render(
        <StakeholderAdaptationAssessment
          overallAdaptation={7.5}
          executiveAdaptation={72}
          engineeringAdaptation={78}
          businessAdaptation={81}
          customerAdaptation={69}
          audienceRecognition={75}
          messageCustomization={73}
        />
      );

      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Audience Recognition')).toBeInTheDocument();
      expect(screen.getByText('73%')).toBeInTheDocument();
      expect(screen.getByText('Message Customization')).toBeInTheDocument();
    });

    it('allows expanding stakeholder types for details', () => {
      render(
        <StakeholderAdaptationAssessment
          overallAdaptation={7.5}
          executiveAdaptation={72}
          engineeringAdaptation={78}
          businessAdaptation={81}
          customerAdaptation={69}
          audienceRecognition={75}
          messageCustomization={73}
        />
      );

      const expandButton = screen.getAllByRole('button')[0];
      fireEvent.click(expandButton);

      expect(screen.getByText('Key Focus Areas:')).toBeInTheDocument();
      expect(screen.getByText('Business impact')).toBeInTheDocument();
      expect(screen.getByText('Strategic context')).toBeInTheDocument();
    });
  });
});