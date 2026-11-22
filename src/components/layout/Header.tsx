"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation } from "@/content/navigation";
import { Logo } from "../visuals/Logo";
import { cn } from "../ui/cn";
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

  const solid = scrolled || open !== null;

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

        <AnimatePresence>
          {open !== null && navigation[open]?.tabs && (
            <motion.div
              key={open}
              id={`mega-${open}`}
              initial={{ opacity: 0, y: -12, clipPath: "inset(0 0 100% 0 round 0 0 12px 12px)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 0 0 12px 12px)" }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
              onMouseEnter={() => openNow(open)}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <MegaPanel item={navigation[open]} onNavigate={() => setOpen(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Dim page behind open mega menu */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 hidden bg-navy/20 backdrop-blur-[2px] lg:block"
            onMouseEnter={closeSoon}
            onClick={() => setOpen(null)}
          />
        )}
      </AnimatePresence>

      <MobileNav open={mobile} onClose={() => setMobile(false)} onSearch={() => setSearch(true)} />
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  );
}
