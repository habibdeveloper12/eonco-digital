import type { Metadata } from "next";
import { CmsPageView } from "@/components/pages/CmsPageView";
import { PageHero } from "@/components/pages/PageHero";
import { getPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
const SLUG = "terms-and-conditions";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPage(SLUG);
  return pageMetadata({ title: p?.title || "Terms & Conditions", description: p?.excerpt, path: `/${SLUG}`, seo: p?.seo });
}

/** Uses WordPress → Pages → "Terms and Conditions" (slug terms-and-conditions) when it is published. */
export default async function Page() {
  const p = await getPage(SLUG);
  if (p) return <CmsPageView page={p} updated cta={false} />;
  return (
    <>
      <PageHero centered title="Terms & Conditions" text="Last updated: [date]" />
      <section className="prose-y mx-auto max-w-[780px] px-5 py-14">
        <p>[Template only. Have this document reviewed by a qualified legal adviser before publishing.]</p>
        <h2>Use of this website</h2>
        <p>The content on this website is provided for general information only and may change without notice.</p>
        <h2>Services</h2>
        <p>Engagements are governed by a separate written agreement or statement of work.</p>
        <h2>Intellectual property</h2>
        <p>All content on this site is owned by Eonco Digital unless stated otherwise.</p>
      </section>
    </>
  );
}
