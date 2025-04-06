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
    // Use template literals for width classes
    let width: string;
    if (i === 0) width = 'w-3/4';
    else if (i === lines - 1) width = 'w-2/3';
    else width = i % 2 === 0 ? 'w-full' : 'w-5/6';
    
    return <Skeleton key={i} className={`h-4 ${width}`} />
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
