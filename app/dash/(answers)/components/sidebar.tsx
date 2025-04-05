'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircleQuestion,
  Loader2,
  ExternalLink,
  RotateCcw,
  Bookmark,
  Trash2,
  Search,
  AlertCircle,
  BookmarkCheck,
  Info,
} from 'lucide-react'
import { SavedAnswerModal } from './answer-modal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { useSavedAnswers, SavedAnswer } from '../../../../components/contexts/saved-answers-context'

export function AnswersSidebar() {
  const { savedAnswers, isLoading, deleteAnswer } = useSavedAnswers()
  const [selectedAnswer, setSelectedAnswer] = useState<SavedAnswer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  // Filter saved answers based on search query
  const filteredAnswers = savedAnswers.filter((answer) =>
    answer.query.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Paginate answers
  const paginatedAnswers = filteredAnswers.slice(0, page * itemsPerPage)
  const hasMore = paginatedAnswers.length < filteredAnswers.length

  // Handle opening the modal with a selected answer
  const handleOpenAnswer = (answer: SavedAnswer) => {
    setSelectedAnswer(answer)
    setIsModalOpen(true)
  }

  // Handle deleting a saved answer
  const handleDeleteAnswer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal
    await deleteAnswer(id)
  }

  // Load more answers
  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  // Reset pagination when search query changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  return (
    <div className="flex flex-col">
      <div className="space-y-4">
        {/* How to use section */}
        <CollapsibleSection
          icon={<Info className="size-4 mt-0.5 flex-shrink-0" />}
          title="How to use"
          variant="ghost"
          defaultOpen={false}
        >
          <ul className="space-y-3 text-xs">
            <li className="flex gap-2">
              <MessageCircleQuestion className="size-3 flex-shrink-0" />
              <span>Write your question</span>
            </li>
            <li className="flex gap-2">
              <Loader2 className="size-3 flex-shrink-0" />
              <span>Wait for the AI to generate an answer</span>
            </li>
            <li className="flex gap-2">
              <ExternalLink className="size-3 flex-shrink-0" />
              <span>View source citations for more information</span>
            </li>
            <li className="flex gap-2">
              <Bookmark className="size-3 flex-shrink-0" />
              <span>Save answers you want to reference later</span>
            </li>
            <li className="flex gap-2">
              <RotateCcw className="size-3 flex-shrink-0" />
              <span>Ask another question</span>
            </li>
          </ul>
        </CollapsibleSection>

        {/* Saved answers section */}
        <CollapsibleSection
          title="Saved Answers"
          icon={<Bookmark className="size-4 mt-0.5 flex-shrink-0" />}
          variant="ghost"
          defaultOpen={true}
        >
          {/* Search input */}
          <div className="relative mb-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredAnswers.length > 0 ? (
            <div className="space-y-3">
              <ScrollArea className="h-[350px] pr-3">
                <div className="space-y-2">
                  {paginatedAnswers.map((answer) => (
                    <div
                      key={answer.id}
                      onClick={() => handleOpenAnswer(answer)}
                      className="p-3 border rounded-md hover:bg-muted/30 cursor-pointer transition-colors group relative"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{answer.query}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteAnswer(answer.id, e)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-3 flex justify-center">
                    <Button variant="outline" size="sm" onClick={loadMore} className="w-full">
                      Load more
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No matching answers found' : 'No saved answers yet'}
              </p>
            </div>
          )}
        </CollapsibleSection>

        {/* Tips and tricks */}
        <CollapsibleSection
          title="Tips and Tricks"
          icon={<Info className="size-4 mt-0.5 flex-shrink-0" />}
          variant="ghost"
          defaultOpen={false}
        >
          <ul className="space-y-3 text-xs">
            <li className="flex gap-2">
              <MessageCircleQuestion className="size-3 flex-shrink-0" />
              <span>Be specific and clear with your questions</span>
            </li>
            <li className="flex gap-2">
              <Search className="size-3 flex-shrink-0" />
              <span>Keep questions concise (under 2-3 sentences)</span>
            </li>
            <li className="flex gap-2">
              <AlertCircle className="size-3 flex-shrink-0" />
              <span>Include relevant context when needed</span>
            </li>
            <li className="flex gap-2">
              <BookmarkCheck className="size-3 flex-shrink-0" />
              <span>Save answers you reference frequently</span>
            </li>
            <li className="flex gap-2">
              <RotateCcw className="size-3 flex-shrink-0" />
              <span>Rephrase questions if results aren&apos;t helpful</span>
            </li>
          </ul>
        </CollapsibleSection>
      </div>

      <SavedAnswerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        answer={selectedAnswer}
        onDelete={
          selectedAnswer
            ? (id) => {
                deleteAnswer(id)
                setIsModalOpen(false)
              }
            : undefined
        }
      />
    </div>
  )
}
