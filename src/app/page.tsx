import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { TESTIMONIALS } from "@/lib/testimonials";
import { TestimonialGrid } from "@/components/TestimonialGrid";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = {
  title:
    "Sam Morris — Pickleball Coach | Montgomery County, DC & Northern Virginia",
  description:
    "PPR-certified pickleball coach in Montgomery County, MD. Private lessons, skill evaluations, and youth academy serving Montgomery County MD, Washington DC, and Northern Virginia.",
  keywords: [
    "pickleball coach Montgomery County",
    "indoor pickleball facility near me",
    "pickleball lessons DC area",
    "pickleball coaching Northern Virginia",
    "youth pickleball academy Maryland",
    "private pickleball lessons Bethesda",
    "beginner pickleball DMV",
    "PPR certified coach Maryland",
    "Next Gen Pickleball Academy",
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
    title: "Private Lessons",
    description:
      "1-on-1 coaching tailored to your goals — video review, custom drills, and a clear path forward.",
    cta: "Book a Lesson",
    href: "/programs/coaching",
    image: "/images/coach-sam.jpeg",
    badge: "$130 / hr",
  },
  {
    title: "Free Skill Evaluation",
    description:
      "30 minutes on the court. Walk away with a DUPR-aligned rating and a personalized plan.",
    cta: "Book a Free Evaluation",
    href: "/evaluation",
    image: "/images/sam-portrait-with-paddle.jpg",
    badge: "Free for DMV",
  },
  {
    title: "Next Gen Academy",
    description:
      "Structured youth pathway for ages 5-16. Four levels — Red, Orange, Green, Yellow.",
    cta: "Explore the Academy",
    href: "/programs#academy",
    image: "/images/youth-indoor-player.jpeg",
    badge: "Ages 5-16",
  },
];

