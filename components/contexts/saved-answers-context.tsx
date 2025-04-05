'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

export interface Citation {
  title: string
  url: string
  favicon: string
}

// Types
export interface SavedAnswer {
  id: string
  query: string
  answer: string
  citations?: Citation[]
  shared: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

interface SaveAnswerInput {
  query: string
  answer: string
  citations?: Citation[]
}

interface SavedAnswersContextType {
  savedAnswers: SavedAnswer[]
  isLoading: boolean
  saveAnswer: (data: SaveAnswerInput) => Promise<boolean>
  deleteAnswer: (id: string) => Promise<boolean>
  refreshAnswers: () => Promise<void>
}

// Create context
const SavedAnswersContext = createContext<SavedAnswersContextType | undefined>(undefined)

export function SavedAnswersProvider({ children }: { children: ReactNode }) {
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch saved answers
  const fetchSavedAnswers = async () => {
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
  }

  // Initial fetch
  useEffect(() => {
    fetchSavedAnswers()
  }, [])

  // Function to refresh answers
  const refreshAnswers = async () => {
    await fetchSavedAnswers()
  }

  // Function to save an answer
  const saveAnswer = async (data: SaveAnswerInput): Promise<boolean> => {
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
    }
  }

  // Function to delete an answer
  const deleteAnswer = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/dash/api/saved-answers?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete answer')
      }

      // Remove the deleted answer from the state
      setSavedAnswers((prev) => prev.filter((answer) => answer.id !== id))

      toast.success('Answer deleted')
      return true
    } catch (error) {
      console.error('Error deleting answer:', error)
      toast.error('Failed to delete answer')
      return false
    }
  }

  const contextValue = {
    savedAnswers,
    isLoading,
    saveAnswer,
    deleteAnswer,
    refreshAnswers,
  }

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
