import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";

const STATS = [
  { value: "20+", label: "Years Coaching" },
  { value: "2", label: "Facilities" },
  { value: "500+", label: "Players Weekly" },
  { value: "M.S.", label: "in Coaching" },
  { value: "Gold", label: "Medalist" },
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
  },
  {
    title: "Private Lessons",
    description:
      "Personalized 1-on-1 coaching tailored to your goals and skill level.",
    cta: "Get Started",
    href: "/contact",
    external: false,
  },
  {
    title: "Link & Dink",
    description:
      "Community app connecting players of comparable skill levels.",
    cta: "Join Community",
    href: "https://www.linkanddink.com",
    external: true,
  },
];

export default function Home() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-heading font-black text-5xl md:text-7xl leading-tight mb-6">
            Better than yesterday —{" "}
            <span className="gradient-text">together.</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            I help families grow through sport. Coach. Builder. Dad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="text-white font-heading font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              }}
            >
              Book a Free Evaluation
            </Link>
            <Link
              href="/programs"
              className="border border-white/20 text-text-primary font-heading font-semibold px-8 py-3 rounded-lg hover:border-white/40 transition-colors"
            >
              Explore Programs
            </Link>
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
        <div className="mx-auto max-w-6xl text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            The <span className="text-accent-lime">EASE</span> Framework
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            A coaching methodology built on four pillars that guide everything
            we do — on the court and beyond.
          </p>
        </div>
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EASE_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-navy-light glow-border glow-border-hover rounded-xl p-6 transition-all"
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
      </section>

      {/* ─── Programs Preview ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
            Programs &amp; Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PROGRAMS.map((program) => (
              <div
                key={program.title}
                className="bg-navy glow-border glow-border-hover rounded-xl p-6 transition-all flex flex-col"
              >
                <h3 className="font-heading font-bold text-xl mb-3">
                  {program.title}
                </h3>
                <p className="text-text-muted text-sm mb-6 flex-1">
                  {program.description}
                </p>
                {program.external ? (
                  <a
                    href={program.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:text-accent-purple transition-colors text-sm font-semibold"
                  >
                    {program.cta} &rarr;
                  </a>
                ) : (
                  <Link
                    href={program.href}
                    className="text-accent-blue hover:text-accent-purple transition-colors text-sm font-semibold"
                  >
                    {program.cta} &rarr;
                  </Link>
                )}
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
      </section>

      {/* ─── Lead Form ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <LeadForm />
        </div>
      </section>

      {/* ─── Blog Placeholder ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            From the Blog
          </h2>
          <p className="text-text-muted mb-8 max-w-2xl mx-auto">
            Thoughts on coaching, parenting, entrepreneurship, and leadership.
          </p>
          <Link
            href="/blog"
            className="text-accent-blue hover:text-accent-purple transition-colors font-semibold"
          >
            Read All Posts &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
