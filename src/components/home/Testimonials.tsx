"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { Eyebrow } from "../ui/Eyebrow";
import { Marquee } from "../ui/Marquee";
import { Reveal } from "../ui/Reveal";

type T = { quote: string; name: string; role: string };

const initials = (t: T) =>
  (t.name && !t.name.startsWith("[") ? t.name : t.role)
    .split(/[ ,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function ReviewCard({ t }: { t: T }) {
  return (
    <article className="mb-4 rounded-[16px] border border-line bg-white p-6">
      <p className="text-[16px] leading-[1.55] text-navy">&ldquo;{t.quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-[13px] font-medium text-navy">{initials(t)}</span>
        <div className="text-[14px] leading-[1.4]">
          <strong className="block font-medium text-navy">{t.name}</strong>
          <span className="text-muted">{t.role}</span>
        </div>
      </div>
    </article>
  );
}

export function Testimonials({ featured, list }: { featured: T | null; list: T[] }) {
  const [video, setVideo] = useState(false);
  const videoUrl = ""; // Add a testimonial video URL (mp4) to enable the play button.
  const rest = list.filter((t) => t !== featured && t.quote !== featured?.quote);
  if (!featured && !rest.length) return null;

  return (
    <section className="bg-white py-[88px] lg:py-[104px]">
      <div className="container-x gutter grid items-center gap-6 lg:grid-cols-[320px_440px_1fr] lg:gap-8">
        <Reveal>
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="text-section-sm mt-5 text-navy">
            Trusted by Teams <span className="text-brand">Across</span> Industries
          </h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-body">Take Solution Today helps businesses across industries build revenue systems in HubSpot that teams adopt and leaders trust.</p>
        </Reveal>

        {featured && (
          <Reveal delay={0.1} className="relative mx-auto flex min-h-[440px] w-full max-w-[440px] flex-col justify-between overflow-hidden rounded-[20px] bg-navy p-8 text-white">
            <div className="flex items-start justify-between">
              {/* Quote mark drawn as two of the logo's stage bars */}
              <span aria-hidden className="flex gap-[6px] pt-1">
                <span className="h-[28px] w-[6px] rounded-full bg-brand" />
                <span className="h-[28px] w-[6px] rounded-full bg-brand/60" />
              </span>
              {videoUrl && (
                <button type="button" onClick={() => setVideo(true)} aria-label="Play testimonial video" className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-navy">
                  <Play className="size-5" />
                </button>
              )}
            </div>
            <div>
              <p className="font-display text-[24px] font-medium leading-[1.35]">&ldquo;{featured.quote}&rdquo;</p>
              <div className="mt-8 border-t border-white/10 pt-5">
                <strong className="block text-[15px] font-medium">{featured.name}</strong>
                <span className="text-[14px] text-white/60">{featured.role}</span>
              </div>
            </div>
          </Reveal>
        )}

        {rest.length > 0 && (
          <Reveal delay={0.2} className="mask-fade-y h-[560px] overflow-hidden">
            <div className="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Marquee vertical duration={45} className="h-full">
                {rest.map((t, i) => (
                  <ReviewCard key={i} t={t} />
                ))}
              </Marquee>
              <Marquee vertical reverse duration={50} className="hidden h-full sm:block lg:hidden">
                {[...rest].reverse().map((t, i) => (
                  <ReviewCard key={i} t={t} />
                ))}
              </Marquee>
            </div>
          </Reveal>
        )}
      </div>

      <AnimatePresence>
        {video && videoUrl && (
          <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVideo(false)}>
            <button type="button" aria-label="Close video" className="absolute right-6 top-6 grid size-11 place-items-center rounded-full bg-white text-navy" onClick={() => setVideo(false)}>
              <X className="size-5" />
            </button>
            <video src={videoUrl} controls autoPlay className="max-h-[80vh] w-full max-w-[900px] rounded-[16px]" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
