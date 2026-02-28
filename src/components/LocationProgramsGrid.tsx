"use client";

import { useState } from "react";
import {
  LOCATION_ORDER,
  LOCATIONS,
  PROGRAM_CATEGORIES,
  WIDGET_URLS,
  type LocationId,
} from "@/lib/locations";

export function LocationProgramsGrid() {
  const [active, setActive] = useState<LocationId>("rockville");

  const urls = WIDGET_URLS[active];

  return (
    <div>
      {/* Location tabs */}
      <div className="flex justify-center gap-3 mb-10">
        {LOCATION_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`font-heading font-semibold px-6 py-2.5 rounded-lg transition-all ${
              active === id
                ? "text-white btn-gradient"
                : "bg-navy border border-white/10 text-text-muted hover:border-accent-blue/40 hover:text-text-primary"
            }`}
          >
            {LOCATIONS[id].city}
          </button>
        ))}
      </div>

      {/* Program groups */}
      <div className="space-y-10">
        {PROGRAM_CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3
              className="font-mono text-sm uppercase tracking-wider mb-4"
              style={{ color: category.color }}
            >
              {category.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.programs.map((program) => (
                <a
                  key={program.key}
                  href={urls[program.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-navy glow-border rounded-xl p-5 card-hover block"
                  style={{ borderLeft: `3px solid ${category.color}` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0" role="img" aria-hidden="true">
                      {program.emoji}
                    </span>
                    <div>
                      <div className="font-heading font-semibold text-text-primary mb-1">
                        {program.label}
                      </div>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
