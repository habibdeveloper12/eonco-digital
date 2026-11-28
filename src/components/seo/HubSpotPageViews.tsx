"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    _hsq?: unknown[][];
  }
}

/**
 * HubSpot's script records the first page view on load. Next.js changes pages
 * without a reload, so later views are reported here via the documented
 * `_hsq` queue (setPath + trackPageView). The first render is skipped so the
 * initial view is not counted twice.
 */
function Tracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const path = pathname + (search?.toString() ? `?${search}` : "");
    const q = (window._hsq = window._hsq || []);
    q.push(["setPath", path]);
    q.push(["trackPageView"]);
  }, [pathname, search]);

  return null;
}

export function HubSpotPageViews() {
  // useSearchParams needs a Suspense boundary so static pages stay static.
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
