import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ConsultCta } from "@/components/home/ConsultCta";
import { site } from "@/content/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { RichContent } from "@/components/pages/RichContent";
import { pageMetadata } from "@/lib/seo";
import { getPost, getPosts } from "@/lib/wordpress";

export const revalidate = 300;
// Posts published in WordPress render on first visit, no rebuild needed.
export const dynamicParams = true;
export const generateStaticParams = async () => (await getPosts()).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  return p ? pageMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, image: p.image, seo: p.seo, type: "article", publishedTime: p.date, modifiedTime: p.modified }) : {};
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
          <div className="mx-auto max-w-[980px] px-5 pt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px]">
              <Image src={p.image} alt={p.imageAlt ?? ""} fill priority sizes="(min-width: 1024px) 940px, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        {p.html ? (
          // Content written by the team in the WordPress editor.
          <RichContent html={p.html} className="mx-auto max-w-[780px] px-5 py-14" />
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
      <Breadcrumbs items={[["Blog", "/blog"], [p.title, `/blog/${p.slug}`]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.seo?.description || p.excerpt,
          datePublished: p.date,
          dateModified: p.modified ?? p.date,
          ...(p.image && { image: p.image }),
          articleSection: p.category,
          mainEntityOfPage: `${site.url}/blog/${p.slug}`,
          author: { "@id": `${site.url}/#organization` },
          publisher: { "@id": `${site.url}/#organization` },
          inLanguage: "en-AU",
        }}
      />
    </>
  );
}
