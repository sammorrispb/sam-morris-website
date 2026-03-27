"use client";

import { GROWTH_PATHWAY, WIDGET_URLS, type PathwayLink } from "@/lib/locations";
import { trackEvent } from "@/lib/analytics";

/** Resolve a pathway link href — widget keys become Rockville URLs, everything else passes through */
function resolveHref(href: string): string {
  if (href.startsWith("#") || href.startsWith("/") || href.startsWith("http")) {
    return href;
  }
  // Treat as a widget key (e.g. "openPlay" → Rockville URL)
  const key = href as keyof typeof WIDGET_URLS.rockville;
  return WIDGET_URLS.rockville[key] ?? href;
}

function PathwayLinkButton({ link }: { link: PathwayLink }) {
  const href = resolveHref(link.href);
  const isExternal = link.external || href.startsWith("http");

  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-block text-xs font-heading font-semibold px-3 py-1.5 rounded-md border border-white/10 text-text-muted hover:border-accent-blue/40 hover:text-text-primary transition-all"
      onClick={() => isExternal && trackEvent("external_link", { label: link.label, url: href, page: "locations" })}
    >
      {link.label}
      {isExternal && (
        <span className="ml-1 opacity-50" aria-hidden="true">
          {"\u2197"}
        </span>
      )}
    </a>
  );
}

export function GrowthPathway() {
  return (
    <>
      {/* Desktop: horizontal stepper */}
      <div className="hidden md:block">
        <div className="relative flex justify-between items-start">
          {/* Connector line */}
          <div
            className="absolute top-5 left-5 right-5 h-0.5"
            style={{
              background: "linear-gradient(90deg, #8BC751, #4DACD0, #F47920)",
            }}
          />

          {GROWTH_PATHWAY.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
              style={{ width: `${100 / GROWTH_PATHWAY.length}%` }}
            >
              <div
                className="w-10 h-10 rounded-full bg-navy-light border-2 flex items-center justify-center font-heading font-bold text-sm z-10"
                style={{
                  borderColor: "#4DACD0",
                  boxShadow:
                    "0 0 12px rgba(77, 172, 208, 0.4), 0 0 24px rgba(77, 172, 208, 0.2)",
                }}
              >
                {step.number}
              </div>
              <h3 className="font-heading font-semibold mt-4 mb-1 text-sm">
                {step.title}
              </h3>
              <p className="text-text-muted text-xs leading-relaxed px-2 mb-2">
                {step.description}
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {step.links.map((link) => (
                  <PathwayLinkButton key={link.label} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden relative">
        <div
          className="absolute left-[5px] top-0 bottom-0 w-0.5"
          style={{ backgroundColor: "rgba(77, 172, 208, 0.2)" }}
        />
        <div className="flex flex-col gap-8">
          {GROWTH_PATHWAY.map((step) => (
            <div key={step.number} className="relative pl-10">
              <div
                className="absolute left-0 top-1.5 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: "#4DACD0",
                  boxShadow:
                    "0 0 8px rgba(77, 172, 208, 0.6), 0 0 20px rgba(77, 172, 208, 0.3)",
                }}
              />
              <div
                className="font-mono text-sm mb-1"
                style={{ color: "#4DACD0" }}
              >
                Step {step.number}
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">
                {step.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-2">
                {step.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {step.links.map((link) => (
                  <PathwayLinkButton key={link.label} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
