/**
 * Industry Context Analyzer - Analyzes industry-specific communication patterns
 * ShipSpeak Slice 5: Industry-contextualized pattern recognition and vocabulary analysis
 */

import React from 'react'
import { 
  IndustryPatternAnalysis,
  IndustryMarkers,
  VocabularyFluency,
  CompliancePattern,
  PatternDetection
} from '../../../types/transcript-analysis'
import { IndustryType } from '../../../types/competency'

interface IndustryContextAnalyzerProps {
  industry: IndustryType
  transcriptContent: string
  userCareerLevel: string
  onAnalysisComplete: (results: IndustryPatternAnalysis) => void
}

export const IndustryContextAnalyzer: React.FC<IndustryContextAnalyzerProps> = ({
  industry,
  transcriptContent,
  userCareerLevel,
  onAnalysisComplete
}) => {
  const [analysisStage, setAnalysisStage] = React.useState<string>('INITIALIZING')
  const [progress, setProgress] = React.useState(0)

  const analyzeIndustryPatterns = React.useCallback(async () => {
    try {
      setAnalysisStage('VOCABULARY_ANALYSIS')
      setProgress(20)

      // Analyze industry-specific vocabulary usage
      const vocabularyFluency = await analyzeVocabularyFluency(transcriptContent, industry)

      setAnalysisStage('INDUSTRY_MARKERS')
      setProgress(50)

      // Detect industry-specific communication markers
      const industryMarkers = await detectIndustryMarkers(transcriptContent, industry)

      setAnalysisStage('COMPLIANCE_PATTERNS')
      setProgress(75)

      // Analyze compliance and regulatory communication patterns
      const compliancePatterns = await analyzeCompliancePatterns(transcriptContent, industry)

      setAnalysisStage('BENCHMARK_COMPARISON')
      setProgress(90)

      // Compare against industry benchmarks
      const benchmarkComparison = await generateBenchmarkComparison(vocabularyFluency, industry, userCareerLevel)

      setProgress(100)
      setAnalysisStage('COMPLETED')

      const results: IndustryPatternAnalysis = {
        industryType: industry,
        industrySpecificMarkers: industryMarkers,
        compliancePatterns,
        vocabularyFluency,
        benchmarkComparison
      }

      onAnalysisComplete(results)

    } catch (error) {
      console.error('Industry analysis failed:', error)
      setAnalysisStage('ERROR')
    }
  }, [transcriptContent, industry, userCareerLevel, onAnalysisComplete])

  React.useEffect(() => {
    analyzeIndustryPatterns()
  }, [analyzeIndustryPatterns])

  if (analysisStage === 'ERROR') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Industry Analysis Failed</h3>
        <p className="text-red-600 text-sm">Unable to analyze industry-specific patterns.</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-green-800 font-medium">
          {getIndustryLabel(industry)} Pattern Analysis
        </h3>
        <span className="text-green-600 text-sm">{progress}%</span>
      </div>
      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-green-600 text-sm mt-2">{getStageDescription(analysisStage)}</p>
    </div>
  )
}

// Industry-specific analysis functions
const analyzeVocabularyFluency = async (content: string, industry: IndustryType): Promise<VocabularyFluency> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const industryTerms = getIndustryTerms(industry)
  const industryTermsUsage = calculateTermUsage(content, industryTerms)
  const contextualAppropriateness = analyzeContextualUsage(content, industryTerms)
  const sophisticationLevel = analyzeSophisticationLevel(content, industry)
  const professionalCredibility = calculateCredibilityScore(industryTermsUsage, contextualAppropriateness, sophisticationLevel)

  return {
    industryTermsUsage,
    contextualAppropriateness,
    sophisticationLevel,
    professionalCredibility
  }
}

