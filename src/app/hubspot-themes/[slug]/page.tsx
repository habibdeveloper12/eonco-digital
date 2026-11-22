import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { PageHero } from "@/components/pages/PageHero";
import { BrowserFrame, SiteMock } from "@/components/visuals/Mockups";
import { themes } from "@/content/misc";

export const dynamicParams = false;
export const generateStaticParams = () => themes.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = themes.find((x) => x.slug === slug);
  return t ? { title: t.tagline, description: t.description, alternates: { canonical: `/hubspot-themes/${t.slug}` } } : {};
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = themes.find((x) => x.slug === slug);
  if (!t) notFound();
  return (
    <>
      <PageHero
        eyebrow={t.category}
        title={t.tagline}
        text={t.description}
        primary={{ label: `Get ${t.name} for ${t.price}`, href: `/contact?theme=${t.slug}` }}
        secondary={{ label: "Request a demo", href: "/schedule-meeting" }}
        visual={
          <div className="rounded-[20px] p-4" style={{ background: t.frame }}>
            <BrowserFrame>
              <SiteMock palette={t.palette} headline={t.headline} variant={1} />
            </BrowserFrame>
          </div>
        }
      />
      <section className="py-[80px]">
        <div className="container-narrow gutter">
          <h2 className="text-section-sm text-navy">
            What&apos;s <span className="text-brand">included</span>
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {t.features.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-[16px] bg-cloud p-5 font-heading text-[17px] text-navy">
                <span className="grid size-8 place-items-center rounded-full bg-brand text-white">
                  <Check className="size-4" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
