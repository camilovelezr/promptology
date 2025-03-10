"""Configuration for the promptology project"""

from dotenv import load_dotenv, find_dotenv
import os
import logging

logging.basicConfig(level=logging.INFO)
logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

load_dotenv(find_dotenv())

LITELLM_URL = os.getenv("LITELLM_URL", None)
LITELLM_API_KEY = os.getenv("LITELLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "llama3.2")
OLLAMA_URL = os.getenv("OLLAMA_URL", None)
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "ollama")

if LITELLM_URL is None and OLLAMA_URL is None:
    raise ValueError("LiteLLM or Ollama must be set")

if LITELLM_URL is not None and LITELLM_API_KEY == "":
    logger.warning(
        "LITELLM_API_KEY is set to empty string, make sure this is intentional"
    )

if LITELLM_URL is not None and OLLAMA_URL is not None:
    logger.info("LiteLLM and Ollama are both set, LiteLLM will be used")

if LITELLM_URL is None and OLLAMA_URL is not None:
    logger.info("Ollama is set, LiteLLM is not set, using Ollama")

if LITELLM_URL is not None and OLLAMA_URL is None:
    logger.info("LiteLLM is set, Ollama is not set, using LiteLLM")

SERVICE_URL = LITELLM_URL or OLLAMA_URL
SERVICE_API_KEY = LITELLM_API_KEY or OLLAMA_API_KEY
