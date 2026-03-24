import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { LeadForm } from "@/components/LeadForm";
import { WIDGET_URLS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Leagues — Dill Dinkers Rockville & North Bethesda",
  description:
    "Spring & Late Spring 2026 league schedules at Dill Dinkers. DUPR-based brackets with playoffs at Rockville and North Bethesda.",
  keywords: [
    "pickleball leagues Montgomery County",
    "pickleball league Rockville MD",
    "DUPR leagues near me",
    "indoor pickleball league",
    "pickleball league North Bethesda",
    "competitive pickleball Maryland",
    "pickleball league DMV",
    "Dill Dinkers leagues",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/leagues" },
  openGraph: {
    title: "Pickleball Leagues — Dill Dinkers Rockville & North Bethesda",
    description:
      "Spring & Late Spring 2026 league schedules. DUPR brackets, weekly seasons with playoffs.",
    url: "https://www.sammorrispb.com/programs/leagues",
  },
};

const ROCKVILLE_SCHEDULE = [
  { day: "Monday", time: "6:30 \u2013 8:15 PM", dupr: "3.0 \u2013 3.6" },
  { day: "Tuesday", time: "6:45 \u2013 8:30 PM", dupr: "3.5 \u2013 4.1" },
  { day: "Wednesday", time: "6:15 \u2013 8:00 PM", dupr: "2.5 \u2013 3.1" },
  { day: "Thursday", time: "5:00 \u2013 6:30 PM", dupr: "2.9 and Below" },
];

const NB_SCHEDULE = [
  { day: "Monday", time: "6:30 \u2013 8:15 PM", dupr: "3.5 \u2013 4.1" },
  { day: "Monday", time: "8:15 \u2013 10:00 PM", dupr: "2.4 \u2013 3.0" },
  { day: "Tuesday", time: "5:00 \u2013 6:30 PM", dupr: "2.9 and Below" },
  { day: "Tuesday", time: "6:30 \u2013 8:15 PM", dupr: "2.75 \u2013 3.5 (Women\u2019s)" },
  { day: "Wednesday", time: "6:30 \u2013 8:15 PM", dupr: "3.0 \u2013 3.6" },
  { day: "Wednesday", time: "8:15 \u2013 10:00 PM", dupr: "3.3 \u2013 3.9" },
];

const LATE_SPRING_ROCKVILLE = [
  { day: "Monday", time: "6:30 \u2013 8:15 PM", dupr: "3.3 \u2013 3.8" },
  { day: "Tuesday", time: "6:45 \u2013 8:30 PM", dupr: "3.7 \u2013 4.3" },
  { day: "Wednesday", time: "6:15 \u2013 8:00 PM", dupr: "2.7 \u2013 3.3" },
  { day: "Thursday", time: "6:30 \u2013 8:15 PM", dupr: "2.9 and Below" },
];

const LATE_SPRING_NB = [
  { day: "Monday", time: "6:30 \u2013 8:15 PM", dupr: "3.3 \u2013 3.8" },
  { day: "Monday", time: "8:15 \u2013 10:00 PM", dupr: "3.7 \u2013 4.3" },
  { day: "Tuesday", time: "4:45 \u2013 6:30 PM", dupr: "2.9 and Below" },
  { day: "Tuesday", time: "6:30 \u2013 8:15 PM", dupr: "2.75 \u2013 3.5 (Women\u2019s)" },
  { day: "Wednesday", time: "6:30 \u2013 8:15 PM", dupr: "2.8 \u2013 3.4" },
  { day: "Wednesday", time: "8:15 \u2013 10:00 PM", dupr: "3.4 \u2013 3.9" },
];

function ScheduleTable({ rows }: { rows: typeof ROCKVILLE_SCHEDULE }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm table-dd">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Day</th>
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Time</th>
            <th className="py-3 font-heading font-semibold text-text-primary">Skill Range (DUPR)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="py-3 pr-4 font-semibold text-text-primary">{r.day}</td>
              <td className="py-3 pr-4 text-text-muted">{r.time}</td>
              <td className="py-3 font-semibold text-text-primary">{r.dupr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SECTIONS = [
  { id: "rockville", label: "Rockville" },
  { id: "north-bethesda", label: "North Bethesda" },
  { id: "late-spring", label: "Late Spring" },
  { id: "format-rules", label: "Format & Rules" },
  { id: "dupr", label: "DUPR" },
  { id: "sub-rules", label: "Sub Rules" },
  { id: "partner-finder", label: "Partner Finder" },
];

export default function LeaguesPage() {
  return (
    <div className="page-dill-dinkers">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Do I need a DUPR rating to join a pickleball league at Dill Dinkers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, a free DUPR account is required for all Dill Dinkers leagues. Results are entered weekly to track community skill levels. Leagues 3.5+ require a team average of at least 3.5. Sign up at dupr.com.",
                },
              },
              {
                "@type": "Question",
                name: "How long is a pickleball league season at Dill Dinkers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Each league season runs 6 weeks of regular play plus a Week 7 playoff for qualifying teams. Games are played to 15 points (win by 2) during the regular season. Multiple bracket levels are available at both Rockville and North Bethesda.",
                },
              },
            ],
          }),
        }}
      />
      {/* SportsEvent Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: "Dill Dinkers Spring 2026 Pickleball Leagues",
            description:
              "6-week indoor pickleball league season with DUPR-based brackets and Week 7 playoffs at Dill Dinkers Rockville and North Bethesda.",
            sport: "Pickleball",
            startDate: "2026-03-02",
            endDate: "2026-04-25",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: [
              {
                "@type": "Place",
                name: "Dill Dinkers Rockville",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "40C Southlawn Court",
                  addressLocality: "Rockville",
                  addressRegion: "MD",
                  postalCode: "20850",
                  addressCountry: "US",
                },
              },
              {
                "@type": "Place",
                name: "Dill Dinkers North Bethesda",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "4942 Boiling Brook Pkwy",
                  addressLocality: "North Bethesda",
                  addressRegion: "MD",
                  postalCode: "20852",
                  addressCountry: "US",
                },
              },
            ],
            organizer: {
              "@type": "Person",
              name: "Sam Morris",
              url: "https://www.sammorrispb.com",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: "Dill Dinkers Late Spring 2026 Pickleball Leagues",
            description:
              "6-week indoor pickleball league season with DUPR-based brackets and Week 7 playoffs at Dill Dinkers Rockville and North Bethesda.",
            sport: "Pickleball",
            startDate: "2026-04-27",
            endDate: "2026-06-13",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: [
              {
                "@type": "Place",
                name: "Dill Dinkers Rockville",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "40C Southlawn Court",
                  addressLocality: "Rockville",
                  addressRegion: "MD",
                  postalCode: "20850",
                  addressCountry: "US",
                },
              },
              {
                "@type": "Place",
                name: "Dill Dinkers North Bethesda",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "4942 Boiling Brook Pkwy",
                  addressLocality: "North Bethesda",
                  addressRegion: "MD",
                  postalCode: "20852",
                  addressCountry: "US",
                },
              },
            ],
            organizer: {
              "@type": "Person",
              name: "Sam Morris",
              url: "https://www.sammorrispb.com",
            },
          },
          ]),
        }}
      />
      <PageSectionNav sections={SECTIONS} brandColor="#F47920" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-dill-dinkers">
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="brand-badge brand-badge-dd mb-4">Dill Dinkers</span>
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
            <span className="gradient-text-dd">Leagues</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Spring &amp; Late Spring 2026 League Schedules
          </p>
          <p className="text-sm text-[#F47920] mt-3 font-semibold">
            Spring: March 2 &ndash; April 25 &nbsp;|&nbsp; Late Spring: April 27 &ndash; June 13
          </p>
        </div>
      </section>

      {/* Spring Season Header */}
      <section id="rockville" className="pt-16 pb-4 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#F47920]">
            Spring 2026 &mdash; March 2 through April 25
          </p>
        </div>
      </section>

      {/* Rockville Schedule */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Rockville
            </h2>
            <div className="card-dd p-6 mb-6">
              <ScheduleTable rows={ROCKVILLE_SCHEDULE} />
            </div>
            <a
              href={WIDGET_URLS.rockville.leagues}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
            >
              Register for Rockville Leagues
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* NB Schedule */}
      <section id="north-bethesda" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <h2 className="font-heading text-2xl md:text-3xl mb-6">
                  North Bethesda
                </h2>
                <div className="card-dd p-6 mb-6">
                  <ScheduleTable rows={NB_SCHEDULE} />
                </div>
                <a
                  href={WIDGET_URLS.northBethesda.leagues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
                >
                  Register for North Bethesda Leagues
                </a>
              </div>
              <div className="hidden md:block w-48 shrink-0 mt-10">
                <Image
                  src="/images/cc-00579.jpg"
                  alt="League play at Dill Dinkers"
                  width={192}
                  height={256}
                  className="rounded-xl glow-border-dd object-cover"
                />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* League Break Callout */}
      <section className="py-8 px-6">
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-xl p-5"
            style={{
              borderLeft: "3px solid #F47920",
              background: "rgba(244, 121, 32, 0.04)",
            }}
          >
            <p className="text-[#F47920] font-heading font-bold text-sm mb-1">League Break</p>
            <p className="text-text-muted text-sm">
              March 30 &ndash; April 3 — No league games during MCPS Spring Break &amp; Easter week.
            </p>
          </div>
        </div>
      </section>

      {/* Late Spring Season */}
      <section id="late-spring" className="pt-16 pb-4 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <div className="border-t border-white/10 pt-12">
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#F47920]">
              Late Spring 2026 &mdash; April 27 through June 13
            </p>
          </div>
        </div>
      </section>

      {/* Late Spring Rockville */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Rockville
            </h2>
            <div className="card-dd p-6 mb-6">
              <ScheduleTable rows={LATE_SPRING_ROCKVILLE} />
            </div>
            <a
              href={WIDGET_URLS.rockville.leagues}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
            >
              Register for Rockville Leagues
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Late Spring NB */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <h2 className="font-heading text-2xl md:text-3xl mb-6">
                  North Bethesda
                </h2>
                <div className="card-dd p-6 mb-6">
                  <ScheduleTable rows={LATE_SPRING_NB} />
                </div>
                <a
                  href={WIDGET_URLS.northBethesda.leagues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
                >
                  Register for North Bethesda Leagues
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Format & Rules */}
      <section id="format-rules" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">
              Format &amp; Game Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-dd p-6">
                <h3 className="font-heading text-lg mb-3">Regular Season</h3>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li>Games to 15 points, win by 2</li>
                  <li>5 points per win, 0 for a loss</li>
                  <li>If tied at time expiry, play 1 rally to decide</li>
                  <li>6-week season, 4&ndash;6 games per session</li>
                  <li>Same partner all season</li>
                </ul>
              </div>
              <div className="card-dd p-6">
                <h3 className="font-heading text-lg mb-3">Playoffs (Week 7)</h3>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li>Top half of teams qualify (rounded up)</li>
                  <li>Double elimination bracket</li>
                  <li>Games to 11, win by 2</li>
                  <li>Final game to 15 if time permits</li>
                  <li>Tiebreaker: point differential</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* DUPR */}
      <section id="dupr" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              DUPR Requirements
            </h2>
            <div className="card-dd p-6">
              <ul className="space-y-3 text-text-muted text-sm">
                <li>A <strong className="text-text-primary">free DUPR account</strong> is required for all leagues (<a href="https://www.dupr.com" target="_blank" rel="noopener noreferrer" className="text-[#F47920] hover:text-[#8BC751] transition-colors">www.dupr.com</a>)</li>
                <li>Results are entered weekly to track community skill levels</li>
                <li>Leagues 3.5+ require a <strong className="text-text-primary">team average</strong> of at least 3.5</li>
                <li>Other leagues have no minimum, but team DUPR cannot exceed the bracket cap</li>
                <li>Constraints an issue? Contact <a href="mailto:smorris@dilldinkers.com" className="text-[#F47920] hover:text-[#8BC751] transition-colors">smorris@dilldinkers.com</a></li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Sub Rules */}
      <section id="sub-rules" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Sub Rules
            </h2>
            <div className="card-dd p-6">
              <ul className="space-y-3 text-text-muted text-sm">
                <li>Email the facility with as much notice as possible: <strong className="text-text-primary">which league</strong> (day, level, time) and which player needs a sub</li>
                <li>Rockville: <a href="mailto:rockville@dilldinkers.com" className="text-[#F47920] hover:text-[#8BC751] transition-colors">rockville@dilldinkers.com</a></li>
                <li>North Bethesda: <a href="mailto:northbethesda@dilldinkers.com" className="text-[#F47920] hover:text-[#8BC751] transition-colors">northbethesda@dilldinkers.com</a></li>
                <li>Teams with <strong className="text-text-primary">1 sub</strong> earn points as normal</li>
                <li>Teams with <strong className="text-text-primary">2 subs</strong> forfeit all games that week</li>
                <li>Sub should be under the league DUPR cap and must have a DUPR account</li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Partner Finder */}
      <section id="partner-finder" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="card-dd p-8 text-center">
            <h2 className="font-heading font-bold text-xl mb-3">
              Need a Partner?
            </h2>
            <p className="text-text-muted text-sm mb-6">
              Complete the partner finder form or post in the Link &amp; Dink community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://sammorrispb.notion.site/277fa3ac27dc800b9b0adeaa30dfe34b?pvs=105"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-dd text-sm"
              >
                Partner Finder Form
              </a>
              <a
                href="https://www.linkanddink.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-heading font-semibold px-6 py-3 rounded-lg border border-[rgba(244,121,32,0.2)] text-text-muted hover:border-[rgba(244,121,32,0.4)] hover:text-text-primary transition-all text-sm"
              >
                Link &amp; Dink Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <LeadForm heading="Interested in Leagues?" />
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <Link href="/programs/hub" className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold text-sm">
            &larr; Program Hub
          </Link>
          <Link href="/programs/open-play" className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold text-sm">
            Open Play &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
