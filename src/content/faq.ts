import { services } from "./services";

const price = (slug: string) => services.find((s) => s.slug === slug)?.packages[0].price ?? "";

/**
 * Homepage FAQ, written answer-first so Google (featured snippets, AI Overviews)
 * and AI assistants (ChatGPT, Perplexity, Claude) can quote it directly.
 * Every figure comes from the service data in content/services.ts.
 */
export const homeFaqs = [
  {
    q: "What does Take Solution Today do?",
    a: "Take Solution Today is a HubSpot-focused growth agency. We design, build and run HubSpot systems for growing companies: CRM implementation and onboarding, integrations, migrations from other CRMs, HubSpot CMS websites, cold email outbound, UI/UX design and AI agents, delivered by one in-house team.",
  },
  {
    q: "How much does HubSpot implementation cost?",
    a: `HubSpot onboarding with Take Solution Today starts from ${price("hubspot-onboarding")} per project for the Starter package, ${services.find((s) => s.slug === "hubspot-onboarding")?.packages[1].price} for Professional, and Enterprise rollouts are scoped per project. Integrations start from ${price("hubspot-integration")}, ongoing admin support from ${price("hubspot-admin-and-technical-support")} and outbound programs from ${price("cold-email-outbound")}. Final pricing is confirmed after a discovery call.`,
  },
  {
    q: "How long does a HubSpot implementation take?",
    a: "A Starter HubSpot setup typically goes live in 2 to 3 weeks and a Professional build in 4 to 6 weeks. Larger multi-team or multi-hub rollouts are phased so value arrives early rather than at the end.",
  },
  {
    q: "Can you migrate our data from another CRM to HubSpot?",
    a: "Yes. We migrate from Salesforce, Zoho, Pipedrive, Microsoft Dynamics 365, helpdesk tools and website platforms. Contacts, companies, deals, tickets, activities, attachments and workflows are mapped and validated field by field before switch-over.",
  },
  {
    q: "Do you work with an existing HubSpot portal?",
    a: "Yes. We audit what is already there first, keep what works and fix what does not, so you keep your history and reporting. Many projects start as a stalled or DIY setup that never reached full adoption.",
  },
  {
    q: "Which countries do you work with?",
    a: "We work with growing companies in Australia, the United States, the United Kingdom and Europe.",
  },
  {
    q: "What happens after go-live?",
    a: "Every package includes role-based training and a support window after launch. After that you can move to a monthly admin and optimisation retainer, with a named consultant and scheduled reviews.",
  },
];
