---
name: '✨ Feature: Implement Merge PDF Tool'
about: Implement the core functionality for combining multiple PDF files into one.
title: 'feat(pdf): Implement Merge PDF Tool'
labels: ['feature', 'pdf', 'help wanted', 'good first issue']
assignees: ''
---

## Problem Description
The "Merge PDF" tool (`id: "merge-pdf"`) is currently a placeholder in the `src/config/tools.ts` file and lacks actual implementation. Users need a way to combine multiple PDF documents into a single file directly in their browser, upholding the project's privacy-first philosophy.

## Expected Behavior
When a user accesses the `/merge-pdf` route, they should be presented with an interface to upload multiple PDF files. After selecting files, they should be able to initiate a merge operation. The merged PDF should then be available for download without any server-side processing.

## Acceptance Criteria
- [ ] A dedicated page for the "Merge PDF" tool is accessible at `/merge-pdf`.
- [ ] Users can upload multiple PDF files (via drag-and-drop or file selection).
- [ ] The tool displays a list of uploaded PDF files, allowing users to reorder them before merging.
- [ ] A "Merge" button is present and clickable once at least two PDF files are uploaded.
- [ ] Upon clicking "Merge", a single combined PDF file is generated client-side.
- [ ] The merged PDF is immediately available for download.
- [ ] No network requests containing PDF file data are made during the merging process.
- [ ] The `status` for the `merge-pdf` tool in `src/config/tools.ts` is updated from `"placeholder"` to `"implemented"`.

## Technical Context
- **Tool Definition:** `src/config/tools.ts` (id: `merge-pdf`)
- **Frontend Component:** The component for this tool would likely reside in `src/app/(app)/[tool]/page.tsx` and utilize a feature component from `src/features/pdf/components/MergePdfTool.tsx` (which would need to be created).
- **Core Logic:** Client-side PDF manipulation should leverage `pdf-lib` for merging PDF documents in a Web Worker to prevent blocking the main thread.
- **UI/UX:** Design should align with existing KissThePDF tools, focusing on simplicity and ease of use.

## Contributor Notes
This is a core feature and a good candidate for a new contributor to get familiar with the client-side PDF processing architecture. The task involves creating the React component, handling file uploads, implementing the `pdf-lib` merging logic, and managing the download.
