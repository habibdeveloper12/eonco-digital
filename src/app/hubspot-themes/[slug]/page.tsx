import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { PageHero } from "@/components/pages/PageHero";
import { RichContent } from "@/components/pages/RichContent";
import { ThemeShot } from "@/components/pages/ThemeShot";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { BrowserFrame } from "@/components/visuals/Mockups";
import { site } from "@/content/site";
import { getTheme, getThemes } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
// Themes added in WordPress get their address on first visit.
export const dynamicParams = true;
export const generateStaticParams = async () => (await getThemes()).map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTheme((await params).slug);
  return t ? pageMetadata({ title: t.tagline, description: t.description, path: `/hubspot-themes/${t.slug}`, image: t.image, seo: t.seo }) : {};
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTheme((await params).slug);
  if (!t) notFound();
  const price = Number(t.price.replace(/[^0-9.]/g, ""));
  return (
    <>
      <PageHero
        eyebrow={t.category}
        title={t.tagline}
        text={t.description}
        primary={{ label: t.price ? `Get ${t.name} for ${t.price}` : `Get ${t.name}`, href: t.buyUrl || `/contact?theme=${t.slug}` }}
        secondary={{ label: "Request a demo", href: "/schedule-meeting" }}
        visual={
          <div className="rounded-[20px] p-4" style={{ background: t.frame }}>
            <BrowserFrame>
              <ThemeShot t={t} variant={1} priority />
            </BrowserFrame>
          </div>
        }
      />
      {t.features.length > 0 && (
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
      )}
      {t.html && (
        <section className="pb-[80px]">
          <div className="mx-auto max-w-[820px] px-5">
            <RichContent html={t.html} />
          </div>
        </section>
      )}
      <ConsultCta />
      <Breadcrumbs items={[["HubSpot Themes", "/hubspot-themes"], [t.name, `/hubspot-themes/${t.slug}`]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${t.name} HubSpot Theme`,
          description: t.description,
          category: t.category,
          url: `${site.url}/hubspot-themes/${t.slug}`,
          ...(t.image && { image: t.image }),
          brand: { "@id": `${site.url}/#organization` },
          ...(price > 0 && { offers: { "@type": "Offer", price, priceCurrency: "USD", availability: "https://schema.org/InStock", url: t.buyUrl || `${site.url}/hubspot-themes/${t.slug}` } }),
        }}
      />
    </>
  );
}
