import { NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * Contact and project inquiry endpoint.
 *
 * When the HubSpot portal (site.hubspot) and the relevant form GUID are set
 * (HUBSPOT_CONTACT_FORM_GUID / HUBSPOT_PROJECT_FORM_GUID, created by
 * `npm run hubspot:setup`), submissions are
 * forwarded to the HubSpot Forms API (no private token needed):
 *   https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
 * The HubSpot form must contain fields with matching internal names
 * (firstname, lastname, email, phone, company, website, message, plus any
 * custom properties such as service, budget, timeline).
 *
 * Without configuration the endpoint runs in demo mode: it validates the
 * payload, logs it on the server and returns success.
 */
const FIELDS = ["firstname", "lastname", "email", "phone", "company", "website", "service", "budget", "timeline", "message"] as const;

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body._hp) return NextResponse.json({ ok: true }); // bot
  const email = String(body.email || "").trim();
  if (!body.firstname || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !body.message) {
    return NextResponse.json({ error: "Please complete the required fields with a valid email address." }, { status: 422 });
  }

  const { portalId, region } = site.hubspot;
  const formGuid = body.kind === "project" ? process.env.HUBSPOT_PROJECT_FORM_GUID : process.env.HUBSPOT_CONTACT_FORM_GUID;

  if (!portalId || !formGuid) {
    console.info("[contact] demo mode submission", { kind: body.kind, email, service: body.service });
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const fields = FIELDS.filter((k) => body[k]).map((name) => ({ objectTypeId: "0-1", name, value: String(body[name]).slice(0, 5000) }));
  const hutk = req.headers.get("cookie")?.match(/hubspotutk=([^;]+)/)?.[1];
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
  // EU accounts submit to their own data centre; every other region uses the global host.
  const host = region === "eu1" ? "api-eu1.hsforms.com" : "api.hsforms.com";

  const res = await fetch(`https://${host}/submissions/v3/integration/submit/${portalId}/${formGuid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields,
      context: { pageUri: body.pageUri, pageName: body.pageName, ...(hutk ? { hutk } : {}), ...(ipAddress ? { ipAddress } : {}) },
      legalConsentOptions: body.consent
        ? { consent: { consentToProcess: true, text: "I agree to Take Solution Today storing my details to respond to this enquiry." } }
        : undefined,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[contact] HubSpot error", res.status, detail);
    return NextResponse.json({ error: "We could not send your message. Please email us directly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
