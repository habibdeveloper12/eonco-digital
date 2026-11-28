import type { IndustrySlug } from "./caseStudies";

/**
 * SAMPLE TESTIMONIALS
 * Placeholder quotes that show the layout only. Replace with real,
 * permission-granted client reviews before launch.
 */
export const testimonials = [
  { quote: "They mapped how our team actually works before touching HubSpot. Six weeks later we had pipelines people use and a forecast leadership trusts.", name: "[Client name]", role: "Head of Sales, Professional Services" },
  { quote: "The migration was the part we dreaded most. Every record, note and attachment came across, and our team barely noticed the switch.", name: "[Client name]", role: "Operations Manager, Distribution" },
  { quote: "Our new website is faster, easier to edit and every enquiry now lands in the CRM with its source attached. That alone changed our marketing meetings.", name: "[Client name]", role: "Marketing Lead, Construction" },
  { quote: "They built an integration other partners told us was impossible, documented it properly and trained our team to look after it.", name: "[Client name]", role: "Founder, Health Technology" },
  { quote: "Responsive, clear and calm under deadlines. The team feels like part of our team rather than an outside agency.", name: "[Client name]", role: "Managing Director, Education" },
  { quote: "The outbound program booked more qualified meetings in a quarter than we managed in the whole previous year.", name: "[Client name]", role: "CEO, B2B SaaS" },
];

export const featuredTestimonial = {
  quote: "They rebuilt our HubSpot from the ground up. We finally have one system for sales and service, and the team actually enjoys using it.",
  name: "[Client name]",
  role: "[Role], [Company]",
};

/** SAMPLE headline statistics. Replace with your real numbers. */
export const stats = {
  whoWeAre: [
    { label: "Pipeline Generated", value: 2.4, prefix: "$", suffix: "M", decimals: 1, note: [["↑", "accent"], [" Last ", "muted"], ["12 Months", "accent"]] },
    { label: "Businesses Grown", value: 40, suffix: "+", note: [["in ", "muted"], ["12 Months", "accent"], [" across healthcare, ecommerce, construction and services", "muted"]] },
    { label: "Manual Work Removed/year", value: 30, suffix: "K+", note: [["+50%", "accent"], [" through ", "muted"], ["1,000+", "accent"], [" automations built", "muted"]] },
    { label: "Client Satisfaction", value: 5, suffix: " / 5", note: [["across ", "muted"], ["[N]+", "accent"], [" reviews on Clutch, Google & HubSpot", "muted"]] },
  ] as { label: string; value: number; prefix?: string; suffix?: string; decimals?: number; note: [string, "accent" | "muted"][] }[],
  why: [
    { icon: "Workflow", value: 1000, suffix: "+", title: "Automations Built", text: "Across HubSpot, ERPs, EHRs, accounting tools and middleware such as n8n, Make and Zapier, each one documented and monitored." },
    { icon: "Award", value: 60, suffix: "+", title: "Professional Certifications", text: "Our team holds certifications across HubSpot hubs, CRM administration and development." },
    { icon: "Rocket", value: 120, suffix: "+", title: "HubSpot Implementations", text: "Onboarding, hub implementation, integration and migration from legacy CRMs." },
  ],
};

export const accreditations = [
  { label: "HubSpot Onboarding", icon: "Rocket" },
  { label: "Custom Integration", icon: "Plug" },
  { label: "Data Migration", icon: "Database" },
];

/** Client result tiles for the scrolling logo wall (SAMPLE). */
export const clientResults = [
  { name: "Retail Brand", size: "lg", value: "30%", label: "Sales boost via custom automation" },
  { name: "Clinic Group", size: "sm", value: "50%", label: "Email open rate" },
  { name: "Health Tech", size: "sm" },
  { name: "Training College", size: "sm" },
  { name: "Pool Services", size: "lg", value: "3X Sales Growth", label: "HubSpot integrations + marketing automation", text: "Manual sales processes replaced with a connected HubSpot system." },
  { name: "Logistics Co", size: "sm" },
  { name: "Life Sciences", size: "wide", text: "Lead generation increased with HubSpot automation and better routing." },
  { name: "Software Studio", size: "md" },
  { name: "Dev Agency", size: "sm" },
  { name: "SaaS Platform", size: "sm", value: "10%", label: "Customer lifetime value" },
  { name: "Home Builder", size: "sm" },
] as const;

export type Product = {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  frame: string;
  palette: [string, string, string];
  headline: string;
  features: string[];
  html?: string;
  image?: string;
  imageAlt?: string;
  /** Where the "Get theme" button goes, e.g. a HubSpot Marketplace listing. */
  buyUrl?: string;
  seo?: import("@/lib/wordpress").Seo;
  modified?: string;
};

