import type { Metadata } from "next";
import Link from "next/link";
import { ConsultCta } from "@/components/home/ConsultCta";
import { PageHero } from "@/components/pages/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { BrowserFrame, SiteMock } from "@/components/visuals/Mockups";
import { themes } from "@/content/misc";

export const metadata: Metadata = { title: "HubSpot Themes", description: "Production-ready HubSpot CMS themes by Eonco Digital.", alternates: { canonical: "/hubspot-themes" } };

export default function ThemesPage() {
  return (
    <>
      <PageHero centered eyebrow="Products" title={<>Premium <span className="text-brand">HubSpot Themes</span></>} text="Industry-specific HubSpot CMS themes with flexible modules, fast performance and editor-friendly settings." />
      <section className="py-[80px]">
        <div className="container-narrow gutter grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.08}>
              <Link href={`/hubspot-themes/${t.slug}`} className="group block rounded-[20px] border-[0.8px] border-line bg-white p-4 transition-shadow hover:shadow-[0_20px_40px_rgba(0,23,41,0.08)]">
                <div className="rounded-[16px] p-4" style={{ background: t.frame }}>
                  <BrowserFrame className="transition-transform duration-500 group-hover:-translate-y-1">
                    <SiteMock palette={t.palette} headline={t.headline} variant={i} />
                  </BrowserFrame>
                </div>
                <div className="p-3">
                  <p className="mt-3 text-[12px] font-medium text-muted">{t.category}</p>
                  <h2 className="mt-1 font-display text-[24px] font-medium text-navy group-hover:text-brand">{t.tagline}</h2>
                  <p className="mt-3 font-display text-[22px] font-medium text-brand">{t.price}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
