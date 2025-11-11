/**
 * StructureAnalyzer - Communication structure assessment
 * Analyzes response structure, clarity, and logical flow
 */

import React from 'react'
import { ResponseStructure, LogicalFlowAssessment, CommunicationPattern } from '@/types/module-content'

export class StructureAnalyzer {
  analyzeStructure(response: string): ResponseStructure {
    const lowerResponse = response.toLowerCase()
    
    // Answer-first detection
    const answerFirstPatterns = [
      'i recommend', 'my recommendation', 'we should', 'i believe', 'i suggest',
      'the answer is', 'my analysis shows', 'i propose', 'based on analysis'
    ]
    const hasAnswerFirst = answerFirstPatterns.some(pattern => 
      lowerResponse.startsWith(pattern) || lowerResponse.includes(`. ${pattern}`)
    )

    // Logical flow analysis
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const hasTransitions = this.hasLogicalTransitions(response)
    const logicalProgression = this.assessLogicalProgression(sentences)

    // Clarity metrics
    const clarity = this.assessClarity(response, sentences)
    
    // Conciseness analysis
    const conciseness = this.assessConciseness(response, sentences)
    
    // Completeness check
    const completeness = this.assessCompleteness(response)
    
    // Stakeholder adaptation (basic check for audience awareness)
    const stakeholderAdaptation = this.assessStakeholderAdaptation(response)

    return {
      hasAnswerFirst,
      logicalFlow: logicalProgression ? 'EXCELLENT' : hasTransitions ? 'GOOD' : 'FAIR',
      clarity,
      conciseness,
      completeness,
      stakeholderAdaptation
    }
  }

  identifyPatterns(response: string): CommunicationPattern[] {
    const patterns: CommunicationPattern[] = []
    const lowerResponse = response.toLowerCase()

    // Answer-first pattern
    if (this.hasAnswerFirstPattern(response)) {
      patterns.push({
        pattern: 'Answer-First',
        description: 'Leads with conclusion or recommendation',
        appropriateUse: ['Executive presentations', 'Decision meetings', 'Status updates'],
        commonMistakes: ['Burying the lead', 'Building too much suspense'],
        examples: ['I recommend we prioritize...', 'Based on analysis, we should...']
      })
    }

    // Pyramid structure
    if (this.hasPyramidStructure(response)) {
      patterns.push({
        pattern: 'Pyramid Principle',
        description: 'Structured with main point followed by supporting arguments',
        appropriateUse: ['Business cases', 'Strategy presentations', 'Consulting reports'],
        commonMistakes: ['Too many supporting points', 'Weak main argument'],
        examples: ['Three reasons support this: First... Second... Third...']
      })
    }

    // Data-driven pattern
    if (this.hasDataDrivenPattern(response)) {
      patterns.push({
        pattern: 'Data-Driven',
        description: 'Supports arguments with metrics and evidence',
        appropriateUse: ['Performance reviews', 'Investment decisions', 'Problem analysis'],
        commonMistakes: ['Data without interpretation', 'Too many metrics'],
        examples: ['Metrics show...', 'Analysis reveals...', 'Data indicates...']
      })
    }

    return patterns
  }

