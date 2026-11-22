import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default function Page() {
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
        <p>You can ask to access, correct or delete your personal information at any time by emailing hello@eoncodigital.com.</p>
      </section>
    </>
  );
}
