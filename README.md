# AI Resume Analyzer

A modern AI-powered resume analyzer built with React Router 7, Puter.js, and Tailwind CSS. This tool helps users analyze their resumes against job descriptions, calculate ATS scores, and get AI-driven feedback.

## Features

-   📄 **PDF Analysis**: Convert PDF resumes to images for AI processing.
-   🤖 **AI Powered**: Utilizes Puter.js AI (Claude 3.5 Sonnet) for resume evaluation and feedback.
-   📊 **ATS Scoring**: Calculate ATS compatibility scores based on job descriptions.
-   📁 **Puter Integration**: Leverages Puter.js for authentication, cloud storage (FS), and Key-Value (KV) storage.
-   ⚡ **Modern Stack**: Built with React Router 7, TypeScript, and Tailwind CSS 4.
-   🚀 **Server-Side Rendering**: Optimized for performance and SEO.

## Stack

-   **Framework**: [React Router 7](https://reactrouter.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **AI & Backend Services**: [Puter.js](https://docs.puter.com/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **PDF Processing**: [pdf.js](https://mozilla.github.io/pdf.js/)
-   **Package Manager**: npm

## Requirements

-   Node.js 20 or higher
-   npm (or compatible package manager)
-   A browser compatible with Puter.js

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Environment Variables

Currently, the project does not require any explicit `.env` variables as it uses Puter.js for backend services. If you need to add any, you can define them in a `.env` file at the root.

-   `TODO`: Add any required API keys if moving away from Puter.js managed services.

## Scripts

-   `npm run dev`: Start the development server with HMR.
-   `npm run build`: Create a production-ready build.
-   `npm run start`: Run the built application in production mode.
-   `npm run typecheck`: Generate React Router types and run TypeScript compiler.

## Project Structure

```text
├── app/
│   ├── components/    # Reusable UI components
│   ├── lib/           # Library code (Puter, PDF conversion, etc.)
│   ├── routes/        # Page routes and application logic
│   ├── root.tsx       # Root component and layout
│   └── routes.ts      # Route definitions
├── constants/         # Application constants
├── public/            # Static assets
├── types/             # TypeScript type definitions
├── Dockerfile         # Docker configuration
└── react-router.config.ts # React Router configuration
```

## Tests

-   `TODO`: Implement automated tests. Currently, no test runner is configured in `package.json`.

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t ai-resume-analyzer .

# Run the container
docker run -p 3000:3000 ai-resume-analyzer
```

### Manual Deployment

1. Build the application:
    ```bash
    npm run build
    ```
2. Deploy the `build/` directory to a Node.js environment.

## License

-   `TODO`: Add license information (e.g., MIT, Apache 2.0).

---

Built with ❤️ using React Router and Puter.js.
