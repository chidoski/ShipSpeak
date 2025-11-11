'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { 
  HelpCircle, 
  X, 
  Lightbulb, 
  PlayCircle, 
  BookOpen, 
  AlertCircle,
  CheckCircle,
  Target
} from 'lucide-react'
import type { ContextualHelp, HelpTrigger, CareerTransitionType } from '../../../types/onboarding'

// Mock contextual help content
const mockContextualHelp: ContextualHelp[] = [
  {
    id: 'meeting-upload-help',
    trigger: 'MEETING_UPLOAD_PAGE',
    careerRelevance: 'ALL_LEVELS',
    industrySpecific: ['ALL'],
    helpContent: {
      title: 'Meeting Upload Best Practices',
      quickTips: [
        'Upload 15-30 minute meeting segments for optimal analysis',
        'Include meetings where you presented or led discussion',
        'Board presentations and stakeholder updates work best',
        'Ensure clear audio quality for accurate transcription'
      ],
      detailedGuidance: 'For best results, choose meetings where you had significant speaking time and clear strategic communication opportunities. ShipSpeak performs better analysis with executive-level discussions rather than tactical updates.',
      careerContext: 'Quality meeting uploads directly improve personalized practice module generation and career advancement insights.',
      videoTutorial: 'meeting-upload-best-practices.mp4',
      interactiveGuide: true,
      relatedTopics: ['Audio Quality', 'Meeting Selection', 'Analysis Optimization']
    }
  },
  {
    id: 'practice-module-selection-help',
    trigger: 'PRACTICE_MODULE_SELECTION',
    careerRelevance: 'PM_TO_SENIOR_PM',
    industrySpecific: ['ALL'],
    helpContent: {
      title: 'Choosing Practice Modules for PM → Senior PM',
      quickTips: [
        'Start with executive communication modules for C-suite readiness',
        'Focus on trade-off articulation to demonstrate strategic thinking',
        'Practice influence without authority for cross-functional leadership',
        'Balance framework mastery with industry-specific scenarios'
      ],
      detailedGuidance: 'Senior PM roles require 40% more executive communication skills than PM roles. Prioritize modules that address your specific analysis insights, especially executive presence and strategic communication.',
      careerContext: 'Strategic module selection can accelerate PM → Senior PM advancement by 3-6 months when combined with real meeting analysis.',
      interactiveGuide: false,
      relatedTopics: ['Executive Communication', 'Strategic Thinking', 'Leadership Development']
    }
  },
  {
    id: 'dashboard-confusion-help',
    trigger: 'DASHBOARD_CONFUSION',
    careerRelevance: 'ALL_LEVELS',
    industrySpecific: ['ALL'],
    helpContent: {
      title: 'Understanding Your PM Development Dashboard',
      quickTips: [
        'Executive Readiness shows your preparedness for senior roles',
        'Practice Streak tracks consistency in skill development',
        'Modules Completed indicates breadth of experience',
        'Hours Practiced reflects depth of communication improvement'
      ],
      detailedGuidance: 'Your dashboard adapts to your career transition goals and industry context. Green metrics indicate strengths to leverage, amber metrics show development opportunities, and red metrics require immediate attention.',
      careerContext: 'Understanding your dashboard metrics helps prioritize development efforts for maximum career impact and advancement speed.',
      relatedTopics: ['Progress Tracking', 'Career Metrics', 'Development Planning']
    }
  },
  {
    id: 'analysis-results-help',
    trigger: 'ANALYSIS_RESULTS_VIEW',
    careerRelevance: 'ALL_LEVELS',
    industrySpecific: ['ALL'],
    helpContent: {
      title: 'Interpreting Your Communication Analysis',
      quickTips: [
        'Overall scores compare you to peers at your target role level',
        'Pattern insights identify specific improvement opportunities',
        'Framework usage shows strategic thinking demonstration',
        'Executive presence reflects authority and confidence markers'
      ],
      detailedGuidance: 'Analysis results are calibrated to your career transition goals and industry expectations. Focus on the highest-impact improvements first, typically executive communication structure and framework application.',
      careerContext: 'Analysis insights become practice module recommendations, creating a personalized development path based on your actual communication patterns.',
      videoTutorial: 'understanding-analysis-results.mp4',
      relatedTopics: ['Communication Patterns', 'Analysis Insights', 'Improvement Planning']
    }
  }
]

