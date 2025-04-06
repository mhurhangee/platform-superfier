'use client'

import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Citation } from '@/types/answers'

interface CitationCardProps {
  citation: Citation
}

export function CitationCard({ citation }: CitationCardProps) {
  return (
    <a href={citation.url} target="_blank" rel="noopener noreferrer" className="no-underline">
      <Card className="p-3 hover:bg-muted/50 transition-colors">
        <div className="flex items-start gap-3">
          {citation.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={citation.favicon}
              alt=""
              width={20}
              height={20}
              className="size-5 rounded-sm mt-0.5"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{citation.title}</p>
            <p className="text-xs text-muted-foreground truncate">{citation.url}</p>
          </div>
          <ExternalLink className="size-3 text-muted-foreground flex-shrink-0" />
        </div>
      </Card>
    </a>
  )
}

interface CitationListProps {
  citations: Citation[] | undefined | null
  className?: string
}

export function CitationList({ citations, className = '' }: CitationListProps) {
  if (!citations || citations.length === 0) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground">Sources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {citations.map((citation, index) => (
          <CitationCard key={index} citation={citation} />
        ))}
      </div>
    </div>
  )
}
