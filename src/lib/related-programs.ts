export interface RelatedProgram {
  title: string;
  description: string;
  href: string;
}

export const RELATED_PROGRAMS: Record<string, RelatedProgram[]> = {
  "/programs/coaching": [
    {
      title: "Youth Programs",
      description: "Next Gen Academy for ages 5-16 with progressive levels.",
      href: "/programs/youth",
    },
  ],
  "/programs/youth": [
    {
      title: "Coaching & Clinics",
      description: "Private and group coaching with Coach Sam Morris.",
      href: "/programs/coaching",
    },
  ],
};
