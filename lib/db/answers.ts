import { PrismaClient, Prisma } from '@prisma/client'
import { Citation, SavedAnswer, SaveAnswerInput } from '@/types/answers'

// Initialize Prisma Client
const prisma = new PrismaClient()

/**
 * Save an answer to the database
 * @param data Answer data with userId
 * @returns The saved answer
 */
export async function saveAnswer(data: SaveAnswerInput & { userId: string }): Promise<SavedAnswer> {
  try {
    const result = await prisma.savedAnswer.create({
      data: {
        query: data.query,
        answer: data.answer,
        citations: data.citations as unknown as Prisma.InputJsonValue,
        userId: data.userId,
        shared: data.shared || false,
      },
    })

    return {
      ...result,
      citations: result.citations as unknown as Citation[] | null,
    }
  } catch (error) {
    console.error('Error saving answer:', error)
    throw new Error('Failed to save answer')
  }
}

/**
 * Get all saved answers for a user
 * @param userId User ID
 * @returns Array of saved answers
 */
export async function getSavedAnswers(userId: string): Promise<SavedAnswer[]> {
  try {
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
      citations: result.citations as unknown as Citation[] | null,
    }))
  } catch (error) {
    console.error('Error fetching saved answers:', error)
    throw new Error('Failed to fetch saved answers')
  }
}

/**
 * Get a specific saved answer by ID
 * @param id Answer ID
 * @param userId User ID for authorization check
 * @returns The saved answer or null if not found
 */
export async function getSavedAnswerById(
  id: string,
  userId: string
): Promise<SavedAnswer | null> {
  try {
    const result = await prisma.savedAnswer.findUnique({
      where: {
        id,
      },
    })

    if (!result) {
      return null
    }

    // Authorization check
    if (result.userId !== userId) {
      throw new Error('Unauthorized access to saved answer')
    }

    return {
      ...result,
      citations: result.citations as unknown as Citation[] | null,
    }
  } catch (error) {
    console.error('Error fetching saved answer:', error)
    throw new Error('Failed to fetch saved answer')
  }
}

/**
 * Delete a saved answer
 * @param id Answer ID
 * @param userId Optional user ID for authorization check
 * @returns Success status
 */
export async function deleteSavedAnswer(id: string, userId?: string): Promise<boolean> {
  try {
    // If userId is provided, check authorization
    if (userId) {
      const answer = await prisma.savedAnswer.findUnique({
        where: {
          id,
        },
      })

      if (!answer) {
        return false
      }

      // Authorization check
      if (answer.userId !== userId) {
        return false
      }
    }

    await prisma.savedAnswer.delete({
      where: {
        id,
      },
    })
    return true
  } catch (error) {
    console.error('Error deleting saved answer:', error)
    return false
  }
}

/**
 * Toggle the shared status of an answer
 * @param id Answer ID
 * @param userId User ID for authorization check
 * @returns The updated answer
 */
export async function toggleAnswerShared(id: string, userId: string): Promise<SavedAnswer> {
  try {
    const answer = await prisma.savedAnswer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      throw new Error('Answer not found')
    }

    // Authorization check
    if (answer.userId !== userId) {
      throw new Error('Unauthorized access to saved answer')
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
      citations: result.citations as unknown as Citation[] | null,
    }
  } catch (error) {
    console.error('Error toggling answer shared status:', error)
    throw new Error('Failed to update answer')
  }
}
