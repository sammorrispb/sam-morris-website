import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { WIDGET_URLS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Youth & Junior Programs — Next Gen Academy at Dill Dinkers",
  description:
    "Youth and junior programs at Dill Dinkers. Next Gen Academy spring sessions, summer camp, and junior coaching in Rockville and North Bethesda.",
  alternates: { canonical: "https://www.sammorrispb.com/programs/youth" },
  openGraph: {
    title: "Youth & Junior Programs — Next Gen Academy",
    description: "Spring 2026 sessions, summer camp, and junior coaching at Dill Dinkers.",
    url: "https://www.sammorrispb.com/programs/youth",
  },
};

const SPRING_SESSIONS = [
  {
    level: "Red Ball",
    color: "#ef4444",
    ages: "Ages 5\u20138",
    description: "Foam balls, smaller courts. Focus on hand-eye coordination, basic rallying, and fun.",
    sessions: [
      { loc: "Rockville", day: "Saturday", time: "11:00 AM \u2013 12:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1774804" },
      { loc: "North Bethesda", day: "Saturday", time: "12:00 \u2013 1:00 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1778399" },
    ],
  },
  {
    level: "Orange Ball",
    color: "#f97316",
    ages: "Ages 8\u201311",
    description: "Low-compression balls, transitional courts. Rallying, serving, scoring, and match play.",
    sessions: [
      { loc: "Rockville", day: "Saturday", time: "12:00 \u2013 1:15 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1774808" },
      { loc: "North Bethesda", day: "Saturday", time: "1:00 \u2013 2:15 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1778400" },
    ],
  },
  {
    level: "Green / Yellow Ball",
    color: "#22c55e",
    ages: "Ages 11\u201316",
    description: "Full courts, regulation or green-dot balls. Strategy, shot selection, competitive play.",
    sessions: [
      { loc: "Rockville", day: "Saturday", time: "1:15 \u2013 2:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10869/1774814" },
      { loc: "North Bethesda", day: "Saturday", time: "2:15 \u2013 3:30 PM", url: "https://app.courtreserve.com/Online/Events/Public/10483/1778401" },
    ],
  },
];

const SUMMER_CAMP_WEEKS = [
  { week: "Week 1", dates: "June 16 \u2013 20" },
  { week: "Week 2", dates: "June 23 \u2013 27" },
  { week: "Week 3", dates: "June 30 \u2013 July 3 (4 days)" },
  { week: "Week 4", dates: "July 7 \u2013 11" },
  { week: "Week 5", dates: "July 14 \u2013 18" },
  { week: "Week 6", dates: "July 21 \u2013 25" },
];

