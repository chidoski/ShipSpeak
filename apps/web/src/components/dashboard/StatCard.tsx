/**
 * Stat Card Component for ShipSpeak
 * Individual metric card with trend indicators
 * Max 150 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { QuickStatCard } from '@/types/dashboard'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface StatCardProps {
  stat: QuickStatCard
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderTrendIndicator = (trend: 'up' | 'down' | 'stable', value: number) => {
    const trendConfig = {
      up: { icon: '↗', color: '#10B981', prefix: '+' },
      down: { icon: '↘', color: '#EF4444', prefix: '-' },
      stable: { icon: '→', color: '#6B7280', prefix: '' }
    }

    const config = trendConfig[trend]
    
    return (
      <span 
        className="trend-indicator"
        style={{ color: config.color }}
      >
        <span className="trend-icon">{config.icon}</span>
        <span className="trend-value">{config.prefix}{value}</span>
      </span>
    )
  }

  const colorClasses = {
    blue: 'stat-card-blue',
    green: 'stat-card-green',
    purple: 'stat-card-purple',
    orange: 'stat-card-orange'
  }

  return (
    <div
      data-testid={`stat-card-${stat.id}`}
      className={`stat-card ${colorClasses[stat.color]}`}
    >
      <div className="stat-header">
        <span className="stat-icon">{stat.icon}</span>
        <h3 className="stat-title">{stat.title}</h3>
      </div>
      
      <div className="stat-content">
        <div className="stat-value-row">
          <span className="stat-value">{stat.value}</span>
          {renderTrendIndicator(stat.trend, stat.trendValue)}
        </div>
        <p className="stat-description">{stat.description}</p>
      </div>

      <style jsx>{`
        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-color);
        }
        
        .stat-card-blue { --accent-color: #3B82F6; }
        .stat-card-green { --accent-color: #10B981; }
        .stat-card-purple { --accent-color: #8B5CF6; }
        .stat-card-orange { --accent-color: #F59E0B; }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .stat-icon {
          font-size: 1.5rem;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-color)aa);
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          color: white;
        }
        
        .stat-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .stat-value-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #1F2937;
          line-height: 1;
        }
        
        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .trend-icon {
          font-size: 1rem;
        }
        
        .stat-description {
          font-size: 0.875rem;
          color: #6B7280;
          margin: 0;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .stat-card {
            padding: 1.25rem;
          }
          
          .stat-value {
            font-size: 1.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .stat-card {
            padding: 1rem;
          }
          
          .stat-header {
            gap: 0.5rem;
          }
          
          .stat-icon {
            width: 2rem;
            height: 2rem;
            font-size: 1.25rem;
          }
          
          .stat-value {
            font-size: 1.5rem;
          }
          
          .stat-description {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}