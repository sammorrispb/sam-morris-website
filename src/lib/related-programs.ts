export interface RelatedProgram {
  title: string;
  description: string;
  href: string;
}

export const RELATED_PROGRAMS: Record<string, RelatedProgram[]> = {
  "/programs/coaching": [
    {
      title: "Coached Open Play",
      description: "Get real-time coaching feedback during live games.",
      href: "/programs/coached-open-play",
    },
    {
      title: "Leagues",
      description: "Put your skills to the test in DUPR-rated league play.",
      href: "/programs/leagues",
    },
    {
      title: "Youth Programs",
      description: "Next Gen Academy for ages 5-16 with progressive levels.",
      href: "/programs/youth",
    },
  ],
  "/programs/leagues": [
    {
      title: "Open Play",
      description: "Drop-in sessions for all skill levels, no partner needed.",
      href: "/programs/open-play",
    },
    {
      title: "Coached Open Play",
      description: "Level up with real-time coaching during live games.",
      href: "/programs/coached-open-play",
    },
    {
      title: "Coaching & Clinics",
      description: "Private lessons and group clinics to sharpen your game.",
      href: "/programs/coaching",
    },
  ],
  "/programs/open-play": [
    {
      title: "Coached Open Play",
      description: "Same fun format, plus a coach giving you real-time tips.",
      href: "/programs/coached-open-play",
    },
    {
      title: "Leagues",
      description: "Ready to compete? Join a DUPR-rated league season.",
      href: "/programs/leagues",
    },
    {
      title: "Coaching & Clinics",
      description: "Accelerate your progress with private or group instruction.",
      href: "/programs/coaching",
    },
  ],
  "/programs/coached-open-play": [
    {
      title: "Open Play",
      description: "Drop-in play for all levels — no coaching, just games.",
      href: "/programs/open-play",
    },
    {
      title: "Coaching & Clinics",
      description: "Go deeper with private lessons and focused drill sessions.",
      href: "/programs/coaching",
    },
    {
      title: "Leagues",
      description: "Take your game to league night with DUPR-rated brackets.",
      href: "/programs/leagues",
    },
  ],
  "/programs/youth": [
    {
      title: "Coaching & Clinics",
      description: "Private and group coaching for players of all ages.",
      href: "/programs/coaching",
    },
    {
      title: "Open Play",
      description: "Family-friendly drop-in sessions at both locations.",
      href: "/programs/open-play",
    },
    {
      title: "Program Hub",
      description: "Not sure what's right? Browse all programs in one place.",
      href: "/programs/hub",
    },
  ],
};
