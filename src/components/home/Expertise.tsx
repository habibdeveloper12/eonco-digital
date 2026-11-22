import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { expertise } from "@/content/expertise";
import { Eyebrow } from "../ui/Eyebrow";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";

/**
 * Six practice cards on navy. Each card: practice name, one-line promise,
 * then the real service pages that sit inside it.
 */
export function Expertise() {
  return (
    <section className="bg-navy py-[96px] text-white">
      <div className="container-x gutter">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-5">
          <div>
            <Reveal>
              <Eyebrow tone="dark" dot={false}>
                Expertise
              </Eyebrow>
            </Reveal>
            <SplitText className="text-section-sm mt-4 text-white" lines={[{ text: "Expertise Across Your" }, { text: "Whole Revenue Stack", accent: true }]} />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-[520px] text-[17px] leading-[1.55] text-white/70 lg:ml-auto">
              Six practices, one team. Every engagement starts from how your business runs, then brings in the specialists it needs, from CRM architects to designers and developers.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expertise.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 0.06} className="h-full">
              <article className="flex h-full flex-col rounded-[16px] border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-[10px] bg-white/[0.06] text-white/80">
                        <Icon name={g.icon} className="size-[18px]" strokeWidth={1.5} />
                      </span>
                      <h3 className="font-heading text-[19px] font-medium leading-[1.25]">{g.title}</h3>
                    </div>
                    <Link
                      href={`/${g.items[0].slug}`}
                      aria-label={`Explore ${g.title}`}
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                  <p className="mt-4 text-[15px] leading-[1.55] text-white/65">{g.text}</p>
                </div>

                <div className="border-t border-white/10 p-6">
                  <p className="text-[13px] font-medium text-white/45">Popular services</p>
                  <ul className="mt-3 space-y-1">
                    {g.items.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/${s.slug}`} className="group/l -mx-2 flex items-center justify-between rounded-[8px] px-2 py-2 text-[15px] text-white/85 transition-colors hover:bg-white/[0.05] hover:text-white">
                          {s.name}
                          <ArrowRight className="size-4 text-white/30 transition-[color,transform] duration-200 group-hover/l:translate-x-[2px] group-hover/l:text-brand" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
