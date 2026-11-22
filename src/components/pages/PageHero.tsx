import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  visual?: React.ReactNode;
  tone?: "cloud" | "cream" | "navy";
  centered?: boolean;
};

/** Inner-page hero: 48px display title, lead copy, two CTAs, optional visual. */
export function PageHero({ eyebrow, title, text, primary, secondary, visual, tone = "cloud", centered }: Props) {
  const dark = tone === "navy";
  return (
    <section className={cn("pb-[56px] pt-[120px] lg:pt-[140px]", tone === "cloud" && "bg-cloud", tone === "cream" && "bg-cream-2", dark && "bg-navy text-white")}>
      <div className={cn("container-narrow gutter grid items-center gap-10", visual && !centered && "lg:grid-cols-[1fr_419px]", centered && "text-center")}>
        <Reveal>
          {eyebrow && <Eyebrow tone={dark ? "dark" : "light"}>{eyebrow}</Eyebrow>}
          <h1 className={cn("h-display mt-4 text-[36px] leading-[1.08] sm:text-[48.15px]", dark ? "text-white" : "text-navy", centered && "mx-auto max-w-[820px]")}>{title}</h1>
          {text && <p className={cn("mt-5 max-w-[650px] text-[18px] font-medium leading-[1.55]", dark ? "text-white/80" : "text-body", centered && "mx-auto")}>{text}</p>}
          {(primary || secondary) && (
            <div className={cn("mt-8 flex flex-wrap gap-4", centered && "justify-center")}>
              {primary && <Button href={primary.href}>{primary.label}</Button>}
              {secondary && (
                <Button href={secondary.href} variant="outline">
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
        </Reveal>
        {visual && !centered && <Reveal delay={0.1}>{visual}</Reveal>}
      </div>
    </section>
  );
}
