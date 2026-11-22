import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { ServicesStack } from "@/components/home/ServicesStack";
import { WebsiteShowcase } from "@/components/home/WebsiteShowcase";
import { Expertise } from "@/components/home/Expertise";
import { ServicesPricing } from "@/components/home/ServicesPricing";
import { FeaturedCases } from "@/components/home/FeaturedCases";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductsCarousel } from "@/components/home/ProductsCarousel";
import { WhyUs } from "@/components/home/WhyUs";
import { LogoWall } from "@/components/home/LogoWall";
import { HomeFaq } from "@/components/home/HomeFaq";
import { ConsultCta } from "@/components/home/ConsultCta";
import { getThemes } from "@/lib/cms";
import { getFeaturedProjects, getSiteSettings, getTestimonials } from "@/lib/wordpress";

const defaultTitle = "Eonco Digital | HubSpot Implementation, Integration & Website Agency";
const defaultDescription =
  "HubSpot agency for growing teams in Australia, the US, the UK and Europe. CRM implementation from $2,000, integrations, migrations, HubSpot websites and outbound, built and supported by one team.";

/** Title and description can be changed in WordPress → Settings → Eonco Company Details → Homepage. */
export async function generateMetadata(): Promise<Metadata> {
  const { home, seo } = await getSiteSettings();
  const title = home.title || defaultTitle;
  const description = home.description || defaultDescription;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/", ...(seo.image && { images: [seo.image] }) },
    twitter: { title, description, ...(seo.image && { images: [seo.image] }) },
  };
}

export const revalidate = 300;

export default async function Home() {
  const [cases, testimonials, settings, themes] = await Promise.all([getFeaturedProjects(), getTestimonials(), getSiteSettings(), getThemes()]);
  return (
    <>
      <Hero label={settings.partnerLabel} lines={settings.home.heroLines} text={settings.home.heroText} />
      <WhoWeAre figures={settings.stats} />
      <ServicesStack />
      <WebsiteShowcase />
      <Expertise />
      <ServicesPricing />
      <FeaturedCases cases={cases} />
      <Testimonials featured={testimonials.featured} list={testimonials.list} />
      <ProductsCarousel themes={themes} />
      <WhyUs cards={settings.why} />
      <LogoWall />
      <HomeFaq items={settings.home.faqs} />
      <ConsultCta />
    </>
  );
}
