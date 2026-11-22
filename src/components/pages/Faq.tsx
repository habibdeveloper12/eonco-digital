"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "../ui/cn";

/**
 * Accordion FAQ. Every answer stays in the HTML (closed ones are collapsed with
 * CSS, not removed), so search engines and AI answer engines can read them all.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <div className="divide-y divide-line rounded-[20px] border border-line bg-white">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left font-display text-[20px] font-medium text-navy transition-colors hover:text-brand-600 sm:px-8 sm:text-[22px]"
              >
                {it.q}
                <span className={cn("grid size-[34px] shrink-0 place-items-center rounded-full transition-[transform,translate,scale,rotate,background-color,color] duration-300", isOpen ? "rotate-45 bg-brand text-white" : "bg-cloud text-navy")}>
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-[17px] leading-[1.65] text-body sm:px-8">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
