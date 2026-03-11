import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { LocationProgramsGrid } from "@/components/LocationProgramsGrid";
import { QuickStartSelector } from "@/components/QuickStartSelector";
import { GrowthPathway } from "@/components/GrowthPathway";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import {
  LOCATIONS,
  LOCATION_ORDER,
  WIDGET_URLS,
  BENEFITS,
  COMMUNITY_LINKS,
  FIRST_VISIT,
  FIRST_VISIT_TESTIMONIAL,
} from "@/lib/locations";

export const metadata: Metadata = {
  title: "Locations — Indoor Pickleball at Dill Dinkers Rockville & North Bethesda",
  description:
    "Two indoor pickleball facilities in Montgomery County, MD — Dill Dinkers Rockville and North Bethesda. 17 courts, year-round play, leagues, coaching, and events. Convenient to DC and Northern Virginia.",
  keywords: [
    "indoor pickleball facility Rockville",
    "indoor pickleball North Bethesda",
    "Dill Dinkers locations",
    "indoor pickleball courts near me",
    "pickleball courts Montgomery County MD",
    "indoor pickleball near DC",
    "pickleball facility Northern Virginia",
    "where to play pickleball Rockville",
    "pickleball courts Bethesda area",
  ],
};

const SECTIONS = [
  { id: "quick-start", label: "Quick Start" },
  { id: "benefits", label: "Why Dill Dinkers" },
  { id: "first-visit", label: "First Visit" },
  { id: "locations", label: "Facilities" },
  { id: "programs", label: "Programs" },
  { id: "pathway", label: "Growth Pathway" },
  { id: "community", label: "Community" },
];

