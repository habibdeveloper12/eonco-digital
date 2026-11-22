import { homeFaqs } from "@/content/faq";
import { Faq } from "../pages/Faq";
import { JsonLd } from "../seo/JsonLd";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { SplitText } from "../ui/SplitText";

/** Answer-first FAQ with FAQPage structured data (featured snippets and AI answers). */
export function HomeFaq() {
  return (
    <section className="bg-white py-[88px] lg:py-[104px]">
      <div className="container-x gutter grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
          </Reveal>
          <SplitText className="text-section-sm mt-4 text-navy" lines={[{ text: "Questions Teams Ask" }, { text: "Before They Start", accent: true }]} />
          <Reveal delay={0.1}>
            <p className="mt-5 text-[17px] leading-[1.55] text-body">Straight answers on cost, timelines and how we work. Anything else, ask us on a call.</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Faq items={homeFaqs} />
        </Reveal>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </section>
  );
}
