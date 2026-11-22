"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { homeServices } from "@/content/services";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";
import { ServiceArt, type ServiceArtKey } from "../visuals/ServiceArt";

type Item = (typeof homeServices)[number];

function Card({ s, i, compact = false }: { s: Item; i: number; compact?: boolean }) {
  return (
    <div className="group/card relative h-full w-full overflow-hidden rounded-[20px] bg-[#faf4f0] shadow-[0_14px_34px_rgba(32,48,58,0.086),0_2px_6px_rgba(80,57,43,0.06)]">
      <ServiceArt art={s.art as ServiceArtKey} />
      <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[260px] font-heading text-[26px] leading-[1.15] text-navy sm:text-[30px]">{s.title}</h3>
          <span className="font-heading text-[30px] font-medium leading-none text-[#d7dae0]">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <div className={compact ? "mt-auto pt-[46%]" : "mt-auto"}>
          <p className={(compact ? "max-w-none bg-white/95 " : "max-w-[56%] min-w-[220px] bg-white/75 ") + "rounded-[12px] p-3 text-[13.5px] leading-[1.45] text-body backdrop-blur-sm"}>{s.text}</p>
          <Link
            href={`/${s.slug}`}
            className="group/btn mt-4 inline-flex h-[50px] items-center gap-2 rounded-full bg-brand pl-6 pr-2 text-[16px] font-medium text-white transition-colors hover:bg-brand-600"
          >
            {s.cta}
            <span className="grid size-[36px] place-items-center rounded-full bg-white text-navy transition-transform duration-300 group-hover/btn:translate-x-1">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StackCard({ s, i, n, progress }: { s: Item; i: number; n: number; progress: MotionValue<number> }) {
  // offset < 0: card has been passed (flies out left); offset > 0: waiting in the stack.
  const offset = useTransform(progress, (p) => i - p * (n - 1));
  const x = useTransform(offset, (o) => (o >= 0 ? o * 112 : o * 640));
  const y = useTransform(offset, (o) => (o >= 0 ? o * -10 : o * -40));
  const scale = useTransform(offset, (o) => (o >= 0 ? 1 - o * 0.055 : 1 + o * 0.08));
  const rotate = useTransform(offset, (o) => (o >= 0 ? 0 : o * 8));
  const opacity = useTransform(offset, (o) => (o < 0 ? Math.max(0, 1 + o * 1.8) : o > 3.2 ? 0 : 1));
  return (
    <motion.div
      className="absolute left-0 top-0 h-[340px] w-[500px] origin-left will-change-transform"
      style={{ x, y, scale, rotate, opacity, zIndex: n - i }}
    >
      <Card s={s} i={i} />
    </motion.div>
  );
}

export function ServicesStack() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const n = homeServices.length;
  const active = useTransform(scrollYProgress, (p) => Math.round(p * (n - 1)));
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const counter = useTransform(active, (a) => String(a + 1).padStart(2, "0"));

  const header = (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-5">
      <div>
        <Reveal>
          <Eyebrow>Top services</Eyebrow>
        </Reveal>
        <SplitText className="text-section mt-4 text-navy" lines={[{ text: "All-in-One" }, { text: "Growth Solutions", accent: true }]} />
      </div>
      <Reveal delay={0.1}>
        <p className="text-lead text-[#3a3c42] lg:pt-[38px]">
          We build the systems that power revenue, improve customer experience and remove operational bottlenecks. From HubSpot implementation to custom websites, every service is engineered for measurable growth.
        </p>
      </Reveal>
    </div>
  );

  return (
    <section className="bg-white">
      {/* Desktop: pinned 3D card stack */}
      <div ref={wrap} className={reduce ? "hidden" : "relative hidden h-[300vh] lg:block"}>
        <div className="sticky top-0 flex h-screen min-h-[760px] flex-col justify-center overflow-hidden">
          <div className="container-x gutter">{header}</div>
          <div className="container-x gutter mt-12">
            <div className="relative mx-auto h-[360px] w-[840px] max-w-full">
              <div className="relative h-full">
                {homeServices.map((s, i) => (
                  <StackCard key={s.slug} s={s} i={i} n={n} progress={scrollYProgress} />
                ))}
              </div>
            </div>
            <div className="mx-auto mt-10 flex max-w-[520px] items-center gap-4">
              <motion.span className="font-heading text-[14px] font-medium tabular-nums text-navy">
                {counter}
              </motion.span>
              <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-line">
                <motion.div className="h-full bg-brand" style={{ width: barWidth }} />
              </div>
              <span className="font-heading text-[14px] font-medium text-muted">{String(n).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile, tablet and reduced motion: simple stacked list */}
      <div className={reduce ? "py-[80px]" : "py-[80px] lg:hidden"}>
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
