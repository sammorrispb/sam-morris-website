"use client";

import { WIDGET_URLS } from "@/lib/locations";
import { trackEvent } from "@/lib/analytics";

const OPTIONS = [
  {
    label: "I'm new \u2014 help me get started",
    emoji: "\u{1F44B}",
    action: "scroll",
    target: "#first-visit",
  },
  {
    label: "Book a court",
    emoji: "\u{1F3D3}",
    action: "link",
    target: WIDGET_URLS.rockville.publicBooking,
  },
  {
    label: "Browse programs & events",
    emoji: "\u{1F4C5}",
    action: "scroll",
    target: "#programs",
  },
  {
    label: "Become a member",
    emoji: "\u{1F511}",
    action: "link",
    target: WIDGET_URLS.rockville.membership,
  },
] as const;

export function QuickStartSelector() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
      {OPTIONS.map((opt) => {
        if (opt.action === "link") {
          return (
            <a
              key={opt.label}
              href={opt.target}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-navy glow-border rounded-xl px-5 py-4 card-hover text-left"
              onClick={() => trackEvent("external_link", { label: opt.label, url: opt.target, page: "locations" })}
            >
              <span className="text-xl shrink-0" role="img" aria-hidden="true">
                {opt.emoji}
              </span>
              <span className="font-heading font-semibold text-sm text-text-primary">
                {opt.label}
              </span>
            </a>
          );
        }

        return (
          <a
            key={opt.label}
            href={opt.target}
            className="flex items-center gap-3 bg-navy glow-border rounded-xl px-5 py-4 card-hover text-left"
          >
            <span className="text-xl shrink-0" role="img" aria-hidden="true">
              {opt.emoji}
            </span>
            <span className="font-heading font-semibold text-sm text-text-primary">
              {opt.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
