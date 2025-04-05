import { NextRequest } from 'next/server'
import { getUserSavedAnswers, deleteSavedAnswer } from '@/lib/db/answers'
import { getUserId } from '@/lib/utils/auth'

export async function GET() {
  try {
    // Get user ID from auth
    const { userId } = await getUserId()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get saved answers for the user
    const savedAnswers = await getUserSavedAnswers(userId)

    return Response.json({ savedAnswers })
  } catch (error) {
    console.error('Error fetching saved answers:', error)
    return Response.json(
      { error: 'An error occurred while fetching saved answers' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Missing answer ID' }, { status: 400 })
    }

    // Get user ID from auth
    const { userId } = await getUserId()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the saved answer
    await deleteSavedAnswer(id)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved answer:', error)
    return Response.json(
      { error: 'An error occurred while deleting the saved answer' },
      { status: 500 }
    )
  }
}
