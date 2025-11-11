"use client"

import React, { useState } from 'react'
import { RecordingOrchestrator } from '../../../../components/practice-recording/RecordingOrchestrator'
import { mockExerciseContexts, mockUserProfiles, getRecommendedExercise } from '../../../../lib/mockPracticeRecordingData'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { ExerciseContext, UserProfile, RecordingSession } from '../../../../types/practice-recording'
import { ArrowLeft, Play, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PracticeRecordingPage() {
  const router = useRouter()
  const [selectedExercise, setSelectedExercise] = useState<ExerciseContext | null>(null)
  const [userProfile] = useState<UserProfile>(mockUserProfiles[0]) // Default to first user
  const [isRecordingActive, setIsRecordingActive] = useState(false)

  const handleExerciseSelect = (exercise: ExerciseContext) => {
    setSelectedExercise(exercise)
    setIsRecordingActive(true)
  }

  const handleSessionComplete = (session: RecordingSession) => {
    console.log('Recording session completed:', session)
    setIsRecordingActive(false)
    setSelectedExercise(null)
    // In a real app, this would save the session and navigate to results
  }

  const handleSessionCancel = () => {
    setIsRecordingActive(false)
    setSelectedExercise(null)
  }

  const getExerciseTypeIcon = (type: string) => {
    switch (type) {
      case 'BOARD_PRESENTATION': return '👔'
      case 'STAKEHOLDER_UPDATE': return '📋'
      case 'PLANNING_SESSION': return '🗓️'
      case 'FRAMEWORK_PRACTICE': return '🧠'
      default: return '🎯'
    }
  }

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'fintech': return '💰'
      case 'healthcare': return '🏥'
      case 'cybersecurity': return '🔒'
      case 'enterprise': return '🏢'
      case 'consumer': return '📱'
      default: return '💼'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'FOUNDATION': return 'bg-green-100 text-green-800'
      case 'PRACTICE': return 'bg-blue-100 text-blue-800'
      case 'MASTERY': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isRecordingActive && selectedExercise) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <RecordingOrchestrator
          exerciseContext={selectedExercise}
          userProfile={userProfile}
          onSessionComplete={handleSessionComplete}
          onSessionCancel={handleSessionCancel}
        />
      </div>
    )
  }

  const recommendedExercise = getRecommendedExercise(userProfile)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/practice')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Practice
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Practice Recording</h1>
              <p className="text-gray-600">
                Executive-grade recording with real-time coaching for your PM development
              </p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Recording Settings
          </Button>
        </div>

        {/* User Profile Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Development Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">Career Transition</div>
                <div className="text-sm text-gray-600 mt-1">
                  {userProfile.currentRole} → {userProfile.targetRole}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">Focus Areas</div>
                <div className="text-sm text-gray-600 mt-1">
                  {userProfile.skillGaps.slice(0, 2).join(', ')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">Industry Experience</div>
                <div className="text-sm text-gray-600 mt-1">
                  {userProfile.industryExperience.join(', ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Exercise */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⭐ Recommended for Your Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-2xl">{getExerciseTypeIcon(recommendedExercise.type)}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{recommendedExercise.title}</h3>
                    <p className="text-gray-600">{recommendedExercise.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span>{getIndustryIcon(recommendedExercise.industryContext)}</span>
                    <span className="capitalize">{recommendedExercise.industryContext}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendedExercise.difficulty)}`}>
                    {recommendedExercise.difficulty}
                  </div>
                  <span className="text-gray-500">
                    {Math.floor(recommendedExercise.timeLimit / 60)}min
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => handleExerciseSelect(recommendedExercise)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Exercises */}
        <Card>
          <CardHeader>
            <CardTitle>All Practice Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockExerciseContexts.map(exercise => (
                <Card key={exercise.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getExerciseTypeIcon(exercise.type)}</span>
                        <div>
                          <h4 className="font-semibold">{exercise.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {exercise.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>{getIndustryIcon(exercise.industryContext)}</span>
                          <span className="capitalize">{exercise.industryContext}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </div>
                        <span className="text-gray-500">
                          {Math.floor(exercise.timeLimit / 60)}min
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleExerciseSelect(exercise)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Start
                      </Button>
                    </div>

                    {/* Success Criteria Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-600 mb-2">Success Criteria:</div>
                      <div className="space-y-1">
                        {exercise.successCriteria.slice(0, 2).map((criteria, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                            <span>{criteria}</span>
                          </div>
                        ))}
                        {exercise.successCriteria.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{exercise.successCriteria.length - 2} more criteria
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}