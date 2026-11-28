"use client";

import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Workflow } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../ui/cn";

/**
 * Hero "moment": a HubSpot-style deal board where one deal moves through the
 * pipeline and the automation behind each step is named underneath. It shows
 * what Take Solution Today builds: a pipeline that runs itself.
 */

type Deal = { id: string; company: string; value: number; owner: string; source: string };

const stages = ["New lead", "Qualified", "Proposal", "Won"] as const;

const base: Deal[][] = [
  [
    { id: "a", company: "Harbor Health", value: 8400, owner: "JM", source: "Website form" },
    { id: "b", company: "Canteen Co", value: 6800, owner: "SR", source: "Outbound" },
  ],
  [{ id: "c", company: "Northpeak Logistics", value: 18400, owner: "AL", source: "Referral" }],
  [{ id: "d", company: "Atelier Interiors", value: 24000, owner: "JM", source: "Webinar" }],
  [{ id: "e", company: "Trade Academy", value: 12600, owner: "SR", source: "Website form" }],
];

const mover: Deal = { id: "m", company: "Verde Clinic", value: 14500, owner: "AL", source: "Website form" };

/** What the automation does when the deal enters each stage. */
const notes = [
  "Form submitted · contact created and assigned to Alex",
  "Discovery call booked · deal moved to Qualified",
  "Quote sent from HubSpot · follow-up task due in 3 days",
  "Signed · invoice created in Xero, onboarding project started",
];

const money = (n: number) => "$" + n.toLocaleString("en-US");

function Card({ d, live, won }: { d: Deal; live?: boolean; won?: boolean }) {
  return (
    <motion.div
      layout
      layoutId={d.id}
      transition={{ type: "tween", duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "rounded-[10px] border bg-white p-[10px]",
        live ? "border-brand/40 shadow-[0_6px_16px_rgba(0,23,41,0.08)]" : "border-line",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12px] font-medium leading-[1.3] text-navy">{d.company}</p>
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mist text-[9px] font-medium text-body">{d.owner}</span>
      </div>
      <p className="mt-1 font-heading text-[13px] tabular-nums text-navy">{money(d.value)}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="truncate text-[10px] text-muted">{d.source}</span>
        {won && (
          <span className="grid size-4 place-items-center rounded-full bg-[#1f9d6b] text-white">
            <Check className="size-[10px]" strokeWidth={3} />
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function PipelineBoard({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [stage, setStage] = useState(reduce ? 3 : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    // Hold longer on "Won" before the next deal comes in.
    const t = setTimeout(() => setStage((s) => (s + 1) % stages.length), stage === 3 ? 4200 : 2600);
    return () => clearTimeout(t);
  }, [stage, inView, reduce]);

  const columns = base.map((col, i) => (i === stage ? [mover, ...col] : col));
  const totals = columns.map((col) => col.reduce((s, d) => s + d.value, 0));

  return (
    <div ref={ref} className={cn("rounded-[20px] border border-line bg-white p-2 shadow-[0_24px_60px_rgba(0,23,41,0.10)]", className)}>
      {/* Window bar */}
      <div className="flex items-center justify-between px-3 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-[3px]" aria-hidden>
            <span className="h-[3px] w-4 rounded-full bg-brand" />
            <span className="h-[3px] w-3 rounded-full bg-brand/60" />
            <span className="h-[3px] w-4 rounded-full bg-brand/30" />
          </span>
          <p className="text-[13px] font-medium text-navy">Sales pipeline</p>
        </div>
        <p className="font-heading text-[11px] tabular-nums text-muted">Q4 2026</p>
      </div>

      <LayoutGroup>
        <div className="grid grid-cols-3 gap-2 rounded-[14px] bg-cloud p-2 sm:grid-cols-4">
          {stages.map((name, i) => (
            <div key={name} className={cn("min-w-0", i === 0 && "hidden sm:block")}>
              <div className="px-1 pb-2 pt-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-[11px] font-medium text-navy">{name}</p>
                  <span className="text-[10px] tabular-nums text-muted">{columns[i].length}</span>
                </div>
                <motion.p key={totals[i]} initial={reduce ? false : { opacity: 0.4 }} animate={{ opacity: 1 }} className="font-heading text-[11px] tabular-nums text-body">
                  {money(totals[i])}
                </motion.p>
                {/* Stage bar: the logo's "E" bars reused as pipeline progress */}
                <div className="mt-2 h-[3px] rounded-full bg-line">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(i + 1) * 25}%`, opacity: 0.35 + i * 0.2 }} />
                </div>
              </div>
              <div className="flex min-h-[188px] flex-col gap-2">
                {columns[i].map((d) => (
                  <Card key={d.id} d={d} live={d.id === "m"} won={i === 3} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>

      {/* Automation log: names what the system did at this step */}
      <div className="flex items-center gap-3 px-3 pb-2 pt-3" aria-live="polite">
        <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-brand-50 text-brand-600">
          <Workflow className="size-4" strokeWidth={1.5} />
        </span>
        <div className="relative h-[18px] min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={stage}
              initial={reduce ? false : { y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0 truncate text-[12px] leading-[18px] text-body"
            >
              {notes[stage]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
