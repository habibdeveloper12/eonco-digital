"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "@/content/navigation";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { cn } from "../ui/cn";
import { SiteMock } from "../visuals/Mockups";

/**
 * Two-pane mega menu: tab list on the left (hover or focus switches the
 * panel), featured cards or a link grid on the right, CTA row underneath.
 */
export function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const tabs = item.tabs ?? [];
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <div className="mx-auto max-w-[1440px] rounded-b-[12px] bg-[#f3f3f4] shadow-mega">
      <div className="mx-auto grid max-w-[1260px] grid-cols-[400px_1fr] gap-10 px-8 pb-6 pt-8">
        <div className="border-r border-navy/10 pr-8">
          <p className="mb-5 text-[12px] font-medium text-muted">{item.groupLabel}</p>
          <ul className="space-y-[4px]" role="tablist" aria-orientation="vertical">
            {tabs.map((t, i) => (
              <li key={t.label}>
                <Link
                  href={t.href}
                  role="tab"
                  aria-selected={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={onNavigate}
                  className={cn(
                    "group/tab flex items-center gap-[14px] rounded-[8px] px-3 py-[11px] text-[14px] text-navy transition-colors",
                    active === i ? "bg-brand-50 font-bold" : "hover:bg-white/70",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-[34px] shrink-0 place-items-center rounded-[8px] text-white transition-colors",
                      active === i ? "bg-brand" : "bg-[#bfcad2] group-hover/tab:bg-[#a9b6bf]",
                    )}
                  >
                    <Icon name={t.icon} className="size-[18px]" />
                  </span>
                  <span className="flex-1">{t.label}</span>
                  <ArrowRight className={cn("size-4 text-brand transition-[transform,opacity]", active === i ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex h-full flex-col"
            >
              <p className="mb-5 border-b border-navy/10 pb-3 text-[12px] font-medium text-muted">{tab.panel.heading}</p>

              {tab.panel.cards && (
                <div className="grid grid-cols-3 gap-3">
                  {tab.panel.cards.map((c, i) => (
                    <Link
                      key={c.href + i}
                      href={c.href}
                      onClick={onNavigate}
                      className="group/card overflow-hidden rounded-[10px] bg-mist transition-shadow hover:shadow-[0_14px_30px_rgba(0,23,41,0.12)]"
                    >
                      <div className="aspect-[16/9] overflow-hidden [container-type:inline-size]">
                        <div className="h-full transition-transform duration-700 group-hover/card:scale-[1.06]">
                          <SiteMock palette={c.palette} headline={c.headline} variant={i} />
                        </div>
                      </div>
                      <p className="line-clamp-3 p-[15px] text-[14px] leading-[1.4] text-navy">{c.title}</p>
                    </Link>
                  ))}
                </div>
              )}

              {tab.panel.links && (
                <ul className="grid grid-cols-3 gap-x-6 gap-y-1">
                  {tab.panel.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        onClick={onNavigate}
                        className="group/l flex items-center gap-2 rounded-[8px] px-2 py-[10px] text-[14px] font-medium text-navy transition-colors hover:bg-white hover:text-brand"
                      >
                        <span className="size-[6px] rounded-full bg-brand/40 transition-colors group-hover/l:bg-brand" />
                        {l.label}
                        <ArrowUpRight className="size-[14px] opacity-0 transition-opacity group-hover/l:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex items-center justify-between gap-6 pt-6">
                <p className="max-w-[560px] text-[14px] font-medium text-navy">{tab.panel.ctaText}</p>
                <span onClick={onNavigate}>
                  <Button href={tab.panel.ctaHref}>{tab.panel.ctaLabel}</Button>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1260px] items-center justify-between border-t border-navy/10 px-8 py-4 text-[13px]">
        <p className="font-medium text-navy-2">
          Ready to get started?{" "}
          <Link href="/start-a-project" onClick={onNavigate} className="font-bold underline underline-offset-2 hover:text-brand">
            Start A Project
          </Link>
        </p>
        <Link href="/schedule-meeting" onClick={onNavigate} className="inline-flex items-center gap-1 font-semibold text-[#40515e] hover:text-brand">
          Schedule Meeting <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
