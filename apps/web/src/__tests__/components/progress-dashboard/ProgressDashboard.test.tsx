import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardOrchestrator } from '@/components/progress-dashboard/DashboardOrchestrator';
import { CareerProgressionCard } from '@/components/progress-dashboard/OverviewCards/CareerProgressionCard';
import { OverallSkillScore } from '@/components/progress-dashboard/OverviewCards/OverallSkillScore';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/dashboard/progress',
}));

describe('Progress Dashboard Components', () => {
  describe('DashboardOrchestrator', () => {
    it('renders the main dashboard with tabs', () => {
      render(<DashboardOrchestrator />);
      
      // Check for main tabs
      expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /skills/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /career/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /analytics/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /motivation/i })).toBeInTheDocument();
    });

    it('displays overview content by default', () => {
      render(<DashboardOrchestrator />);
      
      // Should show overview cards by default
      expect(screen.getByText('Career Progression')).toBeInTheDocument();
      expect(screen.getByText('Overall Skill Score')).toBeInTheDocument();
    });
  });

  describe('CareerProgressionCard', () => {
    it('displays career transition information', () => {
      render(<CareerProgressionCard />);
      
      expect(screen.getByText('Career Progression')).toBeInTheDocument();
      expect(screen.getByText(/PM → SENIOR_PM Transition/i)).toBeInTheDocument();
      expect(screen.getByText('78% Ready')).toBeInTheDocument();
      expect(screen.getByText('4-6 months')).toBeInTheDocument();
    });

    it('shows next milestones', () => {
      render(<CareerProgressionCard />);
      
      expect(screen.getByText('Next Milestones')).toBeInTheDocument();
      expect(screen.getByText('Executive Presence Mastery')).toBeInTheDocument();
    });
  });

  describe('OverallSkillScore', () => {
    it('displays overall skill score and grade', () => {
      render(<OverallSkillScore />);
      
      expect(screen.getByText('Overall Skill Score')).toBeInTheDocument();
      expect(screen.getByText('7.4')).toBeInTheDocument();
      expect(screen.getByText('B+')).toBeInTheDocument();
    });

    it('shows practice statistics', () => {
      render(<OverallSkillScore />);
      
      expect(screen.getByText('23.5h')).toBeInTheDocument();
      expect(screen.getByText('47')).toBeInTheDocument();
    });

    it('displays strongest areas and development priorities', () => {
      render(<OverallSkillScore />);
      
      expect(screen.getByText('Strongest Areas')).toBeInTheDocument();
      expect(screen.getByText('Framework Application')).toBeInTheDocument();
      expect(screen.getByText('Development Priorities')).toBeInTheDocument();
      expect(screen.getByText('Executive Presence')).toBeInTheDocument();
    });
  });
});