/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PM Competency Colors
        competency: {
          'product-sense': {
            low: '#ef4444',    // red-500
            mid: '#f59e0b',    // amber-500  
            high: '#10b981',   // emerald-500
            excellent: '#3b82f6', // blue-500
          },
          'communication': {
            low: '#ef4444',
            mid: '#f59e0b',
            high: '#10b981',
            excellent: '#3b82f6',
          },
          'stakeholder': {
            low: '#ef4444',
            mid: '#f59e0b',
            high: '#10b981',
            excellent: '#3b82f6',
          },
          'technical': {
            low: '#ef4444',
            mid: '#f59e0b',
            high: '#10b981',
            excellent: '#3b82f6',
          },
          'business': {
            low: '#ef4444',
            mid: '#f59e0b',
            high: '#10b981',
            excellent: '#3b82f6',
          },
        },
        // Executive Theme
        executive: {
          primary: '#1e293b',   // slate-800
          secondary: '#475569', // slate-600
          accent: '#3b82f6',    // blue-500
          success: '#10b981',   // emerald-500
          warning: '#f59e0b',   // amber-500
          error: '#ef4444',     // red-500
          background: '#f8fafc', // slate-50
          surface: '#ffffff',
          text: {
            primary: '#1e293b',   // slate-800
            secondary: '#64748b', // slate-500
            muted: '#94a3b8',     // slate-400
          }
        },
        // Industry Themes
        healthcare: {
          primary: '#059669',   // emerald-600
          secondary: '#065f46', // emerald-800
          accent: '#10b981',    // emerald-500
        },
        cybersecurity: {
          primary: '#dc2626',   // red-600
          secondary: '#991b1b', // red-800
          accent: '#ef4444',    // red-500
        },
        fintech: {
          primary: '#7c3aed',   // violet-600
          secondary: '#5b21b6', // violet-800
          accent: '#8b5cf6',    // violet-500
        },
        enterprise: {
          primary: '#1e40af',   // blue-700
          secondary: '#1e3a8a', // blue-800
          accent: '#3b82f6',    // blue-500
        },
        consumer: {
          primary: '#ea580c',   // orange-600
          secondary: '#c2410c', // orange-700
          accent: '#f97316',    // orange-500
        }
      },
      typography: {
        // Executive Typography Scale
        executive: {
          'headline-1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }], // text-4xl
          'headline-2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }], // text-3xl
          'headline-3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // text-2xl
          'body-large': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }], // text-lg
          'body-regular': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // text-base
          'caption': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // text-sm
        }
      },
      spacing: {
        // Executive Touch Targets
        'touch-sm': '44px',
        'touch-md': '48px', 
        'touch-lg': '56px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}