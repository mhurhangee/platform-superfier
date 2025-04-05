import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';

import {
    getUserId,
    getOrgId
} from '@/lib/utils/auth';

// Get the API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { question, answer } = await req.json();

        const { userId } = await getUserId();
        const { orgId } = await getOrgId();

        if (!userId || !orgId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!question || typeof question !== 'string' || !answer || typeof answer !== 'string') {
            return Response.json({ error: 'Invalid question or answer' }, { status: 400 });
        }

        // Check if API key is available
        if (!OPENAI_API_KEY) {
            return Response.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
        }

        // Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });

        // Generate follow-up questions using OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful assistant that generates follow-up questions based on a question and its answer. 
                    Generate 3 follow-up questions that would naturally continue the conversation.
                    Return ONLY a JSON object with an array of questions, with no additional text.
                    The JSON should have this structure: { "questions": ["question 1", "question 2", "question 3"] }`
                },
                {
                    role: 'user',
                    content: `Original question: "${question}"\nAnswer: "${answer}"\n\nGenerate 3 follow-up questions.`
                }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        // Parse the response to get the follow-up questions
        const content = response.choices[0]?.message?.content || '{"questions": []}';
        const followUpQuestions = JSON.parse(content);

        // Return the result as JSON
        return Response.json(followUpQuestions);
    } catch (error) {
        console.error('Error generating follow-up questions:', error);
        return Response.json({ error: 'An error occurred while generating follow-up questions' }, { status: 500 });
    }
}
