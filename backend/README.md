# Promptology Backend

Backend service for the Promptology prompt engineering workspace.

## 🔧 Development Setup

### Prerequisites

- Python 3.10+
- Poetry (dependency management)

### Installation

```bash
# Install dependencies
poetry install

# Activate the virtual environment
poetry shell
```

### Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` to configure your LLM provider:

#### Option 1: Using Ollama
```
OLLAMA_URL=http://localhost:11434/v1  # Use 'http://ollama:11434/v1' with Docker Compose
OLLAMA_API_KEY=ollama                 # Default value, change if needed
LLM_MODEL=llama3.2:3b                 # Model name
```

#### Option 2: Using LiteLLM
```
LITELLM_URL=http://your-litellm-url   # URL to your LiteLLM instance
LITELLM_API_KEY=your-api-key          # API key if required
LLM_MODEL=llama3.2:3b                 # Model name that LiteLLM supports
```

## 🚀 Usage

### Starting the API server

```bash
# Start the API server with default settings
promptology serve

# Start the API server with custom settings
promptology serve --host 127.0.0.1 --port 8080 --workers 4
```

### API Endpoints

- `POST /api/generate-prompt`: Generate a prompt based on a user query
- `POST /api/reprompt`: Refine a prompt based on user feedback
- `GET /health`: Health check endpoint

#### Generate Prompt

```json
POST /api/generate-prompt
{
  "query": "I need a prompt to help me write a research paper on climate change"
}
```

#### Reprompt (Refine Prompt)

```json
POST /api/reprompt
{
  "query": "I need a prompt to help me write a research paper on climate change",
  "current_prompt": "You are an expert academic writer...",
  "feedback": "Make it more focused on policy implications"
}
```

## ⚙️ Configuration

The application can be configured using environment variables:

### LLM Provider Options

You can choose to use either Ollama (included in Docker Compose) or your own LiteLLM deployment:

#### Option 1: Using Ollama

- `OLLAMA_URL`: URL of the Ollama server (default: http://ollama:11434/v1 when using Docker Compose)
- `OLLAMA_API_KEY`: API key for Ollama if required (default: "ollama")

#### Option 2: Using External LiteLLM

- `LITELLM_URL`: URL of your LiteLLM server
- `LITELLM_API_KEY`: API key for your LiteLLM server if required

#### Common Settings

- `LLM_MODEL`: Model to use for prompt generation (default: llama3.2:3b)

### Configuration Priority

- If both `LITELLM_URL` and `OLLAMA_URL` are set, `LITELLM_URL` takes precedence
- At least one of `LITELLM_URL` or `OLLAMA_URL` must be set
- When using Ollama, ensure the specified model is pulled/available

## 🧪 Development

```bash
# Install development dependencies
poetry install --with dev

# Run tests
poetry run pytest

# Format code
poetry run black .
```

## 🐳 Docker Deployment

In production, this service is typically deployed with Docker Compose. See the main project README for details on the complete deployment. 