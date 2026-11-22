"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One GSAP runtime for every scroll animation on the site.
 *
 * Components stay plain server-rendered HTML and opt in with data attributes:
 *   data-reveal            fade + rise when scrolled into view   (data-delay, data-y, ="load" to run on page load)
 *   data-split             masked line reveal for headings; lines are [data-line] children (="load" for heroes)
 *   data-count="1000"      count up to the number in [data-count-value] (data-decimals)
 *   data-zoom              scroll-linked settle: scale 1.1 → 1 while the element enters the viewport
 *
 * Content is fully present in the HTML, so search engines and AI crawlers read
 * everything. Before JS runs, `html.motion` hides only what will animate; if the
 * runtime fails to start within 4s, an inline script removes `motion` again.
 */

const EASE = "power3.out";
let lenis: Lenis | null = null;

const fmt = (n: number, d: number) => n.toLocaleString("en-AU", { minimumFractionDigits: d, maximumFractionDigits: d });

function setup(root: HTMLElement) {
  const fresh = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(`${sel}:not([data-motion-done])`));
  const mark = (els: Element[]) => els.forEach((el) => el.setAttribute("data-motion-done", ""));

  // On-load entrances are pure CSS (globals.css); just mark them handled.
  mark(fresh('[data-reveal="load"]'));
  mark(fresh('[data-split="load"]'));

  // Reveal on scroll, batched so siblings entering together stagger naturally
  const reveals = fresh<HTMLElement>("[data-reveal]");
  mark(reveals);
  reveals.forEach((el) => gsap.set(el, { autoAlpha: 0, y: Number(el.dataset.y ?? 28) }));
  ScrollTrigger.batch(reveals, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: EASE,
        stagger: 0.08,
        delay: (_i: number, t: Element) => Number((t as HTMLElement).dataset.delay ?? 0),
        overwrite: true,
      }),
  });

  // Split headings
  fresh<HTMLElement>("[data-split]").forEach((el) => {
    mark([el]);
    const lines = el.querySelectorAll("[data-line]");
    const tween = { yPercent: 0, y: 0, duration: el.dataset.split === "chars" ? 0.6 : 1, ease: "power4.out", stagger: el.dataset.split === "chars" ? 0.025 : 0.09, delay: Number(el.dataset.delay ?? 0) };
    // y: 0 matters: the pre-JS CSS (translateY(105%)) would otherwise be parsed into a px offset that never resets.
    gsap.set(lines, { yPercent: 105, y: 0 });
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(lines, tween) });
  });

  // Count-up numbers (final value is already in the HTML for SEO)
  fresh<HTMLElement>("[data-count]").forEach((el) => {
    mark([el]);
    const out = el.querySelector<HTMLElement>("[data-count-value]");
    if (!out) return;
    const target = Number(el.dataset.count);
    const d = Number(el.dataset.decimals ?? 0);
    const obj = { v: 0 };
    out.textContent = fmt(0, d);
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => gsap.to(obj, { v: target, duration: 1.8, ease: "power2.out", onUpdate: () => (out.textContent = fmt(obj.v, d)) }),
    });
  });

  // Scroll-linked settle for showcase visuals
  fresh<HTMLElement>("[data-zoom]").forEach((el) => {
    mark([el]);
    gsap.fromTo(el, { scale: 1.1, y: 32 }, { scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true } });
  });
}

export function MotionRuntime() {
  const pathname = usePathname();

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // (Re)scan on every route, and when client components mount new animated nodes.
  useEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.classList.remove("motion");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    // Keep Lenis in step with Next.js navigation (but respect #anchor links).
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
    const ctx = gsap.context(() => setup(document.body));
    html.classList.add("motion-ready");

    // Only react when newly mounted nodes contain something to animate
    // (not to text changes such as the count-up itself).
    const SEL = ["[data-reveal]", "[data-split]", "[data-count]", "[data-zoom]"].map((s) => `${s}:not([data-motion-done])`).join(",");
    let raf = 0;
    const mo = new MutationObserver((muts) => {
      const relevant = muts.some((m) => Array.from(m.addedNodes).some((n) => n instanceof Element && (n.matches(SEL) || n.querySelector(SEL))));
      if (!relevant) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ctx.add(() => setup(document.body));
        ScrollTrigger.refresh();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Layout settles once fonts and images arrive.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
