'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Presentation, Calendar, Users, MessageSquare } from 'lucide-react'
import { UserPreferences, MeetingTypePreferences } from '@/types/settings-preferences'

interface MeetingTypeCustomizationProps {
  preferences: UserPreferences
  userProfile?: any
  onPreferenceChange: (updates: Partial<UserPreferences>) => void
  intelligentDefaults: any
}

export function MeetingTypeCustomization({
  preferences,
  userProfile,
  onPreferenceChange,
  intelligentDefaults
}: MeetingTypeCustomizationProps) {
  const [activeTab, setActiveTab] = useState('board')

  const meetingTypes = [
    {
      id: 'board',
      title: 'Board Presentations',
      description: 'Executive presentations to board members and senior leadership',
      icon: Presentation,
      importance: 'Critical for advancement'
    },
    {
      id: 'planning',
      title: 'Planning Sessions', 
      description: 'Strategic planning and roadmap discussions',
      icon: Calendar,
      importance: 'Essential for PM role'
    },
    {
      id: 'stakeholder',
      title: 'Stakeholder Updates',
      description: 'Regular updates to various stakeholder groups',
      icon: Users,
      importance: 'Frequent requirement'
    },
    {
      id: 'coaching',
      title: 'Coaching Sessions',
      description: 'AI coaching and practice session preferences',
      icon: MessageSquare,
      importance: 'Development focused'
    }
  ]

  const handleMeetingPreferenceChange = (
    meetingType: keyof MeetingTypePreferences, 
    updates: any
  ) => {
    onPreferenceChange({
      meetingTypePreferences: {
        ...preferences.meetingTypePreferences,
        [meetingType]: {
          ...preferences.meetingTypePreferences[meetingType],
          ...updates
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Meeting Type Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Presentation className="h-5 w-5 text-blue-600" />
            Meeting Type Customization
          </CardTitle>
          <CardDescription>
            Configure communication preferences for different meeting contexts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {meetingTypes.map(type => {
              const IconComponent = type.icon
              return (
                <div key={type.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium text-sm">{type.title}</p>
                  <p className="text-xs text-muted-foreground">{type.importance}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Meeting Preferences */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full grid-cols-4">
                {meetingTypes.map(type => {
                  const IconComponent = type.icon
                  return (
                    <TabsTrigger 
                      key={type.id}
                      value={type.id}
                      className="flex items-center gap-2 text-xs lg:text-sm"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{type.title.split(' ')[0]}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {/* Board Presentations */}
            <TabsContent value="board" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Board Presentation Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Presentation Style</label>
                    <Select 
                      value={preferences.meetingTypePreferences.boardPresentation.presentationStyle}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('boardPresentation', { presentationStyle: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FORMAL">Formal - Traditional board format</SelectItem>
                        <SelectItem value="CONVERSATIONAL">Conversational - Discussion-based</SelectItem>
                        <SelectItem value="HYBRID">Hybrid - Mix of formal and conversational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Management</label>
                    <Select 
                      value={preferences.meetingTypePreferences.boardPresentation.timeManagement}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('boardPresentation', { timeManagement: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STRICT">Strict - Adhere to timeline</SelectItem>
                        <SelectItem value="FLEXIBLE">Flexible - Adapt as needed</SelectItem>
                        <SelectItem value="QUESTION_DRIVEN">Question-driven - Follow discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Content Focus</label>
                    <Select 
                      value={preferences.meetingTypePreferences.boardPresentation.contentFocus}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('boardPresentation', { contentFocus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="METRICS_HEAVY">Metrics-heavy - Data focused</SelectItem>
                        <SelectItem value="NARRATIVE_DRIVEN">Narrative - Story driven</SelectItem>
                        <SelectItem value="BALANCED">Balanced - Mix of data and story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Confidence Building</label>
                    <Select 
                      value={preferences.meetingTypePreferences.boardPresentation.confidenceBuilding}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('boardPresentation', { confidenceBuilding: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GRADUAL">Gradual - Build confidence slowly</SelectItem>
                        <SelectItem value="INTENSIVE">Intensive - Rapid skill building</SelectItem>
                        <SelectItem value="PRESSURE_SIMULATION">Pressure simulation - High stakes practice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Planning Sessions */}
            <TabsContent value="planning" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Planning Session Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Strategic Depth</label>
                    <Select 
                      value={preferences.meetingTypePreferences.planningSession.strategicDepth}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('planningSession', { strategicDepth: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH_LEVEL">High-level - Strategic overview</SelectItem>
                        <SelectItem value="DETAILED">Detailed - Comprehensive planning</SelectItem>
                        <SelectItem value="TACTICAL">Tactical - Implementation focused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Collaboration Style</label>
                    <Select 
                      value={preferences.meetingTypePreferences.planningSession.collaborationStyle}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('planningSession', { collaborationStyle: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FACILITATION">Facilitation - Guide discussion</SelectItem>
                        <SelectItem value="PRESENTATION">Presentation - Present plans</SelectItem>
                        <SelectItem value="DISCUSSION_LEADERSHIP">Discussion leadership - Lead conversation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Timeline Communication</label>
                    <Select 
                      value={preferences.meetingTypePreferences.planningSession.timelineCommunication}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('planningSession', { timelineCommunication: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONSERVATIVE">Conservative - Add buffer time</SelectItem>
                        <SelectItem value="AGGRESSIVE">Aggressive - Optimistic timelines</SelectItem>
                        <SelectItem value="REALISTIC">Realistic - Balanced approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Stakeholder Management</label>
                    <Select 
                      value={preferences.meetingTypePreferences.planningSession.stakeholderManagement}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('planningSession', { stakeholderManagement: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONSENSUS_BUILDING">Consensus building - Seek agreement</SelectItem>
                        <SelectItem value="DECISION_DRIVING">Decision driving - Push for decisions</SelectItem>
                        <SelectItem value="COMPROMISE_FACILITATION">Compromise facilitation - Find middle ground</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Stakeholder Updates */}
            <TabsContent value="stakeholder" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Stakeholder Update Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Communication Style</label>
                    <Select 
                      value={preferences.meetingTypePreferences.stakeholderUpdate.communicationStyle}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('stakeholderUpdate', { communicationStyle: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FORMAL">Formal - Structured reporting</SelectItem>
                        <SelectItem value="CONVERSATIONAL">Conversational - Informal updates</SelectItem>
                        <SelectItem value="INTERACTIVE">Interactive - Discussion based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Detail Level</label>
                    <Select 
                      value={preferences.meetingTypePreferences.stakeholderUpdate.detailLevel}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('stakeholderUpdate', { detailLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXECUTIVE_SUMMARY">Executive summary - High level</SelectItem>
                        <SelectItem value="COMPREHENSIVE">Comprehensive - Detailed analysis</SelectItem>
                        <SelectItem value="AUDIENCE_ADAPTIVE">Audience adaptive - Adjust based on audience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Problem Communication</label>
                    <Select 
                      value={preferences.meetingTypePreferences.stakeholderUpdate.problemCommunication}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('stakeholderUpdate', { problemCommunication: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLUTION_FOCUSED">Solution-focused - Emphasize solutions</SelectItem>
                        <SelectItem value="COMPREHENSIVE_ANALYSIS">Comprehensive analysis - Full problem breakdown</SelectItem>
                        <SelectItem value="COLLABORATIVE">Collaborative - Involve stakeholders in solutions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Accountability</label>
                    <Select 
                      value={preferences.meetingTypePreferences.stakeholderUpdate.accountability}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('stakeholderUpdate', { accountability: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLEAR_OWNERSHIP">Clear ownership - Define who owns what</SelectItem>
                        <SelectItem value="SHARED_RESPONSIBILITY">Shared responsibility - Team accountability</SelectItem>
                        <SelectItem value="ESCALATION_FOCUSED">Escalation-focused - Highlight blockers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Coaching Sessions */}
            <TabsContent value="coaching" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">AI Coaching Session Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Coaching Intensity</label>
                    <Select 
                      value={preferences.meetingTypePreferences.coachingSession.coachingIntensity}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('coachingSession', { coachingIntensity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENTLE">Gentle - Supportive guidance</SelectItem>
                        <SelectItem value="MODERATE">Moderate - Balanced coaching</SelectItem>
                        <SelectItem value="INTENSIVE">Intensive - Direct feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Feedback Frequency</label>
                    <Select 
                      value={preferences.meetingTypePreferences.coachingSession.feedbackFrequency}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('coachingSession', { feedbackFrequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REAL_TIME">Real-time - During practice</SelectItem>
                        <SelectItem value="POST_SESSION">Post-session - After completion</SelectItem>
                        <SelectItem value="WEEKLY_SUMMARY">Weekly summary - Consolidated feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Encouragement Style</label>
                    <Select 
                      value={preferences.meetingTypePreferences.coachingSession.encouragementStyle}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('coachingSession', { encouragementStyle: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH_SUPPORT">High support - Maximum encouragement</SelectItem>
                        <SelectItem value="BALANCED">Balanced - Mix of support and challenge</SelectItem>
                        <SelectItem value="CHALLENGE_FOCUSED">Challenge-focused - Push for excellence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Practice Complexity</label>
                    <Select 
                      value={preferences.meetingTypePreferences.coachingSession.practiceComplexity}
                      onValueChange={(value) => 
                        handleMeetingPreferenceChange('coachingSession', { practiceComplexity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FOUNDATION">Foundation - Basic skills</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate - Standard scenarios</SelectItem>
                        <SelectItem value="ADVANCED">Advanced - Complex situations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preferences Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Preferences Summary</CardTitle>
          <CardDescription>Overview of your current meeting type customizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Board Style:</span>
                <Badge variant="outline">
                  {preferences.meetingTypePreferences.boardPresentation.presentationStyle}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Planning Depth:</span>
                <Badge variant="outline">
                  {preferences.meetingTypePreferences.planningSession.strategicDepth}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Update Style:</span>
                <Badge variant="outline">
                  {preferences.meetingTypePreferences.stakeholderUpdate.communicationStyle}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coaching Intensity:</span>
                <Badge variant="outline">
                  {preferences.meetingTypePreferences.coachingSession.coachingIntensity}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}