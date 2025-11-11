/**
 * Milestone Card Component for ShipSpeak
 * Individual milestone display with progress tracking
 * Max 150 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { ProgressCircle } from './ProgressCircle'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface MilestoneData {
  id: string
  title: string
  description: string
  completed: boolean
  progress: number
  category: string
}

interface MilestoneCardProps {
  milestone: MilestoneData
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const categoryIcons: Record<string, string> = {
    communication: '💬',
    engagement: '🔥',
    knowledge: '📚',
    leadership: '👑'
  }

  const categoryColors: Record<string, string> = {
    communication: '#3B82F6',
    engagement: '#F59E0B',
    knowledge: '#10B981',
    leadership: '#8B5CF6'
  }

  return (
    <div
      data-testid={`milestone-${milestone.id}`}
      className={`milestone ${milestone.completed ? 'completed' : ''}`}
    >
      <div className="milestone-header">
        <div
          className="milestone-icon"
          style={{ backgroundColor: categoryColors[milestone.category] }}
        >
          {categoryIcons[milestone.category]}
        </div>
        <div className="milestone-info">
          <h3 className="milestone-title">{milestone.title}</h3>
          <p className="milestone-description">{milestone.description}</p>
        </div>
        <div className="milestone-progress">
          <ProgressCircle progress={milestone.progress} size={50} />
        </div>
      </div>
      
      {milestone.completed && (
        <div className="milestone-badge">
          <span className="badge-icon">✓</span>
          <span className="badge-text">Completed</span>
        </div>
      )}
      
      <style jsx>{`
        .milestone {
          background: #F9FAFB;
          border-radius: 0.75rem;
          padding: 1.25rem;
          border: 1px solid #E5E7EB;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .milestone.completed {
          background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
          border-color: #10B981;
        }
        
        .milestone:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .milestone-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .milestone-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.125rem;
          flex-shrink: 0;
        }
        
        .milestone-info {
          flex: 1;
        }
        
        .milestone-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1F2937;
          margin: 0 0 0.25rem 0;
        }
        
        .milestone-description {
          font-size: 0.875rem;
          color: #6B7280;
          margin: 0;
          line-height: 1.4;
        }
        
        .milestone-progress {
          flex-shrink: 0;
        }
        
        .milestone-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: white;
          border-radius: 2rem;
          border: 1px solid #10B981;
          color: #10B981;
          font-size: 0.875rem;
          font-weight: 500;
          width: fit-content;
        }
        
        .badge-icon {
          font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
          .milestone {
            padding: 1rem;
          }
          
          .milestone-header {
            gap: 0.75rem;
          }
          
          .milestone-icon {
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}