/**
 * Executive Features Component
 * ShipSpeak Slice 4: Meeting Archive & Intelligent Pattern Recognition
 * Board meeting security, crisis capture, speaking engagement features
 */

'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

interface ExecutiveFeaturesProps {
  userId: string
}

export function ExecutiveFeatures({ userId }: ExecutiveFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const executiveFeatures = [
    {
      id: 'board-security',
      title: 'Board Meeting Security',
      icon: '🏛️',
      description: 'Enhanced privacy protocols for board presentations',
      features: [
        'Executive consent workflows',
        'Confidential meeting handling', 
        'Investor communication protection',
        'Enhanced encryption standards'
      ],
      status: 'Available'
    },
    {
      id: 'crisis-communication',
      title: 'Crisis Communication Capture',
      icon: '🚨',
      description: 'Emergency meeting recording and analysis',
      features: [
        'Emergency meeting detection',
        'Incident response documentation',
        'Stakeholder communication tracking',
        'Real-time sentiment analysis'
      ],
      status: 'Ready'
    },
    {
      id: 'speaking-engagement',
      title: 'Speaking Engagement Recording',
      icon: '🎤',
      description: 'Conference and external presentation capture',
      features: [
        'Conference presentation recording',
        'External meeting documentation',
        'Thought leadership analysis',
        'Industry event integration'
      ],
      status: 'Configured'
    }
  ]

  return (
    <Card className="p-6 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-purple-900">Executive Features</h3>
          <p className="text-purple-700">Advanced capabilities for executive-level meetings</p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Executive Tier
        </div>
      </div>

      <div className="space-y-4">
        {executiveFeatures.map((feature) => (
          <div
            key={feature.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              activeFeature === feature.id
                ? 'border-purple-300 bg-white shadow-md'
                : 'border-purple-100 bg-white/50 hover:border-purple-200'
            }`}
            onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className="font-semibold text-purple-900">{feature.title}</h4>
                  <p className="text-sm text-purple-700">{feature.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {feature.status}
                </span>
                <span className={`transform transition-transform ${
                  activeFeature === feature.id ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {activeFeature === feature.id && (
              <div className="mt-4 pt-4 border-t border-purple-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-purple-900 mb-2">Key Features</h5>
                    <ul className="space-y-1">
                      {feature.features.map((feat, index) => (
                        <li key={index} className="text-sm text-purple-700 flex items-center">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.id === 'board-security' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <div className="text-sm font-medium text-red-900">Security Notice</div>
                        <div className="text-xs text-red-700 mt-1">
                          Board meetings require enhanced security protocols
                        </div>
                      </div>
                    )}
                    
                    {feature.id === 'crisis-communication' && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                        <div className="text-sm font-medium text-orange-900">Emergency Mode</div>
                        <div className="text-xs text-orange-700 mt-1">
                          Automatically triggers for crisis keywords
                        </div>
                      </div>
                    )}
                    
                    {feature.id === 'speaking-engagement' && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-sm font-medium text-blue-900">Public Speaking</div>
                        <div className="text-xs text-blue-700 mt-1">
                          Optimized for external audience analysis
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      Configure {feature.title}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Executive Benefits Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Executive Tier Benefits</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="text-center">
            <div className="text-purple-600 font-semibold">∞</div>
            <div className="text-purple-800">AI Budget</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-semibold">365</div>
            <div className="text-purple-800">Day Retention</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-semibold">24/7</div>
            <div className="text-purple-800">Priority Support</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-semibold">🔒</div>
            <div className="text-purple-800">Max Security</div>
          </div>
        </div>
      </div>
    </Card>
  )
}