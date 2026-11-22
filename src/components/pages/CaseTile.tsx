import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/wordpress";
import { cn } from "../ui/cn";
import { ProjectVisual } from "./ProjectVisual";

export function CaseTile({ c, i = 0, dark }: { c: Project; i?: number; dark?: boolean }) {
  return (
    <Link href={`/case-studies/${c.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-navy-3">
        <ProjectVisual c={c} variant={i} className="transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]" />
        <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white text-navy opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      {c.tags.length > 0 && <p className={cn("mt-5 text-[13px]", dark ? "text-white/55" : "text-muted")}>{c.tags.join(" · ")}</p>}
      <h3 className={cn("mt-2 font-heading text-[20px] font-medium leading-[1.25] transition-colors group-hover:text-brand", dark ? "text-white" : "text-navy")}>{c.title}</h3>
    </Link>
  );
}
