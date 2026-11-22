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
import { featuredTestimonial as localFeatured, posts as localPosts, stats as localStats, testimonials as localTestimonials, type Post } from "@/content/misc";
import { site } from "@/content/site";

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
export type WPItem = {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  title: WPRendered;
  excerpt?: WPRendered;
  content?: WPRendered;
  meta?: Record<string, unknown>;
  menu_order?: number;
  /** Added by Yoast SEO when it is installed. */
  yoast_head_json?: { description?: string; og_image?: { url?: string }[]; robots?: { index?: string } };
  _embedded?: { "wp:featuredmedia"?: WPMedia[]; "wp:term"?: WPTerm[][] };
};

export async function wpGet(path: string): Promise<WPItem[] | null> {
  if (!WP) return null;
  try {
    const res = await fetch(`${WP}/wp-json/wp/v2/${path}`, { next: { revalidate: 300, tags: [WP_TAG] } });
    if (res.status === 404) {
      // The content type is not registered: the Eonco Headless plugin is older than this website.
      console.warn(`[wordpress] /${path.split("?")[0]} not found (update the Eonco Headless plugin), using built-in content`);
      return null;
    }
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

export const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
export const list = (v: unknown, sep: RegExp = /,/) => str(v).split(sep).map((s) => s.trim()).filter(Boolean);
export const paragraphs = (v: unknown) => list(v, /\n\s*\n|\r?\n/);
/** Featured image URL, only when it lives in this WordPress media library (see images.remotePatterns in next.config). */
export const image = (it: WPItem) => {
  const src = it._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (!src || !WP) return undefined;
  try {
    const u = new URL(src);
    return u.hostname === new URL(WP).hostname && u.pathname.startsWith("/wp-content/uploads/") ? src : undefined;
  } catch {
    return undefined;
  }
};
export const imageAlt = (it: WPItem) => str(it._embedded?.["wp:featuredmedia"]?.[0]?.alt_text) || undefined;
const terms = (it: WPItem, taxonomy: string) => (it._embedded?.["wp:term"] ?? []).flat().filter((t) => t.taxonomy === taxonomy).map((t) => plain(t.name));
const readTime = (html: string) => `${Math.max(1, Math.round(plain(html).split(" ").length / 220))} min read`;

/** Search-engine fields an editor can set on any WordPress item (SEO box in the editor). */
export type Seo = { title?: string; description?: string; image?: string; noindex?: boolean };

/**
 * Reads the "Search & social" box from the Eonco plugin. When Yoast SEO is
 * installed its description, image and noindex are used as a fallback.
 */
export function seoOf(it: WPItem): Seo {
  const m = it.meta ?? {};
  const y = it.yoast_head_json;
  return {
    title: str(m.eonco_seo_title) || undefined,
    description: str(m.eonco_seo_description) || str(y?.description) || undefined,
    image: str(m.eonco_seo_image) || str(y?.og_image?.[0]?.url) || undefined,
    noindex: Boolean(m.eonco_noindex) || y?.robots?.index === "noindex",
  };
}

/** Fetch a single JSON document from a custom WordPress route (eonco/v1/...). */
export async function wpJson<T>(path: string): Promise<T | null> {
  if (!WP) return null;
  try {
    const res = await fetch(`${WP}/wp-json/${path}`, { next: { revalidate: 300, tags: [WP_TAG] } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[wordpress] ${path} failed, using local content:`, err);
    return null;
  }
}

/** Rotating brand-safe palettes for posts without a featured image. */
const postPalettes: Post["palette"][] = [
  ["#fff1f2", "#dc1f36", "#001729"],
  ["#eef4fb", "#012c4c", "#001729"],
  ["#f8f9fb", "#c81a2f", "#0d1a2b"],
  ["#fdf7f5", "#a31326", "#001729"],
];

/* ------------------------------------------------------------------ */
/* Blog posts                                                           */
/* ------------------------------------------------------------------ */

export type BlogPost = Post & { html?: string; image?: string; imageAlt?: string; modified?: string; seo?: Seo };

export async function getPosts(): Promise<BlogPost[]> {
  // WordPress's own sample post ("Hello world!") is never shown.
  const items = (await wpGet("posts?per_page=50&_embed=wp:featuredmedia,wp:term"))?.filter((it) => it.slug !== "hello-world");
  // Until the first real post is published, keep showing the built-in articles.
  if (!items?.length) return localPosts;
  return items.map((it, i) => {
    const html = it.content?.rendered ?? "";
    return {
      slug: it.slug,
      title: plain(it.title.rendered),
      category: terms(it, "category").find((c) => c !== "Uncategorized") ?? "Insights",
      date: it.date,
      modified: it.modified,
      readTime: readTime(html),
      excerpt: plain(it.excerpt?.rendered).replace(/\s*\[(…|\.\.\.)\]\s*$/, "…"),
      palette: postPalettes[i % postPalettes.length],
      body: [],
      html,
      image: image(it),
      imageAlt: imageAlt(it),
      seo: seoOf(it),
    };
  });
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Case studies ("Projects" in the WordPress dashboard)                 */
/* ------------------------------------------------------------------ */

export type Project = CaseStudy & { image?: string; featured?: boolean; modified?: string; seo?: Seo };

function toProject(it: WPItem): Project {
  const m = it.meta ?? {};
  const industry: IndustrySlug = str(m.eonco_industry) || "professional-services";
  return {
    slug: it.slug,
    client: str(m.eonco_client) || plain(it.title.rendered).split(" ").slice(0, 2).join(" "),
    title: plain(it.title.rendered),
    industry,
    tags: list(m.eonco_tags),
    summary: plain(it.excerpt?.rendered),
    palette: [str(m.eonco_color_bg) || "#0a2035", str(m.eonco_color_accent) || "#dc1f36", str(m.eonco_color_ink) || "#ffffff"],
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
    modified: it.modified || it.date,
    seo: seoOf(it),
  };
}

export async function getProjects(): Promise<Project[]> {
  const items = await wpGet("case-studies?per_page=100&_embed=wp:featuredmedia");
  // Until the first project is published in WordPress, keep showing the sample projects.
  if (!items?.length) return localCases.map((c) => ({ ...c, featured: featuredCaseSlugs.includes(c.slug) }));
  return items.map(toProject);
}

/** True when projects come from WordPress rather than the built-in samples. */
const projectsFromWordPress = async () => Boolean((await wpGet("case-studies?per_page=1"))?.length);

export async function getProject(slug: string) {
  return (await getProjects()).find((c) => c.slug === slug);
}

/** Featured projects for the homepage; falls back to the newest six. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((c) => c.featured);
  if (!(await projectsFromWordPress())) return featuredCaseSlugs.map((s) => all.find((c) => c.slug === s)!).filter(Boolean);
  return (featured.length ? featured : all).slice(0, 6);
}

/* ------------------------------------------------------------------ */
/* Site settings (WordPress → Settings → Eonco Website)                */
/* ------------------------------------------------------------------ */

type Stat = (typeof localStats.whoWeAre)[number];
type WhyStat = (typeof localStats.why)[number];

export type SiteSettings = {
  email: string;
  phone: string;
  partnerLabel: string;
  socials: { label: string; href: string }[];
  offices: { region: string; lines: string[]; phone: string }[];
  stats: Stat[];
  why: WhyStat[];
  /** Homepage hero and FAQ. Empty values keep the built-in copy. */
  home: { heroLines?: string[]; heroText?: string; title?: string; description?: string; faqs?: { q: string; a: string }[] };
  /** Site-wide defaults for search engines and social sharing. */
  seo: { title?: string; description?: string; image?: string };
};

type WPSettings = {
  hero_lines?: string;
  hero_text?: string;
  home_title?: string;
  home_description?: string;
  faqs?: { q?: string; a?: string }[];
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  email?: string;
  phone?: string;
  partner_label?: string;
  socials?: Record<string, string>;
  offices?: { region?: string; address?: string; phone?: string }[];
  stats?: { label?: string; value?: string; note?: string }[];
  why?: { value?: string; title?: string; text?: string }[];
};

/** "$2.4M" → { prefix: "$", value: 2.4, decimals: 1, suffix: "M" } */
function parseFigure(raw: string) {
  const m = raw.trim().match(/^([^0-9-]*)(-?[0-9][0-9,]*(?:\.([0-9]+))?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], value: Number(m[2].replace(/,/g, "")), decimals: m[3]?.length ?? 0, suffix: m[4] };
}

const SOCIAL_LABELS: Record<string, string> = { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram", x: "X", youtube: "YouTube" };

const localSettings: SiteSettings = {
  email: site.email,
  phone: "",
  partnerLabel: site.partnerLabel,
  socials: site.socials.map((s) => ({ ...s })),
  offices: site.offices.map((o) => ({ ...o, lines: [...o.lines] })),
  stats: localStats.whoWeAre,
  why: localStats.why,
  home: {},
  seo: {},
};

/** Company details and homepage figures. Empty WordPress fields keep the built-in values. */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!WP) return localSettings;
  let s: WPSettings | null = null;
  try {
    const res = await fetch(`${WP}/wp-json/eonco/v1/settings`, { next: { revalidate: 300, tags: [WP_TAG] } });
    if (res.ok) s = (await res.json()) as WPSettings;
  } catch (err) {
    console.error("[wordpress] settings failed, using local content:", err);
  }
  if (!s) return localSettings;

  const socials = Object.entries(s.socials ?? {})
    .filter(([, href]) => str(href))
    .map(([k, href]) => ({ label: SOCIAL_LABELS[k] ?? k, href: str(href) }));
  const offices = (s.offices ?? [])
    .filter((o) => str(o.region) && str(o.address))
    .map((o) => ({ region: str(o.region), lines: list(o.address, /\r?\n|,/), phone: str(o.phone) }));
  const stats = (s.stats ?? [])
    .map((st): Stat | null => {
      const f = parseFigure(str(st.value));
      return f && str(st.label) ? { label: str(st.label), value: f.value, prefix: f.prefix, suffix: f.suffix, decimals: f.decimals, note: str(st.note) ? [[str(st.note), "muted"]] : [] } : null;
    })
    .filter((x): x is Stat => Boolean(x));
  const why = (s.why ?? [])
    .map((w, i): WhyStat | null => {
      const f = parseFigure(str(w.value));
      return f && str(w.title) ? { icon: localStats.why[i]?.icon ?? "Workflow", value: f.value, suffix: f.suffix, title: str(w.title), text: str(w.text) } : null;
    })
    .filter((x): x is WhyStat => Boolean(x));

  return {
    email: str(s.email) || localSettings.email,
    phone: str(s.phone),
    partnerLabel: str(s.partner_label) || localSettings.partnerLabel,
    socials: socials.length ? socials : localSettings.socials,
    offices: offices.length ? offices : localSettings.offices,
    stats: stats.length ? stats : localSettings.stats,
    why: why.length ? why : localSettings.why,
    home: {
      heroLines: list(s.hero_lines, /\r?\n/).slice(0, 4),
      heroText: str(s.hero_text) || undefined,
      title: str(s.home_title) || undefined,
      description: str(s.home_description) || undefined,
      faqs: (s.faqs ?? []).map((f) => ({ q: str(f.q), a: str(f.a) })).filter((f) => f.q && f.a),
    },
    seo: { title: str(s.seo_title) || undefined, description: str(s.seo_description) || undefined, image: str(s.seo_image) || undefined },
  };
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                         */
/* ------------------------------------------------------------------ */

export async function getTestimonials(): Promise<{ featured: Testimonial | null; list: Testimonial[] }> {
  const items = await wpGet("testimonials?per_page=50");
  if (!items?.length) return { featured: localFeatured, list: localTestimonials };
  const all: Testimonial[] = items.map((it) => ({
    quote: plain(it.content?.rendered),
    name: plain(it.title.rendered),
    role: str(it.meta?.eonco_role),
    featured: Boolean(it.meta?.eonco_featured),
  }));
  return { featured: all.find((t) => t.featured) ?? all[0] ?? null, list: all };
}
