'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Overview Cards
import { CareerProgressionCard } from './OverviewCards/CareerProgressionCard'
import { OverallSkillScore } from './OverviewCards/OverallSkillScore' 
import { RecentAchievements } from './OverviewCards/RecentAchievements'
import { NextMilestoneCard } from './OverviewCards/NextMilestoneCard'

// Skill Progress Visualization
import { SkillRadarChart } from './SkillProgressVisualization/SkillRadarChart'
import { ProgressTimeline } from './SkillProgressVisualization/ProgressTimeline'
import { ImprovementTrendGraph } from './SkillProgressVisualization/ImprovementTrendGraph'
import { BenchmarkComparison } from './SkillProgressVisualization/BenchmarkComparison'

// Career Trajectory Tracking
import { TransitionReadiness } from './CareerTrajectoryTracking/TransitionReadiness'
import { MilestoneTracker } from './CareerTrajectoryTracking/MilestoneTracker'
import { SkillGapVisualization } from './CareerTrajectoryTracking/SkillGapVisualization'
import { TimeToPromotionEstimator } from './CareerTrajectoryTracking/TimeToPromotionEstimator'

// Detailed Analytics
import { IndustrySpecificProgress } from './DetailedAnalytics/IndustrySpecificProgress'
import { MeetingTypeEffectiveness } from './DetailedAnalytics/MeetingTypeEffectiveness'
import { FrameworkMasteryTracker } from './DetailedAnalytics/FrameworkMasteryTracker'
import { PracticeSessionAnalytics } from './DetailedAnalytics/PracticeSessionAnalytics'

// Motivational Elements
import { AchievementCelebration } from './MotivationalElements/AchievementCelebration'
import { StreakTracker } from './MotivationalElements/StreakTracker'
import { ProgressMotivation } from './MotivationalElements/ProgressMotivation'
import { CommunityComparison } from './MotivationalElements/CommunityComparison'

export function DashboardOrchestrator() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="motivation">Motivation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CareerProgressionCard />
            <OverallSkillScore />
            <RecentAchievements />
            <NextMilestoneCard />
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillRadarChart />
            <BenchmarkComparison />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressTimeline />
            <ImprovementTrendGraph />
          </div>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransitionReadiness />
            <TimeToPromotionEstimator />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MilestoneTracker />
            <SkillGapVisualization />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IndustrySpecificProgress />
            <FrameworkMasteryTracker />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MeetingTypeEffectiveness />
            <PracticeSessionAnalytics />
          </div>
        </TabsContent>

        <TabsContent value="motivation" className="space-y-6">
          <AchievementCelebration />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StreakTracker />
            <ProgressMotivation />
            <CommunityComparison />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}