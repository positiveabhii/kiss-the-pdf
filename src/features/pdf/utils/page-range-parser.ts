/**
 * Parses a comma-separated string of page ranges into an array of 1-based page numbers.
 * Example: "1-3, 5" -> [1, 2, 3, 5]
 * Throws an error if the range is invalid or exceeds maxPages.
 */
export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  if (!rangeStr.trim()) return [];
  
  const pages = new Set<number>();
  const parts = rangeStr.split(",").map(s => s.trim());
  
  for (const part of parts) {
    if (!part) continue;
    
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
        throw new Error(`Invalid page range: ${part}`);
      }
      
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page) || page < 1 || page > maxPages) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.add(page);
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}
