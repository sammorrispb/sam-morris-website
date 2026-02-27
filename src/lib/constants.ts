export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { platform: "Instagram", href: "#", icon: "instagram" },
  { platform: "Facebook", href: "#", icon: "facebook" },
  { platform: "LinkedIn", href: "#", icon: "linkedin" },
  { platform: "TikTok", href: "#", icon: "tiktok" },
  { platform: "YouTube", href: "#", icon: "youtube" },
] as const;

export const CONTACT = {
  email: "sam.morris2131@gmail.com",
  phone: "301-325-4731",
} as const;

export const INTEREST_OPTIONS = [
  "Open Play",
  "Coaching / Private Lessons",
  "Next Gen Academy",
  "Group Programs",
  "Corporate Events",
  "Just Curious",
] as const;
