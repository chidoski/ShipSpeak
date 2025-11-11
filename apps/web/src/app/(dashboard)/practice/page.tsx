"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useRouter } from 'next/navigation'
import { Mic, Play, TrendingUp, Target, Clock, Star } from 'lucide-react'

export default function PracticePage() {
  const router = useRouter()

  const practiceFeatures = [
    {
      icon: <Mic className="h-8 w-8 text-blue-600" />,
      title: 'Practice Recording',
      description: 'Executive-grade recording with real-time coaching for PM communication development',
      features: [
        'Real-time coaching hints',
        'PM framework guidance',
        'Career transition optimization',
        'Audio quality monitoring'
      ],
      action: () => router.push('/practice/recording'),
      buttonText: 'Start Recording Session',
      recommended: true
    },
    {
      icon: <Play className="h-8 w-8 text-green-600" />,
      title: 'Interactive Scenarios',
      description: 'Practice PM communication scenarios with AI-powered stakeholder simulation',
      features: [
        'Board presentation practice',
        'Stakeholder update simulation',
        'Planning session facilitation',
        'Framework application exercises'
      ],
      action: () => router.push('/modules'),
      buttonText: 'Browse Scenarios',
      recommended: false
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your PM communication development and career advancement progress',
      features: [
        'Communication pattern analysis',
        'Framework usage tracking',
        'Career readiness assessment',
        'Executive presence scoring'
      ],
      action: () => router.push('/progress'),
      buttonText: 'View Progress',
      recommended: false
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Hub</h1>
        <p className="text-lg text-gray-600">
          Develop your PM communication skills with AI-powered practice tools
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Practice Sessions</p>
                <p className="text-2xl font-bold text-blue-900">12</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Hours Practiced</p>
                <p className="text-2xl font-bold text-green-900">8.5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Skill Level</p>
                <p className="text-2xl font-bold text-purple-900">Advanced</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {practiceFeatures.map((feature, index) => (
          <Card 
            key={index} 
            className={`relative transition-all hover:shadow-lg ${
              feature.recommended ? 'border-blue-300 bg-blue-50/30' : ''
            }`}
          >
            {feature.recommended && (
              <div className="absolute -top-3 left-4">
                <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3" />
                  Recommended
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center gap-4">
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600">{feature.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">Features:</p>
                <ul className="space-y-1">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                onClick={feature.action}
                className={`w-full ${
                  feature.recommended 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : ''
                }`}
              >
                {feature.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Practice Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: 'Board Presentation',
                date: '2 hours ago',
                duration: '3m 15s',
                score: 85,
                improvement: '+12%'
              },
              {
                type: 'Stakeholder Update',
                date: 'Yesterday',
                duration: '5m 02s', 
                score: 78,
                improvement: '+8%'
              },
              {
                type: 'Framework Practice',
                date: '3 days ago',
                duration: '4m 30s',
                score: 82,
                improvement: '+15%'
              }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mic className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{session.type}</p>
                    <p className="text-sm text-gray-600">{session.date} • {session.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{session.score}%</span>
                    <span className="text-sm text-green-600 font-medium">{session.improvement}</span>
                  </div>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button variant="outline">View All Sessions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}