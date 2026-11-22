"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { homeServices } from "@/content/services";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";
import { ServiceArt, type ServiceArtKey } from "../visuals/ServiceArt";

type Item = (typeof homeServices)[number];

function Card({ s, i, compact = false }: { s: Item; i: number; compact?: boolean }) {
  return (
    <div className="group/card relative h-full w-full overflow-hidden rounded-[20px] bg-[#faf4f0] shadow-[0_14px_34px_rgba(32,48,58,0.08),0_2px_6px_rgba(80,57,43,0.05)]">
      <ServiceArt art={s.art as ServiceArtKey} />
      <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[260px] font-heading text-[26px] leading-[1.15] text-navy sm:text-[30px]">{s.title}</h3>
          <span className="font-heading text-[28px] font-medium leading-none tabular-nums text-[#d7dae0]">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <div className={compact ? "mt-auto pt-[46%]" : "mt-auto"}>
          <p className={(compact ? "max-w-none bg-white/95 " : "max-w-[56%] min-w-[220px] bg-white/80 ") + "rounded-[12px] p-3 text-[14px] leading-[1.45] text-body"}>{s.text}</p>
          <Link href={`/${s.slug}`} className="group/btn mt-4 inline-flex h-[48px] items-center gap-2 rounded-full bg-brand pl-6 pr-2 text-[16px] font-medium text-white transition-colors hover:bg-brand-600">
            {s.cta}
            <span className="grid size-[34px] place-items-center rounded-full bg-white text-navy transition-transform duration-300 group-hover/btn:translate-x-1">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const header = (
  <div className="grid gap-6 lg:grid-cols-2 lg:gap-5">
    <div>
      <Reveal>
        <Eyebrow>Top services</Eyebrow>
      </Reveal>
      <SplitText className="text-section mt-4 text-navy" lines={[{ text: "All-in-One" }, { text: "Growth Solutions", accent: true }]} />
    </div>
    <Reveal delay={0.1}>
      <p className="text-lead text-body lg:pt-[38px]">
        We build the systems that power revenue, improve customer experience and remove operational bottlenecks. From HubSpot implementation to custom websites, every service is engineered for measurable growth.
      </p>
    </Reveal>
  </div>
);

/**
 * Desktop: the section pins and the service cards fan through a 3D-style stack
 * as you scroll (GSAP ScrollTrigger, scrubbed). Mobile, tablet and reduced
 * motion get a simple grid of the same cards.
 */
export function ServicesStack() {
  const pin = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const n = homeServices.length;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // offset < 0: card has been passed (flies out left), offset > 0: waiting in the stack.
      const place = (p: number) => {
        cards.current.forEach((el, i) => {
          if (!el) return;
          const o = i - p * (n - 1);
          gsap.set(el, {
            x: o >= 0 ? o * 112 : o * 640,
            y: o >= 0 ? o * -10 : o * -40,
            scale: o >= 0 ? 1 - o * 0.055 : 1 + o * 0.08,
            rotate: o >= 0 ? 0 : o * 8,
            autoAlpha: o < 0 ? Math.max(0, 1 + o * 1.8) : o > 3.2 ? 0 : 1,
            zIndex: n - i,
          });
        });
        if (counter.current) counter.current.textContent = String(Math.round(p * (n - 1)) + 1).padStart(2, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      };
      place(0);
      const st = ScrollTrigger.create({
        trigger: pin.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (n - 1) * 0.6}`,
        pin: true,
        scrub: 0.6,
        // Settle on a whole card when the user stops scrolling.
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, ease: "power2.inOut" },
        onUpdate: (self) => place(self.progress),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [n]);

  return (
    <section className="bg-white">
      {/* Desktop: pinned card stack */}
      <div ref={pin} className="hidden h-screen min-h-[760px] flex-col justify-center overflow-hidden motion-safe:lg:flex">
        <div className="container-x gutter">{header}</div>
        <div className="container-x gutter mt-12">
          <div className="relative mx-auto h-[360px] w-[840px] max-w-full">
            {homeServices.map((s, i) => (
              <div
                key={s.slug}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="absolute left-0 top-0 h-[340px] w-[500px] origin-left will-change-transform"
                style={{ transform: `translateX(${i * 112}px) translateY(${i * -10}px) scale(${1 - i * 0.055})`, zIndex: n - i, opacity: i > 3 ? 0 : 1 }}
              >
                <Card s={s} i={i} />
              </div>
            ))}
          </div>
          <div className="mx-auto mt-10 flex max-w-[520px] items-center gap-4" aria-hidden>
            <span ref={counter} className="font-heading text-[14px] font-medium tabular-nums text-navy">
              01
            </span>
            <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-line">
              <div ref={bar} className="h-full origin-left bg-brand" style={{ transform: "scaleX(0)" }} />
            </div>
            <span className="font-heading text-[14px] font-medium tabular-nums text-muted">{String(n).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* Mobile, tablet and reduced motion: simple grid */}
      <div className="py-[80px] motion-safe:lg:hidden">
        <div className="container-x gutter">{header}</div>
        <div className="container-x gutter mt-10 grid gap-5 md:grid-cols-2">
          {homeServices.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.08} className="h-[460px] sm:h-[420px]">
              <Card s={s} i={i} compact />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
