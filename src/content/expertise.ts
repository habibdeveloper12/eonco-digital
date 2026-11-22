import { getService, services, type Service } from "./services";

/**
 * Homepage "Expertise" grid. Each practice groups real service pages, so
 * every link resolves to a route generated from content/services.ts.
 */
export const expertise = [
  {
    title: "HubSpot Implementation",
    icon: "Rocket",
    text: "Portals set up around how you sell, market and serve, with clean data and reporting your team trusts from launch day.",
    services: ["hubspot-onboarding", "hubspot-sales-hub-implementation", "hubspot-marketing-hub-implementation"],
  },
  {
    title: "Integrations & Migrations",
    icon: "Plug",
    text: "Connect HubSpot to your ERP, accounting and ecommerce tools, or move across from another CRM without losing a record.",
    services: ["hubspot-integration", "hubspot-migration", "hubspot-app-theme-development"],
  },
  {
    title: "Service & Support",
    icon: "LifeBuoy",
    text: "Help desks, SLAs and an on-call admin team that keeps your portal improving long after go-live.",
    services: ["hubspot-service-hub-implementation", "hubspot-admin-and-technical-support", "white-label-services"],
  },
  {
    title: "Websites",
    icon: "LayoutTemplate",
    text: "Fast, editable websites with forms, tracking and smart content wired straight into your CRM.",
    services: ["hubspot-website", "wordpress-development"],
  },
  {
    title: "Design & Product",
    icon: "PenTool",
    text: "Research-led interfaces and the portals, internal tools and platforms behind them, built to integrate from the start.",
    services: ["ui-ux-design", "full-stack-web-development"],
  },
  {
    title: "Outbound & AI",
    icon: "Send",
    text: "Outbound programs that book qualified meetings and AI agents that take repeatable work off your team.",
    services: ["cold-email-outbound", "ai-agent-development"],
  },
].map((g) => ({ ...g, items: g.services.map((slug) => getService(slug)!).filter(Boolean) }));

/** Services shown as tabs in the homepage "Services & Pricing" section. */
const pricingSlugs = [
  "hubspot-onboarding",
  "hubspot-integration",
  "hubspot-migration",
  "hubspot-website",
  "hubspot-admin-and-technical-support",
  "cold-email-outbound",
  "ui-ux-design",
];

export const pricingServices: Service[] = pricingSlugs.map((slug) => services.find((s) => s.slug === slug)!).filter(Boolean);

/** "$2,000+" -> { amount: "$2,000", per: "project" }, "$750/mo" -> { amount: "$750", per: "month" } */
export function formatPrice(price: string) {
  if (/custom/i.test(price)) return { amount: "Custom", per: "" };
  const monthly = /\/mo/i.test(price);
  return { amount: price.replace(/\/mo/i, "").replace("+", ""), per: monthly ? "month" : "project" };
}
