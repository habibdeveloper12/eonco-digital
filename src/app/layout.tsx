import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { Analytics } from "@/components/seo/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFooterColumns, buildNavigation } from "@/content/navigation";
import { site } from "@/content/site";
import { cabinet, figtree, sora } from "@/fonts";
import { getIndustries, getServices, getStandalonePages, getThemes } from "@/lib/cms";
import { buildSearchIndex } from "@/lib/searchIndex";
import { getPosts, getProjects, getSiteSettings } from "@/lib/wordpress";

/** Site-wide defaults. The default title, description and share image can be set in WordPress → Settings → Eonco Company Details. */
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  const title = seo.title || `${site.name} | HubSpot Implementation, Integration & Web Agency`;
  const description = seo.description || site.description;
  return {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Business services",
  keywords: ["HubSpot agency", "HubSpot implementation", "HubSpot onboarding", "HubSpot integration", "HubSpot migration", "HubSpot CMS website", "RevOps", "CRM consultant"],
  openGraph: { type: "website", siteName: site.name, title: site.name, description, url: site.url, locale: "en_AU", ...(seo.image && { images: [seo.image] }) },
  twitter: { card: "summary_large_image", title: site.name, description, ...(seo.image && { images: [seo.image] }) },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: "/favicon.svg" },
  formatDetection: { telephone: false },
  ...(process.env.GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }),
  };
}

export const viewport: Viewport = { themeColor: "#fdf7f5", width: "device-width", initialScale: 1 };

// Adds `motion` before first paint so scroll-animated content starts hidden.
// If the GSAP runtime has not started within 4s, show everything anyway.
const motionBoot = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},4000)}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, industries, themes, projects, posts, pages] = await Promise.all([
    getSiteSettings(), getServices(), getIndustries(), getThemes(), getProjects(), getPosts(), getStandalonePages(),
  ]);
  const navigation = buildNavigation({ services, industries, themes, projects, posts });
  const searchIndex = buildSearchIndex({ services, industries, themes, projects, posts, pages: pages.filter((p) => !p.seo.noindex) });
  const sameAs = settings.socials.map((s) => s.href).filter((h) => !/^https:\/\/www\.(linkedin|facebook|instagram)\.com\/?$/.test(h));

  return (
    <html lang="en-AU" className={`${figtree.variable} ${sora.variable} ${cabinet.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-white">
          Skip to content
        </a>
        <MotionRuntime />
        <Header navigation={navigation} searchIndex={searchIndex} />
        <main id="main">{children}</main>
        <Footer settings={settings} columns={buildFooterColumns(industries)} />
        <Analytics />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ProfessionalService",
                "@id": `${site.url}/#organization`,
                name: site.name,
                url: site.url,
                logo: `${site.url}/favicon.svg`,
                image: `${site.url}/opengraph-image`,
                email: settings.email,
                ...(settings.phone && { telephone: settings.phone }),
                description: site.description,
                slogan: "Growth runs on systems. We build them.",
                areaServed: ["Australia", "United States", "United Kingdom", "Europe"].map((name) => ({ "@type": "Place", name })),
                knowsAbout: ["HubSpot", "CRM implementation", "Revenue operations", "HubSpot CMS", "CRM migration", "Marketing automation", "API integration", "UI/UX design"],
                ...(sameAs.length && { sameAs }),
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "HubSpot and digital services",
                  itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: `${site.url}/${s.slug}` } })),
                },
                contactPoint: { "@type": "ContactPoint", contactType: "sales", email: settings.email, ...(settings.phone && { telephone: settings.phone }), availableLanguage: ["English"] },
              },
              {
                "@type": "WebSite",
                "@id": `${site.url}/#website`,
                url: site.url,
                name: site.name,
                publisher: { "@id": `${site.url}/#organization` },
                inLanguage: "en-AU",
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
