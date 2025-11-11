import Link from 'next/link'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { PMCareerLevel } from '@/types/competency'

interface NavigationItem {
  href: string
  label: string
  icon?: ReactNode
  badge?: string | number
  requiredLevel?: PMCareerLevel[]
  executive?: boolean
}

interface NavigationProps {
  items: NavigationItem[]
  currentPath: string
  userLevel: PMCareerLevel
  executiveMode?: boolean
  onItemClick?: (item: NavigationItem) => void
}

export function Navigation({ 
  items, 
  currentPath, 
  userLevel, 
  executiveMode = false,
  onItemClick 
}: NavigationProps) {
  const filteredItems = items.filter(item => {
    if (!item.requiredLevel) return true
    return item.requiredLevel.includes(userLevel)
  })

  return (
    <nav className={clsx(
      'nav-executive',
      executiveMode && 'bg-executive-primary text-white'
    )}>
      <div className="container-executive">
        <div className="flex items-center space-x-1">
          {filteredItems.map((item) => {
            const isActive = currentPath === item.href || 
                           (item.href !== '/' && currentPath.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'nav-item-executive',
                  isActive && 'nav-item-active',
                  executiveMode && {
                    'text-white/70 hover:text-white hover:bg-white/10': !isActive,
                    'text-white bg-white/20': isActive
                  },
                  item.executive && 'font-semibold'
                )}
                onClick={() => onItemClick?.(item)}
              >
                <div className="flex items-center space-x-2">
                  {item.icon && (
                    <span className="w-5 h-5">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={clsx(
                      'px-2 py-0.5 text-xs rounded-full',
                      executiveMode 
                        ? 'bg-white/20 text-white' 
                        : 'bg-executive-accent/20 text-executive-accent'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

// Predefined navigation sets for different PM levels
export const getNavigationItems = (userLevel: PMCareerLevel): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    { href: '/dashboard', label: 'Dashboard', requiredLevel: ['po', 'pm', 'senior-pm', 'group-pm', 'director', 'executive'] },
    { href: '/meetings', label: 'Meetings', requiredLevel: ['po', 'pm', 'senior-pm', 'group-pm', 'director', 'executive'] },
    { href: '/coaching', label: 'Executive Coaching', requiredLevel: ['po', 'pm', 'senior-pm', 'group-pm', 'director', 'executive'] },
    { href: '/practice', label: 'Practice', requiredLevel: ['po', 'pm', 'senior-pm', 'group-pm', 'director', 'executive'] },
    { href: '/progress', label: 'Progress', requiredLevel: ['po', 'pm', 'senior-pm', 'group-pm', 'director', 'executive'] },
  ]

  const executiveItems: NavigationItem[] = [
    { href: '/board-presentations', label: 'Board Presentations', requiredLevel: ['group-pm', 'director', 'executive'], executive: true },
    { href: '/speaking-engagements', label: 'Speaking', requiredLevel: ['director', 'executive'], executive: true },
    { href: '/crisis-communication', label: 'Crisis Comm', requiredLevel: ['group-pm', 'director', 'executive'], executive: true },
  ]

  // Add executive items for qualified levels
  if (['group-pm', 'director', 'executive'].includes(userLevel)) {
    return [...baseItems, ...executiveItems]
  }

  return baseItems
}