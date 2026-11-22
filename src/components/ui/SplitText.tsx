import { cn } from "./cn";

type Line = { text: string; accent?: boolean };

/**
 * Line-by-line masked heading reveal. Each line sits in an overflow-hidden
 * mask and rises into place (GSAP runtime). The full text is in the HTML.
 */
export function SplitText({
  lines,
  className,
  as: Tag = "h2",
  delay = 0,
  on = "scroll",
  lineClassName,
}: {
  lines: Line[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  on?: "scroll" | "load";
  lineClassName?: string;
}) {
  return (
    <Tag className={className} data-split={on === "load" ? "load" : ""} data-delay={delay || undefined}>
      {lines.map((l, i) => (
        <span key={i} className={cn("block overflow-hidden pb-[0.08em]", lineClassName)}>
          <span data-line className={cn("block", l.accent && "text-brand")} style={on === "load" ? ({ "--d": `${delay + i * 0.12}s` } as React.CSSProperties) : undefined}>
            {l.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Per-letter reveal used for showcase titles. */
export function LetterReveal({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap", className)} data-split="chars" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden">
          <span data-line className="inline-block">
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
