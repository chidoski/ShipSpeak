'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import { 
  HelpCircle, 
  BookOpen, 
  PlayCircle, 
  TrendingUp, 
  Users, 
  Lightbulb,
  Target,
  Clock,
  Star
} from 'lucide-react'

// Import our onboarding components
import OnboardingOrchestrator from '../../../../components/onboarding/OnboardingOrchestrator'
import PMToSeniorPMOnboarding from '../../../../components/onboarding/CareerTransitionOnboarding/PMToSeniorPMOnboarding'
import FintechPMTour from '../../../../components/onboarding/IndustrySpecificTours/FintechPMTour'
import HelpSearchInterface from '../../../../components/onboarding/HelpInterface/HelpSearchInterface'
import type { UserProfile, HelpGuide } from '../../../../types/onboarding'

// Mock user profile for demonstration
const mockUserProfile: UserProfile = {
  id: 'user-1',
  currentRole: 'PM',
  targetRole: 'SENIOR_PM',
  industry: 'FINTECH',
  experience: 'INTERMEDIATE',
  careerTransition: 'PM_TO_SENIOR_PM',
  completedOnboarding: false,
  preferences: {
    tourSpeed: 'MEDIUM',
    helpLevel: 'CONTEXTUAL',
    videoPreference: true,
    skipIntros: false
  }
}

// Featured help content
const featuredContent = [
  {
    id: 'getting-started',
    title: 'Getting Started with ShipSpeak',
    description: 'Complete guide to setting up your PM development journey',
    type: 'Guide',
    duration: '5 min',
    popularity: 'Most Popular',
    icon: BookOpen
  },
  {
    id: 'executive-communication',
    title: 'Executive Communication Masterclass',
    description: 'Learn answer-first methodology for Senior PM success',
    type: 'Video Tutorial',
    duration: '12 min',
    popularity: 'Trending',
    icon: PlayCircle
  },
  {
    id: 'career-roadmap',
    title: 'PM → Senior PM Career Roadmap',
    description: 'Step-by-step progression guide with milestone tracking',
    type: 'Interactive Guide',
    duration: '8 min',
    popularity: 'Recommended',
    icon: TrendingUp
  }
]

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showCareerOnboarding, setShowCareerOnboarding] = useState(false)
  const [showIndustryTour, setShowIndustryTour] = useState(false)

  const handleGuideSelect = (guide: HelpGuide) => {
    // In a real implementation, this would navigate to the guide detail page
    console.log('Selected guide:', guide.title)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Help & Guidance</h1>
            <p className="text-muted-foreground">
              Executive development guidance for your {mockUserProfile.careerTransition.replace('_', ' → ')} journey
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowOnboarding(true)}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Start Platform Tour
          </Button>
          <Button variant="outline" onClick={() => setShowCareerOnboarding(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Career Transition Guide
          </Button>
          <Button variant="outline" onClick={() => setShowIndustryTour(true)}>
            <Users className="h-4 w-4 mr-2" />
            Industry-Specific Tour
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guides">Help Guides</TabsTrigger>
          <TabsTrigger value="tours">Interactive Tours</TabsTrigger>
          <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Welcome to ShipSpeak Help Center</h3>
                  <p className="text-muted-foreground mb-4">
                    Get personalized guidance for your PM career development journey. Our help system adapts to your 
                    current role ({mockUserProfile.currentRole}), target role ({mockUserProfile.targetRole}), and 
                    industry context ({mockUserProfile.industry}).
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">PM → Senior PM Focus</Badge>
                    <Badge variant="secondary">{mockUserProfile.industry} Industry</Badge>
                    <Badge variant="secondary">Interactive Guidance</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Content */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredContent.map((content) => {
                const Icon = content.icon
                return (
                  <Card key={content.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{content.title}</h4>
                            <Badge variant="outline" className="text-xs">{content.popularity}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{content.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{content.duration}</span>
                            <span>•</span>
                            <span>{content.type}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quick Start Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Start Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">New to ShipSpeak?</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Complete Platform Overview
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Upload Your First Meeting
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Ready to Advance?</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Start Career Assessment
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Explore Practice Modules
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help Guides Tab */}
        <TabsContent value="guides">
          <HelpSearchInterface
            userCareerTransition={mockUserProfile.careerTransition}
            userIndustry={mockUserProfile.industry}
            onGuideSelect={handleGuideSelect}
          />
        </TabsContent>

        {/* Interactive Tours Tab */}
        <TabsContent value="tours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Tours & Onboarding</CardTitle>
              <p className="text-muted-foreground">
                Guided tours designed specifically for your career transition and industry context
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setShowOnboarding(true)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <PlayCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Platform Tour</h4>
                        <p className="text-sm text-muted-foreground">Complete platform overview</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setShowCareerOnboarding(true)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Career Transition</h4>
                        <p className="text-sm text-muted-foreground">PM → Senior PM guidance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setShowIndustryTour(true)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Fintech PM Tour</h4>
                        <p className="text-sm text-muted-foreground">Industry-specific features</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Video Tutorials Coming Soon</h3>
              <p className="text-muted-foreground">
                Comprehensive video tutorials for executive communication, framework mastery, and industry-specific guidance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showOnboarding && (
        <OnboardingOrchestrator 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          userProfile={mockUserProfile}
        />
      )}

      {showCareerOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto w-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">PM → Senior PM Career Transition Guide</h2>
                <Button variant="ghost" onClick={() => setShowCareerOnboarding(false)}>
                  ×
                </Button>
              </div>
              <PMToSeniorPMOnboarding 
                onComplete={() => setShowCareerOnboarding(false)}
                onSectionComplete={(sectionId) => console.log('Completed section:', sectionId)}
              />
            </div>
          </div>
        </div>
      )}

      {showIndustryTour && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto w-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Fintech PM Communication Tour</h2>
                <Button variant="ghost" onClick={() => setShowIndustryTour(false)}>
                  ×
                </Button>
              </div>
              <FintechPMTour 
                onTourComplete={() => setShowIndustryTour(false)}
                userRole={mockUserProfile.currentRole}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}