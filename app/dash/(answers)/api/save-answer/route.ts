import { NextRequest } from 'next/server'
import { saveAnswer } from '@/lib/db/answers'
import { getUserId } from '@/lib/utils/auth'

export async function POST(req: NextRequest) {
  try {
    const { query, answer, citations } = await req.json()

    // Get user ID from auth
    const { userId } = await getUserId()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!query || !answer) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save the answer to the database
    const savedAnswer = await saveAnswer({
      query,
      answer,
      citations,
      userId,
    })

    return Response.json({ success: true, answer: savedAnswer })
  } catch (error) {
    console.error('Error saving answer:', error)
    return Response.json({ error: 'An error occurred while saving the answer' }, { status: 500 })
  }
}
