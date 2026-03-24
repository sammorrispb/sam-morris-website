import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Youth & Junior Programs — Next Gen Academy at Dill Dinkers",
  description:
    "Youth and junior pickleball programs at Dill Dinkers. Next Gen Academy sessions, summer camp, and junior coaching in Rockville and North Bethesda.",
  keywords: [
    "kids pickleball lessons Rockville",
    "youth pickleball Montgomery County",
    "junior pickleball academy Maryland",
    "pickleball summer camp North Bethesda",
    "kids pickleball near me",
    "Next Gen Pickleball Academy",
    "pickleball for kids DC area",
    "youth pickleball camp Maryland",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/youth" },
  openGraph: {
    title: "Youth & Junior Programs — Next Gen Academy",
    description:
      "Youth pickleball academy, summer camp, and junior coaching at Dill Dinkers Rockville and North Bethesda.",
    url: "https://www.sammorrispb.com/programs/youth",
  },
};

const LEVELS = [
  {
    name: "Red Ball",
    color: "#ef4444",
    rgb: "239,68,68",
    ages: "Ages 5+",
    tagline: "New / beginners — learning to rally",
  },
  {
    name: "Orange Ball",
    color: "#f97316",
    rgb: "249,115,22",
    ages: "Ages 7+",
    tagline: "Advanced beginners — learning to play games",
  },
  {
    name: "Green Ball",
    color: "#22c55e",
    rgb: "34,197,94",
    ages: "Ages 9+",
    tagline: "Learning to strategize",
  },
  {
    name: "Yellow Ball",
    color: "#eab308",
    rgb: "234,179,8",
    ages: "Ages 12+",
    tagline: "Learning to compete",
  },
];

