---
name: '✨ Feature: Implement Rotate PDF Tool'
about: Implement functionality to rotate individual pages or entire PDF documents.
title: 'feat(pdf): Implement Rotate PDF Tool'
labels: ['feature', 'pdf', 'help wanted', 'good first issue']
assignees: ''
---

## Problem Description
The "Rotate PDF" tool (`id: "rotate-pdf"`) is marked as a placeholder in `src/config/tools.ts`. Users need a way to correct document orientation by rotating pages within a PDF, either individually or the entire document, all client-side.

## Expected Behavior
When a user navigates to the `/rotate-pdf` route, they should be able to upload a PDF. The tool should display a preview of the PDF pages and allow the user to select specific pages or all pages for rotation. Users should be able to choose rotation angles (e.g., 90°, 180°, 270° clockwise). The processed PDF should be downloadable.

## Acceptance Criteria
- [ ] A dedicated page for the "Rotate PDF" tool is accessible at `/rotate-pdf`.
- [ ] Users can upload a single PDF file.
- [ ] The tool displays thumbnails or a preview of all PDF pages.
- [ ] Users can select individual pages or an option to apply rotation to all pages.
- [ ] Users can specify rotation angles (e.g., 90, 180, 270 degrees clockwise).
- [ ] A "Rotate" button is present and clickable once a PDF is uploaded and rotation options are chosen.
- [ ] Upon processing, the rotated PDF file is generated client-side and available for download.
- [ ] No network requests containing PDF file data are made.
- [ ] The `status` for the `rotate-pdf` tool in `src/config/tools.ts` is updated from `"placeholder"` to `"implemented"`.

## Technical Context
- **Tool Definition:** `src/config/tools.ts` (id: `rotate-pdf`)
- **Frontend Component:** The component `src/features/pdf/components/RotatePdfTool.tsx` currently exists but contains a placeholder message. It needs to be fully implemented.
- **Core Logic:** Client-side PDF manipulation using `pdf-lib` to modify page rotation, ideally in a Web Worker.
- **UI/UX:** Needs a clear interface for page selection and rotation controls, potentially with visual feedback on rotation.

## Contributor Notes
This is a good task for understanding `pdf-lib` page modification and integrating it with a React component. The existing `RotatePdfTool.tsx` component is a starting point.