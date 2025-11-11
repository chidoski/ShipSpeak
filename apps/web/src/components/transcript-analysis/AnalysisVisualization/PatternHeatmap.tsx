/**
 * Pattern Heatmap - Visual representation of communication pattern strength distribution
 * ShipSpeak Slice 5: Interactive heatmap showing PM communication pattern analysis
 */

import React from 'react'
import { 
  PatternHighlight,
  PMTransitionDetection
} from '../../../types/transcript-analysis'

interface PatternHeatmapProps {
  patterns: PatternHighlight[]
  transitionAnalysis: PMTransitionDetection
  onPatternSelect: (pattern: string | null) => void
}

interface HeatmapCell {
  id: string
  label: string
  value: number
  category: 'executive' | 'strategic' | 'technical' | 'stakeholder' | 'framework'
  description: string
}

export const PatternHeatmap: React.FC<PatternHeatmapProps> = ({
  patterns,
  transitionAnalysis,
  onPatternSelect
}) => {
  const [selectedCell, setSelectedCell] = React.useState<string | null>(null)
  const [tooltipData, setTooltipData] = React.useState<{ cell: HeatmapCell; x: number; y: number } | null>(null)

  // Generate heatmap data from analysis results
  const heatmapData = React.useMemo(() => {
    return generateHeatmapCells(patterns, transitionAnalysis)
  }, [patterns, transitionAnalysis])

  const getIntensityColor = (value: number): string => {
    if (value >= 90) return 'bg-green-600 text-white'
    if (value >= 80) return 'bg-green-500 text-white'
    if (value >= 70) return 'bg-green-400 text-white'
    if (value >= 60) return 'bg-yellow-400 text-black'
    if (value >= 50) return 'bg-yellow-300 text-black'
    if (value >= 40) return 'bg-orange-300 text-black'
    if (value >= 30) return 'bg-orange-400 text-white'
    if (value >= 20) return 'bg-red-400 text-white'
    return 'bg-red-500 text-white'
  }

  const getCategoryColor = (category: HeatmapCell['category']): string => {
    const colors = {
      executive: 'border-l-purple-500',
      strategic: 'border-l-blue-500',
      technical: 'border-l-green-500',
      stakeholder: 'border-l-orange-500',
      framework: 'border-l-indigo-500'
    }
    return colors[category]
  }

  const handleCellClick = (cell: HeatmapCell) => {
    setSelectedCell(selectedCell === cell.id ? null : cell.id)
    onPatternSelect(selectedCell === cell.id ? null : cell.label)
  }

  const handleCellHover = (event: React.MouseEvent, cell: HeatmapCell) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipData({
      cell,
      x: rect.right + 10,
      y: rect.top
    })
  }

  const handleCellLeave = () => {
    setTooltipData(null)
  }

  return (
    <div className="relative">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-l-4 border-l-purple-500"></div>
          <span>Executive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-l-4 border-l-blue-500"></div>
          <span>Strategic</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-l-4 border-l-green-500"></div>
          <span>Technical</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-l-4 border-l-orange-500"></div>
          <span>Stakeholder</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-l-4 border-l-indigo-500"></div>
          <span>Framework</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
        {heatmapData.map((cell) => (
          <div
            key={cell.id}
            className={`
              relative border-l-4 rounded-lg p-3 cursor-pointer transition-all duration-200
              ${getCategoryColor(cell.category)}
              ${getIntensityColor(cell.value)}
              ${selectedCell === cell.id ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:scale-102'}
            `}
            onClick={() => handleCellClick(cell)}
            onMouseEnter={(e) => handleCellHover(e, cell)}
            onMouseLeave={handleCellLeave}
          >
            <div className="text-xs font-medium mb-1 truncate" title={cell.label}>
              {cell.label}
            </div>
            <div className="text-lg font-bold">{cell.value}</div>
            <div className="text-xs opacity-90">
              {cell.value >= 80 ? 'Strong' : cell.value >= 60 ? 'Good' : cell.value >= 40 ? 'Fair' : 'Weak'}
            </div>
          </div>
        ))}
      </div>

      {/* Intensity Scale */}
      <div className="mt-4 flex items-center space-x-2 text-sm">
        <span className="text-gray-600">Intensity:</span>
        <div className="flex">
          <div className="w-4 h-4 bg-red-500"></div>
          <div className="w-4 h-4 bg-orange-400"></div>
          <div className="w-4 h-4 bg-yellow-300"></div>
          <div className="w-4 h-4 bg-green-400"></div>
          <div className="w-4 h-4 bg-green-600"></div>
        </div>
        <span className="text-gray-600">0-20 → 80-100</span>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          {(() => {
            const cell = heatmapData.find(c => c.id === selectedCell)
            if (!cell) return null
            
            return (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{cell.label}</h4>
                <p className="text-sm text-gray-600 mb-3">{cell.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Score:</span>
                    <span className="ml-1 font-medium">{cell.value}/100</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-1 font-medium capitalize">{cell.category}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Tooltip */}
      {tooltipData && (
        <div 
          className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg p-3 max-w-xs shadow-lg pointer-events-none"
          style={{ 
            left: `${tooltipData.x}px`, 
            top: `${tooltipData.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="font-medium mb-1">{tooltipData.cell.label}</div>
          <div className="text-gray-300 text-xs mb-2">{tooltipData.cell.description}</div>
          <div className="text-xs">
            Score: <span className="font-medium">{tooltipData.cell.value}/100</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Generate heatmap cells from analysis data
const generateHeatmapCells = (
  patterns: PatternHighlight[],
  transitionAnalysis: PMTransitionDetection
): HeatmapCell[] => {
  const cells: HeatmapCell[] = []

  // Executive Presence Patterns
  cells.push({
    id: 'executive-authority',
    label: 'Authority',
    value: extractPatternScore(patterns, 'Executive Presence') || 75,
    category: 'executive',
    description: 'Demonstrates authority and leadership in communication'
  })

  cells.push({
    id: 'executive-confidence',
    label: 'Confidence',
    value: extractPatternScore(patterns, 'Confidence') || 68,
    category: 'executive',
    description: 'Shows confidence in decision-making and recommendations'
  })

  cells.push({
    id: 'executive-clarity',
    label: 'Clarity',
    value: extractPatternScore(patterns, 'Clarity') || 82,
    category: 'executive',
    description: 'Clear and structured communication patterns'
  })

  // Strategic Communication Patterns
  cells.push({
    id: 'strategic-thinking',
    label: 'Strategic Language',
    value: transitionAnalysis.transitionIndicators.poToPM?.strategicLanguageEmergence?.confidence || 65,
    category: 'strategic',
    description: 'Uses strategic vocabulary and business-focused language'
  })

  cells.push({
    id: 'strategic-framing',
    label: 'Context Framing',
    value: extractPatternScore(patterns, 'Strategic') || 71,
    category: 'strategic',
    description: 'Frames discussions in strategic business context'
  })

  cells.push({
    id: 'strategic-altitude',
    label: 'Altitude Control',
    value: transitionAnalysis.transitionIndicators.pmToSeniorPM?.strategicAltitudeControl?.confidence || 58,
    category: 'strategic',
    description: 'Adjusts communication detail level appropriately'
  })

  // Framework Usage Patterns
  cells.push({
    id: 'framework-application',
    label: 'Framework Usage',
    value: transitionAnalysis.transitionIndicators.poToPM?.decisionFrameworkApplication?.confidence || 88,
    category: 'framework',
    description: 'Applies PM frameworks effectively in discussions'
  })

  cells.push({
    id: 'framework-mastery',
    label: 'Framework Mastery',
    value: transitionAnalysis.transitionIndicators.pmToSeniorPM?.frameworkMastery?.confidence || 81,
    category: 'framework',
    description: 'Demonstrates deep understanding of PM frameworks'
  })

  // Stakeholder Management Patterns
  cells.push({
    id: 'stakeholder-adaptation',
    label: 'Audience Adaptation',
    value: transitionAnalysis.transitionIndicators.poToPM?.stakeholderCommunicationEvolution?.confidence || 45,
    category: 'stakeholder',
    description: 'Adapts communication style to different stakeholders'
  })

  cells.push({
    id: 'stakeholder-influence',
    label: 'Influence',
    value: transitionAnalysis.transitionIndicators.pmToSeniorPM?.influenceWithoutAuthority?.confidence || 52,
    category: 'stakeholder',
    description: 'Demonstrates influence without direct authority'
  })

  cells.push({
    id: 'stakeholder-alignment',
    label: 'Alignment Building',
    value: extractPatternScore(patterns, 'Alignment') || 64,
    category: 'stakeholder',
    description: 'Builds consensus and alignment across teams'
  })

  // Technical Translation Patterns
  cells.push({
    id: 'technical-translation',
    label: 'Tech Translation',
    value: extractPatternScore(patterns, 'Technical') || 59,
    category: 'technical',
    description: 'Translates technical concepts for business audiences'
  })

  cells.push({
    id: 'technical-depth',
    label: 'Technical Depth',
    value: extractPatternScore(patterns, 'Depth') || 72,
    category: 'technical',
    description: 'Demonstrates appropriate technical depth'
  })

  // Business Impact Patterns
  cells.push({
    id: 'business-impact',
    label: 'Business Impact',
    value: transitionAnalysis.transitionIndicators.poToPM?.businessImpactReasoning?.confidence || 82,
    category: 'strategic',
    description: 'Focuses on business outcomes and impact'
  })

  cells.push({
    id: 'outcome-focus',
    label: 'Outcome Focus',
    value: transitionAnalysis.transitionIndicators.poToPM?.deliveryToOutcomesShift?.confidence || 71,
    category: 'strategic',
    description: 'Emphasizes outcomes over feature delivery'
  })

  return cells
}

// Extract pattern score by name
const extractPatternScore = (patterns: PatternHighlight[], patternName: string): number | null => {
  const pattern = patterns.find(p => p.pattern.toLowerCase().includes(patternName.toLowerCase()))
  return pattern ? pattern.score : null
}

export default PatternHeatmap