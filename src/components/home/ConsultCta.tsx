import { CalendarDays, CheckCircle2, Clock, Video } from "lucide-react";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const slots = ["9:30 am", "11:00 am", "2:00 pm", "3:30 pm"];

function BookingVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="relative rounded-[22px] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-brand text-white">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <p className="font-heading text-[15px] font-semibold text-navy">HubSpot Strategy Call</p>
            <p className="flex items-center gap-3 text-[12px] text-muted">
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> 30 min
              </span>
              <span className="flex items-center gap-1">
                <Video className="size-3" /> Video call
              </span>
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-5 gap-2">
          {days.map((d, i) => (
            <div key={d} className={`rounded-[10px] py-2 text-center text-[12px] ${i === 2 ? "bg-brand text-white" : "bg-cloud text-navy"}`}>
              <p className="font-semibold">{d}</p>
              <p className="font-display text-[18px] font-medium">{12 + i}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {slots.map((s, i) => (
            <div key={s} className={`rounded-[10px] border py-2 text-center text-[13px] font-medium ${i === 1 ? "border-brand bg-brand-50 text-brand" : "border-line text-navy"}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[12px] bg-navy py-3 text-center text-[14px] font-medium text-white">Confirm booking</div>
      </div>
    </div>
  );
}

export function ConsultCta({ title = ["Ready to ", "Build the Engine", " Behind Your Growth?"] }: { title?: [string, string, string] }) {
  return (
    <section className="bg-cloud py-[54px]">
      <div className="container-narrow gutter">
        <div className="relative overflow-hidden rounded-[24px] bg-navy px-6 py-12 sm:px-[60px] lg:py-[92px]">
          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_440px]">
            <div>
              <Reveal>
                <Eyebrow tone="dark" dot={false} className="text-white">
                  Book consultation
                </Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 max-w-[440px] font-display text-[32px] font-medium leading-[1.08] text-white sm:text-[37.45px]">
                  {title[0]}
                  <span className="text-brand">{title[1]}</span>
                  {title[2]}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-[449px] text-[18px] leading-[1.45] text-white/90">
                  We build the systems underneath growth: CRM, websites, integrations and automation. Tell us where you are today and we will map the next three moves.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-10">
                <Button href="/schedule-meeting">Book a call</Button>
              </Reveal>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[16px] font-medium text-white">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand" /> Takes 30 minutes
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand" /> Led by a HubSpot consultant
                </span>
              </div>
            </div>
            <Reveal delay={0.2}>
              <BookingVisual />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
