import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StrengthHighlights } from '@/components/feedback-display/InsightGeneration/StrengthHighlights';
import { ImprovementPriorities } from '@/components/feedback-display/InsightGeneration/ImprovementPriorities';
import { CareerProgressionInsights } from '@/components/feedback-display/InsightGeneration/CareerProgressionInsights';
import { mockAnalysisResults, mockUserProfile } from '@/lib/mockFeedbackData';

describe('StrengthHighlights', () => {
  const mockOnExpand = jest.fn();
  const defaultProps = {
    strengths: mockAnalysisResults.strengthAreas,
    onExpand: mockOnExpand,
    expandedItems: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders strength areas correctly', () => {
    render(<StrengthHighlights {...defaultProps} />);
    
    expect(screen.getByText('Strength Areas')).toBeInTheDocument();
    expect(screen.getByText('2 strengths')).toBeInTheDocument();
  });

  it('displays top strength prominently', () => {
    render(<StrengthHighlights {...defaultProps} />);
    
    expect(screen.getByText('Top Strength')).toBeInTheDocument();
    expect(screen.getByText('Framework Application')).toBeInTheDocument();
    expect(screen.getByText('8.7')).toBeInTheDocument();
  });

  it('shows career leverage information', () => {
    render(<StrengthHighlights {...defaultProps} />);
    
    expect(screen.getByText('This strength accelerates Senior PM readiness')).toBeInTheDocument();
  });

  it('displays evidence points', () => {
    render(<StrengthHighlights {...defaultProps} />);
    
    expect(screen.getByText('Excellent RICE framework usage with specific metrics')).toBeInTheDocument();
    expect(screen.getByText('Clear reach, impact, confidence, effort articulation')).toBeInTheDocument();
  });

  it('handles expansion of top strength', () => {
    render(<StrengthHighlights {...defaultProps} />);
    
    const expandButton = screen.getByText('View Reinforcement Suggestions');
    fireEvent.click(expandButton);
    
    expect(mockOnExpand).toHaveBeenCalledWith('Framework Application');
  });

  it('shows reinforcement suggestions when expanded', () => {
    const expandedProps = {
      ...defaultProps,
      expandedItems: ['strength-Framework Application']
    };
    
    render(<StrengthHighlights {...expandedProps} />);
    
    expect(screen.getByText('Ways to leverage this strength:')).toBeInTheDocument();
    expect(screen.getByText('Apply this framework mastery to more complex scenarios')).toBeInTheDocument();
  });

  it('renders additional strengths section', () => {
    render(<StrengthHighlights {...defaultProps} />);
    
    expect(screen.getByText('Additional Strengths')).toBeInTheDocument();
    expect(screen.getByText('Communication Structure')).toBeInTheDocument();
  });

  it('handles empty strengths array', () => {
    const emptyProps = {
      ...defaultProps,
      strengths: []
    };
    
    render(<StrengthHighlights {...emptyProps} />);
    
    expect(screen.getByText('Complete your analysis to see strength areas')).toBeInTheDocument();
  });

  it('shows strength summary', () => {
    render(<StrengthHighlights {...defaultProps} />);
    
    expect(screen.getByText('Strength Summary')).toBeInTheDocument();
    expect(screen.getByText(/You have 2 identified strengths/)).toBeInTheDocument();
  });

  describe('Strength Level Display', () => {
    it('shows correct badges for different strength levels', () => {
      render(<StrengthHighlights {...defaultProps} />);
      
      // Framework Application (8.7) should be "Excellent"
      expect(screen.getByText('Excellent')).toBeInTheDocument();
      // Communication Structure (8.4) should be "Strong"
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });
  });
});

