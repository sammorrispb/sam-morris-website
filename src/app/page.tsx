import Link from "next/link";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { getAllPosts } from "@/lib/blog";

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
    href: "https://www.linkanddink.com",
    external: true,
    image: "/images/link-and-dink-logo.svg",
    isLogo: true,
  },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

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
              I help families grow through sport. Coach. Builder. Dad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/contact"
                className="text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
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
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden glow-border">
              <Image
                src="/images/sam-portrait-with-paddle.jpg"
                alt="Sam Morris holding a paddle"
                fill
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
              we do — on the court and beyond.
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
            <LeadForm />
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Latest Blog Posts ─── */}
      <section className="py-20 px-4 bg-navy-light">
        <AnimateOnScroll>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-center mb-4">
            From the Blog
          </h2>
          <p className="text-text-muted text-center mb-12">
            Thoughts on coaching, parenting, entrepreneurship, and leadership.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-navy glow-border glow-border-hover rounded-xl p-6 transition-all card-hover"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
                    {post.category}
                  </span>
                  <span className="text-text-muted text-xs">{post.readingTime}</span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-text-muted text-sm">{post.excerpt}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="text-accent-blue hover:text-accent-purple transition-colors text-sm font-medium"
            >
              Read All Posts &rarr;
            </Link>
          </div>
        </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
