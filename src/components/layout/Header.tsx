"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation } from "@/content/navigation";
import { Logo } from "../visuals/Logo";
import { cn } from "../ui/cn";
import { usePresence } from "../ui/usePresence";
import { MegaPanel } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchDialog } from "./SearchDialog";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openNow = useCallback((i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(i);
  }, []);
  const closeSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }, []);

  // Scrolling the page means the visitor wants the page, not the menu.
  useEffect(() => {
    if (open === null) return;
    const y0 = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - y0) > 24 && setOpen(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const solid = scrolled || open !== null;
  // Keep the last opened panel rendered while it animates out.
  const [shownItem, setShownItem] = useState<number | null>(null);
  useEffect(() => {
    if (open !== null) setShownItem(open);
  }, [open]);
  const mega = usePresence(open !== null && Boolean(navigation[open]?.tabs), 180);
  const dim = usePresence(open !== null, 200);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
          solid ? "bg-white/90 shadow-[0_1px_0_rgba(0,23,41,0.06)] backdrop-blur-xl" : "bg-transparent",
        )}
        onMouseLeave={closeSoon}
      >
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 lg:h-[84px] lg:px-8">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {navigation.map((item, i) => (
                <li key={item.label} onMouseEnter={() => (item.tabs ? openNow(i) : setOpen(null))}>
                  {item.tabs ? (
                    <button
                      type="button"
                      aria-expanded={open === i}
                      aria-controls={`mega-${i}`}
                      onClick={() => setOpen(open === i ? null : i)}
                      onFocus={() => openNow(i)}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-3 py-2 text-[14px] text-navy transition-colors hover:text-brand",
                        open === i && "text-brand",
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn("size-[14px] transition-transform duration-300", open === i && "rotate-180")} />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      className={cn("rounded-full px-3 py-2 text-[14px] text-navy transition-colors hover:text-brand", pathname === item.href && "text-brand")}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearch(true)}
              aria-label="Search the site"
              className="grid size-[44px] place-items-center rounded-full border border-navy/80 text-navy transition-colors hover:border-brand hover:bg-brand hover:text-white"
            >
              <Search className="size-[18px]" />
            </button>
            <Link
              href="/contact"
              className="hidden h-[48px] items-center rounded-full bg-brand px-[32px] text-[16px] font-medium text-white transition-colors hover:bg-brand-600 active:scale-[0.98] lg:inline-flex"
            >
              Contact Us
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
              className="grid size-[44px] place-items-center rounded-[10px] bg-brand lg:hidden"
            >
              <span className="flex w-[20px] flex-col items-end gap-[5px]">
                <span className="h-[2.5px] w-full rounded-full bg-white" />
                <span className="h-[2.5px] w-[70%] rounded-full bg-white" />
                <span className="h-[2.5px] w-full rounded-full bg-white" />
              </span>
            </button>
          </div>
        </div>

        {mega.mounted && shownItem !== null && navigation[shownItem]?.tabs && (
          <div
            id={`mega-${shownItem}`}
            onMouseEnter={() => openNow(shownItem)}
            className={cn(
              "absolute inset-x-0 top-full hidden transition-[opacity,translate,clip-path] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] lg:block",
              mega.shown ? "translate-y-0 opacity-100 [clip-path:inset(0_0_0%_0_round_0_0_12px_12px)]" : "-translate-y-3 opacity-0 [clip-path:inset(0_0_100%_0_round_0_0_12px_12px)]",
            )}
          >
            <MegaPanel key={shownItem} item={navigation[shownItem]} onNavigate={() => setOpen(null)} />
          </div>
        )}
      </header>

      {/* Dim page behind open mega menu */}
      {dim.mounted && (
        <div
          className={cn("fixed inset-0 z-40 hidden bg-navy/20 backdrop-blur-[2px] transition-opacity duration-200 lg:block", dim.shown ? "opacity-100" : "opacity-0")}
          onMouseEnter={closeSoon}
          onClick={() => setOpen(null)}
        />
      )}

      <MobileNav open={mobile} onClose={() => setMobile(false)} onSearch={() => setSearch(true)} />
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  );
}
