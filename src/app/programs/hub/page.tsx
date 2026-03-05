import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { LOCATIONS, LOCATION_ORDER, WIDGET_URLS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Program Hub — Dill Dinkers Rockville & North Bethesda",
  description:
    "Find the right pickleball program at Dill Dinkers. Leagues, open play, coached sessions, tournaments, coaching, and youth programs in Rockville and North Bethesda.",
  alternates: { canonical: "https://www.sammorrispb.com/programs/hub" },
  openGraph: {
    title: "Program Hub — Dill Dinkers Rockville & North Bethesda",
    description:
      "Your starting point for all pickleball programs in Rockville and North Bethesda.",
    url: "https://www.sammorrispb.com/programs/hub",
  },
};

const PROGRAMS = [
  {
    emoji: "\u{1F3BE}",
    title: "Leagues",
    description: "6-week seasons plus playoffs, DUPR brackets, and prizes.",
    href: "/programs/leagues",
    color: "#F47920",
  },
  {
    emoji: "\u{1F3D3}",
    title: "Open Play",
    description: "Drop in, no partner needed. Level-specific sessions available.",
    href: "/programs/open-play",
    color: "#8BC751",
  },
  {
    emoji: "\u{1F4DA}",
    title: "Coached Open Play",
    description:
      "Real-time coach feedback while you play. Beginner through Intermediate.",
    href: "/programs/coached-open-play",
    color: "#4DACD0",
  },
  {
    emoji: "\u{1F3C5}",
    title: "Tournaments",
    description:
      "Link & Dink series — round robin pools, bracket play, medals, and raffles.",
    href: "/programs/tournaments",
    color: "#F47920",
  },
  {
    emoji: "\u{1F3AF}",
    title: "Coaching & Clinics",
    description:
      "Private lessons, level-based clinics, and strategy sessions.",
    href: "/programs/coaching",
    color: "#8BC751",
  },
  {
    emoji: "\u{1F466}",
    title: "Youth Programs",
    description:
      "Next Gen Academy ages 4\u201316. Classes, private coaching, and Summer Camp.",
    href: "/programs/youth",
    color: "#4DACD0",
  },
];

const DECISION_TREE = [
  {
    question: "New to pickleball?",
    answer: "Coached Open Play",
    href: "/programs/coached-open-play",
  },
  {
    question: "Know your level and want to play?",
    answer: "Open Play",
    href: "/programs/open-play",
  },
  {
    question: "Want structured competition?",
    answer: "Leagues or Tournaments",
    href: "/programs/leagues",
  },
  {
    question: "Kids ages 4\u201316?",
    answer: "Youth Programs",
    href: "/programs/youth",
  },
  {
    question: "Want focused skill-building?",
    answer: "Coaching & Clinics",
    href: "/programs/coaching",
  },
];

const SECTIONS = [
  { id: "programs", label: "Programs" },
  { id: "locations-parking", label: "Locations" },
  { id: "first-time", label: "First Time" },
  { id: "decision-tree", label: "Not Sure?" },
  { id: "community", label: "Community" },
];

