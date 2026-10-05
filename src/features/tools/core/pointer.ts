/**
 * Pointer capture that never throws.
 *
 * `setPointerCapture` throws `NotFoundError` when the pointer is no longer
 * active — a pen leaving hover range, a pointer cancelled by the OS between
 * the event and the call. Uncaught inside a pointerdown handler, that kills
 * the whole gesture (no stroke, no drag). Capture is a nicety; the gesture
 * must go on without it.
 */
export function capturePointer(el: Element | null | undefined, pointerId: number): void {
  try {
    el?.setPointerCapture(pointerId);
  } catch {
    /* pointer already gone — continue uncaptured */
  }
}

export function releasePointer(el: Element | null | undefined, pointerId: number): void {
  try {
    if (el?.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
  } catch {
    /* ignore */
  }
}
