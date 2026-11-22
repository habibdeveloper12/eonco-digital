import Image from "next/image";
import type { Project } from "@/lib/wordpress";
import { cn } from "../ui/cn";
import { BrowserFrame, SiteMock } from "../visuals/Mockups";

/**
 * A project's visual: the featured image uploaded in WordPress when there is
 * one (optimised, responsive, lazy-loaded), otherwise a website mockup drawn in
 * the project's own colours. Fills its (relatively positioned) parent.
 */
export function ProjectVisual({
  c,
  variant = 0,
  chrome,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
}: {
  c: Pick<Project, "palette" | "headline" | "image" | "title">;
  variant?: number;
  chrome?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (c.image) {
    return <Image src={c.image} alt={c.title} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
  }
  return (
    <div className={cn("absolute inset-0 grid place-items-center p-[7%]", className)} style={{ background: `radial-gradient(80% 80% at 70% 0%, ${c.palette[1]}40, transparent 60%), #0a2035` }}>
      <BrowserFrame className="w-full max-w-[720px]">
        <SiteMock palette={c.palette} headline={c.headline} variant={variant} chrome={chrome} />
      </BrowserFrame>
    </div>
  );
}
