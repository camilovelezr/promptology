# CreAItive

A modern, elegant prompt engineering tool for teams to create effective AI prompts.

## Overview

CreAItive is an internal tool designed to help teams create, refine, and share AI prompts for various AI models and applications. This tool provides a clean, user-friendly interface for prompt engineering.

## Features

- Simple, intuitive interface for creating prompts
- Real-time preview of generated responses
- Copy functionality for easy sharing
- Helpful prompt engineering tips and guidelines
- Integration with Promptology backend API for prompt generation and refinement

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS v4
- **UI/UX**: Modern, minimal, elegant design focused on usability
- **Backend**: FastAPI (Promptology API)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- Access to the Promptology API (running locally or remotely)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd creative-prompts
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following content:
```
NEXT_PUBLIC_PROMPTOLOGY_URL=http://localhost:8000
```
Adjust the URL to match your Promptology API endpoint.

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Key Files

- `src/app/page.tsx`: Main prompt interface
- `src/app/api.ts`: API service for communicating with the Promptology backend
- `src/app/globals.css`: Global styling
- `tailwind.config.js`: Tailwind CSS configuration

## License

Internal use only. All rights reserved.
