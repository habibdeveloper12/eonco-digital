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
import { ConsultCta } from "@/components/home/ConsultCta";
import { getFeaturedProjects, getTestimonials } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: { absolute: "Eonco Digital | HubSpot Implementation, Integration & Website Agency" },
  description:
    "Eonco Digital builds HubSpot systems that drive growth: CRM implementation, integrations, migrations, HubSpot websites, cold email outbound and UI/UX design.",
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function Home() {
  const [cases, testimonials] = await Promise.all([getFeaturedProjects(), getTestimonials()]);
  return (
    <>
      <Hero />
      <WhoWeAre />
      <ServicesStack />
      <WebsiteShowcase />
      <Expertise />
      <ServicesPricing />
      <FeaturedCases cases={cases} />
      <Testimonials featured={testimonials.featured} list={testimonials.list} />
      <ProductsCarousel />
      <WhyUs />
      <LogoWall />
      <ConsultCta />
    </>
  );
}
