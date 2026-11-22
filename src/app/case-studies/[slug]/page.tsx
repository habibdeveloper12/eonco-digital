import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { CaseTile } from "@/components/pages/CaseTile";
import { ProjectVisual } from "@/components/pages/ProjectVisual";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { getIndustry } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import { getProject, getProjects } from "@/lib/wordpress";

export const revalidate = 300;
// New projects published in WordPress render on first visit, no rebuild needed.
export const dynamicParams = true;
export const generateStaticParams = async () => (await getProjects()).map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getProject((await params).slug);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.summary, path: `/case-studies/${c.slug}`, image: c.image, seo: c.seo, type: "article", modifiedTime: c.modified });
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <Reveal className="border-t border-line py-10">
      <h2 className="font-display text-[28px] font-medium text-navy">{title}</h2>
      <div className="mt-4 space-y-4">
        {items.map((t) => (
          <p key={t} className="text-[18px] leading-[1.65] text-body">
            {t}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const [c, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!c) notFound();
  const ind = await getIndustry(c.industry);
  const more = all.filter((x) => x.slug !== c.slug).slice(0, 3);
  return (
    <>
      <section className="bg-navy pb-[80px] pt-[128px] text-white">
        <div className="container-narrow gutter">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-[14px] text-white/70 transition-colors hover:text-white">
            <ArrowLeft className="size-4" /> All case studies
          </Link>
          {c.tags.length > 0 && <p className="mt-8 text-[14px] text-white/55">{c.tags.join(" · ")}</p>}
          <h1 className="h-display mt-3 max-w-[860px] text-[36px] leading-[1.08] sm:text-[52px]">{c.title}</h1>
          {c.summary && <p className="mt-5 max-w-[720px] text-[18px] leading-[1.6] text-white/75">{c.summary}</p>}
          {c.stats.length > 0 && (
            <dl className="mt-10 grid gap-px overflow-hidden rounded-[16px] border border-white/10 bg-white/10 sm:grid-cols-3">
              {c.stats.map((s) => (
                <div key={s.label} className="flex flex-col bg-navy p-6">
                  <dt className="order-2 mt-3 text-[15px] text-white/65">{s.label}</dt>
                  <dd className="order-1 font-display text-[44px] font-medium leading-none tabular-nums text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <Reveal className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[20px] bg-navy-3">
            <ProjectVisual c={c} variant={1} />
          </Reveal>
        </div>
      </section>

      <section className="py-[64px]">
        <div className="container-narrow gutter grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <Block title="The challenge" items={c.challenge} />
            <Block title="What we built" items={c.solution} />
            <Block title="The outcome" items={c.outcome} />
          </div>
          <aside className="lg:sticky lg:top-[112px] lg:self-start">
            <div className="rounded-[20px] bg-cloud p-6">
              <p className="text-[13px] text-muted">Industry</p>
              <Link href={`/industries/${c.industry}`} className="mt-1 block font-heading text-[18px] font-medium text-navy transition-colors hover:text-brand">
                {ind?.name}
              </Link>
              {c.stack.length > 0 && (
                <>
                  <p className="mt-6 text-[13px] text-muted">Stack</p>
                  <ul className="mt-2 space-y-2">
                    {c.stack.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-[15px] text-navy">
                        <Check className="size-4 text-brand-600" strokeWidth={2} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Link href="/start-a-project" className="mt-8 flex h-[50px] items-center justify-center rounded-full bg-brand text-[16px] font-medium text-white transition-colors hover:bg-brand-600">
                Start a similar project
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-cloud py-[80px]">
          <div className="container-narrow gutter">
            <h2 className="text-section-sm text-navy">
              More <span className="text-brand">case studies</span>
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {more.map((m, i) => (
                <CaseTile key={m.slug} c={m} i={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      <ConsultCta />
      <Breadcrumbs items={[["Case studies", "/case-studies"], [c.title, `/case-studies/${c.slug}`]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.title,
          description: c.summary,
          ...(c.image && { image: c.image }),
          about: c.tags,
          mainEntityOfPage: `${site.url}/case-studies/${c.slug}`,
          author: { "@id": `${site.url}/#organization` },
          publisher: { "@id": `${site.url}/#organization` },
        }}
      />
    </>
  );
}
