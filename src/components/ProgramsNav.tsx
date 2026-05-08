"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PROGRAM_NAV: { href: string; label: string; external?: boolean }[] = [
  { href: "/programs/coaching", label: "Coaching & Clinics" },
  { href: "/programs/events", label: "Events" },
  { href: "/evaluation", label: "Skill Evaluation" },
];

const BRAND_MAP: Record<string, { brand: string; color: string }> = {
  "/programs/coaching": { brand: "sam-morris", color: "#E8A03A" },
  "/programs/events": { brand: "sam-morris", color: "#A5C49C" },
  "/evaluation": { brand: "sam-morris", color: "#D9523E" },
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
          href="/programs"
          className="shrink-0 text-text-muted hover:text-accent-blue transition-colors text-sm font-semibold"
        >
          &larr; Programs
        </Link>
        <span className="text-white/10">|</span>
        {PROGRAM_NAV.map((item) => {
          const isActive = pathname === item.href;
          const itemBrand = BRAND_MAP[item.href];
          const className = `shrink-0 transition-colors text-sm ${
            isActive
              ? "nav-link-active font-semibold"
              : "text-text-muted hover:text-text-primary"
          }`;
          const style = isActive && itemBrand ? { color: itemBrand.color } : undefined;
          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              style={style}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={className}
              style={style}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
