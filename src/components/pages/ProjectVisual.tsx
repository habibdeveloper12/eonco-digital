import type { Project } from "@/lib/wordpress";
import { cn } from "../ui/cn";
import { BrowserFrame, SiteMock } from "../visuals/Mockups";

/**
 * A project's visual: the featured image uploaded in WordPress when there is
 * one, otherwise a website mockup drawn in the project's own colours.
 * Fills its (relatively positioned) parent.
 */
export function ProjectVisual({ c, variant = 0, chrome, className }: { c: Pick<Project, "palette" | "headline" | "image" | "title">; variant?: number; chrome?: boolean; className?: string }) {
  if (c.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.image} alt={c.title} loading="lazy" className={cn("absolute inset-0 size-full object-cover", className)} />;
  }
  return (
    <div
      className={cn("absolute inset-0 grid place-items-center p-[7%]", className)}
      style={{ background: `radial-gradient(80% 80% at 70% 0%, ${c.palette[1]}40, transparent 60%), #0a2035` }}
    >
      <BrowserFrame className="w-full max-w-[720px]">
        <SiteMock palette={c.palette} headline={c.headline} variant={variant} chrome={chrome} />
      </BrowserFrame>
    </div>
  );
}
