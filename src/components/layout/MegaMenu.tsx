"use client";

import Link from "next/link";
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
 *
 * Height is kept compact and capped to the viewport, so a band of the page
 * always stays visible below: moving the pointer onto it closes the menu.
 */
export function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const tabs = item.tabs ?? [];
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <div className="mx-auto max-w-[1440px] rounded-b-[12px] bg-[#f3f3f4] shadow-mega">
      <div className="mx-auto grid max-h-[calc(100svh-200px)] max-w-[1260px] grid-cols-[390px_1fr] gap-8 overflow-y-auto px-8 pb-5 pt-6">
        <div className="border-r border-navy/10 pr-6">
          <p className="mb-3 text-[12px] font-medium text-muted">{item.groupLabel}</p>
          <ul className="space-y-[2px]" role="tablist" aria-orientation="vertical">
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
                    "group/tab flex items-center gap-3 rounded-[8px] px-2.5 py-[6px] text-[14px] text-navy transition-colors",
                    active === i ? "bg-brand-50 font-medium" : "hover:bg-white/70",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-[28px] shrink-0 place-items-center rounded-[7px] text-white transition-colors",
                      active === i ? "bg-brand" : "bg-[#bfcad2] group-hover/tab:bg-[#a9b6bf]",
                    )}
                  >
                    <Icon name={t.icon} className="size-4" />
                  </span>
                  <span className="flex-1">{t.label}</span>
                  <ArrowRight className={cn("size-4 text-brand transition-[opacity,translate]", active === i ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {/* Re-keyed on tab change so the CSS entrance replays */}
          <div key={active} className="eonco-panel-in flex h-full flex-col">
            <p className="mb-4 border-b border-navy/10 pb-2.5 text-[12px] font-medium text-muted">{tab.panel.heading}</p>

            {tab.panel.cards && (
              <div className="grid grid-cols-3 gap-3">
                {tab.panel.cards.map((c, i) => (
                  <Link
                    key={c.href + i}
                    href={c.href}
                    onClick={onNavigate}
                    className="group/card overflow-hidden rounded-[10px] bg-mist transition-shadow hover:shadow-[0_14px_30px_rgba(0,23,41,0.12)]"
                  >
                    <div className="aspect-[16/8] overflow-hidden [container-type:inline-size]">
                      <div className="h-full transition-transform duration-700 group-hover/card:scale-[1.06]">
                        <SiteMock palette={c.palette} headline={c.headline} variant={i} />
                      </div>
                    </div>
                    <p className="line-clamp-2 px-3 py-2.5 text-[13px] leading-[1.4] text-navy">{c.title}</p>
                  </Link>
                ))}
              </div>
            )}

            {tab.panel.links && (
              <ul className="grid grid-cols-3 gap-x-6">
                {tab.panel.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={onNavigate}
                      className="group/l flex items-center gap-2 rounded-[8px] px-2 py-[7px] text-[14px] font-medium text-navy transition-colors hover:bg-white hover:text-brand"
                    >
                      <span className="size-[6px] rounded-full bg-brand/40 transition-colors group-hover/l:bg-brand" />
                      {l.label}
                      <ArrowUpRight className="size-[14px] opacity-0 transition-opacity group-hover/l:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex items-center justify-between gap-6 pt-5">
              <p className="max-w-[520px] text-[14px] font-medium text-navy">{tab.panel.ctaText}</p>
              <span onClick={onNavigate}>
                <Button href={tab.panel.ctaHref} size="sm">
                  {tab.panel.ctaLabel}
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1260px] items-center justify-between border-t border-navy/10 px-8 py-3 text-[13px]">
        <p className="font-medium text-navy-2">
          Ready to get started?{" "}
          <Link href="/start-a-project" onClick={onNavigate} className="font-medium underline underline-offset-2 hover:text-brand">
            Start A Project
          </Link>
        </p>
        <Link href="/schedule-meeting" onClick={onNavigate} className="inline-flex items-center gap-1 font-medium text-[#40515e] hover:text-brand">
          Schedule Meeting <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
