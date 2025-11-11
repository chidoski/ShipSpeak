import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FeedbackOrchestrator } from '@/components/feedback-display/FeedbackOrchestrator';
import { mockAnalysisResults } from '@/lib/mockFeedbackData';

// Mock the child components
jest.mock('@/components/feedback-display/ScoreVisualization/OverallScoreCard', () => ({
  OverallScoreCard: ({ analysisResults, userProfile }: any) => (
    <div data-testid="overall-score-card">
      Overall Score: {analysisResults.overallScore}
    </div>
  )
}));

jest.mock('@/components/feedback-display/ScoreVisualization/DimensionalRadar', () => ({
  DimensionalRadar: ({ scores }: any) => (
    <div data-testid="dimensional-radar">
      Communication: {scores.communicationStructure}
    </div>
  )
}));

jest.mock('@/components/feedback-display/InsightGeneration/StrengthHighlights', () => ({
  StrengthHighlights: ({ strengths }: any) => (
    <div data-testid="strength-highlights">
      {strengths.length} strengths
    </div>
  )
}));

jest.mock('@/components/feedback-display/InsightGeneration/ImprovementPriorities', () => ({
  ImprovementPriorities: ({ improvements, onSelectImprovement }: any) => (
    <div data-testid="improvement-priorities">
      <button onClick={() => onSelectImprovement('test-improvement')}>
        Select Improvement
      </button>
      {improvements.length} improvements
    </div>
  )
}));

jest.mock('@/components/feedback-display/InsightGeneration/CareerProgressionInsights', () => ({
  CareerProgressionInsights: ({ progressionData }: any) => (
    <div data-testid="career-progression-insights">
      {progressionData.readinessPercentage}% ready
    </div>
  )
}));

