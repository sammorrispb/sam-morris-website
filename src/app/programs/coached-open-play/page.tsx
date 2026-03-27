import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { LeadForm } from "@/components/LeadForm";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { WIDGET_URLS } from "@/lib/locations";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Coached Open Play — Dill Dinkers Rockville & North Bethesda",
  description:
    "Learn pickleball the smart way with coached open play. Real-time feedback, level-based sessions at Dill Dinkers.",
  keywords: [
    "coached open play pickleball",
    "learn pickleball Rockville",
    "beginner pickleball class near me",
    "pickleball instruction North Bethesda",
    "pickleball class Montgomery County",
    "learn pickleball near DC",
    "beginner pickleball lessons Maryland",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/coached-open-play" },
  openGraph: {
    title: "Coached Open Play — Dill Dinkers Rockville & North Bethesda",
    description: "Play real games with real-time coach feedback. Beginner through Intermediate sessions.",
    url: "https://www.sammorrispb.com/programs/coached-open-play",
  },
};

const BENEFITS = [
  { title: "Learn the fundamentals correctly", desc: "Strategy, court positioning, and anticipation from day one" },
  { title: "Play with your skill level", desc: "No intimidation, just growth" },
  { title: "Coach support every session", desc: "Real-time feedback as you play" },
  { title: "Find your community", desc: "Meet others who are learning alongside you" },
];

const LEVEL_GUIDE = [
  { level: "Newbie/Beginner", who: "New to pickleball or still learning basic rules, scoring, and grip" },
  { level: "Advanced Beginner", who: "Comfortable with basics, working on consistency and shot selection" },
  { level: "Intermediate", who: "Solid fundamentals, ready to develop strategy and court positioning" },
];

const ROCKVILLE_SESSIONS = [
  { level: "Advanced Beginner", day: "Tuesday", time: "12:00 \u2013 2:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1672910" },
  { level: "Beginner/Adv. Beginner", day: "Tuesday", time: "2:00 \u2013 3:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1535760" },
  { level: "Advanced Beginner", day: "Tuesday", time: "7:00 \u2013 8:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1633536" },
  { level: "Newbie/Beginner", day: "Thursday", time: "5:00 \u2013 6:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1703410" },
  { level: "Beginner/Adv. Beginner", day: "Thursday", time: "6:45 \u2013 8:15 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1774842" },
  { level: "Newbie/Beginner", day: "Saturday", time: "1:15 \u2013 3:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1645644" },
  { level: "Advanced Beginner", day: "Saturday", time: "3:15 \u2013 5:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1645663" },
  { level: "Intermediate", day: "Saturday", time: "5:00 \u2013 7:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1645673" },
];

const NB_SESSIONS = [
  { level: "Beginner/Adv. Beginner", day: "Monday", time: "12:00 \u2013 1:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1725598" },
  { level: "Advanced Beginner", day: "Monday", time: "5:00 \u2013 6:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1633117" },
  { level: "Adv. Beginner/Low Int.", day: "Tuesday", time: "12:00 \u2013 1:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1672507" },
  { level: "Newbie/Beginner", day: "Tuesday", time: "5:00 \u2013 6:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1672498" },
  { level: "Adv. Beginner/Low Int.", day: "Wednesday", time: "8:30 \u2013 10:00 AM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1731828" },
  { level: "Newbie/Beginner", day: "Wednesday", time: "12:00 \u2013 1:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1722937" },
  { level: "Advanced Beginner", day: "Thursday", time: "12:00 \u2013 1:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1672493" },
  { level: "Advanced Beginner", day: "Sunday", time: "2:30 \u2013 4:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1672531" },
  { level: "Newbie/Beginner", day: "Sunday", time: "4:00 \u2013 5:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1672528" },
];

