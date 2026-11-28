import Link from "next/link";
import { ArrowUpRight, Award, BadgeCheck, Download, Mail, MapPin, Phone, ShieldCheck, Users } from "lucide-react";
import { footerColumns as defaultColumns, type FooterColumn } from "@/content/navigation";
import { site } from "@/content/site";
import type { SiteSettings } from "@/lib/wordpress";
import { Logo } from "../visuals/Logo";

const tiles = [
  { icon: BadgeCheck, title: "HubSpot", sub: "Specialists" },
  { icon: Award, title: "Certified", sub: "Consultants" },
  { icon: ShieldCheck, title: "Data", sub: "Privacy first" },
  { icon: Users, title: "Dedicated", sub: "Delivery team" },
];

export function Footer({ settings, columns: footerColumns = defaultColumns }: { settings: SiteSettings; columns?: FooterColumn[] }) {
  const year = new Date().getFullYear();
  // Offices still holding [placeholder] text are hidden until real details are added.
  const offices = settings.offices.filter((o) => ![o.region, o.phone, ...o.lines].some((l) => l.includes("[")));
  return (
    <footer className="bg-cream-2 px-3 pb-3 pt-3 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-[1425px] rounded-[26px] bg-white px-5 py-10 sm:px-6">
        {/* Brand + badge tiles */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="max-w-[560px]">
            <Logo />
            <p className="mt-6 text-[17px] leading-[1.55] text-body">
              HubSpot specialists delivering implementation, RevOps, integrations, UI/UX and web development for growing teams.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {settings.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:border-brand hover:text-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 text-navy transition-colors hover:text-brand">
                <Mail className="size-4 text-subtle" strokeWidth={1.5} />
                {settings.email}
              </a>
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/[^+0-9]/g, "")}`} className="inline-flex items-center gap-2 text-navy transition-colors hover:text-brand">
                  <Phone className="size-4 text-subtle" strokeWidth={1.5} />
                  {settings.phone}
                </a>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {tiles.map((t) => (
              <div key={t.title} className="grid aspect-square w-full place-items-center rounded-[20px] bg-cloud p-4 text-center sm:w-[165px]">
                <div>
                  <t.icon className="mx-auto size-10 text-brand" strokeWidth={1.6} />
                  <p className="mt-3 font-heading text-[15px] font-medium text-navy">{t.title}</p>
                  <p className="text-[12px] text-muted">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-14 grid gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((col, i) => (
            <div key={col.title} className="px-2">
              <p className="font-heading text-[13px] font-medium text-brand">0{i + 1}</p>
              <h2 className="mt-1 text-[17px] font-medium text-navy">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group inline-flex items-center gap-1 text-[15px] text-body transition-colors hover:text-brand">
                      {l.label}
                      <ArrowUpRight className="size-[14px] -translate-x-1 opacity-0 transition-[transform,translate,scale,rotate,opacity] group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
              {"extra" in col && col.extra && (
                <div className="mt-6 rounded-[14px] bg-cloud p-4">
                  <p className="text-[14px] text-body">{col.extra.text}</p>
                  <Link href={col.extra.href} className="mt-1 inline-block text-[14px] font-medium text-navy underline underline-offset-2 hover:text-brand">
                    {col.extra.label}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Offices + reviews */}
        <div className="mt-14 rounded-[20px] border-[0.8px] border-line">
          {offices.length > 0 && (
          <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {offices.map((o) => (
              <div key={o.region} className="p-8">
                <h3 className="text-[19px] font-medium text-navy">{o.region}</h3>
                <p className="mt-4 flex gap-2 text-[15px] leading-[1.6] text-body">
                  <MapPin className="mt-1 size-4 shrink-0 text-brand" />
                  <span>
                    {o.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="mt-3 flex items-center gap-2 text-[15px] font-medium text-navy">
                  <Phone className="size-4 text-brand" />
                  {o.phone}
                </p>
              </div>
            ))}
          </div>
          )}
          <div className={`grid gap-6 p-8 ${offices.length ? "border-t border-line" : ""} lg:grid-cols-[1fr_auto] lg:items-center`}>
            <div>
              <h3 className="text-[19px] font-medium text-navy">Reviewed by our clients</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {site.reviewPlatforms.map((r) => (
                  <a
                    key={r.name}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-[14px] bg-cloud px-4 py-3 transition-colors hover:bg-brand-50"
                  >
                    <span className="font-heading text-[15px] font-medium text-navy">{r.name}</span>
                    <span className="ml-auto text-[12px] text-muted">{r.note}</span>
                  </a>
                ))}
              </div>
            </div>
            <a href="/take-solution-today-company-deck.pdf" download className="flex items-center gap-4 rounded-[14px] bg-navy p-5 text-white transition-colors hover:bg-navy-2">
              <span className="grid size-11 place-items-center rounded-full bg-brand">
                <Download className="size-5" />
              </span>
              <span>
                <span className="block font-heading text-[16px] font-medium">Company Deck</span>
                <span className="text-[13px] text-white/60">PDF download</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 text-[13px] text-[#51606e] sm:flex-row">
          <p>© {year} Take Solution Today. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms-and-conditions" className="hover:text-brand">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-brand">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
