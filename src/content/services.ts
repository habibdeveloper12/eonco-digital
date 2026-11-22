export type ServiceGroup = "hubspot" | "digital";

export type Service = {
  slug: string;
  group: ServiceGroup;
  name: string;
  navLabel: string;
  icon: string; // lucide icon name, see components/ui/Icon.tsx
  blurb: string;
  heroTitle: string;
  heroText: string;
  ctaLabel: string;
  intro: { title: string; body: string[] };
  problems: { title: string; text: string }[];
  starting: { title: string; text: string }[];
  results: { title: string; text: string }[];
  types: { title: string; text: string }[];
  comparison: { rows: [string, string, string][] };
  process: { title: string; text: string }[];
  packages: { name: string; price: string; unit: string; timeline: string; items: { title: string; text: string }[] }[];
  faqs: { q: string; a: string }[];
};

type Seed = Pick<Service, "slug" | "group" | "name" | "navLabel" | "icon" | "blurb" | "heroTitle" | "heroText" | "ctaLabel"> & {
  focus: string; // short noun phrase used in shared copy
  types: Service["types"];
  process?: Service["process"];
  prices?: [string, string, string];
};

const sharedProcess = (focus: string): Service["process"] => [
  { title: "Discovery & Process Mapping", text: `We interview the people who will live in the system, map how work moves today and agree what ${focus} has to achieve in measurable terms.` },
  { title: "Solution Blueprint & Sign-off", text: "You get a written blueprint covering objects, properties, pipelines, automation and reporting, so nothing gets built on assumptions." },
  { title: "Build & Configuration", text: "We configure in a sandbox or staged rollout, documenting every decision so your team can maintain it after handover." },
  { title: "Data, Integrations & Automation", text: "Clean data comes across, connected tools sync both ways and repeatable work is automated with clear ownership and alerts." },
  { title: "Training & Go-Live", text: "Role-based training, recorded walkthroughs and a supported launch window so adoption does not stall in week two." },
  { title: "Optimise & Support", text: "After launch we review usage and reporting, fix friction and plan the next phase with you." },
];

