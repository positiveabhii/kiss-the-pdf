# Security Policy

## Supported Versions

Currently, the project is in early development. Only the latest `main` branch is supported.

## Reporting a Vulnerability

Security is a high priority, especially for a tool handling user documents. If you discover a security vulnerability within this project, please DO NOT report it by creating a public GitHub issue.

Instead, please email the maintainers directly.

## Our Security Philosophy

*   **Client-Side Processing**: We believe the most secure way to handle user data is to never collect it. Whenever possible, file processing occurs entirely within the user's browser.
*   **Untrusted Input**: Any file provided by a user is treated as untrusted input. The parsing engines must handle malformed or malicious files gracefully without compromising the user's environment or the application.
*   **Dependency Management**: We strive to keep our dependencies up to date and minimize the number of external libraries to reduce the attack surface.
*   **No Unnecessary Data Retention**: In future phases where server-side processing might be introduced (only as a fallback or for specific heavy tasks), files will be processed in isolated environments (e.g., sandboxed workers) and immediately deleted after processing. We do not store user files.
