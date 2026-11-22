"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/wordpress";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";
import { cn } from "../ui/cn";
import { ProjectVisual } from "../pages/ProjectVisual";

function CaseCard({ c, aspect, className, variant }: { c: Project; aspect: string; className?: string; variant: number }) {
  // "View project" disc follows the pointer (GSAP quickTo, fine pointers only).
  const disc = useRef<HTMLSpanElement>(null);
  const to = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);
  useEffect(() => {
    if (!disc.current || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    to.current = { x: gsap.quickTo(disc.current, "x", { duration: 0.35, ease: "power3" }), y: gsap.quickTo(disc.current, "y", { duration: 0.35, ease: "power3" }) };
  }, []);
  const show = (on: boolean) => disc.current && gsap.to(disc.current, { scale: on ? 1 : 0, autoAlpha: on ? 1 : 0, duration: 0.25, ease: "power2.out" });

  return (
    <Reveal className={className}>
      <Link
        href={`/case-studies/${c.slug}`}
        className="group block lg:motion-safe:cursor-none"
        onMouseEnter={() => to.current && show(true)}
        onMouseLeave={() => to.current && show(false)}
        onMouseMove={(e) => {
          if (!to.current) return;
          const r = e.currentTarget.getBoundingClientRect();
          to.current.x(e.clientX - r.left - 36);
          to.current.y(e.clientY - r.top - 92);
        }}
      >
        <div className="relative pt-[56px]">
          {/* Client name rises from behind the card on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[56px] z-0 -translate-x-1/2 translate-y-[20%] whitespace-nowrap font-display text-[44px] font-medium leading-none text-white opacity-0 transition-[transform,translate,scale,rotate,opacity] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-full group-hover:opacity-100 sm:text-[64px]"
          >
            {c.client}
          </span>
          <div className={cn("relative z-10 overflow-hidden rounded-[16px] bg-navy-3", aspect)}>
            <ProjectVisual c={c} variant={variant} chrome className="transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]" />
            <span
              ref={disc}
              aria-hidden
              className="pointer-events-none invisible absolute left-0 top-0 z-20 grid size-[72px] scale-0 place-items-center rounded-full bg-brand text-center text-[13px] font-medium leading-[1.2] text-white opacity-0"
            >
              View
              <br />
              project
            </span>
          </div>
        </div>
        <div className="mt-6 px-1">
          {c.tags.length > 0 && <p className="text-[13px] text-white/55">{c.tags.join(" · ")}</p>}
          <h3 className="mt-2 font-heading text-[20px] font-medium leading-[1.25] text-white transition-colors group-hover:text-brand-100 sm:text-[22px]">{c.title}</h3>
        </div>
      </Link>
    </Reveal>
  );
}

/** Repeating editorial rhythm: pair, wide, pair (mirrored), wide (mirrored). */
function rows(cs: Project[]) {
  const out: React.ReactNode[] = [];
  let i = 0;
  let r = 0;
  while (i < cs.length) {
    const kind = r % 4;
    if ((kind === 0 || kind === 2) && i + 1 < cs.length) {
      const [a, b] = [cs[i], cs[i + 1]];
      out.push(
        kind === 0 ? (
          <div key={r} className="grid gap-12 lg:grid-cols-[568fr_470fr] lg:gap-[112px]">
            <CaseCard c={a} aspect="aspect-[568/426]" variant={0} />
            <CaseCard c={b} aspect="aspect-[470/353]" className="lg:mt-[48px]" variant={1} />
          </div>
        ) : (
          <div key={r} className="grid gap-12 lg:grid-cols-[470fr_568fr] lg:gap-[112px]">
            <CaseCard c={a} aspect="aspect-[470/353]" className="lg:mt-[72px]" variant={1} />
            <CaseCard c={b} aspect="aspect-[568/426]" variant={0} />
          </div>
        ),
      );
      i += 2;
    } else {
      out.push(
        <div key={r} className={kind === 3 ? "lg:pr-[184px]" : "lg:pl-[184px]"}>
          <CaseCard c={cs[i]} aspect="aspect-[957/538]" variant={2} />
        </div>,
      );
      i += 1;
    }
    r++;
  }
  return out;
}

export function FeaturedCases({ cases }: { cases: Project[] }) {
  if (!cases.length) return null;
  return (
    <section className="bg-navy py-[80px]">
      <div className="container-x gutter">
        <div className="text-center">
          <Reveal>
            <Eyebrow tone="dark">Featured case studies</Eyebrow>
          </Reveal>
          <SplitText className="mt-4 font-display text-[34px] font-medium leading-[1.1] text-white sm:text-[44px]" lines={[{ text: "HubSpot Implementations" }, { text: "That Generated Real Results", accent: true }]} />
        </div>

        <div className="mt-6 space-y-12 lg:space-y-6">{rows(cases)}</div>

        <div className="mt-14 text-center">
          <Link href="/case-studies" className="inline-flex h-[55px] items-center rounded-full border border-white/30 px-10 text-[18px] font-medium text-white transition-colors hover:border-brand hover:bg-brand">
            View all case studies
          </Link>
        </div>
      </div>
    </section>
  );
}
