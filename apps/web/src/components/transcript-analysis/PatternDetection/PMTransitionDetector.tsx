/**
 * PM Transition Detector - Identifies career progression communication patterns
 * ShipSpeak Slice 5: Career-specific pattern analysis and transition readiness assessment
 */

import React from 'react'
import { 
  PMTransitionDetection, 
  TransitionMarkers, 
  PatternDetection,
  TransitionBlocker,
  TransitionAccelerator
} from '../../../types/transcript-analysis'
import { PMCareerLevel } from '../../../types/competency'

interface PMTransitionDetectorProps {
  currentLevel: PMCareerLevel
  targetLevel: PMCareerLevel
  transcriptContent: string
  speakerSegments: any[]
  onDetectionComplete: (results: PMTransitionDetection) => void
}

export const PMTransitionDetector: React.FC<PMTransitionDetectorProps> = ({
  currentLevel,
  targetLevel,
  transcriptContent,
  speakerSegments,
  onDetectionComplete
}) => {
  const [detectionProgress, setDetectionProgress] = React.useState(0)

  const analyzeTransitionPatterns = React.useCallback(async () => {
    setDetectionProgress(10)

    // Analyze PO → PM transition patterns
    const poToPMMarkers = await analyzePOToPMTransition(transcriptContent, speakerSegments)
    setDetectionProgress(30)

    // Analyze PM → Senior PM transition patterns
    const pmToSeniorMarkers = await analyzePMToSeniorTransition(transcriptContent, speakerSegments)
    setDetectionProgress(50)

    // Analyze Senior PM → Group PM transition patterns
    const seniorToGroupMarkers = await analyzeSeniorToGroupTransition(transcriptContent, speakerSegments)
    setDetectionProgress(70)

    // Analyze Group PM → Director transition patterns
    const groupToDirectorMarkers = await analyzeGroupToDirectorTransition(transcriptContent, speakerSegments)
    setDetectionProgress(85)

    // Calculate overall transition readiness
    const transitionIndicators: TransitionMarkers = {
      poToPM: poToPMMarkers,
      pmToSeniorPM: pmToSeniorMarkers,
      seniorPMToGroupPM: seniorToGroupMarkers,
      groupPMToDirector: groupToDirectorMarkers
    }

    const progressScore = calculateTransitionReadiness(currentLevel, targetLevel, transitionIndicators)
    const blockers = identifyTransitionBlockers(currentLevel, targetLevel, transitionIndicators)
    const accelerators = identifyTransitionAccelerators(currentLevel, targetLevel, transitionIndicators)

    setDetectionProgress(100)

    const results: PMTransitionDetection = {
      currentLevel,
      targetLevel,
      transitionIndicators,
      progressScore,
      blockers,
      accelerators
    }

    onDetectionComplete(results)
  }, [currentLevel, targetLevel, transcriptContent, speakerSegments, onDetectionComplete])

  React.useEffect(() => {
    analyzeTransitionPatterns()
  }, [analyzeTransitionPatterns])

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-blue-800 font-medium">PM Transition Analysis</h3>
        <span className="text-blue-600 text-sm">{detectionProgress}%</span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${detectionProgress}%` }}
        />
      </div>
      <p className="text-blue-600 text-sm mt-2">
        Analyzing {currentLevel} → {targetLevel} transition patterns...
      </p>
    </div>
  )
}

// Analysis functions for different transition types
const analyzePOToPMTransition = async (content: string, segments: any[]) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  return {
    strategicLanguageEmergence: analyzeStrategicLanguage(content),
    businessImpactReasoning: analyzeBusinessImpactReasoning(content),
    stakeholderCommunicationEvolution: analyzeStakeholderCommunication(content),
    decisionFrameworkApplication: analyzeDecisionFrameworks(content),
    deliveryToOutcomesShift: analyzeOutcomesFocus(content)
  }
}

const analyzePMToSeniorTransition = async (content: string, segments: any[]) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  return {
    executiveCommunicationStructure: analyzeExecutiveStructure(content),
    tradeoffArticulationSophistication: analyzeTradeoffArticulation(content),
    influenceWithoutAuthority: analyzeInfluencePatterns(content),
    strategicAltitudeControl: analyzeStrategicAltitude(content),
    frameworkMastery: analyzeFrameworkMastery(content)
  }
}

const analyzeSeniorToGroupTransition = async (content: string, segments: any[]) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    portfolioThinkingLanguage: analyzePortfolioThinking(content),
    coachingCommunicationEmergence: analyzeCoachingCommunication(content),
    organizationalImpactAwareness: analyzeOrganizationalImpact(content),
    resourceAllocationReasoning: analyzeResourceAllocation(content),
    crossProductStrategy: analyzeCrossProductStrategy(content)
  }
}

const analyzeGroupToDirectorTransition = async (content: string, segments: any[]) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    boardPresentationReadiness: analyzeBoardReadiness(content),
    businessModelFluency: analyzeBusinessModelFluency(content),
    marketStrategyCommunication: analyzeMarketStrategy(content),
    organizationalLeadership: analyzeOrganizationalLeadership(content),
    visionCommunication: analyzeVisionCommunication(content)
  }
}

// Individual pattern analysis functions
const analyzeStrategicLanguage = (content: string): PatternDetection => {
  const strategicTerms = ['strategy', 'strategic', 'long-term', 'vision', 'roadmap', 'competitive advantage']
  const businessTerms = ['revenue', 'market share', 'customer value', 'ROI', 'business impact']
  
  const strategicCount = countTermOccurrences(content, strategicTerms)
  const businessCount = countTermOccurrences(content, businessTerms)
  const totalTerms = strategicCount + businessCount
  
  return {
    detected: totalTerms > 3,
    confidence: Math.min(totalTerms * 15, 100),
    frequency: totalTerms,
    examples: extractExamples(content, [...strategicTerms, ...businessTerms]),
    improvement: totalTerms > 5 ? 'STRONG' : totalTerms > 2 ? 'EMERGING' : 'WEAK',
    benchmarkComparison: Math.min(totalTerms * 12, 95)
  }
}

const analyzeBusinessImpactReasoning = (content: string): PatternDetection => {
  const impactTerms = ['customer', 'user', 'revenue', 'cost', 'efficiency', 'value', 'outcome', 'business impact']
  const reasoningTerms = ['because', 'therefore', 'as a result', 'this leads to', 'which means']
  
  const impactCount = countTermOccurrences(content, impactTerms)
  const reasoningCount = countTermOccurrences(content, reasoningTerms)
  
  return {
    detected: impactCount > 2 && reasoningCount > 1,
    confidence: Math.min((impactCount + reasoningCount) * 12, 100),
    frequency: impactCount + reasoningCount,
    examples: extractExamples(content, [...impactTerms, ...reasoningTerms]),
    improvement: (impactCount + reasoningCount) > 6 ? 'STRONG' : 'EMERGING',
    benchmarkComparison: Math.min((impactCount + reasoningCount) * 10, 90)
  }
}

const analyzeExecutiveStructure = (content: string): PatternDetection => {
  const structurePatterns = [
    'recommend', 'conclusion', 'bottom line', 'key takeaway',
    'three main points', 'in summary', 'to conclude'
  ]
  
  const structureCount = countTermOccurrences(content, structurePatterns)
  
  return {
    detected: structureCount > 1,
    confidence: Math.min(structureCount * 25, 100),
    frequency: structureCount,
    examples: extractExamples(content, structurePatterns),
    improvement: structureCount > 2 ? 'STRONG' : structureCount > 0 ? 'EMERGING' : 'WEAK',
    benchmarkComparison: Math.min(structureCount * 20, 85)
  }
}

const analyzeFrameworkMastery = (content: string): PatternDetection => {
  const frameworks = ['RICE', 'ICE', 'OKR', 'KPI', 'North Star', 'Jobs to be Done', 'SWOT']
  const frameworkCount = countTermOccurrences(content, frameworks)
  
  return {
    detected: frameworkCount > 0,
    confidence: Math.min(frameworkCount * 30, 100),
    frequency: frameworkCount,
    examples: extractExamples(content, frameworks),
    improvement: frameworkCount > 2 ? 'STRONG' : frameworkCount > 0 ? 'EMERGING' : 'WEAK',
    benchmarkComparison: Math.min(frameworkCount * 25, 95)
  }
}

// Additional pattern analysis functions (simplified for brevity)
const analyzeStakeholderCommunication = (content: string): PatternDetection => mockPatternDetection(content, ['stakeholder', 'alignment', 'communication'])
const analyzeDecisionFrameworks = (content: string): PatternDetection => mockPatternDetection(content, ['decision', 'criteria', 'framework'])
const analyzeOutcomesFocus = (content: string): PatternDetection => mockPatternDetection(content, ['outcome', 'result', 'impact'])
const analyzeTradeoffArticulation = (content: string): PatternDetection => mockPatternDetection(content, ['tradeoff', 'trade-off', 'balance'])
const analyzeInfluencePatterns = (content: string): PatternDetection => mockPatternDetection(content, ['influence', 'persuade', 'align'])
const analyzeStrategicAltitude = (content: string): PatternDetection => mockPatternDetection(content, ['strategic', 'high-level', 'zoom out'])
const analyzePortfolioThinking = (content: string): PatternDetection => mockPatternDetection(content, ['portfolio', 'products', 'prioritization'])
const analyzeCoachingCommunication = (content: string): PatternDetection => mockPatternDetection(content, ['coaching', 'mentoring', 'development'])
const analyzeOrganizationalImpact = (content: string): PatternDetection => mockPatternDetection(content, ['organization', 'team', 'department'])
const analyzeResourceAllocation = (content: string): PatternDetection => mockPatternDetection(content, ['resources', 'headcount', 'budget'])
const analyzeCrossProductStrategy = (content: string): PatternDetection => mockPatternDetection(content, ['cross-product', 'platform', 'ecosystem'])
const analyzeBoardReadiness = (content: string): PatternDetection => mockPatternDetection(content, ['board', 'executive', 'leadership'])
const analyzeBusinessModelFluency = (content: string): PatternDetection => mockPatternDetection(content, ['business model', 'monetization', 'P&L'])
const analyzeMarketStrategy = (content: string): PatternDetection => mockPatternDetection(content, ['market', 'competitive', 'positioning'])
const analyzeOrganizationalLeadership = (content: string): PatternDetection => mockPatternDetection(content, ['leadership', 'vision', 'culture'])
const analyzeVisionCommunication = (content: string): PatternDetection => mockPatternDetection(content, ['vision', 'future', 'direction'])

// Helper functions
const countTermOccurrences = (content: string, terms: string[]): number => {
  const lowerContent = content.toLowerCase()
  return terms.reduce((count, term) => {
    const regex = new RegExp(term.toLowerCase(), 'gi')
    const matches = lowerContent.match(regex)
    return count + (matches ? matches.length : 0)
  }, 0)
}

const extractExamples = (content: string, terms: string[], maxExamples: number = 3): any[] => {
  const examples: any[] = []
  const lowerContent = content.toLowerCase()
  
  for (const term of terms.slice(0, maxExamples)) {
    const index = lowerContent.indexOf(term.toLowerCase())
    if (index !== -1) {
      const start = Math.max(0, index - 20)
      const end = Math.min(content.length, index + term.length + 20)
      examples.push({
        text: content.substring(start, end),
        timestamp: Math.floor(Math.random() * 1800), // Mock timestamp
        context: 'Meeting discussion',
        strength: Math.floor(Math.random() * 30) + 70
      })
    }
  }
  
  return examples
}

const mockPatternDetection = (content: string, terms: string[]): PatternDetection => {
  const count = countTermOccurrences(content, terms)
  return {
    detected: count > 0,
    confidence: Math.min(count * 20, 90),
    frequency: count,
    examples: extractExamples(content, terms),
    improvement: count > 2 ? 'STRONG' : count > 0 ? 'EMERGING' : 'WEAK',
    benchmarkComparison: Math.min(count * 15, 80)
  }
}

const calculateTransitionReadiness = (
  currentLevel: PMCareerLevel, 
  targetLevel: PMCareerLevel, 
  indicators: TransitionMarkers
): number => {
  // Simplified calculation based on current→target transition
  const transitionMap = {
    'IC_SENIOR': calculatePOToPMReadiness(indicators.poToPM),
    'SENIOR_STAFF': calculatePMToSeniorReadiness(indicators.pmToSeniorPM),
    'STAFF_PRINCIPAL': calculateSeniorToGroupReadiness(indicators.seniorPMToGroupPM),
    'PRINCIPAL_DIRECTOR': calculateGroupToDirectorReadiness(indicators.groupPMToDirector)
  }
  
  const transitionKey = `${currentLevel}_${targetLevel}` as keyof typeof transitionMap
  return transitionMap[transitionKey] || 50
}

const calculatePOToPMReadiness = (markers: any): number => {
  const scores = [
    markers.strategicLanguageEmergence.confidence,
    markers.businessImpactReasoning.confidence,
    markers.stakeholderCommunicationEvolution.confidence,
    markers.decisionFrameworkApplication.confidence,
    markers.deliveryToOutcomesShift.confidence
  ]
  return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
}

const calculatePMToSeniorReadiness = (markers: any): number => {
  const scores = [
    markers.executiveCommunicationStructure.confidence,
    markers.tradeoffArticulationSophistication.confidence,
    markers.influenceWithoutAuthority.confidence,
    markers.strategicAltitudeControl.confidence,
    markers.frameworkMastery.confidence
  ]
  return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
}

const calculateSeniorToGroupReadiness = (markers: any): number => {
  const scores = [
    markers.portfolioThinkingLanguage.confidence,
    markers.coachingCommunicationEmergence.confidence,
    markers.organizationalImpactAwareness.confidence,
    markers.resourceAllocationReasoning.confidence,
    markers.crossProductStrategy.confidence
  ]
  return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
}

const calculateGroupToDirectorReadiness = (markers: any): number => {
  const scores = [
    markers.boardPresentationReadiness.confidence,
    markers.businessModelFluency.confidence,
    markers.marketStrategyCommunication.confidence,
    markers.organizationalLeadership.confidence,
    markers.visionCommunication.confidence
  ]
  return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
}

const identifyTransitionBlockers = (
  currentLevel: PMCareerLevel,
  targetLevel: PMCareerLevel,
  indicators: TransitionMarkers
): TransitionBlocker[] => {
  const blockers: TransitionBlocker[] = []
  
  // Example blocker identification logic
  if (currentLevel === 'IC' && targetLevel === 'SENIOR') {
    const poMarkers = indicators.poToPM
    if (poMarkers.strategicLanguageEmergence.confidence < 60) {
      blockers.push({
        type: 'FEATURE_FOCUSED_THINKING',
        severity: 'MEDIUM',
        description: 'Language still focused on features rather than strategic outcomes',
        examples: ['Feature delivery language', 'Technical implementation focus'],
        actionableSteps: ['Practice outcome-focused language', 'Use business impact framing']
      })
    }
  }
  
  return blockers
}

const identifyTransitionAccelerators = (
  currentLevel: PMCareerLevel,
  targetLevel: PMCareerLevel,
  indicators: TransitionMarkers
): TransitionAccelerator[] => {
  const accelerators: TransitionAccelerator[] = []
  
  // Example accelerator identification logic
  if (currentLevel === 'IC' && targetLevel === 'SENIOR') {
    const poMarkers = indicators.poToPM
    if (poMarkers.decisionFrameworkApplication.confidence > 80) {
      accelerators.push({
        type: 'FRAMEWORK_MASTERY',
        strength: 'STRONG',
        description: 'Strong framework application demonstrates analytical thinking',
        examples: ['RICE framework usage', 'Clear decision criteria'],
        leverageOpportunities: ['Teach frameworks to team', 'Lead framework adoption']
      })
    }
  }
  
  return accelerators
}

export default PMTransitionDetector