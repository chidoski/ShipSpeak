/**
 * UserProfileAnalyzer - User profile analysis and progress visualization
 * PM-specific skill assessment and career progression tracking
 */

'use client'

import React, { useState } from 'react'
import { UserProfile, ProgressAnalysis } from '@/types/modules'

interface UserProfileAnalyzerProps {
  userProfile: UserProfile
  progressAnalysis: ProgressAnalysis
  onProfileUpdate: (updates: Partial<UserProfile>) => void
}

export function UserProfileAnalyzer({ 
  userProfile, 
  progressAnalysis, 
  onProfileUpdate 
}: UserProfileAnalyzerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    currentRole: userProfile.currentRole,
    targetRole: userProfile.targetRole,
    industry: userProfile.industry,
    focusAreas: userProfile.preferences.focusAreas
  })

  const handleSaveChanges = () => {
    onProfileUpdate(formData)
    setIsEditing(false)
  }

  return (
    <div className="user-profile-analyzer p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Overview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Profile Overview</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <ProfileEditForm
              formData={formData}
              onChange={setFormData}
              onSave={handleSaveChanges}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileDisplay userProfile={userProfile} />
          )}
        </div>

        {/* Progress Analysis */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
          <ProgressMetrics progressAnalysis={progressAnalysis} />
        </div>
      </div>

      {/* Skill Assessment Visualization */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Assessment</h3>
        <SkillRadarChart userProfile={userProfile} />
      </div>

      {/* Career Readiness */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Career Readiness</h3>
        <CareerReadinessDisplay careerReadiness={progressAnalysis.careerReadiness} />
      </div>
    </div>
  )
}

function ProfileDisplay({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ProfileField label="Current Role" value={userProfile.currentRole} icon="👤" />
        <ProfileField label="Target Role" value={userProfile.targetRole} icon="🎯" />
        <ProfileField label="Industry" value={userProfile.industry} icon="🏢" />
        <ProfileField 
          label="Experience Level" 
          value={userProfile.experienceLevel} 
          icon="⭐" 
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Focus Areas</h4>
        <div className="flex flex-wrap gap-2">
          {userProfile.preferences.focusAreas.map((area) => (
            <span
              key={area}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Completed Modules</h4>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">
            {userProfile.completedModules.length}
          </span>
          <span className="text-gray-600">modules completed</span>
        </div>
      </div>
    </div>
  )
}

function ProfileField({ 
  label, 
  value, 
  icon 
}: { 
  label: string
  value: string
  icon: string
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center space-x-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  )
}

function ProfileEditForm({
  formData,
  onChange,
  onSave,
  onCancel
}: {
  formData: any
  onChange: (data: any) => void
  onSave: () => void
  onCancel: () => void
}) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Role
          </label>
          <select
            value={formData.currentRole}
            onChange={(e) => handleChange('currentRole', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Product Owner</option>
            <option>Associate PM</option>
            <option>Product Manager</option>
            <option>Senior PM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Role
          </label>
          <select
            value={formData.targetRole}
            onChange={(e) => handleChange('targetRole', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Product Manager</option>
            <option>Senior PM</option>
            <option>Principal PM</option>
            <option>Group PM</option>
            <option>Director of Product</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry
        </label>
        <select
          value={formData.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option>Healthcare & Life Sciences</option>
          <option>Financial Services & Fintech</option>
          <option>Consumer Technology & Apps</option>
          <option>Enterprise Software & B2B</option>
          <option>Cybersecurity & Enterprise Security</option>
        </select>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={onSave}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ProgressMetrics({ progressAnalysis }: { progressAnalysis: ProgressAnalysis }) {
  const completionRate = Math.round(
    (progressAnalysis.completedModules / progressAnalysis.totalAvailableModules) * 100
  )

  return (
    <div className="space-y-4">
      {/* Completion Rate */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Module Completion</span>
          <span className="text-lg font-bold text-green-600">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {progressAnalysis.completedModules} of {progressAnalysis.totalAvailableModules} modules
        </p>
      </div>

      {/* Learning Velocity */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xl">⚡</span>
          <span className="text-sm font-medium text-gray-700">Learning Velocity</span>
        </div>
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {progressAnalysis.learningVelocity}x
        </div>
        <p className="text-xs text-gray-600">modules per week</p>
      </div>

      {/* Strong Areas */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Strength Areas</h4>
        <div className="space-y-1">
          {progressAnalysis.strongAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-700">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Areas */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Development Areas</h4>
        <div className="space-y-1">
          {progressAnalysis.improvementAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <span className="text-orange-500">⚡</span>
              <span className="text-sm text-gray-700">{area}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillRadarChart({ userProfile }: { userProfile: UserProfile }) {
  const skills = userProfile.skillAssessment.skills.slice(0, 6) // Top 6 skills

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {skills.map((assessedSkill) => (
        <div key={assessedSkill.skill.id} className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{assessedSkill.skill.name}</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(assessedSkill.level / 5) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {assessedSkill.level}/5
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {assessedSkill.confidence}% confidence
          </p>
        </div>
      ))}
    </div>
  )
}

function CareerReadinessDisplay({ careerReadiness }: { careerReadiness: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-2">Readiness Score</h4>
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {careerReadiness.readinessScore}%
        </div>
        <p className="text-sm text-gray-600">
          for {careerReadiness.targetRole}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Estimated time: {careerReadiness.timeToReadiness}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Ready Areas</h4>
          <div className="space-y-1">
            {careerReadiness.readyAreas.map((area: string) => (
              <div key={area} className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Development Areas</h4>
          <div className="space-y-1">
            {careerReadiness.developmentAreas.map((area: string) => (
              <div key={area} className="flex items-center space-x-2">
                <span className="text-orange-500">⚡</span>
                <span className="text-sm text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}