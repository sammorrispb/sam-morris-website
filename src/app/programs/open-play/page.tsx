import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { WIDGET_URLS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Open Play — Dill Dinkers Rockville & North Bethesda",
  description:
    "Drop-in pickleball open play at Dill Dinkers. All levels welcome, skill-based courts, fair rotation. Rockville and North Bethesda locations.",
  alternates: { canonical: "https://www.sammorrispb.com/programs/open-play" },
  openGraph: {
    title: "Open Play — Dill Dinkers Rockville & North Bethesda",
    description: "Drop in, play with others, no partner needed. Skill-level courts with fair rotation.",
    url: "https://www.sammorrispb.com/programs/open-play",
  },
};

const SKILL_LEVELS = [
  { level: "Beginner", dupr: "< 2.5", description: "New to the game or still learning rules, working on consistency and ball control." },
  { level: "Advanced Beginner", dupr: "2.5 \u2013 3.0", description: "Comfortable with basic rules and rallies. Working on strategy, placement, and consistency." },
  { level: "Intermediate+", dupr: "3.0+", description: "Confident player with power, control, and strategic awareness. Can execute a variety of shots." },
  { level: "Advanced", dupr: "3.5+", description: "Strong control, utilizes the NVZ effectively, anticipates opponents\u2019 moves, and employs complex strategies." },
];

const ETIQUETTE = [
  "Choose the right court for your skill level \u2014 be honest with yourself",
  "Rotate fairly \u2014 after 2 games, step off and let others play",
  "Be welcoming \u2014 introduce yourself and encourage newer players",
  "Call the score clearly before each serve",
  "Communicate with your partner and opponents",
  "Respect the facility \u2014 keep courts clean and follow staff instructions",
];

const SECTIONS = [
  { id: "locations", label: "Locations" },
  { id: "how-it-works", label: "How It Works" },
  { id: "skill-levels", label: "Skill Levels" },
  { id: "etiquette", label: "Etiquette" },
  { id: "register", label: "Register" },
];

export default function OpenPlayPage() {
  return (
    <div className="page-dill-dinkers">
      <PageSectionNav sections={SECTIONS} brandColor="#8BC751" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-dill-dinkers-lime">
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="brand-badge brand-badge-dd mb-4">Dill Dinkers</span>
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
            <span className="gradient-text-dd">Open Play</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Drop in, play with others, and enjoy pickleball in a welcoming,
            semi-structured environment. No partner needed.
          </p>
        </div>
      </section>

      {/* Location Quick Links */}
      <section id="locations" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Rockville", url: WIDGET_URLS.rockville.openPlay, address: "40C Southlawn Ct, Rockville, MD 20850", phone: "240-912-7860" },
            { name: "North Bethesda", url: WIDGET_URLS.northBethesda.openPlay, address: "4942 Boiling Brook Pkwy, North Bethesda, MD 20852", phone: "301-231-7811" },
          ].map((loc) => (
            <div key={loc.name} className="card-dd p-6">
              <h2 className="font-heading font-bold text-xl mb-2">{loc.name}</h2>
              <p className="text-text-muted text-sm mb-1">{loc.address}</p>
              <p className="text-text-muted text-sm mb-4">{loc.phone}</p>
              <a
                href={loc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white font-heading font-semibold px-6 py-2.5 rounded-lg btn-dd text-sm"
              >
                Book Open Play
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">
              How Open Play Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="card-dd p-6 mb-6">
                  <h3 className="font-heading text-lg mb-3">All Levels Sessions</h3>
                  <ul className="space-y-2 text-text-muted text-sm">
                    <li>Multiple courts with skill level signage</li>
                    <li>Choose the court that matches your level</li>
                    <li>Max 2 games in a row, then rotate</li>
                    <li>Attendance capped to reduce wait times</li>
                  </ul>
                </div>
                <div className="card-dd p-6">
                  <h3 className="font-heading text-lg mb-3">Level-Specific Sessions</h3>
                  <ul className="space-y-2 text-text-muted text-sm">
                    <li>Some sessions designated for specific skill ranges</li>
                    <li>E.g., Intermediate+ only or Advanced Beginner only</li>
                    <li>Check the event description when registering</li>
                  </ul>
                </div>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/images/cc-00575.jpg"
                  alt="Open play at Dill Dinkers"
                  width={400}
                  height={500}
                  className="rounded-xl glow-border-dd object-cover w-full h-full"
                />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Skill Levels */}
      <section id="skill-levels" className="py-16 px-6 scroll-mt-28" style={{ borderTop: "2px solid rgba(139, 199, 81, 0.15)" }}>
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Skill Levels
            </h2>
            <p className="text-text-muted text-sm mb-6">
              Self-rate based on your CourtReserve profile or use this guide.
            </p>
            <div className="card-dd p-6 overflow-x-auto">
              <table className="w-full text-left text-sm table-dd">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Level</th>
                    <th className="py-3 pr-4 font-heading font-semibold text-text-primary">DUPR</th>
                    <th className="py-3 font-heading font-semibold text-text-primary">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {SKILL_LEVELS.map((s) => (
                    <tr key={s.level} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-semibold text-text-primary whitespace-nowrap">{s.level}</td>
                      <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{s.dupr}</td>
                      <td className="py-3 text-text-muted">{s.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Etiquette */}
      <section id="etiquette" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Open Play Etiquette
            </h2>
            <div className="card-dd p-6">
              <ul className="space-y-3 text-text-muted text-sm">
                {ETIQUETTE.map((rule, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#8BC751] shrink-0">{"\u2713"}</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Registration CTA */}
      <section id="register" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Rockville", url: WIDGET_URLS.rockville.openPlay },
              { name: "North Bethesda", url: WIDGET_URLS.northBethesda.openPlay },
            ].map((loc) => (
              <div key={loc.name} className="card-dd p-6 text-center">
                <h3 className="font-heading font-bold text-lg mb-4">{loc.name}</h3>
                <a
                  href={loc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-dd"
                >
                  Book Open Play
                </a>
              </div>
            ))}
          </div>
          <p className="text-text-muted text-sm text-center mt-6">
            Discounts and pricing vary. Check CourtReserve for the current rate when you book.
          </p>
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <Link href="/programs/leagues" className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold text-sm">
            &larr; Leagues
          </Link>
          <Link href="/programs/coached-open-play" className="text-[#F47920] hover:text-[#8BC751] transition-colors font-semibold text-sm">
            Coached Open Play &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