export default function ProgramHubPage() {
  return (
    <div className="page-dill-dinkers">
      <PageSectionNav sections={SECTIONS} brandColor="#F47920" />
      <BackToTop />
      {/* ─── Hero ─── */}
      <section className="relative py-20 md:py-28 px-6 hero-dill-dinkers overflow-hidden">
        <Image
          src="/images/cc-00572.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-soft-light"
          priority
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="brand-badge brand-badge-dd mb-4">Dill Dinkers</span>
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
            Program <span className="gradient-text-dd">Hub</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Your starting point for all pickleball programs at Dill Dinkers
            Rockville and North Bethesda.
          </p>
          <p className="text-text-muted text-sm">
            Community resource maintained by Sam Morris &mdash; not an official
            facility website.
          </p>
        </div>
      </section>

      {/* ─── Quick Menu ─── */}
      <section id="programs" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-3xl md:text-4xl mb-4 text-center">
              Pick Your Program
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto mb-10 text-center">
              Choose the experience that matches your goals today.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROGRAMS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="card-dd p-6 block"
                  style={{ borderLeft: `4px solid ${p.color}` }}
                >
                  <span className="text-2xl mb-3 block" role="img" aria-hidden="true">
                    {p.emoji}
                  </span>
                  <h3 className="font-heading text-lg mb-2">
                    {p.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {p.description}
                  </p>
                  <span className="text-[#F47920] text-sm font-semibold mt-3 inline-block">
                    View Details &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Locations ─── */}
      <section id="locations-parking" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-5xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-3xl md:text-4xl mb-8 text-center">
              Locations &amp; Parking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {LOCATION_ORDER.map((id) => {
                const loc = LOCATIONS[id];
                const urls = WIDGET_URLS[id];
                return (
                  <div key={id} className="card-dd p-8">
                    <h3 className="font-heading text-xl mb-4">
                      {loc.name}
                    </h3>
                    <div className="space-y-2 text-text-muted text-sm mb-4">
                      <p>{loc.address}, {loc.city}, {loc.state} {loc.zip}</p>
                      <p>
                        <a href={`tel:${loc.phone.replace(/-/g, "")}`} className="hover:text-[#F47920] transition-colors">
                          {loc.phone}
                        </a>
                      </p>
                    </div>
                    {id === "rockville" && (
                      <p className="text-text-muted text-xs mb-4 leading-relaxed">
                        Parking: Dedicated facility spaces out front. ZavaZone spaces OK
                        weekdays before 5pm/after 8pm, weekends before 9am/after 5pm.
                        Overflow at 20 Southlawn Ct.
                      </p>
                    )}
                    {id === "northBethesda" && (
                      <p className="text-text-muted text-xs mb-4">
                        Parking: Free parking anywhere in the lot.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={urls.publicBooking}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-white font-heading font-semibold px-5 py-2.5 rounded-lg btn-dd text-sm"
                      >
                        Book Courts
                      </a>
                      <a
                        href={urls.membership}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-heading font-semibold px-5 py-2.5 rounded-lg border border-[rgba(244,121,32,0.2)] text-text-muted hover:border-[rgba(244,121,32,0.4)] hover:text-text-primary transition-all text-sm"
                      >
                        Membership
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── First time callout ─── */}
      <section id="first-time" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="card-dd p-8 text-center">
            <p className="font-heading font-bold text-xl mb-3">
              First time here?
            </p>
            <p className="text-text-muted text-sm mb-6 max-w-lg mx-auto">
              Show up, check in at the front desk, grab a paddle if you need
              one, and jump into a game. Open Play starts at $15 for
              non-members. No experience needed.
            </p>
            <Link
              href="/programs/open-play"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
            >
              Learn About Open Play
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Not Sure Where to Start? ─── */}
      <section id="decision-tree" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-3xl md:text-4xl mb-8 text-center">
              Not Sure Where to Start?
            </h2>
            <div className="space-y-4">
              {DECISION_TREE.map((item, i) => (
                <Link
                  key={item.question}
                  href={item.href}
                  className="flex items-center justify-between card-dd p-5 animate-slide-in"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
                >
                  <div>
                    <p className="text-text-muted text-sm">{item.question}</p>
                    <p className="font-heading font-semibold text-text-primary">
                      {item.answer}
                    </p>
                  </div>
                  <span className="text-[#F47920] text-sm font-semibold shrink-0 ml-4">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/contact"
                className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
              >
                Book a Free Evaluation
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Community ─── */}
      <section id="community" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-text-muted text-sm">
            <a
              href="https://www.linkanddink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold"
            >
              Link &amp; Dink
            </a>
            {" "}&middot;{" "}
            <a
              href="https://chat.whatsapp.com/EDCDYdUdzn65nlUWdlnuZ5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold"
            >
              WhatsApp Group
            </a>
            {" "}&middot;{" "}
            <a
              href="https://www.nextgenpbacademy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold"
            >
              Next Gen Academy
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
