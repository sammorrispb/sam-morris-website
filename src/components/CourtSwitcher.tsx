"use client";

import { COURT_SWITCHER_LABEL, FAMILY_CORNERS } from "@/lib/constants";
import { trackEvent } from "@/lib/funnelClient";
import { familyMarketingRef, familySiteUrl } from "@/lib/urls";

/**
 * Footer court switcher: Sam's sites drawn as the service boxes of a court
 * plan (light lines on a dark court). The box for the site you are on is lit
 * in amber and is plain text, not a link. The other boxes open in a new tab.
 *
 * The footer sits on a photo, so the switcher carries its own fully opaque
 * panel: every text/background pair below is a fixed pair of design tokens
 * and one contrast check holds on every page.
 *   cream  #F4ECE0 on cocoa #1B1815  (link, resting)
 *   amber  #E8A03A on sand  #25201B  (link, hover)
 *   cocoa  #1B1815 on amber #E8A03A  (current site)
 *
 * Rendered entirely from FAMILY_CORNERS, in list order at every width: rows
 * on a phone, side by side from the `sm` breakpoint. No CSS reordering.
 */

// Court lines: cream, 2px, between boxes and around the court.
const LINE = "border-cream/70";

const BOX =
  "flex min-h-12 w-full items-center justify-center gap-1.5 px-4 py-3 text-center font-heading text-sm font-semibold leading-snug";

export function CourtSwitcher() {
  return (
    <nav aria-label={COURT_SWITCHER_LABEL} data-court-switcher>
      <ul
        className={`grid grid-cols-1 sm:grid-flow-col sm:auto-cols-fr border-2 ${LINE} bg-navy-light`}
      >
        {FAMILY_CORNERS.map((corner, i) => {
          const line =
            i === 0 ? "" : `border-t-2 sm:border-t-0 sm:border-l-2 ${LINE}`;

          if (!corner.dest) {
            return (
              <li
                key={corner.id}
                data-corner={corner.id}
                aria-current="page"
                className={`flex min-w-0 ${line}`}
              >
                <span className={`${BOX} bg-accent-blue text-navy-light`}>
                  {corner.name}
                </span>
              </li>
            );
          }

          const dest = corner.dest;
          const label = `switcher_${corner.id}`;
          const href = familySiteUrl(dest, "/", { content: label });
          return (
            <li key={corner.id} data-corner={corner.id} className={`flex min-w-0 ${line}`}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BOX} bg-navy-light text-text-primary transition-colors motion-reduce:transition-none hover:bg-sand hover:text-accent-blue focus-visible:bg-sand focus-visible:-outline-offset-4!`}
                onClick={() =>
                  trackEvent(
                    "external_link",
                    { label, url: href, page: "footer" },
                    familyMarketingRef(dest),
                  )
                }
              >
                <span className="min-w-0">{corner.name}</span>
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
