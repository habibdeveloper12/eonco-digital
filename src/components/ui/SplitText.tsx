"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "./cn";

type Line = { text: string; accent?: boolean };

const ease = [0.2, 0.8, 0.2, 1] as const;

/*
 * The in-view trigger sits on the (unclipped) parent; children animate via
 * variants. Observing the clipped children directly never fires because an
 * element translated fully outside an overflow:hidden box is not
 * "intersecting".
 */

/** Line-by-line masked heading reveal. */
export function SplitText({
  lines,
  className,
  as = "h2",
  delay = 0,
  lineClassName,
}: {
  lines: Line[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  lineClassName?: string;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const child: Variants = {
    hidden: { y: "105%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 0.9, delay: delay + i * 0.09, ease } }),
  };
  return (
    <Tag className={className} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "0px 0px -8% 0px" }}>
      {lines.map((l, i) => (
        <span key={i} className={cn("block overflow-hidden pb-[0.08em]", lineClassName)}>
          <motion.span custom={i} variants={child} className={cn("block", l.accent && "text-brand")}>
            {l.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Per-letter reveal used for showcase titles. */
export function LetterReveal({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const child: Variants = {
    hidden: { y: "110%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 0.6, delay: i * 0.025, ease } }),
  };
  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      aria-label={text}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true }}
    >
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden">
          <motion.span className="inline-block" custom={i} variants={child}>
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
