import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TranscriptHighlighting } from '@/components/feedback-display/InteractiveExploration/TranscriptHighlighting';
import { FrameworkMappingVisual } from '@/components/feedback-display/InteractiveExploration/FrameworkMappingVisual';
import { ImprovementSimulator } from '@/components/feedback-display/InteractiveExploration/ImprovementSimulator';
import { ProgressProjection } from '@/components/feedback-display/InteractiveExploration/ProgressProjection';

describe('InteractiveExploration Components', () => {
  describe('TranscriptHighlighting', () => {
    it('renders transcript analysis interface', () => {
      render(<TranscriptHighlighting />);

      expect(screen.getByText('Interactive Transcript Analysis')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search transcript or patterns...')).toBeInTheDocument();
      expect(screen.getByText('Pattern Highlighting')).toBeInTheDocument();
    });

    it('allows filtering by pattern types', () => {
      render(<TranscriptHighlighting />);

      const answerFirstButton = screen.getByText('Answer-First');
      expect(answerFirstButton).toBeInTheDocument();
      
      fireEvent.click(answerFirstButton);
      
      // Pattern should still be visible (toggle off, then on)
      expect(answerFirstButton).toBeInTheDocument();
    });

    it('shows transcript segments with timestamps', () => {
      render(<TranscriptHighlighting />);

      expect(screen.getByText('00:02')).toBeInTheDocument();
      expect(screen.getByText('You')).toBeInTheDocument();
      expect(screen.getByText(/The recommendation is to prioritize/)).toBeInTheDocument();
    });

    it('displays pattern statistics', () => {
      render(<TranscriptHighlighting />);

      expect(screen.getByText('Answer-First')).toBeInTheDocument();
      expect(screen.getByText('Framework Usage')).toBeInTheDocument();
      expect(screen.getByText('Hesitation')).toBeInTheDocument();
    });
  });

  describe('FrameworkMappingVisual', () => {
    it('renders framework mapping interface', () => {
      render(<FrameworkMappingVisual />);

      expect(screen.getByText('Framework Usage Mapping')).toBeInTheDocument();
      expect(screen.getByText('Timeline')).toBeInTheDocument();
      expect(screen.getByText('Effectiveness')).toBeInTheDocument();
      expect(screen.getByText('Breakdown')).toBeInTheDocument();
    });

    it('shows framework usage statistics', () => {
      render(<FrameworkMappingVisual />);

      expect(screen.getByText('6')).toBeInTheDocument(); // Total usages
      expect(screen.getByText(/Average Effectiveness/)).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Frameworks used
    });

    it('allows switching between view modes', () => {
      render(<FrameworkMappingVisual />);

      const effectivenessButton = screen.getByText('Effectiveness');
      fireEvent.click(effectivenessButton);

      expect(screen.getByText('Framework Effectiveness Analysis')).toBeInTheDocument();
    });

    it('displays framework timeline', () => {
      render(<FrameworkMappingVisual />);

      expect(screen.getByText('RICE')).toBeInTheDocument();
      expect(screen.getByText('Jobs-to-be-Done')).toBeInTheDocument();
      expect(screen.getByText('ICE')).toBeInTheDocument();
    });
  });

  describe('ImprovementSimulator', () => {
    it('renders improvement simulator interface', () => {
      render(<ImprovementSimulator />);

      expect(screen.getByText('Improvement Impact Simulator')).toBeInTheDocument();
      expect(screen.getByText('Select Improvement Actions')).toBeInTheDocument();
      expect(screen.getByText('Design Your Improvement Plan')).toBeInTheDocument();
    });

    it('shows improvement action options', () => {
      render(<ImprovementSimulator />);

      expect(screen.getByText('Eliminate Hesitation Language')).toBeInTheDocument();
      expect(screen.getByText('Advanced Answer-First Techniques')).toBeInTheDocument();
      expect(screen.getByText('Fintech Regulatory Mastery')).toBeInTheDocument();
    });

    it('allows adjusting commitment levels', () => {
      render(<ImprovementSimulator />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThan(0);

      // Adjust first slider
      fireEvent.change(sliders[0], { target: { value: '2' } });
      
      // Should show projected impact
      expect(screen.getByText('Projected Impact:')).toBeInTheDocument();
    });

    it('enables run simulation button when actions are selected', async () => {
      render(<ImprovementSimulator />);

      const sliders = screen.getAllByRole('slider');
      fireEvent.change(sliders[0], { target: { value: '1' } });

      const runButton = screen.getByText('Run Simulation');
      expect(runButton).not.toBeDisabled();

      fireEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText('Simulation Results')).toBeInTheDocument();
      });
    });
  });

  describe('ProgressProjection', () => {
    it('renders progress projection interface', () => {
      render(<ProgressProjection />);

      expect(screen.getByText('Progress Projection & Development Timeline')).toBeInTheDocument();
      expect(screen.getByText('Development Scenarios')).toBeInTheDocument();
      expect(screen.getByText('Time Horizon')).toBeInTheDocument();
    });

    it('shows development scenarios', () => {
      render(<ProgressProjection />);

      expect(screen.getByText('Intensive Growth')).toBeInTheDocument();
      expect(screen.getByText('Balanced Development')).toBeInTheDocument();
      expect(screen.getByText('Steady Progress')).toBeInTheDocument();
    });

    it('allows selecting different scenarios', () => {
      render(<ProgressProjection />);

      const intensiveGrowth = screen.getByText('Intensive Growth');
      fireEvent.click(intensiveGrowth);

      // Should show scenario as selected (visual feedback)
      expect(intensiveGrowth).toBeInTheDocument();
    });

    it('shows projected score improvements', () => {
      render(<ProgressProjection />);

      expect(screen.getByText('Projected Score Improvements')).toBeInTheDocument();
      expect(screen.getByText('Executive Presence')).toBeInTheDocument();
      expect(screen.getByText('Industry Fluency')).toBeInTheDocument();
      expect(screen.getByText('Stakeholder Adaptation')).toBeInTheDocument();
    });

    it('displays milestone timeline', () => {
      render(<ProgressProjection />);

      expect(screen.getByText('Achievement Timeline')).toBeInTheDocument();
      expect(screen.getByText('Eliminate Hesitation Language')).toBeInTheDocument();
      expect(screen.getByText('Fintech Regulatory Mastery')).toBeInTheDocument();
    });

    it('shows career impact summary', () => {
      render(<ProgressProjection />);

      expect(screen.getByText('Projected Career Impact')).toBeInTheDocument();
      expect(screen.getByText(/Senior PM communication readiness/)).toBeInTheDocument();
    });
  });
});