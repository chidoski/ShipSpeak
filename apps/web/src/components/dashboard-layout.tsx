/**
 * Dashboard Layout Component for ShipSpeak
 * Responsive layout with sidebar navigation and real-time updates
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name?: string
    email?: string
    isAuthenticated?: boolean
  }
  notifications?: {
    newMeetings?: number
    newModules?: number
  }
  processing?: {
    meetingsInProgress?: number
  }
}

interface NavigationItem {
  id: string
  label: string
  path: string
  icon: string
  badge?: number
}

// =============================================================================
// NAVIGATION CONFIGURATION
// =============================================================================

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { id: 'meetings', label: 'Meetings', path: '/dashboard/meetings', icon: '🎯' },
  { id: 'practice', label: 'Practice', path: '/dashboard/practice', icon: '🎪' },
  { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: '📈' }
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user = { isAuthenticated: false },
  notifications = {},
  processing = {}
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const isActiveRoute = (path: string) => {
    return pathname === path || (path !== '/dashboard' && pathname.startsWith(path))
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = isActiveRoute(item.path)
    // Map item.id to notification keys
    const notificationKey = item.id === 'meetings' ? 'newMeetings' : 
                           item.id === 'practice' ? 'newModules' : null
    const badge = notificationKey ? notifications[notificationKey as keyof typeof notifications] : undefined
    
    return (
      <button
        key={item.id}
        data-testid={`nav-${item.id}`}
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => handleNavigation(item.path)}
        onKeyDown={(e) => e.key === 'Enter' && handleNavigation(item.path)}
        aria-label={`Navigate to ${item.label}`}
      >
        <span className="nav-icon">{item.icon}</span>
        <span className="nav-label">{item.label}</span>
        {badge && badge > 0 && (
          <span className="notification-badge">{badge}</span>
        )}
      </button>
    )
  }

  const renderUserProfile = () => {
    if (!user.isAuthenticated) {
      return (
        <div className="user-section">
          <button className="sign-in-btn">Sign In</button>
        </div>
      )
    }

    return (
      <div data-testid="user-profile" className="user-section">
        <div className="user-avatar">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user.name || 'User'}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>
    )
  }

  const renderProcessingIndicator = () => {
    if (!processing.meetingsInProgress || processing.meetingsInProgress === 0) {
      return null
    }

    return (
      <div data-testid="processing-indicator" className="processing-indicator">
        <span className="processing-spinner">⟳</span>
        <span>{processing.meetingsInProgress} meetings processing</span>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      data-testid="dashboard-layout" 
      className={`dashboard-layout responsive theme-light ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}
    >
      {/* Header */}
      <header data-testid="dashboard-header" className="dashboard-header">
        <div className="header-left">
          {isMobile && (
            <button
              data-testid="sidebar-toggle"
              className="sidebar-toggle"
              onClick={handleSidebarToggle}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
          )}
          <h1 className="brand">ShipSpeak</h1>
        </div>
        
        <div className="header-right">
          {renderProcessingIndicator()}
          {renderUserProfile()}
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        data-testid="dashboard-sidebar"
        className={`dashboard-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
        role="navigation"
        aria-label="Dashboard navigation"
      >
        <nav className="navigation">
          {navigationItems.map(renderNavigationItem)}
        </nav>
      </aside>

      {/* Main Content */}
      <main 
        data-testid="dashboard-main"
        className="dashboard-main"
        role="main"
      >
        {children}
      </main>

      {/* Styles */}
      <style jsx>{`
        .dashboard-layout {
          display: grid;
          grid-template-areas: 
            "header header"
            "sidebar main";
          grid-template-columns: 250px 1fr;
          grid-template-rows: 60px 1fr;
          height: 100vh;
          background: #f8fafc;
        }

        .dashboard-header {
          grid-area: header;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }

        .sidebar-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .dashboard-sidebar {
          grid-area: sidebar;
          background: white;
          border-right: 1px solid #e2e8f0;
          padding: 1rem 0;
          overflow-y: auto;
        }

        .navigation {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0 1rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          position: relative;
        }

        .nav-item:hover {
          background: #f1f5f9;
        }

        .nav-item.active {
          background: #3b82f6;
          color: white;
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .nav-label {
          font-weight: 500;
        }

        .notification-badge {
          position: absolute;
          right: 0.5rem;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .dashboard-main {
          grid-area: main;
          padding: 2rem;
          overflow-y: auto;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 500;
          font-size: 0.875rem;
        }

        .user-email {
          font-size: 0.75rem;
          color: #64748b;
        }

        .sign-in-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #92400e;
        }

        .processing-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-layout {
            grid-template-areas: 
              "header"
              "main";
            grid-template-columns: 1fr;
          }

          .sidebar-toggle {
            display: block;
          }

          .dashboard-sidebar {
            position: fixed;
            left: 0;
            top: 60px;
            height: calc(100vh - 60px);
            width: 250px;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .dashboard-sidebar:not(.collapsed) {
            transform: translateX(0);
          }

          .dashboard-main {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}