'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Target, 
  Play,
  Plus,
  Edit,
  MoreHorizontal,
  Calendar,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import { UserProfile, ModuleCollection, LearningPath, PMTransitionType } from '@/types/modules'
import { mockLearningPaths } from '@/lib/mockModuleData'

interface LearningPathViewerProps {
  userProfile: UserProfile
  moduleCollections: ModuleCollection[]
  viewMode?: 'grid' | 'list'
}

const transitionLabels: Record<PMTransitionType, string> = {
  'PO_TO_PM': 'Product Owner → Product Manager',
  'PM_TO_SENIOR_PM': 'PM → Senior PM',
  'SENIOR_PM_TO_GROUP_PM': 'Senior PM → Group PM',
  'GROUP_PM_TO_DIRECTOR': 'Group PM → Director',
  'DIRECTOR_TO_VP': 'Director → VP Product',
  'INDUSTRY_TRANSITION': 'Industry Transition',
  'COMPANY_SIZE_TRANSITION': 'Company Size Transition'
}

const LearningPathViewer: React.FC<LearningPathViewerProps> = ({
  userProfile,
  moduleCollections,
  viewMode = 'grid'
}) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [learningPaths] = useState<LearningPath[]>(mockLearningPaths)

  const getUserTransitionType = (): PMTransitionType => {
    const { currentRole, targetRole } = userProfile
    if (currentRole === 'Product Owner' && targetRole.includes('Manager')) return 'PO_TO_PM'
    if (currentRole === 'Product Manager' && targetRole === 'Senior PM') return 'PM_TO_SENIOR_PM'
    if (currentRole === 'Senior PM' && targetRole === 'Group PM') return 'SENIOR_PM_TO_GROUP_PM'
    if (currentRole === 'Group PM' && targetRole.includes('Director')) return 'GROUP_PM_TO_DIRECTOR'
    return 'INDUSTRY_TRANSITION'
  }

  const getPathProgress = (path: LearningPath): number => {
    const completedMilestones = path.milestones.filter(m => m.completed).length
    return Math.round((completedMilestones / path.milestones.length) * 100)
  }

  const getPathRelevance = (path: LearningPath): 'HIGH' | 'MEDIUM' | 'LOW' => {
    const userTransition = getUserTransitionType()
    
    if (path.targetTransition === userTransition) return 'HIGH'
    
    // Check for related transitions
    const relatedTransitions = [
      ['PO_TO_PM', 'PM_TO_SENIOR_PM'],
      ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
      ['SENIOR_PM_TO_GROUP_PM', 'GROUP_PM_TO_DIRECTOR']
    ]
    
    const isRelated = relatedTransitions.some(group => 
      group.includes(userTransition) && group.includes(path.targetTransition)
    )
    
    return isRelated ? 'MEDIUM' : 'LOW'
  }

  const getRelevanceBadgeColor = (relevance: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (relevance) {
      case 'HIGH': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const sortedPaths = [...learningPaths].sort((a, b) => {
    const aRelevance = getPathRelevance(a)
    const bRelevance = getPathRelevance(b)
    
    const relevanceOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    return relevanceOrder[bRelevance] - relevanceOrder[aRelevance]
  })

  if (selectedPath) {
    const path = learningPaths.find(p => p.id === selectedPath)
    if (!path) return null

    const progress = getPathProgress(path)
    const relevance = getPathRelevance(path)
    const completedMilestones = path.milestones.filter(m => m.completed).length
    const nextMilestone = path.milestones.find(m => !m.completed)

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => setSelectedPath(null)}
            className="text-blue-600 hover:text-blue-700"
          >
            Learning Paths
          </button>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{path.name}</span>
        </div>

        {/* Path Header */}
        <Card className={`border-l-4 ${
          relevance === 'HIGH' ? 'border-l-green-500' :
          relevance === 'MEDIUM' ? 'border-l-yellow-500' :
          'border-l-gray-400'
        }`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {path.name}
                </CardTitle>
                <p className="text-gray-600 mt-1">{path.description}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <Badge className={`border ${getRelevanceBadgeColor(relevance)}`}>
                    {relevance === 'HIGH' ? 'Perfect Match' : 
                     relevance === 'MEDIUM' ? 'Good Match' : 'General Path'}
                  </Badge>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{path.estimatedDuration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{path.moduleCount} modules</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Target className="w-4 h-4" />
                    <span>{transitionLabels[path.targetTransition]}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{completedMilestones} of {path.milestones.length} milestones completed</span>
                <span>{path.milestones.length - completedMilestones} remaining</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Next Milestone</h3>
                  <p className="text-sm text-gray-600">
                    {nextMilestone ? nextMilestone.title : 'All milestones completed!'}
                  </p>
                </div>
              </div>
              
              {nextMilestone && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">{nextMilestone.description}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Time to Complete</h3>
                  <p className="text-sm text-gray-600">
                    {path.estimatedDuration}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Started:</span>
                  <span className="text-gray-900">{path.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress:</span>
                  <span className="text-gray-900">{progress}% complete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Learning Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {path.milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`border rounded-lg p-4 ${
                    milestone.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {milestone.order}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        milestone.completed ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {milestone.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        milestone.completed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {milestone.description}
                      </p>
                      
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Requirements:</p>
                        <ul className="space-y-1">
                          {milestone.requirements.map((req, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {milestone.completed && milestone.completedAt && (
                        <div className="mt-2 text-xs text-green-600">
                          Completed on {milestone.completedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {!milestone.completed && (
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={progress === 100}
          >
            {progress === 100 ? 'Path Complete!' : 'Continue Learning Path'}
          </Button>
          
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Customize Path
          </Button>
          
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Path Overview
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Learning Paths</h2>
          <p className="text-gray-500">
            Structured career progression pathways with milestone tracking
          </p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Path
        </Button>
      </div>

      {/* Recommended Path */}
      {sortedPaths.length > 0 && getPathRelevance(sortedPaths[0]) === 'HIGH' && (
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg text-green-900">Recommended for You</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-900">{sortedPaths[0].name}</h3>
                <p className="text-green-700 text-sm mt-1">{sortedPaths[0].description}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-green-700">
                  <strong>{sortedPaths[0].moduleCount}</strong> modules
                </div>
                <div className="text-sm text-green-700">
                  <strong>{sortedPaths[0].estimatedDuration}</strong> duration
                </div>
                <div className="text-sm text-green-700">
                  <strong>{getPathProgress(sortedPaths[0])}%</strong> complete
                </div>
              </div>
              
              <Button 
                onClick={() => setSelectedPath(sortedPaths[0].id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Start This Path
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Paths */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
        {sortedPaths.map((path) => {
          const progress = getPathProgress(path)
          const relevance = getPathRelevance(path)
          const completedMilestones = path.milestones.filter(m => m.completed).length

          return (
            <Card 
              key={path.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
                relevance === 'HIGH' ? 'border-l-green-500' :
                relevance === 'MEDIUM' ? 'border-l-yellow-500' :
                'border-l-gray-400'
              }`}
              onClick={() => setSelectedPath(path.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      {path.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Badge className={`text-xs border ${getRelevanceBadgeColor(relevance)}`}>
                    {relevance === 'HIGH' ? 'Perfect Match' : 
                     relevance === 'MEDIUM' ? 'Good Match' : 'Available'}
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    {transitionLabels[path.targetTransition]?.split(' → ')[1] || 'Career'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{path.moduleCount}</p>
                      <p className="text-xs text-gray-500">Modules</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{completedMilestones}</p>
                      <p className="text-xs text-gray-500">Milestones</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{completedMilestones}/{path.milestones.length}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-900">{path.estimatedDuration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {sortedPaths.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No learning paths available</h3>
            <p className="text-gray-500 mb-4">
              Create a custom learning path to organize your PM development journey.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Learning Path
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LearningPathViewer