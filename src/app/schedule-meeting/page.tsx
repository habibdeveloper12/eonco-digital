import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { ContactForm } from "@/components/pages/ContactForm";
import { PageHero } from "@/components/pages/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Schedule a Meeting", description: "Book a 30 minute HubSpot consultation with Eonco Digital.", alternates: { canonical: "/schedule-meeting" } };

export default function SchedulePage() {
  const url = site.meetingsUrl;
  return (
    <>
      <PageHero centered eyebrow="Book a call" title={<>Book a 30 Minute <span className="text-brand">Strategy Call</span></>} text="Pick a time that suits you. You will talk directly with a HubSpot consultant, not a sales rep." />
      <section className="pb-[100px] pt-[40px]">
        <div className="container-narrow gutter">
          {url ? (
            <div className="overflow-hidden rounded-[20px] border-[0.8px] border-line bg-white shadow-soft">
              <iframe title="Book a meeting with Eonco Digital" src={`${url}${url.includes("?") ? "&" : "?"}embed=true`} className="h-[760px] w-full" loading="lazy" />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
              <div className="rounded-[20px] bg-navy p-7 text-white">
                <CalendarClock className="size-10 text-brand" />
                <p className="mt-5 font-display text-[24px] font-medium">Request a time</p>
                <p className="mt-2 text-white/75">Online booking is being connected. Send your preferred times and we will confirm by email within one business day.</p>
              </div>
              <ContactForm />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
