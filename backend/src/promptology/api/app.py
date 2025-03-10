"""FastAPI application for the Promptology API"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from promptology.agent.prompter import generate_prompt_async
from promptology.agent.reprompter import reprompt_async

# Create FastAPI app
app = FastAPI(
    title="Promptology API",
    description="API for the Promptology prompt engineering tool",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    """Request model for prompt generation"""

    query: str = Field(..., description="The user query to generate a prompt for")


class PromptResponse(BaseModel):
    """Response model for prompt generation"""

    prompt: str = Field(..., description="The generated prompt")


class RepromptRequest(BaseModel):
    """Request model for prompt refinement"""

    query: str = Field(..., description="The original user query")
    current_prompt: str = Field(..., description="The current prompt to refine")
    feedback: str = Field(..., description="User feedback on the current prompt")


@app.post("/generate-prompt", response_model=PromptResponse)
async def generate_prompt_endpoint(request: PromptRequest) -> PromptResponse:
    """
    Generate a prompt based on the user's query

    Args:
        request: The request containing the user query

    Returns:
        The generated prompt
    """
    try:
        prompt = await generate_prompt_async(request.query)
        return PromptResponse(prompt=prompt)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating prompt: {str(e)}"
        )


@app.post("/reprompt", response_model=PromptResponse)
async def reprompt_endpoint(request: RepromptRequest) -> PromptResponse:
    """
    Refine a prompt based on user feedback

    Args:
        request: The request containing the original query, current prompt, and feedback

    Returns:
        The refined prompt
    """
    try:
        refined_prompt = await reprompt_async(
            user_query=request.query,
            original_prompt=request.current_prompt,
            feedback=request.feedback,
        )
        return PromptResponse(prompt=refined_prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refining prompt: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
