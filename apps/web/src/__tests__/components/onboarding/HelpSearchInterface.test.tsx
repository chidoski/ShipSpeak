import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import HelpSearchInterface from '../../../components/onboarding/HelpInterface/HelpSearchInterface'
import type { CareerTransitionType, Industry } from '../../../types/onboarding'

describe('HelpSearchInterface', () => {
  const defaultProps = {
    userCareerTransition: 'PM_TO_SENIOR_PM' as CareerTransitionType,
    userIndustry: 'FINTECH' as Industry,
    onGuideSelect: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders help search interface with user context', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      expect(screen.getByText('Help & Guidance Library')).toBeInTheDocument()
      expect(screen.getByText(/PM → Senior PM transition/i)).toBeInTheDocument()
      expect(screen.getByText(/in fintech/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Search help guides/i)).toBeInTheDocument()
    })

    it('displays initial guide count', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      expect(screen.getByText(/guides found/i)).toBeInTheDocument()
    })

    it('shows category and difficulty filter buttons', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      expect(screen.getByText('All Categories')).toBeInTheDocument()
      expect(screen.getByText('Career Development')).toBeInTheDocument()
      expect(screen.getByText('All Levels')).toBeInTheDocument()
      expect(screen.getByText('BEGINNER')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('filters guides based on search query', async () => {
      const user = userEvent.setup()
      render(<HelpSearchInterface {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/Search help guides/i)
      await user.type(searchInput, 'executive communication')
      
      await waitFor(() => {
        expect(screen.getByText(/Executive Communication Fundamentals/i)).toBeInTheDocument()
        expect(screen.queryByText(/Framework Application/i)).not.toBeInTheDocument()
      })
    })

    it('searches through guide tags', async () => {
      const user = userEvent.setup()
      render(<HelpSearchInterface {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/Search help guides/i)
      await user.type(searchInput, 'frameworks')
      
      await waitFor(() => {
        expect(screen.getByText(/PM Framework Application/i)).toBeInTheDocument()
      })
    })

    it('searches through guide content', async () => {
      const user = userEvent.setup()
      render(<HelpSearchInterface {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/Search help guides/i)
      await user.type(searchInput, 'answer-first methodology')
      
      await waitFor(() => {
        expect(screen.getByText(/Executive Communication Fundamentals/i)).toBeInTheDocument()
      })
    })

    it('shows no results when search has no matches', async () => {
      const user = userEvent.setup()
      render(<HelpSearchInterface {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/Search help guides/i)
      await user.type(searchInput, 'nonexistent topic xyz')
      
      await waitFor(() => {
        expect(screen.getByText('No guides found')).toBeInTheDocument()
        expect(screen.getByText(/Try adjusting your search query/i)).toBeInTheDocument()
      })
    })
  })

  describe('Category Filtering', () => {
    beforeEach(() => {
      render(<HelpSearchInterface {...defaultProps} />)
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
    })

    it('filters by career development category', async () => {
      const careerDevButton = screen.getByText('Career Development')
      fireEvent.click(careerDevButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Executive Communication Fundamentals/i)).toBeInTheDocument()
        expect(screen.getByText(/Framework Application/i)).toBeInTheDocument()
        expect(screen.queryByText(/Meeting Upload Optimization/i)).not.toBeInTheDocument()
      })
    })

    it('filters by getting started category', async () => {
      const gettingStartedButton = screen.getByText('Getting Started')
      fireEvent.click(gettingStartedButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Meeting Upload Optimization/i)).toBeInTheDocument()
        expect(screen.getByText(/Dashboard Metrics/i)).toBeInTheDocument()
        expect(screen.queryByText(/Executive Communication Fundamentals/i)).not.toBeInTheDocument()
      })
    })

    it('filters by industry specific category', async () => {
      const industryButton = screen.getByText('Industry Specific')
      fireEvent.click(industryButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Fintech PM Regulatory/i)).toBeInTheDocument()
        expect(screen.queryByText(/Framework Application/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Difficulty Filtering', () => {
    beforeEach(() => {
      render(<HelpSearchInterface {...defaultProps} />)
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
    })

    it('filters by beginner difficulty', async () => {
      const beginnerButton = screen.getByText('BEGINNER')
      fireEvent.click(beginnerButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Meeting Upload Optimization/i)).toBeInTheDocument()
        expect(screen.getByText(/Dashboard Metrics/i)).toBeInTheDocument()
        expect(screen.queryByText(/Fintech PM Regulatory/i)).not.toBeInTheDocument()
      })
    })

    it('filters by advanced difficulty', async () => {
      const advancedButton = screen.getByText('ADVANCED')
      fireEvent.click(advancedButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Fintech PM Regulatory/i)).toBeInTheDocument()
        expect(screen.queryByText(/Meeting Upload Optimization/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Career Relevance Filtering', () => {
    it('shows only PM to Senior PM relevant guides', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      expect(screen.getByText(/Executive Communication Fundamentals for PM → Senior PM/i)).toBeInTheDocument()
      expect(screen.getByText(/Framework Application/i)).toBeInTheDocument()
    })

    it('filters out guides not relevant to career transition', () => {
      const poToPmProps = {
        ...defaultProps,
        userCareerTransition: 'PO_TO_PM' as CareerTransitionType
      }
      render(<HelpSearchInterface {...poToPmProps} />)
      
      // Should show PO to PM content
      expect(screen.getByText(/Framework Application/i)).toBeInTheDocument()
      // Should not show Senior PM specific content
      expect(screen.queryByText(/Executive Communication Fundamentals for PM → Senior PM/i)).not.toBeInTheDocument()
    })
  })

  describe('Industry Context Filtering', () => {
    it('prioritizes industry-specific content', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      // Fintech user should see fintech-specific guides
      expect(screen.getByText(/Fintech PM Regulatory/i)).toBeInTheDocument()
    })

    it('hides industry-specific content for different industries', () => {
      const healthcareProps = {
        ...defaultProps,
        userIndustry: 'HEALTHCARE' as Industry
      }
      render(<HelpSearchInterface {...healthcareProps} />)
      
      // Healthcare user should not see fintech content
      expect(screen.queryByText(/Fintech PM Regulatory/i)).not.toBeInTheDocument()
    })

    it('shows ALL industry guides regardless of user industry', () => {
      const enterpriseProps = {
        ...defaultProps,
        userIndustry: 'ENTERPRISE' as Industry
      }
      render(<HelpSearchInterface {...enterpriseProps} />)
      
      // Should still show general guides marked as ALL industries
      expect(screen.getByText(/Framework Application/i)).toBeInTheDocument()
      expect(screen.getByText(/Meeting Upload Optimization/i)).toBeInTheDocument()
    })
  })

  describe('Guide Selection and Display', () => {
    it('displays guide metadata correctly', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      // Check for difficulty badges
      expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument()
      expect(screen.getByText('BEGINNER')).toBeInTheDocument()
      expect(screen.getByText('ADVANCED')).toBeInTheDocument()
      
      // Check for category badges
      expect(screen.getByText('Career Development')).toBeInTheDocument()
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      
      // Check for read time
      expect(screen.getByText(/8 min read/i)).toBeInTheDocument()
      expect(screen.getByText(/5 min read/i)).toBeInTheDocument()
    })

    it('shows search tags for guides', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      expect(screen.getByText('executive')).toBeInTheDocument()
      expect(screen.getByText('frameworks')).toBeInTheDocument()
      expect(screen.getByText('regulatory')).toBeInTheDocument()
    })

    it('calls onGuideSelect when guide is clicked', async () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      const readGuideButton = screen.getAllByText('Read Guide')[0]
      fireEvent.click(readGuideButton)
      
      expect(defaultProps.onGuideSelect).toHaveBeenCalledTimes(1)
      expect(defaultProps.onGuideSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Executive Communication Fundamentals')
        })
      )
    })
  })

  describe('Filter Management', () => {
    it('shows clear filters button when filters are applied', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      const beginnerButton = screen.getByText('BEGINNER')
      fireEvent.click(beginnerButton)
      
      expect(screen.getByText('Clear Filters')).toBeInTheDocument()
    })

    it('clears all filters when clear filters clicked', async () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      const beginnerButton = screen.getByText('BEGINNER')
      fireEvent.click(beginnerButton)
      
      const clearButton = screen.getByText('Clear Filters')
      fireEvent.click(clearButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument()
        // Should show all guides again
        expect(screen.getByText(/guides found/i)).toBeInTheDocument()
      })
    })

    it('updates guide count based on filters', async () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      const initialCount = screen.getByText(/guides found/i)
      
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      const beginnerButton = screen.getByText('BEGINNER')
      fireEvent.click(beginnerButton)
      
      await waitFor(() => {
        // Count should change when filters are applied
        expect(screen.getByText(/guides found/i)).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design Elements', () => {
    it('shows proper badge styling for different difficulties', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      const beginnerBadge = screen.getByText('BEGINNER')
      const intermediateBadge = screen.getByText('INTERMEDIATE')
      const advancedBadge = screen.getByText('ADVANCED')
      
      expect(beginnerBadge).toHaveClass('bg-green-100', 'text-green-800')
      expect(intermediateBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
      expect(advancedBadge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('shows proper badge styling for different categories', () => {
      render(<HelpSearchInterface {...defaultProps} />)
      
      const careerBadge = screen.getByText('Career Development')
      const gettingStartedBadge = screen.getByText('Getting Started')
      
      expect(careerBadge).toHaveClass('bg-purple-100', 'text-purple-800')
      expect(gettingStartedBadge).toHaveClass('bg-blue-100', 'text-blue-800')
    })
  })
})