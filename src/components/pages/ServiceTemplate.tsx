import Link from "next/link";
import { Check, Minus, ArrowRight } from "lucide-react";
import type { Service } from "@/content/services";
import type { Project } from "@/lib/wordpress";
import { ConsultCta } from "../home/ConsultCta";
import { WhyUs } from "../home/WhyUs";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";
import { CaseTile } from "./CaseTile";
import { Faq } from "./Faq";
import { ServiceHeroVisual } from "./HeroVisual";
import { PageHero } from "./PageHero";
import { RichContent } from "./RichContent";
import { SectionHeader } from "./SectionHeader";

export function ServiceTemplate({ s, related }: { s: Service; related: Project[] }) {
  return (
    <>
      <PageHero
        eyebrow={s.group === "hubspot" ? "HubSpot Services" : "Digital Services"}
        title={s.heroTitle}
        text={s.heroText}
        primary={{ label: "Get a quote", href: `/start-a-project?service=${s.slug}` }}
        secondary={s.packages.length ? { label: "See all packages", href: "#packages" } : undefined}
        visual={<ServiceHeroVisual icon={s.icon} label={s.name} image={s.image} imageAlt={s.imageAlt} />}
      />

      {/* Intro */}
      <section className="py-[80px]">
        <div className="container-narrow gutter grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            <h2 className="text-section-sm mt-4 text-navy">{s.intro.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-4">
            {s.intro.body.map((p) => (
              <p key={p} className="text-[18px] leading-[1.6] text-body">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* In depth: long-form content written in the WordPress editor */}
      {s.html && (
        <section className="pb-[40px]">
          <div className="mx-auto max-w-[820px] px-5">
            <RichContent html={s.html} />
          </div>
        </section>
      )}

      {/* Problems */}
      {s.problems.length > 0 && <section className="py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="The problem" title={`Why ${s.name}`} accent="Projects Stall" text="Most teams do not fail because of the software. They fail because of the four gaps below." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {s.problems.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08}>
                <article className="group h-full rounded-[20px] border-[0.8px] border-line-2 bg-cloud p-8 transition-colors hover:bg-white">
                  <span className="font-display text-[56px] font-bold leading-none text-brand/15 transition-colors group-hover:text-brand">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-[24px] font-medium text-navy">{p.title}</h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-body">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>}

      {/* Starting points */}
      {s.starting.length > 0 && <section className="py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="Your situation" title="Where Are You" accent="Starting From?" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.starting.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <article className="flex h-full flex-col rounded-[20px] bg-navy p-6 text-white">
                  <span className="grid size-10 place-items-center rounded-full bg-brand font-heading text-[15px]">{i + 1}</span>
                  <h3 className="mt-8 font-display text-[22px] font-medium leading-[1.15]">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.55] text-white/75">{p.text}</p>
                  <Link href={`/start-a-project?service=${s.slug}`} className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold text-white hover:text-brand-100">
                    This is us <ArrowRight className="size-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>}

      {/* Results */}
      {s.results.length > 0 && <section className="bg-cream-3 py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="Outcomes" title="What Results" accent="You Can Expect" />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {s.results.map((r, i) => (
              <Reveal key={r.title} delay={(i % 2) * 0.08}>
                <article className="flex h-full gap-5 rounded-[20px] bg-white p-7 shadow-soft">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                    <Check className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[22px] font-medium text-navy">{r.title}</h3>
                    <p className="mt-2 text-[16px] leading-[1.55] text-body">{r.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>}

      {/* Types */}
      {s.types.length > 0 && <section className="bg-cream-3 pb-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="What we deliver" title={`Types of ${s.name}`} accent="Services We Offer" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.types.map((t, i) => (
              <Reveal key={t.title} delay={(i % 3) * 0.06}>
                <article className="group h-full rounded-[20px] border-[0.8px] border-line bg-white p-7 transition-colors duration-300 hover:border-brand/40">
                  <span className="block h-[3px] w-10 rounded-full bg-brand transition-[width] duration-500 group-hover:w-20" />
                  <h3 className="mt-5 font-display text-[22px] font-medium text-navy">{t.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-body">{t.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>}

      {/* Comparison */}
      {s.comparison.rows.length > 0 && <section className="py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="Comparison" title="Typical Approach vs" accent="Take Solution Today" />
          <Reveal className="mt-12 overflow-x-auto rounded-[20px] border-[0.8px] border-line">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-cloud">
                  <th scope="col" className="px-6 py-5 text-[14px] font-medium text-muted">
                    Area
                  </th>
                  <th scope="col" className="px-6 py-5 text-[14px] font-medium text-muted">
                    Typical approach
                  </th>
                  <th scope="col" className="bg-navy px-6 py-5 text-[14px] font-medium text-white">
                    Take Solution Today
                  </th>
                </tr>
              </thead>
              <tbody>
                {s.comparison.rows.map(([a, b, c]) => (
                  <tr key={a} className="border-t border-line">
                    <th scope="row" className="px-6 py-5 font-heading text-[16px] font-medium text-navy">
                      {a}
                    </th>
                    <td className="px-6 py-5 text-[15px] text-body">
                      <span className="flex items-center gap-2">
                        <Minus className="size-4 shrink-0 text-muted" />
                        {b}
                      </span>
                    </td>
                    <td className="bg-brand-50/60 px-6 py-5 text-[15px] font-medium text-navy">
                      <span className="flex items-center gap-2">
                        <Check className="size-4 shrink-0 text-brand" />
                        {c}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>}

      {/* Process */}
      {s.process.length > 0 && <section className="py-[80px]">
        <div className="container-narrow gutter grid gap-12 lg:grid-cols-[360px_1fr]">
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <SectionHeader align="left" eyebrow="Process" title={`Our ${s.name}`} accent="Process" text="Six stages, each with a clear output you sign off before we move on." />
          </div>
          <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-px before:bg-line">
            {s.process.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.04 * i}>
                <div className="relative flex gap-6 rounded-[20px] border-[0.8px] border-line bg-white p-6">
                  <span className="relative z-10 grid size-[56px] shrink-0 place-items-center rounded-full bg-brand font-display text-[20px] font-bold text-white">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-[22px] font-medium text-navy">{p.title}</h3>
                    <p className="mt-2 text-[16px] leading-[1.55] text-body">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>}

      {/* Packages */}
      {s.packages.length > 0 && <section id="packages" className="scroll-mt-24 bg-cloud py-[100px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="Packages" title={`${s.name}`} accent="Cost & Packages" />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {s.packages.map((pk, i) => (
              <Reveal key={pk.name} delay={i * 0.08}>
                <article className={cn("flex h-full flex-col rounded-[20px] border-[0.8px] p-6", i === 1 ? "border-brand bg-white shadow-card" : "border-line-2 bg-cloud")}>
                  <div className="rounded-[10px] bg-white p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-[24px] font-medium text-navy">{pk.name}</h3>
                      {i === 1 && <span className="rounded-full bg-brand px-3 py-1 text-[12px] font-bold uppercase text-white">Popular</span>}
                    </div>
                    <p className="mt-3 flex items-end gap-1">
                      <span className="font-display text-[48px] font-medium leading-none text-navy sm:text-[56px]">{pk.price}</span>
                      <span className="pb-2 text-[16px] text-navy">{pk.unit}</span>
                    </p>
                  </div>
                  <p className="mt-5 text-[16px] font-semibold text-navy">{pk.timeline}</p>
                  <ul className="mt-5 space-y-5">
                    {pk.items.map((it) => (
                      <li key={it.title} className="flex gap-3">
                        <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                          <Check className="size-[14px]" />
                        </span>
                        <div>
                          <p className="font-display text-[19px] font-bold leading-[1.2] text-navy">{it.title}</p>
                          <p className="mt-1 text-[15px] leading-[1.5] text-body">{it.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/start-a-project?service=${s.slug}&package=${pk.name.toLowerCase()}`}
                    className={cn("mt-8 inline-flex h-[52px] items-center justify-center rounded-full text-[16px] font-medium transition-colors", i === 1 ? "bg-brand text-white hover:bg-brand-600" : "border border-navy/20 text-navy hover:border-brand hover:text-brand")}
                  >
                    Choose {pk.name}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-[13px] text-muted">Prices in USD and indicative. Final pricing is confirmed after discovery.</p>
        </div>
      </section>}

      {/* Featured works */}
      {related.length > 0 && <section className="bg-navy py-[90px]">
        <div className="container-narrow gutter">
          <SectionHeader dark eyebrow="Case studies" title="Our Featured" accent="Works" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {related.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.08}>
                <CaseTile c={c} i={i} dark />
              </Reveal>
            ))}
          </div>
        </div>
      </section>}

      <WhyUs />

      {/* FAQ */}
      {s.faqs.length > 0 && <section className="bg-white py-[80px]">
        <div className="container-narrow gutter grid gap-10 lg:grid-cols-[360px_1fr]">
          <SectionHeader align="left" eyebrow="FAQ" title="Questions You" accent="Might Have" />
          <Faq items={s.faqs} />
        </div>
      </section>}

      <ConsultCta title={["Start Your ", s.name, " with Us"]} />
    </>
  );
}
