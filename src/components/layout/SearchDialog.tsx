"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex } from "@/lib/searchIndex";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50);
    else setQ("");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return searchIndex.slice(0, 6);
    return searchIndex.filter((e) => `${e.title} ${e.text} ${e.type}`.toLowerCase().includes(term)).slice(0, 10);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-navy/40 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ y: -20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            className="w-full max-w-[640px] overflow-hidden rounded-[20px] bg-white shadow-mega"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search className="size-5 text-muted" />
              <label htmlFor="site-search" className="sr-only">
                Search
              </label>
              <input
                id="site-search"
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search services, case studies, articles..."
                className="h-[64px] flex-1 bg-transparent text-[17px] text-navy outline-none placeholder:text-muted"
              />
              <button type="button" onClick={onClose} aria-label="Close search" className="grid size-9 place-items-center rounded-full hover:bg-cloud">
                <X className="size-5" />
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-4 py-8 text-center text-body">No results for &ldquo;{q}&rdquo;</li>}
              {results.map((r) => (
                <li key={r.href + r.title}>
                  <Link href={r.href} onClick={onClose} className="group flex items-start gap-4 rounded-[12px] px-4 py-3 hover:bg-cloud">
                    <span className="mt-[2px] rounded-full bg-brand-50 px-2 py-[2px] text-[11px] font-medium text-brand">{r.type}</span>
                    <span className="flex-1">
                      <span className="block text-[15px] font-semibold text-navy group-hover:text-brand">{r.title}</span>
                      <span className="line-clamp-1 text-[13px] text-body">{r.text}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-muted group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
