'use client'

import {
  useState,
  FormEvent,
  KeyboardEvent
} from 'react'

import Image from 'next/image'

import { toast } from 'sonner'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

import { Centred } from '@/components/theme/centred'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import {
  Loader2,
  MessageCircleQuestion,
  ExternalLink,
  AlertCircle,
  RotateCcw
} from 'lucide-react'

// Define the types for our API response
interface Citation {
  title: string;
  url: string;
  favicon: string;
}

interface AnswerResponse {
  answer: string;
  citations?: Citation[];
  error?: string;
}

export default function AnswersPage() {
  const [query, setQuery] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('') // Store the query that was actually searched
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnswerResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Save the current query as the searched query
    setSearchedQuery(query.trim())

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/dash/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer')
      }

      setResult(data)
    } catch (err) {
      console.error('Error fetching answer:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      toast.error('Failed to get answer')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && query.trim()) {
        handleSubmit(e as unknown as FormEvent)
      }
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setQuery('')
    setSearchedQuery('') // Also reset the searched query
    toast.info('Search reset')
  }

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
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !query.trim()}
              >
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
            <Card className="p-6 w-full">
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="p-6 w-full border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-700 dark:text-red-400">Error</h3>
                  <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </Card>
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
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-lg font-medium text-muted-foreground uppercase">{searchedQuery}</h3>
                  <div className="text-left text-sm whitespace-pre-wrap"><ReactMarkdown>{result.answer}</ReactMarkdown></div>
                </div>
              </CardContent>
            </Card>

            {result.citations && result.citations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.citations.map((citation, index) => (
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
                            <Image
                              src={citation.favicon}
                              alt=""
                              className="size-5 rounded-sm mt-0.5"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
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
          </motion.div>
        )}
      </div>
    </Centred>
  )
}
