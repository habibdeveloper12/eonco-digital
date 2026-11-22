import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ConsultCta } from "@/components/home/ConsultCta";
import { PageHero } from "@/components/pages/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { getPosts, type BlogPost } from "@/lib/wordpress";

export const metadata: Metadata = { title: "Blog", description: "Practical guides on HubSpot, RevOps, migrations and growth systems from Eonco Digital.", alternates: { canonical: "/blog" } };
export const revalidate = 300;

const fmt = (d: string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

/** Featured image when the post has one, otherwise a quiet branded cover. */
function Cover({ p, large }: { p: BlogPost; large?: boolean }) {
  if (p.image) {
    return <Image src={p.image} alt="" fill sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"} className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]" />;
  }
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8" style={{ background: p.palette[0] }}>
      <span aria-hidden className="flex flex-col gap-[6px]">
        <span className="h-[5px] w-10 rounded-full" style={{ background: p.palette[1] }} />
        <span className="h-[5px] w-7 rounded-full opacity-60" style={{ background: p.palette[1] }} />
        <span className="h-[5px] w-10 rounded-full opacity-30" style={{ background: p.palette[1] }} />
      </span>
      <span className={large ? "font-display text-[40px] font-medium leading-[1.05]" : "font-display text-[24px] font-medium leading-[1.1]"} style={{ color: p.palette[2] }}>
        {p.category}
      </span>
    </div>
  );
}

export default async function BlogPage() {
  const posts = await getPosts();
  const [first, ...rest] = posts;
  return (
    <>
      <PageHero centered eyebrow="Resources" title={<>Insights on <span className="text-brand">HubSpot &amp; Growth</span></>} text="Practical, opinionated guides from the team that builds HubSpot systems every week." />
      <section className="py-[80px]">
        <div className="container-narrow gutter">
          {!first && <p className="py-12 text-center text-[17px] text-body">The first articles are on their way. Check back soon.</p>}
          {first && (
            <Reveal>
              <Link href={`/blog/${first.slug}`} className="group grid overflow-hidden rounded-[24px] border border-line bg-white md:grid-cols-2">
                <div className="relative min-h-[280px] overflow-hidden">
                  <Cover p={first} large />
                </div>
                <div className="flex flex-col justify-center p-8">
                  <p className="text-[14px] text-muted">
                    {fmt(first.date)} · {first.readTime}
                  </p>
                  <h2 className="mt-3 font-display text-[30px] font-medium leading-[1.15] text-navy transition-colors group-hover:text-brand">{first.title}</h2>
                  <p className="mt-3 line-clamp-4 text-[16px] leading-[1.6] text-body">{first.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          )}
          <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[16px]">
                    <Cover p={p} />
                  </div>
                  <p className="mt-4 text-[14px] text-muted">
                    {fmt(p.date)} · {p.readTime}
                  </p>
                  <h3 className="mt-2 font-heading text-[20px] font-medium leading-[1.3] text-navy transition-colors group-hover:text-brand">{p.title}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <ConsultCta />
    </>
  );
}
