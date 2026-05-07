import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SINGLE_LESSON_LINK, FOUR_PACK_LINK } from "@/lib/coaching";
import { TrackedLink } from "@/components/TrackedLink";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Pickleball Programs & Lessons — Youth Academy, Private Coaching, Family Sessions",
  description:
    "Pickleball programs for all ages in Montgomery County, MD. Next Gen Academy for kids 5-16, private lessons for adults, and family coaching.",
  alternates: {
    canonical: "https://www.sammorrispb.com/programs",
  },
  openGraph: {
    title: "Pickleball Programs in Montgomery County, MD — Kids, Adults & Families",
    description:
      "Youth pickleball academy (ages 5-16), private lessons, and family coaching in Montgomery County, MD.",
    url: "https://www.sammorrispb.com/programs",
    images: [
      {
        url: "/og?title=Programs%20%26%20Services&subtitle=Coaching%20%C2%B7%20Youth%20Academy%20%C2%B7%20Skill%20Evaluation",
        width: 1200,
        height: 630,
        alt: "Pickleball Programs & Services — Sam Morris",
      },
    ],
  },
};

const ACADEMY_LEVELS = [
  {
    name: "Red",
    color: "#ef4444",
    subtitle: "Beginner",
    description:
      "Introduction to fundamentals. Grip, stance, basic serves, and court awareness for first-time players.",
  },
  {
    name: "Orange",
    color: "#f97316",
    subtitle: "Advanced Beginner",
    description:
      "Building consistency and rally skills. Dinking, return of serve, and beginning to understand positioning.",
  },
  {
    name: "Green",
    color: "#A5C49C",
    subtitle: "Intermediate",
    description:
      "Strategy and shot selection. Third-shot drops, stacking, and competitive point play.",
  },
  {
    name: "Yellow",
    color: "#E8A03A",
    subtitle: "Coach-Curated Advanced",
    description:
      "Invitation-based advanced training. Tournament prep, advanced tactics, and mental game development.",
  },
];

const POSTERS = [
  { src: "/images/poster-3rd-shot.webp", title: "3rd Shot Strategy" },
  { src: "/images/poster-kitchen-line.webp", title: "Kitchen Line Ready Position" },
  { src: "/images/poster-master-rally.webp", title: "Master the Rally" },
  { src: "/images/poster-resilient-brain.webp", title: "Build a Resilient Brain" },
];