const detectIndustryMarkers = async (content: string, industry: IndustryType): Promise<IndustryMarkers> => {
  await new Promise(resolve => setTimeout(resolve, 600))

  switch (industry) {
    case 'HEALTHCARE':
      return { healthcare: await analyzeHealthcareMarkers(content) }
    case 'CYBERSECURITY':
      return { cybersecurity: await analyzeCybersecurityMarkers(content) }
    case 'FINTECH':
      return { fintech: await analyzeFintechMarkers(content) }
    case 'ENTERPRISE':
      return { enterprise: await analyzeEnterpriseMarkers(content) }
    case 'CONSUMER':
      return { consumer: await analyzeConsumerMarkers(content) }
    default:
      return {}
  }
}

// Healthcare industry markers
const analyzeHealthcareMarkers = async (content: string) => {
  const regulatoryTerms = ['FDA', 'HIPAA', 'clinical trial', 'regulatory', 'compliance', 'safety', 'efficacy']
  const patientTerms = ['patient', 'outcome', 'safety', 'care', 'treatment', 'health']
  const evidenceTerms = ['evidence', 'clinical data', 'study', 'research', 'trial', 'peer review']
  const complianceTerms = ['regulation', 'guideline', 'standard', 'requirement', 'protocol']

  return {
    regulatoryLanguageProficiency: analyzeTermPattern(content, regulatoryTerms),
    patientOutcomePrioritization: analyzeTermPattern(content, patientTerms),
    evidenceBasedReasoning: analyzeTermPattern(content, evidenceTerms),
    complianceFrameworkUsage: analyzeTermPattern(content, complianceTerms),
    clinicalEvidenceIntegration: analyzeEvidenceIntegration(content)
  }
}

// Cybersecurity industry markers
const analyzeCybersecurityMarkers = async (content: string) => {
  const riskTerms = ['risk', 'threat', 'vulnerability', 'exposure', 'attack vector', 'security posture']
  const technicalTerms = ['encryption', 'authentication', 'authorization', 'zero trust', 'firewall', 'endpoint']
  const complianceTerms = ['SOC 2', 'ISO 27001', 'GDPR', 'compliance', 'audit', 'control']
  const zeroTrustTerms = ['zero trust', 'least privilege', 'micro-segmentation', 'identity verification']

  return {
    riskCommunicationEffectiveness: analyzeTermPattern(content, riskTerms),
    technicalTranslationCompetency: analyzeTermPattern(content, technicalTerms),
    complianceFrameworkIntegration: analyzeTermPattern(content, complianceTerms),
    zeroTrustArchitecture: analyzeTermPattern(content, zeroTrustTerms),
    threatAssessmentArticulation: analyzeThreatAssessment(content)
  }
}

// Fintech industry markers
const analyzeFintechMarkers = async (content: string) => {
  const regulatoryTerms = ['SEC', 'banking regulation', 'financial regulation', 'KYC', 'AML', 'compliance']
  const riskTerms = ['financial risk', 'credit risk', 'operational risk', 'fraud', 'risk management']
  const trustTerms = ['trust', 'security', 'privacy', 'transparency', 'reliability']
  const auditTerms = ['audit', 'regulatory reporting', 'compliance', 'financial controls']

  return {
    regulatoryComplianceCommunication: analyzeTermPattern(content, regulatoryTerms),
    riskManagementIntegration: analyzeTermPattern(content, riskTerms),
    trustBuildingLanguage: analyzeTermPattern(content, trustTerms),
    auditReadiness: analyzeTermPattern(content, auditTerms),
    financialImpactArticulation: analyzeFinancialImpact(content)
  }
}

// Enterprise industry markers
const analyzeEnterpriseMarkers = async (content: string) => {
  const roiTerms = ['ROI', 'return on investment', 'business value', 'cost savings', 'efficiency']
  const implementationTerms = ['implementation', 'deployment', 'rollout', 'change management']
  const customerTerms = ['customer success', 'customer advocacy', 'reference', 'case study']
  const salesTerms = ['enterprise sales', 'deal support', 'stakeholder management']

  return {
    roiCommunicationCompetency: analyzeTermPattern(content, roiTerms),
    implementationPlanning: analyzeTermPattern(content, implementationTerms),
    customerAdvocacyDevelopment: analyzeTermPattern(content, customerTerms),
    enterpriseSalesSupport: analyzeTermPattern(content, salesTerms),
    changeManagementCommunication: analyzeChangeManagement(content)
  }
}

