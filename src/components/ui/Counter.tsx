/**
 * Count-up number. The final value is rendered in the HTML (readable by search
 * engines and AI crawlers); the GSAP runtime counts up to it when in view.
 * An invisible copy of the final value reserves the width, so nothing shifts.
 */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const text = value.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span className={className} data-count={value} data-decimals={decimals || undefined}>
      {prefix}
      <span className="relative inline-block tabular-nums">
        <span aria-hidden className="invisible">
          {text}
        </span>
        <span data-count-value className="absolute inset-0">
          {text}
        </span>
      </span>
      {suffix}
    </span>
  );
}
