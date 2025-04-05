import { PrismaClient } from '@prisma/client'
import { unstable_cache } from 'next/cache'
import { Citation } from '@/components/contexts/saved-answers-context'

// Initialize Prisma Client
const prisma = new PrismaClient()

// Type for saved answers
export interface SavedAnswerInput {
  query: string
  answer: string
  citations?: Citation[] | null
  userId: string
  shared?: boolean
}

export interface SavedAnswer {
  id: string
  query: string
  answer: string
  citations?: Citation[] | null
  shared: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

// Save an answer
export async function saveAnswer(data: SavedAnswerInput): Promise<SavedAnswer> {
  const result = await prisma.savedAnswer.create({
    data: {
      query: data.query,
      answer: data.answer,
      citations: data.citations ? JSON.parse(JSON.stringify(data.citations)) : null,
      userId: data.userId,
      shared: data.shared || false,
    },
  })

  return {
    ...result,
    citations: result.citations ? JSON.parse(JSON.stringify(result.citations)) : null,
  }
}

// Get all saved answers for a user
export const getUserSavedAnswers = unstable_cache(
  async (userId: string): Promise<SavedAnswer[]> => {
    const results = await prisma.savedAnswer.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return results.map((result) => ({
      ...result,
      citations: result.citations ? JSON.parse(JSON.stringify(result.citations)) : null,
    }))
  },
  ['user-saved-answers'],
  { revalidate: 60 } // Revalidate every minute
)

// Get a specific saved answer by ID
export async function getSavedAnswerById(id: string): Promise<SavedAnswer | null> {
  const result = await prisma.savedAnswer.findUnique({
    where: {
      id,
    },
  })

  if (!result) return null

  return {
    ...result,
    citations: result.citations ? JSON.parse(JSON.stringify(result.citations)) : null,
  }
}

// Delete a saved answer
export async function deleteSavedAnswer(id: string): Promise<void> {
  await prisma.savedAnswer.delete({
    where: {
      id,
    },
  })
}

// Toggle the shared status of an answer
export async function toggleAnswerShared(id: string): Promise<SavedAnswer> {
  const answer = await prisma.savedAnswer.findUnique({
    where: {
      id,
    },
  })

  if (!answer) {
    throw new Error('Answer not found')
  }

  const result = await prisma.savedAnswer.update({
    where: {
      id,
    },
    data: {
      shared: !answer.shared,
    },
  })

  return {
    ...result,
    citations: result.citations ? JSON.parse(JSON.stringify(result.citations)) : null,
  }
}
