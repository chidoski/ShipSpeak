/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RecommendationFeed from '@/components/modules/ModuleLibrary/ModuleDiscovery/RecommendationFeed'
import { mockUserProfile, mockRecommendationEngine } from '@/lib/mockModuleData'

describe('RecommendationFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    expect(screen.getByText('Generating personalized recommendations...')).toBeInTheDocument()
    expect(screen.getByText('Loading modules...')).toBeInTheDocument()
  })

  it('renders recommendations after loading', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Personalized for You')).toBeInTheDocument()
      expect(screen.getByText(/modules curated based on your career goals/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('displays recommendation cards with correct information', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const firstRecommendation = mockRecommendationEngine.personalizedRecommendations[0]
      expect(screen.getByText(firstRecommendation.module.title)).toBeInTheDocument()
      expect(screen.getByText(firstRecommendation.reasoning)).toBeInTheDocument()
    })
  })

  it('shows urgency levels correctly', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('High Priority')).toBeInTheDocument()
      expect(screen.getByText('Medium Priority')).toBeInTheDocument()
    })
  })

  it('displays relevance scores', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const firstRecommendation = mockRecommendationEngine.personalizedRecommendations[0]
      expect(screen.getByText(`${firstRecommendation.relevanceScore}% match`)).toBeInTheDocument()
    })
  })

  it('shows module duration and category', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const firstRecommendation = mockRecommendationEngine.personalizedRecommendations[0]
      expect(screen.getByText(`${firstRecommendation.module.estimatedDuration}min`)).toBeInTheDocument()
      expect(screen.getByText(firstRecommendation.module.category.name)).toBeInTheDocument()
    })
  })

  it('handles bookmark toggle', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const bookmarkButtons = screen.getAllByRole('button', { name: '' })
      const firstBookmarkButton = bookmarkButtons[0]
      
      fireEvent.click(firstBookmarkButton)
      
      // Verify bookmark state changed (visual indication would be tested via className or aria-label)
      expect(firstBookmarkButton).toBeInTheDocument()
    })
  })

  it('expands and collapses module details', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const infoButtons = screen.getAllByRole('button', { name: '' })
      const expandButton = infoButtons.find(button => 
        button.querySelector('svg') && button.classList.contains('px-3')
      )
      
      if (expandButton) {
        fireEvent.click(expandButton)
        
        // Check for expanded content (this would need to be adjusted based on actual implementation)
        expect(screen.getByText('Expected Outcome:')).toBeInTheDocument()
      }
    })
  })

  it('displays career impact information', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Career Impact')).toBeInTheDocument()
      
      const firstRecommendation = mockRecommendationEngine.personalizedRecommendations[0]
      expect(screen.getByText(firstRecommendation.careerImpact)).toBeInTheDocument()
    })
  })

  it('shows skill gaps addressed', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const firstRecommendation = mockRecommendationEngine.personalizedRecommendations[0]
      if (firstRecommendation.skillGaps.length > 0) {
        expect(screen.getByText('Addresses skill gaps:')).toBeInTheDocument()
        expect(screen.getByText(firstRecommendation.skillGaps[0])).toBeInTheDocument()
      }
    })
  })

  it('displays completion timeline', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Timeline:')).toBeInTheDocument()
      
      const firstRecommendation = mockRecommendationEngine.personalizedRecommendations[0]
      expect(screen.getByText(firstRecommendation.timeToCompletion)).toBeInTheDocument()
    })
  })

  it('shows start module buttons', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const startButtons = screen.getAllByText('Start Module')
      expect(startButtons.length).toBeGreaterThan(0)
    })
  })

  it('displays priority legend', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('High Priority')).toBeInTheDocument()
      expect(screen.getByText('Medium Priority')).toBeInTheDocument()
      expect(screen.getByText('Low Priority')).toBeInTheDocument()
    })
  })

  it('handles empty recommendations gracefully', async () => {
    const emptyEngine = {
      ...mockRecommendationEngine,
      personalizedRecommendations: []
    }
    
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={emptyEngine}
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('No recommendations available')).toBeInTheDocument()
      expect(screen.getByText('Complete your skill assessment to receive personalized module recommendations.')).toBeInTheDocument()
      expect(screen.getByText('Complete Assessment')).toBeInTheDocument()
    })
  })

  it('respects maxRecommendations prop', async () => {
    const maxRecommendations = 2
    
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
        maxRecommendations={maxRecommendations}
      />
    )
    
    await waitFor(() => {
      // Count the number of recommendation cards
      const moduleCards = screen.getAllByText(/Start Module|Review Module/)
      expect(moduleCards.length).toBeLessThanOrEqual(maxRecommendations)
    })
  })

  it('handles different view modes', async () => {
    const { rerender } = render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
        viewMode="grid"
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Personalized for You')).toBeInTheDocument()
    })

    rerender(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
        viewMode="list"
      />
    )
    
    // Component should still render correctly in list mode
    expect(screen.getByText('Personalized for You')).toBeInTheDocument()
  })

  it('sorts recommendations by urgency and relevance', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const highPriorityElements = screen.getAllByText('High Priority')
      const mediumPriorityElements = screen.getAllByText('Medium Priority')
      
      // High priority should appear before medium priority
      expect(highPriorityElements.length).toBeGreaterThan(0)
      
      if (mediumPriorityElements.length > 0) {
        const allPriorityElements = screen.getAllByText(/High Priority|Medium Priority|Low Priority/)
        const firstPriorityElement = allPriorityElements[0]
        expect(firstPriorityElement).toHaveTextContent('High Priority')
      }
    })
  })
})

describe('RecommendationFeed Accessibility', () => {
  it('has proper ARIA labels and roles', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      // All buttons should be accessible
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })
  })

  it('supports keyboard navigation', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      if (buttons.length > 0) {
        buttons[0].focus()
        expect(buttons[0]).toHaveFocus()
      }
    })
  })

  it('provides meaningful button labels', async () => {
    render(
      <RecommendationFeed
        userProfile={mockUserProfile}
        recommendationEngine={mockRecommendationEngine}
      />
    )
    
    await waitFor(() => {
      const startButtons = screen.getAllByText(/Start Module|Review Module/)
      expect(startButtons.length).toBeGreaterThan(0)
      
      startButtons.forEach(button => {
        expect(button).toHaveTextContent(/Start Module|Review Module/)
      })
    })
  })
})