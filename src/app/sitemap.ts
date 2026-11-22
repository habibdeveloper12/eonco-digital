import type { MetadataRoute } from "next";
import { industries, themes } from "@/content/misc";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { getPosts, getProjects } from "@/lib/wordpress";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const paths = [
    "", "/about", "/contact", "/start-a-project", "/schedule-meeting", "/case-studies", "/industries", "/blog",
    "/hubspot-themes", "/hubspot-modules", "/hubspot-apps", "/privacy-policy", "/terms-and-conditions",
    ...services.map((s) => `/${s.slug}`),
    ...projects.map((c) => `/case-studies/${c.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
    ...themes.map((t) => `/hubspot-themes/${t.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date(), changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
