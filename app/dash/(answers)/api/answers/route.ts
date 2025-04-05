import { NextRequest } from 'next/server';
import Exa from 'exa-js';

import {
    getUserId,
    getOrgId
} from '@/lib/utils/auth';

// Get the API key from environment variables
const EXA_API_KEY = process.env.EXA_API_KEY || '';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { question } = await req.json();

        const { userId } = await getUserId();
        const { orgId } = await getOrgId();

        if (!userId || !orgId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!question || typeof question !== 'string') {
            return Response.json({ error: 'Invalid question' }, { status: 400 });
        }

        // Check if API key is available
        if (!EXA_API_KEY) {
            return Response.json({ error: 'EXA API key is not configured' }, { status: 500 });
        }

        // Initialize Exa client
        const exa = new Exa(EXA_API_KEY);

        // Simple system prompt to guide the answer generation
        const systemPrompt = "You are a helpful assistant that provides accurate, detailed, well-researched answers with reliable sources. Use markdown to format the answer. Answer the following question: ";

        // Call Exa API to answer the question
        const exaResponse = await exa.answer(systemPrompt + question, {
            model: 'exa-pro',
        });

        // Extract the actual answer content
        let answer = '';

        if (typeof exaResponse.answer === 'string') {
            // If it's already a string, use it directly
            answer = exaResponse.answer;
        } else {
            // Fallback for any other format
            answer = JSON.stringify(exaResponse, null, 2);
        }

        // Transform the citations to match our schema
        const citations = exaResponse.citations?.map((citation) => ({
            title: citation.title || 'Untitled',
            url: citation.url,
            favicon: citation.favicon || `https://www.google.com/s2/favicons?domain=${citation.url}&sz=128`,
        }));

        // Return the result as JSON
        return Response.json({ answer, citations });
    } catch (error) {
        console.error('Error processing answer request:', error);
        return Response.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}
