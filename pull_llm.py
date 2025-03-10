"""Pull model to Ollama.

This script allows pulling models into Ollama via the API.
Used primarily after starting Docker services to load the LLM model.
"""

import json
import requests
import typer

app = typer.Typer()


@app.command()
def pull(model: str):
    """
    Pull a model to Ollama.

    Args:
        model: Name of the model to pull (e.g., 'llama3.2:3b')
    """
    url = "http://localhost:11434/api/pull"
    payload = {"model": model}

    print(f"Pulling model: {model}")
    print(f"Sending request to: {url}")

    try:
        response = requests.post(url, json=payload, stream=True)

        # Handle streaming response
        for line in response.iter_lines():
            if line:
                try:
                    data = json.loads(line)
                    if "status" in data:
                        print(f"Status: {data['status']}")
                    if "completed" in data and data["completed"]:
                        print("Download completed successfully!")
                except json.JSONDecodeError:
                    print(f"Error parsing response: {line}")
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")


if __name__ == "__main__":
    app()
