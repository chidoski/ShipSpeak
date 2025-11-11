import { PMCompetency, CompetencyLevel } from '@/types/competency'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

interface CompetencyCardProps {
  competency: PMCompetency
  executive?: boolean
  showActions?: boolean
  onPracticeClick?: (competency: PMCompetency) => void
  onDetailsClick?: (competency: PMCompetency) => void
}

export function CompetencyCard({ 
  competency, 
  executive = false,
  showActions = true,
  onPracticeClick,
  onDetailsClick 
}: CompetencyCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-competency-product-sense-excellent'
    if (score >= 60) return 'text-competency-product-sense-high'
    if (score >= 40) return 'text-competency-product-sense-mid'
    return 'text-competency-product-sense-low'
  }

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 80) return 'bg-competency-product-sense-excellent/10'
    if (score >= 60) return 'bg-competency-product-sense-high/10'
    if (score >= 40) return 'bg-competency-product-sense-mid/10'
    return 'bg-competency-product-sense-low/10'
  }

  const getLevelBadgeStyle = (level: CompetencyLevel) => {
    const styles = {
      foundation: 'bg-red-100 text-red-800 border-red-200',
      practice: 'bg-amber-100 text-amber-800 border-amber-200',
      mastery: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      executive: 'bg-blue-100 text-blue-800 border-blue-200',
    }
    return styles[level]
  }

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return (
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7M17 17H7" />
          </svg>
        )
      case 'declining':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10M7 7h10" />
          </svg>
        )
      case 'stable':
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        )
    }
  }

  return (
    <Card variant={executive ? 'executive' : 'competency'} className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{competency.name}</CardTitle>
            <p className="text-sm text-executive-text-secondary mt-1">
              {competency.description}
            </p>
          </div>
          <span className={clsx(
            'px-2 py-1 text-xs font-medium rounded-full border',
            getLevelBadgeStyle(competency.level)
          )}>
            {competency.level.charAt(0).toUpperCase() + competency.level.slice(1)}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={clsx(
                'text-3xl font-bold',
                getScoreColor(competency.score)
              )}>
                {competency.score}%
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(competency.trend)}
                <span className="text-sm text-executive-text-secondary">
                  {competency.trend}
                </span>
              </div>
            </div>
            <div className={clsx(
              'px-3 py-1 rounded-full text-sm font-medium',
              getScoreBackgroundColor(competency.score),
              getScoreColor(competency.score)
            )}>
              {competency.category.replace('-', ' ').toUpperCase()}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-executive-text-secondary">
              <span>Progress to Next Level</span>
              <span>{Math.min(100, competency.score + 20)}%</span>
            </div>
            <div className="progress-bar-executive h-3">
              <div 
                className={clsx(
                  'progress-fill-executive h-full rounded-full transition-all duration-1000',
                  getScoreColor(competency.score).replace('text-', 'bg-')
                )}
                style={{ width: `${competency.score}%` }}
              />
            </div>
          </div>

          {/* Benchmarks */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-executive-text-primary">
              Current Level Benchmarks
            </h4>
            <div className="space-y-1">
              {competency.benchmarks
                .filter(b => b.level === competency.level)
                .slice(0, 2)
                .map((benchmark, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-executive-accent mt-1.5 flex-shrink-0" />
                    <span className="text-executive-text-secondary">
                      {benchmark.description}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                executive={executive}
                onClick={() => onPracticeClick?.(competency)}
                className="flex-1"
              >
                Practice
              </Button>
              <Button
                variant="outline"
                size="sm"
                executive={executive}
                onClick={() => onDetailsClick?.(competency)}
              >
                Details
              </Button>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-xs text-executive-text-muted">
            Updated {new Date(competency.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}