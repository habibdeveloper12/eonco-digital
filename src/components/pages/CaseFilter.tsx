"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { industries as localIndustries } from "@/content/misc";
import type { Project } from "@/lib/wordpress";
import { cn } from "../ui/cn";
import { CaseTile } from "./CaseTile";

export function CaseFilter({
  cases: caseStudies,
  initial = "all",
  industries = localIndustries,
}: {
  cases: Project[];
  initial?: string;
  /** Industry names for the filter tabs (from WordPress when connected). */
  industries?: { slug: string; name: string }[];
}) {
  const [f, setF] = useState(initial);
  if (!caseStudies.length) return <p className="py-20 text-center text-[17px] text-body">New projects are on their way. Check back soon.</p>;
  const list = f === "all" ? caseStudies : caseStudies.filter((c) => c.industry === f);
  const tabs = [{ slug: "all", name: "All" }, ...industries.filter((i) => caseStudies.some((c) => c.industry === i.slug))];
  return (
    <>
      <div role="tablist" aria-label="Filter by industry" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {tabs.map((t) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={f === t.slug}
            type="button"
            onClick={() => setF(t.slug)}
            className={cn("shrink-0 rounded-full border px-5 py-2 text-[14px] font-medium transition-colors", f === t.slug ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-brand hover:text-brand")}
          >
            {t.name}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c, i) => (
            <motion.div key={c.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }}>
              <CaseTile c={c} i={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
