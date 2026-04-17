// ─── Dill Dinkers locations, CourtReserve widget URLs, and program data ───

import { hubUrl, crUrl } from "./urls";

const CR = "https://widgets.courtreserve.com/Online/Public/EmbedCode";
const CR_APP = "https://app.courtreserve.com/Online";

export type LocationId = "rockville" | "northBethesda";

export interface Location {
  id: LocationId;
  name: string;
  orgId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

export const LOCATIONS: Record<LocationId, Location> = {
  rockville: {
    id: "rockville",
    name: "Dill Dinkers Rockville",
    orgId: "10869",
    address: "40C Southlawn Court",
    city: "Rockville",
    state: "MD",
    zip: "20850",
    phone: "240-912-7860",
    email: "rockville@dilldinkers.com",
  },
  northBethesda: {
    id: "northBethesda",
    name: "Dill Dinkers North Bethesda",
    orgId: "10483",
    address: "4942 Boiling Brook Pkwy",
    city: "North Bethesda",
    state: "MD",
    zip: "20852",
    phone: "301-231-7811",
    email: "northbethesda@dilldinkers.com",
  },
} as const;

export const LOCATION_ORDER: LocationId[] = ["rockville", "northBethesda"];

// ─── CourtReserve widget URLs per location ───

interface WidgetUrls {
  allEvents: string;
  clinics: string;
  competitive: string;
  juniors: string;
  leagues: string;
  membership: string;
  openPlay: string;
  coachedOpenPlay: string;
  social: string;
  seniorPrograms: string;
  bookPrivateCourt: string;
  nextGenAcademy: string;
  publicBooking: string;
}

export const WIDGET_URLS: Record<LocationId, WidgetUrls> = {
  rockville: {
    allEvents: crUrl(`${CR}/10869/44094`),
    clinics: crUrl(`${CR}/10869/42416`),
    competitive: crUrl(`${CR}/10869/42407`),
    juniors: crUrl(`${CR}/10869/42417`),
    leagues: crUrl(`${CR}/10869/42532`),
    membership: crUrl(`${CR}/10869/26919`),
    openPlay: crUrl(`${CR}/10869/42405`),
    coachedOpenPlay: crUrl(`${CR}/10869/79946`),
    social: crUrl(`${CR}/10869/58623`),
    seniorPrograms: crUrl(`${CR}/10869/68683`),
    bookPrivateCourt: crUrl(`${CR}/10869/68766`),
    nextGenAcademy: crUrl(`${CR}/10869/100672`),
    publicBooking: crUrl(`${CR_APP}/publicbookings/10869`),
  },
  northBethesda: {
    allEvents: crUrl(`${CR}/10483/26211`),
    clinics: crUrl(`${CR}/10483/42411`),
    competitive: crUrl(`${CR}/10483/42409`),
    juniors: crUrl(`${CR}/10483/42990`),
    leagues: crUrl(`${CR}/10483/42896`),
    membership: crUrl(`${CR}/10483/27596`),
    openPlay: crUrl(`${CR}/10483/42406`),
    coachedOpenPlay: crUrl(`${CR}/10483/79944`),
    social: crUrl(`${CR}/10483/58624`),
    seniorPrograms: crUrl(`${CR}/10483/68684`),
    bookPrivateCourt: crUrl(`${CR}/10483/68765`),
    nextGenAcademy: crUrl(`${CR}/10483/100673`),
    publicBooking: crUrl(`${CR_APP}/publicbookings/10483`),
  },
};

// ─── Program categories for the grid ───

export interface ProgramCard {
  key: keyof WidgetUrls;
  emoji: string;
  label: string;
  description: string;
}

export interface ProgramCategory {
  name: string;
  color: string;
  programs: ProgramCard[];
}

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  {
    name: "Play",
    color: "#8BC751",
    programs: [
      { key: "openPlay", emoji: "\u{1F3D3}", label: "Open Play", description: "Drop-in games for all levels" },
      { key: "coachedOpenPlay", emoji: "\u{1F3AF}", label: "Coached Open Play", description: "Open play with pro guidance" },
      { key: "bookPrivateCourt", emoji: "\u{1F4CB}", label: "Book a Private Court", description: "Reserve a court for your group" },
    ],
  },
  {
    name: "Learn",
    color: "#4DACD0",
    programs: [
      { key: "clinics", emoji: "\u{1F4DA}", label: "Clinics & Classes", description: "Group instruction at every level" },
      { key: "juniors", emoji: "\u2B50", label: "Juniors", description: "Youth programs ages 5-16" },
      { key: "nextGenAcademy", emoji: "\u{1F680}", label: "Next Gen Academy", description: "Structured youth pathway" },
      { key: "seniorPrograms", emoji: "\u{1F393}", label: "Senior Programs", description: "Tailored for 55+ players" },
    ],
  },
  {
    name: "Compete",
    color: "#F47920",
    programs: [
      { key: "competitive", emoji: "\u{1F3C6}", label: "Competitive Events", description: "Tournaments and rated play" },
      { key: "leagues", emoji: "\u{1F4CA}", label: "Leagues", description: "Structured seasonal competition" },
    ],
  },
  {
    name: "Community",
    color: "#078141",
    programs: [
      { key: "social", emoji: "\u{1F389}", label: "Social Events", description: "Mixers, parties, and themed nights" },
      { key: "allEvents", emoji: "\u{1F4C5}", label: "All Events", description: "Browse the full calendar" },
      { key: "membership", emoji: "\u{1F511}", label: "Membership", description: "Unlock member-only perks" },
    ],
  },
];