// Consumer industry markers
const analyzeConsumerMarkers = async (content: string) => {
  const uxTerms = ['user experience', 'UX', 'usability', 'user research', 'design', 'interface']
  const growthTerms = ['DAU', 'MAU', 'retention', 'churn', 'engagement', 'viral', 'growth']
  const iterationTerms = ['A/B test', 'experiment', 'iteration', 'MVP', 'rapid prototyping']
  const platformTerms = ['platform', 'ecosystem', 'network effects', 'marketplace']

  return {
    userExperienceCommunication: analyzeTermPattern(content, uxTerms),
    growthMetricsFluency: analyzeTermPattern(content, growthTerms),
    rapidIterationFramework: analyzeTermPattern(content, iterationTerms),
    platformThinking: analyzeTermPattern(content, platformTerms),
    behavioralPsychologyIntegration: analyzeBehavioralPsychology(content)
  }
}

// Helper analysis functions
const analyzeTermPattern = (content: string, terms: string[]): PatternDetection => {
  const occurrences = countTermOccurrences(content, terms)
  const confidence = Math.min(occurrences * 15, 95)
  
  return {
    detected: occurrences > 0,
    confidence,
    frequency: occurrences,
    examples: extractTermExamples(content, terms),
    improvement: occurrences > 3 ? 'STRONG' : occurrences > 1 ? 'EMERGING' : 'WEAK',
    benchmarkComparison: Math.min(occurrences * 12, 90)
  }
}

const countTermOccurrences = (content: string, terms: string[]): number => {
  const lowerContent = content.toLowerCase()
  return terms.reduce((count, term) => {
    const regex = new RegExp(term.toLowerCase(), 'gi')
    const matches = lowerContent.match(regex)
    return count + (matches ? matches.length : 0)
  }, 0)
}

const extractTermExamples = (content: string, terms: string[]): any[] => {
  const examples: any[] = []
  const lowerContent = content.toLowerCase()
  
  for (const term of terms.slice(0, 3)) {
    const index = lowerContent.indexOf(term.toLowerCase())
    if (index !== -1) {
      const start = Math.max(0, index - 15)
      const end = Math.min(content.length, index + term.length + 15)
      examples.push({
        text: content.substring(start, end),
        timestamp: Math.floor(Math.random() * 1800),
        context: 'Industry-specific usage',
        strength: Math.floor(Math.random() * 30) + 70
      })
    }
  }
  
  return examples
}

const calculateTermUsage = (content: string, terms: string[]): number => {
  const wordCount = content.split(/\s+/).length
  const termCount = countTermOccurrences(content, terms)
  return Math.min((termCount / wordCount) * 1000, 100) // Normalize to percentage
}

const analyzeContextualUsage = (content: string, terms: string[]): number => {
  // Simplified contextual analysis
  const contextualScore = 75 + Math.floor(Math.random() * 20) // Mock score 75-95
  return contextualScore
}

const analyzeSophisticationLevel = (content: string, industry: IndustryType): number => {
  // Simplified sophistication analysis
  const sophisticationScore = 70 + Math.floor(Math.random() * 25) // Mock score 70-95
  return sophisticationScore
}

const calculateCredibilityScore = (usage: number, appropriateness: number, sophistication: number): number => {
  return Math.round((usage * 0.3 + appropriateness * 0.4 + sophistication * 0.3))
}

const analyzeCompliancePatterns = async (content: string, industry: IndustryType): Promise<CompliancePattern[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const patterns: CompliancePattern[] = []
  
  switch (industry) {
    case 'HEALTHCARE':
      patterns.push({
        frameworkType: 'HIPAA Compliance',
        adherenceLevel: 78,
        riskAreas: ['Data handling discussions', 'Patient information references'],
        strengthAreas: ['Privacy awareness', 'Security protocols']
      })
      break
    case 'CYBERSECURITY':
      patterns.push({
        frameworkType: 'SOC 2 Controls',
        adherenceLevel: 82,
        riskAreas: ['Access control procedures'],
        strengthAreas: ['Security frameworks', 'Risk assessment']
      })
      break
    case 'FINTECH':
      patterns.push({
        frameworkType: 'Financial Regulations',
        adherenceLevel: 75,
        riskAreas: ['Consumer protection', 'Data privacy'],
        strengthAreas: ['Risk management', 'Audit procedures']
      })
      break
  }
  
  return patterns
}

