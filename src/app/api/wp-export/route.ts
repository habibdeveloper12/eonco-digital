import { NextResponse } from "next/server";
import { caseStudies } from "@/content/caseStudies";
import { homeFaqs } from "@/content/faq";
import { industries, posts, themes } from "@/content/misc";
import { services } from "@/content/services";

/**
 * The website's built-in content in the shape the WordPress plugin stores it,
 * so WordPress → Settings → Website Connection → "Import website content" can fill
 * the dashboard in one click instead of retyping every page.
 *
 * GET /api/wp-export   header: x-revalidate-secret: <REVALIDATE_SECRET>
 */
export const dynamic = "force-dynamic";

const pairs = (items: { title: string; text: string }[]) => items.map((i) => `${i.title} | ${i.text}`).join("\n");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  const data = {
    version: 1,
    services: services.map((s, i) => ({
      slug: s.slug,
      title: s.name,
      excerpt: s.blurb,
      menu_order: i,
      meta: {
        eonco_group: s.group,
        eonco_nav_label: s.navLabel,
        eonco_icon: s.icon,
        eonco_hero_title: s.heroTitle,
        eonco_hero_text: s.heroText,
        eonco_cta_label: s.ctaLabel,
        eonco_intro_title: s.intro.title,
        eonco_intro_body: s.intro.body.join("\n"),
        eonco_problems: pairs(s.problems),
        eonco_starting: pairs(s.starting),
        eonco_results: pairs(s.results),
        eonco_types: pairs(s.types),
        eonco_comparison: s.comparison.rows.map((r) => r.join(" | ")).join("\n"),
        eonco_process: pairs(s.process),
        eonco_faqs: s.faqs.map((f) => `${f.q} | ${f.a}`).join("\n"),
        ...Object.fromEntries(
          s.packages.flatMap((p, n) => [
            [`eonco_pkg${n + 1}_name`, p.name],
            [`eonco_pkg${n + 1}_price`, p.price],
            [`eonco_pkg${n + 1}_unit`, p.unit],
            [`eonco_pkg${n + 1}_timeline`, p.timeline],
            [`eonco_pkg${n + 1}_items`, pairs(p.items)],
          ]),
        ),
      },
    })),
    industries: industries.map((ind, i) => ({
      slug: ind.slug,
      title: ind.name,
      excerpt: ind.blurb,
      menu_order: i,
      meta: { eonco_icon: ind.icon, eonco_intro: ind.intro, eonco_needs: ind.needs.join("\n") },
    })),
    themes: themes.map((t, i) => ({
      slug: t.slug,
      title: t.name,
      excerpt: t.description,
      menu_order: i,
      meta: {
        eonco_category: t.category,
        eonco_tagline: t.tagline,
        eonco_price: t.price,
        eonco_frame: t.frame,
        eonco_color_bg: t.palette[0],
        eonco_color_accent: t.palette[1],
        eonco_color_ink: t.palette[2],
        eonco_headline: t.headline,
        eonco_features: t.features.join("\n"),
      },
    })),
    // Imported as published so the blog keeps all its articles once WordPress takes over.
    posts: posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      category: p.category,
      content: p.body
        .map((b) => (b.h ? `<h2>${esc(b.h)}</h2>` : b.list ? `<ul>${b.list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : `<p>${esc(b.p ?? "")}</p>`))
        .join("\n"),
    })),
    // Sample projects are imported as drafts: publish each one only after replacing it with a real, approved project.
    projects: caseStudies.map((c) => ({
      slug: c.slug,
      title: c.title,
      excerpt: c.summary,
      meta: {
        eonco_client: c.client,
        eonco_industry: c.industry,
        eonco_tags: c.tags.join(", "),
        eonco_stats: c.stats.map((s) => `${s.value} | ${s.label}`).join("\n"),
        eonco_challenge: c.challenge.join("\n"),
        eonco_solution: c.solution.join("\n"),
        eonco_outcome: c.outcome.join("\n"),
        eonco_stack: c.stack.join(", "),
        eonco_headline: c.headline,
        eonco_color_bg: c.palette[0],
        eonco_color_accent: c.palette[1],
        eonco_color_ink: c.palette[2],
        eonco_kind: c.kind,
      },
    })),
    // Legal page templates are imported as drafts so placeholder text never goes live by accident.
    pages: [
      {
        slug: "privacy-policy",
        title: "Privacy Policy",
        content:
          "<p>[Template only. Have this policy reviewed by a qualified legal adviser before publishing.]</p><h2>What we collect</h2><p>When you submit a form we collect your name, email address, phone number, company details and the message you send. We also use cookies and analytics to understand how the site is used.</p><h2>How we use it</h2><p>We use your details to respond to your enquiry, provide our services and, where you agree, send relevant updates. Form submissions are stored in our CRM (HubSpot).</p><h2>Your rights</h2><p>You can ask to access, correct or delete your personal information at any time by emailing hello@takesolutiontoday.com.</p>",
      },
      {
        slug: "terms-and-conditions",
        title: "Terms and Conditions",
        content:
          "<p>[Template only. Have this document reviewed by a qualified legal adviser before publishing.]</p><h2>Use of this website</h2><p>The content on this website is provided for general information only and may change without notice.</p><h2>Services</h2><p>Engagements are governed by a separate written agreement or statement of work.</p><h2>Intellectual property</h2><p>All content on this site is owned by Take Solution Today unless stated otherwise.</p>",
      },
    ],
    settings: {
      hero_lines: "Growth Runs\non Systems.\nWe Build Them.",
      hero_text:
        "We design, build and run HubSpot systems for growing companies in Australia, the US, the UK and Europe: CRM, integrations, websites and the automation that connects them.",
      faqs: homeFaqs.map((f) => ({ q: f.q, a: f.a })),
    },
  };

  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
