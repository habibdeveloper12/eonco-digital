import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceTemplate } from "@/components/pages/ServiceTemplate";
import { CmsPageView } from "@/components/pages/CmsPageView";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import type { Service } from "@/content/services";
import { getService, getServices, getStandalonePages, type CmsPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/wordpress";

// Services and pages added in WordPress get their address on first visit, no rebuild needed.
export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const [services, pages] = await Promise.all([getServices(), getStandalonePages()]);
  return [...services, ...pages].map((x) => ({ slug: x.slug }));
}

type Resolved = { service: Service } | { page: CmsPage } | null;

async function resolve(slug: string): Promise<Resolved> {
  const service = await getService(slug);
  if (service) return { service };
  const page = (await getStandalonePages()).find((p) => p.slug === slug);
  return page ? { page } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) return {};
  if ("service" in r) {
    const s = r.service;
    return pageMetadata({ title: s.heroTitle, description: s.heroText, path: `/${s.slug}`, image: s.image, seo: s.seo });
  }
  const p = r.page;
  return pageMetadata({ title: p.title, description: p.excerpt, path: `/${p.slug}`, image: p.image, seo: p.seo });
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) notFound();

  if ("page" in r) {
    const p = r.page;
    return (
      <>
        <CmsPageView page={p} />
        <Breadcrumbs items={[[p.title, `/${p.slug}`]]} />
        <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: p.title, description: p.seo.description || p.excerpt, url: `${site.url}/${p.slug}`, dateModified: p.modified, isPartOf: { "@id": `${site.url}/#website` } }} />
      </>
    );
  }

  const s = r.service;
  const related = (await getProjects()).slice(0, 3);
  return (
    <>
      <ServiceTemplate s={s} related={related} />
      <Breadcrumbs items={[[s.name, `/${s.slug}`]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          serviceType: s.name,
          description: s.seo?.description || s.heroText,
          url: `${site.url}/${s.slug}`,
          ...(s.image && { image: s.image }),
          provider: { "@id": `${site.url}/#organization` },
          areaServed: ["Australia", "United States", "United Kingdom", "Europe"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${s.name} packages`,
            itemListElement: s.packages
              .filter((pk) => /\d/.test(pk.price))
              .map((pk) => ({
                "@type": "Offer",
                name: pk.name,
                description: pk.timeline,
                priceSpecification: { "@type": "PriceSpecification", minPrice: Number(pk.price.replace(/[^0-9.]/g, "")), priceCurrency: "USD" },
              })),
          },
        }}
      />
      {s.faqs.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />}
    </>
  );
}
