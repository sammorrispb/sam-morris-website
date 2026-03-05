"use client";

import { useEffect, useState } from "react";

export function StickyProgramsPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("locations-hero");
    const programs = document.getElementById("programs");
    if (!hero || !programs) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show pill when hero is scrolled out of view
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);

    // Hide when programs section is visible
    const programsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(false);
      },
      { threshold: 0.2 }
    );

    programsObserver.observe(programs);

    return () => {
      observer.disconnect();
      programsObserver.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
      <a
        href="#programs"
        className="inline-flex items-center gap-2 bg-navy-light/95 backdrop-blur-sm glow-border rounded-full px-5 py-2.5 font-heading font-semibold text-sm text-text-primary hover:border-accent-blue/40 transition-all shadow-lg"
      >
        <span role="img" aria-hidden="true">
          {"\u{1F4C5}"}
        </span>
        Browse Programs
      </a>
    </div>
  );
}
