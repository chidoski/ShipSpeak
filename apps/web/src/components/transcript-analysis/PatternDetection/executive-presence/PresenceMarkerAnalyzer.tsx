/**
 * Presence Marker Analyzer - Analyzes authority, clarity, conviction, and composure markers
 * ShipSpeak Slice 5 Refactoring
 */

import { PresenceMarker } from '../../../../types/transcript-analysis'
import { MeetingType } from '../../../../types/meeting'

export const analyzePresenceMarkers = async (
  transcriptContent: string,
  meetingType: MeetingType
): Promise<PresenceMarker[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const markers: PresenceMarker[] = []

  // Authority markers analysis
  const authorityMarkers = detectAuthorityMarkers(transcriptContent)
  markers.push(...authorityMarkers)

  // Clarity markers analysis  
  const clarityMarkers = detectClarityMarkers(transcriptContent)
  markers.push(...clarityMarkers)

  // Conviction markers analysis
  const convictionMarkers = detectConvictionMarkers(transcriptContent)
  markers.push(...convictionMarkers)

  // Composure markers analysis
  const composureMarkers = detectComposureMarkers(transcriptContent, meetingType)
  markers.push(...composureMarkers)

  return markers.sort((a, b) => b.strength - a.strength)
}

export const detectAuthorityMarkers = (content: string): PresenceMarker[] => {
  const patterns = {
    'Decisive Language': /\b(will\s+implement|decide|commit to|proceed with|directive)\b/gi,
    'Framework References': /\b(RICE|ICE|OKR|SMART|framework|methodology)\b/gi,
    'Strategic Positioning': /\b(strategy|roadmap|vision|competitive\s+advantage)\b/gi,
    'Ownership Statements': /\b(I\s+will|my\s+decision|taking\s+ownership|accountable)\b/gi
  }

  const markers: PresenceMarker[] = []
  
  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = content.match(pattern) || []
    if (matches.length > 0) {
      markers.push({
        type,
        strength: Math.min(matches.length * 15, 95),
        frequency: matches.length,
        examples: matches.slice(0, 3),
        evidence: [`Found ${matches.length} instances of ${type.toLowerCase()}`]
      })
    }
  })

  return markers
}

export const detectClarityMarkers = (content: string): PresenceMarker[] => {
  const patterns = {
    'Clear Structure': /\b(first|second|third|in\s+summary|to\s+conclude)\b/gi,
    'Specific Examples': /\b(for\s+example|specifically|concrete\s+case|instance)\b/gi,
    'Process Definition': /\b(process|workflow|steps|procedure|approach)\b/gi,
    'Clear Communication': /\b(clarify|explain|understand|obvious|evident)\b/gi
  }

  const markers: PresenceMarker[] = []
  
  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = content.match(pattern) || []
    if (matches.length > 0) {
      markers.push({
        type,
        strength: Math.min(matches.length * 12, 90),
        frequency: matches.length,
        examples: matches.slice(0, 3),
        evidence: [`${matches.length} clarity indicators detected`]
      })
    }
  })

  return markers
}

export const detectConvictionMarkers = (content: string): PresenceMarker[] => {
  const patterns = {
    'Confident Assertions': /\b(confident|certain|believe|convinced|strong\s+evidence)\b/gi,
    'Definitive Statements': /\b(absolutely|definitely|clearly|without\s+doubt)\b/gi,
    'Solution Orientation': /\b(solution|resolve|address|fix|improve)\b/gi,
    'Growth Language': /\b(opportunity|potential|growth|optimize|enhance)\b/gi
  }

  const markers: PresenceMarker[] = []
  
  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = content.match(pattern) || []
    if (matches.length > 0) {
      markers.push({
        type,
        strength: Math.min(matches.length * 18, 95),
        frequency: matches.length,
        examples: matches.slice(0, 3),
        evidence: [`${matches.length} conviction markers identified`]
      })
    }
  })

  return markers
}

export const detectComposureMarkers = (content: string, meetingType: MeetingType): PresenceMarker[] => {
  const patterns = {
    'Diplomatic Language': /\b(appreciate|understand\s+your\s+perspective|respect)\b/gi,
    'Measured Responses': /\b(consider|evaluate|assess|thoughtful\s+approach)\b/gi,
    'Conflict Resolution': /\b(common\s+ground|alignment|consensus|compromise)\b/gi,
    'Professional Tone': /\b(professional|appropriate|constructive|positive)\b/gi
  }

  const markers: PresenceMarker[] = []
  
  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = content.match(pattern) || []
    if (matches.length > 0) {
      const strength = meetingType === 'CONFLICT_RESOLUTION' ? 
        Math.min(matches.length * 20, 95) : 
        Math.min(matches.length * 15, 90)
      
      markers.push({
        type,
        strength,
        frequency: matches.length,
        examples: matches.slice(0, 3),
        evidence: [`${matches.length} composure indicators in ${meetingType} context`]
      })
    }
  })

  return markers
}