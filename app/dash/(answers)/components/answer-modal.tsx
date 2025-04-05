'use client'
import ReactMarkdown from 'react-markdown'
import { ExternalLink, X, Trash2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Citation {
  title: string
  url: string
  favicon: string
}

interface SavedAnswerModalProps {
  isOpen: boolean
  onClose: () => void
  answer: {
    id: string
    query: string
    answer: string
    citations?: Citation[]
  } | null
  onDelete?: (id: string) => void
}

export function SavedAnswerModal({ isOpen, onClose, answer, onDelete }: SavedAnswerModalProps) {
  if (!answer) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{answer.query}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="mt-4 prose dark:prose-invert max-w-none">
          <div className="text-sm whitespace-pre-wrap">
            <ReactMarkdown>{answer.answer}</ReactMarkdown>
          </div>
        </div>

        {answer.citations && answer.citations.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {answer.citations.map((citation, index) => (
                <a
                  key={index}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Card className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      {citation.favicon && (
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
              ))}
            </div>
          </div>
        )}

        {onDelete && (
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={() => onDelete(answer.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Answer
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
