import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { LocationProgramsGrid } from "@/components/LocationProgramsGrid";
import {
  LOCATIONS,
  LOCATION_ORDER,
  WIDGET_URLS,
  BENEFITS,
  GROWTH_PATHWAY,
  COMMUNITY_LINKS,
} from "@/lib/locations";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Play at Dill Dinkers Rockville and North Bethesda. Indoor courts, programs for all levels, coaching, leagues, and community events in Montgomery County, MD.",
};

export default function LocationsPage() {
  return (
    <>
      {/* ─── Section 1: Hero ─── */}
      <section className="relative py-20 md:py-28 px-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
              Where to <span className="gradient-text">Play</span>
            </h1>
            <p className="text-text-muted text-lg md:text-xl max-w-2xl mb-8">
              Two indoor facilities in Montgomery County, MD &mdash; with
              programs, coaching, and community for every level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="#programs"
                className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
              >
                Browse Programs
              </a>
              <a
                href={WIDGET_URLS.rockville.membership}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-heading font-semibold px-8 py-3 rounded-lg border border-white/10 text-text-muted hover:border-accent-blue/40 hover:text-text-primary transition-all"
              >
                Become a Member
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden glow-border">
              <Image
                src="/images/sam-group-selfie.jpg"
                alt="Sam Morris with community members"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Benefits ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Why Dill Dinkers?
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Everything you need to play, improve, and connect &mdash; under
                one roof.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="bg-navy glow-border rounded-xl p-6 card-hover"
                >
                  <span className="text-2xl mb-3 block" role="img" aria-hidden="true">
                    {b.emoji}
                  </span>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {b.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Section 3: Location Cards ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-center">
            Two Locations, One Community
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-12 text-center">
            Both facilities offer indoor courts, pro coaching, and a full
            calendar of events.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LOCATION_ORDER.map((id) => {
              const loc = LOCATIONS[id];
              const urls = WIDGET_URLS[id];
              return (
                <div
                  key={id}
                  className="bg-navy-light glow-border rounded-xl p-8"
                >
                  <h3 className="font-heading font-bold text-xl mb-4">
                    {loc.name}
                  </h3>
                  <div className="space-y-2 text-text-muted text-sm mb-6">
                    <p>
                      {loc.address}, {loc.city}, {loc.state} {loc.zip}
                    </p>
                    <p>
                      <a
                        href={`tel:${loc.phone.replace(/-/g, "")}`}
                        className="hover:text-accent-blue transition-colors"
                      >
                        {loc.phone}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`mailto:${loc.email}`}
                        className="hover:text-accent-blue transition-colors"
                      >
                        {loc.email}
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={urls.publicBooking}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-white font-heading font-semibold px-5 py-2.5 rounded-lg btn-gradient text-sm"
                    >
                      Book a Court
                    </a>
                    <a
                      href={urls.membership}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-heading font-semibold px-5 py-2.5 rounded-lg border border-white/10 text-text-muted hover:border-accent-blue/40 hover:text-text-primary transition-all text-sm"
                    >
                      Become a Member
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Programs Grid ─── */}
      <section id="programs" className="bg-navy-light py-20 px-6 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Programs &amp; Events
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Select your location to browse and register.
              </p>
            </div>
            <LocationProgramsGrid />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Section 5: Growth Pathway ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-12 text-center">
            Your Pathway to Growth
          </h2>

          {/* Desktop: horizontal stepper */}
          <div className="hidden md:block">
            <div className="relative flex justify-between items-start">
              {/* Connector line */}
              <div
                className="absolute top-5 left-5 right-5 h-0.5"
                style={{
                  background:
                    "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                }}
              />

              {GROWTH_PATHWAY.map((step) => (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  style={{ width: `${100 / GROWTH_PATHWAY.length}%` }}
                >
                  <div
                    className="w-10 h-10 rounded-full bg-navy-light border-2 border-accent-blue flex items-center justify-center font-heading font-bold text-sm z-10"
                    style={{
                      boxShadow:
                        "0 0 12px rgba(59, 130, 246, 0.4), 0 0 24px rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-heading font-semibold mt-4 mb-1 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed px-2">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline (About page pattern) */}
          <div className="md:hidden relative">
            <div
              className="absolute left-[5px] top-0 bottom-0 w-0.5"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
            />
            <div className="flex flex-col gap-8">
              {GROWTH_PATHWAY.map((step) => (
                <div key={step.number} className="relative pl-10">
                  <div
                    className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-accent-blue"
                    style={{
                      boxShadow:
                        "0 0 8px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.3)",
                    }}
                  />
                  <div className="font-mono text-accent-blue text-sm mb-1">
                    Step {step.number}
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: Community ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">
              Join the Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMMUNITY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-navy glow-border rounded-xl p-6 text-center hover:scale-[1.02] transition-transform"
                >
                  <div
                    className="font-mono text-sm uppercase tracking-wider mb-2"
                    style={{ color: link.tagColor }}
                  >
                    {link.tag}
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {link.label}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Section 7: Bottom CTA ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-navy-light glow-border rounded-xl p-10 text-center">
            <p className="font-heading font-bold text-xl md:text-2xl mb-6">
              Not sure where to start?
            </p>
            <Link
              href="/contact"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
            >
              Book a Free Evaluation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
