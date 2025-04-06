'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { SavedAnswer, Citation, SaveAnswerInput } from '@/types/answers'

interface SavedAnswersContextType {
  savedAnswers: SavedAnswer[]
  isLoading: boolean
  isSaving: boolean
  isDeleting: Record<string, boolean>
  saveAnswer: (data: SaveAnswerInput) => Promise<boolean>
  deleteAnswer: (id: string) => Promise<boolean>
  refreshAnswers: () => Promise<void>
}

// Create context
const SavedAnswersContext = createContext<SavedAnswersContextType | undefined>(undefined)

export function SavedAnswersProvider({ children }: { children: ReactNode }) {
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})

  // Function to fetch saved answers
  const fetchSavedAnswers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/dash/api/saved-answers')
      if (!response.ok) {
        throw new Error('Failed to fetch saved answers')
      }

      const data = await response.json()
      setSavedAnswers(data.savedAnswers || [])
    } catch (error) {
      console.error('Error fetching saved answers:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Function to refresh saved answers
  const refreshAnswers = useCallback(async () => {
    await fetchSavedAnswers()
  }, [fetchSavedAnswers])

  // Function to save an answer
  const saveAnswer = useCallback(async (data: SaveAnswerInput): Promise<boolean> => {
    setIsSaving(true)

    try {
      const response = await fetch('/dash/api/save-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save answer')
      }

      const result = await response.json()

      // Add the new answer to the state
      if (result.answer) {
        setSavedAnswers((prev) => [result.answer, ...prev])
      }

      toast.success('Answer saved')
      return true
    } catch (error) {
      console.error('Error saving answer:', error)
      toast.error('Failed to save answer')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Function to delete an answer
  const deleteAnswer = useCallback(async (id: string): Promise<boolean> => {
    // Store current state for rollback
    const previousAnswers = [...savedAnswers]

    // Update isDeleting state
    setIsDeleting((prev) => ({ ...prev, [id]: true }))

    // Optimistically update UI
    setSavedAnswers(savedAnswers.filter((answer) => answer.id !== id))

    try {
      const response = await fetch(`/dash/api/saved-answers?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete answer')
      }

      toast.success('Answer deleted')
      return true
    } catch (error) {
      console.error('Error deleting answer:', error)
      toast.error('Failed to delete answer')

      // Rollback on error
      setSavedAnswers(previousAnswers)
      return false
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }))
    }
  }, [savedAnswers])

  // Load saved answers on component mount
  useEffect(() => {
    fetchSavedAnswers()
  }, [fetchSavedAnswers])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      savedAnswers,
      isLoading,
      isSaving,
      isDeleting,
      saveAnswer,
      deleteAnswer,
      refreshAnswers,
    }),
    [savedAnswers, isLoading, isSaving, isDeleting, saveAnswer, deleteAnswer, refreshAnswers]
  )

  return (
    <SavedAnswersContext.Provider value={contextValue}>{children}</SavedAnswersContext.Provider>
  )
}

// Custom hook to use the saved answers context
export function useSavedAnswers() {
  const context = useContext(SavedAnswersContext)
  if (context === undefined) {
    throw new Error('useSavedAnswers must be used within a SavedAnswersProvider')
  }
  return context
}

// Re-export types from the shared types file
export type { SavedAnswer, Citation }
