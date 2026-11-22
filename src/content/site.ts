/**
 * Global site settings for Eonco Digital.
 *
 * Anything wrapped in [square brackets] is a placeholder that must be
 * replaced with real business details before launch.
 */
export const site = {
  name: "Eonco Digital",
  shortName: "Eonco",
  // The live site is served on www (the bare domain redirects there), so
  // canonicals and the sitemap must use www too. No trailing slash.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.eoncodigital.com").replace(/\/+$/, ""),
  tagline: "HubSpot systems, websites and automation for growing teams",
  description:
    "Eonco Digital designs, builds and runs HubSpot systems for growing companies: CRM implementation, integrations, migrations, high-converting websites and outbound programs.",
  email: "hello@eoncodigital.com",
  meetingsUrl: process.env.NEXT_PUBLIC_HUBSPOT_MEETINGS_URL || "",
  // Partner tier: set this to your real HubSpot partner tier before launch.
  partnerLabel: "HubSpot Specialists",
  reviewSummary: { rating: 5, count: "[N]", platform: "HubSpot" },
  offices: [
    { region: "Head Office", lines: ["[Street address]", "[City, Postcode]"], phone: "[+00 000 000 000]" },
    { region: "Sales Office", lines: ["[Street address]", "[City, Postcode]"], phone: "[+00 000 000 000]" },
    { region: "Delivery Centre", lines: ["[Street address]", "[City, Postcode]"], phone: "[+00 000 000 000]" },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
  reviewPlatforms: [
    { name: "HubSpot", note: "Partner directory reviews", href: "https://ecosystem.hubspot.com/marketplace/solutions" },
    { name: "Clutch", note: "Verified client reviews", href: "https://clutch.co/" },
    { name: "Google", note: "Business profile reviews", href: "https://www.google.com/business/" },
  ],
} as const;

export type Site = typeof site;