const SUMMER_CAMP_WEEKS = [
  { week: "Week 1", dates: "June 29 – July 3", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1910295&reservationId=48742136" },
  { week: "Week 2", dates: "July 6 – 10", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1823568&reservationId=47572311" },
  { week: "Week 3", dates: "July 13 – 17", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1823577&reservationId=47572594" },
  { week: "Week 4", dates: "July 20 – 24", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1823579&reservationId=47572641" },
  { week: "Week 5", dates: "July 27 – 31", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1910312&reservationId=48742447" },
  { week: "Week 6", dates: "August 3 – 7", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1823592&reservationId=47572852" },
  { week: "Week 7", dates: "August 10 – 14", url: "https://app.courtreserve.com/online/publicbookings/10483?tab=explore&eventId=1823597&reservationId=47572934" },
];

export default function YouthPage() {

  return (
    <div className="page-next-gen">
      <BackToTop />

      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-next-gen">
        <div className="relative mx-auto max-w-4xl text-center">
          <Image
            src="/images/Next Gen Pickleball Academy Logo Horizontal.png"
            alt="Next Gen Pickleball Academy"
            width={400}
            height={150}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
            Youth &amp; Junior <span className="gradient-text-ng">Programs</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Next Gen Academy brings age-appropriate pickleball coaching to young
            athletes at Dill Dinkers Rockville and North Bethesda. Four progressive
            levels from first-timers to competitive juniors.
          </p>
        </div>
      </section>

      {/* Academy Levels */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Academy Levels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LEVELS.map((level) => (
                <div
                  key={level.name}
                  className="card-ng p-6"
                  style={{
                    borderLeft: `4px solid ${level.color}`,
                    background: `linear-gradient(135deg, rgba(${level.rgb}, 0.03), #0e1a1e)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="font-heading font-bold text-lg"
                      style={{ color: level.color }}
                    >
                      {level.name}
                    </h3>
                    <span className="text-text-muted text-sm">{level.ages}</span>
                  </div>
                  <p className="text-text-muted text-sm">{level.tagline}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="card-ng p-8 text-center" style={{ borderColor: "rgba(34,197,94,0.3)", borderWidth: "2px" }}>
            <h2 className="font-heading font-bold text-xl mb-6">
              Get Started with Next Gen Academy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="rounded-lg bg-white/[0.03] border border-white/10 p-5">
                <p className="font-heading font-semibold text-text-primary mb-1">New to Pickleball?</p>
                <p className="text-text-muted text-sm mb-4">Ages 10 &amp; under — try a free session.</p>
                <a
                  href="https://www.nextgenpbacademy.com/freetrial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-ng text-sm"
                >
                  Book a Free Trial
                </a>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/10 p-5">
                <p className="font-heading font-semibold text-text-primary mb-1">Ages 11 &amp; Up</p>
                <p className="text-text-muted text-sm mb-4">Schedule a free 30-minute evaluation.</p>
                <a
                  href="mailto:nextgenacademypb@gmail.com"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-ng text-sm"
                >
                  Schedule Evaluation
                </a>
              </div>
            </div>
            <p className="text-text-muted text-xs font-semibold italic">
              Schedules are subject to change. Please check your CourtReserve
              confirmation email for accurate session times.
            </p>
          </div>
        </div>
      </section>

      {/* Little Dill Academy — Spring Break */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-2">Little Dill Academy</h2>
            <p className="text-text-muted text-sm mb-6">
              Spring Break Camp &middot; Dill Dinkers North Bethesda &middot; Ages 5&ndash;13
            </p>

            <div className="card-ng p-6 space-y-5">
              <p className="text-text-muted text-sm leading-relaxed">
                Get ready for an action-packed week at Dill Dinkers North Bethesda!
                Players spend half the day with a certified coach focusing on
                pickleball skills and drills, and the other half with a certified
                school teacher learning and experimenting with STEM projects, art,
                and fitness. Equipment, dedicated courts, and healthy snacks included.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted mb-1 font-semibold text-xs uppercase tracking-wide">When</p>
                  <p className="text-text-primary">March 30 &ndash; April 3, 2026</p>
                  <p className="text-text-muted">Mon&ndash;Fri &middot; 9:30 AM &ndash; 12:30 PM</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1 font-semibold text-xs uppercase tracking-wide">Where</p>
                  <p className="text-text-primary">Dill Dinkers North Bethesda</p>
                  <p className="text-text-muted">4942 Boiling Brook Pkwy</p>
                </div>
              </div>

              <div>
                <p className="text-text-muted mb-2 font-semibold text-xs uppercase tracking-wide">Pricing</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                    <p className="font-semibold text-text-primary">Drop-In (per day)</p>
                    <p className="text-text-muted">$50 members &middot; $60 non-members</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                    <p className="font-semibold text-text-primary">Full Week</p>
                    <p className="text-text-muted">$250 members &middot; $300 non-members</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <a
                  href="https://app.courtreserve.com/Online/Events/Public/10483/1836399"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-ng"
                >
                  Register Now
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Summer Camp */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-2">Summer Camp</h2>
            <p className="text-text-muted text-sm mb-6">
              Dill Dinkers North Bethesda &middot; Ages 6&ndash;16
            </p>

            <div className="card-ng p-6">
                <h3 className="font-heading text-lg mb-4">Summer 2026 Schedule</h3>
                <div className="space-y-3">
                  {SUMMER_CAMP_WEEKS.map((week) => (
                    <div
                      key={week.week}
                      className="flex items-center justify-between gap-4 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <span className="font-semibold text-text-primary">{week.week}</span>
                        <span className="text-text-muted ml-2">{week.dates}</span>
                      </div>
                      <a
                        href={week.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#22c55e] hover:text-[#4ade80] transition-colors shrink-0"
                      >
                        Register
                      </a>
                    </div>
                  ))}
                </div>
              </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* About NGA */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="card-ng p-8 text-center" style={{ borderWidth: "2px" }}>
            <Image
              src="/images/nextgen-academy-logo.svg"
              alt="Next Gen Academy"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h2 className="font-heading font-bold text-xl mb-4">
              About Next Gen Academy
            </h2>
            <p className="text-text-muted text-sm mb-4">
              Next Gen Academy is a youth development program founded by Sam Morris,
              focused on building athletic skills, sportsmanship, and community
              through age-appropriate coaching.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://www.nextgenpbacademy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-ng text-sm"
              >
                Visit Next Gen Academy
              </a>
              <a
                href="mailto:nextgenacademypb@gmail.com"
                className="inline-block font-heading font-semibold px-6 py-3 rounded-lg border border-[rgba(34,197,94,0.25)] text-text-muted hover:border-[rgba(34,197,94,0.5)] hover:text-text-primary transition-all text-sm"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <a
            href="https://tournamentwebsite.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm"
          >
            &larr; Tournaments
          </a>
          <Link
            href="/programs/hub"
            className="text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm"
          >
            Program Hub &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
