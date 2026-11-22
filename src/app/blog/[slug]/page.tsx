import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { site } from "@/content/site";
import { getPost, getPosts } from "@/lib/wordpress";

export const revalidate = 300;
// Posts published in WordPress render on first visit, no rebuild needed.
export const dynamicParams = true;
export const generateStaticParams = async () => (await getPosts()).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  return p
    ? { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.date, images: p.image ? [p.image] : undefined } }
    : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  return (
    <>
      <article>
        <header className="pb-12 pt-[128px]" style={{ background: p.image ? "var(--color-cloud)" : p.palette[0] }}>
          <div className="mx-auto max-w-[780px] px-5">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[14px] text-navy/70 transition-colors hover:text-brand">
              <ArrowLeft className="size-4" /> All articles
            </Link>
            <p className="mt-8 text-[14px] font-medium text-brand-600">{p.category}</p>
            <h1 className="h-display mt-3 text-[36px] leading-[1.1] text-navy sm:text-[48px]">{p.title}</h1>
            <p className="mt-4 text-[15px] text-body">
              {new Date(p.date).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })} · {p.readTime} · {site.name}
            </p>
          </div>
        </header>
        {p.image && (
          <div className="mx-auto -mt-2 max-w-[980px] px-5 pt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="aspect-[16/9] w-full rounded-[20px] object-cover" />
          </div>
        )}
        {p.html ? (
          // Content written by the team in the WordPress editor.
          <div className="prose-y mx-auto max-w-[780px] px-5 py-14" dangerouslySetInnerHTML={{ __html: p.html }} />
        ) : (
          <div className="prose-y mx-auto max-w-[780px] px-5 py-14">
            {p.body.map((b, i) =>
              b.h ? (
                <h2 key={i}>{b.h}</h2>
              ) : b.list ? (
                <ul key={i}>
                  {b.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              ) : (
                <p key={i}>{b.p}</p>
              ),
            )}
          </div>
        )}
      </article>
      <ConsultCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, datePublished: p.date, image: p.image, author: { "@type": "Organization", name: site.name } }) }}
      />
    </>
  );
}
