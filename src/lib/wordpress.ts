/**
 * Headless WordPress content layer.
 *
 * When WORDPRESS_URL is set, blog posts, case studies (projects) and
 * testimonials are read from that WordPress site's REST API. The companion
 * plugin in /wordpress/eonco-headless registers the "Projects" and
 * "Testimonials" sections and their fields in the WordPress dashboard.
 *
 * When WORDPRESS_URL is not set, or WordPress cannot be reached, the local
 * sample content in src/content is used so the site always renders.
 *
 * Pages are cached and refreshed every 5 minutes, and instantly when the
 * plugin calls /api/revalidate after someone publishes or updates content.
 */
import { caseStudies as localCases, featuredCaseSlugs, type CaseStudy, type IndustrySlug } from "@/content/caseStudies";
import { featuredTestimonial as localFeatured, posts as localPosts, testimonials as localTestimonials, type Post } from "@/content/misc";

const WP = process.env.WORDPRESS_URL?.replace(/\/+$/, "");
export const wordpressEnabled = Boolean(WP);
export const WP_TAG = "wordpress";

export type Testimonial = { quote: string; name: string; role: string; featured?: boolean };

/* ------------------------------------------------------------------ */
/* Low-level fetch                                                      */
/* ------------------------------------------------------------------ */

type WPRendered = { rendered: string };
type WPMedia = { source_url?: string; alt_text?: string };
type WPTerm = { name: string; taxonomy: string };
type WPItem = {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  excerpt?: WPRendered;
  content?: WPRendered;
  meta?: Record<string, unknown>;
  _embedded?: { "wp:featuredmedia"?: WPMedia[]; "wp:term"?: WPTerm[][] };
};

async function wpGet(path: string): Promise<WPItem[] | null> {
  if (!WP) return null;
  try {
    const res = await fetch(`${WP}/wp-json/wp/v2/${path}`, { next: { revalidate: 300, tags: [WP_TAG] } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as WPItem[];
  } catch (err) {
    console.error(`[wordpress] ${path} failed, using local content:`, err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const ENTITIES: Record<string, string> = { "&amp;": "&", "&#038;": "&", "&#8217;": "’", "&#8216;": "‘", "&#8220;": "“", "&#8221;": "”", "&#8211;": "–", "&#8212;": "—", "&nbsp;": " ", "&hellip;": "…", "&#8230;": "…", "&quot;": '"', "&#039;": "'" };
/** Strip tags and decode the entities WordPress emits in titles and excerpts. */
export const plain = (html = "") =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&[#a-z0-9]+;/gi, (e) => ENTITIES[e] ?? e)
    .replace(/\s+/g, " ")
    .trim();

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown, sep: RegExp = /,/) => str(v).split(sep).map((s) => s.trim()).filter(Boolean);
const paragraphs = (v: unknown) => list(v, /\n\s*\n|\r?\n/);
const image = (it: WPItem) => it._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
const terms = (it: WPItem, taxonomy: string) => (it._embedded?.["wp:term"] ?? []).flat().filter((t) => t.taxonomy === taxonomy).map((t) => plain(t.name));
const readTime = (html: string) => `${Math.max(1, Math.round(plain(html).split(" ").length / 220))} min read`;

/** Rotating brand-safe palettes for posts without a featured image. */
const postPalettes: Post["palette"][] = [
  ["#fff1f2", "#e8233a", "#001729"],
  ["#eef4fb", "#012c4c", "#001729"],
  ["#f8f9fb", "#c81a2f", "#0d1a2b"],
  ["#fdf7f5", "#a31326", "#001729"],
];

/* ------------------------------------------------------------------ */
/* Blog posts                                                           */
/* ------------------------------------------------------------------ */

export type BlogPost = Post & { html?: string; image?: string };

export async function getPosts(): Promise<BlogPost[]> {
  const items = await wpGet("posts?per_page=50&_embed=wp:featuredmedia,wp:term");
  if (!items) return localPosts;
  return items.map((it, i) => {
    const html = it.content?.rendered ?? "";
    return {
      slug: it.slug,
      title: plain(it.title.rendered),
      category: terms(it, "category").find((c) => c !== "Uncategorized") ?? "Insights",
      date: it.date,
      readTime: readTime(html),
      excerpt: plain(it.excerpt?.rendered).replace(/\s*\[(…|\.\.\.)\]\s*$/, "…"),
      palette: postPalettes[i % postPalettes.length],
      body: [],
      html,
      image: image(it),
    };
  });
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Case studies ("Projects" in the WordPress dashboard)                 */
/* ------------------------------------------------------------------ */

export type Project = CaseStudy & { image?: string; featured?: boolean };

const industries: IndustrySlug[] = ["professional-services", "healthcare", "ecommerce", "construction", "saas", "education"];

function toProject(it: WPItem): Project {
  const m = it.meta ?? {};
  const industry = str(m.eonco_industry) as IndustrySlug;
  return {
    slug: it.slug,
    client: str(m.eonco_client) || plain(it.title.rendered).split(" ").slice(0, 2).join(" "),
    title: plain(it.title.rendered),
    industry: industries.includes(industry) ? industry : "professional-services",
    tags: list(m.eonco_tags),
    summary: plain(it.excerpt?.rendered),
    palette: [str(m.eonco_color_bg) || "#0a2035", str(m.eonco_color_accent) || "#e8233a", str(m.eonco_color_ink) || "#ffffff"],
    headline: str(m.eonco_headline) || plain(it.title.rendered),
    kind: m.eonco_kind === "web" ? "web" : "crm",
    // One result per line, written as "38% | Faster enquiry response"
    stats: list(m.eonco_stats, /\r?\n/)
      .map((line) => line.split("|").map((s) => s.trim()))
      .filter(([v, l]) => v && l)
      .slice(0, 4)
      .map(([value, label]) => ({ value, label })),
    challenge: paragraphs(m.eonco_challenge),
    solution: paragraphs(m.eonco_solution),
    outcome: paragraphs(m.eonco_outcome),
    stack: list(m.eonco_stack),
    image: image(it),
    featured: Boolean(m.eonco_featured),
  };
}

export async function getProjects(): Promise<Project[]> {
  const items = await wpGet("case-studies?per_page=100&_embed=wp:featuredmedia");
  if (!items) return localCases.map((c) => ({ ...c, featured: featuredCaseSlugs.includes(c.slug) }));
  return items.map(toProject);
}

export async function getProject(slug: string) {
  return (await getProjects()).find((c) => c.slug === slug);
}

/** Featured projects for the homepage; falls back to the newest six. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((c) => c.featured);
  if (!wordpressEnabled) return featuredCaseSlugs.map((s) => all.find((c) => c.slug === s)!).filter(Boolean);
  return (featured.length ? featured : all).slice(0, 6);
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                         */
/* ------------------------------------------------------------------ */

export async function getTestimonials(): Promise<{ featured: Testimonial | null; list: Testimonial[] }> {
  const items = await wpGet("testimonials?per_page=50");
  if (!items) return { featured: localFeatured, list: localTestimonials };
  const all: Testimonial[] = items.map((it) => ({
    quote: plain(it.content?.rendered),
    name: plain(it.title.rendered),
    role: str(it.meta?.eonco_role),
    featured: Boolean(it.meta?.eonco_featured),
  }));
  return { featured: all.find((t) => t.featured) ?? all[0] ?? null, list: all };
}
