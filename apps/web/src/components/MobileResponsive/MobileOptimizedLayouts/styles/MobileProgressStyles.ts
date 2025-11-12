/**
 * Mobile Progress Tracking Styles
 * ShipSpeak - Centralized styles for mobile progress components
 */

export const mobileProgressStyles = `
  .mobile-progress-tracking {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    overflow: hidden;
  }

  .progress-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .view-tabs {
    display: flex;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 0;
    margin: 0;
    overflow-x: auto;
  }

  .view-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1rem 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    min-height: 44px;
    font-size: 0.875rem;
    color: #64748b;
  }

  .view-tab:hover,
  .view-tab:focus {
    background: #f8fafc;
    color: #334155;
  }

  .view-tab:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .view-tab.active {
    color: #3b82f6;
    font-weight: 600;
  }

  .view-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #3b82f6;
    border-radius: 1.5px 1.5px 0 0;
  }

  .tab-icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  .tab-label {
    font-size: 0.75rem;
    font-weight: inherit;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .view-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .swipe-indicator {
    background: white;
    border-top: 1px solid #e2e8f0;
    padding: 0.75rem;
    text-align: center;
  }

  .swipe-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #cbd5e1;
    transition: all 0.3s ease;
  }

  .dot.active {
    background: #3b82f6;
    transform: scale(1.25);
  }

  .swipe-hint {
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 500;
  }

  .compact-summary {
    background: white;
    border-top: 1px solid #e2e8f0;
    padding: 1rem;
  }

  .summary-stats {
    display: flex;
    justify-content: space-around;
  }

  .stat {
    text-align: center;
  }

  .stat .value {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .stat .label {
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  @media (max-width: 640px) {
    .view-tab {
      min-height: 48px;
      padding: 0.75rem 0.5rem;
    }
    
    .tab-label {
      font-size: 0.6875rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .view-tab,
    .dot {
      transition: none;
    }
  }

  @media (prefers-contrast: high) {
    .view-tabs {
      border-bottom-width: 2px;
    }
    
    .view-tab.active::after {
      height: 4px;
    }
    
    .dot {
      border: 1px solid currentColor;
    }
  }
`