import { homeFaqs } from "@/content/faq";
import { industries } from "@/content/misc";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { getPosts, getProjects, getSiteSettings } from "@/lib/wordpress";

export const revalidate = 3600;

/**
 * /llms.txt: a plain-Markdown summary of the business for AI assistants and
 * answer engines (ChatGPT, Perplexity, Claude, Google AI Overviews).
 * Generated from the same data as the site, so it never goes stale.
 */
export async function GET() {
  const [settings, projects, posts] = await Promise.all([getSiteSettings(), getProjects(), getPosts()]);
  const fmt = (p: string) => (/custom/i.test(p) ? "custom quote" : `from ${p.replace("+", "")}${/\/mo/.test(p) ? "" : " per project"}`);

  const body = `# ${site.name}

> ${site.description}

${site.name} is a HubSpot-focused growth agency serving growing companies in Australia, the United States, the United Kingdom and Europe. One in-house team handles strategy, build, launch and ongoing support.

- Website: ${site.url}
- Email: ${settings.email}${settings.phone ? `\n- Phone: ${settings.phone}` : ""}
- Book a call: ${site.url}/schedule-meeting
- Start a project: ${site.url}/start-a-project

## Services

${services.map((s) => `- [${s.name}](${site.url}/${s.slug}): ${s.blurb} Starter package ${fmt(s.packages[0].price)} (${s.packages[0].timeline.replace("Timeline: ", "").toLowerCase()}).`).join("\n")}

## Industries

${industries.map((i) => `- [${i.name}](${site.url}/industries/${i.slug}): ${i.blurb}`).join("\n")}

## Case studies

${projects.map((c) => `- [${c.title}](${site.url}/case-studies/${c.slug}): ${c.summary}`).join("\n")}

## Articles

${posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.excerpt}`).join("\n")}

## Frequently asked questions

${homeFaqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
