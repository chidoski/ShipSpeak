import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OverallScoreCard } from '@/components/feedback-display/ScoreVisualization/OverallScoreCard';
import { DimensionalRadar } from '@/components/feedback-display/ScoreVisualization/DimensionalRadar';
import { mockAnalysisResults, mockUserProfile } from '@/lib/mockFeedbackData';

describe('OverallScoreCard', () => {
  const defaultProps = {
    analysisResults: mockAnalysisResults,
    userProfile: mockUserProfile
  };

  it('renders overall score correctly', () => {
    render(<OverallScoreCard {...defaultProps} />);
    
    expect(screen.getByText('7.8/10')).toBeInTheDocument();
  });

  it('displays score improvement when available', () => {
    const resultsWithImprovement = {
      ...mockAnalysisResults,
      scoreImprovement: 0.6
    };
    
    render(<OverallScoreCard {...defaultProps} analysisResults={resultsWithImprovement} />);
    
    expect(screen.getByText('+0.6 improvement')).toBeInTheDocument();
  });

  it('shows confidence level badge', () => {
    render(<OverallScoreCard {...defaultProps} />);
    
    expect(screen.getByText('HIGH Confidence')).toBeInTheDocument();
  });

  it('displays benchmark comparisons', () => {
    render(<OverallScoreCard {...defaultProps} />);
    
    expect(screen.getByText(/Industry/)).toBeInTheDocument();
    expect(screen.getByText(/Role/)).toBeInTheDocument();
    expect(screen.getByText(`You: ${mockAnalysisResults.overallScore.toFixed(1)}`)).toBeInTheDocument();
    expect(screen.getByText(`Avg: ${mockAnalysisResults.industryBenchmark.toFixed(1)}`)).toBeInTheDocument();
  });

  it('shows career progression context', () => {
    render(<OverallScoreCard {...defaultProps} />);
    
    expect(screen.getByText(`${mockUserProfile.currentRole} → ${mockUserProfile.targetRole} Progress`)).toBeInTheDocument();
    expect(screen.getByText(`${mockAnalysisResults.careerProgressionInsights.readinessPercentage}% ready for advancement`)).toBeInTheDocument();
  });

  it('displays framework usage score', () => {
    render(<OverallScoreCard {...defaultProps} />);
    
    expect(screen.getByText(`Framework usage is excellent (${mockAnalysisResults.frameworkUsage.usageQuality}/10)`)).toBeInTheDocument();
  });

  it('shows key insights', () => {
    render(<OverallScoreCard {...defaultProps} />);
    
    expect(screen.getByText(/Communication structure shows executive readiness/)).toBeInTheDocument();
    expect(screen.getByText(`${mockAnalysisResults.careerProgressionInsights.keyGapsClosing} skill gaps closing this month`)).toBeInTheDocument();
  });

  describe('Confidence Level Styling', () => {
    it('applies correct styling for HIGH confidence', () => {
      render(<OverallScoreCard {...defaultProps} />);
      
      const confidenceBadge = screen.getByText('HIGH Confidence');
      expect(confidenceBadge).toHaveClass('text-green-600', 'bg-green-50');
    });

    it('applies correct styling for MEDIUM confidence', () => {
      const mediumConfidenceResults = {
        ...mockAnalysisResults,
        confidenceLevel: 'MEDIUM' as const
      };
      
      render(<OverallScoreCard {...defaultProps} analysisResults={mediumConfidenceResults} />);
      
      const confidenceBadge = screen.getByText('MEDIUM Confidence');
      expect(confidenceBadge).toHaveClass('text-yellow-600', 'bg-yellow-50');
    });

    it('applies correct styling for LOW confidence', () => {
      const lowConfidenceResults = {
        ...mockAnalysisResults,
        confidenceLevel: 'LOW' as const
      };
      
      render(<OverallScoreCard {...defaultProps} analysisResults={lowConfidenceResults} />);
      
      const confidenceBadge = screen.getByText('LOW Confidence');
      expect(confidenceBadge).toHaveClass('text-red-600', 'bg-red-50');
    });
  });
});

