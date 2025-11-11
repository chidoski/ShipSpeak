/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import LibraryOrchestrator from '@/components/modules/ModuleLibrary/LibraryOrchestrator'
import { mockUserProfile } from '@/lib/mockModuleData'

// Mock the child components
jest.mock('@/components/modules/ModuleLibrary/ModuleDiscovery/CategoryBrowser', () => {
  return function MockCategoryBrowser() {
    return <div data-testid="category-browser">Category Browser</div>
  }
})

jest.mock('@/components/modules/ModuleLibrary/ModuleDiscovery/SearchInterface', () => {
  return function MockSearchInterface() {
    return <div data-testid="search-interface">Search Interface</div>
  }
})

jest.mock('@/components/modules/ModuleLibrary/ModuleDiscovery/RecommendationFeed', () => {
  return function MockRecommendationFeed() {
    return <div data-testid="recommendation-feed">Recommendation Feed</div>
  }
})

jest.mock('@/components/modules/ModuleLibrary/ModuleDiscovery/LearningPathViewer', () => {
  return function MockLearningPathViewer() {
    return <div data-testid="learning-path-viewer">Learning Path Viewer</div>
  }
})

describe('LibraryOrchestrator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders module library header correctly', () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    expect(screen.getByText('Module Library')).toBeInTheDocument()
    expect(screen.getByText('Accelerate your PM career with personalized learning modules')).toBeInTheDocument()
  })

  it('renders navigation buttons for all views', () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    expect(screen.getByRole('button', { name: /discover/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /for you/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /learning paths/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /my library/i })).toBeInTheDocument()
  })

  it('defaults to recommendations view', () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    waitFor(() => {
      expect(screen.getByTestId('recommendation-feed')).toBeInTheDocument()
    })
  })

  it('switches between views correctly', async () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    // Switch to browse view
    const browseButton = screen.getByRole('button', { name: /browse/i })
    await act(async () => {
      fireEvent.click(browseButton)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('category-browser')).toBeInTheDocument()
    })

    // Switch to discover view
    const discoverButton = screen.getByRole('button', { name: /discover/i })
    await act(async () => {
      fireEvent.click(discoverButton)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('search-interface')).toBeInTheDocument()
    })

    // Switch to learning paths view
    const pathsButton = screen.getByRole('button', { name: /learning paths/i })
    await act(async () => {
      fireEvent.click(pathsButton)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('learning-path-viewer')).toBeInTheDocument()
    })
  })

  it('shows loading state during view transitions', async () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    const browseButton = screen.getByRole('button', { name: /browse/i })
    await act(async () => {
      fireEvent.click(browseButton)
    })
    
    expect(screen.getByText('Loading modules...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByTestId('category-browser')).toBeInTheDocument()
    })
  })

  it('renders view mode toggle buttons', () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    const gridButton = screen.getByRole('button', { name: 'Grid view' })
    const listButton = screen.getByRole('button', { name: 'List view' })
    
    expect(gridButton).toBeInTheDocument()
    expect(listButton).toBeInTheDocument()
  })

  it('renders view description correctly', () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    expect(screen.getByText('Personalized recommendations based on your goals')).toBeInTheDocument()
  })

  it('renders my library view with user statistics', async () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    const myLibraryButton = screen.getByRole('button', { name: /my library/i })
    await act(async () => {
      fireEvent.click(myLibraryButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Completed Modules')).toBeInTheDocument()
      expect(screen.getByText('Saved Modules')).toBeInTheDocument()
      expect(screen.getByText('Skill Progress')).toBeInTheDocument()
    })
  })

  it('shows empty state when no completed modules', async () => {
    const userWithNoModules = {
      ...mockUserProfile,
      completedModules: []
    }
    
    render(<LibraryOrchestrator userProfile={userWithNoModules} />)
    
    const myLibraryButton = screen.getByRole('button', { name: /my library/i })
    await act(async () => {
      fireEvent.click(myLibraryButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('No completed modules yet')).toBeInTheDocument()
      expect(screen.getByText('Start with personalized recommendations to begin your learning journey.')).toBeInTheDocument()
    })
  })

  it('handles view change to recommendations from empty state', async () => {
    const userWithNoModules = {
      ...mockUserProfile,
      completedModules: []
    }
    
    render(<LibraryOrchestrator userProfile={userWithNoModules} />)
    
    // Go to my library first
    const myLibraryButton = screen.getByRole('button', { name: /my library/i })
    await act(async () => {
      fireEvent.click(myLibraryButton)
    })
    
    await waitFor(async () => {
      const exploreButton = screen.getByRole('button', { name: /explore recommendations/i })
      await act(async () => {
        fireEvent.click(exploreButton)
      })
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('recommendation-feed')).toBeInTheDocument()
    })
  })

  it('applies correct styling based on user profile', async () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    // Go to my library to check user profile data
    const myLibraryButton = screen.getByRole('button', { name: /my library/i })
    await act(async () => {
      fireEvent.click(myLibraryButton)
    })
    
    await waitFor(() => {
      // Check that the component renders without errors and includes expected elements
      expect(screen.getByText(mockUserProfile.completedModules.length.toString())).toBeInTheDocument()
      expect(screen.getByText(`${Math.round(mockUserProfile.skillAssessment.overallScore)}%`)).toBeInTheDocument()
    })
  })

  it('prevents duplicate view changes', async () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    const forYouButton = screen.getByRole('button', { name: /for you/i })
    
    // Click the same button multiple times
    fireEvent.click(forYouButton)
    fireEvent.click(forYouButton)
    fireEvent.click(forYouButton)
    
    // Should not show loading state since view hasn't changed
    expect(screen.queryByText('Loading modules...')).not.toBeInTheDocument()
  })
})

describe('LibraryOrchestrator Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    // Check specific buttons with accessible names
    expect(screen.getByRole('button', { name: 'Grid view' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'List view' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /discover/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /for you/i })).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    render(<LibraryOrchestrator userProfile={mockUserProfile} />)
    
    const firstButton = screen.getByRole('button', { name: /discover/i })
    firstButton.focus()
    
    expect(firstButton).toHaveFocus()
  })
})

describe('LibraryOrchestrator Props Handling', () => {
  it('handles missing userProfile gracefully', () => {
    render(<LibraryOrchestrator />)
    
    expect(screen.getByText('Module Library')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'custom-module-library'
    const { container } = render(
      <LibraryOrchestrator userProfile={mockUserProfile} className={customClass} />
    )
    
    expect(container.firstChild).toHaveClass(customClass)
  })
})