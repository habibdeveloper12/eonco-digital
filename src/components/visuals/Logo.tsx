import Link from "next/link";
import { cn } from "../ui/cn";

/**
 * Eonco Digital mark: an "E" drawn as three pipeline-stage bars on a stem.
 * Flat, one colour (inherits `currentColor`, defaults to brand red).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("text-brand", className)} aria-hidden>
      <path
        fill="currentColor"
        d="M6 9a3 3 0 0 1 3-3h22a3 3 0 0 1 0 6H13v5h12a3 3 0 0 1 0 6H13v5h18a3 3 0 0 1 0 6H9a3 3 0 0 1-3-3V9z"
      />
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="Eonco Digital home" className={cn("flex items-center gap-[10px]", className)}>
      <LogoMark className="size-[30px]" />
      <span className={cn("whitespace-nowrap font-display text-[21px] font-medium leading-none tracking-[-0.01em]", light ? "text-white" : "text-navy")}>
        Eonco Digital
      </span>
    </Link>
  );
}
