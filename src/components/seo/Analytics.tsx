import Script from "next/script";

/**
 * Site-wide tracking, driven by environment variables (see .env.example).
 *
 * - HubSpot tracking code (HUBSPOT_PORTAL_ID): page views, the `hubspotutk`
 *   cookie that /api/contact forwards so form submissions are tied to the
 *   visitor's history, and HubSpot's cookie consent banner (configure it in
 *   HubSpot → Settings → Privacy & Consent for UK/EU visitors).
 * - Google Analytics 4 (NEXT_PUBLIC_GA_ID).
 *
 * Each script is skipped when its variable is empty.
 */
export function Analytics() {
  const portalId = process.env.HUBSPOT_PORTAL_ID?.trim();
  const hsHost = process.env.HUBSPOT_REGION?.trim() === "eu1" ? "js-eu1.hs-scripts.com" : "js.hs-scripts.com";
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const validPortal = portalId && /^\d+$/.test(portalId);
  const validGa = gaId && /^G-[A-Z0-9]+$/i.test(gaId);

  return (
    <>
      {validPortal && <Script id="hs-script-loader" src={`https://${hsHost}/${portalId}.js`} strategy="afterInteractive" />}
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