function build(seed: Seed): Service {
  const { focus } = seed;
  const prices = seed.prices ?? ["$2,000+", "$4,500+", "Custom"];
  return {
    ...seed,
    intro: {
      title: `What is ${seed.name}?`,
      body: [
        `${seed.name} is the work of turning HubSpot and the tools around it into a system your team actually uses. It starts with how you sell, market and serve customers, not with the settings menu.`,
        `Done well, ${focus} gives leadership numbers they can trust, gives front-line teams fewer clicks and gives customers a faster, more consistent experience.`,
      ],
    },
    problems: [
      { title: "Nobody mapped the real process", text: "Systems get configured from a template, then teams work around them in spreadsheets and inboxes." },
      { title: "The tool bent the business", text: "Pipelines and properties reflect HubSpot defaults instead of how your deals and services actually run." },
      { title: "Reports nobody trusts", text: "Duplicate records, missing sources and inconsistent stages make every dashboard a debate." },
      { title: "Built for today only", text: "No naming conventions, documentation or governance, so the next change breaks something." },
    ],
    starting: [
      { title: "First-time HubSpot teams", text: "You have bought HubSpot and want it set up properly from day one." },
      { title: "Switching platforms", text: "You are moving from another CRM, CMS or helpdesk and need history to come across intact." },
      { title: "A stalled setup", text: "A DIY or previous partner build that never reached full adoption." },
      { title: "Scaling up", text: "New teams, regions or hubs need to be added without breaking what works." },
    ],
    results: [
      { title: "One source of truth", text: "Contacts, companies, deals and tickets live in one connected record." },
      { title: "Reporting people use", text: "Dashboards built around the decisions each team makes every week." },
      { title: "Lead journey, end to end", text: "From first touch to closed revenue with every hand-off automated." },
      { title: "Room to grow", text: "Documented architecture your team can extend with confidence." },
    ],
    types: seed.types,
    comparison: {
      rows: [
        ["Discovery", "Generic questionnaire", "Workshops with each team that uses the system"],
        ["Architecture", "Default objects and pipelines", "Custom data model mapped to your process"],
        ["Data", "Import whatever exists", "Cleaned, de-duplicated and validated before import"],
        ["Integrations", "Out-of-the-box connectors only", "Native, middleware or custom API, whichever fits"],
        ["Training", "Generic product videos", "Role-based sessions using your own records"],
        ["After launch", "Ticket queue", "Named consultant and scheduled optimisation reviews"],
      ],
    },
    process: seed.process ?? sharedProcess(focus),
    packages: [
      {
        name: "Starter",
        price: prices[0],
        unit: "/project",
        timeline: "Timeline: 2 to 3 weeks",
        items: [
          { title: "Kickoff, goals & portal audit", text: "A discovery call to agree goals, review your portal and confirm scope." },
          { title: "Core configuration", text: `Essential ${focus} setup covering the must-have objects, properties and pipelines.` },
          { title: "Starter dashboards", text: "A first set of dashboards so you can see activity and pipeline from launch." },
          { title: "Go-live support", text: "One training session and a two-week support window after launch." },
        ],
      },
      {
        name: "Professional",
        price: prices[1],
        unit: "/project",
        timeline: "Timeline: 4 to 6 weeks",
        items: [
          { title: "Everything in Starter", text: "All Starter deliverables, delivered with deeper discovery." },
          { title: "Process workshop & custom build", text: "Custom properties, pipelines and automation designed around your workflow." },
          { title: "Integrations & data", text: "Standard integrations connected and historical data migrated and validated." },
          { title: "Extended training", text: "Role-based training for each team plus recorded walkthroughs." },
        ],
      },
      {
        name: "Enterprise",
        price: prices[2],
        unit: "",
        timeline: "Timeline: scoped per project",
        items: [
          { title: "Multi-team, multi-hub rollout", text: "Phased rollout across hubs, brands, regions or business units." },
          { title: "Custom objects & APIs", text: "Custom objects, middleware and bespoke API work where native tools fall short." },
          { title: "Governance", text: "Permissions, naming conventions, documentation and change control." },
          { title: "Ongoing optimisation", text: "Quarterly reviews and a dedicated consultant after launch." },
        ],
      },
    ],
    faqs: [
      { q: `How long does ${focus} take?`, a: "Most Starter projects go live in two to three weeks. Larger rollouts are phased so value arrives early rather than at the end." },
      { q: "Do you work with our existing HubSpot portal?", a: "Yes. We audit what is there first, keep what works and fix what does not, so you do not lose history or reporting." },
      { q: "Will our team be trained?", a: "Every package includes training. We train by role using your own records, and leave recordings and documentation behind." },
      { q: "What happens after go-live?", a: "You get a support window as standard, then the option of a retainer for ongoing optimisation and admin support." },
      { q: "Can you work with other agencies or in-house developers?", a: "Yes. We regularly collaborate with in-house teams and other partners and can work white label." },
    ],
  };
}