  scoreClarity(response: string): number {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = response.split(/\s+/).filter(w => w.trim().length > 0)
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
    
    // Optimal sentence length for business communication: 10-25 words
    let clarityScore = 7 // Higher base score
    
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) clarityScore = 9
    else if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 30) clarityScore = 8
    else if (avgWordsPerSentence >= 6 && avgWordsPerSentence <= 35) clarityScore = 7
    
    // Bonus for good structure
    if (this.hasAnswerFirstPattern(response)) clarityScore += 0.5
    if (this.hasLogicalTransitions(response)) clarityScore += 0.5
    
    // Adjust for complexity indicators (more lenient)
    const complexWords = this.countComplexWords(response)
    const jargonCount = this.countJargon(response)
    
    clarityScore -= Math.min(1, complexWords / 15) // More lenient
    clarityScore -= Math.min(0.5, jargonCount / 8) // More lenient
    
    return Math.max(2, Math.min(10, clarityScore))
  }

  assessLogicalFlow(response: string): LogicalFlowAssessment {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const hasTransitions = this.hasLogicalTransitions(response)
    const hasProgression = this.assessLogicalProgression(sentences)
    
    let score = 5
    const strengths: string[] = []
    const weaknesses: string[] = []
    const suggestions: string[] = []

    if (this.hasAnswerFirstPattern(response)) {
      score += 2
      strengths.push('Clear opening with main point')
    } else {
      weaknesses.push('Missing clear opening statement')
      suggestions.push('Start with your main recommendation')
    }

    if (hasTransitions) {
      score += 1.5
      strengths.push('Good use of transition words')
    } else {
      weaknesses.push('Lacks logical connectors')
      suggestions.push('Use transitions like "therefore", "however", "additionally"')
    }

    if (hasProgression) {
      score += 1.5
      strengths.push('Logical argument progression')
    } else {
      weaknesses.push('Ideas not well connected')
      suggestions.push('Organize points in logical sequence')
    }

    if (sentences.length < 2) {
      weaknesses.push('Response too brief for complex scenarios')
      suggestions.push('Provide more detailed reasoning')
    }

    return {
      score: Math.min(10, score),
      strengths,
      weaknesses,
      suggestions
    }
  }

  private hasAnswerFirstPattern(response: string): boolean {
    const answerFirstPatterns = [
      'i recommend', 'my recommendation', 'we should', 'i believe', 'i suggest',
      'the answer is', 'my analysis shows', 'i propose'
    ]
    const lowerResponse = response.toLowerCase()
    return answerFirstPatterns.some(pattern => lowerResponse.startsWith(pattern))
  }

  private hasPyramidStructure(response: string): boolean {
    const pyramidIndicators = [
      'three reasons', 'four factors', 'key points', 'main arguments',
      'first,', 'second,', 'third,', 'finally,'
    ]
    const lowerResponse = response.toLowerCase()
    return pyramidIndicators.some(indicator => lowerResponse.includes(indicator))
  }

  private hasDataDrivenPattern(response: string): boolean {
    const dataIndicators = [
      'data shows', 'metrics indicate', 'analysis reveals', 'research suggests',
      'studies show', 'evidence suggests', 'statistics demonstrate'
    ]
    const lowerResponse = response.toLowerCase()
    return dataIndicators.some(indicator => lowerResponse.includes(indicator))
  }

  private hasLogicalTransitions(response: string): boolean {
    const transitions = [
      'therefore', 'however', 'additionally', 'furthermore', 'consequently',
      'as a result', 'because', 'since', 'thus', 'hence'
    ]
    const lowerResponse = response.toLowerCase()
    return transitions.some(transition => lowerResponse.includes(transition))
  }

  private assessLogicalProgression(sentences: string[]): boolean {
    if (sentences.length < 3) return false
    
    // Check for logical structure indicators
    const hasOpening = this.hasAnswerFirstPattern(sentences[0] || '')
    const hasSupporting = sentences.length > 1
    const hasConclusion = sentences.length > 2 && this.hasClosingPattern(sentences[sentences.length - 1] || '')
    
    return hasOpening && hasSupporting && (hasConclusion || sentences.length <= 4)
  }

  private hasClosingPattern(sentence: string): boolean {
    const closingPatterns = [
      'in conclusion', 'therefore', 'as a result', 'this means', 'next steps'
    ]
    const lowerSentence = sentence.toLowerCase()
    return closingPatterns.some(pattern => lowerSentence.includes(pattern))
  }

  private assessClarity(response: string, sentences: string[]): number {
    const words = response.split(/\s+/).filter(w => w.trim().length > 0)
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
    
    let clarity = 8 // Higher base score
    
    // Sentence length scoring (more generous)
    if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 30) clarity += 1
    else if (avgWordsPerSentence >= 6 && avgWordsPerSentence <= 40) clarity += 0.5
    else if (avgWordsPerSentence > 50) clarity -= 1
    
    // Word choice assessment (more lenient)
    const complexWords = this.countComplexWords(response)
    clarity -= Math.min(1, complexWords / 25)
    
    // Structure bonus
    if (this.hasAnswerFirstPattern(response)) clarity += 0.5
    if (this.hasLogicalTransitions(response)) clarity += 0.5
    
    return Math.max(3, Math.min(10, clarity))
  }

  private assessConciseness(response: string, sentences: string[]): number {
    const wordCount = response.split(' ').filter(word => word.length > 0).length
    const redundancyScore = this.assessRedundancy(response)
    
    let conciseness = 7 // Base score
    
    // Word count assessment (ideal: 50-150 words for most scenarios)
    if (wordCount >= 50 && wordCount <= 150) conciseness += 1
    else if (wordCount < 30) conciseness -= 2
    else if (wordCount > 200) conciseness -= 1
    
    // Redundancy penalty
    conciseness -= redundancyScore
    
    return Math.max(1, Math.min(10, conciseness))
  }

  private assessCompleteness(response: string): number {
    const completenessIndicators = [
      'recommendation', 'rationale', 'next steps', 'timeline', 'impact',
      'because', 'since', 'therefore', 'as a result'
    ]
    
    let completeness = 5 // Base score
    const lowerResponse = response.toLowerCase()
    
    completenessIndicators.forEach(indicator => {
      if (lowerResponse.includes(indicator)) completeness += 0.5
    })
    
    return Math.max(1, Math.min(10, completeness))
  }

  private assessStakeholderAdaptation(response: string): number {
    const stakeholderIndicators = [
      'stakeholder', 'customer', 'user', 'team', 'board', 'executive',
      'engineering', 'sales', 'marketing', 'finance'
    ]
    
    let adaptation = 5 // Base score
    const lowerResponse = response.toLowerCase()
    
    const mentionedStakeholders = stakeholderIndicators.filter(indicator => 
      lowerResponse.includes(indicator)
    ).length
    
    adaptation += Math.min(3, mentionedStakeholders)
    
    return Math.max(1, Math.min(10, adaptation))
  }

  private countComplexWords(response: string): number {
    const words = response.split(' ')
    return words.filter(word => word.length > 7 && /[A-Z]/.test(word)).length
  }

  private countJargon(response: string): number {
    const jargonWords = [
      'synergies', 'leverage', 'optimize', 'streamline', 'ecosystem',
      'paradigm', 'scalable', 'robust', 'granular', 'actionable'
    ]
    const lowerResponse = response.toLowerCase()
    return jargonWords.filter(word => lowerResponse.includes(word)).length
  }

  private assessRedundancy(response: string): number {
    const words = response.toLowerCase().split(' ')
    const uniqueWords = new Set(words)
    const redundancyRatio = (words.length - uniqueWords.size) / words.length
    
    // Return penalty score (0-3)
    return Math.min(3, redundancyRatio * 10)
  }
}