// ─── Growth pathway ───

export interface PathwayLink {
  label: string;
  /** URL or anchor (e.g. "#first-visit", external URL, or widget key like "openPlay") */
  href: string;
  external?: boolean;
}

export interface PathwayStep {
  number: number;
  title: string;
  description: string;
  links: PathwayLink[];
}

export const GROWTH_PATHWAY: PathwayStep[] = [
  {
    number: 1,
    title: "Try It Out",
    description: "Drop into Open Play or a beginner clinic — no commitment needed.",
    links: [
      { label: "Browse Open Play", href: "openPlay", external: true },
      { label: "Your First Visit", href: "#first-visit" },
    ],
  },
  {
    number: 2,
    title: "Get Social",
    description: "Join a social event or the WhatsApp group to meet the community.",
    links: [
      { label: "Social Events", href: "social", external: true },
      { label: "WhatsApp Group", href: "https://chat.whatsapp.com/HMjGamk0Mtx662DbtGmDwe", external: true },
    ],
  },
  {
    number: 3,
    title: "Build Skills",
    description: "Take clinics, private lessons, or join Next Gen Academy.",
    links: [
      { label: "Clinics & Classes", href: "clinics", external: true },
      { label: "Private Lessons", href: "/programs#coaching" },
    ],
  },
  {
    number: 4,
    title: "Compete",
    description: "Enter leagues and tournaments when you're ready to test yourself.",
    links: [
      { label: "Leagues", href: "leagues", external: true },
      { label: "Competitive Events", href: "competitive", external: true },
    ],
  },
  {
    number: 5,
    title: "Lead",
    description: "Become an ambassador, organizer, or coach in the community.",
    links: [
      { label: "Get in Touch", href: "/contact" },
    ],
  },
];

// ─── First Visit Guide ───

export interface FirstVisitItem {
  emoji: string;
  title: string;
  description: string;
}

export const FIRST_VISIT: FirstVisitItem[] = [
  {
    emoji: "\u{1F44B}",
    title: "What to expect",
    description: "Check in at the front desk, grab a paddle if you need one, and jump into a game. Staff will help you find the right court and group for your level.",
  },
  {
    emoji: "\u{1F45F}",
    title: "What to bring",
    description: "Athletic shoes (clean, non-marking soles) and water. Paddles are available to borrow if you don't have one yet.",
  },
  {
    emoji: "\u{1F4B5}",
    title: "What it costs",
    description: "Open Play starts at $15 per session for non-members. Memberships start at $99/month with unlimited play and discounts on programs.",
  },
  {
    emoji: "\u{1F31F}",
    title: "Recommended first step",
    description: "Sign up for the next Open Play session — it's the easiest way to start. No experience needed, all levels welcome.",
  },
];

export const FIRST_VISIT_TESTIMONIAL = {
  quote: "I showed up knowing nothing about pickleball and left with three new friends and a weekly game. The community here is unreal.",
  author: "New player, Rockville",
};

// ─── Benefits ───

export interface Benefit {
  emoji: string;
  title: string;
  description: string;
}

export const BENEFITS: Benefit[] = [
  { emoji: "\u{1F3DF}\uFE0F", title: "Indoor Courts", description: "Quality courts with climate-controlled play year-round \u2014 no weather cancellations." },
  { emoji: "\u{1F4C8}", title: "All Levels Welcome", description: "Whether you\u2019ve never held a paddle or you\u2019re a 5.0+ competitor, there\u2019s a program for you." },
  { emoji: "\u{1F3AF}", title: "Professional Coaching", description: "Certified pros on staff for clinics, private lessons, and structured academy programs." },
  { emoji: "\u{1F91D}", title: "Real Community", description: "A welcoming community with social events, WhatsApp groups, and the Link & Dink app." },
  { emoji: "\u{1F4CD}", title: "Two Locations", description: "Rockville and North Bethesda \u2014 convenient locations across Montgomery County." },
  { emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}", title: "Youth & Family", description: "Family-friendly with junior programs, family memberships, and all-ages events." },
];

// ─── Community links ───

export interface CommunityLink {
  label: string;
  tag: string;
  tagColor: string;
  description: string;
  href: string;
}

export const COMMUNITY_LINKS: CommunityLink[] = [
  {
    label: "WhatsApp Group",
    tag: "Chat",
    tagColor: "#8BC751",
    description: "Join 200+ local players. Court availability, game requests, and community updates.",
    href: "https://chat.whatsapp.com/HMjGamk0Mtx662DbtGmDwe",
  },
  {
    label: "Link & Dink",
    tag: "Community",
    tagColor: "#F47920",
    description: "Social discovery app connecting players for events, groups, and competitive play.",
    href: hubUrl("/"),
  },
  {
    label: "Next Gen Academy",
    tag: "Academy",
    tagColor: "#4DACD0",
    description: "Structured youth pathway for ages 5-16 with four skill levels.",
    href: "https://www.nextgenpbacademy.com",
  },
];
