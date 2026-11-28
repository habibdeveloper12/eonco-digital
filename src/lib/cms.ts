/**
 * Editable page content from WordPress: services, industries, HubSpot themes
 * and plain pages.
 *
 * How it works:
 * - Each item is matched to the built-in content in src/content by its slug.
 *   Any field left empty in WordPress keeps the built-in text, so editors only
 *   change what they need to.
 * - Once at least one item of a type is published in WordPress, WordPress is
 *   the list of record: unpublishing or deleting an item removes it from the
 *   website, and new items appear automatically. Until then, the built-in
 *   list is used. (WordPress → Settings → Website Connection → "Import website
 *   content" copies the built-in content into WordPress in one click.)
 * - When WordPress is not configured or unreachable, the built-in content is
 *   used so the site always renders.
 */
import { buildService, services as localServices, type Service } from "@/content/services";
import { industries as localIndustries, themes as localThemes, type Industry, type Product } from "@/content/misc";
import { image, imageAlt, list, paragraphs, plain, seoOf, str, wpGet, type Seo, type WPItem } from "./wordpress";

/* ------------------------------------------------------------------ */
/* Field helpers                                                        */
/* ------------------------------------------------------------------ */

const lines = (v: unknown) => list(v, /\r?\n/);

/** "Title | Text" per line. Anything after the first "|" is the text. */
const pairs = (v: unknown) =>
  lines(v)
    .map((l) => {
      const [title, ...rest] = l.split("|");
      return { title: title.trim(), text: rest.join("|").trim() };
    })
    .filter((p) => p.title && p.text);

/** "A | B | C" per line. */
const triples = (v: unknown) =>
  lines(v)
    .map((l) => {
      const [a, b, ...rest] = l.split("|");
      return [a?.trim() ?? "", b?.trim() ?? "", rest.join("|").trim()] as [string, string, string];
    })
    .filter((r) => r.every(Boolean));

/** Use the WordPress list when it has entries, otherwise keep the built-in one. */
const or = <T,>(wp: T[], fallback: T[]) => (wp.length ? wp : fallback);

/** Editor HTML, only when it contains real text or media. */
const richHtml = (it: WPItem) => {
  const html = (it.content?.rendered ?? "").trim();
  return plain(html) || /<(img|iframe|video|figure)\b/i.test(html) ? html : undefined;
};

