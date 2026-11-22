"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "@/content/navigation";
import { Icon } from "../ui/Icon";
import { cn } from "../ui/cn";
import { Logo } from "../visuals/Logo";

export function MobileNav({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
            <Logo />
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Search"
                onClick={() => {
                  onClose();
                  onSearch();
                }}
                className="grid size-[44px] place-items-center rounded-full border border-navy"
              >
                <Search className="size-[18px]" />
              </button>
              <button type="button" aria-label="Close menu" onClick={onClose} className="grid size-[44px] place-items-center rounded-[10px] bg-navy text-white">
                <X className="size-5" />
              </button>
            </div>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="divide-y divide-line">
              {navigation.map((item, i) => (
                <li key={item.label}>
                  {item.tabs ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={expanded === i}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        className="flex w-full items-center justify-between py-[18px] text-left font-heading text-[18px] font-medium text-navy"
                      >
                        {item.label}
                        <ChevronDown className={cn("size-5 transition-transform", expanded === i && "rotate-180 text-brand")} />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded === i && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {item.tabs.map((t) => (
                              <li key={t.label}>
                                <Link href={t.href} onClick={onClose} className="flex items-center gap-3 rounded-[8px] px-2 py-[10px] text-[15px] text-navy active:bg-brand-50">
                                  <span className="grid size-[32px] place-items-center rounded-[8px] bg-brand-50 text-brand">
                                    <Icon name={t.icon} className="size-4" />
                                  </span>
                                  {t.label}
                                </Link>
                              </li>
                            ))}
                            <li className="pb-4" />
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link href={item.href!} onClick={onClose} className="block py-[18px] font-heading text-[18px] font-medium text-navy">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 space-y-3 border-t border-line p-5">
            <Link href="/schedule-meeting" onClick={onClose} className="flex h-[56px] items-center justify-between rounded-full bg-navy pl-6 pr-2 text-[17px] font-medium text-white">
              Book a call
              <span className="grid size-[42px] place-items-center rounded-full bg-brand">
                <ArrowRight className="size-5" />
              </span>
            </Link>
            <Link href="/contact" onClick={onClose} className="flex h-[52px] items-center justify-center rounded-full border border-navy/20 text-[16px] font-medium text-navy">
              Contact Us
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
