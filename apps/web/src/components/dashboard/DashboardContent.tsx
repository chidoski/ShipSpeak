/**
 * Dashboard Content Component for ShipSpeak
 * Career-intelligent hub with PM-specific metrics and sophisticated empty states
 * Max 300 lines for efficiency and maintainability
 */

'use client'

import React from 'react'
import { DashboardHeader } from './DashboardHeader'
import { QuickStatsCards } from './QuickStatsCards'
import { MainContentArea } from './MainContentArea'
import { useDashboard } from '@/hooks/useDashboard'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface DashboardContentProps {
  className?: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DashboardContent: React.FC<DashboardContentProps> = ({
  className = ''
}) => {
  const {
    user,
    progressData,
    learningData,
    isLoading,
    hasContent,
    refreshData
  } = useDashboard()

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (isLoading) {
    return (
      <div 
        data-testid="dashboard-loading"
        className={`dashboard-content loading ${className}`}
      >
        <div className="loading-header">
          <div className="skeleton skeleton-header" />
          <div className="skeleton skeleton-subtitle" />
        </div>
        
        <div className="loading-stats">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
        
        <div className="loading-content">
          <div className="skeleton skeleton-main" />
        </div>
        
        <style jsx>{`
          .dashboard-content.loading {
            padding: 2rem 0;
            max-width: 1200px;
          }
          
          .loading-header {
            margin-bottom: 2rem;
          }
          
          .loading-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 0.5rem;
          }
          
          .skeleton-header {
            height: 2rem;
            width: 60%;
            margin-bottom: 0.5rem;
          }
          
          .skeleton-subtitle {
            height: 1rem;
            width: 40%;
          }
          
          .skeleton-card {
            height: 150px;
          }
          
          .skeleton-main {
            height: 400px;
            width: 100%;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div 
      data-testid="dashboard-content"
      className={`dashboard-content ${className}`}
    >
      <DashboardHeader 
        user={user}
        progressData={progressData}
        onRefresh={refreshData}
      />
      
      <QuickStatsCards 
        user={user}
        progressData={progressData}
        learningData={learningData}
      />
      
      <MainContentArea 
        user={user}
        hasContent={hasContent}
        learningData={learningData}
      />
      
      <style jsx>{`
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
        }
        
        .dashboard-content > * + * {
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 0 0.5rem;
          }
          
          .dashboard-content > * + * {
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}