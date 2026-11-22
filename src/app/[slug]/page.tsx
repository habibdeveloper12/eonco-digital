import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceTemplate } from "@/components/pages/ServiceTemplate";
import { getService, services } from "@/content/services";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { getProjects } from "@/lib/wordpress";

export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.heroTitle,
    description: s.heroText,
    alternates: { canonical: `/${s.slug}` },
    openGraph: { title: s.heroTitle, description: s.heroText, url: `/${s.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
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
          description: s.heroText,
          url: `${site.url}/${s.slug}`,
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
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}
