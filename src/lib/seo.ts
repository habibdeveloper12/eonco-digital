import type { Metadata } from "next";
import type { Seo } from "./wordpress";

type Input = {
  /** Default title and description, used when the editor left the SEO fields empty. */
  title: string;
  description?: string;
  /** Path on this site, e.g. "/hubspot-migration". Used for the canonical URL. */
  path: string;
  /** Featured image, used for social previews when no SEO image is set. */
  image?: string;
  seo?: Seo;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/** Page metadata (title, description, canonical, social previews, robots) with the WordPress SEO fields applied. */
export function pageMetadata({ title, description, path, image, seo, type = "website", publishedTime, modifiedTime }: Input): Metadata {
  const t = seo?.title || title;
  const d = (seo?.description || description || "").slice(0, 300) || undefined;
  const img = seo?.image || image;
  return {
    title: t,
    description: d,
    alternates: { canonical: path },
    openGraph: {
      type,
      title: t,
      description: d,
      url: path,
      ...(img && { images: [img] }),
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: { card: "summary_large_image", title: t, description: d, ...(img && { images: [img] }) },
    ...(seo?.noindex && { robots: { index: false, follow: true } }),
  };
}
