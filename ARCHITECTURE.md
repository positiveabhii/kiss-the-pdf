# Architecture

This document describes the current and future architecture of the Open-Source PDF Toolkit.

## Current Architecture

The project is built on Next.js 14+ using the App Router, providing a robust, fast, and SEO-friendly foundation.

```text
Next.js
 ↓
App Router
 ↓
Application Shell (Sidebar, Header, Main Arena)
 ↓
Tool Registry (src/config/tools.ts)
 ↓
Tool Routes (src/app/[tool]/page.tsx)
```

### Key Concepts

*   **Application Shell**: Provides the main layout including the sidebar, header, and mobile navigation. The main content area ("Main Arena") is designed to host individual tools dynamically.
*   **Tool Registry**: To manage 100+ tools efficiently, navigation and tool definitions are not hardcoded into the UI. Instead, they are defined in a centralized `Tool Registry`. The sidebar reads from this registry to generate navigation groups.
*   **Categories**: Tools are organized into categories (e.g., PDF, Images, Convert) for better discoverability.

## Future Architecture

The ultimate goal is to perform as much processing as possible directly on the client to guarantee privacy.

```text
Tool UI
 ↓
Web Worker (Background thread to prevent UI freezing)
 ↓
PDF Engine (e.g., pdf-lib, PDF.js)
 ↓
WASM / JavaScript (Execution)
 ↓
Browser-local processing
```

### Why Local Processing?
Local processing ensures that user files never leave their device. It eliminates the need for complex backend infrastructure, reduces server costs, and fundamentally respects user privacy.

### Lazy Loading Heavy Libraries
Processing libraries (like PDF parsing WASM binaries) can be large. They must be strictly lazy-loaded only when a user navigates to a specific tool. The global application shell must remain extremely lightweight and fast.

### Adding New Tools
Tools will integrate into the existing shell by implementing standard interfaces (e.g., `ToolHeader`, `UploadArea`, `ProcessingArea`, `ResultArea`).

### Why No Backend (Initially)?
Starting without a backend forces the project to maximize client-side capabilities. If certain complex operations (like OCR) strictly require a server, isolated workers can be introduced later. For now, the focus is entirely frontend-first.
