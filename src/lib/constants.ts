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
  { label: "MoCo PB", dest: "mocopb" },
  { label: "Tournament Series", dest: "tournaments" },
] as const;

export const CONTACT = {
  email: "sam.morris2131@gmail.com",
  phone: "301-325-4731",
} as const;

export const ANNOUNCEMENT: {
  id: string;
  message: string;
  href?: string;
  linkText?: string;
} | null = null;

export const INTEREST_OPTIONS = [
  "Free Evaluation",
  "Coaching",
  "Youth Programs",
  "Business Partnerships",
  "Social/Recreational Play",
  "Competitive Play",
  "Ambassador (Player-Organizer-Coach)",
] as const;
