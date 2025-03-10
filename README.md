# 🧠 Promptology

A creative prompt engineering workspace to craft, test, and refine prompts for AI models.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/camilovelezr/promptology.git
cd promptology

# Create environment file from template
cp .env.sample .env

# Start all services with Docker Compose
docker compose up -d

# Pull the default LLM model (if using Ollama)
./pull_llm.sh

# Open the web interface
open http://localhost:3000
```

## 🏗️ Architecture

Promptology consists of these main components:

- 🌐 **Frontend** - Next.js application for prompt creation and testing 
- 🔌 **Backend** - FastAPI service for handling prompt generation and evaluation
- 🤖 **LLM Provider** - Either:
  - **Ollama** (included): Local LLM service running in Docker
  - **LiteLLM** (external): Your own LiteLLM deployment

### System Architecture

The application uses a secure container-to-container communication pattern:

1. The **Next.js frontend** is exposed on port 3000 for browser access
2. The **FastAPI backend** is not directly exposed - it's only accessible within the Docker network
3. API requests from the browser are sent to Next.js API routes
4. These API routes proxy the requests to the backend over the secure Docker network

This architecture improves security by reducing exposed services while maintaining full functionality.

## 🛠️ Setup & Configuration

### Prerequisites

- Docker and Docker Compose
- Git
- curl (for model pulling)

### Detailed Setup Instructions

#### Step 1: Clone the Repository
```bash
git clone https://github.com/camilovelezr/promptology.git
cd promptology
```

#### Step 2: Configure Environment
```bash
# Create environment file from template
cp .env.sample .env
```

Edit the `.env` file based on your preferred LLM provider:

**Option A: Using Ollama (Recommended for local development)**
- Leave `OLLAMA_URL=http://ollama:11434/v1` as is
- Comment out or leave empty the `LITELLM_URL` line
- Set `LLM_MODEL=llama3.2:3b` (or your preferred model)

**Option B: Using LiteLLM (For external LLM service)**
- Set `LITELLM_URL` to your LiteLLM endpoint
- Set `LITELLM_API_KEY` if your LiteLLM requires authentication
- Set `LLM_MODEL` to match what your LiteLLM service supports

#### Step 3: Start Services
```bash
docker compose up -d
```

#### Step 4: Pull LLM Model (Ollama only)
If using Ollama, you need to pull the model after services are running:
```bash
./pull_llm.sh
```
This will pull the default `llama3.2:3b` model. For a different model:
```bash
./pull_llm.sh llama3:8b
```

#### Step 5: Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using LiteLLM Instead of Ollama

If you have your own LiteLLM deployment and want to use it instead of Ollama:

1. Edit `.env` and set `LITELLM_URL` to your LiteLLM instance URL
2. Set `LITELLM_API_KEY` if required
3. Optionally edit `compose.yml` to remove or comment out the Ollama service:
   ```yaml
   # Remove or comment out the ollama service section:
   #  ollama:
   #    image: ollama/ollama:latest
   #    volumes:
   #      - ollama-data:/root/.ollama
   #    command: serve
   #    networks:
   #      - promptology-network
   #    ports:
   #      - "11434:11434"
   ```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LLM_MODEL` | Yes | `llama3.2:3b` | Model to use for generation |
| `LITELLM_URL` | No | - | URL for LiteLLM API (takes precedence if set) |
| `LITELLM_API_KEY` | No | - | API key for LiteLLM if required |
| `OLLAMA_URL` | No | `http://ollama:11434/v1` | URL for Ollama API (used only if LITELLM_URL is not set) |
| `OLLAMA_API_KEY` | No | `ollama` | API key for Ollama if required |
| `BACKEND_URL` | Yes (in frontend) | `http://backend:8000` | Internal URL for backend API (not exposed to browser) |

**Important Notes:**
- If both `LITELLM_URL` and `OLLAMA_URL` are set, `LITELLM_URL` takes precedence
- At least one of `LITELLM_URL` or `OLLAMA_URL` must be set
- When using Ollama, you must pull your model after starting services
- The application uses a secure Docker network for internal communication

## 🔍 Usage

1. 📝 Create a new prompt in the web interface
2. ⚙️ Test the prompt with different parameters
3. 🔄 Refine and iterate on your prompt
4. 💾 Save your best prompts for future use

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js web interface (exposed) |
| Backend | - | FastAPI server (internal only) |
| Ollama | 11434 | LLM API server (optional, internal by default) |

## 🛠️ Troubleshooting

- **Model not found errors**: If using Ollama and getting model errors, make sure you've pulled the model with `./pull_llm.sh`
- **Connection refused**: Ensure all services are running with `docker compose ps`
- **Backend not responding**: Check logs with `docker compose logs backend`
- **Frontend not loading**: Check logs with `docker compose logs frontend`
- **API errors**: Check browser console and Next.js API route logs in `docker compose logs frontend`

## 📦 Development

See individual README files in `backend/` and `creative-prompts/` directories for development-specific instructions.