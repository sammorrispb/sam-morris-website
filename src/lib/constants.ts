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

export const COACH_BOOKING_URL = "https://coach.sammorrispb.com/book/evaluation";

export const ANNOUNCEMENT: {
  id: string;
  message: string;
  href?: string;
  linkText?: string;
} | null = {
  // REVERT AFTER 2026-05-28 — temporary Pot Night v0 promo. Restore the
  // "spring-2026" entry preserved below once the event ships.
  id: "pot-night-may-28-2026",
  message:
    "This Thursday: my first Pot Night — $120 winner-takes-all, 8 spots, 3.0–4.5 DUPR.",
  href: "https://p3.linkanddink.com/pot/pot-night-may-28-2026-05-28?utm_source=sammorrispb&utm_medium=banner&utm_campaign=pot-v0",
  linkText: "Enter the pot",
};

// Previous announcement (restore after the Pot Night promo ends):
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

export const SERVICE_AREA = {
  homeBase: "Olney, MD",
  radiusMinutes: 35,
  description:
    "Sam travels to your court within roughly 35 minutes of Olney, MD — covering Montgomery County, Washington DC, and nearby parts of Prince George's, Howard, and northern Virginia. You arrange and pay for the court; Sam brings the coaching.",
  shortDescription:
    "Within ~35 min of Olney, MD (MoCo + DC + nearby PG/Howard/NoVA)",
} as const;
