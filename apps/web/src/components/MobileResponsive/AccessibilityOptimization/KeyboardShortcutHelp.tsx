/**
 * Keyboard Shortcut Help Modal Component
 */

import React from 'react'
import { KeyboardShortcut } from './keyboardNavigationUtils'

interface KeyboardShortcutHelpProps {
  showHelp: boolean
  onClose: () => void
  shortcuts: KeyboardShortcut[]
  currentScope: string
}

export const KeyboardShortcutHelp: React.FC<KeyboardShortcutHelpProps> = ({
  showHelp,
  onClose,
  shortcuts,
  currentScope
}) => {
  if (!showHelp) return null

  return (
    <div className="keyboard-help-overlay" role="dialog" aria-label="Keyboard shortcuts help">
      <div className="help-content">
        <div className="help-header">
          <h2>Keyboard Shortcuts</h2>
          <button onClick={onClose} aria-label="Close keyboard shortcuts help">✕</button>
        </div>
        
        <div className="shortcuts-list">
          <div className="shortcuts-section">
            <h3>Available in {currentScope.toLowerCase()} context:</h3>
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <kbd className="shortcut-key">{shortcut.key}</kbd>
                <span className="shortcut-description">{shortcut.description}</span>
              </div>
            ))}
          </div>
          
          <div className="help-footer">
            <p>Press <kbd>?</kbd> to toggle this help</p>
            <p>Use <kbd>Tab</kbd> and <kbd>Shift+Tab</kbd> to navigate between elements</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .keyboard-help-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .help-content {
          background: white;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .help-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .help-header h2 {
          margin: 0;
          font-weight: 600;
          color: #1e293b;
        }

        .help-header button {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
        }

        .shortcuts-list {
          padding: 1.5rem;
        }

        .shortcuts-section {
          margin-bottom: 2rem;
        }

        .shortcuts-section h3 {
          margin: 0 0 1rem 0;
          font-weight: 500;
          color: #374151;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }

        .shortcut-key {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-family: monospace;
          font-size: 0.875rem;
          min-width: 40px;
          text-align: center;
        }

        .shortcut-description {
          color: #374151;
          font-size: 0.875rem;
        }

        .help-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .help-footer p {
          margin: 0.5rem 0;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .keyboard-help-overlay {
            padding: 0.5rem;
          }
          
          .help-content {
            max-height: 90vh;
          }
          
          .shortcut-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .shortcut-key {
            background: #fff;
            border-color: #000;
            color: #000;
          }
          
          .help-content {
            border: 2px solid #000;
          }
        }
      `}</style>
    </div>
  )
}