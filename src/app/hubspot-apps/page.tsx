import type { Metadata } from "next";
import { AppWindow } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { PageHero } from "@/components/pages/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { apps } from "@/content/misc";

export const metadata: Metadata = { title: "HubSpot Apps", description: "HubSpot apps that extend the CRM beyond its out-of-the-box features.", alternates: { canonical: "/hubspot-apps" } };

export default function AppsPage() {
  return (
    <>
      <PageHero centered eyebrow="Products" title={<>HubSpot <span className="text-brand">Apps</span></>} text="Small, focused apps that fix the everyday gaps in HubSpot." primary={{ label: "Build your own app", href: "/hubspot-app-theme-development" }} />
      <section className="py-[80px]">
        <div className="container-narrow gutter grid gap-5 md:grid-cols-3">
          {apps.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.08}>
              <article className="h-full rounded-[20px] bg-navy p-8 text-white">
                <AppWindow className="size-10 text-brand" />
                <h2 className="mt-6 font-display text-[24px] font-medium">{a.name}</h2>
                <p className="mt-2 text-white/75">{a.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
