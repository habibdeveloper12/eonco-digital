import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";

export function SectionHeader({ eyebrow, title, accent, text, dark, align = "center", className }: { eyebrow?: string; title: string; accent?: string; text?: string; dark?: boolean; align?: "center" | "left"; className?: string }) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto max-w-[760px] text-center", className)}>
      {eyebrow && <Eyebrow tone={dark ? "dark" : "light"}>{eyebrow}</Eyebrow>}
      <h2 className={cn("text-section-sm mt-4", dark ? "text-white" : "text-navy")}>
        {title} {accent && <span className="text-brand">{accent}</span>}
      </h2>
      {text && <p className={cn("mt-4 text-[18px] font-medium leading-[1.5]", dark ? "text-[#d7dae0]" : "text-body")}>{text}</p>}
    </Reveal>
  );
}
