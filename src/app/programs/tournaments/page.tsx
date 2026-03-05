import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Link & Dink Tournament Series — Rockville & North Bethesda",
  description:
    "Link & Dink tournament series schedule. Round robin pools, bracket play, medals at Dill Dinkers Rockville and North Bethesda.",
  keywords: [
    "pickleball tournaments Montgomery County",
    "pickleball tournament Rockville",
    "DUPR tournament near me",
    "indoor pickleball tournament Maryland",
    "pickleball tournaments DMV",
    "Link and Dink tournament",
    "pickleball bracket play",
    "pickleball tournament North Bethesda",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/tournaments" },
  openGraph: {
    title: "Link & Dink Tournament Series Schedule",
    description: "Pickleball tournaments with round robin pools, playoff brackets, and medals.",
    url: "https://www.sammorrispb.com/programs/tournaments",
  },
};

const ROCKVILLE_BRACKETS = [
  {
    name: "3.0\u20133.5",
    dates: [
      { date: "Sun, Dec 14, 2025", time: "12:30 \u2013 3:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690308" },
      { date: "Sun, Jan 25, 2026", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690308" },
      { date: "Sun, Mar 1, 2026", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690308" },
    ],
  },
  {
    name: "3.5\u20134.0",
    dates: [
      { date: "Sun, Nov 30, 2025", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690225" },
      { date: "Sun, Jan 11, 2026", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690225" },
      { date: "Sun, Feb 15, 2026", time: "7:00 \u2013 10:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690225" },
      { date: "Sun, Mar 22, 2026", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690225" },
    ],
  },
  {
    name: "Women\u2019s 3.0\u20133.5",
    dates: [
      { date: "Sun, Dec 21, 2025", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690317" },
      { date: "Sun, Feb 1, 2026", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690317" },
      { date: "Sun, Mar 8, 2026", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1690317" },
    ],
  },
  {
    name: "Women\u2019s 3.5\u20134.0",
    dates: [
      { date: "Sun, Dec 28, 2025", time: "4:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1761205" },
    ],
  },
];

const NB_BRACKETS = [
  {
    name: "Intermediate 3.0\u20133.5",
    dates: [
      { date: "Sat, Jan 3, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690083" },
      { date: "Sat, Feb 7, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690083" },
      { date: "Sat, Mar 14, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690083" },
    ],
  },
  {
    name: "3.5\u20134.0",
    dates: [
      { date: "Sat, Jan 10, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690085" },
      { date: "Sat, Feb 14, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690085" },
      { date: "Sat, Mar 21, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690085" },
    ],
  },
  {
    name: "4.0\u20134.5",
    dates: [
      { date: "Sat, Dec 6, 2025", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690087" },
      { date: "Sat, Jan 17, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690087" },
      { date: "Sat, Feb 21, 2026", time: "5:00 \u2013 8:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690087" },
      { date: "Sat, Mar 28, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690087" },
    ],
  },
  {
    name: "Seniors 50+ (3.5\u20134.0)",
    dates: [
      { date: "Sat, Dec 13, 2025", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690092" },
      { date: "Sat, Jan 24, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690092" },
      { date: "Sat, Feb 21, 2026", time: "2:30 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1690092" },
    ],
  },
];

function BracketSection({ brackets }: { brackets: typeof ROCKVILLE_BRACKETS }) {
  return (
    <div className="space-y-6">
      {brackets.map((bracket) => (
        <div key={bracket.name} className="card-ld p-6">
          <h3 className="font-heading font-semibold text-lg mb-4 text-[#F47920]">
            {bracket.name}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-ld">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 font-heading font-semibold text-text-primary">Date</th>
                  <th className="py-2 pr-4 font-heading font-semibold text-text-primary">Time</th>
                  <th className="py-2 font-heading font-semibold text-text-primary">Register</th>
                </tr>
              </thead>
              <tbody>
                {bracket.dates.map((d, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-text-primary whitespace-nowrap">{d.date}</td>
                    <td className="py-2 pr-4 text-text-muted whitespace-nowrap">{d.time}</td>
                    <td className="py-2">
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-[#F47920] hover:text-[#FFCF31] transition-colors font-semibold">
                        Register
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "what-to-expect", label: "What to Expect" },
  { id: "rockville-schedule", label: "Rockville" },
  { id: "nb-schedule", label: "North Bethesda" },
  { id: "player-guide", label: "Player Guide" },
  { id: "sponsor", label: "Sponsor" },
  { id: "join", label: "Join" },
];

export default function TournamentsPage() {
  return (
    <div className="page-link-and-dink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: "Link & Dink Pickleball Tournament Series 2025–2026",
            description:
              "Community pickleball tournament series with round robin pools, bracket play, medals, and raffles at Dill Dinkers Rockville and North Bethesda.",
            sport: "Pickleball",
            startDate: "2025-11-30",
            endDate: "2026-03-28",
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
          }),
        }}
      />
      <PageSectionNav sections={SECTIONS} brandColor="#F47920" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-link-and-dink">
        <div className="relative mx-auto max-w-4xl text-center">
          <Image
            src="/images/link-and-dink-logo.svg"
            alt="Link & Dink"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <span className="brand-badge brand-badge-ld mb-4">Link & Dink Series</span>
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
            Link &amp; Dink <span className="gradient-text-ld">Tournaments</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Community-first tournament series in Rockville and North Bethesda.
            Round robin pools, bracket play, medals, and raffles.
          </p>
        </div>
      </section>

      {/* Medal Points + How to Register */}
      <section id="overview" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-ld p-6">
                <h2 className="font-heading font-bold text-lg mb-3">Medal Points Leaderboard</h2>
                <p className="text-text-muted text-sm mb-2">
                  <span style={{ color: "#FFCF31" }}>Gold = 3 pts</span> | <span style={{ color: "#C0C0C0" }}>Silver = 2 pts</span> | <span style={{ color: "#CD7F32" }}>Bronze = 1 pt</span>
                </p>
                <a
                  href="https://sammorrispb.notion.site/ebd/7de89f8afc7a46a291c4c14d7fb40300?v=016f9f28e48a4e22a2d7b917f771207e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F47920] hover:text-[#FFCF31] transition-colors font-semibold text-sm"
                >
                  View Live Leaderboard &rarr;
                </a>
              </div>
              <div className="card-ld p-6">
                <h2 className="font-heading font-bold text-lg mb-3">How to Register</h2>
                <ol className="space-y-1 text-text-muted text-sm list-decimal list-inside">
                  <li>Find your skill level and date below</li>
                  <li>Register with a partner via CourtReserve</li>
                  <li>Confirm team DUPR fits the bracket</li>
                  <li>Pay entry fee in registration</li>
                  <li>Receive confirmation email</li>
                </ol>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* What to Expect */}
      <section id="what-to-expect" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">What to Expect</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Format", value: "Round robin + playoff bracket" },
                { label: "Min Games", value: "5+ guaranteed" },
                { label: "Duration", value: "~3 hours" },
                { label: "Bring", value: "Paddle, shoes, water" },
              ].map((item) => (
                <div key={item.label} className="card-ld p-4 text-center">
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-heading font-semibold text-sm text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Rockville Schedule */}
      <section id="rockville-schedule" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-2">Rockville</h2>
            <p className="text-text-muted text-sm mb-6">40 Southlawn Court, Suite C, Rockville, MD</p>
            <BracketSection brackets={ROCKVILLE_BRACKETS} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* NB Schedule */}
      <section id="nb-schedule" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-2">North Bethesda</h2>
            <p className="text-text-muted text-sm mb-6">4942 Boiling Brook Pkwy, North Bethesda, MD</p>
            <BracketSection brackets={NB_BRACKETS} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Player Guide + FAQ */}
      <section id="player-guide" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-ld p-6">
                <h2 className="font-heading font-bold text-lg mb-3">Player Guide Highlights</h2>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li>Round robin games to 11, win by 1</li>
                  <li>Playoff games to 15, win by 2</li>
                  <li>Self-officiated with generous line calls</li>
                  <li>Focus on connection and community</li>
                  <li>Follow USA Pickleball official rules</li>
                </ul>
              </div>
              <div className="card-ld p-6">
                <h2 className="font-heading font-bold text-lg mb-3">Need Help Picking a Bracket?</h2>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li>Between levels? Choose the <strong className="text-text-primary">lower level</strong> first</li>
                  <li>Confirm your <strong className="text-text-primary">DUPR rating</strong> fits the bracket</li>
                  <li>Questions? Email Tournament Director Sam Morris</li>
                </ul>
                <a href="mailto:sam.morris2131@gmail.com" className="block text-[#F47920] hover:text-[#FFCF31] transition-colors font-semibold text-sm mt-3">
                  sam.morris2131@gmail.com
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Sponsor + Community Photo */}
      <section id="sponsor" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <p className="text-text-muted text-sm mb-3">
                Powered by <strong className="text-text-primary">JOOLA</strong>
              </p>
              <a href="https://joola-usa.myshopify.com/samlinkanddink" target="_blank" rel="noopener noreferrer" className="text-[#F47920] hover:text-[#FFCF31] transition-colors font-semibold text-sm">
                Shop JOOLA (affiliate link) &rarr;
              </a>
            </div>
            <div className="hidden md:block w-56 shrink-0">
              <Image
                src="/images/cc-00578.jpg"
                alt="Link & Dink tournament community"
                width={224}
                height={160}
                className="rounded-xl glow-border-ld object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Full-width CTA Banner */}
      <section
        id="join"
        className="py-12 px-6 scroll-mt-28"
        style={{
          background: "linear-gradient(135deg, rgba(244, 121, 32, 0.12), rgba(255, 207, 49, 0.08))",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading font-bold text-xl mb-4 gradient-text-ld">Join Link & Dink</h2>
          <p className="text-text-muted text-sm mb-6">
            Stay in the loop on tournaments, community events, and partner finding.
          </p>
          <a href="https://www.linkanddink.com" target="_blank" rel="noopener noreferrer" className="inline-block font-heading font-semibold px-8 py-3 rounded-lg btn-ld">
            Join Link &amp; Dink
          </a>
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <Link href="/programs/coaching" className="text-[#F47920] hover:text-[#FFCF31] transition-colors font-semibold text-sm">
            &larr; Coaching &amp; Clinics
          </Link>
          <Link href="/programs/youth" className="text-[#F47920] hover:text-[#FFCF31] transition-colors font-semibold text-sm">
            Youth Programs &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
