import { NextResponse } from 'next/server';

// Get the backend URL from server environment (not exposed to client)
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export async function GET() {
    try {
        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/health`);

        if (!response.ok) {
            return NextResponse.json(
                { status: 'error', message: 'Backend health check failed' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in health API route:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to connect to backend' },
            { status: 500 }
        );
    }
} 