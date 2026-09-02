# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Development Workflow

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally: `git clone https://github.com/your-username/pdf-toolkit.git`
3.  **Install dependencies**: `npm install`
4.  **Create a new branch**: `git checkout -b feature/your-feature-name`
5.  **Make your changes** and test them thoroughly.
6.  **Run formatting and linting**: `npm run lint`
7.  **Commit your changes**: `git commit -m "Add some feature"`
8.  **Push to the branch**: `git push origin feature/your-feature-name`
9.  **Submit a pull request**.

## Adding a New Tool (Future Example)

When the PDF engine is ready, adding a tool will look something like this:

1.  **Create the tool route**:
    Create `src/app/compress-pdf/page.tsx`.
2.  **Implement the UI**:
    Use shared components for the upload area and result display.
3.  **Register the tool**:
    Add the tool to `src/config/tools.ts`:
    ```typescript
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce the file size of your PDF.',
      category: 'PDF',
      href: '/compress-pdf',
      icon: 'minimize',
      available: true
    }
    ```
4.  **Implement the logic**:
    Ensure the processing logic is executed in a Web Worker (or equivalent) so it does not block the main thread.

*(Note: Actual PDF processing features are not yet implemented. This is a future guideline.)*
