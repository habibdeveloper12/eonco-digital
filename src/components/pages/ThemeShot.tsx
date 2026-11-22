import Image from "next/image";
import type { Product } from "@/content/misc";
import { SiteMock } from "../visuals/Mockups";

/** Theme preview: the screenshot uploaded in WordPress, or a drawn mockup in the theme's colours. */
export function ThemeShot({ t, variant = 0, priority }: { t: Product; variant?: number; priority?: boolean }) {
  if (t.image) {
    return (
      // Fills a fixed-size frame; in a frame without a height it falls back to 16:10.
      <div className="relative aspect-[16/10] h-full w-full overflow-hidden">
        <Image src={t.image} alt={t.imageAlt || `${t.name} HubSpot theme preview`} fill priority={priority} sizes="(min-width: 1024px) 480px, 100vw" className="object-cover object-top" />
      </div>
    );
  }
  return <SiteMock palette={t.palette} headline={t.headline} variant={variant} />;
}
