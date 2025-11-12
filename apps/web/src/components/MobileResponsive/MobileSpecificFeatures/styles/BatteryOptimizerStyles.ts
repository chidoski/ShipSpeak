/**
 * Battery Optimizer Styles
 * ShipSpeak - Centralized styles for battery optimization components
 */

export const batteryOptimizerStyles = `
  .mobile-battery-optimizer {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .battery-status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(248, 250, 252, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e7eb;
    z-index: 1000;
    min-height: 44px;
  }

  .optimize-button {
    padding: 0.5rem 1rem;
    background: #f59e0b;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
    font-size: 0.875rem;
  }

  .optimize-button:hover,
  .optimize-button:focus {
    background: #d97706;
  }

  .critical-battery-warning {
    position: fixed;
    top: 60px;
    left: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #fef2f2;
    border: 2px solid #dc2626;
    border-radius: 8px;
    color: #dc2626;
    font-weight: 500;
    font-size: 0.875rem;
    z-index: 999;
    animation: pulse-warning 2s ease-in-out infinite;
  }

  @keyframes pulse-warning {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .optimization-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1001;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .panel-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover,
  .close-button:focus {
    background: #f1f5f9;
  }

  .optimization-modes {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .mode-option {
    padding: 1rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .mode-option:hover,
  .mode-option:focus {
    border-color: #3b82f6;
  }

  .mode-option.active {
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  .mode-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .mode-icon {
    font-size: 1.25rem;
  }

  .mode-name {
    font-weight: 600;
    color: #1e293b;
    text-transform: capitalize;
  }

  .mode-description {
    color: #64748b;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .battery-optimized-content {
    padding-top: 80px;
  }

  .battery-optimized-content.ultra_saver {
    filter: contrast(1.2) brightness(0.9);
  }

  .battery-optimized-content.battery_saver {
    filter: brightness(0.95);
  }

  @media (max-width: 640px) {
    .optimization-panel {
      padding: 1rem;
      max-width: 95vw;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .critical-battery-warning {
      animation: none;
    }
  }
`