export const services: Service[] = [
  build({
    slug: "hubspot-onboarding", group: "hubspot", name: "HubSpot Onboarding", navLabel: "HubSpot Onboarding", icon: "Rocket",
    blurb: "Go live on HubSpot in weeks with a setup built around how your team really works.",
    heroTitle: "HubSpot Onboarding Services: Live in 30 Days",
    heroText: "We configure HubSpot around your sales, marketing and service process, migrate your data and train your team, so you launch with a system people use from day one.",
    ctaLabel: "Start onboarding", focus: "HubSpot onboarding",
    types: [
      { title: "Marketing Hub Onboarding", text: "Forms, lists, email, campaigns, attribution and lead scoring." },
      { title: "Sales Hub Onboarding", text: "Pipelines, sequences, quotes, playbooks and forecasting." },
      { title: "Service Hub Onboarding", text: "Inbox, tickets, SLAs, knowledge base and feedback." },
      { title: "Content Hub Onboarding", text: "Theme setup, templates, blog and website migration." },
      { title: "Data Hub Onboarding", text: "Data sync, quality automation and datasets." },
      { title: "Commerce Hub Onboarding", text: "Payments, invoices, subscriptions and quotes." },
    ],
  }),
  build({
    slug: "hubspot-integration", group: "hubspot", name: "HubSpot Integration", navLabel: "HubSpot Integrations", icon: "Plug",
    blurb: "Connect HubSpot with the tools your team already uses for one source of truth.",
    heroTitle: "HubSpot Integration Services for a Connected Stack",
    heroText: "We connect HubSpot to your ERP, accounting, project management, EHR and ecommerce tools with native connectors, middleware or custom APIs, then monitor the sync so data stays clean.",
    ctaLabel: "Connect your systems", focus: "a HubSpot integration",
    types: [
      { title: "CRM & ERP", text: "Two-way sync of companies, orders, products and invoices." },
      { title: "Accounting & Billing", text: "Xero, QuickBooks, MYOB and Stripe payments into deals." },
      { title: "Project Management", text: "Closed-won deals create projects and tasks automatically." },
      { title: "Ecommerce", text: "Shopify and WooCommerce orders, carts and customers." },
      { title: "Communication", text: "SMS, WhatsApp, calling and meeting tools logged to records." },
      { title: "Custom API", text: "Bespoke middleware when no connector exists." },
    ],
  }),
  build({
    slug: "hubspot-migration", group: "hubspot", name: "HubSpot Migration", navLabel: "HubSpot Migrations", icon: "ArrowRightLeft",
    blurb: "Move to HubSpot safely with your data, assets and workflows intact.",
    heroTitle: "HubSpot Migration Without Losing a Record",
    heroText: "We migrate contacts, companies, deals, tickets, activities, attachments, workflows and content from your old platform, validated field by field before switch-over.",
    ctaLabel: "Plan your migration", focus: "a HubSpot migration",
    types: [
      { title: "Salesforce to HubSpot", text: "Objects, history and automation rebuilt natively." },
      { title: "Zoho to HubSpot", text: "Modules, notes and attachments mapped cleanly." },
      { title: "Pipedrive to HubSpot", text: "Deals, activities and pipelines carried across." },
      { title: "Dynamics 365 to HubSpot", text: "Enterprise data with relationships preserved." },
      { title: "Helpdesk to Service Hub", text: "Tickets, conversations and knowledge base." },
      { title: "Website to Content Hub", text: "Pages, blog, redirects and SEO preserved." },
    ],
  }),
  build({
    slug: "hubspot-website", group: "hubspot", name: "HubSpot Website Development", navLabel: "HubSpot Website", icon: "LayoutTemplate",
    blurb: "High-performance HubSpot websites that combine design, speed and CRM data.",
    heroTitle: "HubSpot Websites That Bring More Leads to Your CRM",
    heroText: "We design and build fast, editable HubSpot CMS websites with custom modules, smart content and forms wired straight into your CRM.",
    ctaLabel: "Build a better website", focus: "a HubSpot website",
    types: [
      { title: "Website Design", text: "Strategy, wireframes and UI built for conversion." },
      { title: "Custom Theme Development", text: "Drag-and-drop modules your team can edit safely." },
      { title: "Website Migration", text: "Move from WordPress, Webflow or Squarespace." },
      { title: "Membership Websites", text: "Gated content and member portals." },
      { title: "Landing Pages", text: "Campaign templates with A/B testing." },
      { title: "Website Care Plans", text: "Monthly improvements and support." },
    ],
  }),
  build({
    slug: "hubspot-marketing-hub-implementation", group: "hubspot", name: "Marketing Hub Implementation", navLabel: "HubSpot Marketing Hub Implementation", icon: "Megaphone",
    blurb: "Campaigns, lead scoring and attribution set up to prove marketing ROI.",
    heroTitle: "Marketing Hub Implementation That Proves ROI",
    heroText: "We set up forms, lifecycle stages, lead scoring, nurture workflows and attribution reporting so marketing can show exactly what it contributes to pipeline.",
    ctaLabel: "Implement Marketing Hub", focus: "Marketing Hub implementation",
    types: [
      { title: "Lifecycle & Lead Scoring", text: "Clear MQL and SQL definitions agreed with sales." },
      { title: "Email & Nurture", text: "Templates, sequences and behavioural workflows." },
      { title: "Campaign Tracking", text: "UTMs, campaigns and multi-touch attribution." },
      { title: "Ads & Social", text: "Ad accounts, audiences and social publishing." },
      { title: "Forms & Landing Pages", text: "Progressive profiling and smart CTAs." },
      { title: "Reporting", text: "Dashboards from first touch to revenue." },
    ],
  }),
  build({
    slug: "hubspot-service-hub-implementation", group: "hubspot", name: "Service Hub Implementation", navLabel: "HubSpot Service Hub Implementation", icon: "Headset",
    blurb: "Tickets, SLAs and a help centre that make customers stay.",
    heroTitle: "Service Hub Implementation for Faster, Happier Support",
    heroText: "We configure inboxes, ticket pipelines, SLAs, help desk automation, knowledge base and feedback surveys, so every customer issue is tracked and resolved on time.",
    ctaLabel: "Implement Service Hub", focus: "Service Hub implementation",
    types: [
      { title: "Help Desk & Inbox", text: "Email, chat, WhatsApp and forms in one workspace." },
      { title: "Ticket Pipelines & SLAs", text: "Routing, priorities and escalation rules." },
      { title: "Knowledge Base", text: "Searchable articles that deflect tickets." },
      { title: "Customer Portal", text: "Customers track their own requests." },
      { title: "Feedback Surveys", text: "NPS, CSAT and CES tied to records." },
      { title: "Service Reporting", text: "Response time, backlog and team load." },
    ],
  }),
  build({
    slug: "hubspot-sales-hub-implementation", group: "hubspot", name: "Sales Hub Implementation", navLabel: "HubSpot Sales Hub Implementation", icon: "TrendingUp",
    blurb: "Pipelines, sequences and forecasting your sales team will actually use.",
    heroTitle: "Sales Hub Implementation Built Around How You Sell",
    heroText: "We design deal pipelines, automate follow-up, configure quotes and forecasting, and give sales managers the visibility they need to coach and close.",
    ctaLabel: "Implement Sales Hub", focus: "Sales Hub implementation",
    types: [
      { title: "Pipeline Design", text: "Stages and required fields that match your sales motion." },
      { title: "Sequences & Playbooks", text: "Consistent outreach and discovery." },
      { title: "Quotes & CPQ", text: "Products, pricing and e-signature." },
      { title: "Forecasting", text: "Weighted forecasts managers can trust." },
      { title: "Sales Automation", text: "Task creation, rotation and hand-offs." },
      { title: "Sales Reporting", text: "Activity, conversion and velocity dashboards." },
    ],
  }),
  build({
    slug: "hubspot-app-theme-development", group: "hubspot", name: "HubSpot App & Theme Development", navLabel: "HubSpot App & Theme Development", icon: "Code2",
    blurb: "Custom HubSpot apps, CRM cards and themes when out-of-the-box is not enough.",
    heroTitle: "Custom HubSpot App & Theme Development",
    heroText: "We build public and private HubSpot apps, UI extensions, CRM cards, custom workflow actions and CMS themes using HubSpot's developer platform.",
    ctaLabel: "Scope your build", focus: "custom HubSpot development",
    types: [
      { title: "Private Apps", text: "Secure internal tools on HubSpot's APIs." },
      { title: "UI Extensions & CRM Cards", text: "Custom views inside HubSpot records." },
      { title: "Custom Workflow Actions", text: "Automation steps that call your systems." },
      { title: "Marketplace Apps", text: "Public apps built to HubSpot listing standards." },
      { title: "CMS Themes", text: "Reusable, editor-friendly website themes." },
      { title: "Serverless Functions", text: "Back-end logic without your own servers." },
    ],
  }),
  build({
    slug: "hubspot-admin-and-technical-support", group: "hubspot", name: "HubSpot Admin & Technical Support", navLabel: "HubSpot Admin & Technical Support", icon: "LifeBuoy",
    blurb: "An on-call HubSpot admin team for fixes, changes and continuous improvement.",
    heroTitle: "HubSpot Admin & Technical Support on Demand",
    heroText: "A dedicated team handles user management, workflow fixes, reporting requests, data clean-up and new feature rollouts, so your portal keeps improving month after month.",
    ctaLabel: "Get admin support", focus: "HubSpot admin support",
    prices: ["$750/mo", "$1,800/mo", "Custom"],
    types: [
      { title: "Portal Health Checks", text: "Quarterly audits with prioritised fixes." },
      { title: "Workflow & Automation Fixes", text: "Broken or conflicting automation resolved." },
      { title: "Reporting Requests", text: "New reports and dashboards on request." },
      { title: "Data Hygiene", text: "Duplicates, formatting and enrichment." },
      { title: "User Management", text: "Seats, permissions and teams." },
      { title: "Feature Rollouts", text: "New HubSpot features tested and launched." },
    ],
  }),
  // Digital services
  build({
    slug: "ui-ux-design", group: "digital", name: "UI/UX Design", navLabel: "UI/UX Design", icon: "PenTool",
    blurb: "Intuitive digital experiences that reduce friction and guide users to act.",
    heroTitle: "UI/UX Design That Turns Visitors Into Customers",
    heroText: "Research-led product and website design: user flows, wireframes, interactive prototypes and design systems that developers can build exactly.",
    ctaLabel: "Design better experiences", focus: "UI/UX design",
    types: [
      { title: "UX Research", text: "Interviews, analytics review and journey mapping." },
      { title: "Wireframes & Flows", text: "Structure and logic before visual polish." },
      { title: "UI Design", text: "High-fidelity screens in Figma." },
      { title: "Prototyping", text: "Clickable prototypes for testing." },
      { title: "Design Systems", text: "Tokens and components that scale." },
      { title: "Usability Testing", text: "Real users, real tasks, clear fixes." },
    ],
  }),
  build({
    slug: "ai-agent-development", group: "digital", name: "AI Agent Development", navLabel: "AI Agent Development", icon: "Bot",
    blurb: "Custom AI agents that execute multi-step work inside your CRM and tools.",
    heroTitle: "AI Agent Development for Revenue Teams",
    heroText: "We design and build AI agents that research leads, summarise calls, triage tickets and update HubSpot records, with guardrails and human approval where it matters.",
    ctaLabel: "Explore AI agents", focus: "AI agent development",
    types: [
      { title: "Sales Research Agents", text: "Enrich and qualify leads before reps call." },
      { title: "Call & Meeting Agents", text: "Transcripts summarised into CRM activity." },
      { title: "Support Triage Agents", text: "Classify, route and draft replies." },
      { title: "Data Quality Agents", text: "Find and fix bad records continuously." },
      { title: "Chat & Voice Agents", text: "Qualify inbound conversations 24/7." },
      { title: "Workflow Orchestration", text: "n8n and custom pipelines with monitoring." },
    ],
  }),
  build({
    slug: "full-stack-web-development", group: "digital", name: "Full Stack Web Development", navLabel: "Full Stack Web Development", icon: "Layers",
    blurb: "Modern, scalable web apps and portals built to integrate with your CRM.",
    heroTitle: "Full Stack Web Development for Portals and Platforms",
    heroText: "Customer portals, internal tools and SaaS products built with Next.js, Node and modern cloud infrastructure, integrated with HubSpot from the start.",
    ctaLabel: "Start your build", focus: "full stack development",
    types: [
      { title: "Customer Portals", text: "Self-service portals connected to CRM data." },
      { title: "Internal Tools", text: "Dashboards and admin apps for operations." },
      { title: "SaaS Products", text: "MVP to scale with modern architecture." },
      { title: "API Development", text: "Secure, documented APIs and middleware." },
      { title: "Headless Websites", text: "Next.js front ends with a CMS back end." },
      { title: "DevOps & Hosting", text: "CI/CD, monitoring and cloud setup." },
    ],
  }),
  build({
    slug: "cold-email-outbound", group: "digital", name: "Cold Email Outbound", navLabel: "Cold Email Outbound", icon: "Send",
    blurb: "Targeted outbound campaigns with personalised messaging and proven deliverability.",
    heroTitle: "Cold Email Outbound That Books Qualified Meetings",
    heroText: "We build your list, set up sending infrastructure, write personalised sequences and route replies into HubSpot, so your team only talks to interested buyers.",
    ctaLabel: "Start more conversations", focus: "an outbound program",
    prices: ["$1,500/mo", "$3,000/mo", "Custom"],
    types: [
      { title: "ICP & List Building", text: "Verified contacts matched to your ideal customer." },
      { title: "Deliverability Setup", text: "Domains, warm-up and authentication." },
      { title: "Copywriting", text: "Personalised sequences tested for replies." },
      { title: "Campaign Management", text: "Daily sending, monitoring and iteration." },
      { title: "Reply Handling", text: "Positive replies routed to your calendar." },
      { title: "CRM Sync", text: "Every touch logged in HubSpot." },
    ],
  }),
  build({
    slug: "wordpress-development", group: "digital", name: "WordPress Development", navLabel: "WordPress Development", icon: "Globe",
    blurb: "Fast, secure WordPress and WooCommerce sites connected to HubSpot.",
    heroTitle: "WordPress Development Connected to Your CRM",
    heroText: "Custom WordPress themes, WooCommerce stores and performance rebuilds, with HubSpot forms, tracking and ecommerce data wired in properly.",
    ctaLabel: "Build on WordPress", focus: "WordPress development",
    types: [
      { title: "Custom Themes", text: "Block-based themes your team can edit." },
      { title: "WooCommerce", text: "Stores synced with HubSpot deals." },
      { title: "Performance Rebuilds", text: "Core Web Vitals fixed at the root." },
      { title: "Migrations", text: "Move hosts or platforms without SEO loss." },
      { title: "Security & Care", text: "Updates, backups and monitoring." },
      { title: "HubSpot Integration", text: "Forms, chat and tracking set up right." },
    ],
  }),
  build({
    slug: "white-label-services", group: "digital", name: "White Label Services", navLabel: "White Label Services", icon: "Handshake",
    blurb: "A trusted delivery partner working behind the scenes for agencies.",
    heroTitle: "White Label HubSpot & Web Delivery for Agencies",
    heroText: "Agencies use Eonco Digital as an extension of their team for HubSpot builds, integrations and websites, delivered under your brand with your processes.",
    ctaLabel: "Partner with us", focus: "white label delivery",
    types: [
      { title: "HubSpot Implementations", text: "Onboarding and hub builds for your clients." },
      { title: "Website Builds", text: "HubSpot CMS and WordPress development." },
      { title: "Integrations", text: "Custom API and middleware work." },
      { title: "Overflow Capacity", text: "Extra hands when your team is at capacity." },
      { title: "Technical Audits", text: "Portal and website audits under your brand." },
      { title: "Ongoing Support", text: "Retainer support for your client base." },
    ],
  }),
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const hubspotServices = services.filter((s) => s.group === "hubspot");
export const digitalServices = services.filter((s) => s.group === "digital");

/** The six services shown in the homepage stacked-card section. */
export const homeServices = [
  { slug: "hubspot-onboarding", title: "HubSpot Implementation", text: "Build HubSpot the right way from day one. We design your CRM, pipelines, automation and reporting around how your business operates.", cta: "Implement HubSpot", art: "hub" },
  { slug: "hubspot-integration", title: "HubSpot Integration", text: "Connect HubSpot with the tools your team already uses and create one source of truth across marketing, sales, service and operations.", cta: "Connect your systems", art: "plug" },
  { slug: "hubspot-migration", title: "HubSpot Migrations", text: "Move to HubSpot smoothly. We migrate your data, assets, workflows and history so day-to-day operations keep running.", cta: "Plan your migration", art: "migrate" },
  { slug: "hubspot-website", title: "HubSpot Websites", text: "High-performance websites that pair strong design and speed with a direct line into your HubSpot CRM.", cta: "Build a better website", art: "web" },
  { slug: "cold-email-outbound", title: "Cold Email Outbound", text: "Start qualified conversations with targeted outbound campaigns, personalised messaging and reliable deliverability.", cta: "Start more conversations", art: "mail" },
  { slug: "ui-ux-design", title: "UI/UX Design", text: "Design intuitive digital experiences that remove friction, improve usability and guide people toward meaningful action.", cta: "Design better experiences", art: "design" },
] as const;
