"use client";

import { useEffect, useState } from "react";

/**
 * Mount/unmount with CSS enter and exit transitions (a 10-line replacement for
 * AnimatePresence in global UI, so the animation library stays out of the
 * shared bundle). `mounted` controls rendering, `shown` toggles the CSS state.
 */
export function usePresence(open: boolean, exitMs = 220) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame, so the "from" styles paint before transitioning to "to".
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs]);
  return { mounted, shown };
}
