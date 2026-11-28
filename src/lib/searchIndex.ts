import { caseStudies } from "@/content/caseStudies";
import { industries, posts, themes, type Industry, type Product } from "@/content/misc";
import { services, type Service } from "@/content/services";

export type SearchEntry = { title: string; href: string; type: string; text: string };

type Data = {
  services: Pick<Service, "slug" | "name" | "blurb">[];
  projects: { slug: string; title: string; summary: string }[];
  industries: Pick<Industry, "slug" | "name" | "blurb">[];
  posts: { slug: string; title: string; excerpt: string }[];
  themes: Pick<Product, "slug" | "tagline" | "description">[];
  pages?: { slug: string; title: string; excerpt: string }[];
};

/** Site search entries. Built on the server from WordPress content and passed to the search dialog. */
export function buildSearchIndex(d: Data): SearchEntry[] {
  return [
    ...d.services.map((s) => ({ title: s.name, href: `/${s.slug}`, type: "Service", text: s.blurb })),
    ...d.projects.map((c) => ({ title: c.title, href: `/case-studies/${c.slug}`, type: "Case Study", text: c.summary })),
    ...d.industries.map((i) => ({ title: `HubSpot for ${i.name}`, href: `/industries/${i.slug}`, type: "Industry", text: i.blurb })),
    ...d.posts.map((p) => ({ title: p.title, href: `/blog/${p.slug}`, type: "Blog", text: p.excerpt })),
    ...d.themes.map((t) => ({ title: t.tagline, href: `/hubspot-themes/${t.slug}`, type: "Theme", text: t.description })),
    ...(d.pages ?? []).map((p) => ({ title: p.title, href: `/${p.slug}`, type: "Page", text: p.excerpt })),
    { title: "About Take Solution Today", href: "/about", type: "Page", text: "Who we are and how we work." },
    { title: "Contact", href: "/contact", type: "Page", text: "Get in touch with our team." },
    { title: "Start a Project", href: "/start-a-project", type: "Page", text: "Tell us about your project." },
    { title: "Schedule a Meeting", href: "/schedule-meeting", type: "Page", text: "Book a 30 minute consultation." },
  ];
}

/** Built-in index, used when no data is passed in. */
export const searchIndex = buildSearchIndex({ services, projects: caseStudies, industries, posts, themes });
