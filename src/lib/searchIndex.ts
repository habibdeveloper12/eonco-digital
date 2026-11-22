import { caseStudies } from "@/content/caseStudies";
import { industries, posts, themes } from "@/content/misc";
import { services } from "@/content/services";

export type SearchEntry = { title: string; href: string; type: string; text: string };

export const searchIndex: SearchEntry[] = [
  ...services.map((s) => ({ title: s.name, href: `/${s.slug}`, type: "Service", text: s.blurb })),
  ...caseStudies.map((c) => ({ title: c.title, href: `/case-studies/${c.slug}`, type: "Case Study", text: c.summary })),
  ...industries.map((i) => ({ title: `HubSpot for ${i.name}`, href: `/industries/${i.slug}`, type: "Industry", text: i.blurb })),
  ...posts.map((p) => ({ title: p.title, href: `/blog/${p.slug}`, type: "Blog", text: p.excerpt })),
  ...themes.map((t) => ({ title: t.tagline, href: `/hubspot-themes/${t.slug}`, type: "Theme", text: t.description })),
  { title: "About Eonco Digital", href: "/about", type: "Page", text: "Who we are and how we work." },
  { title: "Contact", href: "/contact", type: "Page", text: "Get in touch with our team." },
  { title: "Start a Project", href: "/start-a-project", type: "Page", text: "Tell us about your project." },
  { title: "Schedule a Meeting", href: "/schedule-meeting", type: "Page", text: "Book a 30 minute consultation." },
];
