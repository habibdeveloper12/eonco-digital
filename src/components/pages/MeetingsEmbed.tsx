"use client";

import { useEffect, useState } from "react";

/**
 * HubSpot Meetings scheduler, embedded without HubSpot's loader script.
 * HubSpot's iframe posts its content height to the parent page; we listen for
 * that message and resize, exactly what MeetingsEmbedCode.js does, but it also
 * works after client-side navigation and adds no third-party JavaScript.
 *
 * The calendar's own colours (buttons, selected day) come from HubSpot:
 * Settings → Meetings / Brand kit → set the primary colour to #dc1f36.
 */
export function MeetingsEmbed({ url, title }: { url: string; title: string }) {
  const [height, setHeight] = useState(700);
  const [loaded, setLoaded] = useState(false);
  const src = `${url}${url.includes("?") ? "&" : "?"}embed=true`;

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!/\.hubspot\.com$/.test(new URL(e.origin).hostname)) return;
      // HubSpot currently sends {"height": n}; older builds sent {meetingsHeight: n}.
      let d: unknown = e.data;
      if (typeof d === "string") {
        try {
          d = JSON.parse(d);
        } catch {
          return;
        }
      }
      const msg = d as { height?: number; meetingsHeight?: number } | null;
      const h = msg?.height ?? msg?.meetingsHeight;
      if (typeof h === "number" && h > 200) setHeight(Math.ceil(h));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="relative" style={{ minHeight: 640 }}>
      {/* Quiet skeleton until HubSpot's calendar has painted */}
      {!loaded && (
        <div aria-hidden className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3 text-[14px] text-muted">
            <span className="flex gap-[4px]">
              <span className="h-[4px] w-6 animate-pulse rounded-full bg-brand" />
              <span className="h-[4px] w-4 animate-pulse rounded-full bg-brand/60 [animation-delay:150ms]" />
              <span className="h-[4px] w-6 animate-pulse rounded-full bg-brand/30 [animation-delay:300ms]" />
            </span>
            Loading available times
          </div>
        </div>
      )}
      <iframe
        title={title}
        src={src}
        onLoad={() => setLoaded(true)}
        className="relative w-full transition-opacity duration-300"
        style={{ height, opacity: loaded ? 1 : 0 }}
        allow="payment"
      />
    </div>
  );
}
