/**
 * API service for communicating with the Promptology backend
 */

// Get the API URL from environment variables, with a fallback
const API_URL = process.env.NEXT_PUBLIC_PROMPTOLOGY_URL || 'http://localhost:8000';

/**
 * Generate a prompt based on a user query
 * 
 * @param query - The user query to generate a prompt for
 * @returns The generated prompt
 */
export async function generatePrompt(query: string): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/generate-prompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate prompt');
        }

        const data = await response.json();
        return data.prompt;
    } catch (error) {
        console.error('Error generating prompt:', error);
        throw error;
    }
}

/**
 * Refine a prompt based on user feedback
 * 
 * @param query - The original user query
 * @param currentPrompt - The current prompt to refine
 * @param feedback - User feedback on the current prompt
 * @returns The refined prompt
 */
export async function refinePrompt(
    query: string,
    currentPrompt: string,
    feedback: string
): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/reprompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                current_prompt: currentPrompt,
                feedback,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to refine prompt');
        }

        const data = await response.json();
        return data.prompt;
    } catch (error) {
        console.error('Error refining prompt:', error);
        throw error;
    }
} 