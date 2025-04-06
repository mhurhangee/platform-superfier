'use client'

import { AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ErrorMessageProps {
  error: string | Error | null
  className?: string
}

/**
 * A consistent error message component
 */
export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  if (!error) return null
  
  const errorMessage = error instanceof Error ? error.message : error
  
  return (
    <Card className={`p-6 w-full border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/50 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 text-red-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-700 dark:text-red-400">Error</h3>
          <p className="text-red-600 dark:text-red-300 text-sm">{errorMessage}</p>
        </div>
      </div>
    </Card>
  )
}
