'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Filter, Search, Eye, EyeOff, Lightbulb, TrendingUp } from 'lucide-react';

interface TranscriptSegment {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
  patterns: PatternMatch[];
  confidence: number;
}

interface PatternMatch {
  type: 'answer-first' | 'framework' | 'hesitation' | 'definitive' | 'stakeholder-adaptation' | 'industry-term';
  pattern: string;
  startIndex: number;
  endIndex: number;
  score: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

interface TranscriptHighlightingProps {
  transcript?: TranscriptSegment[];
  patterns?: string[];
  onPatternSelect?: (pattern: string) => void;
}

const mockTranscript: TranscriptSegment[] = [
  {
    id: '1',
    timestamp: '00:02',
    speaker: 'You',
    text: 'The recommendation is to prioritize Feature A because it directly addresses our top customer pain point and will increase retention by 15%. Let me walk through the RICE analysis.',
    patterns: [
      {
        type: 'answer-first',
        pattern: 'The recommendation is to prioritize Feature A',
        startIndex: 0,
        endIndex: 44,
        score: 'positive',
        explanation: 'Excellent answer-first structure leading with clear recommendation'
      },
      {
        type: 'framework',
        pattern: 'RICE analysis',
        startIndex: 149,
        endIndex: 162,
        score: 'positive',
        explanation: 'Strong framework usage providing analytical structure'
      }
    ],
    confidence: 92
  },
  {
    id: '2',
    timestamp: '00:45',
    speaker: 'You',
    text: 'I think maybe we should consider the technical complexity here. The engineering team might have some concerns about the timeline.',
    patterns: [
      {
        type: 'hesitation',
        pattern: 'I think maybe',
        startIndex: 0,
        endIndex: 13,
        score: 'negative',
        explanation: 'Hesitation language undermines executive presence'
      }
    ],
    confidence: 78
  },
  {
    id: '3',
    timestamp: '01:12',
    speaker: 'You',
    text: 'Based on our customer interviews and competitive analysis, we will implement this feature in Q2. The ROI projections show 3x return within 6 months.',
    patterns: [
      {
        type: 'definitive',
        pattern: 'we will implement',
        startIndex: 74,
        endIndex: 91,
        score: 'positive',
        explanation: 'Strong definitive language showing confidence and commitment'
      },
      {
        type: 'stakeholder-adaptation',
        pattern: 'ROI projections',
        startIndex: 112,
        endIndex: 127,
        score: 'positive',
        explanation: 'Business-focused language appropriate for executive audience'
      }
    ],
    confidence: 95
  }
];

const patternConfig = {
  'answer-first': { 
    label: 'Answer-First', 
    color: 'bg-green-200 text-green-900',
    badgeColor: 'bg-green-100 text-green-800 border-green-300',
    icon: '✓'
  },
  'framework': { 
    label: 'Framework Usage', 
    color: 'bg-blue-200 text-blue-900',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '📊'
  },
  'hesitation': { 
    label: 'Hesitation', 
    color: 'bg-red-200 text-red-900',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    icon: '⚠️'
  },
  'definitive': { 
    label: 'Definitive Language', 
    color: 'bg-purple-200 text-purple-900',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: '💪'
  },
  'stakeholder-adaptation': { 
    label: 'Stakeholder Adaptation', 
    color: 'bg-yellow-200 text-yellow-900',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '🎯'
  },
  'industry-term': { 
    label: 'Industry Terminology', 
    color: 'bg-indigo-200 text-indigo-900',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: '🏢'
  }
};

export const TranscriptHighlighting: React.FC<TranscriptHighlightingProps> = ({
  transcript = mockTranscript,
  patterns,
  onPatternSelect
}) => {
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>(['answer-first', 'framework', 'hesitation']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTimestamps, setShowTimestamps] = useState(true);

  const availablePatterns = Object.keys(patternConfig);
  
  const filteredTranscript = useMemo(() => {
    return transcript.filter(segment => 
      searchTerm === '' || 
      segment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segment.patterns.some(p => p.pattern.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [transcript, searchTerm]);

  const togglePattern = (patternType: string) => {
    setSelectedPatterns(prev => 
      prev.includes(patternType) 
        ? prev.filter(p => p !== patternType)
        : [...prev, patternType]
    );
  };

  const highlightText = (text: string, patterns: PatternMatch[]) => {
    const segments: Array<{ text: string; isHighlighted: boolean; pattern?: PatternMatch }> = [];
    let lastIndex = 0;

    // Sort patterns by start index
    const sortedPatterns = patterns
      .filter(p => selectedPatterns.includes(p.type))
      .sort((a, b) => a.startIndex - b.startIndex);

    sortedPatterns.forEach(pattern => {
      // Add text before pattern
      if (pattern.startIndex > lastIndex) {
        segments.push({
          text: text.slice(lastIndex, pattern.startIndex),
          isHighlighted: false
        });
      }

      // Add highlighted pattern
      segments.push({
        text: text.slice(pattern.startIndex, pattern.endIndex),
        isHighlighted: true,
        pattern
      });

      lastIndex = pattern.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.slice(lastIndex),
        isHighlighted: false
      });
    }

    return segments;
  };

  const getPatternStats = () => {
    const stats: Record<string, { count: number; positive: number; negative: number }> = {};
    
    availablePatterns.forEach(pattern => {
      stats[pattern] = { count: 0, positive: 0, negative: 0 };
    });

    transcript.forEach(segment => {
      segment.patterns.forEach(pattern => {
        if (stats[pattern.type]) {
          stats[pattern.type].count++;
          if (pattern.score === 'positive') stats[pattern.type].positive++;
          if (pattern.score === 'negative') stats[pattern.type].negative++;
        }
      });
    });

    return stats;
  };

  const patternStats = getPatternStats();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Interactive Transcript Analysis
        </CardTitle>
        
        {/* Controls */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search transcript or patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm"
            />
          </div>

          {/* Pattern Filters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">Pattern Highlighting</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTimestamps(!showTimestamps)}
                className="text-xs"
              >
                {showTimestamps ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                Timestamps
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {availablePatterns.map(pattern => {
                const config = patternConfig[pattern as keyof typeof patternConfig];
                const isSelected = selectedPatterns.includes(pattern);
                const stats = patternStats[pattern];
                
                return (
                  <Button
                    key={pattern}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePattern(pattern)}
                    className="text-xs"
                  >
                    <span className="mr-1">{config.icon}</span>
                    {config.label}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {stats.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pattern Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {selectedPatterns.map(pattern => {
            const config = patternConfig[pattern as keyof typeof patternConfig];
            const stats = patternStats[pattern];
            const effectiveness = stats.count > 0 ? (stats.positive / stats.count * 100).toFixed(0) : 0;
            
            return (
              <div key={pattern} className={`p-2 rounded text-center text-xs ${config.badgeColor}`}>
                <div className="font-medium">{config.label}</div>
                <div className="text-xs opacity-75">
                  {stats.count} instances • {effectiveness}% effective
                </div>
              </div>
            );
          })}
        </div>

        {/* Transcript Display */}
        <ScrollArea className="h-96 border rounded-lg">
          <div className="p-4 space-y-4">
            {filteredTranscript.map((segment) => (
              <div key={segment.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  {showTimestamps && (
                    <Badge variant="outline" className="text-xs">
                      {segment.timestamp}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {segment.speaker}
                  </Badge>
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        segment.confidence >= 90 ? 'text-green-600 border-green-300' :
                        segment.confidence >= 70 ? 'text-yellow-600 border-yellow-300' :
                        'text-red-600 border-red-300'
                      }`}
                    >
                      {segment.confidence}%
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm leading-relaxed mb-3">
                  {highlightText(segment.text, segment.patterns).map((textSegment, index) => (
                    <span key={index}>
                      {textSegment.isHighlighted && textSegment.pattern ? (
                        <span
                          className={`${patternConfig[textSegment.pattern.type].color} px-1 py-0.5 rounded cursor-pointer`}
                          title={textSegment.pattern.explanation}
                          onClick={() => onPatternSelect?.(textSegment.pattern!.type)}
                        >
                          {textSegment.text}
                        </span>
                      ) : (
                        textSegment.text
                      )}
                    </span>
                  ))}
                </div>

                {/* Pattern Explanations */}
                {segment.patterns
                  .filter(p => selectedPatterns.includes(p.type))
                  .length > 0 && (
                  <div className="space-y-1">
                    {segment.patterns
                      .filter(p => selectedPatterns.includes(p.type))
                      .map((pattern, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-2 text-xs bg-gray-50 p-2 rounded"
                        >
                          <span className="flex-shrink-0">
                            {pattern.score === 'positive' ? '✓' : 
                             pattern.score === 'negative' ? '⚠️' : 'ℹ️'}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">
                              "{pattern.pattern}"
                            </div>
                            <div className="text-gray-600">
                              {pattern.explanation}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Analysis Insights */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Key Insights from Transcript Analysis
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-blue-800">
                Strong answer-first structure in opening statement shows executive readiness
              </span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
              <span className="text-blue-800">
                Hesitation language detected - practice definitive statements for authority
              </span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-blue-800">
                Good framework usage provides analytical credibility
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};