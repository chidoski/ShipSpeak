'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Navigation, getNavigationItems } from '@/components/ui/Navigation'
import { RadarChart } from '@/components/competency/RadarChart'
import { CompetencyCard } from '@/components/competency/CompetencyCard'
import { PMCareerLevel, CompetencyRadarData, PMCompetency } from '@/types/competency'

export default function HomePage() {
  const [userLevel] = useState<PMCareerLevel>('pm')
  const [executiveMode, setExecutiveMode] = useState(false)
  
  // Sample competency data for demonstration
  const sampleRadarData: CompetencyRadarData = {
    productSense: 75,
    communication: 60,
    stakeholder: 80,
    technical: 55,
    business: 70
  }

  const sampleCompetency: PMCompetency = {
    id: 'comm-1',
    name: 'Executive Communication',
    description: 'Clear, concise communication for C-suite and board presentations',
    score: 60,
    level: 'practice',
    category: 'communication',
    lastUpdated: new Date(),
    trend: 'improving',
    benchmarks: [
      {
        level: 'practice',
        minScore: 40,
        description: 'Delivers structured presentations with clear key points',
        examples: ['Answer-first structure', 'Executive summary inclusion', 'Clear recommendations']
      }
    ]
  }

  return (
    <div className="min-h-screen bg-executive-background">
      {/* Navigation */}
      <Navigation
        items={getNavigationItems(userLevel)}
        currentPath="/"
        userLevel={userLevel}
        executiveMode={executiveMode}
      />

      {/* Hero Section */}
      <div className="container-executive py-16">
        <div className="text-center space-y-6">
          <h1 className="heading-executive-1">
            ShipSpeak Foundation Architecture
          </h1>
          <p className="heading-executive-3 text-executive-text-secondary max-w-3xl mx-auto">
            Complete design system supporting PM career progression from tactical skills through executive mastery
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="primary" 
              size="lg" 
              executive={executiveMode}
            >
              Start Development Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              executive={executiveMode}
              onClick={() => setExecutiveMode(!executiveMode)}
            >
              Toggle Executive Mode
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="container-executive pb-16">
        <div className="grid-executive-cards">
          {/* Competency Radar Chart */}
          <Card variant={executiveMode ? 'executive' : 'default'} className="lg:col-span-2">
            <CardHeader>
              <CardTitle>5-Point PM Competency Framework</CardTitle>
              <p className="text-sm text-executive-text-secondary">
                Real-time competency tracking with no ceiling philosophy
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <RadarChart 
                  data={sampleRadarData}
                  executive={executiveMode}
                  interactive={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Individual Competency Card */}
          <Card variant={executiveMode ? 'executive' : 'competency'}>
            <CardContent className="p-0">
              <CompetencyCard 
                competency={sampleCompetency}
                executive={executiveMode}
              />
            </CardContent>
          </Card>

          {/* Executive Features Card */}
          <Card variant={executiveMode ? 'executive' : 'default'}>
            <CardHeader>
              <CardTitle>Executive Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Board Presentations</span>
                  <div className="w-3 h-3 rounded-full bg-executive-success"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Crisis Communication</span>
                  <div className="w-3 h-3 rounded-full bg-executive-warning"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Speaking Engagements</span>
                  <div className="w-3 h-3 rounded-full bg-executive-accent"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Themes Card */}
          <Card variant={executiveMode ? 'executive' : 'default'}>
            <CardHeader>
              <CardTitle>Industry Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-healthcare-primary"></div>
                  <span className="text-xs">Healthcare</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-cybersecurity-primary"></div>
                  <span className="text-xs">Cybersecurity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-fintech-primary"></div>
                  <span className="text-xs">Fintech</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-enterprise-primary"></div>
                  <span className="text-xs">Enterprise</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Feedback System Card */}
          <Card variant={executiveMode ? 'executive' : 'default'}>
            <CardHeader>
              <CardTitle>Smart Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Template Feedback</span>
                  <span className="text-emerald-600 font-medium">$0.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Pattern Analysis</span>
                  <span className="text-amber-600 font-medium">$0.05</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Full AI Analysis</span>
                  <span className="text-blue-600 font-medium">$0.10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Implementation Checklist */}
      <div className="container-executive pb-16">
        <Card variant={executiveMode ? 'executive' : 'default'}>
          <CardHeader>
            <CardTitle>Foundation Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-executive-primary">Core Architecture</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Next.js 14 App Router</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>TypeScript Configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Tailwind CSS + Executive Theme</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-executive-primary">Design System</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>5-Point Radar Chart</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Executive Typography</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Industry Theme Variations</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-executive-primary">Framework Integration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>PM Career Progression</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Competency Visualization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Executive Features UI</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-executive-primary">Quality & Polish</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>WCAG 2.1 AA Compliance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Mobile Responsive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-executive-success"></div>
                    <span>Performance Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}