export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { platform: "Instagram", href: "https://instagram.com/sammorris.pb", icon: "instagram" },
  { platform: "Facebook", href: "https://facebook.com/sam.km.18", icon: "facebook" },
  { platform: "LinkedIn", href: "https://www.linkedin.com/in/sam-morris2131/", icon: "linkedin" },
  { platform: "TikTok", href: "https://tiktok.com/@sammorris.pb", icon: "tiktok" },
  { platform: "YouTube", href: "https://youtube.com/@sammorris.pb8", icon: "youtube" },
  { platform: "Linktree", href: "https://linktr.ee/sammorrispb", icon: "linktree" },
] as const;

import type { FamilyDest } from "./urls";

export const FAMILY_LINKS: ReadonlyArray<{ label: string; dest: FamilyDest }> = [
  { label: "Next Gen Academy", dest: "nga" },
  { label: "Link & Dink", dest: "ld" },
] as const;

export const CONTACT = {
  email: "sam.morris2131@gmail.com",
  phone: "301-325-4731",
} as const;

export const WHATSAPP_GROUP = {
  name: "Sam Morris Pickleball",
  href: "https://chat.whatsapp.com/LaRjBQT8O5p5aJS5vSAk0i?s=cl&p=i&mlu=2",
} as const;

export const COACH_BOOKING_URL = "https://coach.sammorrispb.com/book/evaluation";

// Request a private lesson — no public price; Sam reviews the request, confirms
// a time, and sends a Stripe invoice (Coach OS request flow). Distinct from the
// free-evaluation booking link above.
export const COACH_REQUEST_URL = "https://coach.sammorrispb.com/book/private-lesson";

// Join the cohort interest pool (Coach OS). Players join with skill + age +
// availability; Sam forms a cohort and invoices once enough compatible players
// accumulate. `track=adult` for this Coach Sam surface.
export const COHORT_POOL_URL = "https://coach.sammorrispb.com/cohorts/join?track=adult";

export const ANNOUNCEMENT: {
  id: string;
  message: string;
  href?: string;
  linkText?: string;
} | null = {
  id: "nga-fall-2026",
  message:
    "Next Gen Academy Fall Season — six Sundays, Sept 20 – Oct 25 in Rockville. Green & Yellow Ball groups, eight spots each.",
  href: "https://nextgenpbacademy.com/fall?utm_source=sammorrispb&utm_medium=banner&utm_campaign=nga_fall_2026",
  linkText: "Register",
};

// Previous announcements (restore if you want to feature one again):
// {
//   id: "linkanddink-moco-community",
//   message:
//     "Join the Montgomery County pickleball community on Link & Dink — newsletter, pop-up tournaments, and local play.",
//   href: "https://linkanddink.com/?utm_source=sammorrispb&utm_medium=banner&utm_campaign=moco-community",
//   linkText: "Join the community",
// }
// {
//   id: "spring-2026",
//   message: "Spring 2026 private lessons and skill evaluations are open for booking!",
//   href: "/contact",
//   linkText: "Book a Session",
// }

export const INTEREST_OPTIONS = [
  "Free Evaluation",
  "Private Lesson",
  "Group Lesson (2+)",
  "3+1 Play-In Special",
  "Event / Clinic",
  "Youth Programs",
  "Business Partnerships",
  "Social/Recreational Play",
  "Competitive Play",
  "Ambassador (Player-Organizer-Coach)",
] as const;

export const EVENT_TYPES = [
  "Birthday",
  "Corporate",
  "Social",
  "Health/Wellness",
  "Other",
] as const;

// Sanctioned host venue for private lessons outside the 35-min radius
// (Sam-approved 2026-08-09). Partner/host venue, not a competitor.
export const FREDERICK_VENUE = {
  name: "The Pickle Park",
  label: "The Pickle Park — Frederick, MD",
  city: "Frederick, MD",
} as const;

export const SERVICE_AREA = {
  homeBase: "Olney, MD",
  radiusMinutes: 35,
  description:
    "Sam travels to your court within roughly 35 minutes of Olney, MD — covering Montgomery County, Washington DC, and nearby parts of Prince George's, Howard, and northern Virginia. Private lessons are also available at The Pickle Park in Frederick, MD. You arrange and pay for the court; Sam brings the coaching.",
  // Frederick is deliberately absent here: shortDescription feeds the
  // group/3+1/event templates and the events page, which stay MoCo-only.
  shortDescription:
    "Within ~35 min of Olney, MD (MoCo + DC + nearby PG/Howard/NoVA)",
} as const;
