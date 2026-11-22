/**
 * SAMPLE CASE STUDIES
 * These are illustrative examples written to show the layout. Replace each
 * entry with a real, client-approved project (name, results, quote) before
 * launch. Do not publish sample figures as real results.
 */
export type CaseStudy = {
  slug: string;
  client: string; // short display name (big hover word)
  title: string;
  industry: IndustrySlug;
  tags: string[];
  summary: string;
  palette: [string, string, string]; // mockup colours: bg, accent, ink
  headline: string; // text shown inside the generated mockup
  kind: "crm" | "web";
  stats: { value: string; label: string }[];
  challenge: string[];
  solution: string[];
  outcome: string[];
  stack: string[];
};

/** Industry slugs. The built-in six are below; more can be added in WordPress → Industries. */
export type IndustrySlug = string;

export const caseStudies: CaseStudy[] = [
  {
    slug: "healthcare-patient-lifecycle",
    client: "Clinic Group",
    title: "Patient Lifecycle Automation for a Multi-Site Clinic Group",
    industry: "healthcare",
    tags: ["Healthcare", "Lifecycle Automation", "Service Hub"],
    summary: "Enquiry-to-appointment journeys rebuilt in HubSpot with automated reminders and recall campaigns.",
    palette: ["#0b2a3c", "#3dd6c6", "#ffffff"],
    headline: "Care that starts before the first visit",
    kind: "crm",
    stats: [
      { value: "38%", label: "Faster enquiry response" },
      { value: "2.1x", label: "Recall bookings" },
      { value: "12h", label: "Admin saved weekly" },
    ],
    challenge: [
      "Enquiries arrived through web forms, phone and social messages, and were tracked in three different places.",
      "Front desk teams had no visibility of where a patient was in their journey, so follow-ups were missed.",
    ],
    solution: [
      "Unified every channel into the HubSpot inbox with routing by clinic and service line.",
      "Designed a patient lifecycle with stage-based automation for reminders, pre-visit forms and recall campaigns.",
      "Built clinic-level dashboards so managers could see conversion and capacity at a glance.",
    ],
    outcome: [
      "Every enquiry is now owned and answered inside one workspace, with response time tracked per clinic.",
      "Recall campaigns run automatically, freeing front desk time for patients in the room.",
    ],
    stack: ["HubSpot Service Hub", "Marketing Hub", "WhatsApp", "Custom forms"],
  },
  {
    slug: "resort-guest-experience",
    client: "Resort",
    title: "End-to-End Guest Experience Automation for a Boutique Resort",
    industry: "professional-services",
    tags: ["Travel & Tourism", "Guest Journey", "Automation"],
    summary: "Booking, pre-arrival and post-stay communication automated from a single CRM.",
    palette: ["#f4ece1", "#c08a4a", "#2b2016"],
    headline: "Stay longer. Come back sooner.",
    kind: "crm",
    stats: [
      { value: "27%", label: "Repeat stays" },
      { value: "4.9", label: "Average review score" },
      { value: "90%", label: "Messages automated" },
    ],
    challenge: ["Guest communication relied on staff memory and manual emails, which broke down in peak season."],
    solution: [
      "Integrated the booking engine with HubSpot so every reservation created a contact and deal.",
      "Automated pre-arrival, in-stay and post-stay journeys with personalised offers.",
    ],
    outcome: ["Guests receive the right message at the right moment and staff focus on hospitality, not inboxes."],
    stack: ["HubSpot Marketing Hub", "Booking engine API", "Make"],
  },
  {
    slug: "ehr-two-way-sync",
    client: "Health Tech",
    title: "Two-Way EHR to HubSpot Integration",
    industry: "healthcare",
    tags: ["EHR Integration", "Two-Way Sync", "Compliance"],
    summary: "A secure middleware layer syncing patient and appointment data between an EHR and HubSpot.",
    palette: ["#071f33", "#4f8bff", "#ffffff"],
    headline: "Connected care data, safely",
    kind: "crm",
    stats: [
      { value: "0", label: "Manual exports" },
      { value: "5 min", label: "Sync interval" },
      { value: "100%", label: "Audit-logged changes" },
    ],
    challenge: ["Marketing and patient engagement teams worked from weekly CSV exports that were always out of date."],
    solution: ["Built a field-level mapped middleware service with retry queues, audit logs and minimal data exposure."],
    outcome: ["Teams work from live data while sensitive clinical fields stay in the EHR."],
    stack: ["HubSpot APIs", "Node.js", "AWS", "EHR API"],
  },
  {
    slug: "dynamics-to-hubspot-migration",
    client: "Distributor",
    title: "Microsoft Dynamics 365 to HubSpot CRM Migration",
    industry: "professional-services",
    tags: ["CRM Migration", "Data Integrity", "Sales Hub"],
    summary: "Ten years of CRM history moved to HubSpot with relationships and activity intact.",
    palette: ["#101820", "#f2a900", "#ffffff"],
    headline: "Ten years of data. Zero lost.",
    kind: "crm",
    stats: [
      { value: "1.2M", label: "Records migrated" },
      { value: "99.9%", label: "Field match rate" },
      { value: "3 wks", label: "To full adoption" },
    ],
    challenge: ["A heavily customised Dynamics instance was expensive to maintain and few reps used it."],
    solution: ["Mapped every entity to HubSpot objects, cleaned and de-duplicated data, and rebuilt key automation natively."],
    outcome: ["The sales team adopted HubSpot within three weeks and leadership finally had a single forecast."],
    stack: ["HubSpot Sales Hub", "Custom objects", "Python ETL"],
  },
  {
    slug: "clinical-workflow-portal",
    client: "Allied Health",
    title: "Clinical Workflow Portal Connected to HubSpot",
    industry: "healthcare",
    tags: ["Portal Architecture", "Workflow Automation", "Full Stack"],
    summary: "A custom practitioner portal that writes back to HubSpot and removes double handling.",
    palette: ["#0e1b2c", "#dc1f36", "#ffffff"],
    headline: "One portal for every practitioner",
    kind: "web",
    stats: [
      { value: "65%", label: "Less double entry" },
      { value: "3", label: "Systems consolidated" },
      { value: "<1s", label: "Page response" },
    ],
    challenge: ["Practitioners updated a spreadsheet, a booking tool and HubSpot separately for every patient."],
    solution: ["Built a Next.js portal with role-based access that reads and writes HubSpot records through a secure API."],
    outcome: ["Practitioners update one screen and every downstream system stays in sync."],
    stack: ["Next.js", "HubSpot APIs", "PostgreSQL"],
  },
  {
    slug: "ecommerce-sales-automation",
    client: "Retail Brand",
    title: "Sales Automation for a Direct-to-Consumer Retail Brand",
    industry: "ecommerce",
    tags: ["Ecommerce", "Shopify", "Automation"],
    summary: "Abandoned cart, post-purchase and win-back journeys built on Shopify and HubSpot data.",
    palette: ["#ffe9ef", "#e23d74", "#2a0f19"],
    headline: "Made to be loved twice",
    kind: "web",
    stats: [
      { value: "30%", label: "Sales uplift" },
      { value: "50%", label: "Email open rate" },
      { value: "18%", label: "Cart recovery" },
    ],
    challenge: ["Customer data sat in Shopify while marketing ran generic monthly newsletters."],
    solution: ["Synced orders and products to HubSpot and built behaviour-based journeys and segments."],
    outcome: ["Revenue from email grew significantly with less manual campaign work."],
    stack: ["HubSpot Marketing Hub", "Shopify", "Data Hub"],
  },
  {
    slug: "saas-lifecycle-reporting",
    client: "SaaS Platform",
    title: "Revenue Attribution and Lifecycle Reporting for a SaaS Platform",
    industry: "saas",
    tags: ["SaaS", "Attribution", "Reporting"],
    summary: "Product sign-ups, trials and expansions connected to marketing source for true CAC.",
    palette: ["#0d0f1a", "#7c5cff", "#ffffff"],
    headline: "Know what actually drives revenue",
    kind: "crm",
    stats: [
      { value: "10%", label: "Higher customer LTV" },
      { value: "4", label: "Dashboards retired" },
      { value: "1", label: "Source of truth" },
    ],
    challenge: ["Marketing, product and finance each reported different numbers for the same quarter."],
    solution: ["Connected product events to HubSpot, standardised lifecycle stages and rebuilt attribution reporting."],
    outcome: ["Leadership now reviews one revenue dashboard every week."],
    stack: ["HubSpot", "Segment", "Custom events"],
  },
  {
    slug: "trades-college-enquiry-pipeline",
    client: "Training College",
    title: "Enquiry-to-Enrolment Pipeline for a Trades Training College",
    industry: "education",
    tags: ["Education", "Lead Management", "Workflows"],
    summary: "Course enquiries routed, scored and followed up automatically through to enrolment.",
    palette: ["#14213d", "#fca311", "#ffffff"],
    headline: "Build your career on the tools",
    kind: "web",
    stats: [
      { value: "45%", label: "More enrolments" },
      { value: "2h", label: "Average first response" },
      { value: "6", label: "Courses automated" },
    ],
    challenge: ["Course enquiries were handled from a shared inbox with no visibility of conversion by course."],
    solution: ["Built course-specific pipelines, lead routing and nurture sequences with enrolment reporting."],
    outcome: ["Admissions staff know exactly who to call next and leaders can see conversion by course."],
    stack: ["HubSpot Sales Hub", "Marketing Hub", "Student management system"],
  },
  {
    slug: "builder-website-and-crm",
    client: "Home Builder",
    title: "Website Rebuild and CRM Rollout for a Residential Builder",
    industry: "construction",
    tags: ["Construction", "HubSpot CMS", "Sales Hub"],
    summary: "A design-led HubSpot website with display home bookings flowing straight into sales pipelines.",
    palette: ["#f1ede6", "#2f5d50", "#1b1b1b"],
    headline: "Homes designed around you",
    kind: "web",
    stats: [
      { value: "3x", label: "Display home bookings" },
      { value: "52%", label: "Faster page loads" },
      { value: "100%", label: "Leads attributed" },
    ],
    challenge: ["An ageing website and spreadsheet sales tracking made it impossible to attribute leads to campaigns."],
    solution: ["Rebuilt the website on HubSpot CMS with booking forms and implemented Sales Hub pipelines per estate."],
    outcome: ["Every enquiry is attributed and sales consultants follow up from one place."],
    stack: ["HubSpot CMS", "Sales Hub", "Meetings"],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const featuredCaseSlugs = [
  "healthcare-patient-lifecycle",
  "resort-guest-experience",
  "ehr-two-way-sync",
  "dynamics-to-hubspot-migration",
  "saas-lifecycle-reporting",
  "clinical-workflow-portal",
];

/** Website showcase entries for the homepage "Websites" section. */
export const websiteShowcase = [
  { name: "Atelier Interiors", headline: "Driven by Purpose", palette: ["#1d1d1f", "#d8c3a5", "#ffffff"], href: "/case-studies/builder-website-and-crm" },
  { name: "Canteen Co", headline: "Reimagine your Cafeteria", palette: ["#7a1e1e", "#f6c445", "#ffffff"], href: "/case-studies/ecommerce-sales-automation" },
  { name: "Northpeak", headline: "Cutting-Edge Technology, Redefining Growth", palette: ["#0a1020", "#38bdf8", "#ffffff"], href: "/case-studies/saas-lifecycle-reporting" },
  { name: "SpaceCraft 3D", headline: "Making online timekeeping accessible", palette: ["#f5f7fb", "#2563eb", "#0f172a"], href: "/case-studies/clinical-workflow-portal" },
  { name: "Verde Clinic", headline: "Care that feels personal", palette: ["#0b2a3c", "#3dd6c6", "#ffffff"], href: "/case-studies/healthcare-patient-lifecycle" },
  { name: "Trade Academy", headline: "Build your career on the tools", palette: ["#14213d", "#fca311", "#ffffff"], href: "/case-studies/trades-college-enquiry-pipeline" },
] as const;
