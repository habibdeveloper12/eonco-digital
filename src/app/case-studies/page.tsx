import type { Metadata } from "next";
import { ConsultCta } from "@/components/home/ConsultCta";
import { CaseFilter } from "@/components/pages/CaseFilter";
import { PageHero } from "@/components/pages/PageHero";
import { getIndustries } from "@/lib/cms";
import { getProjects } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "HubSpot implementations, integrations, migrations and websites delivered by Take Solution Today, with the results they produced.",
  alternates: { canonical: "/case-studies" },
};

export const revalidate = 300;

export default async function CaseStudiesPage() {
  const [cases, industries] = await Promise.all([getProjects(), getIndustries()]);
  return (
    <>
      <PageHero
        centered
        eyebrow="Case studies"
        title={
          <>
            HubSpot Projects <span className="text-brand">That Moved the Numbers</span>
          </>
        }
        text="Implementations, integrations, migrations and websites, each built around the way the client actually works."
      />
      <section className="py-[80px]">
        <div className="container-x gutter">
          <CaseFilter cases={cases} industries={industries.map(({ slug, name }) => ({ slug, name }))} />
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
