'use client'
import ReactMarkdown from 'react-markdown'
import { X, Trash2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CitationList } from '@/app/dash/(answers)/components/citation-list'
import { SavedAnswer } from '@/types/answers'

interface SavedAnswerModalProps {
  isOpen: boolean
  onClose: () => void
  answer: SavedAnswer | null
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

        {/* Use the new CitationList component */}
        <CitationList citations={answer.citations} className="mt-6" />

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
