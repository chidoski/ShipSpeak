'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Award, TrendingUp, Mail, Smartphone, Calendar } from 'lucide-react'
import { NotificationSettings } from '@/types/settings-preferences'

interface MilestoneNotificationSettingsProps {
  notifications?: NotificationSettings
  onNotificationChange: (updates: Partial<NotificationSettings>) => void
}

export function MilestoneNotificationSettings({
  notifications = {
    progressUpdates: true,
    achievementAlerts: true,
    reminderFrequency: 'WEEKLY',
    emailDigest: true,
    mobilePush: true
  },
  onNotificationChange
}: MilestoneNotificationSettingsProps) {
  const [testNotification, setTestNotification] = useState<string | null>(null)

  const notificationTypes = [
    {
      id: 'achievement',
      title: 'Achievement Milestones',
      description: 'Notifications when you reach skill development milestones',
      icon: Award,
      setting: 'achievementAlerts',
      examples: [
        'You\'ve reached 80% readiness for Senior PM role!',
        'Strategic thinking milestone achieved - Executive presence unlocked',
        'Framework mastery: You\'re now proficient in RICE prioritization'
      ]
    },
    {
      id: 'progress',
      title: 'Progress Updates',
      description: 'Regular updates on your development progress',
      icon: TrendingUp,
      setting: 'progressUpdates',
      examples: [
        'Weekly progress summary: 3 practice sessions completed',
        'Your executive communication improved by 15% this month',
        'You\'re 65% ready for your target role - keep going!'
      ]
    },
    {
      id: 'reminders',
      title: 'Practice Reminders',
      description: 'Gentle reminders to maintain consistent practice',
      icon: Calendar,
      setting: 'reminderFrequency',
      examples: [
        'Time for your weekly stakeholder communication practice',
        'Board presentation practice session available',
        'Your learning streak is at 12 days - keep it up!'
      ]
    }
  ]

  const deliveryChannels = [
    {
      id: 'email',
      title: 'Email Digest',
      description: 'Comprehensive weekly email summaries',
      icon: Mail,
      setting: 'emailDigest'
    },
    {
      id: 'mobile',
      title: 'Mobile Push',
      description: 'Real-time notifications on mobile device',
      icon: Smartphone,
      setting: 'mobilePush'
    }
  ]

  const frequencyOptions = [
    { value: 'NEVER', label: 'Never', description: 'No automatic reminders' },
    { value: 'DAILY', label: 'Daily', description: 'Daily practice reminders' },
    { value: 'WEEKLY', label: 'Weekly', description: 'Weekly progress check-ins' },
    { value: 'MONTHLY', label: 'Monthly', description: 'Monthly development summaries' }
  ]

  const handleToggleNotification = (setting: keyof NotificationSettings, value: boolean) => {
    onNotificationChange({ [setting]: value })
  }

  const handleFrequencyChange = (frequency: string) => {
    onNotificationChange({ reminderFrequency: frequency as any })
  }

  const sendTestNotification = (type: string) => {
    setTestNotification(type)
    setTimeout(() => setTestNotification(null), 3000)
  }

  const getNotificationValue = (setting: keyof NotificationSettings) => {
    return notifications[setting] as boolean
  }

  return (
    <div className="space-y-6">
      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Milestone Notifications
          </CardTitle>
          <CardDescription>
            Configure when and how you receive development progress notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map(type => {
            const IconComponent = type.icon
            const isEnabled = type.setting === 'reminderFrequency' 
              ? notifications.reminderFrequency !== 'NEVER'
              : getNotificationValue(type.setting as keyof NotificationSettings)

            return (
              <div key={type.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">{type.title}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendTestNotification(type.id)}
                      disabled={!isEnabled}
                    >
                      Test
                    </Button>
                    {type.setting !== 'reminderFrequency' && (
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => 
                          handleToggleNotification(type.setting as any, checked)
                        }
                      />
                    )}
                  </div>
                </div>

                {type.setting === 'reminderFrequency' && (
                  <div className="ml-8">
                    <label className="text-sm font-medium mb-2 block">Frequency</label>
                    <Select value={notifications.reminderFrequency} onValueChange={handleFrequencyChange}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {isEnabled && (
                  <div className="ml-8 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Example notifications:</p>
                    <ul className="space-y-1">
                      {type.examples.map((example, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {testNotification === type.id && (
                  <div className="ml-8 p-3 bg-blue-100 border-l-4 border-blue-400 rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800 font-medium">Test Notification Sent!</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">{type.examples[0]}</p>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Delivery Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            Delivery Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliveryChannels.map(channel => {
            const IconComponent = channel.icon
            const isEnabled = getNotificationValue(channel.setting as keyof NotificationSettings)

            return (
              <div key={channel.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{channel.title}</p>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => 
                    handleToggleNotification(channel.setting as keyof NotificationSettings, checked)
                  }
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Notification Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preview</CardTitle>
          <CardDescription>
            Based on your current settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={notifications.achievementAlerts ? 'default' : 'secondary'}>
                Achievements: {notifications.achievementAlerts ? 'ON' : 'OFF'}
              </Badge>
              <Badge variant={notifications.progressUpdates ? 'default' : 'secondary'}>
                Progress: {notifications.progressUpdates ? 'ON' : 'OFF'}
              </Badge>
              <Badge variant={notifications.reminderFrequency !== 'NEVER' ? 'default' : 'secondary'}>
                Reminders: {notifications.reminderFrequency}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Email:</strong> {notifications.emailDigest ? 'Weekly digest enabled' : 'Disabled'} • 
                <strong> Mobile:</strong> {notifications.mobilePush ? ' Push notifications enabled' : ' Disabled'}
              </p>
            </div>

            {(notifications.achievementAlerts || notifications.progressUpdates || notifications.reminderFrequency !== 'NEVER') && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  ✓ You'll stay informed about your PM development progress
                </p>
                <p className="text-green-700 text-xs mt-1">
                  Notifications will help you stay motivated and track your advancement toward your target role.
                </p>
              </div>
            )}

            {!notifications.achievementAlerts && !notifications.progressUpdates && notifications.reminderFrequency === 'NEVER' && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm font-medium">
                  ⚠ All notifications are currently disabled
                </p>
                <p className="text-orange-700 text-xs mt-1">
                  Consider enabling some notifications to stay engaged with your development goals.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}