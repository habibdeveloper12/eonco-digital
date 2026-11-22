"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { themes } from "@/content/misc";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";
import { SiteMock } from "../visuals/Mockups";

export function ProductsCarousel() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = themes.length;
  const go = useCallback((d: number) => setState(([i]) => [(i + d + n) % n, d]), [n]);

  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => go(1), 5500);
    return () => clearInterval(t);
  }, [paused, reduce, go]);

  const t = themes[index];

  return (
    <section className="bg-navy py-[54px] lg:py-[54px]" aria-roledescription="carousel" aria-label="HubSpot themes">
      <div className="container-x gutter text-center">
        <Reveal>
          <Eyebrow tone="dark" dot={false}>
            Products
          </Eyebrow>
          <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.1] text-white sm:text-[37.45px]">
            Our Premium
            <br />
            <span className="text-brand">HubSpot Themes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[577px] text-[18px] font-medium leading-[1.45] text-[#d7dae0]">
            A curated set of production-ready HubSpot CMS themes, each built for a specific industry and tuned for speed and conversion.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 max-w-[1064px] px-4">
        <div
          className="rounded-[30px] bg-white p-3 shadow-[0_-5px_20px_rgba(1,44,76,0.05)] sm:p-[30px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-[20px] bg-cloud">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0.4 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0.4 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                className="grid gap-6 p-5 lg:grid-cols-[400px_1fr] lg:gap-10"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${n}`}
              >
                <div className="flex flex-col py-2 text-left">
                  <p className="text-[16px] font-medium tracking-wide text-navy sm:text-[18px]">{t.category}</p>
                  <h3 className="mt-2 font-display text-[24px] font-medium leading-[1.2] text-brand">{t.tagline}</h3>
                  <p className="mt-5 text-[16px] font-medium leading-[1.45] text-body sm:text-[18px]">{t.description}</p>
                  <p className="mt-5 font-display text-[24px] font-medium text-navy">{t.price}</p>
                  <div className="mt-auto flex items-center gap-4 pt-6">
                    <Link href={`/hubspot-themes/${t.slug}`} className="rounded-full bg-brand px-6 py-3 text-[15px] font-medium text-white hover:bg-brand-600">
                      View theme
                    </Link>
                    <span className="font-display text-[22px] font-medium text-navy">{t.name}</span>
                  </div>
                </div>
                <div className="rounded-[20px] p-4 sm:p-5" style={{ background: t.frame }}>
                  <div className="overflow-hidden rounded-[20px] bg-navy [container-type:inline-size]">
                    <div className="flex h-[28px] items-center gap-[6px] bg-navy-3 px-3">
                      <span className="size-2 rounded-full bg-[#ff5f57]" />
                      <span className="size-2 rounded-full bg-[#ffbd2e]" />
                      <span className="size-2 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="aspect-[524/340]">
                      <SiteMock palette={t.palette} headline={t.headline} variant={index} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex items-center justify-between px-2">
            <div className="flex gap-2">
              {themes.map((th, i) => (
                <button
                  key={th.slug}
                  type="button"
                  aria-label={`Show ${th.name}`}
                  aria-current={i === index}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  className={cn("h-[8px] rounded-full transition-[width,background-color]", i === index ? "w-8 bg-brand" : "w-2 bg-line-2 hover:bg-muted")}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous theme" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full border border-line text-navy hover:border-brand hover:bg-brand hover:text-white">
                <ArrowLeft className="size-5" />
              </button>
              <button type="button" aria-label="Next theme" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full border border-line text-navy hover:border-brand hover:bg-brand hover:text-white">
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
