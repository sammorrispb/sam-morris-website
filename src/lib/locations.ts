// ─── Dill Dinkers locations, CourtReserve widget URLs, and program data ───

const CR = "https://widgets.courtreserve.com/Online/Reservations/Bookings";
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
    address: "719 E Gude Dr",
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
    address: "5506 Randolph Rd",
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
    allEvents: `${CR}/10869/44094`,
    clinics: `${CR}/10869/42416`,
    competitive: `${CR}/10869/42407`,
    juniors: `${CR}/10869/42417`,
    leagues: `${CR}/10869/42532`,
    membership: `${CR}/10869/26919`,
    openPlay: `${CR}/10869/42405`,
    coachedOpenPlay: `${CR}/10869/79946`,
    social: `${CR}/10869/58623`,
    seniorPrograms: `${CR}/10869/68683`,
    bookPrivateCourt: `${CR}/10869/68766`,
    nextGenAcademy: `${CR}/10869/100672`,
    publicBooking: `${CR_APP}/publicbookings/10869`,
  },
  northBethesda: {
    allEvents: `${CR}/10483/26211`,
    clinics: `${CR}/10483/42411`,
    competitive: `${CR}/10483/42409`,
    juniors: `${CR}/10483/42990`,
    leagues: `${CR}/10483/42896`,
    membership: `${CR}/10483/27596`,
    openPlay: `${CR}/10483/42406`,
    coachedOpenPlay: `${CR}/10483/79944`,
    social: `${CR}/10483/58624`,
    seniorPrograms: `${CR}/10483/68684`,
    bookPrivateCourt: `${CR}/10483/68765`,
    nextGenAcademy: `${CR}/10483/100673`,
    publicBooking: `${CR_APP}/publicbookings/10483`,
  },
} as const;

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
    color: "#22c55e",
    programs: [
      { key: "openPlay", emoji: "\u{1F3D3}", label: "Open Play", description: "Drop-in games for all levels" },
      { key: "coachedOpenPlay", emoji: "\u{1F3AF}", label: "Coached Open Play", description: "Open play with pro guidance" },
      { key: "bookPrivateCourt", emoji: "\u{1F4CB}", label: "Book a Private Court", description: "Reserve a court for your group" },
    ],
  },
  {
    name: "Learn",
    color: "#3b82f6",
    programs: [
      { key: "clinics", emoji: "\u{1F4DA}", label: "Clinics & Classes", description: "Group instruction at every level" },
      { key: "juniors", emoji: "\u2B50", label: "Juniors", description: "Youth programs ages 5-16" },
      { key: "nextGenAcademy", emoji: "\u{1F680}", label: "Next Gen Academy", description: "Structured youth pathway" },
      { key: "seniorPrograms", emoji: "\u{1F393}", label: "Senior Programs", description: "Tailored for 55+ players" },
    ],
  },
  {
    name: "Compete",
    color: "#f97316",
    programs: [
      { key: "competitive", emoji: "\u{1F3C6}", label: "Competitive Events", description: "Tournaments and rated play" },
      { key: "leagues", emoji: "\u{1F4CA}", label: "Leagues", description: "Structured seasonal competition" },
    ],
  },
  {
    name: "Community",
    color: "#8b5cf6",
    programs: [
      { key: "social", emoji: "\u{1F389}", label: "Social Events", description: "Mixers, parties, and themed nights" },
      { key: "allEvents", emoji: "\u{1F4C5}", label: "All Events", description: "Browse the full calendar" },
      { key: "membership", emoji: "\u{1F511}", label: "Membership", description: "Unlock member-only perks" },
    ],
  },
];

// ─── Growth pathway ───

export interface PathwayStep {
  number: number;
  title: string;
  description: string;
}

export const GROWTH_PATHWAY: PathwayStep[] = [
  { number: 1, title: "Try It Out", description: "Drop into Open Play or a beginner clinic \u2014 no commitment needed." },
  { number: 2, title: "Get Social", description: "Join a social event or the WhatsApp group to meet the community." },
  { number: 3, title: "Build Skills", description: "Take clinics, private lessons, or join Next Gen Academy." },
  { number: 4, title: "Compete", description: "Enter leagues and tournaments when you\u2019re ready to test yourself." },
  { number: 5, title: "Lead", description: "Become an ambassador, organizer, or coach in the community." },
];

// ─── Benefits ───

export interface Benefit {
  emoji: string;
  title: string;
  description: string;
}

export const BENEFITS: Benefit[] = [
  { emoji: "\u{1F3DF}\uFE0F", title: "Indoor Courts", description: "Climate-controlled play year-round \u2014 no weather cancellations." },
  { emoji: "\u{1F4C8}", title: "All Levels Welcome", description: "Programs from absolute beginner to 5.0+ competitive player." },
  { emoji: "\u{1F3AF}", title: "Professional Coaching", description: "Certified pros on staff for clinics, privates, and academy." },
  { emoji: "\u{1F91D}", title: "Real Community", description: "Social events, WhatsApp groups, and the Link & Dink app." },
  { emoji: "\u{1F4CD}", title: "Two Locations", description: "Rockville and North Bethesda \u2014 play at whichever is closer." },
  { emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}", title: "Youth & Family", description: "Junior programs, family memberships, and all-ages events." },
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
    tagColor: "#22c55e",
    description: "Join 200+ local players. Court availability, game requests, and community updates.",
    href: "https://chat.whatsapp.com/LGdvaFQR65dIiNPxPFwL3U",
  },
  {
    label: "Link & Dink",
    tag: "Community",
    tagColor: "#a3e635",
    description: "Social discovery app connecting players for events, groups, and competitive play.",
    href: "https://www.linkanddink.com",
  },
  {
    label: "Next Gen Academy",
    tag: "Academy",
    tagColor: "#3b82f6",
    description: "Structured youth pathway for ages 5-16 with four skill levels.",
    href: "https://www.nextgenpbacademy.com",
  },
];
