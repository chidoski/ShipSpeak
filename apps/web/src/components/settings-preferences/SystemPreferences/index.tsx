'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Shield, Link, Accessibility } from 'lucide-react'
import { UserPreferences, SystemPreferences as SP } from '@/types/settings-preferences'

interface SystemPreferencesProps {
  preferences: UserPreferences
  userProfile?: any
  onPreferenceChange: (updates: Partial<UserPreferences>) => void
  intelligentDefaults: any
}

export function SystemPreferences({
  preferences,
  userProfile,
  onPreferenceChange,
  intelligentDefaults
}: SystemPreferencesProps) {
  const [activeTab, setActiveTab] = useState('notifications')

  const systemSections = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Progress alerts and reminders',
      icon: Bell
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Data retention and sharing',
      icon: Shield
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Third-party connections',
      icon: Link
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'Interface customization',
      icon: Accessibility
    }
  ]

  const handleSystemChange = (section: keyof SP, updates: any) => {
    onPreferenceChange({
      systemPreferences: {
        ...preferences.systemPreferences,
        [section]: {
          ...preferences.systemPreferences?.[section],
          ...updates
        }
      }
    })
  }

  const systemPrefs = preferences.systemPreferences || {
    notifications: {
      progressUpdates: true,
      achievementAlerts: true,
      reminderFrequency: 'WEEKLY',
      emailDigest: true,
      mobilePush: true
    },
    privacy: {
      dataRetention: 'STANDARD',
      meetingRecordingConsent: true,
      analyticsSharing: true,
      benchmarkParticipation: true,
      profileVisibility: 'ANONYMOUS'
    },
    integrations: {
      calendarSync: true,
      slackIntegration: false,
      zoomIntegration: true,
      teamsIntegration: false,
      exportFormat: 'PDF'
    },
    accessibility: {
      fontSize: 'MEDIUM',
      contrast: 'NORMAL',
      reduceMotion: false,
      screenReaderOptimization: false,
      keyboardNavigation: true
    }
  }

  return (
    <div className="space-y-6">
      {/* System Preferences Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            System Preferences
          </CardTitle>
          <CardDescription>
            Configure system-wide settings, privacy, and accessibility options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {systemSections.map(section => {
              const IconComponent = section.icon
              return (
                <div key={section.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium text-sm">{section.title}</p>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Settings Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full grid-cols-4">
                {systemSections.map(section => {
                  const IconComponent = section.icon
                  return (
                    <TabsTrigger 
                      key={section.id}
                      value={section.id}
                      className="flex items-center gap-2 text-xs lg:text-sm"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{section.title}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {/* Notifications */}
            <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Progress Updates</p>
                        <p className="text-sm text-muted-foreground">Regular updates on learning progress</p>
                      </div>
                      <Switch
                        checked={systemPrefs.notifications.progressUpdates}
                        onCheckedChange={(checked) => 
                          handleSystemChange('notifications', { progressUpdates: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Achievement Alerts</p>
                        <p className="text-sm text-muted-foreground">Notifications for milestones and achievements</p>
                      </div>
                      <Switch
                        checked={systemPrefs.notifications.achievementAlerts}
                        onCheckedChange={(checked) => 
                          handleSystemChange('notifications', { achievementAlerts: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Digest</p>
                        <p className="text-sm text-muted-foreground">Weekly summary emails</p>
                      </div>
                      <Switch
                        checked={systemPrefs.notifications.emailDigest}
                        onCheckedChange={(checked) => 
                          handleSystemChange('notifications', { emailDigest: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mobile Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Real-time mobile notifications</p>
                      </div>
                      <Switch
                        checked={systemPrefs.notifications.mobilePush}
                        onCheckedChange={(checked) => 
                          handleSystemChange('notifications', { mobilePush: checked })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Reminder Frequency</label>
                      <Select 
                        value={systemPrefs.notifications.reminderFrequency}
                        onValueChange={(value) => 
                          handleSystemChange('notifications', { reminderFrequency: value })
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEVER">Never</SelectItem>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Privacy */}
            <TabsContent value="privacy" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Privacy & Data Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Data Retention</label>
                      <Select 
                        value={systemPrefs.privacy.dataRetention}
                        onValueChange={(value) => 
                          handleSystemChange('privacy', { dataRetention: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MINIMAL">Minimal - 30 days</SelectItem>
                          <SelectItem value="STANDARD">Standard - 1 year</SelectItem>
                          <SelectItem value="EXTENDED">Extended - 3 years</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        How long to retain your practice session data
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Meeting Recording Consent</p>
                        <p className="text-sm text-muted-foreground">Allow recording of practice sessions</p>
                      </div>
                      <Switch
                        checked={systemPrefs.privacy.meetingRecordingConsent}
                        onCheckedChange={(checked) => 
                          handleSystemChange('privacy', { meetingRecordingConsent: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics Sharing</p>
                        <p className="text-sm text-muted-foreground">Share anonymized usage data to improve platform</p>
                      </div>
                      <Switch
                        checked={systemPrefs.privacy.analyticsSharing}
                        onCheckedChange={(checked) => 
                          handleSystemChange('privacy', { analyticsSharing: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Benchmark Participation</p>
                        <p className="text-sm text-muted-foreground">Include your data in industry benchmarks</p>
                      </div>
                      <Switch
                        checked={systemPrefs.privacy.benchmarkParticipation}
                        onCheckedChange={(checked) => 
                          handleSystemChange('privacy', { benchmarkParticipation: checked })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Profile Visibility</label>
                      <Select 
                        value={systemPrefs.privacy.profileVisibility}
                        onValueChange={(value) => 
                          handleSystemChange('privacy', { profileVisibility: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIVATE">Private - Hidden from all</SelectItem>
                          <SelectItem value="ANONYMOUS">Anonymous - Aggregated only</SelectItem>
                          <SelectItem value="PUBLIC">Public - Visible to community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Integrations */}
            <TabsContent value="integrations" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Integration Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Calendar Sync</p>
                        <p className="text-sm text-muted-foreground">Sync practice sessions with calendar</p>
                      </div>
                      <Switch
                        checked={systemPrefs.integrations.calendarSync}
                        onCheckedChange={(checked) => 
                          handleSystemChange('integrations', { calendarSync: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Slack Integration</p>
                        <p className="text-sm text-muted-foreground">Send updates to Slack workspace</p>
                      </div>
                      <Switch
                        checked={systemPrefs.integrations.slackIntegration}
                        onCheckedChange={(checked) => 
                          handleSystemChange('integrations', { slackIntegration: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Zoom Integration</p>
                        <p className="text-sm text-muted-foreground">Connect Zoom for meeting capture</p>
                      </div>
                      <Switch
                        checked={systemPrefs.integrations.zoomIntegration}
                        onCheckedChange={(checked) => 
                          handleSystemChange('integrations', { zoomIntegration: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Teams Integration</p>
                        <p className="text-sm text-muted-foreground">Connect Microsoft Teams</p>
                      </div>
                      <Switch
                        checked={systemPrefs.integrations.teamsIntegration}
                        onCheckedChange={(checked) => 
                          handleSystemChange('integrations', { teamsIntegration: checked })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Export Format</label>
                      <Select 
                        value={systemPrefs.integrations.exportFormat}
                        onValueChange={(value) => 
                          handleSystemChange('integrations', { exportFormat: value })
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JSON">JSON</SelectItem>
                          <SelectItem value="CSV">CSV</SelectItem>
                          <SelectItem value="PDF">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Accessibility */}
            <TabsContent value="accessibility" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Accessibility Options</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Font Size</label>
                      <Select 
                        value={systemPrefs.accessibility.fontSize}
                        onValueChange={(value) => 
                          handleSystemChange('accessibility', { fontSize: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SMALL">Small</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="LARGE">Large</SelectItem>
                          <SelectItem value="EXTRA_LARGE">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Contrast</label>
                      <Select 
                        value={systemPrefs.accessibility.contrast}
                        onValueChange={(value) => 
                          handleSystemChange('accessibility', { contrast: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="HIGH">High Contrast</SelectItem>
                          <SelectItem value="MAXIMUM">Maximum Contrast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reduce Motion</p>
                        <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                      </div>
                      <Switch
                        checked={systemPrefs.accessibility.reduceMotion}
                        onCheckedChange={(checked) => 
                          handleSystemChange('accessibility', { reduceMotion: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Screen Reader Optimization</p>
                        <p className="text-sm text-muted-foreground">Optimize interface for screen readers</p>
                      </div>
                      <Switch
                        checked={systemPrefs.accessibility.screenReaderOptimization}
                        onCheckedChange={(checked) => 
                          handleSystemChange('accessibility', { screenReaderOptimization: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Keyboard Navigation</p>
                        <p className="text-sm text-muted-foreground">Enhanced keyboard navigation support</p>
                      </div>
                      <Switch
                        checked={systemPrefs.accessibility.keyboardNavigation}
                        onCheckedChange={(checked) => 
                          handleSystemChange('accessibility', { keyboardNavigation: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration Summary</CardTitle>
          <CardDescription>Overview of your current system preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Active Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notifications:</span>
                  <Badge variant={systemPrefs.notifications.progressUpdates ? 'default' : 'outline'}>
                    {systemPrefs.notifications.reminderFrequency}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Retention:</span>
                  <Badge variant="outline">{systemPrefs.privacy.dataRetention}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Integrations:</span>
                  <Badge variant="outline">
                    {[systemPrefs.integrations.calendarSync, systemPrefs.integrations.zoomIntegration, systemPrefs.integrations.teamsIntegration, systemPrefs.integrations.slackIntegration].filter(Boolean).length} active
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Accessibility</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Font Size:</span>
                  <Badge variant="outline">{systemPrefs.accessibility.fontSize}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contrast:</span>
                  <Badge variant="outline">{systemPrefs.accessibility.contrast}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enhanced Navigation:</span>
                  <Badge variant={systemPrefs.accessibility.keyboardNavigation ? 'default' : 'outline'}>
                    {systemPrefs.accessibility.keyboardNavigation ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}