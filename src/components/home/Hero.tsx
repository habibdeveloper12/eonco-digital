"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { PipelineBoard } from "../visuals/PipelineBoard";

const ease = [0.2, 0.8, 0.2, 1] as const;

const lines = [
  { t: "Growth Runs", accent: false },
  { t: "on Systems.", accent: false },
  { t: "We Build Them.", accent: true },
];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section className="relative overflow-hidden bg-cream-2">
      <div className="container-x gutter grid items-center gap-12 pb-16 pt-[112px] lg:min-h-[min(100svh,960px)] lg:grid-cols-[1fr_560px] lg:gap-10 lg:pb-12 lg:pt-[104px]">
        <div className="relative z-10">
          <motion.div {...rise(0)}>
            <Eyebrow tone="glass">{site.partnerLabel}</Eyebrow>
          </motion.div>

          <h1 className="h-display mt-6 text-[44px] leading-[1] text-ink sm:text-[60px] xl:text-[72px]">
            {lines.map((l, i) => (
              <span key={l.t} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={l.accent ? "block text-brand" : "block"}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.12, ease }}
                >
                  {l.t}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="mt-6 max-w-[540px] text-[18px] leading-[1.55] text-body" {...rise(0.55)}>
            We design, build and run HubSpot systems for growing companies in Australia, the US, the UK and Europe: CRM, integrations, websites and the automation that connects them.
          </motion.p>

          <motion.div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8" {...rise(0.7)}>
            <span className="hidden sm:block">
              <Button href="/schedule-meeting">Book a call</Button>
            </span>
            {/* Mobile: full-width pill with arrow disc */}
            <Link href="/schedule-meeting" className="flex h-[60px] w-full items-center justify-between rounded-full bg-brand pl-6 pr-2 text-[18px] font-medium text-white sm:hidden">
              Book a call
              <span className="grid size-[46px] place-items-center rounded-full bg-white text-navy">
                <ArrowRight className="size-5" />
              </span>
            </Link>
            <Link href="/case-studies" className="group/cs inline-flex items-center gap-2 text-[17px] font-medium text-navy transition-colors hover:text-brand">
              See our work
              <ArrowRight className="size-4 transition-transform duration-200 group-hover/cs:translate-x-[3px]" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease }}
        >
          <PipelineBoard />
        </motion.div>
      </div>
    </section>
  );
}
