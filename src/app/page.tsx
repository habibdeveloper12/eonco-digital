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
import { getFeaturedProjects, getSiteSettings, getTestimonials } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: { absolute: "Eonco Digital | HubSpot Implementation, Integration & Website Agency" },
  description:
    "HubSpot agency for growing teams in Australia, the US, the UK and Europe. CRM implementation from $2,000, integrations, migrations, HubSpot websites and outbound, built and supported by one team.",
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function Home() {
  const [cases, testimonials, settings] = await Promise.all([getFeaturedProjects(), getTestimonials(), getSiteSettings()]);
  return (
    <>
      <Hero label={settings.partnerLabel} />
      <WhoWeAre figures={settings.stats} />
      <ServicesStack />
      <WebsiteShowcase />
      <Expertise />
      <ServicesPricing />
      <FeaturedCases cases={cases} />
      <Testimonials featured={testimonials.featured} list={testimonials.list} />
      <ProductsCarousel />
      <WhyUs cards={settings.why} />
      <LogoWall />
      <HomeFaq />
      <ConsultCta />
    </>
  );
}
