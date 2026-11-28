import type { Metadata } from "next";
import { CmsPageView } from "@/components/pages/CmsPageView";
import { PageHero } from "@/components/pages/PageHero";
import { getPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
const SLUG = "privacy-policy";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPage(SLUG);
  return pageMetadata({ title: p?.title || "Privacy Policy", description: p?.excerpt, path: `/${SLUG}`, seo: p?.seo });
}

/** Uses WordPress → Pages → "Privacy Policy" (slug privacy-policy) when it is published. */
export default async function Page() {
  const p = await getPage(SLUG);
  if (p) return <CmsPageView page={p} updated cta={false} />;
  return (
    <>
      <PageHero centered title="Privacy Policy" text="Last updated: [date]" />
      <section className="prose-y mx-auto max-w-[780px] px-5 py-14">
        <p>[Template only. Have this policy reviewed by a qualified legal adviser before publishing.]</p>
        <h2>What we collect</h2>
        <p>When you submit a form we collect your name, email address, phone number, company details and the message you send. We also use cookies and analytics to understand how the site is used.</p>
        <h2>How we use it</h2>
        <p>We use your details to respond to your enquiry, provide our services and, where you agree, send relevant updates. Form submissions are stored in our CRM (HubSpot).</p>
        <h2>Your rights</h2>
        <p>You can ask to access, correct or delete your personal information at any time by emailing hello@takesolutiontoday.com.</p>
      </section>
    </>
  );
}
