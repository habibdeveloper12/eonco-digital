import Image from "next/image";
import type { CmsPage } from "@/lib/cms";
import { ConsultCta } from "../home/ConsultCta";
import { PageHero } from "./PageHero";
import { RichContent } from "./RichContent";

/** A page written in WordPress → Pages: title, optional summary and featured image, then the editor content. */
export function CmsPageView({ page, updated, cta = true }: { page: CmsPage; updated?: boolean; cta?: boolean }) {
  const date = updated && page.modified ? new Date(page.modified).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <>
      <PageHero centered title={page.title} text={date ? `Last updated: ${date}` : page.excerpt || undefined} />
      {page.image && (
        <div className="mx-auto max-w-[980px] px-5 pt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[20px]">
            <Image src={page.image} alt={page.imageAlt ?? ""} fill priority sizes="(min-width: 1024px) 940px, 100vw" className="object-cover" />
          </div>
        </div>
      )}
      <article className="mx-auto max-w-[780px] px-5 py-14">
        <RichContent html={page.html} />
      </article>
      {cta && <ConsultCta />}
    </>
  );
}
