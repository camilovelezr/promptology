# Use Python 3.11 slim as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Install the package and its dependencies
RUN pip install -e .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose port for FastAPI
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "src.promptology.api.app:app", "--host", "0.0.0.0", "--port", "8000"] 