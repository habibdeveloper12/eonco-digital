import Script from "next/script";
import { site } from "@/content/site";
import { HubSpotPageViews } from "./HubSpotPageViews";

/**
 * Site-wide tracking (see .env.example).
 *
 * - HubSpot tracking code (site.hubspot): page views, the `hubspotutk` cookie
 *   that /api/contact forwards so form submissions are tied to the visitor's
 *   history, and HubSpot's cookie consent banner (configure it in HubSpot →
 *   Settings → Privacy & Consent for UK/EU visitors). Region-aware host:
 *   na1 → js.hs-scripts.com, others → js-{region}.hs-scripts.com.
 * - Google Analytics 4 (NEXT_PUBLIC_GA_ID).
 *
 * Each script is skipped when its ID is empty or invalid.
 */
export function Analytics() {
  const { portalId, region } = site.hubspot;
  const hsHost = !region || region === "na1" ? "js.hs-scripts.com" : `js-${region}.hs-scripts.com`;
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const validPortal = /^\d+$/.test(portalId);
  const validGa = gaId && /^G-[A-Z0-9]+$/i.test(gaId);

  return (
    <>
      {validPortal && (
        <>
          <Script id="hs-script-loader" src={`https://${hsHost}/${portalId}.js`} strategy="afterInteractive" />
          <HubSpotPageViews />
        </>
      )}
      {validGa && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
