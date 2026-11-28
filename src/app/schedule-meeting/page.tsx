import type { Metadata } from "next";
import { CalendarCheck, Check, Clock, Mail, Video } from "lucide-react";
import { MeetingsEmbed } from "@/components/pages/MeetingsEmbed";
import { PageHero } from "@/components/pages/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Schedule a Meeting", description: "Book a HubSpot strategy call with Take Solution Today. Pick a 15, 30 or 60 minute slot that suits you.", alternates: { canonical: "/schedule-meeting" } };

const facts = [
  { icon: Clock, text: "15, 30 or 60 minutes, you choose" },
  { icon: Video, text: "Online meeting, details sent by email" },
  { icon: CalendarCheck, text: "Times shown in your own time zone" },
];

const agenda = ["Where your HubSpot setup is today", "What is slowing your team down", "The next three moves for your system", "Rough timeline and investment, if it is a fit"];

export default function SchedulePage() {
  return (
    <>
      <PageHero centered eyebrow="Book a call" title={<>Book a <span className="text-brand">Strategy Call</span></>} text="Pick a time that suits you. You will talk directly with a HubSpot consultant, not a sales rep." />
      <section className="pb-[100px] pt-[40px]">
        <div className="container-x gutter grid items-start gap-6 lg:grid-cols-[340px_1fr]">
          {/* What to expect */}
          {/* On phones the calendar comes first (order-*), the details follow */}
          <aside className="order-2 rounded-[20px] bg-navy p-7 text-white lg:order-1 lg:sticky lg:top-[112px]">
            <span aria-hidden className="flex gap-[4px]">
              <span className="h-[4px] w-6 rounded-full bg-brand" />
              <span className="h-[4px] w-4 rounded-full bg-brand/60" />
              <span className="h-[4px] w-6 rounded-full bg-brand/30" />
            </span>
            <h2 className="mt-5 font-display text-[26px] font-medium leading-[1.15]">HubSpot strategy call</h2>
            <ul className="mt-5 space-y-3">
              {facts.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-[15px] text-white/80">
                  <f.icon className="size-[18px] shrink-0 text-brand" strokeWidth={1.75} />
                  {f.text}
                </li>
              ))}
            </ul>
            <p className="mt-7 border-t border-white/10 pt-6 text-[14px] font-medium text-white">What we will cover</p>
            <ul className="mt-3 space-y-2.5">
              {agenda.map((a) => (
                <li key={a} className="flex gap-3 text-[14px] leading-[1.5] text-white/75">
                  <span className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <a href={`mailto:${site.email}`} className="mt-7 inline-flex items-center gap-2 text-[14px] text-white/70 transition-colors hover:text-white">
              <Mail className="size-4" strokeWidth={1.75} />
              Prefer email? {site.email}
            </a>
          </aside>

          {/* HubSpot calendar in the brand frame */}
          <div className="order-1 overflow-hidden rounded-[20px] border border-line bg-white shadow-soft lg:order-2">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="font-heading text-[16px] font-medium text-navy">Choose a time</p>
              <p className="flex items-center gap-2 text-[13px] text-muted">
                <span className="size-[6px] rounded-full bg-[#1f9d6b]" />
                Live availability
              </p>
            </div>
            <MeetingsEmbed url={site.meetingsUrl} title="Book a meeting with Take Solution Today" />
          </div>
        </div>
      </section>
    </>
  );
}
