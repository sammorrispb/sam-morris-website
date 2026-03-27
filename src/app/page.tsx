import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { TrackedLink } from "@/components/TrackedLink";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";

export const metadata: Metadata = {
  title:
    "Sam Morris — Pickleball Coach & Director of Programming at Dill Dinkers | Montgomery County, DC & Northern Virginia",
  description:
    "PPR-certified pickleball coach at Dill Dinkers indoor facilities in Rockville and North Bethesda. Private lessons, leagues, tournaments, youth academy, and community programs serving Montgomery County MD, Washington DC, and Northern Virginia.",
  keywords: [
    "pickleball coach Montgomery County",
    "Dill Dinkers Rockville",
    "Dill Dinkers North Bethesda",
    "indoor pickleball facility near me",
    "pickleball lessons DC area",
    "pickleball coaching Northern Virginia",
    "pickleball leagues Rockville",
    "pickleball tournaments Montgomery County",
    "youth pickleball academy Maryland",
    "private pickleball lessons Bethesda",
    "beginner pickleball DMV",
    "pickleball open play Rockville",
    "PPR certified coach Maryland",
    "DUPR leagues DMV",
    "Next Gen Pickleball Academy",
    "Link and Dink pickleball",
    "indoor pickleball courts Maryland",
    "pickleball near Washington DC",
  ],
  openGraph: {
    images: [
      {
        url: "/og?title=Better%20Than%20Yesterday%20%E2%80%94%20Together&subtitle=Pickleball%20Coaching%20for%20Adults%2C%20Families%20%26%20Kids",
        width: 1200,
        height: 630,
        alt: "Sam Morris Pickleball — Better Than Yesterday, Together",
      },
    ],
  },
};

const STATS = [
  { value: "M.S.", label: "in Coaching" },
  { value: "17", label: "Courts Directed" },
  { value: "2", label: "Indoor Facilities" },
  { value: "5.0+", label: "Player" },
  { value: "RPO", label: "Certified" },
  { value: "PPR", label: "Pro" },
  { value: "DUPR", label: "Coach Certified" },
  { value: "3x", label: "Founder" },
];

const EASE_CARDS = [
  {
    letter: "E",
    title: "Ethics",
    description:
      "Doing what's right, always. Fair play, integrity, respect on and off the court.",
  },
  {
    letter: "A",
    title: "Attitude",
    description:
      "Positive, welcoming, motivating. Growth mindset, resilience, encouraging environment.",
  },
  {
    letter: "S",
    title: "Skills",
    description:
      "Technical excellence and strategic thinking. Clear pathway from beginner to advanced.",
  },
  {
    letter: "E",
    title: "Excellence",
    description:
      "Continuous improvement. Preparedness, consistency, pride in the details.",
  },
];

const PROGRAMS = [
  {
    title: "Next Gen Academy",
    description:
      "Structured youth pathway for ages 5-16. Four levels from beginner to coach-curated advanced.",
    cta: "Learn More",
    href: "/programs#academy",
    external: false,
    image: "/images/nextgen-academy-logo.svg",
    isLogo: true,
  },
  {
    title: "Private Lessons",
    description:
      "Personalized 1-on-1 coaching tailored to your goals and skill level.",
    cta: "Get Started",
    href: "/contact",
    external: false,
    image: "/images/sam-portrait-arms-crossed.jpg",
    isLogo: false,
  },
  {
    title: "Link & Dink",
    description:
      "Community app connecting players of comparable skill levels.",
    cta: "Join Community",
    href: "https://play.linkanddink.com/",
    external: true,
    image: "/images/link-and-dink-logo.svg",
    isLogo: true,
  },
];

export default function Home() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="font-heading font-black text-5xl md:text-7xl leading-tight mb-6">
              Better than yesterday —{" "}
              <span className="gradient-text">together.</span>
            </h1>
            <p className="text-text-muted text-lg md:text-xl mb-10 max-w-2xl">
              Professional pickleball coaching for adults, families, and kids in
              Montgomery County, MD. Coach. Builder. Dad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <TrackedLink
                href="/contact"
                className="text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
                event="cta_click"
                eventProps={{ label: "Book a Free Evaluation", page: "home", section: "hero" }}
              >
                Book a Free Evaluation
              </TrackedLink>
              <TrackedLink
                href="/programs"
                className="border border-white/20 text-text-primary font-heading font-semibold px-8 py-3 rounded-lg hover:border-white/40 transition-colors"
                event="cta_click"
                eventProps={{ label: "Explore Programs", page: "home", section: "hero" }}
              >
                Explore Programs
              </TrackedLink>
            </div>
          </div>
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden glow-border">
              <Image
                src="/images/sam-portrait-with-paddle.jpg"
                alt="Sam Morris — professional pickleball coach in Montgomery County, MD"
                fill
                sizes="(max-width: 768px) 288px, 384px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof Bar ─── */}
      <section className="bg-navy-light border-y border-white/5 py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap justify-center gap-8 md:gap-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-accent-blue text-2xl font-bold">
                {stat.value}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── EASE Framework ─── */}
      <section className="py-20 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              The <span className="text-accent-lime">EASE</span> Framework
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              A coaching methodology built on four pillars that guide everything
              we do — on the court and beyond. From beginner lessons in Rockville to
              competitive training in North Bethesda.
            </p>
          </div>
          <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EASE_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-navy-light glow-border glow-border-hover rounded-xl p-6 transition-all card-hover"
              >
                <div className="text-accent-lime font-heading font-black text-3xl mb-2">
                  {card.letter}
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-text-muted text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Programs Preview ─── */}
      <section className="bg-navy-light py-20 px-6">
        <AnimateOnScroll>
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
            Programs &amp; Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PROGRAMS.map((program) => (
              <div
                key={program.title}
                className="bg-navy glow-border glow-border-hover rounded-xl overflow-hidden transition-all flex flex-col card-hover"
              >
                <div className={`relative h-44 w-full ${program.isLogo ? "bg-[#0a1628] flex items-center justify-center" : ""}`}>
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={program.isLogo ? "object-contain p-4" : "object-cover"}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading font-bold text-xl mb-3">
                  {program.title}
                </h3>
                <p className="text-text-muted text-sm mb-6 flex-1">
                  {program.description}
                </p>
                {program.external ? (
                  <TrackedExternalLink
                    href={program.href}
                    label={program.title}
                    page="home"
                    className="text-accent-blue hover:text-accent-purple transition-colors text-sm font-semibold"
                  >
                    {program.cta} &rarr;
                  </TrackedExternalLink>
                ) : (
                  <TrackedLink
                    href={program.href}
                    className="text-accent-blue hover:text-accent-purple transition-colors text-sm font-semibold"
                    event="program_card"
                    eventProps={{ label: program.title, program: program.title, page: "home" }}
                  >
                    {program.cta} &rarr;
                  </TrackedLink>
                )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/programs"
              className="text-accent-blue hover:text-accent-purple transition-colors font-semibold"
            >
              See All Programs &rarr;
            </Link>
          </div>
        </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Lead Form ─── */}
      <section className="py-20 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl">
            <LeadForm page="home" />
          </div>
        </AnimateOnScroll>
      </section>

    </>
  );
}
