#!/bin/bash

# pull_llm.sh - Pulls LLM models into Ollama
#
# This script is used to load models into Ollama after starting Docker services.
# Run this script after 'docker compose up -d' if you're using Ollama as your LLM provider.
# Not needed if you're using LiteLLM (when LITELLM_URL is set in .env).
#
# Usage: ./pull_llm.sh [model_name]
# Default model if none specified: llama3.2:3b

# Default model to pull if no arguments are provided
MODEL="llama3.2:3b"

# If arguments are provided, use the first argument as the model name
if [ $# -gt 0 ]; then
    MODEL="$1"
fi

echo "Pulling model: $MODEL"

# Use curl to directly make the API request
curl -X POST http://localhost:11434/api/pull \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$MODEL\"}"
