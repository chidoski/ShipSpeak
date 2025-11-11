/**
 * Microsoft Teams Integration Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Teams app integration with enterprise compliance
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

interface TeamsIntegrationProps {
  onStartCapture: () => void
  isCapturing: boolean
}

export function TeamsIntegration({ onStartCapture, isCapturing }: TeamsIntegrationProps) {
  const [appInstalled, setAppInstalled] = useState(false)
  const [adminApproval, setAdminApproval] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState('')
  
  const teams = [
    { id: 'product-team', name: 'Product Team', members: 12 },
    { id: 'executive-team', name: 'Executive Team', members: 6 },
    { id: 'engineering-team', name: 'Engineering Team', members: 24 }
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Microsoft Teams Integration</h3>
      
      <div className="space-y-4">
        {/* App Installation */}
        <div className={`p-4 rounded-lg border-2 ${
          appInstalled ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                appInstalled ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="font-medium">Teams App</span>
            </div>
            
            {!appInstalled ? (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setAppInstalled(true)}
              >
                Install App
              </Button>
            ) : (
              <span className="text-green-600 text-sm">✓ Installed</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Install ShipSpeak app in your Teams organization
          </p>
        </div>

        {/* Admin Approval */}
        <div className={`p-4 rounded-lg border-2 ${
          adminApproval ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                adminApproval ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="font-medium">Admin Approval</span>
            </div>
            
            {!adminApproval ? (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setAdminApproval(true)}
              >
                Request Approval
              </Button>
            ) : (
              <span className="text-green-600 text-sm">✓ Approved</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Admin approval required for recording permissions
          </p>
        </div>

        {/* Team Selection */}
        {appInstalled && adminApproval && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Choose a team...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.members} members)
                  </option>
                ))}
              </select>
            </div>

            {/* Enterprise Settings */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3">Enterprise Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="text-purple-600" />
                  <span className="text-sm text-purple-800">Compliance recording</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="text-purple-600" />
                  <span className="text-sm text-purple-800">Data retention controls</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="text-purple-600" />
                  <span className="text-sm text-purple-800">Executive priority analysis</span>
                </label>
              </div>
            </div>

            {/* Deploy Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={onStartCapture}
                disabled={!selectedTeam || isCapturing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isCapturing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deploying...
                  </span>
                ) : (
                  'Deploy Teams Bot'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}