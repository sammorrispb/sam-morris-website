"use client";

import { useEffect, useState, useCallback } from "react";

export type Section = { id: string; label: string };

interface Props {
  sections: Section[];
  brandColor?: string;
}

export function PageSectionNav({ sections, brandColor = "#4DACD0" }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Escape key closes mobile popover ── */
  useEffect(() => {
    if (!mobileOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [mobileOpen]);

  /* ── IntersectionObserver + scroll-to-bottom fallback ── */
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!best || entry.intersectionRatio > best.ratio)
          ) {
            best = { id: entry.target.id, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActiveId(best.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );

    els.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
        setActiveId(sections[sections.length - 1].id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  const scrollTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    },
    [],
  );

  return (
    <>
      {/* Desktop — vertical pill list on right edge */}
      <nav
        aria-label="Page sections"
        className="section-nav hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-1 rounded-xl bg-navy-light/80 backdrop-blur-sm border border-white/10 py-2 px-1"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`section-nav-item text-xs px-3 py-1.5 rounded-lg text-left whitespace-nowrap transition-all ${
              activeId === s.id ? "section-nav-item-active" : "text-text-muted hover:text-text-primary"
            }`}
            style={activeId === s.id ? { color: brandColor, borderLeftColor: brandColor } : undefined}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Mobile — floating pill + popover */}
      <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        {mobileOpen && (
          <div className="fixed inset-0" aria-hidden="true" onClick={() => setMobileOpen(false)} />
        )}
        {mobileOpen && (
          <div
            id="section-nav-popover"
            role="menu"
            aria-label="Page sections"
            className="section-nav-mobile-popover absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 rounded-xl bg-navy-light/95 backdrop-blur-sm border border-white/10 py-2 px-1"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                role="menuitem"
                onClick={() => scrollTo(s.id)}
                className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                  activeId === s.id ? "font-semibold" : "text-text-muted hover:text-text-primary"
                }`}
                style={activeId === s.id ? { color: brandColor } : undefined}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="section-nav-popover"
          className="relative flex items-center gap-1.5 rounded-full bg-navy-light/90 backdrop-blur-sm border border-white/10 px-4 py-2 text-xs font-heading font-semibold text-text-muted hover:text-text-primary transition-colors shadow-lg"
          style={{ borderColor: mobileOpen ? brandColor : undefined }}
        >
          <span aria-hidden="true">{mobileOpen ? "\u2715" : "\u2630"}</span>
          {mobileOpen ? "Close" : "Jump to\u2026"}
        </button>
      </div>
    </>
  );
}
