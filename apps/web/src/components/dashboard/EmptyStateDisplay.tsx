/**
 * Empty State Display Component for ShipSpeak (Refactored)
 * Simplified component using extracted content generation logic
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { User } from '@/types/auth'
import { getEmptyStateContent } from '@/lib/emptyStateContent'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface EmptyStateDisplayProps {
  type: 'no_meetings' | 'new_user' | 'practice_first' | 'meeting_analysis'
  user: User | null
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const EmptyStateDisplay: React.FC<EmptyStateDisplayProps> = ({
  type,
  user
}) => {
  const content = getEmptyStateContent(type, user)

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderCTA = (cta: any) => {
    const buttonClasses = {
      primary: 'cta-primary',
      secondary: 'cta-secondary', 
      tertiary: 'cta-tertiary'
    }

    return (
      <Link
        key={cta.id}
        href={cta.href}
        className={`cta-button ${buttonClasses[cta.type]}`}
        data-testid={`cta-${cta.id}`}
      >
        <span className="cta-icon">{cta.icon}</span>
        <span className="cta-text">{cta.text}</span>
      </Link>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      data-testid={`empty-state-${type}`}
      className="empty-state"
    >
      <div className="empty-state-content">
        <div className="empty-state-visual">
          {content.visual}
        </div>
        
        <div className="empty-state-text">
          <h2 className="empty-state-headline">
            {content.headline}
          </h2>
          <p className="empty-state-subtext">
            {content.subtext}
          </p>
        </div>
        
        <div className="empty-state-actions">
          {content.ctas.map(renderCTA)}
        </div>
      </div>
      
      <style jsx>{`
        .empty-state {
          background: white;
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #f0f0f0;
        }
        
        .empty-state-content {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
        }
        
        .empty-state-visual {
          font-size: 4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }
        
        .empty-state-text {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .empty-state-headline {
          font-size: 2rem;
          font-weight: bold;
          color: #1F2937;
          margin: 0;
          line-height: 1.2;
        }
        
        .empty-state-subtext {
          font-size: 1.125rem;
          color: #6B7280;
          margin: 0;
          line-height: 1.5;
        }
        
        .empty-state-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 400px;
        }
        
        .cta-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          justify-content: center;
        }
        
        .cta-primary {
          background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          color: white;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
        }
        
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
        }
        
        .cta-secondary {
          background: white;
          color: #3B82F6;
          border: 2px solid #3B82F6;
        }
        
        .cta-secondary:hover {
          background: #3B82F6;
          color: white;
          transform: translateY(-1px);
        }
        
        .cta-tertiary {
          background: #F8FAFC;
          color: #64748B;
          border: 1px solid #E2E8F0;
        }
        
        .cta-tertiary:hover {
          background: #F1F5F9;
          color: #475569;
          border-color: #CBD5E1;
        }
        
        .cta-icon {
          font-size: 1.125rem;
        }
        
        .cta-text {
          font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
          .empty-state {
            padding: 2rem 1.5rem;
          }
          
          .empty-state-content {
            gap: 1.5rem;
          }
          
          .empty-state-visual {
            font-size: 3rem;
            width: 5rem;
            height: 5rem;
          }
          
          .empty-state-headline {
            font-size: 1.5rem;
          }
          
          .empty-state-subtext {
            font-size: 1rem;
          }
          
          .cta-button {
            padding: 0.875rem 1.25rem;
          }
        }
        
        @media (max-width: 480px) {
          .empty-state {
            padding: 1.5rem 1rem;
          }
          
          .empty-state-headline {
            font-size: 1.25rem;
          }
          
          .empty-state-subtext {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}