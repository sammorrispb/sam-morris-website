"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PROGRAM_NAV = [
  { href: "/programs/hub", label: "Program Hub" },
  { href: "/programs/leagues", label: "Leagues" },
  { href: "/programs/open-play", label: "Open Play" },
  { href: "/programs/coached-open-play", label: "Coached Open Play" },
  { href: "/programs/coaching", label: "Coaching & Clinics" },
  { href: "/programs/tournaments", label: "Tournaments" },
  { href: "/programs/youth", label: "Youth Programs" },
];

const BRAND_MAP: Record<string, { brand: string; color: string }> = {
  "/programs/hub": { brand: "dill-dinkers", color: "#F47920" },
  "/programs/leagues": { brand: "dill-dinkers", color: "#F47920" },
  "/programs/open-play": { brand: "dill-dinkers", color: "#8BC751" },
  "/programs/coached-open-play": { brand: "sam-morris", color: "#4DACD0" },
  "/programs/coaching": { brand: "sam-morris", color: "#4DACD0" },
  "/programs/tournaments": { brand: "link-and-dink", color: "#F47920" },
  "/programs/youth": { brand: "next-gen", color: "#22c55e" },
};

export function ProgramsNav() {
  const pathname = usePathname();
  const activeBrand = BRAND_MAP[pathname];

  return (
    <nav
      className="bg-navy-light/80 backdrop-blur-sm border-b sticky top-16 z-30"
      style={{
        borderColor: activeBrand
          ? `${activeBrand.color}15`
          : "rgba(255,255,255,0.05)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-4 overflow-x-auto scrollbar-hide">
        <Link
          href="/locations"
          className="shrink-0 text-text-muted hover:text-accent-blue transition-colors text-sm font-semibold"
        >
          &larr; Locations
        </Link>
        <span className="text-white/10">|</span>
        {PROGRAM_NAV.map((item) => {
          const isActive = pathname === item.href;
          const itemBrand = BRAND_MAP[item.href];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 transition-colors text-sm ${
                isActive
                  ? "nav-link-active font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
              style={isActive && itemBrand ? { color: itemBrand.color } : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