describe('FeedbackOrchestrator', () => {
  const defaultProps = {
    sessionId: 'test-session',
    analysisResults: mockAnalysisResults
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders successfully with analysis results', () => {
    render(<FeedbackOrchestrator {...defaultProps} />);
    
    expect(screen.getByText('Practice Session Analysis')).toBeInTheDocument();
    expect(screen.getByText('Fintech PM')).toBeInTheDocument();
  });

  it('displays overall score and grade correctly', () => {
    render(<FeedbackOrchestrator {...defaultProps} />);
    
    expect(screen.getByText('B+')).toBeInTheDocument();
    expect(screen.getByText('7.8')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
  });

  it('shows score improvement when available', () => {
    const analysisWithImprovement = {
      ...mockAnalysisResults,
      scoreImprovement: 0.6
    };
    
    render(<FeedbackOrchestrator {...defaultProps} analysisResults={analysisWithImprovement} />);
    
    expect(screen.getByText('+0.6')).toBeInTheDocument();
  });

  it('renders career progression timeline', () => {
    render(<FeedbackOrchestrator {...defaultProps} />);
    
    expect(screen.getByText('4-6 months to SENIOR_PM readiness')).toBeInTheDocument();
  });

  describe('Tab Navigation', () => {
    it('starts with overview tab active', () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    });

    it('switches to analysis tab when clicked', async () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const analysisTab = screen.getByRole('tab', { name: /analysis/i });
      fireEvent.click(analysisTab);
      
      await waitFor(() => {
        expect(analysisTab).toHaveAttribute('aria-selected', 'true');
      });
      
      expect(screen.getByText('Communication Structure Analysis')).toBeInTheDocument();
    });

    it('switches to insights tab and shows career progression', async () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const insightsTab = screen.getByRole('tab', { name: /insights/i });
      fireEvent.click(insightsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('career-progression-insights')).toBeInTheDocument();
      });
    });

    it('switches to actions tab and shows recommendations', async () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const actionsTab = screen.getByRole('tab', { name: /actions/i });
      fireEvent.click(actionsTab);
      
      await waitFor(() => {
        expect(screen.getByText('Recommended Actions')).toBeInTheDocument();
      });
    });
  });

  describe('Overview Tab Content', () => {
    it('renders OverallScoreCard component', () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      expect(screen.getByTestId('overall-score-card')).toBeInTheDocument();
      expect(screen.getByText(`Overall Score: ${mockAnalysisResults.overallScore}`)).toBeInTheDocument();
    });

    it('renders DimensionalRadar component', () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      expect(screen.getByTestId('dimensional-radar')).toBeInTheDocument();
      expect(screen.getByText(`Communication: ${mockAnalysisResults.dimensionalScores.communicationStructure}`)).toBeInTheDocument();
    });

    it('renders StrengthHighlights component', () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      expect(screen.getByTestId('strength-highlights')).toBeInTheDocument();
      expect(screen.getByText(`${mockAnalysisResults.strengthAreas.length} strengths`)).toBeInTheDocument();
    });
  });

  describe('Analysis Tab Content', () => {
    it('shows detailed communication structure analysis', async () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const analysisTab = screen.getByRole('tab', { name: /analysis/i });
      fireEvent.click(analysisTab);
      
      await waitFor(() => {
        expect(screen.getByText('Communication Structure Analysis')).toBeInTheDocument();
        expect(screen.getByText('Answer-First Methodology')).toBeInTheDocument();
        expect(screen.getByText('8.4/10')).toBeInTheDocument();
      });
    });

    it('displays executive readiness feedback', async () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const analysisTab = screen.getByRole('tab', { name: /analysis/i });
      fireEvent.click(analysisTab);
      
      await waitFor(() => {
        expect(screen.getByText(/Strong executive readiness/)).toBeInTheDocument();
      });
    });
  });

  describe('Actions Tab Content', () => {
    it('renders improvement actions for each area', async () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const actionsTab = screen.getByRole('tab', { name: /actions/i });
      fireEvent.click(actionsTab);
      
      await waitFor(() => {
        expect(screen.getByText('Executive Presence')).toBeInTheDocument();
        expect(screen.getByText('Industry Fluency - Fintech')).toBeInTheDocument();
      });
    });

    it('handles improvement action selection', async () => {
      const mockOnActionSelected = jest.fn();
      render(<FeedbackOrchestrator {...defaultProps} onActionSelected={mockOnActionSelected} />);
      
      const actionsTab = screen.getByRole('tab', { name: /actions/i });
      fireEvent.click(actionsTab);
      
      await waitFor(() => {
        const startButton = screen.getAllByText('Start Practice')[0];
        fireEvent.click(startButton);
        
        expect(mockOnActionSelected).toHaveBeenCalledWith('Executive Presence-0');
      });
    });
  });

  describe('Grade Calculation', () => {
    it('shows A grade for excellent scores', () => {
      const excellentResults = {
        ...mockAnalysisResults,
        overallScore: 9.0
      };
      
      render(<FeedbackOrchestrator {...defaultProps} analysisResults={excellentResults} />);
      
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('shows C+ grade for developing scores', () => {
      const developingResults = {
        ...mockAnalysisResults,
        overallScore: 6.0
      };
      
      render(<FeedbackOrchestrator {...defaultProps} analysisResults={developingResults} />);
      
      expect(screen.getByText('C+')).toBeInTheDocument();
    });
  });

  describe('Improvement Selection', () => {
    it('handles improvement selection callback', () => {
      const mockOnActionSelected = jest.fn();
      render(<FeedbackOrchestrator {...defaultProps} onActionSelected={mockOnActionSelected} />);
      
      const insightsTab = screen.getByRole('tab', { name: /insights/i });
      fireEvent.click(insightsTab);
      
      const selectButton = screen.getByText('Select Improvement');
      fireEvent.click(selectButton);
      
      expect(mockOnActionSelected).toHaveBeenCalledWith('test-improvement');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for tabs', () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /analysis/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /insights/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /actions/i })).toBeInTheDocument();
    });

    it('maintains keyboard navigation for tabs', () => {
      render(<FeedbackOrchestrator {...defaultProps} />);
      
      const analysisTab = screen.getByRole('tab', { name: /analysis/i });
      
      // Focus and press Enter
      analysisTab.focus();
      fireEvent.keyDown(analysisTab, { key: 'Enter' });
      
      expect(analysisTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Error Handling', () => {
    it('handles missing score improvement gracefully', () => {
      const resultsWithoutImprovement = {
        ...mockAnalysisResults,
        scoreImprovement: undefined
      };
      
      render(<FeedbackOrchestrator {...defaultProps} analysisResults={resultsWithoutImprovement} />);
      
      // Should still render without the improvement indicator
      expect(screen.getByText('Practice Session Analysis')).toBeInTheDocument();
      expect(screen.queryByText('+0.6')).not.toBeInTheDocument();
    });

    it('handles empty improvement areas', () => {
      const resultsWithoutImprovements = {
        ...mockAnalysisResults,
        improvementAreas: []
      };
      
      render(<FeedbackOrchestrator {...defaultProps} analysisResults={resultsWithoutImprovements} />);
      
      // Should still render other content
      expect(screen.getByText('Practice Session Analysis')).toBeInTheDocument();
    });
  });
});