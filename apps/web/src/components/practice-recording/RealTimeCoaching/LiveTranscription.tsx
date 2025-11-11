"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { ExerciseContext, UserProfile, CommunicationPattern, PatternType, PMFramework } from '../../../types/practice-recording'
import { MessageSquare, Brain, Clock, TrendingUp } from 'lucide-react'

interface LiveTranscriptionProps {
  mediaStream: MediaStream
  isActive: boolean
  exerciseContext: ExerciseContext
  userProfile: UserProfile
}

interface TranscriptionWord {
  word: string
  confidence: number
  timestamp: number
  isHighlighted: boolean
  pattern?: PatternType
}

interface FrameworkDetection {
  framework: PMFramework
  confidence: number
  context: string
  timestamp: number
}

export function LiveTranscription({ mediaStream, isActive, exerciseContext, userProfile }: LiveTranscriptionProps) {
  const [transcriptionText, setTranscriptionText] = useState('')
  const [words, setWords] = useState<TranscriptionWord[]>([])
  const [detectedPatterns, setDetectedPatterns] = useState<CommunicationPattern[]>([])
  const [frameworkDetections, setFrameworkDetections] = useState<FrameworkDetection[]>([])
  const [speakingRate, setSpeakingRate] = useState(0)
  const [confidenceLevel, setConfidenceLevel] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState('')
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const wordCountRef = useRef(0)
  const startTimeRef = useRef<number>(Date.now())

  // Mock speech recognition (in real implementation, this would use Web Speech API or external service)
  useEffect(() => {
    if (!isActive || !mediaStream) return

    const mockTranscription = () => {
      const samplePhrases = [
        "Based on our RICE analysis, the reach would be approximately",
        "I recommend we prioritize this initiative because",
        "The business impact shows significant ROI potential",
        "From a strategic perspective, this aligns with our Q4 objectives",
        "We need to consider the technical feasibility and resource allocation",
        "The competitive analysis indicates we have a first-mover advantage",
        "Customer feedback suggests high demand for this feature",
        "The risk assessment shows manageable implementation challenges"
      ]
      
      let phraseIndex = 0
      let wordIndex = 0
      
      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval)
          return
        }
        
        const currentPhraseWords = samplePhrases[phraseIndex].split(' ')
        
        if (wordIndex < currentPhraseWords.length) {
          const word = currentPhraseWords[wordIndex]
          const newWord: TranscriptionWord = {
            word,
            confidence: 0.85 + Math.random() * 0.15,
            timestamp: Date.now() - startTimeRef.current,
            isHighlighted: Math.random() > 0.8,
            pattern: detectWordPattern(word)
          }
          
          setWords(prev => [...prev, newWord])
          setTranscriptionText(prev => prev + (prev ? ' ' : '') + word)
          setCurrentPhrase(prev => prev + (prev ? ' ' : '') + word)
          
          wordCountRef.current++
          
          // Update speaking rate
          const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000
          setSpeakingRate(Math.round(wordCountRef.current / Math.max(elapsedMinutes, 0.1)))
          
          // Detect frameworks and patterns
          detectFrameworkUsage(currentPhraseWords.slice(0, wordIndex + 1).join(' '))
          detectCommunicationPatterns(currentPhraseWords.slice(0, wordIndex + 1).join(' '))
          
          wordIndex++
        } else {
          // Move to next phrase
          phraseIndex = (phraseIndex + 1) % samplePhrases.length
          wordIndex = 0
          setCurrentPhrase('')
          
          // Add natural pause
          setTimeout(() => {}, 1000 + Math.random() * 2000)
        }
        
        // Update overall confidence
        setConfidenceLevel(0.8 + Math.random() * 0.2)
        
      }, 400 + Math.random() * 400) // Vary speaking speed
      
      setIsListening(true)
      
      return () => {
        clearInterval(interval)
        setIsListening(false)
      }
    }
    
    const cleanup = mockTranscription()
    
    return cleanup
  }, [isActive, mediaStream])

  const detectWordPattern = (word: string): PatternType | undefined => {
    const word_lower = word.toLowerCase()
    
    if (['recommend', 'suggest', 'propose'].includes(word_lower)) {
      return 'ANSWER_FIRST'
    }
    if (['rice', 'ice', 'okr'].includes(word_lower)) {
      return 'FRAMEWORK_USAGE'
    }
    if (['might', 'maybe', 'possibly', 'perhaps'].includes(word_lower)) {
      return 'UNCERTAIN_LANGUAGE'
    }
    if (['strategic', 'executive', 'leadership'].includes(word_lower)) {
      return 'EXECUTIVE_STRUCTURE'
    }
    
    return undefined
  }

  const detectFrameworkUsage = (text: string) => {
    const frameworks = [
      { name: 'RICE' as PMFramework, keywords: ['rice', 'reach', 'impact', 'confidence', 'effort'] },
      { name: 'ICE' as PMFramework, keywords: ['ice', 'impact', 'confidence', 'ease'] },
      { name: 'JOBS_TO_BE_DONE' as PMFramework, keywords: ['jobs', 'job to be done', 'customer job', 'outcome'] },
      { name: 'OKR' as PMFramework, keywords: ['okr', 'objective', 'key result', 'measurable'] }
    ]
    
    frameworks.forEach(framework => {
      const matchCount = framework.keywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
      ).length
      
      if (matchCount >= 2) {
        const existing = frameworkDetections.find(d => d.framework === framework.name)
        if (!existing) {
          setFrameworkDetections(prev => [...prev, {
            framework: framework.name,
            confidence: Math.min(0.95, 0.6 + (matchCount * 0.15)),
            context: text.substring(Math.max(0, text.length - 100)),
            timestamp: Date.now() - startTimeRef.current
          }])
        }
      }
    })
  }

  const detectCommunicationPatterns = (text: string) => {
    const patterns: { pattern: PatternType; triggers: string[]; description: string }[] = [
      {
        pattern: 'ANSWER_FIRST',
        triggers: ['recommend', 'suggest', 'my recommendation', 'we should'],
        description: 'Leading with recommendation'
      },
      {
        pattern: 'FRAMEWORK_USAGE',
        triggers: ['based on our', 'using the', 'framework', 'analysis shows'],
        description: 'Applying PM frameworks'
      },
      {
        pattern: 'UNCERTAIN_LANGUAGE',
        triggers: ['might', 'maybe', 'possibly', 'could potentially'],
        description: 'Uncertain language detected'
      },
      {
        pattern: 'EXECUTIVE_STRUCTURE',
        triggers: ['strategic perspective', 'business impact', 'competitive advantage'],
        description: 'Executive communication structure'
      },
      {
        pattern: 'STAKEHOLDER_ADAPTATION',
        triggers: ['as you know', 'from your perspective', 'given your priorities'],
        description: 'Adapting to stakeholder context'
      }
    ]
    
    patterns.forEach(({ pattern, triggers, description }) => {
      const isMatch = triggers.some(trigger => text.toLowerCase().includes(trigger))
      
      if (isMatch) {
        const existing = detectedPatterns.find(p => p.pattern === pattern)
        if (!existing || Date.now() - existing.timestamp.getTime() > 10000) {
          setDetectedPatterns(prev => [...prev.filter(p => p.pattern !== pattern), {
            pattern,
            confidence: 0.8 + Math.random() * 0.2,
            timestamp: new Date(),
            context: text.substring(Math.max(0, text.length - 50)),
            suggestion: getPatternSuggestion(pattern)
          }])
        }
      }
    })
  }

  const getPatternSuggestion = (pattern: PatternType): string => {
    switch (pattern) {
      case 'ANSWER_FIRST':
        return 'Excellent! Continue with supporting evidence'
      case 'FRAMEWORK_USAGE':
        return 'Great framework application. Consider quantifying the impact'
      case 'UNCERTAIN_LANGUAGE':
        return 'Consider more definitive language for executive presence'
      case 'EXECUTIVE_STRUCTURE':
        return 'Strong executive communication. Maintain this altitude'
      case 'STAKEHOLDER_ADAPTATION':
        return 'Good stakeholder awareness. Keep personalizing your message'
      default:
        return 'Keep up the good communication structure'
    }
  }

  const getPatternColor = (pattern: PatternType) => {
    switch (pattern) {
      case 'ANSWER_FIRST': return 'bg-green-100 text-green-800'
      case 'FRAMEWORK_USAGE': return 'bg-blue-100 text-blue-800'
      case 'UNCERTAIN_LANGUAGE': return 'bg-yellow-100 text-yellow-800'
      case 'EXECUTIVE_STRUCTURE': return 'bg-purple-100 text-purple-800'
      case 'STAKEHOLDER_ADAPTATION': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPatternLabel = (pattern: PatternType) => {
    switch (pattern) {
      case 'ANSWER_FIRST': return 'Answer First'
      case 'FRAMEWORK_USAGE': return 'Framework'
      case 'UNCERTAIN_LANGUAGE': return 'Uncertain'
      case 'EXECUTIVE_STRUCTURE': return 'Executive'
      case 'STAKEHOLDER_ADAPTATION': return 'Stakeholder'
      default: return pattern.replace('_', ' ')
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Live Transcription Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Live Transcription
            {isListening && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Listening
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Transcription Text */}
          <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border">
            {words.length === 0 ? (
              <p className="text-gray-500 italic">
                {isActive ? 'Start speaking to see live transcription...' : 'Transcription will appear here when recording starts'}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-900 leading-relaxed">
                  {words.map((word, index) => (
                    <span
                      key={index}
                      className={`inline-block mr-1 ${
                        word.isHighlighted ? 'bg-yellow-200 px-1 rounded' : ''
                      } ${
                        word.pattern ? 'bg-blue-100 px-1 rounded border-b-2 border-blue-300' : ''
                      }`}
                      title={word.pattern ? getPatternLabel(word.pattern) : `Confidence: ${Math.round(word.confidence * 100)}%`}
                    >
                      {word.word}
                    </span>
                  ))}
                  <span className="inline-block w-px h-4 bg-gray-400 animate-pulse ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Transcription Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-gray-600">Speaking Rate</p>
                <p className="font-semibold">{speakingRate} WPM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-gray-600">Confidence</p>
                <p className="font-semibold">{Math.round(confidenceLevel * 100)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-gray-600">Word Count</p>
                <p className="font-semibold">{words.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-gray-600">Patterns</p>
                <p className="font-semibold">{detectedPatterns.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Patterns */}
      {detectedPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Communication Patterns Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {detectedPatterns.slice(-6).map((pattern, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={getPatternColor(pattern.pattern)}>
                      {getPatternLabel(pattern.pattern)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {Math.round(pattern.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    "{pattern.context}"
                  </p>
                  {pattern.suggestion && (
                    <p className="text-xs text-blue-600 font-medium">
                      💡 {pattern.suggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Framework Detection */}
      {frameworkDetections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Framework Usage Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {frameworkDetections.map((detection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                  <div>
                    <Badge className="bg-blue-100 text-blue-800 mb-2">
                      {detection.framework}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Context: "{detection.context}"
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">
                      {Math.round(detection.confidence * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}