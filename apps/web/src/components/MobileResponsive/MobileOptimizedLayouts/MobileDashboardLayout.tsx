/**
 * Mobile Dashboard Layout for ShipSpeak
 * Mobile-specific dashboard layout and navigation optimized for PM development
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface MobileDashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name?: string
    email?: string
    isAuthenticated?: boolean
  }
  notifications?: {
    newMeetings?: number
    newModules?: number
    coaching?: number
  }
  processing?: {
    meetingsInProgress?: number
  }
}

interface MobileNavigationItem {
  id: string
  label: string
  shortLabel: string
  path: string
  icon: string
  badge?: number
  quickAction?: boolean
}

// =============================================================================
// MOBILE NAVIGATION CONFIGURATION
// =============================================================================

const mobileNavigationItems: MobileNavigationItem[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    shortLabel: 'Home',
    path: '/dashboard', 
    icon: '🏠',
    quickAction: true
  },
  { 
    id: 'practice', 
    label: 'Practice Recording', 
    shortLabel: 'Practice',
    path: '/dashboard/practice', 
    icon: '🎙️',
    quickAction: true
  },
  { 
    id: 'meetings', 
    label: 'Meeting Archive', 
    shortLabel: 'Meetings',
    path: '/dashboard/meetings', 
    icon: '📋'
  },
  { 
    id: 'progress', 
    label: 'Progress Tracking', 
    shortLabel: 'Progress',
    path: '/dashboard/progress', 
    icon: '📈'
  },
  { 
    id: 'coaching', 
    label: 'AI Coaching', 
    shortLabel: 'Coaching',
    path: '/dashboard/coaching', 
    icon: '🧠'
  }
]

const secondaryNavigationItems: MobileNavigationItem[] = [
  { 
    id: 'modules', 
    label: 'Module Library', 
    shortLabel: 'Library',
    path: '/dashboard/modules', 
    icon: '📚'
  },
  { 
    id: 'feedback', 
    label: 'Feedback Analysis', 
    shortLabel: 'Feedback',
    path: '/dashboard/feedback', 
    icon: '📊'
  },
  { 
    id: 'help', 
    label: 'Help & Guidance', 
    shortLabel: 'Help',
    path: '/dashboard/help', 
    icon: '❓'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    shortLabel: 'Settings',
    path: '/dashboard/settings', 
    icon: '⚙️'
  }
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MobileDashboardLayout: React.FC<MobileDashboardLayoutProps> = ({
  children,
  user = { isAuthenticated: false },
  notifications = {},
  processing = {}
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [showSecondaryNav, setShowSecondaryNav] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleNavigation = (path: string) => {
    router.push(path)
    setShowSecondaryNav(false)
  }

  const handleMenuToggle = () => {
    setShowSecondaryNav(!showSecondaryNav)
  }

  const isActiveRoute = (path: string) => {
    return pathname === path || (path !== '/dashboard' && pathname.startsWith(path))
  }

  const getBadgeCount = (itemId: string): number => {
    switch (itemId) {
      case 'meetings':
        return notifications.newMeetings || 0
      case 'practice':
      case 'modules':
        return notifications.newModules || 0
      case 'coaching':
        return notifications.coaching || 0
      default:
        return 0
    }
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderMobileNavItem = (item: MobileNavigationItem) => {
    const isActive = isActiveRoute(item.path)
    const badge = getBadgeCount(item.id)
    
    return (
      <button
        key={item.id}
        data-testid={`mobile-nav-${item.id}`}
        className={`mobile-nav-item ${isActive ? 'active' : ''}`}
        onClick={() => handleNavigation(item.path)}
        aria-label={`Navigate to ${item.label}`}
      >
        <span className="mobile-nav-icon">{item.icon}</span>
        <span className="mobile-nav-label">{item.shortLabel}</span>
        {badge > 0 && (
          <span className="mobile-nav-badge">{badge > 99 ? '99+' : badge}</span>
        )}
      </button>
    )
  }

  const renderQuickActions = () => {
    const quickActions = mobileNavigationItems.filter(item => item.quickAction)
    
    return (
      <div className="quick-actions">
        {quickActions.map(item => (
          <button
            key={`quick-${item.id}`}
            className="quick-action-btn"
            onClick={() => handleNavigation(item.path)}
            aria-label={`Quick access to ${item.label}`}
          >
            <span className="quick-action-icon">{item.icon}</span>
            <span className="quick-action-label">{item.shortLabel}</span>
          </button>
        ))}
      </div>
    )
  }

  const renderProcessingIndicator = () => {
    if (!processing.meetingsInProgress || processing.meetingsInProgress === 0) {
      return null
    }

    return (
      <div className="mobile-processing-indicator">
        <span className="processing-dot"></span>
        <span className="processing-text">{processing.meetingsInProgress} processing</span>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div data-testid="mobile-dashboard-layout" className="mobile-dashboard-layout">
      {/* Mobile Header */}
      <header 
        data-testid="mobile-header" 
        className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="mobile-header-content">
          <div className="mobile-brand">
            <h1>ShipSpeak</h1>
            {renderProcessingIndicator()}
          </div>
          
          <div className="mobile-header-actions">
            <button
              data-testid="mobile-menu-toggle"
              className="mobile-menu-toggle"
              onClick={handleMenuToggle}
              aria-label="Toggle navigation menu"
            >
              <span className={`hamburger ${showSecondaryNav ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            
            {user.isAuthenticated && (
              <div className="mobile-user-avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Secondary Navigation Overlay */}
      {showSecondaryNav && (
        <div 
          className="secondary-nav-overlay"
          onClick={() => setShowSecondaryNav(false)}
          data-testid="secondary-nav-overlay"
        >
          <nav className="secondary-navigation" onClick={e => e.stopPropagation()}>
            <div className="secondary-nav-header">
              <span>More Options</span>
              <button 
                className="close-secondary-nav"
                onClick={() => setShowSecondaryNav(false)}
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>
            <div className="secondary-nav-items">
              {secondaryNavigationItems.map(renderMobileNavItem)}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main 
        data-testid="mobile-main-content"
        className="mobile-main-content"
        role="main"
      >
        {children}
      </main>

      {/* Quick Actions Floating Button */}
      <div className="mobile-quick-actions">
        {renderQuickActions()}
      </div>

      {/* Bottom Navigation */}
      <nav 
        data-testid="mobile-bottom-nav"
        className="mobile-bottom-navigation"
        role="navigation"
        aria-label="Primary navigation"
      >
        {mobileNavigationItems.slice(0, 4).map(renderMobileNavItem)}
        <button
          className="mobile-nav-item more"
          onClick={handleMenuToggle}
          aria-label="More navigation options"
        >
          <span className="mobile-nav-icon">⋯</span>
          <span className="mobile-nav-label">More</span>
        </button>
      </nav>

      {/* Styles */}
      <style jsx>{`
        .mobile-dashboard-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f8fafc;
          position: relative;
        }

        .mobile-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          transition: box-shadow 0.2s ease;
        }

        .mobile-header.scrolled {
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .mobile-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          min-height: 60px;
        }

        .mobile-brand h1 {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }

        .mobile-processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #f59e0b;
        }

        .processing-dot {
          width: 6px;
          height: 6px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .mobile-header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-menu-toggle {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 20px;
          height: 15px;
          position: relative;
        }

        .hamburger span {
          width: 100%;
          height: 2px;
          background: #374151;
          transition: 0.3s ease;
        }

        .hamburger span:nth-child(1) { margin-bottom: 4px; }
        .hamburger span:nth-child(2) { margin-bottom: 4px; }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-user-avatar {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
        }

        .secondary-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 100;
          display: flex;
          justify-content: flex-end;
        }

        .secondary-navigation {
          background: white;
          width: 280px;
          height: 100%;
          padding: 1rem;
          box-shadow: -2px 0 10px rgba(0,0,0,0.1);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .secondary-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .secondary-nav-header span {
          font-weight: 600;
          color: #1e293b;
        }

        .close-secondary-nav {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
        }

        .secondary-nav-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-main-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          padding-bottom: calc(70px + 1rem); /* Bottom nav height + padding */
        }

        .mobile-bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-around;
          padding: 0.5rem 0;
          z-index: 40;
          height: 70px;
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
          min-width: 60px;
        }

        .mobile-nav-item.active {
          color: #3b82f6;
        }

        .mobile-nav-icon {
          font-size: 1.25rem;
        }

        .mobile-nav-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
        }

        .mobile-nav-badge {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          font-weight: bold;
        }

        .quick-actions {
          position: fixed;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 30;
        }

        .quick-action-btn {
          width: 56px;
          height: 56px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }

        .quick-action-btn:active {
          transform: scale(0.95);
        }

        .quick-action-icon {
          font-size: 1.25rem;
        }

        .quick-action-label {
          font-size: 0.625rem;
          font-weight: 500;
        }

        /* Touch optimizations */
        @media (max-height: 600px) {
          .mobile-header-content {
            padding: 0.75rem 1rem;
            min-height: 50px;
          }
          
          .mobile-bottom-navigation {
            height: 60px;
            padding: 0.25rem 0;
          }
          
          .mobile-main-content {
            padding-bottom: calc(60px + 1rem);
          }
        }
      `}</style>
    </div>
  )
}