// Mock trigger detection - in real implementation this would be more sophisticated
const detectActiveTrigger = (pathname: string, userBehavior: any): HelpTrigger | null => {
  if (pathname.includes('/dashboard/meetings') && pathname.includes('upload')) {
    return 'MEETING_UPLOAD_PAGE'
  }
  if (pathname.includes('/dashboard/modules')) {
    return 'PRACTICE_MODULE_SELECTION'
  }
  if (pathname.includes('/dashboard') && userBehavior?.timeOnPage > 30000) {
    return 'DASHBOARD_CONFUSION'
  }
  if (pathname.includes('/analysis') || pathname.includes('/feedback')) {
    return 'ANALYSIS_RESULTS_VIEW'
  }
  return null
}

interface ContextualHelpProviderProps {
  currentPath: string
  userCareerTransition: CareerTransitionType
  userBehavior?: any
  onHelpInteraction?: (helpId: string, action: string) => void
}

export default function ContextualHelpProvider({
  currentPath,
  userCareerTransition,
  userBehavior,
  onHelpInteraction
}: ContextualHelpProviderProps) {
  const [activeHelp, setActiveHelp] = useState<ContextualHelp | null>(null)
  const [dismissedHelp, setDismissedHelp] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const activeTrigger = detectActiveTrigger(currentPath, userBehavior)
    
    if (activeTrigger) {
      const relevantHelp = mockContextualHelp.find(help => 
        help.trigger === activeTrigger && 
        !dismissedHelp.includes(help.id) &&
        (help.careerRelevance === 'ALL_LEVELS' || help.careerRelevance === userCareerTransition)
      )
      
      if (relevantHelp && relevantHelp.id !== activeHelp?.id) {
        setActiveHelp(relevantHelp)
        setIsVisible(true)
      }
    } else {
      setIsVisible(false)
    }
  }, [currentPath, userCareerTransition, userBehavior, dismissedHelp, activeHelp?.id])

  const dismissHelp = () => {
    if (activeHelp) {
      setDismissedHelp(prev => [...prev, activeHelp.id])
      onHelpInteraction?.(activeHelp.id, 'dismissed')
    }
    setIsVisible(false)
  }

  const interactWithHelp = (action: string) => {
    if (activeHelp) {
      onHelpInteraction?.(activeHelp.id, action)
    }
  }

  if (!isVisible || !activeHelp) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50 animate-in slide-in-from-bottom-2">
      <Card className="border-blue-200 bg-blue-50 shadow-lg">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <HelpCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 text-sm">{activeHelp.helpContent.title}</h4>
                <Badge variant="secondary" className="text-xs mt-1">
                  {activeHelp.careerRelevance.replace('_', ' → ')}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={dismissHelp}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Tips */}
          <div className="space-y-2 mb-4">
            <h5 className="text-sm font-medium text-blue-800 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Quick Tips
            </h5>
            <ul className="space-y-1">
              {activeHelp.helpContent.quickTips.slice(0, 2).map((tip, index) => (
                <li key={index} className="text-xs text-blue-700 flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Career Context */}
          <div className="p-3 bg-white/50 rounded border border-blue-200 mb-4">
            <div className="flex items-start gap-2">
              <Target className="h-3 w-3 mt-0.5 text-blue-600" />
              <div>
                <h6 className="text-xs font-medium text-blue-800 mb-1">Career Impact</h6>
                <p className="text-xs text-blue-700">{activeHelp.helpContent.careerContext}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs"
              onClick={() => interactWithHelp('learn-more')}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Learn More
            </Button>
            {activeHelp.helpContent.videoTutorial && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs"
                onClick={() => interactWithHelp('watch-video')}
              >
                <PlayCircle className="h-3 w-3 mr-1" />
                Video
              </Button>
            )}
          </div>

          {/* Related Topics */}
          {activeHelp.helpContent.relatedTopics && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex flex-wrap gap-1">
                {activeHelp.helpContent.relatedTopics.slice(0, 3).map((topic) => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-blue-100"
                    onClick={() => interactWithHelp(`related-topic-${topic}`)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}