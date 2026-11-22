import { caseStudies, getCaseStudy } from "./caseStudies";
import { apps, industries, integrations, modules, posts, themes } from "./misc";
import { digitalServices, hubspotServices } from "./services";

export type MegaCard = { title: string; href: string; palette: readonly string[]; headline: string };
export type MegaPanel = {
  heading: string;
  cards?: MegaCard[];
  links?: { label: string; href: string }[];
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
};
export type MegaTab = { label: string; href: string; icon: string; panel: MegaPanel };
export type NavItem = { label: string; href?: string; groupLabel?: string; tabs?: MegaTab[] };

const csCard = (slug: string): MegaCard => {
  const c = getCaseStudy(slug)!;
  return { title: c.title, href: `/case-studies/${c.slug}`, palette: c.palette, headline: c.headline };
};

const defaultCards = ["healthcare-patient-lifecycle", "resort-guest-experience", "dynamics-to-hubspot-migration"].map(csCard);

export const navigation: NavItem[] = [
  {
    label: "HubSpot Services",
    groupLabel: "HubSpot Services",
    tabs: hubspotServices.map((s) => ({
      label: s.navLabel,
      href: `/${s.slug}`,
      icon: s.icon,
      panel:
        s.slug === "hubspot-integration"
          ? {
              heading: "HubSpot Integrations",
              links: integrations.map((i) => ({ label: i, href: "/hubspot-integration" })),
              ctaText: "Tired of switching between disconnected tools and manual data entry?",
              ctaLabel: "HubSpot Integrations",
              ctaHref: "/hubspot-integration",
            }
          : {
              heading: "Featured",
              cards: defaultCards,
              ctaText: s.blurb,
              ctaLabel: s.navLabel.replace("HubSpot ", "HubSpot "),
              ctaHref: `/${s.slug}`,
            },
    })),
  },
  {
    label: "Digital Services",
    groupLabel: "Digital Services",
    tabs: digitalServices.map((s, i) => ({
      label: s.navLabel,
      href: `/${s.slug}`,
      icon: s.icon,
      panel: {
        heading: s.name,
        cards:
          s.slug === "white-label-services"
            ? undefined
            : [caseStudies[(i * 2) % caseStudies.length], caseStudies[(i * 2 + 1) % caseStudies.length], caseStudies[(i * 2 + 2) % caseStudies.length]].map((c) => csCard(c.slug)),
        ctaText: s.blurb,
        ctaLabel: s.name,
        ctaHref: `/${s.slug}`,
      },
    })),
  },
  {
    label: "Products",
    groupLabel: "Products",
    tabs: [
      {
        label: "HubSpot Themes",
        href: "/hubspot-themes",
        icon: "Palette",
        panel: {
          heading: "HubSpot Themes",
          cards: themes.map((t) => ({ title: t.name, href: `/hubspot-themes/${t.slug}`, palette: t.palette, headline: t.headline })),
          ctaText: "Looking for a HubSpot theme that is fast, flexible and built to convert?",
          ctaLabel: "All Themes",
          ctaHref: "/hubspot-themes",
        },
      },
      {
        label: "HubSpot Modules",
        href: "/hubspot-modules",
        icon: "Blocks",
        panel: {
          heading: "HubSpot Modules",
          links: modules.map((m) => ({ label: m, href: "/hubspot-modules" })),
          ctaText: "Need reusable website components that make content updates easy?",
          ctaLabel: "All Modules",
          ctaHref: "/hubspot-modules",
        },
      },
      {
        label: "HubSpot Apps",
        href: "/hubspot-apps",
        icon: "AppWindow",
        panel: {
          heading: "HubSpot Apps",
          links: apps.map((a) => ({ label: a.name, href: "/hubspot-apps" })),
          ctaText: "Need HubSpot to do more than its out-of-the-box features allow?",
          ctaLabel: "HubSpot Apps",
          ctaHref: "/hubspot-apps",
        },
      },
    ],
  },
  {
    label: "Case Studies",
    groupLabel: "Industries",
    tabs: industries.map((ind) => {
      const list = caseStudies.filter((c) => c.industry === ind.slug);
      const cards = (list.length ? list : caseStudies).slice(0, 3).map((c) => csCard(c.slug));
      return {
        label: ind.name,
        href: `/industries/${ind.slug}`,
        icon: ind.icon,
        panel: { heading: ind.name, cards, ctaText: ind.blurb, ctaLabel: "All Case Studies", ctaHref: "/case-studies" },
      };
    }),
  },
  { label: "About", href: "/about" },
  {
    label: "Resources",
    groupLabel: "Resources",
    tabs: [
      {
        label: "HubSpot Industry",
        href: "/industries",
        icon: "Building2",
        panel: {
          heading: "HubSpot by Industry",
          links: industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
          ctaText: "See how HubSpot is set up for businesses like yours.",
          ctaLabel: "All Industries",
          ctaHref: "/industries",
        },
      },
      {
        label: "Blogs",
        href: "/blog",
        icon: "Newspaper",
        panel: {
          heading: "Featured",
          cards: posts.slice(0, 3).map((p) => ({ title: p.title, href: `/blog/${p.slug}`, palette: p.palette, headline: p.category })),
          ctaText: "Practical guides on HubSpot, RevOps and growth systems.",
          ctaLabel: "View All",
          ctaHref: "/blog",
        },
      },
    ],
  },
];

export const footerColumns = [
  {
    title: "Our Top Services",
    links: [
      { label: "HubSpot Implementation", href: "/hubspot-onboarding" },
      { label: "HubSpot Website Development", href: "/hubspot-website" },
      { label: "Migration to HubSpot", href: "/hubspot-migration" },
      { label: "Cold Email Outbound", href: "/cold-email-outbound" },
      { label: "UI/UX Design", href: "/ui-ux-design" },
    ],
    extra: { text: "Need help with a theme or app?", label: "Visit Our Support Centre", href: "/contact" },
  },
  {
    title: "Integration & Migration",
    links: [
      { label: "HubSpot Integrations", href: "/hubspot-integration" },
      { label: "Salesforce to HubSpot", href: "/hubspot-migration" },
      { label: "Zoho to HubSpot", href: "/hubspot-migration" },
      { label: "EHR Integrations", href: "/industries/healthcare" },
      { label: "WordPress to HubSpot", href: "/hubspot-website" },
      { label: "AI Agent Development", href: "/ai-agent-development" },
    ],
  },
  {
    title: "Industries",
    links: industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
  },
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "HubSpot Themes", href: "/hubspot-themes" },
      { label: "Blog", href: "/blog" },
      { label: "Start a Project", href: "/start-a-project" },
      { label: "Schedule a Meeting", href: "/schedule-meeting" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
