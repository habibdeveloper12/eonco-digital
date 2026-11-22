import Link from "next/link";
import { ArrowUpRight, Building, Cpu, Dumbbell, FlaskConical, HeartPulse, Hexagon, Leaf, Package, ShoppingBag, Truck, Waves } from "lucide-react";
import { clientResults } from "@/content/misc";
import { Marquee } from "../ui/Marquee";
import { cn } from "../ui/cn";

const marks = [ShoppingBag, HeartPulse, Cpu, Building, Waves, Truck, FlaskConical, Hexagon, Package, Leaf, Dumbbell];

type R = (typeof clientResults)[number];

function Tile({ r, i, className }: { r: R; i: number; className?: string }) {
  const M = marks[i % marks.length];
  const hasStat = "value" in r && r.value;
  return (
    <Link
      href="/case-studies"
      className={cn(
        "group relative flex shrink-0 flex-col justify-center rounded-[16px] border border-line bg-white p-4 transition-colors hover:border-navy/20",
        className,
      )}
    >
      <ArrowUpRight className="absolute right-3 top-3 size-[14px] text-muted transition-colors group-hover:text-brand" />
      <div className={cn("flex items-center gap-2 text-navy", r.size === "lg" || r.size === "wide" ? "" : "justify-center")}>
        <M className="size-5 text-subtle" strokeWidth={1.5} />
        <span className="font-heading text-[16px] font-medium">{r.name}</span>
      </div>
      {hasStat && (
        <div className={cn(r.size === "lg" ? "mt-3" : "mt-1 text-center")}>
          <p className={cn("font-display font-medium tabular-nums text-brand-600", r.size === "lg" ? "text-[28px]" : "text-[18px]")}>{r.value}</p>
          {"label" in r && <p className={cn("text-body", r.size === "lg" ? "text-[13px]" : "text-[11px]")}>{r.label}</p>}
        </div>
      )}
      {"text" in r && r.text && <p className="mt-2 text-[13px] leading-[1.45] text-body">{r.text}</p>}
    </Link>
  );
}

/** Masonry columns: each column is 332px tall (3 rows of 100px with 16px gaps). */
function Columns() {
  const r = clientResults;
  return (
    <div className="flex gap-4 pr-4">
      <div className="flex w-[376px] flex-col gap-4">
        <Tile r={r[0]} i={0} className="h-[216px]" />
        <div className="flex gap-4">
          <Tile r={r[1]} i={1} className="h-[100px] w-[180px]" />
          <Tile r={r[2]} i={2} className="h-[100px] w-[180px]" />
        </div>
      </div>
      <div className="flex w-[376px] flex-col gap-4">
        <div className="flex gap-4">
          <Tile r={r[3]} i={3} className="h-[100px] w-[180px]" />
          <Tile r={r[5]} i={5} className="h-[100px] w-[180px]" />
        </div>
        <Tile r={r[4]} i={4} className="h-[216px]" />
      </div>
      <div className="flex w-[572px] flex-col gap-4">
        <Tile r={r[6]} i={6} className="h-[100px]" />
        <div className="flex gap-4">
          <Tile r={r[7]} i={7} className="h-[100px] w-[376px]" />
          <Tile r={r[9]} i={9} className="h-[100px] w-[180px]" />
        </div>
        <div className="flex gap-4">
          <Tile r={r[8]} i={8} className="h-[100px] w-[180px]" />
          <Tile r={r[10]} i={10} className="h-[100px] w-[180px]" />
          <Tile r={r[2]} i={4} className="h-[100px] w-[180px]" />
        </div>
      </div>
    </div>
  );
}

export function LogoWall() {
  return (
    <section className="bg-cream-3 py-[48px] lg:py-[80px]">
      <h2 className="gutter text-center font-heading text-[18px] font-medium text-navy sm:text-[20px]">Trusted by growing teams across industries.</h2>
      <Marquee duration={55} className="mask-fade-x mt-10">
        <Columns />
      </Marquee>
    </section>
  );
}