describe('DimensionalRadar', () => {
  const defaultProps = {
    scores: mockAnalysisResults.dimensionalScores,
    benchmarkData: {
      industry: 'fintech',
      role: 'PM'
    }
  };

  it('renders all skill dimensions', () => {
    render(<DimensionalRadar {...defaultProps} />);
    
    expect(screen.getByText('Communication Structure')).toBeInTheDocument();
    expect(screen.getByText('Executive Presence')).toBeInTheDocument();
    expect(screen.getByText('Framework Application')).toBeInTheDocument();
    expect(screen.getByText('Industry Fluency')).toBeInTheDocument();
    expect(screen.getByText('Stakeholder Adaptation')).toBeInTheDocument();
    expect(screen.getByText('Confidence Level')).toBeInTheDocument();
  });

  it('displays score values correctly', () => {
    render(<DimensionalRadar {...defaultProps} />);
    
    expect(screen.getByText('8.4')).toBeInTheDocument(); // Communication Structure
    expect(screen.getByText('7.1')).toBeInTheDocument(); // Executive Presence
    expect(screen.getByText('8.7')).toBeInTheDocument(); // Framework Application
  });

  it('shows appropriate score labels', () => {
    render(<DimensionalRadar {...defaultProps} />);
    
    expect(screen.getByText('Excellent')).toBeInTheDocument(); // For 8.7 Framework Application
    expect(screen.getByText('Strong')).toBeInTheDocument(); // For 8.4 Communication Structure
  });

  it('renders radar chart SVG', () => {
    render(<DimensionalRadar {...defaultProps} />);
    
    const svgElement = screen.getByRole('img', { hidden: true });
    expect(svgElement).toBeInTheDocument();
  });

  describe('Dimension Selection', () => {
    it('shows dimension details when clicked', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      const communicationDimension = screen.getByText('Communication Structure');
      fireEvent.click(communicationDimension);
      
      expect(screen.getByText('Communication Structure Details')).toBeInTheDocument();
      expect(screen.getByText('Answer-first methodology and clarity')).toBeInTheDocument();
    });

    it('highlights selected dimension', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      const communicationDimension = screen.getByText('Communication Structure');
      fireEvent.click(communicationDimension);
      
      // Check for ring styling indicating selection
      const dimensionContainer = communicationDimension.closest('.p-2');
      expect(dimensionContainer).toHaveClass('ring-2', 'ring-blue-500');
    });
  });

  describe('View Mode Toggle', () => {
    it('starts in current view mode', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      // Should show radar chart by default
      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toBeInTheDocument();
    });

    it('switches to comparison mode when benchmark button clicked', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      const benchmarkButton = screen.getByRole('button', { name: /target/i });
      fireEvent.click(benchmarkButton);
      
      expect(screen.getByText('Comparison vs fintech PMs')).toBeInTheDocument();
    });

    it('shows industry benchmark comparison', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      const benchmarkButton = screen.getByRole('button', { name: /target/i });
      fireEvent.click(benchmarkButton);
      
      // Should show progress bars for comparison
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Score Color Coding', () => {
    it('applies correct colors for excellent scores', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      const excellentBadge = screen.getByText('Excellent');
      expect(excellentBadge).toHaveClass('text-green-600', 'bg-green-100');
    });

    it('applies correct colors for strong scores', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      const strongBadge = screen.getByText('Strong');
      expect(strongBadge).toHaveClass('text-blue-600', 'bg-blue-100');
    });
  });

  describe('Accessibility', () => {
    it('provides dimension descriptions', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      expect(screen.getByText('Answer-first methodology and clarity')).toBeInTheDocument();
      expect(screen.getByText('Confidence and authority in delivery')).toBeInTheDocument();
      expect(screen.getByText('RICE, ICE, and strategic frameworks')).toBeInTheDocument();
    });

    it('supports keyboard navigation for dimension selection', () => {
      render(<DimensionalRadar {...defaultProps} />);
      
      const firstDimension = screen.getByText('Communication Structure').closest('.p-2') as HTMLElement;
      
      fireEvent.keyDown(firstDimension, { key: 'Enter' });
      expect(screen.getByText('Communication Structure Details')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing benchmark data gracefully', () => {
      const propsWithoutBenchmark = {
        scores: mockAnalysisResults.dimensionalScores
      };
      
      render(<DimensionalRadar {...propsWithoutBenchmark} />);
      
      // Should still render the component without comparison mode
      expect(screen.getByText('Skill Dimensions')).toBeInTheDocument();
    });

    it('renders with showBenchmark false', () => {
      const propsWithoutBenchmarkButton = {
        ...defaultProps,
        showBenchmark: false
      };
      
      render(<DimensionalRadar {...propsWithoutBenchmarkButton} />);
      
      // Benchmark button should not be present
      expect(screen.queryByRole('button', { name: /target/i })).not.toBeInTheDocument();
    });
  });
});