// Component for displaying structure analysis results
export interface StructureAnalysisDisplayProps {
  analysis: ResponseStructure
  logicalFlow?: LogicalFlowAssessment
  patterns?: CommunicationPattern[]
}

export function StructureAnalysisDisplay({
  analysis,
  logicalFlow,
  patterns
}: StructureAnalysisDisplayProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Structure Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Structure Analysis</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${analysis.hasAnswerFirst ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.hasAnswerFirst ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Answer-First</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(analysis.clarity)}`}>
              {analysis.clarity.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Clarity</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(analysis.conciseness)}`}>
              {analysis.conciseness.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Conciseness</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(analysis.completeness)}`}>
              {analysis.completeness.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Completeness</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 capitalize">
              {analysis.logicalFlow.toLowerCase()}
            </div>
            <div className="text-sm text-gray-600">Logical Flow</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(analysis.stakeholderAdaptation)}`}>
              {analysis.stakeholderAdaptation.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Adaptation</div>
          </div>
        </div>
      </div>

      {/* Detailed Logical Flow */}
      {logicalFlow && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Logical Flow Assessment</h4>
          
          <div className="space-y-3">
            {logicalFlow.strengths.length > 0 && (
              <div>
                <div className="text-sm font-medium text-green-800 mb-1">Strengths:</div>
                <ul className="text-sm text-green-700 list-disc list-inside">
                  {logicalFlow.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {logicalFlow.weaknesses.length > 0 && (
              <div>
                <div className="text-sm font-medium text-red-800 mb-1">Areas for Improvement:</div>
                <ul className="text-sm text-red-700 list-disc list-inside">
                  {logicalFlow.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {logicalFlow.suggestions.length > 0 && (
              <div>
                <div className="text-sm font-medium text-blue-800 mb-1">Suggestions:</div>
                <ul className="text-sm text-blue-700 list-disc list-inside">
                  {logicalFlow.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Communication Patterns */}
      {patterns && patterns.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">Identified Communication Patterns</h4>
          
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="bg-white rounded p-3">
                <div className="font-medium text-green-800">{pattern.pattern}</div>
                <div className="text-sm text-green-700 mt-1">{pattern.description}</div>
                {pattern.examples.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-green-800">Examples: </span>
                    <span className="text-xs text-green-600">
                      {pattern.examples.slice(0, 2).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}