import Link from "next/link";
import { cn } from "../ui/cn";

/**
 * Take Solution Today mark: a "T" whose crossbar is three pipeline stages
 * (brightening left to right) resting on one stem, the same stage-bar
 * signature used across the site. Flat, one colour (`currentColor`, brand red).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("text-brand", className)} aria-hidden>
      <g fill="currentColor">
        <rect x="5" y="6" width="9.5" height="7" rx="3.5" opacity="0.45" />
        <rect x="16.5" y="6" width="7" height="28" rx="3.5" />
        <rect x="25.5" y="6" width="9.5" height="7" rx="3.5" opacity="0.72" />
      </g>
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="Take Solution Today home" className={cn("flex items-center gap-[10px]", className)}>
      <LogoMark className="size-[30px]" />
      <span className={cn("whitespace-nowrap font-display text-[21px] font-medium leading-none tracking-[-0.01em]", light ? "text-white" : "text-navy")}>
        Take Solution Today
      </span>
    </Link>
  );
}
