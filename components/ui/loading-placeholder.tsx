'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

interface LoadingPlaceholderProps {
  lines?: number
  className?: string
  variant?: 'card' | 'inline'
}

/**
 * A consistent loading placeholder component
 */
export function LoadingPlaceholder({
  lines = 4,
  className = '',
  variant = 'card',
}: LoadingPlaceholderProps) {
  const skeletons = Array.from({ length: lines }, (_, i) => {
    const width = i === 0 ? '3/4' : i === lines - 1 ? '2/3' : i % 2 === 0 ? 'full' : '5/6'
    return <Skeleton key={i} className={`h-4 w-${width}`} />
  })

  if (variant === 'inline') {
    return <div className={`space-y-2 ${className}`}>{skeletons}</div>
  }

  return (
    <Card className={`p-6 w-full ${className}`}>
      <div className="space-y-4">{skeletons}</div>
    </Card>
  )
}