/** SAMPLE products. Replace with your own themes and modules. */
export const themes: Product[] = [
  {
    slug: "atlas-theme", category: "B2B & Agency", name: "Atlas", tagline: "Atlas: The B2B Agency Theme",
    description: "A complete HubSpot CMS theme for agencies and consultancies, with case study templates, service pages, pricing tables and flexible drag-and-drop sections.",
    price: "$299", frame: "#4f4ad9", palette: ["#0f1222", "#8b85ff", "#ffffff"], headline: "Brand, build and grow",
    features: ["40+ drag-and-drop modules", "Case study and service templates", "Global colour and type settings", "Blog and listing templates"],
  },
  {
    slug: "halo-theme", category: "Aesthetic & Clinical", name: "Halo", tagline: "Halo: The Clinic & Wellness Theme",
    description: "A premium HubSpot CMS theme for clinics and wellness brands, with treatment pages, before-and-after galleries, practitioner profiles and booking-ready forms.",
    price: "$499", frame: "#fd3a84", palette: ["#fff4f7", "#e23d74", "#2a0f19"], headline: "Confidence, beautifully delivered",
    features: ["Treatment and practitioner templates", "Before and after gallery", "Booking-ready forms", "Accessible colour presets"],
  },
  {
    slug: "pulse-theme", category: "Fitness & Wellness", name: "Pulse", tagline: "Pulse: The Fitness Website Theme",
    description: "A high-energy HubSpot CMS theme for gyms, coaches and studios, with class timetables, membership pricing, trainer profiles and calculators.",
    price: "$250", frame: "#dafc00", palette: ["#0b0b0b", "#dafc00", "#ffffff"], headline: "Train harder. Live better.",
    features: ["Class timetable module", "Membership pricing tables", "Trainer profiles", "BMI and body fat calculators"],
  },
];

export const modules = [
  "Video Gallery Slider", "Filtered Portfolio Gallery", "Blog List Pro", "Hovering Info Cards",
  "Dynamic Pricing Plan", "Fade Flow Testimonials", "BMI Calculator", "Business Info Slider",
  "Blog Filter Card", "FAQ Grid Accordion", "Body Fat Calculator", "Sparkling Testimonial",
];

export const apps = [
  { name: "Phone Number Formatter", text: "Format HubSpot phone numbers to E.164 automatically." },
  { name: "Data Formatter", text: "Clean names, casing and fields across your CRM." },
  { name: "Build Your Own App", text: "Custom HubSpot apps scoped to your workflow." },
];

export const integrations = [
  "CRM", "EHR", "Analytics & Data", "Project Management", "Marketing Automation", "ERP",
  "Sales Enablement", "ABM", "Help Desk", "CPQ & Invoicing", "POS, Payments & Billing", "Automation & iPaaS",
  "Email & SMS", "Accounting & Bookkeeping", "Advertising & Paid Media",
];

export type Industry = {
  slug: IndustrySlug;
  name: string;
  icon: string;
  blurb: string;
  intro: string;
  needs: string[];
  html?: string;
  image?: string;
  imageAlt?: string;
  seo?: import("@/lib/wordpress").Seo;
  modified?: string;
};

export const industries: Industry[] = [
  { slug: "professional-services", name: "Professional Services", icon: "Briefcase", blurb: "Helping service businesses build trust and generate more qualified leads.", intro: "Consultancies, agencies, accounting and legal firms use HubSpot to manage long sales cycles, referrals and recurring engagements.", needs: ["Referral and partner tracking", "Proposal and quote automation", "Client onboarding workflows", "Utilisation and pipeline reporting"] },
  { slug: "healthcare", name: "Healthcare", icon: "HeartPulse", blurb: "Digital experiences that inspire confidence in every patient interaction.", intro: "Clinics, allied health and health technology providers use HubSpot for enquiries, patient engagement and referrer relationships, with privacy built in.", needs: ["Multi-channel enquiry handling", "Appointment reminders and recalls", "EHR and practice management integration", "Referrer relationship management"] },
  { slug: "ecommerce", name: "Ecommerce", icon: "ShoppingBag", blurb: "Online shopping experiences that drive more repeat sales.", intro: "Direct-to-consumer and B2B ecommerce brands connect store data to HubSpot for lifecycle marketing and service.", needs: ["Shopify and WooCommerce sync", "Abandoned cart and win-back journeys", "Customer service on orders", "Revenue attribution by channel"] },
  { slug: "construction", name: "Construction & Trades", icon: "HardHat", blurb: "Systems that turn enquiries into signed contracts.", intro: "Builders, trades and building product companies use HubSpot to manage leads, quotes, display homes and long project timelines.", needs: ["Display home and showroom bookings", "Quote and contract pipelines", "Project hand-off to operations", "Supplier and trade integrations"] },
  { slug: "saas", name: "SaaS", icon: "Cloud", blurb: "Helping SaaS companies turn visitors into loyal customers.", intro: "SaaS teams connect product usage to HubSpot for product-led growth, expansion and churn prevention.", needs: ["Product event tracking", "Trial and PQL scoring", "Expansion and renewal pipelines", "Revenue attribution"] },
  { slug: "education", name: "Education & Training", icon: "GraduationCap", blurb: "From course enquiry to enrolment, without the spreadsheets.", intro: "Colleges, RTOs and training providers use HubSpot to convert course enquiries and keep students engaged.", needs: ["Course-specific enquiry routing", "Enrolment pipelines", "Student management system integration", "Intake and course reporting"] },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);

