import { accreditations, stats } from "@/content/misc";
import { Counter } from "../ui/Counter";
import { Eyebrow } from "../ui/Eyebrow";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";
import { cn } from "../ui/cn";

const steps = ["Strategy", "Build", "Launch", "Support"];

export function WhoWeAre({ figures = stats.whoWeAre }: { figures?: typeof stats.whoWeAre }) {
  return (
    <section className="bg-white py-[88px]">
      <div className="container-x gutter">
        <div className="text-center">
          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
          </Reveal>
          <SplitText className="text-section mt-4 text-navy" lines={[{ text: "Fast-Growing" }, { text: "HubSpot Growth Agency", accent: true }]} />
        </div>

        <Reveal className="mt-12 rounded-[16px] border border-line bg-white">
          <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {figures.map((s, i) => (
              <div key={s.label} className={cn("px-6 py-8 text-left sm:px-8", i === 1 && "sm:border-l sm:border-line lg:border-l-0", i === 3 && "sm:border-l sm:border-line lg:border-l-0")}>
                <p className="text-[15px] text-body">{s.label}</p>
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} className="mt-3 block font-display text-[44px] font-medium leading-none tabular-nums text-navy" />
                <p className="mt-5 text-[14px] leading-[1.5] text-muted">
                  {s.note.map(([t, tone], k) => (
                    <span key={k} className={tone === "accent" ? "text-navy" : undefined}>
                      {t}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-[3fr_2fr]">
          <Reveal className="rounded-[16px] bg-cloud p-6 sm:p-8" delay={0.05}>
            <p className="font-heading text-[20px] font-medium text-navy">Full-stack HubSpot expertise</p>
            <p className="mt-2 max-w-[520px] text-[15px] leading-[1.55] text-body">Onboarding, integration and migration delivered by one in-house certified team, from discovery to go-live.</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {accreditations.map((a) => (
                <li key={a.label} className="flex items-center gap-3 rounded-[12px] border border-line bg-white p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand-50 text-brand-600">
                    <Icon name={a.icon} className="size-[18px]" strokeWidth={1.5} />
                  </span>
                  <span className="text-[15px] font-medium text-navy">{a.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="flex flex-col rounded-[16px] bg-navy p-6 text-white sm:p-8" delay={0.12}>
            <p className="font-heading text-[20px] font-medium">Outcome-led partnership</p>
            <p className="mt-2 text-[15px] leading-[1.55] text-white/70">We measure success by adoption and revenue, not by tickets closed.</p>
            {/* One team across the whole journey */}
            <ol className="mt-auto grid grid-cols-4 gap-2 pt-8">
              {steps.map((s, i) => (
                <li key={s}>
                  <div className="h-[3px] rounded-full bg-brand" style={{ opacity: 0.4 + i * 0.2 }} />
                  <p className="mt-3 text-[13px] text-white/80">{s}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[13px] text-white/50">One team from strategy to support</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
