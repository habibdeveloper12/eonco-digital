"use client";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Count-up number (used in stat cards). */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.8, ease: [0.2, 0.8, 0.2, 1], onUpdate: setDisplay });
    return () => c.stop();
  }, [inView, value, reduce]);
  const fmt = (n: number) => n.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  // Pad with figure spaces (same width as a digit) so the layout does not shift while counting.
  const formatted = fmt(display).padStart(fmt(value).length, " ");
  return (
    <span ref={ref} className={className} aria-label={`${prefix}${fmt(value)}${suffix}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/** Odometer: each digit is a rolling column of 0-9 (Why Us cards). */
export function Odometer({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const digits = String(value).split("");
  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      <span aria-hidden className="inline-flex leading-none">
        {digits.map((d, i) => (
          <span key={i} className="relative inline-block h-[1em] overflow-hidden">
            <span
              className="flex flex-col transition-transform duration-[1800ms] ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ transform: `translateY(${inView ? -Number(d) * 10 : 0}%)`, transitionDelay: `${i * 120}ms` }}
            >
              {Array.from({ length: 10 }).map((_, n) => (
                <span key={n} className="block h-[1em] tabular-nums">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ))}
        <span>{suffix}</span>
      </span>
    </span>
  );
}