function LevelSessions({ level }: { level: typeof SPRING_SESSIONS[number] }) {
  return (
    <div
      className="card-ng p-6"
      style={{
        borderLeft: `4px solid ${level.color}`,
        background: `linear-gradient(135deg, rgba(${level.color === "#ef4444" ? "239,68,68" : level.color === "#f97316" ? "249,115,22" : "34,197,94"}, 0.03), #0e1a1e)`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-heading font-bold text-lg" style={{ color: level.color }}>
          {level.level}
        </h3>
        <span className="text-text-muted text-sm">{level.ages}</span>
      </div>
      <p className="text-text-muted text-sm mb-4">{level.description}</p>
      <div className="space-y-2">
        {level.sessions.map((s) => (
          <div key={s.loc} className="flex items-center justify-between gap-4 text-sm">
            <div>
              <span className="font-semibold text-text-primary">{s.loc}</span>
              <span className="text-text-muted ml-2">{s.day}, {s.time}</span>
            </div>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold shrink-0 transition-colors"
              style={{ color: level.color }}
            >
              Register
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "spring-2026", label: "Spring 2026" },
  { id: "how-it-works", label: "How It Works" },
  { id: "evaluation", label: "Evaluation" },
  { id: "summer-camp", label: "Summer Camp" },
  { id: "location-programs", label: "By Location" },
  { id: "about-nga", label: "About NGA" },
];

export default function YouthPage() {
  return (
    <div className="page-next-gen">
      <PageSectionNav sections={SECTIONS} brandColor="#22c55e" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-next-gen">
        <div className="relative mx-auto max-w-4xl text-center">
          <Image
            src="/images/nextgen-academy-logo.svg"
            alt="Next Gen Academy"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <span className="brand-badge brand-badge-ng mb-4">Next Gen Academy</span>
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
            Youth &amp; Junior <span className="gradient-text-ng">Programs</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Next Gen Academy brings age-appropriate coaching to young athletes
            at Dill Dinkers Rockville and North Bethesda.
          </p>
        </div>
      </section>

      {/* Next Gen Academy Spring 2026 */}
      <section id="spring-2026" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-2">
              Next Gen Academy &mdash; Spring 2026
            </h2>
            <p className="text-text-muted text-sm mb-8">
              8-week session: March 1 &ndash; April 26 (skip March 29 for spring break)
            </p>
            <div className="space-y-6">
              {SPRING_SESSIONS.map((level) => (
                <LevelSessions key={level.level} level={level} />
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Duration", value: "60\u201375 min per session" },
                { label: "Structure", value: "Warm-up, drills, coached games" },
                { label: "Equipment", value: "Paddles provided, bring water" },
                { label: "Ratio", value: "Max 8:1 student-to-coach" },
              ].map((item) => (
                <div key={item.label} className="card-ng p-4 text-center">
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-heading font-semibold text-sm text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Free Evaluation */}
      <section id="evaluation" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="card-ng p-8 text-center">
            <h2 className="font-heading font-bold text-xl mb-3">Not Sure Which Level?</h2>
            <p className="text-text-muted text-sm mb-6">
              Book a free 15-minute evaluation. We&apos;ll assess your child&apos;s skill level
              and recommend the right group.
            </p>
            <a
              href="https://nextgenpb.as.me/?appointmentType=85545633"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-ng"
            >
              Book Free Evaluation
            </a>
          </div>
        </div>
      </section>

      {/* Summer Camp 2026 */}
      <section id="summer-camp" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-2">Summer Camp 2026</h2>
            <p className="text-text-muted text-sm mb-6">North Bethesda &middot; Ages 6&ndash;16 &middot; 9:00 AM &ndash; 12:00 PM</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-ng p-6">
                <h3 className="font-heading text-lg mb-4">Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm table-ng">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4 font-heading font-semibold text-text-primary">Week</th>
                        <th className="py-2 font-heading font-semibold text-text-primary">Dates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SUMMER_CAMP_WEEKS.map((w) => (
                        <tr key={w.week} className="border-b border-white/5">
                          <td className="py-2 pr-4 font-semibold text-text-primary">{w.week}</td>
                          <td className="py-2 text-text-muted">{w.dates}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-ng p-6">
                <h3 className="font-heading text-lg mb-4">Details</h3>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li><strong className="text-text-primary">Pricing:</strong> $225/week (5 days) or $180/week (4 days)</li>
                  <li><strong className="text-text-primary">Multi-week:</strong> 10% off 3+ weeks</li>
                  <li><strong className="text-text-primary">What to bring:</strong> Water, snack, athletic shoes</li>
                  <li><strong className="text-text-primary">Paddles:</strong> Provided (or bring your own)</li>
                  <li><strong className="text-text-primary">Cancellation:</strong> Full refund 7+ days before, 50% within 7 days</li>
                </ul>
                <p className="text-text-muted text-xs mt-4 italic">Registration opens Spring 2026</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Location Programs */}
      <section id="location-programs" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Junior Programs by Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-ng p-6">
                <h3 className="font-heading font-bold text-xl mb-4">Rockville</h3>
                <p className="text-text-muted text-sm mb-4">40C Southlawn Court, Rockville, MD 20850</p>
                <div className="space-y-3">
                  <a href={WIDGET_URLS.rockville.juniors} target="_blank" rel="noopener noreferrer" className="block text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm">
                    Browse Junior Programs &rarr;
                  </a>
                  <a href={WIDGET_URLS.rockville.allEvents} target="_blank" rel="noopener noreferrer" className="block text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm">
                    All Events &rarr;
                  </a>
                </div>
              </div>
              <div className="card-ng p-6">
                <h3 className="font-heading font-bold text-xl mb-4">North Bethesda</h3>
                <p className="text-text-muted text-sm mb-4">4942 Boiling Brook Pkwy, North Bethesda, MD 20852</p>
                <div className="space-y-3">
                  <a href={WIDGET_URLS.northBethesda.juniors} target="_blank" rel="noopener noreferrer" className="block text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm">
                    Browse Junior Programs &rarr;
                  </a>
                  <a href={WIDGET_URLS.northBethesda.allEvents} target="_blank" rel="noopener noreferrer" className="block text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm">
                    All Events &rarr;
                  </a>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* About Next Gen Academy */}
      <section id="about-nga" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="card-ng p-8 text-center" style={{ borderWidth: "2px" }}>
            <Image
              src="/images/nextgen-academy-logo.svg"
              alt="Next Gen Academy"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h2 className="font-heading font-bold text-xl mb-4">About Next Gen Academy</h2>
            <p className="text-text-muted text-sm mb-4">
              Next Gen Academy is a youth development program founded by Sam Morris,
              focused on building athletic skills, sportsmanship, and community through
              age-appropriate coaching.
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
                href="mailto:sam.morris2131@gmail.com"
                className="inline-block font-heading font-semibold px-6 py-3 rounded-lg border border-[rgba(34,197,94,0.25)] text-text-muted hover:border-[rgba(34,197,94,0.5)] hover:text-text-primary transition-all text-sm"
              >
                Contact Sam
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <Link href="/programs/tournaments" className="text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm">
            &larr; Tournaments
          </Link>
          <Link href="/programs/hub" className="text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm">
            Program Hub &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
