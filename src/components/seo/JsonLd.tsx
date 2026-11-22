import { site } from "@/content/site";

/** Structured data for search engines and AI answer engines. `<` is escaped so content can never break out of the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** BreadcrumbList for inner pages: [["Case studies", "/case-studies"], ["Project", "/case-studies/x"]] */
export function Breadcrumbs({ items }: { items: [name: string, path: string][] }) {
  const all: [string, string][] = [["Home", "/"], ...items];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: all.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.url}${path === "/" ? "" : path}` })),
      }}
    />
  );
}
