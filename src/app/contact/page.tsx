import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, FileText, Mail } from "lucide-react";
import { ContactForm } from "@/components/pages/ContactForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Contact Us", description: "Talk to Eonco Digital about HubSpot implementation, integrations, migrations or a new website.", alternates: { canonical: "/contact" } };

const promises = [
  "A reply from a consultant within one business day",
  "A 30-minute call led by a HubSpot consultant",
  "The next three moves for your system, mapped with you",
];

const routes = [
  { icon: CalendarDays, title: "Book a call", text: "Pick a 30-minute slot with a HubSpot consultant", cta: "See available times", href: "/schedule-meeting" },
  { icon: FileText, title: "Get a quote", text: "Share your scope, budget and timeline for a proposal", cta: "Start a project", href: "/start-a-project" },
  { icon: Mail, title: "Ask a question", text: "Not ready for a call yet? Email the team directly", cta: site.email, href: `mailto:${site.email}` },
];

export default function ContactPage() {
  return (
    <>
      {/* Split hero: pitch on the left, form card on the right */}
      <section className="bg-cloud pb-[80px] pt-[112px] lg:pb-[96px] lg:pt-[136px]">
        <div className="container-x gutter grid items-start gap-10 lg:grid-cols-[1fr_540px] lg:gap-16">
          <Reveal className="lg:sticky lg:top-[128px] lg:pt-6">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="h-display mt-4 text-[38px] leading-[1.06] text-navy sm:text-[52px]">
              Let&apos;s Talk About <span className="text-brand">Your Growth System</span>
            </h1>
            <p className="mt-5 max-w-[500px] text-[18px] leading-[1.55] text-body">
              Tell us where you are today, whether that is a new HubSpot portal, a stalled setup, an integration or a new website.
            </p>

            <p className="mt-10 text-[14px] font-medium text-navy">What happens next</p>
            <ul className="mt-4 space-y-3">
              {promises.map((p) => (
                <li key={p} className="flex gap-3 text-[16px] text-navy">
                  <span className="mt-[3px] grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 text-[15px]">
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-navy transition-colors hover:text-brand">
                <Mail className="size-4 text-subtle" strokeWidth={1.5} />
                {site.email}
              </a>
              <Link href="/schedule-meeting" className="inline-flex items-center gap-2 text-navy transition-colors hover:text-brand">
                <CalendarDays className="size-4 text-subtle" strokeWidth={1.5} />
                Book a call instead
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm
              heading={
                <>
                  <h2 className="font-display text-[28px] font-medium leading-[1.15] text-navy">Send us a message</h2>
                  <p className="mt-1 text-[15px] text-body">Fields marked * are required</p>
                </>
              }
              footer={
                <>
                  Looking to meet now?{" "}
                  <Link href="/schedule-meeting" className="font-medium text-navy underline underline-offset-4 hover:text-brand">
                    Schedule a meeting
                  </Link>
                </>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* Three ways to reach us */}
      <section className="py-[80px] lg:py-[96px]">
        <div className="container-x gutter">
          <Reveal className="max-w-[640px]">
            <h2 className="text-section-sm text-navy">
              Other Ways to <span className="text-brand">Reach Us</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {routes.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06} className="h-full">
                <Link
                  href={r.href}
                  className="group/r flex h-full flex-col rounded-[16px] border border-line bg-white p-6 transition-colors duration-300 hover:border-navy/20 hover:bg-cloud"
                >
                  <span className="grid size-10 place-items-center rounded-[10px] bg-cloud text-navy transition-colors group-hover/r:bg-white">
                    <r.icon className="size-[18px]" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-heading text-[20px] font-medium text-navy">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-body">{r.text}</p>
                  <span className="mt-auto flex items-center gap-2 pt-8 text-[15px] font-medium text-navy transition-colors group-hover/r:text-brand">
                    {r.cta}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover/r:translate-x-[2px]" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
