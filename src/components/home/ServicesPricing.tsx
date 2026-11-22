"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Clock } from "lucide-react";
import { useId, useRef, useState } from "react";
import { formatPrice, pricingServices } from "@/content/expertise";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";
import { cn } from "../ui/cn";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Package ladder: the three real tiers for the selected service. */
function PackageLadder({ s }: { s: (typeof pricingServices)[number] }) {
  return (
    <div className="self-start rounded-[16px] border border-line bg-cloud p-2">
      <p className="px-4 pb-2 pt-3 text-[13px] font-medium text-muted">Packages</p>
      <ol className="space-y-1">
        {s.packages.map((pk, i) => {
          const p = formatPrice(pk.price);
          const first = i === 0;
          return (
            <li key={pk.name} className={cn("rounded-[12px] px-4 py-4", first ? "border border-line bg-white shadow-card" : "")}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="font-heading text-[12px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-heading text-[16px] font-medium text-navy">{pk.name}</span>
                </span>
                <span className="whitespace-nowrap text-right">
                  <span className={cn("font-display text-[20px] sm:text-[22px] font-medium tabular-nums", first ? "text-brand-600" : "text-navy")}>{p.amount}</span>
                  {p.per && <span className="ml-1 text-[13px] text-muted">/ {p.per}</span>}
                </span>
              </div>
              <p className="mt-1 pl-[30px] text-[13px] text-body">{pk.timeline.replace("Timeline: ", "")}</p>
            </li>
          );
        })}
      </ol>
      <p className="px-4 pb-2 pt-3 text-[12px] leading-[1.5] text-muted">Indicative USD pricing, confirmed after discovery</p>
    </div>
  );
}

export function ServicesPricing() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = pricingServices[active];
  const start = formatPrice(s.packages[0].price);

  function onKey(e: React.KeyboardEvent, i: number) {
    const n = pricingServices.length;
    const next = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const j = (next + n) % n;
    setActive(j);
    tabs.current[j]?.focus();
  }

  return (
    <section className="bg-white py-[96px]">
      <div className="container-x gutter">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-5">
          <div>
            <Reveal>
              <Eyebrow>Services & pricing</Eyebrow>
            </Reveal>
            <SplitText className="text-section-sm mt-4 text-navy" lines={[{ text: "Clear Scope," }, { text: "Published Starting Prices", accent: true }]} />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-[520px] text-[17px] leading-[1.55] text-body lg:ml-auto">
              Every service comes in three packages, so you know the starting point before the first call. Pick a service to see what is included and how long it takes.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12 grid gap-4 lg:grid-cols-[300px_1fr]">
          {/* Tab list: vertical on desktop, horizontal scroll on mobile */}
          <div
            role="tablist"
            aria-label="Services"
            aria-orientation="vertical"
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-[16px] lg:bg-cloud lg:p-2"
          >
            {pricingServices.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.slug}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] transition-colors lg:py-[14px]",
                    on ? "bg-navy text-white" : "border border-line text-navy hover:bg-white lg:border-transparent",
                  )}
                >
                  <Icon name={t.icon} className={cn("size-[18px] shrink-0", on ? "text-white" : "text-subtle")} strokeWidth={1.5} />
                  <span className="whitespace-nowrap font-medium lg:whitespace-normal">{t.name}</span>
                  <span className={cn("ml-auto hidden font-heading text-[12px] tabular-nums lg:block", on ? "text-white/50" : "text-muted")}>{String(i + 1).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="overflow-hidden rounded-[16px] border border-line bg-white">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={s.slug}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease }}
                className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_340px]"
              >
                <div>
                  <h3 className="font-display text-[28px] font-medium leading-[1.15] text-navy sm:text-[32px]">{s.name}</h3>
                  <p className="mt-2 text-[16px] text-body">{s.blurb}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <p className="text-[15px] text-navy">
                      From <span className="font-display text-[24px] font-medium tabular-nums text-brand-600">{start.amount}</span>
                      {start.per && <span className="text-muted"> / {start.per}</span>}
                    </p>
                    <p className="flex items-center gap-2 text-[14px] text-body">
                      <Clock className="size-4 text-subtle" strokeWidth={1.5} />
                      {s.packages[0].timeline.replace("Timeline: ", "")}
                    </p>
                  </div>

                  <p className="mt-6 max-w-[560px] text-[15px] leading-[1.65] text-body">{s.heroText}</p>

                  <p className="mt-8 text-[14px] font-medium text-navy">What we cover</p>
                  <ul className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {s.types.map((t) => (
                      <li key={t.title} className="flex gap-3 text-[15px] text-navy">
                        <span className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-[5px] bg-brand-50 text-brand-600">
                          <Check className="size-3" strokeWidth={2.5} />
                        </span>
                        {t.title}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Button href={`/${s.slug}#packages`} size="sm">
                      Compare packages
                    </Button>
                    <Link href={`/start-a-project?service=${s.slug}`} className="group/q inline-flex items-center gap-2 text-[15px] font-medium text-navy transition-colors hover:text-brand">
                      Get a quote
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover/q:translate-x-[2px]" />
                    </Link>
                  </div>
                </div>

                <PackageLadder s={s} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