export default function Home() {
  return (
    <>
      {/* ─── Full-Bleed Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center hero-full-bleed -mt-16 pt-16 overflow-hidden">
        <Image
          src="/images/coach-sam.jpeg"
          alt="Coach Sam Morris on the court"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full py-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 animate-fade-in">
              Coach. Builder. Dad.
            </p>
            <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 animate-fade-up">
              Better than yesterday —{" "}
              <span className="gradient-text-warm">together.</span>
            </h1>
            <p className="text-text-primary/85 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              Premium pickleball coaching for adults, families, and kids in
              Montgomery County, MD. Real progress, every session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedLink
                href="/evaluation"
                className="inline-flex items-center justify-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
                eventProps={{ label: "Book a Free Evaluation", page: "home", section: "hero", destination: "/evaluation" }}
              >
                Book a Free Evaluation
              </TrackedLink>
              <TrackedLink
                href="/programs"
                className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
                eventProps={{ label: "Explore Programs", page: "home", section: "hero" }}
              >
                Explore Programs
              </TrackedLink>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 animate-fade-in">
          <span className="text-text-muted text-xs uppercase tracking-[0.2em]">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-accent-blue to-transparent" />
        </div>
      </section>

      {/* ─── Credentials Bar ─── */}
      <section className="relative bg-navy-light border-y border-white/8 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-accent-blue text-2xl md:text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <div className="text-text-muted text-[0.7rem] md:text-xs uppercase tracking-[0.18em] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── EASE Framework — photo backdrop ─── */}
      <section className="relative section-photo-backdrop py-24 px-6">
        <div className="photo-bg">
          <Image
            src="/images/indoor-play-action.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl text-center mb-14">
            <p className="eyebrow mb-3">Coaching framework</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-5 leading-tight">
              The <span className="gradient-text-warm">EASE</span> Framework
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Four pillars that guide every drill, every lesson, every player.
              From first dink in Rockville to tournament prep in North Bethesda.
            </p>
          </div>
          <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EASE_CARDS.map((card) => (
              <div
                key={card.title}
                className="glass-card p-7 group"
              >
                <div className="text-accent-blue font-heading font-black text-5xl mb-3 group-hover:scale-110 origin-left transition-transform">
                  {card.letter}
                </div>
                <h3 className="font-heading font-bold text-lg mb-2 text-text-primary">
                  {card.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Quiz CTA ─── */}
      <section className="px-6 py-16 bg-navy-light">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/quiz"
            className="glass-card-amber rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 group transition-all"
          >
            <div className="text-5xl md:text-6xl">🏓</div>
            <div className="text-center md:text-left flex-1">
              <p className="eyebrow mb-2">1-minute quiz</p>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-text-primary group-hover:text-accent-blue transition-colors">
                What&apos;s Your Pickleball Level?
              </h2>
              <p className="text-text-muted text-sm mt-1.5 max-w-lg">
                Six questions. Get a skill estimate and program recommendations tailored to your game.
              </p>
            </div>
            <span className="text-accent-blue font-semibold text-sm whitespace-nowrap group-hover:translate-x-1 transition-transform">
              Take the Quiz &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* ─── Programs Preview — photo cards ─── */}
      <section className="py-24 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">Programs &amp; Services</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                Find your <span className="gradient-text-warm">starting line.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Three clear paths into the sport. Start where you are.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROGRAMS.map((program) => (
                <TrackedLink
                  key={program.title}
                  href={program.href}
                  eventProps={{ label: program.title, page: "home", section: "program_card", destination: program.href }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-accent-blue/45 transition-all card-hover bg-navy-light min-h-[420px] flex flex-col"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-light via-navy-light/40 to-transparent" />
                    <span className="absolute top-4 left-4 brand-badge brand-badge-sm">
                      {program.badge}
                    </span>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-2xl mb-3 text-text-primary group-hover:text-accent-blue transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-6 flex-1 leading-relaxed">
                      {program.description}
                    </p>
                    <span className="text-accent-blue font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                      {program.cta} &rarr;
                    </span>
                  </div>
                </TrackedLink>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/programs"
                className="inline-flex items-center btn-outline font-semibold px-8 py-3 rounded-full text-sm"
              >
                See All Programs &rarr;
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Coach intro / pull-quote with photo ─── */}
      <section className="py-24 px-6 bg-navy-light">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glow-border">
            <Image
              src="/images/sam-action.jpeg"
              alt="Coach Sam Morris"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy/55 via-transparent to-transparent" />
          </div>
          <div>
            <p className="eyebrow mb-3">Why I coach</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl mb-6 leading-tight">
              Sport is more than a game. It&apos;s how families <span className="gradient-text-warm">grow stronger together.</span>
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-5">
              Nine years as a PE teacher. M.S. in Coaching from Ball State.
              Co-founder of Next Gen Academy. I bring the same structure that
              made gym class work for every kid — and apply it to pickleball.
            </p>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              Every drill has a purpose. Every milestone gets celebrated.
              Every lesson builds confidence on the court and resilience off it.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-accent-blue font-semibold hover:translate-x-1 transition-transform"
            >
              Read the full story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Real feedback</p>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-text-primary mb-4 leading-tight">
              What players are saying
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              From first-time beginners to 4.5+ competitors — real words from people I&apos;ve coached.
            </p>
          </div>
          <TestimonialGrid testimonials={TESTIMONIALS} limit={3} />
        </div>
      </section>

      {/* ─── Lead Form — full-width section with photo ─── */}
      <section className="relative section-photo-backdrop py-24 px-6">
        <div className="photo-bg">
          <Image
            src="/images/multi-court-outdoor.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <AnimateOnScroll>
          <div className="relative mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-3">Get in touch</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-5 leading-tight">
                Ready to get <span className="gradient-text-warm">on the court?</span>
              </h2>
              <p className="text-text-muted text-lg leading-relaxed mb-6">
                Tell me what you&apos;re working on. Whether you&apos;re brand new
                or chasing 4.5, we&apos;ll find the right starting point — usually
                a free 30-minute evaluation.
              </p>
              <ul className="space-y-3 text-text-muted">
                <li className="flex gap-3">
                  <span className="text-accent-blue font-bold mt-0.5">→</span>
                  <span>Replies within 24 hours</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-blue font-bold mt-0.5">→</span>
                  <span>I travel within ~35 min of Olney, MD</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-blue font-bold mt-0.5">→</span>
                  <span>No pressure, no sales pitch</span>
                </li>
              </ul>
            </div>
            <div>
              <LeadForm page="home" />
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
