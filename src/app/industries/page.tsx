import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { PageHero } from "@/components/pages/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getIndustries } from "@/lib/cms";

export const revalidate = 300;
export const metadata: Metadata = { title: "HubSpot by Industry", description: "How Eonco Digital sets up HubSpot for professional services, healthcare, ecommerce, construction, SaaS and education.", alternates: { canonical: "/industries" } };

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <PageHero centered eyebrow="Industries" title={<>HubSpot, Built for <span className="text-brand">Your Industry</span></>} text="Every industry sells, serves and reports differently. We configure HubSpot around the way yours works." />
      <section className="py-[80px]">
        <div className="container-narrow gutter grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={(i % 3) * 0.06}>
              <Link href={`/industries/${ind.slug}`} className="group flex h-full flex-col rounded-[20px] border-[0.8px] border-line bg-white p-7 transition-colors hover:border-brand/40">
                <span className="grid size-12 place-items-center rounded-[12px] bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon name={ind.icon} className="size-6" />
                </span>
                <h2 className="mt-6 font-display text-[24px] font-medium text-navy">{ind.name}</h2>
                <p className="mt-2 text-[15px] leading-[1.55] text-body">{ind.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-[14px] font-semibold text-brand">
                  Explore <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
