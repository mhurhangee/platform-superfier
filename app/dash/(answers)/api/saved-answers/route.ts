import { NextRequest } from 'next/server'
import { getSavedAnswers, deleteSavedAnswer } from '@/lib/db/answers'
import { getUserId } from '@/lib/utils/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/api'

/**
 * API route for getting saved answers
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await getUserId()

    if (!userId) {
      return createErrorResponse('Unauthorized', 401)
    }

    // 2. Business logic
    // Get saved answers from the database
    const savedAnswers = await getSavedAnswers(userId)

    // 3. Return success response
    return createSuccessResponse({ savedAnswers })
  } catch (error) {
    // 4. Error handling
    console.error('Error fetching saved answers:', error)
    return createErrorResponse('An error occurred while fetching saved answers', 500)
  }
}

/**
 * API route for deleting a saved answer
 */
export async function DELETE(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await getUserId()

    if (!userId) {
      return createErrorResponse('Unauthorized', 401)
    }

    // 2. Input validation
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return createErrorResponse('Missing answer ID', 400)
    }

    // 3. Business logic
    // Delete the answer from the database
    const success = await deleteSavedAnswer(id, userId)

    if (!success) {
      return createErrorResponse('Answer not found or not authorized to delete', 404)
    }

    // 4. Return success response
    return createSuccessResponse({ success: true })
  } catch (error) {
    // 5. Error handling
    console.error('Error deleting saved answer:', error)
    return createErrorResponse('An error occurred while deleting the saved answer', 500)
  }
}
