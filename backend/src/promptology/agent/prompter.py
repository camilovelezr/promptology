"""Prompting Agent"""

from openai import OpenAI
from openai import AsyncOpenAI
from promptology.config import SERVICE_URL, SERVICE_API_KEY, LLM_MODEL

# Use environment variables or default values for API configuration
client = OpenAI(base_url=SERVICE_URL, api_key=SERVICE_API_KEY)
async_client = AsyncOpenAI(base_url=SERVICE_URL, api_key=SERVICE_API_KEY)

SYSTEM_PROMPT = (
    "You are an expert prompt engineer."
    "Think carefully about what makes a prompt effective."
    "They call you 'the promptologist' because you are THE BEST PROMPT ENGINEER EVER."
    "Your prompts are efficient, effective, well formatted."
    "You will be given a user query and you will need to generate"
    "a prompt that the user can use with an LLM."
    "Be sure to create a wonderful prompt that helps guide the LLM"
    "You can base your prompt format on the following example:"
    "Always include a directive to the LLM, like 'Help me do ...'"
    "Create a character/persona for the LLM - NOT FOR THE USER-, like 'You are an expert in ..., You are the best at...'"
    "The prompt should be of the right length to include all specific details"
    "<example>"
    "Goal: <goal of the prompt>"
    "Instructions: <instructions for the prompt>"
    "Output: <expected output of the prompt>"
    "Considerations: <any other relevant information, list format>"
    "</example>"
    "BUT you DO NOT have to follow this format exactly"
    "Use your best judgement to create a prompt that is clear and effective."
    "Only respond with the prompt, nothing else."
    "No explanation is needed, just the prompt."
    "If user includes considerations, context, or any other information"
    "BE SURE TO INCLUDE IT IN THE PROMPT"
    "If user includes examples, BE SURE TO INCLUDE THEM IN THE PROMPT"
    "If user includes specific details, BE SURE TO INCLUDE THEM IN THE PROMPT"
    "Be extremely specific and detailed"
    "Only respond with the prompt, once."
    "Be thorough and systematic in your approach"
    "Try not to generate prompts that are too short"
    "IMPORTANT: ALWAYS MAKE SURE TO RESPOND IN THE SAME LANGUAGE AS THE USER QUERY"
    "Do not mix languages in the same prompt"
)


def generate_prompt(user_query: str) -> str:
    """Generate a prompt based on the user's query and all information gathered"""
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_query},
        ],
    )
    return response.choices[0].message.content


async def generate_prompt_async(user_query: str) -> str:
    """
    Async version of generate_prompt to be used with FastAPI.

    Args:
        user_query: The user's query to generate a prompt for

    Returns:
        The generated prompt as a string
    """
    response = await async_client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_query},
        ],
    )
    return response.choices[0].message.content