export default function LocationsPage() {
  return (
    <>
      <PageSectionNav sections={SECTIONS} brandColor="#3b82f6" />
      <BackToTop />

      {/* ─── Section 1: Hero ─── */}
      <section
        id="locations-hero"
        className="relative py-20 md:py-28 px-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-3">
              Where to <span className="gradient-text">Play</span>
            </h1>
            <p className="text-accent-blue font-heading font-semibold text-lg md:text-xl mb-6">
              Director of Programming — Dill Dinkers Rockville &amp; North Bethesda
            </p>
            <p className="text-text-muted text-lg md:text-xl max-w-2xl mb-8">
              I lead programming at two dedicated indoor pickleball facilities in
              Montgomery County, MD — serving players from DC, Northern Virginia,
              and the greater DMV.
            </p>

            {/* Compact facility info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {LOCATION_ORDER.map((id) => {
                const loc = LOCATIONS[id];
                return (
                  <div key={id} className="text-sm text-text-muted space-y-1">
                    <p className="font-heading font-semibold text-text-primary">{loc.name}</p>
                    <p>{loc.address}, {loc.city}, {loc.state} {loc.zip}</p>
                    <p>
                      <a href={`tel:${loc.phone.replace(/-/g, "")}`} className="hover:text-accent-blue transition-colors">{loc.phone}</a>
                      {" · "}
                      <a href={`mailto:${loc.email}`} className="hover:text-accent-blue transition-colors">{loc.email}</a>
                    </p>
                  </div>
                );
              })}
            </div>

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

      {/* ─── Section 2: Quick Start ─── */}
      <section id="quick-start" className="py-12 px-6 border-b border-white/5 scroll-mt-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-xl md:text-2xl mb-6 text-center">
            What brings you here?
          </h2>
          <QuickStartSelector />
        </div>
      </section>

      {/* ─── Section 3: Benefits ─── */}
      <section id="benefits" className="bg-navy-light py-20 px-6 scroll-mt-16">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Why Dill Dinkers&reg;?
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Fun, community, and great programming &mdash; all under one
                roof.
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

      {/* ─── Section 4: First Visit Guide ─── */}
      <section id="first-visit" className="py-20 px-6 scroll-mt-16">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Your First Visit
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Never been to Dill Dinkers? Here&rsquo;s everything you need to know.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {FIRST_VISIT.map((item) => (
                <div
                  key={item.title}
                  className="bg-navy-light glow-border rounded-xl p-6"
                >
                  <span className="text-2xl mb-3 block" role="img" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-navy-light glow-border rounded-xl p-8 text-center max-w-2xl mx-auto mb-10">
              <blockquote className="text-text-primary text-lg italic leading-relaxed mb-3">
                &ldquo;{FIRST_VISIT_TESTIMONIAL.quote}&rdquo;
              </blockquote>
              <cite className="text-text-muted text-sm not-italic">
                &mdash; {FIRST_VISIT_TESTIMONIAL.author}
              </cite>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href={WIDGET_URLS.rockville.openPlay}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
              >
                Sign Up for Open Play
              </a>
              <p className="text-text-muted text-sm mt-3">
                No experience needed. All levels welcome.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Section 5: Location Cards ─── */}
      <section id="locations" className="bg-navy-light py-20 px-6 scroll-mt-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-center">
            Two Locations, One Community
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-12 text-center">
            Quality courts, welcoming community, and a full calendar of
            events at both locations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LOCATION_ORDER.map((id) => {
              const loc = LOCATIONS[id];
              const urls = WIDGET_URLS[id];
              return (
                <div
                  key={id}
                  className="bg-navy glow-border rounded-xl p-8"
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

      {/* ─── Section 6: Browse Programs ─── */}
      <section id="programs" className="py-20 px-6 scroll-mt-16">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Browse Programs
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Detailed schedules, registration links, and everything you need to get started.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { href: "/programs/leagues", title: "Leagues", desc: "6-week seasons with DUPR brackets and playoffs" },
                { href: "/programs/open-play", title: "Open Play", desc: "Drop-in sessions for all skill levels" },
                { href: "/programs/coached-open-play", title: "Coached Open Play", desc: "Play real games with real-time coaching" },
                { href: "https://tournamentwebsite.vercel.app/", title: "Tournaments", desc: "Link & Dink series with medals and raffles", external: true },
                { href: "/programs/coaching", title: "Coaching & Clinics", desc: "Private lessons, group clinics, and coach profiles" },
                { href: "/programs/youth", title: "Youth Programs", desc: "Next Gen Academy and summer camp for ages 5\u201316" },
              ].map((prog) => {
                const content = (
                  <>
                    <h3 className="font-heading font-semibold text-lg mb-2 text-text-primary">
                      {prog.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {prog.desc}
                    </p>
                    <span className="text-accent-blue text-sm font-semibold mt-3 inline-block">
                      View Details &rarr;
                    </span>
                  </>
                );
                return prog.external ? (
                  <a
                    key={prog.href}
                    href={prog.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-navy glow-border rounded-xl p-6 card-hover block"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={prog.href}
                    href={prog.href}
                    className="bg-navy glow-border rounded-xl p-6 card-hover block"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="text-center mb-10">
              <h3 className="font-heading font-bold text-xl md:text-2xl mb-4">
                Quick Register by Location
              </h3>
              <p className="text-text-muted max-w-2xl mx-auto mb-6">
                Or jump straight to CourtReserve to browse and register.
              </p>
            </div>
            <LocationProgramsGrid />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Section 7: Growth Pathway (interactive) ─── */}
      <section id="pathway" className="bg-navy-light py-20 px-6 scroll-mt-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-12 text-center">
            Your Pathway to Growth
          </h2>
          <GrowthPathway />
        </div>
      </section>

      {/* ─── Section 8: Community ─── */}
      <section id="community" className="py-20 px-6 scroll-mt-16">
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
                  className="bg-navy-light glow-border rounded-xl p-6 text-center hover:scale-[1.02] transition-transform"
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

      {/* ─── Section 9: Serving the DMV ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
            Serving the Greater DMV
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-2xl mx-auto">
            As Director of Programming at Dill Dinkers, I oversee programming across
            our Rockville and North Bethesda facilities &mdash; centrally located for
            players across Montgomery County, Washington DC, and Northern Virginia.
            Whether you&rsquo;re coming from Silver Spring, Bethesda, Chevy Chase,
            Potomac, Gaithersburg, Arlington, Fairfax, McLean, or Tysons &mdash;
            you&rsquo;re never more than a short drive from 17 dedicated indoor
            pickleball courts, year-round programming, and a welcoming community.
          </p>
        </div>
      </section>

      {/* ─── Section 10: Bottom CTA ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-navy glow-border rounded-xl p-10 text-center">
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
