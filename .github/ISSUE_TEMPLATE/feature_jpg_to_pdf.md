---
name: '✨ Feature: Implement JPG to PDF Conversion'
about: Implement functionality to convert one or more JPG images into a single PDF document.
title: 'feat(convert): Implement JPG to PDF Tool'
labels: ['feature', 'convert', 'help wanted', 'good first issue']
assignees: ''
---

## Problem Description
The "JPG to PDF" tool (`id: "jpg-to-pdf"`) is a placeholder in `src/config/tools.ts`. Users need a way to combine multiple JPG images into a single PDF document, enabling easy sharing and archival of image collections, all client-side.

## Expected Behavior
When a user navigates to the `/jpg-to-pdf` route, they should be able to upload one or more JPG image files. The tool should allow them to arrange the images in the desired order and then convert them into a single PDF. The resulting PDF should be available for download without server interaction.

## Acceptance Criteria
- [ ] A dedicated page for the "JPG to PDF" tool is accessible at `/jpg-to-pdf`.
- [ ] Users can upload multiple JPG image files.
- [ ] The tool displays uploaded images and allows for reordering.
- [ ] Options for page size (e.g., A4, Letter, auto-fit) and orientation (portrait/landscape) for the generated PDF are available.
- [ ] A "Convert to PDF" button is present and clickable once images are uploaded.
- [ ] Upon processing, a single PDF file containing all uploaded images is generated client-side.
- [ ] The converted PDF is immediately available for download.
- [ ] No network requests containing image or PDF file data are made.
- [ ] The `status` for the `jpg-to-pdf` tool in `src/config/tools.ts` is updated from `"placeholder"` to `"implemented"`.

## Technical Context
- **Tool Definition:** `src/config/tools.ts` (id: `jpg-to-pdf`)
- **Frontend Component:** The component would likely reside in `src/app/(app)/[tool]/page.tsx` and utilize a feature component from `src/features/pdf/components/ImageConversionTool.tsx` (which would need to be created or extended).
- **Core Logic:** Client-side image-to-PDF conversion using `pdf-lib` to embed images into new PDF pages, ideally in a Web Worker.
- **Dependencies:** May require a lightweight image loading/processing library if `pdf-lib`'s image embedding is not sufficient for all JPG types.

## Contributor Notes
This is a straightforward conversion tool. The task involves handling image file uploads, ordering, `pdf-lib` operations to create a new PDF and embed images, and managing download. Good for getting familiar with image handling and PDF creation.