export type Post = { slug: string; title: string; category: string; date: string; readTime: string; excerpt: string; palette: [string, string, string]; body: { h?: string; p?: string; list?: string[] }[] };

export const posts: Post[] = [
  {
    slug: "hubspot-onboarding-checklist", title: "The HubSpot Onboarding Checklist We Use on Every Project", category: "HubSpot Onboarding", date: "2026-10-28", readTime: "8 min read",
    excerpt: "The exact discovery questions, build order and go-live checks we use to launch HubSpot portals that teams actually adopt.",
    palette: ["#fff1f2", "#dc1f36", "#001729"],
    body: [
      { p: "Most HubSpot onboarding problems are decided before anyone opens the settings menu. This checklist is the order we work in, and why." },
      { h: "1. Map the process before the portal" },
      { p: "Interview each team that will touch the system. Document how a lead becomes a customer today, where hand-offs happen and which reports leadership actually reads." },
      { h: "2. Agree definitions" },
      { list: ["What counts as a marketing qualified lead", "When a deal is created", "Which fields are required at each stage", "Who owns each record type"] },
      { h: "3. Build in the right order" },
      { p: "Properties and objects first, then pipelines, then automation, then reporting. Reporting built on an unstable data model will need rebuilding later." },
      { h: "4. Train by role" },
      { p: "Generic training creates generic adoption. Train each role using their own records and the three tasks they will do every day." },
    ],
  },
  {
    slug: "salesforce-vs-hubspot-migration-guide", title: "How to Migrate from Salesforce to HubSpot Without Losing Data", category: "Migrations", date: "2026-10-09", readTime: "11 min read",
    excerpt: "Object mapping, data cleaning, activity history and automation rebuilds: a practical guide to switching CRMs.",
    palette: ["#eef4fb", "#012c4c", "#001729"],
    body: [
      { p: "A CRM migration is a data project, a process project and a change management project at the same time." },
      { h: "Map objects and relationships" },
      { p: "List every standard and custom object, how they relate and which ones still matter. Many migrations are the right moment to retire unused objects." },
      { h: "Clean before you move" },
      { list: ["Merge duplicates", "Standardise picklists", "Archive records with no activity", "Validate required fields"] },
      { h: "Rebuild automation natively" },
      { p: "Do not port every workflow rule. Rebuild the ones that serve a current process using HubSpot workflows." },
    ],
  },
  {
    slug: "hubspot-reporting-that-leaders-use", title: "Building HubSpot Dashboards Leaders Actually Use", category: "Reporting", date: "2026-09-17", readTime: "6 min read",
    excerpt: "Start from decisions, not data. How we design reporting that survives the first board meeting.",
    palette: ["#f8f9fb", "#c81a2f", "#0d1a2b"],
    body: [
      { p: "Most dashboards fail because they answer questions nobody asked." },
      { h: "Start from weekly decisions" },
      { p: "Ask each leader which decisions they make every week and which number would change that decision." },
      { h: "One dashboard per meeting" },
      { p: "Tie each dashboard to a recurring meeting so it is reviewed, challenged and improved." },
    ],
  },
  {
    slug: "cold-email-deliverability-2026", title: "Cold Email Deliverability in 2026: What Still Works", category: "Outbound", date: "2026-08-30", readTime: "7 min read",
    excerpt: "Domain setup, warm-up, volume and copy. The fundamentals that keep outbound out of the spam folder.",
    palette: ["#fdf7f5", "#a31326", "#001729"],
    body: [
      { p: "Deliverability is infrastructure plus behaviour. Get both right and copy can do its job." },
      { h: "Separate sending domains" },
      { p: "Never send cold email from your primary domain. Use lookalike domains with full authentication." },
      { h: "Keep volume human" },
      { list: ["Warm up for at least two weeks", "Cap daily sends per inbox", "Monitor bounce and reply rates daily"] },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
