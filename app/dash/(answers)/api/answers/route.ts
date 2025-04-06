import { NextRequest } from 'next/server'
import Exa from 'exa-js'

import { getUserId, getOrgId } from '@/lib/utils/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/api'

// Get the API key from environment variables
const EXA_API_KEY = process.env.EXA_API_KEY || ''

export const runtime = 'edge'

/**
 * API route for getting answers to questions
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await getUserId()
    const { orgId } = await getOrgId()

    if (!userId || !orgId) {
      return createErrorResponse('Unauthorized', 401)
    }

    // 2. Input validation
    const { question } = await req.json()

    if (!question || typeof question !== 'string') {
      return createErrorResponse('Invalid question', 400)
    }

    // Check if API key is available
    if (!EXA_API_KEY) {
      return createErrorResponse('EXA API key is not configured', 500)
    }

    // 3. Business logic
    // Initialize Exa client
    const exa = new Exa(EXA_API_KEY)

    // Simple system prompt to guide the answer generation
    const systemPrompt =
      'You are a helpful assistant that provides accurate, detailed, well-researched answers with reliable sources. Use markdown to format the answer. Answer the following question: '

    // Call Exa API to answer the question
    const exaResponse = await exa.answer(systemPrompt + question, {
      model: 'exa-pro',
    })

    // Extract the actual answer content
    let answer = ''

    if (typeof exaResponse.answer === 'string') {
      // If it's already a string, use it directly
      answer = exaResponse.answer
    } else {
      // Fallback for any other format
      answer = JSON.stringify(exaResponse, null, 2)
    }

    // Transform the citations to match our schema
    const citations = exaResponse.citations?.map((citation) => ({
      title: citation.title || 'Untitled',
      url: citation.url,
      favicon:
        citation.favicon || `https://www.google.com/s2/favicons?domain=${citation.url}&sz=128`,
    }))

    // 4. Return success response
    return createSuccessResponse({ answer, citations })
  } catch (error) {
    // 5. Error handling
    console.error('Error processing answer request:', error)
    return createErrorResponse('An error occurred while processing your request', 500)
  }
}
