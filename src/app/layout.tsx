import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { JsonLd } from "@/components/seo/JsonLd";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { cabinet, figtree, sora } from "@/fonts";
import { getSiteSettings } from "@/lib/wordpress";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | HubSpot Implementation, Integration & Web Agency`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Business services",
  keywords: ["HubSpot agency", "HubSpot implementation", "HubSpot onboarding", "HubSpot integration", "HubSpot migration", "HubSpot CMS website", "RevOps", "CRM consultant"],
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description, url: site.url, locale: "en_AU" },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: "/favicon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#fdf7f5", width: "device-width", initialScale: 1 };

// Adds `motion` before first paint so scroll-animated content starts hidden.
// If the GSAP runtime has not started within 4s, show everything anyway.
const motionBoot = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},4000)}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
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
        <Header />
        <main id="main">{children}</main>
        <Footer settings={settings} />
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
