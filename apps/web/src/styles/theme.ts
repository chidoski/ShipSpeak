/**
 * Theme System for ShipSpeak
 * Centralized design tokens and styling utilities
 */

export interface Theme {
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    error: string
    background: string
    surface: string
    text: {
      primary: string
      secondary: string
      disabled: string
    }
    border: string
    shadow: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      xxl: string
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
  transitions: {
    fast: string
    normal: string
    slow: string
  }
}

export const lightTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#9ca3af'
    },
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    slow: '0.3s ease'
  }
}

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      disabled: '#64748b'
    },
    border: '#374151',
    shadow: 'rgba(0, 0, 0, 0.3)'
  }
}

export const getScoreColor = (score: number, theme: Theme): string => {
  if (score >= 80) return theme.colors.success
  if (score >= 60) return theme.colors.warning
  return theme.colors.error
}

export const getStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'completed': return theme.colors.success
    case 'processing': return theme.colors.primary
    case 'uploading': return '#8b5cf6'
    case 'failed': return theme.colors.error
    default: return theme.colors.secondary
  }
}