const generateBenchmarkComparison = async (vocabulary: VocabularyFluency, industry: IndustryType, careerLevel: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    industryAverage: 68,
    topPerformers: 87,
    userPercentile: Math.round(vocabulary.professionalCredibility * 0.8), // Approximate percentile
    competitivePosition: vocabulary.professionalCredibility > 80 ? 'LEADING' : 
                       vocabulary.professionalCredibility > 65 ? 'COMPETITIVE' : 
                       vocabulary.professionalCredibility > 50 ? 'DEVELOPING' : 'CONCERNING'
  } as const
}

// Industry-specific specialized analysis functions
const analyzeEvidenceIntegration = (content: string): PatternDetection => {
  const evidenceTerms = ['evidence shows', 'data indicates', 'studies demonstrate', 'research confirms']
  return analyzeTermPattern(content, evidenceTerms)
}

const analyzeThreatAssessment = (content: string): PatternDetection => {
  const threatTerms = ['threat assessment', 'risk evaluation', 'vulnerability analysis', 'security assessment']
  return analyzeTermPattern(content, threatTerms)
}

const analyzeFinancialImpact = (content: string): PatternDetection => {
  const financialTerms = ['financial impact', 'cost-benefit', 'revenue impact', 'P&L', 'budget']
  return analyzeTermPattern(content, financialTerms)
}

const analyzeChangeManagement = (content: string): PatternDetection => {
  const changeTerms = ['change management', 'transformation', 'adoption', 'training', 'communication plan']
  return analyzeTermPattern(content, changeTerms)
}

const analyzeBehavioralPsychology = (content: string): PatternDetection => {
  const psychologyTerms = ['user behavior', 'behavioral psychology', 'cognitive load', 'motivation', 'habit formation']
  return analyzeTermPattern(content, psychologyTerms)
}

// Utility functions
const getIndustryTerms = (industry: IndustryType): string[] => {
  const industryTermMap = {
    HEALTHCARE: ['FDA', 'HIPAA', 'clinical', 'patient', 'regulatory', 'safety', 'efficacy', 'treatment'],
    CYBERSECURITY: ['security', 'threat', 'vulnerability', 'encryption', 'compliance', 'risk', 'audit'],
    FINTECH: ['financial', 'regulation', 'compliance', 'risk', 'fraud', 'KYC', 'AML', 'banking'],
    ENTERPRISE: ['ROI', 'implementation', 'enterprise', 'stakeholder', 'business value', 'deployment'],
    CONSUMER: ['user experience', 'engagement', 'retention', 'growth', 'A/B test', 'platform', 'UX']
  }
  
  return industryTermMap[industry] || []
}

const getIndustryLabel = (industry: IndustryType): string => {
  const labels = {
    HEALTHCARE: 'Healthcare',
    CYBERSECURITY: 'Cybersecurity', 
    FINTECH: 'Fintech',
    ENTERPRISE: 'Enterprise',
    CONSUMER: 'Consumer Technology'
  }
  return labels[industry] || industry
}

const getStageDescription = (stage: string): string => {
  const descriptions = {
    'INITIALIZING': 'Initializing industry analysis...',
    'VOCABULARY_ANALYSIS': 'Analyzing industry vocabulary usage',
    'INDUSTRY_MARKERS': 'Detecting industry-specific patterns',
    'COMPLIANCE_PATTERNS': 'Analyzing compliance communication',
    'BENCHMARK_COMPARISON': 'Comparing against industry benchmarks',
    'COMPLETED': 'Industry analysis complete',
    'ERROR': 'Analysis failed'
  }
  return descriptions[stage] || stage
}

export default IndustryContextAnalyzer