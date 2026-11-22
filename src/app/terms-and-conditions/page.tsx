import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms-and-conditions" } };

export default function Page() {
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
