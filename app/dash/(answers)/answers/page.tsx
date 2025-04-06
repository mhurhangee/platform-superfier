'use client'

import { useState, FormEvent, KeyboardEvent, useCallback } from 'react'

import { toast } from 'sonner'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

import { Centred } from '@/components/theme/centred'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingPlaceholder } from '@/components/ui/loading-placeholder'
import { ErrorMessage } from '@/components/ui/error-message'
import { CitationList } from '@/app/dash/(answers)/components/citation-list'

import {
  Loader2,
  MessageCircleQuestion,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'

import { useSavedAnswers } from '@/components/contexts/saved-answers-context'
import { useAsync } from '@/hooks/useAsync'
import { AnswerResponse } from '@/types/answers'

export default function AnswersPage() {
  const { saveAnswer, isSaving } = useSavedAnswers()
  const [query, setQuery] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('') // Store the query that was actually searched
  const [result, setResult] = useState<AnswerResponse | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  
  // Use the async hook for fetching answers
  const { 
    isLoading, 
    error, 
    execute: fetchAnswer,
    reset: resetAsyncState
  } = useAsync<AnswerResponse>(
    async (question: string) => {
      const response = await fetch('/dash/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer')
      }

      return data
    },
    {
      showErrorToast: true,
      errorMessage: 'Failed to get answer'
    }
  )

  // Memoize the submit handler to avoid recreating it on every render
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!query.trim()) return

      // Save the current query as the searched query
      setSearchedQuery(query.trim())
      setResult(null)
      setIsSaved(false)

      const data = await fetchAnswer(query.trim())
      setResult(data)
    },
    [query, fetchAnswer]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (!isLoading && query.trim()) {
          handleSubmit(e as unknown as FormEvent)
        }
      }
    },
    [isLoading, query, handleSubmit]
  )

  const handleReset = useCallback(() => {
    resetAsyncState()
    setResult(null)
    setQuery('')
    setSearchedQuery('') // Also reset the searched query
    setIsSaved(false)
    toast.info('Search reset')
  }, [resetAsyncState])

  const handleSaveAnswer = useCallback(async () => {
    if (!result || !searchedQuery) return

    try {
      const success = await saveAnswer({
        query: searchedQuery,
        answer: result.answer,
        citations: result.citations,
      })

      if (success) {
        setIsSaved(true)
      }
    } catch (err) {
      console.error('Error saving answer:', err)
      toast.error('Failed to save answer')
    }
  }, [result, searchedQuery, saveAnswer])

  return (
    <Centred
      icon={<MessageCircleQuestion className="size-10 inline-block mr-2" />}
      title="Answers"
      subtitle="Get quick answers and sources from across the web"
    >
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            maxLength={200}
            withCounter
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="w-full pl-4 pr-24 text-base shadow-sm min-h-[100px]"
          />
          {result || error ? (
            <div className="absolute right-3 top-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="gap-1"
              >
                <RotateCcw className="size-3.5" />
              </Button>
              <Button type="submit" size="icon" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <MessageCircleQuestion className="size-4" />
                )}
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              className="absolute right-3 top-3"
              size="icon"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MessageCircleQuestion className="size-4" />
              )}
            </Button>
          )}
        </form>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <LoadingPlaceholder lines={4} />
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ErrorMessage error={error} />
          </motion.div>
        )}

        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-4"
          >
            <Card className="p-6 w-full">
              <CardContent className="p-0">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-muted-foreground uppercase m-0">
                      {searchedQuery}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveAnswer}
                      disabled={isSaving || isSaved}
                      className="gap-1.5 ml-2 flex-shrink-0"
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="size-4 text-green-500" />
                          <span className="text-sm">Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="size-4" />
                          <span className="text-sm">{isSaving ? 'Saving...' : 'Save'}</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-left text-sm whitespace-pre-wrap">
                    <ReactMarkdown>{result.answer}</ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use the CitationList component */}
            <CitationList citations={result.citations} />
          </motion.div>
        )}
      </div>
    </Centred>
  )
}