function SessionTable({ sessions }: { sessions: typeof ROCKVILLE_SESSIONS }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm table-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Level</th>
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Day</th>
            <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Time</th>
            <th className="py-3 font-heading font-semibold text-text-primary">Register</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="py-3 pr-4 font-semibold text-text-primary whitespace-nowrap">{s.level}</td>
              <td className="py-3 pr-4 text-text-muted">{s.day}</td>
              <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{s.time}</td>
              <td className="py-3">
                <TrackedExternalLink href={s.url} label={`COP — ${s.level} ${s.day}`} page="coached-open-play" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">
                  Sign Up
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
  { id: "why-cop", label: "Why COP" },
  { id: "quick-register", label: "Register" },
  { id: "level-guide", label: "Level Guide" },
  { id: "rockville-sessions", label: "Rockville" },
  { id: "nb-sessions", label: "North Bethesda" },
  { id: "pricing", label: "Pricing" },
  { id: "session-details", label: "Details" },
  { id: "how-to-purchase", label: "Packages" },
];

export default function CoachedOpenPlayPage() {
  return (
    <div className="page-sam-morris">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Programs", href: "/programs" },
              { name: "Coached Open Play", href: "/programs/coached-open-play" },
            ])
          ),
        }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd([
              {
                question: "What is coached open play pickleball?",
                answer:
                  "Coached open play combines live game play with real-time feedback from a certified coach. You play actual games while a coach observes and offers tips on strategy, positioning, and technique between points. It is available at Dill Dinkers Rockville and North Bethesda.",
              },
              {
                question: "What is the difference between coached open play and regular open play?",
                answer:
                  "Regular open play is self-directed — you show up and play games on your own. Coached open play adds a professional coach who watches your games and provides real-time instruction. Coached sessions are grouped by skill level (Beginner, Advanced Beginner, Intermediate) for a better learning experience.",
              },
              {
                question: "How much does coached open play cost at Dill Dinkers?",
                answer:
                  "Coached open play sessions are available at Dill Dinkers Rockville and North Bethesda. Check the schedule at app.courtreserve.com for current times and pricing. Sessions typically last 1.5 to 2 hours.",
              },
            ])
          ),
        }}
      />
      {/* Event Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Coached Open Play at Dill Dinkers",
            description: "Coached open play combines live pickleball games with real-time feedback from a certified coach. Sessions grouped by skill level: Beginner, Advanced Beginner, and Intermediate.",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            organizer: {
              "@type": "SportsActivityLocation",
              name: "Dill Dinkers",
              url: "https://www.sammorrispb.com/locations",
            },
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
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: "https://www.sammorrispb.com/programs/coached-open-play",
            },
          }),
        }}
      />
      <ScrollDepthTracker page="coached-open-play" />
      <PageSectionNav sections={SECTIONS} brandColor="#4DACD0" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-sam-morris">
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <span className="brand-badge brand-badge-sm mb-4">Coach Sam Morris</span>
              <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
                Coached <span className="gradient-text-sm">Open Play</span>
              </h1>
              <p className="text-text-muted text-lg md:text-xl max-w-xl">
                The smart way to learn pickleball. Play real games with real-time
                coaching feedback.
              </p>
            </div>
            <div className="shrink-0 hidden md:block">
              <Image
                src="/images/sam-action.jpeg"
                alt="Coach Sam Morris in action"
                width={280}
                height={350}
                className="rounded-2xl glow-border-sm object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why COP */}
      <section id="why-cop" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">
              Why Coached Open Play?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BENEFITS.map((b) => (
                <div key={b.title} className="card-sm p-6">
                  <h3 className="font-heading text-text-primary mb-2">{b.title}</h3>
                  <p className="text-text-muted text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Quick Register */}
      <section id="quick-register" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-sm p-6 text-center">
            <h3 className="font-heading font-bold text-lg mb-4">Rockville</h3>
            <TrackedExternalLink href={WIDGET_URLS.rockville.coachedOpenPlay} label="COP Register — Rockville" page="coached-open-play" className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm">
              View Schedule &amp; Register
            </TrackedExternalLink>
          </div>
          <div className="card-sm p-6 text-center">
            <h3 className="font-heading font-bold text-lg mb-4">North Bethesda</h3>
            <TrackedExternalLink href={WIDGET_URLS.northBethesda.coachedOpenPlay} label="COP Register — North Bethesda" page="coached-open-play" className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm">
              View Schedule &amp; Register
            </TrackedExternalLink>
          </div>
        </div>
      </section>

      {/* Level Guide */}
      <section id="level-guide" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Which Level Is Right for Me?
            </h2>
            <div className="card-sm p-6 overflow-x-auto">
              <table className="w-full text-left text-sm table-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Level</th>
                    <th className="py-3 font-heading font-semibold text-text-primary">Who It&apos;s For</th>
                  </tr>
                </thead>
                <tbody>
                  {LEVEL_GUIDE.map((l) => (
                    <tr key={l.level} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-semibold text-text-primary whitespace-nowrap">{l.level}</td>
                      <td className="py-3 text-text-muted">{l.who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Rockville Sessions */}
      <section id="rockville-sessions" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">Rockville Sessions</h2>
            <div className="card-sm p-6">
              <SessionTable sessions={ROCKVILLE_SESSIONS} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* NB Sessions */}
      <section id="nb-sessions" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">North Bethesda Sessions</h2>
            <div className="card-sm p-6">
              <SessionTable sessions={NB_SESSIONS} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-sm p-6">
                <h3 className="font-heading text-lg mb-3">Drop-In</h3>
                <p className="text-text-muted text-sm">Member and visitor drop-in rates available.</p>
                <p className="text-text-muted text-xs mt-3 italic">Check the registration link for current pricing</p>
              </div>
              <div className="card-sm p-6">
                <h3 className="font-heading text-lg mb-3">Multi-Session Package</h3>
                <p className="text-text-muted text-sm">Packages reduce the per-session cost.</p>
                <p className="text-text-muted text-xs mt-3 italic">Availability varies by location</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Session Details */}
      <section id="session-details" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">Session Details</h2>
            <div className="card-sm p-6">
              <ul className="space-y-3 text-text-muted text-sm">
                <li><strong className="text-text-primary">Format:</strong> Introductions, focused drills, and coached gameplay</li>
                <li><strong className="text-text-primary">Class Size:</strong> Max 12:1 student-to-coach ratio and 6:1 per court</li>
                <li><strong className="text-text-primary">Registration:</strong> Members 2 weeks in advance, visitors 1 week</li>
                <li><strong className="text-text-primary">Cancellation:</strong> Min 3 players required or class is cancelled (credits issued)</li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* How to Purchase */}
      <section id="how-to-purchase" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="card-sm p-8">
            <h2 className="font-heading font-bold text-xl mb-4">How to Purchase a Package</h2>
            <ol className="space-y-2 text-text-muted text-sm list-decimal list-inside">
              <li>Open the <strong className="text-text-primary">CourtReserve app</strong></li>
              <li>Scroll to the bottom and tap <strong className="text-text-primary">Packages</strong></li>
              <li>Select the <strong className="text-text-primary">Coached Open Play</strong> package for your location</li>
              <li>Complete your purchase</li>
            </ol>
            <p className="text-text-muted text-sm mt-4">
              To use your package: select &quot;Use a pack punch&quot; as your payment method when registering.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <LeadForm heading="Interested in Coached Open Play?" page="coached-open-play" />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                What is coached open play pickleball?
              </h3>
              <p className="text-text-muted leading-relaxed">
                Coached open play combines live game play with real-time feedback from
                a certified coach. You play actual games while a coach observes and
                offers tips on strategy, positioning, and technique between points. It
                is available at Dill Dinkers Rockville and North Bethesda.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                What is the difference between coached open play and regular open
                play?
              </h3>
              <p className="text-text-muted leading-relaxed">
                Regular open play is self-directed — you show up and play games on
                your own. Coached open play adds a professional coach who watches your
                games and provides real-time instruction. Coached sessions are grouped
                by skill level (Beginner, Advanced Beginner, Intermediate) for a
                better learning experience.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                How much does coached open play cost at Dill Dinkers?
              </h3>
              <p className="text-text-muted leading-relaxed">
                Coached open play sessions are available at Dill Dinkers Rockville and
                North Bethesda. Check the schedule at app.courtreserve.com for current
                times and pricing. Sessions typically last 1.5 to 2 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <Link href="/programs/open-play" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">
            &larr; Open Play
          </Link>
          <Link href="/programs/coaching" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">
            Coaching &amp; Clinics &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
