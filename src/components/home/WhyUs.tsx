import { stats } from "@/content/misc";
import { Counter } from "../ui/Counter";
import { Eyebrow } from "../ui/Eyebrow";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";
import { cn } from "../ui/cn";

export function WhyUs({ cards = stats.why }: { cards?: typeof stats.why }) {
  return (
    <section className="py-[80px]">
      <div className="container-narrow gutter">
        <div className="grid gap-6 lg:grid-cols-[1fr_518px] lg:items-start">
          <div>
            <Reveal>
              <Eyebrow>Why us</Eyebrow>
            </Reveal>
            <SplitText className="text-section-sm mt-4 text-navy" lines={[{ text: "We Build Your" }, { text: "Revenue Engine", accent: true }]} />
          </div>
          <Reveal delay={0.1}>
            <p className="text-[17px] leading-[1.55] text-body lg:pt-2">
              Businesses choose Take Solution Today because we build the foundations growth depends on: clean data, connected tools, automation people trust and reporting leadership can act on. We stay accountable after launch, so the system keeps improving as you scale.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-[14px] md:grid-cols-2 lg:grid-cols-[509fr_266fr_266fr]">
          {cards.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className={cn(i === 0 && "md:col-span-2 lg:col-span-1")}>
              <article className="group flex h-full min-h-[280px] flex-col rounded-[16px] border border-line bg-cloud p-6 transition-colors duration-300 hover:bg-white lg:min-h-[340px]">
                <span className="grid size-9 place-items-center rounded-[10px] bg-white text-brand-600 ring-1 ring-line">
                  <Icon name={s.icon} className="size-[18px]" strokeWidth={1.5} />
                </span>
                <Counter value={s.value} suffix={s.suffix} className={cn("mt-6 block font-display font-medium leading-none tabular-nums text-navy", i === 0 ? "text-[64px]" : "text-[48px]")} />
                <h3 className="mt-3 font-heading text-[18px] font-medium leading-[1.25] text-navy">{s.title}</h3>
                <div className="mt-auto pt-8">
                  <div className="mb-5 h-px w-full origin-left scale-x-[0.3] bg-line-2 transition-[scale,background-color] duration-500 group-hover:scale-x-100 group-hover:bg-brand" />
                  <p className="text-[15px] leading-[1.55] text-body">{s.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
