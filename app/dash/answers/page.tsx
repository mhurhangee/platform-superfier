'use client'

import { useState, FormEvent } from 'react'
import { Centred } from '@/components/theme/centred'
import { MessageCircleQuestion } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function AnswersPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsLoading(true)
    setIsLoading(false)
  }

  return (
    <Centred
      icon={<MessageCircleQuestion className="size-10 inline-block mr-2" />}
      title="Answers"
      subtitle="Get quick answers and sources"
    >
      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="h-12 pl-4 pr-24 text-base shadow-sm"
        />
        <Button
          type="submit"
          className="absolute right-1 top-1 h-10"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Ask
            </>
          )}
        </Button>
      </form>
    </Centred>
  )
}
