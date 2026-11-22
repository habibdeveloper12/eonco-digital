import { cn } from "./cn";

type Props = { children: React.ReactNode; tone?: "light" | "dark" | "glass"; dot?: boolean; className?: string };

/** Small label above section headings ("Who we are", "Top services"...). Sentence case, quiet. */
export function Eyebrow({ children, tone = "light", dot = true, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium leading-[1.4]",
        tone === "light" && "border border-line bg-white text-body",
        tone === "glass" && "border border-navy/10 bg-white/70 text-body",
        tone === "dark" && "border border-white/15 text-white/75",
        className,
      )}
    >
      {dot && <span className="size-[6px] rounded-full bg-brand" />}
      {children}
    </span>
  );
}