export default function ProgramsPage() {
  return (
    <>
      {/* ─── Full-Bleed Hero ─── */}
      <section className="relative min-h-[70vh] flex items-end hero-full-bleed -mt-16 pt-16 overflow-hidden">
        <Image
          src="/images/outdoor-action-shot.jpeg"
          alt="Pickleball in action"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pb-20 pt-32">
          <p className="eyebrow mb-4">Programs &amp; Services</p>
          <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 max-w-4xl">
            Find your <span className="gradient-text-warm">starting line.</span>
          </h1>
          <p className="text-text-primary/85 text-lg md:text-xl max-w-2xl leading-relaxed">
            Clear pathways for every player — from first-time beginners to
            tournament-ready competitors. Serving Montgomery County, MD.
          </p>
        </div>
      </section>

      {/* ─── Three quick paths ─── */}
      <section className="py-20 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                badge: "Free for DMV",
                title: "Skill Evaluation",
                desc: "30-minute on-court read on your level + a written plan.",
                href: "/evaluation",
                cta: "Book Free Eval",
                image: "/images/sam-portrait-with-paddle.jpg",
              },
              {
                badge: "Adults · 1-on-1",
                title: "Private Coaching",
                desc: "Video review, custom drills, single sessions or 4-packs.",
                href: "/programs/coaching",
                cta: "Coaching Details",
                image: "/images/coach-sam.jpeg",
              },
              {
                badge: "Ages 5-16",
                title: "Youth Academy",
                desc: "Red → Yellow pathway with structured progression.",
                href: "#academy",
                cta: "See Academy",
                image: "/images/youth-indoor-player.jpeg",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-accent-blue/45 transition-all card-hover bg-navy-light min-h-[380px] flex flex-col"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-light via-navy-light/40 to-transparent" />
                  <span className="absolute top-4 left-4 brand-badge brand-badge-sm">
                    {card.badge}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-accent-blue transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-text-muted text-sm flex-1 leading-relaxed">{card.desc}</p>
                  <span className="text-accent-blue font-semibold text-sm mt-4 group-hover:translate-x-1 transition-transform inline-flex items-center">
                    {card.cta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Next Gen Academy ─── */}
      <section
        id="academy"
        className="relative section-photo-backdrop py-24 px-6 scroll-mt-20"
      >
        <div className="photo-bg">
          <Image
            src="/images/youth-indoor-player-2.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">Youth pathway · Ages 5-16</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-5 leading-tight">
                Next Gen <span className="gradient-text-warm">Pickleball Academy.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Four levels with a clear progression from beginner to advanced.
                Free evaluation before placement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {ACADEMY_LEVELS.map((level) => (
                <div
                  key={level.name}
                  className="glass-card p-7"
                  style={{
                    borderLeft: `3px solid ${level.color}`,
                  }}
                >
                  <div
                    className="font-mono text-xs uppercase tracking-[0.18em] mb-2"
                    style={{ color: level.color }}
                  >
                    {level.subtitle}
                  </div>
                  <h3 className="font-heading font-black text-2xl mb-3">
                    {level.name}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">{level.description}</p>
                </div>
              ))}
            </div>

            <div className="glass-card-amber rounded-2xl p-8 text-center max-w-3xl mx-auto">
              <p className="text-text-primary font-heading font-bold text-xl mb-2">
                Free 30-minute evaluation before placement.
              </p>
              <p className="text-text-muted text-sm mb-6">
                We&apos;ll find the perfect fit for your child.
              </p>
              <a
                href="https://www.nextgenpbacademy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-heading font-semibold px-7 py-3 rounded-full btn-gradient text-sm"
              >
                Visit Next Gen Academy →
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Private Lessons ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <p className="eyebrow mb-3">Adults · 1-on-1</p>
                <h2 className="font-heading font-black text-4xl md:text-5xl mb-5 leading-tight">
                  Private <span className="gradient-text-warm">Lessons.</span>
                </h2>
                <p className="text-text-muted text-lg leading-relaxed mb-6">
                  Personalized 1-on-1 coaching for adults and families across
                  Montgomery County, MD — tailored to your goals and skill
                  level, from brand new to 5.0.
                </p>
                <ul className="space-y-3">
                  {[
                    { title: "Video Analysis", desc: "Frame-by-frame breakdown of mechanics and positioning." },
                    { title: "Custom Practice Plans", desc: "Structured drills and homework for your specific gaps." },
                    { title: "Flexible Scheduling", desc: "Mornings, evenings, weekends — across MoCo." },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="text-accent-blue mt-1 shrink-0 font-bold">→</span>
                      <div>
                        <span className="font-heading font-semibold text-text-primary">{item.title}</span>
                        <p className="text-text-muted text-sm mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="card-warm p-7">
                  <div className="font-heading font-bold text-lg text-text-primary mb-1">
                    Single Lesson
                  </div>
                  <p className="text-text-muted text-sm mb-5">
                    60-minute 1-on-1 with video analysis and a custom practice plan.
                  </p>
                  <div className="font-heading font-black text-4xl text-text-primary mb-5">
                    $130
                  </div>
                  <a
                    href={SINGLE_LESSON_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center font-heading font-semibold px-6 py-3 rounded-full btn-gradient text-sm"
                  >
                    Book a Lesson
                  </a>
                </div>

                <div className="glass-card-amber rounded-2xl p-7">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="font-heading font-bold text-lg text-text-primary">
                      4-Hour Package
                    </div>
                    <span className="brand-badge brand-badge-sm">Save $120</span>
                  </div>
                  <p className="text-text-muted text-sm mb-1">
                    Four 60-minute sessions — commit to real improvement.
                  </p>
                  <p className="text-accent-lime text-sm font-semibold mb-4">
                    $100 per session
                  </p>
                  <div className="font-heading font-black text-4xl text-text-primary mb-5">
                    $400
                  </div>
                  <a
                    href={FOUR_PACK_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center font-heading font-semibold px-6 py-3 rounded-full btn-gradient text-sm"
                  >
                    Buy Package
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center pt-4">
              <Link
                href="/programs/coaching"
                className="inline-flex items-center btn-outline font-semibold px-7 py-3 rounded-full text-sm"
              >
                See full coaching menu (group + 3+1) →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Coaching Resources ─── */}
      <section className="py-24 px-6 bg-navy-light">
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">Resources</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                Visual <span className="gradient-text-warm">cheat sheets.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Print these. Take them to the court. Level up.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {POSTERS.map((poster) => (
                <div
                  key={poster.title}
                  className="card-warm overflow-hidden card-hover"
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={poster.src}
                      alt={poster.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-semibold text-sm text-center">
                      {poster.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="relative py-24 px-6 hero-spotlight overflow-hidden">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading font-black text-3xl md:text-5xl mb-5 leading-tight">
            Not sure which program is right? Let&apos;s <span className="gradient-text-warm">figure it out.</span>
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            30-minute evaluation, free for every DMV player. You&apos;ll leave with
            a rating and a plan.
          </p>
          <TrackedLink
            href="/evaluation"
            className="inline-flex items-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
            eventProps={{
              label: "Book a Free Evaluation",
              page: "programs",
              section: "footer_cta",
              destination: "/evaluation",
            }}
          >
            Book a Free Evaluation →
          </TrackedLink>
        </div>
      </section>
    </>
  );
}
