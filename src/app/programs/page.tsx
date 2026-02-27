import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Next Gen Pickleball Academy, private lessons, and community programs in Montgomery County, MD.",
};

const ACADEMY_LEVELS = [
  {
    name: "Red Level",
    color: "#ef4444",
    subtitle: "Beginner",
    description:
      "Introduction to pickleball fundamentals. Grip, stance, basic serves, and court awareness for first-time players.",
  },
  {
    name: "Orange Level",
    color: "#f97316",
    subtitle: "Advanced Beginner",
    description:
      "Building consistency and rally skills. Dinking, return of serve, and beginning to understand positioning.",
  },
  {
    name: "Green Level",
    color: "#22c55e",
    subtitle: "Intermediate",
    description:
      "Developing strategy and shot selection. Third-shot drops, stacking, and competitive point play.",
  },
  {
    name: "Yellow Level",
    color: "#eab308",
    subtitle: "Coach-Curated Advanced",
    description:
      "Invitation-based advanced training. Tournament prep, advanced tactics, and mental game development.",
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
              Programs &amp; <span className="gradient-text">Services</span>
            </h1>
            <p className="text-text-muted text-lg md:text-xl max-w-2xl">
              Clear pathways for every player — from first-time beginners to
              competitive athletes.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden glow-border">
              <Image
                src="/images/sam-court-smile.jpg"
                alt="Sam Morris smiling on the court"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Next Gen Pickleball Academy */}
      <section id="academy" className="py-20 px-6 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Next Gen Pickleball Academy
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Structured youth pathway for ages 5-16. Four skill levels with
              clear progression.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {ACADEMY_LEVELS.map((level) => (
              <div
                key={level.name}
                className="bg-navy-light rounded-xl p-6"
                style={{ borderLeft: `4px solid ${level.color}` }}
              >
                <h3 className="font-heading font-bold text-lg mb-1">
                  {level.name}
                </h3>
                <p
                  className="text-sm font-semibold mb-3"
                  style={{ color: level.color }}
                >
                  {level.subtitle}
                </p>
                <p className="text-text-muted text-sm">{level.description}</p>
              </div>
            ))}
          </div>

          {/* Callout */}
          <div className="bg-navy-light glow-border rounded-xl p-6 text-center mb-8">
            <p className="text-text-primary font-heading font-semibold text-lg mb-1">
              Free 30-minute evaluation before placement.
            </p>
            <p className="text-text-muted text-sm">
              We&apos;ll find the perfect fit for your child.
            </p>
          </div>

          {/* External link */}
          <div className="text-center">
            <a
              href="https://www.nextgenpbacademy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:text-accent-purple transition-colors font-semibold"
            >
              Visit Next Gen Academy &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Private Lessons */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-center">
            Private Lessons
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-10 text-center">
            Personalized 1-on-1 coaching tailored to your goals and skill level
            — from brand new to 5.0.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ul className="space-y-4">
              {[
                { title: "Video Analysis", desc: "Film review with frame-by-frame breakdown of your mechanics and positioning." },
                { title: "Custom Practice Plans", desc: "Structured drills and homework tailored to your specific development areas." },
                { title: "Flexible Scheduling", desc: "Sessions available mornings, evenings, and weekends at both Rockville and North Bethesda." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="text-accent-blue mt-1 shrink-0">●</span>
                  <div>
                    <span className="font-heading font-semibold text-text-primary">{item.title}</span>
                    <p className="text-text-muted text-sm mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-navy glow-border rounded-xl p-6 flex flex-col justify-center">
              <div className="font-mono text-accent-lime text-sm uppercase tracking-wider mb-3">
                Why Private Lessons?
              </div>
              <p className="text-text-muted leading-relaxed mb-4">
                The fastest way to improve. Focused attention on your game with
                real-time feedback and a plan built around your goals.
              </p>
              <Link
                href="/contact"
                className="text-accent-blue hover:text-accent-purple transition-colors font-semibold"
              >
                Book a Lesson &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Link and Dink Community */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Link &amp; Dink
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-8">
            A community app connecting pickleball players of comparable skill
            levels. Find your game, grow your network.
          </p>
          <a
            href="https://www.linkanddink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-accent-purple transition-colors font-semibold"
          >
            Join the Community &rarr;
          </a>
        </div>
      </section>

      {/* Coaching Resources */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Coaching Resources
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Visual guides to level up your game
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { src: "/images/poster-3rd-shot.webp", title: "3rd Shot Strategy" },
              { src: "/images/poster-kitchen-line.webp", title: "Kitchen Line Ready Position" },
              { src: "/images/poster-master-rally.webp", title: "Master the Rally" },
              { src: "/images/poster-resilient-brain.webp", title: "Build a Resilient Brain" },
            ].map((poster) => (
              <div
                key={poster.title}
                className="bg-navy glow-border rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={poster.src}
                    alt={poster.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-heading font-semibold text-sm text-center">
                    {poster.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-navy-light glow-border rounded-xl p-10 text-center">
            <p className="font-heading font-bold text-xl md:text-2xl mb-6">
              Not sure which program is right for you?
            </p>
            <Link
              href="/contact"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
            >
              Book a Free Evaluation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
