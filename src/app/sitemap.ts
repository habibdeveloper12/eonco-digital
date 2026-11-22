import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getIndustries, getPage, getServices, getStandalonePages, getThemes } from "@/lib/cms";
import { getPosts, getProjects } from "@/lib/wordpress";

export const revalidate = 3600;

type Entry = { path: string; modified?: string; noindex?: boolean; priority?: number };

/**
 * Every public page, generated from WordPress so new posts, projects,
 * services, industries, themes and pages are listed automatically.
 * Items set to "Hide from search engines" in WordPress are left out.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, services, industries, themes, pages, privacy, terms] = await Promise.all([
    getProjects(), getPosts(), getServices(), getIndustries(), getThemes(), getStandalonePages(), getPage("privacy-policy"), getPage("terms-and-conditions"),
  ]);

  // Only content from WordPress carries a real "last changed" date. Stamping
  // every page with the current time teaches Google to ignore lastmod, so
  // pages without one leave it out.
  const date = (d?: string) => (d && !Number.isNaN(Date.parse(d)) ? new Date(d) : undefined);
  const latest = (ds: (string | undefined)[]) => ds.map(date).filter((d): d is Date => Boolean(d)).sort((a, b) => b.getTime() - a.getTime())[0]?.toISOString();

  const entries: Entry[] = [
    { path: "", priority: 1 },
    { path: "/about" }, { path: "/contact" }, { path: "/start-a-project" }, { path: "/schedule-meeting" },
    { path: "/case-studies", modified: latest(projects.map((c) => c.modified)) },
    { path: "/industries", modified: latest(industries.map((i) => i.modified)) },
    { path: "/blog", modified: latest(posts.map((p) => p.modified ?? p.date)) },
    { path: "/hubspot-themes", modified: latest(themes.map((t) => t.modified)) },
    { path: "/hubspot-modules" }, { path: "/hubspot-apps" },
    { path: "/privacy-policy", modified: privacy?.modified, noindex: privacy?.seo.noindex, priority: 0.3 },
    { path: "/terms-and-conditions", modified: terms?.modified, noindex: terms?.seo.noindex, priority: 0.3 },
    ...services.map((s) => ({ path: `/${s.slug}`, modified: s.modified, noindex: s.seo?.noindex, priority: 0.9 })),
    ...projects.map((c) => ({ path: `/case-studies/${c.slug}`, modified: c.modified, noindex: c.seo?.noindex })),
    ...industries.map((i) => ({ path: `/industries/${i.slug}`, modified: i.modified, noindex: i.seo?.noindex, priority: 0.8 })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, modified: p.modified ?? p.date, noindex: p.seo?.noindex })),
    ...themes.map((t) => ({ path: `/hubspot-themes/${t.slug}`, modified: t.modified, noindex: t.seo?.noindex })),
    ...pages.map((p) => ({ path: `/${p.slug}`, modified: p.modified, noindex: p.seo.noindex })),
  ];

  return entries
    .filter((e) => !e.noindex)
    .map((e) => {
      const lastModified = date(e.modified);
      return { url: `${site.url}${e.path}`, ...(lastModified && { lastModified }), changeFrequency: "monthly", priority: e.priority ?? 0.7 };
    });
}
