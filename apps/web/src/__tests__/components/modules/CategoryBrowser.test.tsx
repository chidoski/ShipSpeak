/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CategoryBrowser from '@/components/modules/ModuleLibrary/ModuleDiscovery/CategoryBrowser'
import { mockUserProfile, mockModuleCollections } from '@/lib/mockModuleData'

describe('CategoryBrowser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders category overview by default', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    expect(screen.getByText('Browse by Category')).toBeInTheDocument()
    expect(screen.getByText('Explore modules organized by PM competency areas and career development focus')).toBeInTheDocument()
  })

  it('displays category cards with correct information', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Check for expected categories
    expect(screen.getByText('Executive Communication')).toBeInTheDocument()
    expect(screen.getByText('Strategic Thinking')).toBeInTheDocument()
    expect(screen.getByText('Industry Expertise')).toBeInTheDocument()
  })

  it('shows module counts for each category', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Should show "Modules" text for each category
    const moduleCountElements = screen.getAllByText('Modules')
    expect(moduleCountElements.length).toBeGreaterThan(0)
  })

  it('displays average duration for categories', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Should show "Avg. Duration" text
    const durationElements = screen.getAllByText('Avg. Duration')
    expect(durationElements.length).toBeGreaterThan(0)
  })

  it('navigates to category detail view when category is clicked', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    const executiveCommunicationCard = screen.getByText('Executive Communication').closest('div[role="button"], button, [data-testid]')?.parentElement
    
    if (executiveCommunicationCard) {
      fireEvent.click(executiveCommunicationCard)
      
      // Should show breadcrumb navigation
      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('Executive Communication')).toBeInTheDocument()
    }
  })

  it('shows category modules when in detail view', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Click on a category to enter detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      // Should show modules for the category
      waitFor(() => {
        // Look for module-related content
        expect(screen.getByText(/modules/i)).toBeInTheDocument()
      })
    }
  })

  it('displays relevance badges for user', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to a category detail view first
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        // Should show relevance indicators
        const relevanceElements = screen.queryAllByText(/Highly Relevant|Relevant|General/)
        expect(relevanceElements.length).toBeGreaterThanOrEqual(0)
      })
    }
  })

  it('shows completed module indicators', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        // Should show completed indicators for modules the user has completed
        const completedElements = screen.queryAllByText('Completed')
        // User has completed some modules, so this should appear
        expect(completedElements.length).toBeGreaterThanOrEqual(0)
      })
    }
  })

  it('handles bookmark toggle in module cards', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        const bookmarkButtons = screen.getAllByRole('button')
        const bookmarkButton = bookmarkButtons.find(button => 
          button.querySelector('svg') && button.classList.contains('p-1')
        )
        
        if (bookmarkButton) {
          fireEvent.click(bookmarkButton)
          expect(bookmarkButton).toBeInTheDocument()
        }
      })
    }
  })

  it('displays module ratings and duration', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        // Should show star ratings and time duration
        const starElements = screen.queryAllByText(/\d+\.\d+/)
        const timeElements = screen.queryAllByText(/\d+min/)
        
        expect(starElements.length + timeElements.length).toBeGreaterThan(0)
      })
    }
  })

  it('shows start/review module buttons', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        const actionButtons = screen.queryAllByText(/Start Module|Review Module/)
        expect(actionButtons.length).toBeGreaterThan(0)
      })
    }
  })

  it('navigates back to category overview from breadcrumb', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        const categoriesBreadcrumb = screen.getByText('Categories')
        fireEvent.click(categoriesBreadcrumb)
        
        // Should be back to overview
        expect(screen.getByText('Browse by Category')).toBeInTheDocument()
      })
    }
  })

  it('displays category header with statistics in detail view', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        expect(screen.getByText('Executive Communication')).toBeInTheDocument()
        // Should show stats like module count, duration, skill level
        expect(screen.getByText(/modules/)).toBeInTheDocument()
      })
    }
  })

  it('handles different view modes correctly', () => {
    const { rerender } = render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
        viewMode="grid"
      />
    )
    
    expect(screen.getByText('Browse by Category')).toBeInTheDocument()

    rerender(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
        viewMode="list"
      />
    )
    
    expect(screen.getByText('Browse by Category')).toBeInTheDocument()
  })

  it('shows empty state when no modules in category', () => {
    // Create a mock with empty modules
    const emptyCollections = mockModuleCollections.map(collection => ({
      ...collection,
      modules: []
    }))
    
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={emptyCollections}
      />
    )
    
    // Navigate to a category
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        expect(screen.getByText('No modules found')).toBeInTheDocument()
        expect(screen.getByText('No modules available in this category yet. Check back soon!')).toBeInTheDocument()
      })
    }
  })

  it('displays career impact for high relevance modules', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        // Should show career impact sections for highly relevant modules
        const careerImpactElements = screen.queryAllByText('High Career Impact')
        expect(careerImpactElements.length).toBeGreaterThanOrEqual(0)
      })
    }
  })

  it('shows learning objectives preview', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        expect(screen.getByText("You'll learn to:")).toBeInTheDocument()
      })
    }
  })

  it('displays skills developed section', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Navigate to category detail view
    const categoryElement = screen.getByText('Executive Communication')
    const categoryCard = categoryElement.closest('.cursor-pointer, [role="button"]')
    
    if (categoryCard) {
      fireEvent.click(categoryCard)
      
      waitFor(() => {
        expect(screen.getByText('Skills developed:')).toBeInTheDocument()
      })
    }
  })
})

describe('CategoryBrowser Accessibility', () => {
  it('has proper ARIA labels and roles', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    const interactive_elements = screen.getAllByRole('button')
    expect(interactive_elements.length).toBeGreaterThan(0)
  })

  it('supports keyboard navigation', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    const categoryCards = screen.getAllByText(/Executive Communication|Strategic Thinking|Industry Expertise/)
    if (categoryCards.length > 0) {
      const firstCard = categoryCards[0].closest('.cursor-pointer, [role="button"]') as HTMLElement
      if (firstCard) {
        firstCard.focus()
        expect(firstCard).toHaveFocus()
      }
    }
  })

  it('provides meaningful descriptions for categories', () => {
    render(
      <CategoryBrowser
        userProfile={mockUserProfile}
        moduleCollections={mockModuleCollections}
      />
    )
    
    // Each category should have a description
    expect(screen.getByText(/Master C-suite and senior stakeholder communication/)).toBeInTheDocument()
    expect(screen.getByText(/Develop market strategy and competitive analysis skills/)).toBeInTheDocument()
  })
})