export function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === "AbortError";
}