describe('ImprovementPriorities', () => {
  const mockOnSelectImprovement = jest.fn();
  const defaultProps = {
    improvements: mockAnalysisResults.improvementAreas,
    onSelectImprovement: mockOnSelectImprovement,
    selectedImprovements: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders improvement areas correctly', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    expect(screen.getByText('Development Opportunities')).toBeInTheDocument();
    expect(screen.getByText('2 areas')).toBeInTheDocument();
  });

  it('displays high priority items first', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    const improvementCards = screen.getAllByText(/Priority/);
    expect(improvementCards[0]).toHaveTextContent('High Priority');
  });

  it('shows current and target scores', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    expect(screen.getByText('7.1 → 8.5')).toBeInTheDocument(); // Executive Presence
    expect(screen.getByText('6.9 → 8.2')).toBeInTheDocument(); // Industry Fluency
  });

  it('displays progress bars', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('shows specific evidence', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    expect(screen.getByText('Strong content but used hesitation phrases: "I think", "maybe"')).toBeInTheDocument();
  });

  it('displays improvement actions', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    expect(screen.getByText('Practice definitive language patterns')).toBeInTheDocument();
    expect(screen.getByText('1-2 weeks with daily practice')).toBeInTheDocument();
  });

  it('handles improvement selection', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    const startButton = screen.getAllByText('Start Improving')[0];
    fireEvent.click(startButton);
    
    expect(mockOnSelectImprovement).toHaveBeenCalledWith('Executive Presence');
  });

  it('shows selected state for improvements', () => {
    const selectedProps = {
      ...defaultProps,
      selectedImprovements: ['Executive Presence']
    };
    
    render(<ImprovementPriorities {...selectedProps} />);
    
    expect(screen.getByText('Added to Plan')).toBeInTheDocument();
  });

  it('displays development summary', () => {
    render(<ImprovementPriorities {...defaultProps} />);
    
    expect(screen.getByText('Development Summary')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // High Priority count
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority')).toBeInTheDocument();
  });

  it('handles empty improvements array', () => {
    const emptyProps = {
      ...defaultProps,
      improvements: []
    };
    
    render(<ImprovementPriorities {...emptyProps} />);
    
    expect(screen.getByText('No improvement areas identified')).toBeInTheDocument();
    expect(screen.getByText('Great work! Keep practicing to maintain your skills.')).toBeInTheDocument();
  });

  describe('Priority Level Styling', () => {
    it('applies correct styling for high priority items', () => {
      render(<ImprovementPriorities {...defaultProps} />);
      
      const highPriorityBadge = screen.getByText('High Priority');
      expect(highPriorityBadge).toHaveClass('text-red-600', 'bg-red-100');
    });
  });

  describe('Method Icons', () => {
    it('displays correct icons for different improvement methods', () => {
      render(<ImprovementPriorities {...defaultProps} />);
      
      // Should show coaching and practice module icons
      expect(screen.getByText('👥')).toBeInTheDocument(); // COACHING_SESSION
      expect(screen.getByText('🎯')).toBeInTheDocument(); // PRACTICE_MODULE
    });
  });
});

describe('CareerProgressionInsights', () => {
  const defaultProps = {
    progressionData: mockAnalysisResults.careerProgressionInsights,
    userProfile: mockUserProfile
  };

  it('renders career progression title', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('Career Progression Insights')).toBeInTheDocument();
  });

  it('displays transition progress', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('Transition Progress')).toBeInTheDocument();
    expect(screen.getByText('Product Manager → Senior Product Manager')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
  });

  it('shows readiness level badge', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('Nearly Ready')).toBeInTheDocument();
  });

  it('displays estimated timeline', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('Est. time: 4-6 months')).toBeInTheDocument();
  });

  it('shows critical skill gaps', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('Critical Skill Gaps')).toBeInTheDocument();
    expect(screen.getByText('Executive Presence')).toBeInTheDocument();
    expect(screen.getByText('Industry Fluency')).toBeInTheDocument();
  });

  it('displays career path requirements', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('Key Skills for Advancement')).toBeInTheDocument();
    expect(screen.getByText('Executive Communication')).toBeInTheDocument();
    expect(screen.getByText('Trade-off Decisions')).toBeInTheDocument();
    expect(screen.getByText('Authority Language')).toBeInTheDocument();
  });

  it('shows completed vs incomplete skills', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    // Skills not in critical gaps should show as completed
    const checkmarks = screen.getAllByTestId('CheckCircle2');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('provides recommended next steps', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('Recommended Next Steps')).toBeInTheDocument();
    expect(screen.getByText(/Schedule advancement conversations/)).toBeInTheDocument();
  });

  it('displays progress metrics', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('Ready for SENIOR_PM')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Gaps closing this month')).toBeInTheDocument();
  });

  it('shows industry context', () => {
    render(<CareerProgressionInsights {...defaultProps} />);
    
    expect(screen.getByText(/Industry Context:/)).toBeInTheDocument();
    expect(screen.getByText(/Fintech PMs typically need/)).toBeInTheDocument();
  });

  describe('Readiness Levels', () => {
    it('shows correct styling for nearly ready status', () => {
      render(<CareerProgressionInsights {...defaultProps} />);
      
      const readinessBadge = screen.getByText('Nearly Ready');
      expect(readinessBadge).toHaveClass('text-blue-600', 'bg-blue-100');
    });

    it('shows developing status for lower readiness', () => {
      const developingProgressionData = {
        ...mockAnalysisResults.careerProgressionInsights,
        readinessPercentage: 60
      };
      
      render(<CareerProgressionInsights {...defaultProps} progressionData={developingProgressionData} />);
      
      expect(screen.getByText('Developing')).toBeInTheDocument();
    });
  });

  describe('Next Steps Adaptation', () => {
    it('shows different next steps for high readiness', () => {
      const highReadinessData = {
        ...mockAnalysisResults.careerProgressionInsights,
        readinessPercentage: 85
      };
      
      render(<CareerProgressionInsights {...defaultProps} progressionData={highReadinessData} />);
      
      expect(screen.getByText(/Schedule advancement conversations with your manager/)).toBeInTheDocument();
    });

    it('shows skill development focus for lower readiness', () => {
      const lowReadinessData = {
        ...mockAnalysisResults.careerProgressionInsights,
        readinessPercentage: 50
      };
      
      render(<CareerProgressionInsights {...defaultProps} progressionData={lowReadinessData} />);
      
      expect(screen.getByText(/Prioritize high-impact skill development/)).toBeInTheDocument();
    });
  });
});