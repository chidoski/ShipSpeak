/**
 * Analysis Visualization Hub - Displays comprehensive transcript analysis results
 * ShipSpeak Slice 5: Interactive visualization of PM pattern analysis and insights
 */

import React, { useState } from 'react'
import { 
  TranscriptAnalysisResults,
  MeetingTranscript,
  AnalysisConfiguration
} from '../../../types/transcript-analysis'
import { PatternHeatmap } from './PatternHeatmap'
import { ProgressTimeline } from './ProgressTimeline'
import { CompetencyRadar } from './CompetencyRadar'
import { InsightCards } from './InsightCards'

interface AnalysisVisualizationHubProps {
  results: TranscriptAnalysisResults
  transcript: MeetingTranscript
  config: AnalysisConfiguration
}

export const AnalysisVisualizationHub: React.FC<AnalysisVisualizationHubProps> = ({
  results,
  transcript,
  config
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'insights' | 'recommendations'>('overview')
  const [selectedCompetency, setSelectedCompetency] = useState<string | null>(null)

  const formatProcessingTime = (ms: number): string => {
    const seconds = Math.round(ms / 1000)
    return seconds < 60 ? `${seconds}s` : `${Math.round(seconds / 60)}m ${seconds % 60}s`
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 70) return 'bg-blue-100 text-blue-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Analysis Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Communication Analysis Results
            </h1>
            <p className="text-gray-600">
              Meeting analyzed on {new Date(results.timestamp).toLocaleDateString()} • 
              Processing time: {formatProcessingTime(results.processingTime)}
            </p>
          </div>
          <div className={`text-right ${getScoreColor(results.overallScore)}`}>
            <div className="text-3xl font-bold">{results.overallScore}</div>
            <div className="text-sm text-gray-500">Overall Score</div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(results.transitionAnalysis.progressScore)}`}>
              {results.transitionAnalysis.progressScore}%
            </div>
            <div className="text-sm text-gray-500">Transition Readiness</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(results.industryAnalysis.vocabularyFluency.professionalCredibility)}`}>
              {results.industryAnalysis.vocabularyFluency.professionalCredibility}%
            </div>
            <div className="text-sm text-gray-500">Industry Fluency</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(results.meetingTypeAnalysis.effectivenessScore)}`}>
              {results.meetingTypeAnalysis.effectivenessScore}%
            </div>
            <div className="text-sm text-gray-500">Meeting Effectiveness</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(results.peerComparison.overallPercentile)}`}>
              {results.peerComparison.overallPercentile}th
            </div>
            <div className="text-sm text-gray-500">Peer Percentile</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'patterns', label: 'Pattern Analysis' },
              { key: 'insights', label: 'Key Insights' },
              { key: 'recommendations', label: 'Action Plan' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pattern Highlights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Strengths</h3>
            <div className="space-y-3">
              {results.patternHighlights.slice(0, 4).map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getScoreBadgeColor(highlight.score)}`}>
                    {highlight.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{highlight.pattern}</h4>
                    <p className="text-sm text-gray-600 mt-1">{highlight.careerImpact}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {highlight.evidence.slice(0, 2).map((evidence, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {evidence}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Improvements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Development Areas</h3>
            <div className="space-y-3">
              {results.improvementAreas.slice(0, 3).map((area, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{area.specificFocus}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      area.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      area.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {area.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Current: {area.currentLevel}%</span>
                    <span className="text-sm text-gray-600">Target: {area.targetLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${area.currentLevel}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{area.examples[0]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career Progression Insight */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Progression Insight</h3>
            {results.careerProgressionInsights.slice(0, 1).map((insight, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{insight.readinessScore}%</div>
                  <div className="text-sm text-gray-600">Transition Readiness</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{insight.timeToTarget}mo</div>
                  <div className="text-sm text-gray-600">Est. Time to Target</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{insight.keyMilestones.length}</div>
                  <div className="text-sm text-gray-600">Key Milestones</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Pattern Heatmap</h3>
            <PatternHeatmap 
              patterns={results.patternHighlights}
              transitionAnalysis={results.transitionAnalysis}
              onPatternSelect={setSelectedCompetency}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Analysis</h3>
            <CompetencyRadar 
              improvementAreas={results.improvementAreas}
              strengthAreas={results.strengthAreas}
              selectedCompetency={selectedCompetency}
            />
          </div>
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h3>
            <ProgressTimeline 
              historicalProgress={results.historicalProgress}
              careerInsights={results.careerProgressionInsights}
              currentScore={results.overallScore}
            />
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <InsightCards 
            patternHighlights={results.patternHighlights}
            improvementAreas={results.improvementAreas}
            strengthAreas={results.strengthAreas}
            progressionInsights={results.careerProgressionInsights}
          />
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Immediate Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <span className="text-red-600">🔥</span> Immediate Actions
            </h3>
            <div className="space-y-4">
              {results.immediateActions.map((action, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{action.action}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      action.effort === 'LOW' ? 'bg-green-100 text-green-700' :
                      action.effort === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {action.effort} effort
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{action.rationale}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Expected: {action.expectedImpact}</span>
                    <span>Timeline: {action.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Module Recommendations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <span className="text-blue-600">📚</span> Recommended Practice Modules
            </h3>
            <div className="space-y-4">
              {results.practiceModuleRecommendations.map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{module.moduleType}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        module.difficulty === 'FOUNDATION' ? 'bg-blue-100 text-blue-700' :
                        module.difficulty === 'PRACTICE' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {module.difficulty}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Priority {module.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{module.focusArea}</p>
                  <p className="text-sm text-green-700 font-medium">→ {module.expectedOutcome}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Benchmarks</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-medium text-gray-700 mb-2">vs. Career Level Peers</h4>
                <div className={`text-3xl font-bold ${getScoreColor(results.peerComparison.careerLevelPercentile)}`}>
                  {results.peerComparison.careerLevelPercentile}th
                </div>
                <div className="text-sm text-gray-500">percentile</div>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-gray-700 mb-2">vs. Industry Average</h4>
                <div className={`text-3xl font-bold ${getScoreColor(results.peerComparison.industryPercentile)}`}>
                  {results.peerComparison.industryPercentile}th
                </div>
                <div className="text-sm text-gray-500">percentile</div>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-gray-700 mb-2">Progress Trajectory</h4>
                <div className={`text-xl font-bold ${
                  results.historicalProgress.trajectoryDirection === 'ACCELERATING' ? 'text-green-600' :
                  results.historicalProgress.trajectoryDirection === 'STEADY' ? 'text-blue-600' :
                  results.historicalProgress.trajectoryDirection === 'PLATEAUING' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {results.historicalProgress.trajectoryDirection.toLowerCase()}
                </div>
                <div className="text-sm text-gray-500">
                  {results.historicalProgress.improvementRate}% monthly
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Communication Strengths</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.peerComparison.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">Development Opportunities</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.peerComparison.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-orange-500 mr-2">→</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisVisualizationHub