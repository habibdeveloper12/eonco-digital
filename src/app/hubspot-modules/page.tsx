import type { Metadata } from "next";
import { Blocks } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { PageHero } from "@/components/pages/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { modules } from "@/content/misc";

export const metadata: Metadata = { title: "HubSpot Modules", description: "Reusable HubSpot CMS modules that make content updates easy.", alternates: { canonical: "/hubspot-modules" } };

export default function ModulesPage() {
  return (
    <>
      <PageHero centered eyebrow="Products" title={<>HubSpot <span className="text-brand">Modules</span></>} text="Drop-in CMS modules your marketing team can edit without a developer." primary={{ label: "Request a module", href: "/contact" }} />
      <section className="py-[80px]">
        <div className="container-narrow gutter grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Reveal key={m} delay={(i % 3) * 0.05}>
              <div className="group flex items-center gap-4 rounded-[16px] border-[0.8px] border-line bg-white p-5 transition-colors hover:border-brand/40">
                <span className="grid size-11 place-items-center rounded-[10px] bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white">
                  <Blocks className="size-5" />
                </span>
                <span className="font-heading text-[17px] font-medium text-navy">{m}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
