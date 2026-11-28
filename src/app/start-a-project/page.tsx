import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ContactForm } from "@/components/pages/ContactForm";
import { PageHero } from "@/components/pages/PageHero";
import { getServices } from "@/lib/cms";

export const metadata: Metadata = { title: "Start a Project", description: "Share your project details and get a scoped proposal from Take Solution Today.", alternates: { canonical: "/start-a-project" } };

const steps = ["We review your brief within one business day", "A 30 minute discovery call with a consultant", "A written scope, timeline and fixed quote"];

export default async function StartProjectPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const sp = await searchParams;
  const services = await getServices();
  const svc = sp.service ? services.find((s) => s.slug === sp.service) : undefined;
  return (
    <>
      <PageHero centered eyebrow="Start a project" title={<>Tell Us What <span className="text-brand">You&apos;re Building</span></>} text="The more context you share, the more useful our first conversation will be." />
      <section className="pb-[100px] pt-[40px]">
        <div className="container-narrow gutter grid gap-10 lg:grid-cols-[1fr_340px]">
          <ContactForm kind="project" defaultService={svc?.name} services={services.map(({ slug, name }) => ({ slug, name }))} />
          <aside className="rounded-[20px] bg-cloud p-7 lg:self-start">
            <p className="font-display text-[24px] font-medium text-navy">What happens next</p>
            <ol className="mt-6 space-y-5">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand font-heading text-[14px] text-white">{i + 1}</span>
                  <span className="pt-1 text-[15px] text-body">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 flex items-center gap-2 text-[14px] font-semibold text-navy">
              <CheckCircle2 className="size-4 text-brand" /> No obligation, no hard sell
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