const color = (v: unknown, fallback: string) => (/^#[0-9a-f]{3,8}$/i.test(str(v)) ? str(v) : fallback);

const embed = "_embed=wp:featuredmedia";

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */

function toService(it: WPItem): Service {
  const m = it.meta ?? {};
  const name = plain(it.title.rendered);
  const known = localServices.find((s) => s.slug === it.slug);
  const group = m.eonco_group === "digital" || m.eonco_group === "hubspot" ? m.eonco_group : (known?.group ?? "hubspot");
  const base =
    known ??
    buildService({ slug: it.slug, group, name, navLabel: name, icon: "Rocket", blurb: "", heroTitle: name, heroText: "", ctaLabel: "Get started", focus: name, types: [] });

  const packages = [1, 2, 3]
    .map((n, i) => {
      const p = (k: string) => str(m[`eonco_pkg${n}_${k}`]);
      const fallback = base.packages[i];
      if (!p("name")) return fallback;
      return {
        name: p("name"),
        price: p("price") || fallback?.price || "Custom",
        unit: p("unit"),
        timeline: p("timeline") || fallback?.timeline || "",
        items: or(pairs(m[`eonco_pkg${n}_items`]), fallback?.items ?? []),
      };
    })
    .filter((p): p is Service["packages"][number] => Boolean(p));

  return {
    ...base,
    slug: it.slug,
    group,
    name: name || base.name,
    navLabel: str(m.eonco_nav_label) || base.navLabel,
    icon: str(m.eonco_icon) || base.icon,
    blurb: plain(it.excerpt?.rendered) || base.blurb,
    heroTitle: str(m.eonco_hero_title) || base.heroTitle,
    heroText: str(m.eonco_hero_text) || base.heroText,
    ctaLabel: str(m.eonco_cta_label) || base.ctaLabel,
    intro: { title: str(m.eonco_intro_title) || base.intro.title, body: or(paragraphs(m.eonco_intro_body), base.intro.body) },
    problems: or(pairs(m.eonco_problems), base.problems),
    starting: or(pairs(m.eonco_starting), base.starting),
    results: or(pairs(m.eonco_results), base.results),
    types: or(pairs(m.eonco_types), base.types),
    comparison: { rows: or(triples(m.eonco_comparison), base.comparison.rows) },
    process: or(pairs(m.eonco_process), base.process),
    packages,
    faqs: or(
      pairs(m.eonco_faqs).map((p) => ({ q: p.title, a: p.text })),
      base.faqs,
    ),
    html: richHtml(it),
    image: image(it),
    imageAlt: imageAlt(it),
    seo: seoOf(it),
    modified: it.modified,
  };
}

export async function getServices(): Promise<Service[]> {
  const items = await wpGet(`services?per_page=100&orderby=menu_order&order=asc&${embed}`);
  return items?.length ? items.map(toService) : localServices;
}

export async function getService(slug: string) {
  return (await getServices()).find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Industries                                                           */
/* ------------------------------------------------------------------ */

function toIndustry(it: WPItem): Industry {
  const m = it.meta ?? {};
  const base = localIndustries.find((i) => i.slug === it.slug);
  const name = plain(it.title.rendered) || base?.name || it.slug;
  return {
    slug: it.slug,
    name,
    icon: str(m.eonco_icon) || base?.icon || "Building2",
    blurb: plain(it.excerpt?.rendered) || base?.blurb || "",
    intro: str(m.eonco_intro) || base?.intro || "",
    needs: or(lines(m.eonco_needs), base?.needs ?? []),
    html: richHtml(it),
    image: image(it),
    imageAlt: imageAlt(it),
    seo: seoOf(it),
    modified: it.modified,
  };
}

export async function getIndustries(): Promise<Industry[]> {
  const items = await wpGet(`industries?per_page=100&orderby=menu_order&order=asc&${embed}`);
  return items?.length ? items.map(toIndustry) : localIndustries;
}

export async function getIndustry(slug: string) {
  return (await getIndustries()).find((i) => i.slug === slug);
}

/* ------------------------------------------------------------------ */
/* HubSpot themes (Products)                                            */
/* ------------------------------------------------------------------ */

function toTheme(it: WPItem): Product {
  const m = it.meta ?? {};
  const base = localThemes.find((t) => t.slug === it.slug);
  const name = plain(it.title.rendered) || base?.name || it.slug;
  return {
    slug: it.slug,
    name,
    category: str(m.eonco_category) || base?.category || "HubSpot Theme",
    tagline: str(m.eonco_tagline) || base?.tagline || name,
    description: plain(it.excerpt?.rendered) || base?.description || "",
    price: str(m.eonco_price) || base?.price || "",
    frame: color(m.eonco_frame, base?.frame ?? "#012c4c"),
    palette: [color(m.eonco_color_bg, base?.palette[0] ?? "#0f1222"), color(m.eonco_color_accent, base?.palette[1] ?? "#dc1f36"), color(m.eonco_color_ink, base?.palette[2] ?? "#ffffff")],
    headline: str(m.eonco_headline) || base?.headline || name,
    features: or(lines(m.eonco_features), base?.features ?? []),
    buyUrl: str(m.eonco_buy_url) || undefined,
    html: richHtml(it),
    image: image(it),
    imageAlt: imageAlt(it),
    seo: seoOf(it),
    modified: it.modified,
  };
}

export async function getThemes(): Promise<Product[]> {
  const items = await wpGet(`hubspot-themes?per_page=100&orderby=menu_order&order=asc&${embed}`);
  return items?.length ? items.map(toTheme) : localThemes;
}

export async function getTheme(slug: string) {
  return (await getThemes()).find((t) => t.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Pages (WordPress → Pages)                                            */
/* ------------------------------------------------------------------ */

export type CmsPage = {
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  image?: string;
  imageAlt?: string;
  seo: Seo;
  date: string;
  modified?: string;
};

/**
 * Website addresses that already have their own designed page. A WordPress
 * page with one of these slugs does not create a second page; privacy-policy
 * and terms-and-conditions use the WordPress text inside their own layout.
 */
export const RESERVED_SLUGS = [
  "about", "contact", "start-a-project", "schedule-meeting", "case-studies", "industries", "blog",
  "hubspot-themes", "hubspot-modules", "hubspot-apps", "privacy-policy", "terms-and-conditions",
  "api", "sitemap.xml", "robots.txt", "llms.txt", "opengraph-image", "wp-plugin", "home", "sample-page",
];

export async function getPages(): Promise<CmsPage[]> {
  const items = await wpGet(`pages?per_page=100&${embed}`);
  return (items ?? []).map((it) => ({
    slug: it.slug,
    title: plain(it.title.rendered),
    excerpt: plain(it.excerpt?.rendered),
    html: it.content?.rendered ?? "",
    image: image(it),
    imageAlt: imageAlt(it),
    seo: seoOf(it),
    date: it.date,
    modified: it.modified,
  }));
}

export async function getPage(slug: string) {
  return (await getPages()).find((p) => p.slug === slug);
}

/** WordPress pages that get their own address on the website (/{slug}). */
export async function getStandalonePages() {
  const [pages, services] = await Promise.all([getPages(), getServices()]);
  return pages.filter((p) => !RESERVED_SLUGS.includes(p.slug) && !services.some((s) => s.slug === p.slug));
}
