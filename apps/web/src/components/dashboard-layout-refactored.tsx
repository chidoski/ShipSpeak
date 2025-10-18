/**
 * Refactored Dashboard Layout Component for ShipSpeak
 * Uses shared types, custom hooks, and theme system
 * Improved maintainability and reduced duplication
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DashboardLayoutProps, NavigationItem } from '@/types/dashboard'
import { lightTheme, darkTheme, Theme } from '@/styles/theme'
import { getAvatarInitials } from '@/utils/formatting'

// =============================================================================
// CONFIGURATION
// =============================================================================

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { id: 'meetings', label: 'Meetings', path: '/dashboard/meetings', icon: '🎯' },
  { id: 'practice', label: 'Practice', path: '/dashboard/practice', icon: '🎪' },
  { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: '📈' }
]

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  return { isMobile, isSidebarCollapsed, toggleSidebar }
}

const useNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (path: string) => router.push(path)
  
  const isActive = (path: string) => {
    return pathname === path || (path !== '/dashboard' && pathname.startsWith(path))
  }

  return { navigate, isActive }
}

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

const createStyles = (theme: Theme, isMobile: boolean, isSidebarCollapsed: boolean) => ({
  layout: {
    display: 'grid',
    gridTemplateAreas: isMobile 
      ? '"header" "main"'
      : '"header header" "sidebar main"',
    gridTemplateColumns: isMobile ? '1fr' : `${isSidebarCollapsed ? '60px' : '250px'} 1fr`,
    gridTemplateRows: '60px 1fr',
    height: '100vh',
    background: theme.colors.background,
    transition: theme.transitions.normal
  },
  
  header: {
    gridArea: 'header',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 ${theme.spacing.md}`,
    background: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm
  },

  sidebar: {
    gridArea: 'sidebar',
    background: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    padding: `${theme.spacing.md} 0`,
    overflowY: 'auto' as const,
    width: isSidebarCollapsed ? '60px' : '250px',
    transition: theme.transitions.normal
  },

  main: {
    gridArea: 'main',
    padding: isMobile ? theme.spacing.md : theme.spacing.xl,
    overflowY: 'auto' as const
  }
})

// =============================================================================
// COMPONENTS
// =============================================================================

const Header: React.FC<{
  theme: Theme
  isMobile: boolean
  onToggleSidebar: () => void
  user?: DashboardLayoutProps['user']
  processing?: DashboardLayoutProps['processing']
}> = ({ theme, isMobile, onToggleSidebar, user, processing }) => (
  <header style={createStyles(theme, isMobile, false).header} data-testid="dashboard-header">
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
      {isMobile && (
        <button
          data-testid="sidebar-toggle"
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: theme.typography.fontSize.lg,
            cursor: 'pointer',
            padding: theme.spacing.sm
          }}
        >
          ☰
        </button>
      )}
      <h1 style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        margin: 0
      }}>
        ShipSpeak
      </h1>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
      {processing?.meetingsInProgress && processing.meetingsInProgress > 0 && (
        <div data-testid="processing-indicator" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.sm,
          color: '#92400e'
        }}>
          <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
          {processing.meetingsInProgress} meetings processing
        </div>
      )}
      
      {user?.isAuthenticated ? (
        <div data-testid="user-profile" style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: theme.colors.primary,
            color: 'white',
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: theme.typography.fontWeight.bold
          }}>
            {getAvatarInitials(user.name)}
          </div>
          <div>
            <div style={{ fontWeight: theme.typography.fontWeight.medium, fontSize: theme.typography.fontSize.sm }}>
              {user.name || 'User'}
            </div>
            <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
              {user.email}
            </div>
          </div>
        </div>
      ) : (
        <button style={{
          background: theme.colors.primary,
          color: 'white',
          border: 'none',
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.md,
          cursor: 'pointer',
          fontWeight: theme.typography.fontWeight.medium
        }}>
          Sign In
        </button>
      )}
    </div>
  </header>
)

const Navigation: React.FC<{
  theme: Theme
  items: NavigationItem[]
  notifications?: DashboardLayoutProps['notifications']
  onNavigate: (path: string) => void
  isActive: (path: string) => boolean
  collapsed: boolean
}> = ({ theme, items, notifications, onNavigate, isActive, collapsed }) => (
  <nav style={{
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    padding: `0 ${collapsed ? theme.spacing.sm : theme.spacing.md}`
  }}>
    {items.map((item) => {
      const active = isActive(item.path)
      const notificationKey = item.id === 'meetings' ? 'newMeetings' : 
                             item.id === 'practice' ? 'newModules' : null
      const badge = notificationKey ? notifications?.[notificationKey as keyof typeof notifications] : undefined
      
      return (
        <button
          key={item.id}
          data-testid={`nav-${item.id}`}
          onClick={() => onNavigate(item.path)}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate(item.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            background: active ? theme.colors.primary : 'transparent',
            color: active ? 'white' : theme.colors.text.primary,
            border: 'none',
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            textAlign: 'left' as const,
            transition: theme.transitions.normal,
            position: 'relative' as const,
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
          aria-label={`Navigate to ${item.label}`}
        >
          <span style={{ fontSize: theme.typography.fontSize.lg }}>{item.icon}</span>
          {!collapsed && <span style={{ fontWeight: theme.typography.fontWeight.medium }}>{item.label}</span>}
          {badge && badge > 0 && (
            <span
              className="notification-badge"
              style={{
                position: 'absolute',
                right: theme.spacing.sm,
                background: theme.colors.error,
                color: 'white',
                borderRadius: theme.borderRadius.full,
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold
              }}
            >
              {badge}
            </span>
          )}
        </button>
      )
    })}
  </nav>
)

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DashboardLayoutRefactored: React.FC<DashboardLayoutProps> = ({
  children,
  user = { isAuthenticated: false },
  notifications = {},
  processing = {},
  theme: themeProp = 'light'
}) => {
  const theme = themeProp === 'dark' ? darkTheme : lightTheme
  const { isMobile, isSidebarCollapsed, toggleSidebar } = useResponsive()
  const { navigate, isActive } = useNavigation()

  const styles = createStyles(theme, isMobile, isSidebarCollapsed)

  return (
    <div 
      data-testid="dashboard-layout" 
      className={`dashboard-layout responsive theme-${themeProp}`}
      style={styles.layout}
    >
      <Header
        theme={theme}
        isMobile={isMobile}
        onToggleSidebar={toggleSidebar}
        user={user}
        processing={processing}
      />

      <aside 
        data-testid="dashboard-sidebar"
        className={isSidebarCollapsed ? 'collapsed' : ''}
        style={styles.sidebar}
        role="navigation"
        aria-label="Dashboard navigation"
      >
        <Navigation
          theme={theme}
          items={navigationItems}
          notifications={notifications}
          onNavigate={navigate}
          isActive={isActive}
          collapsed={isSidebarCollapsed}
        />
      </aside>

      <main 
        data-testid="dashboard-main"
        style={styles.main}
        role="main"
      >
        {children}
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .dashboard-layout button:hover {
          opacity: 0.9;
        }
        
        .dashboard-layout button:focus {
          outline: 2px solid ${theme.colors.primary};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}