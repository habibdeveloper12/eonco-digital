import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";
import { PipelineBoard } from "../visuals/PipelineBoard";

/** Server-rendered hero. Entrance is a short GSAP sequence (data-* + MotionRuntime). */
const defaultLines = ["Growth Runs", "on Systems.", "We Build Them."];
const defaultText = "We design, build and run HubSpot systems for growing companies in Australia, the US, the UK and Europe: CRM, integrations, websites and the automation that connects them.";

/** Headline lines and intro can be changed in WordPress → Settings → Company Details. The last line is shown in brand red. */
export function Hero({ label, lines = defaultLines, text = defaultText }: { label: string; lines?: string[]; text?: string }) {
  const headline = lines.length ? lines : defaultLines;
  return (
    <section className="relative overflow-hidden bg-cream-2">
      <div className="container-x gutter grid items-center gap-12 pb-16 pt-[112px] lg:min-h-[min(100svh,960px)] lg:grid-cols-[1fr_560px] lg:gap-10 lg:pb-12 lg:pt-[104px]">
        <div className="relative z-10">
          <Reveal on="load">
            <Eyebrow tone="glass">{label}</Eyebrow>
          </Reveal>

          <SplitText
            as="h1"
            on="load"
            delay={0.1}
            className="h-display mt-6 text-[44px] leading-[1] text-ink sm:text-[60px] xl:text-[72px]"
            lineClassName="pb-[0.06em]"
            lines={headline.map((l, i) => ({ text: l, accent: headline.length > 1 && i === headline.length - 1 }))}
          />

          <Reveal on="load" delay={0.5}>
            <p className="mt-6 max-w-[540px] text-[18px] leading-[1.55] text-body">
              {text}
            </p>
          </Reveal>

          <Reveal on="load" delay={0.65} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <span className="hidden sm:block">
              <Button href="/schedule-meeting">Book a call</Button>
            </span>
            {/* Mobile: full-width pill with arrow disc */}
            <Link href="/schedule-meeting" className="flex h-[60px] w-full items-center justify-between rounded-full bg-brand pl-6 pr-2 text-[18px] font-medium text-white active:scale-[0.99] sm:hidden">
              Book a call
              <span className="grid size-[46px] place-items-center rounded-full bg-white text-navy">
                <ArrowRight className="size-5" />
              </span>
            </Link>
            <Link href="/case-studies" className="group/cs inline-flex items-center gap-2 text-[17px] font-medium text-navy transition-colors hover:text-brand">
              See our work
              <ArrowRight className="size-4 transition-transform duration-200 group-hover/cs:translate-x-[3px]" />
            </Link>
          </Reveal>
        </div>

        <Reveal on="load" delay={0.3} y={40}>
          <PipelineBoard />
        </Reveal>
      </div>
    </section>
  );
}
