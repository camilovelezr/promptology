import { NextResponse } from 'next/server';

// Get the backend URL from server environment (not exposed to client)
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/generate-prompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.detail || 'Failed to generate prompt' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in generate-prompt API route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 