import type { Metadata } from "next";
import { Compass, Handshake, LineChart, ShieldCheck } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { LogoWall } from "@/components/home/LogoWall";
import { WhyUs } from "@/components/home/WhyUs";
import { PageHero } from "@/components/pages/PageHero";
import { SectionHeader } from "@/components/pages/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/visuals/Logo";

export const metadata: Metadata = { title: "About Us", description: "Eonco Digital is a HubSpot-focused growth agency building CRM, websites, integrations and automation for growing teams.", alternates: { canonical: "/about" } };

const values = [
  { icon: Compass, title: "Process before platform", text: "We map how your business works before we configure anything." },
  { icon: LineChart, title: "Outcomes over output", text: "We measure adoption and revenue impact, not hours logged." },
  { icon: ShieldCheck, title: "Built to be owned", text: "Documentation, naming conventions and training so your team can run it." },
  { icon: Handshake, title: "One accountable team", text: "Strategy, build and support from the same people, start to finish." },
];

const journey = [
  { name: "Strategy", text: "Workshops and a written blueprint" },
  { name: "Build", text: "Configured, integrated and documented" },
  { name: "Launch", text: "Role-based training and go-live" },
  { name: "Support", text: "Reviews and continuous improvement" },
];

/** About hero visual: the logo's stage bars expanded into how an engagement runs. */
function AboutVisual() {
  return (
    <div className="rounded-[20px] bg-navy p-6 text-white sm:p-8">
      <LogoMark className="size-12" />
      <ol className="mt-8 space-y-5">
        {journey.map((j, i) => (
          <li key={j.name} className="grid grid-cols-[88px_1fr] items-center gap-4">
            <div className="h-[6px] rounded-full bg-brand" style={{ width: `${40 + i * 20}%`, opacity: 0.45 + i * 0.18 }} />
            <div>
              <p className="font-heading text-[16px] font-medium">{j.name}</p>
              <p className="text-[14px] text-white/60">{j.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        tone="cream"
        eyebrow="About Eonco Digital"
        title={<>We Build the Systems <span className="text-brand">Growth Runs On</span></>}
        text="Eonco Digital is a HubSpot-focused growth agency. We combine CRM consulting, development and design to give growing teams one connected system for marketing, sales and service."
        primary={{ label: "Work with us", href: "/start-a-project" }}
        secondary={{ label: "Our case studies", href: "/case-studies" }}
        visual={<AboutVisual />}
      />
      <section className="py-[80px]">
        <div className="container-narrow gutter">
          <SectionHeader eyebrow="Our values" title="How We" accent="Work" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <article className="h-full rounded-[20px] border-[0.8px] border-line bg-cloud p-7">
                  <v.icon className="size-9 text-brand" strokeWidth={1.6} />
                  <h3 className="mt-6 font-display text-[22px] font-medium text-navy">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-body">{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-navy py-[80px] text-white">
        <div className="container-narrow gutter grid gap-10 lg:grid-cols-2">
          <SectionHeader dark align="left" eyebrow="Our story" title="Why We" accent="Started Eonco" />
          <Reveal className="space-y-4 text-[18px] leading-[1.65] text-white/80">
            <p>We kept meeting businesses that had invested in HubSpot but still ran on spreadsheets, inboxes and memory. The software was never the problem. The missing piece was a system designed around how the team actually worked.</p>
            <p>Eonco Digital exists to close that gap: consultants who understand revenue operations, developers who can build what the platform cannot do out of the box, and designers who make it all easy to use.</p>
            <p className="text-[14px] text-white/50">[Replace this story with your own founding story.]</p>
          </Reveal>
        </div>
      </section>
      <WhyUs />
      <LogoWall />
      <ConsultCta />
    </>
  );
}
