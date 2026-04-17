import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { LeadForm } from "@/components/LeadForm";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { WIDGET_URLS } from "@/lib/locations";
import { breadcrumbJsonLd } from "@/lib/seo";
import { hubUrl, crUrl } from "@/lib/urls";
import { RelatedPrograms } from "@/components/RelatedPrograms";

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
    images: [
      {
        url: "/og?title=Pickleball%20Leagues&subtitle=DUPR%20Brackets%20%C2%B7%20Spring%202026%20%C2%B7%20Rockville%20%26%20North%20Bethesda",
        width: 1200,
        height: 630,
        alt: "Pickleball Leagues at Dill Dinkers",
      },
    ],
  },
};

const LATE_SPRING_ROCKVILLE = [
  { day: "Monday", time: "6:30 \u2013 8:15 PM", dupr: "3.3 \u2013 3.8", eventName: "Late Spring League: DUPR 3.3-3.8", url: "https://app.courtreserve.com/online/publicbookings/10869?tab=explore&eventId=1969929&reservationId=50638007" },
  { day: "Tuesday", time: "6:45 \u2013 8:30 PM", dupr: "3.7 \u2013 4.3", eventName: "Late Spring League: DUPR 3.7-4.3", url: "https://app.courtreserve.com/online/publicbookings/10869?tab=explore&eventId=1969935&reservationId=50646305" },
  { day: "Wednesday", time: "6:15 \u2013 8:00 PM", dupr: "2.7 \u2013 3.3", eventName: "Late Spring League: DUPR 2.7-3.3", url: "https://app.courtreserve.com/online/publicbookings/10869?tab=explore&eventId=2016912&reservationId=52174427" },
  { day: "Thursday", time: "6:30 \u2013 8:15 PM", dupr: "2.9 and Below", eventName: "Late Spring League: DUPR 2.9 and BELOW", url: "https://app.courtreserve.com/online/publicbookings/10869?tab=explore&eventId=1969874&reservationId=50635837" },
];

const LATE_SPRING_NB = [
  { day: "Monday", time: "6:30 \u2013 8:15 PM", dupr: "3.3 \u2013 3.8", eventName: "Late Spring League: 3.3-3.8", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1970069&reservationId=50642559" },
  { day: "Monday", time: "8:15 \u2013 10:00 PM", dupr: "3.7 \u2013 4.3", eventName: "Late Spring League: 3.7-4.3", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=2024164&reservationId=52413235" },
  { day: "Tuesday", time: "4:45 \u2013 6:30 PM", dupr: "2.9 and Below", eventName: "Late Spring League: 2.9 and BELOW", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1970168&reservationId=50645240" },
  { day: "Tuesday", time: "6:30 \u2013 8:15 PM", dupr: "2.75 \u2013 3.5 (Women\u2019s)", eventName: "Late Spring League: WOMEN ONLY 2.75-3.5", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1970172&reservationId=50645303" },
  { day: "Wednesday", time: "6:30 \u2013 8:15 PM", dupr: "2.8 \u2013 3.4", eventName: "Late Spring League: 2.8-3.4", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1970175&reservationId=50645395" },
  { day: "Wednesday", time: "8:15 \u2013 10:00 PM", dupr: "3.4 \u2013 3.9", eventName: "Late Spring League: 3.4-3.9", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1970178&reservationId=50645533" },
];

type LateSpringRow = { day: string; time: string; dupr: string; eventName: string; url: string };

function LateSpringTable({ rows }: { rows: LateSpringRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm table-dd">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Day</th>
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Time</th>
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Event</th>
            <th className="py-3 font-heading font-semibold text-text-primary">Register</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="py-3 pr-4 font-semibold text-text-primary">{r.day}</td>
              <td className="py-3 pr-4 text-text-muted">{r.time}</td>
              <td className="py-3 pr-4 font-semibold text-text-primary">{r.eventName}</td>
              <td className="py-3">
                <TrackedExternalLink
                  href={crUrl(r.url)}
                  label={`Register — ${r.eventName}`}
                  page="leagues"
                  className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold"
                >
                  Sign Up &rarr;
                </TrackedExternalLink>
              </td>
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
  { id: "format-rules", label: "Format & Rules" },
  { id: "dupr", label: "DUPR" },
  { id: "sub-rules", label: "Sub Rules" },
  { id: "partner-finder", label: "Partner Finder" },
];

export default function LeaguesPage() {
  return (
    <div className="page-dill-dinkers">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Programs", href: "/programs" },
              { name: "Leagues", href: "/programs/leagues" },
            ])
          ),
        }}
      />
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
      <ScrollDepthTracker page="leagues" />
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
            Late Spring 2026 League Schedule
          </p>
          <p className="text-sm text-[#F47920] mt-3 font-semibold">
            Late Spring: April 27 &ndash; June 13 &middot; Registration Open
          </p>
        </div>
      </section>

      {/* Late Spring Rockville */}
      <section id="rockville" className="pt-16 pb-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Rockville
            </h2>
            <div className="card-dd p-6 mb-6">
              <LateSpringTable rows={LATE_SPRING_ROCKVILLE} />
            </div>
            <TrackedExternalLink
              href={WIDGET_URLS.rockville.leagues}
              label="Register — Rockville Leagues"
              page="leagues"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
            >
              Browse All Rockville Leagues
            </TrackedExternalLink>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Late Spring NB */}
      <section id="north-bethesda" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <h2 className="font-heading text-2xl md:text-3xl mb-6">
                  North Bethesda
                </h2>
                <div className="card-dd p-6 mb-6">
                  <LateSpringTable rows={LATE_SPRING_NB} />
                </div>
                <TrackedExternalLink
                  href={WIDGET_URLS.northBethesda.leagues}
                  label="Register — NB Leagues"
                  page="leagues"
                  className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
                >
                  Browse All North Bethesda Leagues
                </TrackedExternalLink>
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
              Tell Link &amp; Dink what you&apos;re looking for — we&apos;ll match you with a partner at your level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <TrackedExternalLink
                href={hubUrl("/#play", { utm_campaign: "find_partner" })}
                label="Find a Partner"
                page="leagues"
                className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-dd text-sm"
              >
                Find a Partner
              </TrackedExternalLink>
              <TrackedExternalLink
                href={hubUrl("/")}
                label="Link & Dink Community"
                page="leagues"
                className="inline-block font-heading font-semibold px-6 py-3 rounded-lg border border-[rgba(244,121,32,0.2)] text-text-muted hover:border-[rgba(244,121,32,0.4)] hover:text-text-primary transition-all text-sm"
              >
                Link &amp; Dink Community
              </TrackedExternalLink>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <LeadForm heading="Interested in Leagues?" page="leagues" />
        </div>
      </section>

      <RelatedPrograms currentPath="/programs/leagues" />

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
