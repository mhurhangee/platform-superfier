import { NextRequest } from 'next/server'
import { saveAnswer } from '@/lib/db/answers'
import { getUserId } from '@/lib/utils/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/api'

/**
 * API route for saving an answer
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await getUserId()

    if (!userId) {
      return createErrorResponse('Unauthorized', 401)
    }

    // 2. Input validation
    const { query, answer, citations } = await req.json()

    if (!query || !answer) {
      return createErrorResponse('Missing required fields', 400)
    }

    // 3. Business logic
    // Save the answer to the database
    const savedAnswer = await saveAnswer({
      query,
      answer,
      citations,
      userId,
    })

    // 4. Return success response
    return createSuccessResponse({ success: true, answer: savedAnswer })
  } catch (error) {
    // 5. Error handling
    console.error('Error saving answer:', error)
    return createErrorResponse('An error occurred while saving the answer', 500)
  }
}
