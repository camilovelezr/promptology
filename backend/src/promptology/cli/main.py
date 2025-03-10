"""Main CLI entry point for the Promptology project"""

import typer
import uvicorn
from typing import Optional

# Create the main app with serve as the default command
app = typer.Typer(
    name="promptology",
    help="Promptology - A tool for prompt engineering",
    add_completion=False,
    no_args_is_help=False,  # Don't show help when no arguments are provided
)


# Define serve as a subcommand and also make it the default command
@app.callback(invoke_without_command=True)
def callback(ctx: typer.Context):
    """Promptology CLI"""
    if ctx.invoked_subcommand is None:
        # If no subcommand is provided, run the serve command with default options
        serve()


@app.command()
def serve(
    host: str = typer.Option("0.0.0.0", help="Host to bind the server to"),
    port: int = typer.Option(8000, help="Port to bind the server to"),
    reload: bool = typer.Option(True, help="Enable auto-reload on code changes"),
    workers: Optional[int] = typer.Option(None, help="Number of worker processes"),
    log_level: str = typer.Option("info", help="Log level"),
):
    """Start the Promptology API server"""
    uvicorn_config = {
        "app": "promptology.api.app:app",
        "host": host,
        "port": port,
        "reload": reload,
        "log_level": log_level,
    }

    if workers is not None:
        uvicorn_config["workers"] = workers

    typer.echo(f"Starting Promptology API server at http://{host}:{port}")
    uvicorn.run(**uvicorn_config)


# This is used when the CLI is run directly
def main():
    app()


if __name__ == "__main__":
    main()
