/**
 * One-time HubSpot setup for the website forms (safe to re-run).
 *
 *   npm run hubspot:setup
 *
 * Needs HUBSPOT_ACCESS_TOKEN in .env.local: a HubSpot Private App token with
 * scopes  forms, crm.schemas.contacts.read, crm.schemas.contacts.write
 * (HubSpot → Settings → Integrations → Private Apps → Create a private app).
 *
 * It will:
 *  1. Create the contact properties the website sends that HubSpot lacks:
 *     service (text), budget and timeline (choices, for CRM filters/reports).
 *  2. Create two forms, "Website: Contact" and "Website: Start a project",
 *     with fields matching the website (re-runs reuse forms with these names).
 *  3. Write HUBSPOT_CONTACT_FORM_GUID / HUBSPOT_PROJECT_FORM_GUID to .env.local.
 *
 * The website then posts every submission to HubSpot with the visitor's
 * tracking cookie, page and IP, so contacts arrive with full source history.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env.local");
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8").replace(/^﻿/, "") : "";
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]));
const token = process.env.HUBSPOT_ACCESS_TOKEN || env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  console.error("Add HUBSPOT_ACCESS_TOKEN=... to .env.local first (see the comment at the top of this file).");
  process.exit(1);
}

const BRAND = "#dc1f36";
const budgets = ["Under $5k", "$5k to $15k", "$15k to $40k", "$40k+", "Not sure yet"];
const timelines = ["As soon as possible", "Within 1 month", "1 to 3 months", "Just exploring"];

async function hs(method, url, body) {
  const res = await fetch(`https://api.hubapi.com${url}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok && res.status !== 404) {
    const hint = res.status === 401 ? " (token invalid)" : res.status === 403 ? " (token is missing a required scope)" : "";
    throw new Error(`${method} ${url} → ${res.status}${hint}\n${JSON.stringify(data, null, 2)}`);
  }
  return { status: res.status, data };
}

// ---------------------------------------------------------------- properties
const opts = (list) => list.map((v, i) => ({ label: v, value: v, displayOrder: i, hidden: false }));
const properties = [
  { name: "service", label: "Website: service of interest", type: "string", fieldType: "text", groupName: "contactinformation", description: "Service chosen on the website form." },
  { name: "budget", label: "Website: estimated budget", type: "enumeration", fieldType: "radio", groupName: "contactinformation", options: opts(budgets) },
  { name: "timeline", label: "Website: project timeline", type: "enumeration", fieldType: "radio", groupName: "contactinformation", options: opts(timelines) },
];

for (const p of properties) {
  const existing = await hs("GET", `/crm/v3/properties/contacts/${p.name}`);
  if (existing.status === 200) {
    console.log(`✓ property "${p.name}" already exists (${existing.data.type})`);
    continue;
  }
  await hs("POST", "/crm/v3/properties/contacts", p);
  console.log(`+ created property "${p.name}"`);
}

// --------------------------------------------------------------------- forms
const base = { objectTypeId: "0-1", hidden: false };
const text = (name, label, required = false, placeholder = "") => ({ ...base, name, label, required, placeholder, fieldType: "single_line_text" });
const radio = (name, label, list) => ({ ...base, name, label, required: false, fieldType: "radio", options: list.map((v, i) => ({ label: v, value: v, displayOrder: i, description: "" })) });
const group = (...fields) => ({ groupType: "default_group", richTextType: "text", fields });

const commonGroups = [
  group(text("firstname", "First name", true), text("lastname", "Last name", true)),
  group({ ...base, name: "email", label: "Work email", required: true, fieldType: "email", validation: { blockedEmailDomains: [], useDefaultBlockList: false } }, { ...base, name: "phone", label: "Phone", required: false, fieldType: "phone", useCountryCodeSelect: false, validation: { minAllowedDigits: 7, maxAllowedDigits: 20 } }),
  group(text("company", "Company", true), text("website", "Website")),
  group(text("service", "What do you need help with?", true)),
];
const message = (label) => group({ ...base, name: "message", label, required: true, fieldType: "multi_line_text" });

function formBody(name, groups, thanks) {
  return {
    name,
    formType: "hubspot",
    archived: false,
    createdAt: new Date().toISOString(), // required by the v3 Forms API
    fieldGroups: groups,
    configuration: {
      language: "en",
      cloneable: true,
      editable: true,
      archivable: true,
      recaptchaEnabled: false,
      notifyContactOwner: true,
      notifyRecipients: [],
      createNewContactForNewEmail: false,
      prePopulateKnownValues: true,
      allowLinkToResetKnownValues: false,
      lifecycleStages: [],
      postSubmitAction: { type: "thank_you", value: thanks },
    },
    displayOptions: {
      renderRawHtml: false,
      theme: "default_style",
      submitButtonText: "Send",
      style: { fontFamily: "arial, helvetica, sans-serif", backgroundWidth: "100%", labelTextColor: "#001729", labelTextSize: "14px", helpTextColor: "#40515e", helpTextSize: "12px", legalConsentTextColor: "#40515e", legalConsentTextSize: "13px", submitColor: BRAND, submitAlignment: "left", submitFontColor: "#ffffff", submitSize: "14px" },
    },
    legalConsentOptions: { type: "none" },
  };
}

const forms = [
  { env: "HUBSPOT_CONTACT_FORM_GUID", body: formBody("Website: Contact", [...commonGroups, message("Message")], "Thanks, we have your message. A consultant will reply within one business day.") },
  { env: "HUBSPOT_PROJECT_FORM_GUID", body: formBody("Website: Start a project", [...commonGroups, group(radio("budget", "Estimated budget", budgets)), group(radio("timeline", "Timeline", timelines)), message("Tell us about the project")], "Thanks, we have your project details. We will send a scoped proposal soon.") },
];

const existingForms = [];
for (let after; ; ) {
  const page = await hs("GET", `/marketing/v3/forms?limit=100${after ? `&after=${after}` : ""}`);
  existingForms.push(...(page.data.results ?? []));
  after = page.data.paging?.next?.after;
  if (!after) break;
}

const ids = {};
for (const f of forms) {
  const found = existingForms.find((x) => x.name === f.body.name && !x.archived);
  if (found) {
    ids[f.env] = found.id;
    console.log(`✓ form "${f.body.name}" already exists: ${found.id}`);
    continue;
  }
  const created = await hs("POST", "/marketing/v3/forms", f.body);
  ids[f.env] = created.data.id;
  console.log(`+ created form "${f.body.name}": ${created.data.id}`);
}

// ------------------------------------------------------------- save to .env
let out = envText;
for (const [k, v] of Object.entries(ids)) {
  out = new RegExp(`^${k}=.*$`, "m").test(out) ? out.replace(new RegExp(`^${k}=.*$`, "m"), `${k}=${v}`) : `${out.replace(/\s*$/, "")}\n${k}=${v}\n`;
}
fs.writeFileSync(envPath, out);
console.log(`\nSaved to .env.local:\n${Object.entries(ids).map(([k, v]) => `  ${k}=${v}`).join("\n")}`);
console.log("\nAdd the same two values in Vercel → Project → Settings → Environment Variables, then redeploy.");
