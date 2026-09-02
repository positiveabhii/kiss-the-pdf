# Development Guide

This guide will help you set up your local development environment and understand our development conventions.

## Local Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be running at [http://localhost:3000](http://localhost:3000).

## Commands

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Creates an optimized production build.
*   `npm run start`: Starts a production server based on the build output.
*   `npm run lint`: Runs ESLint to check for code quality and formatting issues.

## Coding Conventions

*   **TypeScript**: This project uses TypeScript strictly. Avoid using `any`; define proper interfaces or types for your data.
*   **Components**: Keep components small and reusable. Use functional components and React hooks.
*   **Styling**: Use Tailwind CSS for styling. Avoid writing custom CSS unless absolutely necessary. Keep class lists organized.
*   **Server vs. Client Components**: By default, Next.js App Router uses Server Components. Only add `"use client"` at the top of a file when the component requires interactivity (e.g., `useState`, `onClick`, browser APIs).
*   **Directory Structure**: Adhere to the established structure (see `ARCHITECTURE.md`).

## State Management

For the initial phases, we rely on local React state (`useState`, `useReducer`) and React Context if necessary. Do not introduce heavy global state management libraries (like Redux) unless the complexity of the application genuinely requires it.
