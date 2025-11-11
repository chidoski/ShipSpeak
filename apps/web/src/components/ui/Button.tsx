import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'executive'
  executive?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', executive = false, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          
          // Size variants
          {
            'px-3 py-1.5 text-sm rounded-md min-h-[36px]': size === 'sm',
            'px-4 py-2 text-base rounded-lg min-h-[44px]': size === 'md', 
            'px-6 py-3 text-lg rounded-lg min-h-[48px]': size === 'lg',
            'px-8 py-4 text-xl rounded-xl min-h-[56px]': size === 'executive',
          },
          
          // Variant styles - Executive theme
          executive && {
            'bg-executive-primary text-white hover:bg-executive-primary/90 focus:ring-executive-accent/20': variant === 'primary',
            'bg-executive-surface text-executive-primary border border-executive-secondary/20 hover:bg-executive-secondary/5 focus:ring-executive-accent/20': variant === 'secondary',
            'border border-executive-primary text-executive-primary hover:bg-executive-primary hover:text-white focus:ring-executive-accent/20': variant === 'outline',
            'text-executive-primary hover:bg-executive-secondary/5 focus:ring-executive-accent/20': variant === 'ghost',
            'bg-executive-error text-white hover:bg-executive-error/90 focus:ring-red-500/20': variant === 'danger',
          },
          
          // Variant styles - Default theme
          !executive && {
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/20': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-blue-500/20': variant === 'secondary',
            'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500/20': variant === 'outline',
            'text-gray-700 hover:bg-gray-100 focus:ring-blue-500/20': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20': variant === 'danger',
          },
          
          className
        )}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'