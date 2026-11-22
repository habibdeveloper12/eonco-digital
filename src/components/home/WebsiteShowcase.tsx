"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { websiteShowcase } from "@/content/caseStudies";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { LetterReveal } from "../ui/SplitText";
import { Laptop, SiteMock } from "../visuals/Mockups";

const backdrops = [
  "linear-gradient(160deg,#cfd3df,#a9afc2)",
  "linear-gradient(160deg,#d9d4cc,#b8afa2)",
  "linear-gradient(160deg,#1c2433,#3b4a66)",
  "linear-gradient(160deg,#e6e8ee,#c4c9d6)",
  "linear-gradient(160deg,#d6e6e3,#9fc0ba)",
  "linear-gradient(160deg,#e9dfd0,#c9b79c)",
];

function ShowcaseItem({ item, i }: { item: (typeof websiteShowcase)[number]; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <Link ref={ref} href={item.href} className={`group block ${i % 2 === 1 ? "md:mt-[60px]" : ""}`}>
      <div className="relative aspect-[551/338] overflow-hidden rounded-[18px]" style={{ background: backdrops[i % backdrops.length] }}>
        <motion.div className="absolute inset-0 flex items-center justify-center px-[13%]" style={reduce ? undefined : { scale, y }}>
          <Laptop className="transition-transform duration-700 group-hover:-translate-y-[3%]">
            <SiteMock palette={item.palette} headline={item.headline} variant={i} />
          </Laptop>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <p className="mt-4 text-[12px] font-medium text-muted">Website · HubSpot CMS</p>
      <div className="mt-2 flex items-center gap-3 font-heading text-[28px] font-medium text-navy-2 sm:text-[36px]">
        <ArrowUpRight className="size-7 shrink-0 text-brand transition-transform duration-300 group-hover:rotate-45" />
        <LetterReveal text={item.name} />
      </div>
    </Link>
  );
}

export function WebsiteShowcase() {
  return (
    <section className="bg-cream-3 py-[64px] lg:py-[96px]">
      <div className="container-x gutter">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <div>
            <Reveal>
              <Eyebrow>Website case studies</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-section mt-4 max-w-[640px] text-black">
                <span className="text-brand">Websites</span> That Bring More Leads to Your CRM
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-lead text-[#3a3c42]">
              Complete HubSpot website development designed to support growth, improve user experience and connect every visit to your CRM.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {websiteShowcase.map((item, i) => (
            <ShowcaseItem key={item.name} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
