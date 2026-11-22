import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { CaseTile } from "@/components/pages/CaseTile";
import { PageHero } from "@/components/pages/PageHero";
import { SectionHeader } from "@/components/pages/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getIndustry, industries } from "@/content/misc";
import { getProjects } from "@/lib/wordpress";
import { hubspotServices } from "@/content/services";
import Link from "next/link";

export const dynamicParams = false;
export const revalidate = 300;
export const generateStaticParams = () => industries.map((i) => ({ slug: i.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const ind = getIndustry((await params).slug);
  if (!ind) return {};
  return { title: `HubSpot for ${ind.name}`, description: ind.intro, alternates: { canonical: `/industries/${ind.slug}` } };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const ind = getIndustry((await params).slug);
  if (!ind) notFound();
  const all = await getProjects();
  const matching = all.filter((c) => c.industry === ind.slug);
  const cases = (matching.length ? matching : all).slice(0, 3);
  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={<>HubSpot for <span className="text-brand">{ind.name}</span></>}
        text={ind.intro}
        primary={{ label: "Book a call", href: "/schedule-meeting" }}
        secondary={{ label: "See case studies", href: "#cases" }}
        visual={
          <div className="grid aspect-square place-items-center rounded-[20px] border border-line bg-white">
            <span className="grid size-40 place-items-center rounded-[36px] bg-brand-50 text-brand-600">
              <Icon name={ind.icon} className="size-20" strokeWidth={1.5} />
            </span>
          </div>
        }
      />
      <section className="py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="What matters" title={`What ${ind.name} Teams`} accent="Need from HubSpot" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {ind.needs.map((n, i) => (
              <Reveal key={n} delay={(i % 2) * 0.06} className="flex items-center gap-4 rounded-[16px] bg-cloud p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <Check className="size-5" />
                </span>
                <span className="font-heading text-[18px] font-medium text-navy">{n}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-cream-3 py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="Services" title="How We" accent="Help" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {hubspotServices.map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} className="rounded-full border border-line bg-white px-5 py-3 text-[15px] font-medium text-navy transition-colors hover:border-brand hover:bg-brand hover:text-white">
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="cases" className="scroll-mt-24 py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="Case studies" title={`${ind.name}`} accent="Projects" />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {cases.map((c, i) => (
              <CaseTile key={c.slug} c={c} i={i} />
            ))}
          </div>
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
