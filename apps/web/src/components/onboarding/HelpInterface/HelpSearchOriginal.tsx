'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { 
  Search, 
  Filter, 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  Users,
  ArrowRight
} from 'lucide-react'
import type { HelpGuide, HelpCategory, CareerTransitionType, Industry } from '../../../types/onboarding'

// Mock help guides data
const mockHelpGuides: HelpGuide[] = [
  {
    id: 'executive-communication-fundamentals',
    title: 'Executive Communication Fundamentals for PM → Senior PM',
    category: 'CAREER_DEVELOPMENT',
    content: 'Learn answer-first methodology and strategic communication patterns essential for Senior PM success...',
    searchTags: ['executive', 'communication', 'answer-first', 'senior pm', 'c-suite'],
    careerRelevance: ['PM_TO_SENIOR_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'INTERMEDIATE',
    estimatedReadTime: 8
  },
  {
    id: 'meeting-upload-optimization',
    title: 'Optimize Meeting Uploads for Better Analysis',
    category: 'GETTING_STARTED',
    content: 'Best practices for selecting and uploading meetings that generate the most valuable practice modules...',
    searchTags: ['meeting', 'upload', 'analysis', 'optimization', 'audio quality'],
    careerRelevance: ['PO_TO_PM', 'PM_TO_SENIOR_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'BEGINNER',
    estimatedReadTime: 5
  },
  {
    id: 'fintech-regulatory-communication',
    title: 'Fintech PM Regulatory Communication Mastery',
    category: 'INDUSTRY_SPECIFIC',
    content: 'Navigate SEC compliance, banking regulations, and financial risk communication for fintech PMs...',
    searchTags: ['fintech', 'regulatory', 'compliance', 'sec', 'banking', 'risk'],
    careerRelevance: ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
    industryRelevance: ['FINTECH'],
    difficulty: 'ADVANCED',
    estimatedReadTime: 12
  },
  {
    id: 'framework-application-guide',
    title: 'PM Framework Application in Real Scenarios',
    category: 'CAREER_DEVELOPMENT',
    content: 'Master RICE, ICE, Jobs-to-be-Done frameworks with practical application in stakeholder communication...',
    searchTags: ['frameworks', 'rice', 'ice', 'jobs-to-be-done', 'prioritization', 'strategic'],
    careerRelevance: ['PO_TO_PM', 'PM_TO_SENIOR_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'INTERMEDIATE',
    estimatedReadTime: 10
  },
  {
    id: 'healthcare-pm-communication',
    title: 'Healthcare PM Communication & Regulatory Requirements',
    category: 'INDUSTRY_SPECIFIC',
    content: 'Communicate effectively with healthcare stakeholders while navigating FDA, HIPAA, and clinical requirements...',
    searchTags: ['healthcare', 'fda', 'hipaa', 'clinical', 'regulatory', 'patient safety'],
    careerRelevance: ['PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
    industryRelevance: ['HEALTHCARE'],
    difficulty: 'ADVANCED',
    estimatedReadTime: 15
  },
  {
    id: 'dashboard-metrics-interpretation',
    title: 'Understanding Your Progress Dashboard Metrics',
    category: 'GETTING_STARTED',
    content: 'Learn to interpret career progression metrics, skill development scores, and benchmark comparisons...',
    searchTags: ['dashboard', 'metrics', 'progress', 'career', 'benchmarks', 'scores'],
    careerRelevance: ['PO_TO_PM', 'PM_TO_SENIOR_PM', 'SENIOR_PM_TO_GROUP_PM'],
    industryRelevance: ['ALL'],
    difficulty: 'BEGINNER',
    estimatedReadTime: 6
  }
]

const categoryLabels: Record<HelpCategory, string> = {
  'GETTING_STARTED': 'Getting Started',
  'MEETING_ANALYSIS': 'Meeting Analysis',
  'PRACTICE_MODULES': 'Practice Modules',
  'CAREER_DEVELOPMENT': 'Career Development',
  'INDUSTRY_SPECIFIC': 'Industry Specific',
  'TROUBLESHOOTING': 'Troubleshooting',
  'ADVANCED_FEATURES': 'Advanced Features'
}

interface HelpSearchInterfaceProps {
  userCareerTransition: CareerTransitionType
  userIndustry: Industry
  onGuideSelect?: (guide: HelpGuide) => void
}

export default function HelpSearchInterface({
  userCareerTransition,
  userIndustry,
  onGuideSelect
}: HelpSearchInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | 'ALL'>('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and search guides
  const filteredGuides = useMemo(() => {
    return mockHelpGuides.filter(guide => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = guide.title.toLowerCase().includes(query)
        const matchesTags = guide.searchTags.some(tag => tag.toLowerCase().includes(query))
        const matchesContent = guide.content.toLowerCase().includes(query)
        
        if (!matchesTitle && !matchesTags && !matchesContent) {
          return false
        }
      }

      // Category filter
      if (selectedCategory !== 'ALL' && guide.category !== selectedCategory) {
        return false
      }

      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && guide.difficulty !== selectedDifficulty) {
        return false
      }

      // Career relevance filter
      if (!guide.careerRelevance.includes(userCareerTransition)) {
        return false
      }

      // Industry relevance filter (show if ALL or matches user industry)
      if (!guide.industryRelevance.includes('ALL') && !guide.industryRelevance.includes(userIndustry)) {
        return false
      }

      return true
    }).sort((a, b) => {
      // Prioritize by relevance: exact career match > difficulty match > recency
      const aCareerExact = a.careerRelevance.includes(userCareerTransition) ? 1 : 0
      const bCareerExact = b.careerRelevance.includes(userCareerTransition) ? 1 : 0
      
      if (aCareerExact !== bCareerExact) {
        return bCareerExact - aCareerExact
      }

      // Then by category relevance for user's current needs
      const relevantCategories = ['GETTING_STARTED', 'CAREER_DEVELOPMENT', 'INDUSTRY_SPECIFIC']
      const aRelevant = relevantCategories.includes(a.category) ? 1 : 0
      const bRelevant = relevantCategories.includes(b.category) ? 1 : 0
      
      return bRelevant - aRelevant
    })
  }, [searchQuery, selectedCategory, selectedDifficulty, userCareerTransition, userIndustry])

  const categories = Object.keys(categoryLabels) as HelpCategory[]
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: HelpCategory) => {
    switch (category) {
      case 'GETTING_STARTED': return 'bg-blue-100 text-blue-800'
      case 'CAREER_DEVELOPMENT': return 'bg-purple-100 text-purple-800'
      case 'INDUSTRY_SPECIFIC': return 'bg-orange-100 text-orange-800'
      case 'MEETING_ANALYSIS': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Help & Guidance Library
          </CardTitle>
          <p className="text-muted-foreground">
            Find answers and guidance tailored to your {userCareerTransition.replace('_', ' → ')} transition
            {userIndustry !== 'ALL' && ` in ${userIndustry.toLowerCase()}`}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help guides, tips, and tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            
            {(selectedCategory !== 'ALL' || selectedDifficulty !== 'ALL') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedCategory('ALL')
                  setSelectedDifficulty('ALL')
                }}
              >
                Clear Filters
              </Button>
            )}

            <div className="text-sm text-muted-foreground ml-auto">
              {filteredGuides.length} guides found
            </div>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('ALL')}
                  >
                    All Categories
                  </Badge>
                  {categories.map(category => (
                    <Badge 
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {categoryLabels[category]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedDifficulty === 'ALL' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedDifficulty('ALL')}
                  >
                    All Levels
                  </Badge>
                  {difficulties.map(difficulty => (
                    <Badge 
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuides.map((guide) => (
          <Card 
            key={guide.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onGuideSelect?.(guide)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {guide.title}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={getDifficultyColor(guide.difficulty)}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(guide.category)}>
                      {categoryLabels[guide.category]}
                    </Badge>
                    {guide.industryRelevance.includes(userIndustry) && userIndustry !== 'ALL' && (
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                        {userIndustry}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {guide.content}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{guide.estimatedReadTime} min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{guide.careerRelevance.length} career{guide.careerRelevance.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {guide.searchTags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {guide.searchTags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{guide.searchTags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Action */}
                <Button variant="outline" size="sm" className="w-full">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Read Guide
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredGuides.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No guides found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search query or filters to find relevant help content.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
                setSelectedDifficulty('ALL')
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}